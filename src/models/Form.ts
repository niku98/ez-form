import type { NamePath } from "@/models/Base";
import type { FormItemInstance } from "@/models/FormItem";
import type {
	Rules,
	ValidateError,
	ValidateMessages,
	ValidateOption,
	ValidateTrigger,
} from "@/models/Validation";
import type { ComputedRef } from "vue";

export interface FormMeta<Values = any> {
	name: string;
	values: Values;
	errors: ValidateError[];
	dirty: boolean;
}

export interface FormField {
	name: ComputedRef<NamePath>;
	id: ComputedRef<string>;
	validate: FormItemInstance["validate"];
	clearValidate: () => void;
	reset: () => void;
	markAsDirty: () => void;
	defaultValue: any;
	value: ComputedRef<any>;
	error: ComputedRef<ValidateError | undefined>;
	dirty: ComputedRef<boolean>;
}

export interface FormSettings<Values extends object = any> {
	name?: string;
	form?: FormInstance;
	initialValues?: Values;
	enableReinitialize?: boolean;
	rules?: Rules;
	validateTrigger?: ValidateTrigger | ValidateTrigger[];
	validateMessages?: ValidateMessages;
	classPrefix?: string;
	preserveValues?: boolean;
}

export interface FormEmitter {
	(event: "submit", values: any): void;
	(event: "change", values: any): void;
	(event: "reset"): void;
	(event: "error", errors: any): void;
}

export interface FormSlotProps {
	values: FormInstance["meta"]["values"];
	errors: FormInstance["meta"]["errors"];
	dirty: FormInstance["meta"]["dirty"];
	submit: FormInstance["submit"];
	reset: FormInstance["reset"];
	validate: FormInstance["validate"];
	getFieldValue: FormInstance["getFieldValue"];
	setFieldValue: FormInstance["setFieldValue"];
	isDirty: FormInstance["isDirty"];
}

export interface FormInstance<Values extends object = any> {
	__IS_FAKE__?: boolean;
	meta: FormMeta;
	validateTrigger?: ValidateTrigger | ValidateTrigger[];
	rules?: Rules;
	validateMessages?: ValidateMessages;
	classPrefix: string;
	getFieldValue(name: NamePath): any;
	setFieldValue(name: NamePath, value: any): void;
	validate(
		name?: string | NamePath[],
		options?: ValidateOption
	): Promise<{ values?: any; errors?: ValidateError[] }>;
	clearValidate(name?: NamePath): void;
	submit: <
		S extends FormSubmitCallback<Values> | undefined = undefined,
		E extends FormErrorCallback | undefined = undefined
	>(
		onSuccess?: FormSubmitCallback<Values> | S,
		onError?: FormErrorCallback | E
	) => S extends FormSubmitCallback<Values>
		? void
		: E extends FormErrorCallback
		? void
		: Promise<{ values?: Values; errors?: ValidateError[] }>;
	reset: (values?: Values) => void;
	isDirty: (name?: NamePath) => boolean;
	addField(field: FormField): void;
	removeField(namePath: NamePath): void;
	updateSettings(settings: Partial<FormSettings>): void;
}

export type FormSubmitCallback<Values = any> = (values: Values) => void;
export type FormErrorCallback = (errors: ValidateError[]) => void;
