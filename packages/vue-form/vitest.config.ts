import vue from "@vitejs/plugin-vue";
import path from "path";
import { defineConfig } from "vitest/config";
export default defineConfig({
	plugins: [vue()],
	resolve: {
		alias: [{ find: "src", replacement: path.resolve(__dirname, "src") }],
	},
	define: {
		"process.env.VTL_SKIP_AUTO_CLEANUP": true,
	},
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: ["./__tests__/setup.ts"],
		deps: {
			registerNodeLoader: true,
			inline: [/vue/, /@vue\/test-utils/],
		},
	},
});
