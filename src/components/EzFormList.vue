<template>
	<EzFormItemView
		:class="className"
		:label="label"
		:id-for="meta.id"
		:required-mark="requiredMarkString"
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

		<template v-if="$slots.errors" #errors>
			<slot
				name="errors"
				:error="meta.error"
				:form="formInstance"
				:formList="formListInstance"
			/>
		</template>
		<template v-if="$slots.extra" #extra>
			<slot name="extra" :form="formInstance" :formList="formListInstance" />
		</template>
	</EzFormItemView>
</template>

<script lang="ts" setup>
import EzFormItemView from "@/components/EzFormItemView.vue";
import { useFormListComponentLogics } from "@/composables";
import type { FormInstance, FormListInstance } from "@/models";
import { getFormListDefinePropsObject } from "@/utilities";
import { computed } from "vue";

const props = defineProps(getFormListDefinePropsObject());

const emit = defineEmits<{
	(event: "change", value: any, form: FormInstance): void;
}>();

const { formListInstance, formInstance } = useFormListComponentLogics(
	props,
	emit
);

const {
	meta,
	requiredMarkString,
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
} = formListInstance;

const className = computed(() => `${formInstance.classPrefix}-form-list`);

defineExpose<FormListInstance>(formListInstance);
</script>
