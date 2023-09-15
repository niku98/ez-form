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
import { ref, type Ref } from "vue";

export function useFormInstance<Values>(formName: string) {
	const instance = ref<FormInstance<Values> | undefined>(
		getFormInstance(formName)
	) as Ref<FormInstance<Values> | undefined>;

	GlobalInstances.on("change", () => {
		instance.value = getFormInstance(formName);
	});

	return instance;
}

export function useFieldInstance<
	Values,
	N extends GetKeys<Values> = GetKeys<Values>
>(formName: string, fieldName: N) {
	const instance = ref<FieldInstance<GetType<Values, N>, Values> | undefined>(
		getFieldInstance(formName, fieldName)
	) as Ref<FieldInstance<GetType<Values, N>, Values> | undefined>;
	GlobalInstances.on("change", () => {
		instance.value = getFieldInstance(formName, fieldName);
	});

	return instance;
}

export function useFieldArrayInstance<
	Values,
	N extends GetKeys<Values> = GetKeys<Values>
>(formName: string, fieldName: N) {
	const instance = ref<
		FieldArrayInstance<GetType<Values, N>, Values> | undefined
	>(getFieldArrayInstance(formName, fieldName)) as Ref<
		FieldArrayInstance<GetType<Values, N>, Values> | undefined
	>;
	GlobalInstances.on("change", () => {
		instance.value = getFieldArrayInstance(formName, fieldName);
	});

	return instance;
}
