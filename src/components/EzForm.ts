import { useFormComponentLogics } from "@/composables";
import { FormSlotProps } from "@/models";
import { getFormDefinePropsObject } from "@/utilities";
import { computed, defineComponent, h } from "vue";

const EzFormImpl = /*#__PURE__*/ defineComponent({
	name: "EzForm",
	props: getFormDefinePropsObject(),
	setup: (props, ctx) => {
		// Init form
		const { reset, submit, formInstance } = useFormComponentLogics(
			props,
			ctx.emit
		);
		const { meta, setFieldValue, getFieldValue, validate, isDirty } =
			formInstance;

		const className = computed(() => `${formInstance.classPrefix}-form`);

		// Expose API
		ctx.expose(formInstance);

		// Handle events
		const handleSubmit = (event: Event) => {
			event.preventDefault();
			submit();
		};
		const handleReset = (event: Event) => {
			event.preventDefault();
			reset();
		};

		// Handle slots
		const formSlotProps: FormSlotProps = {
			values: meta.values,
			errors: meta.errors,
			dirty: meta.dirty,
			submit,
			reset,
			validate,
			getFieldValue,
			setFieldValue,
			isDirty,
		};

		return () =>
			h(
				"form",
				{
					class: className.value,
					onSubmit: handleSubmit,
					onReset: handleReset,
				},
				ctx.slots.default?.(formSlotProps)
			);
	},
});

const EzForm = EzFormImpl as typeof EzFormImpl & {
	new (): {
		$slots: {
			default: (slotValue: FormSlotProps) => any;
		};
	};
};

export default EzForm;
