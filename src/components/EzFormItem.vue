<template>
	<EzFormItemView
		:label="label"
		:id-for="meta.id"
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

		<template v-if="meta.error" #errors>
			<slot name="errors" :errors="meta.error">
				<span v-for="message in meta.error?.messages">{{ message }}</span>
			</slot>
		</template>
		<template v-if="$slots.extra" #extra>
			<slot name="extra" :form="injectedForm" :formItem="formItemInstance" />
		</template>
	</EzFormItemView>
</template>

<script lang="ts" setup>
import EzFormItemView from "@/components/EzFormItemView.vue";
import {
	useFormItem,
	useFormItemAutoBinding,
	useHandleFormItemEmit,
	useInjectForm,
} from "@/composables";
import type { FormInstance, FormItemInstance } from "@/models";
import { getFormItemDefinePropsObject } from "@/utilities";

const props = defineProps(getFormItemDefinePropsObject());

const emit = defineEmits<{
	(event: "change", value: any, form: FormInstance): void;
}>();

const injectedForm = useInjectForm();
const formItemInstance = useFormItem(props);
const { meta, requiredMarkString } = formItemInstance;

// Handle emit
useHandleFormItemEmit(formItemInstance, emit);

// Handle slots
const { getInputItemProps, slotData, getVNodesFromDefaultSlot } =
	useFormItemAutoBinding(formItemInstance, props);

defineExpose<FormItemInstance>(formItemInstance);
</script>
