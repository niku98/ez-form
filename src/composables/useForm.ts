import {
	FormField,
	FormInstance,
	FormSettings,
	NamePath,
	ValidateError,
	ValidateOption,
} from "@/models";

import {
	castPath,
	castToArray,
	clone,
	emptyObject,
	get,
	isEqual,
	objectValues,
	set,
} from "@/utilities";
import { WithRequiredProperty } from "@/utilities-types";
import { computed, reactive, ref, toRaw, watch } from "vue";

export default function useForm<
	Values extends object = Record<string | number | symbol, any>
>(form?: FormInstance<Values>): FormInstance<Values> {
	if (form) {
		return form;
	}

	// Handle form settings
	const settings = reactive<WithRequiredProperty<FormSettings, "classPrefix">>({
		classPrefix: "ez",
	});

	function updateSettings(newSettings: FormSettings) {
		Object.assign(settings, newSettings);
	}

	function emit(eventName: any, args?: any) {
		settings.emit?.(eventName, args);
	}

	const className = computed(() => `${settings.classPrefix}-form`);

	const initialValues = computed(() =>
		settings.initialValues ? clone(toRaw(settings.initialValues)) : {}
	);

	// Handle form logics
	const formValues = reactive<Values>(initialValues.value) as Values;

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
			() => initialValues.value,
			() => {
				if (!isEqual(initialValues.value, formValues)) {
					Object.assign(emptyObject(formValues), initialValues.value);
				}
			},
			{ deep: true }
		);
	}

	// handle form values
	function setFieldValue(name: NamePath, value: any) {
		set(formValues, name, value);
	}

	function getFieldValue(name: NamePath) {
		return get(formValues, name);
	}

	// Handle fields
	const fields = reactive<Record<string, FormField>>({});

	function addField(field: FormField) {
		const key = castPath(field.name.value).join(".");
		fields[key] = field;
	}

	function removeField(name: NamePath) {
		const key = castPath(name).join(".");
		delete fields[key];
	}

	// handle errors
	const errors = reactive<FormInstance["errors"]>([]);
	const fieldsErrors = computed(() => {
		return objectValues(fields)
			.map((field) => {
				return field.error;
			})
			.filter((error) => error !== undefined) as ValidateError[];
	});

	function changeErrors(newErrors: FormInstance["errors"]) {
		errors.splice(0);
		errors.push(...newErrors);
	}

	watch(fieldsErrors, () => {
		changeErrors(fieldsErrors.value);
	});

	// Form actions handling
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

	function reset(values?: Record<string | number | symbol, any>) {
		const hasInitialValue = !isEqual(initialValues.value, {});
		const allFields = objectValues(fields);

		if (values) {
			Object.assign(formValues, values);
		} else if (hasInitialValue) {
			Object.assign(formValues, values ?? initialValues.value);
		} else {
			Object.assign(
				formValues,
				allFields.reduce<any>((newValues, field) => {
					field.defaultValue !== undefined &&
						set(newValues, field.name, clone(field.defaultValue));
					return newValues;
				}, {})
			);
		}

		allFields.forEach(({ reset: resetField }) => {
			resetField();
		});

		emit("reset");
	}

	function submit() {
		validate()
			.then(handleSubmit)
			.catch((errors) => {
				emit("error", errors);
			});
	}

	function handleSubmit() {
		emit("submit", clone(formValues));
		changeErrors([]);
	}

	function isDirty(namePath?: NamePath) {
		return objectValues(fields)
			.filter(({ name }) => (namePath ? isEqual(name, namePath) : true))
			.some(({ dirty }) => {
				return dirty;
			});
	}

	watch(formValues, (value: any) => {
		emit("change", value);
	});

	const formInstance: FormInstance<Values> = {
		values: formValues,
		errors,
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
		get classPrefix() {
			return settings.classPrefix;
		},
		get rules() {
			return settings.rules;
		},
		get validateMessages() {
			return settings.validateMessages;
		},
		get validateTrigger() {
			return settings.validateTrigger;
		},
	};

	return formInstance;
}
