import FieldBaseInstance from "src/FieldBase";
import FormInstance from "src/Form";
import { FieldMeta, FieldOptions, ToArray, ValidateError } from "src/models";
import { isEqual, uniqueId } from "src/utilities";
import { toArray } from "src/utilities/array";

type GetArrayItemType<T> = ToArray<T>[number];

export type FieldArrayEvents<Value, FormValues> = {
	change: [field: FieldArrayInstance<Value, FormValues>];
	"change:value": [value: Value, oldValue: Value];
	"change:meta": [meta: FieldMeta];
	error: [errors: ValidateError[]];
	reset: [];
	push: [value: Value, ...items: GetArrayItemType<Value>[]];
	pop: [value: Value, oldItem: GetArrayItemType<Value>];
	shift: [value: Value, oldItem: GetArrayItemType<Value>];
	unshift: [value: Value, ...items: GetArrayItemType<Value>[]];
	insert: [value: Value, index: number, ...newItems: GetArrayItemType<Value>[]];
	remove: [value: Value, index: number, oldItem: GetArrayItemType<Value>];
	swap: [value: Value, firstIndex: number, secondIndex: number];
	replace: [
		value: Value,
		index: number,
		oldItem: GetArrayItemType<Value>,
		newItem: GetArrayItemType<Value>
	];
	move: [value: Value, fromIndex: number, toIndex: number];
};

export default class FieldArrayInstance<
	FieldValue,
	FormValues
> extends FieldBaseInstance<
	FieldValue,
	FormValues,
	FieldArrayEvents<FieldValue, FormValues>
> {
	protected managerName = "FieldArray";
	private get fields(): FieldValue {
		return (this.value !== undefined ? toArray(this.value) : []) as FieldValue;
	}
	private set fields(value: FieldValue) {
		this.setValue(value, { dirty: true });
	}

	private keys: string[] = [];

	constructor(
		form: FormInstance<FormValues>,
		options: FieldOptions<FieldValue, FormValues>
	) {
		super(form, options);
	}

	getFieldsInfo() {
		return Array.isArray(this.fields)
			? this.fields.map((_, index) => {
					let key = this.keys[index];

					if (key === undefined) {
						key = uniqueId();
						this.keys[index] = key;
					}

					return { index, key };
			  })
			: [];
	}

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

		const offFormChangeMeta = this.form.on("change:meta", () => {
			const nextErrors = this.form.meta.errors.filter((error) =>
				error.field.startsWith(this.name)
			);

			if (!isEqual(this.meta.errors, nextErrors)) {
				this.setMetaKey("errors", nextErrors);
			}
		});

		return () => {
			offChangeValue();
			offThisChangeMeta();
			offFormReInitialize();
			offFormReset();
			this.form.removeField(this);
			offFormChangeMeta();
		};
	};

	private copyFields(): FieldValue {
		if (Array.isArray(this.fields)) {
			return this.fields.slice(0) as any;
		}

		return this.fields;
	}

	// --------------------
	// Start Utils
	// --------------------
	push = (...items: ToArray<FieldValue>[number][]) => {
		const newFields = this.copyFields();
		if (Array.isArray(newFields)) {
			newFields.push(...items);
			this.keys.push(...items.map(() => uniqueId()));

			this.fields = newFields;

			this.trigger("push", newFields, ...items);
		}
	};

	pop = () => {
		const newFields = this.copyFields();

		if (Array.isArray(newFields)) {
			this.keys.pop();
			const item = newFields.pop();
			this.fields = newFields;

			this.trigger("pop", newFields, item);
		}
	};

	shift = () => {
		const newFields = this.copyFields();
		if (Array.isArray(newFields)) {
			const item = newFields.shift();
			this.keys.shift();

			this.fields = newFields as any;

			this.trigger("shift", newFields, item);
		}
	};

	unshift = (...items: ToArray<FieldValue>[number][]) => {
		const newFields = this.copyFields();
		if (Array.isArray(newFields)) {
			newFields.unshift(...items);
			this.keys.unshift(...items.map(() => uniqueId()));

			this.fields = newFields as any;

			this.trigger("unshift", newFields, ...items);
		}
	};

	insert = (index: number, ...items: ToArray<FieldValue>[number][]) => {
		const newFields = this.copyFields();
		if (Array.isArray(newFields)) {
			newFields.splice(index, 0, ...items);
			this.keys.splice(index, 0, ...items.map(() => uniqueId()));

			this.fields = newFields as any;

			this.trigger("insert", newFields, index, ...items);
		}
	};

	remove = (index: number) => {
		const newFields = this.copyFields();
		if (Array.isArray(newFields)) {
			const oldItem = newFields[index];
			newFields.splice(index, 1);
			this.keys.splice(index, 1);

			this.fields = newFields as any;

			this.trigger("remove", newFields, index, oldItem);
		}
	};

	swap = (firstIndex: number, secondIndex: number) => {
		const newFields = this.copyFields();
		if (Array.isArray(newFields)) {
			const temp = newFields[firstIndex];
			newFields[firstIndex] = newFields[secondIndex];
			newFields[secondIndex] = temp;

			const tempKey = this.keys[firstIndex];
			this.keys[firstIndex] = this.keys[secondIndex] as string;
			this.keys[secondIndex] = tempKey as string;

			this.fields = newFields as any;

			this.trigger("swap", newFields, firstIndex, secondIndex);
		}
	};

	replace = (index: number, item: ToArray<FieldValue>[number]) => {
		const newFields = this.copyFields();
		if (Array.isArray(newFields)) {
			const oldItem = newFields[index];
			newFields[index] = item;

			this.fields = newFields as any;

			this.trigger("replace", newFields, index, oldItem, item);
		}
	};

	move = (fromIndex: number, toIndex: number) => {
		const newFields = this.copyFields();
		if (Array.isArray(newFields)) {
			const temp = newFields[fromIndex];
			newFields.splice(fromIndex, 1);
			newFields.splice(toIndex, 0, temp);

			const tempKey = this.keys[fromIndex];
			this.keys.splice(fromIndex, 1);
			this.keys.splice(toIndex, 0, tempKey as string);

			this.fields = newFields as any;

			this.trigger("move", newFields, fromIndex, toIndex);
		}
	};
	// --------------------
	// Start Utils
	// --------------------

	getItemErrors(index: number): ValidateError[] {
		return (
			this.meta.errors?.filter((error) => {
				return (
					error.field.startsWith(`${this.name}[${index}]`) ||
					error.field.startsWith(`${this.name}.${index}`)
				);
			}) ?? []
		);
	}

	getItemValue(index: number) {
		return Array.isArray(this.fields) ? this.fields[index] : undefined;
	}

	getItemFieldInstances(index: number) {
		return this.form.filterFields((field) => {
			return (
				(field.name as string).startsWith(`${this.name}[${index}]`) ||
				(field.name as string).startsWith(`${this.name}.${index}`)
			);
		});
	}
}
