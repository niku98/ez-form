---
title: Form List
---

# Form List

**Ez Form** provide a component called **EzFormList** to help you with array field. You need to pass to it a `name` of field that holds array of data.

```vue{32-57}
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

		<EzFormList label="Addresses" name="user.addresses" v-slot="{namePaths, add}">
			<div v-for="(namePath, index) in namePaths" :key="index">
				<EzFormItem
					label="detail"
					:name="[...namePath, 'detail']"
					:rules="[{ required: true }]"
				>
					<input />
				</EzFormItem>
				<EzFormItem
					label="District"
					:name="[...namePath, 'district']"
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

## Scoped slot data

**EzFormList** provide some data and function in `default slot` to help you with array field.

| Name        | Description                                              | Type                                                          |
| :---------- | :------------------------------------------------------- | :------------------------------------------------------------ |
| value       | Value of form list                                       | `Array<any>`                                                  |
| length      | Length of form list's value                              | `number`                                                      |
| namePaths   | List generated name path to pass to form item            | `Array<string\|number>`                                       |
| getNamePath | Function to generate name path of form item in form list | `(index: number, namePath: string) => Array<string\|number>`  |
| errors      | List error of form list                                  | `Array`                                                       |
| getErrors   | Function to get list array of form list's item           | `(index: number) => Array`                                    |
| hasError    | Function to check if form item has error if              | `(index: number) => boolean`                                  |
| add         | Function to add item to form list                        | `(value?: any) => void`                                       |
| remove      | Function to remove item from form list by index          | `(index: number) => void`                                     |
| removeByKey | Function to remove item from list by custom key          | `(key: string, value: any) => void`                           |
| swap        | Function to swap two item by index                       | `(firstIndex: number, secondIndex: number) => void`           |
| replace     | Function to replace an item of list with other value     | `(index: number, value: any) => void`                         |
| move        | Function to move an item of list to other index          | `(fromIndex: number, toIndex: number) => void`                |
| form        | Form's utility functions and data                        | [`FormInstance`](/api-reference/types/form.html#forminstance) |
