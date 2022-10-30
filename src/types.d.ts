import FormVue from "@/components/Form.vue";
import FormItemVue from "@/components/FormItem.vue";
import FormListVue from "@/components/FormList.vue";

declare module "@vue/runtime-core" {
	export interface GlobalComponents {
		EzForm: typeof FormVue;
		EzFormItem: typeof FormItemVue;
		EzFormList: typeof FormListVue;
	}
}
