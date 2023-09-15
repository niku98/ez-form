/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
	FieldInstance,
	type FormInstance,
	type GetKeys,
	type GetType,
} from "@niku/ez-form-core";
import { type ReactElement } from "react";
import useFormContext from "src/hooks/useFormContext";
import { useField } from "src/index";

export type ObserveFieldProps<
	FormValues,
	N extends string = GetKeys<FormValues>,
	T = GetType<FormValues, N>
> = {
	name: N;
	selector?: (value: GetType<FormValues, N>) => T;
	children?: (helpers: {
		field: FieldInstance<GetType<FormValues, N>, FormValues>;
		form: FormInstance<FormValues>;
		value: T;
	}) => ReactElement;
};

/**
 * Observe field's value
 */
export function ObserveField<FormValues>({
	name,
	children,
	selector,
}: ObserveFieldProps<FormValues>) {
	const form = useFormContext<FormValues>();
	const field = useField<FormValues, FormValues>({
		name,
		preserveValue: true,
		registerInstance: false,
	} as any);
	form.removeField(field);
	const value = field.useFieldValue(selector);

	return <>{children ? children({ field, form, value }) : null}</>;
}

ObserveField.displayName = "ObserveField";

// ---------------------------------------------

export type ObserveProps<FormValues, T = FormValues> = {
	selector?: (values: FormValues) => T;
	children?: (helpers: {
		form: FormInstance<FormValues>;
		values: T;
	}) => ReactElement;
};

/**
 * Observe form's values
 */
export function Observe<FormValues, T>({
	children,
	selector,
}: ObserveProps<FormValues, T>) {
	const form = useFormContext<FormValues>();
	form.useFormMeta();
	const values = form.useFormValues(selector);

	return <>{children ? children({ form, values }) : null}</>;
}

Observe.displayName = "Observe";
