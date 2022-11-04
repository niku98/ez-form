import { UseFormItemResult } from "@/models";
import { computed, toRaw, useSlots, VNode } from "vue";

export default function useFormItemAutoBinding(
	formItemInstance: UseFormItemResult,
	props: {
		changeEventPropName?: string;
		blurEventPropName: string;
		valuePropName: string;
	}
) {
	const {
		inputValue,
		rawValue,
		handleBlur,
		handleChange,
		error,
		formItemId,
		injectedForm,
	} = formItemInstance;

	const updateEventName = computed(
		() => props.changeEventPropName ?? `update:${props.valuePropName}`
	);

	const slots = useSlots();
	const slotData = computed(() => {
		return {
			value: inputValue,
			rawValue: rawValue,
			handleChange,
			form: injectedForm,
			error: toRaw(error),
		};
	});

	const getVNodesFromDefaultSlot = () => {
		return (slots.default && slots.default(slotData)) ?? [];
	};

	const getInputItemProps = (vNode: VNode) => {
		if (
			vNode.component === null &&
			["input", "select", "textarea"].includes(String(vNode.type))
		) {
			return {
				value: inputValue.value,
				onInput: handleChange,
				onChange: handleChange,
				onBlur: handleBlur,
				id: formItemId.value,
			};
		}

		const eventName = `on${updateEventName.value[0].toUpperCase()}${updateEventName.value.slice(
			1
		)}`;
		const blurEventName = `on${props.blurEventPropName[0].toUpperCase()}${props.blurEventPropName.slice(
			1
		)}`;
		const valuePropName = props.valuePropName;

		return {
			[eventName]: handleChange,
			[blurEventName]: handleBlur,
			[valuePropName]: inputValue.value,
			id: formItemId,
		};
	};

	return {
		getVNodesFromDefaultSlot,
		slotData,
		getInputItemProps,
	};
}
