<template>
	<a-form-item
		:label="label"
		:html-for="meta.id"
		:label-align="labelAlign"
		:label-col="labelCol"
		:wrapper-col="wrapperCol"
		:has-feedback="hasError"
		:validate-status="hasError ? 'error' : undefined"
		:required="!!requiredMarkString"
		:no-style="noStyle"
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

		<template v-if="hasError" #help>
			<span
				v-for="message in meta.error?.messages"
				:key="message"
				class="block"
			>
				{{ message }}
			</span>
		</template>

		<template v-if="$slots.extra" #extra>
			<slot
				name="extra"
				:form="formInstance"
				:formItem="formItemInstance"
			></slot>
		</template>
	</a-form-item>
</template>

<script lang="ts" setup>
import { FormItem as AFormItem } from "ant-design-vue";
import { formItemProps } from "ant-design-vue/lib/form";
import { computed } from "vue";
import {
	EzFormItemAutoBindingInput,
	FormInstance,
	getFormItemDefinePropsObject,
	useFormItemComponentLogics,
} from "../../src";
import { useInjectAntFormStyle } from "./useInjectAntFormStyle";

const props = defineProps({
	...getFormItemDefinePropsObject(),
	labelCol: formItemProps()["labelCol"],
	labelAlign: formItemProps()["labelAlign"],
	wrapperCol: formItemProps()["wrapperCol"],
});

const emit = defineEmits<{
	(event: "change", value: any, form: FormInstance): void;
}>();

const { formItemInstance, formInstance } = useFormItemComponentLogics(
	props,
	emit
);

// Bind data to ant form item
const { meta, requiredMarkString } = formItemInstance;
const hasError = computed(
	() => !!meta.error?.messages && meta.error.messages.length > 0
);

// Cheating Ant form style
const formStyle = useInjectAntFormStyle();

const labelAlign = computed(() => {
	return props.labelAlign ?? formStyle.labelAlign;
});
const labelCol = computed(() => {
	return props.labelCol ?? formStyle.labelCol;
});
const wrapperCol = computed(() => {
	return props.wrapperCol ?? formStyle.wrapperCol;
});
</script>
