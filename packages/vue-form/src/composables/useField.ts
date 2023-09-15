/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
	FieldInstance,
	type FieldMeta,
	type FieldOptions,
	type GetKeys,
	type GetType,
} from "@niku/ez-form-core";
import EzField, { type FieldComponent } from "src/components/Field";
import EzFieldArray, {
	type FieldArrayComponent,
} from "src/components/FieldArray";
import type { UseFieldArray } from "src/composables/useFieldArray";
import useFieldArray from "src/composables/useFieldArray";
import {
	useFieldData,
	useFieldMeta,
	useFieldValue,
	type UseFieldDataValues,
} from "src/composables/useValue";
import { provideField } from "src/provides/field";
import { useInjectForm } from "src/provides/form";
import type { FieldNameProps } from "src/utilities/field";
import {
	computed,
	h,
	isReactive,
	onBeforeUnmount,
	watch,
	type Ref,
	type Slots,
	type VNode,
} from "vue";

declare module "@niku/ez-form-core" {
	interface FieldInstance<FieldValue, FormValues> {
		useField: UseField<FormValues, FieldValue>;
		useFieldArray: UseFieldArray<FormValues, FieldValue>;

		getInputProps(node: VNode): Record<string, any>;
		useFieldValue: <T = FieldValue>(
			selector?: (values: FieldValue) => T
		) => Ref<T>;
		useFieldMeta: <T = FieldMeta>(selector?: (meta: FieldMeta) => T) => Ref<T>;
		useFieldData: <T = UseFieldDataValues<FieldValue>>(
			selector?: (values: UseFieldDataValues<FieldValue>) => T
		) => Ref<T>;

		Field: FieldComponent<FormValues, FieldValue>;
		FieldArray: FieldArrayComponent<FormValues, FieldValue>;
	}

	interface FieldOptions<FieldValue, FormValues> {
		valuePropName?: string;
		onChangePropName?: string;
		onBlurPropName?: string;
		namePrefix?: string;
	}
}

export type UseFieldProps<
	FormValues,
	ParentValue = FormValues,
	N extends GetKeys<ParentValue> = GetKeys<ParentValue>,
	FieldValue = GetType<ParentValue, N>
> = FieldNameProps<ParentValue, N> &
	Omit<FieldOptions<FieldValue, FormValues>, "name">;

export default function useField<
	FormValues = unknown,
	ParentValue = FormValues,
	N extends GetKeys<ParentValue> = GetKeys<ParentValue>
>(options: UseFieldProps<FormValues, ParentValue, N>) {
	const form = useInjectForm<FormValues>();

	const name = computed(() => {
		return (
			typeof options.index === "number"
				? [options.namePrefix, options.index, options.name]
				: [options.namePrefix, options.name]
		)
			.filter((d) => d !== undefined)
			.join(".");
	});

	const field = new FieldInstance(form, {
		...options,
		name: name.value as any,
	});

	field.useFieldValue = function useFieldValueImpl(selector) {
		return useFieldValue(field, selector);
	};

	field.useFieldMeta = function useFieldMetaImpl(selector) {
		return useFieldMeta(field, selector);
	};

	field.useFieldData = function useFieldDataImpl(selector) {
		return useFieldData(field, selector);
	};

	field.getInputProps = (node) => {
		if (
			!node.component &&
			["input", "textarea", "select"].includes(String(node.type).toLowerCase())
		) {
			return {
				value: field.getValue(),
				onChange: (e: any) => field.handleChange(e),
				onInput: (e: any) => field.handleChange(e),
				onBlur: (e: Event) => field.handleBlur(e),
			};
		}

		const { valuePropName = "value", onBlurPropName = "onBlur" } =
			field.options;
		let { onChangePropName } = field.options;

		if (!onChangePropName) {
			onChangePropName = `onUpdate:${valuePropName}`;
		}

		return {
			[valuePropName]: field.getValue(),
			[onChangePropName]: (e: any) => {
				return field.handleChange(e);
			},
			[onBlurPropName]: (e: Event) => {
				return field.handleBlur(e);
			},
		};
	};

	field.useField = ((props: any) => {
		return useField({
			...props,
			namePrefix: field.name,
		});
	}) as any;

	field.useFieldArray = ((props: any) => {
		return useFieldArray({
			...props,
			namePrefix: field.name,
		});
	}) as any;

	field.Field = ((props: any, { slots }: { slots: Slots }) => {
		return h(
			EzField as any,
			{
				namePrefix: field.name,
				...props,
			},
			slots
		);
	}) as any;
	field.FieldArray = ((props: any, { slots }: { slots: Slots }) => {
		return h(EzFieldArray as any, { namePrefix: field.name, ...props }, slots);
	}) as any;

	watch(isReactive(options) ? options : () => options, () => {
		field.updateOptions({
			...options,
			name: name.value as any,
		});
	});

	const unmount = field.mount();

	onBeforeUnmount(() => {
		unmount();
	});

	provideField(field);

	return field;
}

export type UseField<FormValues, ParentValue = FormValues> = <
	N extends GetKeys<ParentValue> = GetKeys<ParentValue>,
	FieldValue = GetType<ParentValue, N>
>(
	options: UseFieldProps<FormValues, ParentValue, N>
) => FieldInstance<FieldValue, FormValues>;
