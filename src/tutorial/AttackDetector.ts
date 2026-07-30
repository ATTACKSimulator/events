import { claimedIdentity, ownsDomain } from "./Identity";
import { AttackType, Detection, Finding, PermissionKind } from "./types";
import { analyzeUrl, MULTI_PART_SUFFIXES } from "./UrlAnalyzer";

const MALWARE_EVENTS = ["download_file_event", "file_opened", "file_open", "attachment_opened", "file_download"];

const PERMISSION_EVENTS: Record<string, PermissionKind> = {
	"mic_accepted": "mic",
	"webcam_accepted": "webcam",
	"location_accepted": "location",
	"notification_accepted": "notification",
	"clipboard_accepted": "clipboard",
	"extension_installed": "extension",
};

// Phishing pages are usually sloppy clones: inputs outside of any <form>,
// randomised attribute names, <div> elements acting as buttons and text
// split across nested spans. Every heuristic below therefore works from
// what the user can actually see rather than from well-formed markup.

const PASSWORD_PATTERN = /(password|passwd|pwd|passcode|senha|parol|parola|contrasenya|contrase|mot\s*de\s*passe|passwort|kennwort|κωδικ)/i;
const OTP_PATTERN = /(one[-\s]?time|otp|2fa|two[-\s]?factor|verification\s*code|security\s*code|auth(entication)?\s*code|sms\s*code|cod\s*(de\s*)?verificare|código|code\s*de\s*validation|bestätigungscode)/i;
const CC_PATTERN = /(card\s*number|cardnumber|creditcard|credit\s*card|debit\s*card|cc[-_\s]?num|numar\s*card|número\s*de\s*tarjeta|numéro\s*de\s*carte|kartennummer|\bcvc\b|\bcvv\b|\bcsc\b|expir|validade|caducidad|vencimiento|ablauf|mm\s*\/\s*yy|iban|sort\s*code|routing\s*number)/i;
const DOWNLOAD_TEXT_PATTERN = /(^|[^\p{L}])(download|descarcă|descarca|descarga|descargar|descarrega|baixar|baixe|transferir|télécharger|téléchargez|herunterladen|download(en)?|λήψη|κατεβάστε|open\s*(the\s*)?(file|document|attachment)|view\s*document|get\s*(the\s*)?file)([^\p{L}]|$)/iu;
const DOWNLOAD_EXTENSION_PATTERN = /\.(exe|zip|rar|7z|iso|dmg|apk|msi|scr|bat|cmd|com|jar|vbs|ps1|hta|lnk|docm|xlsm|pptm|xlsb)($|\?|#)/i;
// Pressure tactics in every locale the tutorial supports: en, ro, es, ca,
// pt, fr, de and el. Matching is accent-insensitive for the Latin scripts
// because phishing kits routinely drop diacritics.
const URGENCY_PATTERN = new RegExp([
	// English
	"urgent", "immediately", "right now", "as soon as possible", "act now", "last chance",
	"final (notice|warning|reminder)", "verify (now|immediately|your account)", "confirm (now|immediately)",
	"expires? (today|soon|within|in)", "failure to (do so|respond|comply)", "avoid (suspension|deactivation)",
	// Romanian
	"urgent", "imediat", "de urgen[tț]a", "c[aâ]t mai repede", "ultima [sș]ans[aă]",
	"contul (t[aă]u )?(va fi )?(suspendat|blocat|[iî]nchis|dezactivat)", "expir[aă]", "[iî]n termen de",
	// Spanish (ES + LATAM)
	"urgente", "inmediatamente", "de inmediato", "ahora mismo", "[uú]ltima oportunidad",
	"(su|tu) cuenta ser[aá] (suspendida|bloqueada|cerrada|desactivada)", "caducar[aá]?", "vence hoy",
	"antes de que", "verifica(r)? (ahora|de inmediato)",
	// Catalan
	"urgent", "immediatament", "ara mateix", "[uú]ltima oportunitat",
	"el (teu |vostre )?compte ser[aà] (suspes|susp[eè]s|blocat|tancat)", "caduca", "abans que",
	// Portuguese (BR + PT)
	"urgente", "imediatamente", "com urg[eê]ncia", "agora mesmo", "[uú]ltima (chance|oportunidade)",
	"(a )?sua conta ser[aá] (suspensa|bloqueada|encerrada|desativada)", "expira", "dentro de",
	// French
	"urgent", "imm[ée]diatement", "d[eè]s maintenant", "sans d[ée]lai", "derni[eè]re chance",
	"votre compte sera (suspendu|bloqu[ée]|ferm[ée]|d[ée]sactiv[ée])", "expire", "avant le",
	// German
	"dringend", "umgehend", "sofort", "unverz[uü]glich", "letzte (chance|m[oö]glichkeit)",
	"ihr konto wird (gesperrt|deaktiviert|geschlossen)", "l[aä]uft ab", "innerhalb von", "abgelaufen",
	// Greek
	"[εέ]πειγον", "[αά]μεσα", "αμ[εέ]σως", "τελευτα[ιί]α ευκαιρ[ιί]α",
	"ο λογαριασμ[οό]ς σας θα (ανασταλε[ιί]|απενεργοποιηθε[ιί]|κλε[ιί]σει)", "αναστολ[ηή]", "λ[ηή]γει", "εντ[οό]ς",
	// Language-agnostic deadline shapes
	// Deadlines only count when the sentence frames them as one. A bare
	// "2 days" matches delivery estimates and warranty text, not pressure.
	"(within|in|expires? in|only|last|remaining|left)\\s+\\d+\\s*(hours?|minutes?|days?)",
	"(in|[iî]n termen de|dentro de|en|dans|innerhalb von|εντ[οό]ς)\\s+\\d+\\s*(ore|zile|horas|d[ií]as|hores|dies|heures|jours|stunden|tagen|[ωώ]ρες|μ[εέ]ρες)",
	"\\b24\\s*(hours?|h|ore|horas|hores|heures|stunden|[ωώ]ρες)\\b",
].join("|"), "i");
const URL_LIKE_TEXT_PATTERN = /^(https?:\/\/)?(www\.)?[a-z0-9][a-z0-9-]*(\.[a-z0-9][a-z0-9-]*)+(\/\S*)?$/i;

const INLINE_TAGS = ["SPAN", "B", "STRONG", "EM", "I", "U", "SMALL", "LABEL", "A", "FONT", "MARK", "CODE"];

const IGNORED_TAGS = ["SCRIPT", "STYLE", "NOSCRIPT", "TEMPLATE", "SVG"];

const isVisible = (element: HTMLElement): boolean => {
	if (!element.isConnected) {
		return false;
	}

	const rect = element.getBoundingClientRect();
	if (!rect.width && !rect.height) {
		return false;
	}

	const style = window.getComputedStyle(element);
	return style.visibility !== "hidden" && style.display !== "none" && style.opacity !== "0";
};

const isIgnored = (element: Element | null): boolean => {
	while (element) {
		if (IGNORED_TAGS.indexOf(element.tagName) !== -1 || element.hasAttribute("data-ignore")) {
			return true;
		}
		element = element.parentElement;
	}

	return false;
};

// NodeFilter.SHOW_TEXT, spelled out so the module works without the global.
const SHOW_TEXT = 4;

const text = (value?: string | null): string => (value || "").replace(/\s+/g, " ").trim();

/**
 * Collects every piece of text that describes an input: its own attributes,
 * any associated or wrapping label, ARIA labels and the visible text that
 * immediately precedes it. Cloned phishing pages rarely keep meaningful
 * name/id attributes, so the surrounding copy is often the only clue.
 *
 * @param {HTMLInputElement} input - The input to describe.
 * @returns {string} - All descriptive text found for the input.
 */
const describeField = (input: HTMLInputElement): string => {
	const parts: string[] = [
		input.name, input.id, input.placeholder, input.className, input.type,
		input.getAttribute("autocomplete"), input.getAttribute("aria-label"), input.getAttribute("title"),
		input.getAttribute("data-name"), input.getAttribute("data-testid"), input.getAttribute("inputmode"),
	].map(text);

	const labelledBy = input.getAttribute("aria-labelledby");
	if (labelledBy) {
		labelledBy.split(/\s+/).forEach(id => parts.push(text(input.ownerDocument.getElementById(id)?.textContent)));
	}

	if (input.id) {
		input.ownerDocument.querySelectorAll(`label[for="${CSS.escape(input.id)}"]`).forEach(label => parts.push(text(label.textContent)));
	}

	const wrappingLabel = input.closest("label");
	if (wrappingLabel) {
		parts.push(text(wrappingLabel.textContent));
	}

	// The visible copy just before the field, e.g. a <div> acting as a label.
	let previous: Element | null = input.previousElementSibling;
	let hops = 0;
	while (previous && hops < 2) {
		if (!previous.querySelector("input, select, textarea")) {
			parts.push(text(previous.textContent).slice(0, 60));
		}
		previous = previous.previousElementSibling;
		hops++;
	}

	if (input.parentElement) {
		parts.push(text(input.parentElement.getAttribute("class")));
	}

	return parts.filter(Boolean).join(" ");
};

const isPasswordField = (input: HTMLInputElement): boolean => {
	if (input.type === "password") {
		return true;
	}

	// Some kits mask the field themselves to dodge password managers.
	const description = describeField(input);
	return PASSWORD_PATTERN.test(description) && !OTP_PATTERN.test(description);
};

const isCreditCardField = (input: HTMLInputElement): boolean => {
	if ((input.getAttribute("autocomplete") || "").indexOf("cc-") === 0) {
		return true;
	}

	const description = describeField(input);
	if (CC_PATTERN.test(description)) {
		return true;
	}

	// A 16-19 digit numeric field is a card number in all but name.
	const maxLength = input.maxLength;
	return (input.inputMode === "numeric" || input.type === "tel") && maxLength >= 14 && maxLength <= 19;
};

/**
 * Finds the block that visually groups the given fields. Prefers a real
 * <form>, otherwise walks up until the ancestor holds every field but is
 * still smaller than most of the viewport.
 *
 * @param {HTMLElement[]} fields - The fields that belong together.
 * @returns {HTMLElement | null} - The container to highlight.
 */
const groupContainer = (fields: HTMLElement[]): HTMLElement | null => {
	if (!fields.length) {
		return null;
	}

	const form = fields[0].closest("form");
	if (form) {
		return form as HTMLElement;
	}

	const viewportArea = window.innerWidth * window.innerHeight;
	let container: HTMLElement | null = fields[0].parentElement;
	let best: HTMLElement | null = fields[0];

	while (container && container !== document.body) {
		const rect = container.getBoundingClientRect();
		if (rect.width * rect.height > viewportArea * 0.8) {
			break;
		}

		best = container;
		if (fields.every(field => container.contains(field)) && container.querySelector("button, input[type='submit'], [role='button']")) {
			return container;
		}

		container = container.parentElement;
	}

	return best;
};

const collectInputs = (doc: Document): HTMLInputElement[] => {
	return Array.from(doc.querySelectorAll("input")).filter(input => {
		return input.type !== "hidden" && !isIgnored(input) && isVisible(input);
	}) as HTMLInputElement[];
};

const findDownloadElements = (doc: Document): HTMLElement[] => {
	const selector = "a, button, [role='button'], [onclick], input[type='button'], input[type='submit'], [class*='btn'], [class*='button'], [class*='download'], [id*='download']";
	const found: HTMLElement[] = [];

	doc.querySelectorAll(selector).forEach(node => {
		const element = node as HTMLElement;
		if (isIgnored(element) || !isVisible(element) || found.some(other => other.contains(element))) {
			return;
		}

		const href = element.getAttribute("href") || element.getAttribute("data-href") || element.getAttribute("data-url") || "";
		const label = text(element.textContent) || text(element.getAttribute("value")) || text(element.getAttribute("aria-label"));

		if (element.hasAttribute("download") || DOWNLOAD_EXTENSION_PATTERN.test(href) || DOWNLOAD_TEXT_PATTERN.test(label)) {
			found.push(element);
		}
	});

	return found;
};

/**
 * Reduces a hostname to the part that decides ownership, so subdomains of
 * the same site are not reported as deceptive.
 *
 * @param {string} host - The hostname to reduce.
 * @returns {string} - The registrable domain.
 */
const registrable = (host: string): string => {
	const labels = host.split(".");
	if (labels.length <= 2) {
		return host;
	}

	const lastTwo = labels.slice(-2).join(".");
	return labels.slice(MULTI_PART_SUFFIXES.indexOf(lastTwo) !== -1 ? -3 : -2).join(".");
};

const findSuspiciousLinks = (doc: Document): Finding[] => {
	const findings: Finding[] = [];

	doc.querySelectorAll("a[href]").forEach((node: HTMLAnchorElement) => {
		if (isIgnored(node) || !isVisible(node)) {
			return;
		}

		const label = text(node.textContent);
		if (!URL_LIKE_TEXT_PATTERN.test(label)) {
			return;
		}

		const shown = label.replace(/^https?:\/\//i, "").replace(/^www\./i, "").split(/[/?#]/)[0].toLowerCase();
		let actual: string;
		try {
			actual = new URL(node.href, doc.baseURI).hostname.replace(/^www\./i, "").toLowerCase();
		} catch {
			return;
		}

		// Compare what the address actually resolves to. A link reading
		// "example.com" that points at "login.example.com" is not deceptive.
		if (shown && actual && registrable(shown) !== registrable(actual)) {
			findings.push({ kind: "suspicious_link", element: node, vars: { shown, actual } });
		}
	});

	return findings;
};

/**
 * Walks up from an inline element to the closest block that is big enough
 * to highlight on its own.
 *
 * @param {HTMLElement | null} element - The element the text lives in.
 * @returns {HTMLElement | null} - The block worth spotlighting.
 */
const blockAncestor = (element: HTMLElement | null): HTMLElement | null => {
	let current = element;
	let hops = 0;

	while (current && hops < 4) {
		const rect = current.getBoundingClientRect();
		if (INLINE_TAGS.indexOf(current.tagName) === -1 && rect.height >= 14 && rect.width >= 60) {
			return current;
		}

		current = current.parentElement;
		hops++;
	}

	return element;
};

const extractQuote = (value: string, match: RegExpExecArray): string => {
	const start = Math.max(value.lastIndexOf(".", match.index), value.lastIndexOf("!", match.index)) + 1;
	const stop = value.slice(match.index).search(/[.!?]/);
	const end = stop === -1 ? value.length : match.index + stop + 1;
	const sentence = value.slice(start, end).trim() || value;

	return sentence.length > 140 ? `${sentence.slice(0, 137).trim()}…` : sentence;
};

/**
 * Looks for pressure tactics anywhere in the visible copy. Text nodes are
 * scanned first so the exact sentence can be quoted back; if a phrase is
 * split across nested elements, whole blocks are scanned as a fallback.
 *
 * @param {Document} doc - The document to scan.
 * @returns {{element: HTMLElement, quote: string} | null} - The strongest match.
 */
const findUrgencyText = (doc: Document): { element: HTMLElement; quote: string } | null => {
	let best: { element: HTMLElement; quote: string; length: number } | null = null;

	// A document without a body would make createTreeWalker throw and, since
	// this runs last, take every finding collected so far down with it.
	if (!doc.body) {
		return null;
	}

	const walker = doc.createTreeWalker(doc.body, SHOW_TEXT);
	let node = walker.nextNode();
	while (node) {
		const value = text(node.nodeValue);
		const parent = node.parentElement;
		const match = value.length > 10 ? URGENCY_PATTERN.exec(value) : null;

		if (match && parent && !isIgnored(parent)) {
			const element = blockAncestor(parent);
			if (element && isVisible(element) && (!best || value.length < best.length)) {
				best = { element, quote: extractQuote(value, match), length: value.length };
			}
		}

		node = walker.nextNode();
	}

	if (best) {
		return { element: best.element, quote: best.quote };
	}

	doc.querySelectorAll("h1, h2, h3, h4, p, div, li, td, section, header").forEach(node => {
		const element = node as HTMLElement;
		const value = text(element.textContent);
		if (!value || value.length > 260 || isIgnored(element) || !isVisible(element)) {
			return;
		}

		const match = URGENCY_PATTERN.exec(value);
		if (match && (!best || value.length < best.length)) {
			best = { element, quote: extractQuote(value, match), length: value.length };
		}
	});

	return best ? { element: best.element, quote: best.quote } : null;
};


/**
 * Scans the live DOM for every dangerous item and classifies the attack,
 * combining the triggering event name with page-content heuristics.
 *
 * @param {string} triggerEventName - The name of the event that fired.
 * @param {Document} [doc=document] - The document to scan.
 * @returns {Detection} - The attack type, the findings and the permission kind (if any).
 */
export const scanPage = (triggerEventName: string, doc: Document = document, declaredBrand?: string): Detection => {
	try {
		const findings: Finding[] = [];
		const inputs = collectInputs(doc);

		const cardFields = inputs.filter(isCreditCardField);
		if (cardFields.length) {
			findings.push({ kind: "cc_form", element: groupContainer(cardFields) });
		}

		const passwordFields = inputs.filter(input => isPasswordField(input) && cardFields.indexOf(input) === -1);
		if (passwordFields.length) {
			findings.push({ kind: "password_form", element: groupContainer(passwordFields) });
		}

		const url = analyzeUrl();
		const identity = claimedIdentity(doc, declaredBrand, element => !isIgnored(element) && isVisible(element));
		if (identity && !ownsDomain(identity.name, url.domain)) {
			findings.push({ kind: "brand_impersonation", element: identity.element, vars: { brand: identity.name, domain: url.domain } });
		}

		const downloads = findDownloadElements(doc);
		if (downloads.length) {
			findings.push({ kind: "download_link", element: downloads[0] });
		}

		findings.push(...findSuspiciousLinks(doc));

		const urgency = findUrgencyText(doc);
		if (urgency) {
			findings.push({ kind: "urgency_text", element: urgency.element, vars: { quote: urgency.quote } });
		}

		const permissionKind = PERMISSION_EVENTS[triggerEventName] || null;

		let type: AttackType;
		if (MALWARE_EVENTS.indexOf(triggerEventName) !== -1) {
			type = "malware";
		} else if (permissionKind) {
			type = "fake_page";
		} else if (cardFields.length) {
			type = "fraud";
		} else if (passwordFields.length) {
			type = "login";
		} else if (downloads.length) {
			type = "malware";
		} else {
			type = "fake_page";
		}

		return { type, findings, permissionKind };
	} catch {
		return { type: "fake_page", findings: [], permissionKind: PERMISSION_EVENTS[triggerEventName] || null };
	}
};
