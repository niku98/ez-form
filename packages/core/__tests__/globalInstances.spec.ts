import FieldInstance from "src/Field";
import FieldArrayInstance from "src/FieldArray";
import FormInstance from "src/Form";
import GlobalInstances from "src/GlobalInstances";
import {
	getFieldArrayInstance,
	getFieldInstance,
	getFormInstance,
} from "src/globalInstances.utils";
import { afterEach, describe, it } from "vitest";

afterEach(() => {
	GlobalInstances.clear();
});

describe("Global instances", () => {
	it("Form instance", ({ expect }) => {
		const form = new FormInstance({ name: "test" });
		form.mount();

		const formInstance = getFormInstance("test");
		expect(formInstance).toBeInstanceOf(FormInstance);
	});

	it("Form instance - Rename", ({ expect }) => {
		const form = new FormInstance({ name: "test" });
		form.mount();
		form.updateOptions({ name: "test-2" });

		const formInstance = getFormInstance("test-2");
		expect(formInstance).toBeInstanceOf(FormInstance);
	});

	it("Form instance - Removed", ({ expect }) => {
		const form = new FormInstance({ name: "test" });
		const unmount = form.mount();
		let formInstance = getFormInstance("test");
		expect(formInstance).toBeInstanceOf(FormInstance);

		unmount();
		formInstance = getFormInstance("test");
		expect(formInstance).toBe(undefined);
	});

	// ---------------------------------------------------------------------

	it("Field instance", ({ expect }) => {
		const form = new FormInstance({ name: "test" });
		form.mount();
		const field = new FieldInstance<unknown, unknown>(form, {
			name: "firstName",
		});
		field.mount();

		const formInstance = getFormInstance("test");
		const fieldInstance = getFieldInstance("test", "firstName");
		expect(formInstance).toBeInstanceOf(FormInstance);
		expect(fieldInstance).toBeInstanceOf(FieldInstance);
	});

	it("Field instance - Rename", ({ expect }) => {
		const form = new FormInstance({ name: "test" });
		form.mount();
		const field = new FieldInstance<unknown, unknown>(form, {
			name: "firstName",
		});
		field.mount();
		field.updateOptions({ name: "firstName-2" });

		const fieldInstance = getFieldInstance("test", "firstName-2");
		expect(fieldInstance).toBeInstanceOf(FieldInstance);
	});

	it("Field instance - Removed", ({ expect }) => {
		const form = new FormInstance({ name: "test" });
		form.mount();
		const field = new FieldInstance<unknown, unknown>(form, {
			name: "firstName",
		});

		const unmount = field.mount();
		let fieldInstance = getFieldInstance("test", "firstName");
		expect(fieldInstance).toBeInstanceOf(FieldInstance);

		unmount();
		fieldInstance = getFieldInstance("test", "firstName");
		expect(fieldInstance).toBe(undefined);
	});

	it("Field instance - Removed form", ({ expect }) => {
		const form = new FormInstance({ name: "test" });
		const unmountForm = form.mount();
		const field = new FieldInstance<unknown, unknown>(form, {
			name: "firstName",
		});

		const unmountField = field.mount();
		let fieldInstance = getFieldInstance("test", "firstName");
		expect(fieldInstance).toBeInstanceOf(FieldInstance);

		unmountField();
		unmountForm();
		fieldInstance = getFieldInstance("test", "firstName");
		expect(fieldInstance).toBe(undefined);
	});

	// ---------------------------------------------------------------------

	it("Field Array instance", ({ expect }) => {
		const form = new FormInstance({ name: "test" });
		form.mount();
		const field = new FieldArrayInstance<unknown, unknown>(form, {
			name: "firstName",
		});
		field.mount();

		const formInstance = getFormInstance("test");
		const fieldInstance = getFieldArrayInstance("test", "firstName");
		expect(formInstance).toBeInstanceOf(FormInstance);
		expect(fieldInstance).toBeInstanceOf(FieldArrayInstance);
	});

	it("Field Array instance - Rename", ({ expect }) => {
		const form = new FormInstance({ name: "test" });
		form.mount();
		const field = new FieldArrayInstance<unknown, unknown>(form, {
			name: "firstName",
		});
		field.mount();
		field.updateOptions({ name: "firstName-2" });

		const fieldInstance = getFieldArrayInstance("test", "firstName-2");
		expect(fieldInstance).toBeInstanceOf(FieldArrayInstance);
	});

	it("Field Array instance - Removed", ({ expect }) => {
		const form = new FormInstance({ name: "test" });
		form.mount();
		const field = new FieldArrayInstance<unknown, unknown>(form, {
			name: "firstName",
		});

		const unmount = field.mount();
		let fieldInstance = getFieldArrayInstance("test", "firstName");
		expect(fieldInstance).toBeInstanceOf(FieldArrayInstance);

		unmount();
		fieldInstance = getFieldArrayInstance("test", "firstName");
		expect(fieldInstance).toBe(undefined);
	});

	it("Field Array instance - Removed form", ({ expect }) => {
		const form = new FormInstance({ name: "test" });
		const unmountForm = form.mount();
		const field = new FieldArrayInstance<unknown, unknown>(form, {
			name: "firstName",
		});

		const unmountField = field.mount();
		let fieldInstance = getFieldArrayInstance("test", "firstName");
		expect(fieldInstance).toBeInstanceOf(FieldArrayInstance);

		unmountField();
		unmountForm();
		fieldInstance = getFieldArrayInstance("test", "firstName");
		expect(fieldInstance).toBe(undefined);
	});
});
