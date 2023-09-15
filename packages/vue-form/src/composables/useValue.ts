import type {
	FieldArrayInstance,
	FieldBaseInstance,
	FieldMeta,
	FormInstance,
	FormMeta,
} from "@niku/ez-form-core";
import { ref, type Ref } from "vue";

export interface UseFormDataValues<FormValues> {
	meta: FormMeta;
	values: FormValues;
}

export function useFormData<FormValues, T = UseFormDataValues<FormValues>>(
	form: FormInstance<FormValues>,
	selector?: (values: UseFormDataValues<FormValues>) => T
): Ref<T> {
	function getValue() {
		const newData = {
			meta: form.meta,
			values: form.values,
		};

		return selector ? selector(newData) : (newData as T);
	}

	const data = ref<T>(getValue()) as Ref<T>;

	form.on("change", () => {
		data.value = getValue();
	});

	return data;
}

export function useFormValues<FormValues, T = FormValues>(
	form: FormInstance<FormValues>,
	selector?: (values: FormValues) => T
): Ref<T> {
	return useFormData(form, ({ values }) =>
		selector ? selector(values) : values
	) as Ref<T>;
}

export function useFormMeta<FormValues, T = FormMeta>(
	form: FormInstance<FormValues>,
	selector?: (values: FormMeta) => T
) {
	return useFormData(form, ({ meta }) =>
		selector ? selector(meta) : meta
	) as Ref<T>;
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
): Ref<T> {
	function getValue() {
		const newData = { meta: field.meta, value: field.value };
		return selector ? selector(newData) : (newData as T);
	}

	const data = ref<T>(getValue()) as Ref<T>;

	field.on("change", () => {
		data.value = getValue();
	});

	return data;
}

export function useFieldValue<FieldValue, FormValues, T = FieldValue>(
	field: FieldBaseInstance<FieldValue, FormValues>,
	selector?: (values: FieldValue) => T
): Ref<T> {
	return useFieldData(field, ({ value }) =>
		selector ? selector(value) : value
	) as Ref<T>;
}

export function useFieldMeta<FieldValue, FormValues, T = FieldValue>(
	field: FieldBaseInstance<FieldValue, FormValues>,
	selector?: (values: FieldMeta) => T
) {
	return useFieldData(field, ({ meta }) =>
		selector ? selector(meta) : meta
	) as Ref<T>;
}

export function useFieldsInfo<FieldValue, FormValues>(
	field: FieldArrayInstance<FieldValue, FormValues>
) {
	return useFieldData(field, () => field.getFieldsInfo());
}
