export type WithRequiredProperty<T, Keys extends keyof T> = T & {
	[P in Keys]-?: T[P];
};
