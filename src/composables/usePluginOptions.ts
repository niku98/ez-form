import { PluginOptions } from "@/models";
import { $ezFormPluginInjectKey } from "@/utilities";
import { inject } from "vue";

export default function useEzFormPluginOptions() {
	return inject<PluginOptions>($ezFormPluginInjectKey);
}
