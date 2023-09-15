import type { FieldInstance } from "@niku/ez-form-core";
import { useContext } from "solid-js";
import fieldContext from "src/contexts/fieldContext";

export default function useFieldContext<
	FieldValue = unknown,
	FormValues = unknown
>() {
	const context = useContext(fieldContext);

	if (!context) {
		throw new Error("[useFieldContext] must be used in fieldContext.Provider");
	}

	return context.field as FieldInstance<FieldValue, FormValues>;
}
