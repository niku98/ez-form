---
title: useForm
---

<script setup>
	import UseFormBasic from "examples/UseFormBasic.vue";
	import UseFormStandalone from "examples/UseFormStandalone.vue";
	import UseFormMultiple from "examples/UseFormMultiple.vue";
</script>

# useForm

`useForm` return a [`FormInstance`](/api-reference/types/form.html#forminstance).

**See also:** [Api Reference - Form Instance](/api-reference/main-api/form-instance)

## Use with `EzForm`

In some case, you may control form from outside of it. So you can use composable `useForm` to control the form.

You need to pass [`FormInstance`](/api-reference/types/form.html#forminstance), return from `useForm`, to **EzForm**. Then you can use `FormInstance's` methods to handle form.

**Example**

<UseFormBasic />

::: details View Code

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

:::

::: warning

Only use `useForm` this way when you want to access to form instance before component mount.

:::

## Multiple Form

In some case, you may want to control multiple form inside `<script>`. You can do it with `useForm` and `EzForm`.

Firstly, you have to create form instances via `useForm`. Then, passing them into `EzForm`.

**Example**

<UseFormMultiple />

::: details View Code

```vue
<template>
	<div
		class="example-box"
		style="display: grid; grid-template-columns: repeat(2, 1fr)"
	>
		<div>
			<EzForm :form="form" @submit="handleSubmit" @reset="handleReset">
				<EzFormItem label="Username" name="username">
					<input placeholder="Enter Username" />
				</EzFormItem>
				<EzFormItem label="Password" name="password">
					<input placeholder="Password" type="password" />
				</EzFormItem>
				<div :style="{ display: 'flex', gap: '0.5rem' }">
					<button type="button" @click="form.submit()">Submit</button>
					<button type="button" @click="form.reset()">Reset</button>
				</div>
			</EzForm>
			<p>Click submit then check console tab in devtool.</p>
		</div>
		<div>
			<EzForm :form="form2" @submit="handleSubmit2" @reset="handleReset2">
				<EzFormItem label="Username" name="username">
					<input placeholder="Enter Username" />
				</EzFormItem>
				<EzFormItem label="Password" name="password">
					<input placeholder="Password" type="password" />
				</EzFormItem>
				<div :style="{ display: 'flex', gap: '0.5rem' }">
					<button type="button" @click="form2.submit()">Submit</button>
					<button type="button" @click="form2.reset()">Reset</button>
				</div>
			</EzForm>
			<p>Click submit then check console tab in devtool.</p>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { EzForm, EzFormItem, useForm } from "../../src";

const form = useForm();
const form2 = useForm();

function handleSubmit(values) {
	console.log("Form 1 submit", values); // {username: "tester", password: "123456"}
}

function handleReset() {
	console.log("Form reset");
}

function handleSubmit2(values) {
	console.log("Form 2 submit", values); // {username: "tester", password: "123456"}
}

function handleReset2() {
	console.log("Form 2 reset");
}
</script>
```

:::

## Standalone

You can use `useForm` to handle form, without `EzForm`. But you can't controls multiple form without `EzForm`.

**Example**

<UseFormStandalone />

::: details View Code

```vue
<template>
	<div class="example-box">
		<div class="ez-form">
			<EzFormItem label="Username" name="username">
				<input placeholder="Enter Username" />
			</EzFormItem>
			<EzFormItem label="Password" name="password">
				<input placeholder="Password" type="password" />
			</EzFormItem>
			<div :style="{ display: 'flex', gap: '0.5rem' }">
				<button type="button" @click="handleSubmit()">Submit</button>
				<button type="button" @click="handleReset()">Reset</button>
			</div>
		</div>
		<p>Click submit then check console tab in devtool.</p>
	</div>
</template>

<script lang="ts" setup>
const form = useForm();

function handleSubmit() {
	form.submit().then(({ values, errors }) => {
		if (!errors) {
			console.log("Form values", values);
		} else {
			console.log("Form errors", errors);
		}
	});
}

function handleReset() {
	form.reset();
	console.log("Form reset");
}
</script>
```

:::
