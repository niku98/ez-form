---
title: Form Item Typings
---

# Form Item Typings

## NamePath

```ts
export type NamePath = string | number | (string | number)[];
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

## UseFormItemResult

```ts
export interface UseFormItemResult {
	formItemId: ComputedRef<string>;
	requiredMarkString: ComputedRef<string>;
	rawValue: WritableComputedRef<any>;
	inputValue: WritableComputedRef<any>;
	error: Ref<ValidateError | undefined>;
	injectedForm: FormInstance;
	handleChange: (event: any) => void;
	handleBlur: () => void;
	validate: (options?: ValidateOption) => Promise<any>;
	dirty: Ref<boolean>;
}
```
