import type {
	FieldBaseInstance,
	FieldMeta,
	FormInstance,
	FormMeta,
} from "@niku/ez-form-core";
import { createSignal, type Accessor } from "solid-js";

export interface UseFormDataValues<FormValues> {
	meta: FormMeta;
	values: FormValues;
}

export function useFormData<FormValues, T = UseFormDataValues<FormValues>>(
	form: FormInstance<FormValues>,
	selector?: (values: UseFormDataValues<FormValues>) => T
) {
	function getData() {
		const value = {
			meta: form.meta,
			values: form.values,
		};

		return (selector ? selector(value) : value) as T;
	}

	const [data, setData] = createSignal(getData());

	form.on("change", () => {
		setData(() => getData());
	});

	return data;
}

export function useFormValues<FormValues, T = FormValues>(
	form: FormInstance<FormValues>,
	selector?: (values: FormValues) => T
): Accessor<T> {
	return useFormData(form, ({ values }) =>
		selector ? selector(values) : values
	) as Accessor<T>;
}

export function useFormMeta<FormValues, T = FormMeta>(
	form: FormInstance<FormValues>,
	selector?: (values: FormMeta) => T
) {
	return useFormData(form, ({ meta }) =>
		selector ? selector(meta) : meta
	) as Accessor<T>;
}

export interface UseFieldDataValues<FieldValue> {
	meta: FieldMeta;
	value: FieldValue;
}

export function useFieldData<
	FieldValue,
	FormValues,
	T = UseFormDataValues<FieldValue>
>(
	field: FieldBaseInstance<FieldValue, FormValues>,
	selector?: (values: UseFieldDataValues<FieldValue>) => T
): Accessor<T> {
	function getData() {
		const value = {
			meta: field.meta,
			value: field.getValue(),
		};

		return (selector ? selector(value) : value) as T;
	}

	const [data, setData] = createSignal(getData());

	field.on("change", () => {
		setData(() => getData());
	});

	return data;
}

export function useFieldValue<FieldValue, FormValues, T = FieldValue>(
	field: FieldBaseInstance<FieldValue, FormValues>,
	selector?: (values: FieldValue) => T
): Accessor<T> {
	return useFieldData(field, ({ value }) =>
		selector ? selector(value) : value
	) as Accessor<T>;
}

export function useFieldMeta<FieldValue, FormValues, T = FieldValue>(
	field: FieldBaseInstance<FieldValue, FormValues>,
	selector?: (values: FieldMeta) => T
) {
	return useFieldData(field, ({ meta }) =>
		selector ? selector(meta) : meta
	) as Accessor<T>;
}
