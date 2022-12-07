---
title: useFormItem
---

<script setup>
import UseFormItemBasic from "examples/UseFormItemBasic.vue";
import UseFormItemStandalone from "examples/UseFormItemStandalone.vue";
</script>

# useFormItem

`useFormItem` return a [`FormItemInstance`](/api-reference/types/form-item.html#formiteminstance).

**See also:** [Api Reference - FormItem Instance](/api-reference/main-api/form-item-instance)

## Use with `EzFormItem`

If you need to access to `FormItemInstance`, you can use `useFormItem` to create a `FormItemInstance`, then pass it to `EzFormItem`.

**Example**

<UseFormItemBasic />

::: details View Code

```vue
<template>
	<div class="example-box">
		<EzForm @submit="handleSubmit" @reset="handleReset">
			<EzFormItem
				:formItem="formItem"
				label="Username"
				name="username"
				:rules="[{ required: true }]"
			>
				<input placeholder="Enter Username" />
				<span
					@click="formItem.validate()"
					:style="{
						display: 'inline-block',
						marginLeft: '10px',
						cursor: 'pointer',
					}"
					>Validate</span
				>
			</EzFormItem>
			<EzFormItem label="Password" name="password">
				<input placeholder="Password" type="password" />
			</EzFormItem>
			<div :style="{ display: 'flex', gap: '0.5rem' }">
				<button type="submit">Submit</button>
				<button type="reset">Reset</button>
			</div>
		</EzForm>
		<p>Try click Validate.</p>
	</div>
</template>

<script lang="ts" setup>
import { useFormItem } from "@niku/ez-form";

const formItem = useFormItem();

function handleSubmit(values) {
	console.log(values); // {username: "tester", password: "123456"}
}

function handleReset() {
	console.log("Form reset");
}
</script>
```

:::

::: warning

In this case, `FormItemInstance` only can access after component mount. So, if you do thing before component mount, it may work unexpected.

:::

::: tip

You can use `getFormItemInstance` to get instance of a form item.

[See here](/guide/get-instances#getformiteminstance)

:::

## Standalone

Without using `EzFormItem`. You can use `useFormItem` to control your input. But, you need to binding value and event yourself.

**Example**

<UseFormItemStandalone />

::: details View Code

```vue
<template>
	<div class="example-box">
		<div class="ez-form">
			<div class="ez-form-item">
				<label>Username</label>
				<div class="ez-form-item-input">
					<input
						:value="formItem.value"
						placeholder="Enter Username"
						@input="formItem.handleChange"
						@blur="formItem.handleBlur"
					/>
				</div>
			</div>
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
import { useForm, useFormItem } from "@niku/ez-form";

const form = useForm();
const formItem = useFormItem({
	name: "username",
});

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

::: warning

In this case. if you use `useFormItem` with a form instance. You have to place `useFormItem` after `useForm` or inside `EzForm`.

:::
