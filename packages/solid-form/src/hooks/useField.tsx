/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
	FieldInstance,
	type FieldMeta,
	type FieldOptions,
	type GetKeys,
	type GetType,
} from "@niku/ez-form-core";
import {
	createEffect,
	createMemo,
	on,
	onCleanup,
	type Accessor,
} from "solid-js";
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
		getInputProps(options?: {
			valuePropName?: string;
			onChangePropName?: string;
			onBlurPropName?: string;
		}): Record<string, any>;
		useFieldValue: <T = FieldValue>(
			selector?: (values: FieldValue) => T
		) => Accessor<T>;
		useFieldMeta: <T = FieldMeta>(
			selector?: (meta: FieldMeta) => T
		) => Accessor<T>;
		useFieldData: <T = UseFieldDataValues<FieldValue>>(
			selector?: (values: UseFieldDataValues<FieldValue>) => T
		) => Accessor<T>;

		Field: FieldComponent<FormValues, FieldValue>;
		FieldArray: FieldArrayComponent<FormValues, FieldValue>;
	}

	interface FieldOptions<FieldValue, FormValues> {
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
	const name = createMemo(() =>
		(typeof options.index === "number"
			? [options.namePrefix, options.index, options.name]
			: [options.namePrefix, options.name]
		)
			.filter((d) => d !== undefined)
			.join(".")
	);

	const field = new FieldInstance(form, {
		...options,
		name: name() as any,
	});

	field.useFieldValue = function useFieldValueImpl(selector) {
		return useFieldValue(field, selector);
	};

	field.useFieldMeta = function useFieldMetaImpl(selector) {
		return useFieldMeta(field, selector);
	};

	field.useFieldData = function useFieldDataImpl(selector) {
		return useFieldData(field, selector);
	};

	field.getInputProps = (options = {}) => {
		const {
			valuePropName = "value",
			onChangePropName = "onInput",
			onBlurPropName = "onBlur",
		} = options;
		return {
			[valuePropName]: field.getValue(),
			[onChangePropName]: (e: any) => {
				return field.handleChange(e);
			},
			[onBlurPropName]: (e: Event) => {
				return field.handleBlur(e);
			},
		};
	};

	field.Field = (props) => {
		return <Field namePrefix={field.name} {...props} />;
	};
	field.FieldArray = (props) => {
		return <FieldArray namePrefix={field.name} {...(props as any)} />;
	};

	createEffect(
		on(
			() => options,
			() => {
				field.updateOptions({ ...options, name: name() as any });
			}
		)
	);

	createEffect(() => {
		const unmount = field.mount();
		onCleanup(unmount);
	});

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
