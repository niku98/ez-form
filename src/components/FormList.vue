<template>
	<FormItemView
		:class="className"
		:label="label"
		:id-for="formItemId"
		:required-mark="requiredMarkString"
		:no-style="noStyle"
	>
		<slot
			:value="listValues"
			:length="listValues.length"
			:namePaths="namePaths"
			:getNamePath="getNamePath"
			:errors="errors"
			:getErrors="getErrors"
			:hasError="hasError"
			:add="add"
			:remove="remove"
			:removeByKey="removeByKey"
			:swap="swap"
			:replace="replace"
			:move="move"
			:form="injectedForm"
		/>

		<template v-if="$slots.errors" #errors>
			<slot name="errors" :errors="errors" />
		</template>
		<template v-if="$slots.extra" #extra>
			<slot name="extra" :form="injectedForm" />
		</template>
	</FormItemView>
</template>

<script lang="ts" setup>
import FormItemView from "@/components/FormItemView.vue";
import useFormItem from "@/composables/useFormItem";
import {
	FormInjectedValues,
	FormItemValueTransformer,
	NamePath,
	Rule,
} from "@/models";
import { castToArray, clone } from "@/utilities";
import { computed } from "vue";

export interface FormListProps {
	label?: string;
	name?: string | number | (string | number)[];
	defaultValue?: any[];
	valuePropName?: string;
	changeEventPropName?: string;
	blurEventPropName?: string;
	getValueFromChangeEvent?: (event: any) => any;
	valueTransformer?: FormItemValueTransformer;
	rules?: Rule;
	requiredMark?: string | boolean;
	noStyle?: boolean;
}

const props = withDefaults(defineProps<FormListProps>(), {
	valuePropName: "value",
	blurEventPropName: "blur",
	getValueFromChangeEvent: (event: any) => {
		if (event?.target) {
			return event.target.value ?? event.target.checked;
		}

		return event;
	},
	valueTransformer: () => ({
		in: (value) => value,
		out: (value) => value,
	}),
	autoBinding: true,
	requiredMark: true,
	validateTrigger: "change",
});
const emit = defineEmits<{
	(event: "change", value: any, form: FormInjectedValues): void;
}>();

const {
	inputValue,
	handleChange,
	injectedForm,
	requiredMarkString,
	formItemId,
} = useFormItem(props, emit);

const className = computed(() => `${injectedForm.classPrefix}-form-list`);

const listValues = computed<any[]>(() => {
	return inputValue?.value && Array.isArray(inputValue?.value)
		? inputValue?.value
		: [];
});

const namePrefix = computed(() =>
	Array.isArray(props.name) ? props.name : props.name ? [props.name] : []
);

const namePaths = computed(() => {
	return listValues.value.map((_, index) => [...namePrefix.value, index]);
});

const errors = computed(() =>
	injectedForm.errors.filter(({ name }) =>
		castToArray(name).join(".").includes(namePrefix.value.join("."))
	)
);

function getNamePath(index: number, name: NamePath) {
	name = Array.isArray(name) ? name : [name];

	return [...namePaths.value[index], ...name];
}

function getErrors(index?: number) {
	if (index === undefined) {
		return clone(errors);
	}

	return errors.value.filter(({ name }) =>
		castToArray(name)
			.join(".")
			.includes([...namePrefix.value, index].join("."))
	);
}

function hasError(index: number) {
	return (
		errors.value.some(({ name }) =>
			castToArray(name)
				.join(".")
				.includes([...namePrefix.value, index].join("."))
		) ?? false
	);
}

function add(newValue?: any) {
	const array = [...listValues.value];

	array.push(newValue);

	handleChange(array);
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
</script>
