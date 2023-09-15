import type { FieldArrayInstance } from "@niku/ez-form-core";
import { createContext } from "react";

export interface FieldArrayContext<
	FieldValues = unknown,
	FormValues = unknown
> {
	fieldArray: FieldArrayInstance<FieldValues, FormValues>;
}

const fieldArrayContext = createContext<FieldArrayContext | undefined>(
	undefined
);

export default fieldArrayContext;
