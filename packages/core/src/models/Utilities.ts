export type GetType<Obj, Key extends string> = Obj extends Record<string, any>
	? Key extends `${infer A}.${infer B}`
		? Obj[A] extends Record<string, any>
			? GetType<Obj[A], B>
			: Obj[A]
		: Obj[Key]
	: unknown;

type JoinKey<A extends string, B extends string> = `${A extends ""
	? ""
	: `${A}.`}${B}`;
type OmitArrayProps<T> = T extends any[] ? Omit<T, keyof any[]> : T;

type GetKeysImpl<T, P extends string = "", K = keyof T> = K extends keyof T
	? T[K] extends any[]
		? JoinKey<P, K & string>
		: T[K] extends object
		?
				| JoinKey<P, K & string>
				| GetKeysImpl<OmitArrayProps<T[K]>, JoinKey<P, K & string>>
		: JoinKey<P, K & string>
	: never;
export type GetKeys<T> = unknown extends T
	? string
	: object extends T
	? string
	: T extends any[]
	? GetKeysImpl<T[number]>
	: T extends object
	? GetKeysImpl<T>
	: never;

export type ToArray<T> = T extends any[] ? T : T[];
