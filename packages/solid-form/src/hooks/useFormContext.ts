import type { FormInstance } from "@niku/ez-form-core";
import { useContext } from "solid-js";
import formContext from "src/contexts/formContext";

export default function useFormContext<FormValues = unknown>() {
	const context = useContext(formContext);

	if (!context) {
		throw new Error("[useFormContext] must be used in formContext.Provider");
	}

	return context.form as FormInstance<FormValues>;
}
