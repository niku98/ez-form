import { defineConfig } from "vitepress";

export default defineConfig({
	base: "/ez-form/",
	title: "Ez Form - Modern Vue form",
	head: [["link", { rel: "icon", href: "/favicon.ico" }]],
	themeConfig: {
		siteTitle: "Ez Form",
		logo: "/logo.png",
		nav: [
			{ text: "Guide", link: "/guide/why-ez-form", activeMatch: "/guide/" },
			{
				text: "Api Reference",
				link: "/api-reference/components/form",
				activeMatch: "/api-reference/",
			},
		],
		socialLinks: [
			{ icon: "github", link: "https://github.com/niku98/ez-form" },
		],
		outline: [2, 6],

		sidebar: {
			"/guide/": [
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

			"/api-reference/": [
				{
					text: "Components",
					items: [
						{ text: "Form", link: "/api-reference/components/form" },
						{ text: "FormItem", link: "/api-reference/components/form-item" },
						{ text: "FormList", link: "/api-reference/components/form-list" },
					],
				},
				{
					text: "Typescript",
					items: [
						{ text: "Form", link: "/api-reference/types/form" },
						{ text: "Form Item", link: "/api-reference/types/form-item" },
						{ text: "Form List", link: "/api-reference/types/form-list" },
						{ text: "Validation", link: "/api-reference/types/validation" },
					],
				},
			],
		},
	},
});
