/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { FormInstance, FormOptions } from "@niku/ez-form-core";
import { useForm } from "src/index";
import { formProps } from "src/utilities/form";
import { defineComponent } from "vue";

export interface FormProps<FormValues> extends FormOptions<FormValues> {
	form?: FormInstance<FormValues>;
}

const FormImpl = defineComponent({
	name: "EzForm",
	props: formProps(),
	setup(props, ctx) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		useForm(props as any);
		return () => ctx.slots.default?.();
	},
});

const EzForm = FormImpl as unknown as FormComponent<any>;

export default EzForm;

type BaseFormType = typeof FormImpl;

export type FormComponent<FormValues> = Omit<BaseFormType, "$props"> & {
	new (): {
		$props: FormProps<FormValues>;
		$slots: {
			default: () => any;
		};
	};
};
