import type { ValidateError } from "@niku/ez-form-core";
import type { Accessor, JSXElement } from "solid-js";
import useFieldContext from "src/hooks/useFieldContext";

export interface FieldErrorProps {
	children?: (errors: Accessor<ValidateError[]>) => JSXElement;
}

function FieldErrors({ children }: FieldErrorProps) {
	const field = useFieldContext();
	const errors = field.useFieldMeta((meta) => meta.errors ?? []);

	return <>{children ? children(errors) : null}</>;
}

FieldErrors.displayName = "FieldErrors";

export default FieldErrors;
