import {
	DevToolDataType,
	type DevtoolFormData,
	type DevtoolFormItemData,
	type DevtoolFormListData,
	type DevtoolInstance,
	type DevToolNodeData,
} from "@/devtool/models";
import { debounce } from "@/utilities";
import {
	setupDevtoolsPlugin,
	type CustomInspectorNode,
	type DevtoolsPluginApi,
} from "@vue/devtools-api";
const INSPECTOR_ID = "ez-form-inspector";
let devtoolApi: DevtoolsPluginApi<{}> | undefined;
let SELECTED_FORM: DevtoolFormData | undefined;
let SELECTED_ITEM: DevtoolFormItemData | undefined;
let SELECTED_LIST: DevtoolFormListData | undefined;
let SELECTED_LIST_ITEM_INDEX: number | undefined;
let componentInstances: any[] = [];
const formNodes: DevToolNodeData[] = [];

export const devtoolInstance: DevtoolInstance = {
	addForm(name, instance, componentUid) {
		formNodes.push({
			type: DevToolDataType.Form,
			name,
			instance,
			componentUid,
		});
		this?.sendInspectorTree();
	},
	removeForm(formName) {
		const index = formNodes.findIndex(
			({ name, type }) => name === formName && type === DevToolDataType.Form
		);
		if (index > -1) {
			formNodes.splice(index, 1);
			this.sendInspectorTree();
		}
	},
	updateFormName(old, name) {
		const index = formNodes.findIndex(
			({ name, type }) => name === old && type === DevToolDataType.Form
		);
		if (index > -1) {
			formNodes[index].name = name;
			this.sendInspectorTree();
		}
	},
	addFormItem(form, name, instance, componentUid) {
		formNodes.push({
			type: DevToolDataType.Item,
			name,
			instance,
			form,
			componentUid,
		});
		this.sendInspectorTree();
	},
	removeFormItem(inputForm, formItemName) {
		const index = formNodes.findIndex((node) => {
			if (node.type !== DevToolDataType.Item) {
				return false;
			}

			return node.form === inputForm && node.name === formItemName;
		});

		if (index === -1) {
			return;
		}

		formNodes.splice(index, 1);
		this.sendInspectorTree();
	},
	updateFormItemName(form, old, formItemName) {
		const index = formNodes.findIndex((node) => {
			if (node.type !== DevToolDataType.Item) {
				return false;
			}

			return node.form === form && node.name === old;
		});

		if (index === -1) {
			return;
		}

		formNodes[index].name = formItemName;
		this.sendInspectorTree();
	},
	updateFormItemForm(formItemName, oldForm, newForm) {
		const foundNode = formNodes.find((node) => {
			if (node.type !== DevToolDataType.Item) {
				return false;
			}

			return node.form === oldForm && node.name === formItemName;
		});

		if (!foundNode) {
			return;
		}

		if (foundNode.type === DevToolDataType.Item) {
			foundNode.form = newForm;
			this.sendInspectorTree();
		}
	},
	addFormList(form, name, instance, componentUid) {
		formNodes.push({
			type: DevToolDataType.List,
			name,
			instance,
			form,
			componentUid,
		});
		this.sendInspectorTree();
	},
	removeFormList(inputForm, formListName) {
		const index = formNodes.findIndex((node) => {
			if (node.type !== DevToolDataType.List) {
				return false;
			}

			return node.form === inputForm && node.name === formListName;
		});

		if (index === -1) {
			return;
		}

		formNodes.splice(index, 1);
		this.sendInspectorTree();
	},
	updateFormListName(form, old, formListName) {
		const index = formNodes.findIndex((node) => {
			if (node.type !== DevToolDataType.List) {
				return false;
			}

			return node.form === form && node.name === old;
		});

		if (index === -1) {
			return;
		}

		formNodes[index].name = formListName;
		this.sendInspectorTree();
	},
	updateFormListForm(formListName, oldForm, newForm) {
		const foundNode = formNodes.find((node) => {
			if (node.type !== DevToolDataType.List) {
				return false;
			}

			return node.form === oldForm && node.name === formListName;
		});

		if (!foundNode) {
			return;
		}

		if (foundNode.type === DevToolDataType.List) {
			foundNode.form = newForm;
			this.sendInspectorTree();
		}
	},
	sendInspectorTree: debounce(() => {
		devtoolApi?.sendInspectorTree(INSPECTOR_ID);
	}),
	sendInspectorState: debounce(() => {
		devtoolApi?.sendInspectorState(INSPECTOR_ID);
	}),
};

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
						action() {
							if (!SELECTED_FORM) {
								return alert("Please select a form first!");
							}

							SELECTED_FORM.instance.validate();
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
								SELECTED_LIST.instance.clearItemValidate(
									SELECTED_LIST_ITEM_INDEX
								);
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
						action() {
							if (SELECTED_FORM) {
								SELECTED_FORM.instance.validate();
								return;
							}

							if (SELECTED_ITEM) {
								SELECTED_ITEM.instance.validate();
								return;
							}

							if (SELECTED_LIST && SELECTED_LIST_ITEM_INDEX !== undefined) {
								SELECTED_LIST.instance
									.getItemFields(SELECTED_LIST_ITEM_INDEX)
									.forEach(({ validate }) => validate());
								return;
							}

							if (SELECTED_LIST) {
								SELECTED_LIST.instance.validate();
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
								SELECTED_LIST.instance.resetItem(SELECTED_LIST_ITEM_INDEX);
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
								value: foundNode.instance.meta.values,
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
						"List's Item Info": [
							{
								key: "Value",
								value: foundNode.instance.meta.rawValue[index],
							},
							{
								key: "TransformedValue",
								value: foundNode.instance.meta.transformedValue[index],
							},
							{
								key: "Errors",
								value: foundNode.instance.getErrors(index),
							},
						],
					};

					return;
				}

				if (foundNode.type === DevToolDataType.List) {
					SELECTED_LIST = foundNode;

					payload.state = {
						"FormList Info": [
							{
								key: "Dirty",
								value: foundNode.instance.meta.dirty,
							},
							{
								key: "Touched",
								value: foundNode.instance.meta.touched,
							},
							{
								key: "RawValue",
								value: foundNode.instance.meta.rawValue,
							},
							{
								key: "TransformedValue",
								value: foundNode.instance.meta.transformedValue,
							},
							{
								key: "Errors",
								value: foundNode.instance.meta.error,
							},
						],
					};

					return;
				}

				SELECTED_ITEM = foundNode;
				payload.state = {
					"FormItem Info": [
						{
							key: "Dirty",
							value: foundNode.instance.meta.dirty,
						},
						{
							key: "Touched",
							value: foundNode.instance.meta.touched,
						},
						{
							key: "RawValue",
							value: foundNode.instance.meta.rawValue,
						},
						{
							key: "TransformedValue",
							value: foundNode.instance.meta.transformedValue,
						},
						{
							key: "Errors",
							value: foundNode.instance.meta.error,
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
								.replace(new RegExp(`^${node.name}\.`, "g"), "")
								.split(".")[0];
							const indexInResult = result.findIndex(({ id }) => {
								return id === `${node.form}_${node.name}-item-${nodeIndex}`;
							});

							if (indexInResult === -1) {
								result.push({
									id: `${node.form}_${node.name}-item-${nodeIndex}`,
									label: `${node.name} ${Number(nodeIndex) + 1}`,
									tags: [
										{
											label: "List's Item",
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
								label: "List",
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
