import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "url";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		dts({
			exclude: ["example/**", "node_modules/**", "**/env.d.ts"],
			beforeWriteFile(filePath, content) {
				if (filePath.includes("EzForm.vue")) {
					// content = content.replace(" } from 'vue'", ", PropType } from 'vue'");
					content = content.replace(
						" } from '../models'",
						", FormInstance, Rules, ValidateTrigger, ValidateMessages } from '../models'"
					);

					content = content.replace(
						`{} | {
    [x: string]: any;
}>;`,
						`{
	form: FormInstance,
	initialValues: Record<string, any>,
	enableReinitialize: boolean,
	clearOnReset: boolean,
	rules: Rules,
	validateTrigger: ValidateTrigger | ValidateTrigger[],
	validateMessages: ValidateMessages,
	classPrefix: string
}>;`
					);

					content = content.replace(
						"onSubmit?: (...args: any[]) => any;",
						"onSubmit?: (values: any) => any;"
					);
					content = content.replace(
						"onChange?: (...args: any[]) => any;",
						"onChange?: (values: any) => any;"
					);
					content = content.replace(
						"onReset?: (...args: any[]) => any;",
						"onReset?: () => any;"
					);
					content = content.replace(
						"onError?: (...args: any[]) => any;",
						"onError?: (errors: ValidateError[]) => any;"
					);
				}

				if (
					filePath.includes("EzFormItem.vue") ||
					filePath.includes("EzFormList.vue")
				) {
					// content = content.replace(" } from 'vue'", ", PropType } from 'vue'");
					content =
						"import { NamePath, FormInstance, Rule, ValidateTrigger, FormItemValueTransformer } from '../models';\n" +
						content;

					content = content.replace(
						`{} | {
    [x: string]: any;
}>;`,
						`{
	label: string,
	name: NamePath,
	defaultValue: ${filePath.includes("EzFormList.vue") ? "any[]" : "any"},
	valuePropName: string,
	changeEventPropName: string,
	blurEventPropName: string,
	getValueFromChangeEvent: (event: any) => any,
	valueTransformer: FormItemValueTransformer,
	autoBinding: boolean,
	inputNodeIndex: number,
	rules: Rule,
	requiredMark: string | boolean,
	validateTrigger: ValidateTrigger | ValidateTrigger[],
	validateFirst: boolean,
	noStyle: boolean,
	colon: boolean
}>;`
					);
				}

				if (filePath.includes("form.d.ts")) {
					content =
						"import { FormInstance, FormItemValueTransformer, NamePath, Rule, Rules, ValidateMessages, ValidateTrigger } from '../models';\n" +
						content;

					content = content.replace(
						/validateTrigger: {(.*?)type: PropType<any>(.*?)}/gs,
						"validateTrigger: {$1type: PropType<ValidateTrigger | ValidateTrigger[]>$2}"
					);
					// content = content.replace(/default: \(\) => {(.*?)};/gs, "");
					// content = content.replace(/default: (.*?);/gs, "");
				}

				if (filePath.includes("useInjectForm.d.ts")) {
					content = "import { FormInstance } from '../models';\n" + content;
				}

				if (filePath.includes("usePluginOptions.d.ts")) {
					content = "import { PluginOptions } from '../models';\n" + content;
				}

				return {
					filePath,
					content,
				};
			},
		}),
	],
	build: {
		reportCompressedSize: true,
		lib: {
			entry: "src/index.ts",
			name: "EzForm",
			fileName(format) {
				return `index.${format}.js`;
			},
			formats: ["es", "cjs"],
		},
		rollupOptions: {
			// make sure to externalize deps that shouldn't be bundled
			// into your library
			external: ["vue", "async-validator"],
			output: {
				// Provide global variables to use in the UMD build
				// for externalized deps
				globals: {
					vue: "Vue",
				},
				exports: "named",
			},
		},
	},
	resolve: {
		preserveSymlinks: true,
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
});
