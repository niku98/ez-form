---
title: Custom Inputs
---

# Custom Inputs

## How Ez Form work

### Updating data

In most case, your input will have a lots of complex requirements. Or you may use an UI Framework like **Ant Design**. It's very easy to use your input with **Ez Form**. Just make sure that your input component has two things bellow:

- Prop `value`: Form data will be pass to your input via this prop.
- Event `@update:value`: **Ez Form** will listen to this event to update data from your input.

Look similar? Yes, it is **Vue 3** `v-model`, in this case, `v-model:value`. Normally, you usually use `v-model` to get data from input, so **Ez Form** do the same, but it is automatic.

In the other words, your input need provide a `v-model:value` to work with **Ez Form**.

### Blur event

By default, **Ez Form** will listen to event `@blur` to determine is input blur. So your component can emit `@blur` to be compatible with **Ez Form**.

## Custom Select Input

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
