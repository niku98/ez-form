import { defineConfig } from "tsup";
import * as preset from "tsup-preset-solid";

const preset_options: preset.PresetOptions = {
	entries: [
		{
			entry: "src/index.ts",
		},
	],
	// Set to `true` to remove all `console.*` calls and `debugger` statements in prod builds
	drop_console: false,
	// Set to `true` to generate a CommonJS build alongside ESM
	cjs: true,
};

export default defineConfig(async (config) => {
	const watching = !!config.watch;

	const parsed_data = preset.parsePresetOptions(preset_options, watching);

	if (!watching) {
		const package_fields = preset.generatePackageExports(parsed_data);

		console.log(
			`\npackage.json: \n${JSON.stringify(package_fields, null, 2)}\n\n`
		);

		/*
            will update ./package.json with the correct export fields
        */
		await preset.writePackageJson(package_fields);
	}

	return {
		...preset.generateTsupOptions(parsed_data)[0],
		format: ["cjs", "esm"],
		splitting: true,
		sourcemap: false,
		clean: true,
		treeshake: true,
		dts: true,
		skipNodeModulesBundle: true,
		minify: false,
		external: ["solid-js", "@niku/ez-form-core"],
		injectStyle: false,
		keepNames: true,
	};
});
