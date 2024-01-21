import type FormInstance from "src/Form";
import GlobalInstances from "src/GlobalInstances";
import {
	FieldMeta,
	FieldOptions,
	UpdateValueOptions,
	ValidateError,
	ValidationOption,
	ValidationResult,
} from "src/models";
import { GetKeys } from "src/models/Utilities";
import {
	EventListenersManager,
	clone,
	get,
	set,
	uniqueId,
} from "src/utilities";
import {
	ControlledPromise,
	createControlledPromise,
} from "src/utilities/promise";
import { SELF_KEY, isFieldValidationSchema } from "src/validation";
import { FieldValidationSchema } from "src/validation/ValidationSchema";

export type DefaultFieldEvents<Value> = {
	change: [field: any];
	"change:value": [value: Value, oldValue: Value];
	"change:meta": [meta: FieldMeta];
	error: [errors: ValidateError[]];
	reset: [];
};

export default abstract class FieldBaseInstance<
	FieldValue,
	FormValues,
	FieldEvents extends DefaultFieldEvents<FieldValue> = DefaultFieldEvents<FieldValue>
> extends EventListenersManager<FieldEvents> {
	protected managerName = "Field";

	name!: GetKeys<FormValues>;
	value!: FieldValue;
	protected form!: FormInstance<FormValues>;
	options!: FieldOptions<FieldValue, FormValues>;
	meta!: FieldMeta;
	uid: string = uniqueId();
	protected validationPromise?: ControlledPromise<ValidationResult>;

	constructor(
		form: FormInstance<FormValues>,
		options: FieldOptions<FieldValue, FormValues>
	) {
		super();
		this.form = form;
		this.name = options.name;
		this.options = options;
		this.initialize(false);
	}

	abstract mount(): () => void;

	initialize = (notify = true) => {
		this.name = this.options.name;
		const oldValue = this.value;
		this.value = (clone(get(this.form.options.initialValues, this.name)) ??
			this.options.initialValue) as FieldValue;

		this.form.setFieldValue(this.name, this.value as any, {
			validate: false,
			dirty: false,
			touched: false,
		});

		this.meta = {
			dirty: false,
			touched: false,
			errors: undefined,
			validating: false,
			validationCount: 0,
		};

		this.cancelValidate();

		if (notify) {
			this.trigger("change:value", this.value, oldValue);
			this.trigger("change", this);
			this.trigger("change:meta", this.meta);
		}
	};

	updateOptions = (options: FieldOptions<FieldValue, FormValues>) => {
		if (this.options.name !== options.name) {
			const oldName = this.name;
			this.name = options.name;
			GlobalInstances.renameField(this.form.name, oldName, this.name);
		}

		this.options = options;

		if (this.name !== options.name) {
			this.initialize();
		}
	};

	// Handle meta
	setMeta = (value: FieldMeta) => {
		this.meta = value;
		this.trigger("change:meta", value);
		this.trigger("change", this);
	};

	setMetaKey = <K extends keyof FieldMeta>(key: K, value: FieldMeta[K]) => {
		set(this.meta, key, value);
		this.trigger("change:meta", this.meta);
		this.trigger("change", this);
	};

	// Handle value
	getValue = (): FieldValue => {
		return this.form.getFieldValue(this.name) as FieldValue;
	};

	setValue = (value: FieldValue, options?: UpdateValueOptions) => {
		const oldValue = this.value;
		const newValue = value;
		this.value = newValue;

		this.form.setFieldValue(this.name, newValue as any, options);
		options?.touched && this.setMetaKey("touched", true);
		options?.dirty && this.setMetaKey("dirty", true);

		this.trigger("change:value", this.value, oldValue);
		this.trigger("change", this);
	};

	// Handle reset
	reset = () => {
		this.initialize();
		this.trigger("reset");
	};

	// Handle validate
	private getValidationSchema = () => {
		if (
			this.options.validationSchema &&
			!isFieldValidationSchema(this.options.validationSchema)
		) {
			throw new Error(
				"[Field.options.validationSchema] must be FieldValidationSchema."
			);
		}

		let validationSchema = this.options.validationSchema
			? this.options.validationSchema.clone()
			: undefined;

		const formValidationSchema = this.form.getValidationSchema();
		if (!formValidationSchema) {
			return validationSchema;
		}

		if (!validationSchema) {
			validationSchema = formValidationSchema.clone() as FieldValidationSchema;
			validationSchema.FOR_FIELD = true;
			validationSchema.clearRules();
		}

		validationSchema.addRule(SELF_KEY, formValidationSchema.getRule(this.name));

		return validationSchema;
	};

	validate = (options?: ValidationOption): Promise<ValidationResult> => {
		this.setMetaKey("validationCount", this.meta.validationCount + 1);
		this.setMetaKey("validating", true);

		this.validationPromise = createControlledPromise();
		this.validationPromise
			.then(() => {
				this.setMetaKey("validating", false);
			})
			.catch(() => {
				this.setMetaKey("validating", false);
			});

		const validationSchema = this.getValidationSchema();

		if (!validationSchema) {
			this.validationPromise.resolve({ valid: true, errors: [] });
			return this.validationPromise;
		}

		if (this.form.options.validateMessages) {
			validationSchema.updateMessages(this.form.options.validateMessages);
		}

		validationSchema
			?.validate(this.form.getValues() as any, {
				selfFieldName: this.name,
				validateFirst: options?.validateFirst || this.options.validateFirst,
				...options,
			})
			.then((result) => {
				if (!this.validationPromise) {
					return;
				}

				if (!result.valid) {
					result.errors = this.normalizeValidateErrors(result.errors);

					this.setMetaKey("errors", result.errors);
					this.trigger("error", result.errors);
				} else {
					this.setMetaKey("errors", []);
				}

				this.validationPromise.resolve(result);
			});

		return this.validationPromise;
	};

	cancelValidate = () => {
		if (!this.validationPromise) {
			return;
		}

		this.validationPromise.reject({ cancelled: true });
		this.validationPromise = undefined;
	};

	clearValidate = () => {
		this.cancelValidate();
		this.setMetaKey("errors", []);
	};

	normalizeValidateErrors(errors: ValidateError[]) {
		return errors.map((error) => {
			return {
				...error,
				messages: this.options.label
					? error.messages.map((message) => {
							return message.replace(
								new RegExp(this.name, "g"),
								this.options.label ?? ""
							);
					  })
					: error.messages,
			};
		});
	}
}
