import useCreateFormItemInstance from "@/composables/useFormFieldHelpers";
import useDevtoolFormItemHandler from "@/devtool/useDevtoolFormItemHandler";
import type {
	FieldMeta,
	FormInstance,
	FormItemInstance,
	FormItemProps,
	NamePath,
} from "@/models";
import type { PrivateFormItemInstance } from "@/models/PrivateInstances";
import { castNamePathToString, globalFormInstances } from "@/utilities";
import { onBeforeUnmount, ref, watch } from "vue";

export default function useFormItem(
	inputProps?: FormItemProps
): FormItemInstance {
	const formFieldHelpers = useCreateFormItemInstance(inputProps);
	const {
		fieldMeta,
		validate,
		requiredMarkString,
		handleBlur,
		handleChange,
		resetFieldMeta,
		clearValidate,
		updateProps,
		props,
	} = formFieldHelpers;

	const formItemInstance: PrivateFormItemInstance = {
		reset: resetFieldMeta,
		meta: fieldMeta,
		handleBlur,
		validate,
		handleChange,
		clearValidate,
		requiredMarkString,
		registerFormField,
		unRegisterFormField,
		updateProps,
		props,
	};

	// Handle register global instance
	const removeGlobalInstance = ref(() => {});
	const registerGlobalInstance = useRegisterGlobalInstance(
		fieldMeta,
		formItemInstance
	);

	// Handle devtool
	const registerDevtool = ref<Function>(() => {
		return () => {};
	});
	const unRegisterDevtool = ref<Function>(() => {});

	if (process.env.NODE_ENV === "development" || __VUE_PROD_DEVTOOLS__) {
		registerDevtool.value = useDevtoolFormItemHandler(formItemInstance);
	}

	function registerFormField(formInstance?: FormInstance) {
		unRegisterDevtool.value();
		removeGlobalInstance.value();

		formFieldHelpers.registerFormField(formInstance);
		unRegisterDevtool.value = registerDevtool.value();
		removeGlobalInstance.value = registerGlobalInstance();
	}

	function unRegisterFormField(oldName?: NamePath) {
		formFieldHelpers.unRegisterFormField(oldName);
		unRegisterDevtool.value();
		removeGlobalInstance.value();
	}

	registerFormField();
	watch(
		() => props.name,
		(_, old) => {
			if (old) {
				unRegisterFormField(old);
			}

			registerFormField();
		},
		{ immediate: true }
	);

	onBeforeUnmount(() => {
		unRegisterFormField();
	});

	return formItemInstance;
}

function useRegisterGlobalInstance(
	fieldMeta: FieldMeta,
	formItemInstance: FormItemInstance
) {
	onBeforeUnmount(() => {
		if (!fieldMeta.name) {
			return;
		}

		const globalForm = globalFormInstances[fieldMeta.formName];
		if (!globalForm) {
			return;
		}

		const nameString = castNamePathToString(fieldMeta.name);
		globalForm.items && delete globalForm.items[nameString];
	});

	return () => {
		const formName = fieldMeta.formName;
		const fieldName = fieldMeta.formName;

		const stopWatchFormItemName = watch(
			() => fieldMeta.name,
			(newName, oldName) => {
				if (!globalFormInstances[fieldMeta.formName]) {
					globalFormInstances[fieldMeta.formName] = {};
				}

				let globalForm = globalFormInstances[fieldMeta.formName];
				if (!globalForm) {
					return;
				}

				if (oldName) {
					const oldNameString = castNamePathToString(oldName);
					globalForm.items && delete globalForm.items[oldNameString];
				}
				if (!newName) {
					return;
				}

				const newNameString = castNamePathToString(newName);

				if (globalForm.items) {
					globalForm.items[newNameString] = formItemInstance;
				} else {
					globalForm.items = {
						[newNameString]: formItemInstance,
					};
				}
			},
			{ immediate: true }
		);

		return () => {
			if (!fieldName) {
				return;
			}

			const globalForm = globalFormInstances[formName];
			if (!globalForm) {
				return;
			}

			const nameString = castNamePathToString(fieldName);
			globalForm.items && delete globalForm.items[nameString];

			stopWatchFormItemName();
		};
	};
}
