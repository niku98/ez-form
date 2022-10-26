import { NamePath } from "@/models/Base";
import {
	RuleItem as ARuleItem,
	ValidateMessages as AsyncValidateMessages,
} from "async-validator";

export type ValidateTrigger = "change" | "blur";

export interface RuleItem extends ARuleItem {
	trigger?: ValidateTrigger | ValidateTrigger[];
}

export type Rule = RuleItem | RuleItem[];

export type Rules = Record<string, Rule>;

export interface ValidateOption {
	trigger: ValidateTrigger | ValidateTrigger[];
}

export interface ValidateError {
	name: NamePath;
	messages: string[];
}

export type ValidateMessages = AsyncValidateMessages;
