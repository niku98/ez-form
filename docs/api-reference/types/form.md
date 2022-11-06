---
title: Form Typings
---

# Form Typings

## FormInstance

```ts
export interface FormInstance<Values extends object = any> {
	values: Values;
	errors: ValidateError[];
	getFieldValue(name: NamePath): any;
	setFieldValue(name: NamePath, value: any): void;
	validate(name?: string | NamePath[], options?: ValidateOption): Promise<any>;
	clearValidate(): void;
	submit: () => void;
	reset: (values?: Values) => void;
	validateTrigger?: ValidateTrigger | ValidateTrigger[];
	isDirty: (name?: NamePath) => boolean;
	updateSettings(settings: FormSettings): void;
	className: ComputedRef<string>;
	addField(field: FormField): void;
	removeField(namePath: NamePath): void;
	rules?: Rules;
	validateMessages?: ValidateMessages;
	classPrefix: string;
}
```

## FormSettings

```ts
export interface FormSettings<Values extends object = any> {
	form?: FormInstance;
	emit?: FormEmitter;
	initialValues?: Values;
	enableReinitialize?: boolean;
	clearOnReset?: boolean;
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
	validate: (options?: ValidateOption) => Promise<any>;
	clearValidate: () => void;
	reset: () => void;
	defaultValue: any;
	value: ComputedRef<any>;
	error: ComputedRef<ValidateError | undefined>;
	dirty: ComputedRef<boolean>;
}
```
