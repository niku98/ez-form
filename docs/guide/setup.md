---
title: Setup
---

# Setup

## Installation

#### With npm

```sh
npm í @niku/ez-form --save
```

#### With yarn

```sh
yarn add @niku/ez-form
```

## Register global component (Optional)

```ts
import EzForm from "@niku/ez-form";
import { createApp } from "vue";
import App from "@/src/App.vue";

const app = createApp(App);
app.use(EzForm);

app.mount("#app");
```

#### Typescript supported

```ts
// env.d.ts

/// <reference types="@niku/ez-form/dist/types" />
```
