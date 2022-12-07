import { FormItemInstance } from "@/models";
import { $formItemInjectKey } from "@/utilities/constants";
import { provide } from "vue";

export default function provideFormItemInstance(
	formItemInstance: FormItemInstance
) {
	provide($formItemInjectKey, formItemInstance);
}
