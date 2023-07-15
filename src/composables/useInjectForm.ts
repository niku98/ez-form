import type { FormInstance, FormMeta } from "@/models";
import { uniqueId } from "@/utilities";
import { $formInjectKey } from "@/utilities/constants";
import { getCurrentInstance, inject, reactive } from "vue";

export default function useInjectForm() {
	const instance = getCurrentInstance() as any;

	const injectedForm =
		(instance.provides[$formInjectKey] as FormInstance) ??
		inject<FormInstance<any>>($formInjectKey, {
			__IS_FAKE__: true,
			addField() {},
			removeField() {},
			updateSettings() {},
			getFieldValue() {},
			setFieldValue() {},
			reset() {},
			clearValidate() {},
			async validate() {
				return {};
			},
			submit() {
				return undefined as any;
			},
			isDirty() {
				return false;
			},
			meta: reactive<FormMeta>({
				values: undefined,
				name: uniqueId(),
				errors: [],
				dirty: false,
			}),
			classPrefix: "",
		});

	return injectedForm;
}
