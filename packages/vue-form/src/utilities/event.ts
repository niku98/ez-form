export function handleEventPrevent<E extends Event>(cb: (event: E) => void) {
	return (event: E) => {
		if (event.defaultPrevented) {
			return;
		}
		event.preventDefault();
		cb(event);
	};
}
