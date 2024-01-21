import FieldBaseInstance from "src/FieldBase";
import { FieldMeta, ValidateError } from "src/models";

export type FieldEvents<Value> = {
	change: [field: FieldInstance<any, any>];
	"change:value": [value: Value, oldValue: Value];
	"change:meta": [meta: FieldMeta];
	error: [errors: ValidateError[]];
	reset: [];
};

export default class FieldInstance<
	FieldValue,
	FormValues
> extends FieldBaseInstance<FieldValue, FormValues, FieldEvents<FieldValue>> {
	protected managerName = "Field";

	// Handle mount and unmount
	mount = () => {
		this.form.addField(this);

		const offChangeValue = this.form.on("change:value", () => {
			const newValue = this.getValue();
			const oldValue = this.value;

			if (this.value !== newValue) {
				this.value = newValue;
				this.setMetaKey("dirty", true);

				this.trigger("change:value", this.value, oldValue);
				this.trigger("change", this);
			}
		});

		const offThisChangeMeta = this.on("change:meta", () => {
			const { dirty, touched } = this.meta;

			dirty && this.form.setMetaKey("dirty", true);
			touched && this.form.setMetaKey("touched", true);
		});

		const offFormReset = this.form.on("reset", () => {
			this.initialize();
		});

		const offFormReInitialize = this.form.on("reInitialize", () => {
			this.initialize();
		});

		return () => {
			offChangeValue();
			offThisChangeMeta();
			offFormReInitialize();
			offFormReset();
			this.form.removeField(this);
		};
	};

	// Handle field's input events
	handleChange = (event: any) => {
		let value = event;

		if (
			typeof event === "object" &&
			"target" in event &&
			event.target instanceof HTMLElement
		) {
			const target = event.target as HTMLInputElement;

			value = ["checkbox", "radio"].includes(target.type)
				? target.checked
				: target.value;
		}

		this.setValue(value, { dirty: true, touched: true });
		this.options.onChange?.(value);
		this.form.validateFields(this.name, { trigger: ["change"] });
	};

	handleBlur = (event: Event) => {
		this.setMetaKey("touched", true);
		this.form.setMetaKey("touched", true);
		this.options.onBlur?.(event);
		this.form.validateFields(this.name, { trigger: ["blur"] });
	};
}
