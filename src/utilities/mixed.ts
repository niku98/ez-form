import { ref, Ref, watch, WatchOptions, WatchSource } from "vue";

export function isEqual(firstInput: any, secondInput: any) {
	const firstType = typeof firstInput;
	const secondType = typeof secondInput;

	if (firstType !== secondType) {
		return false;
	}

	if (firstType !== "object" && secondType !== "object") {
		return firstInput === secondInput;
	}

	const firstKeys = Object.keys(firstInput);
	const secondKeys = Object.keys(secondInput);

	if (firstKeys.length !== secondKeys.length) {
		return false;
	}

	for (const key of firstKeys) {
		const firstValue = firstInput[key];
		const secondValue = secondInput[key];

		if (isEqual(firstValue, secondValue)) {
			continue;
		}

		return false;
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

export function computedWithTarget<Source extends object, ComputedValue>(
	source: Source | WatchSource<Source>,
	fn: () => ComputedValue,
	options?: WatchOptions
) {
	const computedValue = ref(fn()) as Ref<ComputedValue>;

	watch(
		source,
		() => {
			computedValue.value = fn();
		},
		options
	);

	return computedValue;
}
