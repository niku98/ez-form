import {
	FieldArrayInstance,
	FieldInstance,
	FormInstance,
	GlobalInstances,
	getFieldArrayInstance,
	getFieldInstance,
	getFormInstance,
	type GetKeys,
	type GetType,
} from "@niku/ez-form-core";
import { useSyncExternalStore } from "use-sync-external-store/shim";

export function useFormInstance<Values>(formName: string) {
	return useSyncExternalStore<FormInstance<Values> | undefined>(
		(listener) => {
			return GlobalInstances.on("change", listener);
		},
		() => getFormInstance(formName),
		() => getFormInstance(formName)
	);
}

export function useFieldInstance<
	Values,
	N extends GetKeys<Values> = GetKeys<Values>
>(formName: string, fieldName: N) {
	return useSyncExternalStore<
		FieldInstance<GetType<Values, N>, Values> | undefined
	>(
		(listener) => {
			return GlobalInstances.on("change", listener);
		},
		() => getFieldInstance(formName, fieldName),
		() => getFieldInstance(formName, fieldName)
	);
}

export function useFieldArrayInstance<
	Values,
	N extends GetKeys<Values> = GetKeys<Values>
>(formName: string, fieldName: N) {
	return useSyncExternalStore<
		FieldArrayInstance<GetType<Values, N>, Values> | undefined
	>(
		(listener) => {
			return GlobalInstances.on("change", listener);
		},
		() => getFieldArrayInstance(formName, fieldName),
		() => getFieldArrayInstance(formName, fieldName)
	);
}
