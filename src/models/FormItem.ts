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
}

export interface FormItemValueTransformer<In = any, Out = any> {
	in: (value: In, formValues: { [key: string]: any }) => Out;
	out: (value: Out, formValues: { [key: string]: any }) => In;
}

export interface FormItemProps {
	label?: string;
	name?: string | number | (string | number)[];
	defaultValue?: any;
	getValueFromChangeEvent?: (event: any) => any;
	valueTransformer?: FormItemValueTransformer;
	validateTrigger?: ValidateTrigger | ValidateTrigger[];
	rules?: Rule;
	requiredMark?: string | boolean;
	validateFirst?: boolean;
}

export interface FormListProps extends FormItemProps {
	defaultValue?: any[];
}

export interface FormItemEmitter {
	(event: "change", value: any, form: FormInstance): void;
}

export interface FormItemInstance {
	meta: FieldMeta;
	requiredMarkString: ComputedRef<string>;
	handleChange: (event: any) => void;
	handleBlur: () => void;
	registerFormField: (formInstance: FormInstance) => void;
	validate: (options?: ValidateOption) => Promise<any>;
}

export interface FormListInstance
	extends Omit<FormItemInstance, "handleBlur" | "handleChange"> {
	listValues: ComputedRef<any[]>;
	namePrefix: ComputedRef<(string | number)[]>;
	namePaths: ComputedRef<(string | number)[][]>;
	errors: ComputedRef<ValidateError[]>;
	getNamePath(index: number, name: NamePath): (string | number)[];
	getErrors(index?: number): ValidateError[];
	hasError(index: number): boolean;
	add(newValue?: any): void;
	remove(index: number): void;
	removeByKey(key: string, value: any): void;
	replace(index: number, newValue: any): void;
	swap(firstIndex: number, secondIndex: number): void;
	move(fromIndex: number, toIndex: number): void;
}
