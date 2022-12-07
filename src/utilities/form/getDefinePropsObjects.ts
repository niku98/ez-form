import {
	FormInstance,
	FormItemInstance,
	FormItemValueTransformer,
	FormListInstance,
	NamePath,
	Rule,
	Rules,
	ValidateMessages,
	ValidateTrigger,
} from "@/models";
import type { PropType } from "vue";

export const getFormDefinePropsObject = () => {
	return {
		name: {
			required: false,
			type: String as PropType<string>,
		},
		form: {
			required: false,
			type: Object as PropType<FormInstance>,
		},
		initialValues: {
			required: false,
			type: Object as PropType<Record<string, any>>,
		},
		enableReinitialize: {
			required: false,
			type: Boolean as PropType<boolean>,
		},
		rules: {
			required: false,
			type: Object as PropType<Rules>,
		},
		validateTrigger: {
			required: false,
			type: [String, Array] as PropType<ValidateTrigger | ValidateTrigger[]>,
		},
		validateMessages: {
			required: false,
			type: Object as PropType<ValidateMessages>,
		},
		classPrefix: {
			required: false,
			type: String as PropType<string>,
			default: "ez",
		},
		preserveValues: {
			required: false,
			type: Boolean as PropType<boolean>,
			default: true,
		},
	} as const;
};

export const getFormItemDefinePropsObject = () => {
	return {
		label: {
			required: false,
			type: String as PropType<string>,
		},
		name: {
			required: false,
			type: [String, Array] as PropType<NamePath>,
		},
		formItem: {
			required: false,
			type: Object as PropType<FormItemInstance>,
		},
		defaultValue: {
			required: false,
		},
		valuePropName: {
			required: false,
			type: String as PropType<string>,
			default: "value",
		},
		changeEventPropName: {
			required: false,
			type: String as PropType<string>,
		},
		blurEventPropName: {
			required: false,
			type: String as PropType<string>,
			default: "blur",
		},
		getValueFromChangeEvent: {
			required: false,
			type: Function as PropType<(event: any) => any>,
			default: (event: any) => {
				if (event?.target) {
					return event.target.value ?? event.target.checked;
				}

				return event;
			},
		},
		valueTransformer: {
			required: false,
			type: Object as PropType<FormItemValueTransformer>,
			default: () => ({
				in: (value: any) => value,
				out: (value: any) => value,
			}),
		},
		autoBinding: {
			required: false,
			type: Boolean as PropType<boolean>,
			default: true,
		},
		inputNodeIndex: {
			required: false,
			type: Number as PropType<number>,
			default: 0,
		},
		rules: {
			required: false,
			type: [Object, Array] as PropType<Rule>,
		},
		requiredMark: {
			required: false,
			type: [String, Boolean] as PropType<string | boolean>,
			default: true,
		},
		validateTrigger: {
			required: false,
			type: [String, Array] as PropType<ValidateTrigger | ValidateTrigger[]>,
			default: "change",
		},
		validateFirst: {
			required: false,
			type: Boolean as PropType<boolean>,
		},
		noStyle: {
			required: false,
			type: Boolean as PropType<boolean>,
		},
		colon: {
			required: false,
			type: Boolean as PropType<boolean>,
		},
	} as const;
};

export const getFormListDefinePropsObject = () => {
	return {
		label: {
			required: false,
			type: String as PropType<string>,
		},
		name: {
			type: [String, Array] as PropType<NamePath>,
			required: true,
		},
		formList: {
			required: false,
			type: Object as PropType<FormListInstance>,
		},
		defaultValue: {
			required: false,
			type: Array as PropType<any[]>,
		},
		valuePropName: {
			required: false,
			type: String as PropType<string>,
			default: "value",
		},
		changeEventPropName: {
			required: false,
			type: String as PropType<string>,
		},
		blurEventPropName: {
			required: false,
			type: String as PropType<string>,
			default: "blur",
		},
		getValueFromChangeEvent: {
			required: false,
			type: Function as PropType<(event: any) => any>,
			default: (event: any) => {
				if (event?.target) {
					return event.target.value ?? event.target.checked;
				}

				return event;
			},
		},
		valueTransformer: {
			required: false,
			type: Object as PropType<FormItemValueTransformer>,
			default: () => ({
				in: (value: any) => value,
				out: (value: any) => value,
			}),
		},
		autoBinding: {
			required: false,
			type: Boolean as PropType<boolean>,
			default: true,
		},
		rules: {
			required: false,
			type: [Object, Array] as PropType<Rule>,
		},
		requiredMark: {
			required: false,
			type: [String, Boolean] as PropType<string | boolean>,
			default: true,
		},
		validateTrigger: {
			required: false,
			type: [String, Array] as PropType<ValidateTrigger | ValidateTrigger[]>,
			default: "change",
		},
		validateFirst: {
			required: false,
			type: Boolean as PropType<boolean>,
		},
		noStyle: {
			required: false,
			type: Boolean as PropType<boolean>,
		},
	} as const;
};
