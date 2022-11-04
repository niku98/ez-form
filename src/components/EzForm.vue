<template>
	<form :class="className" @submit.prevent="submit()" @reset.prevent="reset()">
		<slot
			:values="values"
			:errors="errors"
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
import { useForm } from "@/composables";
import type {
	FormInstance,
	Rules,
	ValidateError,
	ValidateMessages,
	ValidateTrigger,
} from "@/models";
import { getFormDefinePropsObject } from "@/utilities";
import { PropType, watchEffect } from "vue";

export interface FormEmitter {
	(event: "submit", values: any): void;
	(event: "change", values: any): void;
	(event: "reset"): void;
	(event: "error", errors: ValidateError[]): void;
}

const props = defineProps(getFormDefinePropsObject());

const emit = defineEmits<FormEmitter>();

const form = useForm(props.form);

const {
	values,
	errors,
	setFieldValue,
	getFieldValue,
	submit,
	reset,
	validate,
	className,
	isDirty,
	updateSettings,
} = form;

watchEffect(() => {
	updateSettings({
		...props,
		emit,
	});
});

defineExpose<FormInstance>(form);
</script>
