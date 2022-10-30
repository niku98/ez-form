import { PluginOptions } from "@/models";
import { $ezFormInjectKey } from "@/utilities/constants";
import { inject } from "vue";

export default function usePluginOptions() {
	return inject<PluginOptions>($ezFormInjectKey);
}
