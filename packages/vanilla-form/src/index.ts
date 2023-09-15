/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
	FieldArrayInstance,
	FieldBaseInstance,
	FieldInstance,
	FormInstance,
	type FieldOptions,
	type FormOptions,
	type GetKeys,
	type GetType,
} from "@niku/ez-form-core";
export type * from "@niku/ez-form-core";

export {
	GlobalInstances,
	asyncFieldSchema,
	asyncSchema,
	getFieldArrayInstance,
	getFieldInstance,
	getFormInstance,
	yupFieldSchema,
	yupSchema,
	zodFieldSchema,
	zodSchema,
} from "@niku/ez-form-core";

export type FieldNameProps<
	ParentValue,
	N = GetKeys<ParentValue>
> = ParentValue extends any[]
	? { index: number; name?: N; namePrefix?: string }
	: { index?: number; name: N; namePrefix?: string };

declare module "@niku/ez-form-core" {
	interface FormOptions<Values> {
		el: string | HTMLFormElement;
	}

	interface FormInstance<Values> {
		el: HTMLFormElement;
		unmount: () => void;

		createField: CreateField<Values>;
		createFieldArray: CreateFieldArray<Values>;
	}

	interface FieldBaseInstance<FieldValue, FormValues> {
		unmount: () => void;
		createField: CreateField<FormValues, FieldValue>;
		createFieldArray: CreateFieldArray<FormValues, FieldValue>;
	}
}

export function createForm<Values>(
	options: FormOptions<Values>
): FormInstance<Values> {
	const form = new FormInstance(options);
	form.unmount = form.mount();

	form.createField = (options) => createField(form, options) as any;
	form.createFieldArray = (options) => createFieldArray(form, options) as any;

	const formEl: HTMLFormElement | null =
		typeof options.el === "string"
			? document.querySelector(options.el)
			: options.el;

	if (!formEl) {
		throw new Error(`Form [${options.el.toString()}] cannot be found`);
	}

	form.el = formEl;

	formEl.addEventListener("submit", (e) => {
		if (e.defaultPrevented) {
			return;
		}

		e.preventDefault();
		form.submit();
	});

	return form;
}

// ---------------------------
// Field
// ---------------------------

type CreateFieldOptions<
	FormValues,
	ParentValue = FormValues,
	N extends GetKeys<ParentValue> = GetKeys<ParentValue>,
	FieldValue = GetType<ParentValue, N>
> = FieldNameProps<ParentValue, N> &
	Omit<FieldOptions<FieldValue, FormValues>, "name"> & {
		inputEl?:
			| string
			| HTMLInputElement
			| HTMLTextAreaElement
			| HTMLSelectElement;
		valuePropName?: string;
		blurEventName?: string;
		changeEventName?: string;
		valuePropInEvent?: string;
		handleInput?: (
			field: FieldInstance<GetType<ParentValue, N>, FormValues>
		) => void;
	};

export type CreateField<FormValues, ParentValue = FormValues> = <
	N extends GetKeys<ParentValue> = GetKeys<ParentValue>,
	FieldValue = GetType<ParentValue, N>
>(
	options: CreateFieldOptions<FormValues, ParentValue, N>
) => FieldInstance<FieldValue, FormValues>;

function createField<
	FormValues = unknown,
	ParentValue = FormValues,
	N extends GetKeys<ParentValue> = GetKeys<ParentValue>
>(
	form: FormInstance<FormValues>,
	options: CreateFieldOptions<FormValues, ParentValue, N>
) {
	const fieldName = (
		typeof options.index === "number"
			? [options.namePrefix, options.index, options.name]
			: [options.namePrefix, options.name]
	)
		.filter((d) => d !== undefined)
		.join(".");

	const field = new FieldInstance(form, {
		...options,
		name: fieldName as any,
	});
	field.unmount = field.mount();

	field.createField = (props) =>
		createField(form, {
			...props,
			namePrefix: field.name,
		}) as any;

	field.createFieldArray = (props) =>
		createFieldArray(form, {
			...props,
			namePrefix: field.name,
		}) as any;

	if (options.handleInput) {
		options.handleInput(field);
	} else {
		const formContainerEl = form.el ? form.el : document;

		const getInputEl = (): HTMLElement | null => {
			if (typeof options.inputEl === "string") {
				return formContainerEl.querySelector(options.inputEl);
			}

			return (
				options.inputEl ??
				formContainerEl.querySelector(`[name="${fieldName}"]`)
			);
		};

		const inputEl = getInputEl();

		if (!inputEl) {
			throw new Error(
				`Field [${(options.inputEl ?? fieldName).toString()}] cannot be found`
			);
		}

		const {
			valuePropName = "value",
			blurEventName = "blur",
			changeEventName = "change",
		} = options;

		const getInputValue = () => {
			const raw = field.getValue();
			if (
				["input", "textarea", "select"].includes(inputEl.tagName.toLowerCase())
			) {
				return raw ?? "";
			}

			return raw;
		};

		(inputEl as any)[valuePropName] = getInputValue() as never;

		inputEl.addEventListener(blurEventName, (e) => {
			field.handleBlur(e);
		});

		inputEl.addEventListener(changeEventName, (e) => {
			field.handleChange(e);
		});

		field.on("change:value", () => {
			(inputEl as any)[valuePropName] = getInputValue() as never;
		});
	}

	return field;
}

// ---------------------------
// Field Array
// ---------------------------

type CreateFieldArrayOptions<
	FormValues,
	ParentValue = FormValues,
	N extends GetKeys<ParentValue> = GetKeys<ParentValue>,
	FieldValue = GetType<ParentValue, N>
> = FieldNameProps<ParentValue, N> &
	Omit<FieldOptions<FieldValue, FormValues>, "name"> & {
		/**
		 * Container element
		 */
		el: string | HTMLElement;
		itemTemplate: (
			index: number,
			fieldArray: FieldArrayInstance<FieldValue, FormValues>
		) => HTMLElement;
		/**
		 * CSS Selector to query all field's items. Will be passed to querySelectorAll.
		 */
		itemsSelector: string;
		itemFieldsCreator: (
			index: number,
			fieldArray: FieldArrayInstance<FieldValue, FormValues>
		) => FieldBaseInstance<any, any>[];
	};

export type CreateFieldArray<FormValues, ParentValue = FormValues> = <
	N extends GetKeys<ParentValue> = GetKeys<ParentValue>,
	FieldValue = GetType<ParentValue, N>
>(
	options: CreateFieldArrayOptions<FormValues, ParentValue, N>
) => FieldArrayInstance<FieldValue, FormValues>;

function createFieldArray<
	FormValues = unknown,
	ParentValue = FormValues,
	N extends GetKeys<ParentValue> = GetKeys<ParentValue>
>(
	form: FormInstance<FormValues>,
	options: CreateFieldArrayOptions<FormValues, ParentValue, N>
): FieldArrayInstance<GetType<ParentValue, N>, FormValues> {
	const fieldName = (
		typeof options.index === "number"
			? [options.namePrefix, options.index, options.name]
			: [options.namePrefix, options.name]
	)
		.filter((d) => d !== undefined)
		.join(".");

	const field = new FieldArrayInstance(form, {
		...options,
		name: fieldName as any,
	});
	field.unmount = field.mount();

	field.createField = (props) =>
		createField(form, {
			...props,
			namePrefix: field.name,
		}) as any;

	field.createFieldArray = (props) =>
		createFieldArray(form, {
			...props,
			namePrefix: field.name,
		}) as any;

	const initialValue = field.value;

	// Initial templates
	const containerEl =
		typeof options.el === "string"
			? form.el.querySelector(options.el)
			: options.el;

	if (!containerEl) {
		throw new Error(`Field [${options.el.toString()}] cannot be found`);
	}

	containerEl.append(
		...(Array.isArray(initialValue)
			? initialValue.map((_, index) => {
					return options.itemTemplate(index, field);
			  })
			: [])
	);

	// Initial fields
	const itemsFields: FieldBaseInstance<any, any>[][] = Array.isArray(
		initialValue
	)
		? initialValue.map((_, index) => {
				return options.itemFieldsCreator(index, field);
		  })
		: [];

	field.on("change:value", () => {
		const items = Array.isArray(field.value) ? field.value : [];
		const itemsEl = form.el.querySelectorAll(options.itemsSelector);

		if (itemsFields.length > items.length) {
			for (let index = items.length; index < itemsFields.length; index++) {
				const el = itemsEl.item(index);
				el.remove();

				const fields = itemsFields[index];
				fields?.forEach((f) => f.unmount());
			}
			itemsFields.splice(items.length);
		} else if (itemsFields.length < items.length) {
			const tempArr = Array(items.length - itemsFields.length).fill(0);
			containerEl.append(
				...tempArr.map((_, index) => {
					return options.itemTemplate(itemsFields.length + index, field);
				})
			);
			itemsFields.push(
				...tempArr.map((_, index) => {
					return options.itemFieldsCreator(itemsFields.length + index, field);
				})
			);
		}
	});

	return field;
}
