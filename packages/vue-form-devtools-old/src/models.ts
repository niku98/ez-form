import type {
	FieldArrayInstance,
	FieldInstance,
	FormInstance,
} from "@niku/ez-form-core";

export interface DevtoolInstance {
	addForm(name: string, instance: FormInstance, componentUid: string): void;
	removeForm(name: string): void;
	updateFormName(old: string, name: string): void;

	addFormItem(
		form: string,
		name: string,
		instance: FieldInstance<unknown, unknown>,
		componentUid: string
	): void;
	removeFormItem(form: string, name: string): void;
	updateFormItemName(form: string, old: string, name: string): void;
	updateFormItemForm(
		formItemName: string,
		oldForm: string,
		newForm: string
	): void;

	addFormList(
		form: string,
		name: string,
		instance: FieldArrayInstance<unknown, unknown>,
		componentUid: string
	): void;
	removeFormList(form: string, name: string): void;
	updateFormListName(form: string, old: string, name: string): void;
	updateFormListForm(
		formListName: string,
		oldForm: string,
		newForm: string
	): void;

	sendInspectorTree(): void;
	sendInspectorState(): void;
}

export enum DevToolDataType {
	Form = "form",
	Item = "item",
	List = "list",
}

export interface DevtoolFormData {
	type: DevToolDataType.Form;
	name: string;
	instance: FormInstance;
	componentUid: string;
}

export interface DevtoolFormItemData {
	type: DevToolDataType.Item;
	name: string;
	instance: FieldArrayInstance<unknown, unknown>;
	form: string;
	componentUid: string;
}

export interface DevtoolFormListData {
	type: DevToolDataType.List;
	name: string;
	instance: FieldArrayInstance<unknown, unknown>;
	form: string;
	componentUid: string;
}

export type DevToolNodeData =
	| DevtoolFormData
	| DevtoolFormItemData
	| DevtoolFormListData;
