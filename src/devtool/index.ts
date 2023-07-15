import setupDevtool from "@/devtool/setupDevtool";
import type { Plugin } from "vue";

const EzFormDevtool: Plugin = {
	install(app) {
		if (process.env.NODE_ENV === "development" || __VUE_PROD_DEVTOOLS__) {
			setupDevtool(app);
		}
	},
};

export { EzFormDevtool, setupDevtool };
