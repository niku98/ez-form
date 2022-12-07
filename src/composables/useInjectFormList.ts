import { FieldMeta, FormListInstance } from "@/models";
import { PrivateFormListInstance } from "@/models/PrivateInstances";
import { uniqueId } from "@/utilities";
import { $formListInjectKey } from "@/utilities/constants";
import { computed, getCurrentInstance, inject, reactive } from "vue";

const getFaked = (): PrivateFormListInstance => ({
	__IS_FAKE__: true,
	props: { name: "" },
	async validate() {},
	clearValidate() {},
	registerFormField() {},
	unRegisterFormField() {},
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
	fields: computed(() => []),
	namePrefix: computed(() => []),
	listValues: computed(() => []),
	errors: computed(() => []),
	swap() {},
	updateProps() {},
	resetItem() {},
	reset() {},
	getItemFields() {
		return [];
	},
	clearItemValidate() {},
	replace() {},
	removeByKey() {},
	remove() {},
	move() {},
	hasError() {
		return false;
	},
	getNamePath() {
		return "";
	},
	getErrors() {
		return [];
	},
	add() {},
});

export default function useInjectFormList() {
	const instance = getCurrentInstance() as any;

	const injectedFormList =
		(instance.provides[$formListInjectKey] as FormListInstance) ??
		inject<FormListInstance>($formListInjectKey, getFaked());

	return injectedFormList;
}
