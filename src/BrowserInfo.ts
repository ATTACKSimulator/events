import parser from "ua-parser-js";

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
    ua: string;
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

export function findBrowserInfo(): BrowserInfo {
	const ua = new parser();
	return {
		ua: window.navigator.userAgent,
		screen_size: {
			width: screen.width || 0,
			height: screen.height || 0
		},
		browser: findBrowser(),
		os: findOperatingSystem(ua),
		device: findDevice(ua),
		cpu: findCpu(ua)
	};
}