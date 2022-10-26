<template>
	<FormItemView
		:label="label"
		:id-for="formItemId"
		:required-mark="requiredMarkString"
		:no-style="noStyle"
	>
		<slot v-if="!autoBinding" v-bind="slotData" />
		<template v-else>
			<component
				v-for="(vNode, index) in getVNodesFromDefaultSlot()"
				:is="vNode"
				:key="vNode.patchFlag"
				v-bind="index === 0 ? getInputItemProps(vNode) : undefined"
			/>
		</template>

		<template v-if="error" #errors>
			<slot name="errors" :errors="error">
				<span v-for="message in error?.messages">{{ message }}</span>
			</slot>
		</template>
		<template v-if="slots.extra" #extra>
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
	Rule,
	ValidateTrigger,
} from "@/models";
import { computed, toRaw, useSlots, VNode } from "vue";

export interface FormItemProps {
	label?: string;
	name?: string | number | (string | number)[];
	defaultValue?: any;
	valuePropName?: string;
	changeEventPropName?: string;
	blurEventPropName?: string;
	getValueFromChangeEvent?: (event: any) => any;
	hideTextError?: boolean;
	valueTransformer?: FormItemValueTransformer;
	classStyle?: string;
	autoBinding?: boolean;
	rules?: Rule;
	requiredMark?: string | boolean;
	validateTrigger?: ValidateTrigger | ValidateTrigger[];
	validateFirst?: boolean;
	noStyle?: boolean;
}

const props = withDefaults(defineProps<FormItemProps>(), {
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
	requiredMarkString,
	rawValue,
	formItemId,
	error,
	updateEventName,
	injectedForm,
	handleBlur,
	handleChange,
} = useFormItem(props, emit);

// Handle slots
const slots = useSlots();

const slotData = computed(() => {
	return {
		value: inputValue,
		rawValue: rawValue,
		handleChange,
		form: injectedForm,
		error: toRaw(error),
	};
});

const getVNodesFromDefaultSlot = () => {
	return (slots.default && slots.default(slotData)) ?? [];
};

const getInputItemProps = (vNode: VNode) => {
	if (!props.autoBinding) {
		return {};
	}

	if (
		vNode.component === null &&
		["input", "select", "textarea"].includes(String(vNode.type))
	) {
		return {
			value: inputValue.value,
			onInput: handleChange,
			onChange: handleChange,
			onBlur: handleBlur,
			id: formItemId.value,
		};
	}

	const eventName = `on${updateEventName.value[0].toUpperCase()}${updateEventName.value.slice(
		1
	)}`;
	const blurEventName = `on${props.blurEventPropName[0].toUpperCase()}${props.blurEventPropName.slice(
		1
	)}`;
	const valuePropName = props.valuePropName;

	return {
		[eventName]: handleChange,
		[blurEventName]: handleBlur,
		[valuePropName]: inputValue.value,
		id: formItemId,
	};
};
</script>
