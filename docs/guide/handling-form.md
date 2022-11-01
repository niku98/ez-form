---
title: Handling Form
---

# Handling Form

**Ez Form** provide an easy way to handle form.

When building form with **Ez Form**, you only need to care about two components:

- **EzForm**: Wrap all your form.
- **EzFormItem**:
  - prop _name_ : Name path of your final form data/Form item's name.
  - slot _default_ : Pass your input into it.

## Login form

```vue
<template>
	<EzForm @submit="handleSubmit">
		<EzFormItem label="Username" name="username">
			<input placeholder="Enter Username" />
		</EzFormItem>
		<EzFormItem label="Password" name="password">
			<input placeholder="Password" type="password" />
		</EzFormItem>
	</EzForm>
</template>

<script lang="ts" setup>
function handleSubmit(values: LoginRequest) {
	console.log(values); // {username: "tester", password: "123456"}
}
</script>
```

The snippet above is an example of login form. After Form submit, console will log form's data with structure like this:

```ts
{
	username: "tester",
	password: "123456"
}
```

## Nested

In some case, you will need to work with nested form's data. With **Ez Form**, you just need to pass _Name path_ to **EzFormItem**'s prop _name_.

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
