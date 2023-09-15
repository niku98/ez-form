export type ValidateTrigger = "change" | "blur";

export interface ValidationOption {
	trigger?: ValidateTrigger | ValidateTrigger[];
	validateFirst?: boolean;
}

export interface ValidateError {
	field: string;
	messages: string[];
}

export interface ValidationResult {
	valid: boolean;
	errors: ValidateError[];
}
