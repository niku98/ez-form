/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
	FieldArrayInstance,
	type FieldMeta,
	type FieldOptions,
	type GetKeys,
	type GetType,
} from "@niku/ez-form-core";
import { useEffect, useMemo, useState } from "react";
import type { FieldComponent } from "src/components/Field";
import Field from "src/components/Field";
import type { FieldArrayComponent } from "src/components/FieldArray";
import FieldArray from "src/components/FieldArray";
import useFormContext from "src/hooks/useFormContext";
import {
	useFieldData,
	useFieldMeta,
	useFieldValue,
	type UseFieldDataValues,
} from "src/hooks/useValue";
import type { FieldNameProps } from "src/utilities";

declare module "@niku/ez-form-core" {
	interface FieldArrayInstance<FieldValue, FormValues> {
		useFieldValue: <T = FieldValue>(selector?: (values: FieldValue) => T) => T;
		useFieldMeta: <T = FieldMeta>(selector?: (meta: FieldMeta) => T) => T;
		useFieldData: <T = UseFieldDataValues<FieldValue>>(
			selector?: (values: UseFieldDataValues<FieldValue>) => T
		) => T;

		Field: FieldComponent<FormValues, FieldValue>;
		FieldArray: FieldArrayComponent<FormValues, FieldValue>;
	}
}

export type UseFieldArrayProps<
	FormValues,
	ParentValue = FormValues,
	N extends string = GetKeys<ParentValue>,
	FieldValue = GetType<ParentValue, N>
> = FieldNameProps<ParentValue, N> &
	Omit<
		FieldOptions<FieldValue, FormValues>,
		"name" | "valuePropName" | "onChangePropName" | "onBlurPropName"
	>;

export default function useFieldArray<
	FormValues = unknown,
	ParentValue = FormValues,
	N extends GetKeys<ParentValue> = GetKeys<ParentValue>
>(options: UseFieldArrayProps<FormValues, ParentValue, N>) {
	const form = useFormContext<FormValues>();

	const name = useMemo(() => {
		const { index, namePrefix, name } = options as any;

		return (
			typeof index === "number" ? [namePrefix, index, name] : [namePrefix, name]
		)
			.filter((d) => d !== undefined)
			.join(".");
	}, [options]);

	const [field] = useState(() => {
		const fieldInstance = new FieldArrayInstance(form, {
			...options,
			name: name as any,
		});

		fieldInstance.mount();

		fieldInstance.useFieldValue = function useFieldValueImpl(selector) {
			return useFieldValue(fieldInstance, selector);
		};

		fieldInstance.useFieldMeta = function useFieldMetaImpl(selector) {
			return useFieldMeta(fieldInstance, selector);
		};

		fieldInstance.useFieldData = function useFieldDataImpl(selector) {
			return useFieldData(fieldInstance, selector);
		};

		fieldInstance.Field = (props) => {
			return <Field namePrefix={fieldInstance.name} {...props} />;
		};
		fieldInstance.FieldArray = (props) => {
			return <FieldArray namePrefix={fieldInstance.name} {...(props as any)} />;
		};

		return fieldInstance;
	});
	field.updateOptions({
		...options,
		name: name as any,
	});

	useEffect(() => {
		return field.mount();
	}, [field]);

	return field;
}

export type UseFieldArray<
	FormValues,
	ParentValue = FormValues,
	N extends GetKeys<ParentValue> = GetKeys<ParentValue>,
	FieldValue extends any[] = GetType<ParentValue, N> & []
> = (
	options: UseFieldArrayProps<FormValues, ParentValue, N>
) => FieldArrayInstance<FieldValue, FormValues>;
