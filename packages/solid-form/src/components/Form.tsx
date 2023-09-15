/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { FormInstance, FormOptions } from "@niku/ez-form-core";
import { splitProps, type JSXElement } from "solid-js";
import formContext from "src/contexts/formContext";
import useForm from "src/hooks/useForm";

export interface FormProps<FormValues> extends FormOptions<FormValues> {
	form?: FormInstance<FormValues>;
	children?: JSXElement;
}

function Form<FormValues>(props: FormProps<FormValues>) {
	const [local, others] = splitProps(props, ["children"]);

	const form = useForm(others);
	form.useFormMeta();

	return (
		<formContext.Provider value={{ form: form as any }}>
			{local.children}
		</formContext.Provider>
	);
}

Form.displayName = "Form";

export default Form;

export type FormComponent<FormValues> = (
	props: FormProps<FormValues>
) => JSXElement;
