import useInjectPrivateForm from "@/composables/useInjectPrivateForm";
import useEzFormPluginOptions from "@/composables/usePluginOptions";
import {
	FieldMeta,
	FormInstance,
	FormItemInstance,
	FormItemProps,
	ValidateOption,
} from "@/models";
import { PrivateFormInstance } from "@/models/PrivateInstances";
import {
	castNamePathToString,
	castPath,
	castToArray,
	clone,
	get,
	uniqueId,
} from "@/utilities";
import ValidationSchema from "async-validator";
import { NamePath } from "dist";
import {
	computed,
	isReactive,
	nextTick,
	onBeforeMount,
	reactive,
	ref,
	Ref,
	shallowReactive,
	toRaw,
	watch,
} from "vue";

export default function useFormFieldHelpers(inputProps?: FormItemProps) {
	let injectedForm = useInjectPrivateForm();
	const internalValue: Ref<any> = ref<any>(undefined);
	const uniqId = uniqueId();

	// Handle props
	const props = shallowReactive(inputProps ? toRaw(inputProps) : {});

	function updateProps(newProps: Partial<FormItemProps>) {
		Object.assign(props, {
			...newProps,
		});
	}

	if (inputProps && isReactive(inputProps)) {
		watch(inputProps, () => {
			updateProps({
				...inputProps,
			});
		});
	}

	const fieldMeta = reactive<FieldMeta>({
		get rawValue() {
			if (injectedForm.__IS_FAKE__ || !props.name) {
				return internalValue.value;
			}

			return props.name
				? get(injectedForm.meta.values, props.name)
				: internalValue.value;
		},
		set rawValue(newValue: any) {
			this.dirty = true;
			this.touched = true;

			if (injectedForm.__IS_FAKE__ || !props.name) {
				internalValue.value = newValue;
				return;
			}

			if (props.name) {
				injectedForm.setFieldValue(props.name, newValue);
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
				? `${this.formName}_${castPath(props.name).join("_")}`
				: `${this.formName}_${uniqId}`;
		},
		get formName() {
			return injectedForm.meta.name;
		},
	});

	function resetFieldMeta() {
		fieldMeta.dirty = false;
		fieldMeta.touched = false;
		fieldMeta.error = undefined;
		if (injectedForm.__IS_FAKE__ || !props.name) {
			fieldMeta.rawValue = clone(props.defaultValue);
		} else if (props.name) {
			fieldMeta.rawValue = get(injectedForm.initialValues, props.name);
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
		const name = castNamePathToString(props.name);
		const externalRules = formRules?.[name];
		const rules = castToArray(externalRules);

		return internalRules.concat(rules);
	});

	function clearValidate() {
		fieldMeta.error = undefined;
	}

	async function validate(
		options?: ValidateOption
	): ReturnType<FormItemInstance["validate"]> {
		const rules = options?.trigger
			? mergedRules.value.filter((rule) =>
					rule.trigger ? rule.trigger === options.trigger : true
			  )
			: mergedRules.value;

		if (rules.length === 0) {
			return Promise.resolve({ value: clone(fieldMeta.rawValue) });
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

		return new Promise((resolve) => {
			validationSchema.validate(
				{ [validationKey]: fieldMeta.rawValue },
				{ first: props.validateFirst ?? false },
				(errorList) => {
					if (errorList === null || errorList.length === 0) {
						clearValidate();
						resolve({ value: fieldMeta.rawValue });
					} else {
						fieldMeta.error = {
							name: props.name ?? [],
							messages: errorList.map(({ message }) => message ?? ""),
						};
						resolve({ error: clone(fieldMeta.error) });
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

	function registerFormField(formInstance?: FormInstance) {
		if (formInstance) {
			formInstance.addField(getFormFieldObject());
			injectedForm = formInstance as PrivateFormInstance;
		} else {
			injectedForm.addField(getFormFieldObject());
		}
	}

	function unRegisterFormField(oldName?: NamePath) {
		props.name && injectedForm.removeField(props.name);
		oldName && injectedForm.removeField(oldName);
	}

	return {
		fieldMeta,
		requiredMarkString,
		registerFormField,
		unRegisterFormField,
		handleChange,
		handleBlur,
		validate,
		resetFieldMeta,
		clearValidate,
		updateProps,
		props,
		get injectedForm() {
			return injectedForm;
		},
		getFormFieldObject,
	};
}
