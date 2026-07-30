import { StringCatalog } from "../i18n/catalog";
import { nameAppearsIn } from "./Identity";
import { analyzeUrl } from "./UrlAnalyzer";
import { Detection, Finding, FindingKind, PermissionKind, StepDefinition, StepIcon } from "./types";

const MAX_FINDING_STEPS = 5;

const FINDING_ORDER: FindingKind[] = ["brand_impersonation", "cc_form", "password_form", "download_link", "suspicious_link", "urgency_text"];

const FINDING_STEPS: Record<FindingKind, { titleKey: keyof StringCatalog; bodyKey: keyof StringCatalog; icon: StepIcon }> = {
	brand_impersonation: { titleKey: "step_brand_title", bodyKey: "step_brand_body", icon: "shield" },
	cc_form: { titleKey: "step_cc_title", bodyKey: "step_cc_body", icon: "card" },
	password_form: { titleKey: "step_password_title", bodyKey: "step_password_body", icon: "form" },
	download_link: { titleKey: "step_download_title", bodyKey: "step_download_body", icon: "download" },
	suspicious_link: { titleKey: "step_suspicious_link_title", bodyKey: "step_suspicious_link_body", icon: "link" },
	urgency_text: { titleKey: "step_urgency_title", bodyKey: "step_urgency_body", icon: "clock" },
};

const PERMISSION_STEPS: Record<Exclude<PermissionKind, null>, { titleKey: keyof StringCatalog; bodyKey: keyof StringCatalog; icon: StepIcon }> = {
	mic: { titleKey: "perm_mic_title", bodyKey: "perm_mic_body", icon: "mic" },
	webcam: { titleKey: "perm_webcam_title", bodyKey: "perm_webcam_body", icon: "webcam" },
	location: { titleKey: "perm_location_title", bodyKey: "perm_location_body", icon: "location" },
	notification: { titleKey: "perm_notification_title", bodyKey: "perm_notification_body", icon: "permission" },
	clipboard: { titleKey: "perm_clipboard_title", bodyKey: "perm_clipboard_body", icon: "clipboard" },
	extension: { titleKey: "perm_extension_title", bodyKey: "perm_extension_body", icon: "extension" },
};

const sortFindings = (findings: Finding[]): Finding[] => {
	return [...findings].sort((a, b) => FINDING_ORDER.indexOf(a.kind) - FINDING_ORDER.indexOf(b.kind));
};

const lessonStep = (detection: Detection): StepDefinition => {
	if (detection.permissionKind) {
		return { titleKey: "lesson_permission_title", bodyKey: "lesson_permission_body", target: "none", icon: "permission" };
	}

	switch (detection.type) {
	case "login":
		return { titleKey: "lesson_login_title", bodyKey: "lesson_login_body", target: "none", icon: "lock" };
	case "fraud":
		return { titleKey: "lesson_fraud_title", bodyKey: "lesson_fraud_body", target: "none", icon: "shield" };
	case "malware":
		return { titleKey: "lesson_malware_title", bodyKey: "lesson_malware_body", target: "none", icon: "shield" };
	default:
		return { titleKey: "lesson_fake_title", bodyKey: "lesson_fake_body", target: "none", icon: "shield" };
	}
};

/**
 * Assembles the ordered tutorial steps for a detection: the URL step first
 * (explaining what specifically is wrong with this address), one spotlighted
 * step per dangerous item found on the page, a permission-specific step when
 * a permission was granted, a type-level lesson and the closing step.
 *
 * @param {Detection} detection - The result of scanning the page.
 * @returns {StepDefinition[]} - The ordered steps to present.
 */
export const stepsFor = (detection: Detection): StepDefinition[] => {
	const url = analyzeUrl();

	// Legitimate sites put their brand in the domain, phishing kits put it in a
	// subdomain — anyone owning example.xyz can serve "yourbank.example.xyz".
	// When that is what happened, say so instead of the generic explanation.
	const brand = detection.findings.filter(finding => finding.kind === "brand_impersonation")[0];
	const brandInSubdomain = brand && brand.vars && url.subdomain && nameAppearsIn(brand.vars.brand, url.subdomain);

	const steps: StepDefinition[] = [
		{
			titleKey: "step_url_title",
			bodyKey: "step_url_body",
			reasonKey: brandInSubdomain ? "url_reason_brand_in_subdomain" : url.reasonKey,
			target: "url_bar",
			vars: brandInSubdomain ? { ...url.vars, brand: brand.vars.brand } : url.vars,
			url,
			icon: "url",
		},
	];

	sortFindings(detection.findings).slice(0, MAX_FINDING_STEPS).forEach(finding => {
		const definition = FINDING_STEPS[finding.kind];
		steps.push({
			titleKey: definition.titleKey,
			bodyKey: definition.bodyKey,
			quoteKey: finding.kind === "urgency_text" && finding.vars?.quote ? "urgency_quote" : undefined,
			target: finding.element ? "element" : "none",
			element: finding.element,
			vars: finding.vars,
			icon: definition.icon,
		});
	});

	if (detection.permissionKind) {
		const definition = PERMISSION_STEPS[detection.permissionKind];
		steps.push({ titleKey: definition.titleKey, bodyKey: definition.bodyKey, target: "none", icon: definition.icon });
	}

	steps.push(lessonStep(detection));
	steps.push({ titleKey: "step_done_title", bodyKey: "step_done_body", target: "none", icon: "done" });

	return steps;
};
