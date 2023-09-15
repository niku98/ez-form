import {
	FieldInstance,
	type FormInstance,
	type GetKeys,
} from "@niku/ez-form-core";
import { useField } from "src/index";
import { useInjectForm } from "src/provides/form";
import { defineComponent, type PropType } from "vue";

export type ObserveFieldProps<
	FormValues,
	N extends string = GetKeys<FormValues>
> = {
	name: N;
	selector?: (value: any) => any;
};

/**
 * Observe field's value
 */
const ObserveFieldImpl = defineComponent({
	name: "EzObserveField",
	props: {
		name: {
			type: String,
			required: true,
		},
		selector: {
			type: Function as PropType<(values: any) => any>,
			default: undefined,
			required: false,
		},
	},
	setup(props, ctx) {
		const form = useInjectForm();
		const field = useField({
			name: props.name,
			// preserveValue: true,
			registerInstance: false,
		});
		form.removeField(field);
		const value = field.useFieldValue<unknown>(props.selector);

		return () => ctx.slots.default?.({ form, field, value: value.value });
	},
});

const ObserveField = ObserveFieldImpl as unknown as ObserveFieldComponent<any>;

export default ObserveField;

type BaseObserveFieldType = typeof ObserveFieldImpl;

export type ObserveFieldComponent<FormValues> = Omit<
	BaseObserveFieldType,
	"$props"
> & {
	new (): {
		$props: ObserveFieldProps<FormValues>;
		$slots: {
			default: (helpers: {
				field: FieldInstance<any, FormValues>;
				form: FormInstance<FormValues>;
				value: any;
			}) => void;
		};
	};
};
