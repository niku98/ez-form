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
			skipDiagnostics: true,
			logDiagnostics: true,
			insertTypesEntry: true,
			staticImport: true,
			include: ["src/**/*"],
			beforeWriteFile(filePath, content) {
				if (filePath.includes("EzForm.vue")) {
					content =
						"import { Rules, ValidateMessages, FormInstance, ValidateError } from '../models';\n" +
						content;

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
					content =
						"import { NamePath, FormItemValueTransformer, Rule, ValidateTrigger } from '../models';\n" +
						content;

					content = content.replace(
						/validateTrigger: {(.*?)type: PropType<any>;(.*?)}/gs,
						"validateTrigger: {$1type: PropType<ValidateTrigger | ValidateTrigger[]>;$2}"
					);
					content = content.replace(
						"validateTrigger: any",
						"validateTrigger: ValidateTrigger | ValidateTrigger[]"
					);
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
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
});
