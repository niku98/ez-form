---
title: Custom Form
---

<script setup>
import CustomForm from "examples/CustomForm.vue";
</script>

# Custom Form

Custom Form, using `useFormComponentLogics` with [**Ant Design UI**](https://antdv.com/)

## Basic

To define a Form Component, there are three things we need to care:

- props
- emitter
- logics

About props, **EzForm** provide function `getFormDefinePropsObject`, let you define props easier. Then emit, you can define it by copy it from this article.

**EzForm** also provide a composable called `useFormComponentLogics` which receive `props` and `emitter` as parameters. This composable will handle almost logics for your `Form`. It will return a `FormInstance` and two functions called `submit` and `reset`. You can use them in template.

Now, let's see how our form component look like when be written with `getFormDefinePropsObject` and `useFormComponentLogics`.

```vue
<!-- AntForm.vue -->
<template>
	<form @submit.prevent="submit()" @reset.prevent="reset()">
		<slot
			:values="meta.values"
			:errors="meta.errors"
			:dirty="meta.dirty"
			:submit="submit"
			:reset="reset"
			:validate="validate"
			:getFieldValue="getFieldValue"
			:setFieldValue="setFieldValue"
			:isDirty="isDirty"
		/>
	</form>
</template>

<script lang="ts" setup>
import {
	getFormDefinePropsObject,
	useFormComponentLogics,
	ValidateError,
} from "@niku/ez-form";

export interface FormEmitter {
	(event: "submit", values: any): void;
	(event: "change", values: any): void;
	(event: "reset"): void;
	(event: "error", errors: ValidateError[]): void;
}

const props = defineProps(getFormDefinePropsObject());
const emit = defineEmits<FormEmitter>();

const { submit, reset, formInstance } = useFormComponentLogics(props, emit);
const { meta, setFieldValue, getFieldValue, validate, isDirty } = formInstance;
</script>
```

So short, right? **EzForm** has done almost things. You just need to care about UI. How to use **Ant Design**? Let's see in next step.

## Add Ant Design Style

### Form classes

Just add class `ant-form` to our tag `form`.

```vue{5}
<!-- AntForm.vue -->

<template>
	...
	<form class="ant-form" ... />
	...
</template>
<script lang="ts" setup>
...
</script>
```

### Customizable layout

**Ant Design** let's us customize form layout by changing props. So, we will let our component can do the same.

Luckily, **Ant Design** also provide function `formProps`, so we can merge our props in previous step with **Ant Design's** props.

We will pick four props from `formProps`:

- layout
- labelCol
- labelAlign
- wrapperCol

```vue{4,9-15}
<!-- AntForm.vue -->

<template>
	<form :class="['ant-form', `ant-form-${layout ?? 'vertical'}`]" ... />
</template>
<script lang="ts" setup>
import { formProps } from "ant-design-vue/es/form";
...
const props = defineProps({
	...getFormDefinePropsObject(),
	labelCol: formProps()["labelCol"],
	labelAlign: formProps()["labelAlign"],
	wrapperCol: formProps()["wrapperCol"],
	layout: formProps()["layout"],
});

...
</script>
```

As you can see, `form`'s property `class` changed to `` :class="['ant-form', `ant-form-${layout ?? 'vertical'}`]" ``. That is prop `layout`, how about remain.

We will provide them, then use in custom `FormItem`.

Firstly, we need define a inject key and an interface.

```ts
// useInjectAntFormStyle.ts

import { ColProps } from "ant-design-vue";
import { FormLabelAlign } from "ant-design-vue/lib/form/interface";
import { inject } from "vue";

export const $injectFormStyleKey = Symbol("injectFormStyleKey");

export interface InjectFormStyle {
	labelCol?: ColProps;
	labelAlign?: FormLabelAlign;
	wrapperCol?: ColProps;
}
```

Then, use them in our component file.

```vue{9-19}
<!-- AntForm.vue -->

...

<script lang="ts" setup>
import {provide} from "vue";
import { $injectFormStyleKey, InjectFormStyle } from "./useInjectAntFormStyle";
...
provide<InjectFormStyle>($injectFormStyleKey, {
	get labelCol() {
		return props.labelCol;
	},
	get labelAlign() {
		return props.labelAlign;
	},
	get wrapperCol() {
		return props.wrapperCol;
	},
});
</script>
```

That's all, our `AntForm` is completed.

## Full source

```ts
// useInjectAntFormStyle.ts

import { ColProps } from "ant-design-vue";
import { FormLabelAlign } from "ant-design-vue/lib/form/interface";
import { inject } from "vue";

export const $injectFormStyleKey = Symbol("injectFormStyleKey");

export interface InjectFormStyle {
	labelCol?: ColProps;
	labelAlign?: FormLabelAlign;
	wrapperCol?: ColProps;
}
```

```vue
<!-- AntForm.vue -->

<template>
	<form
		:class="['ant-form', `ant-form-${layout ?? 'vertical'}`]"
		@submit.prevent="submit()"
		@reset.prevent="reset()"
	>
		<slot
			:values="meta.values"
			:errors="meta.errors"
			:dirty="meta.dirty"
			:submit="submit"
			:reset="reset"
			:validate="validate"
			:getFieldValue="getFieldValue"
			:setFieldValue="setFieldValue"
			:isDirty="isDirty"
		/>
	</form>
</template>

<script lang="ts" setup>
import { formProps } from "ant-design-vue/es/form";
import { provide } from "vue";
import {
	getFormDefinePropsObject,
	useFormComponentLogics,
	ValidateError,
} from "@niku/ez-form";
import { $injectFormStyleKey, InjectFormStyle } from "./useInjectAntFormStyle";

export interface FormEmitter {
	(event: "submit", values: any): void;
	(event: "change", values: any): void;
	(event: "reset"): void;
	(event: "error", errors: ValidateError[]): void;
}

const props = defineProps({
	...getFormDefinePropsObject(),
	labelCol: formProps()["labelCol"],
	labelAlign: formProps()["labelAlign"],
	wrapperCol: formProps()["wrapperCol"],
	layout: formProps()["layout"],
});
const emit = defineEmits<FormEmitter>();

const { submit, reset, formInstance } = useFormComponentLogics(props, emit);
const { meta, setFieldValue, getFieldValue, validate, isDirty } = formInstance;

provide<InjectFormStyle>($injectFormStyleKey, {
	get labelCol() {
		return props.labelCol;
	},
	get labelAlign() {
		return props.labelAlign;
	},
	get wrapperCol() {
		return props.wrapperCol;
	},
});
</script>
```

## Result

The final result when you have done `Custom FormItem` and `Custom FormList`.
<CustomForm />

::: details View Code

```vue
<template>
	<div class="example-box">
		<AntForm @submit="handleSubmit" @reset="handleReset">
			<AntFormItem label="Username" name="username">
				<a-input />
			</AntFormItem>
			<AntFormItem label="Password" name="password">
				<a-input-password />
			</AntFormItem>

			<a-space>
				<a-button html-type="submit" type="primary"> Submit </a-button>
				<a-button html-type="reset" type="default"> Reset </a-button>
			</a-space>
		</AntForm>
	</div>
</template>

<script lang="ts" setup>
import AntForm from "./AntForm.vue";
import AntFormItem from "./AntFormItem.vue";

const handleSubmit = (values: any) => {
	console.log("Form submit", values);
};

const handleReset = () => {
	console.log("Form reset");
};
</script>
```

:::
