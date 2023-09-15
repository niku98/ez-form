export function clearUndefinedProperties<T extends { [key: string]: any }>(
	object: T
) {
	for (const key in object) {
		if (Object.prototype.hasOwnProperty.call(object, key)) {
			const value = object[key];
			if (value === undefined) {
				delete object[key];
			}
		}
	}

	return object;
}
