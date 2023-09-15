import { GetKeys } from "src/models/Utilities";
import type { ValidateError, ValidateTrigger } from "src/models/Validation";
import { FieldValidationSchema } from "src/validation/ValidationSchema";

export interface FieldMeta {
	errors?: ValidateError[];
	dirty: boolean;
	touched: boolean;
	validating: boolean;
	validationCount: number;
}

export interface FieldOptions<FieldValue, FormValues> {
	name: GetKeys<FormValues>;
	label?: string;
	initialValue?: FieldValue;
	validateTrigger?: ValidateTrigger | ValidateTrigger[];
	validationSchema?: FieldValidationSchema;
	validateFirst?: boolean;
	// preserveValue?: boolean;
	onChange?: (value: FieldValue) => void;
	onBlur?: (event: any) => void;
	registerInstance?: boolean;
}

export interface ValueTransformer<In = any, Out = any> {
	in: (value: In, formValues: { [key: string]: any }) => Out;
	out: (value: Out, formValues: { [key: string]: any }) => In;
}

export interface FieldArrayItemInfo {
	key: string;
	index: number;
}
