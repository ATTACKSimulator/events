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
        };
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
        return this.remote.post(payload)
            .then(result => this.logger.info(result))
            .finally(() => {
            if (activeEvent.redirectOnFinish && this.shouldRedirect) {
                window.location.href = `${this.redirectUrl}${window.location.search}`;
            }
        });
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
/* UAParser.js v1.0.35
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


    var LIBVERSION  = '1.0.35',
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
        UA_MAX_LENGTH = 350;

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
        VIERA   = 'Viera',
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
            /\bopr\/([\w\.]+)/i                                                 // Opera Webkit
            ], [VERSION, [NAME, OPERA]], [

            // Mixed
            /(kindle)\/([\w\.]+)/i,                                             // Kindle
            /(lunascape|maxthon|netfront|jasmine|blazer)[\/ ]?([\w\.]*)/i,      // Lunascape/Maxthon/Netfront/Jasmine/Blazer
            // Trident based
            /(avant |iemobile|slim)(?:browser)?[\/ ]?([\w\.]*)/i,               // Avant/IEMobile/SlimBrowser
            /(ba?idubrowser)[\/ ]?([\w\.]+)/i,                                  // Baidu Browser
            /(?:ms|\()(ie) ([\w\.]+)/i,                                         // Internet Explorer

            // Webkit/KHTML based                                               // Flock/RockMelt/Midori/Epiphany/Silk/Skyfire/Bolt/Iron/Iridium/PhantomJS/Bowser/QupZilla/Falkon
            /(flock|rockmelt|midori|epiphany|silk|skyfire|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon|rekonq|puffin|brave|whale(?!.+naver)|qqbrowserlite|qq|duckduckgo)\/([-\w\.]+)/i,
                                                                                // Rekonq/Puffin/Brave/Whale/QQBrowserLite/QQ, aka ShouQ
            /(heytap|ovi)browser\/([\d\.]+)/i,                                  // Heytap/Ovi
            /(weibo)__([\d\.]+)/i                                               // Weibo
            ], [NAME, VERSION], [
            /(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i                 // UCBrowser
            ], [VERSION, [NAME, 'UC'+BROWSER]], [
            /microm.+\bqbcore\/([\w\.]+)/i,                                     // WeChat Desktop for Windows Built-in Browser
            /\bqbcore\/([\w\.]+).+microm/i
            ], [VERSION, [NAME, 'WeChat(Win) Desktop']], [
            /micromessenger\/([\w\.]+)/i                                        // WeChat
            ], [VERSION, [NAME, 'WeChat']], [
            /konqueror\/([\w\.]+)/i                                             // Konqueror
            ], [VERSION, [NAME, 'Konqueror']], [
            /trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i                       // IE11
            ], [VERSION, [NAME, 'IE']], [
            /ya(?:search)?browser\/([\w\.]+)/i                                  // Yandex
            ], [VERSION, [NAME, 'Yandex']], [
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
            ], [[NAME, '360 '+BROWSER]], [
            /(oculus|samsung|sailfish|huawei)browser\/([\w\.]+)/i
            ], [[NAME, /(.+)/, '$1 '+BROWSER], VERSION], [                      // Oculus/Samsung/Sailfish/Huawei Browser
            /(comodo_dragon)\/([\w\.]+)/i                                       // Comodo Dragon
            ], [[NAME, /_/g, ' '], VERSION], [
            /(electron)\/([\w\.]+) safari/i,                                    // Electron-based App
            /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i,                   // Tesla
            /m?(qqbrowser|baiduboxapp|2345Explorer)[\/ ]?([\w\.]+)/i            // QQBrowser/Baidu App/2345 Browser
            ], [NAME, VERSION], [
            /(metasr)[\/ ]?([\w\.]+)/i,                                         // SouGouBrowser
            /(lbbrowser)/i,                                                     // LieBao Browser
            /\[(linkedin)app\]/i                                                // LinkedIn App for iOS & Android
            ], [NAME], [

            // WebView
            /((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i       // Facebook App for iOS & Android
            ], [[NAME, FACEBOOK], VERSION], [
            /(kakao(?:talk|story))[\/ ]([\w\.]+)/i,                             // Kakao App
            /(naver)\(.*?(\d+\.[\w\.]+).*\)/i,                                  // Naver InApp
            /safari (line)\/([\w\.]+)/i,                                        // Line App for iOS
            /\b(line)\/([\w\.]+)\/iab/i,                                        // Line App for Android
            /(chromium|instagram)[\/ ]([-\w\.]+)/i                              // Chromium/Instagram
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
            /\b(poco[\w ]+)(?: bui|\))/i,                                       // Xiaomi POCO
            /\b; (\w+) build\/hm\1/i,                                           // Xiaomi Hongmi 'numeric' models
            /\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i,                             // Xiaomi Hongmi
            /\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i,                   // Xiaomi Redmi
            /\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max|cc)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite)?)(?: bui|\))/i // Xiaomi Mi
            ], [[MODEL, /_/g, ' '], [VENDOR, XIAOMI], [TYPE, MOBILE]], [
            /\b(mi[-_ ]?(?:pad)(?:[\w_ ]+))(?: bui|\))/i                        // Mi Pad tablets
            ],[[MODEL, /_/g, ' '], [VENDOR, XIAOMI], [TYPE, TABLET]], [

            // OPPO
            /; (\w+) bui.+ oppo/i,
            /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i
            ], [MODEL, [VENDOR, 'OPPO'], [TYPE, MOBILE]], [

            // Vivo
            /vivo (\w+)(?: bui|\))/i,
            /\b(v[12]\d{3}\w?[at])(?: bui|;)/i
            ], [MODEL, [VENDOR, 'Vivo'], [TYPE, MOBILE]], [

            // Realme
            /\b(rmx[12]\d{3})(?: bui|;|\))/i
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

            // MIXED
            /(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[-_ ]?([-\w]*)/i,
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
            /droid.+aft(\w)( bui|\))/i                                          // Fire TV
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
            /(quest( 2| pro)?)/i                                                // Oculus Quest
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

            /droid .+?; ([^;]+?)(?: bui|\) applew).+? mobile safari/i           // Android Phones from Unidentified Vendors
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
            /(windows) nt 6\.2; (arm)/i,                                        // Windows RT
            /(windows (?:phone(?: os)?|mobile))[\/ ]?([\d\.\w ]*)/i,            // Windows Phone
            /(windows)[\/ ]?([ntce\d\. ]+\w)(?!.+xbox)/i
            ], [NAME, [VERSION, strMapper, windowsVersionMap]], [
            /(win(?=3|9|n)|win 9x )([nt\d\.]+)/i
            ], [[NAME, 'Windows'], [VERSION, strMapper, windowsVersionMap]], [

            // iOS/macOS
            /ip[honead]{2,4}\b(?:.*os ([\w]+) like mac|; opera)/i,              // iOS
            /ios;fbsv\/([\d\.]+)/i,
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
            if (_isSelfNav && !_os[NAME] && _uach && _uach.platform != 'Unknown') {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7Ozs7O1VFQUE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9BVFNFdmVudHMvLi9pbmRleC50cyIsIndlYnBhY2s6Ly9BVFNFdmVudHMvLi9zcmMvQnJvd3NlckluZm8udHMiLCJ3ZWJwYWNrOi8vQVRTRXZlbnRzLy4vc3JjL0NhbXBhaWduSW5mby50cyIsIndlYnBhY2s6Ly9BVFNFdmVudHMvLi9zcmMvTG9nZ2VyLnRzIiwid2VicGFjazovL0FUU0V2ZW50cy8uL3NyYy9NYW5hZ2VyLnRzIiwid2VicGFjazovL0FUU0V2ZW50cy8uL3NyYy9SZW1vdGUudHMiLCJ3ZWJwYWNrOi8vQVRTRXZlbnRzLy4vc3JjL1Rvb2xzLnRzIiwid2VicGFjazovL0FUU0V2ZW50cy8uL3NyYy9VcmxQYXJzZXIudHMiLCJ3ZWJwYWNrOi8vQVRTRXZlbnRzLy4vc3JjL2V2ZW50cy9BVFNFdmVudC50cyIsIndlYnBhY2s6Ly9BVFNFdmVudHMvLi9zcmMvZXZlbnRzL0F0dGFjaG1lbnRPcGVuLnRzIiwid2VicGFjazovL0FUU0V2ZW50cy8uL3NyYy9ldmVudHMvQ2xpY2sudHMiLCJ3ZWJwYWNrOi8vQVRTRXZlbnRzLy4vc3JjL2V2ZW50cy9Eb3dubG9hZC50cyIsIndlYnBhY2s6Ly9BVFNFdmVudHMvLi9zcmMvZXZlbnRzL0V4dGVuc2lvbi50cyIsIndlYnBhY2s6Ly9BVFNFdmVudHMvLi9zcmMvZXZlbnRzL0ZpbGVEb3dubG9hZC50cyIsIndlYnBhY2s6Ly9BVFNFdmVudHMvLi9zcmMvZXZlbnRzL0ZpbGVPcGVuLnRzIiwid2VicGFjazovL0FUU0V2ZW50cy8uL3NyYy9ldmVudHMvSW5wdXQudHMiLCJ3ZWJwYWNrOi8vQVRTRXZlbnRzLy4vc3JjL2V2ZW50cy9Mb2NhdGlvbi50cyIsIndlYnBhY2s6Ly9BVFNFdmVudHMvLi9zcmMvZXZlbnRzL01pY3JvcGhvbmUudHMiLCJ3ZWJwYWNrOi8vQVRTRXZlbnRzLy4vc3JjL2V2ZW50cy9Ob3RpZmljYXRpb24udHMiLCJ3ZWJwYWNrOi8vQVRTRXZlbnRzLy4vc3JjL2V2ZW50cy9QYWdlTGVmdC50cyIsIndlYnBhY2s6Ly9BVFNFdmVudHMvLi9zcmMvZXZlbnRzL1BhZ2VMb2FkZWQudHMiLCJ3ZWJwYWNrOi8vQVRTRXZlbnRzLy4vc3JjL2V2ZW50cy9QYWdlUmVhZC50cyIsIndlYnBhY2s6Ly9BVFNFdmVudHMvLi9zcmMvZXZlbnRzL1N1Ym1pdC50cyIsIndlYnBhY2s6Ly9BVFNFdmVudHMvLi9zcmMvZXZlbnRzL1dlYmNhbS50cyIsIndlYnBhY2s6Ly9BVFNFdmVudHMvLi9ub2RlX21vZHVsZXMvdWEtcGFyc2VyLWpzL3NyYy91YS1wYXJzZXIuanMiLCJ3ZWJwYWNrOi8vQVRTRXZlbnRzL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL0FUU0V2ZW50cy93ZWJwYWNrL3J1bnRpbWUvYW1kIG9wdGlvbnMiLCJ3ZWJwYWNrOi8vQVRTRXZlbnRzL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vQVRTRXZlbnRzL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9BVFNFdmVudHMvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1hbmFnZXIgfSBmcm9tIFwiLi9zcmMvTWFuYWdlclwiO1xuaW1wb3J0IFJlbW90ZSBmcm9tIFwiLi9zcmMvUmVtb3RlXCI7XG5pbXBvcnQge3JlbW92ZVN1YmRvbWFpbn0gZnJvbSBcIi4vc3JjL1Rvb2xzXCI7XG5cbmludGVyZmFjZSBPcHRpb25zIHtcblx0YXBpS2V5Pzogc3RyaW5nLFxuXHRkZWJ1Zz86IGJvb2xlYW4sXG5cdGV2ZW50cz86IHN0cmluZ1tdXG5cdHJlZGlyZWN0VXJsOiBzdHJpbmcsXG5cdHNob3VsZFJlZGlyZWN0OiBib29sZWFuLFxuXHRzb3VyY2U6IHN0cmluZyxcblx0dXJsOiBzdHJpbmcsXG59XG5cbmNvbnN0IGRlZmF1bHRPcHRpb25zOiBPcHRpb25zID0ge1xuXHRldmVudHM6IFtdLFxuXHRkZWJ1ZzogZmFsc2UsXG5cdHNob3VsZFJlZGlyZWN0OiB0cnVlLFxuXHRyZWRpcmVjdFVybDogYGh0dHBzOi8vb29wcy4ke3JlbW92ZVN1YmRvbWFpbih3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUpfWAsXG5cdHNvdXJjZTogXCJMUFwiLFxuXHR1cmw6IFwiaHR0cHM6Ly9hcGkuYXR0YWNrc2ltdWxhdG9yLmNvbS92MC9jbGllbnQtZXZlbnRzXCIsXG59O1xuXG5jbGFzcyBBVFNFdmVudHMge1xuXHRwcml2YXRlIG1hbmFnZXI6IE1hbmFnZXI7XG5cblx0Y29uc3RydWN0b3Iob3B0aW9uczogT3B0aW9ucykge1xuXHRcdGNvbnN0IF9vcHRpb25zID0gey4uLmRlZmF1bHRPcHRpb25zLCAuLi5vcHRpb25zfTtcblx0XHRpZiAoX29wdGlvbnMuZGVidWcpIHtcblx0XHRcdGNvbnNvbGUubG9nKF9vcHRpb25zKTtcblx0XHR9XG5cdFx0Y29uc3QgcmVtb3RlID0gbmV3IFJlbW90ZShfb3B0aW9ucy5hcGlLZXksIF9vcHRpb25zLnVybCwgX29wdGlvbnMuZGVidWcpO1xuXHRcdHRoaXMubWFuYWdlciA9IG5ldyBNYW5hZ2VyKHJlbW90ZSwgX29wdGlvbnMuZXZlbnRzLCBfb3B0aW9ucy5zb3VyY2UsIF9vcHRpb25zLnJlZGlyZWN0VXJsLCBfb3B0aW9ucy5zaG91bGRSZWRpcmVjdCwgX29wdGlvbnMuZGVidWcpO1xuXHR9XG5cblx0bGlzdGVuKCkge1xuXHRcdHRoaXMubWFuYWdlci5saXN0ZW4oKTtcblx0fVxuXG5cdHN0b3AoKSB7XG5cdFx0dGhpcy5tYW5hZ2VyLnN0b3AoKTtcblx0fVxuXG5cdHRyaWdnZXIobmFtZTogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG5cdFx0cmV0dXJuIHRoaXMubWFuYWdlci50cmlnZ2VyKG5hbWUpO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQVRTRXZlbnRzO1xuIiwiaW1wb3J0IHBhcnNlciBmcm9tIFwidWEtcGFyc2VyLWpzXCI7XG5cbmludGVyZmFjZSBTY3JlZW5TaXplIHtcbiAgICB3aWR0aCA/OiBudW1iZXJcbiAgICBoZWlnaHQgPzogbnVtYmVyXG59XG5cbmludGVyZmFjZSBCcm93c2VyIHtcbiAgICBuYW1lID86IHN0cmluZ1xuICAgIHZlcnNpb24gPzogc3RyaW5nXG4gICAgbWFqb3JfdmVyc2lvbiA/OiBudW1iZXJcbiAgICBtb2JpbGUgPzogYm9vbGVhblxufVxuXG5pbnRlcmZhY2UgT1Mge1xuICAgIG5hbWUgPzogc3RyaW5nXG4gICAgdmVyc2lvbiA/OiBzdHJpbmdcbn1cblxuaW50ZXJmYWNlIERldmljZSB7XG4gICAgbW9kZWw/OiBzdHJpbmdcbiAgICB0eXBlPzogc3RyaW5nXG4gICAgdmVuZG9yPzogc3RyaW5nXG59XG5pbnRlcmZhY2UgQ3B1IHtcbiAgICBhcmNoaXRlY3R1cmUgPzpzdHJpbmdcbn1cbmV4cG9ydCBpbnRlcmZhY2UgQnJvd3NlckluZm8ge1xuICAgIHVhOiBzdHJpbmc7XG4gICAgc2NyZWVuX3NpemU6IFNjcmVlblNpemU7XG4gICAgYnJvd3NlcjogQnJvd3NlcjtcbiAgICBvczogT1M7XG4gICAgZGV2aWNlOiBEZXZpY2U7XG4gICAgY3B1OiBDcHU7XG59XG5cbmZ1bmN0aW9uIGZpbmRCcm93c2VyKCk6IEJyb3dzZXIge1xuXHRsZXQgdmVyT2Zmc2V0OiBudW1iZXI7XG5cdGNvbnN0IGJyb3dzZXI6IEJyb3dzZXIgPSB7fTtcblx0Y29uc3QgdXNlckFnZW50ID0gbmF2aWdhdG9yLnVzZXJBZ2VudDtcblxuXHQvLyBPcGVyYVxuXHRpZiAoKHZlck9mZnNldCA9IHVzZXJBZ2VudC5pbmRleE9mKFwiT3BlcmFcIikpICE9PSAtMSkge1xuXHRcdGJyb3dzZXIubmFtZSA9IFwiT3BlcmFcIjtcblx0XHRicm93c2VyLnZlcnNpb24gPSB1c2VyQWdlbnQuc3Vic3RyaW5nKHZlck9mZnNldCArIDYpO1xuXHRcdGlmICgodmVyT2Zmc2V0ID0gdXNlckFnZW50LmluZGV4T2YoXCJWZXJzaW9uXCIpKSAhPT0gLTEpIHtcblx0XHRcdGJyb3dzZXIudmVyc2lvbiA9IHVzZXJBZ2VudC5zdWJzdHJpbmcodmVyT2Zmc2V0ICsgOCk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gT3BlcmEgTmV4dFxuXHRlbHNlIGlmICgodmVyT2Zmc2V0ID0gdXNlckFnZW50LmluZGV4T2YoXCJPUFJcIikpICE9PSAtMSkge1xuXHRcdGJyb3dzZXIubmFtZSA9IFwiT3BlcmFcIjtcblx0XHRicm93c2VyLnZlcnNpb24gPSB1c2VyQWdlbnQuc3Vic3RyaW5nKHZlck9mZnNldCArIDUpO1xuXHR9XG5cblx0Ly8gRWRnZVxuXHRlbHNlIGlmICgodmVyT2Zmc2V0ID0gdXNlckFnZW50LmluZGV4T2YoXCJFZGdlXCIpKSAhPT0gLTEpIHtcblx0XHRicm93c2VyLm5hbWUgPSBcIk1pY3Jvc29mdCBFZGdlXCI7XG5cdFx0YnJvd3Nlci52ZXJzaW9uID0gdXNlckFnZW50LnN1YnN0cmluZyh2ZXJPZmZzZXQgKyA1KTtcblx0fVxuXG5cdC8vIE1TSUVcblx0ZWxzZSBpZiAoKHZlck9mZnNldCA9IHVzZXJBZ2VudC5pbmRleE9mKFwiTVNJRVwiKSkgIT09IC0xKSB7XG5cdFx0YnJvd3Nlci5uYW1lID0gXCJNaWNyb3NvZnQgSW50ZXJuZXQgRXhwbG9yZXJcIjtcblx0XHRicm93c2VyLnZlcnNpb24gPSB1c2VyQWdlbnQuc3Vic3RyaW5nKHZlck9mZnNldCArIDUpO1xuXHR9XG5cblx0Ly8gQ2hyb21lXG5cdGVsc2UgaWYgKCh2ZXJPZmZzZXQgPSB1c2VyQWdlbnQuaW5kZXhPZihcIkNocm9tZVwiKSkgIT09IC0xKSB7XG5cdFx0YnJvd3Nlci5uYW1lID0gXCJDaHJvbWVcIjtcblx0XHRicm93c2VyLnZlcnNpb24gPSB1c2VyQWdlbnQuc3Vic3RyaW5nKHZlck9mZnNldCArIDcpO1xuXHR9XG5cblx0Ly8gU2FmYXJpXG5cdGVsc2UgaWYgKCh2ZXJPZmZzZXQgPSB1c2VyQWdlbnQuaW5kZXhPZihcIlNhZmFyaVwiKSkgIT09IC0xKSB7XG5cdFx0YnJvd3Nlci5uYW1lID0gXCJTYWZhcmlcIjtcblx0XHRicm93c2VyLnZlcnNpb24gPSB1c2VyQWdlbnQuc3Vic3RyaW5nKHZlck9mZnNldCArIDcpO1xuXHRcdGlmICgodmVyT2Zmc2V0ID0gdXNlckFnZW50LmluZGV4T2YoXCJWZXJzaW9uXCIpKSAhPT0gLTEpIHtcblx0XHRcdGJyb3dzZXIudmVyc2lvbiA9IHVzZXJBZ2VudC5zdWJzdHJpbmcodmVyT2Zmc2V0ICsgOCk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gRmlyZWZveFxuXHRlbHNlIGlmICgodmVyT2Zmc2V0ID0gdXNlckFnZW50LmluZGV4T2YoXCJGaXJlZm94XCIpKSAhPT0gLTEpIHtcblx0XHRicm93c2VyLm5hbWUgPSBcIkZpcmVmb3hcIjtcblx0XHRicm93c2VyLnZlcnNpb24gPSB1c2VyQWdlbnQuc3Vic3RyaW5nKHZlck9mZnNldCArIDgpO1xuXHR9XG5cblx0Ly8gTVNJRSAxMStcblx0ZWxzZSBpZiAodXNlckFnZW50LmluZGV4T2YoXCJUcmlkZW50L1wiKSAhPT0gLTEpIHtcblx0XHRicm93c2VyLm5hbWUgPSBcIk1pY3Jvc29mdCBJbnRlcm5ldCBFeHBsb3JlclwiO1xuXHRcdGJyb3dzZXIudmVyc2lvbiA9IHVzZXJBZ2VudC5zdWJzdHJpbmcodXNlckFnZW50LmluZGV4T2YoXCJydjpcIikgKyAzKTtcblx0fVxuXG5cdGJyb3dzZXIubW9iaWxlID0gL01vYmlsZXxtaW5pfEZlbm5lY3xBbmRyb2lkfGlQKGFkfG9kfGhvbmUpLy50ZXN0KHVzZXJBZ2VudCk7XG5cblx0Ly8gdHJpbSB0aGUgdmVyc2lvbiBzdHJpbmdcblx0bGV0IGl4O1xuXHRpZiAoKGl4ID0gYnJvd3Nlci52ZXJzaW9uLmluZGV4T2YoXCI7XCIpKSAhPSAtMSkgYnJvd3Nlci52ZXJzaW9uID0gYnJvd3Nlci52ZXJzaW9uLnN1YnN0cmluZygwLCBpeCk7XG5cdGlmICgoaXggPSBicm93c2VyLnZlcnNpb24uaW5kZXhPZihcIiBcIikpICE9IC0xKSBicm93c2VyLnZlcnNpb24gPSBicm93c2VyLnZlcnNpb24uc3Vic3RyaW5nKDAsIGl4KTtcblx0aWYgKChpeCA9IGJyb3dzZXIudmVyc2lvbi5pbmRleE9mKFwiKVwiKSkgIT0gLTEpIGJyb3dzZXIudmVyc2lvbiA9IGJyb3dzZXIudmVyc2lvbi5zdWJzdHJpbmcoMCwgaXgpO1xuXG5cdGJyb3dzZXIubWFqb3JfdmVyc2lvbiA9IHBhcnNlSW50KFwiXCIgKyBicm93c2VyLnZlcnNpb24sIDEwKTtcblx0aWYgKGlzTmFOKCBicm93c2VyLm1ham9yX3ZlcnNpb24pKSB7XG5cdFx0YnJvd3Nlci52ZXJzaW9uID0gXCJcIiArIHBhcnNlRmxvYXQobmF2aWdhdG9yLmFwcFZlcnNpb24pO1xuXHRcdGJyb3dzZXIubWFqb3JfdmVyc2lvbiA9IHBhcnNlSW50KG5hdmlnYXRvci5hcHBWZXJzaW9uLCAxMCk7XG5cdH1cbiAgICBcblx0cmV0dXJuIGJyb3dzZXI7XG59XG5cbmZ1bmN0aW9uIGZpbmRPcGVyYXRpbmdTeXN0ZW0ocGFyc2VyOiBhbnkpOiBPUyB7XG5cdGNvbnN0IHtuYW1lLCB2ZXJzaW9ufSA9IHBhcnNlci5nZXRPUygpO1xuXHRyZXR1cm4geyBuYW1lLCB2ZXJzaW9ufTtcbn1cblxuZnVuY3Rpb24gZmluZERldmljZShwYXJzZXI6IGFueSk6IERldmljZSB7XG5cdGNvbnN0IHttb2RlbCwgdHlwZSwgdmVuZG9yfSA9IHBhcnNlci5nZXREZXZpY2UoKTtcblx0cmV0dXJuIHttb2RlbCwgdHlwZSwgdmVuZG9yfTtcbn1cblxuZnVuY3Rpb24gZmluZENwdShwYXJzZXI6IGFueSk6IENwdSB7XG5cdGNvbnN0IHthcmNoaXRlY3R1cmV9ID0gcGFyc2VyLmdldENQVSgpO1xuXHRyZXR1cm4ge2FyY2hpdGVjdHVyZX07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaW5kQnJvd3NlckluZm8oKTogQnJvd3NlckluZm8ge1xuXHRjb25zdCB1YSA9IG5ldyBwYXJzZXIoKTtcblx0cmV0dXJuIHtcblx0XHR1YTogd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQsXG5cdFx0c2NyZWVuX3NpemU6IHtcblx0XHRcdHdpZHRoOiBzY3JlZW4ud2lkdGggfHwgMCxcblx0XHRcdGhlaWdodDogc2NyZWVuLmhlaWdodCB8fCAwXG5cdFx0fSxcblx0XHRicm93c2VyOiBmaW5kQnJvd3NlcigpLFxuXHRcdG9zOiBmaW5kT3BlcmF0aW5nU3lzdGVtKHVhKSxcblx0XHRkZXZpY2U6IGZpbmREZXZpY2UodWEpLFxuXHRcdGNwdTogZmluZENwdSh1YSlcblx0fTtcbn0iLCJpbXBvcnQgeyBVcmxQYXJzZXIgfSBmcm9tIFwiLi9VcmxQYXJzZXJcIjtcblxuZXhwb3J0IGludGVyZmFjZSBDYW1wYWlnbkluZm8ge1xuICAgIGF0c19lbnYgPzogc3RyaW5nXG4gICAgYXRzX2F0a190eXBlID86IHN0cmluZ1xuICAgIGF0c19jYW1wYWlnbl9uYW1lID86IHN0cmluZ1xuICAgIGF0c19jb21wYW55X2lkID86IHN0cmluZ1xuICAgIGF0c19pbnN0YW5jZV9pZCA/OiBzdHJpbmdcbiAgICBhdHNfbG9jYWxlID86IHN0cmluZ1xuICAgIGF0c19wcm9jZXNzZWRfZGF0ZSA/OiBzdHJpbmdcbiAgICBhdHNfdXNlcl9pZCA/OiBzdHJpbmdcblx0ZG93bmxvYWRfdHlwZSA/OiBzdHJpbmdcbn1cblxuZnVuY3Rpb24gcmVhZFRva2VuU3RyaW5nKHRva2VuU3RyaW5nID86IHN0cmluZywgZmlsZVR5cGUgPzogc3RyaW5nKTogQ2FtcGFpZ25JbmZvIHtcblx0Y29uc3QgYmFzZTY0VXJsID0gdG9rZW5TdHJpbmcuc3BsaXQoXCIuXCIpWzFdO1xuXHRjb25zdCBiYXNlNjQgPSAgYmFzZTY0VXJsLnJlcGxhY2UoLy0vZywgXCIrXCIpLnJlcGxhY2UoL18vZywgXCIvXCIpO1xuXHRjb25zdCBjYW1wYWlnbkluZm8gPSBKU09OLnBhcnNlKHdpbmRvdy5hdG9iKGJhc2U2NCkpLnBheWxvYWQgYXMgQ2FtcGFpZ25JbmZvO1xuXG5cdGlmIChmaWxlVHlwZSA9PT0gXCJhdHRhY2htZW50XCIpIHtcblx0XHRjYW1wYWlnbkluZm8uZG93bmxvYWRfdHlwZSA9IFwiYXR0YWNobWVudFwiO1xuXHR9IGVsc2UgaWYgKGZpbGVUeXBlICE9PSBudWxsKSB7XG5cdFx0Y2FtcGFpZ25JbmZvLmRvd25sb2FkX3R5cGUgPSBcImZpbGVcIjtcblx0fVxuXG5cdHJldHVybiBjYW1wYWlnbkluZm87XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaW5kQ2FtcGFpZ25JbmZvKCkgOiBbc3RyaW5nLCBDYW1wYWlnbkluZm9dIHtcblx0Y29uc3QgdXJsID0gbmV3IFVybFBhcnNlcih3aW5kb3cubG9jYXRpb24uaHJlZik7XG5cdGNvbnN0IHRva2VuU3RyaW5nID0gdXJsLmZpbmRQYXJhbShcInRrXCIpO1xuXHRpZiAoIXRva2VuU3RyaW5nKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiTWlzc2luZyBBVFRBQ0sgU2ltdWxhdG9yIHRva2VuXCIpO1xuXHR9XG5cdGNvbnN0IGZpbGVUeXBlID0gdXJsLmZpbmRQYXJhbShcImZpbGVfdHlwZVwiKTtcblxuXHR0cnkge1xuXHRcdHJldHVybiBbdG9rZW5TdHJpbmcsIHJlYWRUb2tlblN0cmluZyh0b2tlblN0cmluZywgZmlsZVR5cGUpXTtcblx0fSBjYXRjaChlKSB7XG5cdFx0cmV0dXJuIFt0b2tlblN0cmluZywgeyBhdHNfY29tcGFueV9pZDogXCJcIiB9XTtcblx0fVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9nZ2VyIHtcblx0cHJpdmF0ZSBkZWJ1ZzogYm9vbGVhbjtcblx0Y29uc3RydWN0b3IoZGVidWc6IGJvb2xlYW4pIHtcblx0XHR0aGlzLmRlYnVnID0gZGVidWc7XG5cdH1cblxuXHRwdWJsaWMgaW5mbyhtZXNzYWdlOiBhbnkpOiB2b2lkIHtcblx0XHRpZiAodGhpcy5kZWJ1Zykge1xuXHRcdFx0Y29uc29sZS5sb2cobWVzc2FnZSk7XG5cdFx0fVxuXHR9XG5cblx0cHVibGljIGVycm9yKG1lc3NhZ2U6IGFueSk6IHZvaWQge1xuXHRcdGlmICh0aGlzLmRlYnVnKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKG1lc3NhZ2UpO1xuXHRcdH1cblx0fVxuXG5cdHB1YmxpYyB3YXJuKG1lc3NhZ2U6IGFueSk6IHZvaWQge1xuXHRcdGlmICh0aGlzLmRlYnVnKSB7XG5cdFx0XHRjb25zb2xlLndhcm4obWVzc2FnZSk7XG5cdFx0fVxuXHR9XG59IiwiaW1wb3J0IHsgQnJvd3NlckluZm8sIGZpbmRCcm93c2VySW5mbyB9IGZyb20gXCIuL0Jyb3dzZXJJbmZvXCI7XG5pbXBvcnQgeyBDYW1wYWlnbkluZm8sIGZpbmRDYW1wYWlnbkluZm8gfSBmcm9tIFwiLi9DYW1wYWlnbkluZm9cIjtcbmltcG9ydCB7IGNyZWF0ZVVVSUQsIGRlYm91bmNlIH0gZnJvbSBcIi4vVG9vbHNcIjsgXG5cbmltcG9ydCBBdHRhY2htZW50T3BlbiBmcm9tIFwiLi9ldmVudHMvQXR0YWNobWVudE9wZW5cIjtcbmltcG9ydCBDbGljayBmcm9tIFwiLi9ldmVudHMvQ2xpY2tcIjtcbmltcG9ydCBEb3dubG9hZCBmcm9tIFwiLi9ldmVudHMvRG93bmxvYWRcIjtcbmltcG9ydCBFeHRlbnNpb24gZnJvbSBcIi4vZXZlbnRzL0V4dGVuc2lvblwiO1xuaW1wb3J0IEZpbGVEb3dubG9hZCBmcm9tIFwiLi9ldmVudHMvRmlsZURvd25sb2FkXCI7XG5pbXBvcnQgRmlsZU9wZW4gZnJvbSBcIi4vZXZlbnRzL0ZpbGVPcGVuXCI7XG5pbXBvcnQgSW5wdXQgZnJvbSBcIi4vZXZlbnRzL0lucHV0XCI7XG5pbXBvcnQgTWljcm9waG9uZSBmcm9tIFwiLi9ldmVudHMvTWljcm9waG9uZVwiO1xuaW1wb3J0IE5vdGlmaWNhdGlvbiBmcm9tIFwiLi9ldmVudHMvTm90aWZpY2F0aW9uXCI7XG5pbXBvcnQgUGFnZUxlZnQgZnJvbSBcIi4vZXZlbnRzL1BhZ2VMZWZ0XCI7XG5pbXBvcnQgUGFnZUxvYWRlZCBmcm9tIFwiLi9ldmVudHMvUGFnZUxvYWRlZFwiO1xuaW1wb3J0IFBhZ2VSZWFkIGZyb20gXCIuL2V2ZW50cy9QYWdlUmVhZFwiO1xuaW1wb3J0IFN1Ym1pdCBmcm9tIFwiLi9ldmVudHMvU3VibWl0XCI7XG5pbXBvcnQgV2ViY2FtIGZyb20gXCIuL2V2ZW50cy9XZWJjYW1cIjtcbmltcG9ydCBJRXZlbnQgZnJvbSBcIi4vaW50ZWZhY2VzL0lFdmVudFwiO1xuaW1wb3J0IExvY2F0aW9uIGZyb20gXCIuL2V2ZW50cy9Mb2NhdGlvblwiO1xuXG5pbXBvcnQgSUV2ZW50UGF5bG9hZCBmcm9tIFwiLi9pbnRlZmFjZXMvSUV2ZW50UGF5bG9hZFwiO1xuaW1wb3J0IFJlbW90ZSBmcm9tIFwiLi9SZW1vdGVcIjtcblxuaW1wb3J0IExvZ2dlciBmcm9tIFwiLi9Mb2dnZXJcIjtcblxuZXhwb3J0IGNsYXNzIE1hbmFnZXIge1xuXHRwcml2YXRlIHJlYWRvbmx5IHN1cHBvcnRlZFR5cGVzIDogc3RyaW5nW10gPSBbXCJlbWFpbFwiLCBcInBhc3N3b3JkXCIsIFwidGVsXCIsIFwidGV4dFwiLCBcImdpdmVuLW5hbWVcIiwgXCJuYW1lXCIsIFwiZmFtaWx5LW5hbWVcIiwgXCJzdHJlZXQtYWRkcmVzc1wiLCBcImNjLW5hbWVcIiwgXCJjYy1naXZlbi1uYW1lXCIsIFwiY2MtZmFtaWx5LW5hbWVcIiwgXCJjYy1udW1iZXJcIiwgXCJjYy1leHBcIiwgXCJjYy1leHAtbW9udGhcIiwgXCJjYy1leHAteWVhclwiLCBcImNjLWNzY1wiLCBcImNjLXR5cGVcIl07XG5cdHByaXZhdGUgcmVhZG9ubHkgc3VwcG9ydGVkRXZlbnRzID0ge1xuXHRcdFwiYXR0YWNobWVudF9vcGVuZWRcIjogQXR0YWNobWVudE9wZW4sXG5cdFx0XCJidXR0b25fY2xpY2tlZFwiOiBDbGljayxcblx0XHRcImRvd25sb2FkXCI6IERvd25sb2FkLFxuXHRcdFwiZXh0ZW5zaW9uX2luc3RhbGxlZFwiOiBFeHRlbnNpb24sXG5cdFx0XCJmaWxlX2Rvd25sb2FkXCI6IEZpbGVEb3dubG9hZCxcdFx0XG5cdFx0XCJmaWxlX29wZW5cIjogRmlsZU9wZW4sXG5cdFx0XCJpbnB1dF9maWxsZWRcIjogSW5wdXQsXG5cdFx0XCJwYWdlX2xlZnRcIjogUGFnZUxlZnQsXG5cdFx0XCJwYWdlX2xvYWRlZFwiOiBQYWdlTG9hZGVkLFxuXHRcdFwicGFnZV9yZWFkXCI6IFBhZ2VSZWFkLFxuXHRcdFwibWljX2FjY2VwdGVkXCI6IE1pY3JvcGhvbmUsXG5cdFx0XCJub3RpZmljYXRpb25fYWNjZXB0ZWRcIjogTm90aWZpY2F0aW9uLFxuXHRcdFwiZm9ybV9zdWJtaXR0ZWRcIjogU3VibWl0LFxuXHRcdFwid2ViY2FtX2FjY2VwdGVkXCI6IFdlYmNhbSxcblx0XHRcImxvY2F0aW9uX2FjY2VwdGVkXCI6IExvY2F0aW9uLFxuXHR9O1xuXHRwcml2YXRlIHJlYWRvbmx5IGJyb3dzZXJJbmZvOiBCcm93c2VySW5mbztcblx0cHJpdmF0ZSByZWFkb25seSBjYW1wYWlnbkluZm86IENhbXBhaWduSW5mbztcblx0cHJpdmF0ZSByZWFkb25seSByZWRpcmVjdFVybDogc3RyaW5nO1xuXHRwcml2YXRlIHJlYWRvbmx5IHNob3VsZFJlZGlyZWN0OiBib29sZWFuO1xuXHRwcml2YXRlIHJlYWRvbmx5IHJlbW90ZTogUmVtb3RlO1xuXHRwcml2YXRlIHJlYWRvbmx5IHNvdXJjZTogc3RyaW5nO1xuXHRwcml2YXRlIHJlYWRvbmx5IHRva2VuOiBzdHJpbmc7XG5cblx0cHJpdmF0ZSBsb2dnZXI6IExvZ2dlcjtcblx0cHJpdmF0ZSBoYW5kbGVycyA9IFtdO1xuXHRwcml2YXRlIGRpc2FibGVkRXZlbnRzID0gW107XG5cdHByaXZhdGUgYWN0aXZlRXZlbnRzOiBJRXZlbnRbXTtcblxuXHRjb25zdHJ1Y3RvcihyZW1vdGU6IFJlbW90ZSwgZXZlbnROYW1lczogc3RyaW5nW10sIHNvdXJjZTogc3RyaW5nLCByZWRpcmVjdFVybDogc3RyaW5nLCBzaG91bGRSZWRpcmVjdDogYm9vbGVhbiwgZGVidWcgPSBmYWxzZSkge1xuXHRcdHRoaXMubG9nZ2VyID0gbmV3IExvZ2dlcihkZWJ1Zyk7XG5cblx0XHR0aGlzLnJlbW90ZSA9IHJlbW90ZTtcblx0XHRbdGhpcy50b2tlbiwgdGhpcy5jYW1wYWlnbkluZm9dID0gZmluZENhbXBhaWduSW5mbygpO1xuXHRcdHRoaXMuYnJvd3NlckluZm8gPSBmaW5kQnJvd3NlckluZm8oKTtcblxuXHRcdGlmICghZXZlbnROYW1lcy5sZW5ndGgpIHtcblx0XHRcdGV2ZW50TmFtZXMgPSBPYmplY3Qua2V5cyh0aGlzLnN1cHBvcnRlZEV2ZW50cyk7XG5cdFx0fVxuXG5cdFx0dGhpcy5hY3RpdmVFdmVudHMgPSBldmVudE5hbWVzLm1hcChuYW1lID0+IHRoaXMuZ2V0RXZlbnQobmFtZSkpLmZpbHRlcihldmVudCA9PiBldmVudCAhPT0gbnVsbCk7XG5cdFx0dGhpcy5sb2dnZXIuaW5mbyhgRW5hYmxlZCBldmVudHM6ICR7ZXZlbnROYW1lcy5qb2luKFwiIHwgXCIpfWApO1xuXG5cdFx0dGhpcy5zb3VyY2UgPSBzb3VyY2U7XG5cdFx0dGhpcy5yZWRpcmVjdFVybCA9IHJlZGlyZWN0VXJsO1xuXHRcdHRoaXMuc2hvdWxkUmVkaXJlY3QgPSBzaG91bGRSZWRpcmVjdDtcblxuXHRcdGlmICh0aGlzLmNhbXBhaWduSW5mby5kb3dubG9hZF90eXBlKSB7XG5cdFx0XHR0aGlzLmNoZWNrRG93bmxvYWQoKTtcblx0XHR9XG5cblx0fVxuXG5cdHByaXZhdGUgZ2V0RXZlbnQobmFtZTogc3RyaW5nKSB7XG5cdFx0aWYgKCEgdGhpcy5zdXBwb3J0ZWRFdmVudHNbbmFtZV0pIHtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblxuXHRcdHJldHVybiBuZXcgKHRoaXMuc3VwcG9ydGVkRXZlbnRzW25hbWVdKTtcblx0fVxuXG5cdHByaXZhdGUgY2hlY2tEb3dubG9hZCgpIHtcblx0XHRzd2l0Y2ggKHRoaXMuY2FtcGFpZ25JbmZvLmRvd25sb2FkX3R5cGUpIHtcblx0XHRjYXNlIFwiZmlsZVwiOlxuXHRcdFx0cmV0dXJuIHRoaXMudHJpZ2dlcihcImZpbGVfb3BlbmVkXCIpO1xuXHRcdGNhc2UgXCJhdHRhY2htZW50XCI6XG5cdFx0XHRyZXR1cm4gdGhpcy50cmlnZ2VyKFwiYXR0YWNobWVudF9vcGVuZWRcIik7XG5cdFx0fVxuXHR9XG5cblx0cHVibGljIGxpc3RlbigpIHtcblx0XHRsZXQgaSA9IDA7XG5cdFx0Zm9yKGNvbnN0IGFjdGl2ZUV2ZW50IG9mIHRoaXMuYWN0aXZlRXZlbnRzKSB7XG5cdFx0XHRpZiAoISBhY3RpdmVFdmVudC50cmlnZ2VyKSB7XG5cdFx0XHRcdHRoaXMubG9nZ2VyLmluZm8oYFRoZSBhY3RpdmUgZXZlbnQgJHthY3RpdmVFdmVudC5uYW1lfSBkb2VzIG5vdCBoYXZlIGEgdHJpZ2dlci4gU2tpcHBpbmcuLi5gKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMubG9nZ2VyLmluZm8oYExpc3RlbmluZyBmb3IgZXZlbnQgQCR7YWN0aXZlRXZlbnQudHJpZ2dlcn0gKCR7YWN0aXZlRXZlbnQubmFtZX0pYCk7XG5cdFx0XHRcdGFjdGl2ZUV2ZW50LnNvdXJjZS5hZGRFdmVudExpc3RlbmVyKGFjdGl2ZUV2ZW50LnRyaWdnZXIsIHRoaXMuaGFuZGxlcnNbaSsrXSA9IChldmVudDogRXZlbnQpID0+IHRoaXMucHJlaGFuZGxlKGFjdGl2ZUV2ZW50LCBldmVudCkpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHB1YmxpYyBzdG9wKCkge1xuXHRcdGxldCBpID0gMDtcblx0XHRmb3IoY29uc3QgYWN0aXZlRXZlbnQgb2YgdGhpcy5hY3RpdmVFdmVudHMpIHtcblx0XHRcdGlmICghIGFjdGl2ZUV2ZW50LnRyaWdnZXIpIHtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMubG9nZ2VyLmluZm8oYFN0b3BwaW5nIGxpc3RlbmluZyBmb3IgZXZlbnQgQCR7YWN0aXZlRXZlbnQudHJpZ2dlcn0gKCR7YWN0aXZlRXZlbnQubmFtZX0pYCk7ICAgICAgICBcblx0XHRcdGFjdGl2ZUV2ZW50LnNvdXJjZS5yZW1vdmVFdmVudExpc3RlbmVyKGFjdGl2ZUV2ZW50LnRyaWdnZXIsIHRoaXMuaGFuZGxlcnNbaSsrXSk7XG5cdFx0fVxuXHR9XG5cblx0cHVibGljIHRyaWdnZXIoZXZlbnROYW1lOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcblx0XHRjb25zdCBhY3RpdmVFdmVudCA9IHRoaXMuZ2V0RXZlbnQoZXZlbnROYW1lKTtcblx0XHRpZiAoIWFjdGl2ZUV2ZW50KSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIGV2ZW50ICR7ZXZlbnROYW1lfS4gUGxlYXNlIGNob29zZSBvbmUgb2YgJHtPYmplY3Qua2V5cyh0aGlzLnN1cHBvcnRlZEV2ZW50cykuam9pbihcIiwgXCIpfWApO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzLmV4ZWN1dGVFdmVudChhY3RpdmVFdmVudCwgbnVsbCwgZmFsc2UpO1xuXHR9XG5cblx0cHJpdmF0ZSBwcmVoYW5kbGUoYWN0aXZlRXZlbnQ6IElFdmVudCwgZXZlbnQ/OiBFdmVudCkge1x0XHRcblx0XHRpZiAoYWN0aXZlRXZlbnQuc2hvdWxkRGVib3VuY2UpIHtcblx0XHRcdGRlYm91bmNlKCguLi5hcmdzOiBbSUV2ZW50LCBFdmVudF0pID0+IHRoaXMuaGFuZGxlKC4uLmFyZ3MpLCA1MDAsIGFjdGl2ZUV2ZW50LCBldmVudCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuaGFuZGxlKGFjdGl2ZUV2ZW50LCBldmVudCk7XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBmaW5kVHlwZShhY3RpdmVFdmVudDogSUV2ZW50LCBldmVudD86IEV2ZW50KTogc3RyaW5nIHwgbnVsbCB7XG5cdFx0aWYgKCFhY3RpdmVFdmVudC5oYXNUeXBlcyB8fCAhZXZlbnQpIHtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblxuXHRcdGNvbnN0IGlucHV0RWxlbWVudCA9IGV2ZW50LnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50O1xuXHRcdFxuXHRcdGNvbnN0IHR5cGUgPSBpbnB1dEVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiYXV0b2NvbXBsZXRlXCIpIHx8IGlucHV0RWxlbWVudC50eXBlO1x0XG5cdFx0XG5cdFx0aWYgKHRoaXMuc3VwcG9ydGVkVHlwZXMuaW5kZXhPZih0eXBlKSAhPT0gLTEpIHtcblx0XHRcdHJldHVybiB0eXBlO1xuXHRcdH1cblxuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cblx0cHJpdmF0ZSBmaW5kTmFtZShhY3RpdmVFdmVudDogSUV2ZW50LCBldmVudD86IEV2ZW50KTogc3RyaW5nIHtcblx0XHRjb25zdCB0eXBlID0gdGhpcy5maW5kVHlwZShhY3RpdmVFdmVudCwgZXZlbnQpO1xuXHRcdGlmICghdHlwZSkge1xuXHRcdFx0cmV0dXJuIGFjdGl2ZUV2ZW50Lm5hbWU7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGAke2FjdGl2ZUV2ZW50Lm5hbWV9LSR7dHlwZX1gO1xuXHR9XG5cblx0cHJpdmF0ZSBwYWNrRXZlbnQodHlwZTogc3RyaW5nLCBhY3RpdmVFdmVudDogSUV2ZW50KTogSUV2ZW50UGF5bG9hZCB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdFwiZGF0YVwiOiB7XG5cdFx0XHRcdC4uLnRoaXMuYnJvd3NlckluZm8sXG5cdFx0XHRcdHR5cGUsXG5cdFx0XHR9LFxuXHRcdFx0XCJzb3VyY2VcIjogdGhpcy5zb3VyY2UsXG5cdFx0XHRcInRpbWVzdGFtcFwiOiBNYXRoLmZsb29yKERhdGUubm93KCkgLyAxMDAwKSxcblx0XHRcdFwiYXRzX2hlYWRlclwiOiB0aGlzLnRva2VuLFxuXHRcdFx0XCJldmVudFwiOiBhY3RpdmVFdmVudC5uYW1lLnRvTG93ZXJDYXNlKCksXG5cdFx0XHRcInNnX2V2ZW50X2lkXCI6IGNyZWF0ZVVVSUQoKSxcblx0XHRcdFwic2dfbWVzc2FnZV9pZFwiOiB0aGlzLmNhbXBhaWduSW5mby5hdHNfaW5zdGFuY2VfaWQsXG5cdFx0fTtcblx0fVxuXG5cdHByaXZhdGUgaGFuZGxlKGFjdGl2ZUV2ZW50OiBJRXZlbnQsIGV2ZW50PzogRXZlbnQsIHNob3VsZFZhbGlkYXRlID0gdHJ1ZSk6IHZvaWQge1xuXHRcdHRoaXMuZXhlY3V0ZUV2ZW50KGFjdGl2ZUV2ZW50LCBldmVudCwgc2hvdWxkVmFsaWRhdGUpXG5cdFx0XHQuY2F0Y2goZSA9PiB0aGlzLmxvZ2dlci5lcnJvcihlKSk7XHRcdFx0XG5cdH1cblxuXHRwcml2YXRlIGNoZWNrRXZlbnQoYWN0aXZlRXZlbnQ6IElFdmVudCwgc2hvdWxkVmFsaWRhdGUgPSB0cnVlKTogdm9pZCB7XG5cdFx0aWYgKCEgYWN0aXZlRXZlbnQuaXNWYWxpZChldmVudCkgJiYgc2hvdWxkVmFsaWRhdGUpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgRXZlbnQgQCR7YWN0aXZlRXZlbnQudHJpZ2dlcn0gKCR7YWN0aXZlRXZlbnQubmFtZX0pIG5vdCB2YWxpZC4uLmApO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgY2hlY2tNdWx0aXBsZShhY3RpdmVFdmVudDogSUV2ZW50LCBldmVudD86IEV2ZW50KTogdm9pZCB7XG5cdFx0aWYgKCFhY3RpdmVFdmVudC5hbGxvd011bHRpcGxlKSB7XG5cdFx0XHRjb25zdCBuYW1lID0gdGhpcy5maW5kTmFtZShhY3RpdmVFdmVudCwgZXZlbnQpO1xuXHRcdFx0aWYgKHRoaXMuZGlzYWJsZWRFdmVudHMuaW5jbHVkZXMobmFtZSkpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBQcmV2ZW50aW5nIGR1cGxpY2F0ZSBldmVudCBAJHthY3RpdmVFdmVudC50cmlnZ2VyfSAoJHtuYW1lfSkuYCk7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuZGlzYWJsZWRFdmVudHMucHVzaChuYW1lKTtcblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIGV4ZWN1dGVFdmVudChhY3RpdmVFdmVudDogSUV2ZW50LCBldmVudD86IEV2ZW50LCBzaG91bGRWYWxpZGF0ZSA9IHRydWUpOiBQcm9taXNlPHZvaWQ+IHtcblx0XHR0aGlzLmxvZ2dlci5pbmZvKGBFdmVudCBAJHthY3RpdmVFdmVudC50cmlnZ2VyfSAoJHthY3RpdmVFdmVudC5uYW1lfSkgdHJpZ2dlcmVkLi4uYCk7XG5cblx0XHR0cnkge1xuXHRcdFx0dGhpcy5jaGVja0V2ZW50KGFjdGl2ZUV2ZW50LCBzaG91bGRWYWxpZGF0ZSk7XG5cdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0dGhpcy5sb2dnZXIuZXJyb3IoZSk7XG5cdFx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4gcmVqZWN0KGUpKTtcblx0XHR9XG5cblx0XHRpZiAoZXZlbnQgJiYgYWN0aXZlRXZlbnQuaXNCbG9ja2luZykge1xuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0ZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0fVxuXG5cdFx0dHJ5IHtcblx0XHRcdHRoaXMuY2hlY2tNdWx0aXBsZShhY3RpdmVFdmVudCwgZXZlbnQpO1xuXHRcdH0gY2F0Y2goZSkge1xuXHRcdFx0dGhpcy5sb2dnZXIuZXJyb3IoZSk7XG5cdFx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4gcmVqZWN0KGUpKTtcblx0XHR9XG5cblx0XHRjb25zdCB0eXBlID0gdGhpcy5maW5kVHlwZShhY3RpdmVFdmVudCwgZXZlbnQpO1xuXHRcdGNvbnN0IHBheWxvYWQgPSB0aGlzLnBhY2tFdmVudCh0eXBlLCBhY3RpdmVFdmVudCk7XG5cdFx0XG5cdFx0cmV0dXJuIHRoaXMucmVtb3RlLnBvc3QocGF5bG9hZClcblx0XHRcdC50aGVuKHJlc3VsdCA9PiB0aGlzLmxvZ2dlci5pbmZvKHJlc3VsdCkpXG5cdFx0XHQuZmluYWxseSgoKSA9PiB7XG5cdFx0XHRcdGlmIChhY3RpdmVFdmVudC5yZWRpcmVjdE9uRmluaXNoICYmIHRoaXMuc2hvdWxkUmVkaXJlY3QpIHtcblx0XHRcdFx0XHR3aW5kb3cubG9jYXRpb24uaHJlZiA9IGAke3RoaXMucmVkaXJlY3RVcmx9JHt3aW5kb3cubG9jYXRpb24uc2VhcmNofWA7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1x0XHRcblxuXHR9XG59IiwiaW1wb3J0IElFdmVudFBheWxvYWQgZnJvbSBcIi4vaW50ZWZhY2VzL0lFdmVudFBheWxvYWRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVtb3RlIHtcblx0cHJpdmF0ZSBhcGlfa2V5OiBzdHJpbmc7XG5cdHByaXZhdGUgdXJsOiBzdHJpbmc7XG5cdHByaXZhdGUgZGVidWc6IGJvb2xlYW47XG5cblx0Y29uc3RydWN0b3IoYXBpX2tleTogc3RyaW5nLCB1cmw6IHN0cmluZywgZGVidWc6IGJvb2xlYW4pIHtcblx0XHR0aGlzLmFwaV9rZXkgPSBhcGlfa2V5O1xuXHRcdHRoaXMudXJsID0gdXJsO1xuXHRcdHRoaXMuZGVidWcgPSBkZWJ1Zztcblx0fVxuXG5cdHB1YmxpYyBwb3N0KGRhdGE6IElFdmVudFBheWxvYWQpOiBQcm9taXNlPG9iamVjdD4ge1xuXHRcdGlmICh0aGlzLmRlYnVnKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhgU2VuZGluZyBldmVudCB0byAke3RoaXMudXJsfSB3aXRoIGRhdGE6YCk7XG5cdFx0XHRjb25zb2xlLnRhYmxlKGRhdGEpO1xuXHRcdH1cblxuXHRcdHJldHVybiBmZXRjaCh0aGlzLnVybCwge1xuXHRcdFx0bWV0aG9kOiBcIlBPU1RcIixcblx0XHRcdGhlYWRlcnM6IHtcblx0XHRcdFx0XCJDb250ZW50LXR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG5cdFx0XHRcdFwiYXBpLWtleVwiOiB0aGlzLmFwaV9rZXksXG5cdFx0XHR9LFxuXHRcdFx0a2VlcGFsaXZlOiB0cnVlLFxuXHRcdFx0Ym9keTogSlNPTi5zdHJpbmdpZnkoZGF0YSksXG5cdFx0fSkudGhlbihyZXNwb25zZSA9PiB7XG5cdFx0XHRjb25zdCBjb250ZW50VHlwZSA9IHJlc3BvbnNlLmhlYWRlcnMuZ2V0KFwiY29udGVudC10eXBlXCIpO1xuXHRcdFx0aWYgKGNvbnRlbnRUeXBlICYmIGNvbnRlbnRUeXBlLmluZGV4T2YoXCJhcHBsaWNhdGlvbi9qc29uXCIpICE9PSAtMSkge1xuXHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIHJlc3BvbnNlLnRleHQoKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVVVSUQoKSB7XG5cdC8vIGh0dHA6Ly93d3cuaWV0Zi5vcmcvcmZjL3JmYzQxMjIudHh0XG5cdGNvbnN0IHM6IGFueVtdID0gW107XG5cdGNvbnN0IGhleERpZ2l0cyA9IFwiMDEyMzQ1Njc4OWFiY2RlZlwiO1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IDM2OyBpKyspIHtcblx0XHRzW2ldID0gaGV4RGlnaXRzLnN1YnN0cihNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAweDEwKSwgMSk7XG5cdH1cblx0c1sxNF0gPSBcIjRcIjsgIC8vIGJpdHMgMTItMTUgb2YgdGhlIHRpbWVfaGlfYW5kX3ZlcnNpb24gZmllbGQgdG8gMDAxMFxuXHRzWzE5XSA9IGhleERpZ2l0cy5zdWJzdHIoKHNbMTldICYgMHgzKSB8IDB4OCwgMSk7ICAvLyBiaXRzIDYtNyBvZiB0aGUgY2xvY2tfc2VxX2hpX2FuZF9yZXNlcnZlZCB0byAwMVxuXHRzWzhdID0gc1sxM10gPSBzWzE4XSA9IHNbMjNdID0gXCItXCI7XG5cblx0cmV0dXJuIHMuam9pbihcIlwiKTtcbn1cblxuY29uc3QgZmlyc3RUTERzID0gXCJhY3xhZHxhZXxhZnxhZ3xhaXxhbHxhbXxhbnxhb3xhcXxhcnxhc3xhdHxhdXxhd3xheHxhenxiYXxiYnxiZXxiZnxiZ3xiaHxiaXxianxibXxib3xicnxic3xidHxidnxid3xieXxienxjYXxjY3xjZHxjZnxjZ3xjaHxjaXxjbHxjbXxjbnxjb3xjcnxjdXxjdnxjd3xjeHxjenxkZXxkanxka3xkbXxkb3xkenxlY3xlZXxlZ3xlc3xldHxldXxmaXxmbXxmb3xmcnxnYXxnYnxnZHxnZXxnZnxnZ3xnaHxnaXxnbHxnbXxnbnxncHxncXxncnxnc3xndHxnd3xneXxoa3xobXxobnxocnxodHxodXxpZHxpZXxpbHxpbXxpbnxpb3xpcXxpcnxpc3xpdHxqZXxqb3xqcHxrZ3xraXxrbXxrbnxrcHxrcnxreXxrenxsYXxsYnxsY3xsaXxsa3xscnxsc3xsdHxsdXxsdnxseXxtYXxtY3xtZHxtZXxtZ3xtaHxta3xtbHxtbnxtb3xtcHxtcXxtcnxtc3xtdHxtdXxtdnxtd3xteHxteXxuYXxuY3xuZXxuZnxuZ3xubHxub3xucnxudXxuenxvbXxwYXxwZXxwZnxwaHxwa3xwbHxwbXxwbnxwcnxwc3xwdHxwd3xweXxxYXxyZXxyb3xyc3xydXxyd3xzYXxzYnxzY3xzZHxzZXxzZ3xzaHxzaXxzanxza3xzbHxzbXxzbnxzb3xzcnxzdHxzdXxzdnxzeHxzeXxzenx0Y3x0ZHx0Znx0Z3x0aHx0anx0a3x0bHx0bXx0bnx0b3x0cHx0cnx0dHx0dnx0d3x0enx1YXx1Z3x1a3x1c3x1eXx1enx2YXx2Y3x2ZXx2Z3x2aXx2bnx2dXx3Znx3c3x5dFwiLnNwbGl0KFwifFwiKTtcblxuY29uc3Qgc2Vjb25kVExEcyA9IFwiY29tfGVkdXxnb3Z8bmV0fG1pbHxvcmd8bm9tfHNjaHxjYWF8cmVzfG9mZnxnb2J8aW50fHR1cnxpcDZ8dXJpfHVybnxhc258YWN0fG5zd3xxbGR8dGFzfHZpY3xwcm98Yml6fGFkbXxhZHZ8YWdyfGFycXxhcnR8YXRvfGJpb3xibWR8Y2ltfGNuZ3xjbnR8ZWNufGVjb3xlbXB8ZW5nfGVzcHxldGN8ZXRpfGZhcnxmbmR8Zm90fGZzdHxnMTJ8Z2dmfGltYnxpbmR8aW5mfGpvcnxqdXN8bGVnfGxlbHxtYXR8bWVkfG11c3xub3R8bnRyfG9kb3xwcGd8cHNjfHBzaXxxc2x8cmVjfHNsZ3xzcnZ8dGVvfHRtcHx0cmR8dmV0fHpsZ3x3ZWJ8bHRkfHNsZHxwb2x8ZmlufGsxMnxsaWJ8cHJpfGFpcHxmaWV8ZXVufHNjaXxwcmR8Y2NpfHB2dHxtb2R8aWR2fHJlbHxzZXh8Z2VufG5pY3xhYnJ8YmFzfGNhbHxjYW18ZW1yfGZ2Z3xsYXp8bGlnfGxvbXxtYXJ8bW9sfHBtbnxwdWd8c2FyfHNpY3x0YWF8dG9zfHVtYnx2YW98dmRhfHZlbnxtaWV85YyX5rW36YGTfOWSjOatjOWxsXznpZ7lpYjlt5186bm/5YWQ5bO2fGFzc3xyZXB8dHJhfHBlcnxuZ298c29jfGdycHxwbGN8aXRzfGFpcnxhbmR8YnVzfGNhbnxkZHJ8amZrfG1hZHxucnd8bnljfHNraXxzcHl8dGNtfHVsbXx1c2F8d2FyfGZoc3x2Z3N8ZGVwfGVpZHxmZXR8ZmxhfGZsw6V8Z29sfGhvZnxob2x8c2VsfHZpa3xjcml8aXdpfGluZ3xhYm98ZmFtfGdva3xnb258Z29wfGdvc3xhaWR8YXRtfGdzbXxzb3N8ZWxrfHdhd3xlc3R8YWNhfGJhcnxjcGF8anVyfGxhd3xzZWN8cGxvfHd3d3xiaXJ8Y2JnfGphcnxraHZ8bXNrfG5vdnxuc2t8cHR6fHJuZHxzcGJ8c3R2fHRvbXx0c2t8dWRtfHZybnxjbXd8a21zfG5renxzbnp8cHVifGZodnxyZWR8ZW5zfG5hdHxybnN8cm51fGJic3x0ZWx8YmVsfGtlcHxuaHN8ZG5pfGZlZHxpc2F8bnNufGd1YnxlMTJ8dGVjfNC+0YDQs3zQvtCx0YB80YPQv9GAfGFsdHxuaXN8anBufG1leHxhdGh8aWtpfG5pZHxnZGF8aW5jXCIuc3BsaXQoXCJ8XCIpO1xuXG5jb25zdCBrbm93blN1YmRvbWFpbnMgPSBcInd3d3xzdHVkaW98bWFpbHxyZW1vdGV8YmxvZ3x3ZWJtYWlsfHNlcnZlcnxuczF8bnMyfHNtdHB8c2VjdXJlfHZwbnxtfHNob3B8ZnRwfG1haWwyfHRlc3R8cG9ydGFsfG5zfHd3MXxob3N0fHN1cHBvcnR8ZGV2fHdlYnxiYnN8d3c0MnxzcXVhdHRlcnxteHxlbWFpbHwxfG1haWwxfDJ8Zm9ydW18b3dhfHd3dzJ8Z3d8YWRtaW58c3RvcmV8bXgxfGNkbnxhcGl8ZXhjaGFuZ2V8YXBwfGdvdnwydHR5fHZwc3xnb3Z5dHl8aGdmZ2RmfG5ld3N8MXJlcnxsa2prdWlcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZVN1YmRvbWFpbihzOiBzdHJpbmcpIHtcblx0Y29uc3Qga25vd25TdWJkb21haW5zUmVnRXhwID0gbmV3IFJlZ0V4cChgXigke2tub3duU3ViZG9tYWluc30pLmAsIFwiaVwiKTtcblx0cyA9IHMucmVwbGFjZShrbm93blN1YmRvbWFpbnNSZWdFeHAsIFwiXCIpO1xuXG5cdGNvbnN0IHBhcnRzID0gcy5zcGxpdChcIi5cIik7XG5cblx0d2hpbGUgKHBhcnRzLmxlbmd0aCA+IDMpIHtcblx0XHRwYXJ0cy5zaGlmdCgpO1xuXHR9XG5cblx0aWYgKHBhcnRzLmxlbmd0aCA9PT0gMyAmJiAoKHBhcnRzWzFdLmxlbmd0aCA+IDIgJiYgcGFydHNbMl0ubGVuZ3RoID4gMikgfHwgKHNlY29uZFRMRHMuaW5kZXhPZihwYXJ0c1sxXSkgPT09IC0xKSAmJiBmaXJzdFRMRHMuaW5kZXhPZihwYXJ0c1syXSkgPT09IC0xKSkge1xuXHRcdHBhcnRzLnNoaWZ0KCk7XG5cdH1cblxuXHRyZXR1cm4gcGFydHMuam9pbihcIi5cIik7XG59XG5cbmNvbnN0IHRpbWVvdXRzID0ge307XG5leHBvcnQgZnVuY3Rpb24gZGVib3VuY2U8QXJncyBleHRlbmRzIGFueVtdPihjYWxsYmFjazogKC4uLmFyZ3M6IEFyZ3MpID0+IHZvaWQsIHdhaXQ6IG51bWJlciwgLi4uYXJnczogQXJncykgOiB2b2lkIHtcblx0Y29uc3QgWywgZXZlbnRdID0gYXJncztcblx0XG5cdGlmICghIGV2ZW50LnRhcmdldC5oYXNBdHRyaWJ1dGUoXCJkYXRhLWlkXCIpKSB7XG5cdFx0ZXZlbnQudGFyZ2V0LnNldEF0dHJpYnV0ZShcImRhdGEtaWRcIiwgY3JlYXRlVVVJRCgpKTtcblx0fVxuXG5cdGNvbnN0IGlkID0gZXZlbnQudGFyZ2V0LmdldEF0dHJpYnV0ZShcImRhdGEtaWRcIik7XG5cblx0aWYgKHRpbWVvdXRzW2lkXSkge1xuXHRcdGNsZWFyVGltZW91dCh0aW1lb3V0c1tpZF0pO1xuXHR9XG5cblx0dGltZW91dHNbaWRdID0gc2V0VGltZW91dChjYWxsYmFjaywgd2FpdCwgLi4uYXJncyk7XG59IiwiaW50ZXJmYWNlIFBhcmFtZXRlck1hcCB7XG4gICAgW3M6IHN0cmluZ106IGFueVxufVxuZXhwb3J0IGNsYXNzIFVybFBhcnNlciB7XG5cblx0cHJpdmF0ZSBwYXJhbWV0ZXJzOiBQYXJhbWV0ZXJNYXA7XG5cdHB1YmxpYyByZWFkb25seSBwcm90b2NvbDogc3RyaW5nO1xuXHRwdWJsaWMgcmVhZG9ubHkgaG9zdDogc3RyaW5nO1xuXHRwdWJsaWMgcmVhZG9ubHkgaG9zdG5hbWU6IHN0cmluZztcblx0cHVibGljIHJlYWRvbmx5IHBvcnQ6IHN0cmluZztcblx0cHVibGljIHJlYWRvbmx5IHBhdGhuYW1lOiBzdHJpbmc7XG5cdHB1YmxpYyByZWFkb25seSBoYXNoOiBzdHJpbmc7XG5cdHB1YmxpYyByZWFkb25seSBzZWFyY2g6IHN0cmluZztcblxuXHRjb25zdHJ1Y3Rvcihwcml2YXRlIHVybDpzdHJpbmcpIHtcblx0XHRjb25zdCBwYXJzZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcblx0XHRwYXJzZXIuaHJlZiA9IHVybDtcblxuXHRcdHRoaXMucHJvdG9jb2wgPSBwYXJzZXIucHJvdG9jb2w7IC8vID0+IFwiaHR0cDpcIlxuXHRcdHRoaXMuaG9zdCA9IHBhcnNlci5ob3N0OyAgICAgLy8gPT4gXCJleGFtcGxlLmNvbTozMDAwXCJcblx0XHR0aGlzLmhvc3RuYW1lID0gcGFyc2VyLmhvc3RuYW1lOyAvLyA9PiBcImV4YW1wbGUuY29tXCJcblx0XHR0aGlzLnBvcnQgPSBwYXJzZXIucG9ydDsgICAgIC8vID0+IFwiMzAwMFwiXG5cdFx0dGhpcy5wYXRobmFtZSA9IHBhcnNlci5wYXRobmFtZTsgLy8gPT4gXCIvcGF0aG5hbWUvXCJcblx0XHR0aGlzLmhhc2ggPSBwYXJzZXIuaGFzaDsgICAgIC8vID0+IFwiI2hhc2hcIlxuXHRcdHRoaXMuc2VhcmNoID0gcGFyc2VyLnNlYXJjaC5zdWJzdHIoMSk7ICAgLy8gPT4gXCI/c2VhcmNoPXRlc3RcIlxuXG5cdFx0dGhpcy5wYXJzZVBhcmFtZXRlcnMoKTtcblx0fVxuXG5cdHByaXZhdGUgcGFyc2VQYXJhbWV0ZXJzKCkge1xuXHRcdHRoaXMucGFyYW1ldGVycyA9IHt9O1xuXG5cdFx0Y29uc3QgcGFyYW1zR3JvdXAgPSB0aGlzLnNlYXJjaC5zcGxpdChcIiZcIik7XG5cdFx0Zm9yKGNvbnN0IHBhcmFtIG9mIHBhcmFtc0dyb3VwKSB7XG5cdFx0XHRjb25zdCBba2V5LCB2YWx1ZV0gPSBwYXJhbS5zcGxpdChcIj1cIik7XG5cdFx0XHR0aGlzLnBhcmFtZXRlcnNba2V5XSA9IHZhbHVlO1xuXHRcdH1cblx0fVxuXG5cdHB1YmxpYyBmaW5kUGFyYW0ocGFyYW06IHN0cmluZykgOiBhbnkge1xuXHRcdHJldHVybiB0aGlzLnBhcmFtZXRlcnNbcGFyYW1dIHx8IG51bGw7XG5cdH1cblxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIEFUU0V2ZW50IHtcblx0YmFzaWNWYWxpZGF0aW9uKGVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XG5cdFx0aWYgKGVsZW1lbnQuaGFzQXR0cmlidXRlKFwiZGF0YS1pZ25vcmVcIikpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdFx0aWYgKGVsZW1lbnQuaGFzQXR0cmlidXRlKFwiQGNsaWNrXCIpKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHRcdHJldHVybiB0cnVlO1xuXHR9XG59IiwiaW1wb3J0IElFdmVudCBmcm9tIFwiLi4vaW50ZWZhY2VzL0lFdmVudFwiO1xuaW1wb3J0IEFUU0V2ZW50IGZyb20gXCIuL0FUU0V2ZW50XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEF0dGFjaG1lbnRPcGVuIGV4dGVuZHMgQVRTRXZlbnQgaW1wbGVtZW50cyBJRXZlbnQge1xuXHRnZXQgc2hvdWxkRGVib3VuY2UoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCB0cmlnZ2VyKCk6IG51bGwge1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cdGdldCBzb3VyY2UoKTogbnVsbCB7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblx0Z2V0IG5hbWUoKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gXCJhdHRhY2htZW50X29wZW5lZFwiO1xuXHR9XG5cdGdldCBoYXNUeXBlcygpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0Z2V0IHJlZGlyZWN0T25GaW5pc2goKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCBpc0Jsb2NraW5nKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdGdldCBhbGxvd011bHRpcGxlKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRpc1ZhbGlkKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG59IiwiaW1wb3J0IElFdmVudCBmcm9tIFwiLi4vaW50ZWZhY2VzL0lFdmVudFwiO1xuaW1wb3J0IEFUU0V2ZW50IGZyb20gXCIuL0FUU0V2ZW50XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsaWNrIGV4dGVuZHMgQVRTRXZlbnQgaW1wbGVtZW50cyBJRXZlbnQge1xuXHRnZXQgc2hvdWxkRGVib3VuY2UoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCB0cmlnZ2VyKCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIFwiY2xpY2tcIjtcblx0fVxuXHRnZXQgc291cmNlKCk6IFdpbmRvdyB7XG5cdFx0cmV0dXJuIHdpbmRvdztcblx0fVxuXHRnZXQgbmFtZSgpOiBzdHJpbmcge1xuXHRcdHJldHVybiBcImJ1dHRvbl9jbGlja2VkXCI7XG5cdH1cblx0Z2V0IGhhc1R5cGVzKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdGdldCByZWRpcmVjdE9uRmluaXNoKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdGdldCBpc0Jsb2NraW5nKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRnZXQgYWxsb3dNdWx0aXBsZSgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7IFxuXHR9XG5cblx0aXNWYWxpZChldmVudDogRXZlbnQpOiBib29sZWFuIHtcblx0XHRpZiAoZXZlbnQ/LnRhcmdldCBpbnN0YW5jZW9mIEhUTUxBbmNob3JFbGVtZW50KSB7XG5cdFx0XHRyZXR1cm4gdGhpcy52YWxpZGF0ZUFuY2hvcihldmVudC50YXJnZXQpO1xuXHRcdH1cblx0XHRcblxuXHRcdGlmIChldmVudD8udGFyZ2V0IGluc3RhbmNlb2YgSFRNTEJ1dHRvbkVsZW1lbnQpIHtcblx0XHRcdHJldHVybiB0aGlzLnZhbGlkYXRlQnV0dG9uKGV2ZW50LnRhcmdldCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0cHJpdmF0ZSB2YWxpZGF0ZUFuY2hvcihlbGVtZW50OiBIVE1MRWxlbWVudCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0aGlzLmJhc2ljVmFsaWRhdGlvbihlbGVtZW50KTtcblx0fVxuXG5cdHByaXZhdGUgdmFsaWRhdGVCdXR0b24oZWxlbWVudDogSFRNTEVsZW1lbnQpOiBib29sZWFuIHtcblx0XHRpZiAoIXRoaXMuYmFzaWNWYWxpZGF0aW9uKGVsZW1lbnQpIHx8IChlbGVtZW50Lmhhc0F0dHJpYnV0ZShcInR5cGVcIikgJiYgZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJ0eXBlXCIpID09PSBcInN1Ym1pdFwiKSkge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0XHRcdFxuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cbn0iLCJpbXBvcnQgSUV2ZW50IGZyb20gXCIuLi9pbnRlZmFjZXMvSUV2ZW50XCI7XG5pbXBvcnQgQVRTRXZlbnQgZnJvbSBcIi4vQVRTRXZlbnRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRG93bmxvYWQgZXh0ZW5kcyBBVFNFdmVudCBpbXBsZW1lbnRzIElFdmVudCB7XG5cdGdldCBzaG91bGREZWJvdW5jZSgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0Z2V0IHRyaWdnZXIoKTogbnVsbCB7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblx0Z2V0IHNvdXJjZSgpOiBudWxsIHtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXHRnZXQgbmFtZSgpOiBzdHJpbmcge1xuXHRcdHJldHVybiBcImRvd25sb2FkX2ZpbGVfZXZlbnRcIjtcblx0fVxuXHRnZXQgaGFzVHlwZXMoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCByZWRpcmVjdE9uRmluaXNoKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdGdldCBpc0Jsb2NraW5nKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdGdldCBhbGxvd011bHRpcGxlKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRpc1ZhbGlkKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cbn0iLCJpbXBvcnQgSUV2ZW50IGZyb20gXCIuLi9pbnRlZmFjZXMvSUV2ZW50XCI7XG5pbXBvcnQgQVRTRXZlbnQgZnJvbSBcIi4vQVRTRXZlbnRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXh0ZW5zaW9uIGV4dGVuZHMgQVRTRXZlbnQgaW1wbGVtZW50cyBJRXZlbnQge1xuXHRnZXQgc2hvdWxkRGVib3VuY2UoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCB0cmlnZ2VyKCk6IG51bGwge1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cdGdldCBzb3VyY2UoKTogbnVsbCB7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblx0Z2V0IG5hbWUoKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gXCJleHRlbnNpb25faW5zdGFsbGVkXCI7XG5cdH1cblx0Z2V0IGhhc1R5cGVzKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRnZXQgcmVkaXJlY3RPbkZpbmlzaCgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXHRnZXQgaXNCbG9ja2luZygpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXHRnZXQgYWxsb3dNdWx0aXBsZSgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0aXNWYWxpZCgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG59IiwiaW1wb3J0IElFdmVudCBmcm9tIFwiLi4vaW50ZWZhY2VzL0lFdmVudFwiO1xuaW1wb3J0IEFUU0V2ZW50IGZyb20gXCIuL0FUU0V2ZW50XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZpbGVEb3dubG9hZCBleHRlbmRzIEFUU0V2ZW50IGltcGxlbWVudHMgSUV2ZW50IHtcblx0Z2V0IHNob3VsZERlYm91bmNlKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRnZXQgdHJpZ2dlcigpOiBudWxsIHtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXHRnZXQgc291cmNlKCk6IG51bGwge1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cdGdldCBuYW1lKCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIFwiZmlsZV9kb3dubG9hZFwiO1xuXHR9XG5cdGdldCBoYXNUeXBlcygpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXHRnZXQgcmVkaXJlY3RPbkZpbmlzaCgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0Z2V0IGlzQmxvY2tpbmcoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XHRcblx0Z2V0IGFsbG93TXVsdGlwbGUoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0aXNWYWxpZChldmVudDogRXZlbnQpOiBib29sZWFuIHtcblx0XHRpZiAoZXZlbnQ/LnRhcmdldCBpbnN0YW5jZW9mIEhUTUxBbmNob3JFbGVtZW50KSB7XG5cdFx0XHRyZXR1cm4gdGhpcy52YWxpZGF0ZUFuY2hvcihldmVudC50YXJnZXQpO1xuXHRcdH1cblx0XHRcblxuXHRcdGlmIChldmVudD8udGFyZ2V0IGluc3RhbmNlb2YgSFRNTEJ1dHRvbkVsZW1lbnQpIHtcblx0XHRcdHJldHVybiB0aGlzLnZhbGlkYXRlQnV0dG9uKGV2ZW50LnRhcmdldCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0cHJpdmF0ZSB2YWxpZGF0ZUFuY2hvcihlbGVtZW50OiBIVE1MRWxlbWVudCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0aGlzLmJhc2ljVmFsaWRhdGlvbihlbGVtZW50KTtcblx0fVxuXG5cdHByaXZhdGUgdmFsaWRhdGVCdXR0b24oZWxlbWVudDogSFRNTEVsZW1lbnQpOiBib29sZWFuIHtcblx0XHRpZiAoIXRoaXMuYmFzaWNWYWxpZGF0aW9uKGVsZW1lbnQpIHx8IChlbGVtZW50Lmhhc0F0dHJpYnV0ZShcInR5cGVcIikgJiYgZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJ0eXBlXCIpID09PSBcInN1Ym1pdFwiKSkge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0XHRcdFxuXHRcdHJldHVybiB0cnVlO1xuXHR9XG59ICIsImltcG9ydCBJRXZlbnQgZnJvbSBcIi4uL2ludGVmYWNlcy9JRXZlbnRcIjtcbmltcG9ydCBBVFNFdmVudCBmcm9tIFwiLi9BVFNFdmVudFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGaWxlT3BlbiBleHRlbmRzIEFUU0V2ZW50IGltcGxlbWVudHMgSUV2ZW50IHtcblx0Z2V0IHNob3VsZERlYm91bmNlKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRnZXQgdHJpZ2dlcigpOiBudWxsIHtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXHRnZXQgc291cmNlKCk6IG51bGwge1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cdGdldCBuYW1lKCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIFwiZmlsZV9vcGVuZWRcIjtcblx0fVxuXHRnZXQgaGFzVHlwZXMoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCByZWRpcmVjdE9uRmluaXNoKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdGdldCBpc0Jsb2NraW5nKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdGdldCBhbGxvd011bHRpcGxlKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRpc1ZhbGlkKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cbn0iLCJpbXBvcnQgSUV2ZW50IGZyb20gXCIuLi9pbnRlZmFjZXMvSUV2ZW50XCI7XG5pbXBvcnQgQVRTRXZlbnQgZnJvbSBcIi4vQVRTRXZlbnRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW5wdXQgZXh0ZW5kcyBBVFNFdmVudCBpbXBsZW1lbnRzIElFdmVudCB7XG5cdGdldCBzaG91bGREZWJvdW5jZSgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXHRnZXQgdHJpZ2dlcigpOiBzdHJpbmcge1xuXHRcdHJldHVybiBcImlucHV0XCI7XG5cdH1cblx0Z2V0IHNvdXJjZSgpOiBXaW5kb3cge1xuXHRcdHJldHVybiB3aW5kb3c7XG5cdH1cblx0Z2V0IG5hbWUoKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gXCJpbnB1dF9maWxsZWRcIjtcblx0fVxuXHRnZXQgaGFzVHlwZXMoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblx0Z2V0IHJlZGlyZWN0T25GaW5pc2goKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCBpc0Jsb2NraW5nKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVx0XG5cdGdldCBhbGxvd011bHRpcGxlKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0aXNWYWxpZChldmVudDogRXZlbnQpOiBib29sZWFuIHtcblx0XHRpZiAoZXZlbnQudGFyZ2V0IGluc3RhbmNlb2YgSFRNTElucHV0RWxlbWVudCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuYmFzaWNWYWxpZGF0aW9uKGV2ZW50LnRhcmdldCkgJiYgISFldmVudC50YXJnZXQudmFsdWUudHJpbSgpO1xuXHRcdH1cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn0gIiwiaW1wb3J0IElFdmVudCBmcm9tIFwiLi4vaW50ZWZhY2VzL0lFdmVudFwiO1xuaW1wb3J0IEFUU0V2ZW50IGZyb20gXCIuL0FUU0V2ZW50XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExvY2F0aW9uIGV4dGVuZHMgQVRTRXZlbnQgaW1wbGVtZW50cyBJRXZlbnQge1xuXHRnZXQgc2hvdWxkRGVib3VuY2UoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCB0cmlnZ2VyKCk6IG51bGwge1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cdGdldCBzb3VyY2UoKTogbnVsbCB7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblx0Z2V0IG5hbWUoKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gXCJsb2NhdGlvbl9hY2NlcHRlZFwiO1xuXHR9XG5cdGdldCBoYXNUeXBlcygpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0Z2V0IHJlZGlyZWN0T25GaW5pc2goKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblx0Z2V0IGlzQmxvY2tpbmcoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblx0Z2V0IGFsbG93TXVsdGlwbGUoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGlzVmFsaWQoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxufSIsImltcG9ydCBJRXZlbnQgZnJvbSBcIi4uL2ludGVmYWNlcy9JRXZlbnRcIjtcbmltcG9ydCBBVFNFdmVudCBmcm9tIFwiLi9BVFNFdmVudFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNaWNyb3Bob25lIGV4dGVuZHMgQVRTRXZlbnQgaW1wbGVtZW50cyBJRXZlbnQge1xuXHRnZXQgc2hvdWxkRGVib3VuY2UoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCB0cmlnZ2VyKCk6IG51bGwge1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cdGdldCBzb3VyY2UoKTogbnVsbCB7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblx0Z2V0IG5hbWUoKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gXCJtaWNfYWNjZXB0ZWRcIjtcblx0fVxuXHRnZXQgaGFzVHlwZXMoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCByZWRpcmVjdE9uRmluaXNoKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdGdldCBpc0Jsb2NraW5nKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdGdldCBhbGxvd011bHRpcGxlKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRpc1ZhbGlkKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cbn0iLCJpbXBvcnQgSUV2ZW50IGZyb20gXCIuLi9pbnRlZmFjZXMvSUV2ZW50XCI7XG5pbXBvcnQgQVRTRXZlbnQgZnJvbSBcIi4vQVRTRXZlbnRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTm90aWZpY2F0aW9uIGV4dGVuZHMgQVRTRXZlbnQgaW1wbGVtZW50cyBJRXZlbnQge1xuXHRnZXQgc2hvdWxkRGVib3VuY2UoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCB0cmlnZ2VyKCk6IG51bGwge1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cdGdldCBzb3VyY2UoKTogbnVsbCB7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblx0Z2V0IG5hbWUoKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gXCJub3RpZmljYXRpb25fYWNjZXB0ZWRcIjtcblx0fVxuXHRnZXQgaGFzVHlwZXMoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCByZWRpcmVjdE9uRmluaXNoKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdGdldCBpc0Jsb2NraW5nKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdGdldCBhbGxvd011bHRpcGxlKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRpc1ZhbGlkKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cbn0iLCJpbXBvcnQgSUV2ZW50IGZyb20gXCIuLi9pbnRlZmFjZXMvSUV2ZW50XCI7XG5pbXBvcnQgQVRTRXZlbnQgZnJvbSBcIi4vQVRTRXZlbnRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGFnZUxvYWRlZCBleHRlbmRzIEFUU0V2ZW50IGltcGxlbWVudHMgSUV2ZW50IHtcblx0Z2V0IHNob3VsZERlYm91bmNlKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRnZXQgdHJpZ2dlcigpOiBudWxsIHtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXHRnZXQgc291cmNlKCk6IERvY3VtZW50IHtcblx0XHRyZXR1cm4gZG9jdW1lbnQ7XG5cdH1cblx0Z2V0IG5hbWUoKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gXCJwYWdlX2xlZnRcIjtcblx0fVxuXHRnZXQgaGFzVHlwZXMoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCByZWRpcmVjdE9uRmluaXNoKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRnZXQgaXNCbG9ja2luZygpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0Z2V0IGFsbG93TXVsdGlwbGUoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGlzVmFsaWQoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGRvY3VtZW50LnZpc2liaWxpdHlTdGF0ZSA9PT0gXCJoaWRkZW5cIjtcblx0fVxufSIsImltcG9ydCBJRXZlbnQgZnJvbSBcIi4uL2ludGVmYWNlcy9JRXZlbnRcIjtcbmltcG9ydCBBVFNFdmVudCBmcm9tIFwiLi9BVFNFdmVudFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYWdlTG9hZGVkIGV4dGVuZHMgQVRTRXZlbnQgaW1wbGVtZW50cyBJRXZlbnQge1xuXHRnZXQgc2hvdWxkRGVib3VuY2UoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCB0cmlnZ2VyKCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIFwibG9hZFwiO1xuXHR9XG5cdGdldCBzb3VyY2UoKTogV2luZG93IHtcblx0XHRyZXR1cm4gd2luZG93O1xuXHR9XG5cdGdldCBuYW1lKCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIFwicGFnZV9sb2FkZWRcIjtcblx0fVxuXHRnZXQgaGFzVHlwZXMoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCByZWRpcmVjdE9uRmluaXNoKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRnZXQgaXNCbG9ja2luZygpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0Z2V0IGFsbG93TXVsdGlwbGUoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGlzVmFsaWQoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cbn0iLCJpbXBvcnQgSUV2ZW50IGZyb20gXCIuLi9pbnRlZmFjZXMvSUV2ZW50XCI7XG5pbXBvcnQgQVRTRXZlbnQgZnJvbSBcIi4vQVRTRXZlbnRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGFnZVJlYWQgZXh0ZW5kcyBBVFNFdmVudCBpbXBsZW1lbnRzIElFdmVudCB7XG5cdHByaXZhdGUgbWluU2Nyb2xsUGVyY2VudGFnZSA9IDcwO1xuXHRwcml2YXRlIG1pblN0YXlTZWNvbmRzID0gMioxMDAwO1xuXHRwcml2YXRlIGhhc1Njcm9sbGVkID0gZmFsc2U7XG5cdHByaXZhdGUgaGFzU3RheWVkID0gZmFsc2U7XG5cdHByaXZhdGUgY3VzdG9tRXZlbnQ6IEV2ZW50O1xuXHRwcml2YXRlIHRpbWVvdXQ6IGFueTtcblxuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpO1xuXHRcdHRoaXMuY3VzdG9tRXZlbnQgPSBuZXcgRXZlbnQodGhpcy50cmlnZ2VyKTtcblx0XHR0aGlzLmVuYWJsZSgpO1xuXHRcdGNvbnNvbGUubG9nKFwiUGFnZSByZWFkIGVuYWJsZWRcIik7XG5cdH1cblxuXHRnZXQgc2hvdWxkRGVib3VuY2UoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCB0cmlnZ2VyKCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIFwicGFnZV9yZWFkXCI7XG5cdH1cblx0Z2V0IHNvdXJjZSgpOiBXaW5kb3cge1xuXHRcdHJldHVybiB3aW5kb3c7XG5cdH1cblx0Z2V0IG5hbWUoKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gXCJwYWdlX3JlYWRcIjtcblx0fVxuXHRnZXQgaGFzVHlwZXMoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCByZWRpcmVjdE9uRmluaXNoKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRnZXQgaXNCbG9ja2luZygpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0Z2V0IGFsbG93TXVsdGlwbGUoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGlzVmFsaWQoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHRwcml2YXRlIGVuYWJsZSgpIHtcblx0XHR3aW5kb3cub25zY3JvbGwgPSAoKSA9PiB0aGlzLnNjcm9sbGVkKCk7XG5cdFx0dGhpcy5kZXRlY3RGb2N1cygpO1xuXHRcdHRoaXMuZGV0ZWN0VmlzaWJpbGl0eSgpO1xuXHRcdHRoaXMuc2Nyb2xsZWQoKTtcblx0XHR0aGlzLnRpbWVvdXQgPSBzZXRUaW1lb3V0ICgoKSA9PiB0aGlzLnN0YXllZCgpLCB0aGlzLm1pblN0YXlTZWNvbmRzKTtcblx0fVxuXG5cdHByaXZhdGUgZ2V0IHZpc2liaWxpdHlQcm9wcygpIDogW3N0cmluZywgc3RyaW5nXSB7XG5cdFx0aWYgKHR5cGVvZiBkb2N1bWVudC5oaWRkZW4gIT09IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdHJldHVybiBbXCJ2aXNpYmlsaXR5Y2hhbmdlXCIsIFwidmlzaWJpbGl0eVN0YXRlXCJdO1xuXHRcdH1cblx0XHRlbHNlIGlmICh0eXBlb2YgKGRvY3VtZW50IGFzIGFueSkubW96SGlkZGVuICE9PSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRyZXR1cm4gW1wibW96dmlzaWJpbGl0eWNoYW5nZVwiLCBcIm1velZpc2liaWxpdHlTdGF0ZVwiXTtcblx0XHR9XG5cdFx0ZWxzZSBpZiAodHlwZW9mIChkb2N1bWVudCBhcyBhbnkpLm1zSGlkZGVuICE9PSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRyZXR1cm4gW1wibXN2aXNpYmlsaXR5Y2hhbmdlXCIsIFwibXNWaXNpYmlsaXR5U3RhdGVcIl07XG5cdFx0fVxuXHRcdGVsc2UgaWYgKHR5cGVvZiAoZG9jdW1lbnQgYXMgYW55KS53ZWJraXRIaWRkZW4gIT09IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdHJldHVybiBbXCJ3ZWJraXR2aXNpYmlsaXR5Y2hhbmdlXCIsIFwid2Via2l0VmlzaWJpbGl0eVN0YXRlXCJdO1xuXHRcdH1cblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJWaXNpYmlsaXR5IG5vdCBzdXBwb3J0ZWQuXCIpO1xuXHR9XG5cblx0cHJpdmF0ZSBkZXRlY3RGb2N1cygpIHtcblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImZvY3VzXCIsIHRoaXMuZm9jdXNHcmFudGVkLmJpbmQodGhpcykpO1xuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiYmx1clwiLCB0aGlzLmZvY3VzTG9zdC5iaW5kKHRoaXMpKTtcblx0fVxuXG5cdHByaXZhdGUgZGV0ZWN0VmlzaWJpbGl0eSgpIHtcblx0XHQvLyBjaGVjayB0aGUgdmlzaWJsaWxpdHkgb2YgdGhlIHBhZ2Vcblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgW3Zpc2liaWxpdHlDaGFuZ2VdID0gdGhpcy52aXNpYmlsaXR5UHJvcHM7XG5cdFx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKHZpc2liaWxpdHlDaGFuZ2UsIHRoaXMudmlzaWJpbGl0eUNoYW5nZWQuYmluZCh0aGlzKSk7XG5cdFx0fSBjYXRjaChfKSB7XG5cdFx0XHQvL1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgc3RvcERldGVjdGluZ1Zpc2liaWxpdHkoKSB7XG5cdFx0Ly8gY2hlY2sgdGhlIHZpc2libGlsaXR5IG9mIHRoZSBwYWdlXG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IFt2aXNpYmlsaXR5Q2hhbmdlXSA9IHRoaXMudmlzaWJpbGl0eVByb3BzO1xuXHRcdFx0ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcih2aXNpYmlsaXR5Q2hhbmdlLCB0aGlzLnZpc2liaWxpdHlDaGFuZ2VkLmJpbmQodGhpcykpO1xuXHRcdH0gY2F0Y2goXykge1xuXHRcdFx0Ly9cblx0XHRcdHJldHVybjtcblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIHZpc2liaWxpdHlDaGFuZ2VkKCkge1xuXHRcdGNvbnN0IFtfLCB2aXNpYmlsaXR5U3RhdGVdID0gdGhpcy52aXNpYmlsaXR5UHJvcHM7XG5cdFx0dGhpcy50b2dnbGVUaW1lcihkb2N1bWVudFt2aXNpYmlsaXR5U3RhdGVdID09PSBcInZpc2libGVcIik7XG5cdH1cblxuXHRwcml2YXRlIGZvY3VzR3JhbnRlZCgpIHtcblx0XHR0aGlzLnRvZ2dsZVRpbWVyKHRydWUpO1xuXHR9XG5cblx0cHJpdmF0ZSBmb2N1c0xvc3QoKSB7XG5cdFx0dGhpcy50b2dnbGVUaW1lcihmYWxzZSk7XG5cdH1cblxuXHRwcml2YXRlIHRvZ2dsZVRpbWVyKHN0YXR1czogYm9vbGVhbikge1xuXHRcdGlmICh0aGlzLmhhc1N0YXllZCkgeyByZXR1cm47IH1cblxuXHRcdGlmKHN0YXR1cykge1xuXHRcdFx0dGhpcy50aW1lb3V0ID0gc2V0VGltZW91dCAoKCkgPT4gdGhpcy5zdGF5ZWQoKSwgdGhpcy5taW5TdGF5U2Vjb25kcyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXQpO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgZGlzYWJsZSgpIHtcblx0XHR3aW5kb3cub25zY3JvbGwgPSBudWxsO1xuXHRcdHRoaXMuc3RvcERldGVjdGluZ1Zpc2liaWxpdHkoKTtcblx0XHR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImZvY3VzXCIsIHRoaXMuZm9jdXNHcmFudGVkLmJpbmQodGhpcykpO1xuXHRcdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwiYmx1clwiLCB0aGlzLmZvY3VzTG9zdC5iaW5kKHRoaXMpKTtcblx0fVxuXG5cdHByaXZhdGUgZ2V0U2Nyb2xsUGVyY2VudCgpIHtcblx0XHRyZXR1cm4gKChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wICsgZG9jdW1lbnQuYm9keS5zY3JvbGxUb3ApIC8gKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxIZWlnaHQgLSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0KSAqIDEwMCk7XG5cdH1cblxuXHRwcml2YXRlIHNjcm9sbGVkKCkge1xuXHRcdGlmKHRoaXMuZ2V0U2Nyb2xsUGVyY2VudCgpID4gdGhpcy5taW5TY3JvbGxQZXJjZW50YWdlKSB7XG5cdFx0XHRpZih0aGlzLmhhc1N0YXllZCkge1xuXHRcdFx0XHR0aGlzLmRpc3BhdGNoKCk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLmhhc1Njcm9sbGVkID0gdHJ1ZTtcblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIHN0YXllZCgpIHtcblx0XHRpZih0aGlzLmhhc1Njcm9sbGVkKSB7XG5cdFx0XHR0aGlzLmRpc3BhdGNoKCk7XG5cdFx0fVxuXHRcdHRoaXMuaGFzU3RheWVkID0gdHJ1ZTtcblx0fVxuXG5cdHByaXZhdGUgZGlzcGF0Y2goKSB7XG5cdFx0d2luZG93LmRpc3BhdGNoRXZlbnQodGhpcy5jdXN0b21FdmVudCk7XG5cdFx0dGhpcy5kaXNhYmxlKCk7XG5cdH1cbn0iLCJpbXBvcnQgSUV2ZW50IGZyb20gXCIuLi9pbnRlZmFjZXMvSUV2ZW50XCI7XG5pbXBvcnQgQVRTRXZlbnQgZnJvbSBcIi4vQVRTRXZlbnRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3VibWl0IGV4dGVuZHMgQVRTRXZlbnQgaW1wbGVtZW50cyBJRXZlbnQge1xuXHRnZXQgc2hvdWxkRGVib3VuY2UoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCB0cmlnZ2VyKCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIFwic3VibWl0XCI7XG5cdH1cblx0Z2V0IHNvdXJjZSgpOiBXaW5kb3cge1xuXHRcdHJldHVybiB3aW5kb3c7XG5cdH1cblx0Z2V0IG5hbWUoKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gXCJmb3JtX3N1Ym1pdHRlZFwiO1xuXHR9XG5cdGdldCBoYXNUeXBlcygpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXHRnZXQgcmVkaXJlY3RPbkZpbmlzaCgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXHRnZXQgaXNCbG9ja2luZygpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXHRnZXQgYWxsb3dNdWx0aXBsZSgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0aXNWYWxpZChldmVudDogRXZlbnQpOiBib29sZWFuIHtcblx0XHRpZiAoZXZlbnQudGFyZ2V0IGluc3RhbmNlb2YgSFRNTEZvcm1FbGVtZW50KSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5iYXNpY1ZhbGlkYXRpb24oZXZlbnQudGFyZ2V0KTtcblx0XHR9XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG4gICAgXG59IiwiaW1wb3J0IElFdmVudCBmcm9tIFwiLi4vaW50ZWZhY2VzL0lFdmVudFwiO1xuaW1wb3J0IEFUU0V2ZW50IGZyb20gXCIuL0FUU0V2ZW50XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdlYmNhbSBleHRlbmRzIEFUU0V2ZW50IGltcGxlbWVudHMgSUV2ZW50IHtcblx0Z2V0IHNob3VsZERlYm91bmNlKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRnZXQgdHJpZ2dlcigpOiBudWxsIHtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXHRnZXQgc291cmNlKCk6IG51bGwge1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cdGdldCBuYW1lKCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIFwid2ViY2FtX2FjY2VwdGVkXCI7XG5cdH1cblx0Z2V0IGhhc1R5cGVzKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRnZXQgcmVkaXJlY3RPbkZpbmlzaCgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXHRnZXQgaXNCbG9ja2luZygpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXHRnZXQgYWxsb3dNdWx0aXBsZSgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0aXNWYWxpZCgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG59IiwiLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vKiBVQVBhcnNlci5qcyB2MS4wLjM1XG4gICBDb3B5cmlnaHQgwqkgMjAxMi0yMDIxIEZhaXNhbCBTYWxtYW4gPGZAZmFpc2FsbWFuLmNvbT5cbiAgIE1JVCBMaWNlbnNlICovLypcbiAgIERldGVjdCBCcm93c2VyLCBFbmdpbmUsIE9TLCBDUFUsIGFuZCBEZXZpY2UgdHlwZS9tb2RlbCBmcm9tIFVzZXItQWdlbnQgZGF0YS5cbiAgIFN1cHBvcnRzIGJyb3dzZXIgJiBub2RlLmpzIGVudmlyb25tZW50LiBcbiAgIERlbW8gICA6IGh0dHBzOi8vZmFpc2FsbWFuLmdpdGh1Yi5pby91YS1wYXJzZXItanNcbiAgIFNvdXJjZSA6IGh0dHBzOi8vZ2l0aHViLmNvbS9mYWlzYWxtYW4vdWEtcGFyc2VyLWpzICovXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuKGZ1bmN0aW9uICh3aW5kb3csIHVuZGVmaW5lZCkge1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgLy8vLy8vLy8vLy8vLy9cbiAgICAvLyBDb25zdGFudHNcbiAgICAvLy8vLy8vLy8vLy8vXG5cblxuICAgIHZhciBMSUJWRVJTSU9OICA9ICcxLjAuMzUnLFxuICAgICAgICBFTVBUWSAgICAgICA9ICcnLFxuICAgICAgICBVTktOT1dOICAgICA9ICc/JyxcbiAgICAgICAgRlVOQ19UWVBFICAgPSAnZnVuY3Rpb24nLFxuICAgICAgICBVTkRFRl9UWVBFICA9ICd1bmRlZmluZWQnLFxuICAgICAgICBPQkpfVFlQRSAgICA9ICdvYmplY3QnLFxuICAgICAgICBTVFJfVFlQRSAgICA9ICdzdHJpbmcnLFxuICAgICAgICBNQUpPUiAgICAgICA9ICdtYWpvcicsXG4gICAgICAgIE1PREVMICAgICAgID0gJ21vZGVsJyxcbiAgICAgICAgTkFNRSAgICAgICAgPSAnbmFtZScsXG4gICAgICAgIFRZUEUgICAgICAgID0gJ3R5cGUnLFxuICAgICAgICBWRU5ET1IgICAgICA9ICd2ZW5kb3InLFxuICAgICAgICBWRVJTSU9OICAgICA9ICd2ZXJzaW9uJyxcbiAgICAgICAgQVJDSElURUNUVVJFPSAnYXJjaGl0ZWN0dXJlJyxcbiAgICAgICAgQ09OU09MRSAgICAgPSAnY29uc29sZScsXG4gICAgICAgIE1PQklMRSAgICAgID0gJ21vYmlsZScsXG4gICAgICAgIFRBQkxFVCAgICAgID0gJ3RhYmxldCcsXG4gICAgICAgIFNNQVJUVFYgICAgID0gJ3NtYXJ0dHYnLFxuICAgICAgICBXRUFSQUJMRSAgICA9ICd3ZWFyYWJsZScsXG4gICAgICAgIEVNQkVEREVEICAgID0gJ2VtYmVkZGVkJyxcbiAgICAgICAgVUFfTUFYX0xFTkdUSCA9IDM1MDtcblxuICAgIHZhciBBTUFaT04gID0gJ0FtYXpvbicsXG4gICAgICAgIEFQUExFICAgPSAnQXBwbGUnLFxuICAgICAgICBBU1VTICAgID0gJ0FTVVMnLFxuICAgICAgICBCTEFDS0JFUlJZID0gJ0JsYWNrQmVycnknLFxuICAgICAgICBCUk9XU0VSID0gJ0Jyb3dzZXInLFxuICAgICAgICBDSFJPTUUgID0gJ0Nocm9tZScsXG4gICAgICAgIEVER0UgICAgPSAnRWRnZScsXG4gICAgICAgIEZJUkVGT1ggPSAnRmlyZWZveCcsXG4gICAgICAgIEdPT0dMRSAgPSAnR29vZ2xlJyxcbiAgICAgICAgSFVBV0VJICA9ICdIdWF3ZWknLFxuICAgICAgICBMRyAgICAgID0gJ0xHJyxcbiAgICAgICAgTUlDUk9TT0ZUID0gJ01pY3Jvc29mdCcsXG4gICAgICAgIE1PVE9ST0xBICA9ICdNb3Rvcm9sYScsXG4gICAgICAgIE9QRVJBICAgPSAnT3BlcmEnLFxuICAgICAgICBTQU1TVU5HID0gJ1NhbXN1bmcnLFxuICAgICAgICBTSEFSUCAgID0gJ1NoYXJwJyxcbiAgICAgICAgU09OWSAgICA9ICdTb255JyxcbiAgICAgICAgVklFUkEgICA9ICdWaWVyYScsXG4gICAgICAgIFhJQU9NSSAgPSAnWGlhb21pJyxcbiAgICAgICAgWkVCUkEgICA9ICdaZWJyYScsXG4gICAgICAgIEZBQ0VCT09LICAgID0gJ0ZhY2Vib29rJyxcbiAgICAgICAgQ0hST01JVU1fT1MgPSAnQ2hyb21pdW0gT1MnLFxuICAgICAgICBNQUNfT1MgID0gJ01hYyBPUyc7XG5cbiAgICAvLy8vLy8vLy8vL1xuICAgIC8vIEhlbHBlclxuICAgIC8vLy8vLy8vLy9cblxuICAgIHZhciBleHRlbmQgPSBmdW5jdGlvbiAocmVnZXhlcywgZXh0ZW5zaW9ucykge1xuICAgICAgICAgICAgdmFyIG1lcmdlZFJlZ2V4ZXMgPSB7fTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgaW4gcmVnZXhlcykge1xuICAgICAgICAgICAgICAgIGlmIChleHRlbnNpb25zW2ldICYmIGV4dGVuc2lvbnNbaV0ubGVuZ3RoICUgMiA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBtZXJnZWRSZWdleGVzW2ldID0gZXh0ZW5zaW9uc1tpXS5jb25jYXQocmVnZXhlc1tpXSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbWVyZ2VkUmVnZXhlc1tpXSA9IHJlZ2V4ZXNbaV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG1lcmdlZFJlZ2V4ZXM7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcml6ZSA9IGZ1bmN0aW9uIChhcnIpIHtcbiAgICAgICAgICAgIHZhciBlbnVtcyA9IHt9O1xuICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpPGFyci5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGVudW1zW2FycltpXS50b1VwcGVyQ2FzZSgpXSA9IGFycltpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBlbnVtcztcbiAgICAgICAgfSxcbiAgICAgICAgaGFzID0gZnVuY3Rpb24gKHN0cjEsIHN0cjIpIHtcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2Ygc3RyMSA9PT0gU1RSX1RZUEUgPyBsb3dlcml6ZShzdHIyKS5pbmRleE9mKGxvd2VyaXplKHN0cjEpKSAhPT0gLTEgOiBmYWxzZTtcbiAgICAgICAgfSxcbiAgICAgICAgbG93ZXJpemUgPSBmdW5jdGlvbiAoc3RyKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RyLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIH0sXG4gICAgICAgIG1ham9yaXplID0gZnVuY3Rpb24gKHZlcnNpb24pIHtcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2YodmVyc2lvbikgPT09IFNUUl9UWVBFID8gdmVyc2lvbi5yZXBsYWNlKC9bXlxcZFxcLl0vZywgRU1QVFkpLnNwbGl0KCcuJylbMF0gOiB1bmRlZmluZWQ7XG4gICAgICAgIH0sXG4gICAgICAgIHRyaW0gPSBmdW5jdGlvbiAoc3RyLCBsZW4pIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2Yoc3RyKSA9PT0gU1RSX1RZUEUpIHtcbiAgICAgICAgICAgICAgICBzdHIgPSBzdHIucmVwbGFjZSgvXlxcc1xccyovLCBFTVBUWSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHR5cGVvZihsZW4pID09PSBVTkRFRl9UWVBFID8gc3RyIDogc3RyLnN1YnN0cmluZygwLCBVQV9NQVhfTEVOR1RIKTtcbiAgICAgICAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8vLy8vLy8vLy8vLy8vXG4gICAgLy8gTWFwIGhlbHBlclxuICAgIC8vLy8vLy8vLy8vLy8vXG5cbiAgICB2YXIgcmd4TWFwcGVyID0gZnVuY3Rpb24gKHVhLCBhcnJheXMpIHtcblxuICAgICAgICAgICAgdmFyIGkgPSAwLCBqLCBrLCBwLCBxLCBtYXRjaGVzLCBtYXRjaDtcblxuICAgICAgICAgICAgLy8gbG9vcCB0aHJvdWdoIGFsbCByZWdleGVzIG1hcHNcbiAgICAgICAgICAgIHdoaWxlIChpIDwgYXJyYXlzLmxlbmd0aCAmJiAhbWF0Y2hlcykge1xuXG4gICAgICAgICAgICAgICAgdmFyIHJlZ2V4ID0gYXJyYXlzW2ldLCAgICAgICAvLyBldmVuIHNlcXVlbmNlICgwLDIsNCwuLilcbiAgICAgICAgICAgICAgICAgICAgcHJvcHMgPSBhcnJheXNbaSArIDFdOyAgIC8vIG9kZCBzZXF1ZW5jZSAoMSwzLDUsLi4pXG4gICAgICAgICAgICAgICAgaiA9IGsgPSAwO1xuXG4gICAgICAgICAgICAgICAgLy8gdHJ5IG1hdGNoaW5nIHVhc3RyaW5nIHdpdGggcmVnZXhlc1xuICAgICAgICAgICAgICAgIHdoaWxlIChqIDwgcmVnZXgubGVuZ3RoICYmICFtYXRjaGVzKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFyZWdleFtqXSkgeyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBtYXRjaGVzID0gcmVnZXhbaisrXS5leGVjKHVhKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoISFtYXRjaGVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHAgPSAwOyBwIDwgcHJvcHMubGVuZ3RoOyBwKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXRjaCA9IG1hdGNoZXNbKytrXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBxID0gcHJvcHNbcF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2hlY2sgaWYgZ2l2ZW4gcHJvcGVydHkgaXMgYWN0dWFsbHkgYXJyYXlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHEgPT09IE9CSl9UWVBFICYmIHEubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocS5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcVsxXSA9PSBGVU5DX1RZUEUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhc3NpZ24gbW9kaWZpZWQgbWF0Y2hcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzW3FbMF1dID0gcVsxXS5jYWxsKHRoaXMsIG1hdGNoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYXNzaWduIGdpdmVuIHZhbHVlLCBpZ25vcmUgcmVnZXggbWF0Y2hcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzW3FbMF1dID0gcVsxXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChxLmxlbmd0aCA9PT0gMykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2hlY2sgd2hldGhlciBmdW5jdGlvbiBvciByZWdleFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBxWzFdID09PSBGVU5DX1RZUEUgJiYgIShxWzFdLmV4ZWMgJiYgcVsxXS50ZXN0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNhbGwgZnVuY3Rpb24gKHVzdWFsbHkgc3RyaW5nIG1hcHBlcilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzW3FbMF1dID0gbWF0Y2ggPyBxWzFdLmNhbGwodGhpcywgbWF0Y2gsIHFbMl0pIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBzYW5pdGl6ZSBtYXRjaCB1c2luZyBnaXZlbiByZWdleFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNbcVswXV0gPSBtYXRjaCA/IG1hdGNoLnJlcGxhY2UocVsxXSwgcVsyXSkgOiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocS5sZW5ndGggPT09IDQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzW3FbMF1dID0gbWF0Y2ggPyBxWzNdLmNhbGwodGhpcywgbWF0Y2gucmVwbGFjZShxWzFdLCBxWzJdKSkgOiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzW3FdID0gbWF0Y2ggPyBtYXRjaCA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaSArPSAyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHN0ck1hcHBlciA9IGZ1bmN0aW9uIChzdHIsIG1hcCkge1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpIGluIG1hcCkge1xuICAgICAgICAgICAgICAgIC8vIGNoZWNrIGlmIGN1cnJlbnQgdmFsdWUgaXMgYXJyYXlcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG1hcFtpXSA9PT0gT0JKX1RZUEUgJiYgbWFwW2ldLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBtYXBbaV0ubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChoYXMobWFwW2ldW2pdLCBzdHIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChpID09PSBVTktOT1dOKSA/IHVuZGVmaW5lZCA6IGk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGhhcyhtYXBbaV0sIHN0cikpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChpID09PSBVTktOT1dOKSA/IHVuZGVmaW5lZCA6IGk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHN0cjtcbiAgICB9O1xuXG4gICAgLy8vLy8vLy8vLy8vLy8vXG4gICAgLy8gU3RyaW5nIG1hcFxuICAgIC8vLy8vLy8vLy8vLy8vXG5cbiAgICAvLyBTYWZhcmkgPCAzLjBcbiAgICB2YXIgb2xkU2FmYXJpTWFwID0ge1xuICAgICAgICAgICAgJzEuMCcgICA6ICcvOCcsXG4gICAgICAgICAgICAnMS4yJyAgIDogJy8xJyxcbiAgICAgICAgICAgICcxLjMnICAgOiAnLzMnLFxuICAgICAgICAgICAgJzIuMCcgICA6ICcvNDEyJyxcbiAgICAgICAgICAgICcyLjAuMicgOiAnLzQxNicsXG4gICAgICAgICAgICAnMi4wLjMnIDogJy80MTcnLFxuICAgICAgICAgICAgJzIuMC40JyA6ICcvNDE5JyxcbiAgICAgICAgICAgICc/JyAgICAgOiAnLydcbiAgICAgICAgfSxcbiAgICAgICAgd2luZG93c1ZlcnNpb25NYXAgPSB7XG4gICAgICAgICAgICAnTUUnICAgICAgICA6ICc0LjkwJyxcbiAgICAgICAgICAgICdOVCAzLjExJyAgIDogJ05UMy41MScsXG4gICAgICAgICAgICAnTlQgNC4wJyAgICA6ICdOVDQuMCcsXG4gICAgICAgICAgICAnMjAwMCcgICAgICA6ICdOVCA1LjAnLFxuICAgICAgICAgICAgJ1hQJyAgICAgICAgOiBbJ05UIDUuMScsICdOVCA1LjInXSxcbiAgICAgICAgICAgICdWaXN0YScgICAgIDogJ05UIDYuMCcsXG4gICAgICAgICAgICAnNycgICAgICAgICA6ICdOVCA2LjEnLFxuICAgICAgICAgICAgJzgnICAgICAgICAgOiAnTlQgNi4yJyxcbiAgICAgICAgICAgICc4LjEnICAgICAgIDogJ05UIDYuMycsXG4gICAgICAgICAgICAnMTAnICAgICAgICA6IFsnTlQgNi40JywgJ05UIDEwLjAnXSxcbiAgICAgICAgICAgICdSVCcgICAgICAgIDogJ0FSTSdcbiAgICB9O1xuXG4gICAgLy8vLy8vLy8vLy8vLy9cbiAgICAvLyBSZWdleCBtYXBcbiAgICAvLy8vLy8vLy8vLy8vXG5cbiAgICB2YXIgcmVnZXhlcyA9IHtcblxuICAgICAgICBicm93c2VyIDogW1tcblxuICAgICAgICAgICAgL1xcYig/OmNybW98Y3Jpb3MpXFwvKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ2hyb21lIGZvciBBbmRyb2lkL2lPU1xuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCAnQ2hyb21lJ11dLCBbXG4gICAgICAgICAgICAvZWRnKD86ZXxpb3N8YSk/XFwvKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1pY3Jvc29mdCBFZGdlXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsICdFZGdlJ11dLCBbXG5cbiAgICAgICAgICAgIC8vIFByZXN0byBiYXNlZFxuICAgICAgICAgICAgLyhvcGVyYSBtaW5pKVxcLyhbLVxcd1xcLl0rKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBPcGVyYSBNaW5pXG4gICAgICAgICAgICAvKG9wZXJhIFttb2JpbGV0YWJdezMsNn0pXFxiLit2ZXJzaW9uXFwvKFstXFx3XFwuXSspL2ksICAgICAgICAgICAgICAgICAvLyBPcGVyYSBNb2JpL1RhYmxldFxuICAgICAgICAgICAgLyhvcGVyYSkoPzouK3ZlcnNpb25cXC98W1xcLyBdKykoW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gT3BlcmFcbiAgICAgICAgICAgIF0sIFtOQU1FLCBWRVJTSU9OXSwgW1xuICAgICAgICAgICAgL29waW9zW1xcLyBdKyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBPcGVyYSBtaW5pIG9uIGlwaG9uZSA+PSA4LjBcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgT1BFUkErJyBNaW5pJ11dLCBbXG4gICAgICAgICAgICAvXFxib3ByXFwvKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBPcGVyYSBXZWJraXRcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgT1BFUkFdXSwgW1xuXG4gICAgICAgICAgICAvLyBNaXhlZFxuICAgICAgICAgICAgLyhraW5kbGUpXFwvKFtcXHdcXC5dKykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBLaW5kbGVcbiAgICAgICAgICAgIC8obHVuYXNjYXBlfG1heHRob258bmV0ZnJvbnR8amFzbWluZXxibGF6ZXIpW1xcLyBdPyhbXFx3XFwuXSopL2ksICAgICAgLy8gTHVuYXNjYXBlL01heHRob24vTmV0ZnJvbnQvSmFzbWluZS9CbGF6ZXJcbiAgICAgICAgICAgIC8vIFRyaWRlbnQgYmFzZWRcbiAgICAgICAgICAgIC8oYXZhbnQgfGllbW9iaWxlfHNsaW0pKD86YnJvd3Nlcik/W1xcLyBdPyhbXFx3XFwuXSopL2ksICAgICAgICAgICAgICAgLy8gQXZhbnQvSUVNb2JpbGUvU2xpbUJyb3dzZXJcbiAgICAgICAgICAgIC8oYmE/aWR1YnJvd3NlcilbXFwvIF0/KFtcXHdcXC5dKykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQmFpZHUgQnJvd3NlclxuICAgICAgICAgICAgLyg/Om1zfFxcKCkoaWUpIChbXFx3XFwuXSspL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBJbnRlcm5ldCBFeHBsb3JlclxuXG4gICAgICAgICAgICAvLyBXZWJraXQvS0hUTUwgYmFzZWQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZsb2NrL1JvY2tNZWx0L01pZG9yaS9FcGlwaGFueS9TaWxrL1NreWZpcmUvQm9sdC9Jcm9uL0lyaWRpdW0vUGhhbnRvbUpTL0Jvd3Nlci9RdXBaaWxsYS9GYWxrb25cbiAgICAgICAgICAgIC8oZmxvY2t8cm9ja21lbHR8bWlkb3JpfGVwaXBoYW55fHNpbGt8c2t5ZmlyZXxib2x0fGlyb258dml2YWxkaXxpcmlkaXVtfHBoYW50b21qc3xib3dzZXJ8cXVhcmt8cXVwemlsbGF8ZmFsa29ufHJla29ucXxwdWZmaW58YnJhdmV8d2hhbGUoPyEuK25hdmVyKXxxcWJyb3dzZXJsaXRlfHFxfGR1Y2tkdWNrZ28pXFwvKFstXFx3XFwuXSspL2ksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFJla29ucS9QdWZmaW4vQnJhdmUvV2hhbGUvUVFCcm93c2VyTGl0ZS9RUSwgYWthIFNob3VRXG4gICAgICAgICAgICAvKGhleXRhcHxvdmkpYnJvd3NlclxcLyhbXFxkXFwuXSspL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEhleXRhcC9PdmlcbiAgICAgICAgICAgIC8od2VpYm8pX18oW1xcZFxcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBXZWlib1xuICAgICAgICAgICAgXSwgW05BTUUsIFZFUlNJT05dLCBbXG4gICAgICAgICAgICAvKD86XFxidWM/ID9icm93c2VyfCg/Omp1Yy4rKXVjd2ViKVtcXC8gXT8oW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAvLyBVQ0Jyb3dzZXJcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgJ1VDJytCUk9XU0VSXV0sIFtcbiAgICAgICAgICAgIC9taWNyb20uK1xcYnFiY29yZVxcLyhbXFx3XFwuXSspL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdlQ2hhdCBEZXNrdG9wIGZvciBXaW5kb3dzIEJ1aWx0LWluIEJyb3dzZXJcbiAgICAgICAgICAgIC9cXGJxYmNvcmVcXC8oW1xcd1xcLl0rKS4rbWljcm9tL2lcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgJ1dlQ2hhdChXaW4pIERlc2t0b3AnXV0sIFtcbiAgICAgICAgICAgIC9taWNyb21lc3NlbmdlclxcLyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gV2VDaGF0XG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsICdXZUNoYXQnXV0sIFtcbiAgICAgICAgICAgIC9rb25xdWVyb3JcXC8oW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gS29ucXVlcm9yXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsICdLb25xdWVyb3InXV0sIFtcbiAgICAgICAgICAgIC90cmlkZW50Litydls6IF0oW1xcd1xcLl17MSw5fSlcXGIuK2xpa2UgZ2Vja28vaSAgICAgICAgICAgICAgICAgICAgICAgLy8gSUUxMVxuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCAnSUUnXV0sIFtcbiAgICAgICAgICAgIC95YSg/OnNlYXJjaCk/YnJvd3NlclxcLyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gWWFuZGV4XG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsICdZYW5kZXgnXV0sIFtcbiAgICAgICAgICAgIC8oYXZhc3R8YXZnKVxcLyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQXZhc3QvQVZHIFNlY3VyZSBCcm93c2VyXG4gICAgICAgICAgICBdLCBbW05BTUUsIC8oLispLywgJyQxIFNlY3VyZSAnK0JST1dTRVJdLCBWRVJTSU9OXSwgW1xuICAgICAgICAgICAgL1xcYmZvY3VzXFwvKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRmlyZWZveCBGb2N1c1xuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCBGSVJFRk9YKycgRm9jdXMnXV0sIFtcbiAgICAgICAgICAgIC9cXGJvcHRcXC8oW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE9wZXJhIFRvdWNoXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsIE9QRVJBKycgVG91Y2gnXV0sIFtcbiAgICAgICAgICAgIC9jb2NfY29jXFx3K1xcLyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIENvYyBDb2MgQnJvd3NlclxuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCAnQ29jIENvYyddXSwgW1xuICAgICAgICAgICAgL2RvbGZpblxcLyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBEb2xwaGluXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsICdEb2xwaGluJ11dLCBbXG4gICAgICAgICAgICAvY29hc3RcXC8oW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE9wZXJhIENvYXN0XG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsIE9QRVJBKycgQ29hc3QnXV0sIFtcbiAgICAgICAgICAgIC9taXVpYnJvd3NlclxcLyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTUlVSSBCcm93c2VyXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsICdNSVVJICcrQlJPV1NFUl1dLCBbXG4gICAgICAgICAgICAvZnhpb3NcXC8oWy1cXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZpcmVmb3ggZm9yIGlPU1xuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCBGSVJFRk9YXV0sIFtcbiAgICAgICAgICAgIC9cXGJxaWh1fChxaT9obz9vP3wzNjApYnJvd3Nlci9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDM2MFxuICAgICAgICAgICAgXSwgW1tOQU1FLCAnMzYwICcrQlJPV1NFUl1dLCBbXG4gICAgICAgICAgICAvKG9jdWx1c3xzYW1zdW5nfHNhaWxmaXNofGh1YXdlaSlicm93c2VyXFwvKFtcXHdcXC5dKykvaVxuICAgICAgICAgICAgXSwgW1tOQU1FLCAvKC4rKS8sICckMSAnK0JST1dTRVJdLCBWRVJTSU9OXSwgWyAgICAgICAgICAgICAgICAgICAgICAvLyBPY3VsdXMvU2Ftc3VuZy9TYWlsZmlzaC9IdWF3ZWkgQnJvd3NlclxuICAgICAgICAgICAgLyhjb21vZG9fZHJhZ29uKVxcLyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDb21vZG8gRHJhZ29uXG4gICAgICAgICAgICBdLCBbW05BTUUsIC9fL2csICcgJ10sIFZFUlNJT05dLCBbXG4gICAgICAgICAgICAvKGVsZWN0cm9uKVxcLyhbXFx3XFwuXSspIHNhZmFyaS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEVsZWN0cm9uLWJhc2VkIEFwcFxuICAgICAgICAgICAgLyh0ZXNsYSkoPzogcXRjYXJicm93c2VyfFxcLygyMFxcZFxcZFxcLlstXFx3XFwuXSspKS9pLCAgICAgICAgICAgICAgICAgICAvLyBUZXNsYVxuICAgICAgICAgICAgL20/KHFxYnJvd3NlcnxiYWlkdWJveGFwcHwyMzQ1RXhwbG9yZXIpW1xcLyBdPyhbXFx3XFwuXSspL2kgICAgICAgICAgICAvLyBRUUJyb3dzZXIvQmFpZHUgQXBwLzIzNDUgQnJvd3NlclxuICAgICAgICAgICAgXSwgW05BTUUsIFZFUlNJT05dLCBbXG4gICAgICAgICAgICAvKG1ldGFzcilbXFwvIF0/KFtcXHdcXC5dKykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNvdUdvdUJyb3dzZXJcbiAgICAgICAgICAgIC8obGJicm93c2VyKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTGllQmFvIEJyb3dzZXJcbiAgICAgICAgICAgIC9cXFsobGlua2VkaW4pYXBwXFxdL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBMaW5rZWRJbiBBcHAgZm9yIGlPUyAmIEFuZHJvaWRcbiAgICAgICAgICAgIF0sIFtOQU1FXSwgW1xuXG4gICAgICAgICAgICAvLyBXZWJWaWV3XG4gICAgICAgICAgICAvKCg/OmZiYW5cXC9mYmlvc3xmYl9pYWJcXC9mYjRhKSg/IS4rZmJhdil8O2ZiYXZcXC8oW1xcd1xcLl0rKTspL2kgICAgICAgLy8gRmFjZWJvb2sgQXBwIGZvciBpT1MgJiBBbmRyb2lkXG4gICAgICAgICAgICBdLCBbW05BTUUsIEZBQ0VCT09LXSwgVkVSU0lPTl0sIFtcbiAgICAgICAgICAgIC8oa2FrYW8oPzp0YWxrfHN0b3J5KSlbXFwvIF0oW1xcd1xcLl0rKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gS2FrYW8gQXBwXG4gICAgICAgICAgICAvKG5hdmVyKVxcKC4qPyhcXGQrXFwuW1xcd1xcLl0rKS4qXFwpL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE5hdmVyIEluQXBwXG4gICAgICAgICAgICAvc2FmYXJpIChsaW5lKVxcLyhbXFx3XFwuXSspL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIExpbmUgQXBwIGZvciBpT1NcbiAgICAgICAgICAgIC9cXGIobGluZSlcXC8oW1xcd1xcLl0rKVxcL2lhYi9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBMaW5lIEFwcCBmb3IgQW5kcm9pZFxuICAgICAgICAgICAgLyhjaHJvbWl1bXxpbnN0YWdyYW0pW1xcLyBdKFstXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDaHJvbWl1bS9JbnN0YWdyYW1cbiAgICAgICAgICAgIF0sIFtOQU1FLCBWRVJTSU9OXSwgW1xuICAgICAgICAgICAgL1xcYmdzYVxcLyhbXFx3XFwuXSspIC4qc2FmYXJpXFwvL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEdvb2dsZSBTZWFyY2ggQXBwbGlhbmNlIG9uIGlPU1xuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCAnR1NBJ11dLCBbXG4gICAgICAgICAgICAvbXVzaWNhbF9seSg/Oi4rYXBwXz92ZXJzaW9uXFwvfF8pKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRpa1Rva1xuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCAnVGlrVG9rJ11dLCBbXG5cbiAgICAgICAgICAgIC9oZWFkbGVzc2Nocm9tZSg/OlxcLyhbXFx3XFwuXSspfCApL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ2hyb21lIEhlYWRsZXNzXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsIENIUk9NRSsnIEhlYWRsZXNzJ11dLCBbXG5cbiAgICAgICAgICAgIC8gd3ZcXCkuKyhjaHJvbWUpXFwvKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIENocm9tZSBXZWJWaWV3XG4gICAgICAgICAgICBdLCBbW05BTUUsIENIUk9NRSsnIFdlYlZpZXcnXSwgVkVSU0lPTl0sIFtcblxuICAgICAgICAgICAgL2Ryb2lkLisgdmVyc2lvblxcLyhbXFx3XFwuXSspXFxiLisoPzptb2JpbGUgc2FmYXJpfHNhZmFyaSkvaSAgICAgICAgICAgLy8gQW5kcm9pZCBCcm93c2VyXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsICdBbmRyb2lkICcrQlJPV1NFUl1dLCBbXG5cbiAgICAgICAgICAgIC8oY2hyb21lfG9tbml3ZWJ8YXJvcmF8W3RpemVub2thXXs1fSA/YnJvd3NlcilcXC92PyhbXFx3XFwuXSspL2kgICAgICAgLy8gQ2hyb21lL09tbmlXZWIvQXJvcmEvVGl6ZW4vTm9raWFcbiAgICAgICAgICAgIF0sIFtOQU1FLCBWRVJTSU9OXSwgW1xuXG4gICAgICAgICAgICAvdmVyc2lvblxcLyhbXFx3XFwuXFwsXSspIC4qbW9iaWxlXFwvXFx3KyAoc2FmYXJpKS9pICAgICAgICAgICAgICAgICAgICAgIC8vIE1vYmlsZSBTYWZhcmlcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgJ01vYmlsZSBTYWZhcmknXV0sIFtcbiAgICAgICAgICAgIC92ZXJzaW9uXFwvKFtcXHcoXFwufFxcLCldKykgLioobW9iaWxlID9zYWZhcml8c2FmYXJpKS9pICAgICAgICAgICAgICAgIC8vIFNhZmFyaSAmIFNhZmFyaSBNb2JpbGVcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBOQU1FXSwgW1xuICAgICAgICAgICAgL3dlYmtpdC4rPyhtb2JpbGUgP3NhZmFyaXxzYWZhcmkpKFxcL1tcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAvLyBTYWZhcmkgPCAzLjBcbiAgICAgICAgICAgIF0sIFtOQU1FLCBbVkVSU0lPTiwgc3RyTWFwcGVyLCBvbGRTYWZhcmlNYXBdXSwgW1xuXG4gICAgICAgICAgICAvKHdlYmtpdHxraHRtbClcXC8oW1xcd1xcLl0rKS9pXG4gICAgICAgICAgICBdLCBbTkFNRSwgVkVSU0lPTl0sIFtcblxuICAgICAgICAgICAgLy8gR2Vja28gYmFzZWRcbiAgICAgICAgICAgIC8obmF2aWdhdG9yfG5ldHNjYXBlXFxkPylcXC8oWy1cXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE5ldHNjYXBlXG4gICAgICAgICAgICBdLCBbW05BTUUsICdOZXRzY2FwZSddLCBWRVJTSU9OXSwgW1xuICAgICAgICAgICAgL21vYmlsZSB2cjsgcnY6KFtcXHdcXC5dKylcXCkuK2ZpcmVmb3gvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBGaXJlZm94IFJlYWxpdHlcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgRklSRUZPWCsnIFJlYWxpdHknXV0sIFtcbiAgICAgICAgICAgIC9la2lvaGYuKyhmbG93KVxcLyhbXFx3XFwuXSspL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRmxvd1xuICAgICAgICAgICAgLyhzd2lmdGZveCkvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTd2lmdGZveFxuICAgICAgICAgICAgLyhpY2VkcmFnb258aWNld2Vhc2VsfGNhbWlub3xjaGltZXJhfGZlbm5lY3xtYWVtbyBicm93c2VyfG1pbmltb3xjb25rZXJvcnxrbGFyKVtcXC8gXT8oW1xcd1xcLlxcK10rKS9pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBJY2VEcmFnb24vSWNld2Vhc2VsL0NhbWluby9DaGltZXJhL0Zlbm5lYy9NYWVtby9NaW5pbW8vQ29ua2Vyb3IvS2xhclxuICAgICAgICAgICAgLyhzZWFtb25rZXl8ay1tZWxlb258aWNlY2F0fGljZWFwZXxmaXJlYmlyZHxwaG9lbml4fHBhbGVtb29ufGJhc2lsaXNrfHdhdGVyZm94KVxcLyhbLVxcd1xcLl0rKSQvaSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRmlyZWZveC9TZWFNb25rZXkvSy1NZWxlb24vSWNlQ2F0L0ljZUFwZS9GaXJlYmlyZC9QaG9lbml4XG4gICAgICAgICAgICAvKGZpcmVmb3gpXFwvKFtcXHdcXC5dKykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE90aGVyIEZpcmVmb3gtYmFzZWRcbiAgICAgICAgICAgIC8obW96aWxsYSlcXC8oW1xcd1xcLl0rKSAuK3J2XFw6LitnZWNrb1xcL1xcZCsvaSwgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTW96aWxsYVxuXG4gICAgICAgICAgICAvLyBPdGhlclxuICAgICAgICAgICAgLyhwb2xhcmlzfGx5bnh8ZGlsbG98aWNhYnxkb3Jpc3xhbWF5YXx3M218bmV0c3VyZnxzbGVpcG5pcnxvYmlnb3xtb3NhaWN8KD86Z298aWNlfHVwKVtcXC4gXT9icm93c2VyKVstXFwvIF0/dj8oW1xcd1xcLl0rKS9pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBQb2xhcmlzL0x5bngvRGlsbG8vaUNhYi9Eb3Jpcy9BbWF5YS93M20vTmV0U3VyZi9TbGVpcG5pci9PYmlnby9Nb3NhaWMvR28vSUNFL1VQLkJyb3dzZXJcbiAgICAgICAgICAgIC8obGlua3MpIFxcKChbXFx3XFwuXSspL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTGlua3NcbiAgICAgICAgICAgIC9wYW5hc29uaWM7KHZpZXJhKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUGFuYXNvbmljIFZpZXJhXG4gICAgICAgICAgICBdLCBbTkFNRSwgVkVSU0lPTl0sIFtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLyhjb2JhbHQpXFwvKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDb2JhbHRcbiAgICAgICAgICAgIF0sIFtOQU1FLCBbVkVSU0lPTiwgL21hc3Rlci58bHRzLi8sIFwiXCJdXVxuICAgICAgICBdLFxuXG4gICAgICAgIGNwdSA6IFtbXG5cbiAgICAgICAgICAgIC8oPzooYW1kfHgoPzooPzo4Nnw2NClbLV9dKT98d293fHdpbik2NClbO1xcKV0vaSAgICAgICAgICAgICAgICAgICAgIC8vIEFNRDY0ICh4NjQpXG4gICAgICAgICAgICBdLCBbW0FSQ0hJVEVDVFVSRSwgJ2FtZDY0J11dLCBbXG5cbiAgICAgICAgICAgIC8oaWEzMig/PTspKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSUEzMiAocXVpY2t0aW1lKVxuICAgICAgICAgICAgXSwgW1tBUkNISVRFQ1RVUkUsIGxvd2VyaXplXV0sIFtcblxuICAgICAgICAgICAgLygoPzppWzM0Nl18eCk4NilbO1xcKV0vaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSUEzMiAoeDg2KVxuICAgICAgICAgICAgXSwgW1tBUkNISVRFQ1RVUkUsICdpYTMyJ11dLCBbXG5cbiAgICAgICAgICAgIC9cXGIoYWFyY2g2NHxhcm0odj84ZT9sP3xfPzY0KSlcXGIvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFSTTY0XG4gICAgICAgICAgICBdLCBbW0FSQ0hJVEVDVFVSRSwgJ2FybTY0J11dLCBbXG5cbiAgICAgICAgICAgIC9cXGIoYXJtKD86dls2N10pP2h0P24/W2ZsXXA/KVxcYi9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBUk1IRlxuICAgICAgICAgICAgXSwgW1tBUkNISVRFQ1RVUkUsICdhcm1oZiddXSwgW1xuXG4gICAgICAgICAgICAvLyBQb2NrZXRQQyBtaXN0YWtlbmx5IGlkZW50aWZpZWQgYXMgUG93ZXJQQ1xuICAgICAgICAgICAgL3dpbmRvd3MgKGNlfG1vYmlsZSk7IHBwYzsvaVxuICAgICAgICAgICAgXSwgW1tBUkNISVRFQ1RVUkUsICdhcm0nXV0sIFtcblxuICAgICAgICAgICAgLygoPzpwcGN8cG93ZXJwYykoPzo2NCk/KSg/OiBtYWN8O3xcXCkpL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUG93ZXJQQ1xuICAgICAgICAgICAgXSwgW1tBUkNISVRFQ1RVUkUsIC9vd2VyLywgRU1QVFksIGxvd2VyaXplXV0sIFtcblxuICAgICAgICAgICAgLyhzdW40XFx3KVs7XFwpXS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNQQVJDXG4gICAgICAgICAgICBdLCBbW0FSQ0hJVEVDVFVSRSwgJ3NwYXJjJ11dLCBbXG5cbiAgICAgICAgICAgIC8oKD86YXZyMzJ8aWE2NCg/PTspKXw2OGsoPz1cXCkpfFxcYmFybSg/PXYoPzpbMS03XXxbNS03XTEpbD98O3xlYWJpKXwoPz1hdG1lbCApYXZyfCg/OmlyaXh8bWlwc3xzcGFyYykoPzo2NCk/XFxifHBhLXJpc2MpL2lcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSUE2NCwgNjhLLCBBUk0vNjQsIEFWUi8zMiwgSVJJWC82NCwgTUlQUy82NCwgU1BBUkMvNjQsIFBBLVJJU0NcbiAgICAgICAgICAgIF0sIFtbQVJDSElURUNUVVJFLCBsb3dlcml6ZV1dXG4gICAgICAgIF0sXG5cbiAgICAgICAgZGV2aWNlIDogW1tcblxuICAgICAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAgICAgICAgIC8vIE1PQklMRVMgJiBUQUJMRVRTXG4gICAgICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgICAgICAgIC8vIFNhbXN1bmdcbiAgICAgICAgICAgIC9cXGIoc2NoLWlbODldMFxcZHxzaHctbTM4MHN8c20tW3B0eF1cXHd7Miw0fXxndC1bcG5dXFxkezIsNH18c2doLXQ4WzU2XTl8bmV4dXMgMTApL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgU0FNU1VOR10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgL1xcYigoPzpzW2NncF1ofGd0fHNtKS1cXHcrfHNjW2ctXT9bXFxkXSthP3xnYWxheHkgbmV4dXMpL2ksXG4gICAgICAgICAgICAvc2Ftc3VuZ1stIF0oWy1cXHddKykvaSxcbiAgICAgICAgICAgIC9zZWMtKHNnaFxcdyspL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgU0FNU1VOR10sIFtUWVBFLCBNT0JJTEVdXSwgW1xuXG4gICAgICAgICAgICAvLyBBcHBsZVxuICAgICAgICAgICAgLyg/OlxcL3xcXCgpKGlwKD86aG9uZXxvZClbXFx3LCBdKikoPzpcXC98OykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaVBvZC9pUGhvbmVcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgQVBQTEVdLCBbVFlQRSwgTU9CSUxFXV0sIFtcbiAgICAgICAgICAgIC9cXCgoaXBhZCk7Wy1cXHdcXCksOyBdK2FwcGxlL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaVBhZFxuICAgICAgICAgICAgL2FwcGxlY29yZW1lZGlhXFwvW1xcd1xcLl0rIFxcKChpcGFkKS9pLFxuICAgICAgICAgICAgL1xcYihpcGFkKVxcZFxcZD8sXFxkXFxkP1s7XFxdXS4raW9zL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgQVBQTEVdLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC8obWFjaW50b3NoKTsvaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBBUFBMRV1dLCBbXG5cbiAgICAgICAgICAgIC8vIFNoYXJwXG4gICAgICAgICAgICAvXFxiKHNoLT9bYWx0dnpdP1xcZFxcZFthLWVrbV0/KS9pXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIFNIQVJQXSwgW1RZUEUsIE1PQklMRV1dLCBbXG5cbiAgICAgICAgICAgIC8vIEh1YXdlaVxuICAgICAgICAgICAgL1xcYigoPzphZ1tyc11bMjNdP3xiYWgyP3xzaHQ/fGJ0diktYT9bbHddXFxkezJ9KVxcYig/IS4rZFxcL3MpL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgSFVBV0VJXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvKD86aHVhd2VpfGhvbm9yKShbLVxcdyBdKylbO1xcKV0vaSxcbiAgICAgICAgICAgIC9cXGIobmV4dXMgNnB8XFx3ezIsNH1lPy1bYXR1XT9bbG5dW1xcZHhdWzAxMjM1OWNdW2Fkbl0/KVxcYig/IS4rZFxcL3MpL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgSFVBV0VJXSwgW1RZUEUsIE1PQklMRV1dLCBbXG5cbiAgICAgICAgICAgIC8vIFhpYW9taVxuICAgICAgICAgICAgL1xcYihwb2NvW1xcdyBdKykoPzogYnVpfFxcKSkvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBYaWFvbWkgUE9DT1xuICAgICAgICAgICAgL1xcYjsgKFxcdyspIGJ1aWxkXFwvaG1cXDEvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gWGlhb21pIEhvbmdtaSAnbnVtZXJpYycgbW9kZWxzXG4gICAgICAgICAgICAvXFxiKGhtWy1fIF0/bm90ZT9bXyBdPyg/OlxcZFxcdyk/KSBidWkvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFhpYW9taSBIb25nbWlcbiAgICAgICAgICAgIC9cXGIocmVkbWlbXFwtXyBdPyg/Om5vdGV8ayk/W1xcd18gXSspKD86IGJ1aXxcXCkpL2ksICAgICAgICAgICAgICAgICAgIC8vIFhpYW9taSBSZWRtaVxuICAgICAgICAgICAgL1xcYihtaVstXyBdPyg/OmFcXGR8b25lfG9uZVtfIF1wbHVzfG5vdGUgbHRlfG1heHxjYyk/W18gXT8oPzpcXGQ/XFx3PylbXyBdPyg/OnBsdXN8c2V8bGl0ZSk/KSg/OiBidWl8XFwpKS9pIC8vIFhpYW9taSBNaVxuICAgICAgICAgICAgXSwgW1tNT0RFTCwgL18vZywgJyAnXSwgW1ZFTkRPUiwgWElBT01JXSwgW1RZUEUsIE1PQklMRV1dLCBbXG4gICAgICAgICAgICAvXFxiKG1pWy1fIF0/KD86cGFkKSg/OltcXHdfIF0rKSkoPzogYnVpfFxcKSkvaSAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1pIFBhZCB0YWJsZXRzXG4gICAgICAgICAgICBdLFtbTU9ERUwsIC9fL2csICcgJ10sIFtWRU5ET1IsIFhJQU9NSV0sIFtUWVBFLCBUQUJMRVRdXSwgW1xuXG4gICAgICAgICAgICAvLyBPUFBPXG4gICAgICAgICAgICAvOyAoXFx3KykgYnVpLisgb3Bwby9pLFxuICAgICAgICAgICAgL1xcYihjcGhbMTJdXFxkezN9fHAoPzphZnxjW2FsXXxkXFx3fGVbYXJdKVttdF1cXGQwfHg5MDA3fGExMDFvcClcXGIvaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnT1BQTyddLCBbVFlQRSwgTU9CSUxFXV0sIFtcblxuICAgICAgICAgICAgLy8gVml2b1xuICAgICAgICAgICAgL3Zpdm8gKFxcdyspKD86IGJ1aXxcXCkpL2ksXG4gICAgICAgICAgICAvXFxiKHZbMTJdXFxkezN9XFx3P1thdF0pKD86IGJ1aXw7KS9pXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdWaXZvJ10sIFtUWVBFLCBNT0JJTEVdXSwgW1xuXG4gICAgICAgICAgICAvLyBSZWFsbWVcbiAgICAgICAgICAgIC9cXGIocm14WzEyXVxcZHszfSkoPzogYnVpfDt8XFwpKS9pXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdSZWFsbWUnXSwgW1RZUEUsIE1PQklMRV1dLCBbXG5cbiAgICAgICAgICAgIC8vIE1vdG9yb2xhXG4gICAgICAgICAgICAvXFxiKG1pbGVzdG9uZXxkcm9pZCg/OlsyLTR4XXwgKD86YmlvbmljfHgyfHByb3xyYXpyKSk/Oj8oIDRnKT8pXFxiW1xcdyBdK2J1aWxkXFwvL2ksXG4gICAgICAgICAgICAvXFxibW90KD86b3JvbGEpP1stIF0oXFx3KikvaSxcbiAgICAgICAgICAgIC8oKD86bW90b1tcXHdcXChcXCkgXSt8eHRcXGR7Myw0fXxuZXh1cyA2KSg/PSBidWl8XFwpKSkvaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBNT1RPUk9MQV0sIFtUWVBFLCBNT0JJTEVdXSwgW1xuICAgICAgICAgICAgL1xcYihtejYwXFxkfHhvb21bMiBdezAsMn0pIGJ1aWxkXFwvL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgTU9UT1JPTEFdLCBbVFlQRSwgVEFCTEVUXV0sIFtcblxuICAgICAgICAgICAgLy8gTEdcbiAgICAgICAgICAgIC8oKD89bGcpP1t2bF1rXFwtP1xcZHszfSkgYnVpfCAzXFwuWy1cXHc7IF17MTB9bGc/LShbMDZjdjldezMsNH0pL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgTEddLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC8obG0oPzotP2YxMDBbbnZdP3wtW1xcd1xcLl0rKSg/PSBidWl8XFwpKXxuZXh1cyBbNDVdKS9pLFxuICAgICAgICAgICAgL1xcYmxnWy1lO1xcLyBdKygoPyFicm93c2VyfG5ldGNhc3R8YW5kcm9pZCB0dilcXHcrKS9pLFxuICAgICAgICAgICAgL1xcYmxnLT8oW1xcZFxcd10rKSBidWkvaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBMR10sIFtUWVBFLCBNT0JJTEVdXSwgW1xuXG4gICAgICAgICAgICAvLyBMZW5vdm9cbiAgICAgICAgICAgIC8oaWRlYXRhYlstXFx3IF0rKS9pLFxuICAgICAgICAgICAgL2xlbm92byA/KHNbNTZdMDAwWy1cXHddK3x0YWIoPzpbXFx3IF0rKXx5dFstXFxkXFx3XXs2fXx0YlstXFxkXFx3XXs2fSkvaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnTGVub3ZvJ10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuXG4gICAgICAgICAgICAvLyBOb2tpYVxuICAgICAgICAgICAgLyg/Om1hZW1vfG5va2lhKS4qKG45MDB8bHVtaWEgXFxkKykvaSxcbiAgICAgICAgICAgIC9ub2tpYVstXyBdPyhbLVxcd1xcLl0qKS9pXG4gICAgICAgICAgICBdLCBbW01PREVMLCAvXy9nLCAnICddLCBbVkVORE9SLCAnTm9raWEnXSwgW1RZUEUsIE1PQklMRV1dLCBbXG5cbiAgICAgICAgICAgIC8vIEdvb2dsZVxuICAgICAgICAgICAgLyhwaXhlbCBjKVxcYi9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gR29vZ2xlIFBpeGVsIENcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgR09PR0xFXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvZHJvaWQuKzsgKHBpeGVsW1xcZGF4bCBdezAsNn0pKD86IGJ1aXxcXCkpL2kgICAgICAgICAgICAgICAgICAgICAgICAgLy8gR29vZ2xlIFBpeGVsXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIEdPT0dMRV0sIFtUWVBFLCBNT0JJTEVdXSwgW1xuXG4gICAgICAgICAgICAvLyBTb255XG4gICAgICAgICAgICAvZHJvaWQuKyAoYT9cXGRbMC0yXXsyfXNvfFtjLWddXFxkezR9fHNvWy1nbF1cXHcrfHhxLWFcXHdbNC03XVsxMl0pKD89IGJ1aXxcXCkuK2Nocm9tZVxcLyg/IVsxLTZdezAsMX1cXGRcXC4pKS9pXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIFNPTlldLCBbVFlQRSwgTU9CSUxFXV0sIFtcbiAgICAgICAgICAgIC9zb255IHRhYmxldCBbcHNdL2ksXG4gICAgICAgICAgICAvXFxiKD86c29ueSk/c2dwXFx3Kyg/OiBidWl8XFwpKS9pXG4gICAgICAgICAgICBdLCBbW01PREVMLCAnWHBlcmlhIFRhYmxldCddLCBbVkVORE9SLCBTT05ZXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG5cbiAgICAgICAgICAgIC8vIE9uZVBsdXNcbiAgICAgICAgICAgIC8gKGtiMjAwNXxpbjIwWzEyXTV8YmUyMFsxMl1bNTldKVxcYi9pLFxuICAgICAgICAgICAgLyg/Om9uZSk/KD86cGx1cyk/IChhXFxkMFxcZFxcZCkoPzogYnxcXCkpL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ09uZVBsdXMnXSwgW1RZUEUsIE1PQklMRV1dLCBbXG5cbiAgICAgICAgICAgIC8vIEFtYXpvblxuICAgICAgICAgICAgLyhhbGV4YSl3ZWJtL2ksXG4gICAgICAgICAgICAvKGtmW2Etel17Mn13aXxhZW9bYy1yXXsyfSkoIGJ1aXxcXCkpL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBLaW5kbGUgRmlyZSB3aXRob3V0IFNpbGsgLyBFY2hvIFNob3dcbiAgICAgICAgICAgIC8oa2ZbYS16XSspKCBidWl8XFwpKS4rc2lsa1xcLy9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBLaW5kbGUgRmlyZSBIRFxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBBTUFaT05dLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC8oKD86c2R8a2YpWzAzNDloaWpvcnN0dXddKykoIGJ1aXxcXCkpLitzaWxrXFwvL2kgICAgICAgICAgICAgICAgICAgICAvLyBGaXJlIFBob25lXG4gICAgICAgICAgICBdLCBbW01PREVMLCAvKC4rKS9nLCAnRmlyZSBQaG9uZSAkMSddLCBbVkVORE9SLCBBTUFaT05dLCBbVFlQRSwgTU9CSUxFXV0sIFtcblxuICAgICAgICAgICAgLy8gQmxhY2tCZXJyeVxuICAgICAgICAgICAgLyhwbGF5Ym9vayk7Wy1cXHdcXCksOyBdKyhyaW0pL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEJsYWNrQmVycnkgUGxheUJvb2tcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgVkVORE9SLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC9cXGIoKD86YmJbYS1mXXxzdFtodl0pMTAwLVxcZCkvaSxcbiAgICAgICAgICAgIC9cXChiYjEwOyAoXFx3KykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBCbGFja0JlcnJ5IDEwXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIEJMQUNLQkVSUlldLCBbVFlQRSwgTU9CSUxFXV0sIFtcblxuICAgICAgICAgICAgLy8gQXN1c1xuICAgICAgICAgICAgLyg/OlxcYnxhc3VzXykodHJhbnNmb1twcmltZSBdezQsMTB9IFxcdyt8ZWVlcGN8c2xpZGVyIFxcdyt8bmV4dXMgN3xwYWRmb25lfHAwMFtjal0pL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgQVNVU10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgLyAoeltiZXNdNlswMjddWzAxMl1ba21dW2xzXXx6ZW5mb25lIFxcZFxcdz8pXFxiL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgQVNVU10sIFtUWVBFLCBNT0JJTEVdXSwgW1xuXG4gICAgICAgICAgICAvLyBIVENcbiAgICAgICAgICAgIC8obmV4dXMgOSkvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSFRDIE5leHVzIDlcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ0hUQyddLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC8oaHRjKVstO18gXXsxLDJ9KFtcXHcgXSsoPz1cXCl8IGJ1aSl8XFx3KykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSFRDXG5cbiAgICAgICAgICAgIC8vIFpURVxuICAgICAgICAgICAgLyh6dGUpWy0gXShbXFx3IF0rPykoPzogYnVpfFxcL3xcXCkpL2ksXG4gICAgICAgICAgICAvKGFsY2F0ZWx8Z2Vla3NwaG9uZXxuZXhpYW58cGFuYXNvbmljKD8hKD86O3xcXC4pKXxzb255KD8hLWJyYSkpWy1fIF0/KFstXFx3XSopL2kgICAgICAgICAvLyBBbGNhdGVsL0dlZWtzUGhvbmUvTmV4aWFuL1BhbmFzb25pYy9Tb255XG4gICAgICAgICAgICBdLCBbVkVORE9SLCBbTU9ERUwsIC9fL2csICcgJ10sIFtUWVBFLCBNT0JJTEVdXSwgW1xuXG4gICAgICAgICAgICAvLyBBY2VyXG4gICAgICAgICAgICAvZHJvaWQuKzsgKFthYl1bMS03XS0/WzAxNzhhXVxcZFxcZD8pL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ0FjZXInXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG5cbiAgICAgICAgICAgIC8vIE1laXp1XG4gICAgICAgICAgICAvZHJvaWQuKzsgKG1bMS01XSBub3RlKSBidWkvaSxcbiAgICAgICAgICAgIC9cXGJtei0oWy1cXHddezIsfSkvaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnTWVpenUnXSwgW1RZUEUsIE1PQklMRV1dLCBbXG5cbiAgICAgICAgICAgIC8vIE1JWEVEXG4gICAgICAgICAgICAvKGJsYWNrYmVycnl8YmVucXxwYWxtKD89XFwtKXxzb255ZXJpY3Nzb258YWNlcnxhc3VzfGRlbGx8bWVpenV8bW90b3JvbGF8cG9seXRyb24pWy1fIF0/KFstXFx3XSopL2ksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEJsYWNrQmVycnkvQmVuUS9QYWxtL1NvbnktRXJpY3Nzb24vQWNlci9Bc3VzL0RlbGwvTWVpenUvTW90b3JvbGEvUG9seXRyb25cbiAgICAgICAgICAgIC8oaHApIChbXFx3IF0rXFx3KS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBIUCBpUEFRXG4gICAgICAgICAgICAvKGFzdXMpLT8oXFx3KykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBc3VzXG4gICAgICAgICAgICAvKG1pY3Jvc29mdCk7IChsdW1pYVtcXHcgXSspL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBNaWNyb3NvZnQgTHVtaWFcbiAgICAgICAgICAgIC8obGVub3ZvKVstXyBdPyhbLVxcd10rKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIExlbm92b1xuICAgICAgICAgICAgLyhqb2xsYSkvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBKb2xsYVxuICAgICAgICAgICAgLyhvcHBvKSA/KFtcXHcgXSspIGJ1aS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gT1BQT1xuICAgICAgICAgICAgXSwgW1ZFTkRPUiwgTU9ERUwsIFtUWVBFLCBNT0JJTEVdXSwgW1xuXG4gICAgICAgICAgICAvKGtvYm8pXFxzKGVyZWFkZXJ8dG91Y2gpL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBLb2JvXG4gICAgICAgICAgICAvKGFyY2hvcykgKGdhbWVwYWQyPykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFyY2hvc1xuICAgICAgICAgICAgLyhocCkuKyh0b3VjaHBhZCg/IS4rdGFibGV0KXx0YWJsZXQpL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBIUCBUb3VjaFBhZFxuICAgICAgICAgICAgLyhraW5kbGUpXFwvKFtcXHdcXC5dKykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBLaW5kbGVcbiAgICAgICAgICAgIC8obm9vaylbXFx3IF0rYnVpbGRcXC8oXFx3KykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTm9va1xuICAgICAgICAgICAgLyhkZWxsKSAoc3RyZWFba3ByXFxkIF0qW1xcZGtvXSkvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIERlbGwgU3RyZWFrXG4gICAgICAgICAgICAvKGxlWy0gXStwYW4pWy0gXSsoXFx3ezEsOX0pIGJ1aS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBMZSBQYW4gVGFibGV0c1xuICAgICAgICAgICAgLyh0cmluaXR5KVstIF0qKHRcXGR7M30pIGJ1aS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVHJpbml0eSBUYWJsZXRzXG4gICAgICAgICAgICAvKGdpZ2FzZXQpWy0gXSsocVxcd3sxLDl9KSBidWkvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBHaWdhc2V0IFRhYmxldHNcbiAgICAgICAgICAgIC8odm9kYWZvbmUpIChbXFx3IF0rKSg/OlxcKXwgYnVpKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBWb2RhZm9uZVxuICAgICAgICAgICAgXSwgW1ZFTkRPUiwgTU9ERUwsIFtUWVBFLCBUQUJMRVRdXSwgW1xuXG4gICAgICAgICAgICAvKHN1cmZhY2UgZHVvKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFN1cmZhY2UgRHVvXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIE1JQ1JPU09GVF0sIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgL2Ryb2lkIFtcXGRcXC5dKzsgKGZwXFxkdT8pKD86IGJ8XFwpKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRmFpcnBob25lXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdGYWlycGhvbmUnXSwgW1RZUEUsIE1PQklMRV1dLCBbXG4gICAgICAgICAgICAvKHUzMDRhYSkvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFUJlRcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ0FUJlQnXSwgW1RZUEUsIE1PQklMRV1dLCBbXG4gICAgICAgICAgICAvXFxic2llLShcXHcqKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU2llbWVuc1xuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnU2llbWVucyddLCBbVFlQRSwgTU9CSUxFXV0sIFtcbiAgICAgICAgICAgIC9cXGIocmN0XFx3KykgYi9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBSQ0EgVGFibGV0c1xuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnUkNBJ10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgL1xcYih2ZW51ZVtcXGQgXXsyLDd9KSBiL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIERlbGwgVmVudWUgVGFibGV0c1xuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnRGVsbCddLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC9cXGIocSg/Om12fHRhKVxcdyspIGIvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBWZXJpem9uIFRhYmxldFxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnVmVyaXpvbiddLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC9cXGIoPzpiYXJuZXNbJiBdK25vYmxlIHxibltydF0pKFtcXHdcXCsgXSopIGIvaSAgICAgICAgICAgICAgICAgICAgICAgLy8gQmFybmVzICYgTm9ibGUgVGFibGV0XG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdCYXJuZXMgJiBOb2JsZSddLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC9cXGIodG1cXGR7M31cXHcrKSBiL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ051VmlzaW9uJ10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgL1xcYihrODgpIGIvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gWlRFIEsgU2VyaWVzIFRhYmxldFxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnWlRFJ10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgL1xcYihueFxcZHszfWopIGIvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFpURSBOdWJpYVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnWlRFJ10sIFtUWVBFLCBNT0JJTEVdXSwgW1xuICAgICAgICAgICAgL1xcYihnZW5cXGR7M30pIGIuKzQ5aC9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFN3aXNzIEdFTiBNb2JpbGVcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ1N3aXNzJ10sIFtUWVBFLCBNT0JJTEVdXSwgW1xuICAgICAgICAgICAgL1xcYih6dXJcXGR7M30pIGIvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFN3aXNzIFpVUiBUYWJsZXRcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ1N3aXNzJ10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgL1xcYigoemVraSk/dGIuKlxcYikgYi9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFpla2kgVGFibGV0c1xuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnWmVraSddLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC9cXGIoW3lyXVxcZHsyfSkgYi9pLFxuICAgICAgICAgICAgL1xcYihkcmFnb25bLSBdK3RvdWNoIHxkdCkoXFx3ezV9KSBiL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIERyYWdvbiBUb3VjaCBUYWJsZXRcbiAgICAgICAgICAgIF0sIFtbVkVORE9SLCAnRHJhZ29uIFRvdWNoJ10sIE1PREVMLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC9cXGIobnMtP1xcd3swLDl9KSBiL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBJbnNpZ25pYSBUYWJsZXRzXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdJbnNpZ25pYSddLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC9cXGIoKG54YXxuZXh0KS0/XFx3ezAsOX0pIGIvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBOZXh0Qm9vayBUYWJsZXRzXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdOZXh0Qm9vayddLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC9cXGIoeHRyZW1lXFxfKT8odigxWzA0NV18MlswMTVdfFszNDY5XTB8N1swNV0pKSBiL2kgICAgICAgICAgICAgICAgICAvLyBWb2ljZSBYdHJlbWUgUGhvbmVzXG4gICAgICAgICAgICBdLCBbW1ZFTkRPUiwgJ1ZvaWNlJ10sIE1PREVMLCBbVFlQRSwgTU9CSUxFXV0sIFtcbiAgICAgICAgICAgIC9cXGIobHZ0ZWxcXC0pPyh2MVsxMl0pIGIvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBMdlRlbCBQaG9uZXNcbiAgICAgICAgICAgIF0sIFtbVkVORE9SLCAnTHZUZWwnXSwgTU9ERUwsIFtUWVBFLCBNT0JJTEVdXSwgW1xuICAgICAgICAgICAgL1xcYihwaC0xKSAvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRXNzZW50aWFsIFBILTFcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ0Vzc2VudGlhbCddLCBbVFlQRSwgTU9CSUxFXV0sIFtcbiAgICAgICAgICAgIC9cXGIodigxMDBtZHw3MDBuYXw3MDExfDkxN2cpLipcXGIpIGIvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBFbnZpemVuIFRhYmxldHNcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ0Vudml6ZW4nXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvXFxiKHRyaW9bLVxcd1xcLiBdKykgYi9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1hY2hTcGVlZCBUYWJsZXRzXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdNYWNoU3BlZWQnXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvXFxidHVfKDE0OTEpIGIvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBSb3RvciBUYWJsZXRzXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdSb3RvciddLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC8oc2hpZWxkW1xcdyBdKykgYi9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE52aWRpYSBTaGllbGQgVGFibGV0c1xuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnTnZpZGlhJ10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgLyhzcHJpbnQpIChcXHcrKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU3ByaW50IFBob25lc1xuICAgICAgICAgICAgXSwgW1ZFTkRPUiwgTU9ERUwsIFtUWVBFLCBNT0JJTEVdXSwgW1xuICAgICAgICAgICAgLyhraW5cXC5bb25ldHddezN9KS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTWljcm9zb2Z0IEtpblxuICAgICAgICAgICAgXSwgW1tNT0RFTCwgL1xcLi9nLCAnICddLCBbVkVORE9SLCBNSUNST1NPRlRdLCBbVFlQRSwgTU9CSUxFXV0sIFtcbiAgICAgICAgICAgIC9kcm9pZC4rOyAoY2M2NjY2P3xldDVbMTZdfG1jWzIzOV1bMjNdeD98dmM4WzAzXXg/KVxcKS9pICAgICAgICAgICAgIC8vIFplYnJhXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIFpFQlJBXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvZHJvaWQuKzsgKGVjMzB8cHMyMHx0Y1syLThdXFxkW2t4XSlcXCkvaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBaRUJSQV0sIFtUWVBFLCBNT0JJTEVdXSwgW1xuXG4gICAgICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgICAgICAgICAvLyBTTUFSVFRWU1xuICAgICAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICAgICAgICAvc21hcnQtdHYuKyhzYW1zdW5nKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNhbXN1bmdcbiAgICAgICAgICAgIF0sIFtWRU5ET1IsIFtUWVBFLCBTTUFSVFRWXV0sIFtcbiAgICAgICAgICAgIC9oYmJ0di4rbWFwbGU7KFxcZCspL2lcbiAgICAgICAgICAgIF0sIFtbTU9ERUwsIC9eLywgJ1NtYXJ0VFYnXSwgW1ZFTkRPUiwgU0FNU1VOR10sIFtUWVBFLCBTTUFSVFRWXV0sIFtcbiAgICAgICAgICAgIC8obnV4OyBuZXRjYXN0LitzbWFydHR2fGxnIChuZXRjYXN0XFwudHYtMjAxXFxkfGFuZHJvaWQgdHYpKS9pICAgICAgICAvLyBMRyBTbWFydFRWXG4gICAgICAgICAgICBdLCBbW1ZFTkRPUiwgTEddLCBbVFlQRSwgU01BUlRUVl1dLCBbXG4gICAgICAgICAgICAvKGFwcGxlKSA/dHYvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFwcGxlIFRWXG4gICAgICAgICAgICBdLCBbVkVORE9SLCBbTU9ERUwsIEFQUExFKycgVFYnXSwgW1RZUEUsIFNNQVJUVFZdXSwgW1xuICAgICAgICAgICAgL2Nya2V5L2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBHb29nbGUgQ2hyb21lY2FzdFxuICAgICAgICAgICAgXSwgW1tNT0RFTCwgQ0hST01FKydjYXN0J10sIFtWRU5ET1IsIEdPT0dMRV0sIFtUWVBFLCBTTUFSVFRWXV0sIFtcbiAgICAgICAgICAgIC9kcm9pZC4rYWZ0KFxcdykoIGJ1aXxcXCkpL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBGaXJlIFRWXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIEFNQVpPTl0sIFtUWVBFLCBTTUFSVFRWXV0sIFtcbiAgICAgICAgICAgIC9cXChkdHZbXFwpO10uKyhhcXVvcykvaSxcbiAgICAgICAgICAgIC8oYXF1b3MtdHZbXFx3IF0rKVxcKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTaGFycFxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBTSEFSUF0sIFtUWVBFLCBTTUFSVFRWXV0sW1xuICAgICAgICAgICAgLyhicmF2aWFbXFx3IF0rKSggYnVpfFxcKSkvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTb255XG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIFNPTlldLCBbVFlQRSwgU01BUlRUVl1dLCBbXG4gICAgICAgICAgICAvKG1pdHYtXFx3ezV9KSBidWkvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBYaWFvbWlcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgWElBT01JXSwgW1RZUEUsIFNNQVJUVFZdXSwgW1xuICAgICAgICAgICAgL0hiYnR2LioodGVjaG5pc2F0KSAoLiopOy9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUZWNobmlTQVRcbiAgICAgICAgICAgIF0sIFtWRU5ET1IsIE1PREVMLCBbVFlQRSwgU01BUlRUVl1dLCBbXG4gICAgICAgICAgICAvXFxiKHJva3UpW1xcZHhdKltcXClcXC9dKCg/OmR2cC0pP1tcXGRcXC5dKikvaSwgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFJva3VcbiAgICAgICAgICAgIC9oYmJ0dlxcL1xcZCtcXC5cXGQrXFwuXFxkKyArXFwoW1xcd1xcKyBdKjsgKihbXFx3XFxkXVteO10qKTsoW147XSopL2kgICAgICAgICAvLyBIYmJUViBkZXZpY2VzXG4gICAgICAgICAgICBdLCBbW1ZFTkRPUiwgdHJpbV0sIFtNT0RFTCwgdHJpbV0sIFtUWVBFLCBTTUFSVFRWXV0sIFtcbiAgICAgICAgICAgIC9cXGIoYW5kcm9pZCB0dnxzbWFydFstIF0/dHZ8b3BlcmEgdHZ8dHY7IHJ2OilcXGIvaSAgICAgICAgICAgICAgICAgICAvLyBTbWFydFRWIGZyb20gVW5pZGVudGlmaWVkIFZlbmRvcnNcbiAgICAgICAgICAgIF0sIFtbVFlQRSwgU01BUlRUVl1dLCBbXG5cbiAgICAgICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAgICAgICAgIC8vIENPTlNPTEVTXG4gICAgICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgICAgICAgIC8ob3V5YSkvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gT3V5YVxuICAgICAgICAgICAgLyhuaW50ZW5kbykgKFt3aWRzM3V0Y2hdKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBOaW50ZW5kb1xuICAgICAgICAgICAgXSwgW1ZFTkRPUiwgTU9ERUwsIFtUWVBFLCBDT05TT0xFXV0sIFtcbiAgICAgICAgICAgIC9kcm9pZC4rOyAoc2hpZWxkKSBidWkvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTnZpZGlhXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdOdmlkaWEnXSwgW1RZUEUsIENPTlNPTEVdXSwgW1xuICAgICAgICAgICAgLyhwbGF5c3RhdGlvbiBbMzQ1cG9ydGFibGV2aV0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBQbGF5c3RhdGlvblxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBTT05ZXSwgW1RZUEUsIENPTlNPTEVdXSwgW1xuICAgICAgICAgICAgL1xcYih4Ym94KD86IG9uZSk/KD8hOyB4Ym94KSlbXFwpOyBdL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1pY3Jvc29mdCBYYm94XG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIE1JQ1JPU09GVF0sIFtUWVBFLCBDT05TT0xFXV0sIFtcblxuICAgICAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgICAgICAgICAgLy8gV0VBUkFCTEVTXG4gICAgICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgICAgICAgIC8oKHBlYmJsZSkpYXBwL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUGViYmxlXG4gICAgICAgICAgICBdLCBbVkVORE9SLCBNT0RFTCwgW1RZUEUsIFdFQVJBQkxFXV0sIFtcbiAgICAgICAgICAgIC8od2F0Y2gpKD86ID9vc1ssXFwvXXxcXGQsXFxkXFwvKVtcXGRcXC5dKy9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQXBwbGUgV2F0Y2hcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgQVBQTEVdLCBbVFlQRSwgV0VBUkFCTEVdXSwgW1xuICAgICAgICAgICAgL2Ryb2lkLis7IChnbGFzcykgXFxkL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gR29vZ2xlIEdsYXNzXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIEdPT0dMRV0sIFtUWVBFLCBXRUFSQUJMRV1dLCBbXG4gICAgICAgICAgICAvZHJvaWQuKzsgKHd0NjM/MHsyLDN9KVxcKS9pXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIFpFQlJBXSwgW1RZUEUsIFdFQVJBQkxFXV0sIFtcbiAgICAgICAgICAgIC8ocXVlc3QoIDJ8IHBybyk/KS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gT2N1bHVzIFF1ZXN0XG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIEZBQ0VCT09LXSwgW1RZUEUsIFdFQVJBQkxFXV0sIFtcblxuICAgICAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgICAgICAgICAgLy8gRU1CRURERURcbiAgICAgICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgICAgICAgLyh0ZXNsYSkoPzogcXRjYXJicm93c2VyfFxcL1stXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUZXNsYVxuICAgICAgICAgICAgXSwgW1ZFTkRPUiwgW1RZUEUsIEVNQkVEREVEXV0sIFtcbiAgICAgICAgICAgIC8oYWVvYmMpXFxiL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEVjaG8gRG90XG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIEFNQVpPTl0sIFtUWVBFLCBFTUJFRERFRF1dLCBbXG5cbiAgICAgICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgICAgICAgICAvLyBNSVhFRCAoR0VORVJJQylcbiAgICAgICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgICAgICAgL2Ryb2lkIC4rPzsgKFteO10rPykoPzogYnVpfFxcKSBhcHBsZXcpLis/IG1vYmlsZSBzYWZhcmkvaSAgICAgICAgICAgLy8gQW5kcm9pZCBQaG9uZXMgZnJvbSBVbmlkZW50aWZpZWQgVmVuZG9yc1xuICAgICAgICAgICAgXSwgW01PREVMLCBbVFlQRSwgTU9CSUxFXV0sIFtcbiAgICAgICAgICAgIC9kcm9pZCAuKz87IChbXjtdKz8pKD86IGJ1aXxcXCkgYXBwbGV3KS4rPyg/ISBtb2JpbGUpIHNhZmFyaS9pICAgICAgIC8vIEFuZHJvaWQgVGFibGV0cyBmcm9tIFVuaWRlbnRpZmllZCBWZW5kb3JzXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgL1xcYigodGFibGV0fHRhYilbO1xcL118Zm9jdXNcXC9cXGQoPyEuK21vYmlsZSkpL2kgICAgICAgICAgICAgICAgICAgICAgLy8gVW5pZGVudGlmaWFibGUgVGFibGV0XG4gICAgICAgICAgICBdLCBbW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvKHBob25lfG1vYmlsZSg/Ols7XFwvXXwgWyBcXHdcXC9cXC5dKnNhZmFyaSl8cGRhKD89Lit3aW5kb3dzIGNlKSkvaSAgICAvLyBVbmlkZW50aWZpYWJsZSBNb2JpbGVcbiAgICAgICAgICAgIF0sIFtbVFlQRSwgTU9CSUxFXV0sIFtcbiAgICAgICAgICAgIC8oYW5kcm9pZFstXFx3XFwuIF17MCw5fSk7LitidWlsL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBHZW5lcmljIEFuZHJvaWQgRGV2aWNlXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdHZW5lcmljJ11dXG4gICAgICAgIF0sXG5cbiAgICAgICAgZW5naW5lIDogW1tcblxuICAgICAgICAgICAgL3dpbmRvd3MuKyBlZGdlXFwvKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEVkZ2VIVE1MXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsIEVER0UrJ0hUTUwnXV0sIFtcblxuICAgICAgICAgICAgL3dlYmtpdFxcLzUzN1xcLjM2LitjaHJvbWVcXC8oPyEyNykoW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEJsaW5rXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsICdCbGluayddXSwgW1xuXG4gICAgICAgICAgICAvKHByZXN0bylcXC8oW1xcd1xcLl0rKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFByZXN0b1xuICAgICAgICAgICAgLyh3ZWJraXR8dHJpZGVudHxuZXRmcm9udHxuZXRzdXJmfGFtYXlhfGx5bnh8dzNtfGdvYW5uYSlcXC8oW1xcd1xcLl0rKS9pLCAvLyBXZWJLaXQvVHJpZGVudC9OZXRGcm9udC9OZXRTdXJmL0FtYXlhL0x5bngvdzNtL0dvYW5uYVxuICAgICAgICAgICAgL2VraW9oKGZsb3cpXFwvKFtcXHdcXC5dKykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBGbG93XG4gICAgICAgICAgICAvKGtodG1sfHRhc21hbnxsaW5rcylbXFwvIF1cXCg/KFtcXHdcXC5dKykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBLSFRNTC9UYXNtYW4vTGlua3NcbiAgICAgICAgICAgIC8oaWNhYilbXFwvIF0oWzIzXVxcLltcXGRcXC5dKykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlDYWJcbiAgICAgICAgICAgIC9cXGIobGlid2ViKS9pXG4gICAgICAgICAgICBdLCBbTkFNRSwgVkVSU0lPTl0sIFtcblxuICAgICAgICAgICAgL3J2XFw6KFtcXHdcXC5dezEsOX0pXFxiLisoZ2Vja28pL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gR2Vja29cbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBOQU1FXVxuICAgICAgICBdLFxuXG4gICAgICAgIG9zIDogW1tcblxuICAgICAgICAgICAgLy8gV2luZG93c1xuICAgICAgICAgICAgL21pY3Jvc29mdCAod2luZG93cykgKHZpc3RhfHhwKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBXaW5kb3dzIChpVHVuZXMpXG4gICAgICAgICAgICBdLCBbTkFNRSwgVkVSU0lPTl0sIFtcbiAgICAgICAgICAgIC8od2luZG93cykgbnQgNlxcLjI7IChhcm0pL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdpbmRvd3MgUlRcbiAgICAgICAgICAgIC8od2luZG93cyAoPzpwaG9uZSg/OiBvcyk/fG1vYmlsZSkpW1xcLyBdPyhbXFxkXFwuXFx3IF0qKS9pLCAgICAgICAgICAgIC8vIFdpbmRvd3MgUGhvbmVcbiAgICAgICAgICAgIC8od2luZG93cylbXFwvIF0/KFtudGNlXFxkXFwuIF0rXFx3KSg/IS4reGJveCkvaVxuICAgICAgICAgICAgXSwgW05BTUUsIFtWRVJTSU9OLCBzdHJNYXBwZXIsIHdpbmRvd3NWZXJzaW9uTWFwXV0sIFtcbiAgICAgICAgICAgIC8od2luKD89M3w5fG4pfHdpbiA5eCApKFtudFxcZFxcLl0rKS9pXG4gICAgICAgICAgICBdLCBbW05BTUUsICdXaW5kb3dzJ10sIFtWRVJTSU9OLCBzdHJNYXBwZXIsIHdpbmRvd3NWZXJzaW9uTWFwXV0sIFtcblxuICAgICAgICAgICAgLy8gaU9TL21hY09TXG4gICAgICAgICAgICAvaXBbaG9uZWFkXXsyLDR9XFxiKD86LipvcyAoW1xcd10rKSBsaWtlIG1hY3w7IG9wZXJhKS9pLCAgICAgICAgICAgICAgLy8gaU9TXG4gICAgICAgICAgICAvaW9zO2Zic3ZcXC8oW1xcZFxcLl0rKS9pLFxuICAgICAgICAgICAgL2NmbmV0d29ya1xcLy4rZGFyd2luL2lcbiAgICAgICAgICAgIF0sIFtbVkVSU0lPTiwgL18vZywgJy4nXSwgW05BTUUsICdpT1MnXV0sIFtcbiAgICAgICAgICAgIC8obWFjIG9zIHgpID8oW1xcd1xcLiBdKikvaSxcbiAgICAgICAgICAgIC8obWFjaW50b3NofG1hY19wb3dlcnBjXFxiKSg/IS4raGFpa3UpL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1hYyBPU1xuICAgICAgICAgICAgXSwgW1tOQU1FLCBNQUNfT1NdLCBbVkVSU0lPTiwgL18vZywgJy4nXV0sIFtcblxuICAgICAgICAgICAgLy8gTW9iaWxlIE9TZXNcbiAgICAgICAgICAgIC9kcm9pZCAoW1xcd1xcLl0rKVxcYi4rKGFuZHJvaWRbLSBdeDg2fGhhcm1vbnlvcykvaSAgICAgICAgICAgICAgICAgICAgLy8gQW5kcm9pZC14ODYvSGFybW9ueU9TXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgTkFNRV0sIFsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFuZHJvaWQvV2ViT1MvUU5YL0JhZGEvUklNL01hZW1vL01lZUdvL1NhaWxmaXNoIE9TXG4gICAgICAgICAgICAvKGFuZHJvaWR8d2Vib3N8cW54fGJhZGF8cmltIHRhYmxldCBvc3xtYWVtb3xtZWVnb3xzYWlsZmlzaClbLVxcLyBdPyhbXFx3XFwuXSopL2ksXG4gICAgICAgICAgICAvKGJsYWNrYmVycnkpXFx3KlxcLyhbXFx3XFwuXSopL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBCbGFja2JlcnJ5XG4gICAgICAgICAgICAvKHRpemVufGthaW9zKVtcXC8gXShbXFx3XFwuXSspL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRpemVuL0thaU9TXG4gICAgICAgICAgICAvXFwoKHNlcmllczQwKTsvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTZXJpZXMgNDBcbiAgICAgICAgICAgIF0sIFtOQU1FLCBWRVJTSU9OXSwgW1xuICAgICAgICAgICAgL1xcKGJiKDEwKTsvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQmxhY2tCZXJyeSAxMFxuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCBCTEFDS0JFUlJZXV0sIFtcbiAgICAgICAgICAgIC8oPzpzeW1iaWFuID9vc3xzeW1ib3N8czYwKD89Oyl8c2VyaWVzNjApWy1cXC8gXT8oW1xcd1xcLl0qKS9pICAgICAgICAgLy8gU3ltYmlhblxuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCAnU3ltYmlhbiddXSwgW1xuICAgICAgICAgICAgL21vemlsbGFcXC9bXFxkXFwuXSsgXFwoKD86bW9iaWxlfHRhYmxldHx0dnxtb2JpbGU7IFtcXHcgXSspOyBydjouKyBnZWNrb1xcLyhbXFx3XFwuXSspL2kgLy8gRmlyZWZveCBPU1xuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCBGSVJFRk9YKycgT1MnXV0sIFtcbiAgICAgICAgICAgIC93ZWIwczsuK3J0KHR2KS9pLFxuICAgICAgICAgICAgL1xcYig/OmhwKT93b3MoPzpicm93c2VyKT9cXC8oW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gV2ViT1NcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgJ3dlYk9TJ11dLCBbXG4gICAgICAgICAgICAvd2F0Y2goPzogP29zWyxcXC9dfFxcZCxcXGRcXC8pKFtcXGRcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHdhdGNoT1NcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgJ3dhdGNoT1MnXV0sIFtcblxuICAgICAgICAgICAgLy8gR29vZ2xlIENocm9tZWNhc3RcbiAgICAgICAgICAgIC9jcmtleVxcLyhbXFxkXFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gR29vZ2xlIENocm9tZWNhc3RcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgQ0hST01FKydjYXN0J11dLCBbXG4gICAgICAgICAgICAvKGNyb3MpIFtcXHddKyg/OlxcKXwgKFtcXHdcXC5dKylcXGIpL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ2hyb21pdW0gT1NcbiAgICAgICAgICAgIF0sIFtbTkFNRSwgQ0hST01JVU1fT1NdLCBWRVJTSU9OXSxbXG5cbiAgICAgICAgICAgIC8vIFNtYXJ0IFRWc1xuICAgICAgICAgICAgL3BhbmFzb25pYzsodmllcmEpL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBQYW5hc29uaWMgVmllcmFcbiAgICAgICAgICAgIC8obmV0cmFuZ2UpbW1oL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTmV0cmFuZ2VcbiAgICAgICAgICAgIC8obmV0dHYpXFwvKFxcZCtcXC5bXFx3XFwuXSspL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBOZXRUVlxuXG4gICAgICAgICAgICAvLyBDb25zb2xlXG4gICAgICAgICAgICAvKG5pbnRlbmRvfHBsYXlzdGF0aW9uKSAoW3dpZHMzNDVwb3J0YWJsZXZ1Y2hdKykvaSwgICAgICAgICAgICAgICAgIC8vIE5pbnRlbmRvL1BsYXlzdGF0aW9uXG4gICAgICAgICAgICAvKHhib3gpOyAreGJveCAoW15cXCk7XSspL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBNaWNyb3NvZnQgWGJveCAoMzYwLCBPbmUsIFgsIFMsIFNlcmllcyBYLCBTZXJpZXMgUylcblxuICAgICAgICAgICAgLy8gT3RoZXJcbiAgICAgICAgICAgIC9cXGIoam9saXxwYWxtKVxcYiA/KD86b3MpP1xcLz8oW1xcd1xcLl0qKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBKb2xpL1BhbG1cbiAgICAgICAgICAgIC8obWludClbXFwvXFwoXFwpIF0/KFxcdyopL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1pbnRcbiAgICAgICAgICAgIC8obWFnZWlhfHZlY3RvcmxpbnV4KVs7IF0vaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTWFnZWlhL1ZlY3RvckxpbnV4XG4gICAgICAgICAgICAvKFtreGxuXT91YnVudHV8ZGViaWFufHN1c2V8b3BlbnN1c2V8Z2VudG9vfGFyY2goPz0gbGludXgpfHNsYWNrd2FyZXxmZWRvcmF8bWFuZHJpdmF8Y2VudG9zfHBjbGludXhvc3xyZWQgP2hhdHx6ZW53YWxrfGxpbnB1c3xyYXNwYmlhbnxwbGFuIDl8bWluaXh8cmlzYyBvc3xjb250aWtpfGRlZXBpbnxtYW5qYXJvfGVsZW1lbnRhcnkgb3N8c2FiYXlvbnxsaW5zcGlyZSkoPzogZ251XFwvbGludXgpPyg/OiBlbnRlcnByaXNlKT8oPzpbLSBdbGludXgpPyg/Oi1nbnUpP1stXFwvIF0/KD8hY2hyb218cGFja2FnZSkoWy1cXHdcXC5dKikvaSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVWJ1bnR1L0RlYmlhbi9TVVNFL0dlbnRvby9BcmNoL1NsYWNrd2FyZS9GZWRvcmEvTWFuZHJpdmEvQ2VudE9TL1BDTGludXhPUy9SZWRIYXQvWmVud2Fsay9MaW5wdXMvUmFzcGJpYW4vUGxhbjkvTWluaXgvUklTQ09TL0NvbnRpa2kvRGVlcGluL01hbmphcm8vZWxlbWVudGFyeS9TYWJheW9uL0xpbnNwaXJlXG4gICAgICAgICAgICAvKGh1cmR8bGludXgpID8oW1xcd1xcLl0qKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSHVyZC9MaW51eFxuICAgICAgICAgICAgLyhnbnUpID8oW1xcd1xcLl0qKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEdOVVxuICAgICAgICAgICAgL1xcYihbLWZyZW50b3BjZ2hzXXswLDV9YnNkfGRyYWdvbmZseSlbXFwvIF0/KD8hYW1kfFtpeDM0Nl17MSwyfTg2KShbXFx3XFwuXSopL2ksIC8vIEZyZWVCU0QvTmV0QlNEL09wZW5CU0QvUEMtQlNEL0dob3N0QlNEL0RyYWdvbkZseVxuICAgICAgICAgICAgLyhoYWlrdSkgKFxcdyspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSGFpa3VcbiAgICAgICAgICAgIF0sIFtOQU1FLCBWRVJTSU9OXSwgW1xuICAgICAgICAgICAgLyhzdW5vcykgPyhbXFx3XFwuXFxkXSopL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTb2xhcmlzXG4gICAgICAgICAgICBdLCBbW05BTUUsICdTb2xhcmlzJ10sIFZFUlNJT05dLCBbXG4gICAgICAgICAgICAvKCg/Om9wZW4pP3NvbGFyaXMpWy1cXC8gXT8oW1xcd1xcLl0qKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNvbGFyaXNcbiAgICAgICAgICAgIC8oYWl4KSAoKFxcZCkoPz1cXC58XFwpfCApW1xcd1xcLl0pKi9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBSVhcbiAgICAgICAgICAgIC9cXGIoYmVvc3xvc1xcLzJ8YW1pZ2Fvc3xtb3JwaG9zfG9wZW52bXN8ZnVjaHNpYXxocC11eHxzZXJlbml0eW9zKS9pLCAvLyBCZU9TL09TMi9BbWlnYU9TL01vcnBoT1MvT3BlblZNUy9GdWNoc2lhL0hQLVVYL1NlcmVuaXR5T1NcbiAgICAgICAgICAgIC8odW5peCkgPyhbXFx3XFwuXSopL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBVTklYXG4gICAgICAgICAgICBdLCBbTkFNRSwgVkVSU0lPTl1cbiAgICAgICAgXVxuICAgIH07XG5cbiAgICAvLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8vIENvbnN0cnVjdG9yXG4gICAgLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgdmFyIFVBUGFyc2VyID0gZnVuY3Rpb24gKHVhLCBleHRlbnNpb25zKSB7XG5cbiAgICAgICAgaWYgKHR5cGVvZiB1YSA9PT0gT0JKX1RZUEUpIHtcbiAgICAgICAgICAgIGV4dGVuc2lvbnMgPSB1YTtcbiAgICAgICAgICAgIHVhID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFVBUGFyc2VyKSkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBVQVBhcnNlcih1YSwgZXh0ZW5zaW9ucykuZ2V0UmVzdWx0KCk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgX25hdmlnYXRvciA9ICh0eXBlb2Ygd2luZG93ICE9PSBVTkRFRl9UWVBFICYmIHdpbmRvdy5uYXZpZ2F0b3IpID8gd2luZG93Lm5hdmlnYXRvciA6IHVuZGVmaW5lZDtcbiAgICAgICAgdmFyIF91YSA9IHVhIHx8ICgoX25hdmlnYXRvciAmJiBfbmF2aWdhdG9yLnVzZXJBZ2VudCkgPyBfbmF2aWdhdG9yLnVzZXJBZ2VudCA6IEVNUFRZKTtcbiAgICAgICAgdmFyIF91YWNoID0gKF9uYXZpZ2F0b3IgJiYgX25hdmlnYXRvci51c2VyQWdlbnREYXRhKSA/IF9uYXZpZ2F0b3IudXNlckFnZW50RGF0YSA6IHVuZGVmaW5lZDtcbiAgICAgICAgdmFyIF9yZ3htYXAgPSBleHRlbnNpb25zID8gZXh0ZW5kKHJlZ2V4ZXMsIGV4dGVuc2lvbnMpIDogcmVnZXhlcztcbiAgICAgICAgdmFyIF9pc1NlbGZOYXYgPSBfbmF2aWdhdG9yICYmIF9uYXZpZ2F0b3IudXNlckFnZW50ID09IF91YTtcblxuICAgICAgICB0aGlzLmdldEJyb3dzZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgX2Jyb3dzZXIgPSB7fTtcbiAgICAgICAgICAgIF9icm93c2VyW05BTUVdID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgX2Jyb3dzZXJbVkVSU0lPTl0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICByZ3hNYXBwZXIuY2FsbChfYnJvd3NlciwgX3VhLCBfcmd4bWFwLmJyb3dzZXIpO1xuICAgICAgICAgICAgX2Jyb3dzZXJbTUFKT1JdID0gbWFqb3JpemUoX2Jyb3dzZXJbVkVSU0lPTl0pO1xuICAgICAgICAgICAgLy8gQnJhdmUtc3BlY2lmaWMgZGV0ZWN0aW9uXG4gICAgICAgICAgICBpZiAoX2lzU2VsZk5hdiAmJiBfbmF2aWdhdG9yICYmIF9uYXZpZ2F0b3IuYnJhdmUgJiYgdHlwZW9mIF9uYXZpZ2F0b3IuYnJhdmUuaXNCcmF2ZSA9PSBGVU5DX1RZUEUpIHtcbiAgICAgICAgICAgICAgICBfYnJvd3NlcltOQU1FXSA9ICdCcmF2ZSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gX2Jyb3dzZXI7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZ2V0Q1BVID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIF9jcHUgPSB7fTtcbiAgICAgICAgICAgIF9jcHVbQVJDSElURUNUVVJFXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIHJneE1hcHBlci5jYWxsKF9jcHUsIF91YSwgX3JneG1hcC5jcHUpO1xuICAgICAgICAgICAgcmV0dXJuIF9jcHU7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZ2V0RGV2aWNlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIF9kZXZpY2UgPSB7fTtcbiAgICAgICAgICAgIF9kZXZpY2VbVkVORE9SXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIF9kZXZpY2VbTU9ERUxdID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgX2RldmljZVtUWVBFXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIHJneE1hcHBlci5jYWxsKF9kZXZpY2UsIF91YSwgX3JneG1hcC5kZXZpY2UpO1xuICAgICAgICAgICAgaWYgKF9pc1NlbGZOYXYgJiYgIV9kZXZpY2VbVFlQRV0gJiYgX3VhY2ggJiYgX3VhY2gubW9iaWxlKSB7XG4gICAgICAgICAgICAgICAgX2RldmljZVtUWVBFXSA9IE1PQklMRTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGlQYWRPUy1zcGVjaWZpYyBkZXRlY3Rpb246IGlkZW50aWZpZWQgYXMgTWFjLCBidXQgaGFzIHNvbWUgaU9TLW9ubHkgcHJvcGVydGllc1xuICAgICAgICAgICAgaWYgKF9pc1NlbGZOYXYgJiYgX2RldmljZVtNT0RFTF0gPT0gJ01hY2ludG9zaCcgJiYgX25hdmlnYXRvciAmJiB0eXBlb2YgX25hdmlnYXRvci5zdGFuZGFsb25lICE9PSBVTkRFRl9UWVBFICYmIF9uYXZpZ2F0b3IubWF4VG91Y2hQb2ludHMgJiYgX25hdmlnYXRvci5tYXhUb3VjaFBvaW50cyA+IDIpIHtcbiAgICAgICAgICAgICAgICBfZGV2aWNlW01PREVMXSA9ICdpUGFkJztcbiAgICAgICAgICAgICAgICBfZGV2aWNlW1RZUEVdID0gVEFCTEVUO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIF9kZXZpY2U7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZ2V0RW5naW5lID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIF9lbmdpbmUgPSB7fTtcbiAgICAgICAgICAgIF9lbmdpbmVbTkFNRV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBfZW5naW5lW1ZFUlNJT05dID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgcmd4TWFwcGVyLmNhbGwoX2VuZ2luZSwgX3VhLCBfcmd4bWFwLmVuZ2luZSk7XG4gICAgICAgICAgICByZXR1cm4gX2VuZ2luZTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5nZXRPUyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBfb3MgPSB7fTtcbiAgICAgICAgICAgIF9vc1tOQU1FXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIF9vc1tWRVJTSU9OXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIHJneE1hcHBlci5jYWxsKF9vcywgX3VhLCBfcmd4bWFwLm9zKTtcbiAgICAgICAgICAgIGlmIChfaXNTZWxmTmF2ICYmICFfb3NbTkFNRV0gJiYgX3VhY2ggJiYgX3VhY2gucGxhdGZvcm0gIT0gJ1Vua25vd24nKSB7XG4gICAgICAgICAgICAgICAgX29zW05BTUVdID0gX3VhY2gucGxhdGZvcm0gIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL2Nocm9tZSBvcy9pLCBDSFJPTUlVTV9PUylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9tYWNvcy9pLCBNQUNfT1MpOyAgICAgICAgICAgLy8gYmFja3dhcmQgY29tcGF0aWJpbGl0eVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIF9vcztcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5nZXRSZXN1bHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHVhICAgICAgOiB0aGlzLmdldFVBKCksXG4gICAgICAgICAgICAgICAgYnJvd3NlciA6IHRoaXMuZ2V0QnJvd3NlcigpLFxuICAgICAgICAgICAgICAgIGVuZ2luZSAgOiB0aGlzLmdldEVuZ2luZSgpLFxuICAgICAgICAgICAgICAgIG9zICAgICAgOiB0aGlzLmdldE9TKCksXG4gICAgICAgICAgICAgICAgZGV2aWNlICA6IHRoaXMuZ2V0RGV2aWNlKCksXG4gICAgICAgICAgICAgICAgY3B1ICAgICA6IHRoaXMuZ2V0Q1BVKClcbiAgICAgICAgICAgIH07XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZ2V0VUEgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gX3VhO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLnNldFVBID0gZnVuY3Rpb24gKHVhKSB7XG4gICAgICAgICAgICBfdWEgPSAodHlwZW9mIHVhID09PSBTVFJfVFlQRSAmJiB1YS5sZW5ndGggPiBVQV9NQVhfTEVOR1RIKSA/IHRyaW0odWEsIFVBX01BWF9MRU5HVEgpIDogdWE7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5zZXRVQShfdWEpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgVUFQYXJzZXIuVkVSU0lPTiA9IExJQlZFUlNJT047XG4gICAgVUFQYXJzZXIuQlJPV1NFUiA9ICBlbnVtZXJpemUoW05BTUUsIFZFUlNJT04sIE1BSk9SXSk7XG4gICAgVUFQYXJzZXIuQ1BVID0gZW51bWVyaXplKFtBUkNISVRFQ1RVUkVdKTtcbiAgICBVQVBhcnNlci5ERVZJQ0UgPSBlbnVtZXJpemUoW01PREVMLCBWRU5ET1IsIFRZUEUsIENPTlNPTEUsIE1PQklMRSwgU01BUlRUViwgVEFCTEVULCBXRUFSQUJMRSwgRU1CRURERURdKTtcbiAgICBVQVBhcnNlci5FTkdJTkUgPSBVQVBhcnNlci5PUyA9IGVudW1lcml6ZShbTkFNRSwgVkVSU0lPTl0pO1xuXG4gICAgLy8vLy8vLy8vLy9cbiAgICAvLyBFeHBvcnRcbiAgICAvLy8vLy8vLy8vXG5cbiAgICAvLyBjaGVjayBqcyBlbnZpcm9ubWVudFxuICAgIGlmICh0eXBlb2YoZXhwb3J0cykgIT09IFVOREVGX1RZUEUpIHtcbiAgICAgICAgLy8gbm9kZWpzIGVudlxuICAgICAgICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gVU5ERUZfVFlQRSAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgICAgICAgICAgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gVUFQYXJzZXI7XG4gICAgICAgIH1cbiAgICAgICAgZXhwb3J0cy5VQVBhcnNlciA9IFVBUGFyc2VyO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHJlcXVpcmVqcyBlbnYgKG9wdGlvbmFsKVxuICAgICAgICBpZiAodHlwZW9mKGRlZmluZSkgPT09IEZVTkNfVFlQRSAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgICAgICBkZWZpbmUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBVQVBhcnNlcjtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB3aW5kb3cgIT09IFVOREVGX1RZUEUpIHtcbiAgICAgICAgICAgIC8vIGJyb3dzZXIgZW52XG4gICAgICAgICAgICB3aW5kb3cuVUFQYXJzZXIgPSBVQVBhcnNlcjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGpRdWVyeS9aZXB0byBzcGVjaWZpYyAob3B0aW9uYWwpXG4gICAgLy8gTm90ZTpcbiAgICAvLyAgIEluIEFNRCBlbnYgdGhlIGdsb2JhbCBzY29wZSBzaG91bGQgYmUga2VwdCBjbGVhbiwgYnV0IGpRdWVyeSBpcyBhbiBleGNlcHRpb24uXG4gICAgLy8gICBqUXVlcnkgYWx3YXlzIGV4cG9ydHMgdG8gZ2xvYmFsIHNjb3BlLCB1bmxlc3MgalF1ZXJ5Lm5vQ29uZmxpY3QodHJ1ZSkgaXMgdXNlZCxcbiAgICAvLyAgIGFuZCB3ZSBzaG91bGQgY2F0Y2ggdGhhdC5cbiAgICB2YXIgJCA9IHR5cGVvZiB3aW5kb3cgIT09IFVOREVGX1RZUEUgJiYgKHdpbmRvdy5qUXVlcnkgfHwgd2luZG93LlplcHRvKTtcbiAgICBpZiAoJCAmJiAhJC51YSkge1xuICAgICAgICB2YXIgcGFyc2VyID0gbmV3IFVBUGFyc2VyKCk7XG4gICAgICAgICQudWEgPSBwYXJzZXIuZ2V0UmVzdWx0KCk7XG4gICAgICAgICQudWEuZ2V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHBhcnNlci5nZXRVQSgpO1xuICAgICAgICB9O1xuICAgICAgICAkLnVhLnNldCA9IGZ1bmN0aW9uICh1YSkge1xuICAgICAgICAgICAgcGFyc2VyLnNldFVBKHVhKTtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBwYXJzZXIuZ2V0UmVzdWx0KCk7XG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wIGluIHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICQudWFbcHJvcF0gPSByZXN1bHRbcHJvcF07XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG59KSh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JyA/IHdpbmRvdyA6IHRoaXMpO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIl9fd2VicGFja19yZXF1aXJlX18uYW1kTyA9IHt9OyIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vaW5kZXgudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=