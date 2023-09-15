/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { FieldArrayItemInfo } from "@niku/ez-form-core";
import {
	FieldArrayInstance,
	FormInstance,
	type FieldOptions,
	type GetKeys,
} from "@niku/ez-form-core";
import useFieldArray from "src/composables/useFieldArray";
import { useInjectForm } from "src/provides/form";
import { fieldProps, type FieldNameProps } from "src/utilities/field";
import { defineComponent } from "vue";

export type FieldArrayProps<
	FormValues,
	ParentValue = FormValues,
	N extends GetKeys<ParentValue> = GetKeys<ParentValue>
> = FieldNameProps<ParentValue, N> &
	Omit<
		FieldOptions<any, FormValues>,
		"name" | "valuePropName" | "onChangePropName" | "onBlurPropName"
	>;

const FieldArrayImpl = defineComponent({
	name: "EzField",
	props: fieldProps(),
	setup(props, ctx) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		const field = useFieldArray(props as any);
		const form = useInjectForm();

		return () =>
			ctx.slots.default?.({ field, form, fieldsInfo: field.getFieldsInfo() });
	},
});

const EzFieldArray = FieldArrayImpl as unknown as FieldArrayComponent<any>;

export default EzFieldArray;

type BaseFieldArrayType = typeof FieldArrayImpl;

export type FieldArrayComponent<
	FormValues,
	ParentValue = FormValues,
	N extends GetKeys<ParentValue> = GetKeys<ParentValue>
> = Omit<BaseFieldArrayType, "$props"> & {
	new (): {
		$props: FieldArrayProps<FormValues, ParentValue, N>;
		$slots: {
			default: (helpers: {
				form: FormInstance<FormValues>;
				fieldArray: FieldArrayInstance<any, FormValues>;
				fieldsInfo: FieldArrayItemInfo[];
			}) => any;
		};
	};
};
