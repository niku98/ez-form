---
title: Form Instance API
---

# Form Instance API

## useForm()

Create a form instance, which contains all form's logic.

```ts
export function useForm(settings?: FormSettings): FormInstance;
```

First argument is a form settings. Return a form instance.

**Example**

```vue
<script lang="ts" setup>
import { useForm } from "@niku/ez-form";

const form = useForm();
</script>
```

## form.meta

An object take all form data and states.

**Type**

```ts
export interface FormMeta<Values = any> {
	name: string;
	values: Values;
	errors: ValidateError[];
	dirty: boolean;
}

export interface FormInstance {
	meta: FormMeta;
}
```

### form.meta.values

Contains all form's data. You can use it to access form's data from outside of `EzForm`.

**Example**

```vue
<script lang="ts" setup>
import { watch } from "vue";
import { useForm } from "@niku/ez-form";

const form = useForm();

watch(
	() => form.values.foo.bar,
	() => {
		// Do things
	}
);
</script>
```

### form.meta.errors

Contains all form's errors. This is useful when you need to show form's errors outside of form.

**Example**

```vue
<script lang="ts" setup>
import { watch } from "vue";
import { useForm } from "@niku/ez-form";

const form = useForm();

watch(
	() => form.errors,
	() => {
		if (form.errors) {
			alert("There are some errors with the form!!");
		}
	}
);
</script>
```

### form.meta.dirty

Determine if form is `dirty`, changed data. Useful when you need to do things only when the form is `dirty`.

**Example**

```vue
<script lang="ts" setup>
import { useForm } from "@niku/ez-form";

const form = useForm();

const foo = () => {
	if (form.dirty) {
		alert("The form is changed");
	}
};
</script>
```

### form.meta\.name

Name of form, use to generate form input id.

## form.getFieldValue()

Get value of form's field.

**Type:**

```ts
interface FormInstance {
	getFieldValue(name: NamePath): any;
}
```

Have only one argument, is a `NamePath` that point to the field.

**Example**

```vue
<script lang="ts" setup>
import { useForm } from "@niku/ez-form";

const form = useForm();

const foo = () => {
	const itemValue = form.getFieldValue("path.to.field");
};
</script>
```

## form.setFieldValue()

Set value of form's field.

**Type:**

```ts
interface FormInstance {
	setFieldValue(name: NamePath, value: any): void;
}
```

First argument is a `NamePath` that point to the field. Second argument is value will be set to the field.

**Example**

```vue
<script lang="ts" setup>
import { useForm } from "@niku/ez-form";

const form = useForm();

const foo = () => {
	form.setFieldValue("path.to.field", bar);
};
</script>
```

## form.validate()

Validate form's data.

**Type:**

```ts
interface FormInstance {
	validate(name?: string | NamePath[], options?: ValidateOption): Promise<any>;
}
```

First argument is a `NamePath` that point to the field. Take `ValiadteOption` as second argument.

**Example**

```vue
<script lang="ts" setup>
import { useForm } from "@niku/ez-form";

const form = useForm();

const foo = () => {
	form.validate("path.to.field", { trigger: "blur" });
};
</script>
```

## form.clearValidate()

Validate form's data.

**Type:**

```ts
interface FormInstance {
	clearValidate(name?: NamePath): void;
}
```

Take only one argument, is a `NamePath` that point to the field.

**Example**

```vue
<script lang="ts" setup>
import { useForm } from "@niku/ez-form";

const form = useForm();

const foo = () => {
	// Clear form validate
	form.clearValidate();
	// Clear field's validate
	form.clearValidate("path.to.field");
};
</script>
```

## form.submit()

Submit form's data.

**Type:**

```ts
interface FormInstance {
	submit: (
		onSuccess?: FormSubmitCallback<Values>,
		onError?: FormErrorCallback
	) => Promise<Values>;
}
```

First argument, is a `onSuccess` callback, which will be called after form's data validate success. Second one is `onError`, will be called after form's data validate failed.

**Example**

```vue
<script lang="ts" setup>
import { useForm } from "@niku/ez-form";

const form = useForm();

const foo = () => {
	// Clear form validate
	form.clearValidate();
	// Clear field's validate
	form.clearValidate("path.to.field");
};
</script>
```

## form.reset()

Reset form's data, state, validate.

**Type:**

```ts
interface FormInstance {
	reset: (values?: Values) => void;
}
```

There is only one argument, which is new data of form. If it is not provided, form will be reset to initialValues.

**Example**

```vue
<script lang="ts" setup>
import { useForm } from "@niku/ez-form";

const form = useForm();

const foo = () => {
	form.reset();
};
</script>
```

## form.isDirty()

Check if form's field is dirty.

**Type:**

```ts
interface FormInstance {
	isDirty: (name?: NamePath) => boolean;
}
```

There is only one argument, which is field's `NamePath`. If it is not provided, form dirty will be returned.

**Example**

```vue
<script lang="ts" setup>
import { useForm } from "@niku/ez-form";

const form = useForm();

const foo = () => {
	form.isDirty(["path", "to", "field"]);
};
</script>
```

## form.updateSettings()

Change form settings. Useful when you want to update form settings, like `validateMessages`.

**Type:**

```ts
interface FormInstance {
	updateSettings(settings: Partial<FormSettings>): void;
}
```

There is only one argument, which is [`FormSettings`](/api-reference/types/form#formsettings).

**Example**

```vue
<script lang="ts" setup>
import { useForm } from "@niku/ez-form";

const form = useForm();

const foo = () => {
	form.updateSettings({
		validateMessages: {
			...
		}
	});
};
</script>
```

## form.addField()

Register a form item as a field of form. Don't use this to register form item, use `useFormItem().registerFormField()` instead.

**Type:**

```ts
interface FormInstance {
	addField(field: FormField): void;
}
```

## form.removeField()

Un-register a form item from form. Will be used inside `useFormItem`.

**Type:**

```ts
interface FormInstance {
	removeField(name: NamePath): void;
}
```
