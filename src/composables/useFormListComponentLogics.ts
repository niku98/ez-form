import useFormList from "@/composables/useFormList";
import useInjectForm from "@/composables/useInjectForm";
import {
	FormInstance,
	FormItemEmitter,
	FormListInstance,
	FormListProps,
} from "@/models";
import { PrivateFormListInstance } from "@/models/PrivateInstances";
import { clone, debounce, provideFormListInstance } from "@/utilities";
import { watch } from "vue";

interface UseFormListComponentLogicsResult {
	formListInstance: FormListInstance;
	formInstance: FormInstance;
}

export default function useFormListComponentLogics(
	props: FormListProps,
	emit: FormItemEmitter
): UseFormListComponentLogicsResult {
	const injectedForm = useInjectForm();
	const formListInstance = (props.formList ??
		useFormList(props)) as PrivateFormListInstance;

	if (props.formList) {
		formListInstance.unRegisterFormField();
		formListInstance.updateProps(props);
		formListInstance.registerFormField(injectedForm);

		watch(
			props,
			debounce(() => {
				formListInstance.updateProps(props);
			}, 500)
		);
	}

	// Handle emit event
	watch(
		() => formListInstance.meta.rawValue,
		(value) => {
			emit("change", clone(value), injectedForm);
		}
	);

	provideFormListInstance(formListInstance);

	return { formListInstance, formInstance: injectedForm };
}
