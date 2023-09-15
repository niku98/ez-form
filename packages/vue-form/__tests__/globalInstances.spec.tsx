/* eslint-disable vue/one-component-per-file */
import {
	FieldArrayInstance,
	FieldInstance,
	FormInstance,
	GlobalInstances,
} from "@niku/ez-form-core";
import { render, waitFor } from "@testing-library/vue";
import useFieldArray from "src/composables/useFieldArray";
import {
	useField,
	useFieldArrayInstance,
	useFieldInstance,
	useForm,
	useFormInstance,
} from "src/index";
import { afterEach, describe, it } from "vitest";
import { Fragment, defineComponent, h, ref } from "vue";

afterEach(() => {
	GlobalInstances.clear();
});

async function renderHook<T>(composable: () => T, options?: { wrapper: any }) {
	const result = ref<T>();
	const Runner = defineComponent({
		setup() {
			result.value = composable();
			return { result };
		},
		render() {
			return () => h(Fragment);
		},
	});

	const App = defineComponent({
		setup() {
			return () =>
				options?.wrapper
					? // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
					  h(options.wrapper, undefined, () => h(Runner))
					: h(Runner);
		},
	});

	const wrapper = render(App);

	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
	await waitFor(() => ("vm" in wrapper ? (wrapper.vm as any).isSuccess : true));

	return { wrapper, result };
}

describe("Global instances", () => {
	it("Form instance", async ({ expect }) => {
		await renderHook(() => useForm({ name: "test" }));

		const { result: formInstance } = await renderHook(() =>
			useFormInstance("test")
		);
		expect(formInstance.value?.value).toBeInstanceOf(FormInstance);
	});

	it("Form instance - Rename", async ({ expect }) => {
		const { result } = await renderHook(() => useForm({ name: "test" }));
		result.value?.updateOptions({ name: "test-2" });

		const { result: formInstance } = await renderHook(() =>
			useFormInstance("test-2")
		);
		expect(formInstance.value?.value).toBeInstanceOf(FormInstance);
	});

	it("Form instance - Removed", async ({ expect }) => {
		const { wrapper } = await renderHook(() => useForm({ name: "test" }));

		const { result: formInstance } = await renderHook(() =>
			useFormInstance("test")
		);
		expect(formInstance.value?.value).toBeInstanceOf(FormInstance);

		wrapper.unmount();
		expect(formInstance.value?.value).toBe(undefined);
	});

	// ---------------------------------------------------------------------

	it("Field instance", async ({ expect }) => {
		const { result: useFormResult } = await renderHook(() =>
			useForm({ name: "test" })
		);
		await renderHook(() => useField({ name: "firstName" }), {
			wrapper: useFormResult.value?.Form,
		});

		const { result: formInstance } = await renderHook(() =>
			useFormInstance("test")
		);
		const { result: fieldInstance } = await renderHook(() =>
			useFieldInstance("test", "firstName")
		);
		expect(formInstance.value?.value).toBeInstanceOf(FormInstance);
		expect(fieldInstance.value?.value).toBeInstanceOf(FieldInstance);
	});

	it("Field instance - Rename", async ({ expect }) => {
		const { result: useFormResult } = await renderHook(() =>
			useForm({ name: "test" })
		);
		const { result: useFieldResult } = await renderHook(
			() => useField({ name: "firstName" }),
			{
				wrapper: useFormResult.value?.Form,
			}
		);
		useFieldResult.value?.updateOptions({ name: "firstName-2" });

		const { result: formInstance } = await renderHook(() =>
			useFormInstance("test")
		);
		const { result: fieldInstance } = await renderHook(() =>
			useFieldInstance("test", "firstName-2")
		);
		expect(formInstance.value?.value).toBeInstanceOf(FormInstance);
		expect(fieldInstance.value?.value).toBeInstanceOf(FieldInstance);
	});

	it("Field instance - Removed", async ({ expect }) => {
		const { result: useFormResult } = await renderHook(() =>
			useForm({ name: "test" })
		);
		const { result: useFieldResult, wrapper } = await renderHook(
			() => useField({ name: "firstName" }),
			{
				wrapper: useFormResult.value?.Form,
			}
		);
		useFieldResult.value?.updateOptions({ name: "firstName-2" });

		const { result: formInstance } = await renderHook(() =>
			useFormInstance("test")
		);
		const { result: fieldInstance } = await renderHook(() =>
			useFieldInstance("test", "firstName-2")
		);
		expect(formInstance.value?.value).toBeInstanceOf(FormInstance);
		expect(fieldInstance.value?.value).toBeInstanceOf(FieldInstance);

		wrapper.unmount();

		expect(fieldInstance.value?.value).toBe(undefined);
	});

	it("Field instance - Removed form", async ({ expect }) => {
		const { result: useFormResult, wrapper: formWrapper } = await renderHook(
			() => useForm({ name: "test" })
		);
		const { result: useFieldResult } = await renderHook(
			() => useField({ name: "firstName" }),
			{
				wrapper: useFormResult.value?.Form,
			}
		);
		useFieldResult.value?.updateOptions({ name: "firstName-2" });

		const { result: formInstance } = await renderHook(() =>
			useFormInstance("test")
		);
		const { result: fieldInstance } = await renderHook(() =>
			useFieldInstance("test", "firstName-2")
		);
		expect(formInstance.value?.value).toBeInstanceOf(FormInstance);
		expect(fieldInstance.value?.value).toBeInstanceOf(FieldInstance);

		formWrapper.unmount();
		expect(fieldInstance.value?.value).toBe(undefined);
	});

	// ---------------------------------------------------------------------

	it("Field Array instance", async ({ expect }) => {
		const { result: useFormResult } = await renderHook(() =>
			useForm({ name: "test" })
		);
		await renderHook(() => useFieldArray({ name: "firstName" }), {
			wrapper: useFormResult.value?.Form,
		});

		const { result: formInstance } = await renderHook(() =>
			useFormInstance("test")
		);
		const { result: fieldInstance } = await renderHook(() =>
			useFieldArrayInstance("test", "firstName")
		);
		expect(formInstance.value?.value).toBeInstanceOf(FormInstance);
		expect(fieldInstance.value?.value).toBeInstanceOf(FieldArrayInstance);
	});

	it("Field Array instance - Rename", async ({ expect }) => {
		const { result: useFormResult } = await renderHook(() =>
			useForm({ name: "test" })
		);
		const { result: useFieldResult } = await renderHook(
			() => useFieldArray({ name: "firstName" }),
			{
				wrapper: useFormResult.value?.Form,
			}
		);
		useFieldResult.value?.updateOptions({ name: "firstName-2" });

		const { result: formInstance } = await renderHook(() =>
			useFormInstance("test")
		);
		const { result: fieldInstance } = await renderHook(() =>
			useFieldArrayInstance("test", "firstName-2")
		);
		expect(formInstance.value?.value).toBeInstanceOf(FormInstance);
		expect(fieldInstance.value?.value).toBeInstanceOf(FieldArrayInstance);
	});

	it("Field Array instance - Removed", async ({ expect }) => {
		const { result: useFormResult } = await renderHook(() =>
			useForm({ name: "test" })
		);
		const { result: useFieldResult, wrapper } = await renderHook(
			() => useFieldArray({ name: "firstName" }),
			{
				wrapper: useFormResult.value?.Form,
			}
		);
		useFieldResult.value?.updateOptions({ name: "firstName-2" });

		const { result: formInstance } = await renderHook(() =>
			useFormInstance("test")
		);
		const { result: fieldInstance } = await renderHook(() =>
			useFieldArrayInstance("test", "firstName-2")
		);
		expect(formInstance.value?.value).toBeInstanceOf(FormInstance);
		expect(fieldInstance.value?.value).toBeInstanceOf(FieldArrayInstance);

		wrapper.unmount();
		expect(fieldInstance.value?.value).toBe(undefined);
	});

	it("Field Array instance - Removed form", async ({ expect }) => {
		const { result: useFormResult, wrapper } = await renderHook(() =>
			useForm({ name: "test" })
		);
		const { result: useFieldResult } = await renderHook(
			() => useFieldArray({ name: "firstName" }),
			{
				wrapper: useFormResult.value?.Form,
			}
		);
		useFieldResult.value?.updateOptions({ name: "firstName-2" });

		const { result: formInstance } = await renderHook(() =>
			useFormInstance("test")
		);
		const { result: fieldInstance } = await renderHook(() =>
			useFieldArrayInstance("test", "firstName-2")
		);
		expect(formInstance.value?.value).toBeInstanceOf(FormInstance);
		expect(fieldInstance.value?.value).toBeInstanceOf(FieldArrayInstance);

		wrapper.unmount();
		expect(fieldInstance.value?.value).toBe(undefined);
	});
});
