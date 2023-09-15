import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
	resolve: {
		alias: [{ find: "src", replacement: path.resolve(__dirname, "src") }],
	},
	test: {
		globals: true,
		setupFiles: "./__tests__/setup.ts",
		environment: "jsdom",
	},
});
