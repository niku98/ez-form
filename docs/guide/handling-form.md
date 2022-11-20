---
title: Handling Form
---

<script setup>
import HandleFormBasic from "examples/HandleFormBasic.vue";
import HandleFormWithInitialValues from "examples/HandleFormWithInitialValues.vue";
import HandleFormReInitialize from "examples/HandleFormReInitialize.vue";
import HandleFormReset from "examples/HandleFormReset.vue";
import HandleFormError from "examples/HandleFormError.vue";
</script>

# Handling Form

**Ez Form** provide an easy way to handle form.

When building form with **Ez Form**, you only need to care about two components:

- **EzForm**: Wrap all your form.
- **EzFormItem**:
  - prop _name_ : Name path of your final form data/Form item's name.
  - slot _default_ : Pass your input into it.

## Form Data And Handle Submit

As you can see. There are no `v-model` in example. **Ez Form** . We will automatically bind `:value` and `@update:value` to **_FIRST NODE_** of **EzFormItem's** default slot. Form's data will be synced with input's data via name props you passed to **EzFormItem**.

When form is submitted and form's data is valid. You may receive form's data via `@submit` event.

<HandleFormBasic />

::: details View Code

```vue
<template>
	<EzForm @submit="handleSubmit">
		<EzFormItem label="Username" name="username">
			<input placeholder="Enter Username" />
		</EzFormItem>
		<EzFormItem label="Password" name="password">
			<input placeholder="Password" type="password" />
		</EzFormItem>

		<button type="submit">Submit</button>
	</EzForm>
</template>

<script lang="ts" setup>
function handleSubmit(values: LoginRequest) {
	console.log(values); // {username: "tester", password: "123456"}
}
</script>
```

:::

The snippet above is an example of login form. After Form submit, console will log form's data with structure like this:

```ts
{
	username: "tester",
	password: "123456"
}
```

## Initial Values

In some case, like editing data. You can provide initial values to **EzForm**. All input's value will be filled with data you provided.

<HandleFormWithInitialValues/>

::: details View Code

```vue
<template>
	<EzForm :initial-values="initialValues" @submit="handleSubmit">
		<EzFormItem label="Username" name="username" :rules="{ required: true }">
			<input placeholder="Enter Username" />
		</EzFormItem>
		<EzFormItem
			label="Display name"
			name="displayName"
			:rules="{ required: true }"
		>
			<input placeholder="Enter Display name" />
		</EzFormItem>

		<button type="submit">Submit</button>
	</EzForm>
</template>

<script lang="ts" setup>
export interface UserRequest {
	username: string;
	displayName: string;
}

const initialValues = reactive<UserRequest>({
	username: "tester",
	displayName: "Tester",
});

function handleSubmit(values: UserRequest) {
	console.log(values); // {username: "tester", displayName: "Tester"}
}
</script>
```

:::

### Enable Reinitialize

By default, if `initialValues` changed, form data will not be reinitialized to new `initialValues's` value.

In some case, you may fill data received from api to form. So, the `initialValues` will be changed. You can pass prop `enableReinitialize` to **EzForm**, then anytime `initialValues` changes, the form wil reinitialize.

<HandleFormReInitialize />

::: details View Code

```vue
<template>
	<div class="example-box">
		<EzForm
			:initial-values="initialValues"
			@submit="handleSubmit"
			enableReinitialize
		>
			<EzFormItem label="Username" name="username" :rules="{ required: true }">
				<input placeholder="Enter Username" />
			</EzFormItem>
			<EzFormItem label="Display name" name="name" :rules="{ required: true }">
				<input placeholder="Enter Display name" />
			</EzFormItem>

			<div :style="{ display: 'flex', gap: '0.5rem' }">
				<button type="submit">Submit</button>
				<button type="button" @click="fetchUser()">Fetch user</button>
			</div>
		</EzForm>
		<div v-if="loading">Loading...</div>
	</div>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";

export interface UserRequest {
	username: string;
	name: string;
}

const initialValues = reactive<UserRequest>({
	username: "",
	name: "",
});

const loading = ref(false);

function fetchUser() {
	loading.value = true;
	fetch("https://jsonplaceholder.typicode.com/users/1")
		.then((res) => res.json())
		.then((data) => {
			Object.assign(initialValues, data);
			loading.value = false;
		});
}

function handleSubmit(values: UserRequest) {
	console.log(values); // {username: "tester", displayName: "Tester"}
}
</script>
```

:::

## Handle Reset

When form reset, form data and errors will be reset to default value. If you provide `initialValues`, form data will be reset to it. Then, an event called `@reset` wil be emitted.

<HandleFormReset />

::: details View Code

```vue
<template>
	<EzForm @submit="handleSubmit" @reset="handleReset">
		<EzFormItem label="Username" name="username">
			<input placeholder="Enter Username" />
		</EzFormItem>
		<EzFormItem label="Password" name="password">
			<input placeholder="Password" type="password" />
		</EzFormItem>

		<button type="submit">Submit</button>
		<button type="reset">Reset</button>
	</EzForm>
</template>

<script lang="ts" setup>
function handleSubmit(values: LoginRequest) {
	console.log(values); // {username: "tester", password: "123456"}
}

function handleReset() {
	console.log("Form reset");
}
</script>
```

:::

## Handle Error

When form submitting validate error, an event called `@error` will be emitted. You can do things when it emitted.

<HandleFormError />

::: details View Code

```vue
<template>
	<EzForm @submit="handleSubmit" @error="handleError">
		<EzFormItem label="Username" name="username" :rules="{ required: true }">
			<input placeholder="Enter Username" />
		</EzFormItem>
		<EzFormItem label="Password" name="password" :rules="{ required: true }">
			<input placeholder="Password" type="password" />
		</EzFormItem>

		<button type="submit">Submit</button>
	</EzForm>
</template>

<script lang="ts" setup>
import type { ValidateError } from "@niku/ez-form";

function handleSubmit(values: LoginRequest) {
	console.log(values); // {username: "tester", password: "123456"}
}

function handleError(errors: ValidateError[]) {
	console.log("Form errors", errors);
}
</script>
```

:::
