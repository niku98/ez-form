import { type FormInstance } from "@niku/ez-form-core";
import { useInjectForm } from "src/provides/form";
import { defineComponent, type PropType } from "vue";

export type ObserveProps<FormValues> = {
	selector?: (values: FormValues) => any;
};

/**
 * Observe form's values
 */
const ObserveImpl = defineComponent({
	name: "EzObserve",
	props: {
		selector: {
			type: Function as PropType<(values: any) => any>,
			default: undefined,
			required: false,
		},
	},
	setup(props, ctx) {
		const form = useInjectForm();
		form.useFormMeta();
		const values = form.useFormValues<unknown>(props.selector);

		return () => ctx.slots.default?.({ form, values: values.value });
	},
});

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
const Observe = ObserveImpl as unknown as ObserveComponent<any>;
export default Observe;

type BaseObserveType = typeof ObserveImpl;

export type ObserveComponent<FormValues> = Omit<BaseObserveType, "$props"> & {
	new (): {
		$props: ObserveProps<FormValues>;
		$slots: {
			default: (helpers: {
				form: FormInstance<FormValues>;
				values: any;
			}) => void;
		};
	};
};
