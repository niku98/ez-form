import { NamePath } from "@/models/Base";
import { FormInstance } from "@/models/Form";
import {
	Rule,
	ValidateError,
	ValidateOption,
	ValidateTrigger,
} from "@/models/Validation";
import { ComputedRef } from "vue";

export interface FieldMeta {
	/**
	 * Raw value before being transformed
	 */
	rawValue: any;
	/**
	 * Value after being transformed by valueTransformer()
	 */
	transformedValue: any;

	error?: ValidateError;
	dirty: boolean;
	touched: boolean;
	name?: NamePath;
	id: string;
	formName: string;
}

export interface FormItemValueTransformer<In = any, Out = any> {
	in: (value: In, formValues: { [key: string]: any }) => Out;
	out: (value: Out, formValues: { [key: string]: any }) => In;
}

export interface FormItemProps {
	label?: string;
	name?: string | number | (string | number)[];
	formItem?: FormItemInstance;
	defaultValue?: any;
	getValueFromChangeEvent?: (event: any) => any;
	valueTransformer?: FormItemValueTransformer;
	validateTrigger?: ValidateTrigger | ValidateTrigger[];
	rules?: Rule;
	requiredMark?: string | boolean;
	validateFirst?: boolean;
}

export interface FormItemEmitter {
	(event: "change", value: any, form: FormInstance): void;
}

export interface FormItemInstance {
	__IS_FAKE__?: boolean;
	meta: FieldMeta;
	requiredMarkString: ComputedRef<string>;
	handleChange: (event: any) => void;
	handleBlur: () => void;
	registerFormField: (formInstance?: FormInstance) => void;
	unRegisterFormField: () => void;
	validate: (
		options?: ValidateOption
	) => Promise<{ value?: any; error?: ValidateError }>;
	clearValidate: () => void;
}

export interface FormItemSlotProps {
	value: FieldMeta["transformedValue"];
	rawValue: FieldMeta["rawValue"];
	error: FieldMeta["error"];
	handleChange: FormItemInstance["handleChange"];
	form: FormInstance;
}

export interface FormItemSlotErrorsProps {
	errors: ValidateError | undefined;
	form: FormInstance;
	formItem: FormItemEmitter;
}

export interface FormItemSlotExtraProps {
	form: FormInstance;
	formItem: FormItemInstance;
}
