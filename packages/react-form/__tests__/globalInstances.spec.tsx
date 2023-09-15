import {
	FieldArrayInstance,
	FieldInstance,
	FormInstance,
	GlobalInstances,
} from "@niku/ez-form-core";
import { renderHook } from "@testing-library/react";
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
		expect(formInstance.current).toBeInstanceOf(FormInstance);
	});

	it("Form instance - Rename", ({ expect }) => {
		const { result } = renderHook(() => useForm({ name: "test" }));
		result.current.updateOptions({ name: "test-2" });

		const { result: formInstance } = renderHook(() =>
			useFormInstance("test-2")
		);
		expect(formInstance.current).toBeInstanceOf(FormInstance);
	});

	it("Form instance - Removed", ({ expect }) => {
		const { unmount } = renderHook(() => useForm({ name: "test" }));

		const { result: formInstance } = renderHook(() => useFormInstance("test"));
		expect(formInstance.current).toBeInstanceOf(FormInstance);

		unmount();
		expect(formInstance.current).toBe(undefined);
	});

	// ---------------------------------------------------------------------

	it("Field instance", ({ expect }) => {
		const { result: useFormResult } = renderHook(() =>
			useForm({ name: "test" })
		);
		renderHook(() => useField({ name: "firstName" }), {
			wrapper: useFormResult.current.Form,
		});

		const { result: formInstance } = renderHook(() => useFormInstance("test"));
		const { result: fieldInstance } = renderHook(() =>
			useFieldInstance("test", "firstName")
		);
		expect(formInstance.current).toBeInstanceOf(FormInstance);
		expect(fieldInstance.current).toBeInstanceOf(FieldInstance);
	});

	it("Field instance - Rename", ({ expect }) => {
		const { result: useFormResult } = renderHook(() =>
			useForm({ name: "test" })
		);
		const { result: useFieldResult } = renderHook(
			() => useField({ name: "firstName" }),
			{
				wrapper: useFormResult.current.Form,
			}
		);
		useFieldResult.current.updateOptions({ name: "firstName-2" });

		const { result: formInstance } = renderHook(() => useFormInstance("test"));
		const { result: fieldInstance } = renderHook(() =>
			useFieldInstance("test", "firstName-2")
		);
		expect(formInstance.current).toBeInstanceOf(FormInstance);
		expect(fieldInstance.current).toBeInstanceOf(FieldInstance);
	});

	it("Field instance - Removed", ({ expect }) => {
		const { result: useFormResult } = renderHook(() =>
			useForm({ name: "test" })
		);
		const { result: useFieldResult, unmount } = renderHook(
			() => useField({ name: "firstName" }),
			{
				wrapper: useFormResult.current.Form,
			}
		);
		useFieldResult.current.updateOptions({ name: "firstName-2" });

		const { result: formInstance } = renderHook(() => useFormInstance("test"));
		const { result: fieldInstance } = renderHook(() =>
			useFieldInstance("test", "firstName-2")
		);
		expect(formInstance.current).toBeInstanceOf(FormInstance);
		expect(fieldInstance.current).toBeInstanceOf(FieldInstance);

		unmount();
		expect(fieldInstance.current).toBe(undefined);
	});

	it("Field instance - Removed form", ({ expect }) => {
		const { result: useFormResult, unmount: unmountForm } = renderHook(() =>
			useForm({ name: "test" })
		);
		const { result: useFieldResult, unmount: unmountField } = renderHook(
			() => useField({ name: "firstName" }),
			{
				wrapper: useFormResult.current.Form,
			}
		);
		useFieldResult.current.updateOptions({ name: "firstName-2" });

		const { result: formInstance } = renderHook(() => useFormInstance("test"));
		const { result: fieldInstance } = renderHook(() =>
			useFieldInstance("test", "firstName-2")
		);
		expect(formInstance.current).toBeInstanceOf(FormInstance);
		expect(fieldInstance.current).toBeInstanceOf(FieldInstance);

		unmountField();
		unmountForm();
		expect(fieldInstance.current).toBe(undefined);
	});

	// ---------------------------------------------------------------------

	it("Field Array instance", ({ expect }) => {
		const { result: useFormResult } = renderHook(() =>
			useForm({ name: "test" })
		);
		renderHook(() => useFieldArray({ name: "firstName" }), {
			wrapper: useFormResult.current.Form,
		});

		const { result: formInstance } = renderHook(() => useFormInstance("test"));
		const { result: fieldInstance } = renderHook(() =>
			useFieldArrayInstance("test", "firstName")
		);
		expect(formInstance.current).toBeInstanceOf(FormInstance);
		expect(fieldInstance.current).toBeInstanceOf(FieldArrayInstance);
	});

	it("Field Array instance - Rename", ({ expect }) => {
		const { result: useFormResult } = renderHook(() =>
			useForm({ name: "test" })
		);
		const { result: useFieldResult } = renderHook(
			() => useFieldArray({ name: "firstName" }),
			{
				wrapper: useFormResult.current.Form,
			}
		);
		useFieldResult.current.updateOptions({ name: "firstName-2" });

		const { result: formInstance } = renderHook(() => useFormInstance("test"));
		const { result: fieldInstance } = renderHook(() =>
			useFieldArrayInstance("test", "firstName-2")
		);
		expect(formInstance.current).toBeInstanceOf(FormInstance);
		expect(fieldInstance.current).toBeInstanceOf(FieldArrayInstance);
	});

	it("Field Array instance - Removed", ({ expect }) => {
		const { result: useFormResult } = renderHook(() =>
			useForm({ name: "test" })
		);
		const { result: useFieldResult, unmount } = renderHook(
			() => useFieldArray({ name: "firstName" }),
			{
				wrapper: useFormResult.current.Form,
			}
		);
		useFieldResult.current.updateOptions({ name: "firstName-2" });

		const { result: formInstance } = renderHook(() => useFormInstance("test"));
		const { result: fieldInstance } = renderHook(() =>
			useFieldArrayInstance("test", "firstName-2")
		);
		expect(formInstance.current).toBeInstanceOf(FormInstance);
		expect(fieldInstance.current).toBeInstanceOf(FieldArrayInstance);

		unmount();
		expect(fieldInstance.current).toBe(undefined);
	});

	it("Field Array instance - Removed form", ({ expect }) => {
		const { result: useFormResult, unmount: unmountForm } = renderHook(() =>
			useForm({ name: "test" })
		);
		const { result: useFieldResult, unmount: unmountField } = renderHook(
			() => useFieldArray({ name: "firstName" }),
			{
				wrapper: useFormResult.current.Form,
			}
		);
		useFieldResult.current.updateOptions({ name: "firstName-2" });

		const { result: formInstance } = renderHook(() => useFormInstance("test"));
		const { result: fieldInstance } = renderHook(() =>
			useFieldArrayInstance("test", "firstName-2")
		);
		expect(formInstance.current).toBeInstanceOf(FormInstance);
		expect(fieldInstance.current).toBeInstanceOf(FieldArrayInstance);

		unmountField();
		unmountForm();
		expect(fieldInstance.current).toBe(undefined);
	});
});
