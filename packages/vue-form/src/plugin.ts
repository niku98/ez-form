import EzBindingFieldInput from "src/components/BindingFieldInput";
import EzField from "src/components/Field";
import EzFieldArray from "src/components/FieldArray";
import EzFieldErrors from "src/components/FieldErrors";
import EzForm from "src/components/Form";
import EzObserve from "src/components/Observe";
import EzObserveField from "src/components/ObserveField";
import type { Plugin } from "vue";

declare module "@vue/runtime-core" {
	export interface GlobalComponents {
		EzForm: typeof EzForm;
		EzField: typeof EzField;
		EzFieldArray: typeof EzFieldArray;
		EzBindingFieldInput: typeof EzBindingFieldInput;
		EzObserve: typeof EzObserve;
		EzObserveField: typeof EzObserveField;
		EzFieldErrors: typeof EzFieldErrors;
	}
}

const EzFormPlugin: Plugin = {
	install(app) {
		app.component("EzForm", EzForm);
		app.component("EzField", EzField);
		app.component("EzFieldArray", EzFieldArray);
		app.component("EzBindingFieldInput", EzBindingFieldInput);
		app.component("EzFieldErrors", EzFieldErrors);
		app.component("EzObserve", EzObserve);
		app.component("EzObserveField", EzObserveField);
	},
};

export default EzFormPlugin;
