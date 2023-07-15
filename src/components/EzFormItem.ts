import EzFormItemAutoBindingInput from "@/components/EzFormItemAutoBindingInput";
import EzFormItemViewVue from "@/components/EzFormItemView";
import { useFormItemComponentLogics } from "@/composables";
import {
	FormInstance,
	FormItemInstance,
	FormItemSlotProps,
	ValidateError,
} from "@/models";
import { getFormItemDefinePropsObject } from "@/utilities";
import { computed, defineComponent, h } from "vue";

const EzFormItemImpl = /*#__PURE__*/ defineComponent({
	name: "EzFormItem",
	props: getFormItemDefinePropsObject(),
	setup: (props, ctx) => {
		const { formItemInstance, formInstance } = useFormItemComponentLogics(
			props,
			ctx.emit
		);

		const { meta, requiredMarkString } = formItemInstance;

		const className = computed(() => `${formInstance.classPrefix}-form-item`);

		ctx.expose(formItemInstance);

		return () =>
			h(
				EzFormItemViewVue,
				{
					label: props.label,
					idFor: meta.id,
					requiredMark: requiredMarkString.value,
					noStyle: props.noStyle,
					colon: props.colon,
					class: className.value,
					hasError: !!meta.error,
				},
				{
					default: () =>
						h(
							EzFormItemAutoBindingInput as any,
							{
								autoBinding: props.autoBinding,
								blurEventPropName: props.blurEventPropName,
								changeEventPropName: props.changeEventPropName,
								inputNodeIndex: props.inputNodeIndex,
								valuePropName: props.valuePropName,
							},
							{
								default: (data: any) => ctx.slots.default?.(data),
							}
						),

					errors: meta.error
						? () =>
								ctx.slots.errors
									? ctx.slots.errors({
											errors: meta.error,
											form: formInstance,
											formItem: formItemInstance,
									  })
									: meta.error?.messages.map((message) =>
											h("span", null, message)
									  )
						: undefined,
					extra: ctx.slots.extra?.({
						form: formInstance,
						formItem: formItemInstance,
					}),
				}
			);
	},
});

const EzFormItem = EzFormItemImpl as typeof EzFormItemImpl & {
	new (): {
		$slots: {
			default: (props: FormItemSlotProps) => void;
			errors: (props: {
				error: ValidateError;
				form: FormInstance;
				formItem: FormItemInstance;
			}) => void;
			extra: (props: {
				form: FormInstance;
				formItem: FormItemInstance;
			}) => void;
		};
	};
};
export default EzFormItem;
