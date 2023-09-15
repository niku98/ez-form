/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
	FormInstance,
	type FormMeta,
	type FormOptions,
	type GetKeys,
	type GetType,
} from "@niku/ez-form-core";
import {
	useEffect,
	useState,
	type FormEventHandler,
	type ReactElement,
} from "react";
import Field, { type FieldComponent } from "src/components/Field";
import type { FieldArrayComponent } from "src/components/FieldArray";
import FieldArray from "src/components/FieldArray";
import Form, { type FormComponent } from "src/components/Form";
import {
	Observe,
	ObserveField,
	type ObserveFieldProps,
	type ObserveProps,
} from "src/components/Observe";
import type { UseField } from "src/hooks/useField";
import useField from "src/hooks/useField";
import type { UseFieldArray } from "src/hooks/useFieldArray";
import useFieldArray from "src/hooks/useFieldArray";
import {
	useFormData,
	useFormMeta,
	useFormValues,
	type UseFormDataValues,
} from "src/hooks/useValue";
import { handleEventPrevent } from "src/utilities";

declare module "@niku/ez-form-core" {
	interface FormInstance<Values> {
		Field: FieldComponent<Values>;
		FieldArray: FieldArrayComponent<Values, Values>;
		Form: FormComponent<Values>;
		useField: UseField<Values>;
		useFieldArray: UseFieldArray<Values>;
		Observe: <T = Values>(props: ObserveProps<Values, T>) => ReactElement;
		ObserveField: <N extends string = GetKeys<Values>, T = GetType<Values, N>>(
			props: ObserveFieldProps<Values, N, T>
		) => ReactElement;
		getFormProps: () => {
			onReset: FormEventHandler<HTMLFormElement>;
			onSubmit: FormEventHandler<HTMLFormElement>;
			disabled: boolean;
		};
		useFormValues: <T = Values>(selector?: (values: Values) => T) => T;
		useFormMeta: <T = FormMeta>(selector?: (meta: FormMeta) => T) => T;
		useFormData: <T = UseFormDataValues<Values>>(
			selector?: (values: UseFormDataValues<Values>) => T
		) => T;
	}
}

export interface UseFormProps<FormValues> extends FormOptions<FormValues> {
	form?: FormInstance<FormValues>;
}

export default function useForm<FormValues>(
	options: UseFormProps<FormValues> = {}
) {
	const [form] = useState(() => {
		const { form: optionsForm, ...otherOptions } = options ?? {};
		if (optionsForm) {
			optionsForm.updateOptions({
				...optionsForm.options,
				...otherOptions,
			});
			return optionsForm;
		}

		const formInstance = new FormInstance(options);

		formInstance.useField = useField;
		formInstance.useFieldArray = useFieldArray as any;
		formInstance.Field = Field;
		formInstance.FieldArray = FieldArray as any;
		formInstance.Observe = Observe;
		formInstance.ObserveField = ObserveField as any;
		formInstance.Form = (props) => <Form form={formInstance} {...props} />;

		formInstance.getFormProps = () => {
			return {
				disabled: formInstance.meta.submitting,
				onReset: handleEventPrevent(() => {
					formInstance.reset();
				}),
				onSubmit: handleEventPrevent(() => {
					formInstance.submit();
				}),
			};
		};

		formInstance.useFormMeta = function useFormMetaImpl(selector) {
			return useFormMeta(form, selector);
		};
		formInstance.useFormValues = function useFormValuesImpl(selector) {
			return useFormValues(form, selector);
		};
		formInstance.useFormData = function useFormDataImpl(selector) {
			return useFormData(form, selector);
		};

		return formInstance;
	});

	const { form: optionsForm, ...otherOptions } = options;

	form.updateOptions({
		...optionsForm?.options,
		...otherOptions,
	});

	useEffect(() => {
		return form.mount();
	}, [form]);

	return form;
}
