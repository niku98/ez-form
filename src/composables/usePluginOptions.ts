import { PluginOptions } from "@/models";
import { $ezFormPluginInjectKey } from "@/utilities/constants";
import { inject } from "vue";

export default function usePluginOptions() {
	return inject<PluginOptions>($ezFormPluginInjectKey);
}
