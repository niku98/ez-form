import { Plugin } from "vue";

import Form from "@/components/Form.vue";
import FormItem from "@/components/FormItem.vue";
import FormList from "@/components/FormList.vue";
import { PluginOptions } from "@/models";
import { $nkFormInjectKey } from "@/utilities/constants";
export * from "./models";
export { Form, FormItem, FormList };

const defaultOptions: PluginOptions = {};

const Vue3Form: Plugin = {
	install(app, options?: typeof defaultOptions) {
		const extendedOptions = Object.assign(defaultOptions, options);

		if (extendedOptions.validateMessages) {
			app.provide($nkFormInjectKey, extendedOptions);
		}

		app.component("NkForm", Form);
		app.component("NkFormItem", FormItem);
		app.component("NkFormList", FormList);
	},
};

export default Vue3Form;
