<template>
	<EzFormItemView
		:label="label"
		:id-for="formItemId"
		:required-mark="requiredMarkString"
		:no-style="noStyle"
		:colon="colon"
	>
		<slot v-if="!autoBinding" v-bind="slotData" />
		<template v-else>
			<component
				v-for="(vNode, index) in getVNodesFromDefaultSlot()"
				:is="vNode"
				:key="vNode.patchFlag"
				v-bind="index === inputNodeIndex ? getInputItemProps(vNode) : undefined"
			/>
		</template>

		<template v-if="error" #errors>
			<slot name="errors" :errors="error">
				<span v-for="message in error?.messages">{{ message }}</span>
			</slot>
		</template>
		<template v-if="$slots.extra" #extra>
			<slot name="extra" :form="injectedForm" />
		</template>
	</EzFormItemView>
</template>

<script lang="ts" setup>
import EzFormItemView from "@/components/EzFormItemView.vue";
import { useFormItem, useFormItemAutoBinding } from "@/composables";
import type {
	FormInstance,
	FormItemInstance,
	FormItemValueTransformer,
	NamePath,
	Rule,
	ValidateTrigger,
} from "@/models";
import { PropType } from "vue";

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
	inputNodeIndex: {
		required: false,
		type: Number as PropType<number>,
		default: 0,
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
	colon: {
		required: false,
		type: Boolean as PropType<boolean>,
	},
});

const emit = defineEmits<{
	(event: "change", value: any, form: FormInstance): void;
}>();

const formItemData = useFormItem(props, emit);
const {
	inputValue,
	requiredMarkString,
	rawValue,
	formItemId,
	error,
	dirty,
	injectedForm,
	handleChange,
} = formItemData;

// Handle slots
const { getInputItemProps, slotData, getVNodesFromDefaultSlot } =
	useFormItemAutoBinding(formItemData, props);

defineExpose<FormItemInstance>({
	handleChange,
	get rawValue() {
		return rawValue.value;
	},
	get transformedValue() {
		return inputValue.value;
	},
	get form() {
		return injectedForm;
	},
	get error() {
		return error.value;
	},
	get dirty() {
		return dirty.value;
	},
});
</script>
