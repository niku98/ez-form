---
title: FormItem Instance API
---

# FormItem Instance API

## useFormItem()

Create form item instance, contains all form item's logic.

**Type**

```ts
export default function useFormItem<
	F extends FormInstance | undefined = undefined
>(
	props: F extends FormInstance
		? FormItemProps & { name: string }
		: FormItemProps,
	form?: FormInstance | F
): FormItemInstance;
```

**Example**

```vue
<script lang="ts" setup>
import { useFormItem } from "@niku/ez-form";

const formItem = useFormItem();
</script>
```

## formItem.meta

An object contains form item data and state.

**Type**

```ts
export interface FieldMeta {
	/**
	 * Raw value before being transformed
	 */
	rawValue: any;
	/**
	 * Value after being transformed by valueTransformer()
	 */
	transformedValue: any;
	error?: ValidateError;
	dirty: boolean;
	touched: boolean;
	name?: NamePath;
	id: string;
}

export interface FormItemInstance {
	meta: FieldMeta;
}
```

### formItem.meta.rawValue

Contains form item's raw data.

**Example**

```vue
<script lang="ts" setup>
import { watch } from "vue";
import { useFormItem } from "@niku/ez-form";

const formItem = useFormItem();

watch(
	() => formItem.rawValue,
	() => {
		// Do things
	}
);
</script>
```

### formItem.meta.transformedValue

Contains form item's transformed data. Use to pass to input's value.

**Example**

```vue
<script lang="ts" setup>
import { watch } from "vue";
import { useFormItem } from "@niku/ez-form";

const formItem = useFormItem();

watch(
	() => formItem.transformedValue,
	() => {
		// Do things
	}
);
</script>
```

### formItem.meta.error

Contains form item's error.

**Example**

```vue
<script lang="ts" setup>
import { watch } from "vue";
import { useFormItem } from "@niku/ez-form";

const formItem = useFormItem();

watch(
	() => formItem.error,
	() => {
		if (formItem.error) {
			alert("There are some errors with the form item!!");
		}
	}
);
</script>
```

### formItem.meta.dirty

Determine if form item is `dirty`, changed data. Useful when you need to do things only when the form item is `dirty`.

**Example**

```vue
<script lang="ts" setup>
import { useFormItem } from "@niku/ez-form";

const formItem = useFormItem();

const foo = () => {
	if (formItem.dirty) {
		alert("The form item is changed");
	}
};
</script>
```

### formItem.meta.touched

Determine if form item is `touched`, that mean user focused in input. Useful when you need to do things only when the form item is `touched`.

**Example**

```vue
<script lang="ts" setup>
import { useFormItem } from "@niku/ez-form";

const formItem = useFormItem();

const foo = () => {
	if (formItem.touched) {
		alert("The form item is touched");
	}
};
</script>
```

### formItem.meta\.name

Name of form item, use to register form item with form.

### formItem.meta\.id

Id of form item, can use as id of input.

### formItem.meta\.formName

Name of form, which this form item registered.

## formItem.requiredMarkString

A computed, return a string that contain required mark string. If form item doesn't have rule `required`, it return empty string.

This is useful when you want to create your own form item.

**Type**

```ts
export interface FormItemInstance {
	requiredMarkString: ComputedRef<string>;
}
```

## formItem.handleChange()

Handle input change.

**Type**

```ts
export interface FormItemInstance {
	handleChange: (event: any) => void;
}
```

**Example**

```vue
<template>
	<input
		:value="formItem.meta.transformedValue"
		@input="formItem.handleChange"
	/>
</template>

<script lang="ts" setup>
import { useFormItem } from "@niku/ez-form";

const formItem = useFormItem();
</script>
```

## formItem.handleBlur()

Handle input change.

**Type**

```ts
export interface FormItemInstance {
	handleBlur: () => void;
}
```

**Example**

```vue
<template>
	<input
		:value="formItem.meta.transformedValue"
		@input="formItem.handleChange"
		@blur="formItem.handleBlur"
	/>
</template>

<script lang="ts" setup>
import { useFormItem } from "@niku/ez-form";

const formItem = useFormItem();
</script>
```

## formItem.registerFormField()

Register form item with form instance.

When you use `useFormItem`, if you provide a `name`, and inside a form, this function will be called automatically. You only need to use this when register a form item that outside the form (rarely happened).

**Type**

```ts
export interface FormItemInstance {
	registerFormField: (formInstance?: FormInstance) => void;
}
```

**Example**

```vue
<template>
	<input
		:value="formItem.meta.transformedValue"
		@input="formItem.handleChange"
		@blur="formItem.handleBlur"
	/>
</template>

<script lang="ts" setup>
import { useForm, useFormItem } from "@niku/ez-form";

const form = useForm();
const formItem = useFormItem({ name: "test" });

formItem.registerFormField(form);
</script>
```

## formItem.unRegisterFormField()

Un-Register form item from form instance.

**Type**

```ts
export interface FormItemInstance {
	unRegisterFormField: () => void;
}
```

**Example**

```vue
<template>
	<input
		:value="formItem.meta.transformedValue"
		@input="formItem.handleChange"
		@blur="formItem.handleBlur"
	/>
</template>

<script lang="ts" setup>
import { useForm, useFormItem } from "@niku/ez-form";

const form = useForm();
const formItem = useFormItem({ name: "test" });

formItem.registerFormField(form);

function foo() {
	formItem.unRegisterFormField();
}
</script>
```

## formItem.validate()

Validate form item's value.

**Type**

```ts
export interface FormItemInstance {
	validate: (
		options?: ValidateOption
	) => Promise<{ value?: any; error?: ValidateError }>;
}
```

**Example**

```vue
<template>
	<input
		:value="formItem.meta.transformedValue"
		@input="formItem.handleChange"
		@blur="formItem.handleBlur"
	/>
</template>

<script lang="ts" setup>
import { useForm, useFormItem } from "@niku/ez-form";

const form = useForm();
const formItem = useFormItem({ name: "test" });

const foo = () => {
	formItem.validate({ trigger: "blur" });
};
</script>
```
