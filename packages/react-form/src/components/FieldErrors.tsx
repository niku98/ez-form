import type { ValidateError } from "@niku/ez-form-core";
import useFieldContext from "src/hooks/useFieldContext";

export interface FieldErrorProps {
	children?: (errors?: ValidateError[]) => void;
}

export default function FieldErrors({ children }: FieldErrorProps) {
	const field = useFieldContext();
	const errors = field.useFieldMeta((meta) => meta.errors);

	return <>{children ? children(errors ?? []) : null}</>;
}
