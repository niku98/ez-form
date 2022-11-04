---
title: Validation
---

# Validation

**Ez Form** use [`async-validator`](https://www.npmjs.com/package/async-validator) to handle form 's validation.

There are two ways you can add rules to validate form.

## FormItem Level

**EzFormItem** has prop **_rules_** to get rules for each field in your form.

```vue
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

## Form Level

You can pass your _validation's rules_ to **EzForm** using prop _rules_. It is similar to **EzFormItem's** prop _rules_.

```vue
<template>
	<EzForm
		:rules="{
			'user.username': [{ type: 'string', min: 3 }],
			'user.firstName': { type: 'string', min: 3 },
		}"
		@submit="handleSubmit"
		@error="handleError"
	>
		<EzFormItem
			label="Username"
			:name="['user', 'username']"
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

Rules has same **_name_** in **EzForm** and **EzFormItem** will be merged.

Example: Rules of `user.username` will be

```ts
[{ require: true }, { type: "string", min: 3 }];
```

## Rules

For more rules, please check [`async-validator`](https://github.com/yiminghe/async-validator#type) documentation.
