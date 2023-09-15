import path from "path";
import solidPlugin from "vite-plugin-solid";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [solidPlugin()],
	resolve: {
		alias: [{ find: "src", replacement: path.resolve(__dirname, "src") }],
		conditions: ["development", "browser"],
	},
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: ["./__tests__/setup.ts"],
		transformMode: { web: [/\.[jt]sx?$/] },
		deps: {
			registerNodeLoader: true,
			inline: [/solid-js/, /@solidjs\/testing-library/],
		},
	},
});
