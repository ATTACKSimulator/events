import parser from "ua-parser-js";

const IP_INFO_URL = "https://ipinfo.io/ip";
const IP_LOOKUP_TIMEOUT = 1500;

interface ScreenSize {
    width ?: number
    height ?: number
}

interface Browser {
    name ?: string
    version ?: string
    major_version ?: number
    mobile ?: boolean
}

interface OS {
    name ?: string
    version ?: string
}

interface Device {
    model?: string
    type?: string
    vendor?: string
}
interface Cpu {
    architecture ?:string
}

export interface BrowserInfo {
    ip?: string;
    useragent: string;
    screen_size: ScreenSize;
    browser: Browser;
    os: OS;
    device: Device;
    cpu: Cpu;
}

function findBrowser(): Browser {
	let verOffset: number;
	const browser: Browser = {};
	const userAgent = navigator.userAgent;

	// Opera
	if ((verOffset = userAgent.indexOf("Opera")) !== -1) {
		browser.name = "Opera";
		browser.version = userAgent.substring(verOffset + 6);
		if ((verOffset = userAgent.indexOf("Version")) !== -1) {
			browser.version = userAgent.substring(verOffset + 8);
		}
	}

	// Opera Next
	else if ((verOffset = userAgent.indexOf("OPR")) !== -1) {
		browser.name = "Opera";
		browser.version = userAgent.substring(verOffset + 5);
	}

	// Edge
	else if ((verOffset = userAgent.indexOf("Edge")) !== -1) {
		browser.name = "Microsoft Edge";
		browser.version = userAgent.substring(verOffset + 5);
	}

	// MSIE
	else if ((verOffset = userAgent.indexOf("MSIE")) !== -1) {
		browser.name = "Microsoft Internet Explorer";
		browser.version = userAgent.substring(verOffset + 5);
	}

	// Chrome
	else if ((verOffset = userAgent.indexOf("Chrome")) !== -1) {
		browser.name = "Chrome";
		browser.version = userAgent.substring(verOffset + 7);
	}

	// Safari
	else if ((verOffset = userAgent.indexOf("Safari")) !== -1) {
		browser.name = "Safari";
		browser.version = userAgent.substring(verOffset + 7);
		if ((verOffset = userAgent.indexOf("Version")) !== -1) {
			browser.version = userAgent.substring(verOffset + 8);
		}
	}

	// Firefox
	else if ((verOffset = userAgent.indexOf("Firefox")) !== -1) {
		browser.name = "Firefox";
		browser.version = userAgent.substring(verOffset + 8);
	}

	// MSIE 11+
	else if (userAgent.indexOf("Trident/") !== -1) {
		browser.name = "Microsoft Internet Explorer";
		browser.version = userAgent.substring(userAgent.indexOf("rv:") + 3);
	}

	browser.mobile = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(userAgent);
	browser.version = browser.version || "";

	// trim the version string
	let ix;
	if ((ix = browser.version.indexOf(";")) != -1) browser.version = browser.version.substring(0, ix);
	if ((ix = browser.version.indexOf(" ")) != -1) browser.version = browser.version.substring(0, ix);
	if ((ix = browser.version.indexOf(")")) != -1) browser.version = browser.version.substring(0, ix);

	browser.major_version = parseInt("" + browser.version, 10);
	if (isNaN( browser.major_version)) {
		browser.version = "" + parseFloat(navigator.appVersion);
		browser.major_version = parseInt(navigator.appVersion, 10);
	}
    
	return browser;
}

function findOperatingSystem(parser: any): OS {
	const {name, version} = parser.getOS();
	return { name, version};
}

function findDevice(parser: any): Device {
	const {model, type, vendor} = parser.getDevice();
	return {model, type, vendor};
}

function findCpu(parser: any): Cpu {
	const {architecture} = parser.getCPU();
	return {architecture};
}

async function findClientIp(): Promise<string | undefined> {
	try {
		const controller = new AbortController();
		const timeout = window.setTimeout(() => controller.abort(), IP_LOOKUP_TIMEOUT);

		try {
			const response = await fetch(IP_INFO_URL, {
				referrerPolicy: "no-referrer",
				signal: controller.signal
			});
			if (!response.ok) {
				return undefined;
			}

			const ip = await response.text();
			return ip.trim() || undefined;
		} finally {
			window.clearTimeout(timeout);
		}
	} catch {
		return undefined;
	}
}

function findScreenSize(): ScreenSize {
	return {
		width: screen.width || 0,
		height: screen.height || 0
	};
}

export async function findBrowserInfo(): Promise<BrowserInfo> {
	const ip = await findClientIp();

	try {
		const ua = new parser();
		return {
			ip,
			useragent: window.navigator.userAgent,
			screen_size: findScreenSize(),
			browser: findBrowser(),
			os: findOperatingSystem(ua),
			device: findDevice(ua),
			cpu: findCpu(ua)
		};
	} catch {
		return {
			ip,
			useragent: window.navigator.userAgent,
			screen_size: findScreenSize(),
			browser: {},
			os: {},
			device: {},
			cpu: {}
		};
	}
}
