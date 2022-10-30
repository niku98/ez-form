---
title: Why Ez Form?
---

# {{$frontmatter.title}}

**Ez Form** is very fast. Easy-to-use with beginner-friendly documentation.

## Form's State Management

You are tired because of form state management. Don't worry, with **Ez Form**, Form's state will be managed inside it own.

All the things you need to do is building your form's state structure.

```vue
<template>
	<Form @submit="handleSubmit">
		<FormItem label="Username" name="username">
			<input placeholder="Enter Username" />
		</FormItem>
		<FormItem label="Display name" name="displayName">
			<input placeholder="Enter Display name" />
		</FormItem>
	</Form>
</template>

<script lang="ts" setup>
export interface User {
	username: string;
	displayName: string;
}

function handleSubmit(values: User) {
	console.log(values); // {username: "test_user", displayName: "Tester"}
}
</script>
```

## Using With Other Input Components

**Ez Form** doesn't have any built-in input component. It's fully compatible with all input components from other UI Framework, like [**Ant Design**](https://antdv.com/), or your own input components.

```vue
<template>
	<Form @submit="handleSubmit">
		<FormItem label="Username" name="username">
			<!-- Ant Design's input -->
			<a-input placeholder="Enter Username" />
		</FormItem>
		<FormItem label="Display name" name="displayName">
			<a-input placeholder="Enter Display name" />
		</FormItem>
	</Form>
</template>

<script lang="ts" setup>
export interface User {
	username: string;
	displayName: string;
}

function handleSubmit(values: User) {
	console.log(values); // {username: "test_user", displayName: "Tester"}
}
</script>
```
