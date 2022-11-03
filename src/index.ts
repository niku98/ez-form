import { PluginOptions } from "@/models";
import { $ezFormPluginInjectKey } from "@/utilities/constants";
import { Plugin } from "vue";

export * from "./components";
export * from "./composables";
export * from "./models";

const defaultOptions: PluginOptions = {};

const EzFormPlugin: Plugin = {
	install(app, options?: typeof defaultOptions) {
		const extendedOptions = Object.assign(defaultOptions, options);

		if (extendedOptions.validateMessages) {
			app.provide($ezFormPluginInjectKey, extendedOptions);
		}

		import("@/components").then(({ EzForm, EzFormItem, EzFormList }) => {
			app.component("EzForm", EzForm);
			app.component("EzFormItem", EzFormItem);
			app.component("EzFormList", EzFormList);
		});
	},
};

export default EzFormPlugin;
