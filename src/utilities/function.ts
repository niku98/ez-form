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

export function debounce<T extends (...args: any[]) => any = () => any>(
	fn: T,
	wait = 100,
	leading = true
) {
	let timer: NodeJS.Timeout;
	let result: ReturnType<T>;
	return (...args: Parameters<T>): ReturnType<T> => {
		if (!timer && leading) {
			result = fn(...args);
		}

		clearTimeout(timer);
		timer = setTimeout(() => {
			result = fn(...args);
		}, wait);

		return result;
	};
}
