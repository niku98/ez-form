import { FormInstance, FormMeta } from "@/models";
import { uniqueId } from "@/utilities";
import { $formInjectKey } from "@/utilities/constants";
import { computed, inject, reactive } from "vue";

export default function useInjectForm() {
	const injectedForm = inject<FormInstance<any>>($formInjectKey, {
		addField() {},
		removeField() {},
		updateSettings() {},
		getFieldValue() {},
		setFieldValue() {},
		reset() {},
		clearValidate() {},
		async validate() {},
		async submit() {},
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
		className: computed(() => ""),
	});

	return injectedForm;
}
