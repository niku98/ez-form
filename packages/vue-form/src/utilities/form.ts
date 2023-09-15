import type {
	FormInstance,
	GetKeys,
	ValidateError,
	ValidateTrigger,
	ValidationSchema,
} from "@niku/ez-form-core";
import type { PropType } from "vue";

export function formProps<Values>(defaultForm?: FormInstance<Values>) {
	return {
		form: {
			type: Object as PropType<FormInstance>,
			required: false,
			default: defaultForm,
		},
		name: {
			type: String,
			required: false,
		},
		initialValues: {
			type: Object as PropType<Values>,
			required: false,
		},
		enableReinitialize: {
			type: Boolean,
			required: false,
		},
		validationSchema: {
			type: Object as PropType<ValidationSchema<GetKeys<Values>>>,
			required: false,
		},
		validateTrigger: {
			type: [String, Array] as PropType<ValidateTrigger | ValidateTrigger[]>,
			required: false,
		},
		validateMessages: {
			type: Object,
			required: false,
		},
		// preserveValues: {
		// 	type: Boolean,
		// 	required: false,
		// },
		onValuesChange: {
			type: Function as PropType<(values: Values, oldValues: Values) => void>,
			required: false,
		},
		onReset: {
			type: Function as PropType<() => void>,
			required: false,
		},
		onSubmit: {
			type: Function as PropType<(values: Values) => void>,
			required: false,
		},
		onError: {
			type: Function as PropType<(errors: ValidateError[]) => void>,
			required: false,
		},
		onValidate: {
			type: Function as PropType<() => void>,
			required: false,
		},
	};
}

export function formPropsArray() {
	return [
		"form",
		"name",
		"initialValues",
		"enableReinitialize",
		"validationSchema",
		"validateTrigger",
		"validateMessages",
		"preserveValues",
		"onValuesChange",
		"onReset",
		"onSubmit",
		"onError",
		"onValidate",
	] as const;
}
