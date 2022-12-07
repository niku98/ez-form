<template>
	<form :class="className" @submit.prevent="submit()" @reset.prevent="reset()">
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
import { useFormComponentLogics } from "@/composables";
import type { FormInstance, ValidateError } from "@/models";
import { getFormDefinePropsObject } from "@/utilities";
import { computed } from "vue";

export interface FormEmitter {
	(event: "submit", values: any): void;
	(event: "change", values: any): void;
	(event: "reset"): void;
	(event: "error", errors: ValidateError[]): void;
}

const props = defineProps(getFormDefinePropsObject());

const emit = defineEmits<FormEmitter>();

const { reset, submit, formInstance } = useFormComponentLogics(props, emit);

const { meta, setFieldValue, getFieldValue, validate, isDirty } = formInstance;

const className = computed(() => `${formInstance.classPrefix}-form`);

defineExpose<FormInstance>(formInstance);
</script>
