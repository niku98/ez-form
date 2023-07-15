import type {
	FormInstance,
	FormItemInstance,
	FormListInstance,
} from "@/models";
import { reactive } from "vue";

export const $ezFormPluginInjectKey = Symbol("ezFormInjectKey");

export const $formInjectKey = Symbol();
export const $formItemInjectKey = Symbol();
export const $formListInjectKey = Symbol();

export const $formInstancesInjectKey = Symbol();
export const globalFormInstances = reactive<
	Record<
		string,
		| undefined
		| {
				instance?: FormInstance;
				items?: Record<string, FormItemInstance | undefined>;
				lists?: Record<string, FormListInstance | undefined>;
		  }
	>
>({});
