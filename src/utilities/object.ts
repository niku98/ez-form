import { NamePath } from "@/models";
import { Ref } from "vue";

export function emptyObject<T>(obj: T): T {
	for (const key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			delete obj[key];
		}
	}

	return obj;
}

export function clearObject<T extends { [key: string]: any }>(obj: T): T {
	for (const key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			obj[key] = undefined as any;
		}
	}

	return obj;
}

export function clone<T extends any[] | Object>(input: T): T {
	const output: any = Array.isArray(input) ? ([] as any[]) : {};

	for (const key in input) {
		if (Object.prototype.hasOwnProperty.call(input, key)) {
			const value = input[key];

			output[key] =
				typeof value === "object" && value !== null ? clone(value) : value;
		}
	}

	return output;
}

export function castPath(path: NamePath): string[] {
	if (Array.isArray(path)) {
		return path.reduce<string[]>((result, p) => {
			result.push(String(p));

			return result;
		}, []);
	}

	if (typeof path === "string") {
		return path.replace(/\[([\d\w]+)\]/g, ".$1").split(".");
	}

	return [String(path)];
}

export function get(input: any, path: NamePath, defaultValue: any = undefined) {
	const keys = castPath(path);
	let index = 0;

	for (; index < keys.length && input != null; index++) {
		input = input[keys[index]];
	}

	return index && index === keys.length ? input : undefined;
}

export function set(
	input: any,
	path: NamePath,
	value: any,
	generateValue?: (
		input: any,
		key: string,
		keyIndex: number,
		keys: string[]
	) => any
) {
	const keys = castPath(path);

	let index = 0;

	for (; index < keys.length && input != null; index++) {
		let newValue = value;
		const key = keys[index];
		if (index !== keys.length - 1) {
			const inputValue = input[key];
			newValue = generateValue
				? generateValue(input, key, index, keys)
				: undefined;
			if (newValue === undefined) {
				newValue =
					typeof inputValue === "object"
						? inputValue
						: !Number.isNaN(Number(keys[index + 1]))
						? []
						: {};
			}
		}
		input[key] = newValue;
		input = input[key];
	}
}

export function deleteFrom(input: any, path: NamePath) {
	const keys = castPath(path);
	input = get(input, keys.slice(0, -1));

	if (input) {
		const key = keys.pop();
		key && delete input[key];
	}
}
type ExposeRef<T> = T extends Ref<infer K> ? K : T;
type ExposeRefs<
	T extends Record<string, any>,
	Keys extends keyof T = keyof T
> = {
	[P in Keys]: ExposeRef<T[P]>;
};

type ObjectValuesReturnType<T> = T extends Record<any, infer K>
	? K extends Record<string, any>
		? ExposeRefs<K>[]
		: any[]
	: any[];
export function objectValues<T extends object>(
	object: T
): ObjectValuesReturnType<T> {
	return Object.values(object) as ObjectValuesReturnType<T>;
}
