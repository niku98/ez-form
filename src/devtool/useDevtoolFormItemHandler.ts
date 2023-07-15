import { devtoolInstance } from "@/devtool/setupDevtool";
import type { PrivateFormItemInstance } from "@/models/PrivateInstances";
import { castNamePathToString, uniqueId } from "@/utilities";
import { getCurrentInstance, onBeforeUnmount, watch } from "vue";

export default function useDevtoolFormItemHandler(
	formItemInstance: PrivateFormItemInstance
) {
	if (!window.EZ_FORM_DEVTOOL) {
		return () => {
			return () => {};
		};
	}

	const componentInstance = getCurrentInstance();

	onBeforeUnmount(() => {
		if (formItemInstance.meta.name) {
			devtoolInstance.removeFormList(
				formItemInstance.meta.formName,
				castNamePathToString(formItemInstance.meta.name)
			);
		}
	});

	return () => {
		if (!window.EZ_FORM_DEVTOOL) {
			return () => {};
		}

		const formName = formItemInstance.meta.formName;
		const formItemName = formItemInstance.meta.name;

		if (formItemInstance.meta.name) {
			devtoolInstance.addFormItem(
				formItemInstance.meta.formName,
				castNamePathToString(formItemInstance.meta.name),
				formItemInstance,
				componentInstance?.uid?.toString?.() ?? uniqueId()
			);
		}

		const stopWatchFormItemName = watch(
			() => formItemInstance.meta.name,
			(formItemName, oldFormItemName) => {
				if (formItemInstance.meta.name && formItemName && oldFormItemName) {
					devtoolInstance.updateFormItemName(
						formItemInstance.meta.formName,
						castNamePathToString(oldFormItemName),
						castNamePathToString(formItemName)
					);
				}
			}
		);

		const stopWatchFormName = watch(
			() => formItemInstance.meta.formName,
			(formName, oldFormName) => {
				if (formItemInstance.meta.name) {
					devtoolInstance.updateFormItemForm(
						castNamePathToString(formItemInstance.meta.name),
						oldFormName,
						formName
					);
				}
			}
		);

		const stopWatchValue = watch(
			[
				() => formItemInstance.meta.rawValue,
				() => formItemInstance.meta.touched,
			],
			() => {
				devtoolInstance.sendInspectorState();
			}
		);

		return () => {
			if (formItemName) {
				devtoolInstance.removeFormItem(
					formName,
					castNamePathToString(formItemName)
				);
			}

			stopWatchFormItemName();
			stopWatchFormName();
			stopWatchValue();
		};
	};
}
