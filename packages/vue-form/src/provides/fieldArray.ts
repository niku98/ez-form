/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { FieldArrayInstance } from "@niku/ez-form-core";
import { getCurrentInstance, inject, provide } from "vue";

export interface InjectedFieldArrayData<
	FieldValue = unknown,
	FormValues = unknown
> {
	fieldArray: FieldArrayInstance<FieldValue, FormValues>;
}

export const $fieldArrayInjectKey = Symbol("ez-form-vue-field-array");

export function useInjectFieldArray<
	FieldValue = unknown,
	FormValues = unknown
>() {
	const instance = getCurrentInstance() as any;

	const injected = (instance.provides[$fieldArrayInjectKey] ??
		inject($fieldArrayInjectKey)) as InjectedFieldArrayData;

	if (!injected) {
		throw new Error(
			"[useInjectFieldArray] must be used after or inside [useFieldArray]"
		);
	}

	return injected.fieldArray as FieldArrayInstance<FieldValue, FormValues>;
}

export function provideFieldArray<F extends FieldArrayInstance<any, any>>(
	fieldArray: F
) {
	provide($fieldArrayInjectKey, { fieldArray });
}
