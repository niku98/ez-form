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
import { splitProps, type Accessor, type JSXElement } from "solid-js";
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
		| JSXElement
		| ((helpers: {
				form: FormInstance<FormValues>;
				fieldArray: FieldArrayInstance<FieldValue, FormValues>;
				fieldsInfo: Accessor<FieldArrayItemInfo[]>;
				value: Accessor<FieldValue>;
				meta: Accessor<FieldMeta>;
		  }) => JSXElement);
} & Omit<FieldOptions<FieldValue, FormValues>, "name">;

function FieldArray<FormValues, ParentValue = FormValues>(
	props: FieldArrayProps<FormValues, ParentValue>
) {
	const [local, options] = splitProps(props, ["children"]);
	const fieldArray = useFieldArray<FormValues, ParentValue>(options as any);
	const form = useFormContext<FormValues>();
	const fieldsInfo = fieldArray.useFieldValue(() => fieldArray.getFieldsInfo());
	const value = fieldArray.useFieldValue();
	const meta = fieldArray.useFieldMeta();

	return (
		<>
			{typeof local.children === "function"
				? local.children?.({
						form,
						fieldArray,
						fieldsInfo,
						value,
						meta,
				  })
				: local.children}
		</>
	);
}

FieldArray.displayName = "FieldArray";

export default FieldArray;

export type FieldArrayComponent<FormValues, ParentValue = FormValues> = <
	N extends string = GetKeys<ParentValue>
>(
	props: FieldArrayProps<FormValues, ParentValue, N>
) => JSXElement;
