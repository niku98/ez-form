---
title: Form List Typings
---

# Form List Typings

## FormListProps

```ts
export interface FormListProps {
	label?: string;
	name?: string | number | (string | number)[];
	formList?: FormListInstance;
	defaultValue?: any[];
	getValueFromChangeEvent: (event: any) => any;
	valueTransformer: FormItemValueTransformer;
	validateTrigger?: ValidateTrigger | ValidateTrigger[];
	rules?: Rule;
	requiredMark?: string | boolean;
	validateFirst?: boolean;
}
```

## FormListInstance

```ts
export interface FormListInstance
	extends Omit<FormItemInstance, "handleBlur" | "handleChange"> {
	listValues: ComputedRef<any[]>;
	namePrefix: ComputedRef<(string | number)[]>;
	fields: ComputedRef<FormListField[]>;
	/**
	 * Use to get all errors of form list.
	 * But because of performance issue, it will be removed in next version.
	 * You should use getErrors and hasError instead.
	 * @deprecated Since 1.3.0
	 */
	errors: ComputedRef<ValidateError[]>;
	getNamePath(index: number, name: NamePath): string;
	getErrors(index?: number): ValidateError[];
	hasError(index: number): boolean;
	add(newValue?: any): void;
	insert(index: number, newValue?: any): void;
	unshift(value?: any): void;
	pop(): any;
	shift(): any;
	remove(index: number): void;
	removeByKey(key: string, value: any): void;
	replace(index: number, newValue: any): void;
	swap(firstIndex: number, secondIndex: number): void;
	move(fromIndex: number, toIndex: number): void;
}
```

## FormListField

```ts
export interface FormListField {
	key: string;
	index: number;
	getNamePath: (name: NamePath) => string;
}
```

## FormListSlots

**Slot Default**

```ts
export interface FormListSlotProps extends UnwrapRef<FormListInstance> {
	form: FormInstance;
}
```

**Slot Error**

```ts
export interface FormListSlotErrorsProps {
	errors: ValidateError | undefined;
	form: FormInstance;
	formList: FormListInstance;
}
```
