import { useContext } from "solid-js";
import { Context } from "./TestProvider";

export default function TestUseContext() {
	const context = useContext(Context);

	console.log(context);

	return <>{context}</>;
}
