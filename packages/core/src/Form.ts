import type FieldBaseInstance from "src/FieldBase";
import GlobalInstances from "src/GlobalInstances";
import {
	FormMeta,
	FormOptions,
	UpdateValueOptions,
	ValidateError,
	ValidationOption,
	ValidationResult,
} from "src/models";
import { GetKeys, GetType } from "src/models/Utilities";
import {
	EventListenersManager,
	clone,
	get,
	isEqual,
	set,
	uniqueId,
} from "src/utilities";
import { toArray } from "src/utilities/array";
import {
	ControlledPromise,
	createControlledPromise,
} from "src/utilities/promise";
import { ValidationSchema, normalizeErrors } from "src/validation";

type FormEvents<Values> = {
	change: [form: FormInstance<Values>];
	"change:value": [values: Values, oldValues: Values];
	"change:meta": [meta: FormMeta, oldMeta: FormMeta];
	reset: [];
	submit: [values: Values];
	error: [errors: ValidateError[]];
	reInitialize: [];
	validate: [];
};

export default class FormInstance<
	Values = unknown
> extends EventListenersManager<FormEvents<Values>> {
	protected managerName = "Form";

	uid: string = uniqueId();
	name!: string;
	values!: Values;
	meta!: FormMeta;
	options: FormOptions<Values>;
	private fields: Set<FieldBaseInstance<any, Values>> = new Set([]);

	private validationPromise?: ControlledPromise<ValidationResult>;
	private validationSchema?: ValidationSchema<GetKeys<Values>>;

	constructor(options?: Partial<FormOptions<Values>>) {
		super();
		this.options = Object.assign(
			{
				rules: {},
				preserveValues: false,
				enableReinitialize: false,
				validateMessages: undefined,
				validateTrigger: "change",
			},
			options
		);

		this.initialize(false);

		this.updateValidationSchema(options?.validationSchema);
	}

	initialize(notify = true) {
		const oldValues = { ...this.values };
		const oldMeta = { ...this.meta };
		this.values = clone(this.options.initialValues ?? ({} as Values));
		this.name = this.options.name ?? uniqueId();

		this.meta = {
			dirty: false,
			errors: [],
			touched: false,
			submitting: false,
			valid: true,
			submissionCount: 0,
			validating: false,
			validationCount: 0,
		};

		this.cancelValidate();

		if (notify) {
			this.trigger("change", this);
			this.trigger("change:value", this.values, oldValues);
			this.trigger("change:meta", this.meta, oldMeta);
		}
	}

	updateOptions = (options: Partial<FormOptions<Values>>) => {
		if (this.options.name !== options.name) {
			const oldName = this.name;
			this.name = options.name ?? uniqueId();
			GlobalInstances.renameForm(oldName, this.name);
		}

		this.options = options;

		this.updateValidationSchema(options?.validationSchema);

		if (
			this.options.enableReinitialize &&
			!isEqual(this.values, options.initialValues)
		) {
			this.initialize();
			this.trigger("reInitialize");
		}
	};

	mount = () => {
		const fieldsToAdd: FieldBaseInstance<any, any>[] = [];
		this.fields.forEach((field) => {
			if (field.options.registerInstance !== false) {
				fieldsToAdd.push(field);
			}
		});

		GlobalInstances.addForm(this as any, fieldsToAdd);

		return () => {
			GlobalInstances.removeForm(this.name);
		};
	};

	// Handle meta
	setMeta = (meta: FormMeta) => {
		const oldMeta = this.meta;
		this.meta = meta;
		this.trigger("change:meta", meta, oldMeta);
		this.trigger("change", this);
	};

	setMetaKey = <K extends keyof FormMeta>(key: K, value: FormMeta[K]) => {
		const oldMeta = { ...this.meta };
		set(this.meta, key, value);
		this.trigger("change:meta", this.meta, oldMeta);
		this.trigger("change", this);
	};

	// Handle values
	setValues = (values: Values, options?: UpdateValueOptions) => {
		const oldValues = { ...this.values };
		this.values = values;
		if (options?.touched) {
			this.setMetaKey("touched", true);
		}
		if (options?.dirty) {
			this.setMetaKey("dirty", true);
		}

		(options?.dirty || options?.touched) &&
			this.options.onValuesChange?.(values, oldValues);

		this.trigger("change", this);
		this.trigger("change:value", this.values, oldValues);
		options?.validate && this.validate();
	};

	getValues = (): Values => {
		return this.values;
	};

	// Handle fields
	addField = (field: FieldBaseInstance<any, Values>) => {
		if (!this.fields.has(field)) {
			this.fields.add(field);

			field.options.registerInstance !== false &&
				GlobalInstances.addField(this.name, field);
		}

		return () => {
			this.removeField(field);
		};
	};

	removeField = (field: FieldBaseInstance<any, Values>) => {
		const fieldName = field.name;
		const registerInstance = field.options.registerInstance;

		if (!this.fields.has(field)) {
			return;
		}

		const deleted = this.fields.delete(field);
		if (!deleted) {
			return;
		}

		registerInstance !== false &&
			GlobalInstances.removeField(this.name, fieldName);

		// TODO: Make it work

		// if (!this.options.preserveValues && !field.options.preserveValue) {
		// 	const oldValues = { ...this.values };

		// 	deleteFrom(this.values, fieldName);
		// 	this.trigger("change", this);
		// 	this.trigger("change:value", this.values, oldValues);
		// }
	};

	removeFieldByUid = (uid: string) => {
		let result: FieldBaseInstance<unknown, Values> | undefined;
		this.fields.forEach((field) => {
			if (field.uid === uid) {
				result = field;
			}
		});

		if (result) {
			GlobalInstances.removeField(this.name, result.name);
			this.fields.delete(result);
		}
	};

	getFieldByName = <N extends GetKeys<Values>>(
		name: N
	): FieldBaseInstance<GetType<Values, N>, Values> => {
		let result: FieldBaseInstance<GetType<Values, N>, Values> | undefined;
		this.fields.forEach((field) => {
			if (field.name === name) {
				result = field;
			}
		});

		if (!result) {
			throw new Error(`[${name}] cannot be found`);
		}

		return result;
	};

	filterFields = (
		compareFn: (field: FieldBaseInstance<unknown, Values>) => boolean
	): FieldBaseInstance<unknown, Values>[] => {
		const result: FieldBaseInstance<unknown, Values>[] = [];
		this.fields.forEach((field) => {
			if (compareFn(field)) {
				result.push(field);
			}
		});

		return result;
	};

	// Handle Field value
	setFieldValue = <N extends GetKeys<Values>>(
		name: N,
		value: GetType<Values, N>,
		options?: UpdateValueOptions
	) => {
		const oldValues = this.values;
		const values = { ...this.values };
		set(values, name, value);
		this.setValues(values, options);

		this.trigger("change", this);
		this.trigger("change:value", this.values, oldValues);
	};

	getFieldValue = <N extends GetKeys<Values>>(name: N): GetType<Values, N> => {
		return get(this.values, name);
	};

	// Handle reset
	reset = () => {
		this.initialize();
		this.trigger("reset");
	};

	// handle submit
	submit = () => {
		this.setMetaKey("submissionCount", this.meta.submissionCount + 1);
		this.setMetaKey("submitting", true);

		this.validate()
			.then(({ valid, errors }) => {
				this.setMetaKey("submitting", false);
				if (valid) {
					this.options.onSubmit?.(this.values);
					this.trigger("submit", this.values);
				} else {
					this.options.onError?.(errors);
					this.trigger("error", errors);
				}
			})
			.catch((error) => {
				this.setMetaKey("submitting", false);
			});
	};

	// Handle validate
	getValidationSchema = () => {
		return this.validationSchema;
	};

	private updateValidationSchema = (
		schema?: ValidationSchema<GetKeys<Values>>
	) => {
		this.validationSchema = schema;
	};

	validate = (options?: ValidationOption) => {
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

		const fieldValidationPromisees: Promise<ValidationResult>[] = [];

		this.fields.forEach((field) => {
			fieldValidationPromisees.push(field.validate(options));
		});

		Promise.all(fieldValidationPromisees)
			.then((results) => {
				if (!this.validationPromise) {
					return;
				}

				const invalidResults = results.filter(({ valid }) => !valid);
				const valid = invalidResults.length === 0;
				const errors = normalizeErrors(
					invalidResults.flatMap((result) => result.errors)
				);

				this.setMetaKey("errors", errors);
				this.setMetaKey("valid", valid);

				this.validationPromise.resolve({
					valid,
					errors,
				});
			})
			.catch((error) => {});

		return this.validationPromise;
	};

	validateFields = <Field extends GetKeys<Values>>(
		fields: Field | Field[],
		options?: ValidationOption
	): Promise<ValidationResult> => {
		const fieldList = toArray(fields);
		const fieldValidationPromisees: Promise<ValidationResult>[] = [];

		this.fields.forEach((field) => {
			if (fieldList.includes(field.name as any)) {
				fieldValidationPromisees.push(field.validate(options));
			}
		});

		return Promise.all(fieldValidationPromisees).then((results) => {
			const invalidResults = results.filter(({ valid }) => !valid);

			const errors = normalizeErrors(
				this.meta.errors
					.filter((error) => !fieldList.includes(error.field as any))
					.concat(invalidResults.flatMap((result) => result.errors))
			);

			this.setMetaKey("errors", errors);
			this.setMetaKey("valid", errors.length === 0);

			return {
				valid: errors.length === 0,
				errors,
			};
		});
	};

	// TODO: Should cancel current validating too
	cancelValidate = () => {
		if (!this.validationPromise) {
			return;
		}

		this.validationPromise.reject({ cancelled: true });
		this.validationPromise = undefined;
		this.fields.forEach((field) => {
			field.cancelValidate();
		});
	};

	clearValidate = () => {
		this.cancelValidate();
		this.setMetaKey("errors", []);
		this.fields.forEach((field) => {
			field.clearValidate();
		});
	};
}
