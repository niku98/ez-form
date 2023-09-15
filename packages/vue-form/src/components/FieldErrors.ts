import type { ValidateError } from "@niku/ez-form-core";
import { useInjectField } from "src/provides/field";
import { defineComponent } from "vue";

const FieldErrorsImpl = defineComponent({
	name: "EzFieldErrors",
	setup(_, ctx) {
		const field = useInjectField();
		const errors = field.useFieldMeta((meta) => meta.errors);

		return () => ctx.slots.default?.({ errors: errors.value ?? [] });
	},
});

const EzFieldErrors = FieldErrorsImpl as typeof FieldErrorsImpl & {
	new (): {
		$slots: {
			default: (props: { errors: ValidateError[] }) => any;
		};
	};
};

export default EzFieldErrors;
