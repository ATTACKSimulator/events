var ATSEvents;
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./index.ts":
/*!******************!*\
  !*** ./index.ts ***!
  \******************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Manager_1 = __webpack_require__(/*! ./src/Manager */ "./src/Manager.ts");
const Remote_1 = __importDefault(__webpack_require__(/*! ./src/Remote */ "./src/Remote.ts"));
const Tools_1 = __webpack_require__(/*! ./src/Tools */ "./src/Tools.ts");
const defaultOptions = {
    events: [],
    debug: false,
    shouldRedirect: true,
    redirectUrl: `https://oops.${(0, Tools_1.removeSubdomain)(window.location.hostname)}`,
    source: "LP",
    url: "https://api.attacksimulator.com/v0/client-events",
};
class ATSEvents {
    constructor(options) {
        const _options = Object.assign(Object.assign({}, defaultOptions), options);
        if (_options.debug) {
            console.log(_options);
        }
        const remote = new Remote_1.default(_options.apiKey, _options.url, _options.debug);
        this.manager = new Manager_1.Manager(remote, _options.events, _options.source, _options.redirectUrl, _options.shouldRedirect, _options.debug);
    }
    listen() {
        this.manager.listen();
    }
    on(eventName, callback) {
        this.manager.subscribe(eventName, callback);
    }
    off(eventName, callback) {
        this.manager.unsubscribe(eventName, callback);
    }
    stop() {
        this.manager.stop();
    }
    trigger(name) {
        return this.manager.trigger(name);
    }
}
module.exports = ATSEvents;


/***/ }),

/***/ "./src/BrowserInfo.ts":
/*!****************************!*\
  !*** ./src/BrowserInfo.ts ***!
  \****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.findBrowserInfo = void 0;
const ua_parser_js_1 = __importDefault(__webpack_require__(/*! ua-parser-js */ "./node_modules/ua-parser-js/src/ua-parser.js"));
function findBrowser() {
    let verOffset;
    const browser = {};
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
    if ((ix = browser.version.indexOf(";")) != -1)
        browser.version = browser.version.substring(0, ix);
    if ((ix = browser.version.indexOf(" ")) != -1)
        browser.version = browser.version.substring(0, ix);
    if ((ix = browser.version.indexOf(")")) != -1)
        browser.version = browser.version.substring(0, ix);
    browser.major_version = parseInt("" + browser.version, 10);
    if (isNaN(browser.major_version)) {
        browser.version = "" + parseFloat(navigator.appVersion);
        browser.major_version = parseInt(navigator.appVersion, 10);
    }
    return browser;
}
function findOperatingSystem(parser) {
    const { name, version } = parser.getOS();
    return { name, version };
}
function findDevice(parser) {
    const { model, type, vendor } = parser.getDevice();
    return { model, type, vendor };
}
function findCpu(parser) {
    const { architecture } = parser.getCPU();
    return { architecture };
}
function findBrowserInfo() {
    const ua = new ua_parser_js_1.default();
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
exports.findBrowserInfo = findBrowserInfo;


/***/ }),

/***/ "./src/CampaignInfo.ts":
/*!*****************************!*\
  !*** ./src/CampaignInfo.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.findCampaignInfo = void 0;
const UrlParser_1 = __webpack_require__(/*! ./UrlParser */ "./src/UrlParser.ts");
function readTokenString(tokenString, fileType) {
    const base64Url = tokenString.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const campaignInfo = JSON.parse(window.atob(base64)).payload;
    if (fileType === "attachment") {
        campaignInfo.download_type = "attachment";
    }
    else if (fileType !== null) {
        campaignInfo.download_type = "file";
    }
    return campaignInfo;
}
function findCampaignInfo() {
    const url = new UrlParser_1.UrlParser(window.location.href);
    const tokenString = url.findParam("tk");
    if (!tokenString) {
        throw new Error("Missing ATTACK Simulator token");
    }
    const fileType = url.findParam("file_type");
    try {
        return [tokenString, readTokenString(tokenString, fileType)];
    }
    catch (e) {
        return [tokenString, { ats_company_id: "" }];
    }
}
exports.findCampaignInfo = findCampaignInfo;


/***/ }),

/***/ "./src/Logger.ts":
/*!***********************!*\
  !*** ./src/Logger.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Logger {
    constructor(debug) {
        this.debug = debug;
    }
    info(message) {
        if (this.debug) {
            console.log(message);
        }
    }
    error(message) {
        if (this.debug) {
            console.error(message);
        }
    }
    warn(message) {
        if (this.debug) {
            console.warn(message);
        }
    }
}
exports["default"] = Logger;


/***/ }),

/***/ "./src/Manager.ts":
/*!************************!*\
  !*** ./src/Manager.ts ***!
  \************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Manager = void 0;
const BrowserInfo_1 = __webpack_require__(/*! ./BrowserInfo */ "./src/BrowserInfo.ts");
const CampaignInfo_1 = __webpack_require__(/*! ./CampaignInfo */ "./src/CampaignInfo.ts");
const Tools_1 = __webpack_require__(/*! ./Tools */ "./src/Tools.ts");
const AttachmentOpen_1 = __importDefault(__webpack_require__(/*! ./events/AttachmentOpen */ "./src/events/AttachmentOpen.ts"));
const Click_1 = __importDefault(__webpack_require__(/*! ./events/Click */ "./src/events/Click.ts"));
const Download_1 = __importDefault(__webpack_require__(/*! ./events/Download */ "./src/events/Download.ts"));
const Extension_1 = __importDefault(__webpack_require__(/*! ./events/Extension */ "./src/events/Extension.ts"));
const FileDownload_1 = __importDefault(__webpack_require__(/*! ./events/FileDownload */ "./src/events/FileDownload.ts"));
const FileOpen_1 = __importDefault(__webpack_require__(/*! ./events/FileOpen */ "./src/events/FileOpen.ts"));
const Input_1 = __importDefault(__webpack_require__(/*! ./events/Input */ "./src/events/Input.ts"));
const Microphone_1 = __importDefault(__webpack_require__(/*! ./events/Microphone */ "./src/events/Microphone.ts"));
const Notification_1 = __importDefault(__webpack_require__(/*! ./events/Notification */ "./src/events/Notification.ts"));
const PageLeft_1 = __importDefault(__webpack_require__(/*! ./events/PageLeft */ "./src/events/PageLeft.ts"));
const PageLoaded_1 = __importDefault(__webpack_require__(/*! ./events/PageLoaded */ "./src/events/PageLoaded.ts"));
const PageRead_1 = __importDefault(__webpack_require__(/*! ./events/PageRead */ "./src/events/PageRead.ts"));
const Submit_1 = __importDefault(__webpack_require__(/*! ./events/Submit */ "./src/events/Submit.ts"));
const Webcam_1 = __importDefault(__webpack_require__(/*! ./events/Webcam */ "./src/events/Webcam.ts"));
const Location_1 = __importDefault(__webpack_require__(/*! ./events/Location */ "./src/events/Location.ts"));
const Clipboard_1 = __importDefault(__webpack_require__(/*! ./events/Clipboard */ "./src/events/Clipboard.ts"));
const Logger_1 = __importDefault(__webpack_require__(/*! ./Logger */ "./src/Logger.ts"));
class Manager {
    constructor(remote, eventNames, source, redirectUrl, shouldRedirect, debug = false) {
        this.supportedTypes = ["email", "password", "tel", "text", "given-name", "name", "family-name", "street-address", "cc-name", "cc-given-name", "cc-family-name", "cc-number", "cc-exp", "cc-exp-month", "cc-exp-year", "cc-csc", "cc-type"];
        this.supportedEvents = {
            "attachment_opened": AttachmentOpen_1.default,
            "button_clicked": Click_1.default,
            "download": Download_1.default,
            "extension_installed": Extension_1.default,
            "file_download": FileDownload_1.default,
            "file_open": FileOpen_1.default,
            "input_filled": Input_1.default,
            "page_left": PageLeft_1.default,
            "page_loaded": PageLoaded_1.default,
            "page_read": PageRead_1.default,
            "mic_accepted": Microphone_1.default,
            "notification_accepted": Notification_1.default,
            "form_submitted": Submit_1.default,
            "webcam_accepted": Webcam_1.default,
            "location_accepted": Location_1.default,
            "clipboard_accepted": Clipboard_1.default,
        };
        this.subscriptions = [];
        this.handlers = [];
        this.disabledEvents = [];
        this.logger = new Logger_1.default(debug);
        this.remote = remote;
        [this.token, this.campaignInfo] = (0, CampaignInfo_1.findCampaignInfo)();
        this.browserInfo = (0, BrowserInfo_1.findBrowserInfo)();
        if (!eventNames.length) {
            eventNames = Object.keys(this.supportedEvents);
        }
        this.activeEvents = eventNames.map(name => this.getEvent(name)).filter(event => event !== null);
        this.logger.info(`Enabled events: ${eventNames.join(" | ")}`);
        this.source = source;
        this.redirectUrl = redirectUrl;
        this.shouldRedirect = shouldRedirect;
        if (this.campaignInfo.download_type) {
            this.checkDownload();
        }
    }
    getEvent(name) {
        if (!this.supportedEvents[name]) {
            return null;
        }
        return new (this.supportedEvents[name]);
    }
    checkDownload() {
        switch (this.campaignInfo.download_type) {
            case "file":
                return this.trigger("file_opened");
            case "attachment":
                return this.trigger("attachment_opened");
        }
    }
    listen() {
        let i = 0;
        for (const activeEvent of this.activeEvents) {
            if (!activeEvent.trigger) {
                this.logger.info(`The active event ${activeEvent.name} does not have a trigger. Skipping...`);
            }
            else {
                this.logger.info(`Listening for event @${activeEvent.trigger} (${activeEvent.name})`);
                activeEvent.source.addEventListener(activeEvent.trigger, this.handlers[i++] = (event) => this.prehandle(activeEvent, event));
            }
        }
    }
    stop() {
        let i = 0;
        for (const activeEvent of this.activeEvents) {
            if (!activeEvent.trigger) {
                continue;
            }
            this.logger.info(`Stopping listening for event @${activeEvent.trigger} (${activeEvent.name})`);
            activeEvent.source.removeEventListener(activeEvent.trigger, this.handlers[i++]);
        }
    }
    trigger(eventName) {
        const activeEvent = this.getEvent(eventName);
        if (!activeEvent) {
            throw new Error(`Unsupported event ${eventName}. Please choose one of ${Object.keys(this.supportedEvents).join(", ")}`);
        }
        return this.executeEvent(activeEvent, null, false);
    }
    prehandle(activeEvent, event) {
        if (activeEvent.shouldDebounce) {
            (0, Tools_1.debounce)((...args) => this.handle(...args), 500, activeEvent, event);
        }
        else {
            this.handle(activeEvent, event);
        }
    }
    findType(activeEvent, event) {
        if (!activeEvent.hasTypes || !event) {
            return null;
        }
        const inputElement = event.target;
        const type = inputElement.getAttribute("autocomplete") || inputElement.type;
        if (this.supportedTypes.indexOf(type) !== -1) {
            return type;
        }
        return null;
    }
    findName(activeEvent, event) {
        const type = this.findType(activeEvent, event);
        if (!type) {
            return activeEvent.name;
        }
        return `${activeEvent.name}-${type}`;
    }
    packEvent(type, activeEvent) {
        return {
            "data": Object.assign(Object.assign({}, this.browserInfo), { type }),
            "source": this.source,
            "timestamp": Math.floor(Date.now() / 1000),
            "ats_header": this.token,
            "event": activeEvent.name.toLowerCase(),
            "sg_event_id": (0, Tools_1.createUUID)(),
            "sg_message_id": this.campaignInfo.ats_instance_id,
        };
    }
    handle(activeEvent, event, shouldValidate = true) {
        this.executeEvent(activeEvent, event, shouldValidate)
            .catch(e => this.logger.error(e));
    }
    checkEvent(activeEvent, shouldValidate = true) {
        if (!activeEvent.isValid(event) && shouldValidate) {
            throw new Error(`Event @${activeEvent.trigger} (${activeEvent.name}) not valid...`);
        }
    }
    checkMultiple(activeEvent, event) {
        if (!activeEvent.allowMultiple) {
            const name = this.findName(activeEvent, event);
            if (this.disabledEvents.includes(name)) {
                throw new Error(`Preventing duplicate event @${activeEvent.trigger} (${name}).`);
            }
            this.disabledEvents.push(name);
        }
    }
    executeEvent(activeEvent, event, shouldValidate = true) {
        this.logger.info(`Event @${activeEvent.trigger} (${activeEvent.name}) triggered...`);
        try {
            this.checkEvent(activeEvent, shouldValidate);
        }
        catch (e) {
            this.logger.error(e);
            return new Promise((resolve, reject) => reject(e));
        }
        if (event && activeEvent.isBlocking) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
        }
        try {
            this.checkMultiple(activeEvent, event);
        }
        catch (e) {
            this.logger.error(e);
            return new Promise((resolve, reject) => reject(e));
        }
        const type = this.findType(activeEvent, event);
        const payload = this.packEvent(type, activeEvent);
        this.triggerSubscription(activeEvent);
        return this.remote.post(payload)
            .then(result => this.logger.info(result))
            .finally(() => {
            if (activeEvent.redirectOnFinish && this.shouldRedirect) {
                window.location.href = `${this.redirectUrl}${window.location.search}`;
            }
        });
    }
    get supportedEventNames() {
        return Object.keys(this.supportedEvents);
    }
    subscribe(eventName, callback) {
        if (!this.supportedEventNames.includes(eventName)) {
            throw new Error(`Unsupported event: ${eventName}`);
        }
        this.subscriptions.push({ eventName, callback });
    }
    unsubscribe(eventName, callback) {
        if (!this.supportedEventNames.includes(eventName)) {
            throw new Error(`Unsupported event: ${eventName}`);
        }
        // find the event in the subscriptions array and remove it
        const eventIndex = this.subscriptions.findIndex(subscription => subscription.eventName === eventName && subscription.callback === callback);
        if (eventIndex >= 0) {
            this.subscriptions.splice(eventIndex, 1);
        }
    }
    triggerSubscription(event) {
        const subscriptions = this.subscriptions.filter(subscription => subscription.eventName === event.name);
        subscriptions.forEach(subscription => subscription.callback(event));
    }
}
exports.Manager = Manager;


/***/ }),

/***/ "./src/Remote.ts":
/*!***********************!*\
  !*** ./src/Remote.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Remote {
    constructor(api_key, url, debug) {
        this.api_key = api_key;
        this.url = url;
        this.debug = debug;
    }
    post(data) {
        if (this.debug) {
            console.log(`Sending event to ${this.url} with data:`);
            console.table(data);
        }
        return fetch(this.url, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "api-key": this.api_key,
            },
            keepalive: true,
            body: JSON.stringify(data),
        }).then(response => {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                return response.json();
            }
            else {
                return response.text();
            }
        });
    }
}
exports["default"] = Remote;


/***/ }),

/***/ "./src/Tools.ts":
/*!**********************!*\
  !*** ./src/Tools.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.debounce = exports.removeSubdomain = exports.createUUID = void 0;
function createUUID() {
    // http://www.ietf.org/rfc/rfc4122.txt
    const s = [];
    const hexDigits = "0123456789abcdef";
    for (let i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";
    return s.join("");
}
exports.createUUID = createUUID;
const firstTLDs = "ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|be|bf|bg|bh|bi|bj|bm|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|cl|cm|cn|co|cr|cu|cv|cw|cx|cz|de|dj|dk|dm|do|dz|ec|ee|eg|es|et|eu|fi|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jo|jp|kg|ki|km|kn|kp|kr|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mk|ml|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|na|nc|ne|nf|ng|nl|no|nr|nu|nz|om|pa|pe|pf|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|sl|sm|sn|so|sr|st|su|sv|sx|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|yt".split("|");
const secondTLDs = "com|edu|gov|net|mil|org|nom|sch|caa|res|off|gob|int|tur|ip6|uri|urn|asn|act|nsw|qld|tas|vic|pro|biz|adm|adv|agr|arq|art|ato|bio|bmd|cim|cng|cnt|ecn|eco|emp|eng|esp|etc|eti|far|fnd|fot|fst|g12|ggf|imb|ind|inf|jor|jus|leg|lel|mat|med|mus|not|ntr|odo|ppg|psc|psi|qsl|rec|slg|srv|teo|tmp|trd|vet|zlg|web|ltd|sld|pol|fin|k12|lib|pri|aip|fie|eun|sci|prd|cci|pvt|mod|idv|rel|sex|gen|nic|abr|bas|cal|cam|emr|fvg|laz|lig|lom|mar|mol|pmn|pug|sar|sic|taa|tos|umb|vao|vda|ven|mie|北海道|和歌山|神奈川|鹿児島|ass|rep|tra|per|ngo|soc|grp|plc|its|air|and|bus|can|ddr|jfk|mad|nrw|nyc|ski|spy|tcm|ulm|usa|war|fhs|vgs|dep|eid|fet|fla|flå|gol|hof|hol|sel|vik|cri|iwi|ing|abo|fam|gok|gon|gop|gos|aid|atm|gsm|sos|elk|waw|est|aca|bar|cpa|jur|law|sec|plo|www|bir|cbg|jar|khv|msk|nov|nsk|ptz|rnd|spb|stv|tom|tsk|udm|vrn|cmw|kms|nkz|snz|pub|fhv|red|ens|nat|rns|rnu|bbs|tel|bel|kep|nhs|dni|fed|isa|nsn|gub|e12|tec|орг|обр|упр|alt|nis|jpn|mex|ath|iki|nid|gda|inc".split("|");
const knownSubdomains = "www|studio|mail|remote|blog|webmail|server|ns1|ns2|smtp|secure|vpn|m|shop|ftp|mail2|test|portal|ns|ww1|host|support|dev|web|bbs|ww42|squatter|mx|email|1|mail1|2|forum|owa|www2|gw|admin|store|mx1|cdn|api|exchange|app|gov|2tty|vps|govyty|hgfgdf|news|1rer|lkjkui";
function removeSubdomain(s) {
    const knownSubdomainsRegExp = new RegExp(`^(${knownSubdomains}).`, "i");
    s = s.replace(knownSubdomainsRegExp, "");
    const parts = s.split(".");
    while (parts.length > 3) {
        parts.shift();
    }
    if (parts.length === 3 && ((parts[1].length > 2 && parts[2].length > 2) || (secondTLDs.indexOf(parts[1]) === -1) && firstTLDs.indexOf(parts[2]) === -1)) {
        parts.shift();
    }
    return parts.join(".");
}
exports.removeSubdomain = removeSubdomain;
const timeouts = {};
function debounce(callback, wait, ...args) {
    const [, event] = args;
    if (!event.target.hasAttribute("data-id")) {
        event.target.setAttribute("data-id", createUUID());
    }
    const id = event.target.getAttribute("data-id");
    if (timeouts[id]) {
        clearTimeout(timeouts[id]);
    }
    timeouts[id] = setTimeout(callback, wait, ...args);
}
exports.debounce = debounce;


/***/ }),

/***/ "./src/UrlParser.ts":
/*!**************************!*\
  !*** ./src/UrlParser.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UrlParser = void 0;
class UrlParser {
    constructor(url) {
        this.url = url;
        const parser = document.createElement("a");
        parser.href = url;
        this.protocol = parser.protocol; // => "http:"
        this.host = parser.host; // => "example.com:3000"
        this.hostname = parser.hostname; // => "example.com"
        this.port = parser.port; // => "3000"
        this.pathname = parser.pathname; // => "/pathname/"
        this.hash = parser.hash; // => "#hash"
        this.search = parser.search.substr(1); // => "?search=test"
        this.parseParameters();
    }
    parseParameters() {
        this.parameters = {};
        const paramsGroup = this.search.split("&");
        for (const param of paramsGroup) {
            const [key, value] = param.split("=");
            this.parameters[key] = value;
        }
    }
    findParam(param) {
        return this.parameters[param] || null;
    }
}
exports.UrlParser = UrlParser;


/***/ }),

/***/ "./src/events/ATSEvent.ts":
/*!********************************!*\
  !*** ./src/events/ATSEvent.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class ATSEvent {
    basicValidation(element) {
        if (element.hasAttribute("data-ignore")) {
            return false;
        }
        if (element.hasAttribute("@click")) {
            return false;
        }
        return true;
    }
}
exports["default"] = ATSEvent;


/***/ }),

/***/ "./src/events/AttachmentOpen.ts":
/*!**************************************!*\
  !*** ./src/events/AttachmentOpen.ts ***!
  \**************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const ATSEvent_1 = __importDefault(__webpack_require__(/*! ./ATSEvent */ "./src/events/ATSEvent.ts"));
class AttachmentOpen extends ATSEvent_1.default {
    get shouldDebounce() {
        return false;
    }
    get trigger() {
        return null;
    }
    get source() {
        return null;
    }
    get name() {
        return "attachment_opened";
    }
    get hasTypes() {
        return false;
    }
    get redirectOnFinish() {
        return false;
    }
    get isBlocking() {
        return true;
    }
    get allowMultiple() {
        return false;
    }
    isValid() {
        return true;
    }
}
exports["default"] = AttachmentOpen;


/***/ }),

/***/ "./src/events/Click.ts":
/*!*****************************!*\
  !*** ./src/events/Click.ts ***!
  \*****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const ATSEvent_1 = __importDefault(__webpack_require__(/*! ./ATSEvent */ "./src/events/ATSEvent.ts"));
class Click extends ATSEvent_1.default {
    get shouldDebounce() {
        return false;
    }
    get trigger() {
        return "click";
    }
    get source() {
        return window;
    }
    get name() {
        return "button_clicked";
    }
    get hasTypes() {
        return true;
    }
    get redirectOnFinish() {
        return true;
    }
    get isBlocking() {
        return false;
    }
    get allowMultiple() {
        return false;
    }
    isValid(event) {
        if ((event === null || event === void 0 ? void 0 : event.target) instanceof HTMLAnchorElement) {
            return this.validateAnchor(event.target);
        }
        if ((event === null || event === void 0 ? void 0 : event.target) instanceof HTMLButtonElement) {
            return this.validateButton(event.target);
        }
        return false;
    }
    validateAnchor(element) {
        return this.basicValidation(element);
    }
    validateButton(element) {
        if (!this.basicValidation(element) || (element.hasAttribute("type") && element.getAttribute("type") === "submit")) {
            return false;
        }
        return true;
    }
}
exports["default"] = Click;


/***/ }),

/***/ "./src/events/Clipboard.ts":
/*!*********************************!*\
  !*** ./src/events/Clipboard.ts ***!
  \*********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const ATSEvent_1 = __importDefault(__webpack_require__(/*! ./ATSEvent */ "./src/events/ATSEvent.ts"));
class Clipboard extends ATSEvent_1.default {
    get shouldDebounce() {
        return false;
    }
    get trigger() {
        return null;
    }
    get source() {
        return null;
    }
    get name() {
        return "clipboard_accepted";
    }
    get hasTypes() {
        return false;
    }
    get redirectOnFinish() {
        return true;
    }
    get isBlocking() {
        return true;
    }
    get allowMultiple() {
        return false;
    }
    isValid() {
        return true;
    }
}
exports["default"] = Clipboard;


/***/ }),

/***/ "./src/events/Download.ts":
/*!********************************!*\
  !*** ./src/events/Download.ts ***!
  \********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const ATSEvent_1 = __importDefault(__webpack_require__(/*! ./ATSEvent */ "./src/events/ATSEvent.ts"));
class Download extends ATSEvent_1.default {
    get shouldDebounce() {
        return false;
    }
    get trigger() {
        return null;
    }
    get source() {
        return null;
    }
    get name() {
        return "download_file_event";
    }
    get hasTypes() {
        return false;
    }
    get redirectOnFinish() {
        return true;
    }
    get isBlocking() {
        return true;
    }
    get allowMultiple() {
        return false;
    }
    isValid() {
        return true;
    }
}
exports["default"] = Download;


/***/ }),

/***/ "./src/events/Extension.ts":
/*!*********************************!*\
  !*** ./src/events/Extension.ts ***!
  \*********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const ATSEvent_1 = __importDefault(__webpack_require__(/*! ./ATSEvent */ "./src/events/ATSEvent.ts"));
class Extension extends ATSEvent_1.default {
    get shouldDebounce() {
        return false;
    }
    get trigger() {
        return null;
    }
    get source() {
        return null;
    }
    get name() {
        return "extension_installed";
    }
    get hasTypes() {
        return false;
    }
    get redirectOnFinish() {
        return true;
    }
    get isBlocking() {
        return true;
    }
    get allowMultiple() {
        return false;
    }
    isValid() {
        return true;
    }
}
exports["default"] = Extension;


/***/ }),

/***/ "./src/events/FileDownload.ts":
/*!************************************!*\
  !*** ./src/events/FileDownload.ts ***!
  \************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const ATSEvent_1 = __importDefault(__webpack_require__(/*! ./ATSEvent */ "./src/events/ATSEvent.ts"));
class FileDownload extends ATSEvent_1.default {
    get shouldDebounce() {
        return false;
    }
    get trigger() {
        return null;
    }
    get source() {
        return null;
    }
    get name() {
        return "file_download";
    }
    get hasTypes() {
        return true;
    }
    get redirectOnFinish() {
        return false;
    }
    get isBlocking() {
        return false;
    }
    get allowMultiple() {
        return false;
    }
    isValid(event) {
        if ((event === null || event === void 0 ? void 0 : event.target) instanceof HTMLAnchorElement) {
            return this.validateAnchor(event.target);
        }
        if ((event === null || event === void 0 ? void 0 : event.target) instanceof HTMLButtonElement) {
            return this.validateButton(event.target);
        }
        return false;
    }
    validateAnchor(element) {
        return this.basicValidation(element);
    }
    validateButton(element) {
        if (!this.basicValidation(element) || (element.hasAttribute("type") && element.getAttribute("type") === "submit")) {
            return false;
        }
        return true;
    }
}
exports["default"] = FileDownload;


/***/ }),

/***/ "./src/events/FileOpen.ts":
/*!********************************!*\
  !*** ./src/events/FileOpen.ts ***!
  \********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const ATSEvent_1 = __importDefault(__webpack_require__(/*! ./ATSEvent */ "./src/events/ATSEvent.ts"));
class FileOpen extends ATSEvent_1.default {
    get shouldDebounce() {
        return false;
    }
    get trigger() {
        return null;
    }
    get source() {
        return null;
    }
    get name() {
        return "file_opened";
    }
    get hasTypes() {
        return false;
    }
    get redirectOnFinish() {
        return true;
    }
    get isBlocking() {
        return true;
    }
    get allowMultiple() {
        return false;
    }
    isValid() {
        return true;
    }
}
exports["default"] = FileOpen;


/***/ }),

/***/ "./src/events/Input.ts":
/*!*****************************!*\
  !*** ./src/events/Input.ts ***!
  \*****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const ATSEvent_1 = __importDefault(__webpack_require__(/*! ./ATSEvent */ "./src/events/ATSEvent.ts"));
class Input extends ATSEvent_1.default {
    get shouldDebounce() {
        return true;
    }
    get trigger() {
        return "input";
    }
    get source() {
        return window;
    }
    get name() {
        return "input_filled";
    }
    get hasTypes() {
        return true;
    }
    get redirectOnFinish() {
        return false;
    }
    get isBlocking() {
        return false;
    }
    get allowMultiple() {
        return true;
    }
    isValid(event) {
        if (event.target instanceof HTMLInputElement) {
            return this.basicValidation(event.target) && !!event.target.value.trim();
        }
        return false;
    }
}
exports["default"] = Input;


/***/ }),

/***/ "./src/events/Location.ts":
/*!********************************!*\
  !*** ./src/events/Location.ts ***!
  \********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const ATSEvent_1 = __importDefault(__webpack_require__(/*! ./ATSEvent */ "./src/events/ATSEvent.ts"));
class Location extends ATSEvent_1.default {
    get shouldDebounce() {
        return false;
    }
    get trigger() {
        return null;
    }
    get source() {
        return null;
    }
    get name() {
        return "location_accepted";
    }
    get hasTypes() {
        return false;
    }
    get redirectOnFinish() {
        return true;
    }
    get isBlocking() {
        return true;
    }
    get allowMultiple() {
        return false;
    }
    isValid() {
        return true;
    }
}
exports["default"] = Location;


/***/ }),

/***/ "./src/events/Microphone.ts":
/*!**********************************!*\
  !*** ./src/events/Microphone.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const ATSEvent_1 = __importDefault(__webpack_require__(/*! ./ATSEvent */ "./src/events/ATSEvent.ts"));
class Microphone extends ATSEvent_1.default {
    get shouldDebounce() {
        return false;
    }
    get trigger() {
        return null;
    }
    get source() {
        return null;
    }
    get name() {
        return "mic_accepted";
    }
    get hasTypes() {
        return false;
    }
    get redirectOnFinish() {
        return true;
    }
    get isBlocking() {
        return true;
    }
    get allowMultiple() {
        return false;
    }
    isValid() {
        return true;
    }
}
exports["default"] = Microphone;


/***/ }),

/***/ "./src/events/Notification.ts":
/*!************************************!*\
  !*** ./src/events/Notification.ts ***!
  \************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const ATSEvent_1 = __importDefault(__webpack_require__(/*! ./ATSEvent */ "./src/events/ATSEvent.ts"));
class Notification extends ATSEvent_1.default {
    get shouldDebounce() {
        return false;
    }
    get trigger() {
        return null;
    }
    get source() {
        return null;
    }
    get name() {
        return "notification_accepted";
    }
    get hasTypes() {
        return false;
    }
    get redirectOnFinish() {
        return true;
    }
    get isBlocking() {
        return true;
    }
    get allowMultiple() {
        return false;
    }
    isValid() {
        return true;
    }
}
exports["default"] = Notification;


/***/ }),

/***/ "./src/events/PageLeft.ts":
/*!********************************!*\
  !*** ./src/events/PageLeft.ts ***!
  \********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const ATSEvent_1 = __importDefault(__webpack_require__(/*! ./ATSEvent */ "./src/events/ATSEvent.ts"));
class PageLoaded extends ATSEvent_1.default {
    get shouldDebounce() {
        return false;
    }
    get trigger() {
        return null;
    }
    get source() {
        return document;
    }
    get name() {
        return "page_left";
    }
    get hasTypes() {
        return false;
    }
    get redirectOnFinish() {
        return false;
    }
    get isBlocking() {
        return false;
    }
    get allowMultiple() {
        return false;
    }
    isValid() {
        return document.visibilityState === "hidden";
    }
}
exports["default"] = PageLoaded;


/***/ }),

/***/ "./src/events/PageLoaded.ts":
/*!**********************************!*\
  !*** ./src/events/PageLoaded.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const ATSEvent_1 = __importDefault(__webpack_require__(/*! ./ATSEvent */ "./src/events/ATSEvent.ts"));
class PageLoaded extends ATSEvent_1.default {
    get shouldDebounce() {
        return false;
    }
    get trigger() {
        return "load";
    }
    get source() {
        return window;
    }
    get name() {
        return "page_loaded";
    }
    get hasTypes() {
        return false;
    }
    get redirectOnFinish() {
        return false;
    }
    get isBlocking() {
        return false;
    }
    get allowMultiple() {
        return false;
    }
    isValid() {
        return true;
    }
}
exports["default"] = PageLoaded;


/***/ }),

/***/ "./src/events/PageRead.ts":
/*!********************************!*\
  !*** ./src/events/PageRead.ts ***!
  \********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const ATSEvent_1 = __importDefault(__webpack_require__(/*! ./ATSEvent */ "./src/events/ATSEvent.ts"));
class PageRead extends ATSEvent_1.default {
    constructor() {
        super();
        this.minScrollPercentage = 70;
        this.minStaySeconds = 2 * 1000;
        this.hasScrolled = false;
        this.hasStayed = false;
        this.customEvent = new Event(this.trigger);
        this.enable();
        console.log("Page read enabled");
    }
    get shouldDebounce() {
        return false;
    }
    get trigger() {
        return "page_read";
    }
    get source() {
        return window;
    }
    get name() {
        return "page_read";
    }
    get hasTypes() {
        return false;
    }
    get redirectOnFinish() {
        return false;
    }
    get isBlocking() {
        return false;
    }
    get allowMultiple() {
        return false;
    }
    isValid() {
        return true;
    }
    enable() {
        window.onscroll = () => this.scrolled();
        this.detectFocus();
        this.detectVisibility();
        this.scrolled();
        this.timeout = setTimeout(() => this.stayed(), this.minStaySeconds);
    }
    get visibilityProps() {
        if (typeof document.hidden !== "undefined") {
            return ["visibilitychange", "visibilityState"];
        }
        else if (typeof document.mozHidden !== "undefined") {
            return ["mozvisibilitychange", "mozVisibilityState"];
        }
        else if (typeof document.msHidden !== "undefined") {
            return ["msvisibilitychange", "msVisibilityState"];
        }
        else if (typeof document.webkitHidden !== "undefined") {
            return ["webkitvisibilitychange", "webkitVisibilityState"];
        }
        throw new Error("Visibility not supported.");
    }
    detectFocus() {
        window.addEventListener("focus", this.focusGranted.bind(this));
        window.addEventListener("blur", this.focusLost.bind(this));
    }
    detectVisibility() {
        // check the visiblility of the page
        try {
            const [visibilityChange] = this.visibilityProps;
            document.addEventListener(visibilityChange, this.visibilityChanged.bind(this));
        }
        catch (_) {
            //
            return;
        }
    }
    stopDetectingVisibility() {
        // check the visiblility of the page
        try {
            const [visibilityChange] = this.visibilityProps;
            document.removeEventListener(visibilityChange, this.visibilityChanged.bind(this));
        }
        catch (_) {
            //
            return;
        }
    }
    visibilityChanged() {
        const [_, visibilityState] = this.visibilityProps;
        this.toggleTimer(document[visibilityState] === "visible");
    }
    focusGranted() {
        this.toggleTimer(true);
    }
    focusLost() {
        this.toggleTimer(false);
    }
    toggleTimer(status) {
        if (this.hasStayed) {
            return;
        }
        if (status) {
            this.timeout = setTimeout(() => this.stayed(), this.minStaySeconds);
        }
        else {
            clearTimeout(this.timeout);
        }
    }
    disable() {
        window.onscroll = null;
        this.stopDetectingVisibility();
        window.removeEventListener("focus", this.focusGranted.bind(this));
        window.removeEventListener("blur", this.focusLost.bind(this));
    }
    getScrollPercent() {
        return ((document.documentElement.scrollTop + document.body.scrollTop) / (document.documentElement.scrollHeight - document.documentElement.clientHeight) * 100);
    }
    scrolled() {
        if (this.getScrollPercent() > this.minScrollPercentage) {
            if (this.hasStayed) {
                this.dispatch();
            }
            this.hasScrolled = true;
        }
    }
    stayed() {
        if (this.hasScrolled) {
            this.dispatch();
        }
        this.hasStayed = true;
    }
    dispatch() {
        window.dispatchEvent(this.customEvent);
        this.disable();
    }
}
exports["default"] = PageRead;


/***/ }),

/***/ "./src/events/Submit.ts":
/*!******************************!*\
  !*** ./src/events/Submit.ts ***!
  \******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const ATSEvent_1 = __importDefault(__webpack_require__(/*! ./ATSEvent */ "./src/events/ATSEvent.ts"));
class Submit extends ATSEvent_1.default {
    get shouldDebounce() {
        return false;
    }
    get trigger() {
        return "submit";
    }
    get source() {
        return window;
    }
    get name() {
        return "form_submitted";
    }
    get hasTypes() {
        return true;
    }
    get redirectOnFinish() {
        return true;
    }
    get isBlocking() {
        return true;
    }
    get allowMultiple() {
        return false;
    }
    isValid(event) {
        if (event.target instanceof HTMLFormElement) {
            return this.basicValidation(event.target);
        }
        return false;
    }
}
exports["default"] = Submit;


/***/ }),

/***/ "./src/events/Webcam.ts":
/*!******************************!*\
  !*** ./src/events/Webcam.ts ***!
  \******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const ATSEvent_1 = __importDefault(__webpack_require__(/*! ./ATSEvent */ "./src/events/ATSEvent.ts"));
class Webcam extends ATSEvent_1.default {
    get shouldDebounce() {
        return false;
    }
    get trigger() {
        return null;
    }
    get source() {
        return null;
    }
    get name() {
        return "webcam_accepted";
    }
    get hasTypes() {
        return false;
    }
    get redirectOnFinish() {
        return true;
    }
    get isBlocking() {
        return true;
    }
    get allowMultiple() {
        return false;
    }
    isValid() {
        return true;
    }
}
exports["default"] = Webcam;


/***/ }),

/***/ "./node_modules/ua-parser-js/src/ua-parser.js":
/*!****************************************************!*\
  !*** ./node_modules/ua-parser-js/src/ua-parser.js ***!
  \****************************************************/
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/////////////////////////////////////////////////////////////////////////////////
/* UAParser.js v1.0.38
   Copyright © 2012-2021 Faisal Salman <f@faisalman.com>
   MIT License *//*
   Detect Browser, Engine, OS, CPU, and Device type/model from User-Agent data.
   Supports browser & node.js environment. 
   Demo   : https://faisalman.github.io/ua-parser-js
   Source : https://github.com/faisalman/ua-parser-js */
/////////////////////////////////////////////////////////////////////////////////

(function (window, undefined) {

    'use strict';

    //////////////
    // Constants
    /////////////


    var LIBVERSION  = '1.0.38',
        EMPTY       = '',
        UNKNOWN     = '?',
        FUNC_TYPE   = 'function',
        UNDEF_TYPE  = 'undefined',
        OBJ_TYPE    = 'object',
        STR_TYPE    = 'string',
        MAJOR       = 'major',
        MODEL       = 'model',
        NAME        = 'name',
        TYPE        = 'type',
        VENDOR      = 'vendor',
        VERSION     = 'version',
        ARCHITECTURE= 'architecture',
        CONSOLE     = 'console',
        MOBILE      = 'mobile',
        TABLET      = 'tablet',
        SMARTTV     = 'smarttv',
        WEARABLE    = 'wearable',
        EMBEDDED    = 'embedded',
        UA_MAX_LENGTH = 500;

    var AMAZON  = 'Amazon',
        APPLE   = 'Apple',
        ASUS    = 'ASUS',
        BLACKBERRY = 'BlackBerry',
        BROWSER = 'Browser',
        CHROME  = 'Chrome',
        EDGE    = 'Edge',
        FIREFOX = 'Firefox',
        GOOGLE  = 'Google',
        HUAWEI  = 'Huawei',
        LG      = 'LG',
        MICROSOFT = 'Microsoft',
        MOTOROLA  = 'Motorola',
        OPERA   = 'Opera',
        SAMSUNG = 'Samsung',
        SHARP   = 'Sharp',
        SONY    = 'Sony',
        XIAOMI  = 'Xiaomi',
        ZEBRA   = 'Zebra',
        FACEBOOK    = 'Facebook',
        CHROMIUM_OS = 'Chromium OS',
        MAC_OS  = 'Mac OS';

    ///////////
    // Helper
    //////////

    var extend = function (regexes, extensions) {
            var mergedRegexes = {};
            for (var i in regexes) {
                if (extensions[i] && extensions[i].length % 2 === 0) {
                    mergedRegexes[i] = extensions[i].concat(regexes[i]);
                } else {
                    mergedRegexes[i] = regexes[i];
                }
            }
            return mergedRegexes;
        },
        enumerize = function (arr) {
            var enums = {};
            for (var i=0; i<arr.length; i++) {
                enums[arr[i].toUpperCase()] = arr[i];
            }
            return enums;
        },
        has = function (str1, str2) {
            return typeof str1 === STR_TYPE ? lowerize(str2).indexOf(lowerize(str1)) !== -1 : false;
        },
        lowerize = function (str) {
            return str.toLowerCase();
        },
        majorize = function (version) {
            return typeof(version) === STR_TYPE ? version.replace(/[^\d\.]/g, EMPTY).split('.')[0] : undefined;
        },
        trim = function (str, len) {
            if (typeof(str) === STR_TYPE) {
                str = str.replace(/^\s\s*/, EMPTY);
                return typeof(len) === UNDEF_TYPE ? str : str.substring(0, UA_MAX_LENGTH);
            }
    };

    ///////////////
    // Map helper
    //////////////

    var rgxMapper = function (ua, arrays) {

            var i = 0, j, k, p, q, matches, match;

            // loop through all regexes maps
            while (i < arrays.length && !matches) {

                var regex = arrays[i],       // even sequence (0,2,4,..)
                    props = arrays[i + 1];   // odd sequence (1,3,5,..)
                j = k = 0;

                // try matching uastring with regexes
                while (j < regex.length && !matches) {

                    if (!regex[j]) { break; }
                    matches = regex[j++].exec(ua);

                    if (!!matches) {
                        for (p = 0; p < props.length; p++) {
                            match = matches[++k];
                            q = props[p];
                            // check if given property is actually array
                            if (typeof q === OBJ_TYPE && q.length > 0) {
                                if (q.length === 2) {
                                    if (typeof q[1] == FUNC_TYPE) {
                                        // assign modified match
                                        this[q[0]] = q[1].call(this, match);
                                    } else {
                                        // assign given value, ignore regex match
                                        this[q[0]] = q[1];
                                    }
                                } else if (q.length === 3) {
                                    // check whether function or regex
                                    if (typeof q[1] === FUNC_TYPE && !(q[1].exec && q[1].test)) {
                                        // call function (usually string mapper)
                                        this[q[0]] = match ? q[1].call(this, match, q[2]) : undefined;
                                    } else {
                                        // sanitize match using given regex
                                        this[q[0]] = match ? match.replace(q[1], q[2]) : undefined;
                                    }
                                } else if (q.length === 4) {
                                        this[q[0]] = match ? q[3].call(this, match.replace(q[1], q[2])) : undefined;
                                }
                            } else {
                                this[q] = match ? match : undefined;
                            }
                        }
                    }
                }
                i += 2;
            }
        },

        strMapper = function (str, map) {

            for (var i in map) {
                // check if current value is array
                if (typeof map[i] === OBJ_TYPE && map[i].length > 0) {
                    for (var j = 0; j < map[i].length; j++) {
                        if (has(map[i][j], str)) {
                            return (i === UNKNOWN) ? undefined : i;
                        }
                    }
                } else if (has(map[i], str)) {
                    return (i === UNKNOWN) ? undefined : i;
                }
            }
            return str;
    };

    ///////////////
    // String map
    //////////////

    // Safari < 3.0
    var oldSafariMap = {
            '1.0'   : '/8',
            '1.2'   : '/1',
            '1.3'   : '/3',
            '2.0'   : '/412',
            '2.0.2' : '/416',
            '2.0.3' : '/417',
            '2.0.4' : '/419',
            '?'     : '/'
        },
        windowsVersionMap = {
            'ME'        : '4.90',
            'NT 3.11'   : 'NT3.51',
            'NT 4.0'    : 'NT4.0',
            '2000'      : 'NT 5.0',
            'XP'        : ['NT 5.1', 'NT 5.2'],
            'Vista'     : 'NT 6.0',
            '7'         : 'NT 6.1',
            '8'         : 'NT 6.2',
            '8.1'       : 'NT 6.3',
            '10'        : ['NT 6.4', 'NT 10.0'],
            'RT'        : 'ARM'
    };

    //////////////
    // Regex map
    /////////////

    var regexes = {

        browser : [[

            /\b(?:crmo|crios)\/([\w\.]+)/i                                      // Chrome for Android/iOS
            ], [VERSION, [NAME, 'Chrome']], [
            /edg(?:e|ios|a)?\/([\w\.]+)/i                                       // Microsoft Edge
            ], [VERSION, [NAME, 'Edge']], [

            // Presto based
            /(opera mini)\/([-\w\.]+)/i,                                        // Opera Mini
            /(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i,                 // Opera Mobi/Tablet
            /(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i                           // Opera
            ], [NAME, VERSION], [
            /opios[\/ ]+([\w\.]+)/i                                             // Opera mini on iphone >= 8.0
            ], [VERSION, [NAME, OPERA+' Mini']], [
            /\bop(?:rg)?x\/([\w\.]+)/i                                          // Opera GX
            ], [VERSION, [NAME, OPERA+' GX']], [
            /\bopr\/([\w\.]+)/i                                                 // Opera Webkit
            ], [VERSION, [NAME, OPERA]], [

            // Mixed
            /\bb[ai]*d(?:uhd|[ub]*[aekoprswx]{5,6})[\/ ]?([\w\.]+)/i            // Baidu
            ], [VERSION, [NAME, 'Baidu']], [
            /(kindle)\/([\w\.]+)/i,                                             // Kindle
            /(lunascape|maxthon|netfront|jasmine|blazer)[\/ ]?([\w\.]*)/i,      // Lunascape/Maxthon/Netfront/Jasmine/Blazer
            // Trident based
            /(avant|iemobile|slim)\s?(?:browser)?[\/ ]?([\w\.]*)/i,             // Avant/IEMobile/SlimBrowser
            /(?:ms|\()(ie) ([\w\.]+)/i,                                         // Internet Explorer

            // Webkit/KHTML based                                               // Flock/RockMelt/Midori/Epiphany/Silk/Skyfire/Bolt/Iron/Iridium/PhantomJS/Bowser/QupZilla/Falkon
            /(flock|rockmelt|midori|epiphany|silk|skyfire|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon|rekonq|puffin|brave|whale(?!.+naver)|qqbrowserlite|qq|duckduckgo)\/([-\w\.]+)/i,
                                                                                // Rekonq/Puffin/Brave/Whale/QQBrowserLite/QQ, aka ShouQ
            /(heytap|ovi)browser\/([\d\.]+)/i,                                  // Heytap/Ovi
            /(weibo)__([\d\.]+)/i                                               // Weibo
            ], [NAME, VERSION], [
            /\bddg\/([\w\.]+)/i                                                 // DuckDuckGo
            ], [VERSION, [NAME, 'DuckDuckGo']], [
            /(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i                 // UCBrowser
            ], [VERSION, [NAME, 'UC'+BROWSER]], [
            /microm.+\bqbcore\/([\w\.]+)/i,                                     // WeChat Desktop for Windows Built-in Browser
            /\bqbcore\/([\w\.]+).+microm/i,
            /micromessenger\/([\w\.]+)/i                                        // WeChat
            ], [VERSION, [NAME, 'WeChat']], [
            /konqueror\/([\w\.]+)/i                                             // Konqueror
            ], [VERSION, [NAME, 'Konqueror']], [
            /trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i                       // IE11
            ], [VERSION, [NAME, 'IE']], [
            /ya(?:search)?browser\/([\w\.]+)/i                                  // Yandex
            ], [VERSION, [NAME, 'Yandex']], [
            /slbrowser\/([\w\.]+)/i                                             // Smart Lenovo Browser
            ], [VERSION, [NAME, 'Smart Lenovo '+BROWSER]], [
            /(avast|avg)\/([\w\.]+)/i                                           // Avast/AVG Secure Browser
            ], [[NAME, /(.+)/, '$1 Secure '+BROWSER], VERSION], [
            /\bfocus\/([\w\.]+)/i                                               // Firefox Focus
            ], [VERSION, [NAME, FIREFOX+' Focus']], [
            /\bopt\/([\w\.]+)/i                                                 // Opera Touch
            ], [VERSION, [NAME, OPERA+' Touch']], [
            /coc_coc\w+\/([\w\.]+)/i                                            // Coc Coc Browser
            ], [VERSION, [NAME, 'Coc Coc']], [
            /dolfin\/([\w\.]+)/i                                                // Dolphin
            ], [VERSION, [NAME, 'Dolphin']], [
            /coast\/([\w\.]+)/i                                                 // Opera Coast
            ], [VERSION, [NAME, OPERA+' Coast']], [
            /miuibrowser\/([\w\.]+)/i                                           // MIUI Browser
            ], [VERSION, [NAME, 'MIUI '+BROWSER]], [
            /fxios\/([-\w\.]+)/i                                                // Firefox for iOS
            ], [VERSION, [NAME, FIREFOX]], [
            /\bqihu|(qi?ho?o?|360)browser/i                                     // 360
            ], [[NAME, '360 ' + BROWSER]], [
            /(oculus|sailfish|huawei|vivo)browser\/([\w\.]+)/i
            ], [[NAME, /(.+)/, '$1 ' + BROWSER], VERSION], [                    // Oculus/Sailfish/HuaweiBrowser/VivoBrowser
            /samsungbrowser\/([\w\.]+)/i                                        // Samsung Internet
            ], [VERSION, [NAME, SAMSUNG + ' Internet']], [
            /(comodo_dragon)\/([\w\.]+)/i                                       // Comodo Dragon
            ], [[NAME, /_/g, ' '], VERSION], [
            /metasr[\/ ]?([\d\.]+)/i                                            // Sogou Explorer
            ], [VERSION, [NAME, 'Sogou Explorer']], [
            /(sogou)mo\w+\/([\d\.]+)/i                                          // Sogou Mobile
            ], [[NAME, 'Sogou Mobile'], VERSION], [
            /(electron)\/([\w\.]+) safari/i,                                    // Electron-based App
            /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i,                   // Tesla
            /m?(qqbrowser|2345Explorer)[\/ ]?([\w\.]+)/i                        // QQBrowser/2345 Browser
            ], [NAME, VERSION], [
            /(lbbrowser)/i,                                                     // LieBao Browser
            /\[(linkedin)app\]/i                                                // LinkedIn App for iOS & Android
            ], [NAME], [

            // WebView
            /((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i       // Facebook App for iOS & Android
            ], [[NAME, FACEBOOK], VERSION], [
            /(Klarna)\/([\w\.]+)/i,                                             // Klarna Shopping Browser for iOS & Android
            /(kakao(?:talk|story))[\/ ]([\w\.]+)/i,                             // Kakao App
            /(naver)\(.*?(\d+\.[\w\.]+).*\)/i,                                  // Naver InApp
            /safari (line)\/([\w\.]+)/i,                                        // Line App for iOS
            /\b(line)\/([\w\.]+)\/iab/i,                                        // Line App for Android
            /(alipay)client\/([\w\.]+)/i,                                       // Alipay
            /(twitter)(?:and| f.+e\/([\w\.]+))/i,                               // Twitter
            /(chromium|instagram|snapchat)[\/ ]([-\w\.]+)/i                     // Chromium/Instagram/Snapchat
            ], [NAME, VERSION], [
            /\bgsa\/([\w\.]+) .*safari\//i                                      // Google Search Appliance on iOS
            ], [VERSION, [NAME, 'GSA']], [
            /musical_ly(?:.+app_?version\/|_)([\w\.]+)/i                        // TikTok
            ], [VERSION, [NAME, 'TikTok']], [

            /headlesschrome(?:\/([\w\.]+)| )/i                                  // Chrome Headless
            ], [VERSION, [NAME, CHROME+' Headless']], [

            / wv\).+(chrome)\/([\w\.]+)/i                                       // Chrome WebView
            ], [[NAME, CHROME+' WebView'], VERSION], [

            /droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i           // Android Browser
            ], [VERSION, [NAME, 'Android '+BROWSER]], [

            /(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i       // Chrome/OmniWeb/Arora/Tizen/Nokia
            ], [NAME, VERSION], [

            /version\/([\w\.\,]+) .*mobile\/\w+ (safari)/i                      // Mobile Safari
            ], [VERSION, [NAME, 'Mobile Safari']], [
            /version\/([\w(\.|\,)]+) .*(mobile ?safari|safari)/i                // Safari & Safari Mobile
            ], [VERSION, NAME], [
            /webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i                      // Safari < 3.0
            ], [NAME, [VERSION, strMapper, oldSafariMap]], [

            /(webkit|khtml)\/([\w\.]+)/i
            ], [NAME, VERSION], [

            // Gecko based
            /(navigator|netscape\d?)\/([-\w\.]+)/i                              // Netscape
            ], [[NAME, 'Netscape'], VERSION], [
            /mobile vr; rv:([\w\.]+)\).+firefox/i                               // Firefox Reality
            ], [VERSION, [NAME, FIREFOX+' Reality']], [
            /ekiohf.+(flow)\/([\w\.]+)/i,                                       // Flow
            /(swiftfox)/i,                                                      // Swiftfox
            /(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror|klar)[\/ ]?([\w\.\+]+)/i,
                                                                                // IceDragon/Iceweasel/Camino/Chimera/Fennec/Maemo/Minimo/Conkeror/Klar
            /(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i,
                                                                                // Firefox/SeaMonkey/K-Meleon/IceCat/IceApe/Firebird/Phoenix
            /(firefox)\/([\w\.]+)/i,                                            // Other Firefox-based
            /(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i,                         // Mozilla

            // Other
            /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir|obigo|mosaic|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i,
                                                                                // Polaris/Lynx/Dillo/iCab/Doris/Amaya/w3m/NetSurf/Sleipnir/Obigo/Mosaic/Go/ICE/UP.Browser
            /(links) \(([\w\.]+)/i,                                             // Links
            /panasonic;(viera)/i                                                // Panasonic Viera
            ], [NAME, VERSION], [
            
            /(cobalt)\/([\w\.]+)/i                                              // Cobalt
            ], [NAME, [VERSION, /master.|lts./, ""]]
        ],

        cpu : [[

            /(?:(amd|x(?:(?:86|64)[-_])?|wow|win)64)[;\)]/i                     // AMD64 (x64)
            ], [[ARCHITECTURE, 'amd64']], [

            /(ia32(?=;))/i                                                      // IA32 (quicktime)
            ], [[ARCHITECTURE, lowerize]], [

            /((?:i[346]|x)86)[;\)]/i                                            // IA32 (x86)
            ], [[ARCHITECTURE, 'ia32']], [

            /\b(aarch64|arm(v?8e?l?|_?64))\b/i                                 // ARM64
            ], [[ARCHITECTURE, 'arm64']], [

            /\b(arm(?:v[67])?ht?n?[fl]p?)\b/i                                   // ARMHF
            ], [[ARCHITECTURE, 'armhf']], [

            // PocketPC mistakenly identified as PowerPC
            /windows (ce|mobile); ppc;/i
            ], [[ARCHITECTURE, 'arm']], [

            /((?:ppc|powerpc)(?:64)?)(?: mac|;|\))/i                            // PowerPC
            ], [[ARCHITECTURE, /ower/, EMPTY, lowerize]], [

            /(sun4\w)[;\)]/i                                                    // SPARC
            ], [[ARCHITECTURE, 'sparc']], [

            /((?:avr32|ia64(?=;))|68k(?=\))|\barm(?=v(?:[1-7]|[5-7]1)l?|;|eabi)|(?=atmel )avr|(?:irix|mips|sparc)(?:64)?\b|pa-risc)/i
                                                                                // IA64, 68K, ARM/64, AVR/32, IRIX/64, MIPS/64, SPARC/64, PA-RISC
            ], [[ARCHITECTURE, lowerize]]
        ],

        device : [[

            //////////////////////////
            // MOBILES & TABLETS
            /////////////////////////

            // Samsung
            /\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i
            ], [MODEL, [VENDOR, SAMSUNG], [TYPE, TABLET]], [
            /\b((?:s[cgp]h|gt|sm)-\w+|sc[g-]?[\d]+a?|galaxy nexus)/i,
            /samsung[- ]([-\w]+)/i,
            /sec-(sgh\w+)/i
            ], [MODEL, [VENDOR, SAMSUNG], [TYPE, MOBILE]], [

            // Apple
            /(?:\/|\()(ip(?:hone|od)[\w, ]*)(?:\/|;)/i                          // iPod/iPhone
            ], [MODEL, [VENDOR, APPLE], [TYPE, MOBILE]], [
            /\((ipad);[-\w\),; ]+apple/i,                                       // iPad
            /applecoremedia\/[\w\.]+ \((ipad)/i,
            /\b(ipad)\d\d?,\d\d?[;\]].+ios/i
            ], [MODEL, [VENDOR, APPLE], [TYPE, TABLET]], [
            /(macintosh);/i
            ], [MODEL, [VENDOR, APPLE]], [

            // Sharp
            /\b(sh-?[altvz]?\d\d[a-ekm]?)/i
            ], [MODEL, [VENDOR, SHARP], [TYPE, MOBILE]], [

            // Huawei
            /\b((?:ag[rs][23]?|bah2?|sht?|btv)-a?[lw]\d{2})\b(?!.+d\/s)/i
            ], [MODEL, [VENDOR, HUAWEI], [TYPE, TABLET]], [
            /(?:huawei|honor)([-\w ]+)[;\)]/i,
            /\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i
            ], [MODEL, [VENDOR, HUAWEI], [TYPE, MOBILE]], [

            // Xiaomi
            /\b(poco[\w ]+|m2\d{3}j\d\d[a-z]{2})(?: bui|\))/i,                  // Xiaomi POCO
            /\b; (\w+) build\/hm\1/i,                                           // Xiaomi Hongmi 'numeric' models
            /\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i,                             // Xiaomi Hongmi
            /\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i,                   // Xiaomi Redmi
            /oid[^\)]+; (m?[12][0-389][01]\w{3,6}[c-y])( bui|; wv|\))/i,        // Xiaomi Redmi 'numeric' models
            /\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max|cc)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite)?)(?: bui|\))/i // Xiaomi Mi
            ], [[MODEL, /_/g, ' '], [VENDOR, XIAOMI], [TYPE, MOBILE]], [
            /oid[^\)]+; (2\d{4}(283|rpbf)[cgl])( bui|\))/i,                     // Redmi Pad
            /\b(mi[-_ ]?(?:pad)(?:[\w_ ]+))(?: bui|\))/i                        // Mi Pad tablets
            ],[[MODEL, /_/g, ' '], [VENDOR, XIAOMI], [TYPE, TABLET]], [

            // OPPO
            /; (\w+) bui.+ oppo/i,
            /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i
            ], [MODEL, [VENDOR, 'OPPO'], [TYPE, MOBILE]], [
            /\b(opd2\d{3}a?) bui/i
            ], [MODEL, [VENDOR, 'OPPO'], [TYPE, TABLET]], [

            // Vivo
            /vivo (\w+)(?: bui|\))/i,
            /\b(v[12]\d{3}\w?[at])(?: bui|;)/i
            ], [MODEL, [VENDOR, 'Vivo'], [TYPE, MOBILE]], [

            // Realme
            /\b(rmx[1-3]\d{3})(?: bui|;|\))/i
            ], [MODEL, [VENDOR, 'Realme'], [TYPE, MOBILE]], [

            // Motorola
            /\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i,
            /\bmot(?:orola)?[- ](\w*)/i,
            /((?:moto[\w\(\) ]+|xt\d{3,4}|nexus 6)(?= bui|\)))/i
            ], [MODEL, [VENDOR, MOTOROLA], [TYPE, MOBILE]], [
            /\b(mz60\d|xoom[2 ]{0,2}) build\//i
            ], [MODEL, [VENDOR, MOTOROLA], [TYPE, TABLET]], [

            // LG
            /((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i
            ], [MODEL, [VENDOR, LG], [TYPE, TABLET]], [
            /(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i,
            /\blg[-e;\/ ]+((?!browser|netcast|android tv)\w+)/i,
            /\blg-?([\d\w]+) bui/i
            ], [MODEL, [VENDOR, LG], [TYPE, MOBILE]], [

            // Lenovo
            /(ideatab[-\w ]+)/i,
            /lenovo ?(s[56]000[-\w]+|tab(?:[\w ]+)|yt[-\d\w]{6}|tb[-\d\w]{6})/i
            ], [MODEL, [VENDOR, 'Lenovo'], [TYPE, TABLET]], [

            // Nokia
            /(?:maemo|nokia).*(n900|lumia \d+)/i,
            /nokia[-_ ]?([-\w\.]*)/i
            ], [[MODEL, /_/g, ' '], [VENDOR, 'Nokia'], [TYPE, MOBILE]], [

            // Google
            /(pixel c)\b/i                                                      // Google Pixel C
            ], [MODEL, [VENDOR, GOOGLE], [TYPE, TABLET]], [
            /droid.+; (pixel[\daxl ]{0,6})(?: bui|\))/i                         // Google Pixel
            ], [MODEL, [VENDOR, GOOGLE], [TYPE, MOBILE]], [

            // Sony
            /droid.+ (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-a\w[4-7][12])(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i
            ], [MODEL, [VENDOR, SONY], [TYPE, MOBILE]], [
            /sony tablet [ps]/i,
            /\b(?:sony)?sgp\w+(?: bui|\))/i
            ], [[MODEL, 'Xperia Tablet'], [VENDOR, SONY], [TYPE, TABLET]], [

            // OnePlus
            / (kb2005|in20[12]5|be20[12][59])\b/i,
            /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i
            ], [MODEL, [VENDOR, 'OnePlus'], [TYPE, MOBILE]], [

            // Amazon
            /(alexa)webm/i,
            /(kf[a-z]{2}wi|aeo[c-r]{2})( bui|\))/i,                             // Kindle Fire without Silk / Echo Show
            /(kf[a-z]+)( bui|\)).+silk\//i                                      // Kindle Fire HD
            ], [MODEL, [VENDOR, AMAZON], [TYPE, TABLET]], [
            /((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i                     // Fire Phone
            ], [[MODEL, /(.+)/g, 'Fire Phone $1'], [VENDOR, AMAZON], [TYPE, MOBILE]], [

            // BlackBerry
            /(playbook);[-\w\),; ]+(rim)/i                                      // BlackBerry PlayBook
            ], [MODEL, VENDOR, [TYPE, TABLET]], [
            /\b((?:bb[a-f]|st[hv])100-\d)/i,
            /\(bb10; (\w+)/i                                                    // BlackBerry 10
            ], [MODEL, [VENDOR, BLACKBERRY], [TYPE, MOBILE]], [

            // Asus
            /(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i
            ], [MODEL, [VENDOR, ASUS], [TYPE, TABLET]], [
            / (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i
            ], [MODEL, [VENDOR, ASUS], [TYPE, MOBILE]], [

            // HTC
            /(nexus 9)/i                                                        // HTC Nexus 9
            ], [MODEL, [VENDOR, 'HTC'], [TYPE, TABLET]], [
            /(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i,                         // HTC

            // ZTE
            /(zte)[- ]([\w ]+?)(?: bui|\/|\))/i,
            /(alcatel|geeksphone|nexian|panasonic(?!(?:;|\.))|sony(?!-bra))[-_ ]?([-\w]*)/i         // Alcatel/GeeksPhone/Nexian/Panasonic/Sony
            ], [VENDOR, [MODEL, /_/g, ' '], [TYPE, MOBILE]], [

            // Acer
            /droid.+; ([ab][1-7]-?[0178a]\d\d?)/i
            ], [MODEL, [VENDOR, 'Acer'], [TYPE, TABLET]], [

            // Meizu
            /droid.+; (m[1-5] note) bui/i,
            /\bmz-([-\w]{2,})/i
            ], [MODEL, [VENDOR, 'Meizu'], [TYPE, MOBILE]], [
                
            // Ulefone
            /; ((?:power )?armor(?:[\w ]{0,8}))(?: bui|\))/i
            ], [MODEL, [VENDOR, 'Ulefone'], [TYPE, MOBILE]], [

            // MIXED
            /(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron|infinix|tecno)[-_ ]?([-\w]*)/i,
                                                                                // BlackBerry/BenQ/Palm/Sony-Ericsson/Acer/Asus/Dell/Meizu/Motorola/Polytron
            /(hp) ([\w ]+\w)/i,                                                 // HP iPAQ
            /(asus)-?(\w+)/i,                                                   // Asus
            /(microsoft); (lumia[\w ]+)/i,                                      // Microsoft Lumia
            /(lenovo)[-_ ]?([-\w]+)/i,                                          // Lenovo
            /(jolla)/i,                                                         // Jolla
            /(oppo) ?([\w ]+) bui/i                                             // OPPO
            ], [VENDOR, MODEL, [TYPE, MOBILE]], [

            /(kobo)\s(ereader|touch)/i,                                         // Kobo
            /(archos) (gamepad2?)/i,                                            // Archos
            /(hp).+(touchpad(?!.+tablet)|tablet)/i,                             // HP TouchPad
            /(kindle)\/([\w\.]+)/i,                                             // Kindle
            /(nook)[\w ]+build\/(\w+)/i,                                        // Nook
            /(dell) (strea[kpr\d ]*[\dko])/i,                                   // Dell Streak
            /(le[- ]+pan)[- ]+(\w{1,9}) bui/i,                                  // Le Pan Tablets
            /(trinity)[- ]*(t\d{3}) bui/i,                                      // Trinity Tablets
            /(gigaset)[- ]+(q\w{1,9}) bui/i,                                    // Gigaset Tablets
            /(vodafone) ([\w ]+)(?:\)| bui)/i                                   // Vodafone
            ], [VENDOR, MODEL, [TYPE, TABLET]], [

            /(surface duo)/i                                                    // Surface Duo
            ], [MODEL, [VENDOR, MICROSOFT], [TYPE, TABLET]], [
            /droid [\d\.]+; (fp\du?)(?: b|\))/i                                 // Fairphone
            ], [MODEL, [VENDOR, 'Fairphone'], [TYPE, MOBILE]], [
            /(u304aa)/i                                                         // AT&T
            ], [MODEL, [VENDOR, 'AT&T'], [TYPE, MOBILE]], [
            /\bsie-(\w*)/i                                                      // Siemens
            ], [MODEL, [VENDOR, 'Siemens'], [TYPE, MOBILE]], [
            /\b(rct\w+) b/i                                                     // RCA Tablets
            ], [MODEL, [VENDOR, 'RCA'], [TYPE, TABLET]], [
            /\b(venue[\d ]{2,7}) b/i                                            // Dell Venue Tablets
            ], [MODEL, [VENDOR, 'Dell'], [TYPE, TABLET]], [
            /\b(q(?:mv|ta)\w+) b/i                                              // Verizon Tablet
            ], [MODEL, [VENDOR, 'Verizon'], [TYPE, TABLET]], [
            /\b(?:barnes[& ]+noble |bn[rt])([\w\+ ]*) b/i                       // Barnes & Noble Tablet
            ], [MODEL, [VENDOR, 'Barnes & Noble'], [TYPE, TABLET]], [
            /\b(tm\d{3}\w+) b/i
            ], [MODEL, [VENDOR, 'NuVision'], [TYPE, TABLET]], [
            /\b(k88) b/i                                                        // ZTE K Series Tablet
            ], [MODEL, [VENDOR, 'ZTE'], [TYPE, TABLET]], [
            /\b(nx\d{3}j) b/i                                                   // ZTE Nubia
            ], [MODEL, [VENDOR, 'ZTE'], [TYPE, MOBILE]], [
            /\b(gen\d{3}) b.+49h/i                                              // Swiss GEN Mobile
            ], [MODEL, [VENDOR, 'Swiss'], [TYPE, MOBILE]], [
            /\b(zur\d{3}) b/i                                                   // Swiss ZUR Tablet
            ], [MODEL, [VENDOR, 'Swiss'], [TYPE, TABLET]], [
            /\b((zeki)?tb.*\b) b/i                                              // Zeki Tablets
            ], [MODEL, [VENDOR, 'Zeki'], [TYPE, TABLET]], [
            /\b([yr]\d{2}) b/i,
            /\b(dragon[- ]+touch |dt)(\w{5}) b/i                                // Dragon Touch Tablet
            ], [[VENDOR, 'Dragon Touch'], MODEL, [TYPE, TABLET]], [
            /\b(ns-?\w{0,9}) b/i                                                // Insignia Tablets
            ], [MODEL, [VENDOR, 'Insignia'], [TYPE, TABLET]], [
            /\b((nxa|next)-?\w{0,9}) b/i                                        // NextBook Tablets
            ], [MODEL, [VENDOR, 'NextBook'], [TYPE, TABLET]], [
            /\b(xtreme\_)?(v(1[045]|2[015]|[3469]0|7[05])) b/i                  // Voice Xtreme Phones
            ], [[VENDOR, 'Voice'], MODEL, [TYPE, MOBILE]], [
            /\b(lvtel\-)?(v1[12]) b/i                                           // LvTel Phones
            ], [[VENDOR, 'LvTel'], MODEL, [TYPE, MOBILE]], [
            /\b(ph-1) /i                                                        // Essential PH-1
            ], [MODEL, [VENDOR, 'Essential'], [TYPE, MOBILE]], [
            /\b(v(100md|700na|7011|917g).*\b) b/i                               // Envizen Tablets
            ], [MODEL, [VENDOR, 'Envizen'], [TYPE, TABLET]], [
            /\b(trio[-\w\. ]+) b/i                                              // MachSpeed Tablets
            ], [MODEL, [VENDOR, 'MachSpeed'], [TYPE, TABLET]], [
            /\btu_(1491) b/i                                                    // Rotor Tablets
            ], [MODEL, [VENDOR, 'Rotor'], [TYPE, TABLET]], [
            /(shield[\w ]+) b/i                                                 // Nvidia Shield Tablets
            ], [MODEL, [VENDOR, 'Nvidia'], [TYPE, TABLET]], [
            /(sprint) (\w+)/i                                                   // Sprint Phones
            ], [VENDOR, MODEL, [TYPE, MOBILE]], [
            /(kin\.[onetw]{3})/i                                                // Microsoft Kin
            ], [[MODEL, /\./g, ' '], [VENDOR, MICROSOFT], [TYPE, MOBILE]], [
            /droid.+; (cc6666?|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i             // Zebra
            ], [MODEL, [VENDOR, ZEBRA], [TYPE, TABLET]], [
            /droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i
            ], [MODEL, [VENDOR, ZEBRA], [TYPE, MOBILE]], [

            ///////////////////
            // SMARTTVS
            ///////////////////

            /smart-tv.+(samsung)/i                                              // Samsung
            ], [VENDOR, [TYPE, SMARTTV]], [
            /hbbtv.+maple;(\d+)/i
            ], [[MODEL, /^/, 'SmartTV'], [VENDOR, SAMSUNG], [TYPE, SMARTTV]], [
            /(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i        // LG SmartTV
            ], [[VENDOR, LG], [TYPE, SMARTTV]], [
            /(apple) ?tv/i                                                      // Apple TV
            ], [VENDOR, [MODEL, APPLE+' TV'], [TYPE, SMARTTV]], [
            /crkey/i                                                            // Google Chromecast
            ], [[MODEL, CHROME+'cast'], [VENDOR, GOOGLE], [TYPE, SMARTTV]], [
            /droid.+aft(\w+)( bui|\))/i                                         // Fire TV
            ], [MODEL, [VENDOR, AMAZON], [TYPE, SMARTTV]], [
            /\(dtv[\);].+(aquos)/i,
            /(aquos-tv[\w ]+)\)/i                                               // Sharp
            ], [MODEL, [VENDOR, SHARP], [TYPE, SMARTTV]],[
            /(bravia[\w ]+)( bui|\))/i                                              // Sony
            ], [MODEL, [VENDOR, SONY], [TYPE, SMARTTV]], [
            /(mitv-\w{5}) bui/i                                                 // Xiaomi
            ], [MODEL, [VENDOR, XIAOMI], [TYPE, SMARTTV]], [
            /Hbbtv.*(technisat) (.*);/i                                         // TechniSAT
            ], [VENDOR, MODEL, [TYPE, SMARTTV]], [
            /\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i,                          // Roku
            /hbbtv\/\d+\.\d+\.\d+ +\([\w\+ ]*; *([\w\d][^;]*);([^;]*)/i         // HbbTV devices
            ], [[VENDOR, trim], [MODEL, trim], [TYPE, SMARTTV]], [
            /\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i                   // SmartTV from Unidentified Vendors
            ], [[TYPE, SMARTTV]], [

            ///////////////////
            // CONSOLES
            ///////////////////

            /(ouya)/i,                                                          // Ouya
            /(nintendo) ([wids3utch]+)/i                                        // Nintendo
            ], [VENDOR, MODEL, [TYPE, CONSOLE]], [
            /droid.+; (shield) bui/i                                            // Nvidia
            ], [MODEL, [VENDOR, 'Nvidia'], [TYPE, CONSOLE]], [
            /(playstation [345portablevi]+)/i                                   // Playstation
            ], [MODEL, [VENDOR, SONY], [TYPE, CONSOLE]], [
            /\b(xbox(?: one)?(?!; xbox))[\); ]/i                                // Microsoft Xbox
            ], [MODEL, [VENDOR, MICROSOFT], [TYPE, CONSOLE]], [

            ///////////////////
            // WEARABLES
            ///////////////////

            /((pebble))app/i                                                    // Pebble
            ], [VENDOR, MODEL, [TYPE, WEARABLE]], [
            /(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i                              // Apple Watch
            ], [MODEL, [VENDOR, APPLE], [TYPE, WEARABLE]], [
            /droid.+; (glass) \d/i                                              // Google Glass
            ], [MODEL, [VENDOR, GOOGLE], [TYPE, WEARABLE]], [
            /droid.+; (wt63?0{2,3})\)/i
            ], [MODEL, [VENDOR, ZEBRA], [TYPE, WEARABLE]], [
            /(quest( \d| pro)?)/i                                               // Oculus Quest
            ], [MODEL, [VENDOR, FACEBOOK], [TYPE, WEARABLE]], [

            ///////////////////
            // EMBEDDED
            ///////////////////

            /(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i                              // Tesla
            ], [VENDOR, [TYPE, EMBEDDED]], [
            /(aeobc)\b/i                                                        // Echo Dot
            ], [MODEL, [VENDOR, AMAZON], [TYPE, EMBEDDED]], [

            ////////////////////
            // MIXED (GENERIC)
            ///////////////////

            /droid .+?; ([^;]+?)(?: bui|; wv\)|\) applew).+? mobile safari/i    // Android Phones from Unidentified Vendors
            ], [MODEL, [TYPE, MOBILE]], [
            /droid .+?; ([^;]+?)(?: bui|\) applew).+?(?! mobile) safari/i       // Android Tablets from Unidentified Vendors
            ], [MODEL, [TYPE, TABLET]], [
            /\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i                      // Unidentifiable Tablet
            ], [[TYPE, TABLET]], [
            /(phone|mobile(?:[;\/]| [ \w\/\.]*safari)|pda(?=.+windows ce))/i    // Unidentifiable Mobile
            ], [[TYPE, MOBILE]], [
            /(android[-\w\. ]{0,9});.+buil/i                                    // Generic Android Device
            ], [MODEL, [VENDOR, 'Generic']]
        ],

        engine : [[

            /windows.+ edge\/([\w\.]+)/i                                       // EdgeHTML
            ], [VERSION, [NAME, EDGE+'HTML']], [

            /webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i                         // Blink
            ], [VERSION, [NAME, 'Blink']], [

            /(presto)\/([\w\.]+)/i,                                             // Presto
            /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i, // WebKit/Trident/NetFront/NetSurf/Amaya/Lynx/w3m/Goanna
            /ekioh(flow)\/([\w\.]+)/i,                                          // Flow
            /(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i,                           // KHTML/Tasman/Links
            /(icab)[\/ ]([23]\.[\d\.]+)/i,                                      // iCab
            /\b(libweb)/i
            ], [NAME, VERSION], [

            /rv\:([\w\.]{1,9})\b.+(gecko)/i                                     // Gecko
            ], [VERSION, NAME]
        ],

        os : [[

            // Windows
            /microsoft (windows) (vista|xp)/i                                   // Windows (iTunes)
            ], [NAME, VERSION], [
            /(windows (?:phone(?: os)?|mobile))[\/ ]?([\d\.\w ]*)/i             // Windows Phone
            ], [NAME, [VERSION, strMapper, windowsVersionMap]], [
            /windows nt 6\.2; (arm)/i,                                        // Windows RT
            /windows[\/ ]?([ntce\d\. ]+\w)(?!.+xbox)/i,
            /(?:win(?=3|9|n)|win 9x )([nt\d\.]+)/i
            ], [[VERSION, strMapper, windowsVersionMap], [NAME, 'Windows']], [

            // iOS/macOS
            /ip[honead]{2,4}\b(?:.*os ([\w]+) like mac|; opera)/i,              // iOS
            /(?:ios;fbsv\/|iphone.+ios[\/ ])([\d\.]+)/i,
            /cfnetwork\/.+darwin/i
            ], [[VERSION, /_/g, '.'], [NAME, 'iOS']], [
            /(mac os x) ?([\w\. ]*)/i,
            /(macintosh|mac_powerpc\b)(?!.+haiku)/i                             // Mac OS
            ], [[NAME, MAC_OS], [VERSION, /_/g, '.']], [

            // Mobile OSes
            /droid ([\w\.]+)\b.+(android[- ]x86|harmonyos)/i                    // Android-x86/HarmonyOS
            ], [VERSION, NAME], [                                               // Android/WebOS/QNX/Bada/RIM/Maemo/MeeGo/Sailfish OS
            /(android|webos|qnx|bada|rim tablet os|maemo|meego|sailfish)[-\/ ]?([\w\.]*)/i,
            /(blackberry)\w*\/([\w\.]*)/i,                                      // Blackberry
            /(tizen|kaios)[\/ ]([\w\.]+)/i,                                     // Tizen/KaiOS
            /\((series40);/i                                                    // Series 40
            ], [NAME, VERSION], [
            /\(bb(10);/i                                                        // BlackBerry 10
            ], [VERSION, [NAME, BLACKBERRY]], [
            /(?:symbian ?os|symbos|s60(?=;)|series60)[-\/ ]?([\w\.]*)/i         // Symbian
            ], [VERSION, [NAME, 'Symbian']], [
            /mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i // Firefox OS
            ], [VERSION, [NAME, FIREFOX+' OS']], [
            /web0s;.+rt(tv)/i,
            /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i                              // WebOS
            ], [VERSION, [NAME, 'webOS']], [
            /watch(?: ?os[,\/]|\d,\d\/)([\d\.]+)/i                              // watchOS
            ], [VERSION, [NAME, 'watchOS']], [

            // Google Chromecast
            /crkey\/([\d\.]+)/i                                                 // Google Chromecast
            ], [VERSION, [NAME, CHROME+'cast']], [
            /(cros) [\w]+(?:\)| ([\w\.]+)\b)/i                                  // Chromium OS
            ], [[NAME, CHROMIUM_OS], VERSION],[

            // Smart TVs
            /panasonic;(viera)/i,                                               // Panasonic Viera
            /(netrange)mmh/i,                                                   // Netrange
            /(nettv)\/(\d+\.[\w\.]+)/i,                                         // NetTV

            // Console
            /(nintendo|playstation) ([wids345portablevuch]+)/i,                 // Nintendo/Playstation
            /(xbox); +xbox ([^\);]+)/i,                                         // Microsoft Xbox (360, One, X, S, Series X, Series S)

            // Other
            /\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i,                            // Joli/Palm
            /(mint)[\/\(\) ]?(\w*)/i,                                           // Mint
            /(mageia|vectorlinux)[; ]/i,                                        // Mageia/VectorLinux
            /([kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?= linux)|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire)(?: gnu\/linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i,
                                                                                // Ubuntu/Debian/SUSE/Gentoo/Arch/Slackware/Fedora/Mandriva/CentOS/PCLinuxOS/RedHat/Zenwalk/Linpus/Raspbian/Plan9/Minix/RISCOS/Contiki/Deepin/Manjaro/elementary/Sabayon/Linspire
            /(hurd|linux) ?([\w\.]*)/i,                                         // Hurd/Linux
            /(gnu) ?([\w\.]*)/i,                                                // GNU
            /\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i, // FreeBSD/NetBSD/OpenBSD/PC-BSD/GhostBSD/DragonFly
            /(haiku) (\w+)/i                                                    // Haiku
            ], [NAME, VERSION], [
            /(sunos) ?([\w\.\d]*)/i                                             // Solaris
            ], [[NAME, 'Solaris'], VERSION], [
            /((?:open)?solaris)[-\/ ]?([\w\.]*)/i,                              // Solaris
            /(aix) ((\d)(?=\.|\)| )[\w\.])*/i,                                  // AIX
            /\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux|serenityos)/i, // BeOS/OS2/AmigaOS/MorphOS/OpenVMS/Fuchsia/HP-UX/SerenityOS
            /(unix) ?([\w\.]*)/i                                                // UNIX
            ], [NAME, VERSION]
        ]
    };

    /////////////////
    // Constructor
    ////////////////

    var UAParser = function (ua, extensions) {

        if (typeof ua === OBJ_TYPE) {
            extensions = ua;
            ua = undefined;
        }

        if (!(this instanceof UAParser)) {
            return new UAParser(ua, extensions).getResult();
        }

        var _navigator = (typeof window !== UNDEF_TYPE && window.navigator) ? window.navigator : undefined;
        var _ua = ua || ((_navigator && _navigator.userAgent) ? _navigator.userAgent : EMPTY);
        var _uach = (_navigator && _navigator.userAgentData) ? _navigator.userAgentData : undefined;
        var _rgxmap = extensions ? extend(regexes, extensions) : regexes;
        var _isSelfNav = _navigator && _navigator.userAgent == _ua;

        this.getBrowser = function () {
            var _browser = {};
            _browser[NAME] = undefined;
            _browser[VERSION] = undefined;
            rgxMapper.call(_browser, _ua, _rgxmap.browser);
            _browser[MAJOR] = majorize(_browser[VERSION]);
            // Brave-specific detection
            if (_isSelfNav && _navigator && _navigator.brave && typeof _navigator.brave.isBrave == FUNC_TYPE) {
                _browser[NAME] = 'Brave';
            }
            return _browser;
        };
        this.getCPU = function () {
            var _cpu = {};
            _cpu[ARCHITECTURE] = undefined;
            rgxMapper.call(_cpu, _ua, _rgxmap.cpu);
            return _cpu;
        };
        this.getDevice = function () {
            var _device = {};
            _device[VENDOR] = undefined;
            _device[MODEL] = undefined;
            _device[TYPE] = undefined;
            rgxMapper.call(_device, _ua, _rgxmap.device);
            if (_isSelfNav && !_device[TYPE] && _uach && _uach.mobile) {
                _device[TYPE] = MOBILE;
            }
            // iPadOS-specific detection: identified as Mac, but has some iOS-only properties
            if (_isSelfNav && _device[MODEL] == 'Macintosh' && _navigator && typeof _navigator.standalone !== UNDEF_TYPE && _navigator.maxTouchPoints && _navigator.maxTouchPoints > 2) {
                _device[MODEL] = 'iPad';
                _device[TYPE] = TABLET;
            }
            return _device;
        };
        this.getEngine = function () {
            var _engine = {};
            _engine[NAME] = undefined;
            _engine[VERSION] = undefined;
            rgxMapper.call(_engine, _ua, _rgxmap.engine);
            return _engine;
        };
        this.getOS = function () {
            var _os = {};
            _os[NAME] = undefined;
            _os[VERSION] = undefined;
            rgxMapper.call(_os, _ua, _rgxmap.os);
            if (_isSelfNav && !_os[NAME] && _uach && _uach.platform && _uach.platform != 'Unknown') {
                _os[NAME] = _uach.platform  
                                    .replace(/chrome os/i, CHROMIUM_OS)
                                    .replace(/macos/i, MAC_OS);           // backward compatibility
            }
            return _os;
        };
        this.getResult = function () {
            return {
                ua      : this.getUA(),
                browser : this.getBrowser(),
                engine  : this.getEngine(),
                os      : this.getOS(),
                device  : this.getDevice(),
                cpu     : this.getCPU()
            };
        };
        this.getUA = function () {
            return _ua;
        };
        this.setUA = function (ua) {
            _ua = (typeof ua === STR_TYPE && ua.length > UA_MAX_LENGTH) ? trim(ua, UA_MAX_LENGTH) : ua;
            return this;
        };
        this.setUA(_ua);
        return this;
    };

    UAParser.VERSION = LIBVERSION;
    UAParser.BROWSER =  enumerize([NAME, VERSION, MAJOR]);
    UAParser.CPU = enumerize([ARCHITECTURE]);
    UAParser.DEVICE = enumerize([MODEL, VENDOR, TYPE, CONSOLE, MOBILE, SMARTTV, TABLET, WEARABLE, EMBEDDED]);
    UAParser.ENGINE = UAParser.OS = enumerize([NAME, VERSION]);

    ///////////
    // Export
    //////////

    // check js environment
    if (typeof(exports) !== UNDEF_TYPE) {
        // nodejs env
        if ("object" !== UNDEF_TYPE && module.exports) {
            exports = module.exports = UAParser;
        }
        exports.UAParser = UAParser;
    } else {
        // requirejs env (optional)
        if ("function" === FUNC_TYPE && __webpack_require__.amdO) {
            !(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {
                return UAParser;
            }).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
        } else if (typeof window !== UNDEF_TYPE) {
            // browser env
            window.UAParser = UAParser;
        }
    }

    // jQuery/Zepto specific (optional)
    // Note:
    //   In AMD env the global scope should be kept clean, but jQuery is an exception.
    //   jQuery always exports to global scope, unless jQuery.noConflict(true) is used,
    //   and we should catch that.
    var $ = typeof window !== UNDEF_TYPE && (window.jQuery || window.Zepto);
    if ($ && !$.ua) {
        var parser = new UAParser();
        $.ua = parser.getResult();
        $.ua.get = function () {
            return parser.getUA();
        };
        $.ua.set = function (ua) {
            parser.setUA(ua);
            var result = parser.getResult();
            for (var prop in result) {
                $.ua[prop] = result[prop];
            }
        };
    }

})(typeof window === 'object' ? window : this);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/amd options */
/******/ 	(() => {
/******/ 		__webpack_require__.amdO = {};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./index.ts");
/******/ 	ATSEvents = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxDQUFDOzs7Ozs7O1VDeDdCRDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTs7Ozs7VUVBQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL0FUU0V2ZW50cy8uL2luZGV4LnRzIiwid2VicGFjazovL0FUU0V2ZW50cy8uL3NyYy9Ccm93c2VySW5mby50cyIsIndlYnBhY2s6Ly9BVFNFdmVudHMvLi9zcmMvQ2FtcGFpZ25JbmZvLnRzIiwid2VicGFjazovL0FUU0V2ZW50cy8uL3NyYy9Mb2dnZXIudHMiLCJ3ZWJwYWNrOi8vQVRTRXZlbnRzLy4vc3JjL01hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vQVRTRXZlbnRzLy4vc3JjL1JlbW90ZS50cyIsIndlYnBhY2s6Ly9BVFNFdmVudHMvLi9zcmMvVG9vbHMudHMiLCJ3ZWJwYWNrOi8vQVRTRXZlbnRzLy4vc3JjL1VybFBhcnNlci50cyIsIndlYnBhY2s6Ly9BVFNFdmVudHMvLi9zcmMvZXZlbnRzL0FUU0V2ZW50LnRzIiwid2VicGFjazovL0FUU0V2ZW50cy8uL3NyYy9ldmVudHMvQXR0YWNobWVudE9wZW4udHMiLCJ3ZWJwYWNrOi8vQVRTRXZlbnRzLy4vc3JjL2V2ZW50cy9DbGljay50cyIsIndlYnBhY2s6Ly9BVFNFdmVudHMvLi9zcmMvZXZlbnRzL0NsaXBib2FyZC50cyIsIndlYnBhY2s6Ly9BVFNFdmVudHMvLi9zcmMvZXZlbnRzL0Rvd25sb2FkLnRzIiwid2VicGFjazovL0FUU0V2ZW50cy8uL3NyYy9ldmVudHMvRXh0ZW5zaW9uLnRzIiwid2VicGFjazovL0FUU0V2ZW50cy8uL3NyYy9ldmVudHMvRmlsZURvd25sb2FkLnRzIiwid2VicGFjazovL0FUU0V2ZW50cy8uL3NyYy9ldmVudHMvRmlsZU9wZW4udHMiLCJ3ZWJwYWNrOi8vQVRTRXZlbnRzLy4vc3JjL2V2ZW50cy9JbnB1dC50cyIsIndlYnBhY2s6Ly9BVFNFdmVudHMvLi9zcmMvZXZlbnRzL0xvY2F0aW9uLnRzIiwid2VicGFjazovL0FUU0V2ZW50cy8uL3NyYy9ldmVudHMvTWljcm9waG9uZS50cyIsIndlYnBhY2s6Ly9BVFNFdmVudHMvLi9zcmMvZXZlbnRzL05vdGlmaWNhdGlvbi50cyIsIndlYnBhY2s6Ly9BVFNFdmVudHMvLi9zcmMvZXZlbnRzL1BhZ2VMZWZ0LnRzIiwid2VicGFjazovL0FUU0V2ZW50cy8uL3NyYy9ldmVudHMvUGFnZUxvYWRlZC50cyIsIndlYnBhY2s6Ly9BVFNFdmVudHMvLi9zcmMvZXZlbnRzL1BhZ2VSZWFkLnRzIiwid2VicGFjazovL0FUU0V2ZW50cy8uL3NyYy9ldmVudHMvU3VibWl0LnRzIiwid2VicGFjazovL0FUU0V2ZW50cy8uL3NyYy9ldmVudHMvV2ViY2FtLnRzIiwid2VicGFjazovL0FUU0V2ZW50cy8uL25vZGVfbW9kdWxlcy91YS1wYXJzZXItanMvc3JjL3VhLXBhcnNlci5qcyIsIndlYnBhY2s6Ly9BVFNFdmVudHMvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vQVRTRXZlbnRzL3dlYnBhY2svcnVudGltZS9hbWQgb3B0aW9ucyIsIndlYnBhY2s6Ly9BVFNFdmVudHMvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9BVFNFdmVudHMvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL0FUU0V2ZW50cy93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTWFuYWdlciB9IGZyb20gXCIuL3NyYy9NYW5hZ2VyXCI7XG5pbXBvcnQgUmVtb3RlIGZyb20gXCIuL3NyYy9SZW1vdGVcIjtcbmltcG9ydCB7cmVtb3ZlU3ViZG9tYWlufSBmcm9tIFwiLi9zcmMvVG9vbHNcIjtcblxuaW50ZXJmYWNlIE9wdGlvbnMge1xuXHRhcGlLZXk/OiBzdHJpbmcsXG5cdGRlYnVnPzogYm9vbGVhbixcblx0ZXZlbnRzPzogc3RyaW5nW11cblx0cmVkaXJlY3RVcmw6IHN0cmluZyxcblx0c2hvdWxkUmVkaXJlY3Q6IGJvb2xlYW4sXG5cdHNvdXJjZTogc3RyaW5nLFxuXHR1cmw6IHN0cmluZyxcbn1cblxuY29uc3QgZGVmYXVsdE9wdGlvbnM6IE9wdGlvbnMgPSB7XG5cdGV2ZW50czogW10sXG5cdGRlYnVnOiBmYWxzZSxcblx0c2hvdWxkUmVkaXJlY3Q6IHRydWUsXG5cdHJlZGlyZWN0VXJsOiBgaHR0cHM6Ly9vb3BzLiR7cmVtb3ZlU3ViZG9tYWluKHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZSl9YCxcblx0c291cmNlOiBcIkxQXCIsXG5cdHVybDogXCJodHRwczovL2FwaS5hdHRhY2tzaW11bGF0b3IuY29tL3YwL2NsaWVudC1ldmVudHNcIixcbn07XG5cbmNsYXNzIEFUU0V2ZW50cyB7XG5cdHByaXZhdGUgbWFuYWdlcjogTWFuYWdlcjtcblxuXHRjb25zdHJ1Y3RvcihvcHRpb25zOiBPcHRpb25zKSB7XG5cdFx0Y29uc3QgX29wdGlvbnMgPSB7Li4uZGVmYXVsdE9wdGlvbnMsIC4uLm9wdGlvbnN9O1xuXHRcdGlmIChfb3B0aW9ucy5kZWJ1Zykge1xuXHRcdFx0Y29uc29sZS5sb2coX29wdGlvbnMpO1xuXHRcdH1cblx0XHRjb25zdCByZW1vdGUgPSBuZXcgUmVtb3RlKF9vcHRpb25zLmFwaUtleSwgX29wdGlvbnMudXJsLCBfb3B0aW9ucy5kZWJ1Zyk7XG5cdFx0dGhpcy5tYW5hZ2VyID0gbmV3IE1hbmFnZXIocmVtb3RlLCBfb3B0aW9ucy5ldmVudHMsIF9vcHRpb25zLnNvdXJjZSwgX29wdGlvbnMucmVkaXJlY3RVcmwsIF9vcHRpb25zLnNob3VsZFJlZGlyZWN0LCBfb3B0aW9ucy5kZWJ1Zyk7XG5cdH1cblxuXHRsaXN0ZW4oKSB7XG5cdFx0dGhpcy5tYW5hZ2VyLmxpc3RlbigpO1xuXHR9XG5cblx0b24oZXZlbnROYW1lOiBzdHJpbmcsIGNhbGxiYWNrKSB7XG5cdFx0dGhpcy5tYW5hZ2VyLnN1YnNjcmliZShldmVudE5hbWUsIGNhbGxiYWNrKTtcblx0fVxuXG5cdG9mZihldmVudE5hbWU6IHN0cmluZywgY2FsbGJhY2spIHtcblx0XHR0aGlzLm1hbmFnZXIudW5zdWJzY3JpYmUoZXZlbnROYW1lLCBjYWxsYmFjayk7XG5cdH1cblxuXHRzdG9wKCkge1xuXHRcdHRoaXMubWFuYWdlci5zdG9wKCk7XG5cdH1cblxuXHR0cmlnZ2VyKG5hbWU6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuXHRcdHJldHVybiB0aGlzLm1hbmFnZXIudHJpZ2dlcihuYW1lKTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEFUU0V2ZW50cztcbiIsImltcG9ydCBwYXJzZXIgZnJvbSBcInVhLXBhcnNlci1qc1wiO1xuXG5pbnRlcmZhY2UgU2NyZWVuU2l6ZSB7XG4gICAgd2lkdGggPzogbnVtYmVyXG4gICAgaGVpZ2h0ID86IG51bWJlclxufVxuXG5pbnRlcmZhY2UgQnJvd3NlciB7XG4gICAgbmFtZSA/OiBzdHJpbmdcbiAgICB2ZXJzaW9uID86IHN0cmluZ1xuICAgIG1ham9yX3ZlcnNpb24gPzogbnVtYmVyXG4gICAgbW9iaWxlID86IGJvb2xlYW5cbn1cblxuaW50ZXJmYWNlIE9TIHtcbiAgICBuYW1lID86IHN0cmluZ1xuICAgIHZlcnNpb24gPzogc3RyaW5nXG59XG5cbmludGVyZmFjZSBEZXZpY2Uge1xuICAgIG1vZGVsPzogc3RyaW5nXG4gICAgdHlwZT86IHN0cmluZ1xuICAgIHZlbmRvcj86IHN0cmluZ1xufVxuaW50ZXJmYWNlIENwdSB7XG4gICAgYXJjaGl0ZWN0dXJlID86c3RyaW5nXG59XG5leHBvcnQgaW50ZXJmYWNlIEJyb3dzZXJJbmZvIHtcbiAgICB1YTogc3RyaW5nO1xuICAgIHNjcmVlbl9zaXplOiBTY3JlZW5TaXplO1xuICAgIGJyb3dzZXI6IEJyb3dzZXI7XG4gICAgb3M6IE9TO1xuICAgIGRldmljZTogRGV2aWNlO1xuICAgIGNwdTogQ3B1O1xufVxuXG5mdW5jdGlvbiBmaW5kQnJvd3NlcigpOiBCcm93c2VyIHtcblx0bGV0IHZlck9mZnNldDogbnVtYmVyO1xuXHRjb25zdCBicm93c2VyOiBCcm93c2VyID0ge307XG5cdGNvbnN0IHVzZXJBZ2VudCA9IG5hdmlnYXRvci51c2VyQWdlbnQ7XG5cblx0Ly8gT3BlcmFcblx0aWYgKCh2ZXJPZmZzZXQgPSB1c2VyQWdlbnQuaW5kZXhPZihcIk9wZXJhXCIpKSAhPT0gLTEpIHtcblx0XHRicm93c2VyLm5hbWUgPSBcIk9wZXJhXCI7XG5cdFx0YnJvd3Nlci52ZXJzaW9uID0gdXNlckFnZW50LnN1YnN0cmluZyh2ZXJPZmZzZXQgKyA2KTtcblx0XHRpZiAoKHZlck9mZnNldCA9IHVzZXJBZ2VudC5pbmRleE9mKFwiVmVyc2lvblwiKSkgIT09IC0xKSB7XG5cdFx0XHRicm93c2VyLnZlcnNpb24gPSB1c2VyQWdlbnQuc3Vic3RyaW5nKHZlck9mZnNldCArIDgpO1xuXHRcdH1cblx0fVxuXG5cdC8vIE9wZXJhIE5leHRcblx0ZWxzZSBpZiAoKHZlck9mZnNldCA9IHVzZXJBZ2VudC5pbmRleE9mKFwiT1BSXCIpKSAhPT0gLTEpIHtcblx0XHRicm93c2VyLm5hbWUgPSBcIk9wZXJhXCI7XG5cdFx0YnJvd3Nlci52ZXJzaW9uID0gdXNlckFnZW50LnN1YnN0cmluZyh2ZXJPZmZzZXQgKyA1KTtcblx0fVxuXG5cdC8vIEVkZ2Vcblx0ZWxzZSBpZiAoKHZlck9mZnNldCA9IHVzZXJBZ2VudC5pbmRleE9mKFwiRWRnZVwiKSkgIT09IC0xKSB7XG5cdFx0YnJvd3Nlci5uYW1lID0gXCJNaWNyb3NvZnQgRWRnZVwiO1xuXHRcdGJyb3dzZXIudmVyc2lvbiA9IHVzZXJBZ2VudC5zdWJzdHJpbmcodmVyT2Zmc2V0ICsgNSk7XG5cdH1cblxuXHQvLyBNU0lFXG5cdGVsc2UgaWYgKCh2ZXJPZmZzZXQgPSB1c2VyQWdlbnQuaW5kZXhPZihcIk1TSUVcIikpICE9PSAtMSkge1xuXHRcdGJyb3dzZXIubmFtZSA9IFwiTWljcm9zb2Z0IEludGVybmV0IEV4cGxvcmVyXCI7XG5cdFx0YnJvd3Nlci52ZXJzaW9uID0gdXNlckFnZW50LnN1YnN0cmluZyh2ZXJPZmZzZXQgKyA1KTtcblx0fVxuXG5cdC8vIENocm9tZVxuXHRlbHNlIGlmICgodmVyT2Zmc2V0ID0gdXNlckFnZW50LmluZGV4T2YoXCJDaHJvbWVcIikpICE9PSAtMSkge1xuXHRcdGJyb3dzZXIubmFtZSA9IFwiQ2hyb21lXCI7XG5cdFx0YnJvd3Nlci52ZXJzaW9uID0gdXNlckFnZW50LnN1YnN0cmluZyh2ZXJPZmZzZXQgKyA3KTtcblx0fVxuXG5cdC8vIFNhZmFyaVxuXHRlbHNlIGlmICgodmVyT2Zmc2V0ID0gdXNlckFnZW50LmluZGV4T2YoXCJTYWZhcmlcIikpICE9PSAtMSkge1xuXHRcdGJyb3dzZXIubmFtZSA9IFwiU2FmYXJpXCI7XG5cdFx0YnJvd3Nlci52ZXJzaW9uID0gdXNlckFnZW50LnN1YnN0cmluZyh2ZXJPZmZzZXQgKyA3KTtcblx0XHRpZiAoKHZlck9mZnNldCA9IHVzZXJBZ2VudC5pbmRleE9mKFwiVmVyc2lvblwiKSkgIT09IC0xKSB7XG5cdFx0XHRicm93c2VyLnZlcnNpb24gPSB1c2VyQWdlbnQuc3Vic3RyaW5nKHZlck9mZnNldCArIDgpO1xuXHRcdH1cblx0fVxuXG5cdC8vIEZpcmVmb3hcblx0ZWxzZSBpZiAoKHZlck9mZnNldCA9IHVzZXJBZ2VudC5pbmRleE9mKFwiRmlyZWZveFwiKSkgIT09IC0xKSB7XG5cdFx0YnJvd3Nlci5uYW1lID0gXCJGaXJlZm94XCI7XG5cdFx0YnJvd3Nlci52ZXJzaW9uID0gdXNlckFnZW50LnN1YnN0cmluZyh2ZXJPZmZzZXQgKyA4KTtcblx0fVxuXG5cdC8vIE1TSUUgMTErXG5cdGVsc2UgaWYgKHVzZXJBZ2VudC5pbmRleE9mKFwiVHJpZGVudC9cIikgIT09IC0xKSB7XG5cdFx0YnJvd3Nlci5uYW1lID0gXCJNaWNyb3NvZnQgSW50ZXJuZXQgRXhwbG9yZXJcIjtcblx0XHRicm93c2VyLnZlcnNpb24gPSB1c2VyQWdlbnQuc3Vic3RyaW5nKHVzZXJBZ2VudC5pbmRleE9mKFwicnY6XCIpICsgMyk7XG5cdH1cblxuXHRicm93c2VyLm1vYmlsZSA9IC9Nb2JpbGV8bWluaXxGZW5uZWN8QW5kcm9pZHxpUChhZHxvZHxob25lKS8udGVzdCh1c2VyQWdlbnQpO1xuXG5cdC8vIHRyaW0gdGhlIHZlcnNpb24gc3RyaW5nXG5cdGxldCBpeDtcblx0aWYgKChpeCA9IGJyb3dzZXIudmVyc2lvbi5pbmRleE9mKFwiO1wiKSkgIT0gLTEpIGJyb3dzZXIudmVyc2lvbiA9IGJyb3dzZXIudmVyc2lvbi5zdWJzdHJpbmcoMCwgaXgpO1xuXHRpZiAoKGl4ID0gYnJvd3Nlci52ZXJzaW9uLmluZGV4T2YoXCIgXCIpKSAhPSAtMSkgYnJvd3Nlci52ZXJzaW9uID0gYnJvd3Nlci52ZXJzaW9uLnN1YnN0cmluZygwLCBpeCk7XG5cdGlmICgoaXggPSBicm93c2VyLnZlcnNpb24uaW5kZXhPZihcIilcIikpICE9IC0xKSBicm93c2VyLnZlcnNpb24gPSBicm93c2VyLnZlcnNpb24uc3Vic3RyaW5nKDAsIGl4KTtcblxuXHRicm93c2VyLm1ham9yX3ZlcnNpb24gPSBwYXJzZUludChcIlwiICsgYnJvd3Nlci52ZXJzaW9uLCAxMCk7XG5cdGlmIChpc05hTiggYnJvd3Nlci5tYWpvcl92ZXJzaW9uKSkge1xuXHRcdGJyb3dzZXIudmVyc2lvbiA9IFwiXCIgKyBwYXJzZUZsb2F0KG5hdmlnYXRvci5hcHBWZXJzaW9uKTtcblx0XHRicm93c2VyLm1ham9yX3ZlcnNpb24gPSBwYXJzZUludChuYXZpZ2F0b3IuYXBwVmVyc2lvbiwgMTApO1xuXHR9XG4gICAgXG5cdHJldHVybiBicm93c2VyO1xufVxuXG5mdW5jdGlvbiBmaW5kT3BlcmF0aW5nU3lzdGVtKHBhcnNlcjogYW55KTogT1Mge1xuXHRjb25zdCB7bmFtZSwgdmVyc2lvbn0gPSBwYXJzZXIuZ2V0T1MoKTtcblx0cmV0dXJuIHsgbmFtZSwgdmVyc2lvbn07XG59XG5cbmZ1bmN0aW9uIGZpbmREZXZpY2UocGFyc2VyOiBhbnkpOiBEZXZpY2Uge1xuXHRjb25zdCB7bW9kZWwsIHR5cGUsIHZlbmRvcn0gPSBwYXJzZXIuZ2V0RGV2aWNlKCk7XG5cdHJldHVybiB7bW9kZWwsIHR5cGUsIHZlbmRvcn07XG59XG5cbmZ1bmN0aW9uIGZpbmRDcHUocGFyc2VyOiBhbnkpOiBDcHUge1xuXHRjb25zdCB7YXJjaGl0ZWN0dXJlfSA9IHBhcnNlci5nZXRDUFUoKTtcblx0cmV0dXJuIHthcmNoaXRlY3R1cmV9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmluZEJyb3dzZXJJbmZvKCk6IEJyb3dzZXJJbmZvIHtcblx0Y29uc3QgdWEgPSBuZXcgcGFyc2VyKCk7XG5cdHJldHVybiB7XG5cdFx0dWE6IHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50LFxuXHRcdHNjcmVlbl9zaXplOiB7XG5cdFx0XHR3aWR0aDogc2NyZWVuLndpZHRoIHx8IDAsXG5cdFx0XHRoZWlnaHQ6IHNjcmVlbi5oZWlnaHQgfHwgMFxuXHRcdH0sXG5cdFx0YnJvd3NlcjogZmluZEJyb3dzZXIoKSxcblx0XHRvczogZmluZE9wZXJhdGluZ1N5c3RlbSh1YSksXG5cdFx0ZGV2aWNlOiBmaW5kRGV2aWNlKHVhKSxcblx0XHRjcHU6IGZpbmRDcHUodWEpXG5cdH07XG59IiwiaW1wb3J0IHsgVXJsUGFyc2VyIH0gZnJvbSBcIi4vVXJsUGFyc2VyXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2FtcGFpZ25JbmZvIHtcbiAgICBhdHNfZW52ID86IHN0cmluZ1xuICAgIGF0c19hdGtfdHlwZSA/OiBzdHJpbmdcbiAgICBhdHNfY2FtcGFpZ25fbmFtZSA/OiBzdHJpbmdcbiAgICBhdHNfY29tcGFueV9pZCA/OiBzdHJpbmdcbiAgICBhdHNfaW5zdGFuY2VfaWQgPzogc3RyaW5nXG4gICAgYXRzX2xvY2FsZSA/OiBzdHJpbmdcbiAgICBhdHNfcHJvY2Vzc2VkX2RhdGUgPzogc3RyaW5nXG4gICAgYXRzX3VzZXJfaWQgPzogc3RyaW5nXG5cdGRvd25sb2FkX3R5cGUgPzogc3RyaW5nXG59XG5cbmZ1bmN0aW9uIHJlYWRUb2tlblN0cmluZyh0b2tlblN0cmluZyA/OiBzdHJpbmcsIGZpbGVUeXBlID86IHN0cmluZyk6IENhbXBhaWduSW5mbyB7XG5cdGNvbnN0IGJhc2U2NFVybCA9IHRva2VuU3RyaW5nLnNwbGl0KFwiLlwiKVsxXTtcblx0Y29uc3QgYmFzZTY0ID0gIGJhc2U2NFVybC5yZXBsYWNlKC8tL2csIFwiK1wiKS5yZXBsYWNlKC9fL2csIFwiL1wiKTtcblx0Y29uc3QgY2FtcGFpZ25JbmZvID0gSlNPTi5wYXJzZSh3aW5kb3cuYXRvYihiYXNlNjQpKS5wYXlsb2FkIGFzIENhbXBhaWduSW5mbztcblxuXHRpZiAoZmlsZVR5cGUgPT09IFwiYXR0YWNobWVudFwiKSB7XG5cdFx0Y2FtcGFpZ25JbmZvLmRvd25sb2FkX3R5cGUgPSBcImF0dGFjaG1lbnRcIjtcblx0fSBlbHNlIGlmIChmaWxlVHlwZSAhPT0gbnVsbCkge1xuXHRcdGNhbXBhaWduSW5mby5kb3dubG9hZF90eXBlID0gXCJmaWxlXCI7XG5cdH1cblxuXHRyZXR1cm4gY2FtcGFpZ25JbmZvO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmluZENhbXBhaWduSW5mbygpIDogW3N0cmluZywgQ2FtcGFpZ25JbmZvXSB7XG5cdGNvbnN0IHVybCA9IG5ldyBVcmxQYXJzZXIod2luZG93LmxvY2F0aW9uLmhyZWYpO1xuXHRjb25zdCB0b2tlblN0cmluZyA9IHVybC5maW5kUGFyYW0oXCJ0a1wiKTtcblx0aWYgKCF0b2tlblN0cmluZykge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIk1pc3NpbmcgQVRUQUNLIFNpbXVsYXRvciB0b2tlblwiKTtcblx0fVxuXHRjb25zdCBmaWxlVHlwZSA9IHVybC5maW5kUGFyYW0oXCJmaWxlX3R5cGVcIik7XG5cblx0dHJ5IHtcblx0XHRyZXR1cm4gW3Rva2VuU3RyaW5nLCByZWFkVG9rZW5TdHJpbmcodG9rZW5TdHJpbmcsIGZpbGVUeXBlKV07XG5cdH0gY2F0Y2goZSkge1xuXHRcdHJldHVybiBbdG9rZW5TdHJpbmcsIHsgYXRzX2NvbXBhbnlfaWQ6IFwiXCIgfV07XG5cdH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIExvZ2dlciB7XG5cdHByaXZhdGUgZGVidWc6IGJvb2xlYW47XG5cdGNvbnN0cnVjdG9yKGRlYnVnOiBib29sZWFuKSB7XG5cdFx0dGhpcy5kZWJ1ZyA9IGRlYnVnO1xuXHR9XG5cblx0cHVibGljIGluZm8obWVzc2FnZTogYW55KTogdm9pZCB7XG5cdFx0aWYgKHRoaXMuZGVidWcpIHtcblx0XHRcdGNvbnNvbGUubG9nKG1lc3NhZ2UpO1xuXHRcdH1cblx0fVxuXG5cdHB1YmxpYyBlcnJvcihtZXNzYWdlOiBhbnkpOiB2b2lkIHtcblx0XHRpZiAodGhpcy5kZWJ1Zykge1xuXHRcdFx0Y29uc29sZS5lcnJvcihtZXNzYWdlKTtcblx0XHR9XG5cdH1cblxuXHRwdWJsaWMgd2FybihtZXNzYWdlOiBhbnkpOiB2b2lkIHtcblx0XHRpZiAodGhpcy5kZWJ1Zykge1xuXHRcdFx0Y29uc29sZS53YXJuKG1lc3NhZ2UpO1xuXHRcdH1cblx0fVxufSIsImltcG9ydCB7IEJyb3dzZXJJbmZvLCBmaW5kQnJvd3NlckluZm8gfSBmcm9tIFwiLi9Ccm93c2VySW5mb1wiO1xuaW1wb3J0IHsgQ2FtcGFpZ25JbmZvLCBmaW5kQ2FtcGFpZ25JbmZvIH0gZnJvbSBcIi4vQ2FtcGFpZ25JbmZvXCI7XG5pbXBvcnQgeyBjcmVhdGVVVUlELCBkZWJvdW5jZSB9IGZyb20gXCIuL1Rvb2xzXCI7IFxuXG5pbXBvcnQgQXR0YWNobWVudE9wZW4gZnJvbSBcIi4vZXZlbnRzL0F0dGFjaG1lbnRPcGVuXCI7XG5pbXBvcnQgQ2xpY2sgZnJvbSBcIi4vZXZlbnRzL0NsaWNrXCI7XG5pbXBvcnQgRG93bmxvYWQgZnJvbSBcIi4vZXZlbnRzL0Rvd25sb2FkXCI7XG5pbXBvcnQgRXh0ZW5zaW9uIGZyb20gXCIuL2V2ZW50cy9FeHRlbnNpb25cIjtcbmltcG9ydCBGaWxlRG93bmxvYWQgZnJvbSBcIi4vZXZlbnRzL0ZpbGVEb3dubG9hZFwiO1xuaW1wb3J0IEZpbGVPcGVuIGZyb20gXCIuL2V2ZW50cy9GaWxlT3BlblwiO1xuaW1wb3J0IElucHV0IGZyb20gXCIuL2V2ZW50cy9JbnB1dFwiO1xuaW1wb3J0IE1pY3JvcGhvbmUgZnJvbSBcIi4vZXZlbnRzL01pY3JvcGhvbmVcIjtcbmltcG9ydCBOb3RpZmljYXRpb24gZnJvbSBcIi4vZXZlbnRzL05vdGlmaWNhdGlvblwiO1xuaW1wb3J0IFBhZ2VMZWZ0IGZyb20gXCIuL2V2ZW50cy9QYWdlTGVmdFwiO1xuaW1wb3J0IFBhZ2VMb2FkZWQgZnJvbSBcIi4vZXZlbnRzL1BhZ2VMb2FkZWRcIjtcbmltcG9ydCBQYWdlUmVhZCBmcm9tIFwiLi9ldmVudHMvUGFnZVJlYWRcIjtcbmltcG9ydCBTdWJtaXQgZnJvbSBcIi4vZXZlbnRzL1N1Ym1pdFwiO1xuaW1wb3J0IFdlYmNhbSBmcm9tIFwiLi9ldmVudHMvV2ViY2FtXCI7XG5pbXBvcnQgTG9jYXRpb24gZnJvbSBcIi4vZXZlbnRzL0xvY2F0aW9uXCI7XG5pbXBvcnQgQ2xpcGJvYXJkIGZyb20gXCIuL2V2ZW50cy9DbGlwYm9hcmRcIjtcblxuaW1wb3J0IElFdmVudCBmcm9tIFwiLi9pbnRlZmFjZXMvSUV2ZW50XCI7XG5cbmltcG9ydCBJRXZlbnRQYXlsb2FkIGZyb20gXCIuL2ludGVmYWNlcy9JRXZlbnRQYXlsb2FkXCI7XG5pbXBvcnQgUmVtb3RlIGZyb20gXCIuL1JlbW90ZVwiO1xuXG5pbXBvcnQgTG9nZ2VyIGZyb20gXCIuL0xvZ2dlclwiO1xuXG5pbnRlcmZhY2UgRXZlbnRTdWJzY3JpcHRpb24ge1xuXHRldmVudE5hbWU6IHN0cmluZztcblx0Y2FsbGJhY2s6IChldmVudDogSUV2ZW50KSA9PiB2b2lkO1xufVxuXG5leHBvcnQgY2xhc3MgTWFuYWdlciB7XG5cdHByaXZhdGUgcmVhZG9ubHkgc3VwcG9ydGVkVHlwZXMgOiBzdHJpbmdbXSA9IFtcImVtYWlsXCIsIFwicGFzc3dvcmRcIiwgXCJ0ZWxcIiwgXCJ0ZXh0XCIsIFwiZ2l2ZW4tbmFtZVwiLCBcIm5hbWVcIiwgXCJmYW1pbHktbmFtZVwiLCBcInN0cmVldC1hZGRyZXNzXCIsIFwiY2MtbmFtZVwiLCBcImNjLWdpdmVuLW5hbWVcIiwgXCJjYy1mYW1pbHktbmFtZVwiLCBcImNjLW51bWJlclwiLCBcImNjLWV4cFwiLCBcImNjLWV4cC1tb250aFwiLCBcImNjLWV4cC15ZWFyXCIsIFwiY2MtY3NjXCIsIFwiY2MtdHlwZVwiXTtcblx0cHJpdmF0ZSByZWFkb25seSBzdXBwb3J0ZWRFdmVudHMgPSB7XG5cdFx0XCJhdHRhY2htZW50X29wZW5lZFwiOiBBdHRhY2htZW50T3Blbixcblx0XHRcImJ1dHRvbl9jbGlja2VkXCI6IENsaWNrLFxuXHRcdFwiZG93bmxvYWRcIjogRG93bmxvYWQsXG5cdFx0XCJleHRlbnNpb25faW5zdGFsbGVkXCI6IEV4dGVuc2lvbixcblx0XHRcImZpbGVfZG93bmxvYWRcIjogRmlsZURvd25sb2FkLFx0XHRcblx0XHRcImZpbGVfb3BlblwiOiBGaWxlT3Blbixcblx0XHRcImlucHV0X2ZpbGxlZFwiOiBJbnB1dCxcblx0XHRcInBhZ2VfbGVmdFwiOiBQYWdlTGVmdCxcblx0XHRcInBhZ2VfbG9hZGVkXCI6IFBhZ2VMb2FkZWQsXG5cdFx0XCJwYWdlX3JlYWRcIjogUGFnZVJlYWQsXG5cdFx0XCJtaWNfYWNjZXB0ZWRcIjogTWljcm9waG9uZSxcblx0XHRcIm5vdGlmaWNhdGlvbl9hY2NlcHRlZFwiOiBOb3RpZmljYXRpb24sXG5cdFx0XCJmb3JtX3N1Ym1pdHRlZFwiOiBTdWJtaXQsXG5cdFx0XCJ3ZWJjYW1fYWNjZXB0ZWRcIjogV2ViY2FtLFxuXHRcdFwibG9jYXRpb25fYWNjZXB0ZWRcIjogTG9jYXRpb24sXG5cdFx0XCJjbGlwYm9hcmRfYWNjZXB0ZWRcIjogQ2xpcGJvYXJkLFxuXHR9O1xuXHRwcml2YXRlIHJlYWRvbmx5IGJyb3dzZXJJbmZvOiBCcm93c2VySW5mbztcblx0cHJpdmF0ZSByZWFkb25seSBjYW1wYWlnbkluZm86IENhbXBhaWduSW5mbztcblx0cHJpdmF0ZSByZWFkb25seSByZWRpcmVjdFVybDogc3RyaW5nO1xuXHRwcml2YXRlIHJlYWRvbmx5IHNob3VsZFJlZGlyZWN0OiBib29sZWFuO1xuXHRwcml2YXRlIHJlYWRvbmx5IHJlbW90ZTogUmVtb3RlO1xuXHRwcml2YXRlIHJlYWRvbmx5IHNvdXJjZTogc3RyaW5nO1xuXHRwcml2YXRlIHJlYWRvbmx5IHRva2VuOiBzdHJpbmc7XG5cblx0cHJpdmF0ZSBzdWJzY3JpcHRpb25zOiBFdmVudFN1YnNjcmlwdGlvbltdID0gW107XG5cblx0cHJpdmF0ZSBsb2dnZXI6IExvZ2dlcjtcblx0cHJpdmF0ZSBoYW5kbGVycyA9IFtdO1xuXHRwcml2YXRlIGRpc2FibGVkRXZlbnRzID0gW107XG5cdHByaXZhdGUgYWN0aXZlRXZlbnRzOiBJRXZlbnRbXTtcblxuXHRjb25zdHJ1Y3RvcihyZW1vdGU6IFJlbW90ZSwgZXZlbnROYW1lczogc3RyaW5nW10sIHNvdXJjZTogc3RyaW5nLCByZWRpcmVjdFVybDogc3RyaW5nLCBzaG91bGRSZWRpcmVjdDogYm9vbGVhbiwgZGVidWcgPSBmYWxzZSkge1xuXHRcdHRoaXMubG9nZ2VyID0gbmV3IExvZ2dlcihkZWJ1Zyk7XG5cblx0XHR0aGlzLnJlbW90ZSA9IHJlbW90ZTtcblx0XHRbdGhpcy50b2tlbiwgdGhpcy5jYW1wYWlnbkluZm9dID0gZmluZENhbXBhaWduSW5mbygpO1xuXHRcdHRoaXMuYnJvd3NlckluZm8gPSBmaW5kQnJvd3NlckluZm8oKTtcblxuXHRcdGlmICghZXZlbnROYW1lcy5sZW5ndGgpIHtcblx0XHRcdGV2ZW50TmFtZXMgPSBPYmplY3Qua2V5cyh0aGlzLnN1cHBvcnRlZEV2ZW50cyk7XG5cdFx0fVxuXG5cdFx0dGhpcy5hY3RpdmVFdmVudHMgPSBldmVudE5hbWVzLm1hcChuYW1lID0+IHRoaXMuZ2V0RXZlbnQobmFtZSkpLmZpbHRlcihldmVudCA9PiBldmVudCAhPT0gbnVsbCk7XG5cdFx0dGhpcy5sb2dnZXIuaW5mbyhgRW5hYmxlZCBldmVudHM6ICR7ZXZlbnROYW1lcy5qb2luKFwiIHwgXCIpfWApO1xuXG5cdFx0dGhpcy5zb3VyY2UgPSBzb3VyY2U7XG5cdFx0dGhpcy5yZWRpcmVjdFVybCA9IHJlZGlyZWN0VXJsO1xuXHRcdHRoaXMuc2hvdWxkUmVkaXJlY3QgPSBzaG91bGRSZWRpcmVjdDtcblxuXHRcdGlmICh0aGlzLmNhbXBhaWduSW5mby5kb3dubG9hZF90eXBlKSB7XG5cdFx0XHR0aGlzLmNoZWNrRG93bmxvYWQoKTtcblx0XHR9XG5cblx0fVxuXG5cdHByaXZhdGUgZ2V0RXZlbnQobmFtZTogc3RyaW5nKSB7XG5cdFx0aWYgKCEgdGhpcy5zdXBwb3J0ZWRFdmVudHNbbmFtZV0pIHtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblxuXHRcdHJldHVybiBuZXcgKHRoaXMuc3VwcG9ydGVkRXZlbnRzW25hbWVdKTtcblx0fVxuXG5cdHByaXZhdGUgY2hlY2tEb3dubG9hZCgpIHtcblx0XHRzd2l0Y2ggKHRoaXMuY2FtcGFpZ25JbmZvLmRvd25sb2FkX3R5cGUpIHtcblx0XHRjYXNlIFwiZmlsZVwiOlxuXHRcdFx0cmV0dXJuIHRoaXMudHJpZ2dlcihcImZpbGVfb3BlbmVkXCIpO1xuXHRcdGNhc2UgXCJhdHRhY2htZW50XCI6XG5cdFx0XHRyZXR1cm4gdGhpcy50cmlnZ2VyKFwiYXR0YWNobWVudF9vcGVuZWRcIik7XG5cdFx0fVxuXHR9XG5cblx0cHVibGljIGxpc3RlbigpIHtcblx0XHRsZXQgaSA9IDA7XG5cdFx0Zm9yKGNvbnN0IGFjdGl2ZUV2ZW50IG9mIHRoaXMuYWN0aXZlRXZlbnRzKSB7XG5cdFx0XHRpZiAoISBhY3RpdmVFdmVudC50cmlnZ2VyKSB7XG5cdFx0XHRcdHRoaXMubG9nZ2VyLmluZm8oYFRoZSBhY3RpdmUgZXZlbnQgJHthY3RpdmVFdmVudC5uYW1lfSBkb2VzIG5vdCBoYXZlIGEgdHJpZ2dlci4gU2tpcHBpbmcuLi5gKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMubG9nZ2VyLmluZm8oYExpc3RlbmluZyBmb3IgZXZlbnQgQCR7YWN0aXZlRXZlbnQudHJpZ2dlcn0gKCR7YWN0aXZlRXZlbnQubmFtZX0pYCk7XG5cdFx0XHRcdGFjdGl2ZUV2ZW50LnNvdXJjZS5hZGRFdmVudExpc3RlbmVyKGFjdGl2ZUV2ZW50LnRyaWdnZXIsIHRoaXMuaGFuZGxlcnNbaSsrXSA9IChldmVudDogRXZlbnQpID0+IHRoaXMucHJlaGFuZGxlKGFjdGl2ZUV2ZW50LCBldmVudCkpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHB1YmxpYyBzdG9wKCkge1xuXHRcdGxldCBpID0gMDtcblx0XHRmb3IoY29uc3QgYWN0aXZlRXZlbnQgb2YgdGhpcy5hY3RpdmVFdmVudHMpIHtcblx0XHRcdGlmICghIGFjdGl2ZUV2ZW50LnRyaWdnZXIpIHtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMubG9nZ2VyLmluZm8oYFN0b3BwaW5nIGxpc3RlbmluZyBmb3IgZXZlbnQgQCR7YWN0aXZlRXZlbnQudHJpZ2dlcn0gKCR7YWN0aXZlRXZlbnQubmFtZX0pYCk7ICAgICAgICBcblx0XHRcdGFjdGl2ZUV2ZW50LnNvdXJjZS5yZW1vdmVFdmVudExpc3RlbmVyKGFjdGl2ZUV2ZW50LnRyaWdnZXIsIHRoaXMuaGFuZGxlcnNbaSsrXSk7XG5cdFx0fVxuXHR9XG5cblx0cHVibGljIHRyaWdnZXIoZXZlbnROYW1lOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcblx0XHRjb25zdCBhY3RpdmVFdmVudCA9IHRoaXMuZ2V0RXZlbnQoZXZlbnROYW1lKTtcblx0XHRpZiAoIWFjdGl2ZUV2ZW50KSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIGV2ZW50ICR7ZXZlbnROYW1lfS4gUGxlYXNlIGNob29zZSBvbmUgb2YgJHtPYmplY3Qua2V5cyh0aGlzLnN1cHBvcnRlZEV2ZW50cykuam9pbihcIiwgXCIpfWApO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzLmV4ZWN1dGVFdmVudChhY3RpdmVFdmVudCwgbnVsbCwgZmFsc2UpO1xuXHR9XG5cblx0cHJpdmF0ZSBwcmVoYW5kbGUoYWN0aXZlRXZlbnQ6IElFdmVudCwgZXZlbnQ/OiBFdmVudCkge1x0XHRcblx0XHRpZiAoYWN0aXZlRXZlbnQuc2hvdWxkRGVib3VuY2UpIHtcblx0XHRcdGRlYm91bmNlKCguLi5hcmdzOiBbSUV2ZW50LCBFdmVudF0pID0+IHRoaXMuaGFuZGxlKC4uLmFyZ3MpLCA1MDAsIGFjdGl2ZUV2ZW50LCBldmVudCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuaGFuZGxlKGFjdGl2ZUV2ZW50LCBldmVudCk7XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBmaW5kVHlwZShhY3RpdmVFdmVudDogSUV2ZW50LCBldmVudD86IEV2ZW50KTogc3RyaW5nIHwgbnVsbCB7XG5cdFx0aWYgKCFhY3RpdmVFdmVudC5oYXNUeXBlcyB8fCAhZXZlbnQpIHtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblxuXHRcdGNvbnN0IGlucHV0RWxlbWVudCA9IGV2ZW50LnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50O1xuXHRcdFxuXHRcdGNvbnN0IHR5cGUgPSBpbnB1dEVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiYXV0b2NvbXBsZXRlXCIpIHx8IGlucHV0RWxlbWVudC50eXBlO1x0XG5cdFx0XG5cdFx0aWYgKHRoaXMuc3VwcG9ydGVkVHlwZXMuaW5kZXhPZih0eXBlKSAhPT0gLTEpIHtcblx0XHRcdHJldHVybiB0eXBlO1xuXHRcdH1cblxuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cblx0cHJpdmF0ZSBmaW5kTmFtZShhY3RpdmVFdmVudDogSUV2ZW50LCBldmVudD86IEV2ZW50KTogc3RyaW5nIHtcblx0XHRjb25zdCB0eXBlID0gdGhpcy5maW5kVHlwZShhY3RpdmVFdmVudCwgZXZlbnQpO1xuXHRcdGlmICghdHlwZSkge1xuXHRcdFx0cmV0dXJuIGFjdGl2ZUV2ZW50Lm5hbWU7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGAke2FjdGl2ZUV2ZW50Lm5hbWV9LSR7dHlwZX1gO1xuXHR9XG5cblx0cHJpdmF0ZSBwYWNrRXZlbnQodHlwZTogc3RyaW5nLCBhY3RpdmVFdmVudDogSUV2ZW50KTogSUV2ZW50UGF5bG9hZCB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdFwiZGF0YVwiOiB7XG5cdFx0XHRcdC4uLnRoaXMuYnJvd3NlckluZm8sXG5cdFx0XHRcdHR5cGUsXG5cdFx0XHR9LFxuXHRcdFx0XCJzb3VyY2VcIjogdGhpcy5zb3VyY2UsXG5cdFx0XHRcInRpbWVzdGFtcFwiOiBNYXRoLmZsb29yKERhdGUubm93KCkgLyAxMDAwKSxcblx0XHRcdFwiYXRzX2hlYWRlclwiOiB0aGlzLnRva2VuLFxuXHRcdFx0XCJldmVudFwiOiBhY3RpdmVFdmVudC5uYW1lLnRvTG93ZXJDYXNlKCksXG5cdFx0XHRcInNnX2V2ZW50X2lkXCI6IGNyZWF0ZVVVSUQoKSxcblx0XHRcdFwic2dfbWVzc2FnZV9pZFwiOiB0aGlzLmNhbXBhaWduSW5mby5hdHNfaW5zdGFuY2VfaWQsXG5cdFx0fTtcblx0fVxuXG5cdHByaXZhdGUgaGFuZGxlKGFjdGl2ZUV2ZW50OiBJRXZlbnQsIGV2ZW50PzogRXZlbnQsIHNob3VsZFZhbGlkYXRlID0gdHJ1ZSk6IHZvaWQge1xuXHRcdHRoaXMuZXhlY3V0ZUV2ZW50KGFjdGl2ZUV2ZW50LCBldmVudCwgc2hvdWxkVmFsaWRhdGUpXG5cdFx0XHQuY2F0Y2goZSA9PiB0aGlzLmxvZ2dlci5lcnJvcihlKSk7XHRcdFx0XG5cdH1cblxuXHRwcml2YXRlIGNoZWNrRXZlbnQoYWN0aXZlRXZlbnQ6IElFdmVudCwgc2hvdWxkVmFsaWRhdGUgPSB0cnVlKTogdm9pZCB7XG5cdFx0aWYgKCEgYWN0aXZlRXZlbnQuaXNWYWxpZChldmVudCkgJiYgc2hvdWxkVmFsaWRhdGUpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgRXZlbnQgQCR7YWN0aXZlRXZlbnQudHJpZ2dlcn0gKCR7YWN0aXZlRXZlbnQubmFtZX0pIG5vdCB2YWxpZC4uLmApO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgY2hlY2tNdWx0aXBsZShhY3RpdmVFdmVudDogSUV2ZW50LCBldmVudD86IEV2ZW50KTogdm9pZCB7XG5cdFx0aWYgKCFhY3RpdmVFdmVudC5hbGxvd011bHRpcGxlKSB7XG5cdFx0XHRjb25zdCBuYW1lID0gdGhpcy5maW5kTmFtZShhY3RpdmVFdmVudCwgZXZlbnQpO1xuXHRcdFx0aWYgKHRoaXMuZGlzYWJsZWRFdmVudHMuaW5jbHVkZXMobmFtZSkpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBQcmV2ZW50aW5nIGR1cGxpY2F0ZSBldmVudCBAJHthY3RpdmVFdmVudC50cmlnZ2VyfSAoJHtuYW1lfSkuYCk7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuZGlzYWJsZWRFdmVudHMucHVzaChuYW1lKTtcblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIGV4ZWN1dGVFdmVudChhY3RpdmVFdmVudDogSUV2ZW50LCBldmVudD86IEV2ZW50LCBzaG91bGRWYWxpZGF0ZSA9IHRydWUpOiBQcm9taXNlPHZvaWQ+IHtcblx0XHR0aGlzLmxvZ2dlci5pbmZvKGBFdmVudCBAJHthY3RpdmVFdmVudC50cmlnZ2VyfSAoJHthY3RpdmVFdmVudC5uYW1lfSkgdHJpZ2dlcmVkLi4uYCk7XG5cblx0XHR0cnkge1xuXHRcdFx0dGhpcy5jaGVja0V2ZW50KGFjdGl2ZUV2ZW50LCBzaG91bGRWYWxpZGF0ZSk7XG5cdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0dGhpcy5sb2dnZXIuZXJyb3IoZSk7XG5cdFx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4gcmVqZWN0KGUpKTtcblx0XHR9XG5cblx0XHRpZiAoZXZlbnQgJiYgYWN0aXZlRXZlbnQuaXNCbG9ja2luZykge1xuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0ZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0fVxuXG5cdFx0dHJ5IHtcblx0XHRcdHRoaXMuY2hlY2tNdWx0aXBsZShhY3RpdmVFdmVudCwgZXZlbnQpO1xuXHRcdH0gY2F0Y2goZSkge1xuXHRcdFx0dGhpcy5sb2dnZXIuZXJyb3IoZSk7XG5cdFx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4gcmVqZWN0KGUpKTtcblx0XHR9XG5cblx0XHRjb25zdCB0eXBlID0gdGhpcy5maW5kVHlwZShhY3RpdmVFdmVudCwgZXZlbnQpO1xuXHRcdGNvbnN0IHBheWxvYWQgPSB0aGlzLnBhY2tFdmVudCh0eXBlLCBhY3RpdmVFdmVudCk7XG5cdFx0dGhpcy50cmlnZ2VyU3Vic2NyaXB0aW9uKGFjdGl2ZUV2ZW50KTtcblxuXHRcdHJldHVybiB0aGlzLnJlbW90ZS5wb3N0KHBheWxvYWQpXG5cdFx0XHQudGhlbihyZXN1bHQgPT4gdGhpcy5sb2dnZXIuaW5mbyhyZXN1bHQpKVxuXHRcdFx0LmZpbmFsbHkoKCkgPT4ge1xuXHRcdFx0XHRpZiAoYWN0aXZlRXZlbnQucmVkaXJlY3RPbkZpbmlzaCAmJiB0aGlzLnNob3VsZFJlZGlyZWN0KSB7XG5cdFx0XHRcdFx0d2luZG93LmxvY2F0aW9uLmhyZWYgPSBgJHt0aGlzLnJlZGlyZWN0VXJsfSR7d2luZG93LmxvY2F0aW9uLnNlYXJjaH1gO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcdFx0XG5cblx0fVxuXG5cdGdldCBzdXBwb3J0ZWRFdmVudE5hbWVzKCk6IHN0cmluZ1tdIHtcblx0XHRyZXR1cm4gT2JqZWN0LmtleXModGhpcy5zdXBwb3J0ZWRFdmVudHMpO1xuXHR9XG5cblx0cHVibGljIHN1YnNjcmliZShldmVudE5hbWU6IHN0cmluZywgY2FsbGJhY2s6IChldmVudDogSUV2ZW50KSA9PiB2b2lkKSB7XG5cdFx0aWYgKCEgdGhpcy5zdXBwb3J0ZWRFdmVudE5hbWVzLmluY2x1ZGVzKGV2ZW50TmFtZSkpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgZXZlbnQ6ICR7ZXZlbnROYW1lfWApO1xuXHRcdH1cblx0XHRcblx0XHR0aGlzLnN1YnNjcmlwdGlvbnMucHVzaCh7IGV2ZW50TmFtZSwgY2FsbGJhY2t9KTtcblx0fVxuXG5cdHB1YmxpYyB1bnN1YnNjcmliZShldmVudE5hbWU6IHN0cmluZywgY2FsbGJhY2s6IChldmVudDogSUV2ZW50KSA9PiB2b2lkKSB7XG5cdFx0aWYgKCEgdGhpcy5zdXBwb3J0ZWRFdmVudE5hbWVzLmluY2x1ZGVzKGV2ZW50TmFtZSkpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgZXZlbnQ6ICR7ZXZlbnROYW1lfWApO1xuXHRcdH1cblxuXHRcdC8vIGZpbmQgdGhlIGV2ZW50IGluIHRoZSBzdWJzY3JpcHRpb25zIGFycmF5IGFuZCByZW1vdmUgaXRcblx0XHRjb25zdCBldmVudEluZGV4ID0gdGhpcy5zdWJzY3JpcHRpb25zLmZpbmRJbmRleChzdWJzY3JpcHRpb24gPT4gc3Vic2NyaXB0aW9uLmV2ZW50TmFtZSA9PT0gZXZlbnROYW1lICYmIHN1YnNjcmlwdGlvbi5jYWxsYmFjayA9PT0gY2FsbGJhY2spO1xuXHRcdGlmIChldmVudEluZGV4ID49IDApIHtcblx0XHRcdHRoaXMuc3Vic2NyaXB0aW9ucy5zcGxpY2UoZXZlbnRJbmRleCwgMSk7XG5cdFx0fVxuXHR9XG5cblx0cHVibGljIHRyaWdnZXJTdWJzY3JpcHRpb24oZXZlbnQ6IElFdmVudCkge1xuXHRcdGNvbnN0IHN1YnNjcmlwdGlvbnMgPSB0aGlzLnN1YnNjcmlwdGlvbnMuZmlsdGVyKHN1YnNjcmlwdGlvbiA9PiBzdWJzY3JpcHRpb24uZXZlbnROYW1lID09PSBldmVudC5uYW1lKTtcblx0XHRzdWJzY3JpcHRpb25zLmZvckVhY2goc3Vic2NyaXB0aW9uID0+IHN1YnNjcmlwdGlvbi5jYWxsYmFjayhldmVudCkpO1xuXHR9XG59IiwiaW1wb3J0IElFdmVudFBheWxvYWQgZnJvbSBcIi4vaW50ZWZhY2VzL0lFdmVudFBheWxvYWRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVtb3RlIHtcblx0cHJpdmF0ZSBhcGlfa2V5OiBzdHJpbmc7XG5cdHByaXZhdGUgdXJsOiBzdHJpbmc7XG5cdHByaXZhdGUgZGVidWc6IGJvb2xlYW47XG5cblx0Y29uc3RydWN0b3IoYXBpX2tleTogc3RyaW5nLCB1cmw6IHN0cmluZywgZGVidWc6IGJvb2xlYW4pIHtcblx0XHR0aGlzLmFwaV9rZXkgPSBhcGlfa2V5O1xuXHRcdHRoaXMudXJsID0gdXJsO1xuXHRcdHRoaXMuZGVidWcgPSBkZWJ1Zztcblx0fVxuXG5cdHB1YmxpYyBwb3N0KGRhdGE6IElFdmVudFBheWxvYWQpOiBQcm9taXNlPG9iamVjdD4ge1xuXHRcdGlmICh0aGlzLmRlYnVnKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhgU2VuZGluZyBldmVudCB0byAke3RoaXMudXJsfSB3aXRoIGRhdGE6YCk7XG5cdFx0XHRjb25zb2xlLnRhYmxlKGRhdGEpO1xuXHRcdH1cblxuXHRcdHJldHVybiBmZXRjaCh0aGlzLnVybCwge1xuXHRcdFx0bWV0aG9kOiBcIlBPU1RcIixcblx0XHRcdGhlYWRlcnM6IHtcblx0XHRcdFx0XCJDb250ZW50LXR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG5cdFx0XHRcdFwiYXBpLWtleVwiOiB0aGlzLmFwaV9rZXksXG5cdFx0XHR9LFxuXHRcdFx0a2VlcGFsaXZlOiB0cnVlLFxuXHRcdFx0Ym9keTogSlNPTi5zdHJpbmdpZnkoZGF0YSksXG5cdFx0fSkudGhlbihyZXNwb25zZSA9PiB7XG5cdFx0XHRjb25zdCBjb250ZW50VHlwZSA9IHJlc3BvbnNlLmhlYWRlcnMuZ2V0KFwiY29udGVudC10eXBlXCIpO1xuXHRcdFx0aWYgKGNvbnRlbnRUeXBlICYmIGNvbnRlbnRUeXBlLmluZGV4T2YoXCJhcHBsaWNhdGlvbi9qc29uXCIpICE9PSAtMSkge1xuXHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIHJlc3BvbnNlLnRleHQoKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVVVSUQoKSB7XG5cdC8vIGh0dHA6Ly93d3cuaWV0Zi5vcmcvcmZjL3JmYzQxMjIudHh0XG5cdGNvbnN0IHM6IGFueVtdID0gW107XG5cdGNvbnN0IGhleERpZ2l0cyA9IFwiMDEyMzQ1Njc4OWFiY2RlZlwiO1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IDM2OyBpKyspIHtcblx0XHRzW2ldID0gaGV4RGlnaXRzLnN1YnN0cihNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAweDEwKSwgMSk7XG5cdH1cblx0c1sxNF0gPSBcIjRcIjsgIC8vIGJpdHMgMTItMTUgb2YgdGhlIHRpbWVfaGlfYW5kX3ZlcnNpb24gZmllbGQgdG8gMDAxMFxuXHRzWzE5XSA9IGhleERpZ2l0cy5zdWJzdHIoKHNbMTldICYgMHgzKSB8IDB4OCwgMSk7ICAvLyBiaXRzIDYtNyBvZiB0aGUgY2xvY2tfc2VxX2hpX2FuZF9yZXNlcnZlZCB0byAwMVxuXHRzWzhdID0gc1sxM10gPSBzWzE4XSA9IHNbMjNdID0gXCItXCI7XG5cblx0cmV0dXJuIHMuam9pbihcIlwiKTtcbn1cblxuY29uc3QgZmlyc3RUTERzID0gXCJhY3xhZHxhZXxhZnxhZ3xhaXxhbHxhbXxhbnxhb3xhcXxhcnxhc3xhdHxhdXxhd3xheHxhenxiYXxiYnxiZXxiZnxiZ3xiaHxiaXxianxibXxib3xicnxic3xidHxidnxid3xieXxienxjYXxjY3xjZHxjZnxjZ3xjaHxjaXxjbHxjbXxjbnxjb3xjcnxjdXxjdnxjd3xjeHxjenxkZXxkanxka3xkbXxkb3xkenxlY3xlZXxlZ3xlc3xldHxldXxmaXxmbXxmb3xmcnxnYXxnYnxnZHxnZXxnZnxnZ3xnaHxnaXxnbHxnbXxnbnxncHxncXxncnxnc3xndHxnd3xneXxoa3xobXxobnxocnxodHxodXxpZHxpZXxpbHxpbXxpbnxpb3xpcXxpcnxpc3xpdHxqZXxqb3xqcHxrZ3xraXxrbXxrbnxrcHxrcnxreXxrenxsYXxsYnxsY3xsaXxsa3xscnxsc3xsdHxsdXxsdnxseXxtYXxtY3xtZHxtZXxtZ3xtaHxta3xtbHxtbnxtb3xtcHxtcXxtcnxtc3xtdHxtdXxtdnxtd3xteHxteXxuYXxuY3xuZXxuZnxuZ3xubHxub3xucnxudXxuenxvbXxwYXxwZXxwZnxwaHxwa3xwbHxwbXxwbnxwcnxwc3xwdHxwd3xweXxxYXxyZXxyb3xyc3xydXxyd3xzYXxzYnxzY3xzZHxzZXxzZ3xzaHxzaXxzanxza3xzbHxzbXxzbnxzb3xzcnxzdHxzdXxzdnxzeHxzeXxzenx0Y3x0ZHx0Znx0Z3x0aHx0anx0a3x0bHx0bXx0bnx0b3x0cHx0cnx0dHx0dnx0d3x0enx1YXx1Z3x1a3x1c3x1eXx1enx2YXx2Y3x2ZXx2Z3x2aXx2bnx2dXx3Znx3c3x5dFwiLnNwbGl0KFwifFwiKTtcblxuY29uc3Qgc2Vjb25kVExEcyA9IFwiY29tfGVkdXxnb3Z8bmV0fG1pbHxvcmd8bm9tfHNjaHxjYWF8cmVzfG9mZnxnb2J8aW50fHR1cnxpcDZ8dXJpfHVybnxhc258YWN0fG5zd3xxbGR8dGFzfHZpY3xwcm98Yml6fGFkbXxhZHZ8YWdyfGFycXxhcnR8YXRvfGJpb3xibWR8Y2ltfGNuZ3xjbnR8ZWNufGVjb3xlbXB8ZW5nfGVzcHxldGN8ZXRpfGZhcnxmbmR8Zm90fGZzdHxnMTJ8Z2dmfGltYnxpbmR8aW5mfGpvcnxqdXN8bGVnfGxlbHxtYXR8bWVkfG11c3xub3R8bnRyfG9kb3xwcGd8cHNjfHBzaXxxc2x8cmVjfHNsZ3xzcnZ8dGVvfHRtcHx0cmR8dmV0fHpsZ3x3ZWJ8bHRkfHNsZHxwb2x8ZmlufGsxMnxsaWJ8cHJpfGFpcHxmaWV8ZXVufHNjaXxwcmR8Y2NpfHB2dHxtb2R8aWR2fHJlbHxzZXh8Z2VufG5pY3xhYnJ8YmFzfGNhbHxjYW18ZW1yfGZ2Z3xsYXp8bGlnfGxvbXxtYXJ8bW9sfHBtbnxwdWd8c2FyfHNpY3x0YWF8dG9zfHVtYnx2YW98dmRhfHZlbnxtaWV85YyX5rW36YGTfOWSjOatjOWxsXznpZ7lpYjlt5186bm/5YWQ5bO2fGFzc3xyZXB8dHJhfHBlcnxuZ298c29jfGdycHxwbGN8aXRzfGFpcnxhbmR8YnVzfGNhbnxkZHJ8amZrfG1hZHxucnd8bnljfHNraXxzcHl8dGNtfHVsbXx1c2F8d2FyfGZoc3x2Z3N8ZGVwfGVpZHxmZXR8ZmxhfGZsw6V8Z29sfGhvZnxob2x8c2VsfHZpa3xjcml8aXdpfGluZ3xhYm98ZmFtfGdva3xnb258Z29wfGdvc3xhaWR8YXRtfGdzbXxzb3N8ZWxrfHdhd3xlc3R8YWNhfGJhcnxjcGF8anVyfGxhd3xzZWN8cGxvfHd3d3xiaXJ8Y2JnfGphcnxraHZ8bXNrfG5vdnxuc2t8cHR6fHJuZHxzcGJ8c3R2fHRvbXx0c2t8dWRtfHZybnxjbXd8a21zfG5renxzbnp8cHVifGZodnxyZWR8ZW5zfG5hdHxybnN8cm51fGJic3x0ZWx8YmVsfGtlcHxuaHN8ZG5pfGZlZHxpc2F8bnNufGd1YnxlMTJ8dGVjfNC+0YDQs3zQvtCx0YB80YPQv9GAfGFsdHxuaXN8anBufG1leHxhdGh8aWtpfG5pZHxnZGF8aW5jXCIuc3BsaXQoXCJ8XCIpO1xuXG5jb25zdCBrbm93blN1YmRvbWFpbnMgPSBcInd3d3xzdHVkaW98bWFpbHxyZW1vdGV8YmxvZ3x3ZWJtYWlsfHNlcnZlcnxuczF8bnMyfHNtdHB8c2VjdXJlfHZwbnxtfHNob3B8ZnRwfG1haWwyfHRlc3R8cG9ydGFsfG5zfHd3MXxob3N0fHN1cHBvcnR8ZGV2fHdlYnxiYnN8d3c0MnxzcXVhdHRlcnxteHxlbWFpbHwxfG1haWwxfDJ8Zm9ydW18b3dhfHd3dzJ8Z3d8YWRtaW58c3RvcmV8bXgxfGNkbnxhcGl8ZXhjaGFuZ2V8YXBwfGdvdnwydHR5fHZwc3xnb3Z5dHl8aGdmZ2RmfG5ld3N8MXJlcnxsa2prdWlcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZVN1YmRvbWFpbihzOiBzdHJpbmcpIHtcblx0Y29uc3Qga25vd25TdWJkb21haW5zUmVnRXhwID0gbmV3IFJlZ0V4cChgXigke2tub3duU3ViZG9tYWluc30pLmAsIFwiaVwiKTtcblx0cyA9IHMucmVwbGFjZShrbm93blN1YmRvbWFpbnNSZWdFeHAsIFwiXCIpO1xuXG5cdGNvbnN0IHBhcnRzID0gcy5zcGxpdChcIi5cIik7XG5cblx0d2hpbGUgKHBhcnRzLmxlbmd0aCA+IDMpIHtcblx0XHRwYXJ0cy5zaGlmdCgpO1xuXHR9XG5cblx0aWYgKHBhcnRzLmxlbmd0aCA9PT0gMyAmJiAoKHBhcnRzWzFdLmxlbmd0aCA+IDIgJiYgcGFydHNbMl0ubGVuZ3RoID4gMikgfHwgKHNlY29uZFRMRHMuaW5kZXhPZihwYXJ0c1sxXSkgPT09IC0xKSAmJiBmaXJzdFRMRHMuaW5kZXhPZihwYXJ0c1syXSkgPT09IC0xKSkge1xuXHRcdHBhcnRzLnNoaWZ0KCk7XG5cdH1cblxuXHRyZXR1cm4gcGFydHMuam9pbihcIi5cIik7XG59XG5cbmNvbnN0IHRpbWVvdXRzID0ge307XG5leHBvcnQgZnVuY3Rpb24gZGVib3VuY2U8QXJncyBleHRlbmRzIGFueVtdPihjYWxsYmFjazogKC4uLmFyZ3M6IEFyZ3MpID0+IHZvaWQsIHdhaXQ6IG51bWJlciwgLi4uYXJnczogQXJncykgOiB2b2lkIHtcblx0Y29uc3QgWywgZXZlbnRdID0gYXJncztcblx0XG5cdGlmICghIGV2ZW50LnRhcmdldC5oYXNBdHRyaWJ1dGUoXCJkYXRhLWlkXCIpKSB7XG5cdFx0ZXZlbnQudGFyZ2V0LnNldEF0dHJpYnV0ZShcImRhdGEtaWRcIiwgY3JlYXRlVVVJRCgpKTtcblx0fVxuXG5cdGNvbnN0IGlkID0gZXZlbnQudGFyZ2V0LmdldEF0dHJpYnV0ZShcImRhdGEtaWRcIik7XG5cblx0aWYgKHRpbWVvdXRzW2lkXSkge1xuXHRcdGNsZWFyVGltZW91dCh0aW1lb3V0c1tpZF0pO1xuXHR9XG5cblx0dGltZW91dHNbaWRdID0gc2V0VGltZW91dChjYWxsYmFjaywgd2FpdCwgLi4uYXJncyk7XG59IiwiaW50ZXJmYWNlIFBhcmFtZXRlck1hcCB7XG4gICAgW3M6IHN0cmluZ106IGFueVxufVxuZXhwb3J0IGNsYXNzIFVybFBhcnNlciB7XG5cblx0cHJpdmF0ZSBwYXJhbWV0ZXJzOiBQYXJhbWV0ZXJNYXA7XG5cdHB1YmxpYyByZWFkb25seSBwcm90b2NvbDogc3RyaW5nO1xuXHRwdWJsaWMgcmVhZG9ubHkgaG9zdDogc3RyaW5nO1xuXHRwdWJsaWMgcmVhZG9ubHkgaG9zdG5hbWU6IHN0cmluZztcblx0cHVibGljIHJlYWRvbmx5IHBvcnQ6IHN0cmluZztcblx0cHVibGljIHJlYWRvbmx5IHBhdGhuYW1lOiBzdHJpbmc7XG5cdHB1YmxpYyByZWFkb25seSBoYXNoOiBzdHJpbmc7XG5cdHB1YmxpYyByZWFkb25seSBzZWFyY2g6IHN0cmluZztcblxuXHRjb25zdHJ1Y3Rvcihwcml2YXRlIHVybDpzdHJpbmcpIHtcblx0XHRjb25zdCBwYXJzZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcblx0XHRwYXJzZXIuaHJlZiA9IHVybDtcblxuXHRcdHRoaXMucHJvdG9jb2wgPSBwYXJzZXIucHJvdG9jb2w7IC8vID0+IFwiaHR0cDpcIlxuXHRcdHRoaXMuaG9zdCA9IHBhcnNlci5ob3N0OyAgICAgLy8gPT4gXCJleGFtcGxlLmNvbTozMDAwXCJcblx0XHR0aGlzLmhvc3RuYW1lID0gcGFyc2VyLmhvc3RuYW1lOyAvLyA9PiBcImV4YW1wbGUuY29tXCJcblx0XHR0aGlzLnBvcnQgPSBwYXJzZXIucG9ydDsgICAgIC8vID0+IFwiMzAwMFwiXG5cdFx0dGhpcy5wYXRobmFtZSA9IHBhcnNlci5wYXRobmFtZTsgLy8gPT4gXCIvcGF0aG5hbWUvXCJcblx0XHR0aGlzLmhhc2ggPSBwYXJzZXIuaGFzaDsgICAgIC8vID0+IFwiI2hhc2hcIlxuXHRcdHRoaXMuc2VhcmNoID0gcGFyc2VyLnNlYXJjaC5zdWJzdHIoMSk7ICAgLy8gPT4gXCI/c2VhcmNoPXRlc3RcIlxuXG5cdFx0dGhpcy5wYXJzZVBhcmFtZXRlcnMoKTtcblx0fVxuXG5cdHByaXZhdGUgcGFyc2VQYXJhbWV0ZXJzKCkge1xuXHRcdHRoaXMucGFyYW1ldGVycyA9IHt9O1xuXG5cdFx0Y29uc3QgcGFyYW1zR3JvdXAgPSB0aGlzLnNlYXJjaC5zcGxpdChcIiZcIik7XG5cdFx0Zm9yKGNvbnN0IHBhcmFtIG9mIHBhcmFtc0dyb3VwKSB7XG5cdFx0XHRjb25zdCBba2V5LCB2YWx1ZV0gPSBwYXJhbS5zcGxpdChcIj1cIik7XG5cdFx0XHR0aGlzLnBhcmFtZXRlcnNba2V5XSA9IHZhbHVlO1xuXHRcdH1cblx0fVxuXG5cdHB1YmxpYyBmaW5kUGFyYW0ocGFyYW06IHN0cmluZykgOiBhbnkge1xuXHRcdHJldHVybiB0aGlzLnBhcmFtZXRlcnNbcGFyYW1dIHx8IG51bGw7XG5cdH1cblxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIEFUU0V2ZW50IHtcblx0YmFzaWNWYWxpZGF0aW9uKGVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XG5cdFx0aWYgKGVsZW1lbnQuaGFzQXR0cmlidXRlKFwiZGF0YS1pZ25vcmVcIikpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdFx0aWYgKGVsZW1lbnQuaGFzQXR0cmlidXRlKFwiQGNsaWNrXCIpKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHRcdHJldHVybiB0cnVlO1xuXHR9XG59IiwiaW1wb3J0IElFdmVudCBmcm9tIFwiLi4vaW50ZWZhY2VzL0lFdmVudFwiO1xuaW1wb3J0IEFUU0V2ZW50IGZyb20gXCIuL0FUU0V2ZW50XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEF0dGFjaG1lbnRPcGVuIGV4dGVuZHMgQVRTRXZlbnQgaW1wbGVtZW50cyBJRXZlbnQge1xuXHRnZXQgc2hvdWxkRGVib3VuY2UoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCB0cmlnZ2VyKCk6IG51bGwge1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cdGdldCBzb3VyY2UoKTogbnVsbCB7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblx0Z2V0IG5hbWUoKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gXCJhdHRhY2htZW50X29wZW5lZFwiO1xuXHR9XG5cdGdldCBoYXNUeXBlcygpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0Z2V0IHJlZGlyZWN0T25GaW5pc2goKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCBpc0Jsb2NraW5nKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdGdldCBhbGxvd011bHRpcGxlKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRpc1ZhbGlkKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG59IiwiaW1wb3J0IElFdmVudCBmcm9tIFwiLi4vaW50ZWZhY2VzL0lFdmVudFwiO1xuaW1wb3J0IEFUU0V2ZW50IGZyb20gXCIuL0FUU0V2ZW50XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsaWNrIGV4dGVuZHMgQVRTRXZlbnQgaW1wbGVtZW50cyBJRXZlbnQge1xuXHRnZXQgc2hvdWxkRGVib3VuY2UoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCB0cmlnZ2VyKCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIFwiY2xpY2tcIjtcblx0fVxuXHRnZXQgc291cmNlKCk6IFdpbmRvdyB7XG5cdFx0cmV0dXJuIHdpbmRvdztcblx0fVxuXHRnZXQgbmFtZSgpOiBzdHJpbmcge1xuXHRcdHJldHVybiBcImJ1dHRvbl9jbGlja2VkXCI7XG5cdH1cblx0Z2V0IGhhc1R5cGVzKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdGdldCByZWRpcmVjdE9uRmluaXNoKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdGdldCBpc0Jsb2NraW5nKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRnZXQgYWxsb3dNdWx0aXBsZSgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7IFxuXHR9XG5cblx0aXNWYWxpZChldmVudDogRXZlbnQpOiBib29sZWFuIHtcblx0XHRpZiAoZXZlbnQ/LnRhcmdldCBpbnN0YW5jZW9mIEhUTUxBbmNob3JFbGVtZW50KSB7XG5cdFx0XHRyZXR1cm4gdGhpcy52YWxpZGF0ZUFuY2hvcihldmVudC50YXJnZXQpO1xuXHRcdH1cblx0XHRcblxuXHRcdGlmIChldmVudD8udGFyZ2V0IGluc3RhbmNlb2YgSFRNTEJ1dHRvbkVsZW1lbnQpIHtcblx0XHRcdHJldHVybiB0aGlzLnZhbGlkYXRlQnV0dG9uKGV2ZW50LnRhcmdldCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0cHJpdmF0ZSB2YWxpZGF0ZUFuY2hvcihlbGVtZW50OiBIVE1MRWxlbWVudCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0aGlzLmJhc2ljVmFsaWRhdGlvbihlbGVtZW50KTtcblx0fVxuXG5cdHByaXZhdGUgdmFsaWRhdGVCdXR0b24oZWxlbWVudDogSFRNTEVsZW1lbnQpOiBib29sZWFuIHtcblx0XHRpZiAoIXRoaXMuYmFzaWNWYWxpZGF0aW9uKGVsZW1lbnQpIHx8IChlbGVtZW50Lmhhc0F0dHJpYnV0ZShcInR5cGVcIikgJiYgZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJ0eXBlXCIpID09PSBcInN1Ym1pdFwiKSkge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0XHRcdFxuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cbn0iLCJpbXBvcnQgSUV2ZW50IGZyb20gXCIuLi9pbnRlZmFjZXMvSUV2ZW50XCI7XG5pbXBvcnQgQVRTRXZlbnQgZnJvbSBcIi4vQVRTRXZlbnRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2xpcGJvYXJkIGV4dGVuZHMgQVRTRXZlbnQgaW1wbGVtZW50cyBJRXZlbnQge1xuXHRnZXQgc2hvdWxkRGVib3VuY2UoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCB0cmlnZ2VyKCk6IG51bGwge1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cdGdldCBzb3VyY2UoKTogbnVsbCB7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblx0Z2V0IG5hbWUoKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gXCJjbGlwYm9hcmRfYWNjZXB0ZWRcIjtcblx0fVxuXHRnZXQgaGFzVHlwZXMoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCByZWRpcmVjdE9uRmluaXNoKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdGdldCBpc0Jsb2NraW5nKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdGdldCBhbGxvd011bHRpcGxlKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRpc1ZhbGlkKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cbn0iLCJpbXBvcnQgSUV2ZW50IGZyb20gXCIuLi9pbnRlZmFjZXMvSUV2ZW50XCI7XG5pbXBvcnQgQVRTRXZlbnQgZnJvbSBcIi4vQVRTRXZlbnRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRG93bmxvYWQgZXh0ZW5kcyBBVFNFdmVudCBpbXBsZW1lbnRzIElFdmVudCB7XG5cdGdldCBzaG91bGREZWJvdW5jZSgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0Z2V0IHRyaWdnZXIoKTogbnVsbCB7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblx0Z2V0IHNvdXJjZSgpOiBudWxsIHtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXHRnZXQgbmFtZSgpOiBzdHJpbmcge1xuXHRcdHJldHVybiBcImRvd25sb2FkX2ZpbGVfZXZlbnRcIjtcblx0fVxuXHRnZXQgaGFzVHlwZXMoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCByZWRpcmVjdE9uRmluaXNoKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdGdldCBpc0Jsb2NraW5nKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdGdldCBhbGxvd011bHRpcGxlKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRpc1ZhbGlkKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cbn0iLCJpbXBvcnQgSUV2ZW50IGZyb20gXCIuLi9pbnRlZmFjZXMvSUV2ZW50XCI7XG5pbXBvcnQgQVRTRXZlbnQgZnJvbSBcIi4vQVRTRXZlbnRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXh0ZW5zaW9uIGV4dGVuZHMgQVRTRXZlbnQgaW1wbGVtZW50cyBJRXZlbnQge1xuXHRnZXQgc2hvdWxkRGVib3VuY2UoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCB0cmlnZ2VyKCk6IG51bGwge1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cdGdldCBzb3VyY2UoKTogbnVsbCB7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblx0Z2V0IG5hbWUoKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gXCJleHRlbnNpb25faW5zdGFsbGVkXCI7XG5cdH1cblx0Z2V0IGhhc1R5cGVzKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRnZXQgcmVkaXJlY3RPbkZpbmlzaCgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXHRnZXQgaXNCbG9ja2luZygpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXHRnZXQgYWxsb3dNdWx0aXBsZSgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0aXNWYWxpZCgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG59IiwiaW1wb3J0IElFdmVudCBmcm9tIFwiLi4vaW50ZWZhY2VzL0lFdmVudFwiO1xuaW1wb3J0IEFUU0V2ZW50IGZyb20gXCIuL0FUU0V2ZW50XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZpbGVEb3dubG9hZCBleHRlbmRzIEFUU0V2ZW50IGltcGxlbWVudHMgSUV2ZW50IHtcblx0Z2V0IHNob3VsZERlYm91bmNlKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRnZXQgdHJpZ2dlcigpOiBudWxsIHtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXHRnZXQgc291cmNlKCk6IG51bGwge1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cdGdldCBuYW1lKCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIFwiZmlsZV9kb3dubG9hZFwiO1xuXHR9XG5cdGdldCBoYXNUeXBlcygpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXHRnZXQgcmVkaXJlY3RPbkZpbmlzaCgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0Z2V0IGlzQmxvY2tpbmcoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XHRcblx0Z2V0IGFsbG93TXVsdGlwbGUoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0aXNWYWxpZChldmVudDogRXZlbnQpOiBib29sZWFuIHtcblx0XHRpZiAoZXZlbnQ/LnRhcmdldCBpbnN0YW5jZW9mIEhUTUxBbmNob3JFbGVtZW50KSB7XG5cdFx0XHRyZXR1cm4gdGhpcy52YWxpZGF0ZUFuY2hvcihldmVudC50YXJnZXQpO1xuXHRcdH1cblx0XHRcblxuXHRcdGlmIChldmVudD8udGFyZ2V0IGluc3RhbmNlb2YgSFRNTEJ1dHRvbkVsZW1lbnQpIHtcblx0XHRcdHJldHVybiB0aGlzLnZhbGlkYXRlQnV0dG9uKGV2ZW50LnRhcmdldCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0cHJpdmF0ZSB2YWxpZGF0ZUFuY2hvcihlbGVtZW50OiBIVE1MRWxlbWVudCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0aGlzLmJhc2ljVmFsaWRhdGlvbihlbGVtZW50KTtcblx0fVxuXG5cdHByaXZhdGUgdmFsaWRhdGVCdXR0b24oZWxlbWVudDogSFRNTEVsZW1lbnQpOiBib29sZWFuIHtcblx0XHRpZiAoIXRoaXMuYmFzaWNWYWxpZGF0aW9uKGVsZW1lbnQpIHx8IChlbGVtZW50Lmhhc0F0dHJpYnV0ZShcInR5cGVcIikgJiYgZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJ0eXBlXCIpID09PSBcInN1Ym1pdFwiKSkge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0XHRcdFxuXHRcdHJldHVybiB0cnVlO1xuXHR9XG59ICIsImltcG9ydCBJRXZlbnQgZnJvbSBcIi4uL2ludGVmYWNlcy9JRXZlbnRcIjtcbmltcG9ydCBBVFNFdmVudCBmcm9tIFwiLi9BVFNFdmVudFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGaWxlT3BlbiBleHRlbmRzIEFUU0V2ZW50IGltcGxlbWVudHMgSUV2ZW50IHtcblx0Z2V0IHNob3VsZERlYm91bmNlKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRnZXQgdHJpZ2dlcigpOiBudWxsIHtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXHRnZXQgc291cmNlKCk6IG51bGwge1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cdGdldCBuYW1lKCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIFwiZmlsZV9vcGVuZWRcIjtcblx0fVxuXHRnZXQgaGFzVHlwZXMoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCByZWRpcmVjdE9uRmluaXNoKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdGdldCBpc0Jsb2NraW5nKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdGdldCBhbGxvd011bHRpcGxlKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRpc1ZhbGlkKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cbn0iLCJpbXBvcnQgSUV2ZW50IGZyb20gXCIuLi9pbnRlZmFjZXMvSUV2ZW50XCI7XG5pbXBvcnQgQVRTRXZlbnQgZnJvbSBcIi4vQVRTRXZlbnRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW5wdXQgZXh0ZW5kcyBBVFNFdmVudCBpbXBsZW1lbnRzIElFdmVudCB7XG5cdGdldCBzaG91bGREZWJvdW5jZSgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXHRnZXQgdHJpZ2dlcigpOiBzdHJpbmcge1xuXHRcdHJldHVybiBcImlucHV0XCI7XG5cdH1cblx0Z2V0IHNvdXJjZSgpOiBXaW5kb3cge1xuXHRcdHJldHVybiB3aW5kb3c7XG5cdH1cblx0Z2V0IG5hbWUoKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gXCJpbnB1dF9maWxsZWRcIjtcblx0fVxuXHRnZXQgaGFzVHlwZXMoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblx0Z2V0IHJlZGlyZWN0T25GaW5pc2goKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCBpc0Jsb2NraW5nKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVx0XG5cdGdldCBhbGxvd011bHRpcGxlKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0aXNWYWxpZChldmVudDogRXZlbnQpOiBib29sZWFuIHtcblx0XHRpZiAoZXZlbnQudGFyZ2V0IGluc3RhbmNlb2YgSFRNTElucHV0RWxlbWVudCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuYmFzaWNWYWxpZGF0aW9uKGV2ZW50LnRhcmdldCkgJiYgISFldmVudC50YXJnZXQudmFsdWUudHJpbSgpO1xuXHRcdH1cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn0gIiwiaW1wb3J0IElFdmVudCBmcm9tIFwiLi4vaW50ZWZhY2VzL0lFdmVudFwiO1xuaW1wb3J0IEFUU0V2ZW50IGZyb20gXCIuL0FUU0V2ZW50XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExvY2F0aW9uIGV4dGVuZHMgQVRTRXZlbnQgaW1wbGVtZW50cyBJRXZlbnQge1xuXHRnZXQgc2hvdWxkRGVib3VuY2UoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCB0cmlnZ2VyKCk6IG51bGwge1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cdGdldCBzb3VyY2UoKTogbnVsbCB7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblx0Z2V0IG5hbWUoKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gXCJsb2NhdGlvbl9hY2NlcHRlZFwiO1xuXHR9XG5cdGdldCBoYXNUeXBlcygpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0Z2V0IHJlZGlyZWN0T25GaW5pc2goKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblx0Z2V0IGlzQmxvY2tpbmcoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblx0Z2V0IGFsbG93TXVsdGlwbGUoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGlzVmFsaWQoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxufSIsImltcG9ydCBJRXZlbnQgZnJvbSBcIi4uL2ludGVmYWNlcy9JRXZlbnRcIjtcbmltcG9ydCBBVFNFdmVudCBmcm9tIFwiLi9BVFNFdmVudFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNaWNyb3Bob25lIGV4dGVuZHMgQVRTRXZlbnQgaW1wbGVtZW50cyBJRXZlbnQge1xuXHRnZXQgc2hvdWxkRGVib3VuY2UoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCB0cmlnZ2VyKCk6IG51bGwge1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cdGdldCBzb3VyY2UoKTogbnVsbCB7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblx0Z2V0IG5hbWUoKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gXCJtaWNfYWNjZXB0ZWRcIjtcblx0fVxuXHRnZXQgaGFzVHlwZXMoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCByZWRpcmVjdE9uRmluaXNoKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdGdldCBpc0Jsb2NraW5nKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdGdldCBhbGxvd011bHRpcGxlKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRpc1ZhbGlkKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cbn0iLCJpbXBvcnQgSUV2ZW50IGZyb20gXCIuLi9pbnRlZmFjZXMvSUV2ZW50XCI7XG5pbXBvcnQgQVRTRXZlbnQgZnJvbSBcIi4vQVRTRXZlbnRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTm90aWZpY2F0aW9uIGV4dGVuZHMgQVRTRXZlbnQgaW1wbGVtZW50cyBJRXZlbnQge1xuXHRnZXQgc2hvdWxkRGVib3VuY2UoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCB0cmlnZ2VyKCk6IG51bGwge1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cdGdldCBzb3VyY2UoKTogbnVsbCB7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblx0Z2V0IG5hbWUoKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gXCJub3RpZmljYXRpb25fYWNjZXB0ZWRcIjtcblx0fVxuXHRnZXQgaGFzVHlwZXMoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCByZWRpcmVjdE9uRmluaXNoKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdGdldCBpc0Jsb2NraW5nKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdGdldCBhbGxvd011bHRpcGxlKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRpc1ZhbGlkKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cbn0iLCJpbXBvcnQgSUV2ZW50IGZyb20gXCIuLi9pbnRlZmFjZXMvSUV2ZW50XCI7XG5pbXBvcnQgQVRTRXZlbnQgZnJvbSBcIi4vQVRTRXZlbnRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGFnZUxvYWRlZCBleHRlbmRzIEFUU0V2ZW50IGltcGxlbWVudHMgSUV2ZW50IHtcblx0Z2V0IHNob3VsZERlYm91bmNlKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRnZXQgdHJpZ2dlcigpOiBudWxsIHtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXHRnZXQgc291cmNlKCk6IERvY3VtZW50IHtcblx0XHRyZXR1cm4gZG9jdW1lbnQ7XG5cdH1cblx0Z2V0IG5hbWUoKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gXCJwYWdlX2xlZnRcIjtcblx0fVxuXHRnZXQgaGFzVHlwZXMoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCByZWRpcmVjdE9uRmluaXNoKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRnZXQgaXNCbG9ja2luZygpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0Z2V0IGFsbG93TXVsdGlwbGUoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGlzVmFsaWQoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGRvY3VtZW50LnZpc2liaWxpdHlTdGF0ZSA9PT0gXCJoaWRkZW5cIjtcblx0fVxufSIsImltcG9ydCBJRXZlbnQgZnJvbSBcIi4uL2ludGVmYWNlcy9JRXZlbnRcIjtcbmltcG9ydCBBVFNFdmVudCBmcm9tIFwiLi9BVFNFdmVudFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYWdlTG9hZGVkIGV4dGVuZHMgQVRTRXZlbnQgaW1wbGVtZW50cyBJRXZlbnQge1xuXHRnZXQgc2hvdWxkRGVib3VuY2UoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCB0cmlnZ2VyKCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIFwibG9hZFwiO1xuXHR9XG5cdGdldCBzb3VyY2UoKTogV2luZG93IHtcblx0XHRyZXR1cm4gd2luZG93O1xuXHR9XG5cdGdldCBuYW1lKCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIFwicGFnZV9sb2FkZWRcIjtcblx0fVxuXHRnZXQgaGFzVHlwZXMoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCByZWRpcmVjdE9uRmluaXNoKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRnZXQgaXNCbG9ja2luZygpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0Z2V0IGFsbG93TXVsdGlwbGUoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGlzVmFsaWQoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cbn0iLCJpbXBvcnQgSUV2ZW50IGZyb20gXCIuLi9pbnRlZmFjZXMvSUV2ZW50XCI7XG5pbXBvcnQgQVRTRXZlbnQgZnJvbSBcIi4vQVRTRXZlbnRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGFnZVJlYWQgZXh0ZW5kcyBBVFNFdmVudCBpbXBsZW1lbnRzIElFdmVudCB7XG5cdHByaXZhdGUgbWluU2Nyb2xsUGVyY2VudGFnZSA9IDcwO1xuXHRwcml2YXRlIG1pblN0YXlTZWNvbmRzID0gMioxMDAwO1xuXHRwcml2YXRlIGhhc1Njcm9sbGVkID0gZmFsc2U7XG5cdHByaXZhdGUgaGFzU3RheWVkID0gZmFsc2U7XG5cdHByaXZhdGUgY3VzdG9tRXZlbnQ6IEV2ZW50O1xuXHRwcml2YXRlIHRpbWVvdXQ6IGFueTtcblxuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpO1xuXHRcdHRoaXMuY3VzdG9tRXZlbnQgPSBuZXcgRXZlbnQodGhpcy50cmlnZ2VyKTtcblx0XHR0aGlzLmVuYWJsZSgpO1xuXHRcdGNvbnNvbGUubG9nKFwiUGFnZSByZWFkIGVuYWJsZWRcIik7XG5cdH1cblxuXHRnZXQgc2hvdWxkRGVib3VuY2UoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCB0cmlnZ2VyKCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIFwicGFnZV9yZWFkXCI7XG5cdH1cblx0Z2V0IHNvdXJjZSgpOiBXaW5kb3cge1xuXHRcdHJldHVybiB3aW5kb3c7XG5cdH1cblx0Z2V0IG5hbWUoKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gXCJwYWdlX3JlYWRcIjtcblx0fVxuXHRnZXQgaGFzVHlwZXMoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCByZWRpcmVjdE9uRmluaXNoKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRnZXQgaXNCbG9ja2luZygpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0Z2V0IGFsbG93TXVsdGlwbGUoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGlzVmFsaWQoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHRwcml2YXRlIGVuYWJsZSgpIHtcblx0XHR3aW5kb3cub25zY3JvbGwgPSAoKSA9PiB0aGlzLnNjcm9sbGVkKCk7XG5cdFx0dGhpcy5kZXRlY3RGb2N1cygpO1xuXHRcdHRoaXMuZGV0ZWN0VmlzaWJpbGl0eSgpO1xuXHRcdHRoaXMuc2Nyb2xsZWQoKTtcblx0XHR0aGlzLnRpbWVvdXQgPSBzZXRUaW1lb3V0ICgoKSA9PiB0aGlzLnN0YXllZCgpLCB0aGlzLm1pblN0YXlTZWNvbmRzKTtcblx0fVxuXG5cdHByaXZhdGUgZ2V0IHZpc2liaWxpdHlQcm9wcygpIDogW3N0cmluZywgc3RyaW5nXSB7XG5cdFx0aWYgKHR5cGVvZiBkb2N1bWVudC5oaWRkZW4gIT09IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdHJldHVybiBbXCJ2aXNpYmlsaXR5Y2hhbmdlXCIsIFwidmlzaWJpbGl0eVN0YXRlXCJdO1xuXHRcdH1cblx0XHRlbHNlIGlmICh0eXBlb2YgKGRvY3VtZW50IGFzIGFueSkubW96SGlkZGVuICE9PSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRyZXR1cm4gW1wibW96dmlzaWJpbGl0eWNoYW5nZVwiLCBcIm1velZpc2liaWxpdHlTdGF0ZVwiXTtcblx0XHR9XG5cdFx0ZWxzZSBpZiAodHlwZW9mIChkb2N1bWVudCBhcyBhbnkpLm1zSGlkZGVuICE9PSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRyZXR1cm4gW1wibXN2aXNpYmlsaXR5Y2hhbmdlXCIsIFwibXNWaXNpYmlsaXR5U3RhdGVcIl07XG5cdFx0fVxuXHRcdGVsc2UgaWYgKHR5cGVvZiAoZG9jdW1lbnQgYXMgYW55KS53ZWJraXRIaWRkZW4gIT09IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdHJldHVybiBbXCJ3ZWJraXR2aXNpYmlsaXR5Y2hhbmdlXCIsIFwid2Via2l0VmlzaWJpbGl0eVN0YXRlXCJdO1xuXHRcdH1cblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJWaXNpYmlsaXR5IG5vdCBzdXBwb3J0ZWQuXCIpO1xuXHR9XG5cblx0cHJpdmF0ZSBkZXRlY3RGb2N1cygpIHtcblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImZvY3VzXCIsIHRoaXMuZm9jdXNHcmFudGVkLmJpbmQodGhpcykpO1xuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiYmx1clwiLCB0aGlzLmZvY3VzTG9zdC5iaW5kKHRoaXMpKTtcblx0fVxuXG5cdHByaXZhdGUgZGV0ZWN0VmlzaWJpbGl0eSgpIHtcblx0XHQvLyBjaGVjayB0aGUgdmlzaWJsaWxpdHkgb2YgdGhlIHBhZ2Vcblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgW3Zpc2liaWxpdHlDaGFuZ2VdID0gdGhpcy52aXNpYmlsaXR5UHJvcHM7XG5cdFx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKHZpc2liaWxpdHlDaGFuZ2UsIHRoaXMudmlzaWJpbGl0eUNoYW5nZWQuYmluZCh0aGlzKSk7XG5cdFx0fSBjYXRjaChfKSB7XG5cdFx0XHQvL1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgc3RvcERldGVjdGluZ1Zpc2liaWxpdHkoKSB7XG5cdFx0Ly8gY2hlY2sgdGhlIHZpc2libGlsaXR5IG9mIHRoZSBwYWdlXG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IFt2aXNpYmlsaXR5Q2hhbmdlXSA9IHRoaXMudmlzaWJpbGl0eVByb3BzO1xuXHRcdFx0ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcih2aXNpYmlsaXR5Q2hhbmdlLCB0aGlzLnZpc2liaWxpdHlDaGFuZ2VkLmJpbmQodGhpcykpO1xuXHRcdH0gY2F0Y2goXykge1xuXHRcdFx0Ly9cblx0XHRcdHJldHVybjtcblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIHZpc2liaWxpdHlDaGFuZ2VkKCkge1xuXHRcdGNvbnN0IFtfLCB2aXNpYmlsaXR5U3RhdGVdID0gdGhpcy52aXNpYmlsaXR5UHJvcHM7XG5cdFx0dGhpcy50b2dnbGVUaW1lcihkb2N1bWVudFt2aXNpYmlsaXR5U3RhdGVdID09PSBcInZpc2libGVcIik7XG5cdH1cblxuXHRwcml2YXRlIGZvY3VzR3JhbnRlZCgpIHtcblx0XHR0aGlzLnRvZ2dsZVRpbWVyKHRydWUpO1xuXHR9XG5cblx0cHJpdmF0ZSBmb2N1c0xvc3QoKSB7XG5cdFx0dGhpcy50b2dnbGVUaW1lcihmYWxzZSk7XG5cdH1cblxuXHRwcml2YXRlIHRvZ2dsZVRpbWVyKHN0YXR1czogYm9vbGVhbikge1xuXHRcdGlmICh0aGlzLmhhc1N0YXllZCkgeyByZXR1cm47IH1cblxuXHRcdGlmKHN0YXR1cykge1xuXHRcdFx0dGhpcy50aW1lb3V0ID0gc2V0VGltZW91dCAoKCkgPT4gdGhpcy5zdGF5ZWQoKSwgdGhpcy5taW5TdGF5U2Vjb25kcyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXQpO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgZGlzYWJsZSgpIHtcblx0XHR3aW5kb3cub25zY3JvbGwgPSBudWxsO1xuXHRcdHRoaXMuc3RvcERldGVjdGluZ1Zpc2liaWxpdHkoKTtcblx0XHR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImZvY3VzXCIsIHRoaXMuZm9jdXNHcmFudGVkLmJpbmQodGhpcykpO1xuXHRcdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwiYmx1clwiLCB0aGlzLmZvY3VzTG9zdC5iaW5kKHRoaXMpKTtcblx0fVxuXG5cdHByaXZhdGUgZ2V0U2Nyb2xsUGVyY2VudCgpIHtcblx0XHRyZXR1cm4gKChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wICsgZG9jdW1lbnQuYm9keS5zY3JvbGxUb3ApIC8gKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxIZWlnaHQgLSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0KSAqIDEwMCk7XG5cdH1cblxuXHRwcml2YXRlIHNjcm9sbGVkKCkge1xuXHRcdGlmKHRoaXMuZ2V0U2Nyb2xsUGVyY2VudCgpID4gdGhpcy5taW5TY3JvbGxQZXJjZW50YWdlKSB7XG5cdFx0XHRpZih0aGlzLmhhc1N0YXllZCkge1xuXHRcdFx0XHR0aGlzLmRpc3BhdGNoKCk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLmhhc1Njcm9sbGVkID0gdHJ1ZTtcblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIHN0YXllZCgpIHtcblx0XHRpZih0aGlzLmhhc1Njcm9sbGVkKSB7XG5cdFx0XHR0aGlzLmRpc3BhdGNoKCk7XG5cdFx0fVxuXHRcdHRoaXMuaGFzU3RheWVkID0gdHJ1ZTtcblx0fVxuXG5cdHByaXZhdGUgZGlzcGF0Y2goKSB7XG5cdFx0d2luZG93LmRpc3BhdGNoRXZlbnQodGhpcy5jdXN0b21FdmVudCk7XG5cdFx0dGhpcy5kaXNhYmxlKCk7XG5cdH1cbn0iLCJpbXBvcnQgSUV2ZW50IGZyb20gXCIuLi9pbnRlZmFjZXMvSUV2ZW50XCI7XG5pbXBvcnQgQVRTRXZlbnQgZnJvbSBcIi4vQVRTRXZlbnRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3VibWl0IGV4dGVuZHMgQVRTRXZlbnQgaW1wbGVtZW50cyBJRXZlbnQge1xuXHRnZXQgc2hvdWxkRGVib3VuY2UoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCB0cmlnZ2VyKCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIFwic3VibWl0XCI7XG5cdH1cblx0Z2V0IHNvdXJjZSgpOiBXaW5kb3cge1xuXHRcdHJldHVybiB3aW5kb3c7XG5cdH1cblx0Z2V0IG5hbWUoKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gXCJmb3JtX3N1Ym1pdHRlZFwiO1xuXHR9XG5cdGdldCBoYXNUeXBlcygpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXHRnZXQgcmVkaXJlY3RPbkZpbmlzaCgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXHRnZXQgaXNCbG9ja2luZygpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXHRnZXQgYWxsb3dNdWx0aXBsZSgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0aXNWYWxpZChldmVudDogRXZlbnQpOiBib29sZWFuIHtcblx0XHRpZiAoZXZlbnQudGFyZ2V0IGluc3RhbmNlb2YgSFRNTEZvcm1FbGVtZW50KSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5iYXNpY1ZhbGlkYXRpb24oZXZlbnQudGFyZ2V0KTtcblx0XHR9XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG4gICAgXG59IiwiaW1wb3J0IElFdmVudCBmcm9tIFwiLi4vaW50ZWZhY2VzL0lFdmVudFwiO1xuaW1wb3J0IEFUU0V2ZW50IGZyb20gXCIuL0FUU0V2ZW50XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdlYmNhbSBleHRlbmRzIEFUU0V2ZW50IGltcGxlbWVudHMgSUV2ZW50IHtcblx0Z2V0IHNob3VsZERlYm91bmNlKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRnZXQgdHJpZ2dlcigpOiBudWxsIHtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXHRnZXQgc291cmNlKCk6IG51bGwge1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cdGdldCBuYW1lKCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIFwid2ViY2FtX2FjY2VwdGVkXCI7XG5cdH1cblx0Z2V0IGhhc1R5cGVzKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRnZXQgcmVkaXJlY3RPbkZpbmlzaCgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXHRnZXQgaXNCbG9ja2luZygpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXHRnZXQgYWxsb3dNdWx0aXBsZSgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0aXNWYWxpZCgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG59IiwiLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vKiBVQVBhcnNlci5qcyB2MS4wLjM4XG4gICBDb3B5cmlnaHQgwqkgMjAxMi0yMDIxIEZhaXNhbCBTYWxtYW4gPGZAZmFpc2FsbWFuLmNvbT5cbiAgIE1JVCBMaWNlbnNlICovLypcbiAgIERldGVjdCBCcm93c2VyLCBFbmdpbmUsIE9TLCBDUFUsIGFuZCBEZXZpY2UgdHlwZS9tb2RlbCBmcm9tIFVzZXItQWdlbnQgZGF0YS5cbiAgIFN1cHBvcnRzIGJyb3dzZXIgJiBub2RlLmpzIGVudmlyb25tZW50LiBcbiAgIERlbW8gICA6IGh0dHBzOi8vZmFpc2FsbWFuLmdpdGh1Yi5pby91YS1wYXJzZXItanNcbiAgIFNvdXJjZSA6IGh0dHBzOi8vZ2l0aHViLmNvbS9mYWlzYWxtYW4vdWEtcGFyc2VyLWpzICovXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuKGZ1bmN0aW9uICh3aW5kb3csIHVuZGVmaW5lZCkge1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgLy8vLy8vLy8vLy8vLy9cbiAgICAvLyBDb25zdGFudHNcbiAgICAvLy8vLy8vLy8vLy8vXG5cblxuICAgIHZhciBMSUJWRVJTSU9OICA9ICcxLjAuMzgnLFxuICAgICAgICBFTVBUWSAgICAgICA9ICcnLFxuICAgICAgICBVTktOT1dOICAgICA9ICc/JyxcbiAgICAgICAgRlVOQ19UWVBFICAgPSAnZnVuY3Rpb24nLFxuICAgICAgICBVTkRFRl9UWVBFICA9ICd1bmRlZmluZWQnLFxuICAgICAgICBPQkpfVFlQRSAgICA9ICdvYmplY3QnLFxuICAgICAgICBTVFJfVFlQRSAgICA9ICdzdHJpbmcnLFxuICAgICAgICBNQUpPUiAgICAgICA9ICdtYWpvcicsXG4gICAgICAgIE1PREVMICAgICAgID0gJ21vZGVsJyxcbiAgICAgICAgTkFNRSAgICAgICAgPSAnbmFtZScsXG4gICAgICAgIFRZUEUgICAgICAgID0gJ3R5cGUnLFxuICAgICAgICBWRU5ET1IgICAgICA9ICd2ZW5kb3InLFxuICAgICAgICBWRVJTSU9OICAgICA9ICd2ZXJzaW9uJyxcbiAgICAgICAgQVJDSElURUNUVVJFPSAnYXJjaGl0ZWN0dXJlJyxcbiAgICAgICAgQ09OU09MRSAgICAgPSAnY29uc29sZScsXG4gICAgICAgIE1PQklMRSAgICAgID0gJ21vYmlsZScsXG4gICAgICAgIFRBQkxFVCAgICAgID0gJ3RhYmxldCcsXG4gICAgICAgIFNNQVJUVFYgICAgID0gJ3NtYXJ0dHYnLFxuICAgICAgICBXRUFSQUJMRSAgICA9ICd3ZWFyYWJsZScsXG4gICAgICAgIEVNQkVEREVEICAgID0gJ2VtYmVkZGVkJyxcbiAgICAgICAgVUFfTUFYX0xFTkdUSCA9IDUwMDtcblxuICAgIHZhciBBTUFaT04gID0gJ0FtYXpvbicsXG4gICAgICAgIEFQUExFICAgPSAnQXBwbGUnLFxuICAgICAgICBBU1VTICAgID0gJ0FTVVMnLFxuICAgICAgICBCTEFDS0JFUlJZID0gJ0JsYWNrQmVycnknLFxuICAgICAgICBCUk9XU0VSID0gJ0Jyb3dzZXInLFxuICAgICAgICBDSFJPTUUgID0gJ0Nocm9tZScsXG4gICAgICAgIEVER0UgICAgPSAnRWRnZScsXG4gICAgICAgIEZJUkVGT1ggPSAnRmlyZWZveCcsXG4gICAgICAgIEdPT0dMRSAgPSAnR29vZ2xlJyxcbiAgICAgICAgSFVBV0VJICA9ICdIdWF3ZWknLFxuICAgICAgICBMRyAgICAgID0gJ0xHJyxcbiAgICAgICAgTUlDUk9TT0ZUID0gJ01pY3Jvc29mdCcsXG4gICAgICAgIE1PVE9ST0xBICA9ICdNb3Rvcm9sYScsXG4gICAgICAgIE9QRVJBICAgPSAnT3BlcmEnLFxuICAgICAgICBTQU1TVU5HID0gJ1NhbXN1bmcnLFxuICAgICAgICBTSEFSUCAgID0gJ1NoYXJwJyxcbiAgICAgICAgU09OWSAgICA9ICdTb255JyxcbiAgICAgICAgWElBT01JICA9ICdYaWFvbWknLFxuICAgICAgICBaRUJSQSAgID0gJ1plYnJhJyxcbiAgICAgICAgRkFDRUJPT0sgICAgPSAnRmFjZWJvb2snLFxuICAgICAgICBDSFJPTUlVTV9PUyA9ICdDaHJvbWl1bSBPUycsXG4gICAgICAgIE1BQ19PUyAgPSAnTWFjIE9TJztcblxuICAgIC8vLy8vLy8vLy8vXG4gICAgLy8gSGVscGVyXG4gICAgLy8vLy8vLy8vL1xuXG4gICAgdmFyIGV4dGVuZCA9IGZ1bmN0aW9uIChyZWdleGVzLCBleHRlbnNpb25zKSB7XG4gICAgICAgICAgICB2YXIgbWVyZ2VkUmVnZXhlcyA9IHt9O1xuICAgICAgICAgICAgZm9yICh2YXIgaSBpbiByZWdleGVzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGV4dGVuc2lvbnNbaV0gJiYgZXh0ZW5zaW9uc1tpXS5sZW5ndGggJSAyID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIG1lcmdlZFJlZ2V4ZXNbaV0gPSBleHRlbnNpb25zW2ldLmNvbmNhdChyZWdleGVzW2ldKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBtZXJnZWRSZWdleGVzW2ldID0gcmVnZXhlc1tpXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbWVyZ2VkUmVnZXhlcztcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyaXplID0gZnVuY3Rpb24gKGFycikge1xuICAgICAgICAgICAgdmFyIGVudW1zID0ge307XG4gICAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8YXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZW51bXNbYXJyW2ldLnRvVXBwZXJDYXNlKCldID0gYXJyW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGVudW1zO1xuICAgICAgICB9LFxuICAgICAgICBoYXMgPSBmdW5jdGlvbiAoc3RyMSwgc3RyMikge1xuICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiBzdHIxID09PSBTVFJfVFlQRSA/IGxvd2VyaXplKHN0cjIpLmluZGV4T2YobG93ZXJpemUoc3RyMSkpICE9PSAtMSA6IGZhbHNlO1xuICAgICAgICB9LFxuICAgICAgICBsb3dlcml6ZSA9IGZ1bmN0aW9uIChzdHIpIHtcbiAgICAgICAgICAgIHJldHVybiBzdHIudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgfSxcbiAgICAgICAgbWFqb3JpemUgPSBmdW5jdGlvbiAodmVyc2lvbikge1xuICAgICAgICAgICAgcmV0dXJuIHR5cGVvZih2ZXJzaW9uKSA9PT0gU1RSX1RZUEUgPyB2ZXJzaW9uLnJlcGxhY2UoL1teXFxkXFwuXS9nLCBFTVBUWSkuc3BsaXQoJy4nKVswXSA6IHVuZGVmaW5lZDtcbiAgICAgICAgfSxcbiAgICAgICAgdHJpbSA9IGZ1bmN0aW9uIChzdHIsIGxlbikge1xuICAgICAgICAgICAgaWYgKHR5cGVvZihzdHIpID09PSBTVFJfVFlQRSkge1xuICAgICAgICAgICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKC9eXFxzXFxzKi8sIEVNUFRZKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHlwZW9mKGxlbikgPT09IFVOREVGX1RZUEUgPyBzdHIgOiBzdHIuc3Vic3RyaW5nKDAsIFVBX01BWF9MRU5HVEgpO1xuICAgICAgICAgICAgfVxuICAgIH07XG5cbiAgICAvLy8vLy8vLy8vLy8vLy9cbiAgICAvLyBNYXAgaGVscGVyXG4gICAgLy8vLy8vLy8vLy8vLy9cblxuICAgIHZhciByZ3hNYXBwZXIgPSBmdW5jdGlvbiAodWEsIGFycmF5cykge1xuXG4gICAgICAgICAgICB2YXIgaSA9IDAsIGosIGssIHAsIHEsIG1hdGNoZXMsIG1hdGNoO1xuXG4gICAgICAgICAgICAvLyBsb29wIHRocm91Z2ggYWxsIHJlZ2V4ZXMgbWFwc1xuICAgICAgICAgICAgd2hpbGUgKGkgPCBhcnJheXMubGVuZ3RoICYmICFtYXRjaGVzKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgcmVnZXggPSBhcnJheXNbaV0sICAgICAgIC8vIGV2ZW4gc2VxdWVuY2UgKDAsMiw0LC4uKVxuICAgICAgICAgICAgICAgICAgICBwcm9wcyA9IGFycmF5c1tpICsgMV07ICAgLy8gb2RkIHNlcXVlbmNlICgxLDMsNSwuLilcbiAgICAgICAgICAgICAgICBqID0gayA9IDA7XG5cbiAgICAgICAgICAgICAgICAvLyB0cnkgbWF0Y2hpbmcgdWFzdHJpbmcgd2l0aCByZWdleGVzXG4gICAgICAgICAgICAgICAgd2hpbGUgKGogPCByZWdleC5sZW5ndGggJiYgIW1hdGNoZXMpIHtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIXJlZ2V4W2pdKSB7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIG1hdGNoZXMgPSByZWdleFtqKytdLmV4ZWModWEpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghIW1hdGNoZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAocCA9IDA7IHAgPCBwcm9wcy5sZW5ndGg7IHArKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoID0gbWF0Y2hlc1srK2tdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHEgPSBwcm9wc1twXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjaGVjayBpZiBnaXZlbiBwcm9wZXJ0eSBpcyBhY3R1YWxseSBhcnJheVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcSA9PT0gT0JKX1RZUEUgJiYgcS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChxLmxlbmd0aCA9PT0gMikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBxWzFdID09IEZVTkNfVFlQRSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFzc2lnbiBtb2RpZmllZCBtYXRjaFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNbcVswXV0gPSBxWzFdLmNhbGwodGhpcywgbWF0Y2gpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhc3NpZ24gZ2l2ZW4gdmFsdWUsIGlnbm9yZSByZWdleCBtYXRjaFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNbcVswXV0gPSBxWzFdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHEubGVuZ3RoID09PSAzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjaGVjayB3aGV0aGVyIGZ1bmN0aW9uIG9yIHJlZ2V4XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHFbMV0gPT09IEZVTkNfVFlQRSAmJiAhKHFbMV0uZXhlYyAmJiBxWzFdLnRlc3QpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2FsbCBmdW5jdGlvbiAodXN1YWxseSBzdHJpbmcgbWFwcGVyKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNbcVswXV0gPSBtYXRjaCA/IHFbMV0uY2FsbCh0aGlzLCBtYXRjaCwgcVsyXSkgOiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNhbml0aXplIG1hdGNoIHVzaW5nIGdpdmVuIHJlZ2V4XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1txWzBdXSA9IG1hdGNoID8gbWF0Y2gucmVwbGFjZShxWzFdLCBxWzJdKSA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChxLmxlbmd0aCA9PT0gNCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNbcVswXV0gPSBtYXRjaCA/IHFbM10uY2FsbCh0aGlzLCBtYXRjaC5yZXBsYWNlKHFbMV0sIHFbMl0pKSA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNbcV0gPSBtYXRjaCA/IG1hdGNoIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpICs9IDI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgc3RyTWFwcGVyID0gZnVuY3Rpb24gKHN0ciwgbWFwKSB7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgaW4gbWFwKSB7XG4gICAgICAgICAgICAgICAgLy8gY2hlY2sgaWYgY3VycmVudCB2YWx1ZSBpcyBhcnJheVxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgbWFwW2ldID09PSBPQkpfVFlQRSAmJiBtYXBbaV0ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IG1hcFtpXS5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGhhcyhtYXBbaV1bal0sIHN0cikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKGkgPT09IFVOS05PV04pID8gdW5kZWZpbmVkIDogaTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaGFzKG1hcFtpXSwgc3RyKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKGkgPT09IFVOS05PV04pID8gdW5kZWZpbmVkIDogaTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc3RyO1xuICAgIH07XG5cbiAgICAvLy8vLy8vLy8vLy8vLy9cbiAgICAvLyBTdHJpbmcgbWFwXG4gICAgLy8vLy8vLy8vLy8vLy9cblxuICAgIC8vIFNhZmFyaSA8IDMuMFxuICAgIHZhciBvbGRTYWZhcmlNYXAgPSB7XG4gICAgICAgICAgICAnMS4wJyAgIDogJy84JyxcbiAgICAgICAgICAgICcxLjInICAgOiAnLzEnLFxuICAgICAgICAgICAgJzEuMycgICA6ICcvMycsXG4gICAgICAgICAgICAnMi4wJyAgIDogJy80MTInLFxuICAgICAgICAgICAgJzIuMC4yJyA6ICcvNDE2JyxcbiAgICAgICAgICAgICcyLjAuMycgOiAnLzQxNycsXG4gICAgICAgICAgICAnMi4wLjQnIDogJy80MTknLFxuICAgICAgICAgICAgJz8nICAgICA6ICcvJ1xuICAgICAgICB9LFxuICAgICAgICB3aW5kb3dzVmVyc2lvbk1hcCA9IHtcbiAgICAgICAgICAgICdNRScgICAgICAgIDogJzQuOTAnLFxuICAgICAgICAgICAgJ05UIDMuMTEnICAgOiAnTlQzLjUxJyxcbiAgICAgICAgICAgICdOVCA0LjAnICAgIDogJ05UNC4wJyxcbiAgICAgICAgICAgICcyMDAwJyAgICAgIDogJ05UIDUuMCcsXG4gICAgICAgICAgICAnWFAnICAgICAgICA6IFsnTlQgNS4xJywgJ05UIDUuMiddLFxuICAgICAgICAgICAgJ1Zpc3RhJyAgICAgOiAnTlQgNi4wJyxcbiAgICAgICAgICAgICc3JyAgICAgICAgIDogJ05UIDYuMScsXG4gICAgICAgICAgICAnOCcgICAgICAgICA6ICdOVCA2LjInLFxuICAgICAgICAgICAgJzguMScgICAgICAgOiAnTlQgNi4zJyxcbiAgICAgICAgICAgICcxMCcgICAgICAgIDogWydOVCA2LjQnLCAnTlQgMTAuMCddLFxuICAgICAgICAgICAgJ1JUJyAgICAgICAgOiAnQVJNJ1xuICAgIH07XG5cbiAgICAvLy8vLy8vLy8vLy8vL1xuICAgIC8vIFJlZ2V4IG1hcFxuICAgIC8vLy8vLy8vLy8vLy9cblxuICAgIHZhciByZWdleGVzID0ge1xuXG4gICAgICAgIGJyb3dzZXIgOiBbW1xuXG4gICAgICAgICAgICAvXFxiKD86Y3Jtb3xjcmlvcylcXC8oW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDaHJvbWUgZm9yIEFuZHJvaWQvaU9TXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsICdDaHJvbWUnXV0sIFtcbiAgICAgICAgICAgIC9lZGcoPzplfGlvc3xhKT9cXC8oW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTWljcm9zb2Z0IEVkZ2VcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgJ0VkZ2UnXV0sIFtcblxuICAgICAgICAgICAgLy8gUHJlc3RvIGJhc2VkXG4gICAgICAgICAgICAvKG9wZXJhIG1pbmkpXFwvKFstXFx3XFwuXSspL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE9wZXJhIE1pbmlcbiAgICAgICAgICAgIC8ob3BlcmEgW21vYmlsZXRhYl17Myw2fSlcXGIuK3ZlcnNpb25cXC8oWy1cXHdcXC5dKykvaSwgICAgICAgICAgICAgICAgIC8vIE9wZXJhIE1vYmkvVGFibGV0XG4gICAgICAgICAgICAvKG9wZXJhKSg/Oi4rdmVyc2lvblxcL3xbXFwvIF0rKShbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBPcGVyYVxuICAgICAgICAgICAgXSwgW05BTUUsIFZFUlNJT05dLCBbXG4gICAgICAgICAgICAvb3Bpb3NbXFwvIF0rKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE9wZXJhIG1pbmkgb24gaXBob25lID49IDguMFxuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCBPUEVSQSsnIE1pbmknXV0sIFtcbiAgICAgICAgICAgIC9cXGJvcCg/OnJnKT94XFwvKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE9wZXJhIEdYXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsIE9QRVJBKycgR1gnXV0sIFtcbiAgICAgICAgICAgIC9cXGJvcHJcXC8oW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE9wZXJhIFdlYmtpdFxuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCBPUEVSQV1dLCBbXG5cbiAgICAgICAgICAgIC8vIE1peGVkXG4gICAgICAgICAgICAvXFxiYlthaV0qZCg/OnVoZHxbdWJdKlthZWtvcHJzd3hdezUsNn0pW1xcLyBdPyhbXFx3XFwuXSspL2kgICAgICAgICAgICAvLyBCYWlkdVxuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCAnQmFpZHUnXV0sIFtcbiAgICAgICAgICAgIC8oa2luZGxlKVxcLyhbXFx3XFwuXSspL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gS2luZGxlXG4gICAgICAgICAgICAvKGx1bmFzY2FwZXxtYXh0aG9ufG5ldGZyb250fGphc21pbmV8YmxhemVyKVtcXC8gXT8oW1xcd1xcLl0qKS9pLCAgICAgIC8vIEx1bmFzY2FwZS9NYXh0aG9uL05ldGZyb250L0phc21pbmUvQmxhemVyXG4gICAgICAgICAgICAvLyBUcmlkZW50IGJhc2VkXG4gICAgICAgICAgICAvKGF2YW50fGllbW9iaWxlfHNsaW0pXFxzPyg/OmJyb3dzZXIpP1tcXC8gXT8oW1xcd1xcLl0qKS9pLCAgICAgICAgICAgICAvLyBBdmFudC9JRU1vYmlsZS9TbGltQnJvd3NlclxuICAgICAgICAgICAgLyg/Om1zfFxcKCkoaWUpIChbXFx3XFwuXSspL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBJbnRlcm5ldCBFeHBsb3JlclxuXG4gICAgICAgICAgICAvLyBXZWJraXQvS0hUTUwgYmFzZWQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZsb2NrL1JvY2tNZWx0L01pZG9yaS9FcGlwaGFueS9TaWxrL1NreWZpcmUvQm9sdC9Jcm9uL0lyaWRpdW0vUGhhbnRvbUpTL0Jvd3Nlci9RdXBaaWxsYS9GYWxrb25cbiAgICAgICAgICAgIC8oZmxvY2t8cm9ja21lbHR8bWlkb3JpfGVwaXBoYW55fHNpbGt8c2t5ZmlyZXxib2x0fGlyb258dml2YWxkaXxpcmlkaXVtfHBoYW50b21qc3xib3dzZXJ8cXVhcmt8cXVwemlsbGF8ZmFsa29ufHJla29ucXxwdWZmaW58YnJhdmV8d2hhbGUoPyEuK25hdmVyKXxxcWJyb3dzZXJsaXRlfHFxfGR1Y2tkdWNrZ28pXFwvKFstXFx3XFwuXSspL2ksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFJla29ucS9QdWZmaW4vQnJhdmUvV2hhbGUvUVFCcm93c2VyTGl0ZS9RUSwgYWthIFNob3VRXG4gICAgICAgICAgICAvKGhleXRhcHxvdmkpYnJvd3NlclxcLyhbXFxkXFwuXSspL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEhleXRhcC9PdmlcbiAgICAgICAgICAgIC8od2VpYm8pX18oW1xcZFxcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBXZWlib1xuICAgICAgICAgICAgXSwgW05BTUUsIFZFUlNJT05dLCBbXG4gICAgICAgICAgICAvXFxiZGRnXFwvKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBEdWNrRHVja0dvXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsICdEdWNrRHVja0dvJ11dLCBbXG4gICAgICAgICAgICAvKD86XFxidWM/ID9icm93c2VyfCg/Omp1Yy4rKXVjd2ViKVtcXC8gXT8oW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAvLyBVQ0Jyb3dzZXJcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgJ1VDJytCUk9XU0VSXV0sIFtcbiAgICAgICAgICAgIC9taWNyb20uK1xcYnFiY29yZVxcLyhbXFx3XFwuXSspL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdlQ2hhdCBEZXNrdG9wIGZvciBXaW5kb3dzIEJ1aWx0LWluIEJyb3dzZXJcbiAgICAgICAgICAgIC9cXGJxYmNvcmVcXC8oW1xcd1xcLl0rKS4rbWljcm9tL2ksXG4gICAgICAgICAgICAvbWljcm9tZXNzZW5nZXJcXC8oW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdlQ2hhdFxuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCAnV2VDaGF0J11dLCBbXG4gICAgICAgICAgICAva29ucXVlcm9yXFwvKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEtvbnF1ZXJvclxuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCAnS29ucXVlcm9yJ11dLCBbXG4gICAgICAgICAgICAvdHJpZGVudC4rcnZbOiBdKFtcXHdcXC5dezEsOX0pXFxiLitsaWtlIGdlY2tvL2kgICAgICAgICAgICAgICAgICAgICAgIC8vIElFMTFcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgJ0lFJ11dLCBbXG4gICAgICAgICAgICAveWEoPzpzZWFyY2gpP2Jyb3dzZXJcXC8oW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFlhbmRleFxuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCAnWWFuZGV4J11dLCBbXG4gICAgICAgICAgICAvc2xicm93c2VyXFwvKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNtYXJ0IExlbm92byBCcm93c2VyXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsICdTbWFydCBMZW5vdm8gJytCUk9XU0VSXV0sIFtcbiAgICAgICAgICAgIC8oYXZhc3R8YXZnKVxcLyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQXZhc3QvQVZHIFNlY3VyZSBCcm93c2VyXG4gICAgICAgICAgICBdLCBbW05BTUUsIC8oLispLywgJyQxIFNlY3VyZSAnK0JST1dTRVJdLCBWRVJTSU9OXSwgW1xuICAgICAgICAgICAgL1xcYmZvY3VzXFwvKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRmlyZWZveCBGb2N1c1xuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCBGSVJFRk9YKycgRm9jdXMnXV0sIFtcbiAgICAgICAgICAgIC9cXGJvcHRcXC8oW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE9wZXJhIFRvdWNoXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsIE9QRVJBKycgVG91Y2gnXV0sIFtcbiAgICAgICAgICAgIC9jb2NfY29jXFx3K1xcLyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIENvYyBDb2MgQnJvd3NlclxuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCAnQ29jIENvYyddXSwgW1xuICAgICAgICAgICAgL2RvbGZpblxcLyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBEb2xwaGluXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsICdEb2xwaGluJ11dLCBbXG4gICAgICAgICAgICAvY29hc3RcXC8oW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE9wZXJhIENvYXN0XG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsIE9QRVJBKycgQ29hc3QnXV0sIFtcbiAgICAgICAgICAgIC9taXVpYnJvd3NlclxcLyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTUlVSSBCcm93c2VyXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsICdNSVVJICcrQlJPV1NFUl1dLCBbXG4gICAgICAgICAgICAvZnhpb3NcXC8oWy1cXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZpcmVmb3ggZm9yIGlPU1xuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCBGSVJFRk9YXV0sIFtcbiAgICAgICAgICAgIC9cXGJxaWh1fChxaT9obz9vP3wzNjApYnJvd3Nlci9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDM2MFxuICAgICAgICAgICAgXSwgW1tOQU1FLCAnMzYwICcgKyBCUk9XU0VSXV0sIFtcbiAgICAgICAgICAgIC8ob2N1bHVzfHNhaWxmaXNofGh1YXdlaXx2aXZvKWJyb3dzZXJcXC8oW1xcd1xcLl0rKS9pXG4gICAgICAgICAgICBdLCBbW05BTUUsIC8oLispLywgJyQxICcgKyBCUk9XU0VSXSwgVkVSU0lPTl0sIFsgICAgICAgICAgICAgICAgICAgIC8vIE9jdWx1cy9TYWlsZmlzaC9IdWF3ZWlCcm93c2VyL1Zpdm9Ccm93c2VyXG4gICAgICAgICAgICAvc2Ftc3VuZ2Jyb3dzZXJcXC8oW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNhbXN1bmcgSW50ZXJuZXRcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgU0FNU1VORyArICcgSW50ZXJuZXQnXV0sIFtcbiAgICAgICAgICAgIC8oY29tb2RvX2RyYWdvbilcXC8oW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ29tb2RvIERyYWdvblxuICAgICAgICAgICAgXSwgW1tOQU1FLCAvXy9nLCAnICddLCBWRVJTSU9OXSwgW1xuICAgICAgICAgICAgL21ldGFzcltcXC8gXT8oW1xcZFxcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTb2dvdSBFeHBsb3JlclxuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCAnU29nb3UgRXhwbG9yZXInXV0sIFtcbiAgICAgICAgICAgIC8oc29nb3UpbW9cXHcrXFwvKFtcXGRcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNvZ291IE1vYmlsZVxuICAgICAgICAgICAgXSwgW1tOQU1FLCAnU29nb3UgTW9iaWxlJ10sIFZFUlNJT05dLCBbXG4gICAgICAgICAgICAvKGVsZWN0cm9uKVxcLyhbXFx3XFwuXSspIHNhZmFyaS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEVsZWN0cm9uLWJhc2VkIEFwcFxuICAgICAgICAgICAgLyh0ZXNsYSkoPzogcXRjYXJicm93c2VyfFxcLygyMFxcZFxcZFxcLlstXFx3XFwuXSspKS9pLCAgICAgICAgICAgICAgICAgICAvLyBUZXNsYVxuICAgICAgICAgICAgL20/KHFxYnJvd3NlcnwyMzQ1RXhwbG9yZXIpW1xcLyBdPyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAvLyBRUUJyb3dzZXIvMjM0NSBCcm93c2VyXG4gICAgICAgICAgICBdLCBbTkFNRSwgVkVSU0lPTl0sIFtcbiAgICAgICAgICAgIC8obGJicm93c2VyKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTGllQmFvIEJyb3dzZXJcbiAgICAgICAgICAgIC9cXFsobGlua2VkaW4pYXBwXFxdL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBMaW5rZWRJbiBBcHAgZm9yIGlPUyAmIEFuZHJvaWRcbiAgICAgICAgICAgIF0sIFtOQU1FXSwgW1xuXG4gICAgICAgICAgICAvLyBXZWJWaWV3XG4gICAgICAgICAgICAvKCg/OmZiYW5cXC9mYmlvc3xmYl9pYWJcXC9mYjRhKSg/IS4rZmJhdil8O2ZiYXZcXC8oW1xcd1xcLl0rKTspL2kgICAgICAgLy8gRmFjZWJvb2sgQXBwIGZvciBpT1MgJiBBbmRyb2lkXG4gICAgICAgICAgICBdLCBbW05BTUUsIEZBQ0VCT09LXSwgVkVSU0lPTl0sIFtcbiAgICAgICAgICAgIC8oS2xhcm5hKVxcLyhbXFx3XFwuXSspL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gS2xhcm5hIFNob3BwaW5nIEJyb3dzZXIgZm9yIGlPUyAmIEFuZHJvaWRcbiAgICAgICAgICAgIC8oa2FrYW8oPzp0YWxrfHN0b3J5KSlbXFwvIF0oW1xcd1xcLl0rKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gS2FrYW8gQXBwXG4gICAgICAgICAgICAvKG5hdmVyKVxcKC4qPyhcXGQrXFwuW1xcd1xcLl0rKS4qXFwpL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE5hdmVyIEluQXBwXG4gICAgICAgICAgICAvc2FmYXJpIChsaW5lKVxcLyhbXFx3XFwuXSspL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIExpbmUgQXBwIGZvciBpT1NcbiAgICAgICAgICAgIC9cXGIobGluZSlcXC8oW1xcd1xcLl0rKVxcL2lhYi9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBMaW5lIEFwcCBmb3IgQW5kcm9pZFxuICAgICAgICAgICAgLyhhbGlwYXkpY2xpZW50XFwvKFtcXHdcXC5dKykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBbGlwYXlcbiAgICAgICAgICAgIC8odHdpdHRlcikoPzphbmR8IGYuK2VcXC8oW1xcd1xcLl0rKSkvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVHdpdHRlclxuICAgICAgICAgICAgLyhjaHJvbWl1bXxpbnN0YWdyYW18c25hcGNoYXQpW1xcLyBdKFstXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAvLyBDaHJvbWl1bS9JbnN0YWdyYW0vU25hcGNoYXRcbiAgICAgICAgICAgIF0sIFtOQU1FLCBWRVJTSU9OXSwgW1xuICAgICAgICAgICAgL1xcYmdzYVxcLyhbXFx3XFwuXSspIC4qc2FmYXJpXFwvL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEdvb2dsZSBTZWFyY2ggQXBwbGlhbmNlIG9uIGlPU1xuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCAnR1NBJ11dLCBbXG4gICAgICAgICAgICAvbXVzaWNhbF9seSg/Oi4rYXBwXz92ZXJzaW9uXFwvfF8pKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRpa1Rva1xuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCAnVGlrVG9rJ11dLCBbXG5cbiAgICAgICAgICAgIC9oZWFkbGVzc2Nocm9tZSg/OlxcLyhbXFx3XFwuXSspfCApL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ2hyb21lIEhlYWRsZXNzXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsIENIUk9NRSsnIEhlYWRsZXNzJ11dLCBbXG5cbiAgICAgICAgICAgIC8gd3ZcXCkuKyhjaHJvbWUpXFwvKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIENocm9tZSBXZWJWaWV3XG4gICAgICAgICAgICBdLCBbW05BTUUsIENIUk9NRSsnIFdlYlZpZXcnXSwgVkVSU0lPTl0sIFtcblxuICAgICAgICAgICAgL2Ryb2lkLisgdmVyc2lvblxcLyhbXFx3XFwuXSspXFxiLisoPzptb2JpbGUgc2FmYXJpfHNhZmFyaSkvaSAgICAgICAgICAgLy8gQW5kcm9pZCBCcm93c2VyXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsICdBbmRyb2lkICcrQlJPV1NFUl1dLCBbXG5cbiAgICAgICAgICAgIC8oY2hyb21lfG9tbml3ZWJ8YXJvcmF8W3RpemVub2thXXs1fSA/YnJvd3NlcilcXC92PyhbXFx3XFwuXSspL2kgICAgICAgLy8gQ2hyb21lL09tbmlXZWIvQXJvcmEvVGl6ZW4vTm9raWFcbiAgICAgICAgICAgIF0sIFtOQU1FLCBWRVJTSU9OXSwgW1xuXG4gICAgICAgICAgICAvdmVyc2lvblxcLyhbXFx3XFwuXFwsXSspIC4qbW9iaWxlXFwvXFx3KyAoc2FmYXJpKS9pICAgICAgICAgICAgICAgICAgICAgIC8vIE1vYmlsZSBTYWZhcmlcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgJ01vYmlsZSBTYWZhcmknXV0sIFtcbiAgICAgICAgICAgIC92ZXJzaW9uXFwvKFtcXHcoXFwufFxcLCldKykgLioobW9iaWxlID9zYWZhcml8c2FmYXJpKS9pICAgICAgICAgICAgICAgIC8vIFNhZmFyaSAmIFNhZmFyaSBNb2JpbGVcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBOQU1FXSwgW1xuICAgICAgICAgICAgL3dlYmtpdC4rPyhtb2JpbGUgP3NhZmFyaXxzYWZhcmkpKFxcL1tcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAvLyBTYWZhcmkgPCAzLjBcbiAgICAgICAgICAgIF0sIFtOQU1FLCBbVkVSU0lPTiwgc3RyTWFwcGVyLCBvbGRTYWZhcmlNYXBdXSwgW1xuXG4gICAgICAgICAgICAvKHdlYmtpdHxraHRtbClcXC8oW1xcd1xcLl0rKS9pXG4gICAgICAgICAgICBdLCBbTkFNRSwgVkVSU0lPTl0sIFtcblxuICAgICAgICAgICAgLy8gR2Vja28gYmFzZWRcbiAgICAgICAgICAgIC8obmF2aWdhdG9yfG5ldHNjYXBlXFxkPylcXC8oWy1cXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE5ldHNjYXBlXG4gICAgICAgICAgICBdLCBbW05BTUUsICdOZXRzY2FwZSddLCBWRVJTSU9OXSwgW1xuICAgICAgICAgICAgL21vYmlsZSB2cjsgcnY6KFtcXHdcXC5dKylcXCkuK2ZpcmVmb3gvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBGaXJlZm94IFJlYWxpdHlcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgRklSRUZPWCsnIFJlYWxpdHknXV0sIFtcbiAgICAgICAgICAgIC9la2lvaGYuKyhmbG93KVxcLyhbXFx3XFwuXSspL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRmxvd1xuICAgICAgICAgICAgLyhzd2lmdGZveCkvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTd2lmdGZveFxuICAgICAgICAgICAgLyhpY2VkcmFnb258aWNld2Vhc2VsfGNhbWlub3xjaGltZXJhfGZlbm5lY3xtYWVtbyBicm93c2VyfG1pbmltb3xjb25rZXJvcnxrbGFyKVtcXC8gXT8oW1xcd1xcLlxcK10rKS9pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBJY2VEcmFnb24vSWNld2Vhc2VsL0NhbWluby9DaGltZXJhL0Zlbm5lYy9NYWVtby9NaW5pbW8vQ29ua2Vyb3IvS2xhclxuICAgICAgICAgICAgLyhzZWFtb25rZXl8ay1tZWxlb258aWNlY2F0fGljZWFwZXxmaXJlYmlyZHxwaG9lbml4fHBhbGVtb29ufGJhc2lsaXNrfHdhdGVyZm94KVxcLyhbLVxcd1xcLl0rKSQvaSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRmlyZWZveC9TZWFNb25rZXkvSy1NZWxlb24vSWNlQ2F0L0ljZUFwZS9GaXJlYmlyZC9QaG9lbml4XG4gICAgICAgICAgICAvKGZpcmVmb3gpXFwvKFtcXHdcXC5dKykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE90aGVyIEZpcmVmb3gtYmFzZWRcbiAgICAgICAgICAgIC8obW96aWxsYSlcXC8oW1xcd1xcLl0rKSAuK3J2XFw6LitnZWNrb1xcL1xcZCsvaSwgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTW96aWxsYVxuXG4gICAgICAgICAgICAvLyBPdGhlclxuICAgICAgICAgICAgLyhwb2xhcmlzfGx5bnh8ZGlsbG98aWNhYnxkb3Jpc3xhbWF5YXx3M218bmV0c3VyZnxzbGVpcG5pcnxvYmlnb3xtb3NhaWN8KD86Z298aWNlfHVwKVtcXC4gXT9icm93c2VyKVstXFwvIF0/dj8oW1xcd1xcLl0rKS9pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBQb2xhcmlzL0x5bngvRGlsbG8vaUNhYi9Eb3Jpcy9BbWF5YS93M20vTmV0U3VyZi9TbGVpcG5pci9PYmlnby9Nb3NhaWMvR28vSUNFL1VQLkJyb3dzZXJcbiAgICAgICAgICAgIC8obGlua3MpIFxcKChbXFx3XFwuXSspL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTGlua3NcbiAgICAgICAgICAgIC9wYW5hc29uaWM7KHZpZXJhKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUGFuYXNvbmljIFZpZXJhXG4gICAgICAgICAgICBdLCBbTkFNRSwgVkVSU0lPTl0sIFtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLyhjb2JhbHQpXFwvKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDb2JhbHRcbiAgICAgICAgICAgIF0sIFtOQU1FLCBbVkVSU0lPTiwgL21hc3Rlci58bHRzLi8sIFwiXCJdXVxuICAgICAgICBdLFxuXG4gICAgICAgIGNwdSA6IFtbXG5cbiAgICAgICAgICAgIC8oPzooYW1kfHgoPzooPzo4Nnw2NClbLV9dKT98d293fHdpbik2NClbO1xcKV0vaSAgICAgICAgICAgICAgICAgICAgIC8vIEFNRDY0ICh4NjQpXG4gICAgICAgICAgICBdLCBbW0FSQ0hJVEVDVFVSRSwgJ2FtZDY0J11dLCBbXG5cbiAgICAgICAgICAgIC8oaWEzMig/PTspKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSUEzMiAocXVpY2t0aW1lKVxuICAgICAgICAgICAgXSwgW1tBUkNISVRFQ1RVUkUsIGxvd2VyaXplXV0sIFtcblxuICAgICAgICAgICAgLygoPzppWzM0Nl18eCk4NilbO1xcKV0vaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSUEzMiAoeDg2KVxuICAgICAgICAgICAgXSwgW1tBUkNISVRFQ1RVUkUsICdpYTMyJ11dLCBbXG5cbiAgICAgICAgICAgIC9cXGIoYWFyY2g2NHxhcm0odj84ZT9sP3xfPzY0KSlcXGIvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFSTTY0XG4gICAgICAgICAgICBdLCBbW0FSQ0hJVEVDVFVSRSwgJ2FybTY0J11dLCBbXG5cbiAgICAgICAgICAgIC9cXGIoYXJtKD86dls2N10pP2h0P24/W2ZsXXA/KVxcYi9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBUk1IRlxuICAgICAgICAgICAgXSwgW1tBUkNISVRFQ1RVUkUsICdhcm1oZiddXSwgW1xuXG4gICAgICAgICAgICAvLyBQb2NrZXRQQyBtaXN0YWtlbmx5IGlkZW50aWZpZWQgYXMgUG93ZXJQQ1xuICAgICAgICAgICAgL3dpbmRvd3MgKGNlfG1vYmlsZSk7IHBwYzsvaVxuICAgICAgICAgICAgXSwgW1tBUkNISVRFQ1RVUkUsICdhcm0nXV0sIFtcblxuICAgICAgICAgICAgLygoPzpwcGN8cG93ZXJwYykoPzo2NCk/KSg/OiBtYWN8O3xcXCkpL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUG93ZXJQQ1xuICAgICAgICAgICAgXSwgW1tBUkNISVRFQ1RVUkUsIC9vd2VyLywgRU1QVFksIGxvd2VyaXplXV0sIFtcblxuICAgICAgICAgICAgLyhzdW40XFx3KVs7XFwpXS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNQQVJDXG4gICAgICAgICAgICBdLCBbW0FSQ0hJVEVDVFVSRSwgJ3NwYXJjJ11dLCBbXG5cbiAgICAgICAgICAgIC8oKD86YXZyMzJ8aWE2NCg/PTspKXw2OGsoPz1cXCkpfFxcYmFybSg/PXYoPzpbMS03XXxbNS03XTEpbD98O3xlYWJpKXwoPz1hdG1lbCApYXZyfCg/OmlyaXh8bWlwc3xzcGFyYykoPzo2NCk/XFxifHBhLXJpc2MpL2lcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSUE2NCwgNjhLLCBBUk0vNjQsIEFWUi8zMiwgSVJJWC82NCwgTUlQUy82NCwgU1BBUkMvNjQsIFBBLVJJU0NcbiAgICAgICAgICAgIF0sIFtbQVJDSElURUNUVVJFLCBsb3dlcml6ZV1dXG4gICAgICAgIF0sXG5cbiAgICAgICAgZGV2aWNlIDogW1tcblxuICAgICAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAgICAgICAgIC8vIE1PQklMRVMgJiBUQUJMRVRTXG4gICAgICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgICAgICAgIC8vIFNhbXN1bmdcbiAgICAgICAgICAgIC9cXGIoc2NoLWlbODldMFxcZHxzaHctbTM4MHN8c20tW3B0eF1cXHd7Miw0fXxndC1bcG5dXFxkezIsNH18c2doLXQ4WzU2XTl8bmV4dXMgMTApL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgU0FNU1VOR10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgL1xcYigoPzpzW2NncF1ofGd0fHNtKS1cXHcrfHNjW2ctXT9bXFxkXSthP3xnYWxheHkgbmV4dXMpL2ksXG4gICAgICAgICAgICAvc2Ftc3VuZ1stIF0oWy1cXHddKykvaSxcbiAgICAgICAgICAgIC9zZWMtKHNnaFxcdyspL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgU0FNU1VOR10sIFtUWVBFLCBNT0JJTEVdXSwgW1xuXG4gICAgICAgICAgICAvLyBBcHBsZVxuICAgICAgICAgICAgLyg/OlxcL3xcXCgpKGlwKD86aG9uZXxvZClbXFx3LCBdKikoPzpcXC98OykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaVBvZC9pUGhvbmVcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgQVBQTEVdLCBbVFlQRSwgTU9CSUxFXV0sIFtcbiAgICAgICAgICAgIC9cXCgoaXBhZCk7Wy1cXHdcXCksOyBdK2FwcGxlL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaVBhZFxuICAgICAgICAgICAgL2FwcGxlY29yZW1lZGlhXFwvW1xcd1xcLl0rIFxcKChpcGFkKS9pLFxuICAgICAgICAgICAgL1xcYihpcGFkKVxcZFxcZD8sXFxkXFxkP1s7XFxdXS4raW9zL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgQVBQTEVdLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC8obWFjaW50b3NoKTsvaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBBUFBMRV1dLCBbXG5cbiAgICAgICAgICAgIC8vIFNoYXJwXG4gICAgICAgICAgICAvXFxiKHNoLT9bYWx0dnpdP1xcZFxcZFthLWVrbV0/KS9pXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIFNIQVJQXSwgW1RZUEUsIE1PQklMRV1dLCBbXG5cbiAgICAgICAgICAgIC8vIEh1YXdlaVxuICAgICAgICAgICAgL1xcYigoPzphZ1tyc11bMjNdP3xiYWgyP3xzaHQ/fGJ0diktYT9bbHddXFxkezJ9KVxcYig/IS4rZFxcL3MpL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgSFVBV0VJXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvKD86aHVhd2VpfGhvbm9yKShbLVxcdyBdKylbO1xcKV0vaSxcbiAgICAgICAgICAgIC9cXGIobmV4dXMgNnB8XFx3ezIsNH1lPy1bYXR1XT9bbG5dW1xcZHhdWzAxMjM1OWNdW2Fkbl0/KVxcYig/IS4rZFxcL3MpL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgSFVBV0VJXSwgW1RZUEUsIE1PQklMRV1dLCBbXG5cbiAgICAgICAgICAgIC8vIFhpYW9taVxuICAgICAgICAgICAgL1xcYihwb2NvW1xcdyBdK3xtMlxcZHszfWpcXGRcXGRbYS16XXsyfSkoPzogYnVpfFxcKSkvaSwgICAgICAgICAgICAgICAgICAvLyBYaWFvbWkgUE9DT1xuICAgICAgICAgICAgL1xcYjsgKFxcdyspIGJ1aWxkXFwvaG1cXDEvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gWGlhb21pIEhvbmdtaSAnbnVtZXJpYycgbW9kZWxzXG4gICAgICAgICAgICAvXFxiKGhtWy1fIF0/bm90ZT9bXyBdPyg/OlxcZFxcdyk/KSBidWkvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFhpYW9taSBIb25nbWlcbiAgICAgICAgICAgIC9cXGIocmVkbWlbXFwtXyBdPyg/Om5vdGV8ayk/W1xcd18gXSspKD86IGJ1aXxcXCkpL2ksICAgICAgICAgICAgICAgICAgIC8vIFhpYW9taSBSZWRtaVxuICAgICAgICAgICAgL29pZFteXFwpXSs7IChtP1sxMl1bMC0zODldWzAxXVxcd3szLDZ9W2MteV0pKCBidWl8OyB3dnxcXCkpL2ksICAgICAgICAvLyBYaWFvbWkgUmVkbWkgJ251bWVyaWMnIG1vZGVsc1xuICAgICAgICAgICAgL1xcYihtaVstXyBdPyg/OmFcXGR8b25lfG9uZVtfIF1wbHVzfG5vdGUgbHRlfG1heHxjYyk/W18gXT8oPzpcXGQ/XFx3PylbXyBdPyg/OnBsdXN8c2V8bGl0ZSk/KSg/OiBidWl8XFwpKS9pIC8vIFhpYW9taSBNaVxuICAgICAgICAgICAgXSwgW1tNT0RFTCwgL18vZywgJyAnXSwgW1ZFTkRPUiwgWElBT01JXSwgW1RZUEUsIE1PQklMRV1dLCBbXG4gICAgICAgICAgICAvb2lkW15cXCldKzsgKDJcXGR7NH0oMjgzfHJwYmYpW2NnbF0pKCBidWl8XFwpKS9pLCAgICAgICAgICAgICAgICAgICAgIC8vIFJlZG1pIFBhZFxuICAgICAgICAgICAgL1xcYihtaVstXyBdPyg/OnBhZCkoPzpbXFx3XyBdKykpKD86IGJ1aXxcXCkpL2kgICAgICAgICAgICAgICAgICAgICAgICAvLyBNaSBQYWQgdGFibGV0c1xuICAgICAgICAgICAgXSxbW01PREVMLCAvXy9nLCAnICddLCBbVkVORE9SLCBYSUFPTUldLCBbVFlQRSwgVEFCTEVUXV0sIFtcblxuICAgICAgICAgICAgLy8gT1BQT1xuICAgICAgICAgICAgLzsgKFxcdyspIGJ1aS4rIG9wcG8vaSxcbiAgICAgICAgICAgIC9cXGIoY3BoWzEyXVxcZHszfXxwKD86YWZ8Y1thbF18ZFxcd3xlW2FyXSlbbXRdXFxkMHx4OTAwN3xhMTAxb3ApXFxiL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ09QUE8nXSwgW1RZUEUsIE1PQklMRV1dLCBbXG4gICAgICAgICAgICAvXFxiKG9wZDJcXGR7M31hPykgYnVpL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ09QUE8nXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG5cbiAgICAgICAgICAgIC8vIFZpdm9cbiAgICAgICAgICAgIC92aXZvIChcXHcrKSg/OiBidWl8XFwpKS9pLFxuICAgICAgICAgICAgL1xcYih2WzEyXVxcZHszfVxcdz9bYXRdKSg/OiBidWl8OykvaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnVml2byddLCBbVFlQRSwgTU9CSUxFXV0sIFtcblxuICAgICAgICAgICAgLy8gUmVhbG1lXG4gICAgICAgICAgICAvXFxiKHJteFsxLTNdXFxkezN9KSg/OiBidWl8O3xcXCkpL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ1JlYWxtZSddLCBbVFlQRSwgTU9CSUxFXV0sIFtcblxuICAgICAgICAgICAgLy8gTW90b3JvbGFcbiAgICAgICAgICAgIC9cXGIobWlsZXN0b25lfGRyb2lkKD86WzItNHhdfCAoPzpiaW9uaWN8eDJ8cHJvfHJhenIpKT86PyggNGcpPylcXGJbXFx3IF0rYnVpbGRcXC8vaSxcbiAgICAgICAgICAgIC9cXGJtb3QoPzpvcm9sYSk/Wy0gXShcXHcqKS9pLFxuICAgICAgICAgICAgLygoPzptb3RvW1xcd1xcKFxcKSBdK3x4dFxcZHszLDR9fG5leHVzIDYpKD89IGJ1aXxcXCkpKS9pXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIE1PVE9ST0xBXSwgW1RZUEUsIE1PQklMRV1dLCBbXG4gICAgICAgICAgICAvXFxiKG16NjBcXGR8eG9vbVsyIF17MCwyfSkgYnVpbGRcXC8vaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBNT1RPUk9MQV0sIFtUWVBFLCBUQUJMRVRdXSwgW1xuXG4gICAgICAgICAgICAvLyBMR1xuICAgICAgICAgICAgLygoPz1sZyk/W3ZsXWtcXC0/XFxkezN9KSBidWl8IDNcXC5bLVxcdzsgXXsxMH1sZz8tKFswNmN2OV17Myw0fSkvaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBMR10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgLyhsbSg/Oi0/ZjEwMFtudl0/fC1bXFx3XFwuXSspKD89IGJ1aXxcXCkpfG5leHVzIFs0NV0pL2ksXG4gICAgICAgICAgICAvXFxibGdbLWU7XFwvIF0rKCg/IWJyb3dzZXJ8bmV0Y2FzdHxhbmRyb2lkIHR2KVxcdyspL2ksXG4gICAgICAgICAgICAvXFxibGctPyhbXFxkXFx3XSspIGJ1aS9pXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIExHXSwgW1RZUEUsIE1PQklMRV1dLCBbXG5cbiAgICAgICAgICAgIC8vIExlbm92b1xuICAgICAgICAgICAgLyhpZGVhdGFiWy1cXHcgXSspL2ksXG4gICAgICAgICAgICAvbGVub3ZvID8oc1s1Nl0wMDBbLVxcd10rfHRhYig/OltcXHcgXSspfHl0Wy1cXGRcXHddezZ9fHRiWy1cXGRcXHddezZ9KS9pXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdMZW5vdm8nXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG5cbiAgICAgICAgICAgIC8vIE5va2lhXG4gICAgICAgICAgICAvKD86bWFlbW98bm9raWEpLioobjkwMHxsdW1pYSBcXGQrKS9pLFxuICAgICAgICAgICAgL25va2lhWy1fIF0/KFstXFx3XFwuXSopL2lcbiAgICAgICAgICAgIF0sIFtbTU9ERUwsIC9fL2csICcgJ10sIFtWRU5ET1IsICdOb2tpYSddLCBbVFlQRSwgTU9CSUxFXV0sIFtcblxuICAgICAgICAgICAgLy8gR29vZ2xlXG4gICAgICAgICAgICAvKHBpeGVsIGMpXFxiL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBHb29nbGUgUGl4ZWwgQ1xuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBHT09HTEVdLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC9kcm9pZC4rOyAocGl4ZWxbXFxkYXhsIF17MCw2fSkoPzogYnVpfFxcKSkvaSAgICAgICAgICAgICAgICAgICAgICAgICAvLyBHb29nbGUgUGl4ZWxcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgR09PR0xFXSwgW1RZUEUsIE1PQklMRV1dLCBbXG5cbiAgICAgICAgICAgIC8vIFNvbnlcbiAgICAgICAgICAgIC9kcm9pZC4rIChhP1xcZFswLTJdezJ9c298W2MtZ11cXGR7NH18c29bLWdsXVxcdyt8eHEtYVxcd1s0LTddWzEyXSkoPz0gYnVpfFxcKS4rY2hyb21lXFwvKD8hWzEtNl17MCwxfVxcZFxcLikpL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgU09OWV0sIFtUWVBFLCBNT0JJTEVdXSwgW1xuICAgICAgICAgICAgL3NvbnkgdGFibGV0IFtwc10vaSxcbiAgICAgICAgICAgIC9cXGIoPzpzb255KT9zZ3BcXHcrKD86IGJ1aXxcXCkpL2lcbiAgICAgICAgICAgIF0sIFtbTU9ERUwsICdYcGVyaWEgVGFibGV0J10sIFtWRU5ET1IsIFNPTlldLCBbVFlQRSwgVEFCTEVUXV0sIFtcblxuICAgICAgICAgICAgLy8gT25lUGx1c1xuICAgICAgICAgICAgLyAoa2IyMDA1fGluMjBbMTJdNXxiZTIwWzEyXVs1OV0pXFxiL2ksXG4gICAgICAgICAgICAvKD86b25lKT8oPzpwbHVzKT8gKGFcXGQwXFxkXFxkKSg/OiBifFxcKSkvaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnT25lUGx1cyddLCBbVFlQRSwgTU9CSUxFXV0sIFtcblxuICAgICAgICAgICAgLy8gQW1hem9uXG4gICAgICAgICAgICAvKGFsZXhhKXdlYm0vaSxcbiAgICAgICAgICAgIC8oa2ZbYS16XXsyfXdpfGFlb1tjLXJdezJ9KSggYnVpfFxcKSkvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEtpbmRsZSBGaXJlIHdpdGhvdXQgU2lsayAvIEVjaG8gU2hvd1xuICAgICAgICAgICAgLyhrZlthLXpdKykoIGJ1aXxcXCkpLitzaWxrXFwvL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEtpbmRsZSBGaXJlIEhEXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIEFNQVpPTl0sIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgLygoPzpzZHxrZilbMDM0OWhpam9yc3R1d10rKSggYnVpfFxcKSkuK3NpbGtcXC8vaSAgICAgICAgICAgICAgICAgICAgIC8vIEZpcmUgUGhvbmVcbiAgICAgICAgICAgIF0sIFtbTU9ERUwsIC8oLispL2csICdGaXJlIFBob25lICQxJ10sIFtWRU5ET1IsIEFNQVpPTl0sIFtUWVBFLCBNT0JJTEVdXSwgW1xuXG4gICAgICAgICAgICAvLyBCbGFja0JlcnJ5XG4gICAgICAgICAgICAvKHBsYXlib29rKTtbLVxcd1xcKSw7IF0rKHJpbSkvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQmxhY2tCZXJyeSBQbGF5Qm9va1xuICAgICAgICAgICAgXSwgW01PREVMLCBWRU5ET1IsIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgL1xcYigoPzpiYlthLWZdfHN0W2h2XSkxMDAtXFxkKS9pLFxuICAgICAgICAgICAgL1xcKGJiMTA7IChcXHcrKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEJsYWNrQmVycnkgMTBcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgQkxBQ0tCRVJSWV0sIFtUWVBFLCBNT0JJTEVdXSwgW1xuXG4gICAgICAgICAgICAvLyBBc3VzXG4gICAgICAgICAgICAvKD86XFxifGFzdXNfKSh0cmFuc2ZvW3ByaW1lIF17NCwxMH0gXFx3K3xlZWVwY3xzbGlkZXIgXFx3K3xuZXh1cyA3fHBhZGZvbmV8cDAwW2NqXSkvaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBBU1VTXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvICh6W2Jlc102WzAyN11bMDEyXVtrbV1bbHNdfHplbmZvbmUgXFxkXFx3PylcXGIvaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBBU1VTXSwgW1RZUEUsIE1PQklMRV1dLCBbXG5cbiAgICAgICAgICAgIC8vIEhUQ1xuICAgICAgICAgICAgLyhuZXh1cyA5KS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBIVEMgTmV4dXMgOVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnSFRDJ10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgLyhodGMpWy07XyBdezEsMn0oW1xcdyBdKyg/PVxcKXwgYnVpKXxcXHcrKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAvLyBIVENcblxuICAgICAgICAgICAgLy8gWlRFXG4gICAgICAgICAgICAvKHp0ZSlbLSBdKFtcXHcgXSs/KSg/OiBidWl8XFwvfFxcKSkvaSxcbiAgICAgICAgICAgIC8oYWxjYXRlbHxnZWVrc3Bob25lfG5leGlhbnxwYW5hc29uaWMoPyEoPzo7fFxcLikpfHNvbnkoPyEtYnJhKSlbLV8gXT8oWy1cXHddKikvaSAgICAgICAgIC8vIEFsY2F0ZWwvR2Vla3NQaG9uZS9OZXhpYW4vUGFuYXNvbmljL1NvbnlcbiAgICAgICAgICAgIF0sIFtWRU5ET1IsIFtNT0RFTCwgL18vZywgJyAnXSwgW1RZUEUsIE1PQklMRV1dLCBbXG5cbiAgICAgICAgICAgIC8vIEFjZXJcbiAgICAgICAgICAgIC9kcm9pZC4rOyAoW2FiXVsxLTddLT9bMDE3OGFdXFxkXFxkPykvaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnQWNlciddLCBbVFlQRSwgVEFCTEVUXV0sIFtcblxuICAgICAgICAgICAgLy8gTWVpenVcbiAgICAgICAgICAgIC9kcm9pZC4rOyAobVsxLTVdIG5vdGUpIGJ1aS9pLFxuICAgICAgICAgICAgL1xcYm16LShbLVxcd117Mix9KS9pXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdNZWl6dSddLCBbVFlQRSwgTU9CSUxFXV0sIFtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIFVsZWZvbmVcbiAgICAgICAgICAgIC87ICgoPzpwb3dlciApP2FybW9yKD86W1xcdyBdezAsOH0pKSg/OiBidWl8XFwpKS9pXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdVbGVmb25lJ10sIFtUWVBFLCBNT0JJTEVdXSwgW1xuXG4gICAgICAgICAgICAvLyBNSVhFRFxuICAgICAgICAgICAgLyhibGFja2JlcnJ5fGJlbnF8cGFsbSg/PVxcLSl8c29ueWVyaWNzc29ufGFjZXJ8YXN1c3xkZWxsfG1laXp1fG1vdG9yb2xhfHBvbHl0cm9ufGluZmluaXh8dGVjbm8pWy1fIF0/KFstXFx3XSopL2ksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEJsYWNrQmVycnkvQmVuUS9QYWxtL1NvbnktRXJpY3Nzb24vQWNlci9Bc3VzL0RlbGwvTWVpenUvTW90b3JvbGEvUG9seXRyb25cbiAgICAgICAgICAgIC8oaHApIChbXFx3IF0rXFx3KS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBIUCBpUEFRXG4gICAgICAgICAgICAvKGFzdXMpLT8oXFx3KykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBc3VzXG4gICAgICAgICAgICAvKG1pY3Jvc29mdCk7IChsdW1pYVtcXHcgXSspL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBNaWNyb3NvZnQgTHVtaWFcbiAgICAgICAgICAgIC8obGVub3ZvKVstXyBdPyhbLVxcd10rKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIExlbm92b1xuICAgICAgICAgICAgLyhqb2xsYSkvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBKb2xsYVxuICAgICAgICAgICAgLyhvcHBvKSA/KFtcXHcgXSspIGJ1aS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gT1BQT1xuICAgICAgICAgICAgXSwgW1ZFTkRPUiwgTU9ERUwsIFtUWVBFLCBNT0JJTEVdXSwgW1xuXG4gICAgICAgICAgICAvKGtvYm8pXFxzKGVyZWFkZXJ8dG91Y2gpL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBLb2JvXG4gICAgICAgICAgICAvKGFyY2hvcykgKGdhbWVwYWQyPykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFyY2hvc1xuICAgICAgICAgICAgLyhocCkuKyh0b3VjaHBhZCg/IS4rdGFibGV0KXx0YWJsZXQpL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBIUCBUb3VjaFBhZFxuICAgICAgICAgICAgLyhraW5kbGUpXFwvKFtcXHdcXC5dKykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBLaW5kbGVcbiAgICAgICAgICAgIC8obm9vaylbXFx3IF0rYnVpbGRcXC8oXFx3KykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTm9va1xuICAgICAgICAgICAgLyhkZWxsKSAoc3RyZWFba3ByXFxkIF0qW1xcZGtvXSkvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIERlbGwgU3RyZWFrXG4gICAgICAgICAgICAvKGxlWy0gXStwYW4pWy0gXSsoXFx3ezEsOX0pIGJ1aS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBMZSBQYW4gVGFibGV0c1xuICAgICAgICAgICAgLyh0cmluaXR5KVstIF0qKHRcXGR7M30pIGJ1aS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVHJpbml0eSBUYWJsZXRzXG4gICAgICAgICAgICAvKGdpZ2FzZXQpWy0gXSsocVxcd3sxLDl9KSBidWkvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBHaWdhc2V0IFRhYmxldHNcbiAgICAgICAgICAgIC8odm9kYWZvbmUpIChbXFx3IF0rKSg/OlxcKXwgYnVpKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBWb2RhZm9uZVxuICAgICAgICAgICAgXSwgW1ZFTkRPUiwgTU9ERUwsIFtUWVBFLCBUQUJMRVRdXSwgW1xuXG4gICAgICAgICAgICAvKHN1cmZhY2UgZHVvKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFN1cmZhY2UgRHVvXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIE1JQ1JPU09GVF0sIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgL2Ryb2lkIFtcXGRcXC5dKzsgKGZwXFxkdT8pKD86IGJ8XFwpKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRmFpcnBob25lXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdGYWlycGhvbmUnXSwgW1RZUEUsIE1PQklMRV1dLCBbXG4gICAgICAgICAgICAvKHUzMDRhYSkvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFUJlRcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ0FUJlQnXSwgW1RZUEUsIE1PQklMRV1dLCBbXG4gICAgICAgICAgICAvXFxic2llLShcXHcqKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU2llbWVuc1xuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnU2llbWVucyddLCBbVFlQRSwgTU9CSUxFXV0sIFtcbiAgICAgICAgICAgIC9cXGIocmN0XFx3KykgYi9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBSQ0EgVGFibGV0c1xuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnUkNBJ10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgL1xcYih2ZW51ZVtcXGQgXXsyLDd9KSBiL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIERlbGwgVmVudWUgVGFibGV0c1xuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnRGVsbCddLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC9cXGIocSg/Om12fHRhKVxcdyspIGIvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBWZXJpem9uIFRhYmxldFxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnVmVyaXpvbiddLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC9cXGIoPzpiYXJuZXNbJiBdK25vYmxlIHxibltydF0pKFtcXHdcXCsgXSopIGIvaSAgICAgICAgICAgICAgICAgICAgICAgLy8gQmFybmVzICYgTm9ibGUgVGFibGV0XG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdCYXJuZXMgJiBOb2JsZSddLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC9cXGIodG1cXGR7M31cXHcrKSBiL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ051VmlzaW9uJ10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgL1xcYihrODgpIGIvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gWlRFIEsgU2VyaWVzIFRhYmxldFxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnWlRFJ10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgL1xcYihueFxcZHszfWopIGIvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFpURSBOdWJpYVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnWlRFJ10sIFtUWVBFLCBNT0JJTEVdXSwgW1xuICAgICAgICAgICAgL1xcYihnZW5cXGR7M30pIGIuKzQ5aC9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFN3aXNzIEdFTiBNb2JpbGVcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ1N3aXNzJ10sIFtUWVBFLCBNT0JJTEVdXSwgW1xuICAgICAgICAgICAgL1xcYih6dXJcXGR7M30pIGIvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFN3aXNzIFpVUiBUYWJsZXRcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ1N3aXNzJ10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgL1xcYigoemVraSk/dGIuKlxcYikgYi9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFpla2kgVGFibGV0c1xuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnWmVraSddLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC9cXGIoW3lyXVxcZHsyfSkgYi9pLFxuICAgICAgICAgICAgL1xcYihkcmFnb25bLSBdK3RvdWNoIHxkdCkoXFx3ezV9KSBiL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIERyYWdvbiBUb3VjaCBUYWJsZXRcbiAgICAgICAgICAgIF0sIFtbVkVORE9SLCAnRHJhZ29uIFRvdWNoJ10sIE1PREVMLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC9cXGIobnMtP1xcd3swLDl9KSBiL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBJbnNpZ25pYSBUYWJsZXRzXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdJbnNpZ25pYSddLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC9cXGIoKG54YXxuZXh0KS0/XFx3ezAsOX0pIGIvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBOZXh0Qm9vayBUYWJsZXRzXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdOZXh0Qm9vayddLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC9cXGIoeHRyZW1lXFxfKT8odigxWzA0NV18MlswMTVdfFszNDY5XTB8N1swNV0pKSBiL2kgICAgICAgICAgICAgICAgICAvLyBWb2ljZSBYdHJlbWUgUGhvbmVzXG4gICAgICAgICAgICBdLCBbW1ZFTkRPUiwgJ1ZvaWNlJ10sIE1PREVMLCBbVFlQRSwgTU9CSUxFXV0sIFtcbiAgICAgICAgICAgIC9cXGIobHZ0ZWxcXC0pPyh2MVsxMl0pIGIvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBMdlRlbCBQaG9uZXNcbiAgICAgICAgICAgIF0sIFtbVkVORE9SLCAnTHZUZWwnXSwgTU9ERUwsIFtUWVBFLCBNT0JJTEVdXSwgW1xuICAgICAgICAgICAgL1xcYihwaC0xKSAvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRXNzZW50aWFsIFBILTFcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ0Vzc2VudGlhbCddLCBbVFlQRSwgTU9CSUxFXV0sIFtcbiAgICAgICAgICAgIC9cXGIodigxMDBtZHw3MDBuYXw3MDExfDkxN2cpLipcXGIpIGIvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBFbnZpemVuIFRhYmxldHNcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ0Vudml6ZW4nXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvXFxiKHRyaW9bLVxcd1xcLiBdKykgYi9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1hY2hTcGVlZCBUYWJsZXRzXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdNYWNoU3BlZWQnXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvXFxidHVfKDE0OTEpIGIvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBSb3RvciBUYWJsZXRzXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdSb3RvciddLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC8oc2hpZWxkW1xcdyBdKykgYi9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE52aWRpYSBTaGllbGQgVGFibGV0c1xuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnTnZpZGlhJ10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgLyhzcHJpbnQpIChcXHcrKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU3ByaW50IFBob25lc1xuICAgICAgICAgICAgXSwgW1ZFTkRPUiwgTU9ERUwsIFtUWVBFLCBNT0JJTEVdXSwgW1xuICAgICAgICAgICAgLyhraW5cXC5bb25ldHddezN9KS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTWljcm9zb2Z0IEtpblxuICAgICAgICAgICAgXSwgW1tNT0RFTCwgL1xcLi9nLCAnICddLCBbVkVORE9SLCBNSUNST1NPRlRdLCBbVFlQRSwgTU9CSUxFXV0sIFtcbiAgICAgICAgICAgIC9kcm9pZC4rOyAoY2M2NjY2P3xldDVbMTZdfG1jWzIzOV1bMjNdeD98dmM4WzAzXXg/KVxcKS9pICAgICAgICAgICAgIC8vIFplYnJhXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIFpFQlJBXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvZHJvaWQuKzsgKGVjMzB8cHMyMHx0Y1syLThdXFxkW2t4XSlcXCkvaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBaRUJSQV0sIFtUWVBFLCBNT0JJTEVdXSwgW1xuXG4gICAgICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgICAgICAgICAvLyBTTUFSVFRWU1xuICAgICAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICAgICAgICAvc21hcnQtdHYuKyhzYW1zdW5nKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNhbXN1bmdcbiAgICAgICAgICAgIF0sIFtWRU5ET1IsIFtUWVBFLCBTTUFSVFRWXV0sIFtcbiAgICAgICAgICAgIC9oYmJ0di4rbWFwbGU7KFxcZCspL2lcbiAgICAgICAgICAgIF0sIFtbTU9ERUwsIC9eLywgJ1NtYXJ0VFYnXSwgW1ZFTkRPUiwgU0FNU1VOR10sIFtUWVBFLCBTTUFSVFRWXV0sIFtcbiAgICAgICAgICAgIC8obnV4OyBuZXRjYXN0LitzbWFydHR2fGxnIChuZXRjYXN0XFwudHYtMjAxXFxkfGFuZHJvaWQgdHYpKS9pICAgICAgICAvLyBMRyBTbWFydFRWXG4gICAgICAgICAgICBdLCBbW1ZFTkRPUiwgTEddLCBbVFlQRSwgU01BUlRUVl1dLCBbXG4gICAgICAgICAgICAvKGFwcGxlKSA/dHYvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFwcGxlIFRWXG4gICAgICAgICAgICBdLCBbVkVORE9SLCBbTU9ERUwsIEFQUExFKycgVFYnXSwgW1RZUEUsIFNNQVJUVFZdXSwgW1xuICAgICAgICAgICAgL2Nya2V5L2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBHb29nbGUgQ2hyb21lY2FzdFxuICAgICAgICAgICAgXSwgW1tNT0RFTCwgQ0hST01FKydjYXN0J10sIFtWRU5ET1IsIEdPT0dMRV0sIFtUWVBFLCBTTUFSVFRWXV0sIFtcbiAgICAgICAgICAgIC9kcm9pZC4rYWZ0KFxcdyspKCBidWl8XFwpKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBGaXJlIFRWXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIEFNQVpPTl0sIFtUWVBFLCBTTUFSVFRWXV0sIFtcbiAgICAgICAgICAgIC9cXChkdHZbXFwpO10uKyhhcXVvcykvaSxcbiAgICAgICAgICAgIC8oYXF1b3MtdHZbXFx3IF0rKVxcKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTaGFycFxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBTSEFSUF0sIFtUWVBFLCBTTUFSVFRWXV0sW1xuICAgICAgICAgICAgLyhicmF2aWFbXFx3IF0rKSggYnVpfFxcKSkvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTb255XG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIFNPTlldLCBbVFlQRSwgU01BUlRUVl1dLCBbXG4gICAgICAgICAgICAvKG1pdHYtXFx3ezV9KSBidWkvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBYaWFvbWlcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgWElBT01JXSwgW1RZUEUsIFNNQVJUVFZdXSwgW1xuICAgICAgICAgICAgL0hiYnR2LioodGVjaG5pc2F0KSAoLiopOy9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUZWNobmlTQVRcbiAgICAgICAgICAgIF0sIFtWRU5ET1IsIE1PREVMLCBbVFlQRSwgU01BUlRUVl1dLCBbXG4gICAgICAgICAgICAvXFxiKHJva3UpW1xcZHhdKltcXClcXC9dKCg/OmR2cC0pP1tcXGRcXC5dKikvaSwgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFJva3VcbiAgICAgICAgICAgIC9oYmJ0dlxcL1xcZCtcXC5cXGQrXFwuXFxkKyArXFwoW1xcd1xcKyBdKjsgKihbXFx3XFxkXVteO10qKTsoW147XSopL2kgICAgICAgICAvLyBIYmJUViBkZXZpY2VzXG4gICAgICAgICAgICBdLCBbW1ZFTkRPUiwgdHJpbV0sIFtNT0RFTCwgdHJpbV0sIFtUWVBFLCBTTUFSVFRWXV0sIFtcbiAgICAgICAgICAgIC9cXGIoYW5kcm9pZCB0dnxzbWFydFstIF0/dHZ8b3BlcmEgdHZ8dHY7IHJ2OilcXGIvaSAgICAgICAgICAgICAgICAgICAvLyBTbWFydFRWIGZyb20gVW5pZGVudGlmaWVkIFZlbmRvcnNcbiAgICAgICAgICAgIF0sIFtbVFlQRSwgU01BUlRUVl1dLCBbXG5cbiAgICAgICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAgICAgICAgIC8vIENPTlNPTEVTXG4gICAgICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgICAgICAgIC8ob3V5YSkvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gT3V5YVxuICAgICAgICAgICAgLyhuaW50ZW5kbykgKFt3aWRzM3V0Y2hdKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBOaW50ZW5kb1xuICAgICAgICAgICAgXSwgW1ZFTkRPUiwgTU9ERUwsIFtUWVBFLCBDT05TT0xFXV0sIFtcbiAgICAgICAgICAgIC9kcm9pZC4rOyAoc2hpZWxkKSBidWkvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTnZpZGlhXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdOdmlkaWEnXSwgW1RZUEUsIENPTlNPTEVdXSwgW1xuICAgICAgICAgICAgLyhwbGF5c3RhdGlvbiBbMzQ1cG9ydGFibGV2aV0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBQbGF5c3RhdGlvblxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBTT05ZXSwgW1RZUEUsIENPTlNPTEVdXSwgW1xuICAgICAgICAgICAgL1xcYih4Ym94KD86IG9uZSk/KD8hOyB4Ym94KSlbXFwpOyBdL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1pY3Jvc29mdCBYYm94XG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIE1JQ1JPU09GVF0sIFtUWVBFLCBDT05TT0xFXV0sIFtcblxuICAgICAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgICAgICAgICAgLy8gV0VBUkFCTEVTXG4gICAgICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgICAgICAgIC8oKHBlYmJsZSkpYXBwL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUGViYmxlXG4gICAgICAgICAgICBdLCBbVkVORE9SLCBNT0RFTCwgW1RZUEUsIFdFQVJBQkxFXV0sIFtcbiAgICAgICAgICAgIC8od2F0Y2gpKD86ID9vc1ssXFwvXXxcXGQsXFxkXFwvKVtcXGRcXC5dKy9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQXBwbGUgV2F0Y2hcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgQVBQTEVdLCBbVFlQRSwgV0VBUkFCTEVdXSwgW1xuICAgICAgICAgICAgL2Ryb2lkLis7IChnbGFzcykgXFxkL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gR29vZ2xlIEdsYXNzXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIEdPT0dMRV0sIFtUWVBFLCBXRUFSQUJMRV1dLCBbXG4gICAgICAgICAgICAvZHJvaWQuKzsgKHd0NjM/MHsyLDN9KVxcKS9pXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIFpFQlJBXSwgW1RZUEUsIFdFQVJBQkxFXV0sIFtcbiAgICAgICAgICAgIC8ocXVlc3QoIFxcZHwgcHJvKT8pL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE9jdWx1cyBRdWVzdFxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBGQUNFQk9PS10sIFtUWVBFLCBXRUFSQUJMRV1dLCBbXG5cbiAgICAgICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAgICAgICAgIC8vIEVNQkVEREVEXG4gICAgICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgICAgICAgIC8odGVzbGEpKD86IHF0Y2FyYnJvd3NlcnxcXC9bLVxcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGVzbGFcbiAgICAgICAgICAgIF0sIFtWRU5ET1IsIFtUWVBFLCBFTUJFRERFRF1dLCBbXG4gICAgICAgICAgICAvKGFlb2JjKVxcYi9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBFY2hvIERvdFxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBBTUFaT05dLCBbVFlQRSwgRU1CRURERURdXSwgW1xuXG4gICAgICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgICAgICAgICAgLy8gTUlYRUQgKEdFTkVSSUMpXG4gICAgICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgICAgICAgIC9kcm9pZCAuKz87IChbXjtdKz8pKD86IGJ1aXw7IHd2XFwpfFxcKSBhcHBsZXcpLis/IG1vYmlsZSBzYWZhcmkvaSAgICAvLyBBbmRyb2lkIFBob25lcyBmcm9tIFVuaWRlbnRpZmllZCBWZW5kb3JzXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtUWVBFLCBNT0JJTEVdXSwgW1xuICAgICAgICAgICAgL2Ryb2lkIC4rPzsgKFteO10rPykoPzogYnVpfFxcKSBhcHBsZXcpLis/KD8hIG1vYmlsZSkgc2FmYXJpL2kgICAgICAgLy8gQW5kcm9pZCBUYWJsZXRzIGZyb20gVW5pZGVudGlmaWVkIFZlbmRvcnNcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvXFxiKCh0YWJsZXR8dGFiKVs7XFwvXXxmb2N1c1xcL1xcZCg/IS4rbW9iaWxlKSkvaSAgICAgICAgICAgICAgICAgICAgICAvLyBVbmlkZW50aWZpYWJsZSBUYWJsZXRcbiAgICAgICAgICAgIF0sIFtbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC8ocGhvbmV8bW9iaWxlKD86WztcXC9dfCBbIFxcd1xcL1xcLl0qc2FmYXJpKXxwZGEoPz0uK3dpbmRvd3MgY2UpKS9pICAgIC8vIFVuaWRlbnRpZmlhYmxlIE1vYmlsZVxuICAgICAgICAgICAgXSwgW1tUWVBFLCBNT0JJTEVdXSwgW1xuICAgICAgICAgICAgLyhhbmRyb2lkWy1cXHdcXC4gXXswLDl9KTsuK2J1aWwvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEdlbmVyaWMgQW5kcm9pZCBEZXZpY2VcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ0dlbmVyaWMnXV1cbiAgICAgICAgXSxcblxuICAgICAgICBlbmdpbmUgOiBbW1xuXG4gICAgICAgICAgICAvd2luZG93cy4rIGVkZ2VcXC8oW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRWRnZUhUTUxcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgRURHRSsnSFRNTCddXSwgW1xuXG4gICAgICAgICAgICAvd2Via2l0XFwvNTM3XFwuMzYuK2Nocm9tZVxcLyg/ITI3KShbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQmxpbmtcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgJ0JsaW5rJ11dLCBbXG5cbiAgICAgICAgICAgIC8ocHJlc3RvKVxcLyhbXFx3XFwuXSspL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUHJlc3RvXG4gICAgICAgICAgICAvKHdlYmtpdHx0cmlkZW50fG5ldGZyb250fG5ldHN1cmZ8YW1heWF8bHlueHx3M218Z29hbm5hKVxcLyhbXFx3XFwuXSspL2ksIC8vIFdlYktpdC9UcmlkZW50L05ldEZyb250L05ldFN1cmYvQW1heWEvTHlueC93M20vR29hbm5hXG4gICAgICAgICAgICAvZWtpb2goZmxvdylcXC8oW1xcd1xcLl0rKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZsb3dcbiAgICAgICAgICAgIC8oa2h0bWx8dGFzbWFufGxpbmtzKVtcXC8gXVxcKD8oW1xcd1xcLl0rKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEtIVE1ML1Rhc21hbi9MaW5rc1xuICAgICAgICAgICAgLyhpY2FiKVtcXC8gXShbMjNdXFwuW1xcZFxcLl0rKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaUNhYlxuICAgICAgICAgICAgL1xcYihsaWJ3ZWIpL2lcbiAgICAgICAgICAgIF0sIFtOQU1FLCBWRVJTSU9OXSwgW1xuXG4gICAgICAgICAgICAvcnZcXDooW1xcd1xcLl17MSw5fSlcXGIuKyhnZWNrbykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBHZWNrb1xuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIE5BTUVdXG4gICAgICAgIF0sXG5cbiAgICAgICAgb3MgOiBbW1xuXG4gICAgICAgICAgICAvLyBXaW5kb3dzXG4gICAgICAgICAgICAvbWljcm9zb2Z0ICh3aW5kb3dzKSAodmlzdGF8eHApL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdpbmRvd3MgKGlUdW5lcylcbiAgICAgICAgICAgIF0sIFtOQU1FLCBWRVJTSU9OXSwgW1xuICAgICAgICAgICAgLyh3aW5kb3dzICg/OnBob25lKD86IG9zKT98bW9iaWxlKSlbXFwvIF0/KFtcXGRcXC5cXHcgXSopL2kgICAgICAgICAgICAgLy8gV2luZG93cyBQaG9uZVxuICAgICAgICAgICAgXSwgW05BTUUsIFtWRVJTSU9OLCBzdHJNYXBwZXIsIHdpbmRvd3NWZXJzaW9uTWFwXV0sIFtcbiAgICAgICAgICAgIC93aW5kb3dzIG50IDZcXC4yOyAoYXJtKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBXaW5kb3dzIFJUXG4gICAgICAgICAgICAvd2luZG93c1tcXC8gXT8oW250Y2VcXGRcXC4gXStcXHcpKD8hLit4Ym94KS9pLFxuICAgICAgICAgICAgLyg/Ondpbig/PTN8OXxuKXx3aW4gOXggKShbbnRcXGRcXC5dKykvaVxuICAgICAgICAgICAgXSwgW1tWRVJTSU9OLCBzdHJNYXBwZXIsIHdpbmRvd3NWZXJzaW9uTWFwXSwgW05BTUUsICdXaW5kb3dzJ11dLCBbXG5cbiAgICAgICAgICAgIC8vIGlPUy9tYWNPU1xuICAgICAgICAgICAgL2lwW2hvbmVhZF17Miw0fVxcYig/Oi4qb3MgKFtcXHddKykgbGlrZSBtYWN8OyBvcGVyYSkvaSwgICAgICAgICAgICAgIC8vIGlPU1xuICAgICAgICAgICAgLyg/OmlvcztmYnN2XFwvfGlwaG9uZS4raW9zW1xcLyBdKShbXFxkXFwuXSspL2ksXG4gICAgICAgICAgICAvY2ZuZXR3b3JrXFwvLitkYXJ3aW4vaVxuICAgICAgICAgICAgXSwgW1tWRVJTSU9OLCAvXy9nLCAnLiddLCBbTkFNRSwgJ2lPUyddXSwgW1xuICAgICAgICAgICAgLyhtYWMgb3MgeCkgPyhbXFx3XFwuIF0qKS9pLFxuICAgICAgICAgICAgLyhtYWNpbnRvc2h8bWFjX3Bvd2VycGNcXGIpKD8hLitoYWlrdSkvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTWFjIE9TXG4gICAgICAgICAgICBdLCBbW05BTUUsIE1BQ19PU10sIFtWRVJTSU9OLCAvXy9nLCAnLiddXSwgW1xuXG4gICAgICAgICAgICAvLyBNb2JpbGUgT1Nlc1xuICAgICAgICAgICAgL2Ryb2lkIChbXFx3XFwuXSspXFxiLisoYW5kcm9pZFstIF14ODZ8aGFybW9ueW9zKS9pICAgICAgICAgICAgICAgICAgICAvLyBBbmRyb2lkLXg4Ni9IYXJtb255T1NcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBOQU1FXSwgWyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQW5kcm9pZC9XZWJPUy9RTlgvQmFkYS9SSU0vTWFlbW8vTWVlR28vU2FpbGZpc2ggT1NcbiAgICAgICAgICAgIC8oYW5kcm9pZHx3ZWJvc3xxbnh8YmFkYXxyaW0gdGFibGV0IG9zfG1hZW1vfG1lZWdvfHNhaWxmaXNoKVstXFwvIF0/KFtcXHdcXC5dKikvaSxcbiAgICAgICAgICAgIC8oYmxhY2tiZXJyeSlcXHcqXFwvKFtcXHdcXC5dKikvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEJsYWNrYmVycnlcbiAgICAgICAgICAgIC8odGl6ZW58a2Fpb3MpW1xcLyBdKFtcXHdcXC5dKykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGl6ZW4vS2FpT1NcbiAgICAgICAgICAgIC9cXCgoc2VyaWVzNDApOy9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNlcmllcyA0MFxuICAgICAgICAgICAgXSwgW05BTUUsIFZFUlNJT05dLCBbXG4gICAgICAgICAgICAvXFwoYmIoMTApOy9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBCbGFja0JlcnJ5IDEwXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsIEJMQUNLQkVSUlldXSwgW1xuICAgICAgICAgICAgLyg/OnN5bWJpYW4gP29zfHN5bWJvc3xzNjAoPz07KXxzZXJpZXM2MClbLVxcLyBdPyhbXFx3XFwuXSopL2kgICAgICAgICAvLyBTeW1iaWFuXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsICdTeW1iaWFuJ11dLCBbXG4gICAgICAgICAgICAvbW96aWxsYVxcL1tcXGRcXC5dKyBcXCgoPzptb2JpbGV8dGFibGV0fHR2fG1vYmlsZTsgW1xcdyBdKyk7IHJ2Oi4rIGdlY2tvXFwvKFtcXHdcXC5dKykvaSAvLyBGaXJlZm94IE9TXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsIEZJUkVGT1grJyBPUyddXSwgW1xuICAgICAgICAgICAgL3dlYjBzOy4rcnQodHYpL2ksXG4gICAgICAgICAgICAvXFxiKD86aHApP3dvcyg/OmJyb3dzZXIpP1xcLyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBXZWJPU1xuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCAnd2ViT1MnXV0sIFtcbiAgICAgICAgICAgIC93YXRjaCg/OiA/b3NbLFxcL118XFxkLFxcZFxcLykoW1xcZFxcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gd2F0Y2hPU1xuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCAnd2F0Y2hPUyddXSwgW1xuXG4gICAgICAgICAgICAvLyBHb29nbGUgQ2hyb21lY2FzdFxuICAgICAgICAgICAgL2Nya2V5XFwvKFtcXGRcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBHb29nbGUgQ2hyb21lY2FzdFxuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCBDSFJPTUUrJ2Nhc3QnXV0sIFtcbiAgICAgICAgICAgIC8oY3JvcykgW1xcd10rKD86XFwpfCAoW1xcd1xcLl0rKVxcYikvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDaHJvbWl1bSBPU1xuICAgICAgICAgICAgXSwgW1tOQU1FLCBDSFJPTUlVTV9PU10sIFZFUlNJT05dLFtcblxuICAgICAgICAgICAgLy8gU21hcnQgVFZzXG4gICAgICAgICAgICAvcGFuYXNvbmljOyh2aWVyYSkvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFBhbmFzb25pYyBWaWVyYVxuICAgICAgICAgICAgLyhuZXRyYW5nZSltbWgvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBOZXRyYW5nZVxuICAgICAgICAgICAgLyhuZXR0dilcXC8oXFxkK1xcLltcXHdcXC5dKykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE5ldFRWXG5cbiAgICAgICAgICAgIC8vIENvbnNvbGVcbiAgICAgICAgICAgIC8obmludGVuZG98cGxheXN0YXRpb24pIChbd2lkczM0NXBvcnRhYmxldnVjaF0rKS9pLCAgICAgICAgICAgICAgICAgLy8gTmludGVuZG8vUGxheXN0YXRpb25cbiAgICAgICAgICAgIC8oeGJveCk7ICt4Ym94IChbXlxcKTtdKykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1pY3Jvc29mdCBYYm94ICgzNjAsIE9uZSwgWCwgUywgU2VyaWVzIFgsIFNlcmllcyBTKVxuXG4gICAgICAgICAgICAvLyBPdGhlclxuICAgICAgICAgICAgL1xcYihqb2xpfHBhbG0pXFxiID8oPzpvcyk/XFwvPyhbXFx3XFwuXSopL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEpvbGkvUGFsbVxuICAgICAgICAgICAgLyhtaW50KVtcXC9cXChcXCkgXT8oXFx3KikvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTWludFxuICAgICAgICAgICAgLyhtYWdlaWF8dmVjdG9ybGludXgpWzsgXS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBNYWdlaWEvVmVjdG9yTGludXhcbiAgICAgICAgICAgIC8oW2t4bG5dP3VidW50dXxkZWJpYW58c3VzZXxvcGVuc3VzZXxnZW50b298YXJjaCg/PSBsaW51eCl8c2xhY2t3YXJlfGZlZG9yYXxtYW5kcml2YXxjZW50b3N8cGNsaW51eG9zfHJlZCA/aGF0fHplbndhbGt8bGlucHVzfHJhc3BiaWFufHBsYW4gOXxtaW5peHxyaXNjIG9zfGNvbnRpa2l8ZGVlcGlufG1hbmphcm98ZWxlbWVudGFyeSBvc3xzYWJheW9ufGxpbnNwaXJlKSg/OiBnbnVcXC9saW51eCk/KD86IGVudGVycHJpc2UpPyg/OlstIF1saW51eCk/KD86LWdudSk/Wy1cXC8gXT8oPyFjaHJvbXxwYWNrYWdlKShbLVxcd1xcLl0qKS9pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBVYnVudHUvRGViaWFuL1NVU0UvR2VudG9vL0FyY2gvU2xhY2t3YXJlL0ZlZG9yYS9NYW5kcml2YS9DZW50T1MvUENMaW51eE9TL1JlZEhhdC9aZW53YWxrL0xpbnB1cy9SYXNwYmlhbi9QbGFuOS9NaW5peC9SSVNDT1MvQ29udGlraS9EZWVwaW4vTWFuamFyby9lbGVtZW50YXJ5L1NhYmF5b24vTGluc3BpcmVcbiAgICAgICAgICAgIC8oaHVyZHxsaW51eCkgPyhbXFx3XFwuXSopL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBIdXJkL0xpbnV4XG4gICAgICAgICAgICAvKGdudSkgPyhbXFx3XFwuXSopL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gR05VXG4gICAgICAgICAgICAvXFxiKFstZnJlbnRvcGNnaHNdezAsNX1ic2R8ZHJhZ29uZmx5KVtcXC8gXT8oPyFhbWR8W2l4MzQ2XXsxLDJ9ODYpKFtcXHdcXC5dKikvaSwgLy8gRnJlZUJTRC9OZXRCU0QvT3BlbkJTRC9QQy1CU0QvR2hvc3RCU0QvRHJhZ29uRmx5XG4gICAgICAgICAgICAvKGhhaWt1KSAoXFx3KykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBIYWlrdVxuICAgICAgICAgICAgXSwgW05BTUUsIFZFUlNJT05dLCBbXG4gICAgICAgICAgICAvKHN1bm9zKSA/KFtcXHdcXC5cXGRdKikvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNvbGFyaXNcbiAgICAgICAgICAgIF0sIFtbTkFNRSwgJ1NvbGFyaXMnXSwgVkVSU0lPTl0sIFtcbiAgICAgICAgICAgIC8oKD86b3Blbik/c29sYXJpcylbLVxcLyBdPyhbXFx3XFwuXSopL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU29sYXJpc1xuICAgICAgICAgICAgLyhhaXgpICgoXFxkKSg/PVxcLnxcXCl8IClbXFx3XFwuXSkqL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFJWFxuICAgICAgICAgICAgL1xcYihiZW9zfG9zXFwvMnxhbWlnYW9zfG1vcnBob3N8b3BlbnZtc3xmdWNoc2lhfGhwLXV4fHNlcmVuaXR5b3MpL2ksIC8vIEJlT1MvT1MyL0FtaWdhT1MvTW9ycGhPUy9PcGVuVk1TL0Z1Y2hzaWEvSFAtVVgvU2VyZW5pdHlPU1xuICAgICAgICAgICAgLyh1bml4KSA/KFtcXHdcXC5dKikvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFVOSVhcbiAgICAgICAgICAgIF0sIFtOQU1FLCBWRVJTSU9OXVxuICAgICAgICBdXG4gICAgfTtcblxuICAgIC8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLy8gQ29uc3RydWN0b3JcbiAgICAvLy8vLy8vLy8vLy8vLy8vXG5cbiAgICB2YXIgVUFQYXJzZXIgPSBmdW5jdGlvbiAodWEsIGV4dGVuc2lvbnMpIHtcblxuICAgICAgICBpZiAodHlwZW9mIHVhID09PSBPQkpfVFlQRSkge1xuICAgICAgICAgICAgZXh0ZW5zaW9ucyA9IHVhO1xuICAgICAgICAgICAgdWEgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgVUFQYXJzZXIpKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFVBUGFyc2VyKHVhLCBleHRlbnNpb25zKS5nZXRSZXN1bHQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBfbmF2aWdhdG9yID0gKHR5cGVvZiB3aW5kb3cgIT09IFVOREVGX1RZUEUgJiYgd2luZG93Lm5hdmlnYXRvcikgPyB3aW5kb3cubmF2aWdhdG9yIDogdW5kZWZpbmVkO1xuICAgICAgICB2YXIgX3VhID0gdWEgfHwgKChfbmF2aWdhdG9yICYmIF9uYXZpZ2F0b3IudXNlckFnZW50KSA/IF9uYXZpZ2F0b3IudXNlckFnZW50IDogRU1QVFkpO1xuICAgICAgICB2YXIgX3VhY2ggPSAoX25hdmlnYXRvciAmJiBfbmF2aWdhdG9yLnVzZXJBZ2VudERhdGEpID8gX25hdmlnYXRvci51c2VyQWdlbnREYXRhIDogdW5kZWZpbmVkO1xuICAgICAgICB2YXIgX3JneG1hcCA9IGV4dGVuc2lvbnMgPyBleHRlbmQocmVnZXhlcywgZXh0ZW5zaW9ucykgOiByZWdleGVzO1xuICAgICAgICB2YXIgX2lzU2VsZk5hdiA9IF9uYXZpZ2F0b3IgJiYgX25hdmlnYXRvci51c2VyQWdlbnQgPT0gX3VhO1xuXG4gICAgICAgIHRoaXMuZ2V0QnJvd3NlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBfYnJvd3NlciA9IHt9O1xuICAgICAgICAgICAgX2Jyb3dzZXJbTkFNRV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBfYnJvd3NlcltWRVJTSU9OXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIHJneE1hcHBlci5jYWxsKF9icm93c2VyLCBfdWEsIF9yZ3htYXAuYnJvd3Nlcik7XG4gICAgICAgICAgICBfYnJvd3NlcltNQUpPUl0gPSBtYWpvcml6ZShfYnJvd3NlcltWRVJTSU9OXSk7XG4gICAgICAgICAgICAvLyBCcmF2ZS1zcGVjaWZpYyBkZXRlY3Rpb25cbiAgICAgICAgICAgIGlmIChfaXNTZWxmTmF2ICYmIF9uYXZpZ2F0b3IgJiYgX25hdmlnYXRvci5icmF2ZSAmJiB0eXBlb2YgX25hdmlnYXRvci5icmF2ZS5pc0JyYXZlID09IEZVTkNfVFlQRSkge1xuICAgICAgICAgICAgICAgIF9icm93c2VyW05BTUVdID0gJ0JyYXZlJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBfYnJvd3NlcjtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5nZXRDUFUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgX2NwdSA9IHt9O1xuICAgICAgICAgICAgX2NwdVtBUkNISVRFQ1RVUkVdID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgcmd4TWFwcGVyLmNhbGwoX2NwdSwgX3VhLCBfcmd4bWFwLmNwdSk7XG4gICAgICAgICAgICByZXR1cm4gX2NwdTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5nZXREZXZpY2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgX2RldmljZSA9IHt9O1xuICAgICAgICAgICAgX2RldmljZVtWRU5ET1JdID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgX2RldmljZVtNT0RFTF0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBfZGV2aWNlW1RZUEVdID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgcmd4TWFwcGVyLmNhbGwoX2RldmljZSwgX3VhLCBfcmd4bWFwLmRldmljZSk7XG4gICAgICAgICAgICBpZiAoX2lzU2VsZk5hdiAmJiAhX2RldmljZVtUWVBFXSAmJiBfdWFjaCAmJiBfdWFjaC5tb2JpbGUpIHtcbiAgICAgICAgICAgICAgICBfZGV2aWNlW1RZUEVdID0gTU9CSUxFO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gaVBhZE9TLXNwZWNpZmljIGRldGVjdGlvbjogaWRlbnRpZmllZCBhcyBNYWMsIGJ1dCBoYXMgc29tZSBpT1Mtb25seSBwcm9wZXJ0aWVzXG4gICAgICAgICAgICBpZiAoX2lzU2VsZk5hdiAmJiBfZGV2aWNlW01PREVMXSA9PSAnTWFjaW50b3NoJyAmJiBfbmF2aWdhdG9yICYmIHR5cGVvZiBfbmF2aWdhdG9yLnN0YW5kYWxvbmUgIT09IFVOREVGX1RZUEUgJiYgX25hdmlnYXRvci5tYXhUb3VjaFBvaW50cyAmJiBfbmF2aWdhdG9yLm1heFRvdWNoUG9pbnRzID4gMikge1xuICAgICAgICAgICAgICAgIF9kZXZpY2VbTU9ERUxdID0gJ2lQYWQnO1xuICAgICAgICAgICAgICAgIF9kZXZpY2VbVFlQRV0gPSBUQUJMRVQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gX2RldmljZTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5nZXRFbmdpbmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgX2VuZ2luZSA9IHt9O1xuICAgICAgICAgICAgX2VuZ2luZVtOQU1FXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIF9lbmdpbmVbVkVSU0lPTl0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICByZ3hNYXBwZXIuY2FsbChfZW5naW5lLCBfdWEsIF9yZ3htYXAuZW5naW5lKTtcbiAgICAgICAgICAgIHJldHVybiBfZW5naW5lO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmdldE9TID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIF9vcyA9IHt9O1xuICAgICAgICAgICAgX29zW05BTUVdID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgX29zW1ZFUlNJT05dID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgcmd4TWFwcGVyLmNhbGwoX29zLCBfdWEsIF9yZ3htYXAub3MpO1xuICAgICAgICAgICAgaWYgKF9pc1NlbGZOYXYgJiYgIV9vc1tOQU1FXSAmJiBfdWFjaCAmJiBfdWFjaC5wbGF0Zm9ybSAmJiBfdWFjaC5wbGF0Zm9ybSAhPSAnVW5rbm93bicpIHtcbiAgICAgICAgICAgICAgICBfb3NbTkFNRV0gPSBfdWFjaC5wbGF0Zm9ybSAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvY2hyb21lIG9zL2ksIENIUk9NSVVNX09TKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL21hY29zL2ksIE1BQ19PUyk7ICAgICAgICAgICAvLyBiYWNrd2FyZCBjb21wYXRpYmlsaXR5XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gX29zO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmdldFJlc3VsdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdWEgICAgICA6IHRoaXMuZ2V0VUEoKSxcbiAgICAgICAgICAgICAgICBicm93c2VyIDogdGhpcy5nZXRCcm93c2VyKCksXG4gICAgICAgICAgICAgICAgZW5naW5lICA6IHRoaXMuZ2V0RW5naW5lKCksXG4gICAgICAgICAgICAgICAgb3MgICAgICA6IHRoaXMuZ2V0T1MoKSxcbiAgICAgICAgICAgICAgICBkZXZpY2UgIDogdGhpcy5nZXREZXZpY2UoKSxcbiAgICAgICAgICAgICAgICBjcHUgICAgIDogdGhpcy5nZXRDUFUoKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5nZXRVQSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBfdWE7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuc2V0VUEgPSBmdW5jdGlvbiAodWEpIHtcbiAgICAgICAgICAgIF91YSA9ICh0eXBlb2YgdWEgPT09IFNUUl9UWVBFICYmIHVhLmxlbmd0aCA+IFVBX01BWF9MRU5HVEgpID8gdHJpbSh1YSwgVUFfTUFYX0xFTkdUSCkgOiB1YTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLnNldFVBKF91YSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICBVQVBhcnNlci5WRVJTSU9OID0gTElCVkVSU0lPTjtcbiAgICBVQVBhcnNlci5CUk9XU0VSID0gIGVudW1lcml6ZShbTkFNRSwgVkVSU0lPTiwgTUFKT1JdKTtcbiAgICBVQVBhcnNlci5DUFUgPSBlbnVtZXJpemUoW0FSQ0hJVEVDVFVSRV0pO1xuICAgIFVBUGFyc2VyLkRFVklDRSA9IGVudW1lcml6ZShbTU9ERUwsIFZFTkRPUiwgVFlQRSwgQ09OU09MRSwgTU9CSUxFLCBTTUFSVFRWLCBUQUJMRVQsIFdFQVJBQkxFLCBFTUJFRERFRF0pO1xuICAgIFVBUGFyc2VyLkVOR0lORSA9IFVBUGFyc2VyLk9TID0gZW51bWVyaXplKFtOQU1FLCBWRVJTSU9OXSk7XG5cbiAgICAvLy8vLy8vLy8vL1xuICAgIC8vIEV4cG9ydFxuICAgIC8vLy8vLy8vLy9cblxuICAgIC8vIGNoZWNrIGpzIGVudmlyb25tZW50XG4gICAgaWYgKHR5cGVvZihleHBvcnRzKSAhPT0gVU5ERUZfVFlQRSkge1xuICAgICAgICAvLyBub2RlanMgZW52XG4gICAgICAgIGlmICh0eXBlb2YgbW9kdWxlICE9PSBVTkRFRl9UWVBFICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgICAgICAgICBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBVQVBhcnNlcjtcbiAgICAgICAgfVxuICAgICAgICBleHBvcnRzLlVBUGFyc2VyID0gVUFQYXJzZXI7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gcmVxdWlyZWpzIGVudiAob3B0aW9uYWwpXG4gICAgICAgIGlmICh0eXBlb2YoZGVmaW5lKSA9PT0gRlVOQ19UWVBFICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgICAgIGRlZmluZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFVBUGFyc2VyO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHdpbmRvdyAhPT0gVU5ERUZfVFlQRSkge1xuICAgICAgICAgICAgLy8gYnJvd3NlciBlbnZcbiAgICAgICAgICAgIHdpbmRvdy5VQVBhcnNlciA9IFVBUGFyc2VyO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8galF1ZXJ5L1plcHRvIHNwZWNpZmljIChvcHRpb25hbClcbiAgICAvLyBOb3RlOlxuICAgIC8vICAgSW4gQU1EIGVudiB0aGUgZ2xvYmFsIHNjb3BlIHNob3VsZCBiZSBrZXB0IGNsZWFuLCBidXQgalF1ZXJ5IGlzIGFuIGV4Y2VwdGlvbi5cbiAgICAvLyAgIGpRdWVyeSBhbHdheXMgZXhwb3J0cyB0byBnbG9iYWwgc2NvcGUsIHVubGVzcyBqUXVlcnkubm9Db25mbGljdCh0cnVlKSBpcyB1c2VkLFxuICAgIC8vICAgYW5kIHdlIHNob3VsZCBjYXRjaCB0aGF0LlxuICAgIHZhciAkID0gdHlwZW9mIHdpbmRvdyAhPT0gVU5ERUZfVFlQRSAmJiAod2luZG93LmpRdWVyeSB8fCB3aW5kb3cuWmVwdG8pO1xuICAgIGlmICgkICYmICEkLnVhKSB7XG4gICAgICAgIHZhciBwYXJzZXIgPSBuZXcgVUFQYXJzZXIoKTtcbiAgICAgICAgJC51YSA9IHBhcnNlci5nZXRSZXN1bHQoKTtcbiAgICAgICAgJC51YS5nZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VyLmdldFVBKCk7XG4gICAgICAgIH07XG4gICAgICAgICQudWEuc2V0ID0gZnVuY3Rpb24gKHVhKSB7XG4gICAgICAgICAgICBwYXJzZXIuc2V0VUEodWEpO1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHBhcnNlci5nZXRSZXN1bHQoKTtcbiAgICAgICAgICAgIGZvciAodmFyIHByb3AgaW4gcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgJC51YVtwcm9wXSA9IHJlc3VsdFtwcm9wXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnID8gd2luZG93IDogdGhpcyk7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiX193ZWJwYWNrX3JlcXVpcmVfXy5hbWRPID0ge307IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9pbmRleC50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==