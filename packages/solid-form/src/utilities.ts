import type { GetKeys } from "@niku/ez-form-core";

export function handleEventPrevent<E extends Event>(cb: (event: E) => void) {
	return (event: E) => {
		if (event.defaultPrevented) {
			return;
		}
		event.preventDefault();
		cb(event);
	};
}

export type FieldNameProps<
	ParentValue,
	N = GetKeys<ParentValue>
> = ParentValue extends any[]
	? { index: number; name?: N }
	: { index?: number; name: N };
