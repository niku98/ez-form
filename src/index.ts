import EzForm from "@/components/EzForm.vue";
import EzFormItem from "@/components/EzFormItem.vue";
import EzFormList from "@/components/EzFormList.vue";
import { PluginOptions } from "@/models";
import { $ezFormPluginInjectKey } from "@/utilities";
import { Plugin } from "vue";

export * from "@/composables";
export {
	getFormDefinePropsObject,
	getFormItemDefinePropsObject,
	getFormListDefinePropsObject,
} from "@/utilities";
export type {
	FormEmitter,
	FormInstance,
	FormItemEmitter,
	FormItemInstance,
	FormItemProps,
	FormItemValueTransformer,
	FormListProps,
	FormSettings,
	NamePath,
	Rule,
	RuleItem,
	Rules,
	ValidateError,
	ValidateMessages,
	ValidateOption,
	ValidateTrigger,
} from "./models";
export { EzForm, EzFormItem, EzFormList };

const defaultOptions: PluginOptions = {};

const EzFormPlugin: Plugin = {
	install(app, options?: typeof defaultOptions) {
		const extendedOptions = Object.assign(defaultOptions, options);

		if (extendedOptions.validateMessages) {
			app.provide($ezFormPluginInjectKey, extendedOptions);
		}

		app.component("EzForm", EzForm);
		app.component("EzFormItem", EzFormItem);
		app.component("EzFormList", EzFormList);
	},
};

export default EzFormPlugin;
