import { FormItemInstance, NamePath } from "@/models";
import { globalFormInstances } from "@/utilities/constants";
import { castNamePathToString } from "@/utilities/object";
import { computed, ComputedRef } from "vue";

/**
 * Using form name and name path to get form item instance from anywhere in you app.
 * You have to set a name for the form you want to get it's form item instance.
 *
 */
export default function getFormItemInstance<
	Computed extends boolean | undefined = false
>(
	formName: string,
	namePath: NamePath,
	isComputed: Computed | boolean = false
): Computed extends true
	? ComputedRef<FormItemInstance | undefined>
	: FormItemInstance | undefined {
	function temp() {
		const globalInstance = globalFormInstances[formName];

		if (globalInstance) {
			return globalInstance.items
				? globalInstance.items[castNamePathToString(namePath)]
				: undefined;
		}

		return undefined;
	}
	if (isComputed) {
		return computed(() => {
			return temp();
		}) as any;
	}

	return temp() as any;
}
