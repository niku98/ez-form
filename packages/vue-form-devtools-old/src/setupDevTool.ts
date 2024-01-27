import { FieldInstance, GlobalInstances } from "@niku/ez-form-core";
import {
	setupDevtoolsPlugin,
	type CustomInspectorNode,
	type DevtoolsPluginApi,
	type ExtractSettingsTypes,
	type PluginSettingsItem,
} from "@vue/devtools-api";
import {
	DevToolDataType,
	type DevToolNodeData,
	type DevtoolFormData,
	type DevtoolFormItemData,
	type DevtoolFormListData,
} from "src/models";
const INSPECTOR_ID = "ez-form-inspector";
let devtoolApi:
	| DevtoolsPluginApi<ExtractSettingsTypes<Record<string, PluginSettingsItem>>>
	| undefined;
let SELECTED_FORM: DevtoolFormData | undefined;
let SELECTED_ITEM: DevtoolFormItemData | undefined;
let SELECTED_LIST: DevtoolFormListData | undefined;
let SELECTED_LIST_ITEM_INDEX: number | undefined;
let componentInstances: any[] = [];
const formNodes: DevToolNodeData[] = [];

const sendInspectorState = () => {
	devtoolApi?.sendInspectorState(INSPECTOR_ID);
};

GlobalInstances.on("change", (instances) => {
	formNodes.forEach((node) => {
		(node.instance.off as CallableFunction)("change", sendInspectorState);
	});

	formNodes.splice(0, formNodes.length);

	const instancesArray = Object.values(instances);
	for (let index = 0; index < instancesArray.length; index++) {
		const item = instancesArray[index];
		if (!item) {
			continue;
		}

		formNodes.push({
			type: DevToolDataType.Form,
			instance: item.form,
			componentUid: item.form.uid,
			name: item.form.name,
		});

		item.form.on("change", sendInspectorState);

		const fields = Object.values(item.fields);
		formNodes.push(
			...fields.map<DevToolNodeData>((field) => {
				field.on("change", sendInspectorState);
				return {
					type:
						field instanceof FieldInstance
							? DevToolDataType.Item
							: DevToolDataType.List,
					instance: field as any,
					name: field.name,
					form: item.form.name,
					componentUid: field.uid,
				};
			})
		);
	}

	devtoolApi?.sendInspectorTree(INSPECTOR_ID);
});

declare global {
	interface Window {
		EZ_FORM_DEVTOOL: boolean;
	}
}

export default function setupDevtool(app: any) {
	window.EZ_FORM_DEVTOOL = true;

	setupDevtoolsPlugin(
		{
			id: "ez-form-plugin",
			label: "EzForm Plugin",
			packageName: "ez-form-plugin",
			homepage: "https://niku98.github.io/ez-form",
			app,
			settings: {},
		},
		(api) => {
			devtoolApi = api;
			api.addInspector({
				id: INSPECTOR_ID,
				label: "Ez Form",
				icon: "bolt",
				actions: [
					{
						icon: "clear_all",
						tooltip: "Clear Form Validate",
						action() {
							if (!SELECTED_FORM) {
								return alert("Please select a form first!");
							}

							SELECTED_FORM.instance.clearValidate();
						},
					},
					{
						icon: "done_all",
						tooltip: "Validate Form",
						async action() {
							if (!SELECTED_FORM) {
								return alert("Please select a form first!");
							}

							await SELECTED_FORM.instance.validate();
						},
					},
					{
						icon: "refresh",
						tooltip: "Reset Form",
						action() {
							if (!SELECTED_FORM) {
								return alert("Please select a form first!");
							}
							SELECTED_FORM.instance.reset();
						},
					},
					{
						icon: "check_circle",
						tooltip: "Submit Form",
						action() {
							if (!SELECTED_FORM) {
								return alert("Please select a form first!");
							}

							SELECTED_FORM.instance.submit();
						},
					},
				],
				nodeActions: [
					{
						icon: "clear_all",
						tooltip: "Clear Validate",
						action() {
							if (SELECTED_FORM) {
								SELECTED_FORM.instance.clearValidate();
								return;
							}

							if (SELECTED_ITEM) {
								SELECTED_ITEM.instance.clearValidate();
								return;
							}

							if (SELECTED_LIST && SELECTED_LIST_ITEM_INDEX !== undefined) {
								SELECTED_LIST.instance
									.getItemFieldInstances(SELECTED_LIST_ITEM_INDEX)
									.forEach((field) => field.clearValidate());
								return;
							}

							if (SELECTED_LIST) {
								SELECTED_LIST.instance.clearValidate();
								return;
							}

							alert("Please select a node first!");
						},
					},
					{
						icon: "done_all",
						tooltip: "Validate",
						async action() {
							if (SELECTED_FORM) {
								await SELECTED_FORM.instance.validate();
								return;
							}

							if (SELECTED_ITEM) {
								await SELECTED_ITEM.instance.validate();
								return;
							}

							if (SELECTED_LIST && SELECTED_LIST_ITEM_INDEX !== undefined) {
								SELECTED_LIST.instance
									.getItemFieldInstances(SELECTED_LIST_ITEM_INDEX)
									.forEach((field) => {
										field.validate().catch(() => {
											//
										});
									});
								return;
							}

							if (SELECTED_LIST) {
								await SELECTED_LIST.instance.validate();
								return;
							}

							alert("Please select a node first!");
						},
					},
					{
						icon: "refresh",
						tooltip: "Reset",
						action() {
							if (SELECTED_FORM) {
								SELECTED_FORM.instance.reset();
								return;
							}

							if (SELECTED_ITEM) {
								SELECTED_ITEM.instance.reset();
								return;
							}

							if (SELECTED_LIST && SELECTED_LIST_ITEM_INDEX !== undefined) {
								SELECTED_LIST.instance
									.getItemFieldInstances(SELECTED_LIST_ITEM_INDEX)
									.forEach((field) => field.reset());
								return;
							}

							if (SELECTED_LIST) {
								SELECTED_LIST.instance.reset();
								return;
							}

							alert("Please select a node first!");
						},
					},
				],
			});

			api.on.getInspectorTree(async (payload) => {
				if (payload.inspectorId === INSPECTOR_ID) {
					componentInstances = await api.getComponentInstances(app);
					payload.rootNodes = castFormNodesToInspectorNodes(
						formNodes.filter(({ name }) => {
							return name.includes(payload.filter);
						})
					);
				}
			});

			api.on.getInspectorState(async (payload) => {
				SELECTED_FORM = undefined;
				SELECTED_ITEM = undefined;
				SELECTED_LIST = undefined;
				SELECTED_LIST_ITEM_INDEX = undefined;
				api.unhighlightElement();

				const foundNode = formNodes.find((node) => {
					if (node.type === DevToolDataType.Form) {
						return node.name === payload.nodeId;
					}

					return (
						payload.nodeId === `${node.form}_${node.name}` ||
						payload.nodeId.startsWith(`${node.form}_${node.name}-item-`)
					);
				});

				if (!foundNode) {
					return;
				}

				// Highlight element
				const instance = componentInstances.find(
					(instance) => instance.uid.toString() === foundNode.componentUid
				);

				if (instance) {
					api.highlightElement(instance);
					const bound = await api.getComponentBounds(instance);

					window.scrollTo({
						top: bound.top + window.scrollY - 16,
						left: bound.left,
						behavior: "smooth",
					});
				}

				if (foundNode.type === DevToolDataType.Form) {
					SELECTED_FORM = foundNode;

					payload.state = {
						"Form Info": [
							{
								key: "Dirty",
								value: foundNode.instance.meta.dirty,
							},
							{
								key: "Values",
								value: foundNode.instance.getValues(),
							},
							{
								key: "Errors",
								value: foundNode.instance.meta.errors,
							},
						],
					};
					return;
				}

				if (
					payload.nodeId.startsWith(
						`${foundNode.form}_${foundNode.name}-item-`
					) &&
					foundNode.type === DevToolDataType.List
				) {
					const index = Number(
						payload.nodeId.replace(
							`${foundNode.form}_${foundNode.name}-item-`,
							""
						)
					);

					if (Number.isNaN(index)) {
						return;
					}

					SELECTED_LIST = foundNode;
					SELECTED_LIST_ITEM_INDEX = index;

					payload.state = {
						"Field Array's Item Info": [
							{
								key: "Value",
								value: foundNode.instance.getItemValue(index),
							},
							{
								key: "Errors",
								value: foundNode.instance.getItemErrors(index),
							},
						],
					};

					return;
				}

				if (foundNode.type === DevToolDataType.List) {
					SELECTED_LIST = foundNode;

					payload.state = {
						"Field Array Info": [
							{
								key: "Value",
								value: foundNode.instance.getValue(),
							},
							{
								key: "Dirty",
								value: foundNode.instance.meta.dirty,
							},
							{
								key: "Touched",
								value: foundNode.instance.meta.touched,
							},
							{
								key: "Errors",
								value: foundNode.instance.meta.errors,
							},
						],
					};

					return;
				}

				SELECTED_ITEM = foundNode;
				payload.state = {
					"Field Info": [
						{
							key: "Value",
							value: foundNode.instance.getValue(),
						},
						{
							key: "Dirty",
							value: foundNode.instance.meta.dirty,
						},
						{
							key: "Touched",
							value: foundNode.instance.meta.touched,
						},
						{
							key: "Errors",
							value: foundNode.instance.meta.errors,
						},
					],
				};
			});
		}
	);
}

function castFormNodesToInspectorNodes(
	nodes: DevToolNodeData[]
): CustomInspectorNode[] {
	const formNodes = nodes.filter(
		(node) => node.type === DevToolDataType.Form
	) as DevtoolFormData[];

	const result: CustomInspectorNode[] = formNodes.map<CustomInspectorNode>(
		(node) => {
			return {
				id: node.name,
				label: node.name,
				tags: [
					{
						label: "Form",
						textColor: 0xffffff,
						backgroundColor: 0xf44336,
					},
				],
				children: getInspectorChildrenNodes(
					nodes.filter((n) => {
						return n.type !== DevToolDataType.Form && n.form === node.name;
					}) as DevtoolFormItemData[]
				),
			};
		}
	);

	const formNodeNames = formNodes.map(({ name }) => name);

	result.push(
		...getInspectorChildrenNodes(
			nodes.filter((node) => {
				if (node.type === DevToolDataType.Form) {
					return false;
				}

				return !formNodeNames.includes(node.form);
			}) as DevtoolFormItemData[]
		)
	);

	return result;
}

function getInspectorChildrenNodes(
	nodes: (DevtoolFormItemData | DevtoolFormListData)[],
	trimPrefix?: string
): CustomInspectorNode[] {
	const nodesWithoutParent = nodes.reduce<
		(DevtoolFormItemData | DevtoolFormListData)[]
	>((result, node) => {
		const isChild = result.some(
			({ name, type }) =>
				type === DevToolDataType.List &&
				name !== node.name &&
				node.name.startsWith(`${name}.`)
		);

		if (!isChild) {
			result.push(node);
		}

		return result;
	}, []);

	return nodesWithoutParent.map<CustomInspectorNode>((node) => {
		const children = nodes.filter((n) =>
			n.name.startsWith(node.name) ? n.name !== node.name : false
		);

		return {
			label: trimPrefix ? node.name.replace(trimPrefix, "") : node.name,
			id: `${node.form}_${node.name}`,
			children:
				node.type === DevToolDataType.List
					? children.reduce<CustomInspectorNode[]>((result, child) => {
							const nodeIndex = child.name
								.replace(new RegExp(`^${node.name}.`, "g"), "")
								.split(".")[0];
							if (!nodeIndex) {
								return result;
							}

							const indexInResult = result.findIndex(({ id }) => {
								return id === `${node.form}_${node.name}-item-${nodeIndex}`;
							});

							if (indexInResult === -1) {
								result.push({
									id: `${node.form}_${node.name}-item-${nodeIndex}`,
									label: `${node.name} ${Number(nodeIndex) + 1}`,
									tags: [
										{
											label: "Field Array's Item",
											textColor: 0xffffff,
											backgroundColor: 0xff7c00,
										},
									],
									children: getInspectorChildrenNodes(
										children.filter((childNode) =>
											childNode.name.includes(`${node.name}.${nodeIndex}.`)
										),
										`${node.name}.${nodeIndex}.`
									),
								});
							}

							return result;
					  }, [])
					: [],
			tags:
				node.type === DevToolDataType.List
					? [
							{
								label: "Field Array",
								textColor: 0xffffff,
								backgroundColor: 0xff5722,
							},
					  ]
					: [
							{
								label: "Field",
								textColor: 0xffffff,
								backgroundColor: 0xff9800,
							},
					  ],
		};
	});
}
