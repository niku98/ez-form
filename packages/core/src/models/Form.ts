import { GetKeys } from "src/models";
import type { ValidateError, ValidateTrigger } from "src/models/Validation";
import ValidationSchema from "src/validation/ValidationSchema";
export interface FormMeta {
	errors: ValidateError[];
	dirty: boolean;
	touched: boolean;
	submitting: boolean;
	submissionCount: number;
	validating: boolean;
	validationCount: number;
	valid: boolean;
}

export interface FormOptions<Values = any> {
	name?: string;
	initialValues?: Values;
	enableReinitialize?: boolean;
	validationSchema?: ValidationSchema<GetKeys<Values>, any, any>;
	validateTrigger?: ValidateTrigger | ValidateTrigger[];
	validateMessages?: any;
	// preserveValues?: boolean;
	onValuesChange?: (values: Values, oldValues: Values) => void;
	onReset?: () => void;
	onSubmit?: (values: Values) => void;
	onError?: (errors: ValidateError[]) => void;
	onValidate?: () => void;
}
