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
		:style="fieldStyle"
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
import { useEzFormPluginOptions, useInjectForm } from "@/composables";
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

const form = useInjectForm();
const pluginOptions = useEzFormPluginOptions();

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

const fieldStyle = computed(() => {
	const requiredMarkCssVar = `--${form.classPrefix}-form-required-mark`;
	const colonCssVar = `--${form.classPrefix}-form-colon`;
	return {
		[requiredMarkCssVar]: props.requiredMark,
		[colonCssVar]: `"${props.colon ?? pluginOptions?.colon ? ":" : ""}"`,
	};
});
</script>
