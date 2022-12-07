/// <reference types="vite/client" />

declare module "*.vue" {
	import { DefineComponent } from "vue";
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
	const component: DefineComponent<{}, {}, any>;
	export default component;
}

declare var EZ_FORM_DEVTOOL: boolean;
declare const __VUE_PROD_DEVTOOLS__: any;
