---
title: Setup
---

# Setup

It is very easy to setup **Ez Form**. There are only few steps to start using it.

## I. Installation

#### With npm

```sh
npm i @niku/ez-form --save
```

#### With yarn

```sh
yarn add @niku/ez-form
```

## II. Add CSS

```ts
// main.ts

import "@niku/ez-form/dist/style.css";
import { createApp } from "vue";
import App from "@/src/App.vue";

const app = createApp(App);

app.mount("#app");
```

## III. Usage

### Local components

```vue
<template>
	<EzForm @submit="handleSubmit">
		<EzFormItem label="Username" name="username">
			<input placeholder="Enter Username" />
		</EzFormItem>
		<EzFormItem label="Display name" name="displayName">
			<input placeholder="Enter Display name" />
		</EzFormItem>
		<button type="submit">Submit</button>
	</EzForm>
</template>

<script lang="ts" setup>
import { EzForm, EzFormItem } from "@niku/ez-form";
</script>
```

### Global components (Optional)

#### Register components

Register components with Vue App as example bellow.

```ts
// main.ts

import EzFormPlugin from "@niku/ez-form";
import { createApp } from "vue";
import App from "@/src/App.vue";

const app = createApp(App);
app.use(EzFormPlugin);

app.mount("#app");
```

Then, using **EzForm** like local components.

```vue
<template>
	<EzForm @submit="handleSubmit">
		<EzFormItem label="Username" name="username">
			<input placeholder="Enter Username" />
		</EzFormItem>
		<EzFormItem label="Display name" name="displayName">
			<input placeholder="Enter Display name" />
		</EzFormItem>
		<button type="submit">Submit</button>
	</EzForm>
</template>
```

#### Typescript supported

```ts
// env.d.ts

/// <reference types="@niku/ez-form/dist/types" />
```
