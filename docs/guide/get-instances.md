---
title: Get Instances
---

# Get Instances

These utilities will help you get `FormInstance`, `FormItemInstance` or `FormListInstance` from anywhere in your app.

::: warning

Instance that these utilities return only **exits after Form mount**.

If you use these utilities before form component mount, they will return `undefined`.

:::

## getFormInstance()

Function to get `FormInstance` by name. You have to name your form before use this function.

**Type**

```ts
function getFormInstance<Computed extends boolean | undefined = false>(
	name: string,
	isComputed?: Computed | boolean = false
): Computed extends true
	? ComputedRef<FormInstance | undefined>
	: FormInstance | undefined;
```

**Example**

```vue
<template>
	<EzForm name="user" ...> ... </EzForm>
</template>
<script lang="ts" setup>
import { getFormInstance } from "@niku/ez-form";

function foo() {
	const userForm = getFormInstance("user");
}
</script>
```

## getFormItemInstance()

Function to get `FormItemInstance` by _form's name_ and _form item's name path_. You have to name your form before use this function.

**Type**

```ts
function getFormItemInstance<Computed extends boolean | undefined = false>(
	formName: string,
	namePath: NamePath,
	isComputed?: Computed | boolean
): Computed extends true
	? ComputedRef<FormItemInstance | undefined>
	: FormItemInstance | undefined;
```

**Example**

```vue
<template>
	<EzForm name="user" ...>
		<EzFormItem name="username">
			<input />
		</EzFormItem>
		...
	</EzForm>
</template>
<script lang="ts" setup>
import { getFormItemInstance } from "@niku/ez-form";

function foo() {
	const usernameItem = getFormItemInstance("user", "username");
}
</script>
```

## getFormListInstance()

Function to get `FormListInstance` by _form's name_ and _form list's name path_. You have to name your form before use this function.

**Type**

```ts
function getFormListInstance<Computed extends boolean | undefined = false>(
	formName: string,
	namePath: NamePath,
	isComputed: Computed | boolean = false
): Computed extends true
	? ComputedRef<FormListInstance | undefined>
	: FormListInstance | undefined;
```

**Example**

```vue
<template>
	<EzForm name="user" ...>
		<EzFormList name="username"> ... </EzFormList>
		...
	</EzForm>
</template>
<script lang="ts" setup>
import { getFormListInstance } from "@niku/ez-form";

function foo() {
	const usernameItem = getFormListInstance("user", "username");
}
</script>
```
