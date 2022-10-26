<template>
	<form :class="className" @submit.prevent="submit()" @reset.prevent="reset()">
		<slot
			:values="formValues"
			:errors="errors"
			:submit="submit"
			:reset="reset"
			:validate="validate"
			:getFieldValue="getFieldValue"
			:setFieldValue="setFieldValue"
			:isDirty="isDirty"
		/>
	</form>
</template>

<script lang="ts" setup>
import useForm from "@/composables/useForm";
import usePluginOptions from "@/composables/usePluginOptions";
import {
	$formInjectKey,
	FormField,
	FormInjectedValues,
	FormInstance,
	NamePath,
	Rules,
	ValidateError,
	ValidateMessages,
	ValidateOption,
	ValidateTrigger,
} from "@/models";
import {
	castPath,
	castToArray,
	clearObject,
	clone,
	emptyObject,
	get,
	isEqual,
	objectValues,
	set,
} from "@/utilities";
import { computed, provide, reactive, ref, toRaw, watch } from "vue";

export interface FormProps<Values extends object = any> {
	form?: FormInstance;
	initialValues?: Values;
	enableReinitialize?: boolean;
	clearOnReset?: boolean;
	rules?: Rules;
	validateTrigger?: ValidateTrigger | ValidateTrigger[];
	validateMessages?: ValidateMessages;
	classPrefix?: string;
}

export interface FormEmitter {
	(event: "submit", values: any): void;
	(event: "change", values: any): void;
	(event: "reset"): void;
	(event: "error", errors: any): void;
}

const props = withDefaults(defineProps<FormProps>(), {
	validateTrigger() {
		return ["change"];
	},
	classPrefix: "nk",
});
const emit = defineEmits<FormEmitter>();
const pluginOptions = usePluginOptions();

const className = computed(() => `${props.classPrefix}-form`);

const initialValues = computed(() =>
	props.initialValues ? clone(toRaw(props.initialValues)) : {}
);

// Handle form logics
const form = useForm(props.form);
const formValues = Object.assign(form.values, initialValues.value);

// Handle initial values
const stopWatchInitialValue = ref(createWatchInitialValue());

watch(
	() => props.enableReinitialize,
	() => {
		if (props.enableReinitialize) {
			stopWatchInitialValue.value = createWatchInitialValue();
			return;
		}

		stopWatchInitialValue.value && stopWatchInitialValue.value();
	}
);

function createWatchInitialValue() {
	if (!props.enableReinitialize) {
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
const errors = form.errors;
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

function reset(values?: Record<string | number | symbol, any>, notify = true) {
	clearObject(formValues);
	if (!props.clearOnReset) {
		setTimeout(() => {
			Object.assign(formValues, values ?? initialValues.value);
		}, 5);
	}

	if (notify) {
		emit("reset");
	}
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

provide<FormInjectedValues>($formInjectKey, {
	values: formValues,
	errors,
	setFieldValue,
	getFieldValue,
	submit,
	reset,
	validate,
	addField,
	removeField,
	isDirty,
	get classPrefix() {
		return props.classPrefix;
	},
	get validateTrigger() {
		return props.validateTrigger;
	},
	get validateMessages() {
		return props.validateMessages ?? pluginOptions?.validateMessages;
	},
});

defineExpose<FormInstance>({
	values: formValues,
	errors,
	submit,
	reset,
	getFieldValue,
	setFieldValue,
	validate,
	isDirty,
	get validateTrigger() {
		return props.validateTrigger;
	},
});
</script>
