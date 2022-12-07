import { ColProps } from "ant-design-vue";
import { FormLabelAlign } from "ant-design-vue/lib/form/interface";
import { inject } from "vue";

export const $injectFormStyleKey = Symbol("injectFormStyleKey");

export interface InjectFormStyle {
	labelCol?: ColProps;
	labelAlign?: FormLabelAlign;
	wrapperCol?: ColProps;
}

export function useInjectAntFormStyle() {
	const injected = inject<InjectFormStyle>($injectFormStyleKey);

	if (!injected) {
		throw new Error("useInjectFormStyle must be used in Form");
	}

	return injected;
}
