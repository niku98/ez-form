<template>
	<a-form-item
		:label="label"
		:label-align="labelAlign"
		:label-col="labelCol"
		:wrapper-col="wrapperCol"
		:has-feedback="errorExist"
		:validate-status="errorExist ? 'error' : undefined"
		:required="!!requiredMarkString"
		:no-style="noStyle"
	>
		<slot
			:value="listValues"
			:length="listValues.length"
			:fields="fields"
			:getNamePath="getNamePath"
			:errors="errors"
			:getErrors="getErrors"
			:hasError="hasError"
			:add="add"
			:insert="insert"
			:unshift="unshift"
			:shift="shift"
			:pop="pop"
			:remove="remove"
			:removeByKey="removeByKey"
			:swap="swap"
			:replace="replace"
			:move="move"
			:form="formInstance"
		/>

		<template v-if="errorExist" #help>
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
				:formList="formListInstance"
			></slot>
		</template>
	</a-form-item>
</template>

<script lang="ts" setup>
import { FormItem as AFormItem } from "ant-design-vue";
import { formItemProps } from "ant-design-vue/lib/form";
import { computed } from "vue";
import {
	FormItemEmitter,
	getFormListDefinePropsObject,
	useFormListComponentLogics,
} from "../../src";
import { useInjectAntFormStyle } from "./useInjectAntFormStyle";

export interface Emitter extends FormItemEmitter {}

const props = defineProps({
	...getFormListDefinePropsObject(),
	labelCol: formItemProps()["labelCol"],
	labelAlign: formItemProps()["labelAlign"],
	wrapperCol: formItemProps()["wrapperCol"],
});
const emit = defineEmits<Emitter>();

const { formListInstance, formInstance } = useFormListComponentLogics(
	props,
	emit
);

const {
	meta,
	listValues,
	fields,
	errors,
	getErrors,
	getNamePath,
	hasError,
	add,
	pop,
	insert,
	unshift,
	shift,
	remove,
	removeByKey,
	swap,
	replace,
	move,
	requiredMarkString,
} = formListInstance;

const errorExist = computed(
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
