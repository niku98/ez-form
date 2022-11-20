import { FormEmitter, FormInstance } from "@/models";
import { clone } from "@/utilities";
import { watch } from "vue";

export default function useHandleFormEmit(
	form: FormInstance,
	emit: FormEmitter
) {
	const submitForm = form.submit;
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

		return new Promise((resolve, reject) => {
			submitForm()
				.then((values) => {
					emit("submit", values);
					resolve(values);
				})
				.catch((errors) => {
					emit("error", errors);
					reject(errors);
				});
		});
	};
	form.submit = submit;

	function submitCaught() {
		submit().catch(() => {});
	}

	const resetForm = form.reset;
	const reset: FormInstance["reset"] = (values) => {
		resetForm(values);
		emit("reset");
	};
	form.reset = reset;

	watch(form.meta.values, (value) => {
		emit("change", clone(value));
	});

	return { submit: submitCaught, reset };
}
