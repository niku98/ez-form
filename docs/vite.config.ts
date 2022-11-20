import { fileURLToPath } from "url";
import { defineConfig } from "vite";

export default defineConfig({
	resolve: {
		preserveSymlinks: true,
		alias: {
			"@": fileURLToPath(new URL("../src", import.meta.url)),
			examples: fileURLToPath(new URL("./examples", import.meta.url)),
		},
	},
	css: {
		preprocessorOptions: {
			less: {
				javascriptEnabled: true,
				modifyVars: {},
			},
		},
	},
});
