import { StringCatalog } from "./catalog";
import enUS from "./locales/en-US";
import roRO from "./locales/ro-RO";
import esES from "./locales/es-ES";
import caES from "./locales/ca-ES";
import es419 from "./locales/es-419";
import ptBR from "./locales/pt-BR";
import ptPT from "./locales/pt-PT";
import frFR from "./locales/fr-FR";
import deDE from "./locales/de-DE";
import elGR from "./locales/el-GR";

export type Locale = "en-US" | "ro-RO" | "es-ES" | "ca-ES" | "es-419" | "pt-BR" | "pt-PT" | "fr-FR" | "de-DE" | "el-GR";

const CATALOGS: Record<Locale, StringCatalog> = {
	"en-US": enUS,
	"ro-RO": roRO,
	"es-ES": esES,
	"ca-ES": caES,
	"es-419": es419,
	"pt-BR": ptBR,
	"pt-PT": ptPT,
	"fr-FR": frFR,
	"de-DE": deDE,
	"el-GR": elGR,
};

const CANONICAL: Record<string, Locale> = Object.keys(CATALOGS).reduce((map, tag) => {
	map[tag.toLowerCase()] = tag as Locale;
	return map;
}, {} as Record<string, Locale>);

const ALIASES: Record<string, Locale> = {
	"es-latam": "es-419",
	"es-la": "es-419",
};

const LANGUAGE_DEFAULTS: Record<string, Locale> = {
	en: "en-US",
	ro: "ro-RO",
	es: "es-419",
	ca: "ca-ES",
	pt: "pt-PT",
	fr: "fr-FR",
	de: "de-DE",
	el: "el-GR",
};

const matchOne = (raw?: string): Locale | null => {
	if (!raw) {
		return null;
	}

	const tag = raw.trim().toLowerCase().replace(/_/g, "-");
	if (!tag) {
		return null;
	}

	if (ALIASES[tag]) {
		return ALIASES[tag];
	}

	if (CANONICAL[tag]) {
		return CANONICAL[tag];
	}

	const language = tag.split("-")[0];
	return LANGUAGE_DEFAULTS[language] || null;
};

/**
 * Resolves the first matching locale from the provided candidates,
 * falling back to "en-US" when none match.
 *
 * @param {...(string | undefined)} candidates - Locale tags in priority order.
 * @returns {Locale} - The resolved locale.
 */
export const resolveLocale = (...candidates: (string | undefined)[]): Locale => {
	for (const candidate of candidates) {
		const match = matchOne(candidate);
		if (match) {
			return match;
		}
	}

	return "en-US";
};

export type Translator = (key: keyof StringCatalog, vars?: Record<string, string | number>) => string;

/**
 * Creates a translator bound to the given locale. Unknown keys fall back to en-US.
 * Templates may contain {placeholders} replaced from the vars map.
 *
 * @param {Locale} locale - The locale to translate into.
 * @returns {Translator} - The translating function.
 */
export const createTranslator = (locale: Locale): Translator => {
	const catalog = CATALOGS[locale];

	return (key, vars) => {
		const template = catalog[key] || CATALOGS["en-US"][key] || key;
		if (!vars) {
			return template;
		}

		return template.replace(/\{(\w+)\}/g, (token, name) => (name in vars ? String(vars[name]) : token));
	};
};
