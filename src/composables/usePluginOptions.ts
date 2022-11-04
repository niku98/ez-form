import { PluginOptions } from "@/models";
import { $ezFormPluginInjectKey } from "@/utilities";
import { inject } from "vue";

export default function usePluginOptions() {
	return inject<PluginOptions>($ezFormPluginInjectKey);
}
