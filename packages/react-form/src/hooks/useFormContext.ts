import type { FormInstance } from "@niku/ez-form-core";
import { useContext } from "react";
import formContext from "src/contexts/formContext";

export default function useFormContext<
	FormValues = unknown
>(): FormInstance<FormValues> {
	const context = useContext(formContext);

	if (!context) {
		throw new Error("[useFormContext] must be used in formContext.Provider");
	}

	return context.form as FormInstance<FormValues>;
}
