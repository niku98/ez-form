import useFormFieldHelpers from "@/composables/useFormFieldHelpers";
import useDevtoolFormListHandler from "@/devtool/useDevtoolFormListHandler";
import type {
	FieldMeta,
	FormInstance,
	FormListInstance,
	FormListProps,
	NamePath,
	ValidateError,
} from "@/models";
import type { PrivateFormListInstance } from "@/models/PrivateInstances";
import {
	castNamePathToString,
	castPath,
	globalFormInstances,
	objectValues,
} from "@/utilities";
import { computed, onBeforeUnmount, ref, watch } from "vue";

export default function useFormList(
	inputProps?: FormListProps
): FormListInstance {
	const formFieldHelpers = useFormFieldHelpers(inputProps);
	const {
		fieldMeta: meta,
		handleChange,
		requiredMarkString,
		validate,
		resetFieldMeta,
		clearValidate,
		updateProps,
		props,
		injectedForm,
	} = formFieldHelpers;

	const listValues = computed<any[]>(() => {
		return meta.transformedValue && Array.isArray(meta.transformedValue)
			? meta.transformedValue
			: [];
	});

	const namePrefix = computed(() =>
		Array.isArray(props.name) ? props.name : props.name ? [props.name] : []
	);

	const fields = computed(() => {
		return listValues.value.map((_, index) => {
			return {
				key: castNamePathToString([...namePrefix.value, index]),
				index,
				getNamePath(name: NamePath) {
					return castNamePathToString([
						...namePrefix.value,
						index,
						...castPath(name),
					]);
				},
			};
		});
	});

	function getItemFields(index: number) {
		return objectValues(injectedForm.fields).filter(({ name }) => {
			return castNamePathToString(name).includes(
				castNamePathToString([...namePrefix.value, index]) + "."
			);
		});
	}

	function resetItem(index: number) {
		getItemFields(index).forEach((field) => {
			field.reset();
		});
	}

	function clearItemValidate(index: number) {
		getItemFields(index).forEach((field) => {
			field.clearValidate();
		});
	}

	function getNamePath(index: number, name: NamePath) {
		name = Array.isArray(name) ? name : [name];

		return castNamePathToString([...namePrefix.value, index, ...name]);
	}

	function getErrors(index?: number) {
		if (index === undefined) {
			return injectedForm.meta.errors;
		}

		return getItemFields(index)
			.map(({ error }) => error)
			.filter((error) => !!error) as ValidateError[];
	}

	function hasError(index: number) {
		return getErrors(index).length > 0;
	}

	function add(newValue?: any) {
		const array = [...listValues.value];

		array.push(newValue);

		handleChange(array);
	}

	function insert(index: number, newValue?: any) {
		const array = [...listValues.value];

		array.splice(index, 0, newValue);

		handleChange(array);
	}

	function unshift(newValue?: any) {
		const array = [...listValues.value];

		array.unshift(newValue);

		handleChange(array);
	}

	function pop() {
		const array = [...listValues.value];

		const result = array.pop();

		handleChange(array);

		return result;
	}

	function shift() {
		const array = [...listValues.value];

		const result = array.shift();

		handleChange(array);

		return result;
	}

	function remove(index: number) {
		const array = [...listValues.value];

		array.splice(index, 1);

		handleChange(array);
	}

	function removeByKey(key: string, value: any) {
		const array = [...listValues.value];

		const index = array.findIndex((item) => item[key] === value);

		if (index > -1) {
			array.splice(index, 1);
		}

		handleChange(array);
	}

	function replace(index: number, newValue: any) {
		const array = [...listValues.value];

		array[index] = newValue;

		handleChange(array);
	}

	function swap(firstIndex: number, secondIndex: number) {
		const array = [...listValues.value];

		const temp = array[firstIndex];
		array[firstIndex] = array[secondIndex];
		array[secondIndex] = temp;

		handleChange(array);
	}

	function move(fromIndex: number, toIndex: number) {
		const array = [...listValues.value];

		const temp = array[fromIndex];
		array.splice(fromIndex, 1);
		array.splice(toIndex, 0, temp);

		handleChange(array);
	}

	const formListInstance: PrivateFormListInstance = {
		props: props as FormListProps,
		meta,
		requiredMarkString,
		listValues,
		namePrefix,
		fields,
		reset: resetFieldMeta,
		registerFormField,
		unRegisterFormField,
		updateProps,
		getItemFields,
		resetItem,
		clearItemValidate,
		validate,
		clearValidate,
		getNamePath,
		getErrors,
		hasError,
		add,
		insert,
		unshift,
		pop,
		shift,
		remove,
		removeByKey,
		replace,
		swap,
		move,
	};

	const removeGlobalInstance = ref(() => {});
	const registerGlobalInstance = useRegisterGlobalInstance(
		meta,
		formListInstance
	);

	// Handle devtool
	const registerDevtool = ref<Function>(() => {
		return () => {};
	});
	const unRegisterDevtool = ref<Function>(() => {});

	if (process.env.NODE_ENV === "development" || __VUE_PROD_DEVTOOLS__) {
		registerDevtool.value = useDevtoolFormListHandler(formListInstance);
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
		}
	);

	onBeforeUnmount(() => {
		unRegisterFormField();
	});

	return formListInstance;
}

function useRegisterGlobalInstance(
	fieldMeta: FieldMeta,
	formListInstance: FormListInstance
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
		globalForm.lists && delete globalForm.lists[nameString];
	});

	return () => {
		const formName = fieldMeta.formName;
		const fieldName = fieldMeta.formName;

		const stopWatchFormListName = watch(
			() => fieldMeta.name,
			(newName, oldName) => {
				if (!globalFormInstances[fieldMeta.formName]) {
					globalFormInstances[fieldMeta.formName] = {};
				}

				const globalForm = globalFormInstances[fieldMeta.formName];
				if (!globalForm) {
					return;
				}

				if (oldName) {
					const oldNameString = castNamePathToString(oldName);
					globalForm.lists && delete globalForm.lists[oldNameString];
				}
				if (!newName) {
					return;
				}

				const newNameString = castNamePathToString(newName);

				if (globalForm.lists) {
					globalForm.lists[newNameString] = formListInstance;
				} else {
					globalForm.lists = {
						[newNameString]: formListInstance,
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
			globalForm.lists && delete globalForm.lists[nameString];

			stopWatchFormListName();
		};
	};
}
