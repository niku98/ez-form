import type {
	EzBindingFieldInput,
	EzField,
	EzFieldErrors,
	EzForm,
	EzObserve,
	EzObserveField,
} from "./index";

declare module "@vue/runtime-core" {
	export interface GlobalComponents {
		EzForm: typeof EzForm;
		EzField: typeof EzField;
		EzBindingFieldInput: typeof EzBindingFieldInput;
		EzObserve: typeof EzObserve;
		EzObserveField: typeof EzObserveField;
		EzFieldErrors: typeof EzFieldErrors;
	}
}
