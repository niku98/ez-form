/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
	FieldInstance,
	FormInstance,
	type FieldMeta,
	type FieldOptions,
	type GetKeys,
	type GetType,
} from "@niku/ez-form-core";
import { splitProps, type Accessor, type JSXElement } from "solid-js";
import fieldContext from "src/contexts/fieldContext";
import useField from "src/hooks/useField";
import useFormContext from "src/hooks/useFormContext";
import type { FieldNameProps } from "src/utilities";

export type FieldProps<
	FormValue,
	ParentValue = FormValue,
	N extends string = GetKeys<ParentValue>,
	FieldValue = GetType<ParentValue, N>
> = FieldNameProps<ParentValue, N> & {
	children?:
		| JSXElement
		| ((helpers: {
				form: FormInstance<FormValue>;
				field: FieldInstance<FieldValue, FormValue>;
				value: Accessor<FieldValue>;
				meta: Accessor<FieldMeta>;
		  }) => JSXElement);
} & Omit<FieldOptions<FieldValue, FormValue>, "name">;

function Field<FormValues, ParentValue = FormValues>(
	props: FieldProps<FormValues, ParentValue>
) {
	const [local, options] = splitProps(props, ["children"]);
	const form = useFormContext<FormValues>();
	const field = useField<FormValues, ParentValue>(options as any);
	const value = field.useFieldValue();
	const meta = field.useFieldMeta();

	return (
		<fieldContext.Provider value={{ field: field as any }}>
			{typeof local.children === "function"
				? local.children?.({ form, field: field, value, meta })
				: local.children}
		</fieldContext.Provider>
	);
}

Field.displayName = "Field";

export default Field;

export type FieldComponent<FormValue, ParentValue = FormValue> = (
	props: FieldProps<FormValue, ParentValue>
) => JSXElement;
