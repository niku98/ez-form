import { Plugin } from "vue";

import Form from "@/components/Form.vue";
import FormItem from "@/components/FormItem.vue";
import FormList from "@/components/FormList.vue";
import { PluginOptions } from "@/models";
import { $ezFormInjectKey } from "@/utilities/constants";
export * from "./models";
export { Form as EzForm, FormItem as EzFormItem, FormList as EzFormList };

const defaultOptions: PluginOptions = {};

const EzFormPlugin: Plugin = {
	install(app, options?: typeof defaultOptions) {
		const extendedOptions = Object.assign(defaultOptions, options);

		if (extendedOptions.validateMessages) {
			app.provide($ezFormInjectKey, extendedOptions);
		}

		app.component("EzForm", Form);
		app.component("EzFormItem", FormItem);
		app.component("EzFormList", FormList);
	},
};

export default EzFormPlugin;
