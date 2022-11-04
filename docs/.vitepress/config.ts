import { defineConfig } from "vitepress";

export default defineConfig({
	base: "/ez-form/",
	title: "Ez Form - Modern Vue form",
	themeConfig: {
		siteTitle: "Ez Form",
		logo: "/logo.png",
		nav: [
			{ text: "Guide", link: "/guide/why-ez-form", activeMatch: "/guide/" },
		],
		socialLinks: [
			{ icon: "github", link: "https://github.com/niku98/ez-form" },
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
			{
				text: "Basic",
				items: [
					{ text: "Handling Form", link: "/guide/handling-form" },
					{ text: "Nested data", link: "/guide/nested" },
					{ text: "Validation", link: "/guide/validation" },
					{ text: "Form List", link: "/guide/form-list" },
				],
			},
			{
				text: "Advanced",
				items: [
					{
						text: "Using useForm",
						link: "/guide/using-use-form",
					},
					{
						text: "Custom Inputs",
						link: "/guide/custom-inputs",
					},
				],
			},
		],
	},
});
