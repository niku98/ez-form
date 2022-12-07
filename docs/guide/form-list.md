---
title: Form List
---

<script setup>
import FormListBasic from "examples/FormListBasic.vue";
</script>

# Form List

**Ez Form** provide a component called **EzFormList** to help you with array field. You need to pass to it a `name` of field that holds array of data.

**EzFormList** provide `slot default` with some utilities to help you with array field, handling it easier.

**Example:**

<FormListBasic />

::: details View Code

```vue{32-60}
<template>
	<EzForm @submit="handleSubmit" @error="handleError">
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

		<EzFormList label="Addresses" name="user.addresses" v-slot="{fields, add, remove}">
			<div v-for="field in fields" :key="field.key">
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

				<button type="button" @click="remove(field.index)">
					Remove address
				</button>
			</div>

			<button type="button" @click="add()">Add address</button>
		</EzFormList>
		<button type="submit">Submit</button>
	</EzForm>
</template>

<script lang="ts" setup>
function handleSubmit(values: RegisterUserRequest) {
	console.log(values); // {user: {username: "tester", firstName: "Johnny", lastName: "Pham", password: "123456"}}
}

function handleError(errors) {
	console.log(errors); // List of errors of fields
}
</script>
```

:::

The form above will have data structure like this:

```ts{8-18}
{
	user: {
		username: "tester",
		firstName: "Johnny",
		lastName: "Pham",
		password: "123456",

		addresses: [
			{
				detail: "Nhanh Chinh, Thanh Xuan, Ha Noi",
				district: "d-1"
			},
			{
				detail: "Yet Kieu, Ha Dong, Ha Noi",
				district: "d-2"
			},
			...
		]
	},
}
```

## Scoped slots

**Slot Default**

- **EzFormList:** provide some data and function in `slot default` to help you with array field. You can see all them [here](/api-reference/components/form-list#slot-default)

- **Slot Errors:** You can display custom error message using `slot error`. This slot has some props passed too. You can see them [here](/api-reference/components/form-list#slot-errors)
