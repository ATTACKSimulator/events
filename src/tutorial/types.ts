import { StringCatalog } from "../i18n/catalog";
import { UrlAnalysis } from "./UrlAnalyzer";

export type AttackType = "login" | "fraud" | "malware" | "fake_page";

export type PermissionKind = "mic" | "webcam" | "location" | "notification" | "clipboard" | "extension" | null;

export type FindingKind = "password_form" | "cc_form" | "download_link" | "urgency_text" | "suspicious_link" | "brand_impersonation";

export type Finding = {
	kind: FindingKind;
	element: HTMLElement | null;
	vars?: Record<string, string>;
};

export type Detection = {
	type: AttackType;
	findings: Finding[];
	permissionKind: PermissionKind;
};

export type StepTarget = "url_bar" | "element" | "none";

export type StepIcon = "url" | "lock" | "form" | "card" | "clock" | "download" | "link" | "shield" | "permission" | "mic" | "webcam" | "location" | "clipboard" | "extension" | "done";

export type StepDefinition = {
	titleKey: keyof StringCatalog;
	bodyKey: keyof StringCatalog;
	// Second paragraph: the specific reason this URL is wrong, or the urgency quote.
	reasonKey?: keyof StringCatalog;
	quoteKey?: keyof StringCatalog;
	target: StepTarget;
	element?: HTMLElement | null;
	vars?: Record<string, string>;
	url?: UrlAnalysis;
	icon: StepIcon;
};
