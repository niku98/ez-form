import useFormItem from "@/composables/useFormItem";
import useInjectForm from "@/composables/useInjectForm";
import {
	FormInstance,
	FormListInstance,
	FormListProps,
	NamePath,
} from "@/models";
import { castToArray, clone } from "@/utilities";
import { computed } from "vue";

export default function useFormList<
	F extends FormInstance | undefined = undefined
>(
	props: F extends FormInstance
		? FormListProps & { name: string }
		: FormListProps,
	form?: FormInstance | F
): FormListInstance {
	const injectedForm = useInjectForm();
	const formItemInstance = useFormItem(props, form);
	const { meta, handleChange } = formItemInstance;

	const listValues = computed<any[]>(() => {
		return meta.transformedValue && Array.isArray(meta.transformedValue)
			? meta.transformedValue
			: [];
	});

	const namePrefix = computed(() =>
		Array.isArray(props.name) ? props.name : props.name ? [props.name] : []
	);

	const namePaths = computed(() => {
		return listValues.value.map((_, index) => [...namePrefix.value, index]);
	});

	const errors = computed(() =>
		injectedForm.meta.errors.filter(({ name }) =>
			castToArray(name).join(".").includes(namePrefix.value.join("."))
		)
	);

	function getNamePath(index: number, name: NamePath) {
		name = Array.isArray(name) ? name : [name];

		return [...namePaths.value[index], ...name];
	}

	function getErrors(index?: number) {
		if (index === undefined) {
			return clone(errors.value);
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
		meta: formItemInstance.meta,
		registerFormField: formItemInstance.registerFormField,
		requiredMarkString: formItemInstance.requiredMarkString,
		validate: formItemInstance.validate,
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
