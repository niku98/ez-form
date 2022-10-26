import FormVue from "@/components/Form.vue";
import FormItemVue from "@/components/FormItem.vue";
import FormListVue from "@/components/FormList.vue";

declare module "@vue/runtime-core" {
	export interface GlobalComponents {
		NkForm: typeof FormVue;
		NkFormItem: typeof FormItemVue;
		NkFormList: typeof FormListVue;
	}
}
