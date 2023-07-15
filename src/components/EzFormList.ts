import EzFormItemView from "@/components/EzFormItemView";
import { useFormListComponentLogics } from "@/composables";
import {
	FormInstance,
	FormListInstance,
	FormListSlotProps,
	ValidateError,
} from "@/models";
import { getFormListDefinePropsObject } from "@/utilities";
import { computed, defineComponent, h } from "vue";

const EzFormListImpl = /*#__PURE__*/ defineComponent({
	name: "EzFormList",
	props: getFormListDefinePropsObject(),
	setup: (props, ctx) => {
		const { formListInstance, formInstance } = useFormListComponentLogics(
			props,
			ctx.emit
		);

		const {
			meta,
			requiredMarkString,
			listValues,
			fields,
			getErrors,
			getNamePath,
			hasError,
			add,
			pop,
			insert,
			unshift,
			shift,
			remove,
			removeByKey,
			swap,
			replace,
			move,
		} = formListInstance;

		const className = computed(() => `${formInstance.classPrefix}-form-list`);
		ctx.expose(formListInstance);

		return () =>
			h(
				EzFormItemView,
				{
					class: className.value,
					label: props.label,
					idFor: meta.id,
					requiredMark: requiredMarkString.value,
					noStyle: props.noStyle,
					hasError: !!meta.error,
				},
				{
					default: () =>
						ctx.slots.default?.({
							value: listValues.value,
							length: listValues.value.length,
							fields: fields.value,
							getNamePath: getNamePath,
							getErrors: getErrors,
							hasError: hasError,
							add: add,
							insert: insert,
							unshift: unshift,
							shift: shift,
							pop: pop,
							remove: remove,
							removeByKey: removeByKey,
							swap: swap,
							replace: replace,
							move: move,
							form: formInstance,
						}),
					errors: ctx.slots.errors?.({
						error: meta.error,
						form: formInstance,
						formList: formListInstance,
					}),
					extra: ctx.slots.extra?.({
						form: formInstance,
						formList: formListInstance,
					}),
				}
			);
	},
});

const EzFormList = EzFormListImpl as typeof EzFormListImpl & {
	new (): {
		$slots: {
			default: (props: FormListSlotProps) => void;
			errors: (props: {
				error: ValidateError;
				form: FormInstance;
				formList: FormListInstance;
			}) => void;
			extra: (props: {
				form: FormInstance;
				formList: FormListInstance;
			}) => void;
		};
	};
};
export default EzFormList;
