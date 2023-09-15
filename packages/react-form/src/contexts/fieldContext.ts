import type { FieldInstance } from "@niku/ez-form-core";
import { createContext } from "react";

export interface FieldContext<FieldValues = unknown, FormValues = unknown> {
	field: FieldInstance<FieldValues, FormValues>;
}

const fieldContext = createContext<FieldContext | undefined>(undefined);

export default fieldContext;
