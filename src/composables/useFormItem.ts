import useInjectForm from "@/composables/useInjectForm";
import useEzFormPluginOptions from "@/composables/usePluginOptions";
import type {
	FieldMeta,
	FormInstance,
	FormItemInstance,
	FormItemProps,
	ValidateOption,
} from "@/models";
import { castPath, castToArray, clone, get, uniqueId } from "@/utilities";
import ValidationSchema from "async-validator";
import {
	computed,
	nextTick,
	onBeforeMount,
	onBeforeUnmount,
	reactive,
	Ref,
	ref,
} from "vue";

export default function useFormItem<
	F extends FormInstance | undefined = undefined
>(
	props: F extends FormInstance
		? FormItemProps & { name: string }
		: FormItemProps,
	form?: FormInstance | F
): FormItemInstance {
	let injectedForm = form ?? useInjectForm();

	const internalValue: Ref<any> = ref<any>(undefined);
	const uniqId = uniqueId();

	const fieldMeta = reactive<FieldMeta>({
		get rawValue() {
			return props.name
				? get(injectedForm.meta.values, props.name)
				: internalValue.value;
		},
		set rawValue(newValue: any) {
			this.dirty = true;
			this.touched = true;

			if (props.name && injectedForm) {
				injectedForm.setFieldValue(props.name, newValue);
			} else {
				internalValue.value = newValue;
			}
		},

		get transformedValue() {
			return props.valueTransformer
				? props.valueTransformer.in(this.rawValue, injectedForm)
				: this.rawValue;
		},
		set transformedValue(newValue: any) {
			this.rawValue = props.valueTransformer
				? props.valueTransformer.out(newValue, injectedForm)
				: newValue;
		},

		get name() {
			return props.name;
		},
		dirty: false,
		touched: false,
		get id() {
			return props.name
				? `${injectedForm.meta.name}_${castPath(props.name).join("_")}`
				: `${injectedForm.meta.name}_${uniqId}`;
		},
	});

	function resetFieldMeta() {
		fieldMeta.dirty = false;
		fieldMeta.touched = false;
		fieldMeta.error = undefined;
		if (props.defaultValue !== undefined) {
			fieldMeta.rawValue = clone(props.defaultValue);
		}
	}

	// Handle validate
	const validateTrigger = computed(() =>
		castToArray(
			props.validateTrigger ?? "change",
			castToArray(injectedForm.validateTrigger)
		)
	);
	const mergedRules = computed(() => {
		const internalRules = castToArray(props.rules);

		if (!props.name) {
			return internalRules;
		}

		const formRules = injectedForm.rules;
		const name = castPath(props.name).join(".");
		const externalRules = formRules?.[name];
		const rules = castToArray(externalRules);

		return internalRules.concat(rules);
	});

	function clearValidate() {
		fieldMeta.error = undefined;
	}

	async function validate(options?: ValidateOption) {
		const rules = options?.trigger
			? mergedRules.value.filter((rule) =>
					rule.trigger ? rule.trigger === options.trigger : true
			  )
			: mergedRules.value;

		if (rules.length === 0) {
			return Promise.resolve();
		}

		const validationKey = props.label
			? props.label
			: props.name
			? castPath(props.name).pop() ?? uniqueId()
			: uniqueId();

		const validationSchema = new ValidationSchema({
			[validationKey]: rules,
		});

		if (injectedForm.validateMessages) {
			validationSchema.messages(injectedForm.validateMessages);
		}

		return new Promise<any>((resolve, reject) => {
			validationSchema.validate(
				{ [validationKey]: fieldMeta.rawValue },
				{ first: props.validateFirst ?? false },
				(errorList) => {
					if (errorList === null || errorList.length === 0) {
						clearValidate();
						resolve(fieldMeta.rawValue);
					} else {
						fieldMeta.error = {
							name: props.name ?? [],
							messages: errorList.map(({ message }) => message ?? ""),
						};
						reject(clone(fieldMeta.error));
					}
				}
			);
		});
	}

	// Handle events
	function getValueFromChangeEvent(event: any) {
		if (event instanceof Event && event.target) {
			return (
				(event.target as HTMLInputElement).value ??
				(event.target as HTMLInputElement).checked
			);
		}

		return event;
	}

	function handleChange(event: any) {
		// Get value from input and set to inputValue, rawValue will be set automatically
		fieldMeta.transformedValue = props.getValueFromChangeEvent
			? props.getValueFromChangeEvent(event)
			: getValueFromChangeEvent(event);

		if (validateTrigger.value.includes("change")) {
			nextTick(() => {
				validate({ trigger: "change" }).catch(() => {});
			});
		}
	}

	function handleBlur() {
		fieldMeta.touched = true;
		if (validateTrigger.value.includes("blur")) {
			validate({ trigger: "blur" }).catch(() => {});
		}
	}

	onBeforeMount(() => {
		if (props.defaultValue !== undefined && fieldMeta.rawValue === undefined) {
			fieldMeta.rawValue = clone(props.defaultValue);
		}
	});

	// Handle add form field
	function getFormFieldObject() {
		return {
			name: computed(() => props.name ?? []),
			id: computed(() => fieldMeta.id),
			value: computed(() => fieldMeta.rawValue),
			validate,
			clearValidate,
			reset: resetFieldMeta,
			get defaultValue() {
				return props.defaultValue;
			},
			error: computed(() => fieldMeta.error),
			dirty: computed(() => fieldMeta.dirty),
			markAsDirty() {
				fieldMeta.dirty = true;
				fieldMeta.touched = true;
			},
		};
	}

	function registerFormField(formInstance: FormInstance) {
		formInstance.addField(getFormFieldObject());

		injectedForm = formInstance;
	}

	registerFormField(injectedForm);
	onBeforeUnmount(() => {
		props.name && injectedForm.removeField(props.name);
	});

	// Handle require mark
	const pluginOptions = useEzFormPluginOptions();
	const requiredMarkString = computed(() => {
		const needRequiredMark = mergedRules.value.some((rule) => rule.required);
		if (!needRequiredMark) {
			return "";
		}

		const markString = pluginOptions?.requiredMark ?? "*";

		switch (typeof props.requiredMark) {
			case "boolean":
				return props.requiredMark ? `'${markString}'` : "";
			case "string":
				return `'${props.requiredMark}'`;
			default:
				return `'${markString}'`;
		}
	});

	return {
		meta: fieldMeta,
		requiredMarkString,
		registerFormField,
		handleChange,
		handleBlur,
		validate,
	} as FormItemInstance;
}
