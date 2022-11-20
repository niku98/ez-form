---
title: Auto Binding
---

# Auto Binding

## Updating data

In most case, your input will have a lots of complex requirements. Or you may use an UI Framework like **Ant Design**. It's very easy to use your input with **Ez Form**. Just make sure that your input component has two things bellow:

- Prop `value`: Form data will be pass to your input via this prop.
- Event `@update:value`: **Ez Form** will listen to this event to update data from your input.

Look familiar? Yes, it is **Vue 3** `v-model`, in this case, `v-model:value`. Normally, you usually use `v-model` to get data from input, so **Ez Form** do the same, but it is automatic.

In the other words, your input need provide a `v-model:value` to work with **Ez Form**.

## Blur event

By default, **Ez Form** will listen to event `@blur` to determine is input blur. So your component can emit `@blur` to be compatible with **Ez Form**.

## useFormItemAutoBinding()

Use this composable to handle auto binding.

**Type**

```ts
export default function useFormItemAutoBinding(
	formItemInstance: FormItemInstance,
	props: {
		changeEventPropName?: string;
		blurEventPropName: string;
		valuePropName: string;
	}
): {
	getVNodesFromDefaultSlot(): VNode[];
	slotData: {
		value: any;
		rawValue: any;
		handleChange(event?: any): void;
		form: FormInstance;
		error: ValidateError[];
	};
	getInputItemProps(vNode: VNode): any;
};
```

**Example**

```vue
<template>
	<div>
		<component
			v-for="(vNode, index) in getVNodesFromDefaultSlot()"
			:is="vNode"
			:key="vNode.patchFlag"
			v-bind="index === inputNodeIndex ? getInputItemProps(vNode) : undefined"
		/>
	</div>
</template>
<script lang="ts" setup>
import { useFormItem, useFormItemAutoBinding } from "@/composables";
import { getFormItemDefinePropsObject } from "@/utilities";

const props = defineProps(getFormItemDefinePropsObject());
const formItemInstance = useFormItem(props);
const { meta, requiredMarkString } = formItemInstance;

// Handle auto binding
const { getInputItemProps, slotData, getVNodesFromDefaultSlot } =
	useFormItemAutoBinding(formItemInstance, props);
</script>
```
