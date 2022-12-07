import useInjectPrivateForm from "@/composables/useInjectPrivateForm";
import { NamePath, ValidateError } from "@/models";
import {
	castNamePathToString,
	computedWithTarget,
	debounce,
} from "@/utilities";
import { computed, ComputedRef, Ref, unref } from "vue";

export default function useFormErrors(
	namePath?: NamePath | Ref<NamePath | undefined>
): ComputedRef<ValidateError[]> {
	const injectedForm = useInjectPrivateForm();
	if (namePath === undefined) {
		return computed(() => injectedForm.meta.errors);
	}

	const field = computedWithTarget(
		[() => namePath, namePath, injectedForm.fields],
		debounce(() => {
			const path = castNamePathToString(unref(namePath) ?? "");
			return injectedForm.fields[path] ?? {};
		}, 500)
	);

	return computed(() => {
		const error = unref(field.value.error);
		return error ? [error] : [];
	});
}
