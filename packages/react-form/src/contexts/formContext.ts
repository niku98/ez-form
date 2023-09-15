import type { FormInstance } from "@niku/ez-form-core";
import { createContext } from "react";

export interface FormContext<FormValues = unknown> {
	form: FormInstance<FormValues>;
}

const formContext = createContext<FormContext | undefined>(undefined);

export default formContext;
