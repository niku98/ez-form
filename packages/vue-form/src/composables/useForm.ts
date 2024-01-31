/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
	FormInstance,
	type FormMeta,
	type FormOptions,
} from "@niku/ez-form-core";
import Field, { type FieldComponent } from "src/components/Field";
import type { FieldArrayComponent } from "src/components/FieldArray";
import EzFieldArray from "src/components/FieldArray";
import EzForm, { type FormComponent } from "src/components/Form";
import Observe, { type ObserveComponent } from "src/components/Observe";
import type { ObserveFieldComponent } from "src/components/ObserveField";
import ObserveField from "src/components/ObserveField";
import type { UseField } from "src/composables/useField";
import useField from "src/composables/useField";
import type { UseFieldArray } from "src/composables/useFieldArray";
import useFieldArray from "src/composables/useFieldArray";
import {
	useFormData,
	useFormMeta,
	useFormValues,
	type UseFormDataValues,
} from "src/composables/useValue";
import { provideForm } from "src/provides/form";
import { handleEventPrevent } from "src/utilities/event";
import { clearUndefinedProperties } from "src/utilities/object";
import {
	h,
	onBeforeUnmount,
	toValue,
	watch,
	type MaybeRef,
	type Ref,
	type Slots,
} from "vue";

declare module "@niku/ez-form-core" {
	interface FormInstance<Values> {
		Field: FieldComponent<Values>;
		FieldArray: FieldArrayComponent<Values>;
		Form: FormComponent<Values>;
		useField: UseField<Values>;
		useFieldArray: UseFieldArray<Values>;
		Observe: ObserveComponent<Values>;
		ObserveField: ObserveFieldComponent<Values>;
		getFormProps: () => {
			onReset: (e: Event) => void;
			onSubmit: (e: Event) => void;
			disabled: boolean;
		};
		useFormValues: <T = Values>(selector?: (values: Values) => T) => Ref<T>;
		useFormMeta: <T = FormMeta>(selector?: (meta: FormMeta) => T) => Ref<T>;
		useFormData: <T = UseFormDataValues<Values>>(
			selector?: (values: UseFormDataValues<Values>) => T
		) => Ref<T>;
	}
}

export interface UseFormProps<FormValues> extends FormOptions<FormValues> {
	form?: FormInstance<FormValues>;
}

export default function useForm<FormValues>(
	options: MaybeRef<UseFormProps<FormValues>> = {}
) {
	function getForm() {
		const { form: optionsForm, ...otherOptions } = toValue(options);
		if (optionsForm) {
			optionsForm.updateOptions({
				...optionsForm.options,
				...clearUndefinedProperties(otherOptions),
			});

			return optionsForm;
		}

		const form = new FormInstance(toValue(options));

		form.useField = useField as any;
		form.useFieldArray = useFieldArray as any;
		form.Field = Field as unknown as FieldComponent<FormValues>;
		form.FieldArray =
			EzFieldArray as unknown as FieldArrayComponent<FormValues>;
		form.Observe = Observe;
		form.ObserveField = ObserveField as any;
		form.Form = ((props: any, { slots }: { slots: Slots }) =>
			h(
				EzForm,
				{
					form: form,
					...props,
				},
				slots
			)) as unknown as FormComponent<FormValues>;

		form.getFormProps = () => {
			return {
				disabled: form.meta.submitting,
				onReset: handleEventPrevent(() => {
					form.reset();
				}),
				onSubmit: handleEventPrevent(() => {
					form.submit();
				}),
			};
		};

		form.useFormMeta = function useFormMetaImpl(selector) {
			return useFormMeta(form, selector);
		};
		form.useFormValues = function useFormValuesImpl(selector) {
			return useFormValues(form, selector);
		};
		form.useFormData = function useFormDataImpl(selector) {
			return useFormData(form, selector);
		};

		return form;
	}

	const form = getForm();

	watch(
		() => toValue(options),
		(newOptions) => {
			const { form: optionsForm, ...otherOptions } = newOptions;

			form.updateOptions({
				...optionsForm?.options,
				...clearUndefinedProperties(otherOptions),
			});
		}
	);

	const unmount = form.mount();
	onBeforeUnmount(unmount);

	provideForm(form);

	return form;
}
