import useFormItem from "@/composables/useFormItem";
import useInjectForm from "@/composables/useInjectForm";
import type {
	FormInstance,
	FormItemEmitter,
	FormItemInstance,
	FormItemProps,
} from "@/models";
import type { PrivateFormItemInstance } from "@/models/PrivateInstances";
import { clone, debounce, provideFormItemInstance } from "@/utilities";
import { watch } from "vue";

interface UseFormItemComponentLogicsProps extends FormItemProps {
	changeEventPropName?: string;
	blurEventPropName: string;
	valuePropName: string;
}

interface UseFormItemComponentLogicsResult {
	formItemInstance: FormItemInstance;
	formInstance: FormInstance;
}

export default function useFormItemComponentLogics(
	props: UseFormItemComponentLogicsProps,
	emit: FormItemEmitter
): UseFormItemComponentLogicsResult {
	const injectedForm = useInjectForm();
	const formItemInstance = (props.formItem ??
		useFormItem(props)) as PrivateFormItemInstance;

	if (props.formItem) {
		formItemInstance.unRegisterFormField();
		formItemInstance.updateProps({
			...props,
			name: formItemInstance.props.name ?? props.name,
		});
		formItemInstance.registerFormField(injectedForm);

		watch(
			props,
			debounce(() => {
				formItemInstance.updateProps(props);
			}, 500)
		);
	}

	// Handle emit event
	watch(
		() => formItemInstance.meta.rawValue,
		(value) => {
			emit("change", clone(value), injectedForm);
		}
	);

	provideFormItemInstance(formItemInstance);

	return { formItemInstance, formInstance: injectedForm };
}
