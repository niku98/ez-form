export function castToArray<T>(input?: T | T[], defaultValue: T[] = []): T[] {
	return input ? (Array.isArray(input) ? input : [input]) : defaultValue;
}
