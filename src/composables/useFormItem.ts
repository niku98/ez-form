import {
	$formInjectKey,
	FormInjectedValues,
	FormItemProps,
	ValidateError,
	ValidateOption,
} from "@/models";
import { castPath, castToArray, clone, get, uniqueId } from "@/utilities";
import ValidationSchema from "async-validator";
import {
	computed,
	inject,
	nextTick,
	onBeforeMount,
	onBeforeUnmount,
	ref,
	toRaw,
	watch,
} from "vue";

type WithRequiredProperty<T, Keys extends keyof T> = T & {
	[P in Keys]-?: T[P];
};

export default function useFormItem(
	props: WithRequiredProperty<
		FormItemProps,
		"valueTransformer" | "getValueFromChangeEvent"
	>,
	emit: {
		(event: "change", value: any, form: FormInjectedValues): void;
	}
) {
	function useForm() {
		const injected = inject<FormInjectedValues>($formInjectKey);

		if (!injected) {
			throw new Error("FormItem must be used in Form");
		}

		return injected;
	}

	const injectedForm = useForm();

	const formItemId = computed(() =>
		props.name ? `${uniqueId()}_${castPath(props.name).join("_")}` : ""
	);

	/**
	 * Raw value get from form
	 */
	const rawValue = computed({
		get() {
			return props.name ? get(injectedForm.values, props.name) : undefined;
		},
		set(newValue: any) {
			props.name && injectedForm.setFieldValue(props.name, newValue);
		},
	});

	/**
	 * Value will be passed to input
	 */
	const inputValue = computed({
		get() {
			return props.valueTransformer.in(rawValue.value, injectedForm);
		},

		set(newValue: any) {
			rawValue.value = props.valueTransformer.out(newValue, injectedForm);
		},
	});
	const updateEventName = computed(
		() => props.changeEventPropName ?? `update:${props.valuePropName}`
	);

	// Handle validate
	const validateTrigger = computed(() =>
		castToArray(
			props.validateTrigger,
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
	const error = ref<ValidateError>();

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
				{ [validationKey]: rawValue.value },
				{ first: props.validateFirst ?? false },
				(errorList) => {
					if (errorList === null || errorList.length === 0) {
						clearValidate();
						resolve(rawValue.value);
					} else {
						error.value = {
							name: props.name ?? [],
							messages: errorList.map(({ message }) => message ?? ""),
						};
						reject(clone(error.value));
					}
				}
			);
		});
	}

	function clearValidate() {
		error.value = undefined;
	}

	// Handle events
	function handleChange(event: any) {
		// Get value from input and set to inputValue, rawValue will be set automatically
		inputValue.value = props.getValueFromChangeEvent(event);

		if (validateTrigger.value.includes("change")) {
			nextTick(() => {
				validate({ trigger: "change" }).catch(() => {});
			});
		}
	}

	function handleBlur() {
		if (validateTrigger.value.includes("blur")) {
			validate({ trigger: "blur" }).catch(() => {});
		}
	}

	watch(rawValue, () => {
		emit("change", rawValue.value, injectedForm);
	});

	onBeforeMount(() => {
		if (props.defaultValue !== undefined && rawValue.value === undefined) {
			rawValue.value = clone(toRaw(props.defaultValue));
		}
	});

	// Handle add form field
	injectedForm.addField({
		name: computed(() => props.name ?? []),
		id: formItemId,
		value: computed(() => rawValue.value),
		validate,
		clearValidate,
		error: computed(() => error.value),
	});

	onBeforeUnmount(() => {
		props.name && injectedForm.removeField(props.name);
	});

	// Handle require mark
	const requiredMarkString = computed(() => {
		const needRequiredMark = mergedRules.value.some((rule) => rule.required);
		if (!needRequiredMark) {
			return "";
		}

		switch (typeof props.requiredMark) {
			case "boolean":
				return props.requiredMark ? "'*'" : "";
			case "string":
				return `'${props.requiredMark}'`;
			default:
				return "'*'";
		}
	});

	return {
		formItemId,
		requiredMarkString,
		rawValue,
		inputValue,
		updateEventName,
		error,
		injectedForm,
		handleChange,
		handleBlur,
		validate,
	};
}
