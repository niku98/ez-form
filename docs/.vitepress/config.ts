import { defineConfig } from "vitepress";

export default defineConfig({
	title: "Ez Form - Modern Vue form",
	head: [
		[
			"link",
			{
				rel: "icon",
				href: "/logo.png",
			},
		],
	],
	themeConfig: {
		siteTitle: "Ez Form",
		logo: "/logo.png",
		nav: [
			{ text: "Guide", link: "/guide/why-ez-form", activeMatch: "/guide/" },
		],
		outline: [2, 6],
		sidebar: [
			{
				text: "Introduction",
				items: [
					{ text: "Why Ez Form?", link: "/guide/why-ez-form" },
					{ text: "Setup", link: "/guide/setup" },
				],
			},
		],
	},
});
