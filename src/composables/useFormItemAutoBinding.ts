import useInjectForm from "@/composables/useInjectForm";
import { FormItemInstance } from "@/models";
import { computed, useSlots, VNode } from "vue";

export default function useFormItemAutoBinding(
	formItemInstance: FormItemInstance,
	props: {
		changeEventPropName?: string;
		blurEventPropName: string;
		valuePropName: string;
	}
) {
	const { meta, handleBlur, handleChange } = formItemInstance;
	const injectedForm = useInjectForm();

	const updateEventName = computed(
		() => props.changeEventPropName ?? `update:${props.valuePropName}`
	);

	const slots = useSlots();
	const slotData = computed(() => {
		return {
			value: meta.transformedValue,
			rawValue: meta.rawValue,
			handleChange,
			form: injectedForm,
			error: meta.error,
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
				value: meta.transformedValue,
				onInput: handleChange,
				onChange: handleChange,
				onBlur: handleBlur,
				id: meta.id,
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
			[valuePropName]: meta.transformedValue,
			id: meta.id,
		};
	};

	return {
		getVNodesFromDefaultSlot,
		slotData,
		getInputItemProps,
	};
}
