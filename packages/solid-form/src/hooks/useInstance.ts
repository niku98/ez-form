import {
	GlobalInstances,
	getFieldArrayInstance,
	getFieldInstance,
	getFormInstance,
	type GetKeys,
} from "@niku/ez-form-core";
import { createSignal } from "solid-js";

export function useFormInstance<Values>(formName: string) {
	const [instance, setInstance] = createSignal(
		getFormInstance<Values>(formName)
	);

	GlobalInstances.on("change", () => {
		setInstance(getFormInstance<Values>(formName));
	});

	return instance;
}

export function useFieldInstance<
	Values,
	N extends GetKeys<Values> = GetKeys<Values>
>(formName: string, fieldName: N) {
	const [instance, setInstance] = createSignal(
		getFieldInstance<Values, N>(formName, fieldName)
	);

	GlobalInstances.on("change", () => {
		setInstance(getFieldInstance<Values, N>(formName, fieldName));
	});

	return instance;
}

export function useFieldArrayInstance<
	Values,
	N extends GetKeys<Values> = GetKeys<Values>
>(formName: string, fieldName: N) {
	const [instance, setInstance] = createSignal(
		getFieldArrayInstance<Values, N>(formName, fieldName)
	);

	GlobalInstances.on("change", () => {
		setInstance(getFieldArrayInstance<Values, N>(formName, fieldName));
	});

	return instance;
}
