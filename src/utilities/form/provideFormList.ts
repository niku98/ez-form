import { FormListInstance } from "@/models";
import { $formListInjectKey } from "@/utilities/constants";
import { provide } from "vue";

export default function provideFormListInstance(
	formListInstance: FormListInstance
) {
	provide($formListInjectKey, formListInstance);
}
