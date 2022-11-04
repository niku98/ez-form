import useFormItem from "@/composables/useFormItem";
import {
	FormInstance,
	FormItemEmitter,
	FormListProps,
	NamePath,
} from "@/models";
import { castToArray, clone } from "@/utilities";
import { computed } from "vue";

export default function useFormList(
	props: FormListProps,
	emit: FormItemEmitter
) {
	const formItemInstance = useFormItem(props, emit);
	const { inputValue, handleChange, injectedForm } = formItemInstance;

	const listValues = computed<any[]>(() => {
		return inputValue?.value && Array.isArray(inputValue?.value)
			? inputValue?.value
			: [];
	});

	const namePrefix = computed(() =>
		Array.isArray(props.name) ? props.name : props.name ? [props.name] : []
	);

	const namePaths = computed(() => {
		return listValues.value.map((_, index) => [...namePrefix.value, index]);
	});

	const errors = computed(() =>
		injectedForm.errors.filter(({ name }) =>
			castToArray(name).join(".").includes(namePrefix.value.join("."))
		)
	);

	function getNamePath(index: number, name: NamePath) {
		name = Array.isArray(name) ? name : [name];

		return [...namePaths.value[index], ...name];
	}

	function getErrors(index?: number) {
		if (index === undefined) {
			return clone(errors);
		}

		return errors.value.filter(({ name }) =>
			castToArray(name)
				.join(".")
				.includes([...namePrefix.value, index].join("."))
		);
	}

	function hasError(index: number) {
		return (
			errors.value.some(({ name }) =>
				castToArray(name)
					.join(".")
					.includes([...namePrefix.value, index].join("."))
			) ?? false
		);
	}

	function add(newValue?: any) {
		const array = [...listValues.value];

		array.push(newValue);

		handleChange(array);
	}

	function remove(index: number) {
		const array = [...listValues.value];

		array.splice(index, 1);

		handleChange(array);
	}

	function removeByKey(key: string, value: any) {
		const array = [...listValues.value];

		const index = array.findIndex((item) => item[key] === value);

		if (index > -1) {
			array.splice(index, 1);
		}

		handleChange(array);
	}

	function replace(index: number, newValue: any) {
		const array = [...listValues.value];

		array[index] = newValue;

		handleChange(array);
	}

	function swap(firstIndex: number, secondIndex: number) {
		const array = [...listValues.value];

		const temp = array[firstIndex];
		array[firstIndex] = array[secondIndex];
		array[secondIndex] = temp;

		handleChange(array);
	}

	function move(fromIndex: number, toIndex: number) {
		const array = [...listValues.value];

		const temp = array[fromIndex];
		array.splice(fromIndex, 1);
		array.splice(toIndex, 0, temp);

		handleChange(array);
	}

	return {
		...formItemInstance,
		listValues,
		namePrefix,
		namePaths,
		errors,
		getNamePath,
		getErrors,
		hasError,
		add,
		remove,
		removeByKey,
		replace,
		swap,
		move,
	};
}
