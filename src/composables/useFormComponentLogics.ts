import useForm from "@/composables/useForm";
import { FormEmitter, FormInstance, FormSettings } from "@/models";
import { PrivateFormInstance } from "@/models/PrivateInstances";
import { clone, debounce, provideFormInstance } from "@/utilities";
import { watch } from "vue";

interface UseFormComponentLogicsResult {
	submit: FormInstance["submit"];
	reset: FormInstance["reset"];
	formInstance: FormInstance;
}

export default function useFormComponentLogics(
	props: FormSettings,
	emit: FormEmitter
): UseFormComponentLogicsResult {
	// Handle form settings
	const formInstance = (props.form ?? useForm(props)) as PrivateFormInstance;

	if (props.form) {
		formInstance.updateSettings(
			{
				...props,
			},
			true
		);

		watch(
			props,
			// When pass form instance as props
			// It will cause an issue
			// Any when form instance changes, this watcher will be triggered
			// So, we need to debounce this watcher to prevent performance issue
			debounce(() => {
				formInstance.updateSettings({
					...props,
				});
			}, 500)
		);
	}
	// Wrap form instance's submit function to emit event
	const submitForm = formInstance.submit;
	const submit: FormInstance["submit"] = (onSuccess, onError) => {
		if (onSuccess || onError) {
			return submitForm(
				(values) => {
					emit("submit", values);
					onSuccess?.(values);
				},
				(errors) => {
					emit("error", errors);
					onError?.(errors);
				}
			) as any;
		}

		return new Promise((resolve) => {
			submitForm().then(({ values, errors }) => {
				if (errors) {
					emit("error", errors);
					resolve({ errors });
				} else {
					emit("submit", values);
					resolve({ values });
				}
			});
		});
	};
	formInstance.submit = submit;

	// Wrap form instance's submit function to emit event
	const resetForm = formInstance.reset;
	const reset = (values?: any) => {
		resetForm(values);
		emit("reset");
	};
	formInstance.reset = reset;

	watch(formInstance.meta.values, (value) => {
		emit("change", clone(value));
	});

	// Provide form instance again
	// to make sure that child form item and child form list will use this
	// instead of others.
	provideFormInstance(formInstance);

	return { submit, reset, formInstance };
}
