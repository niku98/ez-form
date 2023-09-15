/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
	FieldInstance,
	type FormInstance,
	type GetKeys,
	type GetType,
} from "@niku/ez-form-core";
import type { Accessor, JSXElement } from "solid-js";
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
		value: Accessor<T>;
	}) => JSXElement;
};

/**
 * Observe field's value
 */
export function ObserveField<FormValues>(props: ObserveFieldProps<FormValues>) {
	const form = useFormContext<FormValues>();
	const field = useField<FormValues>({
		name: props.name,
		preserveValue: true,
		registerInstance: false,
	} as any);
	form.removeField(field);
	field.useFieldMeta();
	const value = field.useFieldValue(props.selector);

	return <>{props.children ? props.children({ field, form, value }) : null}</>;
}

ObserveField.displayName = "ObserveField";

// ---------------------------------------------

export type ObserveProps<FormValues, T = FormValues> = {
	selector?: (values: FormValues) => T;
	children?: (helpers: {
		form: FormInstance<FormValues>;
		values: Accessor<T>;
	}) => JSXElement;
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
