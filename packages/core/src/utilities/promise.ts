/**
 * Copied from @anfu/utils
 */

export interface ControlledPromise<T> extends Promise<T> {
	resolve: (value: T | PromiseLike<T>) => void;
	reject: (reason?: any) => void;
}

export function createControlledPromise<T>(): ControlledPromise<T> {
	let resolve: any, reject: any;
	const promise = new Promise<T>((_resolve, _reject) => {
		resolve = _resolve;
		reject = _reject;
	}) as ControlledPromise<T>;

	promise.resolve = resolve;
	promise.reject = reject;

	return promise;
}
