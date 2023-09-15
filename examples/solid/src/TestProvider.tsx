import { JSXElement, createContext } from "solid-js";

export const Context = createContext<number | undefined>(undefined);

export default function TestProvider(props: { children: JSXElement }) {
	return <Context.Provider value={1}>{props.children}</Context.Provider>;
}
