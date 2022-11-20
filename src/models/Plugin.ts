import { ValidateMessages } from "@/models/Validation";

export interface PluginOptions {
	validateMessages?: ValidateMessages;
	colon?: boolean;
	requiredMark?: string;
}
