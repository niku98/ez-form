import {
	FieldArrayInstance,
	FieldInstance,
	FormInstance,
	GlobalInstances,
} from "@niku/ez-form-core";
import { renderHook } from "@solidjs/testing-library";
import useFieldArray from "src/hooks/useFieldArray";
import {
	useField,
	useFieldArrayInstance,
	useFieldInstance,
	useForm,
	useFormInstance,
} from "src/index";
import { afterEach, describe, it } from "vitest";

afterEach(() => {
	GlobalInstances.clear();
});

describe("Global instances", () => {
	it("Form instance", ({ expect }) => {
		renderHook(() => useForm({ name: "test" }));

		const { result: formInstance } = renderHook(() => useFormInstance("test"));
		expect(formInstance()).toBeInstanceOf(FormInstance);
	});

	it("Form instance - Rename", ({ expect }) => {
		const { result } = renderHook(() => useForm({ name: "test" }));
		result.updateOptions({ name: "test-2" });

		const { result: formInstance } = renderHook(() =>
			useFormInstance("test-2")
		);
		expect(formInstance()).toBeInstanceOf(FormInstance);
	});

	it("Form instance - Removed", ({ expect }) => {
		const { cleanup } = renderHook(() => useForm({ name: "test" }));

		const { result: formInstance } = renderHook(() => useFormInstance("test"));
		expect(formInstance()).toBeInstanceOf(FormInstance);

		cleanup();
		expect(formInstance()).toBe(undefined);
	});

	// ---------------------------------------------------------------------

	it("Field instance", ({ expect }) => {
		const { result: useFormResult } = renderHook(() =>
			useForm({ name: "test" })
		);
		renderHook(() => useField({ name: "firstName" }), {
			wrapper: useFormResult.Form,
		});

		const { result: formInstance } = renderHook(() => useFormInstance("test"));
		const { result: fieldInstance } = renderHook(() =>
			useFieldInstance("test", "firstName")
		);
		expect(formInstance()).toBeInstanceOf(FormInstance);
		expect(fieldInstance()).toBeInstanceOf(FieldInstance);
	});

	it("Field instance - Rename", ({ expect }) => {
		const { result: useFormResult } = renderHook(() =>
			useForm({ name: "test" })
		);
		const { result: useFieldResult } = renderHook(
			() => useField({ name: "firstName" }),
			{
				wrapper: useFormResult.Form,
			}
		);
		useFieldResult.updateOptions({ name: "firstName-2" });

		const { result: formInstance } = renderHook(() => useFormInstance("test"));
		const { result: fieldInstance } = renderHook(() =>
			useFieldInstance("test", "firstName-2")
		);
		expect(formInstance()).toBeInstanceOf(FormInstance);
		expect(fieldInstance()).toBeInstanceOf(FieldInstance);
	});

	it("Field instance - Removed", ({ expect }) => {
		const { result: useFormResult } = renderHook(() =>
			useForm({ name: "test" })
		);
		const { result: useFieldResult, cleanup } = renderHook(
			() => useField({ name: "firstName" }),
			{
				wrapper: useFormResult.Form,
			}
		);
		useFieldResult.updateOptions({ name: "firstName-2" });

		const { result: formInstance } = renderHook(() => useFormInstance("test"));
		const { result: fieldInstance } = renderHook(() =>
			useFieldInstance("test", "firstName-2")
		);
		expect(formInstance()).toBeInstanceOf(FormInstance);
		expect(fieldInstance()).toBeInstanceOf(FieldInstance);

		cleanup();
		expect(fieldInstance()).toBe(undefined);
	});

	it("Field instance - Removed form", ({ expect }) => {
		const { result: useFormResult, cleanup: unmountForm } = renderHook(() =>
			useForm({ name: "test" })
		);
		const { result: useFieldResult, cleanup: unmountField } = renderHook(
			() => useField({ name: "firstName" }),
			{
				wrapper: useFormResult.Form,
			}
		);
		useFieldResult.updateOptions({ name: "firstName-2" });

		const { result: formInstance } = renderHook(() => useFormInstance("test"));
		const { result: fieldInstance } = renderHook(() =>
			useFieldInstance("test", "firstName-2")
		);
		expect(formInstance()).toBeInstanceOf(FormInstance);
		expect(fieldInstance()).toBeInstanceOf(FieldInstance);

		unmountField();
		unmountForm();
		expect(fieldInstance()).toBe(undefined);
	});

	// ---------------------------------------------------------------------

	it("Field Array instance", ({ expect }) => {
		const { result: useFormResult } = renderHook(() =>
			useForm({ name: "test" })
		);
		renderHook(() => useFieldArray({ name: "firstName" }), {
			wrapper: useFormResult.Form,
		});

		const { result: formInstance } = renderHook(() => useFormInstance("test"));
		const { result: fieldInstance } = renderHook(() =>
			useFieldArrayInstance("test", "firstName")
		);
		expect(formInstance()).toBeInstanceOf(FormInstance);
		expect(fieldInstance()).toBeInstanceOf(FieldArrayInstance);
	});

	it("Field Array instance - Rename", ({ expect }) => {
		const { result: useFormResult } = renderHook(() =>
			useForm({ name: "test" })
		);
		const { result: useFieldResult } = renderHook(
			() => useFieldArray({ name: "firstName" }),
			{
				wrapper: useFormResult.Form,
			}
		);
		useFieldResult.updateOptions({ name: "firstName-2" });

		const { result: formInstance } = renderHook(() => useFormInstance("test"));
		const { result: fieldInstance } = renderHook(() =>
			useFieldArrayInstance("test", "firstName-2")
		);
		expect(formInstance()).toBeInstanceOf(FormInstance);
		expect(fieldInstance()).toBeInstanceOf(FieldArrayInstance);
	});

	it("Field Array instance - Removed", ({ expect }) => {
		const { result: useFormResult } = renderHook(() =>
			useForm({ name: "test" })
		);
		const { result: useFieldResult, cleanup } = renderHook(
			() => useFieldArray({ name: "firstName" }),
			{
				wrapper: useFormResult.Form,
			}
		);
		useFieldResult.updateOptions({ name: "firstName-2" });

		const { result: formInstance } = renderHook(() => useFormInstance("test"));
		const { result: fieldInstance } = renderHook(() =>
			useFieldArrayInstance("test", "firstName-2")
		);
		expect(formInstance()).toBeInstanceOf(FormInstance);
		expect(fieldInstance()).toBeInstanceOf(FieldArrayInstance);

		cleanup();
		expect(fieldInstance()).toBe(undefined);
	});

	it("Field Array instance - Removed form", ({ expect }) => {
		const { result: useFormResult, cleanup: unmountForm } = renderHook(() =>
			useForm({ name: "test" })
		);
		const { result: useFieldResult, cleanup: unmountField } = renderHook(
			() => useFieldArray({ name: "firstName" }),
			{
				wrapper: useFormResult.Form,
			}
		);
		useFieldResult.updateOptions({ name: "firstName-2" });

		const { result: formInstance } = renderHook(() => useFormInstance("test"));
		const { result: fieldInstance } = renderHook(() =>
			useFieldArrayInstance("test", "firstName-2")
		);
		expect(formInstance()).toBeInstanceOf(FormInstance);
		expect(fieldInstance()).toBeInstanceOf(FieldArrayInstance);

		unmountField();
		unmountForm();
		expect(fieldInstance()).toBe(undefined);
	});
});
