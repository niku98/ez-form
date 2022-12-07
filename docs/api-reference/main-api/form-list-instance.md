---
title: FormList Instance API
---

# FormList Instance API

## useFormList()

Create form list instance, contains all form list's logic.

**Type**

```ts
export default function useFormList<
	F extends FormInstance | undefined = undefined
>(
	props: F extends FormInstance
		? FormListProps & { name: string }
		: FormListProps,
	form?: FormInstance | F
): FormListInstance;
```

**Example**

```vue
<script lang="ts" setup>
import { useFormList } from "@niku/ez-form";

const formList = useFormList();
</script>
```

## formList.meta

An object contains form list data and state.

**Type**

```ts
export interface FieldMeta {
	/**
	 * Raw value before being transformed
	 */
	rawValue: any;
	/**
	 * Value after being transformed by valueTransformer()
	 */
	transformedValue: any;
	error?: ValidateError;
	dirty: boolean;
	touched: boolean;
	name?: NamePath;
	id: string;
}

export interface FormListInstance {
	meta: FieldMeta;
}
```

### formList.meta.rawValue

Contains form list's raw data.

**Example**

```vue
<script lang="ts" setup>
import { watch } from "vue";
import { useFormList } from "@niku/ez-form";

const formList = useFormList();

watch(
	() => formList.rawValue,
	() => {
		// Do things
	}
);
</script>
```

### formList.meta.transformedValue

Contains form list's transformed data. Use to pass to input's value.

**Example**

```vue
<script lang="ts" setup>
import { watch } from "vue";
import { useFormList } from "@niku/ez-form";

const formList = useFormList();

watch(
	() => formList.transformedValue,
	() => {
		// Do things
	}
);
</script>
```

### formList.meta.error

Contains form list's error.

**Example**

```vue
<script lang="ts" setup>
import { watch } from "vue";
import { useFormList } from "@niku/ez-form";

const formList = useFormList();

watch(
	() => formList.error,
	() => {
		if (formList.error) {
			alert("There are some errors with the form list!!");
		}
	}
);
</script>
```

### formList.meta.dirty

Determine if form list is `dirty`, changed data. Useful when you need to do things only when the form list is `dirty`.

**Example**

```vue
<script lang="ts" setup>
import { useFormList } from "@niku/ez-form";

const formList = useFormList();

const foo = () => {
	if (formList.dirty) {
		alert("The form list is changed");
	}
};
</script>
```

### formList.meta.touched

Determine if form list is `touched`, that mean user focused in input. Useful when you need to do things only when the form list is `touched`.

**Example**

```vue
<script lang="ts" setup>
import { useFormList } from "@niku/ez-form";

const formList = useFormList();

const foo = () => {
	if (formList.touched) {
		alert("The form list is touched");
	}
};
</script>
```

### formList.meta\.name

Name of form list, use to register form list with form.

### formList.meta\.id

Id of form list, can use as id of input.

### formItem.meta\.formName

Name of form, which this form list registered.

## formList.requiredMarkString

A computed, return a string that contain required mark string. If form list doesn't have rule `required`, it return empty string.

This is useful when you want to create your own form list.

**Type**

```ts
export interface FormListInstance {
	requiredMarkString: ComputedRef<string>;
}
```

## formList.listValues

A computed, return an array that contain form list's value list.

**Type**

```ts
export interface FormListInstance {
	listValues: ComputedRef<any[]>;
}
```

## formList.namePrefix

A computed, return an array of string and number, which is prefix name path will be use to generate name path list.

**Type**

```ts
export interface FormListInstance {
	namePrefix: ComputedRef<(string | number)[]>;
}
```

## formList.fields

A computed, return an array of field, which is generated field's data of form list, can be used to pass to children of **EzFormList**.

**Type**

```ts
export interface FormListInstance {
	fields: ComputedRef<FormListField[]>;
}
```

**Example**

```vue
<template>
	<EzForm>
		<EzFormList v-slot="{ field }">
			<EzFormItem
				v-for="field in fields"
				:key="field.key"
				:name="field.getNamePath('title')"
				label="Title"
			>
				<input />
			</EzFormItem>
		</EzFormList>
	</EzForm>
</template>
```

## formList.errors <Badge type="warning" text="Deprecated" />

A computed, return an array of `ValidateError`, contains all form list errors, include children form list's errors.

**Type**

```ts
export interface FormListInstance {
	errors: ComputedRef<ValidateError[]>;
}
```

**Example**

```vue
<template>
	<EzForm>
		<EzFormList v-slot="{ fields, errors }">
			<div class="errors-box">
				<template v-for="error in errors" :key="error.name">
					<span v-for="message in error.messages" :key="message" class="error">
						{{ message }}
					</span>
				</template>
			</div>
			<EzFormItem
				v-for="field in fields"
				:key="field.key"
				:name="field.getNamePath('title')"
				label="Title"
			>
				<input />
			</EzFormItem>
		</EzFormList>
	</EzForm>
</template>
```

## formList.registerFormField()

Register form list with form instance.

When you use `useFormList`, if you provide a `name`, and inside a form, this function will be called automatically. You only need to use this when register a form list that outside the form (rarely happened).

**Type**

```ts
export interface FormListInstance {
	registerFormField: (formInstance?: FormInstance) => void;
}
```

**Example**

```vue
<script lang="ts" setup>
import { useForm, useFormList } from "@niku/ez-form";

const form = useForm();
const formList = useFormList({ name: "test" });

formList.registerFormField(form);
</script>
```

## formList.unRegisterFormField()

Un-Register form list from form instance.

**Type**

```ts
export interface FormItemInstance {
	unRegisterFormField: () => void;
}
```

**Example**

```vue
<template>
	<input
		:value="formItem.meta.transformedValue"
		@input="formItem.handleChange"
		@blur="formItem.handleBlur"
	/>
</template>

<script lang="ts" setup>
import { useForm, useFormItem } from "@niku/ez-form";

const form = useForm();
const formItem = useFormItem({ name: "test" });

formItem.registerFormField(form);

function foo() {
	formItem.unRegisterFormField();
}
</script>
```

## formList.validate()

Validate form list's value.

**Type**

```ts
export interface FormListInstance {
	validate: (
		options?: ValidateOption
	) => Promise<{ value?: any; error?: ValidateError }>;
}
```

**Example**

```vue
<script lang="ts" setup>
import { useForm, useFormList } from "@niku/ez-form";

const form = useForm();
const formList = useFormList({ name: "test" });

const foo = () => {
	formList.validate({ trigger: "blur" });
};
</script>
```

## formList.getNamePath()

Generate name path for child of form list.

**Type**

```ts
export interface FormListInstance {
	getNamePath(index: number, name: NamePath): (string | number)[];
}
```

**Example**

```vue
<template>
	<EzForm>
		<EzFormList v-slot="{ getNamePath }">
			<EzFormItem :key="index" :name="getNamePath(0, 'title')" label="Title">
				<input />
			</EzFormItem>
		</EzFormList>
	</EzForm>
</template>
```

## formList.getErrors()

Get form list errors or form list's element errors.

**Type**

```ts
export interface FormListInstance {
	getErrors(index?: number): ValidateError[];
}
```

**Example**

```vue
<template>
	<EzForm>
		<EzFormList v-slot="{ getNamePath, getErrors }">
			<div class="errors-box">
				<span v-for="message in getErrors(0).messages" :key="message" class="error">
					{{ message }}
				</span>
			</div>
			<EzFormItem
				:key="index"
				:name="getNamePath(0, "title")"
				label="Title"
			>
				<input />
			</EzFormItem>
		</EzFormList>
	</EzForm>
</template>
```

## formList.hasError()

Check if form list's element has error.

**Type**

```ts
export interface FormListInstance {
	hasError(index: number): boolean;
}
```

**Example**

```vue
<template>
	<EzForm>
		<EzFormList v-slot="{ getNamePath, hasError }">
			<div v-if="hasError(0)" class="error">
				There is an error.
			</div>
			<EzFormItem
				:key="index"
				:name="getNamePath(0, "title")"
				label="Title"
			>
				<input />
			</EzFormItem>
		</EzFormList>
	</EzForm>
</template>
```

## formList.add()

Add an element to form list.

**Type**

```ts
export interface FormListInstance {
	add(newValue?: any): void;
}
```

**Example**

```vue{12-14}
<template>
	<EzForm>
		<EzFormList v-slot="{ fields, hasError, add }">
			<EzFormItem
				v-for="field in fields"
				:key="field.key"
				:name="field.getNamePath('title')"
				label="Title"
			>
				<input />
			</EzFormItem>
			<button @click="add()">
				Add title
			</button>
		</EzFormList>
	</EzForm>
</template>
```

## formList.insert()

Insert an element to an index of form list.

**Type**

```ts
export interface FormListInstance {
	insert(index: number, newValue?: any): void;
}
```

**Example**

```vue{12-14}
<template>
	<EzForm>
		<EzFormList v-slot="{ fields, hasError, insert }">
			<EzFormItem
				v-for="field in fields"
				:key="field.key"
				:name="field.getNamePath("title")"
				label="Title"
			>
				<input />
			</EzFormItem>
			<button @click="insert(1)">
				Insert title to index 1
			</button>
		</EzFormList>
	</EzForm>
</template>
```

## formList.unshift()

Add an element to first index of form list.

**Type**

```ts
export interface FormListInstance {
	unshift(newValue?: any): void;
}
```

**Example**

```vue{12-14}
<template>
	<EzForm>
		<EzFormList v-slot="{ fields, hasError, unshift }">
			<EzFormItem
				v-for="field in fields"
				:key="field.key"
				:name="field.getNamePath("title")"
				label="Title"
			>
				<input />
			</EzFormItem>
			<button @click="unshift()">
				Insert title to first index
			</button>
		</EzFormList>
	</EzForm>
</template>
```

## formList.pop()

Remove last element of form list.

**Type**

```ts
export interface FormListInstance {
	pop(): void;
}
```

**Example**

```vue{12-14}
<template>
	<EzForm>
		<EzFormList v-slot="{ fields, hasError, pop }">
			<EzFormItem
				v-for="field in fields"
				:key="field.key"
				:name="field.getNamePath("title")"
				label="Title"
			>
				<input />
			</EzFormItem>
			<button @click="pop()">
				Remove last title
			</button>
		</EzFormList>
	</EzForm>
</template>
```

## formList.shift()

Remove first element of form list.

**Type**

```ts
export interface FormListInstance {
	shift(): void;
}
```

**Example**

```vue{12-14}
<template>
	<EzForm>
		<EzFormList v-slot="{ fields, hasError, shift }">
			<EzFormItem
				v-for="field in fields"
				:key="field.key"
				:name="field.getNamePath("title")"
				label="Title"
			>
				<input />
			</EzFormItem>
			<button @click="shift()">
				Remove first title
			</button>
		</EzFormList>
	</EzForm>
</template>
```

## formList.remove()

Remove an element from form list by index.

**Type**

```ts
export interface FormListInstance {
	remove(index: number): void;
}
```

**Example**

```vue{14-16}
<template>
	<EzForm>
		<EzFormList v-slot="{ fields, hasError, add, remove }">
			<div
				v-for="field in fields"
				:key="field.key"
			>
				<EzFormItem
					:name="field.getNamePath('title')"
					label="Title"
				>
					<input />
				</EzFormItem>
				<button @click="remove(field.index)">
					Remove
				</button>
			</div>
			<button @click="add()">
				Add title
			</button>
		</EzFormList>
	</EzForm>
</template>
```

## formList.removeByKey()

Remove an element from form list by key.

**Type**

```ts
export interface FormListInstance {
	removeByKey(key: string, value: any): void;
}
```

**Example**

```vue{18-20}
<template>
	<EzForm>
		<EzFormList v-slot="{ fields, hasError, add, remove, removeByKey }">
			<div
				v-for="field in fields"
				:key="index"
			>
				<EzFormItem
					:name="field.getNamePath('title')"
					label="Title"
				>
					<input />
				</EzFormItem>
				<button @click="remove(index)">
					Remove
				</button>
			</div>
			<button @click="removeByKey('title', "Test")">
				Remove test
			</button>
			<button @click="add()">
				Add title
			</button>
		</EzFormList>
	</EzForm>
</template>
```

## formList.replace()

Replace an element in form list with another.

**Type**

```ts
export interface FormListInstance {
	replace(index: number, newValue: any): void;
}
```

**Example**

```vue{18-20}
<template>
	<EzForm>
		<EzFormList v-slot="{ fields, hasError, add, remove, replace }">
			<div
				v-for="field in fields"
				:key="field.key"
			>
				<EzFormItem
					:name="field.getNamePath('title')"
					label="Title"
				>
					<input />
				</EzFormItem>
				<button @click="remove(index)">
					Remove
				</button>
			</div>
			<button @click="replace(0, { title: "Test" })">
				Replace item
			</button>
			<button @click="add()">
				Add title
			</button>
		</EzFormList>
	</EzForm>
</template>
```

## formList.swap()

Swap two element index in form list.

**Type**

```ts
export interface FormListInstance {
	swap(firstIndex: number, secondIndex: number): void;
}
```

**Example**

```vue{18-20}
<template>
	<EzForm>
		<EzFormList v-slot="{ fields, hasError, add, remove, swap }">
			<div
				v-for="field in fields"
				:key="field.key"
			>
				<EzFormItem
					:name="field.getNamePath('title')"
					label="Title"
				>
					<input />
				</EzFormItem>
				<button @click="remove(index)">
					Remove
				</button>
			</div>
			<button @click="swap(0, 1)">
				Swap item 0 and 1
			</button>
			<button @click="add()">
				Add title
			</button>
		</EzFormList>
	</EzForm>
</template>
```

## formList.move()

Move an element in form list to other index.

**Type**

```ts
export interface FormListInstance {
	move(fromIndex: number, toIndex: number): void;
}
```

**Example**

```vue{18-20}
<template>
	<EzForm>
		<EzFormList v-slot="{ fields, hasError, add, remove, move }">
			<div
				v-for="field in fields"
				:key="field.key"
			>
				<EzFormItem
					:name="field.getNamePath('title')"
					label="Title"
				>
					<input />
				</EzFormItem>
				<button @click="remove(index)">
					Remove
				</button>
			</div>
			<button @click="move(0, 1)">
				Move item at index 0 to index 1
			</button>
			<button @click="add()">
				Add title
			</button>
		</EzFormList>
	</EzForm>
</template>
```
