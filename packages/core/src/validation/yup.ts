import {
	GetKeys,
	ValidateError,
	ValidationOption,
	ValidationResult,
} from "src/models";
import { castPath, mapValues } from "src/utilities";
import { toArray } from "src/utilities/array";
import { createControlledPromise } from "src/utilities/promise";
import { filterRuleByTrigger, usingYup } from "src/validation";
import ValidationSchema, {
	FieldValidationSchema,
	SELF_KEY,
	ValidationOptions,
} from "src/validation/ValidationSchema";
import type * as yup from "yup";

export interface YupRuleItem extends Omit<ValidationOption, "validateFirst"> {
	schema: yup.Schema;
}

export type YupRule = YupRuleItem | YupRuleItem[];

export type YupRules<K extends string = string> = Record<K, YupRule>;

export type FieldYupSchema = FieldValidationSchema<YupRule, any>;

export class YupSchema<Keys extends string = string> extends ValidationSchema<
	Keys,
	YupRuleItem,
	any
> {
	validate = async <T extends object>(
		values: T,
		options?: ValidationOptions | undefined
	): Promise<ValidationResult> => {
		if (SELF_KEY in this.rules && options?.selfFieldName) {
			this.rules[options.selfFieldName as Keys] = this.rules[SELF_KEY as Keys];
		}

		const filteredRules = mapValues(this.rules, (rule) =>
			filterRuleByTrigger(rule, options?.trigger)
		);
		delete filteredRules[SELF_KEY as Keys];

		const promise = createControlledPromise<ValidationResult>();

		const errors = await yupParse(values, filteredRules, options);
		const valid = errors.length === 0;
		promise.resolve({
			valid,
			errors,
		});

		return promise;
	};

	clone = () => {
		const cloned = new YupSchema<Keys>(
			mapValues(this.rules, (rules) => [...rules])
		);
		this.messages && cloned.updateMessages(this.messages);
		return cloned;
	};
}

async function yupParse<T extends object>(
	values: T,
	rules: Record<string, YupRuleItem[]>,
	options?: ValidationOptions
): Promise<ValidateError[]> {
	const fields = Object.keys(rules);
	const errors: Record<string, ValidateError> = {};

	for (const field of fields) {
		let fieldRules = rules[field];
		if (!fieldRules || fieldRules.length === 0) {
			continue;
		}

		for (const rule of fieldRules) {
			try {
				(await getYupObjectSchema(field, rule.schema)).validateSync(values, {
					abortEarly: options?.validateFirst,
					strict: true,
				});
			} catch (err) {
				const yupError = err as yup.ValidationError;

				if (field in errors) {
					errors[field]!.messages = errors[field]!.messages.concat(
						yupError.errors
					);
				} else {
					const error: ValidateError = {
						field: field,
						messages: yupError.errors,
					};

					errors[field] = error;
				}

				if (options?.validateFirst) {
					break;
				}
			}
		}
	}

	return Object.values(errors);
}

async function getYupObjectSchema(
	field: string,
	schema: yup.Schema
): Promise<yup.Schema> {
	const yupLib = await usingYup();
	const paths = castPath(field);
	if (paths.length === 1) {
		return yupLib.object({
			[paths[0] as string]: schema,
		});
	}

	const path = paths[0] as string;

	return yupLib.object({
		[path]: await getYupObjectSchema(paths.slice(1).join("."), schema),
	});
}

export function yupSchema<Values>(rules: Partial<YupRules<GetKeys<Values>>>) {
	return new YupSchema<GetKeys<Values>>(
		mapValues(rules, (value) => (value ? toArray(value) : []))
	);
}

export function yupFieldSchema(rule: YupRule) {
	const schema = new YupSchema({
		[SELF_KEY]: toArray(rule),
	}) as FieldYupSchema;
	schema.FOR_FIELD = true;

	return schema;
}
