---
title: Custom Inputs
---

# Select Input

Please read [Auto Binding](/guide/auto-binding) first.

A simple example to describe how **Ez Form** deal with your input.

Firstly, this is our Select Input.

```vue
<!-- Select.vue -->
<template>
	<div class="custom-select">
		<span class="custom-select-button">
			{{ label }}
		</span>

		<div class="custom-select-dropdown">
			<span
				v-for="option in options"
				:key="option.value"
				class="custom-select-option"
				@click="selectOption(option)"
			>
				{{ option.label }}
			</span>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

export interface SelectOption {
	value: any;
	label: string;
}

const props = defineProps<{
	options?: SelectOption[];
	value?: any;
	placeholder?: string;
}>();

const emit = defineEmits<{
	(eventName: "update:value", value: any): void;
}>();

const label = computed(() => {
	if (props.value) {
		const option = options.find((option) => option.value === props.value);
		return option.label ?? props.value;
	}

	return props.placeholder ?? "Select item";
});

function selectOption(option: SelectOption) {
	emit("update:value", option.value);
}
</script>
```

Then, this is how it will be used with **Ez Form**.

```vue
<template>
	<EzForm>
		<EzFormItem label="Gender" name="gender">
			<Select placeholder="Select gender" :options="genderOptions" />
		</EzFormItem>
	</EzForm>
</template>

<script lang="ts" setup>
const genderOptions = [
	{ value: "male", label: "Male" },
	{ value: "female", label: "FeMale" },
	{ value: "biosexual", label: "BioSexual" },
];
</script>
```

That is all.
