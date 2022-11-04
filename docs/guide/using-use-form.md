---
title: Using useForm
---

# Using useForm

In some case, you may control form from outside of it. So you can use composable `useForm` to control the form.

`useForm` return a `FormInstance`, you need to pass it to **EzForm**. Then you can use `FormInstance's` methods to handle form.

#### Example

```vue
<template>
	<EzForm :form="form" @submit="handleSubmit" @reset="handleReset">
		<EzFormItem label="Username" name="username">
			<input placeholder="Enter Username" />
		</EzFormItem>
		<EzFormItem label="Password" name="password">
			<input placeholder="Password" type="password" />
		</EzFormItem>

		<button type="button" @click="form.submit()">Submit</button>
		<button type="button" @click="form.reset()">Reset</button>
	</EzForm>
</template>

<script lang="ts" setup>
import { useForm } from "@niku/ez-form";

const form = useForm();

function handleSubmit(values: LoginRequest) {
	console.log(values); // {username: "tester", password: "123456"}
}

function handleReset() {
	console.log("Form reset");
}
</script>
```
