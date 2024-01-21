import setupDevtool from "src/setupDevTool";
import type { Plugin } from "vue";

declare global {
	const __VUE_PROD_DEVTOOLS__: any;
}

const EzFormDevtool: Plugin = {
	install(app) {
		if (process.env.NODE_ENV === "development" || __VUE_PROD_DEVTOOLS__) {
			setupDevtool(app);
		}
	},
};

export { EzFormDevtool, setupDevtool };
