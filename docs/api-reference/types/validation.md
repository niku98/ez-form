---
title: Validation Typings
---

# Validation Typings

## General

```ts
export type ValidateTrigger = "change" | "blur";

export interface RuleItem extends AsyncValidatorRuleItem {
	trigger?: ValidateTrigger | ValidateTrigger[];
}

export type Rule = RuleItem | RuleItem[];

export type Rules = Record<string, Rule>;

export interface ValidateOption {
	trigger: ValidateTrigger | ValidateTrigger[];
}

export interface ValidateError {
	name: NamePath;
	messages: string[];
}
```

## ValidateMessages

```ts
type ValidateMessage<T extends any[] = unknown[]> =
	| string
	| ((...args: T) => string);

export interface ValidateMessages {
	default?: ValidateMessage;
	required?: ValidateMessage<[FullField]>;
	enum?: ValidateMessage<[FullField, EnumString]>;
	whitespace?: ValidateMessage<[FullField]>;
	date?: {
		format?: ValidateMessage;
		parse?: ValidateMessage;
		invalid?: ValidateMessage;
	};
	types?: {
		string?: ValidateMessage<[FullField, Type]>;
		method?: ValidateMessage<[FullField, Type]>;
		array?: ValidateMessage<[FullField, Type]>;
		object?: ValidateMessage<[FullField, Type]>;
		number?: ValidateMessage<[FullField, Type]>;
		date?: ValidateMessage<[FullField, Type]>;
		boolean?: ValidateMessage<[FullField, Type]>;
		integer?: ValidateMessage<[FullField, Type]>;
		float?: ValidateMessage<[FullField, Type]>;
		regexp?: ValidateMessage<[FullField, Type]>;
		email?: ValidateMessage<[FullField, Type]>;
		url?: ValidateMessage<[FullField, Type]>;
		hex?: ValidateMessage<[FullField, Type]>;
	};
	string?: {
		len?: ValidateMessage<[FullField, Range]>;
		min?: ValidateMessage<[FullField, Range]>;
		max?: ValidateMessage<[FullField, Range]>;
		range?: ValidateMessage<[FullField, Range, Range]>;
	};
	number?: {
		len?: ValidateMessage<[FullField, Range]>;
		min?: ValidateMessage<[FullField, Range]>;
		max?: ValidateMessage<[FullField, Range]>;
		range?: ValidateMessage<[FullField, Range, Range]>;
	};
	array?: {
		len?: ValidateMessage<[FullField, Range]>;
		min?: ValidateMessage<[FullField, Range]>;
		max?: ValidateMessage<[FullField, Range]>;
		range?: ValidateMessage<[FullField, Range, Range]>;
	};
	pattern?: {
		mismatch?: ValidateMessage<[FullField, Value, Pattern]>;
	};
}
```
