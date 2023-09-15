import EzBindingFieldInput from "src/components/BindingFieldInput";
import EzField from "src/components/Field";
import EzFieldErrors from "src/components/FieldErrors";
import EzForm from "src/components/Form";
import EzObserve from "src/components/Observe";
import EzObserveField from "src/components/ObserveField";
import useField from "src/composables/useField";
import useForm from "src/composables/useForm";
import { useInjectField } from "src/provides/field";
import { useInjectForm } from "src/provides/form";
import type { Plugin } from "vue";
export type * from "@niku/ez-form-core";
export * from "src/composables/useInstance";

export {
	asyncFieldSchema,
	asyncSchema,
	yupFieldSchema,
	yupSchema,
	zodFieldSchema,
	zodSchema,
} from "@niku/ez-form-core";

export {
	EzBindingFieldInput,
	EzField,
	EzFieldErrors,
	EzForm,
	EzObserve,
	EzObserveField,
	useField,
	useForm,
	useInjectField,
	useInjectForm,
};

const EzFormPlugin: Plugin = {
	install(app) {
		app.component("EzForm", EzForm);
		app.component("EzField", EzField);
		app.component("EzBindingFieldInput", EzBindingFieldInput);
		app.component("EzFieldError", EzFieldErrors);
	},
};

export default EzFormPlugin;
