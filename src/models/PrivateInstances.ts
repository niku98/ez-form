import type { FormField, FormInstance, FormSettings } from "@/models/Form";
import type { FormItemInstance, FormItemProps } from "@/models/FormItem";
import type { FormListInstance, FormListProps } from "@/models/FormList";
import type { UnwrapRef } from "vue";

export interface PrivateFormInstance<V extends object = any>
	extends FormInstance<V> {
	fields: Record<string, FormField>;
	initialValues: any;
	updateSettings(settings: Partial<FormSettings>, reInitialize?: boolean): void;
}

export interface PrivateFormItemInstance extends FormItemInstance {
	reset: () => void;
	updateProps: (props: Partial<FormItemProps>) => void;
	props: FormItemProps;
}

export interface PrivateFormListInstance extends FormListInstance {
	props: FormListProps;
	reset: () => void;
	resetItem: (index: number) => void;
	getItemFields: (index: number) => UnwrapRef<FormField[]>;
	clearItemValidate: (index: number) => void;
	updateProps: (props: Partial<FormListProps>) => void;
}
