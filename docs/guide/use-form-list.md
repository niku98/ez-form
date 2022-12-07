---
title: useFormList
---

<script setup>
import UseFormListBasic from "examples/UseFormListBasic.vue";
import UseFormListStandalone from "examples/UseFormListStandalone.vue";
</script>

# useFormList

`useFormList` return a [`FormListInstance`](/api-reference/types/form-list.html#formlistinstance).

**See also:** [Api Reference - FormList Instance](/api-reference/main-api/form-list-instance)

## Use with `EzFormList`

If you need to access to `FormListInstance`, you can use `useFormList` to create a `FormListInstance`, then pass it to `EzFormList`.

**Example**

<UseFormListBasic />

::: details View Code

```vue{33-72,76-78}
<template>
	<div class="example-box">
		<EzForm @submit="handleSubmit">
			<EzFormItem
				label="Username"
				name="user.username"
				:rules="[{ required: true }]"
			>
				<input placeholder="Enter Username" />
			</EzFormItem>
			<EzFormItem
				label="First name"
				name="user.firstName"
				:rules="[{ required: true }]"
			>
				<input placeholder="Enter your First name" />
			</EzFormItem>
			<EzFormItem
				label="First name"
				name="user.lastName"
				:rules="[{ required: true }]"
			>
				<input placeholder="Enter your Last name" />
			</EzFormItem>
			<EzFormItem
				label="Password"
				name="user.password"
				:rules="[{ required: true }]"
			>
				<input placeholder="Password" type="password" />
			</EzFormItem>

			<EzFormList
				:formList="formList"
				label="Addresses"
				name="user.addresses"
				v-slot="{ fields, add, remove }"
			>
				<div
					v-for="field in fields"
					:key="field.key"
					style="margin-bottom: 1rem"
				>
					<h4>Address {{ field.index + 1 }}</h4>
					<EzFormItem
						label="Detail"
						:name="field.getNamePath('detail')"
						:rules="[{ required: true }]"
					>
						<input />
					</EzFormItem>
					<EzFormItem
						label="District"
						:name="field.getNamePath('district')"
						:rules="[{ required: true }]"
					>
						<select>
							<option value="d-1">District 1</option>
							<option value="d-2">District 2</option>
							<option value="d-3">District 3</option>
							<option value="d-4">District 4</option>
							<option value="d-5">District 5</option>
						</select>
					</EzFormItem>

					<button type="button" class="danger" @click="remove(field.index)">
						Remove address
					</button>
				</div>

				<button type="button" @click="add()">Add address</button>
			</EzFormList>
			<div :style="{ display: 'flex', gap: '0.5rem' }">
				<button type="submit">Submit</button>
				<button type="reset">Reset</button>
				<button type="button" class="danger" @click="formList.pop()">
					Remove last address
				</button>
			</div>
		</EzForm>
	</div>
</template>

<script lang="ts" setup>
import { useFormList } from "@niku/ez-form";

const formList = useFormList();

function handleSubmit(values) {
	console.log(values);
}

function handleReset() {
	console.log("Form reset");
}
</script>
```

:::

::: warning

In this case, `FormListInstance` only can access after component mount. So, if you do thing before component mount, it may work unexpected.

:::

::: tip

You can use `getFormListInstance` to get instance of a form list.

[See here](/guide/get-instances#getformlistinstance)

:::

## Standalone

Without using `EzFormList`. You can use `useFormList` to control your input. But, you need to binding value and event yourself.

**Example**

<UseFormListStandalone />

::: details View Code

```vue {33-73,78-80}
<template>
	<div class="example-box">
		<div class="ez-form">
			<EzFormItem
				label="Username"
				name="user.username"
				:rules="[{ required: true }]"
			>
				<input placeholder="Enter Username" />
			</EzFormItem>
			<EzFormItem
				label="First name"
				name="user.firstName"
				:rules="[{ required: true }]"
			>
				<input placeholder="Enter your First name" />
			</EzFormItem>
			<EzFormItem
				label="First name"
				name="user.lastName"
				:rules="[{ required: true }]"
			>
				<input placeholder="Enter your Last name" />
			</EzFormItem>
			<EzFormItem
				label="Password"
				name="user.password"
				:rules="[{ required: true }]"
			>
				<input placeholder="Password" type="password" />
			</EzFormItem>

			<div class="ez-form-item ez-form-list">
				<label>Username</label>
				<div class="ez-form-item-input">
					<div
						v-for="field in formList.fields.value"
						:key="field.key"
						style="margin-bottom: 1rem"
					>
						<h4>Address {{ field.index + 1 }}</h4>
						<EzFormItem
							label="Detail"
							:name="field.getNamePath('detail')"
							:rules="[{ required: true }]"
						>
							<input />
						</EzFormItem>
						<EzFormItem
							label="District"
							:name="field.getNamePath('district')"
							:rules="[{ required: true }]"
						>
							<select>
								<option value="d-1">District 1</option>
								<option value="d-2">District 2</option>
								<option value="d-3">District 3</option>
								<option value="d-4">District 4</option>
								<option value="d-5">District 5</option>
							</select>
						</EzFormItem>

						<button
							type="button"
							class="danger"
							@click="formList.remove(field.index)"
						>
							Remove address
						</button>
					</div>

					<button type="button" @click="formList.add()">Add address</button>
				</div>
			</div>
			<div :style="{ display: 'flex', gap: '0.5rem' }">
				<button type="button" @click="handleSubmit()">Submit</button>
				<button type="button" @click="handleReset()">Reset</button>
				<button type="button" class="danger" @click="formList.pop()">
					Remove last address
				</button>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { EzFormItem, useForm, useFormList } from "../../src";

const form = useForm();
const formList = useFormList({
	name: "user.addresses",
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

In this case. if you use `useFormList` with a form instance. You have to place `useFormList` after `useForm` or inside `EzForm`.

:::
