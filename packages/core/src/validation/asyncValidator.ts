import type {
	RuleItem as ARuleItem,
	ValidateError as AValidateError,
	ValidateMessages,
} from "async-validator";
import {
	GetKeys,
	ValidateError,
	ValidationOption,
	ValidationResult,
} from "src/models";
import { castPath, mapValues } from "src/utilities";
import { toArray } from "src/utilities/array";
import { createControlledPromise } from "src/utilities/promise";
import { filterRuleByTrigger, usingAsyncValidator } from "src/validation";
import ValidationSchema, {
	FieldValidationSchema,
	SELF_KEY,
	ValidationOptions,
} from "src/validation/ValidationSchema";

export interface AsyncRuleItem
	extends ARuleItem,
		Omit<ValidationOption, "validateFirst"> {}

export type AsyncRule = AsyncRuleItem | AsyncRuleItem[];

export type AsyncRules<K extends string = string> = Record<K, AsyncRule>;

export type FieldAsyncValidatorSchema = FieldValidationSchema<
	AsyncRuleItem,
	ValidateMessages
>;

export class AsyncValidatorSchema<
	Keys extends string = string
> extends ValidationSchema<Keys, AsyncRuleItem, ValidateMessages> {
	validate = async <T extends object>(
		values: T,
		options?: ValidationOptions
	): Promise<ValidationResult> => {
		const asyncValidator = await usingAsyncValidator();
		if (SELF_KEY in this.rules && options?.selfFieldName) {
			this.rules[options.selfFieldName as Keys] = this.rules[SELF_KEY as Keys];
		}
		const filteredRules = mapValues(this.rules, (rule) =>
			filterRuleByTrigger(rule, options?.trigger)
		);
		delete filteredRules[SELF_KEY as Keys];

		const schema = new asyncValidator.default(getAsyncRules(filteredRules));
		const promise = createControlledPromise<ValidationResult>();
		schema
			.validate(
				values,
				{
					first: options?.validateFirst,
					messages: this.messages,
				},
				(errors) => {
					promise.resolve({
						valid: errors === null || errors.length === 0,
						errors: errors === null ? [] : normalizeErrors(errors),
					});
				}
			)
			.catch((error) => {});

		return promise;
	};

	clone = () => {
		const cloned = new AsyncValidatorSchema<Keys>(
			mapValues(this.rules, (rules) => [...rules])
		);
		this.messages && cloned.updateMessages(this.messages);
		return cloned;
	};
}

function getAsyncRules(rules: AsyncRules): AsyncRules {
	const result: AsyncRules = {};

	for (const field in rules) {
		const paths = castPath(field);
		const rule = rules[field];
		if (rule) {
			if (paths.length === 1) {
				result[field] = rule;
			} else {
				result[paths[0] as string] = getAsyncRulesForField(
					paths.slice(1).join("."),
					rule
				);
			}
		}
	}

	return result;
}

function getAsyncRulesForField(field: string, rules: AsyncRule): AsyncRuleItem {
	const paths = castPath(field);
	if (paths.length === 1) {
		return {
			type: "object",
			fields: {
				[paths[0] as string]: rules,
			},
		};
	}

	const path = paths[0] as string;

	return {
		type: "object",
		fields: {
			[path]: getAsyncRulesForField(paths.slice(1).join("."), rules),
		},
	};
}

function normalizeErrors(errors: AValidateError[]): ValidateError[] {
	const groupedErrors = errors.reduce<Record<string, ValidateError>>(
		(errors, error) => {
			const { field, message } = error;
			if (!field || !message) {
				return errors;
			}

			if (field in errors) {
				errors[field]!.messages.push(message);
			} else {
				errors[field] = {
					field,
					messages: [message],
				};
			}

			return errors;
		},
		{}
	);

	return Object.values(groupedErrors);
}

export function asyncSchema<Values>(
	rule: Partial<AsyncRules<GetKeys<Values>>>
): AsyncValidatorSchema<GetKeys<Values>> {
	return new AsyncValidatorSchema<GetKeys<Values>>(
		mapValues(rule, (rule) => (rule ? toArray(rule) : []))
	);
}

export function asyncFieldSchema(rule: AsyncRule) {
	const schema = new AsyncValidatorSchema({
		[SELF_KEY]: toArray(rule),
	}) as FieldAsyncValidatorSchema;
	schema.FOR_FIELD = true;

	return schema;
}
