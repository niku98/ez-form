import { NamePath } from "@/models/Base";
import { FormInstance } from "@/models/Form";
import {
	Rule,
	ValidateError,
	ValidateOption,
	ValidateTrigger,
} from "@/models/Validation";
import { ComputedRef, Ref, WritableComputedRef } from "vue";

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
	getValueFromChangeEvent: (event: any) => any;
	valueTransformer: FormItemValueTransformer;
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

export interface UseFormItemResult {
	formItemId: ComputedRef<string>;
	requiredMarkString: ComputedRef<string>;
	rawValue: WritableComputedRef<any>;
	inputValue: WritableComputedRef<any>;
	error: Ref<ValidateError | undefined>;
	injectedForm: FormInstance;
	handleChange: (event: any) => void;
	handleBlur: () => void;
	validate: (options?: ValidateOption) => Promise<any>;
	dirty: Ref<boolean>;
}

export interface UseFormListResult {
	formItemId: ComputedRef<string>;
	requiredMarkString: ComputedRef<string>;
	rawValue: WritableComputedRef<any>;
	inputValue: WritableComputedRef<any>;
	error: Ref<ValidateError | undefined>;
	injectedForm: FormInstance;
	handleChange: (event: any) => void;
	handleBlur: () => void;
	validate: (options?: ValidateOption) => Promise<any>;
	dirty: Ref<boolean>;
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
