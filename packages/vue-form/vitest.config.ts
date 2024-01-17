import vue from "@vitejs/plugin-vue";
import path from "path";
import { defineConfig } from "vitest/config";
export default defineConfig({
	plugins: [vue()],
	resolve: {
		alias: [
			{ find: "src", replacement: path.resolve(__dirname, "src") },
			{ find: "__tests__", replacement: path.resolve(__dirname, "__tests__") },
		],
	},
	define: {
		"process.env.VTL_SKIP_AUTO_CLEANUP": true,
	},
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: ["./__tests__/setup.ts"],
		deps: {
			inline: [/vue/, /@vue\/test-utils/],
		},
	},
});
