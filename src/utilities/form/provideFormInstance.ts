import type { FormInstance } from "@/models";
import { $formInjectKey } from "@/utilities/constants";
import { provide } from "vue";

export default function provideFormInstance(form: FormInstance) {
	provide($formInjectKey, form);
}
