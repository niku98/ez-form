import {
	GetKeys,
	ValidateError,
	ValidationOption,
	ValidationResult,
} from "src/models";
import { castPath, mapValues } from "src/utilities";
import { toArray } from "src/utilities/array";
import { createControlledPromise } from "src/utilities/promise";
import { filterRuleByTrigger, usingZod } from "src/validation/utilities";
import ValidationSchema, {
	FieldValidationSchema,
	SELF_KEY,
	ValidationOptions,
} from "src/validation/ValidationSchema";
import type { Schema, z, ZodErrorMap } from "zod";

export interface ZodRuleItem extends Omit<ValidationOption, "validateFirst"> {
	schema: Schema | ((values: any) => Schema);
}

export type ZodRule = ZodRuleItem | ZodRuleItem[];

export type ZodRules<K extends string = string> = Record<K, ZodRule>;

export type FieldZodSchema = FieldValidationSchema<ZodRule, any>;

export class ZodSchema<Keys extends string = string> extends ValidationSchema<
	Keys,
	ZodRuleItem,
	ZodErrorMap
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

		const errors = await zodParse(
			values,
			filteredRules,
			options,
			this.messages
		);
		const valid = errors.length === 0;
		promise.resolve({
			valid,
			errors,
		});

		return promise;
	};

	clone = () => {
		const cloned = new ZodSchema<Keys>(
			mapValues(this.rules, (rules) => [...rules])
		);
		this.messages && cloned.updateMessages(this.messages);
		return cloned;
	};
}

async function zodParse<T extends object>(
	values: T,
	rules: Record<string, ZodRuleItem[]>,
	options?: ValidationOptions,
	errorMap?: z.ZodErrorMap
): Promise<ValidateError[]> {
	const fields = Object.keys(rules);
	const errors: Record<string, ValidateError> = {};

	for (const field of fields) {
		let fieldRules = rules[field];
		if (!fieldRules || fieldRules.length === 0) {
			continue;
		}

		for (const rule of fieldRules) {
			const result = (
				await getZodObjectSchema(
					field,
					typeof rule.schema === "function" ? rule.schema(values) : rule.schema
				)
			).safeParse(values, {
				errorMap: errorMap || undefined,
			});

			if (result.success === true) {
				continue;
			}

			if (field in errors) {
				errors[field]!.messages = errors[field]!.messages.concat(
					result.error.issues.map((issue) => issue.message)
				);
			} else {
				const error: ValidateError = {
					field: field,
					messages: result.error.issues.map((issue) => issue.message),
				};

				errors[field] = error;
			}

			if (options?.validateFirst) {
				break;
			}
		}
	}

	return Object.values(errors);
}

async function getZodObjectSchema(
	field: string,
	schema: z.Schema
): Promise<z.Schema> {
	const zLib = await usingZod();
	const paths = castPath(field);
	if (paths.length === 1) {
		return zLib.object({
			[paths[0] as string]: schema,
		});
	}

	const path = paths[0] as string;

	return zLib.object({
		[path]: await getZodObjectSchema(paths.slice(1).join("."), schema),
	});
}

export function zodSchema<Values>(rules: Partial<ZodRules<GetKeys<Values>>>) {
	return new ZodSchema<GetKeys<Values>>(
		mapValues(rules, (value) => (value ? toArray(value) : []))
	);
}

export function zodFieldSchema(rule: ZodRule) {
	const schema = new ZodSchema({
		[SELF_KEY]: toArray(rule),
	}) as FieldZodSchema;
	schema.FOR_FIELD = true;

	return schema;
}
