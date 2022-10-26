import { FormInjectedValues } from "@/models/Form";
import { Rule, ValidateTrigger } from "@/models/Validation";

export interface FormItemExposed {
	value: any;
	handleChange(value: any): any;
	form: FormInjectedValues;
	errors: any;
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
