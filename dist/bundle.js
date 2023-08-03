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
        if (!activeEvent.validate(event) && shouldValidate) {
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
    validate() {
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
    validate(event) {
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
    validate() {
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
    validate() {
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
    validate(event) {
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
    validate() {
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
    validate(event) {
        if (event.target instanceof HTMLInputElement) {
            return this.basicValidation(event.target) && !!event.target.value.trim();
        }
        return false;
    }
}
exports["default"] = Input;


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
    validate() {
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
    validate() {
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
    validate() {
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
    validate() {
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
    validate() {
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
    validate(event) {
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
    validate() {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLFFBQWE7QUFDekI7QUFDQTtBQUNBLFFBQVEsZ0JBQWdCO0FBQ3hCLE1BQU07QUFDTjtBQUNBLFlBQVksVUFBYyxrQkFBa0Isd0JBQVU7QUFDdEQsWUFBWSxtQ0FBTztBQUNuQjtBQUNBLGFBQWE7QUFBQSxrR0FBQztBQUNkLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLENBQUM7Ozs7Ozs7VUNuNkJEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBOzs7OztVRUFBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vQVRTRXZlbnRzLy4vaW5kZXgudHMiLCJ3ZWJwYWNrOi8vQVRTRXZlbnRzLy4vc3JjL0Jyb3dzZXJJbmZvLnRzIiwid2VicGFjazovL0FUU0V2ZW50cy8uL3NyYy9DYW1wYWlnbkluZm8udHMiLCJ3ZWJwYWNrOi8vQVRTRXZlbnRzLy4vc3JjL0xvZ2dlci50cyIsIndlYnBhY2s6Ly9BVFNFdmVudHMvLi9zcmMvTWFuYWdlci50cyIsIndlYnBhY2s6Ly9BVFNFdmVudHMvLi9zcmMvUmVtb3RlLnRzIiwid2VicGFjazovL0FUU0V2ZW50cy8uL3NyYy9Ub29scy50cyIsIndlYnBhY2s6Ly9BVFNFdmVudHMvLi9zcmMvVXJsUGFyc2VyLnRzIiwid2VicGFjazovL0FUU0V2ZW50cy8uL3NyYy9ldmVudHMvQVRTRXZlbnQudHMiLCJ3ZWJwYWNrOi8vQVRTRXZlbnRzLy4vc3JjL2V2ZW50cy9BdHRhY2htZW50T3Blbi50cyIsIndlYnBhY2s6Ly9BVFNFdmVudHMvLi9zcmMvZXZlbnRzL0NsaWNrLnRzIiwid2VicGFjazovL0FUU0V2ZW50cy8uL3NyYy9ldmVudHMvRG93bmxvYWQudHMiLCJ3ZWJwYWNrOi8vQVRTRXZlbnRzLy4vc3JjL2V2ZW50cy9FeHRlbnNpb24udHMiLCJ3ZWJwYWNrOi8vQVRTRXZlbnRzLy4vc3JjL2V2ZW50cy9GaWxlRG93bmxvYWQudHMiLCJ3ZWJwYWNrOi8vQVRTRXZlbnRzLy4vc3JjL2V2ZW50cy9GaWxlT3Blbi50cyIsIndlYnBhY2s6Ly9BVFNFdmVudHMvLi9zcmMvZXZlbnRzL0lucHV0LnRzIiwid2VicGFjazovL0FUU0V2ZW50cy8uL3NyYy9ldmVudHMvTWljcm9waG9uZS50cyIsIndlYnBhY2s6Ly9BVFNFdmVudHMvLi9zcmMvZXZlbnRzL05vdGlmaWNhdGlvbi50cyIsIndlYnBhY2s6Ly9BVFNFdmVudHMvLi9zcmMvZXZlbnRzL1BhZ2VMZWZ0LnRzIiwid2VicGFjazovL0FUU0V2ZW50cy8uL3NyYy9ldmVudHMvUGFnZUxvYWRlZC50cyIsIndlYnBhY2s6Ly9BVFNFdmVudHMvLi9zcmMvZXZlbnRzL1BhZ2VSZWFkLnRzIiwid2VicGFjazovL0FUU0V2ZW50cy8uL3NyYy9ldmVudHMvU3VibWl0LnRzIiwid2VicGFjazovL0FUU0V2ZW50cy8uL3NyYy9ldmVudHMvV2ViY2FtLnRzIiwid2VicGFjazovL0FUU0V2ZW50cy8uL25vZGVfbW9kdWxlcy91YS1wYXJzZXItanMvc3JjL3VhLXBhcnNlci5qcyIsIndlYnBhY2s6Ly9BVFNFdmVudHMvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vQVRTRXZlbnRzL3dlYnBhY2svcnVudGltZS9hbWQgb3B0aW9ucyIsIndlYnBhY2s6Ly9BVFNFdmVudHMvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9BVFNFdmVudHMvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL0FUU0V2ZW50cy93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTWFuYWdlciB9IGZyb20gXCIuL3NyYy9NYW5hZ2VyXCI7XG5pbXBvcnQgUmVtb3RlIGZyb20gXCIuL3NyYy9SZW1vdGVcIjtcbmltcG9ydCB7cmVtb3ZlU3ViZG9tYWlufSBmcm9tIFwiLi9zcmMvVG9vbHNcIjtcblxuaW50ZXJmYWNlIE9wdGlvbnMge1xuXHRhcGlLZXk/OiBzdHJpbmcsXG5cdGRlYnVnPzogYm9vbGVhbixcblx0ZXZlbnRzPzogc3RyaW5nW11cblx0cmVkaXJlY3RVcmw6IHN0cmluZyxcblx0c2hvdWxkUmVkaXJlY3Q6IGJvb2xlYW4sXG5cdHNvdXJjZTogc3RyaW5nLFxuXHR1cmw6IHN0cmluZyxcbn1cblxuY29uc3QgZGVmYXVsdE9wdGlvbnM6IE9wdGlvbnMgPSB7XG5cdGV2ZW50czogW10sXG5cdGRlYnVnOiBmYWxzZSxcblx0c2hvdWxkUmVkaXJlY3Q6IHRydWUsXG5cdHJlZGlyZWN0VXJsOiBgaHR0cHM6Ly9vb3BzLiR7cmVtb3ZlU3ViZG9tYWluKHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZSl9YCxcblx0c291cmNlOiBcIkxQXCIsXG5cdHVybDogXCJodHRwczovL2FwaS5hdHRhY2tzaW11bGF0b3IuY29tL3YwL2NsaWVudC1ldmVudHNcIixcbn07XG5cbmNsYXNzIEFUU0V2ZW50cyB7XG5cdHByaXZhdGUgbWFuYWdlcjogTWFuYWdlcjtcblxuXHRjb25zdHJ1Y3RvcihvcHRpb25zOiBPcHRpb25zKSB7XG5cdFx0Y29uc3QgX29wdGlvbnMgPSB7Li4uZGVmYXVsdE9wdGlvbnMsIC4uLm9wdGlvbnN9O1xuXHRcdGlmIChfb3B0aW9ucy5kZWJ1Zykge1xuXHRcdFx0Y29uc29sZS5sb2coX29wdGlvbnMpO1xuXHRcdH1cblx0XHRjb25zdCByZW1vdGUgPSBuZXcgUmVtb3RlKF9vcHRpb25zLmFwaUtleSwgX29wdGlvbnMudXJsLCBfb3B0aW9ucy5kZWJ1Zyk7XG5cdFx0dGhpcy5tYW5hZ2VyID0gbmV3IE1hbmFnZXIocmVtb3RlLCBfb3B0aW9ucy5ldmVudHMsIF9vcHRpb25zLnNvdXJjZSwgX29wdGlvbnMucmVkaXJlY3RVcmwsIF9vcHRpb25zLnNob3VsZFJlZGlyZWN0LCBfb3B0aW9ucy5kZWJ1Zyk7XG5cdH1cblxuXHRsaXN0ZW4oKSB7XG5cdFx0dGhpcy5tYW5hZ2VyLmxpc3RlbigpO1xuXHR9XG5cblx0c3RvcCgpIHtcblx0XHR0aGlzLm1hbmFnZXIuc3RvcCgpO1xuXHR9XG5cblx0dHJpZ2dlcihuYW1lOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcblx0XHRyZXR1cm4gdGhpcy5tYW5hZ2VyLnRyaWdnZXIobmFtZSk7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBBVFNFdmVudHM7XG4iLCJpbXBvcnQgcGFyc2VyIGZyb20gXCJ1YS1wYXJzZXItanNcIjtcblxuaW50ZXJmYWNlIFNjcmVlblNpemUge1xuICAgIHdpZHRoID86IG51bWJlclxuICAgIGhlaWdodCA/OiBudW1iZXJcbn1cblxuaW50ZXJmYWNlIEJyb3dzZXIge1xuICAgIG5hbWUgPzogc3RyaW5nXG4gICAgdmVyc2lvbiA/OiBzdHJpbmdcbiAgICBtYWpvcl92ZXJzaW9uID86IG51bWJlclxuICAgIG1vYmlsZSA/OiBib29sZWFuXG59XG5cbmludGVyZmFjZSBPUyB7XG4gICAgbmFtZSA/OiBzdHJpbmdcbiAgICB2ZXJzaW9uID86IHN0cmluZ1xufVxuXG5pbnRlcmZhY2UgRGV2aWNlIHtcbiAgICBtb2RlbD86IHN0cmluZ1xuICAgIHR5cGU/OiBzdHJpbmdcbiAgICB2ZW5kb3I/OiBzdHJpbmdcbn1cbmludGVyZmFjZSBDcHUge1xuICAgIGFyY2hpdGVjdHVyZSA/OnN0cmluZ1xufVxuZXhwb3J0IGludGVyZmFjZSBCcm93c2VySW5mbyB7XG4gICAgdWE6IHN0cmluZztcbiAgICBzY3JlZW5fc2l6ZTogU2NyZWVuU2l6ZTtcbiAgICBicm93c2VyOiBCcm93c2VyO1xuICAgIG9zOiBPUztcbiAgICBkZXZpY2U6IERldmljZTtcbiAgICBjcHU6IENwdTtcbn1cblxuZnVuY3Rpb24gZmluZEJyb3dzZXIoKTogQnJvd3NlciB7XG5cdGxldCB2ZXJPZmZzZXQ6IG51bWJlcjtcblx0Y29uc3QgYnJvd3NlcjogQnJvd3NlciA9IHt9O1xuXHRjb25zdCB1c2VyQWdlbnQgPSBuYXZpZ2F0b3IudXNlckFnZW50O1xuXG5cdC8vIE9wZXJhXG5cdGlmICgodmVyT2Zmc2V0ID0gdXNlckFnZW50LmluZGV4T2YoXCJPcGVyYVwiKSkgIT09IC0xKSB7XG5cdFx0YnJvd3Nlci5uYW1lID0gXCJPcGVyYVwiO1xuXHRcdGJyb3dzZXIudmVyc2lvbiA9IHVzZXJBZ2VudC5zdWJzdHJpbmcodmVyT2Zmc2V0ICsgNik7XG5cdFx0aWYgKCh2ZXJPZmZzZXQgPSB1c2VyQWdlbnQuaW5kZXhPZihcIlZlcnNpb25cIikpICE9PSAtMSkge1xuXHRcdFx0YnJvd3Nlci52ZXJzaW9uID0gdXNlckFnZW50LnN1YnN0cmluZyh2ZXJPZmZzZXQgKyA4KTtcblx0XHR9XG5cdH1cblxuXHQvLyBPcGVyYSBOZXh0XG5cdGVsc2UgaWYgKCh2ZXJPZmZzZXQgPSB1c2VyQWdlbnQuaW5kZXhPZihcIk9QUlwiKSkgIT09IC0xKSB7XG5cdFx0YnJvd3Nlci5uYW1lID0gXCJPcGVyYVwiO1xuXHRcdGJyb3dzZXIudmVyc2lvbiA9IHVzZXJBZ2VudC5zdWJzdHJpbmcodmVyT2Zmc2V0ICsgNSk7XG5cdH1cblxuXHQvLyBFZGdlXG5cdGVsc2UgaWYgKCh2ZXJPZmZzZXQgPSB1c2VyQWdlbnQuaW5kZXhPZihcIkVkZ2VcIikpICE9PSAtMSkge1xuXHRcdGJyb3dzZXIubmFtZSA9IFwiTWljcm9zb2Z0IEVkZ2VcIjtcblx0XHRicm93c2VyLnZlcnNpb24gPSB1c2VyQWdlbnQuc3Vic3RyaW5nKHZlck9mZnNldCArIDUpO1xuXHR9XG5cblx0Ly8gTVNJRVxuXHRlbHNlIGlmICgodmVyT2Zmc2V0ID0gdXNlckFnZW50LmluZGV4T2YoXCJNU0lFXCIpKSAhPT0gLTEpIHtcblx0XHRicm93c2VyLm5hbWUgPSBcIk1pY3Jvc29mdCBJbnRlcm5ldCBFeHBsb3JlclwiO1xuXHRcdGJyb3dzZXIudmVyc2lvbiA9IHVzZXJBZ2VudC5zdWJzdHJpbmcodmVyT2Zmc2V0ICsgNSk7XG5cdH1cblxuXHQvLyBDaHJvbWVcblx0ZWxzZSBpZiAoKHZlck9mZnNldCA9IHVzZXJBZ2VudC5pbmRleE9mKFwiQ2hyb21lXCIpKSAhPT0gLTEpIHtcblx0XHRicm93c2VyLm5hbWUgPSBcIkNocm9tZVwiO1xuXHRcdGJyb3dzZXIudmVyc2lvbiA9IHVzZXJBZ2VudC5zdWJzdHJpbmcodmVyT2Zmc2V0ICsgNyk7XG5cdH1cblxuXHQvLyBTYWZhcmlcblx0ZWxzZSBpZiAoKHZlck9mZnNldCA9IHVzZXJBZ2VudC5pbmRleE9mKFwiU2FmYXJpXCIpKSAhPT0gLTEpIHtcblx0XHRicm93c2VyLm5hbWUgPSBcIlNhZmFyaVwiO1xuXHRcdGJyb3dzZXIudmVyc2lvbiA9IHVzZXJBZ2VudC5zdWJzdHJpbmcodmVyT2Zmc2V0ICsgNyk7XG5cdFx0aWYgKCh2ZXJPZmZzZXQgPSB1c2VyQWdlbnQuaW5kZXhPZihcIlZlcnNpb25cIikpICE9PSAtMSkge1xuXHRcdFx0YnJvd3Nlci52ZXJzaW9uID0gdXNlckFnZW50LnN1YnN0cmluZyh2ZXJPZmZzZXQgKyA4KTtcblx0XHR9XG5cdH1cblxuXHQvLyBGaXJlZm94XG5cdGVsc2UgaWYgKCh2ZXJPZmZzZXQgPSB1c2VyQWdlbnQuaW5kZXhPZihcIkZpcmVmb3hcIikpICE9PSAtMSkge1xuXHRcdGJyb3dzZXIubmFtZSA9IFwiRmlyZWZveFwiO1xuXHRcdGJyb3dzZXIudmVyc2lvbiA9IHVzZXJBZ2VudC5zdWJzdHJpbmcodmVyT2Zmc2V0ICsgOCk7XG5cdH1cblxuXHQvLyBNU0lFIDExK1xuXHRlbHNlIGlmICh1c2VyQWdlbnQuaW5kZXhPZihcIlRyaWRlbnQvXCIpICE9PSAtMSkge1xuXHRcdGJyb3dzZXIubmFtZSA9IFwiTWljcm9zb2Z0IEludGVybmV0IEV4cGxvcmVyXCI7XG5cdFx0YnJvd3Nlci52ZXJzaW9uID0gdXNlckFnZW50LnN1YnN0cmluZyh1c2VyQWdlbnQuaW5kZXhPZihcInJ2OlwiKSArIDMpO1xuXHR9XG5cblx0YnJvd3Nlci5tb2JpbGUgPSAvTW9iaWxlfG1pbml8RmVubmVjfEFuZHJvaWR8aVAoYWR8b2R8aG9uZSkvLnRlc3QodXNlckFnZW50KTtcblxuXHQvLyB0cmltIHRoZSB2ZXJzaW9uIHN0cmluZ1xuXHRsZXQgaXg7XG5cdGlmICgoaXggPSBicm93c2VyLnZlcnNpb24uaW5kZXhPZihcIjtcIikpICE9IC0xKSBicm93c2VyLnZlcnNpb24gPSBicm93c2VyLnZlcnNpb24uc3Vic3RyaW5nKDAsIGl4KTtcblx0aWYgKChpeCA9IGJyb3dzZXIudmVyc2lvbi5pbmRleE9mKFwiIFwiKSkgIT0gLTEpIGJyb3dzZXIudmVyc2lvbiA9IGJyb3dzZXIudmVyc2lvbi5zdWJzdHJpbmcoMCwgaXgpO1xuXHRpZiAoKGl4ID0gYnJvd3Nlci52ZXJzaW9uLmluZGV4T2YoXCIpXCIpKSAhPSAtMSkgYnJvd3Nlci52ZXJzaW9uID0gYnJvd3Nlci52ZXJzaW9uLnN1YnN0cmluZygwLCBpeCk7XG5cblx0YnJvd3Nlci5tYWpvcl92ZXJzaW9uID0gcGFyc2VJbnQoXCJcIiArIGJyb3dzZXIudmVyc2lvbiwgMTApO1xuXHRpZiAoaXNOYU4oIGJyb3dzZXIubWFqb3JfdmVyc2lvbikpIHtcblx0XHRicm93c2VyLnZlcnNpb24gPSBcIlwiICsgcGFyc2VGbG9hdChuYXZpZ2F0b3IuYXBwVmVyc2lvbik7XG5cdFx0YnJvd3Nlci5tYWpvcl92ZXJzaW9uID0gcGFyc2VJbnQobmF2aWdhdG9yLmFwcFZlcnNpb24sIDEwKTtcblx0fVxuICAgIFxuXHRyZXR1cm4gYnJvd3Nlcjtcbn1cblxuZnVuY3Rpb24gZmluZE9wZXJhdGluZ1N5c3RlbShwYXJzZXI6IGFueSk6IE9TIHtcblx0Y29uc3Qge25hbWUsIHZlcnNpb259ID0gcGFyc2VyLmdldE9TKCk7XG5cdHJldHVybiB7IG5hbWUsIHZlcnNpb259O1xufVxuXG5mdW5jdGlvbiBmaW5kRGV2aWNlKHBhcnNlcjogYW55KTogRGV2aWNlIHtcblx0Y29uc3Qge21vZGVsLCB0eXBlLCB2ZW5kb3J9ID0gcGFyc2VyLmdldERldmljZSgpO1xuXHRyZXR1cm4ge21vZGVsLCB0eXBlLCB2ZW5kb3J9O1xufVxuXG5mdW5jdGlvbiBmaW5kQ3B1KHBhcnNlcjogYW55KTogQ3B1IHtcblx0Y29uc3Qge2FyY2hpdGVjdHVyZX0gPSBwYXJzZXIuZ2V0Q1BVKCk7XG5cdHJldHVybiB7YXJjaGl0ZWN0dXJlfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRCcm93c2VySW5mbygpOiBCcm93c2VySW5mbyB7XG5cdGNvbnN0IHVhID0gbmV3IHBhcnNlcigpO1xuXHRyZXR1cm4ge1xuXHRcdHVhOiB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudCxcblx0XHRzY3JlZW5fc2l6ZToge1xuXHRcdFx0d2lkdGg6IHNjcmVlbi53aWR0aCB8fCAwLFxuXHRcdFx0aGVpZ2h0OiBzY3JlZW4uaGVpZ2h0IHx8IDBcblx0XHR9LFxuXHRcdGJyb3dzZXI6IGZpbmRCcm93c2VyKCksXG5cdFx0b3M6IGZpbmRPcGVyYXRpbmdTeXN0ZW0odWEpLFxuXHRcdGRldmljZTogZmluZERldmljZSh1YSksXG5cdFx0Y3B1OiBmaW5kQ3B1KHVhKVxuXHR9O1xufSIsImltcG9ydCB7IFVybFBhcnNlciB9IGZyb20gXCIuL1VybFBhcnNlclwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIENhbXBhaWduSW5mbyB7XG4gICAgYXRzX2VudiA/OiBzdHJpbmdcbiAgICBhdHNfYXRrX3R5cGUgPzogc3RyaW5nXG4gICAgYXRzX2NhbXBhaWduX25hbWUgPzogc3RyaW5nXG4gICAgYXRzX2NvbXBhbnlfaWQgPzogc3RyaW5nXG4gICAgYXRzX2luc3RhbmNlX2lkID86IHN0cmluZ1xuICAgIGF0c19sb2NhbGUgPzogc3RyaW5nXG4gICAgYXRzX3Byb2Nlc3NlZF9kYXRlID86IHN0cmluZ1xuICAgIGF0c191c2VyX2lkID86IHN0cmluZ1xuXHRkb3dubG9hZF90eXBlID86IHN0cmluZ1xufVxuXG5mdW5jdGlvbiByZWFkVG9rZW5TdHJpbmcodG9rZW5TdHJpbmcgPzogc3RyaW5nLCBmaWxlVHlwZSA/OiBzdHJpbmcpOiBDYW1wYWlnbkluZm8ge1xuXHRjb25zdCBiYXNlNjRVcmwgPSB0b2tlblN0cmluZy5zcGxpdChcIi5cIilbMV07XG5cdGNvbnN0IGJhc2U2NCA9ICBiYXNlNjRVcmwucmVwbGFjZSgvLS9nLCBcIitcIikucmVwbGFjZSgvXy9nLCBcIi9cIik7XG5cdGNvbnN0IGNhbXBhaWduSW5mbyA9IEpTT04ucGFyc2Uod2luZG93LmF0b2IoYmFzZTY0KSkucGF5bG9hZCBhcyBDYW1wYWlnbkluZm87XG5cblx0aWYgKGZpbGVUeXBlID09PSBcImF0dGFjaG1lbnRcIikge1xuXHRcdGNhbXBhaWduSW5mby5kb3dubG9hZF90eXBlID0gXCJhdHRhY2htZW50XCI7XG5cdH0gZWxzZSBpZiAoZmlsZVR5cGUgIT09IG51bGwpIHtcblx0XHRjYW1wYWlnbkluZm8uZG93bmxvYWRfdHlwZSA9IFwiZmlsZVwiO1xuXHR9XG5cblx0cmV0dXJuIGNhbXBhaWduSW5mbztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRDYW1wYWlnbkluZm8oKSA6IFtzdHJpbmcsIENhbXBhaWduSW5mb10ge1xuXHRjb25zdCB1cmwgPSBuZXcgVXJsUGFyc2VyKHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcblx0Y29uc3QgdG9rZW5TdHJpbmcgPSB1cmwuZmluZFBhcmFtKFwidGtcIik7XG5cdGlmICghdG9rZW5TdHJpbmcpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJNaXNzaW5nIEFUVEFDSyBTaW11bGF0b3IgdG9rZW5cIik7XG5cdH1cblx0Y29uc3QgZmlsZVR5cGUgPSB1cmwuZmluZFBhcmFtKFwiZmlsZV90eXBlXCIpO1xuXG5cdHRyeSB7XG5cdFx0cmV0dXJuIFt0b2tlblN0cmluZywgcmVhZFRva2VuU3RyaW5nKHRva2VuU3RyaW5nLCBmaWxlVHlwZSldO1xuXHR9IGNhdGNoKGUpIHtcblx0XHRyZXR1cm4gW3Rva2VuU3RyaW5nLCB7IGF0c19jb21wYW55X2lkOiBcIlwiIH1dO1xuXHR9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBMb2dnZXIge1xuXHRwcml2YXRlIGRlYnVnOiBib29sZWFuO1xuXHRjb25zdHJ1Y3RvcihkZWJ1ZzogYm9vbGVhbikge1xuXHRcdHRoaXMuZGVidWcgPSBkZWJ1Zztcblx0fVxuXG5cdHB1YmxpYyBpbmZvKG1lc3NhZ2U6IGFueSk6IHZvaWQge1xuXHRcdGlmICh0aGlzLmRlYnVnKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhtZXNzYWdlKTtcblx0XHR9XG5cdH1cblxuXHRwdWJsaWMgZXJyb3IobWVzc2FnZTogYW55KTogdm9pZCB7XG5cdFx0aWYgKHRoaXMuZGVidWcpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IobWVzc2FnZSk7XG5cdFx0fVxuXHR9XG5cblx0cHVibGljIHdhcm4obWVzc2FnZTogYW55KTogdm9pZCB7XG5cdFx0aWYgKHRoaXMuZGVidWcpIHtcblx0XHRcdGNvbnNvbGUud2FybihtZXNzYWdlKTtcblx0XHR9XG5cdH1cbn0iLCJpbXBvcnQgeyBCcm93c2VySW5mbywgZmluZEJyb3dzZXJJbmZvIH0gZnJvbSBcIi4vQnJvd3NlckluZm9cIjtcbmltcG9ydCB7IENhbXBhaWduSW5mbywgZmluZENhbXBhaWduSW5mbyB9IGZyb20gXCIuL0NhbXBhaWduSW5mb1wiO1xuaW1wb3J0IHsgY3JlYXRlVVVJRCwgZGVib3VuY2UgfSBmcm9tIFwiLi9Ub29sc1wiOyBcblxuaW1wb3J0IEF0dGFjaG1lbnRPcGVuIGZyb20gXCIuL2V2ZW50cy9BdHRhY2htZW50T3BlblwiO1xuaW1wb3J0IENsaWNrIGZyb20gXCIuL2V2ZW50cy9DbGlja1wiO1xuaW1wb3J0IERvd25sb2FkIGZyb20gXCIuL2V2ZW50cy9Eb3dubG9hZFwiO1xuaW1wb3J0IEV4dGVuc2lvbiBmcm9tIFwiLi9ldmVudHMvRXh0ZW5zaW9uXCI7XG5pbXBvcnQgRmlsZURvd25sb2FkIGZyb20gXCIuL2V2ZW50cy9GaWxlRG93bmxvYWRcIjtcbmltcG9ydCBGaWxlT3BlbiBmcm9tIFwiLi9ldmVudHMvRmlsZU9wZW5cIjtcbmltcG9ydCBJbnB1dCBmcm9tIFwiLi9ldmVudHMvSW5wdXRcIjtcbmltcG9ydCBNaWNyb3Bob25lIGZyb20gXCIuL2V2ZW50cy9NaWNyb3Bob25lXCI7XG5pbXBvcnQgTm90aWZpY2F0aW9uIGZyb20gXCIuL2V2ZW50cy9Ob3RpZmljYXRpb25cIjtcbmltcG9ydCBQYWdlTGVmdCBmcm9tIFwiLi9ldmVudHMvUGFnZUxlZnRcIjtcbmltcG9ydCBQYWdlTG9hZGVkIGZyb20gXCIuL2V2ZW50cy9QYWdlTG9hZGVkXCI7XG5pbXBvcnQgUGFnZVJlYWQgZnJvbSBcIi4vZXZlbnRzL1BhZ2VSZWFkXCI7XG5pbXBvcnQgU3VibWl0IGZyb20gXCIuL2V2ZW50cy9TdWJtaXRcIjtcbmltcG9ydCBXZWJjYW0gZnJvbSBcIi4vZXZlbnRzL1dlYmNhbVwiO1xuaW1wb3J0IElFdmVudCBmcm9tIFwiLi9pbnRlZmFjZXMvSUV2ZW50XCI7XG4gXG5pbXBvcnQgSUV2ZW50UGF5bG9hZCBmcm9tIFwiLi9pbnRlZmFjZXMvSUV2ZW50UGF5bG9hZFwiO1xuaW1wb3J0IFJlbW90ZSBmcm9tIFwiLi9SZW1vdGVcIjtcblxuaW1wb3J0IExvZ2dlciBmcm9tIFwiLi9Mb2dnZXJcIjtcblxuZXhwb3J0IGNsYXNzIE1hbmFnZXIge1xuXHRwcml2YXRlIHJlYWRvbmx5IHN1cHBvcnRlZFR5cGVzIDogc3RyaW5nW10gPSBbXCJlbWFpbFwiLCBcInBhc3N3b3JkXCIsIFwidGVsXCIsIFwidGV4dFwiLCBcImdpdmVuLW5hbWVcIiwgXCJuYW1lXCIsIFwiZmFtaWx5LW5hbWVcIiwgXCJzdHJlZXQtYWRkcmVzc1wiLCBcImNjLW5hbWVcIiwgXCJjYy1naXZlbi1uYW1lXCIsIFwiY2MtZmFtaWx5LW5hbWVcIiwgXCJjYy1udW1iZXJcIiwgXCJjYy1leHBcIiwgXCJjYy1leHAtbW9udGhcIiwgXCJjYy1leHAteWVhclwiLCBcImNjLWNzY1wiLCBcImNjLXR5cGVcIl07XG5cdHByaXZhdGUgcmVhZG9ubHkgc3VwcG9ydGVkRXZlbnRzID0ge1xuXHRcdFwiYXR0YWNobWVudF9vcGVuZWRcIjogQXR0YWNobWVudE9wZW4sXG5cdFx0XCJidXR0b25fY2xpY2tlZFwiOiBDbGljayxcblx0XHRcImRvd25sb2FkXCI6IERvd25sb2FkLFxuXHRcdFwiZXh0ZW5zaW9uX2luc3RhbGxlZFwiOiBFeHRlbnNpb24sXG5cdFx0XCJmaWxlX2Rvd25sb2FkXCI6IEZpbGVEb3dubG9hZCxcdFx0XG5cdFx0XCJmaWxlX29wZW5cIjogRmlsZU9wZW4sXG5cdFx0XCJpbnB1dF9maWxsZWRcIjogSW5wdXQsXG5cdFx0XCJwYWdlX2xlZnRcIjogUGFnZUxlZnQsXG5cdFx0XCJwYWdlX2xvYWRlZFwiOiBQYWdlTG9hZGVkLFxuXHRcdFwicGFnZV9yZWFkXCI6IFBhZ2VSZWFkLFxuXHRcdFwibWljX2FjY2VwdGVkXCI6IE1pY3JvcGhvbmUsXG5cdFx0XCJub3RpZmljYXRpb25fYWNjZXB0ZWRcIjogTm90aWZpY2F0aW9uLFxuXHRcdFwiZm9ybV9zdWJtaXR0ZWRcIjogU3VibWl0LFxuXHRcdFwid2ViY2FtX2FjY2VwdGVkXCI6IFdlYmNhbSxcblx0fTtcblx0cHJpdmF0ZSByZWFkb25seSBicm93c2VySW5mbzogQnJvd3NlckluZm87XG5cdHByaXZhdGUgcmVhZG9ubHkgY2FtcGFpZ25JbmZvOiBDYW1wYWlnbkluZm87XG5cdHByaXZhdGUgcmVhZG9ubHkgcmVkaXJlY3RVcmw6IHN0cmluZztcblx0cHJpdmF0ZSByZWFkb25seSBzaG91bGRSZWRpcmVjdDogYm9vbGVhbjtcblx0cHJpdmF0ZSByZWFkb25seSByZW1vdGU6IFJlbW90ZTtcblx0cHJpdmF0ZSByZWFkb25seSBzb3VyY2U6IHN0cmluZztcblx0cHJpdmF0ZSByZWFkb25seSB0b2tlbjogc3RyaW5nO1xuXG5cdHByaXZhdGUgbG9nZ2VyOiBMb2dnZXI7XG5cdHByaXZhdGUgaGFuZGxlcnMgPSBbXTtcblx0cHJpdmF0ZSBkaXNhYmxlZEV2ZW50cyA9IFtdO1xuXHRwcml2YXRlIGFjdGl2ZUV2ZW50czogSUV2ZW50W107XG5cblx0Y29uc3RydWN0b3IocmVtb3RlOiBSZW1vdGUsIGV2ZW50TmFtZXM6IHN0cmluZ1tdLCBzb3VyY2U6IHN0cmluZywgcmVkaXJlY3RVcmw6IHN0cmluZywgc2hvdWxkUmVkaXJlY3Q6IGJvb2xlYW4sIGRlYnVnID0gZmFsc2UpIHtcblx0XHR0aGlzLmxvZ2dlciA9IG5ldyBMb2dnZXIoZGVidWcpO1xuXG5cdFx0dGhpcy5yZW1vdGUgPSByZW1vdGU7XG5cdFx0W3RoaXMudG9rZW4sIHRoaXMuY2FtcGFpZ25JbmZvXSA9IGZpbmRDYW1wYWlnbkluZm8oKTtcblx0XHR0aGlzLmJyb3dzZXJJbmZvID0gZmluZEJyb3dzZXJJbmZvKCk7XG5cblx0XHRpZiAoIWV2ZW50TmFtZXMubGVuZ3RoKSB7XG5cdFx0XHRldmVudE5hbWVzID0gT2JqZWN0LmtleXModGhpcy5zdXBwb3J0ZWRFdmVudHMpO1xuXHRcdH1cblxuXHRcdHRoaXMuYWN0aXZlRXZlbnRzID0gZXZlbnROYW1lcy5tYXAobmFtZSA9PiB0aGlzLmdldEV2ZW50KG5hbWUpKS5maWx0ZXIoZXZlbnQgPT4gZXZlbnQgIT09IG51bGwpO1xuXHRcdHRoaXMubG9nZ2VyLmluZm8oYEVuYWJsZWQgZXZlbnRzOiAke2V2ZW50TmFtZXMuam9pbihcIiB8IFwiKX1gKTtcblxuXHRcdHRoaXMuc291cmNlID0gc291cmNlO1xuXHRcdHRoaXMucmVkaXJlY3RVcmwgPSByZWRpcmVjdFVybDtcblx0XHR0aGlzLnNob3VsZFJlZGlyZWN0ID0gc2hvdWxkUmVkaXJlY3Q7XG5cblx0XHRpZiAodGhpcy5jYW1wYWlnbkluZm8uZG93bmxvYWRfdHlwZSkge1xuXHRcdFx0dGhpcy5jaGVja0Rvd25sb2FkKCk7XG5cdFx0fVxuXG5cdH1cblxuXHRwcml2YXRlIGdldEV2ZW50KG5hbWU6IHN0cmluZykge1xuXHRcdGlmICghIHRoaXMuc3VwcG9ydGVkRXZlbnRzW25hbWVdKSB7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cblx0XHRyZXR1cm4gbmV3ICh0aGlzLnN1cHBvcnRlZEV2ZW50c1tuYW1lXSk7XG5cdH1cblxuXHRwcml2YXRlIGNoZWNrRG93bmxvYWQoKSB7XG5cdFx0c3dpdGNoICh0aGlzLmNhbXBhaWduSW5mby5kb3dubG9hZF90eXBlKSB7XG5cdFx0Y2FzZSBcImZpbGVcIjpcblx0XHRcdHJldHVybiB0aGlzLnRyaWdnZXIoXCJmaWxlX29wZW5lZFwiKTtcblx0XHRjYXNlIFwiYXR0YWNobWVudFwiOlxuXHRcdFx0cmV0dXJuIHRoaXMudHJpZ2dlcihcImF0dGFjaG1lbnRfb3BlbmVkXCIpO1xuXHRcdH1cblx0fVxuXG5cdHB1YmxpYyBsaXN0ZW4oKSB7XG5cdFx0bGV0IGkgPSAwO1xuXHRcdGZvcihjb25zdCBhY3RpdmVFdmVudCBvZiB0aGlzLmFjdGl2ZUV2ZW50cykge1xuXHRcdFx0aWYgKCEgYWN0aXZlRXZlbnQudHJpZ2dlcikge1xuXHRcdFx0XHR0aGlzLmxvZ2dlci5pbmZvKGBUaGUgYWN0aXZlIGV2ZW50ICR7YWN0aXZlRXZlbnQubmFtZX0gZG9lcyBub3QgaGF2ZSBhIHRyaWdnZXIuIFNraXBwaW5nLi4uYCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLmxvZ2dlci5pbmZvKGBMaXN0ZW5pbmcgZm9yIGV2ZW50IEAke2FjdGl2ZUV2ZW50LnRyaWdnZXJ9ICgke2FjdGl2ZUV2ZW50Lm5hbWV9KWApO1xuXHRcdFx0XHRhY3RpdmVFdmVudC5zb3VyY2UuYWRkRXZlbnRMaXN0ZW5lcihhY3RpdmVFdmVudC50cmlnZ2VyLCB0aGlzLmhhbmRsZXJzW2krK10gPSAoZXZlbnQ6IEV2ZW50KSA9PiB0aGlzLnByZWhhbmRsZShhY3RpdmVFdmVudCwgZXZlbnQpKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRwdWJsaWMgc3RvcCgpIHtcblx0XHRsZXQgaSA9IDA7XG5cdFx0Zm9yKGNvbnN0IGFjdGl2ZUV2ZW50IG9mIHRoaXMuYWN0aXZlRXZlbnRzKSB7XG5cdFx0XHRpZiAoISBhY3RpdmVFdmVudC50cmlnZ2VyKSB7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLmxvZ2dlci5pbmZvKGBTdG9wcGluZyBsaXN0ZW5pbmcgZm9yIGV2ZW50IEAke2FjdGl2ZUV2ZW50LnRyaWdnZXJ9ICgke2FjdGl2ZUV2ZW50Lm5hbWV9KWApOyAgICAgICAgXG5cdFx0XHRhY3RpdmVFdmVudC5zb3VyY2UucmVtb3ZlRXZlbnRMaXN0ZW5lcihhY3RpdmVFdmVudC50cmlnZ2VyLCB0aGlzLmhhbmRsZXJzW2krK10pO1xuXHRcdH1cblx0fVxuXG5cdHB1YmxpYyB0cmlnZ2VyKGV2ZW50TmFtZTogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG5cdFx0Y29uc3QgYWN0aXZlRXZlbnQgPSB0aGlzLmdldEV2ZW50KGV2ZW50TmFtZSk7XG5cdFx0aWYgKCFhY3RpdmVFdmVudCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBldmVudCAke2V2ZW50TmFtZX0uIFBsZWFzZSBjaG9vc2Ugb25lIG9mICR7T2JqZWN0LmtleXModGhpcy5zdXBwb3J0ZWRFdmVudHMpLmpvaW4oXCIsIFwiKX1gKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcy5leGVjdXRlRXZlbnQoYWN0aXZlRXZlbnQsIG51bGwsIGZhbHNlKTtcblx0fVxuXG5cdHByaXZhdGUgcHJlaGFuZGxlKGFjdGl2ZUV2ZW50OiBJRXZlbnQsIGV2ZW50PzogRXZlbnQpIHtcdFx0XG5cdFx0aWYgKGFjdGl2ZUV2ZW50LnNob3VsZERlYm91bmNlKSB7XG5cdFx0XHRkZWJvdW5jZSgoLi4uYXJnczogW0lFdmVudCwgRXZlbnRdKSA9PiB0aGlzLmhhbmRsZSguLi5hcmdzKSwgNTAwLCBhY3RpdmVFdmVudCwgZXZlbnQpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLmhhbmRsZShhY3RpdmVFdmVudCwgZXZlbnQpO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgZmluZFR5cGUoYWN0aXZlRXZlbnQ6IElFdmVudCwgZXZlbnQ/OiBFdmVudCk6IHN0cmluZyB8IG51bGwge1xuXHRcdGlmICghYWN0aXZlRXZlbnQuaGFzVHlwZXMgfHwgIWV2ZW50KSB7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cblx0XHRjb25zdCBpbnB1dEVsZW1lbnQgPSBldmVudC50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudDtcblx0XHRcblx0XHRjb25zdCB0eXBlID0gaW5wdXRFbGVtZW50LmdldEF0dHJpYnV0ZShcImF1dG9jb21wbGV0ZVwiKSB8fCBpbnB1dEVsZW1lbnQudHlwZTtcdFxuXHRcdFxuXHRcdGlmICh0aGlzLnN1cHBvcnRlZFR5cGVzLmluZGV4T2YodHlwZSkgIT09IC0xKSB7XG5cdFx0XHRyZXR1cm4gdHlwZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXG5cdHByaXZhdGUgZmluZE5hbWUoYWN0aXZlRXZlbnQ6IElFdmVudCwgZXZlbnQ/OiBFdmVudCk6IHN0cmluZyB7XG5cdFx0Y29uc3QgdHlwZSA9IHRoaXMuZmluZFR5cGUoYWN0aXZlRXZlbnQsIGV2ZW50KTtcblx0XHRpZiAoIXR5cGUpIHtcblx0XHRcdHJldHVybiBhY3RpdmVFdmVudC5uYW1lO1xuXHRcdH1cblxuXHRcdHJldHVybiBgJHthY3RpdmVFdmVudC5uYW1lfS0ke3R5cGV9YDtcblx0fVxuXG5cdHByaXZhdGUgcGFja0V2ZW50KHR5cGU6IHN0cmluZywgYWN0aXZlRXZlbnQ6IElFdmVudCk6IElFdmVudFBheWxvYWQge1xuXHRcdHJldHVybiB7XG5cdFx0XHRcImRhdGFcIjoge1xuXHRcdFx0XHQuLi50aGlzLmJyb3dzZXJJbmZvLFxuXHRcdFx0XHR0eXBlLFxuXHRcdFx0fSxcblx0XHRcdFwic291cmNlXCI6IHRoaXMuc291cmNlLFxuXHRcdFx0XCJ0aW1lc3RhbXBcIjogTWF0aC5mbG9vcihEYXRlLm5vdygpIC8gMTAwMCksXG5cdFx0XHRcImF0c19oZWFkZXJcIjogdGhpcy50b2tlbixcblx0XHRcdFwiZXZlbnRcIjogYWN0aXZlRXZlbnQubmFtZS50b0xvd2VyQ2FzZSgpLFxuXHRcdFx0XCJzZ19ldmVudF9pZFwiOiBjcmVhdGVVVUlEKCksXG5cdFx0XHRcInNnX21lc3NhZ2VfaWRcIjogdGhpcy5jYW1wYWlnbkluZm8uYXRzX2luc3RhbmNlX2lkLFxuXHRcdH07XG5cdH1cblxuXHRwcml2YXRlIGhhbmRsZShhY3RpdmVFdmVudDogSUV2ZW50LCBldmVudD86IEV2ZW50LCBzaG91bGRWYWxpZGF0ZSA9IHRydWUpOiB2b2lkIHtcblx0XHR0aGlzLmV4ZWN1dGVFdmVudChhY3RpdmVFdmVudCwgZXZlbnQsIHNob3VsZFZhbGlkYXRlKVxuXHRcdFx0LmNhdGNoKGUgPT4gdGhpcy5sb2dnZXIuZXJyb3IoZSkpO1x0XHRcdFxuXHR9XG5cblx0cHJpdmF0ZSBjaGVja0V2ZW50KGFjdGl2ZUV2ZW50OiBJRXZlbnQsIHNob3VsZFZhbGlkYXRlID0gdHJ1ZSk6IHZvaWQge1xuXHRcdGlmICghIGFjdGl2ZUV2ZW50LnZhbGlkYXRlKGV2ZW50KSAmJiBzaG91bGRWYWxpZGF0ZSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBFdmVudCBAJHthY3RpdmVFdmVudC50cmlnZ2VyfSAoJHthY3RpdmVFdmVudC5uYW1lfSkgbm90IHZhbGlkLi4uYCk7XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBjaGVja011bHRpcGxlKGFjdGl2ZUV2ZW50OiBJRXZlbnQsIGV2ZW50PzogRXZlbnQpOiB2b2lkIHtcblx0XHRpZiAoIWFjdGl2ZUV2ZW50LmFsbG93TXVsdGlwbGUpIHtcblx0XHRcdGNvbnN0IG5hbWUgPSB0aGlzLmZpbmROYW1lKGFjdGl2ZUV2ZW50LCBldmVudCk7XG5cdFx0XHRpZiAodGhpcy5kaXNhYmxlZEV2ZW50cy5pbmNsdWRlcyhuYW1lKSkge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFByZXZlbnRpbmcgZHVwbGljYXRlIGV2ZW50IEAke2FjdGl2ZUV2ZW50LnRyaWdnZXJ9ICgke25hbWV9KS5gKTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5kaXNhYmxlZEV2ZW50cy5wdXNoKG5hbWUpO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgZXhlY3V0ZUV2ZW50KGFjdGl2ZUV2ZW50OiBJRXZlbnQsIGV2ZW50PzogRXZlbnQsIHNob3VsZFZhbGlkYXRlID0gdHJ1ZSk6IFByb21pc2U8dm9pZD4ge1xuXHRcdHRoaXMubG9nZ2VyLmluZm8oYEV2ZW50IEAke2FjdGl2ZUV2ZW50LnRyaWdnZXJ9ICgke2FjdGl2ZUV2ZW50Lm5hbWV9KSB0cmlnZ2VyZWQuLi5gKTtcblxuXHRcdHRyeSB7XG5cdFx0XHR0aGlzLmNoZWNrRXZlbnQoYWN0aXZlRXZlbnQsIHNob3VsZFZhbGlkYXRlKTtcblx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHR0aGlzLmxvZ2dlci5lcnJvcihlKTtcblx0XHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiByZWplY3QoZSkpO1xuXHRcdH1cblxuXHRcdGlmIChldmVudCAmJiBhY3RpdmVFdmVudC5pc0Jsb2NraW5nKSB7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHRldmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHR9XG5cblx0XHR0cnkge1xuXHRcdFx0dGhpcy5jaGVja011bHRpcGxlKGFjdGl2ZUV2ZW50LCBldmVudCk7XG5cdFx0fSBjYXRjaChlKSB7XG5cdFx0XHR0aGlzLmxvZ2dlci5lcnJvcihlKTtcblx0XHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiByZWplY3QoZSkpO1xuXHRcdH1cblxuXHRcdGNvbnN0IHR5cGUgPSB0aGlzLmZpbmRUeXBlKGFjdGl2ZUV2ZW50LCBldmVudCk7XG5cdFx0Y29uc3QgcGF5bG9hZCA9IHRoaXMucGFja0V2ZW50KHR5cGUsIGFjdGl2ZUV2ZW50KTtcblx0XHRcblx0XHRyZXR1cm4gdGhpcy5yZW1vdGUucG9zdChwYXlsb2FkKVxuXHRcdFx0LnRoZW4ocmVzdWx0ID0+IHRoaXMubG9nZ2VyLmluZm8ocmVzdWx0KSlcblx0XHRcdC5maW5hbGx5KCgpID0+IHtcblx0XHRcdFx0aWYgKGFjdGl2ZUV2ZW50LnJlZGlyZWN0T25GaW5pc2ggJiYgdGhpcy5zaG91bGRSZWRpcmVjdCkge1xuXHRcdFx0XHRcdHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gYCR7dGhpcy5yZWRpcmVjdFVybH0ke3dpbmRvdy5sb2NhdGlvbi5zZWFyY2h9YDtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XHRcdFxuXG5cdH1cbn0iLCJpbXBvcnQgSUV2ZW50UGF5bG9hZCBmcm9tIFwiLi9pbnRlZmFjZXMvSUV2ZW50UGF5bG9hZFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZW1vdGUge1xuXHRwcml2YXRlIGFwaV9rZXk6IHN0cmluZztcblx0cHJpdmF0ZSB1cmw6IHN0cmluZztcblx0cHJpdmF0ZSBkZWJ1ZzogYm9vbGVhbjtcblxuXHRjb25zdHJ1Y3RvcihhcGlfa2V5OiBzdHJpbmcsIHVybDogc3RyaW5nLCBkZWJ1ZzogYm9vbGVhbikge1xuXHRcdHRoaXMuYXBpX2tleSA9IGFwaV9rZXk7XG5cdFx0dGhpcy51cmwgPSB1cmw7XG5cdFx0dGhpcy5kZWJ1ZyA9IGRlYnVnO1xuXHR9XG5cblx0cHVibGljIHBvc3QoZGF0YTogSUV2ZW50UGF5bG9hZCk6IFByb21pc2U8b2JqZWN0PiB7XG5cdFx0aWYgKHRoaXMuZGVidWcpIHtcblx0XHRcdGNvbnNvbGUubG9nKGBTZW5kaW5nIGV2ZW50IHRvICR7dGhpcy51cmx9IHdpdGggZGF0YTpgKTtcblx0XHRcdGNvbnNvbGUudGFibGUoZGF0YSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGZldGNoKHRoaXMudXJsLCB7XG5cdFx0XHRtZXRob2Q6IFwiUE9TVFwiLFxuXHRcdFx0aGVhZGVyczoge1xuXHRcdFx0XHRcIkNvbnRlbnQtdHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcblx0XHRcdFx0XCJhcGkta2V5XCI6IHRoaXMuYXBpX2tleSxcblx0XHRcdH0sXG5cdFx0XHRrZWVwYWxpdmU6IHRydWUsXG5cdFx0XHRib2R5OiBKU09OLnN0cmluZ2lmeShkYXRhKSxcblx0XHR9KS50aGVuKHJlc3BvbnNlID0+IHtcblx0XHRcdGNvbnN0IGNvbnRlbnRUeXBlID0gcmVzcG9uc2UuaGVhZGVycy5nZXQoXCJjb250ZW50LXR5cGVcIik7XG5cdFx0XHRpZiAoY29udGVudFR5cGUgJiYgY29udGVudFR5cGUuaW5kZXhPZihcImFwcGxpY2F0aW9uL2pzb25cIikgIT09IC0xKSB7XG5cdFx0XHRcdHJldHVybiByZXNwb25zZS5qc29uKCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UudGV4dCgpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gY3JlYXRlVVVJRCgpIHtcblx0Ly8gaHR0cDovL3d3dy5pZXRmLm9yZy9yZmMvcmZjNDEyMi50eHRcblx0Y29uc3QgczogYW55W10gPSBbXTtcblx0Y29uc3QgaGV4RGlnaXRzID0gXCIwMTIzNDU2Nzg5YWJjZGVmXCI7XG5cdGZvciAobGV0IGkgPSAwOyBpIDwgMzY7IGkrKykge1xuXHRcdHNbaV0gPSBoZXhEaWdpdHMuc3Vic3RyKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDB4MTApLCAxKTtcblx0fVxuXHRzWzE0XSA9IFwiNFwiOyAgLy8gYml0cyAxMi0xNSBvZiB0aGUgdGltZV9oaV9hbmRfdmVyc2lvbiBmaWVsZCB0byAwMDEwXG5cdHNbMTldID0gaGV4RGlnaXRzLnN1YnN0cigoc1sxOV0gJiAweDMpIHwgMHg4LCAxKTsgIC8vIGJpdHMgNi03IG9mIHRoZSBjbG9ja19zZXFfaGlfYW5kX3Jlc2VydmVkIHRvIDAxXG5cdHNbOF0gPSBzWzEzXSA9IHNbMThdID0gc1syM10gPSBcIi1cIjtcblxuXHRyZXR1cm4gcy5qb2luKFwiXCIpO1xufVxuXG5jb25zdCBmaXJzdFRMRHMgPSBcImFjfGFkfGFlfGFmfGFnfGFpfGFsfGFtfGFufGFvfGFxfGFyfGFzfGF0fGF1fGF3fGF4fGF6fGJhfGJifGJlfGJmfGJnfGJofGJpfGJqfGJtfGJvfGJyfGJzfGJ0fGJ2fGJ3fGJ5fGJ6fGNhfGNjfGNkfGNmfGNnfGNofGNpfGNsfGNtfGNufGNvfGNyfGN1fGN2fGN3fGN4fGN6fGRlfGRqfGRrfGRtfGRvfGR6fGVjfGVlfGVnfGVzfGV0fGV1fGZpfGZtfGZvfGZyfGdhfGdifGdkfGdlfGdmfGdnfGdofGdpfGdsfGdtfGdufGdwfGdxfGdyfGdzfGd0fGd3fGd5fGhrfGhtfGhufGhyfGh0fGh1fGlkfGllfGlsfGltfGlufGlvfGlxfGlyfGlzfGl0fGplfGpvfGpwfGtnfGtpfGttfGtufGtwfGtyfGt5fGt6fGxhfGxifGxjfGxpfGxrfGxyfGxzfGx0fGx1fGx2fGx5fG1hfG1jfG1kfG1lfG1nfG1ofG1rfG1sfG1ufG1vfG1wfG1xfG1yfG1zfG10fG11fG12fG13fG14fG15fG5hfG5jfG5lfG5mfG5nfG5sfG5vfG5yfG51fG56fG9tfHBhfHBlfHBmfHBofHBrfHBsfHBtfHBufHByfHBzfHB0fHB3fHB5fHFhfHJlfHJvfHJzfHJ1fHJ3fHNhfHNifHNjfHNkfHNlfHNnfHNofHNpfHNqfHNrfHNsfHNtfHNufHNvfHNyfHN0fHN1fHN2fHN4fHN5fHN6fHRjfHRkfHRmfHRnfHRofHRqfHRrfHRsfHRtfHRufHRvfHRwfHRyfHR0fHR2fHR3fHR6fHVhfHVnfHVrfHVzfHV5fHV6fHZhfHZjfHZlfHZnfHZpfHZufHZ1fHdmfHdzfHl0XCIuc3BsaXQoXCJ8XCIpO1xuXG5jb25zdCBzZWNvbmRUTERzID0gXCJjb218ZWR1fGdvdnxuZXR8bWlsfG9yZ3xub218c2NofGNhYXxyZXN8b2ZmfGdvYnxpbnR8dHVyfGlwNnx1cml8dXJufGFzbnxhY3R8bnN3fHFsZHx0YXN8dmljfHByb3xiaXp8YWRtfGFkdnxhZ3J8YXJxfGFydHxhdG98YmlvfGJtZHxjaW18Y25nfGNudHxlY258ZWNvfGVtcHxlbmd8ZXNwfGV0Y3xldGl8ZmFyfGZuZHxmb3R8ZnN0fGcxMnxnZ2Z8aW1ifGluZHxpbmZ8am9yfGp1c3xsZWd8bGVsfG1hdHxtZWR8bXVzfG5vdHxudHJ8b2RvfHBwZ3xwc2N8cHNpfHFzbHxyZWN8c2xnfHNydnx0ZW98dG1wfHRyZHx2ZXR8emxnfHdlYnxsdGR8c2xkfHBvbHxmaW58azEyfGxpYnxwcml8YWlwfGZpZXxldW58c2NpfHByZHxjY2l8cHZ0fG1vZHxpZHZ8cmVsfHNleHxnZW58bmljfGFicnxiYXN8Y2FsfGNhbXxlbXJ8ZnZnfGxhenxsaWd8bG9tfG1hcnxtb2x8cG1ufHB1Z3xzYXJ8c2ljfHRhYXx0b3N8dW1ifHZhb3x2ZGF8dmVufG1pZXzljJfmtbfpgZN85ZKM5q2M5bGxfOelnuWliOW3nXzpub/lhZDls7Z8YXNzfHJlcHx0cmF8cGVyfG5nb3xzb2N8Z3JwfHBsY3xpdHN8YWlyfGFuZHxidXN8Y2FufGRkcnxqZmt8bWFkfG5yd3xueWN8c2tpfHNweXx0Y218dWxtfHVzYXx3YXJ8ZmhzfHZnc3xkZXB8ZWlkfGZldHxmbGF8ZmzDpXxnb2x8aG9mfGhvbHxzZWx8dmlrfGNyaXxpd2l8aW5nfGFib3xmYW18Z29rfGdvbnxnb3B8Z29zfGFpZHxhdG18Z3NtfHNvc3xlbGt8d2F3fGVzdHxhY2F8YmFyfGNwYXxqdXJ8bGF3fHNlY3xwbG98d3d3fGJpcnxjYmd8amFyfGtodnxtc2t8bm92fG5za3xwdHp8cm5kfHNwYnxzdHZ8dG9tfHRza3x1ZG18dnJufGNtd3xrbXN8bmt6fHNuenxwdWJ8Zmh2fHJlZHxlbnN8bmF0fHJuc3xybnV8YmJzfHRlbHxiZWx8a2VwfG5oc3xkbml8ZmVkfGlzYXxuc258Z3VifGUxMnx0ZWN80L7RgNCzfNC+0LHRgHzRg9C/0YB8YWx0fG5pc3xqcG58bWV4fGF0aHxpa2l8bmlkfGdkYXxpbmNcIi5zcGxpdChcInxcIik7XG5cbmNvbnN0IGtub3duU3ViZG9tYWlucyA9IFwid3d3fHN0dWRpb3xtYWlsfHJlbW90ZXxibG9nfHdlYm1haWx8c2VydmVyfG5zMXxuczJ8c210cHxzZWN1cmV8dnBufG18c2hvcHxmdHB8bWFpbDJ8dGVzdHxwb3J0YWx8bnN8d3cxfGhvc3R8c3VwcG9ydHxkZXZ8d2VifGJic3x3dzQyfHNxdWF0dGVyfG14fGVtYWlsfDF8bWFpbDF8Mnxmb3J1bXxvd2F8d3d3Mnxnd3xhZG1pbnxzdG9yZXxteDF8Y2RufGFwaXxleGNoYW5nZXxhcHB8Z292fDJ0dHl8dnBzfGdvdnl0eXxoZ2ZnZGZ8bmV3c3wxcmVyfGxramt1aVwiO1xuXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlU3ViZG9tYWluKHM6IHN0cmluZykge1xuXHRjb25zdCBrbm93blN1YmRvbWFpbnNSZWdFeHAgPSBuZXcgUmVnRXhwKGBeKCR7a25vd25TdWJkb21haW5zfSkuYCwgXCJpXCIpO1xuXHRzID0gcy5yZXBsYWNlKGtub3duU3ViZG9tYWluc1JlZ0V4cCwgXCJcIik7XG5cblx0Y29uc3QgcGFydHMgPSBzLnNwbGl0KFwiLlwiKTtcblxuXHR3aGlsZSAocGFydHMubGVuZ3RoID4gMykge1xuXHRcdHBhcnRzLnNoaWZ0KCk7XG5cdH1cblxuXHRpZiAocGFydHMubGVuZ3RoID09PSAzICYmICgocGFydHNbMV0ubGVuZ3RoID4gMiAmJiBwYXJ0c1syXS5sZW5ndGggPiAyKSB8fCAoc2Vjb25kVExEcy5pbmRleE9mKHBhcnRzWzFdKSA9PT0gLTEpICYmIGZpcnN0VExEcy5pbmRleE9mKHBhcnRzWzJdKSA9PT0gLTEpKSB7XG5cdFx0cGFydHMuc2hpZnQoKTtcblx0fVxuXG5cdHJldHVybiBwYXJ0cy5qb2luKFwiLlwiKTtcbn1cblxuY29uc3QgdGltZW91dHMgPSB7fTtcbmV4cG9ydCBmdW5jdGlvbiBkZWJvdW5jZTxBcmdzIGV4dGVuZHMgYW55W10+KGNhbGxiYWNrOiAoLi4uYXJnczogQXJncykgPT4gdm9pZCwgd2FpdDogbnVtYmVyLCAuLi5hcmdzOiBBcmdzKSA6IHZvaWQge1xuXHRjb25zdCBbLCBldmVudF0gPSBhcmdzO1xuXHRcblx0aWYgKCEgZXZlbnQudGFyZ2V0Lmhhc0F0dHJpYnV0ZShcImRhdGEtaWRcIikpIHtcblx0XHRldmVudC50YXJnZXQuc2V0QXR0cmlidXRlKFwiZGF0YS1pZFwiLCBjcmVhdGVVVUlEKCkpO1xuXHR9XG5cblx0Y29uc3QgaWQgPSBldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKFwiZGF0YS1pZFwiKTtcblxuXHRpZiAodGltZW91dHNbaWRdKSB7XG5cdFx0Y2xlYXJUaW1lb3V0KHRpbWVvdXRzW2lkXSk7XG5cdH1cblxuXHR0aW1lb3V0c1tpZF0gPSBzZXRUaW1lb3V0KGNhbGxiYWNrLCB3YWl0LCAuLi5hcmdzKTtcbn0iLCJpbnRlcmZhY2UgUGFyYW1ldGVyTWFwIHtcbiAgICBbczogc3RyaW5nXTogYW55XG59XG5leHBvcnQgY2xhc3MgVXJsUGFyc2VyIHtcblxuXHRwcml2YXRlIHBhcmFtZXRlcnM6IFBhcmFtZXRlck1hcDtcblx0cHVibGljIHJlYWRvbmx5IHByb3RvY29sOiBzdHJpbmc7XG5cdHB1YmxpYyByZWFkb25seSBob3N0OiBzdHJpbmc7XG5cdHB1YmxpYyByZWFkb25seSBob3N0bmFtZTogc3RyaW5nO1xuXHRwdWJsaWMgcmVhZG9ubHkgcG9ydDogc3RyaW5nO1xuXHRwdWJsaWMgcmVhZG9ubHkgcGF0aG5hbWU6IHN0cmluZztcblx0cHVibGljIHJlYWRvbmx5IGhhc2g6IHN0cmluZztcblx0cHVibGljIHJlYWRvbmx5IHNlYXJjaDogc3RyaW5nO1xuXG5cdGNvbnN0cnVjdG9yKHByaXZhdGUgdXJsOnN0cmluZykge1xuXHRcdGNvbnN0IHBhcnNlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xuXHRcdHBhcnNlci5ocmVmID0gdXJsO1xuXG5cdFx0dGhpcy5wcm90b2NvbCA9IHBhcnNlci5wcm90b2NvbDsgLy8gPT4gXCJodHRwOlwiXG5cdFx0dGhpcy5ob3N0ID0gcGFyc2VyLmhvc3Q7ICAgICAvLyA9PiBcImV4YW1wbGUuY29tOjMwMDBcIlxuXHRcdHRoaXMuaG9zdG5hbWUgPSBwYXJzZXIuaG9zdG5hbWU7IC8vID0+IFwiZXhhbXBsZS5jb21cIlxuXHRcdHRoaXMucG9ydCA9IHBhcnNlci5wb3J0OyAgICAgLy8gPT4gXCIzMDAwXCJcblx0XHR0aGlzLnBhdGhuYW1lID0gcGFyc2VyLnBhdGhuYW1lOyAvLyA9PiBcIi9wYXRobmFtZS9cIlxuXHRcdHRoaXMuaGFzaCA9IHBhcnNlci5oYXNoOyAgICAgLy8gPT4gXCIjaGFzaFwiXG5cdFx0dGhpcy5zZWFyY2ggPSBwYXJzZXIuc2VhcmNoLnN1YnN0cigxKTsgICAvLyA9PiBcIj9zZWFyY2g9dGVzdFwiXG5cblx0XHR0aGlzLnBhcnNlUGFyYW1ldGVycygpO1xuXHR9XG5cblx0cHJpdmF0ZSBwYXJzZVBhcmFtZXRlcnMoKSB7XG5cdFx0dGhpcy5wYXJhbWV0ZXJzID0ge307XG5cblx0XHRjb25zdCBwYXJhbXNHcm91cCA9IHRoaXMuc2VhcmNoLnNwbGl0KFwiJlwiKTtcblx0XHRmb3IoY29uc3QgcGFyYW0gb2YgcGFyYW1zR3JvdXApIHtcblx0XHRcdGNvbnN0IFtrZXksIHZhbHVlXSA9IHBhcmFtLnNwbGl0KFwiPVwiKTtcblx0XHRcdHRoaXMucGFyYW1ldGVyc1trZXldID0gdmFsdWU7XG5cdFx0fVxuXHR9XG5cblx0cHVibGljIGZpbmRQYXJhbShwYXJhbTogc3RyaW5nKSA6IGFueSB7XG5cdFx0cmV0dXJuIHRoaXMucGFyYW1ldGVyc1twYXJhbV0gfHwgbnVsbDtcblx0fVxuXG59IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgQVRTRXZlbnQge1xuXHRiYXNpY1ZhbGlkYXRpb24oZWxlbWVudDogSFRNTEVsZW1lbnQpIHtcblx0XHRpZiAoZWxlbWVudC5oYXNBdHRyaWJ1dGUoXCJkYXRhLWlnbm9yZVwiKSkge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0XHRpZiAoZWxlbWVudC5oYXNBdHRyaWJ1dGUoXCJAY2xpY2tcIikpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cbn0iLCJpbXBvcnQgSUV2ZW50IGZyb20gXCIuLi9pbnRlZmFjZXMvSUV2ZW50XCI7XG5pbXBvcnQgQVRTRXZlbnQgZnJvbSBcIi4vQVRTRXZlbnRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXR0YWNobWVudE9wZW4gZXh0ZW5kcyBBVFNFdmVudCBpbXBsZW1lbnRzIElFdmVudCB7XG5cdGdldCBzaG91bGREZWJvdW5jZSgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0Z2V0IHRyaWdnZXIoKTogbnVsbCB7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblx0Z2V0IHNvdXJjZSgpOiBudWxsIHtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXHRnZXQgbmFtZSgpOiBzdHJpbmcge1xuXHRcdHJldHVybiBcImF0dGFjaG1lbnRfb3BlbmVkXCI7XG5cdH1cblx0Z2V0IGhhc1R5cGVzKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRnZXQgcmVkaXJlY3RPbkZpbmlzaCgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0Z2V0IGlzQmxvY2tpbmcoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblx0Z2V0IGFsbG93TXVsdGlwbGUoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdHZhbGlkYXRlKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG59IiwiaW1wb3J0IElFdmVudCBmcm9tIFwiLi4vaW50ZWZhY2VzL0lFdmVudFwiO1xuaW1wb3J0IEFUU0V2ZW50IGZyb20gXCIuL0FUU0V2ZW50XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsaWNrIGV4dGVuZHMgQVRTRXZlbnQgaW1wbGVtZW50cyBJRXZlbnQge1xuXHRnZXQgc2hvdWxkRGVib3VuY2UoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCB0cmlnZ2VyKCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIFwiY2xpY2tcIjtcblx0fVxuXHRnZXQgc291cmNlKCk6IFdpbmRvdyB7XG5cdFx0cmV0dXJuIHdpbmRvdztcblx0fVxuXHRnZXQgbmFtZSgpOiBzdHJpbmcge1xuXHRcdHJldHVybiBcImJ1dHRvbl9jbGlja2VkXCI7XG5cdH1cblx0Z2V0IGhhc1R5cGVzKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdGdldCByZWRpcmVjdE9uRmluaXNoKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdGdldCBpc0Jsb2NraW5nKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRnZXQgYWxsb3dNdWx0aXBsZSgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7IFxuXHR9XG5cblx0dmFsaWRhdGUoZXZlbnQ6IEV2ZW50KTogYm9vbGVhbiB7XG5cdFx0aWYgKGV2ZW50Py50YXJnZXQgaW5zdGFuY2VvZiBIVE1MQW5jaG9yRWxlbWVudCkge1xuXHRcdFx0cmV0dXJuIHRoaXMudmFsaWRhdGVBbmNob3IoZXZlbnQudGFyZ2V0KTtcblx0XHR9XG5cdFx0XG5cblx0XHRpZiAoZXZlbnQ/LnRhcmdldCBpbnN0YW5jZW9mIEhUTUxCdXR0b25FbGVtZW50KSB7XG5cdFx0XHRyZXR1cm4gdGhpcy52YWxpZGF0ZUJ1dHRvbihldmVudC50YXJnZXQpO1xuXHRcdH1cblxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdHByaXZhdGUgdmFsaWRhdGVBbmNob3IoZWxlbWVudDogSFRNTEVsZW1lbnQpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdGhpcy5iYXNpY1ZhbGlkYXRpb24oZWxlbWVudCk7XG5cdH1cblxuXHRwcml2YXRlIHZhbGlkYXRlQnV0dG9uKGVsZW1lbnQ6IEhUTUxFbGVtZW50KTogYm9vbGVhbiB7XG5cdFx0aWYgKCF0aGlzLmJhc2ljVmFsaWRhdGlvbihlbGVtZW50KSB8fCAoZWxlbWVudC5oYXNBdHRyaWJ1dGUoXCJ0eXBlXCIpICYmIGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwidHlwZVwiKSA9PT0gXCJzdWJtaXRcIikpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdFx0XHRcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG59IiwiaW1wb3J0IElFdmVudCBmcm9tIFwiLi4vaW50ZWZhY2VzL0lFdmVudFwiO1xuaW1wb3J0IEFUU0V2ZW50IGZyb20gXCIuL0FUU0V2ZW50XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERvd25sb2FkIGV4dGVuZHMgQVRTRXZlbnQgaW1wbGVtZW50cyBJRXZlbnQge1xuXHRnZXQgc2hvdWxkRGVib3VuY2UoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCB0cmlnZ2VyKCk6IG51bGwge1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cdGdldCBzb3VyY2UoKTogbnVsbCB7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblx0Z2V0IG5hbWUoKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gXCJkb3dubG9hZF9maWxlX2V2ZW50XCI7XG5cdH1cblx0Z2V0IGhhc1R5cGVzKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRnZXQgcmVkaXJlY3RPbkZpbmlzaCgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXHRnZXQgaXNCbG9ja2luZygpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXHRnZXQgYWxsb3dNdWx0aXBsZSgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0dmFsaWRhdGUoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxufSIsImltcG9ydCBJRXZlbnQgZnJvbSBcIi4uL2ludGVmYWNlcy9JRXZlbnRcIjtcbmltcG9ydCBBVFNFdmVudCBmcm9tIFwiLi9BVFNFdmVudFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFeHRlbnNpb24gZXh0ZW5kcyBBVFNFdmVudCBpbXBsZW1lbnRzIElFdmVudCB7XG5cdGdldCBzaG91bGREZWJvdW5jZSgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0Z2V0IHRyaWdnZXIoKTogbnVsbCB7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblx0Z2V0IHNvdXJjZSgpOiBudWxsIHtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXHRnZXQgbmFtZSgpOiBzdHJpbmcge1xuXHRcdHJldHVybiBcImV4dGVuc2lvbl9pbnN0YWxsZWRcIjtcblx0fVxuXHRnZXQgaGFzVHlwZXMoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCByZWRpcmVjdE9uRmluaXNoKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdGdldCBpc0Jsb2NraW5nKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdGdldCBhbGxvd011bHRpcGxlKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHR2YWxpZGF0ZSgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG59IiwiaW1wb3J0IElFdmVudCBmcm9tIFwiLi4vaW50ZWZhY2VzL0lFdmVudFwiO1xuaW1wb3J0IEFUU0V2ZW50IGZyb20gXCIuL0FUU0V2ZW50XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZpbGVEb3dubG9hZCBleHRlbmRzIEFUU0V2ZW50IGltcGxlbWVudHMgSUV2ZW50IHtcblx0Z2V0IHNob3VsZERlYm91bmNlKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRnZXQgdHJpZ2dlcigpOiBudWxsIHtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXHRnZXQgc291cmNlKCk6IG51bGwge1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cdGdldCBuYW1lKCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIFwiZmlsZV9kb3dubG9hZFwiO1xuXHR9XG5cdGdldCBoYXNUeXBlcygpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXHRnZXQgcmVkaXJlY3RPbkZpbmlzaCgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0Z2V0IGlzQmxvY2tpbmcoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XHRcblx0Z2V0IGFsbG93TXVsdGlwbGUoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0dmFsaWRhdGUoZXZlbnQ6IEV2ZW50KTogYm9vbGVhbiB7XG5cdFx0aWYgKGV2ZW50Py50YXJnZXQgaW5zdGFuY2VvZiBIVE1MQW5jaG9yRWxlbWVudCkge1xuXHRcdFx0cmV0dXJuIHRoaXMudmFsaWRhdGVBbmNob3IoZXZlbnQudGFyZ2V0KTtcblx0XHR9XG5cdFx0XG5cblx0XHRpZiAoZXZlbnQ/LnRhcmdldCBpbnN0YW5jZW9mIEhUTUxCdXR0b25FbGVtZW50KSB7XG5cdFx0XHRyZXR1cm4gdGhpcy52YWxpZGF0ZUJ1dHRvbihldmVudC50YXJnZXQpO1xuXHRcdH1cblxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdHByaXZhdGUgdmFsaWRhdGVBbmNob3IoZWxlbWVudDogSFRNTEVsZW1lbnQpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdGhpcy5iYXNpY1ZhbGlkYXRpb24oZWxlbWVudCk7XG5cdH1cblxuXHRwcml2YXRlIHZhbGlkYXRlQnV0dG9uKGVsZW1lbnQ6IEhUTUxFbGVtZW50KTogYm9vbGVhbiB7XG5cdFx0aWYgKCF0aGlzLmJhc2ljVmFsaWRhdGlvbihlbGVtZW50KSB8fCAoZWxlbWVudC5oYXNBdHRyaWJ1dGUoXCJ0eXBlXCIpICYmIGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwidHlwZVwiKSA9PT0gXCJzdWJtaXRcIikpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdFx0XHRcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxufSAiLCJpbXBvcnQgSUV2ZW50IGZyb20gXCIuLi9pbnRlZmFjZXMvSUV2ZW50XCI7XG5pbXBvcnQgQVRTRXZlbnQgZnJvbSBcIi4vQVRTRXZlbnRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRmlsZU9wZW4gZXh0ZW5kcyBBVFNFdmVudCBpbXBsZW1lbnRzIElFdmVudCB7XG5cdGdldCBzaG91bGREZWJvdW5jZSgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0Z2V0IHRyaWdnZXIoKTogbnVsbCB7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblx0Z2V0IHNvdXJjZSgpOiBudWxsIHtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXHRnZXQgbmFtZSgpOiBzdHJpbmcge1xuXHRcdHJldHVybiBcImZpbGVfb3BlbmVkXCI7XG5cdH1cblx0Z2V0IGhhc1R5cGVzKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRnZXQgcmVkaXJlY3RPbkZpbmlzaCgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXHRnZXQgaXNCbG9ja2luZygpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXHRnZXQgYWxsb3dNdWx0aXBsZSgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0dmFsaWRhdGUoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxufSIsImltcG9ydCBJRXZlbnQgZnJvbSBcIi4uL2ludGVmYWNlcy9JRXZlbnRcIjtcbmltcG9ydCBBVFNFdmVudCBmcm9tIFwiLi9BVFNFdmVudFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbnB1dCBleHRlbmRzIEFUU0V2ZW50IGltcGxlbWVudHMgSUV2ZW50IHtcblx0Z2V0IHNob3VsZERlYm91bmNlKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdGdldCB0cmlnZ2VyKCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIFwiaW5wdXRcIjtcblx0fVxuXHRnZXQgc291cmNlKCk6IFdpbmRvdyB7XG5cdFx0cmV0dXJuIHdpbmRvdztcblx0fVxuXHRnZXQgbmFtZSgpOiBzdHJpbmcge1xuXHRcdHJldHVybiBcImlucHV0X2ZpbGxlZFwiO1xuXHR9XG5cdGdldCBoYXNUeXBlcygpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXHRnZXQgcmVkaXJlY3RPbkZpbmlzaCgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0Z2V0IGlzQmxvY2tpbmcoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XHRcblx0Z2V0IGFsbG93TXVsdGlwbGUoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHR2YWxpZGF0ZShldmVudDogRXZlbnQpOiBib29sZWFuIHtcblx0XHRpZiAoZXZlbnQudGFyZ2V0IGluc3RhbmNlb2YgSFRNTElucHV0RWxlbWVudCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuYmFzaWNWYWxpZGF0aW9uKGV2ZW50LnRhcmdldCkgJiYgISFldmVudC50YXJnZXQudmFsdWUudHJpbSgpO1xuXHRcdH1cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn0gIiwiaW1wb3J0IElFdmVudCBmcm9tIFwiLi4vaW50ZWZhY2VzL0lFdmVudFwiO1xuaW1wb3J0IEFUU0V2ZW50IGZyb20gXCIuL0FUU0V2ZW50XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1pY3JvcGhvbmUgZXh0ZW5kcyBBVFNFdmVudCBpbXBsZW1lbnRzIElFdmVudCB7XG5cdGdldCBzaG91bGREZWJvdW5jZSgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0Z2V0IHRyaWdnZXIoKTogbnVsbCB7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblx0Z2V0IHNvdXJjZSgpOiBudWxsIHtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXHRnZXQgbmFtZSgpOiBzdHJpbmcge1xuXHRcdHJldHVybiBcIm1pY19hY2NlcHRlZFwiO1xuXHR9XG5cdGdldCBoYXNUeXBlcygpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0Z2V0IHJlZGlyZWN0T25GaW5pc2goKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblx0Z2V0IGlzQmxvY2tpbmcoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblx0Z2V0IGFsbG93TXVsdGlwbGUoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdHZhbGlkYXRlKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cbn0iLCJpbXBvcnQgSUV2ZW50IGZyb20gXCIuLi9pbnRlZmFjZXMvSUV2ZW50XCI7XG5pbXBvcnQgQVRTRXZlbnQgZnJvbSBcIi4vQVRTRXZlbnRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTm90aWZpY2F0aW9uIGV4dGVuZHMgQVRTRXZlbnQgaW1wbGVtZW50cyBJRXZlbnQge1xuXHRnZXQgc2hvdWxkRGVib3VuY2UoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCB0cmlnZ2VyKCk6IG51bGwge1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cdGdldCBzb3VyY2UoKTogbnVsbCB7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblx0Z2V0IG5hbWUoKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gXCJub3RpZmljYXRpb25fYWNjZXB0ZWRcIjtcblx0fVxuXHRnZXQgaGFzVHlwZXMoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCByZWRpcmVjdE9uRmluaXNoKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdGdldCBpc0Jsb2NraW5nKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdGdldCBhbGxvd011bHRpcGxlKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHR2YWxpZGF0ZSgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG59IiwiaW1wb3J0IElFdmVudCBmcm9tIFwiLi4vaW50ZWZhY2VzL0lFdmVudFwiO1xuaW1wb3J0IEFUU0V2ZW50IGZyb20gXCIuL0FUU0V2ZW50XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhZ2VMb2FkZWQgZXh0ZW5kcyBBVFNFdmVudCBpbXBsZW1lbnRzIElFdmVudCB7XG5cdGdldCBzaG91bGREZWJvdW5jZSgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0Z2V0IHRyaWdnZXIoKTogbnVsbCB7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblx0Z2V0IHNvdXJjZSgpOiBEb2N1bWVudCB7XG5cdFx0cmV0dXJuIGRvY3VtZW50O1xuXHR9XG5cdGdldCBuYW1lKCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIFwicGFnZV9sZWZ0XCI7XG5cdH1cblx0Z2V0IGhhc1R5cGVzKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRnZXQgcmVkaXJlY3RPbkZpbmlzaCgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0Z2V0IGlzQmxvY2tpbmcoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCBhbGxvd011bHRpcGxlKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHR2YWxpZGF0ZSgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZG9jdW1lbnQudmlzaWJpbGl0eVN0YXRlID09PSBcImhpZGRlblwiO1xuXHR9XG59IiwiaW1wb3J0IElFdmVudCBmcm9tIFwiLi4vaW50ZWZhY2VzL0lFdmVudFwiO1xuaW1wb3J0IEFUU0V2ZW50IGZyb20gXCIuL0FUU0V2ZW50XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhZ2VMb2FkZWQgZXh0ZW5kcyBBVFNFdmVudCBpbXBsZW1lbnRzIElFdmVudCB7XG5cdGdldCBzaG91bGREZWJvdW5jZSgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0Z2V0IHRyaWdnZXIoKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gXCJsb2FkXCI7XG5cdH1cblx0Z2V0IHNvdXJjZSgpOiBXaW5kb3cge1xuXHRcdHJldHVybiB3aW5kb3c7XG5cdH1cblx0Z2V0IG5hbWUoKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gXCJwYWdlX2xvYWRlZFwiO1xuXHR9XG5cdGdldCBoYXNUeXBlcygpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0Z2V0IHJlZGlyZWN0T25GaW5pc2goKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCBpc0Jsb2NraW5nKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRnZXQgYWxsb3dNdWx0aXBsZSgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0dmFsaWRhdGUoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cbn0iLCJpbXBvcnQgSUV2ZW50IGZyb20gXCIuLi9pbnRlZmFjZXMvSUV2ZW50XCI7XG5pbXBvcnQgQVRTRXZlbnQgZnJvbSBcIi4vQVRTRXZlbnRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGFnZVJlYWQgZXh0ZW5kcyBBVFNFdmVudCBpbXBsZW1lbnRzIElFdmVudCB7XG5cdHByaXZhdGUgbWluU2Nyb2xsUGVyY2VudGFnZSA9IDcwO1xuXHRwcml2YXRlIG1pblN0YXlTZWNvbmRzID0gMioxMDAwO1xuXHRwcml2YXRlIGhhc1Njcm9sbGVkID0gZmFsc2U7XG5cdHByaXZhdGUgaGFzU3RheWVkID0gZmFsc2U7XG5cdHByaXZhdGUgY3VzdG9tRXZlbnQ6IEV2ZW50O1xuXHRwcml2YXRlIHRpbWVvdXQ6IGFueTtcblxuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpO1xuXHRcdHRoaXMuY3VzdG9tRXZlbnQgPSBuZXcgRXZlbnQodGhpcy50cmlnZ2VyKTtcblx0XHR0aGlzLmVuYWJsZSgpO1xuXHRcdGNvbnNvbGUubG9nKFwiUGFnZSByZWFkIGVuYWJsZWRcIik7XG5cdH1cblxuXHRnZXQgc2hvdWxkRGVib3VuY2UoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCB0cmlnZ2VyKCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIFwicGFnZV9yZWFkXCI7XG5cdH1cblx0Z2V0IHNvdXJjZSgpOiBXaW5kb3cge1xuXHRcdHJldHVybiB3aW5kb3c7XG5cdH1cblx0Z2V0IG5hbWUoKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gXCJwYWdlX3JlYWRcIjtcblx0fVxuXHRnZXQgaGFzVHlwZXMoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCByZWRpcmVjdE9uRmluaXNoKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRnZXQgaXNCbG9ja2luZygpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0Z2V0IGFsbG93TXVsdGlwbGUoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdHZhbGlkYXRlKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0cHJpdmF0ZSBlbmFibGUoKSB7XG5cdFx0d2luZG93Lm9uc2Nyb2xsID0gKCkgPT4gdGhpcy5zY3JvbGxlZCgpO1xuXHRcdHRoaXMuZGV0ZWN0Rm9jdXMoKTtcblx0XHR0aGlzLmRldGVjdFZpc2liaWxpdHkoKTtcblx0XHR0aGlzLnNjcm9sbGVkKCk7XG5cdFx0dGhpcy50aW1lb3V0ID0gc2V0VGltZW91dCAoKCkgPT4gdGhpcy5zdGF5ZWQoKSwgdGhpcy5taW5TdGF5U2Vjb25kcyk7XG5cdH1cblxuXHRwcml2YXRlIGdldCB2aXNpYmlsaXR5UHJvcHMoKSA6IFtzdHJpbmcsIHN0cmluZ10ge1xuXHRcdGlmICh0eXBlb2YgZG9jdW1lbnQuaGlkZGVuICE9PSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRyZXR1cm4gW1widmlzaWJpbGl0eWNoYW5nZVwiLCBcInZpc2liaWxpdHlTdGF0ZVwiXTtcblx0XHR9XG5cdFx0ZWxzZSBpZiAodHlwZW9mIChkb2N1bWVudCBhcyBhbnkpLm1vekhpZGRlbiAhPT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0cmV0dXJuIFtcIm1venZpc2liaWxpdHljaGFuZ2VcIiwgXCJtb3pWaXNpYmlsaXR5U3RhdGVcIl07XG5cdFx0fVxuXHRcdGVsc2UgaWYgKHR5cGVvZiAoZG9jdW1lbnQgYXMgYW55KS5tc0hpZGRlbiAhPT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0cmV0dXJuIFtcIm1zdmlzaWJpbGl0eWNoYW5nZVwiLCBcIm1zVmlzaWJpbGl0eVN0YXRlXCJdO1xuXHRcdH1cblx0XHRlbHNlIGlmICh0eXBlb2YgKGRvY3VtZW50IGFzIGFueSkud2Via2l0SGlkZGVuICE9PSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRyZXR1cm4gW1wid2Via2l0dmlzaWJpbGl0eWNoYW5nZVwiLCBcIndlYmtpdFZpc2liaWxpdHlTdGF0ZVwiXTtcblx0XHR9XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiVmlzaWJpbGl0eSBub3Qgc3VwcG9ydGVkLlwiKTtcblx0fVxuXG5cdHByaXZhdGUgZGV0ZWN0Rm9jdXMoKSB7XG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJmb2N1c1wiLCB0aGlzLmZvY3VzR3JhbnRlZC5iaW5kKHRoaXMpKTtcblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImJsdXJcIiwgdGhpcy5mb2N1c0xvc3QuYmluZCh0aGlzKSk7XG5cdH1cblxuXHRwcml2YXRlIGRldGVjdFZpc2liaWxpdHkoKSB7XG5cdFx0Ly8gY2hlY2sgdGhlIHZpc2libGlsaXR5IG9mIHRoZSBwYWdlXG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IFt2aXNpYmlsaXR5Q2hhbmdlXSA9IHRoaXMudmlzaWJpbGl0eVByb3BzO1xuXHRcdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcih2aXNpYmlsaXR5Q2hhbmdlLCB0aGlzLnZpc2liaWxpdHlDaGFuZ2VkLmJpbmQodGhpcykpO1xuXHRcdH0gY2F0Y2goXykge1xuXHRcdFx0Ly9cblx0XHRcdHJldHVybjtcblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIHN0b3BEZXRlY3RpbmdWaXNpYmlsaXR5KCkge1xuXHRcdC8vIGNoZWNrIHRoZSB2aXNpYmxpbGl0eSBvZiB0aGUgcGFnZVxuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCBbdmlzaWJpbGl0eUNoYW5nZV0gPSB0aGlzLnZpc2liaWxpdHlQcm9wcztcblx0XHRcdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIodmlzaWJpbGl0eUNoYW5nZSwgdGhpcy52aXNpYmlsaXR5Q2hhbmdlZC5iaW5kKHRoaXMpKTtcblx0XHR9IGNhdGNoKF8pIHtcblx0XHRcdC8vXG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSB2aXNpYmlsaXR5Q2hhbmdlZCgpIHtcblx0XHRjb25zdCBbXywgdmlzaWJpbGl0eVN0YXRlXSA9IHRoaXMudmlzaWJpbGl0eVByb3BzO1xuXHRcdHRoaXMudG9nZ2xlVGltZXIoZG9jdW1lbnRbdmlzaWJpbGl0eVN0YXRlXSA9PT0gXCJ2aXNpYmxlXCIpO1xuXHR9XG5cblx0cHJpdmF0ZSBmb2N1c0dyYW50ZWQoKSB7XG5cdFx0dGhpcy50b2dnbGVUaW1lcih0cnVlKTtcblx0fVxuXG5cdHByaXZhdGUgZm9jdXNMb3N0KCkge1xuXHRcdHRoaXMudG9nZ2xlVGltZXIoZmFsc2UpO1xuXHR9XG5cblx0cHJpdmF0ZSB0b2dnbGVUaW1lcihzdGF0dXM6IGJvb2xlYW4pIHtcblx0XHRpZiAodGhpcy5oYXNTdGF5ZWQpIHsgcmV0dXJuOyB9XG5cblx0XHRpZihzdGF0dXMpIHtcblx0XHRcdHRoaXMudGltZW91dCA9IHNldFRpbWVvdXQgKCgpID0+IHRoaXMuc3RheWVkKCksIHRoaXMubWluU3RheVNlY29uZHMpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KTtcblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIGRpc2FibGUoKSB7XG5cdFx0d2luZG93Lm9uc2Nyb2xsID0gbnVsbDtcblx0XHR0aGlzLnN0b3BEZXRlY3RpbmdWaXNpYmlsaXR5KCk7XG5cdFx0d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJmb2N1c1wiLCB0aGlzLmZvY3VzR3JhbnRlZC5iaW5kKHRoaXMpKTtcblx0XHR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImJsdXJcIiwgdGhpcy5mb2N1c0xvc3QuYmluZCh0aGlzKSk7XG5cdH1cblxuXHRwcml2YXRlIGdldFNjcm9sbFBlcmNlbnQoKSB7XG5cdFx0cmV0dXJuICgoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcCArIGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wKSAvIChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsSGVpZ2h0IC0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodCkgKiAxMDApO1xuXHR9XG5cblx0cHJpdmF0ZSBzY3JvbGxlZCgpIHtcblx0XHRpZih0aGlzLmdldFNjcm9sbFBlcmNlbnQoKSA+IHRoaXMubWluU2Nyb2xsUGVyY2VudGFnZSkge1xuXHRcdFx0aWYodGhpcy5oYXNTdGF5ZWQpIHtcblx0XHRcdFx0dGhpcy5kaXNwYXRjaCgpO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5oYXNTY3JvbGxlZCA9IHRydWU7XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBzdGF5ZWQoKSB7XG5cdFx0aWYodGhpcy5oYXNTY3JvbGxlZCkge1xuXHRcdFx0dGhpcy5kaXNwYXRjaCgpO1xuXHRcdH1cblx0XHR0aGlzLmhhc1N0YXllZCA9IHRydWU7XG5cdH1cblxuXHRwcml2YXRlIGRpc3BhdGNoKCkge1xuXHRcdHdpbmRvdy5kaXNwYXRjaEV2ZW50KHRoaXMuY3VzdG9tRXZlbnQpO1xuXHRcdHRoaXMuZGlzYWJsZSgpO1xuXHR9XG59IiwiaW1wb3J0IElFdmVudCBmcm9tIFwiLi4vaW50ZWZhY2VzL0lFdmVudFwiO1xuaW1wb3J0IEFUU0V2ZW50IGZyb20gXCIuL0FUU0V2ZW50XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN1Ym1pdCBleHRlbmRzIEFUU0V2ZW50IGltcGxlbWVudHMgSUV2ZW50IHtcblx0Z2V0IHNob3VsZERlYm91bmNlKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRnZXQgdHJpZ2dlcigpOiBzdHJpbmcge1xuXHRcdHJldHVybiBcInN1Ym1pdFwiO1xuXHR9XG5cdGdldCBzb3VyY2UoKTogV2luZG93IHtcblx0XHRyZXR1cm4gd2luZG93O1xuXHR9XG5cdGdldCBuYW1lKCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIFwiZm9ybV9zdWJtaXR0ZWRcIjtcblx0fVxuXHRnZXQgaGFzVHlwZXMoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblx0Z2V0IHJlZGlyZWN0T25GaW5pc2goKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblx0Z2V0IGlzQmxvY2tpbmcoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblx0Z2V0IGFsbG93TXVsdGlwbGUoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdHZhbGlkYXRlKGV2ZW50OiBFdmVudCk6IGJvb2xlYW4ge1xuXHRcdGlmIChldmVudC50YXJnZXQgaW5zdGFuY2VvZiBIVE1MRm9ybUVsZW1lbnQpIHtcblx0XHRcdHJldHVybiB0aGlzLmJhc2ljVmFsaWRhdGlvbihldmVudC50YXJnZXQpO1xuXHRcdH1cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbiAgICBcbn0iLCJpbXBvcnQgSUV2ZW50IGZyb20gXCIuLi9pbnRlZmFjZXMvSUV2ZW50XCI7XG5pbXBvcnQgQVRTRXZlbnQgZnJvbSBcIi4vQVRTRXZlbnRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2ViY2FtIGV4dGVuZHMgQVRTRXZlbnQgaW1wbGVtZW50cyBJRXZlbnQge1xuXHRnZXQgc2hvdWxkRGVib3VuY2UoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCB0cmlnZ2VyKCk6IG51bGwge1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cdGdldCBzb3VyY2UoKTogbnVsbCB7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblx0Z2V0IG5hbWUoKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gXCJ3ZWJjYW1fYWNjZXB0ZWRcIjtcblx0fVxuXHRnZXQgaGFzVHlwZXMoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCByZWRpcmVjdE9uRmluaXNoKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdGdldCBpc0Jsb2NraW5nKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdGdldCBhbGxvd011bHRpcGxlKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHR2YWxpZGF0ZSgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG59IiwiLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vKiBVQVBhcnNlci5qcyB2MS4wLjM1XG4gICBDb3B5cmlnaHQgwqkgMjAxMi0yMDIxIEZhaXNhbCBTYWxtYW4gPGZAZmFpc2FsbWFuLmNvbT5cbiAgIE1JVCBMaWNlbnNlICovLypcbiAgIERldGVjdCBCcm93c2VyLCBFbmdpbmUsIE9TLCBDUFUsIGFuZCBEZXZpY2UgdHlwZS9tb2RlbCBmcm9tIFVzZXItQWdlbnQgZGF0YS5cbiAgIFN1cHBvcnRzIGJyb3dzZXIgJiBub2RlLmpzIGVudmlyb25tZW50LiBcbiAgIERlbW8gICA6IGh0dHBzOi8vZmFpc2FsbWFuLmdpdGh1Yi5pby91YS1wYXJzZXItanNcbiAgIFNvdXJjZSA6IGh0dHBzOi8vZ2l0aHViLmNvbS9mYWlzYWxtYW4vdWEtcGFyc2VyLWpzICovXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuKGZ1bmN0aW9uICh3aW5kb3csIHVuZGVmaW5lZCkge1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgLy8vLy8vLy8vLy8vLy9cbiAgICAvLyBDb25zdGFudHNcbiAgICAvLy8vLy8vLy8vLy8vXG5cblxuICAgIHZhciBMSUJWRVJTSU9OICA9ICcxLjAuMzUnLFxuICAgICAgICBFTVBUWSAgICAgICA9ICcnLFxuICAgICAgICBVTktOT1dOICAgICA9ICc/JyxcbiAgICAgICAgRlVOQ19UWVBFICAgPSAnZnVuY3Rpb24nLFxuICAgICAgICBVTkRFRl9UWVBFICA9ICd1bmRlZmluZWQnLFxuICAgICAgICBPQkpfVFlQRSAgICA9ICdvYmplY3QnLFxuICAgICAgICBTVFJfVFlQRSAgICA9ICdzdHJpbmcnLFxuICAgICAgICBNQUpPUiAgICAgICA9ICdtYWpvcicsXG4gICAgICAgIE1PREVMICAgICAgID0gJ21vZGVsJyxcbiAgICAgICAgTkFNRSAgICAgICAgPSAnbmFtZScsXG4gICAgICAgIFRZUEUgICAgICAgID0gJ3R5cGUnLFxuICAgICAgICBWRU5ET1IgICAgICA9ICd2ZW5kb3InLFxuICAgICAgICBWRVJTSU9OICAgICA9ICd2ZXJzaW9uJyxcbiAgICAgICAgQVJDSElURUNUVVJFPSAnYXJjaGl0ZWN0dXJlJyxcbiAgICAgICAgQ09OU09MRSAgICAgPSAnY29uc29sZScsXG4gICAgICAgIE1PQklMRSAgICAgID0gJ21vYmlsZScsXG4gICAgICAgIFRBQkxFVCAgICAgID0gJ3RhYmxldCcsXG4gICAgICAgIFNNQVJUVFYgICAgID0gJ3NtYXJ0dHYnLFxuICAgICAgICBXRUFSQUJMRSAgICA9ICd3ZWFyYWJsZScsXG4gICAgICAgIEVNQkVEREVEICAgID0gJ2VtYmVkZGVkJyxcbiAgICAgICAgVUFfTUFYX0xFTkdUSCA9IDM1MDtcblxuICAgIHZhciBBTUFaT04gID0gJ0FtYXpvbicsXG4gICAgICAgIEFQUExFICAgPSAnQXBwbGUnLFxuICAgICAgICBBU1VTICAgID0gJ0FTVVMnLFxuICAgICAgICBCTEFDS0JFUlJZID0gJ0JsYWNrQmVycnknLFxuICAgICAgICBCUk9XU0VSID0gJ0Jyb3dzZXInLFxuICAgICAgICBDSFJPTUUgID0gJ0Nocm9tZScsXG4gICAgICAgIEVER0UgICAgPSAnRWRnZScsXG4gICAgICAgIEZJUkVGT1ggPSAnRmlyZWZveCcsXG4gICAgICAgIEdPT0dMRSAgPSAnR29vZ2xlJyxcbiAgICAgICAgSFVBV0VJICA9ICdIdWF3ZWknLFxuICAgICAgICBMRyAgICAgID0gJ0xHJyxcbiAgICAgICAgTUlDUk9TT0ZUID0gJ01pY3Jvc29mdCcsXG4gICAgICAgIE1PVE9ST0xBICA9ICdNb3Rvcm9sYScsXG4gICAgICAgIE9QRVJBICAgPSAnT3BlcmEnLFxuICAgICAgICBTQU1TVU5HID0gJ1NhbXN1bmcnLFxuICAgICAgICBTSEFSUCAgID0gJ1NoYXJwJyxcbiAgICAgICAgU09OWSAgICA9ICdTb255JyxcbiAgICAgICAgVklFUkEgICA9ICdWaWVyYScsXG4gICAgICAgIFhJQU9NSSAgPSAnWGlhb21pJyxcbiAgICAgICAgWkVCUkEgICA9ICdaZWJyYScsXG4gICAgICAgIEZBQ0VCT09LICAgID0gJ0ZhY2Vib29rJyxcbiAgICAgICAgQ0hST01JVU1fT1MgPSAnQ2hyb21pdW0gT1MnLFxuICAgICAgICBNQUNfT1MgID0gJ01hYyBPUyc7XG5cbiAgICAvLy8vLy8vLy8vL1xuICAgIC8vIEhlbHBlclxuICAgIC8vLy8vLy8vLy9cblxuICAgIHZhciBleHRlbmQgPSBmdW5jdGlvbiAocmVnZXhlcywgZXh0ZW5zaW9ucykge1xuICAgICAgICAgICAgdmFyIG1lcmdlZFJlZ2V4ZXMgPSB7fTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgaW4gcmVnZXhlcykge1xuICAgICAgICAgICAgICAgIGlmIChleHRlbnNpb25zW2ldICYmIGV4dGVuc2lvbnNbaV0ubGVuZ3RoICUgMiA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBtZXJnZWRSZWdleGVzW2ldID0gZXh0ZW5zaW9uc1tpXS5jb25jYXQocmVnZXhlc1tpXSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbWVyZ2VkUmVnZXhlc1tpXSA9IHJlZ2V4ZXNbaV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG1lcmdlZFJlZ2V4ZXM7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcml6ZSA9IGZ1bmN0aW9uIChhcnIpIHtcbiAgICAgICAgICAgIHZhciBlbnVtcyA9IHt9O1xuICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpPGFyci5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGVudW1zW2FycltpXS50b1VwcGVyQ2FzZSgpXSA9IGFycltpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBlbnVtcztcbiAgICAgICAgfSxcbiAgICAgICAgaGFzID0gZnVuY3Rpb24gKHN0cjEsIHN0cjIpIHtcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2Ygc3RyMSA9PT0gU1RSX1RZUEUgPyBsb3dlcml6ZShzdHIyKS5pbmRleE9mKGxvd2VyaXplKHN0cjEpKSAhPT0gLTEgOiBmYWxzZTtcbiAgICAgICAgfSxcbiAgICAgICAgbG93ZXJpemUgPSBmdW5jdGlvbiAoc3RyKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RyLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIH0sXG4gICAgICAgIG1ham9yaXplID0gZnVuY3Rpb24gKHZlcnNpb24pIHtcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2YodmVyc2lvbikgPT09IFNUUl9UWVBFID8gdmVyc2lvbi5yZXBsYWNlKC9bXlxcZFxcLl0vZywgRU1QVFkpLnNwbGl0KCcuJylbMF0gOiB1bmRlZmluZWQ7XG4gICAgICAgIH0sXG4gICAgICAgIHRyaW0gPSBmdW5jdGlvbiAoc3RyLCBsZW4pIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2Yoc3RyKSA9PT0gU1RSX1RZUEUpIHtcbiAgICAgICAgICAgICAgICBzdHIgPSBzdHIucmVwbGFjZSgvXlxcc1xccyovLCBFTVBUWSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHR5cGVvZihsZW4pID09PSBVTkRFRl9UWVBFID8gc3RyIDogc3RyLnN1YnN0cmluZygwLCBVQV9NQVhfTEVOR1RIKTtcbiAgICAgICAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8vLy8vLy8vLy8vLy8vXG4gICAgLy8gTWFwIGhlbHBlclxuICAgIC8vLy8vLy8vLy8vLy8vXG5cbiAgICB2YXIgcmd4TWFwcGVyID0gZnVuY3Rpb24gKHVhLCBhcnJheXMpIHtcblxuICAgICAgICAgICAgdmFyIGkgPSAwLCBqLCBrLCBwLCBxLCBtYXRjaGVzLCBtYXRjaDtcblxuICAgICAgICAgICAgLy8gbG9vcCB0aHJvdWdoIGFsbCByZWdleGVzIG1hcHNcbiAgICAgICAgICAgIHdoaWxlIChpIDwgYXJyYXlzLmxlbmd0aCAmJiAhbWF0Y2hlcykge1xuXG4gICAgICAgICAgICAgICAgdmFyIHJlZ2V4ID0gYXJyYXlzW2ldLCAgICAgICAvLyBldmVuIHNlcXVlbmNlICgwLDIsNCwuLilcbiAgICAgICAgICAgICAgICAgICAgcHJvcHMgPSBhcnJheXNbaSArIDFdOyAgIC8vIG9kZCBzZXF1ZW5jZSAoMSwzLDUsLi4pXG4gICAgICAgICAgICAgICAgaiA9IGsgPSAwO1xuXG4gICAgICAgICAgICAgICAgLy8gdHJ5IG1hdGNoaW5nIHVhc3RyaW5nIHdpdGggcmVnZXhlc1xuICAgICAgICAgICAgICAgIHdoaWxlIChqIDwgcmVnZXgubGVuZ3RoICYmICFtYXRjaGVzKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFyZWdleFtqXSkgeyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBtYXRjaGVzID0gcmVnZXhbaisrXS5leGVjKHVhKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoISFtYXRjaGVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHAgPSAwOyBwIDwgcHJvcHMubGVuZ3RoOyBwKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXRjaCA9IG1hdGNoZXNbKytrXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBxID0gcHJvcHNbcF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2hlY2sgaWYgZ2l2ZW4gcHJvcGVydHkgaXMgYWN0dWFsbHkgYXJyYXlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHEgPT09IE9CSl9UWVBFICYmIHEubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocS5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcVsxXSA9PSBGVU5DX1RZUEUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhc3NpZ24gbW9kaWZpZWQgbWF0Y2hcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzW3FbMF1dID0gcVsxXS5jYWxsKHRoaXMsIG1hdGNoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYXNzaWduIGdpdmVuIHZhbHVlLCBpZ25vcmUgcmVnZXggbWF0Y2hcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzW3FbMF1dID0gcVsxXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChxLmxlbmd0aCA9PT0gMykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2hlY2sgd2hldGhlciBmdW5jdGlvbiBvciByZWdleFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBxWzFdID09PSBGVU5DX1RZUEUgJiYgIShxWzFdLmV4ZWMgJiYgcVsxXS50ZXN0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNhbGwgZnVuY3Rpb24gKHVzdWFsbHkgc3RyaW5nIG1hcHBlcilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzW3FbMF1dID0gbWF0Y2ggPyBxWzFdLmNhbGwodGhpcywgbWF0Y2gsIHFbMl0pIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBzYW5pdGl6ZSBtYXRjaCB1c2luZyBnaXZlbiByZWdleFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNbcVswXV0gPSBtYXRjaCA/IG1hdGNoLnJlcGxhY2UocVsxXSwgcVsyXSkgOiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocS5sZW5ndGggPT09IDQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzW3FbMF1dID0gbWF0Y2ggPyBxWzNdLmNhbGwodGhpcywgbWF0Y2gucmVwbGFjZShxWzFdLCBxWzJdKSkgOiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzW3FdID0gbWF0Y2ggPyBtYXRjaCA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaSArPSAyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHN0ck1hcHBlciA9IGZ1bmN0aW9uIChzdHIsIG1hcCkge1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpIGluIG1hcCkge1xuICAgICAgICAgICAgICAgIC8vIGNoZWNrIGlmIGN1cnJlbnQgdmFsdWUgaXMgYXJyYXlcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG1hcFtpXSA9PT0gT0JKX1RZUEUgJiYgbWFwW2ldLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBtYXBbaV0ubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChoYXMobWFwW2ldW2pdLCBzdHIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChpID09PSBVTktOT1dOKSA/IHVuZGVmaW5lZCA6IGk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGhhcyhtYXBbaV0sIHN0cikpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChpID09PSBVTktOT1dOKSA/IHVuZGVmaW5lZCA6IGk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHN0cjtcbiAgICB9O1xuXG4gICAgLy8vLy8vLy8vLy8vLy8vXG4gICAgLy8gU3RyaW5nIG1hcFxuICAgIC8vLy8vLy8vLy8vLy8vXG5cbiAgICAvLyBTYWZhcmkgPCAzLjBcbiAgICB2YXIgb2xkU2FmYXJpTWFwID0ge1xuICAgICAgICAgICAgJzEuMCcgICA6ICcvOCcsXG4gICAgICAgICAgICAnMS4yJyAgIDogJy8xJyxcbiAgICAgICAgICAgICcxLjMnICAgOiAnLzMnLFxuICAgICAgICAgICAgJzIuMCcgICA6ICcvNDEyJyxcbiAgICAgICAgICAgICcyLjAuMicgOiAnLzQxNicsXG4gICAgICAgICAgICAnMi4wLjMnIDogJy80MTcnLFxuICAgICAgICAgICAgJzIuMC40JyA6ICcvNDE5JyxcbiAgICAgICAgICAgICc/JyAgICAgOiAnLydcbiAgICAgICAgfSxcbiAgICAgICAgd2luZG93c1ZlcnNpb25NYXAgPSB7XG4gICAgICAgICAgICAnTUUnICAgICAgICA6ICc0LjkwJyxcbiAgICAgICAgICAgICdOVCAzLjExJyAgIDogJ05UMy41MScsXG4gICAgICAgICAgICAnTlQgNC4wJyAgICA6ICdOVDQuMCcsXG4gICAgICAgICAgICAnMjAwMCcgICAgICA6ICdOVCA1LjAnLFxuICAgICAgICAgICAgJ1hQJyAgICAgICAgOiBbJ05UIDUuMScsICdOVCA1LjInXSxcbiAgICAgICAgICAgICdWaXN0YScgICAgIDogJ05UIDYuMCcsXG4gICAgICAgICAgICAnNycgICAgICAgICA6ICdOVCA2LjEnLFxuICAgICAgICAgICAgJzgnICAgICAgICAgOiAnTlQgNi4yJyxcbiAgICAgICAgICAgICc4LjEnICAgICAgIDogJ05UIDYuMycsXG4gICAgICAgICAgICAnMTAnICAgICAgICA6IFsnTlQgNi40JywgJ05UIDEwLjAnXSxcbiAgICAgICAgICAgICdSVCcgICAgICAgIDogJ0FSTSdcbiAgICB9O1xuXG4gICAgLy8vLy8vLy8vLy8vLy9cbiAgICAvLyBSZWdleCBtYXBcbiAgICAvLy8vLy8vLy8vLy8vXG5cbiAgICB2YXIgcmVnZXhlcyA9IHtcblxuICAgICAgICBicm93c2VyIDogW1tcblxuICAgICAgICAgICAgL1xcYig/OmNybW98Y3Jpb3MpXFwvKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ2hyb21lIGZvciBBbmRyb2lkL2lPU1xuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCAnQ2hyb21lJ11dLCBbXG4gICAgICAgICAgICAvZWRnKD86ZXxpb3N8YSk/XFwvKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1pY3Jvc29mdCBFZGdlXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsICdFZGdlJ11dLCBbXG5cbiAgICAgICAgICAgIC8vIFByZXN0byBiYXNlZFxuICAgICAgICAgICAgLyhvcGVyYSBtaW5pKVxcLyhbLVxcd1xcLl0rKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBPcGVyYSBNaW5pXG4gICAgICAgICAgICAvKG9wZXJhIFttb2JpbGV0YWJdezMsNn0pXFxiLit2ZXJzaW9uXFwvKFstXFx3XFwuXSspL2ksICAgICAgICAgICAgICAgICAvLyBPcGVyYSBNb2JpL1RhYmxldFxuICAgICAgICAgICAgLyhvcGVyYSkoPzouK3ZlcnNpb25cXC98W1xcLyBdKykoW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gT3BlcmFcbiAgICAgICAgICAgIF0sIFtOQU1FLCBWRVJTSU9OXSwgW1xuICAgICAgICAgICAgL29waW9zW1xcLyBdKyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBPcGVyYSBtaW5pIG9uIGlwaG9uZSA+PSA4LjBcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgT1BFUkErJyBNaW5pJ11dLCBbXG4gICAgICAgICAgICAvXFxib3ByXFwvKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBPcGVyYSBXZWJraXRcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgT1BFUkFdXSwgW1xuXG4gICAgICAgICAgICAvLyBNaXhlZFxuICAgICAgICAgICAgLyhraW5kbGUpXFwvKFtcXHdcXC5dKykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBLaW5kbGVcbiAgICAgICAgICAgIC8obHVuYXNjYXBlfG1heHRob258bmV0ZnJvbnR8amFzbWluZXxibGF6ZXIpW1xcLyBdPyhbXFx3XFwuXSopL2ksICAgICAgLy8gTHVuYXNjYXBlL01heHRob24vTmV0ZnJvbnQvSmFzbWluZS9CbGF6ZXJcbiAgICAgICAgICAgIC8vIFRyaWRlbnQgYmFzZWRcbiAgICAgICAgICAgIC8oYXZhbnQgfGllbW9iaWxlfHNsaW0pKD86YnJvd3Nlcik/W1xcLyBdPyhbXFx3XFwuXSopL2ksICAgICAgICAgICAgICAgLy8gQXZhbnQvSUVNb2JpbGUvU2xpbUJyb3dzZXJcbiAgICAgICAgICAgIC8oYmE/aWR1YnJvd3NlcilbXFwvIF0/KFtcXHdcXC5dKykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQmFpZHUgQnJvd3NlclxuICAgICAgICAgICAgLyg/Om1zfFxcKCkoaWUpIChbXFx3XFwuXSspL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBJbnRlcm5ldCBFeHBsb3JlclxuXG4gICAgICAgICAgICAvLyBXZWJraXQvS0hUTUwgYmFzZWQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZsb2NrL1JvY2tNZWx0L01pZG9yaS9FcGlwaGFueS9TaWxrL1NreWZpcmUvQm9sdC9Jcm9uL0lyaWRpdW0vUGhhbnRvbUpTL0Jvd3Nlci9RdXBaaWxsYS9GYWxrb25cbiAgICAgICAgICAgIC8oZmxvY2t8cm9ja21lbHR8bWlkb3JpfGVwaXBoYW55fHNpbGt8c2t5ZmlyZXxib2x0fGlyb258dml2YWxkaXxpcmlkaXVtfHBoYW50b21qc3xib3dzZXJ8cXVhcmt8cXVwemlsbGF8ZmFsa29ufHJla29ucXxwdWZmaW58YnJhdmV8d2hhbGUoPyEuK25hdmVyKXxxcWJyb3dzZXJsaXRlfHFxfGR1Y2tkdWNrZ28pXFwvKFstXFx3XFwuXSspL2ksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFJla29ucS9QdWZmaW4vQnJhdmUvV2hhbGUvUVFCcm93c2VyTGl0ZS9RUSwgYWthIFNob3VRXG4gICAgICAgICAgICAvKGhleXRhcHxvdmkpYnJvd3NlclxcLyhbXFxkXFwuXSspL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEhleXRhcC9PdmlcbiAgICAgICAgICAgIC8od2VpYm8pX18oW1xcZFxcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBXZWlib1xuICAgICAgICAgICAgXSwgW05BTUUsIFZFUlNJT05dLCBbXG4gICAgICAgICAgICAvKD86XFxidWM/ID9icm93c2VyfCg/Omp1Yy4rKXVjd2ViKVtcXC8gXT8oW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAvLyBVQ0Jyb3dzZXJcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgJ1VDJytCUk9XU0VSXV0sIFtcbiAgICAgICAgICAgIC9taWNyb20uK1xcYnFiY29yZVxcLyhbXFx3XFwuXSspL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdlQ2hhdCBEZXNrdG9wIGZvciBXaW5kb3dzIEJ1aWx0LWluIEJyb3dzZXJcbiAgICAgICAgICAgIC9cXGJxYmNvcmVcXC8oW1xcd1xcLl0rKS4rbWljcm9tL2lcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgJ1dlQ2hhdChXaW4pIERlc2t0b3AnXV0sIFtcbiAgICAgICAgICAgIC9taWNyb21lc3NlbmdlclxcLyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gV2VDaGF0XG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsICdXZUNoYXQnXV0sIFtcbiAgICAgICAgICAgIC9rb25xdWVyb3JcXC8oW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gS29ucXVlcm9yXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsICdLb25xdWVyb3InXV0sIFtcbiAgICAgICAgICAgIC90cmlkZW50Litydls6IF0oW1xcd1xcLl17MSw5fSlcXGIuK2xpa2UgZ2Vja28vaSAgICAgICAgICAgICAgICAgICAgICAgLy8gSUUxMVxuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCAnSUUnXV0sIFtcbiAgICAgICAgICAgIC95YSg/OnNlYXJjaCk/YnJvd3NlclxcLyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gWWFuZGV4XG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsICdZYW5kZXgnXV0sIFtcbiAgICAgICAgICAgIC8oYXZhc3R8YXZnKVxcLyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQXZhc3QvQVZHIFNlY3VyZSBCcm93c2VyXG4gICAgICAgICAgICBdLCBbW05BTUUsIC8oLispLywgJyQxIFNlY3VyZSAnK0JST1dTRVJdLCBWRVJTSU9OXSwgW1xuICAgICAgICAgICAgL1xcYmZvY3VzXFwvKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRmlyZWZveCBGb2N1c1xuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCBGSVJFRk9YKycgRm9jdXMnXV0sIFtcbiAgICAgICAgICAgIC9cXGJvcHRcXC8oW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE9wZXJhIFRvdWNoXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsIE9QRVJBKycgVG91Y2gnXV0sIFtcbiAgICAgICAgICAgIC9jb2NfY29jXFx3K1xcLyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIENvYyBDb2MgQnJvd3NlclxuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCAnQ29jIENvYyddXSwgW1xuICAgICAgICAgICAgL2RvbGZpblxcLyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBEb2xwaGluXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsICdEb2xwaGluJ11dLCBbXG4gICAgICAgICAgICAvY29hc3RcXC8oW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE9wZXJhIENvYXN0XG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsIE9QRVJBKycgQ29hc3QnXV0sIFtcbiAgICAgICAgICAgIC9taXVpYnJvd3NlclxcLyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTUlVSSBCcm93c2VyXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsICdNSVVJICcrQlJPV1NFUl1dLCBbXG4gICAgICAgICAgICAvZnhpb3NcXC8oWy1cXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZpcmVmb3ggZm9yIGlPU1xuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCBGSVJFRk9YXV0sIFtcbiAgICAgICAgICAgIC9cXGJxaWh1fChxaT9obz9vP3wzNjApYnJvd3Nlci9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDM2MFxuICAgICAgICAgICAgXSwgW1tOQU1FLCAnMzYwICcrQlJPV1NFUl1dLCBbXG4gICAgICAgICAgICAvKG9jdWx1c3xzYW1zdW5nfHNhaWxmaXNofGh1YXdlaSlicm93c2VyXFwvKFtcXHdcXC5dKykvaVxuICAgICAgICAgICAgXSwgW1tOQU1FLCAvKC4rKS8sICckMSAnK0JST1dTRVJdLCBWRVJTSU9OXSwgWyAgICAgICAgICAgICAgICAgICAgICAvLyBPY3VsdXMvU2Ftc3VuZy9TYWlsZmlzaC9IdWF3ZWkgQnJvd3NlclxuICAgICAgICAgICAgLyhjb21vZG9fZHJhZ29uKVxcLyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDb21vZG8gRHJhZ29uXG4gICAgICAgICAgICBdLCBbW05BTUUsIC9fL2csICcgJ10sIFZFUlNJT05dLCBbXG4gICAgICAgICAgICAvKGVsZWN0cm9uKVxcLyhbXFx3XFwuXSspIHNhZmFyaS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEVsZWN0cm9uLWJhc2VkIEFwcFxuICAgICAgICAgICAgLyh0ZXNsYSkoPzogcXRjYXJicm93c2VyfFxcLygyMFxcZFxcZFxcLlstXFx3XFwuXSspKS9pLCAgICAgICAgICAgICAgICAgICAvLyBUZXNsYVxuICAgICAgICAgICAgL20/KHFxYnJvd3NlcnxiYWlkdWJveGFwcHwyMzQ1RXhwbG9yZXIpW1xcLyBdPyhbXFx3XFwuXSspL2kgICAgICAgICAgICAvLyBRUUJyb3dzZXIvQmFpZHUgQXBwLzIzNDUgQnJvd3NlclxuICAgICAgICAgICAgXSwgW05BTUUsIFZFUlNJT05dLCBbXG4gICAgICAgICAgICAvKG1ldGFzcilbXFwvIF0/KFtcXHdcXC5dKykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNvdUdvdUJyb3dzZXJcbiAgICAgICAgICAgIC8obGJicm93c2VyKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTGllQmFvIEJyb3dzZXJcbiAgICAgICAgICAgIC9cXFsobGlua2VkaW4pYXBwXFxdL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBMaW5rZWRJbiBBcHAgZm9yIGlPUyAmIEFuZHJvaWRcbiAgICAgICAgICAgIF0sIFtOQU1FXSwgW1xuXG4gICAgICAgICAgICAvLyBXZWJWaWV3XG4gICAgICAgICAgICAvKCg/OmZiYW5cXC9mYmlvc3xmYl9pYWJcXC9mYjRhKSg/IS4rZmJhdil8O2ZiYXZcXC8oW1xcd1xcLl0rKTspL2kgICAgICAgLy8gRmFjZWJvb2sgQXBwIGZvciBpT1MgJiBBbmRyb2lkXG4gICAgICAgICAgICBdLCBbW05BTUUsIEZBQ0VCT09LXSwgVkVSU0lPTl0sIFtcbiAgICAgICAgICAgIC8oa2FrYW8oPzp0YWxrfHN0b3J5KSlbXFwvIF0oW1xcd1xcLl0rKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gS2FrYW8gQXBwXG4gICAgICAgICAgICAvKG5hdmVyKVxcKC4qPyhcXGQrXFwuW1xcd1xcLl0rKS4qXFwpL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE5hdmVyIEluQXBwXG4gICAgICAgICAgICAvc2FmYXJpIChsaW5lKVxcLyhbXFx3XFwuXSspL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIExpbmUgQXBwIGZvciBpT1NcbiAgICAgICAgICAgIC9cXGIobGluZSlcXC8oW1xcd1xcLl0rKVxcL2lhYi9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBMaW5lIEFwcCBmb3IgQW5kcm9pZFxuICAgICAgICAgICAgLyhjaHJvbWl1bXxpbnN0YWdyYW0pW1xcLyBdKFstXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDaHJvbWl1bS9JbnN0YWdyYW1cbiAgICAgICAgICAgIF0sIFtOQU1FLCBWRVJTSU9OXSwgW1xuICAgICAgICAgICAgL1xcYmdzYVxcLyhbXFx3XFwuXSspIC4qc2FmYXJpXFwvL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEdvb2dsZSBTZWFyY2ggQXBwbGlhbmNlIG9uIGlPU1xuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCAnR1NBJ11dLCBbXG4gICAgICAgICAgICAvbXVzaWNhbF9seSg/Oi4rYXBwXz92ZXJzaW9uXFwvfF8pKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRpa1Rva1xuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCAnVGlrVG9rJ11dLCBbXG5cbiAgICAgICAgICAgIC9oZWFkbGVzc2Nocm9tZSg/OlxcLyhbXFx3XFwuXSspfCApL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ2hyb21lIEhlYWRsZXNzXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsIENIUk9NRSsnIEhlYWRsZXNzJ11dLCBbXG5cbiAgICAgICAgICAgIC8gd3ZcXCkuKyhjaHJvbWUpXFwvKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIENocm9tZSBXZWJWaWV3XG4gICAgICAgICAgICBdLCBbW05BTUUsIENIUk9NRSsnIFdlYlZpZXcnXSwgVkVSU0lPTl0sIFtcblxuICAgICAgICAgICAgL2Ryb2lkLisgdmVyc2lvblxcLyhbXFx3XFwuXSspXFxiLisoPzptb2JpbGUgc2FmYXJpfHNhZmFyaSkvaSAgICAgICAgICAgLy8gQW5kcm9pZCBCcm93c2VyXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsICdBbmRyb2lkICcrQlJPV1NFUl1dLCBbXG5cbiAgICAgICAgICAgIC8oY2hyb21lfG9tbml3ZWJ8YXJvcmF8W3RpemVub2thXXs1fSA/YnJvd3NlcilcXC92PyhbXFx3XFwuXSspL2kgICAgICAgLy8gQ2hyb21lL09tbmlXZWIvQXJvcmEvVGl6ZW4vTm9raWFcbiAgICAgICAgICAgIF0sIFtOQU1FLCBWRVJTSU9OXSwgW1xuXG4gICAgICAgICAgICAvdmVyc2lvblxcLyhbXFx3XFwuXFwsXSspIC4qbW9iaWxlXFwvXFx3KyAoc2FmYXJpKS9pICAgICAgICAgICAgICAgICAgICAgIC8vIE1vYmlsZSBTYWZhcmlcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgJ01vYmlsZSBTYWZhcmknXV0sIFtcbiAgICAgICAgICAgIC92ZXJzaW9uXFwvKFtcXHcoXFwufFxcLCldKykgLioobW9iaWxlID9zYWZhcml8c2FmYXJpKS9pICAgICAgICAgICAgICAgIC8vIFNhZmFyaSAmIFNhZmFyaSBNb2JpbGVcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBOQU1FXSwgW1xuICAgICAgICAgICAgL3dlYmtpdC4rPyhtb2JpbGUgP3NhZmFyaXxzYWZhcmkpKFxcL1tcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAvLyBTYWZhcmkgPCAzLjBcbiAgICAgICAgICAgIF0sIFtOQU1FLCBbVkVSU0lPTiwgc3RyTWFwcGVyLCBvbGRTYWZhcmlNYXBdXSwgW1xuXG4gICAgICAgICAgICAvKHdlYmtpdHxraHRtbClcXC8oW1xcd1xcLl0rKS9pXG4gICAgICAgICAgICBdLCBbTkFNRSwgVkVSU0lPTl0sIFtcblxuICAgICAgICAgICAgLy8gR2Vja28gYmFzZWRcbiAgICAgICAgICAgIC8obmF2aWdhdG9yfG5ldHNjYXBlXFxkPylcXC8oWy1cXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE5ldHNjYXBlXG4gICAgICAgICAgICBdLCBbW05BTUUsICdOZXRzY2FwZSddLCBWRVJTSU9OXSwgW1xuICAgICAgICAgICAgL21vYmlsZSB2cjsgcnY6KFtcXHdcXC5dKylcXCkuK2ZpcmVmb3gvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBGaXJlZm94IFJlYWxpdHlcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgRklSRUZPWCsnIFJlYWxpdHknXV0sIFtcbiAgICAgICAgICAgIC9la2lvaGYuKyhmbG93KVxcLyhbXFx3XFwuXSspL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRmxvd1xuICAgICAgICAgICAgLyhzd2lmdGZveCkvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTd2lmdGZveFxuICAgICAgICAgICAgLyhpY2VkcmFnb258aWNld2Vhc2VsfGNhbWlub3xjaGltZXJhfGZlbm5lY3xtYWVtbyBicm93c2VyfG1pbmltb3xjb25rZXJvcnxrbGFyKVtcXC8gXT8oW1xcd1xcLlxcK10rKS9pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBJY2VEcmFnb24vSWNld2Vhc2VsL0NhbWluby9DaGltZXJhL0Zlbm5lYy9NYWVtby9NaW5pbW8vQ29ua2Vyb3IvS2xhclxuICAgICAgICAgICAgLyhzZWFtb25rZXl8ay1tZWxlb258aWNlY2F0fGljZWFwZXxmaXJlYmlyZHxwaG9lbml4fHBhbGVtb29ufGJhc2lsaXNrfHdhdGVyZm94KVxcLyhbLVxcd1xcLl0rKSQvaSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRmlyZWZveC9TZWFNb25rZXkvSy1NZWxlb24vSWNlQ2F0L0ljZUFwZS9GaXJlYmlyZC9QaG9lbml4XG4gICAgICAgICAgICAvKGZpcmVmb3gpXFwvKFtcXHdcXC5dKykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE90aGVyIEZpcmVmb3gtYmFzZWRcbiAgICAgICAgICAgIC8obW96aWxsYSlcXC8oW1xcd1xcLl0rKSAuK3J2XFw6LitnZWNrb1xcL1xcZCsvaSwgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTW96aWxsYVxuXG4gICAgICAgICAgICAvLyBPdGhlclxuICAgICAgICAgICAgLyhwb2xhcmlzfGx5bnh8ZGlsbG98aWNhYnxkb3Jpc3xhbWF5YXx3M218bmV0c3VyZnxzbGVpcG5pcnxvYmlnb3xtb3NhaWN8KD86Z298aWNlfHVwKVtcXC4gXT9icm93c2VyKVstXFwvIF0/dj8oW1xcd1xcLl0rKS9pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBQb2xhcmlzL0x5bngvRGlsbG8vaUNhYi9Eb3Jpcy9BbWF5YS93M20vTmV0U3VyZi9TbGVpcG5pci9PYmlnby9Nb3NhaWMvR28vSUNFL1VQLkJyb3dzZXJcbiAgICAgICAgICAgIC8obGlua3MpIFxcKChbXFx3XFwuXSspL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTGlua3NcbiAgICAgICAgICAgIC9wYW5hc29uaWM7KHZpZXJhKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUGFuYXNvbmljIFZpZXJhXG4gICAgICAgICAgICBdLCBbTkFNRSwgVkVSU0lPTl0sIFtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLyhjb2JhbHQpXFwvKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDb2JhbHRcbiAgICAgICAgICAgIF0sIFtOQU1FLCBbVkVSU0lPTiwgL21hc3Rlci58bHRzLi8sIFwiXCJdXVxuICAgICAgICBdLFxuXG4gICAgICAgIGNwdSA6IFtbXG5cbiAgICAgICAgICAgIC8oPzooYW1kfHgoPzooPzo4Nnw2NClbLV9dKT98d293fHdpbik2NClbO1xcKV0vaSAgICAgICAgICAgICAgICAgICAgIC8vIEFNRDY0ICh4NjQpXG4gICAgICAgICAgICBdLCBbW0FSQ0hJVEVDVFVSRSwgJ2FtZDY0J11dLCBbXG5cbiAgICAgICAgICAgIC8oaWEzMig/PTspKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSUEzMiAocXVpY2t0aW1lKVxuICAgICAgICAgICAgXSwgW1tBUkNISVRFQ1RVUkUsIGxvd2VyaXplXV0sIFtcblxuICAgICAgICAgICAgLygoPzppWzM0Nl18eCk4NilbO1xcKV0vaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSUEzMiAoeDg2KVxuICAgICAgICAgICAgXSwgW1tBUkNISVRFQ1RVUkUsICdpYTMyJ11dLCBbXG5cbiAgICAgICAgICAgIC9cXGIoYWFyY2g2NHxhcm0odj84ZT9sP3xfPzY0KSlcXGIvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFSTTY0XG4gICAgICAgICAgICBdLCBbW0FSQ0hJVEVDVFVSRSwgJ2FybTY0J11dLCBbXG5cbiAgICAgICAgICAgIC9cXGIoYXJtKD86dls2N10pP2h0P24/W2ZsXXA/KVxcYi9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBUk1IRlxuICAgICAgICAgICAgXSwgW1tBUkNISVRFQ1RVUkUsICdhcm1oZiddXSwgW1xuXG4gICAgICAgICAgICAvLyBQb2NrZXRQQyBtaXN0YWtlbmx5IGlkZW50aWZpZWQgYXMgUG93ZXJQQ1xuICAgICAgICAgICAgL3dpbmRvd3MgKGNlfG1vYmlsZSk7IHBwYzsvaVxuICAgICAgICAgICAgXSwgW1tBUkNISVRFQ1RVUkUsICdhcm0nXV0sIFtcblxuICAgICAgICAgICAgLygoPzpwcGN8cG93ZXJwYykoPzo2NCk/KSg/OiBtYWN8O3xcXCkpL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUG93ZXJQQ1xuICAgICAgICAgICAgXSwgW1tBUkNISVRFQ1RVUkUsIC9vd2VyLywgRU1QVFksIGxvd2VyaXplXV0sIFtcblxuICAgICAgICAgICAgLyhzdW40XFx3KVs7XFwpXS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNQQVJDXG4gICAgICAgICAgICBdLCBbW0FSQ0hJVEVDVFVSRSwgJ3NwYXJjJ11dLCBbXG5cbiAgICAgICAgICAgIC8oKD86YXZyMzJ8aWE2NCg/PTspKXw2OGsoPz1cXCkpfFxcYmFybSg/PXYoPzpbMS03XXxbNS03XTEpbD98O3xlYWJpKXwoPz1hdG1lbCApYXZyfCg/OmlyaXh8bWlwc3xzcGFyYykoPzo2NCk/XFxifHBhLXJpc2MpL2lcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSUE2NCwgNjhLLCBBUk0vNjQsIEFWUi8zMiwgSVJJWC82NCwgTUlQUy82NCwgU1BBUkMvNjQsIFBBLVJJU0NcbiAgICAgICAgICAgIF0sIFtbQVJDSElURUNUVVJFLCBsb3dlcml6ZV1dXG4gICAgICAgIF0sXG5cbiAgICAgICAgZGV2aWNlIDogW1tcblxuICAgICAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAgICAgICAgIC8vIE1PQklMRVMgJiBUQUJMRVRTXG4gICAgICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgICAgICAgIC8vIFNhbXN1bmdcbiAgICAgICAgICAgIC9cXGIoc2NoLWlbODldMFxcZHxzaHctbTM4MHN8c20tW3B0eF1cXHd7Miw0fXxndC1bcG5dXFxkezIsNH18c2doLXQ4WzU2XTl8bmV4dXMgMTApL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgU0FNU1VOR10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgL1xcYigoPzpzW2NncF1ofGd0fHNtKS1cXHcrfHNjW2ctXT9bXFxkXSthP3xnYWxheHkgbmV4dXMpL2ksXG4gICAgICAgICAgICAvc2Ftc3VuZ1stIF0oWy1cXHddKykvaSxcbiAgICAgICAgICAgIC9zZWMtKHNnaFxcdyspL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgU0FNU1VOR10sIFtUWVBFLCBNT0JJTEVdXSwgW1xuXG4gICAgICAgICAgICAvLyBBcHBsZVxuICAgICAgICAgICAgLyg/OlxcL3xcXCgpKGlwKD86aG9uZXxvZClbXFx3LCBdKikoPzpcXC98OykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaVBvZC9pUGhvbmVcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgQVBQTEVdLCBbVFlQRSwgTU9CSUxFXV0sIFtcbiAgICAgICAgICAgIC9cXCgoaXBhZCk7Wy1cXHdcXCksOyBdK2FwcGxlL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaVBhZFxuICAgICAgICAgICAgL2FwcGxlY29yZW1lZGlhXFwvW1xcd1xcLl0rIFxcKChpcGFkKS9pLFxuICAgICAgICAgICAgL1xcYihpcGFkKVxcZFxcZD8sXFxkXFxkP1s7XFxdXS4raW9zL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgQVBQTEVdLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC8obWFjaW50b3NoKTsvaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBBUFBMRV1dLCBbXG5cbiAgICAgICAgICAgIC8vIFNoYXJwXG4gICAgICAgICAgICAvXFxiKHNoLT9bYWx0dnpdP1xcZFxcZFthLWVrbV0/KS9pXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIFNIQVJQXSwgW1RZUEUsIE1PQklMRV1dLCBbXG5cbiAgICAgICAgICAgIC8vIEh1YXdlaVxuICAgICAgICAgICAgL1xcYigoPzphZ1tyc11bMjNdP3xiYWgyP3xzaHQ/fGJ0diktYT9bbHddXFxkezJ9KVxcYig/IS4rZFxcL3MpL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgSFVBV0VJXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvKD86aHVhd2VpfGhvbm9yKShbLVxcdyBdKylbO1xcKV0vaSxcbiAgICAgICAgICAgIC9cXGIobmV4dXMgNnB8XFx3ezIsNH1lPy1bYXR1XT9bbG5dW1xcZHhdWzAxMjM1OWNdW2Fkbl0/KVxcYig/IS4rZFxcL3MpL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgSFVBV0VJXSwgW1RZUEUsIE1PQklMRV1dLCBbXG5cbiAgICAgICAgICAgIC8vIFhpYW9taVxuICAgICAgICAgICAgL1xcYihwb2NvW1xcdyBdKykoPzogYnVpfFxcKSkvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBYaWFvbWkgUE9DT1xuICAgICAgICAgICAgL1xcYjsgKFxcdyspIGJ1aWxkXFwvaG1cXDEvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gWGlhb21pIEhvbmdtaSAnbnVtZXJpYycgbW9kZWxzXG4gICAgICAgICAgICAvXFxiKGhtWy1fIF0/bm90ZT9bXyBdPyg/OlxcZFxcdyk/KSBidWkvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFhpYW9taSBIb25nbWlcbiAgICAgICAgICAgIC9cXGIocmVkbWlbXFwtXyBdPyg/Om5vdGV8ayk/W1xcd18gXSspKD86IGJ1aXxcXCkpL2ksICAgICAgICAgICAgICAgICAgIC8vIFhpYW9taSBSZWRtaVxuICAgICAgICAgICAgL1xcYihtaVstXyBdPyg/OmFcXGR8b25lfG9uZVtfIF1wbHVzfG5vdGUgbHRlfG1heHxjYyk/W18gXT8oPzpcXGQ/XFx3PylbXyBdPyg/OnBsdXN8c2V8bGl0ZSk/KSg/OiBidWl8XFwpKS9pIC8vIFhpYW9taSBNaVxuICAgICAgICAgICAgXSwgW1tNT0RFTCwgL18vZywgJyAnXSwgW1ZFTkRPUiwgWElBT01JXSwgW1RZUEUsIE1PQklMRV1dLCBbXG4gICAgICAgICAgICAvXFxiKG1pWy1fIF0/KD86cGFkKSg/OltcXHdfIF0rKSkoPzogYnVpfFxcKSkvaSAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1pIFBhZCB0YWJsZXRzXG4gICAgICAgICAgICBdLFtbTU9ERUwsIC9fL2csICcgJ10sIFtWRU5ET1IsIFhJQU9NSV0sIFtUWVBFLCBUQUJMRVRdXSwgW1xuXG4gICAgICAgICAgICAvLyBPUFBPXG4gICAgICAgICAgICAvOyAoXFx3KykgYnVpLisgb3Bwby9pLFxuICAgICAgICAgICAgL1xcYihjcGhbMTJdXFxkezN9fHAoPzphZnxjW2FsXXxkXFx3fGVbYXJdKVttdF1cXGQwfHg5MDA3fGExMDFvcClcXGIvaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnT1BQTyddLCBbVFlQRSwgTU9CSUxFXV0sIFtcblxuICAgICAgICAgICAgLy8gVml2b1xuICAgICAgICAgICAgL3Zpdm8gKFxcdyspKD86IGJ1aXxcXCkpL2ksXG4gICAgICAgICAgICAvXFxiKHZbMTJdXFxkezN9XFx3P1thdF0pKD86IGJ1aXw7KS9pXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdWaXZvJ10sIFtUWVBFLCBNT0JJTEVdXSwgW1xuXG4gICAgICAgICAgICAvLyBSZWFsbWVcbiAgICAgICAgICAgIC9cXGIocm14WzEyXVxcZHszfSkoPzogYnVpfDt8XFwpKS9pXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdSZWFsbWUnXSwgW1RZUEUsIE1PQklMRV1dLCBbXG5cbiAgICAgICAgICAgIC8vIE1vdG9yb2xhXG4gICAgICAgICAgICAvXFxiKG1pbGVzdG9uZXxkcm9pZCg/OlsyLTR4XXwgKD86YmlvbmljfHgyfHByb3xyYXpyKSk/Oj8oIDRnKT8pXFxiW1xcdyBdK2J1aWxkXFwvL2ksXG4gICAgICAgICAgICAvXFxibW90KD86b3JvbGEpP1stIF0oXFx3KikvaSxcbiAgICAgICAgICAgIC8oKD86bW90b1tcXHdcXChcXCkgXSt8eHRcXGR7Myw0fXxuZXh1cyA2KSg/PSBidWl8XFwpKSkvaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBNT1RPUk9MQV0sIFtUWVBFLCBNT0JJTEVdXSwgW1xuICAgICAgICAgICAgL1xcYihtejYwXFxkfHhvb21bMiBdezAsMn0pIGJ1aWxkXFwvL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgTU9UT1JPTEFdLCBbVFlQRSwgVEFCTEVUXV0sIFtcblxuICAgICAgICAgICAgLy8gTEdcbiAgICAgICAgICAgIC8oKD89bGcpP1t2bF1rXFwtP1xcZHszfSkgYnVpfCAzXFwuWy1cXHc7IF17MTB9bGc/LShbMDZjdjldezMsNH0pL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgTEddLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC8obG0oPzotP2YxMDBbbnZdP3wtW1xcd1xcLl0rKSg/PSBidWl8XFwpKXxuZXh1cyBbNDVdKS9pLFxuICAgICAgICAgICAgL1xcYmxnWy1lO1xcLyBdKygoPyFicm93c2VyfG5ldGNhc3R8YW5kcm9pZCB0dilcXHcrKS9pLFxuICAgICAgICAgICAgL1xcYmxnLT8oW1xcZFxcd10rKSBidWkvaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBMR10sIFtUWVBFLCBNT0JJTEVdXSwgW1xuXG4gICAgICAgICAgICAvLyBMZW5vdm9cbiAgICAgICAgICAgIC8oaWRlYXRhYlstXFx3IF0rKS9pLFxuICAgICAgICAgICAgL2xlbm92byA/KHNbNTZdMDAwWy1cXHddK3x0YWIoPzpbXFx3IF0rKXx5dFstXFxkXFx3XXs2fXx0YlstXFxkXFx3XXs2fSkvaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnTGVub3ZvJ10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuXG4gICAgICAgICAgICAvLyBOb2tpYVxuICAgICAgICAgICAgLyg/Om1hZW1vfG5va2lhKS4qKG45MDB8bHVtaWEgXFxkKykvaSxcbiAgICAgICAgICAgIC9ub2tpYVstXyBdPyhbLVxcd1xcLl0qKS9pXG4gICAgICAgICAgICBdLCBbW01PREVMLCAvXy9nLCAnICddLCBbVkVORE9SLCAnTm9raWEnXSwgW1RZUEUsIE1PQklMRV1dLCBbXG5cbiAgICAgICAgICAgIC8vIEdvb2dsZVxuICAgICAgICAgICAgLyhwaXhlbCBjKVxcYi9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gR29vZ2xlIFBpeGVsIENcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgR09PR0xFXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvZHJvaWQuKzsgKHBpeGVsW1xcZGF4bCBdezAsNn0pKD86IGJ1aXxcXCkpL2kgICAgICAgICAgICAgICAgICAgICAgICAgLy8gR29vZ2xlIFBpeGVsXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIEdPT0dMRV0sIFtUWVBFLCBNT0JJTEVdXSwgW1xuXG4gICAgICAgICAgICAvLyBTb255XG4gICAgICAgICAgICAvZHJvaWQuKyAoYT9cXGRbMC0yXXsyfXNvfFtjLWddXFxkezR9fHNvWy1nbF1cXHcrfHhxLWFcXHdbNC03XVsxMl0pKD89IGJ1aXxcXCkuK2Nocm9tZVxcLyg/IVsxLTZdezAsMX1cXGRcXC4pKS9pXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIFNPTlldLCBbVFlQRSwgTU9CSUxFXV0sIFtcbiAgICAgICAgICAgIC9zb255IHRhYmxldCBbcHNdL2ksXG4gICAgICAgICAgICAvXFxiKD86c29ueSk/c2dwXFx3Kyg/OiBidWl8XFwpKS9pXG4gICAgICAgICAgICBdLCBbW01PREVMLCAnWHBlcmlhIFRhYmxldCddLCBbVkVORE9SLCBTT05ZXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG5cbiAgICAgICAgICAgIC8vIE9uZVBsdXNcbiAgICAgICAgICAgIC8gKGtiMjAwNXxpbjIwWzEyXTV8YmUyMFsxMl1bNTldKVxcYi9pLFxuICAgICAgICAgICAgLyg/Om9uZSk/KD86cGx1cyk/IChhXFxkMFxcZFxcZCkoPzogYnxcXCkpL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ09uZVBsdXMnXSwgW1RZUEUsIE1PQklMRV1dLCBbXG5cbiAgICAgICAgICAgIC8vIEFtYXpvblxuICAgICAgICAgICAgLyhhbGV4YSl3ZWJtL2ksXG4gICAgICAgICAgICAvKGtmW2Etel17Mn13aXxhZW9bYy1yXXsyfSkoIGJ1aXxcXCkpL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBLaW5kbGUgRmlyZSB3aXRob3V0IFNpbGsgLyBFY2hvIFNob3dcbiAgICAgICAgICAgIC8oa2ZbYS16XSspKCBidWl8XFwpKS4rc2lsa1xcLy9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBLaW5kbGUgRmlyZSBIRFxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBBTUFaT05dLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC8oKD86c2R8a2YpWzAzNDloaWpvcnN0dXddKykoIGJ1aXxcXCkpLitzaWxrXFwvL2kgICAgICAgICAgICAgICAgICAgICAvLyBGaXJlIFBob25lXG4gICAgICAgICAgICBdLCBbW01PREVMLCAvKC4rKS9nLCAnRmlyZSBQaG9uZSAkMSddLCBbVkVORE9SLCBBTUFaT05dLCBbVFlQRSwgTU9CSUxFXV0sIFtcblxuICAgICAgICAgICAgLy8gQmxhY2tCZXJyeVxuICAgICAgICAgICAgLyhwbGF5Ym9vayk7Wy1cXHdcXCksOyBdKyhyaW0pL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEJsYWNrQmVycnkgUGxheUJvb2tcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgVkVORE9SLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC9cXGIoKD86YmJbYS1mXXxzdFtodl0pMTAwLVxcZCkvaSxcbiAgICAgICAgICAgIC9cXChiYjEwOyAoXFx3KykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBCbGFja0JlcnJ5IDEwXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIEJMQUNLQkVSUlldLCBbVFlQRSwgTU9CSUxFXV0sIFtcblxuICAgICAgICAgICAgLy8gQXN1c1xuICAgICAgICAgICAgLyg/OlxcYnxhc3VzXykodHJhbnNmb1twcmltZSBdezQsMTB9IFxcdyt8ZWVlcGN8c2xpZGVyIFxcdyt8bmV4dXMgN3xwYWRmb25lfHAwMFtjal0pL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgQVNVU10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgLyAoeltiZXNdNlswMjddWzAxMl1ba21dW2xzXXx6ZW5mb25lIFxcZFxcdz8pXFxiL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgQVNVU10sIFtUWVBFLCBNT0JJTEVdXSwgW1xuXG4gICAgICAgICAgICAvLyBIVENcbiAgICAgICAgICAgIC8obmV4dXMgOSkvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSFRDIE5leHVzIDlcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ0hUQyddLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC8oaHRjKVstO18gXXsxLDJ9KFtcXHcgXSsoPz1cXCl8IGJ1aSl8XFx3KykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSFRDXG5cbiAgICAgICAgICAgIC8vIFpURVxuICAgICAgICAgICAgLyh6dGUpWy0gXShbXFx3IF0rPykoPzogYnVpfFxcL3xcXCkpL2ksXG4gICAgICAgICAgICAvKGFsY2F0ZWx8Z2Vla3NwaG9uZXxuZXhpYW58cGFuYXNvbmljKD8hKD86O3xcXC4pKXxzb255KD8hLWJyYSkpWy1fIF0/KFstXFx3XSopL2kgICAgICAgICAvLyBBbGNhdGVsL0dlZWtzUGhvbmUvTmV4aWFuL1BhbmFzb25pYy9Tb255XG4gICAgICAgICAgICBdLCBbVkVORE9SLCBbTU9ERUwsIC9fL2csICcgJ10sIFtUWVBFLCBNT0JJTEVdXSwgW1xuXG4gICAgICAgICAgICAvLyBBY2VyXG4gICAgICAgICAgICAvZHJvaWQuKzsgKFthYl1bMS03XS0/WzAxNzhhXVxcZFxcZD8pL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ0FjZXInXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG5cbiAgICAgICAgICAgIC8vIE1laXp1XG4gICAgICAgICAgICAvZHJvaWQuKzsgKG1bMS01XSBub3RlKSBidWkvaSxcbiAgICAgICAgICAgIC9cXGJtei0oWy1cXHddezIsfSkvaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnTWVpenUnXSwgW1RZUEUsIE1PQklMRV1dLCBbXG5cbiAgICAgICAgICAgIC8vIE1JWEVEXG4gICAgICAgICAgICAvKGJsYWNrYmVycnl8YmVucXxwYWxtKD89XFwtKXxzb255ZXJpY3Nzb258YWNlcnxhc3VzfGRlbGx8bWVpenV8bW90b3JvbGF8cG9seXRyb24pWy1fIF0/KFstXFx3XSopL2ksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEJsYWNrQmVycnkvQmVuUS9QYWxtL1NvbnktRXJpY3Nzb24vQWNlci9Bc3VzL0RlbGwvTWVpenUvTW90b3JvbGEvUG9seXRyb25cbiAgICAgICAgICAgIC8oaHApIChbXFx3IF0rXFx3KS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBIUCBpUEFRXG4gICAgICAgICAgICAvKGFzdXMpLT8oXFx3KykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBc3VzXG4gICAgICAgICAgICAvKG1pY3Jvc29mdCk7IChsdW1pYVtcXHcgXSspL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBNaWNyb3NvZnQgTHVtaWFcbiAgICAgICAgICAgIC8obGVub3ZvKVstXyBdPyhbLVxcd10rKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIExlbm92b1xuICAgICAgICAgICAgLyhqb2xsYSkvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBKb2xsYVxuICAgICAgICAgICAgLyhvcHBvKSA/KFtcXHcgXSspIGJ1aS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gT1BQT1xuICAgICAgICAgICAgXSwgW1ZFTkRPUiwgTU9ERUwsIFtUWVBFLCBNT0JJTEVdXSwgW1xuXG4gICAgICAgICAgICAvKGtvYm8pXFxzKGVyZWFkZXJ8dG91Y2gpL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBLb2JvXG4gICAgICAgICAgICAvKGFyY2hvcykgKGdhbWVwYWQyPykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFyY2hvc1xuICAgICAgICAgICAgLyhocCkuKyh0b3VjaHBhZCg/IS4rdGFibGV0KXx0YWJsZXQpL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBIUCBUb3VjaFBhZFxuICAgICAgICAgICAgLyhraW5kbGUpXFwvKFtcXHdcXC5dKykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBLaW5kbGVcbiAgICAgICAgICAgIC8obm9vaylbXFx3IF0rYnVpbGRcXC8oXFx3KykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTm9va1xuICAgICAgICAgICAgLyhkZWxsKSAoc3RyZWFba3ByXFxkIF0qW1xcZGtvXSkvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIERlbGwgU3RyZWFrXG4gICAgICAgICAgICAvKGxlWy0gXStwYW4pWy0gXSsoXFx3ezEsOX0pIGJ1aS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBMZSBQYW4gVGFibGV0c1xuICAgICAgICAgICAgLyh0cmluaXR5KVstIF0qKHRcXGR7M30pIGJ1aS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVHJpbml0eSBUYWJsZXRzXG4gICAgICAgICAgICAvKGdpZ2FzZXQpWy0gXSsocVxcd3sxLDl9KSBidWkvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBHaWdhc2V0IFRhYmxldHNcbiAgICAgICAgICAgIC8odm9kYWZvbmUpIChbXFx3IF0rKSg/OlxcKXwgYnVpKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBWb2RhZm9uZVxuICAgICAgICAgICAgXSwgW1ZFTkRPUiwgTU9ERUwsIFtUWVBFLCBUQUJMRVRdXSwgW1xuXG4gICAgICAgICAgICAvKHN1cmZhY2UgZHVvKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFN1cmZhY2UgRHVvXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIE1JQ1JPU09GVF0sIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgL2Ryb2lkIFtcXGRcXC5dKzsgKGZwXFxkdT8pKD86IGJ8XFwpKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRmFpcnBob25lXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdGYWlycGhvbmUnXSwgW1RZUEUsIE1PQklMRV1dLCBbXG4gICAgICAgICAgICAvKHUzMDRhYSkvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFUJlRcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ0FUJlQnXSwgW1RZUEUsIE1PQklMRV1dLCBbXG4gICAgICAgICAgICAvXFxic2llLShcXHcqKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU2llbWVuc1xuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnU2llbWVucyddLCBbVFlQRSwgTU9CSUxFXV0sIFtcbiAgICAgICAgICAgIC9cXGIocmN0XFx3KykgYi9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBSQ0EgVGFibGV0c1xuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnUkNBJ10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgL1xcYih2ZW51ZVtcXGQgXXsyLDd9KSBiL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIERlbGwgVmVudWUgVGFibGV0c1xuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnRGVsbCddLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC9cXGIocSg/Om12fHRhKVxcdyspIGIvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBWZXJpem9uIFRhYmxldFxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnVmVyaXpvbiddLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC9cXGIoPzpiYXJuZXNbJiBdK25vYmxlIHxibltydF0pKFtcXHdcXCsgXSopIGIvaSAgICAgICAgICAgICAgICAgICAgICAgLy8gQmFybmVzICYgTm9ibGUgVGFibGV0XG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdCYXJuZXMgJiBOb2JsZSddLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC9cXGIodG1cXGR7M31cXHcrKSBiL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ051VmlzaW9uJ10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgL1xcYihrODgpIGIvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gWlRFIEsgU2VyaWVzIFRhYmxldFxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnWlRFJ10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgL1xcYihueFxcZHszfWopIGIvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFpURSBOdWJpYVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnWlRFJ10sIFtUWVBFLCBNT0JJTEVdXSwgW1xuICAgICAgICAgICAgL1xcYihnZW5cXGR7M30pIGIuKzQ5aC9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFN3aXNzIEdFTiBNb2JpbGVcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ1N3aXNzJ10sIFtUWVBFLCBNT0JJTEVdXSwgW1xuICAgICAgICAgICAgL1xcYih6dXJcXGR7M30pIGIvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFN3aXNzIFpVUiBUYWJsZXRcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ1N3aXNzJ10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgL1xcYigoemVraSk/dGIuKlxcYikgYi9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFpla2kgVGFibGV0c1xuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnWmVraSddLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC9cXGIoW3lyXVxcZHsyfSkgYi9pLFxuICAgICAgICAgICAgL1xcYihkcmFnb25bLSBdK3RvdWNoIHxkdCkoXFx3ezV9KSBiL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIERyYWdvbiBUb3VjaCBUYWJsZXRcbiAgICAgICAgICAgIF0sIFtbVkVORE9SLCAnRHJhZ29uIFRvdWNoJ10sIE1PREVMLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC9cXGIobnMtP1xcd3swLDl9KSBiL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBJbnNpZ25pYSBUYWJsZXRzXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdJbnNpZ25pYSddLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC9cXGIoKG54YXxuZXh0KS0/XFx3ezAsOX0pIGIvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBOZXh0Qm9vayBUYWJsZXRzXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdOZXh0Qm9vayddLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC9cXGIoeHRyZW1lXFxfKT8odigxWzA0NV18MlswMTVdfFszNDY5XTB8N1swNV0pKSBiL2kgICAgICAgICAgICAgICAgICAvLyBWb2ljZSBYdHJlbWUgUGhvbmVzXG4gICAgICAgICAgICBdLCBbW1ZFTkRPUiwgJ1ZvaWNlJ10sIE1PREVMLCBbVFlQRSwgTU9CSUxFXV0sIFtcbiAgICAgICAgICAgIC9cXGIobHZ0ZWxcXC0pPyh2MVsxMl0pIGIvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBMdlRlbCBQaG9uZXNcbiAgICAgICAgICAgIF0sIFtbVkVORE9SLCAnTHZUZWwnXSwgTU9ERUwsIFtUWVBFLCBNT0JJTEVdXSwgW1xuICAgICAgICAgICAgL1xcYihwaC0xKSAvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRXNzZW50aWFsIFBILTFcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ0Vzc2VudGlhbCddLCBbVFlQRSwgTU9CSUxFXV0sIFtcbiAgICAgICAgICAgIC9cXGIodigxMDBtZHw3MDBuYXw3MDExfDkxN2cpLipcXGIpIGIvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBFbnZpemVuIFRhYmxldHNcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ0Vudml6ZW4nXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvXFxiKHRyaW9bLVxcd1xcLiBdKykgYi9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1hY2hTcGVlZCBUYWJsZXRzXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdNYWNoU3BlZWQnXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvXFxidHVfKDE0OTEpIGIvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBSb3RvciBUYWJsZXRzXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdSb3RvciddLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC8oc2hpZWxkW1xcdyBdKykgYi9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE52aWRpYSBTaGllbGQgVGFibGV0c1xuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnTnZpZGlhJ10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgLyhzcHJpbnQpIChcXHcrKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU3ByaW50IFBob25lc1xuICAgICAgICAgICAgXSwgW1ZFTkRPUiwgTU9ERUwsIFtUWVBFLCBNT0JJTEVdXSwgW1xuICAgICAgICAgICAgLyhraW5cXC5bb25ldHddezN9KS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTWljcm9zb2Z0IEtpblxuICAgICAgICAgICAgXSwgW1tNT0RFTCwgL1xcLi9nLCAnICddLCBbVkVORE9SLCBNSUNST1NPRlRdLCBbVFlQRSwgTU9CSUxFXV0sIFtcbiAgICAgICAgICAgIC9kcm9pZC4rOyAoY2M2NjY2P3xldDVbMTZdfG1jWzIzOV1bMjNdeD98dmM4WzAzXXg/KVxcKS9pICAgICAgICAgICAgIC8vIFplYnJhXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIFpFQlJBXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvZHJvaWQuKzsgKGVjMzB8cHMyMHx0Y1syLThdXFxkW2t4XSlcXCkvaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBaRUJSQV0sIFtUWVBFLCBNT0JJTEVdXSwgW1xuXG4gICAgICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgICAgICAgICAvLyBTTUFSVFRWU1xuICAgICAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICAgICAgICAvc21hcnQtdHYuKyhzYW1zdW5nKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNhbXN1bmdcbiAgICAgICAgICAgIF0sIFtWRU5ET1IsIFtUWVBFLCBTTUFSVFRWXV0sIFtcbiAgICAgICAgICAgIC9oYmJ0di4rbWFwbGU7KFxcZCspL2lcbiAgICAgICAgICAgIF0sIFtbTU9ERUwsIC9eLywgJ1NtYXJ0VFYnXSwgW1ZFTkRPUiwgU0FNU1VOR10sIFtUWVBFLCBTTUFSVFRWXV0sIFtcbiAgICAgICAgICAgIC8obnV4OyBuZXRjYXN0LitzbWFydHR2fGxnIChuZXRjYXN0XFwudHYtMjAxXFxkfGFuZHJvaWQgdHYpKS9pICAgICAgICAvLyBMRyBTbWFydFRWXG4gICAgICAgICAgICBdLCBbW1ZFTkRPUiwgTEddLCBbVFlQRSwgU01BUlRUVl1dLCBbXG4gICAgICAgICAgICAvKGFwcGxlKSA/dHYvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFwcGxlIFRWXG4gICAgICAgICAgICBdLCBbVkVORE9SLCBbTU9ERUwsIEFQUExFKycgVFYnXSwgW1RZUEUsIFNNQVJUVFZdXSwgW1xuICAgICAgICAgICAgL2Nya2V5L2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBHb29nbGUgQ2hyb21lY2FzdFxuICAgICAgICAgICAgXSwgW1tNT0RFTCwgQ0hST01FKydjYXN0J10sIFtWRU5ET1IsIEdPT0dMRV0sIFtUWVBFLCBTTUFSVFRWXV0sIFtcbiAgICAgICAgICAgIC9kcm9pZC4rYWZ0KFxcdykoIGJ1aXxcXCkpL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBGaXJlIFRWXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIEFNQVpPTl0sIFtUWVBFLCBTTUFSVFRWXV0sIFtcbiAgICAgICAgICAgIC9cXChkdHZbXFwpO10uKyhhcXVvcykvaSxcbiAgICAgICAgICAgIC8oYXF1b3MtdHZbXFx3IF0rKVxcKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTaGFycFxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBTSEFSUF0sIFtUWVBFLCBTTUFSVFRWXV0sW1xuICAgICAgICAgICAgLyhicmF2aWFbXFx3IF0rKSggYnVpfFxcKSkvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTb255XG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIFNPTlldLCBbVFlQRSwgU01BUlRUVl1dLCBbXG4gICAgICAgICAgICAvKG1pdHYtXFx3ezV9KSBidWkvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBYaWFvbWlcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgWElBT01JXSwgW1RZUEUsIFNNQVJUVFZdXSwgW1xuICAgICAgICAgICAgL0hiYnR2LioodGVjaG5pc2F0KSAoLiopOy9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUZWNobmlTQVRcbiAgICAgICAgICAgIF0sIFtWRU5ET1IsIE1PREVMLCBbVFlQRSwgU01BUlRUVl1dLCBbXG4gICAgICAgICAgICAvXFxiKHJva3UpW1xcZHhdKltcXClcXC9dKCg/OmR2cC0pP1tcXGRcXC5dKikvaSwgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFJva3VcbiAgICAgICAgICAgIC9oYmJ0dlxcL1xcZCtcXC5cXGQrXFwuXFxkKyArXFwoW1xcd1xcKyBdKjsgKihbXFx3XFxkXVteO10qKTsoW147XSopL2kgICAgICAgICAvLyBIYmJUViBkZXZpY2VzXG4gICAgICAgICAgICBdLCBbW1ZFTkRPUiwgdHJpbV0sIFtNT0RFTCwgdHJpbV0sIFtUWVBFLCBTTUFSVFRWXV0sIFtcbiAgICAgICAgICAgIC9cXGIoYW5kcm9pZCB0dnxzbWFydFstIF0/dHZ8b3BlcmEgdHZ8dHY7IHJ2OilcXGIvaSAgICAgICAgICAgICAgICAgICAvLyBTbWFydFRWIGZyb20gVW5pZGVudGlmaWVkIFZlbmRvcnNcbiAgICAgICAgICAgIF0sIFtbVFlQRSwgU01BUlRUVl1dLCBbXG5cbiAgICAgICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAgICAgICAgIC8vIENPTlNPTEVTXG4gICAgICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgICAgICAgIC8ob3V5YSkvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gT3V5YVxuICAgICAgICAgICAgLyhuaW50ZW5kbykgKFt3aWRzM3V0Y2hdKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBOaW50ZW5kb1xuICAgICAgICAgICAgXSwgW1ZFTkRPUiwgTU9ERUwsIFtUWVBFLCBDT05TT0xFXV0sIFtcbiAgICAgICAgICAgIC9kcm9pZC4rOyAoc2hpZWxkKSBidWkvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTnZpZGlhXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdOdmlkaWEnXSwgW1RZUEUsIENPTlNPTEVdXSwgW1xuICAgICAgICAgICAgLyhwbGF5c3RhdGlvbiBbMzQ1cG9ydGFibGV2aV0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBQbGF5c3RhdGlvblxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBTT05ZXSwgW1RZUEUsIENPTlNPTEVdXSwgW1xuICAgICAgICAgICAgL1xcYih4Ym94KD86IG9uZSk/KD8hOyB4Ym94KSlbXFwpOyBdL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1pY3Jvc29mdCBYYm94XG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIE1JQ1JPU09GVF0sIFtUWVBFLCBDT05TT0xFXV0sIFtcblxuICAgICAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgICAgICAgICAgLy8gV0VBUkFCTEVTXG4gICAgICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgICAgICAgIC8oKHBlYmJsZSkpYXBwL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUGViYmxlXG4gICAgICAgICAgICBdLCBbVkVORE9SLCBNT0RFTCwgW1RZUEUsIFdFQVJBQkxFXV0sIFtcbiAgICAgICAgICAgIC8od2F0Y2gpKD86ID9vc1ssXFwvXXxcXGQsXFxkXFwvKVtcXGRcXC5dKy9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQXBwbGUgV2F0Y2hcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgQVBQTEVdLCBbVFlQRSwgV0VBUkFCTEVdXSwgW1xuICAgICAgICAgICAgL2Ryb2lkLis7IChnbGFzcykgXFxkL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gR29vZ2xlIEdsYXNzXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIEdPT0dMRV0sIFtUWVBFLCBXRUFSQUJMRV1dLCBbXG4gICAgICAgICAgICAvZHJvaWQuKzsgKHd0NjM/MHsyLDN9KVxcKS9pXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIFpFQlJBXSwgW1RZUEUsIFdFQVJBQkxFXV0sIFtcbiAgICAgICAgICAgIC8ocXVlc3QoIDJ8IHBybyk/KS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gT2N1bHVzIFF1ZXN0XG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIEZBQ0VCT09LXSwgW1RZUEUsIFdFQVJBQkxFXV0sIFtcblxuICAgICAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgICAgICAgICAgLy8gRU1CRURERURcbiAgICAgICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgICAgICAgLyh0ZXNsYSkoPzogcXRjYXJicm93c2VyfFxcL1stXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUZXNsYVxuICAgICAgICAgICAgXSwgW1ZFTkRPUiwgW1RZUEUsIEVNQkVEREVEXV0sIFtcbiAgICAgICAgICAgIC8oYWVvYmMpXFxiL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEVjaG8gRG90XG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIEFNQVpPTl0sIFtUWVBFLCBFTUJFRERFRF1dLCBbXG5cbiAgICAgICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgICAgICAgICAvLyBNSVhFRCAoR0VORVJJQylcbiAgICAgICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgICAgICAgL2Ryb2lkIC4rPzsgKFteO10rPykoPzogYnVpfFxcKSBhcHBsZXcpLis/IG1vYmlsZSBzYWZhcmkvaSAgICAgICAgICAgLy8gQW5kcm9pZCBQaG9uZXMgZnJvbSBVbmlkZW50aWZpZWQgVmVuZG9yc1xuICAgICAgICAgICAgXSwgW01PREVMLCBbVFlQRSwgTU9CSUxFXV0sIFtcbiAgICAgICAgICAgIC9kcm9pZCAuKz87IChbXjtdKz8pKD86IGJ1aXxcXCkgYXBwbGV3KS4rPyg/ISBtb2JpbGUpIHNhZmFyaS9pICAgICAgIC8vIEFuZHJvaWQgVGFibGV0cyBmcm9tIFVuaWRlbnRpZmllZCBWZW5kb3JzXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgL1xcYigodGFibGV0fHRhYilbO1xcL118Zm9jdXNcXC9cXGQoPyEuK21vYmlsZSkpL2kgICAgICAgICAgICAgICAgICAgICAgLy8gVW5pZGVudGlmaWFibGUgVGFibGV0XG4gICAgICAgICAgICBdLCBbW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvKHBob25lfG1vYmlsZSg/Ols7XFwvXXwgWyBcXHdcXC9cXC5dKnNhZmFyaSl8cGRhKD89Lit3aW5kb3dzIGNlKSkvaSAgICAvLyBVbmlkZW50aWZpYWJsZSBNb2JpbGVcbiAgICAgICAgICAgIF0sIFtbVFlQRSwgTU9CSUxFXV0sIFtcbiAgICAgICAgICAgIC8oYW5kcm9pZFstXFx3XFwuIF17MCw5fSk7LitidWlsL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBHZW5lcmljIEFuZHJvaWQgRGV2aWNlXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdHZW5lcmljJ11dXG4gICAgICAgIF0sXG5cbiAgICAgICAgZW5naW5lIDogW1tcblxuICAgICAgICAgICAgL3dpbmRvd3MuKyBlZGdlXFwvKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEVkZ2VIVE1MXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsIEVER0UrJ0hUTUwnXV0sIFtcblxuICAgICAgICAgICAgL3dlYmtpdFxcLzUzN1xcLjM2LitjaHJvbWVcXC8oPyEyNykoW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEJsaW5rXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsICdCbGluayddXSwgW1xuXG4gICAgICAgICAgICAvKHByZXN0bylcXC8oW1xcd1xcLl0rKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFByZXN0b1xuICAgICAgICAgICAgLyh3ZWJraXR8dHJpZGVudHxuZXRmcm9udHxuZXRzdXJmfGFtYXlhfGx5bnh8dzNtfGdvYW5uYSlcXC8oW1xcd1xcLl0rKS9pLCAvLyBXZWJLaXQvVHJpZGVudC9OZXRGcm9udC9OZXRTdXJmL0FtYXlhL0x5bngvdzNtL0dvYW5uYVxuICAgICAgICAgICAgL2VraW9oKGZsb3cpXFwvKFtcXHdcXC5dKykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBGbG93XG4gICAgICAgICAgICAvKGtodG1sfHRhc21hbnxsaW5rcylbXFwvIF1cXCg/KFtcXHdcXC5dKykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBLSFRNTC9UYXNtYW4vTGlua3NcbiAgICAgICAgICAgIC8oaWNhYilbXFwvIF0oWzIzXVxcLltcXGRcXC5dKykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlDYWJcbiAgICAgICAgICAgIC9cXGIobGlid2ViKS9pXG4gICAgICAgICAgICBdLCBbTkFNRSwgVkVSU0lPTl0sIFtcblxuICAgICAgICAgICAgL3J2XFw6KFtcXHdcXC5dezEsOX0pXFxiLisoZ2Vja28pL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gR2Vja29cbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBOQU1FXVxuICAgICAgICBdLFxuXG4gICAgICAgIG9zIDogW1tcblxuICAgICAgICAgICAgLy8gV2luZG93c1xuICAgICAgICAgICAgL21pY3Jvc29mdCAod2luZG93cykgKHZpc3RhfHhwKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBXaW5kb3dzIChpVHVuZXMpXG4gICAgICAgICAgICBdLCBbTkFNRSwgVkVSU0lPTl0sIFtcbiAgICAgICAgICAgIC8od2luZG93cykgbnQgNlxcLjI7IChhcm0pL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdpbmRvd3MgUlRcbiAgICAgICAgICAgIC8od2luZG93cyAoPzpwaG9uZSg/OiBvcyk/fG1vYmlsZSkpW1xcLyBdPyhbXFxkXFwuXFx3IF0qKS9pLCAgICAgICAgICAgIC8vIFdpbmRvd3MgUGhvbmVcbiAgICAgICAgICAgIC8od2luZG93cylbXFwvIF0/KFtudGNlXFxkXFwuIF0rXFx3KSg/IS4reGJveCkvaVxuICAgICAgICAgICAgXSwgW05BTUUsIFtWRVJTSU9OLCBzdHJNYXBwZXIsIHdpbmRvd3NWZXJzaW9uTWFwXV0sIFtcbiAgICAgICAgICAgIC8od2luKD89M3w5fG4pfHdpbiA5eCApKFtudFxcZFxcLl0rKS9pXG4gICAgICAgICAgICBdLCBbW05BTUUsICdXaW5kb3dzJ10sIFtWRVJTSU9OLCBzdHJNYXBwZXIsIHdpbmRvd3NWZXJzaW9uTWFwXV0sIFtcblxuICAgICAgICAgICAgLy8gaU9TL21hY09TXG4gICAgICAgICAgICAvaXBbaG9uZWFkXXsyLDR9XFxiKD86LipvcyAoW1xcd10rKSBsaWtlIG1hY3w7IG9wZXJhKS9pLCAgICAgICAgICAgICAgLy8gaU9TXG4gICAgICAgICAgICAvaW9zO2Zic3ZcXC8oW1xcZFxcLl0rKS9pLFxuICAgICAgICAgICAgL2NmbmV0d29ya1xcLy4rZGFyd2luL2lcbiAgICAgICAgICAgIF0sIFtbVkVSU0lPTiwgL18vZywgJy4nXSwgW05BTUUsICdpT1MnXV0sIFtcbiAgICAgICAgICAgIC8obWFjIG9zIHgpID8oW1xcd1xcLiBdKikvaSxcbiAgICAgICAgICAgIC8obWFjaW50b3NofG1hY19wb3dlcnBjXFxiKSg/IS4raGFpa3UpL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1hYyBPU1xuICAgICAgICAgICAgXSwgW1tOQU1FLCBNQUNfT1NdLCBbVkVSU0lPTiwgL18vZywgJy4nXV0sIFtcblxuICAgICAgICAgICAgLy8gTW9iaWxlIE9TZXNcbiAgICAgICAgICAgIC9kcm9pZCAoW1xcd1xcLl0rKVxcYi4rKGFuZHJvaWRbLSBdeDg2fGhhcm1vbnlvcykvaSAgICAgICAgICAgICAgICAgICAgLy8gQW5kcm9pZC14ODYvSGFybW9ueU9TXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgTkFNRV0sIFsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFuZHJvaWQvV2ViT1MvUU5YL0JhZGEvUklNL01hZW1vL01lZUdvL1NhaWxmaXNoIE9TXG4gICAgICAgICAgICAvKGFuZHJvaWR8d2Vib3N8cW54fGJhZGF8cmltIHRhYmxldCBvc3xtYWVtb3xtZWVnb3xzYWlsZmlzaClbLVxcLyBdPyhbXFx3XFwuXSopL2ksXG4gICAgICAgICAgICAvKGJsYWNrYmVycnkpXFx3KlxcLyhbXFx3XFwuXSopL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBCbGFja2JlcnJ5XG4gICAgICAgICAgICAvKHRpemVufGthaW9zKVtcXC8gXShbXFx3XFwuXSspL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRpemVuL0thaU9TXG4gICAgICAgICAgICAvXFwoKHNlcmllczQwKTsvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTZXJpZXMgNDBcbiAgICAgICAgICAgIF0sIFtOQU1FLCBWRVJTSU9OXSwgW1xuICAgICAgICAgICAgL1xcKGJiKDEwKTsvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQmxhY2tCZXJyeSAxMFxuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCBCTEFDS0JFUlJZXV0sIFtcbiAgICAgICAgICAgIC8oPzpzeW1iaWFuID9vc3xzeW1ib3N8czYwKD89Oyl8c2VyaWVzNjApWy1cXC8gXT8oW1xcd1xcLl0qKS9pICAgICAgICAgLy8gU3ltYmlhblxuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCAnU3ltYmlhbiddXSwgW1xuICAgICAgICAgICAgL21vemlsbGFcXC9bXFxkXFwuXSsgXFwoKD86bW9iaWxlfHRhYmxldHx0dnxtb2JpbGU7IFtcXHcgXSspOyBydjouKyBnZWNrb1xcLyhbXFx3XFwuXSspL2kgLy8gRmlyZWZveCBPU1xuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCBGSVJFRk9YKycgT1MnXV0sIFtcbiAgICAgICAgICAgIC93ZWIwczsuK3J0KHR2KS9pLFxuICAgICAgICAgICAgL1xcYig/OmhwKT93b3MoPzpicm93c2VyKT9cXC8oW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gV2ViT1NcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgJ3dlYk9TJ11dLCBbXG4gICAgICAgICAgICAvd2F0Y2goPzogP29zWyxcXC9dfFxcZCxcXGRcXC8pKFtcXGRcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHdhdGNoT1NcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgJ3dhdGNoT1MnXV0sIFtcblxuICAgICAgICAgICAgLy8gR29vZ2xlIENocm9tZWNhc3RcbiAgICAgICAgICAgIC9jcmtleVxcLyhbXFxkXFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gR29vZ2xlIENocm9tZWNhc3RcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgQ0hST01FKydjYXN0J11dLCBbXG4gICAgICAgICAgICAvKGNyb3MpIFtcXHddKyg/OlxcKXwgKFtcXHdcXC5dKylcXGIpL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ2hyb21pdW0gT1NcbiAgICAgICAgICAgIF0sIFtbTkFNRSwgQ0hST01JVU1fT1NdLCBWRVJTSU9OXSxbXG5cbiAgICAgICAgICAgIC8vIFNtYXJ0IFRWc1xuICAgICAgICAgICAgL3BhbmFzb25pYzsodmllcmEpL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBQYW5hc29uaWMgVmllcmFcbiAgICAgICAgICAgIC8obmV0cmFuZ2UpbW1oL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTmV0cmFuZ2VcbiAgICAgICAgICAgIC8obmV0dHYpXFwvKFxcZCtcXC5bXFx3XFwuXSspL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBOZXRUVlxuXG4gICAgICAgICAgICAvLyBDb25zb2xlXG4gICAgICAgICAgICAvKG5pbnRlbmRvfHBsYXlzdGF0aW9uKSAoW3dpZHMzNDVwb3J0YWJsZXZ1Y2hdKykvaSwgICAgICAgICAgICAgICAgIC8vIE5pbnRlbmRvL1BsYXlzdGF0aW9uXG4gICAgICAgICAgICAvKHhib3gpOyAreGJveCAoW15cXCk7XSspL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBNaWNyb3NvZnQgWGJveCAoMzYwLCBPbmUsIFgsIFMsIFNlcmllcyBYLCBTZXJpZXMgUylcblxuICAgICAgICAgICAgLy8gT3RoZXJcbiAgICAgICAgICAgIC9cXGIoam9saXxwYWxtKVxcYiA/KD86b3MpP1xcLz8oW1xcd1xcLl0qKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBKb2xpL1BhbG1cbiAgICAgICAgICAgIC8obWludClbXFwvXFwoXFwpIF0/KFxcdyopL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1pbnRcbiAgICAgICAgICAgIC8obWFnZWlhfHZlY3RvcmxpbnV4KVs7IF0vaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTWFnZWlhL1ZlY3RvckxpbnV4XG4gICAgICAgICAgICAvKFtreGxuXT91YnVudHV8ZGViaWFufHN1c2V8b3BlbnN1c2V8Z2VudG9vfGFyY2goPz0gbGludXgpfHNsYWNrd2FyZXxmZWRvcmF8bWFuZHJpdmF8Y2VudG9zfHBjbGludXhvc3xyZWQgP2hhdHx6ZW53YWxrfGxpbnB1c3xyYXNwYmlhbnxwbGFuIDl8bWluaXh8cmlzYyBvc3xjb250aWtpfGRlZXBpbnxtYW5qYXJvfGVsZW1lbnRhcnkgb3N8c2FiYXlvbnxsaW5zcGlyZSkoPzogZ251XFwvbGludXgpPyg/OiBlbnRlcnByaXNlKT8oPzpbLSBdbGludXgpPyg/Oi1nbnUpP1stXFwvIF0/KD8hY2hyb218cGFja2FnZSkoWy1cXHdcXC5dKikvaSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVWJ1bnR1L0RlYmlhbi9TVVNFL0dlbnRvby9BcmNoL1NsYWNrd2FyZS9GZWRvcmEvTWFuZHJpdmEvQ2VudE9TL1BDTGludXhPUy9SZWRIYXQvWmVud2Fsay9MaW5wdXMvUmFzcGJpYW4vUGxhbjkvTWluaXgvUklTQ09TL0NvbnRpa2kvRGVlcGluL01hbmphcm8vZWxlbWVudGFyeS9TYWJheW9uL0xpbnNwaXJlXG4gICAgICAgICAgICAvKGh1cmR8bGludXgpID8oW1xcd1xcLl0qKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSHVyZC9MaW51eFxuICAgICAgICAgICAgLyhnbnUpID8oW1xcd1xcLl0qKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEdOVVxuICAgICAgICAgICAgL1xcYihbLWZyZW50b3BjZ2hzXXswLDV9YnNkfGRyYWdvbmZseSlbXFwvIF0/KD8hYW1kfFtpeDM0Nl17MSwyfTg2KShbXFx3XFwuXSopL2ksIC8vIEZyZWVCU0QvTmV0QlNEL09wZW5CU0QvUEMtQlNEL0dob3N0QlNEL0RyYWdvbkZseVxuICAgICAgICAgICAgLyhoYWlrdSkgKFxcdyspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSGFpa3VcbiAgICAgICAgICAgIF0sIFtOQU1FLCBWRVJTSU9OXSwgW1xuICAgICAgICAgICAgLyhzdW5vcykgPyhbXFx3XFwuXFxkXSopL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTb2xhcmlzXG4gICAgICAgICAgICBdLCBbW05BTUUsICdTb2xhcmlzJ10sIFZFUlNJT05dLCBbXG4gICAgICAgICAgICAvKCg/Om9wZW4pP3NvbGFyaXMpWy1cXC8gXT8oW1xcd1xcLl0qKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNvbGFyaXNcbiAgICAgICAgICAgIC8oYWl4KSAoKFxcZCkoPz1cXC58XFwpfCApW1xcd1xcLl0pKi9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBSVhcbiAgICAgICAgICAgIC9cXGIoYmVvc3xvc1xcLzJ8YW1pZ2Fvc3xtb3JwaG9zfG9wZW52bXN8ZnVjaHNpYXxocC11eHxzZXJlbml0eW9zKS9pLCAvLyBCZU9TL09TMi9BbWlnYU9TL01vcnBoT1MvT3BlblZNUy9GdWNoc2lhL0hQLVVYL1NlcmVuaXR5T1NcbiAgICAgICAgICAgIC8odW5peCkgPyhbXFx3XFwuXSopL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBVTklYXG4gICAgICAgICAgICBdLCBbTkFNRSwgVkVSU0lPTl1cbiAgICAgICAgXVxuICAgIH07XG5cbiAgICAvLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8vIENvbnN0cnVjdG9yXG4gICAgLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgdmFyIFVBUGFyc2VyID0gZnVuY3Rpb24gKHVhLCBleHRlbnNpb25zKSB7XG5cbiAgICAgICAgaWYgKHR5cGVvZiB1YSA9PT0gT0JKX1RZUEUpIHtcbiAgICAgICAgICAgIGV4dGVuc2lvbnMgPSB1YTtcbiAgICAgICAgICAgIHVhID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFVBUGFyc2VyKSkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBVQVBhcnNlcih1YSwgZXh0ZW5zaW9ucykuZ2V0UmVzdWx0KCk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgX25hdmlnYXRvciA9ICh0eXBlb2Ygd2luZG93ICE9PSBVTkRFRl9UWVBFICYmIHdpbmRvdy5uYXZpZ2F0b3IpID8gd2luZG93Lm5hdmlnYXRvciA6IHVuZGVmaW5lZDtcbiAgICAgICAgdmFyIF91YSA9IHVhIHx8ICgoX25hdmlnYXRvciAmJiBfbmF2aWdhdG9yLnVzZXJBZ2VudCkgPyBfbmF2aWdhdG9yLnVzZXJBZ2VudCA6IEVNUFRZKTtcbiAgICAgICAgdmFyIF91YWNoID0gKF9uYXZpZ2F0b3IgJiYgX25hdmlnYXRvci51c2VyQWdlbnREYXRhKSA/IF9uYXZpZ2F0b3IudXNlckFnZW50RGF0YSA6IHVuZGVmaW5lZDtcbiAgICAgICAgdmFyIF9yZ3htYXAgPSBleHRlbnNpb25zID8gZXh0ZW5kKHJlZ2V4ZXMsIGV4dGVuc2lvbnMpIDogcmVnZXhlcztcbiAgICAgICAgdmFyIF9pc1NlbGZOYXYgPSBfbmF2aWdhdG9yICYmIF9uYXZpZ2F0b3IudXNlckFnZW50ID09IF91YTtcblxuICAgICAgICB0aGlzLmdldEJyb3dzZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgX2Jyb3dzZXIgPSB7fTtcbiAgICAgICAgICAgIF9icm93c2VyW05BTUVdID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgX2Jyb3dzZXJbVkVSU0lPTl0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICByZ3hNYXBwZXIuY2FsbChfYnJvd3NlciwgX3VhLCBfcmd4bWFwLmJyb3dzZXIpO1xuICAgICAgICAgICAgX2Jyb3dzZXJbTUFKT1JdID0gbWFqb3JpemUoX2Jyb3dzZXJbVkVSU0lPTl0pO1xuICAgICAgICAgICAgLy8gQnJhdmUtc3BlY2lmaWMgZGV0ZWN0aW9uXG4gICAgICAgICAgICBpZiAoX2lzU2VsZk5hdiAmJiBfbmF2aWdhdG9yICYmIF9uYXZpZ2F0b3IuYnJhdmUgJiYgdHlwZW9mIF9uYXZpZ2F0b3IuYnJhdmUuaXNCcmF2ZSA9PSBGVU5DX1RZUEUpIHtcbiAgICAgICAgICAgICAgICBfYnJvd3NlcltOQU1FXSA9ICdCcmF2ZSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gX2Jyb3dzZXI7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZ2V0Q1BVID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIF9jcHUgPSB7fTtcbiAgICAgICAgICAgIF9jcHVbQVJDSElURUNUVVJFXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIHJneE1hcHBlci5jYWxsKF9jcHUsIF91YSwgX3JneG1hcC5jcHUpO1xuICAgICAgICAgICAgcmV0dXJuIF9jcHU7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZ2V0RGV2aWNlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIF9kZXZpY2UgPSB7fTtcbiAgICAgICAgICAgIF9kZXZpY2VbVkVORE9SXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIF9kZXZpY2VbTU9ERUxdID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgX2RldmljZVtUWVBFXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIHJneE1hcHBlci5jYWxsKF9kZXZpY2UsIF91YSwgX3JneG1hcC5kZXZpY2UpO1xuICAgICAgICAgICAgaWYgKF9pc1NlbGZOYXYgJiYgIV9kZXZpY2VbVFlQRV0gJiYgX3VhY2ggJiYgX3VhY2gubW9iaWxlKSB7XG4gICAgICAgICAgICAgICAgX2RldmljZVtUWVBFXSA9IE1PQklMRTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGlQYWRPUy1zcGVjaWZpYyBkZXRlY3Rpb246IGlkZW50aWZpZWQgYXMgTWFjLCBidXQgaGFzIHNvbWUgaU9TLW9ubHkgcHJvcGVydGllc1xuICAgICAgICAgICAgaWYgKF9pc1NlbGZOYXYgJiYgX2RldmljZVtNT0RFTF0gPT0gJ01hY2ludG9zaCcgJiYgX25hdmlnYXRvciAmJiB0eXBlb2YgX25hdmlnYXRvci5zdGFuZGFsb25lICE9PSBVTkRFRl9UWVBFICYmIF9uYXZpZ2F0b3IubWF4VG91Y2hQb2ludHMgJiYgX25hdmlnYXRvci5tYXhUb3VjaFBvaW50cyA+IDIpIHtcbiAgICAgICAgICAgICAgICBfZGV2aWNlW01PREVMXSA9ICdpUGFkJztcbiAgICAgICAgICAgICAgICBfZGV2aWNlW1RZUEVdID0gVEFCTEVUO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIF9kZXZpY2U7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZ2V0RW5naW5lID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIF9lbmdpbmUgPSB7fTtcbiAgICAgICAgICAgIF9lbmdpbmVbTkFNRV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBfZW5naW5lW1ZFUlNJT05dID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgcmd4TWFwcGVyLmNhbGwoX2VuZ2luZSwgX3VhLCBfcmd4bWFwLmVuZ2luZSk7XG4gICAgICAgICAgICByZXR1cm4gX2VuZ2luZTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5nZXRPUyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBfb3MgPSB7fTtcbiAgICAgICAgICAgIF9vc1tOQU1FXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIF9vc1tWRVJTSU9OXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIHJneE1hcHBlci5jYWxsKF9vcywgX3VhLCBfcmd4bWFwLm9zKTtcbiAgICAgICAgICAgIGlmIChfaXNTZWxmTmF2ICYmICFfb3NbTkFNRV0gJiYgX3VhY2ggJiYgX3VhY2gucGxhdGZvcm0gIT0gJ1Vua25vd24nKSB7XG4gICAgICAgICAgICAgICAgX29zW05BTUVdID0gX3VhY2gucGxhdGZvcm0gIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL2Nocm9tZSBvcy9pLCBDSFJPTUlVTV9PUylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9tYWNvcy9pLCBNQUNfT1MpOyAgICAgICAgICAgLy8gYmFja3dhcmQgY29tcGF0aWJpbGl0eVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIF9vcztcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5nZXRSZXN1bHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHVhICAgICAgOiB0aGlzLmdldFVBKCksXG4gICAgICAgICAgICAgICAgYnJvd3NlciA6IHRoaXMuZ2V0QnJvd3NlcigpLFxuICAgICAgICAgICAgICAgIGVuZ2luZSAgOiB0aGlzLmdldEVuZ2luZSgpLFxuICAgICAgICAgICAgICAgIG9zICAgICAgOiB0aGlzLmdldE9TKCksXG4gICAgICAgICAgICAgICAgZGV2aWNlICA6IHRoaXMuZ2V0RGV2aWNlKCksXG4gICAgICAgICAgICAgICAgY3B1ICAgICA6IHRoaXMuZ2V0Q1BVKClcbiAgICAgICAgICAgIH07XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZ2V0VUEgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gX3VhO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLnNldFVBID0gZnVuY3Rpb24gKHVhKSB7XG4gICAgICAgICAgICBfdWEgPSAodHlwZW9mIHVhID09PSBTVFJfVFlQRSAmJiB1YS5sZW5ndGggPiBVQV9NQVhfTEVOR1RIKSA/IHRyaW0odWEsIFVBX01BWF9MRU5HVEgpIDogdWE7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5zZXRVQShfdWEpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgVUFQYXJzZXIuVkVSU0lPTiA9IExJQlZFUlNJT047XG4gICAgVUFQYXJzZXIuQlJPV1NFUiA9ICBlbnVtZXJpemUoW05BTUUsIFZFUlNJT04sIE1BSk9SXSk7XG4gICAgVUFQYXJzZXIuQ1BVID0gZW51bWVyaXplKFtBUkNISVRFQ1RVUkVdKTtcbiAgICBVQVBhcnNlci5ERVZJQ0UgPSBlbnVtZXJpemUoW01PREVMLCBWRU5ET1IsIFRZUEUsIENPTlNPTEUsIE1PQklMRSwgU01BUlRUViwgVEFCTEVULCBXRUFSQUJMRSwgRU1CRURERURdKTtcbiAgICBVQVBhcnNlci5FTkdJTkUgPSBVQVBhcnNlci5PUyA9IGVudW1lcml6ZShbTkFNRSwgVkVSU0lPTl0pO1xuXG4gICAgLy8vLy8vLy8vLy9cbiAgICAvLyBFeHBvcnRcbiAgICAvLy8vLy8vLy8vXG5cbiAgICAvLyBjaGVjayBqcyBlbnZpcm9ubWVudFxuICAgIGlmICh0eXBlb2YoZXhwb3J0cykgIT09IFVOREVGX1RZUEUpIHtcbiAgICAgICAgLy8gbm9kZWpzIGVudlxuICAgICAgICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gVU5ERUZfVFlQRSAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgICAgICAgICAgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gVUFQYXJzZXI7XG4gICAgICAgIH1cbiAgICAgICAgZXhwb3J0cy5VQVBhcnNlciA9IFVBUGFyc2VyO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHJlcXVpcmVqcyBlbnYgKG9wdGlvbmFsKVxuICAgICAgICBpZiAodHlwZW9mKGRlZmluZSkgPT09IEZVTkNfVFlQRSAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgICAgICBkZWZpbmUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBVQVBhcnNlcjtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB3aW5kb3cgIT09IFVOREVGX1RZUEUpIHtcbiAgICAgICAgICAgIC8vIGJyb3dzZXIgZW52XG4gICAgICAgICAgICB3aW5kb3cuVUFQYXJzZXIgPSBVQVBhcnNlcjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGpRdWVyeS9aZXB0byBzcGVjaWZpYyAob3B0aW9uYWwpXG4gICAgLy8gTm90ZTpcbiAgICAvLyAgIEluIEFNRCBlbnYgdGhlIGdsb2JhbCBzY29wZSBzaG91bGQgYmUga2VwdCBjbGVhbiwgYnV0IGpRdWVyeSBpcyBhbiBleGNlcHRpb24uXG4gICAgLy8gICBqUXVlcnkgYWx3YXlzIGV4cG9ydHMgdG8gZ2xvYmFsIHNjb3BlLCB1bmxlc3MgalF1ZXJ5Lm5vQ29uZmxpY3QodHJ1ZSkgaXMgdXNlZCxcbiAgICAvLyAgIGFuZCB3ZSBzaG91bGQgY2F0Y2ggdGhhdC5cbiAgICB2YXIgJCA9IHR5cGVvZiB3aW5kb3cgIT09IFVOREVGX1RZUEUgJiYgKHdpbmRvdy5qUXVlcnkgfHwgd2luZG93LlplcHRvKTtcbiAgICBpZiAoJCAmJiAhJC51YSkge1xuICAgICAgICB2YXIgcGFyc2VyID0gbmV3IFVBUGFyc2VyKCk7XG4gICAgICAgICQudWEgPSBwYXJzZXIuZ2V0UmVzdWx0KCk7XG4gICAgICAgICQudWEuZ2V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHBhcnNlci5nZXRVQSgpO1xuICAgICAgICB9O1xuICAgICAgICAkLnVhLnNldCA9IGZ1bmN0aW9uICh1YSkge1xuICAgICAgICAgICAgcGFyc2VyLnNldFVBKHVhKTtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBwYXJzZXIuZ2V0UmVzdWx0KCk7XG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wIGluIHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICQudWFbcHJvcF0gPSByZXN1bHRbcHJvcF07XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG59KSh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JyA/IHdpbmRvdyA6IHRoaXMpO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIl9fd2VicGFja19yZXF1aXJlX18uYW1kTyA9IHt9OyIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vaW5kZXgudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=