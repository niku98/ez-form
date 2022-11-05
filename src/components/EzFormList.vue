<template>
	<EzFormItemView
		:class="className"
		:label="label"
		:id-for="formItemId"
		:required-mark="requiredMarkString"
		:no-style="noStyle"
	>
		<slot
			:value="listValues"
			:length="listValues.length"
			:namePaths="namePaths"
			:getNamePath="getNamePath"
			:errors="errors"
			:getErrors="getErrors"
			:hasError="hasError"
			:add="add"
			:remove="remove"
			:removeByKey="removeByKey"
			:swap="swap"
			:replace="replace"
			:move="move"
			:form="injectedForm"
		/>

		<template v-if="$slots.errors" #errors>
			<slot name="errors" :errors="errors" />
		</template>
		<template v-if="$slots.extra" #extra>
			<slot name="extra" :form="injectedForm" />
		</template>
	</EzFormItemView>
</template>

<script lang="ts" setup>
import EzFormItemView from "@/components/EzFormItemView.vue";
import { useFormList } from "@/composables";
import type { FormInstance } from "@/models";
import { getFormListDefinePropsObject } from "@/utilities";
import { computed } from "vue";

const props = defineProps(getFormListDefinePropsObject());

const emit = defineEmits<{
	(event: "change", value: any, form: FormInstance): void;
}>();

const {
	injectedForm,
	requiredMarkString,
	formItemId,
	listValues,
	namePaths,
	errors,
	getErrors,
	getNamePath,
	hasError,
	add,
	remove,
	removeByKey,
	swap,
	replace,
	move,
} = useFormList(props, emit);

const className = computed(() => `${injectedForm.classPrefix}-form-list`);
</script>
