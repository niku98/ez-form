<template>
	<EzFormItemView
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
	</EzFormItemView>
</template>

<script lang="ts" setup>
import EzFormItemView from "@/components/EzFormItemView.vue";
import { useFormItem } from "@/composables";
import type {
	FormInstance,
	FormItemValueTransformer,
	NamePath,
	Rule,
	ValidateTrigger,
} from "@/models";
import { castToArray, clone } from "@/utilities";
import { computed, PropType } from "vue";

const props = defineProps({
	label: {
		required: false,
		type: String as PropType<string>,
	},
	name: {
		required: false,
		type: [String, Array] as PropType<NamePath>,
	},
	defaultValue: {
		required: false,
		type: Array as PropType<any[]>,
	},
	valuePropName: {
		required: false,
		type: String as PropType<string>,
		default: "value",
	},
	changeEventPropName: {
		required: false,
		type: String as PropType<string>,
	},
	blurEventPropName: {
		required: false,
		type: String as PropType<string>,
		default: "blur",
	},
	getValueFromChangeEvent: {
		required: false,
		type: Function as PropType<(event: any) => any>,
		default: (event: any) => {
			if (event?.target) {
				return event.target.value ?? event.target.checked;
			}

			return event;
		},
	},
	valueTransformer: {
		required: false,
		type: Object as PropType<FormItemValueTransformer>,
		default: () => ({
			in: (value: any) => value,
			out: (value: any) => value,
		}),
	},
	autoBinding: {
		required: false,
		type: Boolean as PropType<boolean>,
		default: true,
	},
	rules: {
		required: false,
		type: [Object, Array] as PropType<Rule>,
	},
	requiredMark: {
		required: false,
		type: [String, Boolean] as PropType<string | boolean>,
		default: true,
	},
	validateTrigger: {
		required: false,
		type: [String, Array] as PropType<ValidateTrigger | ValidateTrigger[]>,
		default: "change",
	},
	validateFirst: {
		required: false,
		type: Boolean as PropType<boolean>,
	},
	noStyle: {
		required: false,
		type: Boolean as PropType<boolean>,
	},
});

const emit = defineEmits<{
	(event: "change", value: any, form: FormInstance): void;
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
