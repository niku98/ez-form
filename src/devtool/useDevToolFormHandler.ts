import { devtoolInstance } from "@/devtool/setupDevtool";
import type { PrivateFormInstance } from "@/models/PrivateInstances";
import { uniqueId } from "@/utilities";
import { getCurrentInstance, onBeforeUnmount, watch } from "vue";

export default function useDevtoolFormHandler(
	formInstance: PrivateFormInstance
) {
	if (!window.EZ_FORM_DEVTOOL) {
		return;
	}

	const componentInstance = getCurrentInstance();

	devtoolInstance?.addForm(
		formInstance.meta.name,
		formInstance,
		componentInstance?.uid?.toString?.() ?? uniqueId()
	);

	watch(
		() => formInstance.meta.name,
		(name, old) => {
			if (old && name) {
				devtoolInstance.updateFormName(old, name);
			}
		}
	);

	watch(
		() => [formInstance.meta.values, formInstance.meta.errors],
		() => {
			devtoolInstance.sendInspectorState();
		}
	);

	onBeforeUnmount(() => {
		devtoolInstance.removeForm(formInstance.meta.name);
	});
}
