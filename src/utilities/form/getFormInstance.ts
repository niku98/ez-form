import { FormInstance } from "@/models";
import { globalFormInstances } from "@/utilities/constants";
import { computed, ComputedRef } from "vue";

/**
 * Using form name to get form instance from anywhere in you app.
 * You have to set a name for the form you want to get instance.
 *
 */
export default function getFormInstance<
	Computed extends boolean | undefined = false
>(
	name: string,
	isComputed: Computed | boolean = false
): Computed extends true
	? ComputedRef<FormInstance | undefined>
	: FormInstance | undefined {
	if (isComputed) {
		return computed(() => {
			return globalFormInstances[name]?.instance;
		}) as any;
	}

	return globalFormInstances[name]?.instance as any;
}
