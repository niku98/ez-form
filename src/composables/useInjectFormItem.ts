import type { FieldMeta, FormItemInstance } from "@/models";
import type { PrivateFormItemInstance } from "@/models/PrivateInstances";
import { uniqueId } from "@/utilities";
import { $formItemInjectKey } from "@/utilities/constants";
import { computed, getCurrentInstance, inject, reactive } from "vue";

const getFaked = (): PrivateFormItemInstance => ({
	__IS_FAKE__: true,
	props: {},
	handleChange() {},
	handleBlur() {},
	updateProps() {},
	reset() {},
	registerFormField() {},
	unRegisterFormField() {},
	clearValidate() {},
	async validate() {
		return {};
	},
	meta: reactive<FieldMeta>({
		rawValue: undefined,
		transformedValue: undefined,
		name: uniqueId(),
		id: uniqueId(),
		formName: uniqueId(),
		error: undefined,
		dirty: false,
		touched: false,
	}),

	requiredMarkString: computed(() => ""),
});

export default function useInjectFormItem() {
	const instance = getCurrentInstance() as any;

	const injectedFormItem =
		(instance.provides[$formItemInjectKey] as FormItemInstance) ??
		inject<FormItemInstance>($formItemInjectKey, getFaked());

	return injectedFormItem;
}
