import useEzFormPluginOptions from "@/composables/usePluginOptions";
import useDevtoolFormHandler from "@/devtool/useDevToolFormHandler";
import type {
	FormErrorCallback,
	FormField,
	FormInstance,
	FormItemInstance,
	FormListInstance,
	FormMeta,
	FormSettings,
	FormSubmitCallback,
	NamePath,
	ValidateError,
	ValidateOption,
} from "@/models";
import type { PrivateFormInstance } from "@/models/PrivateInstances";
import {
	castNamePathToString,
	castPath,
	castToArray,
	clearObject,
	clone,
	debounce,
	deleteFrom,
	get,
	globalFormInstances,
	isEqual,
	objectValues,
	provideFormInstance,
	set,
	uniqueId,
} from "@/utilities";
import {
	isReactive,
	onBeforeUnmount,
	reactive,
	ref,
	toRaw,
	toRef,
	unref,
	watch,
	type Ref,
} from "vue";

/**
 *
 * @param props
 * @returns
 */
export default function useForm<
	Values extends object = Record<PropertyKey, any>
>(props?: FormSettings): FormInstance<Values> {
	const pluginOptions = useEzFormPluginOptions();

	// Handle form settings
	const settings = reactive<FormSettings>(
		toRaw(props) ?? {
			classPrefix: "ez",
			name: uniqueId(),
		}
	);

	// Generate form's name if not provided
	settings.name = settings.name || uniqueId();
	settings.classPrefix = settings.classPrefix || "ez";

	function updateSettings(
		newSettings: Partial<FormSettings>,
		reInitialize = false
	) {
		Object.assign(settings, {
			...newSettings,
			name: newSettings.name || settings.name || uniqueId(),
			classPrefix: newSettings.classPrefix || "ez",
		});

		if (reInitialize) {
			setInitialValues(settings.initialValues, true);
			reset();
		}
	}

	if (props && isReactive(props)) {
		watch(props, () => {
			updateSettings({ ...props });
		});
	}

	// Handle initial values
	const { initialValues, setInitialValues, getClonedInitialValues } =
		useInitialValues(
			toRef(settings, "initialValues"),
			toRef(settings, "enableReinitialize"),
			() => {
				// Reset form when initial values change
				updateInitialValuesWithFields();
				reset();
			}
		);

	// Handle form meta data
	const formMeta = reactive<FormMeta>({
		dirty: false,
		get name() {
			return settings.name ?? "";
		},
		values: getClonedInitialValues(),
		errors: [],
	});

	function resetFormMeta(values?: any) {
		formMeta.dirty = false;
		formMeta.errors = [];
		if (values !== undefined) {
			formMeta.values = values;
		}
	}

	// Handle fields
	const fields = reactive<Record<string, FormField>>({});

	function addField(field: FormField) {
		const key = castNamePathToString(field.name.value);
		fields[key] = field;
		updateInitialValuesWithFields();
	}

	function removeField(name: NamePath) {
		const key = castNamePathToString(name);
		if (settings.preserveValues === false) {
			deleteFrom(formMeta.values, name);
		}
		delete fields[key];
	}

	function isDirty(namePath?: NamePath) {
		if (!namePath) {
			return formMeta.dirty;
		}

		return objectValues(fields)
			.filter(({ name }) => (namePath ? isEqual(name, namePath) : true))
			.some(({ dirty }) => {
				return dirty;
			});
	}

	function setFieldValue(name: NamePath, value: any, markAsDirty = true) {
		set(formMeta.values, name, value);

		// Mark form and field as dirty
		if (markAsDirty) {
			formMeta.dirty = true;
			const field = fields[castNamePathToString(name)];
			field && field.markAsDirty();
		}
	}

	function getFieldValue(name: NamePath) {
		return get(formMeta.values, name);
	}

	function updateInitialValuesWithFields() {
		objectValues(fields).forEach((field) => {
			if (
				field.defaultValue !== undefined &&
				get(initialValues.value, field.name) === undefined
			) {
				set(initialValues.value, field.name, field.defaultValue);
			}
		});
	}

	// Validate
	function clearValidate(name?: NamePath) {
		if (name) {
			const path = castNamePathToString(name);
			fields[path]?.clearValidate?.();
		} else {
			objectValues(fields).forEach(({ clearValidate }) => {
				clearValidate();
			});
		}
	}

	function validate(
		name?: string | NamePath[],
		options?: ValidateOption
	): Promise<{ values?: Partial<Values>; errors?: ValidateError[] }> {
		const names = castToArray(name);

		const filteredFields = names.length
			? objectValues(fields).filter(({ name }) => {
					return names.some((namePath) => {
						return isEqual(castPath(namePath), castPath(name));
					});
			  })
			: objectValues(fields);

		return new Promise(async (resolve) => {
			const values = await Promise.all(
				filteredFields.map(({ name, validate }) => {
					return validate(options).then(({ value, error }) => {
						if (error) {
							return error;
						}

						return {
							name,
							value,
						};
					});
				})
			);

			const errors = values.filter(
				(item) => !!(item as ValidateError)["messages"]
			) as ValidateError[];
			const hasError = errors.length > 0;

			if (hasError) {
				resolve({ errors, values: undefined });
			} else {
				resolve({
					values: values.reduce<Partial<Values>>((result, item: any) => {
						set(result, item.name, item.value);
						return result;
					}, {}),
					errors: undefined,
				});
			}
		});
	}

	watch(
		fields,
		debounce(() => {
			formMeta.errors = objectValues(fields)
				.map((field) => {
					return field.error;
				})
				.filter((error) => error !== undefined) as ValidateError[];
		}, 500),
		{ immediate: true }
	);

	// Reset
	function reset(values?: Record<string | number | symbol, any>) {
		const hasInitialValue = !isEqual(getClonedInitialValues(), {});
		const allFields = objectValues(fields);
		clearObject(formMeta.values);
		resetFormMeta();
		allFields.forEach(({ reset: resetField }) => {
			resetField();
		});

		if (values) {
			Object.assign(formMeta.values, clone(values));
		} else if (hasInitialValue) {
			Object.assign(formMeta.values, getClonedInitialValues());
		}
	}

	// Submit
	const submit: FormInstance["submit"] = (
		onSuccess?: FormSubmitCallback<Values>,
		onError?: FormErrorCallback
	) => {
		if (onSuccess || onError) {
			validate().then(({ errors }) => {
				if (errors) {
					onError?.(errors);
				} else {
					const values = clone(formMeta.values);
					onSuccess?.(values);
				}
			});
			return undefined as any;
		}

		return new Promise<{ values?: Values; errors?: ValidateError[] }>(
			(resolve) => {
				validate().then(({ errors }) => {
					const values =
						errors === undefined ? clone(formMeta.values) : undefined;
					resolve({ values, errors });
				});
			}
		);
	};

	const formInstance: PrivateFormInstance<Values> = {
		meta: formMeta,
		fields,
		get initialValues() {
			return clone(initialValues.value);
		},
		submit,
		reset,
		setFieldValue,
		getFieldValue,
		validate,
		isDirty,
		updateSettings,
		addField,
		removeField,
		clearValidate,
		get classPrefix() {
			return settings.classPrefix ?? "";
		},
		get rules() {
			return settings.rules;
		},
		get validateMessages() {
			return settings.validateMessages ?? pluginOptions?.validateMessages;
		},
		get validateTrigger() {
			return settings.validateTrigger;
		},
	};

	if (process.env.NODE_ENV === "development" || __VUE_PROD_DEVTOOLS__) {
		useDevtoolFormHandler(formInstance);
	}

	// Register global form instance
	useRegisterGlobalInstance(formMeta, formInstance);

	provideFormInstance(formInstance);

	return formInstance;
}

function useInitialValues(
	inputInitialValues: Ref<any>,
	enableReinitialize: Ref<boolean | undefined>,
	onReInitialize: (values: any) => void
) {
	const originalInitialValues: Ref<any> = ref(inputInitialValues.value ?? {});
	const initialValues: Ref<any> = ref(inputInitialValues.value ?? {});

	// Handle initial values
	const stopWatchInitialValue = ref(createWatchInitialValue());

	const getClonedInitialValues = () =>
		initialValues.value ? clone(unref(initialValues)) : {};

	function setInitialValues(values: any, original = false) {
		initialValues.value = clone(values);
		if (original) {
			originalInitialValues.value = clone(values);
		}
	}

	function createWatchInitialValue() {
		if (!enableReinitialize.value) {
			return undefined;
		}

		return watch(
			inputInitialValues.value,
			(values) => {
				setInitialValues(clone(values), true);
				onReInitialize(clone(values));
			},
			{ deep: true }
		);
	}

	watch(enableReinitialize, () => {
		if (enableReinitialize.value) {
			stopWatchInitialValue.value = createWatchInitialValue();
			return;
		}

		stopWatchInitialValue.value && stopWatchInitialValue.value();
	});

	return {
		initialValues,
		originalInitialValues,
		setInitialValues,
		getClonedInitialValues,
	};
}

function useRegisterGlobalInstance(
	formMeta: FormMeta,
	formInstance: FormInstance
) {
	watch(
		() => formMeta.name,
		(newName, oldName) => {
			let items: Record<string, FormItemInstance | undefined> = {};
			let lists: Record<string, FormListInstance | undefined> = {};
			if (oldName) {
				const formItems = globalFormInstances[oldName]?.items;
				const formLists = globalFormInstances[oldName]?.lists;
				items = formItems ? clone(formItems) : {};
				lists = formLists ? clone(formLists) : {};

				delete globalFormInstances[oldName];
			}

			const globalForm = globalFormInstances[newName];
			if (globalForm) {
				globalForm.instance = formInstance;
				globalForm.items = {
					...items,
					...globalForm.items,
				};
				globalForm.lists = {
					...lists,
					...globalForm.lists,
				};
			} else {
				globalFormInstances[newName] = {
					instance: formInstance,
					items,
					lists,
				};
			}
		},
		{ immediate: true }
	);

	onBeforeUnmount(() => {
		delete globalFormInstances[formMeta.name];
	});
}
