export type Brand = {
	// Name shown to the user.
	name: string;
	// Full-word spellings, matched case-insensitively and without diacritics.
	aliases?: string[];
	// Abbreviations of three characters or fewer. These are only accepted when
	// they appear in upper case in the original text, so "ING" matches but the
	// Portuguese word "nos" or an English "-ing" ending never does.
	short?: string[];
};

/**
 * A short list of frequently imitated brands. This is deliberately NOT the
 * mechanism that detects impersonation — no bundled list could cover every
 * brand in every language, and it would go stale immediately.
 *
 * Impersonation is decided by Identity.ts, which compares the name a page
 * claims for itself against the domain it is served from, and by the brand
 * the campaign declares (the `brand` option or `ats_brand` in the token).
 *
 * This list only does two small jobs:
 *   1. normalise a product name to its owner, so "Outlook", "OneDrive" and
 *      "Office 365" all show up as "Microsoft";
 *   2. recognise names written as abbreviations ("BT24", "NBG", "CGD") that
 *      the generic logic would otherwise treat as meaningless tokens.
 */
export const BRANDS: Brand[] = [
	// --- global technology & workplace ---
	{ name: "Microsoft", aliases: ["microsoft", "microsoft 365", "office 365", "office365", "microsoft office", "outlook", "onedrive", "sharepoint", "microsoft teams", "windows live", "azure"], short: ["o365"] },
	{ name: "Google", aliases: ["google", "gmail", "google drive", "google workspace", "google account"] },
	{ name: "Apple", aliases: ["apple", "icloud", "apple id", "itunes"] },
	{ name: "Amazon", aliases: ["amazon", "amazon web services", "aws", "prime video"] },
	{ name: "Meta", aliases: ["facebook", "instagram", "whatsapp", "messenger", "meta business"] },
	{ name: "LinkedIn", aliases: ["linkedin"] },
	{ name: "X", aliases: ["twitter"] },
	{ name: "TikTok", aliases: ["tiktok"] },
	{ name: "Telegram", aliases: ["telegram"] },
	{ name: "Snapchat", aliases: ["snapchat"] },
	{ name: "Netflix", aliases: ["netflix"] },
	{ name: "Spotify", aliases: ["spotify"] },
	{ name: "Disney+", aliases: ["disney plus", "disney+"] },
	{ name: "HBO Max", aliases: ["hbo max", "hbo"] },
	{ name: "Dropbox", aliases: ["dropbox"] },
	{ name: "DocuSign", aliases: ["docusign"] },
	{ name: "Adobe", aliases: ["adobe", "adobe acrobat", "adobe sign"] },
	{ name: "WeTransfer", aliases: ["wetransfer"] },
	{ name: "Zoom", aliases: ["zoom"] },
	{ name: "Slack", aliases: ["slack"] },
	{ name: "Salesforce", aliases: ["salesforce"] },
	{ name: "Oracle", aliases: ["oracle"] },
	{ name: "SAP", aliases: ["sap concur"], short: ["sap"] },
	{ name: "IBM", aliases: ["ibm"] },
	{ name: "GitHub", aliases: ["github"] },
	{ name: "GitLab", aliases: ["gitlab"] },
	{ name: "Atlassian", aliases: ["atlassian", "jira", "confluence"] },
	{ name: "Notion", aliases: ["notion"] },
	{ name: "Canva", aliases: ["canva"] },
	{ name: "OpenAI", aliases: ["openai", "chatgpt"] },
	{ name: "Booking.com", aliases: ["booking com", "booking.com"] },
	{ name: "Airbnb", aliases: ["airbnb"] },
	{ name: "Uber", aliases: ["uber", "uber eats"] },
	{ name: "eBay", aliases: ["ebay"] },
	{ name: "AliExpress", aliases: ["aliexpress", "alibaba"] },
	{ name: "Temu", aliases: ["temu"] },
	{ name: "Shein", aliases: ["shein"] },
	{ name: "Steam", aliases: ["steam", "steam community"] },
	{ name: "Epic Games", aliases: ["epic games", "fortnite"] },
	{ name: "PlayStation", aliases: ["playstation", "psn"] },
	{ name: "Xbox", aliases: ["xbox"] },
	{ name: "Roblox", aliases: ["roblox"] },
	{ name: "Discord", aliases: ["discord"] },
	{ name: "Twitch", aliases: ["twitch"] },

	// --- payments, cards & crypto ---
	{ name: "PayPal", aliases: ["paypal"] },
	{ name: "Stripe", aliases: ["stripe"] },
	{ name: "Visa", aliases: ["visa"] },
	{ name: "Mastercard", aliases: ["mastercard", "maestro"] },
	{ name: "American Express", aliases: ["american express", "americanexpress", "amex"] },
	{ name: "Revolut", aliases: ["revolut"] },
	{ name: "Wise", aliases: ["transferwise"] },
	{ name: "N26", aliases: ["n26"] },
	{ name: "Klarna", aliases: ["klarna"] },
	{ name: "Payoneer", aliases: ["payoneer"] },
	{ name: "Skrill", aliases: ["skrill"] },
	{ name: "Western Union", aliases: ["western union", "moneygram"] },
	{ name: "Mercado Pago", aliases: ["mercado pago", "mercadopago", "mercado libre", "mercadolibre"] },
	{ name: "MB WAY", aliases: ["mb way", "mbway"] },
	{ name: "Bizum", aliases: ["bizum"] },
	{ name: "Binance", aliases: ["binance"] },
	{ name: "Coinbase", aliases: ["coinbase"] },
	{ name: "Kraken", aliases: ["kraken"] },
	{ name: "MetaMask", aliases: ["metamask"] },
	{ name: "Ledger", aliases: ["ledger live"] },
	{ name: "Crypto.com", aliases: ["crypto com", "crypto.com"] },

	// --- banks: Romania ---
	{ name: "Banca Transilvania", aliases: ["banca transilvania", "bancatransilvania", "neobt", "bt pay", "bt24"], short: ["bt"] },
	{ name: "BCR", aliases: ["banca comerciala romana", "george bcr"], short: ["bcr"] },
	{ name: "BRD", aliases: ["banca romana pentru dezvoltare", "brd groupe societe generale", "you brd"], short: ["brd"] },
	{ name: "ING", aliases: ["ing bank", "ing direct", "ing home bank", "home'bank"], short: ["ing"] },
	{ name: "Raiffeisen Bank", aliases: ["raiffeisen", "raiffeisenbank", "smart mobile raiffeisen"] },
	{ name: "UniCredit", aliases: ["unicredit", "unicredit bank"] },
	{ name: "CEC Bank", aliases: ["cec bank"], short: ["cec"] },
	{ name: "Alpha Bank", aliases: ["alpha bank"] },
	{ name: "OTP Bank", aliases: ["otp bank", "otpdirekt"] },
	{ name: "First Bank", aliases: ["first bank"] },
	{ name: "Libra Internet Bank", aliases: ["libra internet bank", "libra bank"] },
	{ name: "Patria Bank", aliases: ["patria bank"] },
	{ name: "Garanti BBVA", aliases: ["garanti bbva", "garanti bank"] },
	{ name: "Erste", aliases: ["erste bank", "erste group"] },
	{ name: "Intesa Sanpaolo", aliases: ["intesa sanpaolo", "intesa"] },

	// --- banks: Spain & Latin America ---
	{ name: "Santander", aliases: ["santander", "banco santander", "santander totta"] },
	{ name: "BBVA", aliases: ["bbva"] },
	{ name: "CaixaBank", aliases: ["caixabank", "la caixa", "imagin"] },
	{ name: "Banco Sabadell", aliases: ["banco sabadell", "sabadell"] },
	{ name: "Bankinter", aliases: ["bankinter"] },
	{ name: "Unicaja", aliases: ["unicaja"] },
	{ name: "Ibercaja", aliases: ["ibercaja"] },
	{ name: "Kutxabank", aliases: ["kutxabank"] },
	{ name: "Openbank", aliases: ["openbank"] },
	{ name: "Abanca", aliases: ["abanca"] },
	{ name: "Cajamar", aliases: ["cajamar"] },
	{ name: "Banorte", aliases: ["banorte"] },
	{ name: "Citibanamex", aliases: ["citibanamex", "banamex"] },
	{ name: "Bancolombia", aliases: ["bancolombia"] },
	{ name: "Davivienda", aliases: ["davivienda"] },
	{ name: "Banco de Chile", aliases: ["banco de chile"] },
	{ name: "Scotiabank", aliases: ["scotiabank"] },
	{ name: "Interbank", aliases: ["interbank"] },
	{ name: "Banco de Crédito", aliases: ["banco de credito", "viabcp"] },

	// --- banks: Portugal & Brazil ---
	{ name: "Caixa Geral de Depósitos", aliases: ["caixa geral de depositos", "caixadirecta"], short: ["cgd"] },
	{ name: "Millennium BCP", aliases: ["millennium bcp", "millennium"], short: ["bcp"] },
	{ name: "Novo Banco", aliases: ["novo banco"] },
	{ name: "Banco BPI", aliases: ["banco bpi"], short: ["bpi"] },
	{ name: "Montepio", aliases: ["montepio"] },
	{ name: "Crédito Agrícola", aliases: ["credito agricola"] },
	{ name: "ActivoBank", aliases: ["activobank"] },
	{ name: "Itaú", aliases: ["itau", "itau unibanco"] },
	{ name: "Bradesco", aliases: ["bradesco"] },
	{ name: "Banco do Brasil", aliases: ["banco do brasil"] },
	{ name: "Caixa Econômica Federal", aliases: ["caixa economica federal", "caixa economica"] },
	{ name: "Nubank", aliases: ["nubank"] },
	{ name: "Sicredi", aliases: ["sicredi"] },
	{ name: "PicPay", aliases: ["picpay"] },

	// --- banks: France ---
	{ name: "BNP Paribas", aliases: ["bnp paribas", "bnpparibas"] },
	{ name: "Société Générale", aliases: ["societe generale", "sogecash"] },
	{ name: "Crédit Agricole", aliases: ["credit agricole"] },
	{ name: "LCL", aliases: ["lcl banque"], short: ["lcl"] },
	{ name: "Caisse d'Épargne", aliases: ["caisse d epargne", "caisse depargne"] },
	{ name: "Banque Populaire", aliases: ["banque populaire"] },
	{ name: "La Banque Postale", aliases: ["la banque postale"] },
	{ name: "Crédit Mutuel", aliases: ["credit mutuel"] },
	{ name: "CIC", aliases: ["cic banque"], short: ["cic"] },
	{ name: "Boursorama", aliases: ["boursorama", "boursobank"] },
	{ name: "Fortuneo", aliases: ["fortuneo"] },

	// --- banks: Germany & Austria ---
	{ name: "Sparkasse", aliases: ["sparkasse", "sparkassen"] },
	{ name: "Volksbank", aliases: ["volksbank", "raiffeisenbank volksbank"] },
	{ name: "Deutsche Bank", aliases: ["deutsche bank"] },
	{ name: "Commerzbank", aliases: ["commerzbank"] },
	{ name: "Postbank", aliases: ["postbank"] },
	{ name: "DKB", aliases: ["deutsche kreditbank"], short: ["dkb"] },
	{ name: "Comdirect", aliases: ["comdirect"] },
	{ name: "Targobank", aliases: ["targobank"] },
	{ name: "HypoVereinsbank", aliases: ["hypovereinsbank"] },

	// --- banks: Greece ---
	{ name: "Εθνική Τράπεζα", aliases: ["εθνικη τραπεζα", "national bank of greece", "ibank εθνικη"], short: ["nbg"] },
	{ name: "Τράπεζα Πειραιώς", aliases: ["τραπεζα πειραιως", "πειραιως", "piraeus bank", "winbank"] },
	{ name: "Eurobank", aliases: ["eurobank"] },
	{ name: "Attica Bank", aliases: ["attica bank"] },
	{ name: "Optima Bank", aliases: ["optima bank"] },

	// --- banks: UK, US & other ---
	{ name: "HSBC", aliases: ["hsbc"] },
	{ name: "Barclays", aliases: ["barclays"] },
	{ name: "Lloyds Bank", aliases: ["lloyds"] },
	{ name: "NatWest", aliases: ["natwest"] },
	{ name: "Halifax", aliases: ["halifax"] },
	{ name: "Monzo", aliases: ["monzo"] },
	{ name: "Starling Bank", aliases: ["starling bank"] },
	{ name: "Chase", aliases: ["chase bank", "jpmorgan chase"] },
	{ name: "Wells Fargo", aliases: ["wells fargo"] },
	{ name: "Citibank", aliases: ["citibank", "citigroup"] },
	{ name: "Bank of America", aliases: ["bank of america"] },
	{ name: "Capital One", aliases: ["capital one"] },
	{ name: "Rabobank", aliases: ["rabobank"] },

	// --- post & couriers ---
	{ name: "DHL", aliases: ["dhl"] },
	{ name: "FedEx", aliases: ["fedex"] },
	{ name: "UPS", aliases: ["united parcel service"], short: ["ups"] },
	{ name: "USPS", aliases: ["usps"] },
	{ name: "DPD", aliases: ["dpd"] },
	{ name: "GLS", aliases: ["gls"] },
	{ name: "InPost", aliases: ["inpost"] },
	{ name: "Royal Mail", aliases: ["royal mail"] },
	{ name: "Poșta Română", aliases: ["posta romana"] },
	{ name: "FAN Courier", aliases: ["fan courier", "fancourier"] },
	{ name: "Sameday", aliases: ["sameday"] },
	{ name: "Cargus", aliases: ["cargus", "urgent cargus"] },
	{ name: "Correos", aliases: ["correos", "correos express"] },
	{ name: "SEUR", aliases: ["seur"] },
	{ name: "MRW", aliases: ["mrw"] },
	{ name: "CTT", aliases: ["ctt expresso", "ctt correios"] },
	{ name: "La Poste", aliases: ["la poste", "colissimo", "chronopost"] },
	{ name: "Mondial Relay", aliases: ["mondial relay"] },
	{ name: "Deutsche Post", aliases: ["deutsche post", "packstation"] },
	{ name: "Hermes", aliases: ["hermes versand", "evri"] },
	{ name: "ΕΛΤΑ", aliases: ["ελτα courier", "elta courier"] },
	{ name: "ACS Courier", aliases: ["acs courier"] },

	// --- telecom & utilities ---
	{ name: "Orange", aliases: ["orange"] },
	{ name: "Vodafone", aliases: ["vodafone"] },
	{ name: "Telekom", aliases: ["telekom", "deutsche telekom", "magenta"] },
	{ name: "Digi", aliases: ["digi mobil", "rcs rds", "digi romania"] },
	{ name: "Movistar", aliases: ["movistar", "telefonica"] },
	{ name: "MEO", aliases: ["meo altice"], short: ["meo"] },
	{ name: "NOS", aliases: ["nos comunicacoes"], short: ["nos"] },
	{ name: "SFR", aliases: ["sfr"] },
	{ name: "Bouygues Telecom", aliases: ["bouygues"] },
	{ name: "Free", aliases: ["free mobile"] },
	{ name: "COSMOTE", aliases: ["cosmote"] },
	{ name: "Enel", aliases: ["enel", "e distributie"] },
	{ name: "Engie", aliases: ["engie"] },
	{ name: "E.ON", aliases: ["e on energie"] },
	{ name: "EDP", aliases: ["edp comercial"], short: ["edp"] },
	{ name: "Iberdrola", aliases: ["iberdrola"] },
	{ name: "Endesa", aliases: ["endesa"] },
	{ name: "Naturgy", aliases: ["naturgy"] },
	{ name: "EDF", aliases: ["edf energie"], short: ["edf"] },

	// --- tax, government & health ---
	{ name: "ANAF", aliases: ["anaf", "spatiul privat virtual"] },
	{ name: "Ghișeul.ro", aliases: ["ghiseul ro", "ghiseul.ro"] },
	{ name: "Agencia Tributaria", aliases: ["agencia tributaria", "hacienda"] },
	{ name: "Seguridad Social", aliases: ["seguridad social"] },
	{ name: "Autoridade Tributária", aliases: ["autoridade tributaria", "portal das financas"] },
	{ name: "Segurança Social", aliases: ["seguranca social"] },
	{ name: "impots.gouv.fr", aliases: ["impots gouv", "impots.gouv", "direction generale des finances publiques"] },
	{ name: "Ameli", aliases: ["ameli", "assurance maladie"] },
	{ name: "URSSAF", aliases: ["urssaf"] },
	{ name: "ELSTER", aliases: ["elster", "finanzamt"] },
	{ name: "ΑΑΔΕ", aliases: ["ααδε", "taxisnet", "aade"] },
	{ name: "GOV.UK", aliases: ["gov uk", "hmrc"] },
	{ name: "IRS", aliases: ["internal revenue service"], short: ["irs"] },
];

const DIACRITICS = /[̀-ͯ]/g;

/**
 * Lowercases text and strips diacritics so that "Société Générale",
 * "Societe Generale" and "SOCIÉTÉ GÉNÉRALE" all compare equal. Punctuation
 * collapses to single spaces, which also makes "banca-transilvania" and
 * "banca_transilvania" match.
 *
 * @param {string} value - The text to normalise.
 * @returns {string} - The normalised text, padded with spaces for word matching.
 */
export const normalize = (value: string): string => {
	const stripped = value.normalize ? value.normalize("NFD").replace(DIACRITICS, "") : value;

	return ` ${stripped.toLowerCase().replace(/[^a-z0-9Ͱ-Ͽἀ-῿]+/g, " ").trim()} `;
};

export type BrandForms = {
	// Full spellings, punctuation removed: "bancatransilvania", "bt24".
	full: string[];
	// Abbreviations: "bt", "ing", "nbg". Only ever matched as a whole label.
	abbreviations: string[];
};

const flatten = (value: string): string => normalize(value).trim().replace(/ /g, "");

// Linking words that never contribute a letter to an acronym:
// "Caixa Geral de Depósitos" is CGD, not CGDD.
const ACRONYM_FILLERS = [
	"de", "del", "da", "das", "do", "dos", "des", "du", "di", "der", "die", "das", "van", "von",
	"la", "le", "les", "el", "los", "las", "of", "the", "and", "und", "et", "y", "e", "o", "a", "al",
	"per", "pour", "fur", "για", "και", "του", "της", "των", "στο", "pentru", "si",
];

// Two-letter acronyms that are far more likely to mean something else in a
// hostname — country codes and infrastructure names. A brand whose initials
// land here simply doesn't get an auto-generated abbreviation; anything that
// genuinely uses one can declare it in the catalogue instead.
// Every ISO 3166 alpha-2 code is a live ccTLD and a very common hostname
// label, so no two-letter acronym that collides with one is trustworthy.
const COUNTRY_CODES = ("ad ae af ag ai al am ao aq ar as at au aw ax az ba bb bd be bf bg bh bi bj bl bm bn bo bq br bs bt bv bw by bz "
	+ "ca cc cd cf cg ch ci ck cl cm cn co cr cu cv cw cx cy cz de dj dk dm do dz ec ee eg eh er es et fi fj fk fm fo fr "
	+ "ga gb gd ge gf gg gh gi gl gm gn gp gq gr gs gt gu gw gy hk hm hn hr ht hu id ie il im in io iq ir is it je jm jo jp "
	+ "ke kg kh ki km kn kp kr kw ky kz la lb lc li lk lr ls lt lu lv ly ma mc md me mf mg mh mk ml mm mn mo mp mq mr ms mt "
	+ "mu mv mw mx my mz na nc ne nf ng ni nl no np nr nu nz om pa pe pf pg ph pk pl pm pn pr ps pt pw py qa re ro rs ru rw "
	+ "sa sb sc sd se sg sh si sj sk sl sm sn so sr ss st sv sx sy sz tc td tf tg th tj tk tl tm tn to tr tt tv tw tz ua ug "
	+ "um us uy uz va vc ve vg vi vn vu wf ws ye yt za zm zw").split(" ");

// Plus infrastructure and product labels that appear in hostnames constantly.
const AMBIGUOUS_ACRONYMS = COUNTRY_CODES.concat([
	"db", "ui", "ux", "hq", "vm", "pc", "os", "ip", "ns", "cdn", "api", "app", "dev", "www", "ftp",
	"sso", "vpn", "crm", "erp", "cms", "faq", "hr", "pr", "it", "ai", "ml", "ci", "cd", "qa",
]);

/**
 * Builds the initials of a multi-word name: "Banca Transilvania" -> "bt",
 * "National Bank of Greece" -> "nbg". Returns an empty string when the name
 * is a single word or the initials would be too ambiguous to be useful.
 *
 * @param {string} name - The brand's display name.
 * @returns {string} - The acronym, or an empty string.
 */
export const acronymOf = (name: string): string => {
	const words = normalize(name).trim().split(" ").filter(word => word && ACRONYM_FILLERS.indexOf(word) === -1);
	if (words.length < 2) {
		return "";
	}

	const acronym = words.map(word => word.charAt(0)).join("");

	// Three letters minimum. Every two-letter combination is either a country
	// code or an infrastructure label somewhere, so guessing them creates more
	// false matches than it catches. Brands that really do use a two-letter
	// abbreviation ("BT", "ING") declare it in the catalogue, where it has
	// been checked by hand.
	if (acronym.length < 3 || AMBIGUOUS_ACRONYMS.indexOf(acronym) !== -1) {
		return "";
	}

	return acronym;
};

/**
 * Lists every way a brand may be written inside a hostname. Campaigns often
 * shorten the name in the subdomain — "bt.example.com" for Banca Transilvania
 * — so the abbreviations we know about have to be searchable too.
 *
 * @param {string} name - The brand's display name.
 * @returns {BrandForms} - Full spellings and abbreviations, normalised.
 */
export const brandForms = (name: string): BrandForms => {
	const entry = BRANDS.filter(brand => brand.name === name)[0];
	const full = [flatten(name)];
	const abbreviations: string[] = [];

	if (entry) {
		(entry.aliases || []).forEach(alias => full.push(flatten(alias)));
		(entry.short || []).forEach(alias => abbreviations.push(flatten(alias)));
	}

	// Works for brands we have never seen: "Cooperativa Ardeal" -> "ca" is
	// dropped as ambiguous, "Mutuelle Rhodanienne du Sud" -> "mrs" is kept.
	const acronym = acronymOf(name);
	if (acronym && abbreviations.indexOf(acronym) === -1) {
		abbreviations.push(acronym);
	}

	return { full: full.filter(Boolean), abbreviations: abbreviations.filter(Boolean) };
};

/**
 * Maps a name onto its canonical owner when we happen to know it, so that
 * "Office 365" is reported as "Microsoft" and "BT24" as "Banca Transilvania".
 * Returns null for anything unknown, which the caller then uses verbatim.
 *
 * @param {string} value - The name as written on the page.
 * @returns {string | null} - The canonical brand name, or null.
 */
export const canonicalBrand = (value: string): string | null => matchBrand(value);

/**
 * Finds a known brand named in the given text.
 *
 * @param {string} value - The raw text to inspect.
 * @returns {string | null} - The brand's display name, or null.
 */
export const matchBrand = (value: string): string | null => {
	const haystack = normalize(value);

	for (const brand of BRANDS) {
		for (const alias of brand.aliases || []) {
			if (haystack.indexOf(` ${normalize(alias).trim()} `) !== -1) {
				return brand.name;
			}
		}

		// Abbreviations only count when written in capitals, which keeps "ING"
		// apart from an "-ing" word ending and "NOS" from the Portuguese "nos".
		for (const alias of brand.short || []) {
			if (new RegExp(`(^|[^A-Za-z0-9])${alias.toUpperCase()}([^A-Za-z0-9]|$)`).test(value)) {
				return brand.name;
			}
		}
	}

	return null;
};
