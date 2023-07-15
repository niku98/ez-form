import { useEzFormPluginOptions, useInjectForm } from "@/composables";
import { computed, defineComponent, h } from "vue";

const EzFormItemViewImpl = /*#__PURE__*/ defineComponent({
	name: "EzFormItemView",
	props: {
		label: {
			type: String,
			required: false,
		},
		idFor: {
			type: String,
			required: false,
		},
		requiredMark: {
			type: String,
			required: false,
		},
		noStyle: {
			type: Boolean,
			required: false,
		},
		colon: {
			type: Boolean,
			required: false,
		},
		hasError: {
			type: Boolean,
			required: false,
		},
	},
	setup: (props, ctx) => {
		const form = useInjectForm();
		const pluginOptions = useEzFormPluginOptions();

		const classNames = computed(() => {
			return {
				main: `${form.classPrefix}-form-item`,
				get label() {
					return `${this.main}-label`;
				},
				get input() {
					return `${this.main}-input`;
				},
				get errors() {
					return `${this.main}-errors`;
				},
				get extra() {
					return `${this.main}-extra`;
				},
			};
		});

		const fieldStyle = computed(() => {
			const requiredMarkCssVar = `--${form.classPrefix}-form-required-mark`;
			const colonCssVar = `--${form.classPrefix}-form-colon`;
			return {
				[requiredMarkCssVar]: props.requiredMark,
				[colonCssVar]: `"${props.colon ?? pluginOptions?.colon ? ":" : ""}"`,
			};
		});

		return () =>
			h(
				"fieldset",
				{
					class: [
						classNames.value.main,
						{
							"has-errors": props.hasError,
							"no-style": !!props.noStyle,
							required: !!props.requiredMark,
						},
					],
					style: fieldStyle,
				},
				[
					props.label
						? h(
								"label",
								{
									for: props.idFor,
									class: classNames.value.label,
								},
								props.label
						  )
						: undefined,
					h(
						"div",
						{
							class: classNames.value.input,
						},
						{
							default: () => ctx.slots.default?.(),
						}
					),
					ctx.slots.errors && !props.noStyle && props.hasError
						? h(
								"div",
								{
									class: classNames.value.errors,
								},
								{
									default: () => ctx.slots.errors?.(),
								}
						  )
						: undefined,
					ctx.slots.extra && !props.noStyle
						? h(
								"div",
								{
									class: classNames.value.extra,
								},
								{
									default: () => ctx.slots.extra?.(),
								}
						  )
						: undefined,
				]
			);
	},
});

const EzFormItemView = EzFormItemViewImpl as typeof EzFormItemViewImpl & {
	new (): {
		$slots: {
			default: () => any;
			errors: () => any;
			extra: () => any;
		};
	};
};
export default EzFormItemView;
