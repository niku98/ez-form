import {
	PrivateFormInstance,
	PrivateFormItemInstance,
	PrivateFormListInstance,
} from "@/models/PrivateInstances";

export interface DevtoolInstance {
	addForm(name: string, instance: PrivateFormInstance): void;
	removeForm(name: string): void;
	updateFormName(old: string, name: string): void;

	addFormItem(
		form: string,
		name: string,
		instance: PrivateFormItemInstance
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
		instance: PrivateFormListInstance
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
	instance: PrivateFormInstance;
}

export interface DevtoolFormItemData {
	type: DevToolDataType.Item;
	name: string;
	instance: PrivateFormItemInstance;
	form: string;
}

export interface DevtoolFormListData {
	type: DevToolDataType.List;
	name: string;
	instance: PrivateFormListInstance;
	form: string;
}

export type DevToolNodeData =
	| DevtoolFormData
	| DevtoolFormItemData
	| DevtoolFormListData;
