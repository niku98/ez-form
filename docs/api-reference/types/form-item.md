---
title: Form Item Typings
---

# Form Item Typings

## NamePath

```ts
export type NamePath = string | number | (string | number)[];
```

## FieldMeta

```ts
export interface FieldMeta {
	rawValue: any;
	transformedValue: any;
	error?: ValidateError;
	dirty: boolean;
	touched: boolean;
	name?: NamePath;
	id: string;
	formName: string;
}
```

## FormItemValueTransformer

```ts
export interface FormItemValueTransformer<In = any, Out = any> {
	/**
	 * Transform data to pass to input
	 */
	in: (value: In, formValues: { [key: string]: any }) => Out;
	/**
	 * Transform data to update form's data
	 */
	out: (value: Out, formValues: { [key: string]: any }) => In;
}
```

## FormItemProps

```ts
export interface FormItemProps {
	label?: string;
	name?: string | number | (string | number)[];
	formItem?: FormItemInstance;
	defaultValue?: any;
	getValueFromChangeEvent: (event: any) => any;
	valueTransformer: FormItemValueTransformer;
	validateTrigger?: ValidateTrigger | ValidateTrigger[];
	rules?: Rule;
	requiredMark?: string | boolean;
	validateFirst?: boolean;
}
```

## FormItemEmitter

```ts
export interface FormItemEmitter {
	(event: "change", value: any, form: FormInstance): void;
}
```

## FormItemInstance

```ts
export interface FormItemInstance {
	meta: FieldMeta;
	requiredMarkString: ComputedRef<string>;
	injectedForm: FormInstance;
	handleChange: (event: any) => void;
	handleBlur: () => void;
	registerFormField: (formInstance?: FormInstance) => void;
	unRegisterFormField: () => void;
	validate: (
		options?: ValidateOption
	) => Promise<{ value?: any; error?: ValidateError }>;
	clearValidate: () => void;
}
```
