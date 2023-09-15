/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type {
	FieldArrayInstance,
	FieldArrayItemInfo,
	FieldMeta,
	FieldOptions,
	FormInstance,
	GetKeys,
	GetType,
} from "@niku/ez-form-core";
import { type ReactElement, type ReactNode } from "react";
import fieldArrayContext from "src/contexts/fieldArrayContext";
import useFieldArray from "src/hooks/useFieldArray";
import { useFormContext } from "src/index";
import type { FieldNameProps } from "src/utilities";

export type FieldArrayProps<
	FormValues,
	ParentValue = FormValues,
	N extends string = GetKeys<ParentValue>,
	FieldValue = GetType<ParentValue, N>
> = FieldNameProps<ParentValue, N> & {
	children?:
		| ReactNode
		| ((helpers: {
				form: FormInstance<FormValues>;
				fieldArray: FieldArrayInstance<FieldValue, FormValues>;
				fieldsInfo: FieldArrayItemInfo[];
				value: FieldValue;
				meta: FieldMeta;
		  }) => ReactNode);
} & Omit<
		FieldOptions<FieldValue, FormValues>,
		"name" | "valuePropName" | "onChangePropName" | "onBlurPropName"
	>;

function FieldArray<FormValues, ParentValue = FormValues>({
	children,
	...options
}: FieldArrayProps<FormValues, ParentValue>) {
	const fieldArray = useFieldArray<FormValues, ParentValue>(options as any);
	const form = useFormContext<FormValues>();
	const value = fieldArray.useFieldValue();
	const meta = fieldArray.useFieldMeta();

	return (
		<fieldArrayContext.Provider value={{ fieldArray: fieldArray as any }}>
			{typeof children === "function"
				? children?.({
						form,
						fieldArray: fieldArray as any,
						fieldsInfo: fieldArray.getFieldsInfo(),
						value,
						meta,
				  })
				: children}
		</fieldArrayContext.Provider>
	);
}

FieldArray.displayName = "FieldArray";

export default FieldArray;

export type FieldArrayComponent<FormValues, ParentValue = FormValues> = <
	N extends string = GetKeys<ParentValue>
>(
	props: FieldArrayProps<FormValues, ParentValue, N>
) => ReactElement;
