<template>
	<EzFormItemView
		:label="label"
		:id-for="meta.id"
		:required-mark="requiredMarkString"
		:no-style="noStyle"
		:colon="colon"
	>
		<EzFormItemAutoBindingInput
			:autoBinding="autoBinding"
			:blurEventPropName="blurEventPropName"
			:changeEventPropName="changeEventPropName"
			:inputNodeIndex="inputNodeIndex"
			:valuePropName="valuePropName"
			v-slot="data"
		>
			<slot v-bind="data" />
		</EzFormItemAutoBindingInput>

		<template v-if="meta.error" #errors>
			<slot
				name="errors"
				:errors="meta.error"
				:form="formInstance"
				:formItem="formItemInstance"
			>
				<span v-for="message in meta.error?.messages">{{ message }}</span>
			</slot>
		</template>
		<template v-if="$slots.extra" #extra>
			<slot name="extra" :form="formInstance" :formItem="formItemInstance" />
		</template>
	</EzFormItemView>
</template>

<script lang="ts" setup>
import EzFormItemAutoBindingInput from "@/components/EzFormItemAutoBindingInput.vue";
import EzFormItemView from "@/components/EzFormItemView.vue";
import { useFormItemComponentLogics } from "@/composables";
import type { FormInstance, FormItemInstance } from "@/models";
import { getFormItemDefinePropsObject } from "@/utilities";

const props = defineProps(getFormItemDefinePropsObject());

const emit = defineEmits<{
	(event: "change", value: any, form: FormInstance): void;
}>();

const { formItemInstance, formInstance } = useFormItemComponentLogics(
	props,
	emit
);

const { meta, requiredMarkString } = formItemInstance;

defineExpose<FormItemInstance>(formItemInstance);
</script>
