import { $formInjectKey, FormInjectedValues, FormInstance } from "@/models";
import { inject, reactive } from "vue";

export default function useForm<
	Values extends object = Record<string | number | symbol, any>
>(form?: FormInstance<Values>): FormInstance<Values> {
	if (form) {
		return form;
	}

	const injectedForm = inject<FormInjectedValues>($formInjectKey);

	if (injectedForm) {
		return injectedForm;
	}

	const formValues = reactive<Values>({} as Values) as Values;
	const errors = reactive<FormInstance["errors"]>([]);

	/**
	 * Just some empty functions
	 * All of them will be replaced later
	 */
	function reset() {}
	function submit() {}
	function setFieldValue() {}
	function getFieldValue() {}
	async function validate() {}
	function isDirty() {
		return false;
	}

	const formInstance: FormInstance<Values> = {
		values: formValues,
		errors,
		submit,
		reset,
		setFieldValue,
		getFieldValue,
		validate,
		isDirty,
	};

	return formInstance;
}
