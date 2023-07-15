import { devtoolInstance } from "@/devtool/setupDevtool";
import type { PrivateFormListInstance } from "@/models/PrivateInstances";
import { castNamePathToString, uniqueId } from "@/utilities";
import { getCurrentInstance, onBeforeUnmount, watch } from "vue";
export default function useDevtoolFormListHandler(
	formListInstance: PrivateFormListInstance
) {
	if (!window.EZ_FORM_DEVTOOL) {
		return () => {
			return () => {};
		};
	}

	const componentInstance = getCurrentInstance();

	onBeforeUnmount(() => {
		if (formListInstance.meta.name) {
			devtoolInstance.removeFormList(
				formListInstance.meta.formName,
				castNamePathToString(formListInstance.meta.name)
			);
		}
	});

	return () => {
		if (!window.EZ_FORM_DEVTOOL) {
			return () => {};
		}

		const formName = formListInstance.meta.formName;
		const formListName = formListInstance.meta.name;

		if (formListInstance.meta.name) {
			devtoolInstance.addFormList(
				formListInstance.meta.formName,
				castNamePathToString(formListInstance.meta.name),
				formListInstance,
				componentInstance?.uid?.toString?.() ?? uniqueId()
			);
		}

		const stopWatchFormItemName = watch(
			() => formListInstance.meta.name,
			(formItemName, oldFormItemName) => {
				if (formListInstance.meta.name && formItemName && oldFormItemName) {
					devtoolInstance.updateFormListName(
						formListInstance.meta.formName,
						castNamePathToString(oldFormItemName),
						castNamePathToString(formItemName)
					);
				}
			}
		);

		const stopWatchFormName = watch(
			() => formListInstance.meta.formName,
			(formName, oldFormName) => {
				if (formListInstance.meta.name) {
					devtoolInstance.updateFormListForm(
						castNamePathToString(formListInstance.meta.name),
						oldFormName,
						formName
					);
				}
			}
		);

		const stopWatchValue = watch(
			() => formListInstance.meta.rawValue,
			() => {
				devtoolInstance.sendInspectorState();
			}
		);

		return () => {
			if (formListName) {
				devtoolInstance.removeFormList(
					formName,
					castNamePathToString(formListName)
				);
			}

			stopWatchFormItemName();
			stopWatchFormName();
			stopWatchValue();
		};
	};
}
