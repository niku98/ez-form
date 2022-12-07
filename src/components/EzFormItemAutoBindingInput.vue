<template>
	<slot v-if="!autoBinding" v-bind="slotData" />
	<template v-else>
		<component
			v-for="(vNode, index) in getVNodesFromDefaultSlot()"
			:is="vNode"
			:key="vNode.patchFlag"
			v-bind="index === inputNodeIndex ? getInputItemProps(vNode) : undefined"
		/>
	</template>
</template>

<script lang="ts" setup>
import { useFormItemAutoBinding, useInjectFormItem } from "@/composables";

export interface Props {
	inputNodeIndex?: number;
	autoBinding?: boolean;
	changeEventPropName?: string;
	blurEventPropName: string;
	valuePropName: string;
}

const props = defineProps<Props>();

const formItemInstance = useInjectFormItem();

// Handle auto binding
const { slotData, getVNodesFromDefaultSlot, getInputItemProps } =
	useFormItemAutoBinding(formItemInstance, props);
</script>
