---
title: Form Typings
---

# Form Typings

## FormInstance

```ts
export interface FormInstance<Values extends object = any> {
	values: Values;
	errors: ValidateError[];
	dirty: boolean;
	name: string;
	getFieldValue(name: NamePath): any;
	setFieldValue(name: NamePath, value: any): void;
	validate(
		name?: string | NamePath[],
		options?: ValidateOption
	): Promise<{ values?: any; errors?: ValidateError[] }>;
	clearValidate(name?: NamePath): void;
	submit: <
		S extends FormSubmitCallback<Values> | undefined = undefined,
		E extends FormErrorCallback | undefined = undefined
	>(
		onSuccess?: FormSubmitCallback<Values> | S,
		onError?: FormErrorCallback | E
	) => S extends FormSubmitCallback<Values>
		? void
		: E extends FormErrorCallback
		? void
		: Promise<{ values?: Values; errors?: ValidateError[] }>;
	reset: (values?: Values) => void;
	validateTrigger?: ValidateTrigger | ValidateTrigger[];
	isDirty: (name?: NamePath) => boolean;
	updateSettings(settings: Partial<FormSettings>): void;
	addField(field: FormField): void;
	removeField(namePath: NamePath): void;
	rules?: Rules;
	validateMessages?: ValidateMessages;
	classPrefix: string;
}

export type FormSubmitCallback<Values = any> = (values: Values) => void;
export type FormErrorCallback = (errors: ValidateError[]) => void;
```

## FormSettings

```ts
export interface FormSettings<Values extends object = any> {
	name: string;
	form?: FormInstance;
	initialValues?: Values;
	enableReinitialize?: boolean;
	rules?: Rules;
	validateTrigger?: ValidateTrigger | ValidateTrigger[];
	validateMessages?: ValidateMessages;
	classPrefix?: string;
	preserveValues?: boolean;
}
```

## FormEmitter

```ts
export interface FormEmitter {
	(event: "submit", values: any): void;
	(event: "change", values: any): void;
	(event: "reset"): void;
	(event: "error", errors: any): void;
}
```

## FormField

```ts
export interface FormField {
	name: ComputedRef<NamePath>;
	id: ComputedRef<string>;
	validate: FormItemInstance["validate"];;
	clearValidate: () => void;
	reset: () => void;
	markAsDirty: () => void;
	defaultValue: any;
	value: ComputedRef<any>;
	error: ComputedRef<ValidateError | undefined>;
	dirty: ComputedRef<boolean>;
}
```

## FormMeta

```ts
export interface FormMeta<Values = any> {
	name: string;
	values: Values;
	errors: ValidateError[];
	dirty: boolean;
}
```

## Form Slots Data

**Slot Default**

```ts
export interface FormSlotProps {
	values: FormInstance["meta"]["values"];
	errors: FormInstance["meta"]["errors"];
	dirty: FormInstance["meta"]["dirty"];
	submit: FormInstance["submit"];
	reset: FormInstance["reset"];
	validate: FormInstance["validate"];
	getFieldValue: FormInstance["getFieldValue"];
	setFieldValue: FormInstance["setFieldValue"];
	isDirty: FormInstance["isDirty"];
}
```
