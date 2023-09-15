import type {
	FieldAsyncValidatorSchema,
	GetKeys,
	ValidateTrigger,
} from "@niku/ez-form-core";
import type { PropType } from "vue";

export type FieldNameProps<
	ParentValue,
	N = GetKeys<ParentValue>
> = ParentValue extends any[]
	? { index: number; name?: N }
	: { index?: number; name: N };

export function fieldProps<FieldValue, FormValues>(namePrefix?: string) {
	return {
		name: {
			type: String as unknown as PropType<GetKeys<FormValues>>,
			required: true,
		},
		namePrefix: {
			type: String,
			required: false,
			default: namePrefix,
		},
		index: {
			type: Number,
			required: false,
		},
		inputIndex: {
			type: Number,
			required: false,
		},
		label: {
			type: String,
			required: false,
		},
		initialValue: {
			type: Object as PropType<FieldValue>,
			required: false,
		},
		validateTrigger: {
			type: [String, Array] as PropType<ValidateTrigger | ValidateTrigger[]>,
			required: false,
		},
		validationSchema: {
			type: Object as PropType<FieldAsyncValidatorSchema>,
			required: false,
		},
		validateFirst: {
			type: Boolean,
			required: false,
		},
		// preserveValue: {
		// 	type: Boolean,
		// 	required: false,
		// },
		onChange: {
			type: Function as PropType<(value: FieldValue) => void>,
			required: false,
		},
		onBlur: {
			type: Function as PropType<(event: any) => void>,
			required: false,
		},
		valuePropName: {
			type: String,
			default: "value",
		},
		onChangePropName: {
			type: String,
			required: false,
		},
		onBlurPropName: {
			type: String,
			default: "onBlur",
		},
	};
}

export function fieldArrayProps<FieldValue, FormValues>(namePrefix?: string) {
	return {
		name: {
			type: String as unknown as PropType<GetKeys<FormValues>>,
			required: true,
		},
		namePrefix: {
			type: String,
			required: false,
			default: namePrefix,
		},
		index: {
			type: Number,
			required: false,
		},
		label: {
			type: String,
			required: false,
		},
		initialValue: {
			type: Object as PropType<FieldValue>,
			required: false,
		},
		validateTrigger: {
			type: [String, Array] as PropType<ValidateTrigger | ValidateTrigger[]>,
			required: false,
		},
		validationSchema: {
			type: Object as PropType<FieldAsyncValidatorSchema>,
			required: false,
		},
		validateFirst: {
			type: Boolean,
			required: false,
		},
		// preserveValue: {
		// 	type: Boolean,
		// 	required: false,
		// },
		onChange: {
			type: Function as PropType<(value: FieldValue) => void>,
			required: false,
		},
		onBlur: {
			type: Function as PropType<(event: any) => void>,
			required: false,
		},
	};
}
