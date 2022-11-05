import { FormInstance } from "@/models";
import { $formInjectKey } from "@/utilities/constants";
import { inject } from "vue";

export default function useInjectForm() {
	const injectedForm = inject<FormInstance<any>>($formInjectKey);

	if (!injectedForm) {
		throw new Error("useInjectForm must be used in EzForm");
	}

	return injectedForm;
}
