import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts", "src/types.ts"],
	format: ["cjs", "esm"],
	splitting: true,
	sourcemap: false,
	clean: true,
	treeshake: true,
	dts: true,

	skipNodeModulesBundle: true,
	minify: false,
	external: ["vue", "@niku/ez-form-core"],
	injectStyle: false,
	keepNames: true,
});
