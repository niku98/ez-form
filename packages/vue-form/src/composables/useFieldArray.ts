/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
	FieldArrayInstance,
	type FieldArrayItemInfo,
	type FieldMeta,
	type FieldOptions,
	type GetKeys,
	type GetType,
} from "@niku/ez-form-core";
import EzField, { type FieldComponent } from "src/components/Field";
import EzFieldArray, {
	type FieldArrayComponent,
} from "src/components/FieldArray";
import type { UseField } from "src/composables/useField";
import useField from "src/composables/useField";
import {
	useFieldData,
	useFieldMeta,
	useFieldValue,
	useFieldsInfo,
	type UseFieldDataValues,
} from "src/composables/useValue";
import { provideFieldArray } from "src/provides/fieldArray";
import { useInjectForm } from "src/provides/form";
import type { FieldNameProps } from "src/utilities/field";
import { computed, h, onBeforeUnmount, watch, type Ref, type Slots } from "vue";

declare module "@niku/ez-form-core" {
	interface FieldArrayInstance<FieldValue, FormValues> {
		useField: UseField<FormValues, FieldValue>;
		useFieldArray: UseFieldArray<FormValues, FieldValue>;

		useFieldValue: <T = FieldValue>(
			selector?: (values: FieldValue) => T
		) => Ref<T>;
		useFieldMeta: <T = FieldMeta>(selector?: (meta: FieldMeta) => T) => Ref<T>;
		useFieldData: <T = UseFieldDataValues<FieldValue>>(
			selector?: (values: UseFieldDataValues<FieldValue>) => T
		) => Ref<T>;
		useFieldsInfo: () => Ref<FieldArrayItemInfo[]>;

		Field: FieldComponent<FormValues, FieldValue>;
		FieldArray: FieldArrayComponent<FormValues, FieldValue>;
	}
}

export type UseFieldArrayProps<
	FormValues,
	ParentValue = FormValues,
	N extends GetKeys<ParentValue> = GetKeys<ParentValue>,
	FieldValue = GetType<ParentValue, N>
> = FieldNameProps<ParentValue, N> &
	Omit<FieldOptions<FieldValue, FormValues>, "name">;

export default function useFieldArray<
	FormValues = unknown,
	ParentValue = FormValues,
	N extends GetKeys<ParentValue> = GetKeys<ParentValue>
>(options: UseFieldArrayProps<FormValues, ParentValue, N>) {
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

	const field = new FieldArrayInstance(form, {
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

	field.useFieldsInfo = function useFieldDataImpl() {
		return useFieldsInfo(field);
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

	watch(
		() => options,
		() => {
			field.updateOptions({
				...options,
				name: name.value as any,
			});
		}
	);

	const unmount = field.mount();

	onBeforeUnmount(() => {
		unmount();
	});

	provideFieldArray(field);

	return field;
}

export type UseFieldArray<FormValues, ParentValue = FormValues> = <
	N extends GetKeys<ParentValue> = GetKeys<ParentValue>,
	FieldValue = GetType<ParentValue, N>
>(
	options: UseFieldArrayProps<FormValues, ParentValue, N>
) => FieldArrayInstance<FieldValue, FormValues>;
