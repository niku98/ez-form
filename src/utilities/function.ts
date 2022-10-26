type Fn = (...args: any[]) => any;

const memorizedFunctionResults: Map<Fn, Map<any, any>> = new Map();

export function memorized<T extends Fn>(
	fn: T
): (...args: Parameters<T>) => ReturnType<T> {
	const functionResultsMap = (
		memorizedFunctionResults.has(fn)
			? memorizedFunctionResults.get(fn)
			: new Map()
	) as Map<any, any>;
	return (...args: Parameters<T>): ReturnType<T> => {
		const mapKey = JSON.stringify(args);
		if (functionResultsMap.has(mapKey)) {
			return functionResultsMap.get(mapKey);
		}

		const result = fn(...args);
		functionResultsMap.set(args, result);

		return result;
	};
}
