import { ValidateError, ValidationOption } from "src/models";
import { toArray } from "src/utilities/array";
import { FieldValidationSchema } from "src/validation/ValidationSchema";

type UnPromise<T> = T extends Promise<infer P> ? P : T;

export function isFieldValidationSchema(
	input: any
): input is FieldValidationSchema {
	return (
		input.FOR_FIELD === true &&
		Object.prototype.hasOwnProperty.call(input, "validate") &&
		Object.prototype.hasOwnProperty.call(input, "clone")
	);
}

export function filterRuleByTrigger<
	TRule extends Omit<ValidationOption, "validateFirst">
>(rules: TRule[], triggers?: ValidationOption["trigger"]): TRule[] {
	if (!triggers || triggers.length === 0) {
		return rules.filter((rule) => !!rule);
	}

	return rules.filter((rule) => {
		if (!rule) {
			return false;
		}

		if (!rule.trigger) {
			return true;
		}

		return toArray(triggers).some((trigger) =>
			toArray(rule.trigger).includes(trigger)
		);
	});
}

export function normalizeErrors(
	errors: ValidateError[],
	replace?: boolean
): ValidateError[] {
	const groupedErrors = errors.reduce<Record<string, ValidateError>>(
		(errors, error) => {
			const { field, messages } = error;
			if (!field || !messages) {
				return errors;
			}

			if (field in errors) {
				if (replace) {
					errors[field]!.messages = messages;
				} else {
					errors[field]!.messages = errors[field]!.messages.concat(messages);
				}
			} else {
				errors[field] = {
					field,
					messages,
				};
			}

			return errors;
		},
		{}
	);

	return Object.values(groupedErrors);
}

export function usingYup() {
	return import("yup").catch(() => {
		throw new Error("[Yup] isn't installed.");
	});
}

export function usingAsyncValidator() {
	return import("async-validator").catch(() => {
		throw new Error("[Async Validator] isn't installed.");
	});
}

export function usingZod(): typeof import("zod") {
	return import("zod").catch(() => {
		throw new Error("[Zod] isn't installed.");
	}) as any;
}
