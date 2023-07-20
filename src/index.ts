import EzForm from "@/components/EzForm";
import EzFormErrors from "@/components/EzFormErrors";
import EzFormItem from "@/components/EzFormItem";
import EzFormItemAutoBindingInput from "@/components/EzFormItemAutoBindingInput";
import EzFormList from "@/components/EzFormList";
import { EzFormDevtool, setupDevtool } from "@/devtool";
import type { PluginOptions } from "@/models";
import { $ezFormPluginInjectKey } from "@/utilities";
import type { Plugin } from "vue";

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
	FormItemSlotErrorsProps,
	FormItemSlotExtraProps,
	FormItemSlotProps,
	FormItemValueTransformer,
	FormListInstance,
	FormListProps,
	FormListSlotErrorsProps,
	FormListSlotExtraProps,
	FormListSlotProps,
	FormMeta,
	FormSettings,
	FormSlotProps,
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
	EzFormDevtool,
	EzFormErrors,
	EzFormItem,
	EzFormItemAutoBindingInput,
	EzFormList,
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
