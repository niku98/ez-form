---
title: Nested
---

# Nested

## Nested Object

In some case, you will need to work with nested form's data. With **Ez Form**, you just need to pass _Name path_ to **EzFormItem**'s prop _name_. _Name path_ has structure just like lodash's path.

The _Name path_ can be `string|number|Array<number | string>`.

### Examples

There are some examples to show how **Ez Form** deal with nested form's data.

All examples will have same result as bellow:

```ts
{
	user: {
		username: "tester",
		firstName: "Johnny",
		lastName: "Pham",
		password: "123456"
	}
}
```

#### String name path

```vue
<template>
	<EzForm @submit="handleSubmit">
		<EzFormItem label="Username" name="user.username">
			<input placeholder="Enter Username" />
		</EzFormItem>
		<EzFormItem label="First name" name="user.firstName">
			<input placeholder="Enter your First name" />
		</EzFormItem>
		<EzFormItem label="First name" name="user.lastName">
			<input placeholder="Enter your Last name" />
		</EzFormItem>
		<EzFormItem label="Password" name="user.password">
			<input placeholder="Password" type="password" />
		</EzFormItem>
	</EzForm>
</template>

<script lang="ts" setup>
function handleSubmit(values: RegisterUserRequest) {
	console.log(values); // {user: {username: "tester", firstName: "Johnny", lastName: "Pham", password: "123456"}}
}
</script>
```

#### Array name path

```vue
<template>
	<EzForm @submit="handleSubmit">
		<EzFormItem label="Username" :name="['user', 'username']">
			<input placeholder="Enter Username" />
		</EzFormItem>
		<EzFormItem label="First name" :name="['user', 'firstName']">
			<input placeholder="Enter your First name" />
		</EzFormItem>
		<EzFormItem label="First name" :name="['user', 'lastName']">
			<input placeholder="Enter your Last name" />
		</EzFormItem>
		<EzFormItem label="Password" :name="['user', 'password']">
			<input placeholder="Password" type="password" />
		</EzFormItem>
	</EzForm>
</template>

<script lang="ts" setup>
function handleSubmit(values: RegisterUserRequest) {
	console.log(values); // {user: {username: "tester", firstName: "Johnny", lastName: "Pham", password: "123456"}}
}
</script>
```

## Nested Array

Similar to object, you can also nest your data in an array. In _Name path_, just replacing property's name with a number. Example: `users[0].username`, `users.0.username` or `['users', 0, 'username']`.

### Example

```vue
<template>
	<EzForm @submit="handleSubmit">
		<EzFormItem label="Username" name="users[0].username">
			<input placeholder="Enter Username" />
		</EzFormItem>
		<EzFormItem label="First name" :name="['users', 0, 'firstName']">
			<input placeholder="Enter your First name" />
		</EzFormItem>
		<EzFormItem label="First name" name="users.0.lastName">
			<input placeholder="Enter your Last name" />
		</EzFormItem>
		<EzFormItem label="Password" name="users.0.password">
			<input placeholder="Password" type="password" />
		</EzFormItem>
	</EzForm>
</template>

<script lang="ts" setup>
function handleSubmit(values: RegisterUserRequest) {
	console.log(values); // {users: [{username: "tester", firstName: "Johnny", lastName: "Pham", password: "123456"}]}
}
</script>
```

Submitting the form above will receive the following result:

```ts
{
	users: [
		{
			username: "tester",
			firstName: "Johnny",
			lastName: "Pham",
			password: "123456",
		},
	];
}
```

## Avoiding Nesting

In some case, you may have property's name like `user.fullName`. You can put that property's name to an array's element.

```vue
<template>
	<EzForm @submit="handleSubmit">
		<EzFormItem label="Username" :name="['user.fullName']">
			<input placeholder="Enter Username" />
		</EzFormItem>
	</EzForm>
</template>

<script lang="ts" setup>
function handleSubmit(values: RegisterUserRequest) {
	console.log(values); // {"user.fullName": "Johnny Pham"}
}
</script>
```
