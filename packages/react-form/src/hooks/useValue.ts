import type {
	FieldBaseInstance,
	FieldMeta,
	FormInstance,
	FormMeta,
} from "@niku/ez-form-core";
import { useRef } from "react";
import { useSyncExternalStore } from "use-sync-external-store/shim";

export interface UseFormDataValues<FormValues> {
	meta: FormMeta;
	values: FormValues;
}

export function useFormData<FormValues, T = UseFormDataValues<FormValues>>(
	form: FormInstance<FormValues>,
	selector?: (values: UseFormDataValues<FormValues>) => T
): T {
	const dataRef = useRef<UseFormDataValues<FormValues>>({
		meta: form.meta,
		values: form.values,
	});

	return useSyncExternalStore(
		(listener) =>
			form.on("change", () => {
				dataRef.current = {
					meta: form.meta,
					values: form.values,
				};

				return listener();
			}),
		() => {
			if (selector) {
				return selector(dataRef.current);
			}

			return dataRef.current as T;
		},
		() => {
			if (selector) {
				return selector(dataRef.current);
			}

			return dataRef.current as T;
		}
	);
}

export function useFormValues<FormValues, T = FormValues>(
	form: FormInstance<FormValues>,
	selector?: (values: FormValues) => T
): T {
	return useFormData(form, ({ values }) =>
		selector ? selector(values) : values
	) as T;
}

export function useFormMeta<FormValues, T = FormMeta>(
	form: FormInstance<FormValues>,
	selector?: (values: FormMeta) => T
) {
	return useFormData(form, ({ meta }) =>
		selector ? selector(meta) : meta
	) as T;
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
): T {
	const dataRef = useRef<UseFieldDataValues<FieldValue>>({
		meta: field.meta,
		value: field.value,
	});

	return useSyncExternalStore(
		(listener) =>
			field.on("change", () => {
				dataRef.current = {
					meta: field.meta,
					value: field.value,
				};

				return listener();
			}),
		() => {
			if (selector) {
				return selector(dataRef.current);
			}

			return dataRef.current as T;
		},
		() => {
			if (selector) {
				return selector(dataRef.current);
			}

			return dataRef.current as T;
		}
	);
}

export function useFieldValue<FieldValue, FormValues, T = FieldValue>(
	field: FieldBaseInstance<FieldValue, FormValues>,
	selector?: (values: FieldValue) => T
): T {
	return useFieldData(field, ({ value }) =>
		selector ? selector(value) : value
	) as T;
}

export function useFieldMeta<FieldValue, FormValues, T = FieldValue>(
	field: FieldBaseInstance<FieldValue, FormValues>,
	selector?: (values: FieldMeta) => T
) {
	return useFieldData(field, ({ meta }) =>
		selector ? selector(meta) : meta
	) as T;
}
