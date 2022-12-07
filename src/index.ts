import EzForm from "@/components/EzForm.vue";
import EzFormErrors from "@/components/EzFormErrors.vue";
import EzFormItem from "@/components/EzFormItem.vue";
import EzFormItemAutoBindingInput from "@/components/EzFormItemAutoBindingInput.vue";
import EzFormList from "@/components/EzFormList.vue";
import { EzFormDevtool, setupDevtool } from "@/devtool";
import { PluginOptions } from "@/models";
import { $ezFormPluginInjectKey } from "@/utilities";
import { Plugin } from "vue";

export * from "@/composables";
export {
	getFormDefinePropsObject,
	getFormInstance,
	getFormItemDefinePropsObject,
	getFormItemInstance,
	getFormListDefinePropsObject,
	getFormListInstance,
	provideFormInstance,
	provideFormItemInstance,
	provideFormListInstance,
} from "@/utilities";
export type {
	FieldMeta,
	FormEmitter,
	FormErrorCallback,
	FormField,
	FormInstance,
	FormItemEmitter,
	FormItemInstance,
	FormItemProps,
	FormItemValueTransformer,
	FormListInstance,
	FormListProps,
	FormMeta,
	FormSettings,
	FormSubmitCallback,
	NamePath,
	PluginOptions,
	Rule,
	RuleItem,
	Rules,
	ValidateError,
	ValidateMessages,
	ValidateOption,
	ValidateTrigger,
} from "./models";
export {
	EzForm,
	EzFormItem,
	EzFormList,
	EzFormDevtool,
	EzFormItemAutoBindingInput,
	EzFormErrors,
};

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
		app.component("EzFormItemAutoBindingInput", EzFormItemAutoBindingInput);
		app.component("EzFormErrors", EzFormErrors);

		setupDevtool(app);
	},
};

export default EzFormPlugin;
