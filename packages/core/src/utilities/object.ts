import { NamePath } from "src/models";

// export function emptyObject<T>(obj: T): T {
// 	for (const key in obj) {
// 		if (Object.prototype.hasOwnProperty.call(obj, key)) {
// 			delete obj[key];
// 		}
// 	}

// 	return obj;
// }

// export function clearObject<T extends { [key: string]: any }>(obj: T): T {
// 	for (const key in obj) {
// 		if (Object.prototype.hasOwnProperty.call(obj, key)) {
// 			obj[key] = undefined as any;
// 		}
// 	}

// 	return obj;
// }

export function clone<T>(input: T): T {
	if (typeof input !== "object" || input === null) {
		return input;
	}

	const output: any = Array.isArray(input) ? ([] as any[]) : {};

	for (const key in input) {
		const value = input[key];
		output[key] = clone(value);
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

// export function castNamePathToString(path: NamePath): string {
// 	return castPath(path).join(".");
// }

export function get(input: any, path: NamePath, defaultValue: any = undefined) {
	const keys = castPath(path);
	let index = 0;

	for (; index < keys.length && input != null; index++) {
		const key = keys[index];
		if (key !== undefined) {
			input = input[key];
		}
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
		if (key === undefined) {
			continue;
		}

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

export function mapValues<T extends object, R>(
	input: T,
	cb: <K extends keyof T>(value: T[K], key: K, obj: T) => R
): Record<keyof T, R> {
	const keys = Object.keys(input);

	return keys.reduce<Record<keyof T, R>>((result, key) => {
		result[key as keyof T] = cb(input[key as keyof T], key as keyof T, input);

		return result;
	}, {} as any);
}

// export function uniqBy<T extends any[]>(arr: T, key: keyof T[number]): T {
// 	const exists: any[] = [];

// 	return arr.filter((item) => {
// 		const uniqValue = item[key];
// 		const existed = exists.includes(uniqValue);

// 		if (existed) {
// 			return false;
// 		}

// 		exists.push(uniqValue);
// 		return true;
// 	}) as T;
// }
