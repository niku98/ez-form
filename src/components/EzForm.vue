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
import { PropType, watchEffect } from "vue";

export interface FormEmitter {
	(event: "submit", values: any): void;
	(event: "change", values: any): void;
	(event: "reset"): void;
	(event: "error", errors: ValidateError[]): void;
}

const props = defineProps({
	form: {
		required: false,
		type: Object as PropType<FormInstance>,
	},
	initialValues: {
		required: false,
		type: Object as PropType<Record<string, any>>,
	},
	enableReinitialize: {
		required: false,
		type: Boolean as PropType<boolean>,
	},
	clearOnReset: {
		required: false,
		type: Boolean as PropType<boolean>,
	},
	rules: {
		required: false,
		type: Object as PropType<Rules>,
	},
	validateTrigger: {
		required: false,
		type: [String, Array] as PropType<ValidateTrigger | ValidateTrigger[]>,
	},
	validateMessages: {
		required: false,
		type: Object as PropType<ValidateMessages>,
	},
	classPrefix: {
		required: false,
		type: String as PropType<string>,
		default: "ez",
	},
});

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
