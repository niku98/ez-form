/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { FieldInstance } from "@niku/ez-form-core";
import { getCurrentInstance, inject, provide } from "vue";

export interface InjectedFieldData<FieldValue = unknown, FormValues = unknown> {
	field: FieldInstance<FieldValue, FormValues>;
}

export const $fieldInjectKey = Symbol("ez-form-vue-field");

export function useInjectField<FieldValues = unknown, FormValues = unknown>() {
	const instance = getCurrentInstance() as any;

	const injected = (instance.provides[$fieldInjectKey] ??
		inject($fieldInjectKey)) as InjectedFieldData;

	if (!injected) {
		throw new Error("[useInjectField] must be used after or inside [useField]");
	}

	return injected.field as FieldInstance<FieldValues, FormValues>;
}

export function provideField<F extends FieldInstance<any, any>>(field: F) {
	provide($fieldInjectKey, { field });
}
