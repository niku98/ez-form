import { NamePath } from "@/models/Base";
import {
	Rules,
	ValidateError,
	ValidateMessages,
	ValidateOption,
	ValidateTrigger,
} from "@/models/Validation";
import { ComputedRef } from "vue";

export interface FormField {
	name: ComputedRef<NamePath>;
	id: ComputedRef<string>;
	validate: (options?: ValidateOption) => Promise<any>;
	clearValidate: () => void;
	reset: () => void;
	defaultValue: any;
	value: ComputedRef<any>;
	error: ComputedRef<ValidateError | undefined>;
	dirty: ComputedRef<boolean>;
}

export interface FormSettings<Values extends object = any> {
	form?: FormInstance;
	emit?: FormEmitter;
	initialValues?: Values;
	enableReinitialize?: boolean;
	clearOnReset?: boolean;
	rules?: Rules;
	validateTrigger?: ValidateTrigger | ValidateTrigger[];
	validateMessages?: ValidateMessages;
	classPrefix?: string;
}

export interface FormEmitter {
	(event: "submit", values: any): void;
	(event: "change", values: any): void;
	(event: "reset"): void;
	(event: "error", errors: any): void;
}

export interface FormInstance<
	Values extends object = Record<string | number | symbol, any>
> {
	values: Values;
	errors: ValidateError[];
	getFieldValue(name: NamePath): any;
	setFieldValue(name: NamePath, value: any): void;
	validate(name?: string | NamePath[], options?: ValidateOption): Promise<any>;
	submit: () => void;
	reset: (values?: Values) => void;
	validateTrigger?: ValidateTrigger | ValidateTrigger[];
	isDirty: (name?: NamePath) => boolean;
	updateSettings(settings: FormSettings): void;
	className: ComputedRef<string>;
	addField(field: FormField): void;
	removeField(namePath: NamePath): void;
	rules?: Rules;
	validateMessages?: ValidateMessages;
	classPrefix: string;
}
