import useInjectForm from "@/composables/useInjectForm";
import { FormItemEmitter, FormItemInstance } from "@/models";
import { clone } from "@/utilities";
import { watch } from "vue";

export default function useHandleFormItemEmit(
	formItem: Pick<FormItemInstance, "meta">,
	emit: FormItemEmitter
) {
	const injectedForm = useInjectForm();

	watch(
		() => formItem.meta.rawValue,
		(value) => {
			emit("change", clone(value), injectedForm);
		}
	);
}
