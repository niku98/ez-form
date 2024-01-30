/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { GetKeys } from "@niku/ez-form-core";
import {
	FieldInstance,
	type FieldMeta,
	type FieldOptions,
	type GetType,
} from "@niku/ez-form-core";
import { useEffect, useMemo, useState, type ReactElement } from "react";
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
	interface FieldInstance<FieldValue, FormValues> {
		getInputProps(node: ReactElement): Record<string, any>;
		useFieldValue: <T = FieldValue>(selector?: (values: FieldValue) => T) => T;
		useFieldMeta: <T = FieldMeta>(selector?: (meta: FieldMeta) => T) => T;
		useFieldData: <T = UseFieldDataValues<FieldValue>>(
			selector?: (values: UseFieldDataValues<FieldValue>) => T
		) => T;

		Field: FieldComponent<FormValues, FieldValue>;
		FieldArray: FieldArrayComponent<FormValues, FieldValue>;
	}

	interface FieldOptions<FieldValue, FormValues> {
		valuePropName?: string;
		onChangePropName?: string;
		onBlurPropName?: string;
		namePrefix?: string;
	}
}

export type UseFieldProps<
	FormValues,
	ParentValue = FormValues,
	N extends GetKeys<ParentValue> = GetKeys<ParentValue>,
	FieldValue = GetType<ParentValue, N>
> = FieldNameProps<ParentValue, N> &
	Omit<FieldOptions<FieldValue, FormValues>, "name">;

export default function useField<
	FormValues = unknown,
	ParentValue = FormValues,
	N extends GetKeys<ParentValue> = GetKeys<ParentValue>
>(options: UseFieldProps<FormValues, ParentValue, N>) {
	const form = useFormContext<FormValues>();

	const name = useMemo(
		() =>
			(typeof options.index === "number"
				? [options.namePrefix, options.index, options.name]
				: [options.namePrefix, options.name]
			)
				.filter((d) => d !== undefined)
				.join("."),
		[options.index, options.name, options.namePrefix]
	);

	const [field] = useState(() => {
		const fieldInstance = new FieldInstance(form, {
			...options,
			name: name as any,
		});

		fieldInstance.useFieldValue = function useFieldValueImpl(selector) {
			return useFieldValue(fieldInstance, selector);
		};

		fieldInstance.useFieldMeta = function useFieldMetaImpl(selector) {
			return useFieldMeta(fieldInstance, selector);
		};

		fieldInstance.useFieldData = function useFieldDataImpl(selector) {
			return useFieldData(fieldInstance, selector);
		};

		fieldInstance.getInputProps = (node) => {
			const {
				valuePropName = "value",
				onChangePropName = "onChange",
				onBlurPropName = "onBlur",
			} = fieldInstance.options;
			return {
				[valuePropName]:
					typeof node.type === "string" &&
					["select", "input", "textarea"].includes(node.type)
						? fieldInstance.getValue() ?? ""
						: fieldInstance.getValue(),
				[onChangePropName]: (e: any) => {
					return fieldInstance.handleChange(e);
				},
				[onBlurPropName]: (e: Event) => {
					return fieldInstance.handleBlur(e);
				},
				get name() {
					return `${form.uid}-${fieldInstance.name as string}`;
				},
				get id() {
					return `${form.uid}-${fieldInstance.name as string}`;
				},
			};
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

export type UseField<
	FormValues,
	ParentValue = FormValues,
	N extends GetKeys<ParentValue> = GetKeys<ParentValue>,
	FieldValue = GetType<ParentValue, N>
> = (
	options: UseFieldProps<FormValues, ParentValue, N>
) => FieldInstance<FieldValue, FormValues>;
