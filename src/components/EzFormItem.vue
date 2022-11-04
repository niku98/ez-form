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
import { getFormItemDefinePropsObject } from "@/utilities";
import { PropType } from "vue";

const props = defineProps(getFormItemDefinePropsObject());

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
