import { EzForm, EzFormItem, EzFormList } from "./index";

declare module "@vue/runtime-core" {
	export interface GlobalComponents {
		EzForm: typeof EzForm;
		EzFormItem: typeof EzFormItem;
		EzFormList: typeof EzFormList;
	}
}
