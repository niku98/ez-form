---
title: Form List Typings
---

# Form List Typings

## FormListProps

```ts
export interface FormListProps {
	label?: string;
	name?: string | number | (string | number)[];
	defaultValue?: any[];
	getValueFromChangeEvent: (event: any) => any;
	valueTransformer: FormItemValueTransformer;
	validateTrigger?: ValidateTrigger | ValidateTrigger[];
	rules?: Rule;
	requiredMark?: string | boolean;
	validateFirst?: boolean;
}
```

## UseFormListResult

```ts
export interface UseFormListResult {
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
	listValues: ComputedRef<any[]>;
	namePrefix: ComputedRef<(string | number)[]>;
	namePaths: ComputedRef<(string | number)[][]>;
	errors: ComputedRef<ValidateError[]>;
	getNamePath(index: number, name: NamePath): (string | number)[];
	getErrors(index?: number): ValidateError[];
	hasError(index: number): boolean;
	add(newValue?: any): void;
	remove(index: number): void;
	removeByKey(key: string, value: any): void;
	replace(index: number, newValue: any): void;
	swap(firstIndex: number, secondIndex: number): void;
	move(fromIndex: number, toIndex: number): void;
}
```
