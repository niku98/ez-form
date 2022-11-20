<template>
	<form :class="className" @submit.prevent="submit()" @reset.prevent="reset()">
		<slot
			:values="meta.values"
			:errors="meta.errors"
			:dirty="meta.dirty"
			:submit="form.submit"
			:reset="form.reset"
			:validate="validate"
			:getFieldValue="getFieldValue"
			:setFieldValue="setFieldValue"
			:isDirty="isDirty"
		/>
	</form>
</template>

<script lang="ts" setup>
import { useForm, useHandleFormEmit } from "@/composables";
import type { FormInstance, ValidateError } from "@/models";
import { getFormDefinePropsObject } from "@/utilities";
import { watchEffect } from "vue";

export interface FormEmitter {
	(event: "submit", values: any): void;
	(event: "change", values: any): void;
	(event: "reset"): void;
	(event: "error", errors: ValidateError[]): void;
}

const props = defineProps(getFormDefinePropsObject());

const emit = defineEmits<FormEmitter>();

const form = props.form ?? useForm(props);

const {
	meta,
	setFieldValue,
	getFieldValue,
	validate,
	className,
	isDirty,
	updateSettings,
} = form;

const { reset, submit } = useHandleFormEmit(form, emit);
if (props.form) {
	watchEffect(() => {
		updateSettings({
			...props,
		});
	});
}

defineExpose<FormInstance>(form);
</script>
