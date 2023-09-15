import FieldBaseInstance from "src/FieldBase";
import FormInstance from "src/Form";
import { EventListenersManager } from "src/utilities";

type GlobalInstanceMap = Record<
	string,
	{
		form: FormInstance<any>;
		fields: Record<string, FieldBaseInstance<any, any>>;
	}
>;

type GlobalInstancesEvents = {
	change: [instances: GlobalInstanceMap];
};

class GlobalInstances extends EventListenersManager<GlobalInstancesEvents> {
	private instances: GlobalInstanceMap = {};

	private triggerChange = () => {
		this.trigger("change", this.instances);
	};

	getGroup = (name: string) => {
		return name in this.instances ? this.instances[name] : undefined;
	};

	addForm = (form: FormInstance, fields?: FieldBaseInstance<any, any>[]) => {
		const instanceGroup = this.getGroup(form.name);

		if (instanceGroup) {
			instanceGroup.form = form;
		} else {
			this.instances[form.name] = {
				form,
				fields: {},
			};
		}

		if (fields) {
			this.addField(form.name, ...fields);
		}

		this.triggerChange();
	};

	removeForm = (formName: string) => {
		delete this.instances[formName];
		this.triggerChange();
	};

	renameForm = (oldName: string, newName: string) => {
		const instance = this.instances[oldName];
		if (instance) {
			this.instances[newName] = instance;
			this.removeForm(oldName);
			this.triggerChange();
		}
	};

	addField = <FieldValue, FormValues>(
		formName: string,
		...fields: FieldBaseInstance<FieldValue, FormValues>[]
	) => {
		const instanceGroup = this.getGroup(formName);
		if (!instanceGroup) {
			return;
		}

		fields.forEach((field) => {
			instanceGroup.fields[field.name] = field;
		});

		this.triggerChange();
	};

	removeField = (formName: string, fieldName: string) => {
		const instanceGroup = this.getGroup(formName);
		if (!instanceGroup) {
			return;
		}

		delete instanceGroup.fields[fieldName];
		this.triggerChange();
	};

	renameField = (
		formName: string,
		oldFieldName: string,
		newFieldName: string
	) => {
		const instanceGroup = this.getGroup(formName);
		if (!instanceGroup) {
			return;
		}

		const instance = instanceGroup.fields[oldFieldName];
		if (instance) {
			instanceGroup.fields[newFieldName] = instance;
			this.removeForm(oldFieldName);
			this.triggerChange();
		}
	};

	clear = () => {
		this.instances = {};
	};
}

export default new GlobalInstances();
