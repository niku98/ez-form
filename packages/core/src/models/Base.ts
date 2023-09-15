export type NamePath = string | number | (string | number)[];
export interface UpdateValueOptions {
	touched?: boolean;
	dirty?: boolean;
	validate?: boolean;
}
