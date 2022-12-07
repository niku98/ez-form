---
title: Get Define Props Object
---

# Get Define Props Object

These utilities help you to generate `defineProps` object to pass to `defineProps` function in your `CustomForm`, `CustomFormItem` and `CustomFormList`.

## getFormDefinePropsObject()

Use to generate `defineProps` object for `CustomForm`.

**Type**

```ts
getFormDefinePropsObject(): any;
```

**Example**

```vue
<!-- CustomForm.vue -->

<template>...</template>
<script lang="ts" setup>
import { getFormDefinePropsObject } from "@niku/ez-form";

const props = defineProps(getFormDefinePropsObject());
</script>
```

**See also:** [Custom Form](/guide/custom-form)

## getFormItemDefinePropsObject()

Use to generate `defineProps` object for `CustomFormItem`.

**Type**

```ts
getFormItemDefinePropsObject(): any;
```

**Example**

```vue
<!-- CustomForm.vue -->

<template>...</template>
<script lang="ts" setup>
import { getFormItemDefinePropsObject } from "@niku/ez-form";

const props = defineProps(getFormItemDefinePropsObject());
</script>
```

**See also:** [Custom FormItem](/guide/custom-form-item)

## getFormListDefinePropsObject()

Use to generate `defineProps` object for `CustomFormList`.

**Type**

```ts
getFormListDefinePropsObject(): any;
```

**Example**

```vue
<!-- CustomForm.vue -->

<template>...</template>
<script lang="ts" setup>
import { getFormListDefinePropsObject } from "@niku/ez-form";

const props = defineProps(getFormListDefinePropsObject());
</script>
```

**See also:** [Custom FormList](/guide/custom-form-list)
