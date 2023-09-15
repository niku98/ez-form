/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { FormInstance } from "@niku/ez-form-core";
import { getCurrentInstance, inject, provide } from "vue";

export interface InjectedFormData<FormValues = unknown> {
	form: FormInstance<FormValues>;
}

export const $formInjectKey = Symbol("ez-form-vue-form");

export function useInjectForm<FormValues = unknown>() {
	const instance = getCurrentInstance() as any;

	const injected = (instance.provides[$formInjectKey] ??
		inject($formInjectKey)) as InjectedFormData;

	if (!injected) {
		throw new Error("[useInjectForm] must be used after or inside [useForm]");
	}

	return injected.form as FormInstance<FormValues>;
}

export function provideForm<F extends FormInstance<any>>(form: F) {
	provide($formInjectKey, { form });
}
