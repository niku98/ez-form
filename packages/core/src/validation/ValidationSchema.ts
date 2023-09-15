import { ValidationOption, ValidationResult } from "src/models";
import { toArray } from "src/utilities/array";

export interface ValidationOptions extends ValidationOption {
	selfFieldName?: string;
}

export const SELF_KEY = "_self";

export default abstract class ValidationSchema<
	Keys extends string = string,
	TRule = any,
	TMessages = any
> {
	rules: Record<Keys, TRule[]>;
	messages?: TMessages;
	constructor(rules: ValidationSchema["rules"]) {
		this.rules = rules;
	}

	updateMessages = (messages: TMessages) => {
		this.messages = messages;
	};

	addRule = (field: Keys, rule: TRule | TRule[]) => {
		const rules = toArray(rule);
		const fieldRule = this.rules[field];

		if (fieldRule) {
			fieldRule.push(...rules);
			return;
		}

		this.rules[field] = rules;
	};

	removeRule = (field: Keys) => {
		delete this.rules[field];
	};

	clearRules = () => {
		this.rules = {} as Record<Keys, TRule[]>;
	};

	getRule = (field: Keys) => {
		return this.rules[field];
	};

	abstract clone(): ValidationSchema<Keys, TRule, TMessages>;

	abstract validate<T extends object>(
		values: T,
		options?: ValidationOptions
	): Promise<ValidationResult>;
}

export interface FieldValidationSchema<TRule = any, TMessages = any>
	extends ValidationSchema<typeof SELF_KEY, TRule, TMessages> {
	FOR_FIELD: true;

	clone(): FieldValidationSchema<TRule, TMessages>;
}
