export function isEqual(a: any, b: any): boolean {
	if (
		typeof a !== "object" ||
		typeof b !== "object" ||
		a === null ||
		b === null
	) {
		return a === b;
	}

	if (Object.is(a, b)) {
		return true;
	}

	const keys = Object.keys(a);

	if (keys.length !== Object.keys(b).length) {
		return false;
	}

	for (const key of keys) {
		if (!isEqual(a[key], b[key])) {
			return false;
		}
	}

	return true;
}

export function uniqueId(length: number = 6) {
	let result = "";
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}
