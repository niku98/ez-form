import useFormErrors from "@/composables/useFormErrors";
import { NamePath, ValidateError } from "@/models";
import { PropType, defineComponent, toRef } from "vue";

const EzFormErrorsImpl = /*#__PURE__*/ defineComponent({
	name: "EzFormErrors",
	props: {
		name: {
			type: [String, Number, Array] as PropType<NamePath>,
			required: false,
		},
	},
	setup: (props, ctx) => {
		const errors = useFormErrors(toRef(props, "name"));

		return () => ctx.slots.default?.({ errors });
	},
});

const EzFormErrors = EzFormErrorsImpl as typeof EzFormErrorsImpl & {
	new (): {
		$slots: {
			default: (props: { errors: ValidateError[] }) => void;
		};
	};
};
export default EzFormErrors;
