<template>
	<fieldset
		:class="[
			classNames.main,
			{
				'has-errors': $slots.errors,
				'no-style': !!noStyle,
				required: !!requiredMark,
			},
		]"
		:style="requiredMarkStyle"
	>
		<label v-if="label" :for="idFor" :class="classNames.label">{{
			label
		}}</label>
		<div :class="classNames.input">
			<slot />
		</div>
		<div v-if="$slots.errors && !noStyle" :class="classNames.errors">
			<slot name="errors" />
		</div>
		<div v-if="$slots.extra && !noStyle" :class="classNames.extra">
			<slot name="extra"></slot>
		</div>
	</fieldset>
</template>

<script lang="ts" setup>
import useForm from "@/composables/useForm";
import { FormInjectedValues } from "@/models";
import { computed } from "vue";

const props = withDefaults(
	defineProps<{
		label?: string;
		idFor?: string;
		requiredMark?: string;
		noStyle?: boolean;
		colon?: boolean;
	}>(),
	{
		colon: true,
	}
);

const form = useForm() as FormInjectedValues;

const classNames = computed(() => {
	return {
		main: `${form.classPrefix}-form-item`,
		get label() {
			return `${this.main}-label`;
		},
		get input() {
			return `${this.main}-input`;
		},
		get errors() {
			return `${this.main}-errors`;
		},
		get extra() {
			return `${this.main}-extra`;
		},
	};
});

const requiredMarkStyle = computed(() => {
	const cssVar = `--${form.classPrefix}-form-required-mark`;
	return {
		[cssVar]: props.requiredMark,
	};
});

const colonString = computed(() => `"${props.colon ? ":" : ""}"`);
</script>
