import { brandForms, canonicalBrand, normalize } from "./brands";

export type Identity = {
	name: string;
	element: HTMLElement | null;
	confidence: number;
};

// How much each place a name appears is worth. A name needs SCORE_THRESHOLD
// points before we are willing to tell the user "this page pretends to be X",
// so a single weak hint is never enough on its own.
const WEIGHTS = {
	declared: 100,
	siteName: 4,
	copyright: 4,
	appName: 3,
	// A logo's alt text or file name is a stronger claim of identity than a
	// heading, so logo + heading is enough while title + heading is not.
	logo: 3,
	title: 2,
	heading: 1,
};

const SCORE_THRESHOLD = 4;

// Caps so a huge cloned DOM can never stall the redirect path.
const MAX_TEXT_NODES = 4000;
const MAX_ELEMENTS = 600;

// Words that describe what a page does rather than who owns it. Covers the
// ten locales the tutorial ships with, without diacritics (text is normalised
// before comparison).
const GENERIC = [
	"login", "log in", "signin", "sign in", "sign on", "sign up", "logon", "account", "my account",
	"home", "homepage", "welcome", "secure", "security", "verify", "verification", "confirm",
	"portal", "index", "untitled", "document", "page", "dashboard", "error", "support", "help",
	"customer service", "online banking", "internet banking", "e banking", "webmail", "email", "mail",
	"password", "congratulations", "notification", "notifications", "update", "payment", "invoice",
	"order", "delivery", "shipment", "tracking", "download", "file", "share", "shared", "inbox",
	"logo", "brand", "image", "img", "picture", "photo", "banner", "header", "footer", "icon", "avatar",
	"autentificare", "conectare", "cont", "contul meu", "bine ati venit", "parola", "felicitari",
	"livrare", "comanda", "factura", "plata", "notificare",
	"iniciar sesion", "inicio de sesion", "acceso", "cuenta", "mi cuenta", "bienvenido", "bienvenida",
	"contrasena", "felicidades", "entrega", "pedido", "factura", "pago", "aviso",
	"inici de sessio", "compte", "benvingut", "contrasenya",
	"iniciar sessao", "entrar", "conta", "minha conta", "bem vindo", "palavra passe", "senha",
	"parabens", "entrega", "encomenda", "fatura", "pagamento", "aviso",
	"connexion", "se connecter", "identification", "espace client", "bienvenue", "mot de passe",
	"felicitations", "livraison", "commande", "facture", "paiement", "avis",
	"anmelden", "anmeldung", "einloggen", "konto", "mein konto", "willkommen", "kennwort", "passwort",
	"gluckwunsch", "lieferung", "bestellung", "rechnung", "zahlung", "hinweis",
	"συνδεση", "εισοδος", "λογαριασμος", "καλως ηρθατε", "κωδικος", "συγχαρητηρια", "παραδοση",
	"παραγγελια", "τιμολογιο", "πληρωμη", "ειδοποιηση",
];

// Legal suffixes and copyright boilerplate to strip before comparing names.
const LEGAL_SUFFIX = /[\s,]+(s\s*\.?\s*a\s*\.?\s*(r\s*\.?\s*l\s*\.?)?|s\s*\.?\s*r\s*\.?\s*l\s*\.?|s\s*\.?\s*p\s*\.?\s*a\s*\.?|n\s*\.?\s*v\s*\.?|b\s*\.?\s*v\s*\.?|inc|incorporated|ltd|limited|llc|plc|gmbh|mbh|ag|kg|oy|ab|group|holdings?)\s*\.?\s*$/i;
const COPYRIGHT_NOISE = /(all rights reserved|toate drepturile rezervate|todos los derechos reservados|tots els drets reservats|todos os direitos reservados|tous droits reserves|alle rechte vorbehalten|με επιφυλαξη παντος δικαιωματος)/i;

// NodeFilter.SHOW_TEXT, spelled out so the module works without the global.
const SHOW_TEXT = 4;

const text = (value?: string | null): string => (value || "").replace(/\s+/g, " ").trim();

// Individual words drawn from the generic phrases above, plus the filler that
// glues them together, so "sign in to your account" is recognised as generic
// while "Microsoft" or "Banca Transilvania" is not.
const GENERIC_WORDS: Record<string, boolean> = {};
GENERIC.join(" ").split(" ").concat(["to", "your", "the", "my", "our", "a", "an", "of", "for", "and", "or",
	"la", "el", "los", "las", "su", "tu", "de", "del", "al", "en", "y",
	"o", "os", "as", "sua", "seu", "do", "da", "dos", "das", "e",
	"le", "les", "votre", "vos", "du", "des", "et",
	"ihr", "ihre", "der", "die", "das", "den", "und", "zum", "zur",
	"στο", "στη", "σας", "σου", "και", "το", "τη", "της", "του",
	"cont", "contul", "tau", "dvs", "si"]).forEach(word => {
	if (word) {
		GENERIC_WORDS[word] = true;
	}
});

const isGeneric = (value: string): boolean => {
	const normalized = normalize(value).trim();
	if (!normalized) {
		return true;
	}

	if (GENERIC.indexOf(normalized) !== -1) {
		return true;
	}

	// Generic only when every single word is page furniture — one real word
	// is enough to make it a possible name.
	return normalized.split(" ").every(word => GENERIC_WORDS[word] === true);
};

/**
 * Decides whether a string could be an organisation's name rather than a
 * description of the page.
 *
 * @param {string} value - The candidate string.
 * @returns {boolean} - True when the string looks like a name.
 */
const isPlausibleName = (value: string): boolean => {
	const words = value.split(" ");

	return value.length >= 2 && value.length <= 40 && words.length <= 5 && /[a-zΑ-Ωα-ω]/i.test(value) && !isGeneric(value);
};

/**
 * Splits a headline or title into the parts that could carry a name.
 *
 * @param {string} value - The raw text.
 * @returns {string[]} - Candidate names.
 */
const segments = (value: string): string[] => {
	return value.split(/[|–—·•>»/]|\s+[-‒]\s+/).map(text).filter(isPlausibleName);
};

/**
 * Extracts the owner's name out of a copyright line, e.g.
 * "© 2026 Banca Transilvania S.A. Toate drepturile rezervate" -> "Banca Transilvania".
 *
 * @param {string} value - The copyright line.
 * @returns {string} - The owner's name, or an empty string.
 */
const copyrightOwner = (value: string): string => {
	let owner = text(value
		.replace(COPYRIGHT_NOISE, "")
		.replace(/©|\(c\)|&copy;|copyright/gi, "")
		.replace(/\b(19|20)\d{2}(\s*[-–]\s*(19|20)?\d{2,4})?\b/g, ""));

	// Strip legal suffixes repeatedly: "Acme Holding S.A." loses both parts.
	let previous = "";
	while (owner && owner !== previous) {
		previous = owner;
		owner = text(owner.replace(LEGAL_SUFFIX, ""));
	}

	const name = text(owner.replace(/[.,;|]+$/, ""));

	return isPlausibleName(name) ? name : "";
};

/**
 * Turns an asset reference into searchable words, so a logo served as
 * "/assets/banca-transilvania-logo@2x.svg" still reveals the name. Inline SVG
 * data URIs are decoded, since their markup often contains the wordmark.
 *
 * @param {string | null} [value] - A src, data-src or href attribute.
 * @returns {string} - Words extracted from the reference.
 */
export const assetName = (value?: string | null): string => {
	if (!value) {
		return "";
	}

	if (value.indexOf("data:") === 0) {
		if (value.indexOf("image/svg+xml") === -1 || value.indexOf(";base64") !== -1) {
			return "";
		}

		try {
			return text(decodeURIComponent(value.slice(value.indexOf(",") + 1)).replace(/<[^>]*>/g, " "));
		} catch {
			return "";
		}
	}

	const file = value.split(/[?#]/)[0].split("/").pop() || "";

	return text(file.replace(/\.[a-z0-9]+$/i, "").replace(/[-_.@+%]+/g, " ").replace(/\b(logo|icon|favicon|header|brand|light|dark|white|black|small|large|\d+x|\d+)\b/gi, " "));
};

/**
 * Works out which organisation a page presents itself as, without relying on
 * a list of known brands. Every place a name can appear contributes points;
 * a name is only reported once it clears the threshold, which keeps page
 * furniture like "Sign in" or "Congratulations!" from being mistaken for one.
 *
 * A brand declared by the campaign always wins — the platform that built the
 * landing page knows what it imitates far better than any heuristic.
 *
 * @param {Document} doc - The document to inspect.
 * @param {string} [declared] - Brand supplied by config or the campaign token.
 * @param {(element: HTMLElement) => boolean} isUsable - Filters out hidden or overlay elements.
 * @returns {Identity | null} - The claimed identity, if one is convincing enough.
 */
export const claimedIdentity = (doc: Document, declared: string | undefined, isUsable: (element: HTMLElement) => boolean): Identity | null => {
	const scores: Record<string, { name: string; score: number; element: HTMLElement | null; seen: HTMLElement[] }> = {};

	const add = (raw: string, weight: number, element: HTMLElement | null) => {
		const value = text(raw);
		if (!value || !isPlausibleName(value)) {
			return;
		}

		// "Acme logo" in an alt attribute and "Acme" in a heading are the same
		// claim, so strip the descriptive noise before scoring.
		const cleaned = text(value.replace(/\b(logo|logotype|wordmark|brand|icon|image|banner|header|home|homepage)\b/gi, "")) || value;
		const name = canonicalBrand(cleaned) || cleaned;
		const key = normalize(name).trim();
		if (!key) {
			return;
		}

		const entry = scores[key] || (scores[key] = { name, score: 0, element: null, seen: [] });

		// One element counts once, however many attributes repeat the name.
		// Otherwise a single <svg aria-label="Facebook"><text>Facebook</text></svg>
		// would score twice and invent a brand on an unrelated page.
		if (element) {
			if (entry.seen.indexOf(element) !== -1) {
				return;
			}
			entry.seen.push(element);
		}

		entry.score += weight;
		entry.element = entry.element || element;
	};

	// A declared brand is authoritative and bypasses the plausibility filter,
	// which would otherwise reject a short name like "X" or "BT".
	if (text(declared)) {
		const name = canonicalBrand(text(declared)) || text(declared);
		scores[normalize(name).trim()] = { name, score: WEIGHTS.declared, element: null, seen: [] };
	}

	const meta = (selector: string): string => text(doc.querySelector(selector)?.getAttribute("content"));
	add(meta("meta[property='og:site_name']"), WEIGHTS.siteName, null);
	add(meta("meta[name='application-name']"), WEIGHTS.appName, null);
	add(meta("meta[name='apple-mobile-web-app-title']"), WEIGHTS.appName, null);
	add(meta("meta[name='author']"), WEIGHTS.appName, null);
	segments(text(doc.title)).forEach(part => add(part, WEIGHTS.title, null));
	segments(meta("meta[property='og:title']")).forEach(part => add(part, WEIGHTS.title, null));

	Array.prototype.slice.call(doc.querySelectorAll("img, svg, [class*='logo'], [id*='logo'], [class*='brand']"), 0, MAX_ELEMENTS).forEach((node: HTMLElement) => {
		const element = node;
		if (!isUsable(element)) {
			return;
		}

		[
			element.getAttribute("alt"),
			element.getAttribute("aria-label"),
			element.getAttribute("title"),
			assetName(element.getAttribute("src")),
			assetName(element.getAttribute("data-src")),
			element.tagName.toUpperCase() === "SVG" ? text(element.textContent) : "",
		].forEach(value => add(text(value), WEIGHTS.logo, element));
	});

	Array.prototype.slice.call(doc.querySelectorAll("h1, h2, header"), 0, MAX_ELEMENTS).forEach((node: HTMLElement) => {
		const element = node;
		if (isUsable(element)) {
			segments(text(element.textContent)).forEach(part => add(part, WEIGHTS.heading, element));
		}
	});

	// A copyright line names the owner outright and is rarely edited by the
	// people cloning a page, which makes it one of the strongest signals.
	// Walking text nodes keeps this linear: querying every div/span and then
	// reading each one's recursive textContent is quadratic on deep clones.
	if (doc.body) {
		const walker = doc.createTreeWalker(doc.body, SHOW_TEXT);
		let node = walker.nextNode();
		let scanned = 0;

		while (node && scanned < MAX_TEXT_NODES) {
			scanned++;
			const value = text(node.nodeValue);

			if (value.length <= 160 && /©|\(c\)|copyright/i.test(value)) {
				const element = node.parentElement;
				if (element && isUsable(element)) {
					add(copyrightOwner(value), WEIGHTS.copyright, element);
				}
			}

			node = walker.nextNode();
		}
	}

	let best: Identity | null = null;
	Object.keys(scores).forEach(key => {
		const entry = scores[key];
		if (entry.score >= SCORE_THRESHOLD && (!best || entry.score > best.confidence)) {
			best = { name: entry.name, element: entry.element, confidence: entry.score };
		}
	});

	return best;
};

/**
 * Checks whether a name appears in a host as a label of its own, rather than
 * as an accidental substring. Matching on substrings alone would let a short
 * brand like "ING" light up inside the perfectly ordinary subdomain "login".
 *
 * @param {string} name - The organisation name.
 * @param {string} host - A hostname or subdomain chain.
 * @returns {boolean} - True when the host really carries the name.
 */
export const nameAppearsIn = (name: string, host: string): boolean => {
	// normalize() turns dots and hyphens into spaces, so labels fall out of it.
	// "Banca Transilvania" therefore has to match the label "bancatransilvania",
	// the pair "banca"+"transilvania", or a label that embeds the whole name.
	const labels = normalize(host).trim().split(" ").filter(Boolean);
	if (!labels.length) {
		return false;
	}

	const { full, abbreviations } = brandForms(name);

	// Abbreviations must be a label of their own: "bt.example.com" counts,
	// the "bt" inside "abtract" does not.
	if (abbreviations.some(alias => labels.indexOf(alias) !== -1)) {
		return true;
	}

	return full.some(target => {
		if (target.length < 4) {
			return labels.indexOf(target) !== -1;
		}

		if (labels.indexOf(target) !== -1) {
			return true;
		}

		// Consecutive labels only. Joining every label of the host would let
		// "abanca.transilvaniatours.xyz" masquerade as "Banca Transilvania".
		for (let start = 0; start < labels.length; start++) {
			let joined = "";
			for (let end = start; end < labels.length && joined.length < target.length; end++) {
				joined += labels[end];
				if (joined === target) {
					return true;
				}
			}
		}

		// Embedded in one label, e.g. "securebancatransilvania.xyz". Long names
		// only, so short ones can't collide with ordinary words.
		return target.length >= 8 && labels.some(label => label.indexOf(target) !== -1);
	});
};

/**
 * Checks whether the name is actually part of the domain, in which case the
 * page is not pretending to be anyone else.
 *
 * @param {string} name - The organisation name.
 * @param {string} domain - The registrable domain.
 * @returns {boolean} - True when the domain already carries the name.
 */
export const ownsDomain = (name: string, domain: string): boolean => {
	// Substring containment would be catastrophic here: it would treat
	// "microsoft-login.xyz" as belonging to Microsoft and suppress the very
	// warning the user needs. The name has to BE the domain's own label —
	// "training.com" is not ING, "pineapple.com" is not Apple.
	//
	// Split on dots only. Hyphens stay inside the label, so "banca-transilvania"
	// still resolves to the brand while "microsoft-login" does not.
	const labels = domain.split(".").map(label => normalize(label).replace(/ /g, "")).filter(Boolean);
	if (!labels.length) {
		return true;
	}

	// Drop the public suffix; "bancatransilvania.ro" is owned by its first label.
	const owner = labels.slice(0, Math.max(labels.length - 1, 1));
	const { full, abbreviations } = brandForms(name);

	if (abbreviations.some(alias => owner.indexOf(alias) !== -1)) {
		return true;
	}

	return full.some(target => {
		if (!target) {
			return false;
		}

		if (owner.indexOf(target) !== -1) {
			return true;
		}

		// A name split across consecutive labels, e.g. "banca.transilvania.ro".
		for (let start = 0; start < owner.length; start++) {
			let joined = "";
			for (let end = start; end < owner.length && joined.length < target.length; end++) {
				joined += owner[end];
				if (joined === target) {
					return true;
				}
			}
		}

		return false;
	});
};
