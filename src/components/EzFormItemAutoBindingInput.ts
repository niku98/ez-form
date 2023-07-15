import { useFormItemAutoBinding, useInjectFormItem } from "@/composables";
import { FormItemSlotProps } from "@/models";
import { defineComponent, h } from "vue";

const EzFormItemAutoBindingInputImpl = /*#__PURE__*/ defineComponent({
	name: "EzFormItemAutoBindingInput",
	props: {
		inputNodeIndex: {
			type: Number,
			required: false,
		},
		autoBinding: {
			type: Boolean,
			required: false,
		},
		changeEventPropName: {
			type: String,
			required: false,
		},
		blurEventPropName: {
			type: String,
			required: true,
		},
		valuePropName: {
			type: String,
			required: true,
		},
	},
	setup: (props, ctx) => {
		const formItemInstance = useInjectFormItem();

		// Handle auto binding
		const { slotData, getVNodesFromDefaultSlot, getInputItemProps } =
			useFormItemAutoBinding(formItemInstance, props);

		if (!props.autoBinding) {
			return ctx.slots.default?.(slotData);
		}

		return () =>
			getVNodesFromDefaultSlot().map((vNode, index) => {
				return h(
					vNode,
					{
						key: vNode.patchFlag,
						...(index === props.inputNodeIndex ? getInputItemProps(vNode) : {}),
					},
					undefined
				);
			});
	},
});

const EzFormItemAutoBindingInput =
	EzFormItemAutoBindingInputImpl as typeof EzFormItemAutoBindingInputImpl & {
		new (): {
			$slots: {
				default: (props: FormItemSlotProps) => void;
			};
		};
	};
export default EzFormItemAutoBindingInput;
