<template>
	<form
		:class="['ant-form', `ant-form-${layout ?? 'vertical'}`]"
		@submit.prevent="submit()"
		@reset.prevent="reset()"
	>
		<slot
			:values="meta.values"
			:errors="meta.errors"
			:dirty="meta.dirty"
			:submit="submit"
			:reset="reset"
			:validate="validate"
			:getFieldValue="getFieldValue"
			:setFieldValue="setFieldValue"
			:isDirty="isDirty"
		/>
	</form>
</template>

<script lang="ts" setup>
import { formProps } from "ant-design-vue/es/form";
import { provide } from "vue";
import {
	getFormDefinePropsObject,
	useFormComponentLogics,
	ValidateError,
} from "../../src";
import { $injectFormStyleKey, InjectFormStyle } from "./useInjectAntFormStyle";

export interface FormEmitter {
	(event: "submit", values: any): void;
	(event: "change", values: any): void;
	(event: "reset"): void;
	(event: "error", errors: ValidateError[]): void;
}

const props = defineProps({
	...getFormDefinePropsObject(),
	labelCol: formProps()["labelCol"],
	labelAlign: formProps()["labelAlign"],
	wrapperCol: formProps()["wrapperCol"],
	layout: formProps()["layout"],
});
const emit = defineEmits<FormEmitter>();

const { submit, reset, formInstance } = useFormComponentLogics(props, emit);
const { meta, setFieldValue, getFieldValue, validate, isDirty } = formInstance;

provide<InjectFormStyle>($injectFormStyleKey, {
	get labelCol() {
		return props.labelCol;
	},
	get labelAlign() {
		return props.labelAlign;
	},
	get wrapperCol() {
		return props.wrapperCol;
	},
});
</script>
