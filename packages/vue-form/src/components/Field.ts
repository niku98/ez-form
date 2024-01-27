/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
	FieldInstance,
	FormInstance,
	type FieldMeta,
	type FieldOptions,
	type GetKeys,
} from "@niku/ez-form-core";
import { useField } from "src/index";
import { useInjectForm } from "src/provides/form";
import { fieldProps, type FieldNameProps } from "src/utilities/field";
import { defineComponent, getCurrentInstance } from "vue";

export type FieldProps<
	FormValues,
	ParentValue = FormValues,
	N extends GetKeys<ParentValue> = GetKeys<ParentValue>
> = FieldNameProps<ParentValue, N> &
	Omit<FieldOptions<any, FormValues>, "name">;

const FieldImpl = defineComponent({
	name: "EzField",
	props: fieldProps(),
	setup(props, ctx) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		const field = useField(props as any);
		const form = useInjectForm();
		const value = field.useFieldValue();
		const meta = field.useFieldMeta();

		const componentInstance = getCurrentInstance();
		if (componentInstance) {
			field.uid = componentInstance.uid.toString();
		}

		return () =>
			ctx.slots.default?.({
				field,
				form,
				value: value.value,
				meta: meta.value,
			});
	},
});

const EzField = FieldImpl as unknown as FieldComponent<any>;

export default EzField;

type BaseFieldType = typeof FieldImpl;
export type FieldComponent<
	FormValues,
	ParentValue = FormValues,
	N extends GetKeys<ParentValue> = GetKeys<ParentValue>
> = Omit<BaseFieldType, "$props"> & {
	new (): {
		$props: FieldProps<FormValues, ParentValue, N>;
		$slots: {
			default: (helpers: {
				form: FormInstance<FormValues>;
				field: FieldInstance<any, FormValues>;
				value: any;
				meta: FieldMeta;
			}) => any;
		};
	};
};
