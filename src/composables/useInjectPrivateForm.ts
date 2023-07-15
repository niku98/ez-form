import useInjectForm from "@/composables/useInjectForm";
import type { PrivateFormInstance } from "@/models/PrivateInstances";

export default function useInjectPrivateForm() {
	const injectedForm = useInjectForm();

	if (injectedForm.__IS_FAKE__) {
		Object.assign(injectedForm, {
			fields: {},
		});
	}

	return injectedForm as PrivateFormInstance;
}
