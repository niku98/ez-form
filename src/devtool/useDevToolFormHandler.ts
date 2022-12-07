import { devtoolInstance } from "@/devtool/setupDevtool";
import { PrivateFormInstance } from "@/models/PrivateInstances";
import { onBeforeUnmount, watch } from "vue";

export default function useDevtoolFormHandler(
	formInstance: PrivateFormInstance
) {
	if (!window.EZ_FORM_DEVTOOL) {
		return;
	}

	devtoolInstance?.addForm(formInstance.meta.name, formInstance);

	watch(
		() => formInstance.meta.name,
		(name, old) => {
			if (old && name) {
				devtoolInstance.updateFormName(old, name);
			}
		}
	);

	watch(
		() => formInstance.meta.values,
		() => {
			devtoolInstance.sendInspectorState();
		}
	);

	onBeforeUnmount(() => {
		devtoolInstance.removeForm(formInstance.meta.name);
	});
}
