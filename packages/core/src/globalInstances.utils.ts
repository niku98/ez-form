import FieldInstance from "src/Field";
import FieldArrayInstance from "src/FieldArray";
import FormInstance from "src/Form";
import GlobalInstances from "src/GlobalInstances";
import { GetKeys, GetType } from "src/models";

export function getFormInstance<Values = unknown>(
	name: string
): FormInstance<Values> | undefined {
	const group = GlobalInstances.getGroup(name);

	if (group) {
		return group.form;
	}

	return undefined;
}

export function getFieldInstance<
	Values = unknown,
	N extends GetKeys<Values> = GetKeys<Values>
>(
	formName: string,
	fieldName: N
): FieldInstance<GetType<Values, N>, Values> | undefined {
	const group = GlobalInstances.getGroup(formName);

	if (group) {
		const field = group.fields[fieldName];
		return field instanceof FieldInstance ? field : undefined;
	}

	return undefined;
}

export function getFieldArrayInstance<
	Values = unknown,
	N extends GetKeys<Values> = GetKeys<Values>
>(
	formName: string,
	fieldName: N
): FieldArrayInstance<GetType<Values, N>, Values> | undefined {
	const group = GlobalInstances.getGroup(formName);

	if (group) {
		const field = group.fields[fieldName];
		return field instanceof FieldArrayInstance ? field : undefined;
	}

	return undefined;
}
