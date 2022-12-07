---
title: Custom FormItem
---

# Custom FormItem

Custom FormItem, using `useFormItemComponentLogics` with [**Ant Design UI**](https://antdv.com/)

## Basic

To define a FormItem Component, there are three things we need to care:

- props
- emitter
- logics

About props, **EzForm** provide function `getFormItemDefinePropsObject`, let you define props easier. Then emit, you can define it by copy it from this article.

**EzForm** also provide a composable called `useFormItemComponentLogics` which receive `props` and `emitter` as parameters. This composable will handle almost logics for your `FormItem`. It will return a `FormItemInstance` and `FormInstance`. You can use them in template.

Now, let's see how our form component look like when be written with `getFormItemDefinePropsObject` and `useFormItemComponentLogics`.

```vue
<!-- AntFormItem.vue -->

<template>
	<a-form-item :label="label" :html-for="meta.id">
		<slot
			:value="transformedValue"
			:handleChange="handleChange"
			:handleBlur="handleBlur"
		/>
	</a-form-item>
</template>

<script lang="ts" setup>
import { FormItem as AFormItem } from "ant-design-vue";
import { computed } from "vue";
import {
	FormInstance,
	getFormItemDefinePropsObject,
	useFormItemComponentLogics,
} from "@niku/ez-form";

const props = defineProps(getFormItemDefinePropsObject());

const emit = defineEmits<{
	(event: "change", value: any, form: FormInstance): void;
}>();

const { formItemInstance, formInstance } = useFormItemComponentLogics(
	props,
	emit
);

// Bind data to ant form item
const { meta, transformedValue, handleChange, handleBlur } = formItemInstance;
</script>
```

Now we have a `FormItem` component with slot `default` to place input into. But, how about auto binding? Let's move to next step. We will add auto binding to our `FormItem`.

## Auto Binding

**EzForm** provide a component called `EzFormItemAutoBindingInput`, we just need to replace the slot `default` from previous step with `EzFormItemAutoBindingInput`. Then, we will have a `FormItem` with auto binding.

```vue{5-14}
<!-- AntFormItem.vue -->

<template>
	<a-form-item ...>
		<EzFormItemAutoBindingInput
			:autoBinding="autoBinding"
			:blurEventPropName="blurEventPropName"
			:changeEventPropName="changeEventPropName"
			:inputNodeIndex="inputNodeIndex"
			:valuePropName="valuePropName"
			v-slot="data"
		>
			<slot v-bind="data" />
		</EzFormItemAutoBindingInput>
	</a-form-item>
</template>
<script lang="ts" setup>
import {
	EzFormItemAutoBindingInput,
	...
} from "@niku/ez-form";
...
</script>
```

**See also:** [Under The Hood - Auto Binding](/guide/auto-binding)

## Show Error

`a-form-item` of **Ant Design** has slot `help`, which will be used to display errors. We can use this slot with prop `has-feedback` and prop `validate-status` to display our `FormItem's` errors.

```vue{6,7,10-18,23-26}
<!-- AntFormItem.vue -->

<template>
	<a-form-item
		...
		:has-feedback="hasError"
		:validate-status="hasError ? 'error' : undefined"
	>
		...
		<template v-if="hasError" #help>
			<span
				v-for="message in meta.error?.messages"
				:key="message"
				:style="{ display: 'block' }"
			>
				{{ message }}
			</span>
		</template>
	</a-form-item>
</template>
<script lang="ts" setup>
...
const { meta } = formItemInstance;
const hasError = computed(
	() => !!meta.error?.messages && meta.error.messages.length > 0
);
</script>
```

## Ant Design Style

**Ant Design** also provide `formItemProps`, like `formProps`. We will use this function to define props.

Same as _Custom Form_, we will pick three props from `formItemProps`:

- labelCol
- labelAlign
- wrapperCol

```vue{6-10,14-20,30-41}
<!-- AntFormItem.vue -->

<template>
	<a-form-item
		...
		:label-align="labelAlign"
		:label-col="labelCol"
		:wrapper-col="wrapperCol"
		:required="!!requiredMarkString"
		:no-style="noStyle"
	>
		...

		<template v-if="$slots.extra" #extra>
			<slot
				name="extra"
				:form="formInstance"
				:formItem="formItemInstance"
			></slot>
		</template>
	</a-form-item>
</template>
<script lang="ts" setup>
import { formItemProps } from "ant-design-vue/es/form";
import { computed } from "vue";
import { formItemProps } from "ant-design-vue/es/form";
...

const props = defineProps(getFormItemDefinePropsObject()); // [!code --]
const props = defineProps({ // [!code ++]
	...getFormItemDefinePropsObject(), // [!code ++]
	labelCol: formItemProps()["labelCol"], // [!code ++]
	labelAlign: formItemProps()["labelAlign"], // [!code ++]
	wrapperCol: formItemProps()["wrapperCol"], // [!code ++]
}); // [!code ++]

const { meta } = formItemInstance; // [!code --]
const { meta, requiredMarkString } = formItemInstance; // [!code ++]
...
// Cheating Ant form style
const formStyle = useInjectAntFormStyle();

const labelAlign = computed(() => {
	return props.labelAlign ?? formStyle.labelAlign;
});
const labelCol = computed(() => {
	return props.labelCol ?? formStyle.labelCol;
});
const wrapperCol = computed(() => {
	return props.wrapperCol ?? formStyle.wrapperCol;
});
</script>
```

To be compatible with `a-form-item`, we add slot `extra`, some props:

- **required**: Mark as required when has rule `required`.
- **noStyle**: Remove `a-form-item` markup.

About `labelCol`, `labelAlign` and `wrapperCol`, we define a computed for each of them. Which will get value from props if exist or use value that provided by `AntForm` we created in [Custom Form](/guide/custom-form)

Now, our `AntFormItem` is completed.

## Full source

```vue
<template>
	<a-form-item
		:label="label"
		:html-for="meta.id"
		:label-align="labelAlign"
		:label-col="labelCol"
		:wrapper-col="wrapperCol"
		:has-feedback="hasError"
		:validate-status="hasError ? 'error' : undefined"
		:required="!!requiredMarkString"
		:no-style="noStyle"
	>
		<EzFormItemAutoBindingInput
			:autoBinding="autoBinding"
			:blurEventPropName="blurEventPropName"
			:changeEventPropName="changeEventPropName"
			:inputNodeIndex="inputNodeIndex"
			:valuePropName="valuePropName"
			v-slot="data"
		>
			<slot v-bind="data" />
		</EzFormItemAutoBindingInput>

		<template v-if="hasError" #help>
			<span
				v-for="message in meta.error?.messages"
				:key="message"
				:style="{ display: 'block' }"
			>
				{{ message }}
			</span>
		</template>

		<template v-if="$slots.extra" #extra>
			<slot
				name="extra"
				:form="formInstance"
				:formItem="formItemInstance"
			></slot>
		</template>
	</a-form-item>
</template>

<script lang="ts" setup>
import { formItemProps } from "ant-design-vue/es/form";
import { computed } from "vue";
import {
	EzFormItemAutoBindingInput,
	FormInstance,
	getFormItemDefinePropsObject,
	useFormItemComponentLogics,
} from "@niku/ez-form";
import { useInjectAntFormStyle } from "./useInjectAntFormStyle";

const props = defineProps({
	...getFormItemDefinePropsObject(),
	labelCol: formItemProps()["labelCol"],
	labelAlign: formItemProps()["labelAlign"],
	wrapperCol: formItemProps()["wrapperCol"],
});

const emit = defineEmits<{
	(event: "change", value: any, form: FormInstance): void;
}>();

const { formItemInstance, formInstance } = useFormItemComponentLogics(
	props,
	emit
);

// Bind data to ant form item
const { meta, requiredMarkString } = formItemInstance;
const hasError = computed(
	() => !!meta.error?.messages && meta.error.messages.length > 0
);

// Cheating Ant form style
const formStyle = useInjectAntFormStyle();

const labelAlign = computed(() => {
	return props.labelAlign ?? formStyle.labelAlign;
});
const labelCol = computed(() => {
	return props.labelCol ?? formStyle.labelCol;
});
const wrapperCol = computed(() => {
	return props.wrapperCol ?? formStyle.wrapperCol;
});
</script>
```
