import { PluginOptions } from "@/models";
import { $nkFormInjectKey } from "@/utilities/constants";
import { inject } from "vue";

export default function usePluginOptions() {
	return inject<PluginOptions>($nkFormInjectKey);
}
