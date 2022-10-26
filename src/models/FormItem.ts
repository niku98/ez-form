import { Rule, ValidateError, ValidateTrigger } from "@/models/Validation";
import { FormInstance } from "dist";

export interface FormItemInstance {
	rawValue: any;
	transformedValue: any;
	handleChange(value: any): any;
	form: FormInstance;
	error?: ValidateError;
	dirty: boolean;
}

export interface FormItemValueTransformer<In = any, Out = any> {
	in: (value: In, formValues: { [key: string]: any }) => Out;
	out: (value: Out, formValues: { [key: string]: any }) => In;
}

export interface FormItemProps {
	label?: string;
	name?: string | number | (string | number)[];
	defaultValue?: any;
	valuePropName?: string;
	changeEventPropName?: string;
	getValueFromChangeEvent?: (event: any) => any;
	valueTransformer?: FormItemValueTransformer;
	validateTrigger?: ValidateTrigger | ValidateTrigger[];
	rules?: Rule;
	requiredMark?: string | boolean;
	validateFirst?: boolean;
}
