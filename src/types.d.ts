import FormVue from "@/components/EzForm.vue";
import FormItemVue from "@/components/EzFormItem.vue";
import FormListVue from "@/components/EzFormList.vue";

declare module "@vue/runtime-core" {
	export interface GlobalComponents {
		EzForm: typeof FormVue;
		EzFormItem: typeof FormItemVue;
		EzFormList: typeof FormListVue;
	}
}
