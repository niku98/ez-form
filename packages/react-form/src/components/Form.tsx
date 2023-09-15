/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { FormInstance, FormOptions } from "@niku/ez-form-core";
import type { ReactElement, ReactNode } from "react";
import formContext from "src/contexts/formContext";
import useForm from "src/hooks/useForm";

export interface FormProps<FormValues> extends FormOptions<FormValues> {
	form?: FormInstance<FormValues>;
	children?: ReactNode;
}

export default function Form<FormValues>({
	children,
	...props
}: FormProps<FormValues>) {
	const form = useForm(props);
	form.useFormMeta();

	return (
		<formContext.Provider value={{ form: form as any }}>
			{children}
		</formContext.Provider>
	);
}

Form.displayName = "Form";

export type FormComponent<FormValues> = (
	props: FormProps<FormValues>
) => ReactElement;
