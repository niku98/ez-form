import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts"],
	format: ["cjs", "esm"],
	splitting: true,
	sourcemap: false,
	clean: true,
	treeshake: true,
	dts: true,
	skipNodeModulesBundle: true,
	minify: false,
	external: [
		"react",
		"react-dom",
		"@niku/ez-form-core",
		"use-sync-external-store",
	],
	injectStyle: false,
	keepNames: true,
});
