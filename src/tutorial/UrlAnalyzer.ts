import { StringCatalog } from "../i18n/catalog";

export type UrlAnalysis = {
	href: string;
	scheme: string;
	host: string;
	subdomain: string;
	domain: string;
	path: string;
	reasonKey: keyof StringCatalog;
	vars: Record<string, string>;
};

// Two-level public suffixes we need so that the registrable domain of
// e.g. "shop.example.co.uk" resolves to "example.co.uk" and not "co.uk".
export const MULTI_PART_SUFFIXES = [
	"co.uk", "org.uk", "gov.uk", "ac.uk", "me.uk", "net.uk", "ltd.uk", "plc.uk", "sch.uk",
	"com.br", "net.br", "org.br", "gov.br", "edu.br", "com.ar", "com.mx", "com.co", "com.pe",
	"com.ve", "com.uy", "com.ec", "com.bo", "com.py", "com.do", "com.gt", "com.sv", "com.ni",
	"com.au", "net.au", "org.au", "edu.au", "gov.au", "co.nz", "net.nz", "org.nz", "govt.nz",
	"co.za", "org.za", "co.jp", "or.jp", "ne.jp", "ac.jp", "go.jp", "co.kr", "or.kr",
	"co.in", "net.in", "org.in", "firm.in", "gen.in", "ind.in", "gov.in", "ac.in", "edu.in",
	"com.tr", "gov.tr", "edu.tr", "com.cn", "net.cn", "org.cn", "gov.cn", "com.hk", "org.hk",
	"com.sg", "com.my", "com.ph", "com.vn", "co.id", "co.th", "com.tw", "com.pk", "com.bd",
	"com.pt", "com.es", "com.pl", "com.gr", "com.ro", "com.ua", "com.ru", "com.cy", "com.mt",
	"co.il", "com.sa", "com.eg", "com.ng", "com.gh", "com.ke", "co.ke", "co.tz", "co.ug",
	// Hosting suffixes people can register a name under, so the label in front
	// belongs to whoever signed up, not to the platform.
	"github.io", "gitlab.io", "netlify.app", "vercel.app", "pages.dev", "workers.dev",
	"web.app", "firebaseapp.com", "herokuapp.com", "azurewebsites.net", "cloudfront.net",
	"s3.amazonaws.com", "blogspot.com", "wordpress.com", "weebly.com", "wixsite.com",
	"myshopify.com", "squarespace.com", "glitch.me", "repl.co", "surge.sh", "onrender.com",
];

const SUSPICIOUS_TLDS = [
	"xyz", "top", "click", "link", "gq", "tk", "ml", "cf", "ga", "buzz", "monster", "rest",
	"country", "loan", "work", "fit", "surf", "cam", "zip", "mov", "quest", "cfd", "sbs", "icu",
];

// Anchored to label boundaries: without this, "paid.example.com" matches "id"
// and "academy.example.com" matches "my".
const BRANDISH_SUBDOMAIN_PATTERN = /(^|[.-])(login|signin|sign-in|secure|security|verify|verification|account|accounts|auth|update|confirm|support|billing|payment|webmail|mail|portal|service|id|my)([.-]|$)/i;

const IPV4_PATTERN = /^\d{1,3}(\.\d{1,3}){3}$/;
// URL.hostname wraps IPv6 literals in brackets.
const IPV6_PATTERN = /^\[[0-9a-f:]+\]$/i;

/**
 * Splits a hostname into its registrable domain and the subdomain prefix.
 *
 * @param {string} host - The hostname to split.
 * @returns {[string, string]} - A tuple of [subdomain, registrableDomain].
 */
const splitHost = (host: string): [string, string] => {
	const labels = host.split(".");
	if (labels.length <= 2) {
		return ["", host];
	}

	const lastTwo = labels.slice(-2).join(".");
	const size = MULTI_PART_SUFFIXES.includes(lastTwo) ? 3 : 2;

	return [labels.slice(0, -size).join("."), labels.slice(-size).join(".")];
};

/**
 * Analyses the current URL and decides which explanation best describes
 * why the address should have raised suspicion.
 *
 * @param {string} [href=window.location.href] - The URL to analyse.
 * @returns {UrlAnalysis} - The parsed URL parts plus the explanation key and its variables.
 */
export const analyzeUrl = (href: string = window.location.href): UrlAnalysis => {
	let url: URL;
	try {
		url = new URL(href);
	} catch {
		return { href, scheme: "", host: href, subdomain: "", domain: href, path: "", reasonKey: "url_reason_generic", vars: { domain: href } };
	}

	const host = url.hostname;
	// "https://microsoft.com@evil.example/" reads as Microsoft to a victim, so
	// the userinfo has to stay visible; likewise a non-default port.
	const credentials = url.username ? `${url.username}${url.password ? ":" + url.password : ""}@` : "";
	const port = url.port ? `:${url.port}` : "";
	const [subdomain, domain] = splitHost(host);
	const tld = domain.split(".").pop() || "";
	const fullPath = `${port}${url.pathname === "/" ? "" : url.pathname}${url.search}${url.hash}`;
	const path = fullPath.length > 42 ? `${fullPath.slice(0, 42)}…` : fullPath;

	const base: Omit<UrlAnalysis, "reasonKey" | "vars"> = {
		href,
		scheme: `${url.protocol}//${credentials}`,
		host,
		subdomain,
		domain,
		path,
	};

	// A long, cluttered address is itself a warning sign: legitimate sign-in
	// pages sit on a short domain, not a chain of subdomains and random text.
	const visible = `${host}${url.pathname}`;
	const isCluttered = host.split(".").length >= 4
		|| visible.length > 60
		|| /\d{4,}/.test(host)
		|| (host.match(/-/g) || []).length >= 3
		|| /[a-z0-9]{20,}/i.test(host);

	let reasonKey: keyof StringCatalog = "url_reason_generic";
	if (IPV4_PATTERN.test(host) || IPV6_PATTERN.test(host)) {
		reasonKey = "url_reason_ip";
	} else if (host.indexOf("xn--") !== -1) {
		reasonKey = "url_reason_punycode";
	} else if (subdomain && BRANDISH_SUBDOMAIN_PATTERN.test(subdomain)) {
		reasonKey = "url_reason_brand_subdomain";
	} else if (isCluttered) {
		reasonKey = "url_reason_long";
	} else if (SUSPICIOUS_TLDS.includes(tld)) {
		reasonKey = "url_reason_tld";
	} else if (domain.indexOf("-") !== -1) {
		reasonKey = "url_reason_hyphen";
	}

	return { ...base, reasonKey, vars: { host, domain, subdomain, tld } };
};
