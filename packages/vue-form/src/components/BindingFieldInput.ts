/* eslint-disable @typescript-eslint/no-unsafe-argument */
"use client";

import type {
	FieldInstance,
	FieldMeta,
	FormInstance,
} from "@niku/ez-form-core";
import { useInjectField } from "src/provides/field";
import { useInjectForm } from "src/provides/form";
import { Fragment, defineComponent, h, type Slot, type VNode } from "vue";

export type BindingFieldInputProps = {
	inputIndex?: number;
};

const BindingFieldInputImpl = defineComponent({
	name: "EzBindingFieldInput",
	props: {
		inputIndex: {
			type: Number,
			required: false,
			default: 0,
		},
	},
	setup(props, { slots }) {
		const form = useInjectForm();
		const field = useInjectField();
		const value = field.useFieldValue();
		const meta = field.useFieldMeta();

		const slotData = () => ({
			field,
			form,
			value: value.value,
			meta: meta.value,
		});

		const getVNodesFromDefaultSlot = () => {
			return slots.default ? getVNodeFromSlot(slots.default) : [];
		};

		const getVNodeFromSlot = (slot: Slot): VNode[] => {
			const vNodes = (slot && slot()) ?? [];

			if (vNodes.length && vNodes[0]?.type === Fragment) {
				const { children } = vNodes[0];
				if (children === null) {
					return [];
				}

				if (typeof children === "string") {
					return [h(children)];
				}

				return [
					...(Array.isArray(children)
						? (children as VNode[])
						: getVNodeFromSlot(children["default"] as any)),
					...vNodes.slice(1),
				];
			}

			return (slots.default && slots.default(slotData())) ?? [];
		};

		return () =>
			getVNodesFromDefaultSlot().map((vNode, index) => {
				return h(
					vNode,
					{
						key: index,
						...(index === props.inputIndex ? field.getInputProps(vNode) : {}),
					},
					undefined
				);
			});
	},
});

type BaseBindingFieldInputType = typeof BindingFieldInputImpl;

const EzBindingFieldInput = BindingFieldInputImpl as unknown as Omit<
	BaseBindingFieldInputType,
	"$props"
> & {
	new (): {
		$props: BindingFieldInputProps;
		$slots: {
			default: (helpers: {
				field: FieldInstance<any, any>;
				form: FormInstance;
				value: any;
				meta: FieldMeta;
			}) => any;
		};
	};
};

export default EzBindingFieldInput;
