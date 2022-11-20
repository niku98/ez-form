import useEzFormPluginOptions from "@/composables/usePluginOptions";
import type {
	FormErrorCallback,
	FormField,
	FormInstance,
	FormMeta,
	FormSettings,
	FormSubmitCallback,
	NamePath,
	ValidateError,
	ValidateOption,
} from "@/models";
import {
	$formInjectKey,
	castPath,
	castToArray,
	clearObject,
	clone,
	deleteFrom,
	get,
	isEqual,
	objectValues,
	set,
	uniqueId,
} from "@/utilities";
import {
	computed,
	provide,
	reactive,
	ref,
	toRaw,
	watch,
	watchEffect,
} from "vue";

export default function useForm<
	Values extends object = Record<string | number | symbol, any>
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

	function updateSettings(newSettings: Partial<FormSettings>) {
		Object.assign(settings, {
			...newSettings,
			name: newSettings.name || uniqueId(),
		});
	}

	if (props) {
		watch(props, () => {
			updateSettings({ ...props });
		});
	}

	// Handle form meta data
	const getClonedInitialValues = () =>
		settings.initialValues ? clone(toRaw(settings.initialValues)) : {};

	const className = computed(() => `${settings.classPrefix}-form`);
	const formMeta = reactive<FormMeta>({
		dirty: false,
		get name() {
			return settings.name ?? "";
		},
		values: getClonedInitialValues(),
		errors: [],
	});

	function resetFormMeta(values: any) {
		formMeta.dirty = false;
		formMeta.errors = [];
		formMeta.values = values;
	}

	// Handle initial values
	const stopWatchInitialValue = ref(createWatchInitialValue());

	watch(
		() => settings.enableReinitialize,
		() => {
			if (settings.enableReinitialize) {
				stopWatchInitialValue.value = createWatchInitialValue();
				return;
			}

			stopWatchInitialValue.value && stopWatchInitialValue.value();
		}
	);

	function createWatchInitialValue() {
		if (!settings.enableReinitialize) {
			return undefined;
		}

		return watch(
			() => settings.initialValues,
			() => {
				if (!isEqual(getClonedInitialValues(), formMeta.values)) {
					reset();
				}
			},
			{ deep: true }
		);
	}

	// Handle fields
	const fields = reactive<Record<string, FormField>>({});

	function addField(field: FormField) {
		const key = castPath(field.name.value).join(".");
		fields[key] = field;
	}

	function removeField(name: NamePath) {
		const key = castPath(name).join(".");
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
			const field = fields[castPath(name).join(".")];
			field && field.markAsDirty();
		}
	}

	function getFieldValue(name: NamePath) {
		return get(formMeta.values, name);
	}

	// Validate
	function clearValidate(name?: NamePath) {
		if (name) {
			const path = castPath(name).join(".");
			fields[path]?.clearValidate?.();
		} else {
			objectValues(fields).forEach(({ clearValidate }) => {
				clearValidate();
			});
		}
	}

	function validate(name?: string | NamePath[], options?: ValidateOption) {
		const names = castToArray(name);

		const filteredFields = names.length
			? objectValues(fields).filter(({ name }) => {
					return names.some((namePath) => {
						return isEqual(castPath(namePath), castPath(name));
					});
			  })
			: objectValues(fields);

		return new Promise(async (resolve, reject) => {
			const values = await Promise.all(
				filteredFields.map(({ name, validate }) => {
					return validate(options)
						.then((value) => {
							return {
								name,
								value,
							};
						})
						.catch((error: ValidateError) => {
							return error;
						});
				})
			);

			const errors = values.filter(
				(item) => !!(item as ValidateError)["messages"]
			) as ValidateError[];
			const hasError = errors.length > 0;

			if (hasError) {
				reject(errors);
			} else {
				resolve(
					values.reduce<Record<string, any>>((result, item: any) => {
						set(result, item.name, item.value);
						return result;
					}, {})
				);
			}
		});
	}

	watchEffect(() => {
		formMeta.errors = objectValues(fields)
			.map((field) => {
				return field.error;
			})
			.filter((error) => error !== undefined) as ValidateError[];
	});

	// Reset
	function reset(values?: Record<string | number | symbol, any>) {
		const hasInitialValue = !isEqual(getClonedInitialValues(), {});
		const allFields = objectValues(fields);
		clearObject(formMeta.values);

		resetFormMeta(
			allFields.reduce<any>((newValues, field) => {
				field.defaultValue !== undefined &&
					set(newValues, field.name, clone(field.defaultValue));
				return newValues;
			}, {})
		);
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
			validate()
				.then(() => {
					const values = clone(formMeta.values);
					onSuccess?.(values);
				})
				.catch((errors) => {
					onError?.(errors);
				});
			return undefined as any;
		}

		return new Promise<Values>((resolve, reject) => {
			validate()
				.then(() => {
					const values = clone(formMeta.values);
					resolve(values);
				})
				.catch((errors) => {
					reject(errors);
				});
		});
	};

	const formInstance: FormInstance<Values> = {
		meta: formMeta,
		submit,
		reset,
		setFieldValue,
		getFieldValue,
		validate,
		isDirty,
		updateSettings,
		className,
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

	provide<FormInstance>($formInjectKey, formInstance);

	return formInstance;
}
