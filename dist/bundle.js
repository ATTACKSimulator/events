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
        this.manager.trigger(name);
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
    let verOffset, browser = {};
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

/***/ "./src/Manager.ts":
/*!************************!*\
  !*** ./src/Manager.ts ***!
  \************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Manager = void 0;
const BrowserInfo_1 = __webpack_require__(/*! ./BrowserInfo */ "./src/BrowserInfo.ts");
const CampaignInfo_1 = __webpack_require__(/*! ./CampaignInfo */ "./src/CampaignInfo.ts");
const AttachmentOpen_1 = __webpack_require__(/*! ./events/AttachmentOpen */ "./src/events/AttachmentOpen.ts");
const Click_1 = __webpack_require__(/*! ./events/Click */ "./src/events/Click.ts");
const Download_1 = __webpack_require__(/*! ./events/Download */ "./src/events/Download.ts");
const FileOpen_1 = __webpack_require__(/*! ./events/FileOpen */ "./src/events/FileOpen.ts");
const Input_1 = __webpack_require__(/*! ./events/Input */ "./src/events/Input.ts");
const PageLoaded_1 = __webpack_require__(/*! ./events/PageLoaded */ "./src/events/PageLoaded.ts");
const PageRead_1 = __webpack_require__(/*! ./events/PageRead */ "./src/events/PageRead.ts");
const Submit_1 = __webpack_require__(/*! ./events/Submit */ "./src/events/Submit.ts");
const Tools_1 = __webpack_require__(/*! ./Tools */ "./src/Tools.ts");
class Manager {
    constructor(remote, eventNames, source, redirectUrl, shouldRedirect, debug = false) {
        this.supportedTypes = ["email", "password", "tel"];
        this.supportedEvents = { "attachment_opened": AttachmentOpen_1.AttachmentOpen, "click": Click_1.Click, "download": Download_1.Download, "file_open": FileOpen_1.FileOpen, "input": Input_1.Input, "page_loaded": PageLoaded_1.PageLoaded, "page_read": PageRead_1.PageRead, "submit": Submit_1.Submit, };
        this.debug = false;
        this.handlers = [];
        this.disabledEvents = [];
        this.remote = remote;
        [this.token, this.campaignInfo] = (0, CampaignInfo_1.findCampaignInfo)();
        this.browserInfo = (0, BrowserInfo_1.findBrowserInfo)();
        if (!eventNames.length) {
            eventNames = Object.keys(this.supportedEvents);
        }
        this.remoteEvents = eventNames.map(name => this.getEvent(name));
        this.source = source;
        this.redirectUrl = redirectUrl;
        this.shouldRedirect = shouldRedirect;
        this.debug = debug;
        if (this.campaignInfo.download_type) {
            this.checkDownload();
        }
    }
    checkDownload() {
        switch (this.campaignInfo.download_type) {
            case "file":
                return this.trigger("file_opened");
            case "attachment":
                return this.trigger("attachment_opened");
        }
    }
    getEvent(name) {
        return new (this.supportedEvents[name]);
    }
    listen() {
        let i = 0;
        for (const remoteEvent of this.remoteEvents) {
            if (this.debug) {
                console.log(`Listening for event @${remoteEvent.trigger} (${remoteEvent.name})`);
            }
            const targets = remoteEvent.targets;
            for (const target of targets) {
                target.addEventListener(remoteEvent.trigger, this.handlers[i++] = event => this.handle(remoteEvent, event));
            }
        }
    }
    stop() {
        let i = 0;
        for (const remoteEvent of this.remoteEvents) {
            if (this.debug) {
                console.log(`Stopping listening for event @${remoteEvent.trigger} (${remoteEvent.name})`);
            }
            const targets = remoteEvent.targets;
            for (const target of targets) {
                target.removeEventListener(remoteEvent.trigger, this.handlers[i++]);
            }
        }
    }
    findType(remoteEvent, event) {
        if (!remoteEvent.hasTypes || !event) {
            return null;
        }
        const inputElement = event.currentTarget;
        if (this.supportedTypes.indexOf(inputElement.type) !== -1) {
            return inputElement.type;
        }
        if (inputElement.dataset.type) {
            return inputElement.dataset.type;
        }
        return null;
    }
    packEvent(type, remoteEvent) {
        return {
            "data": Object.assign(Object.assign({}, this.browserInfo), { type }),
            "source": this.source,
            "timestamp": Math.floor(Date.now() / 1000),
            "ats_header": this.token,
            "event": remoteEvent.name.toLowerCase(),
            "sg_event_id": (0, Tools_1.createUUID)(),
            "sg_message_id": this.campaignInfo.ats_instance_id,
        };
    }
    trigger(eventName) {
        const remoteEvent = this.getEvent(eventName);
        if (!remoteEvent) {
            throw new Error(`Unsupported event ${eventName}. Please choose one of ${Object.keys(this.supportedEvents).join(", ")}`);
        }
        this.handle(remoteEvent);
    }
    handle(remoteEvent, event) {
        if (this.debug) {
            console.log(`Event @${remoteEvent.trigger} (${remoteEvent.name}) triggered...`);
        }
        if (event && remoteEvent.isBlocking) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
        }
        if (!remoteEvent.allowMultiple) {
            if (this.disabledEvents.includes(remoteEvent.name)) {
                if (this.debug) {
                    console.log(`Preventing duplicate event @${remoteEvent.trigger} (${remoteEvent.name}).`);
                }
                return;
            }
            this.disabledEvents.push(remoteEvent.name);
        }
        const type = this.findType(remoteEvent, event);
        const payload = this.packEvent(type, remoteEvent);
        this.remote.post(payload)
            .then(result => {
            if (this.debug) {
                console.log(result);
            }
        })
            .catch(e => { if (this.debug) {
            console.error(e);
        } })
            .finally(() => {
            if (remoteEvent.redirectOnFinish && this.shouldRedirect) {
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
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("POST", this.url, true);
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.setRequestHeader("api-key", this.api_key);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    if (xhr.responseText) {
                        const json = JSON.parse(xhr.responseText);
                        resolve(json);
                    }
                    else {
                        resolve({});
                    }
                }
            };
            xhr.onerror = function (e) {
                reject(e);
            };
            xhr.send(JSON.stringify(data));
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
exports.removeSubdomain = exports.createUUID = void 0;
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

/***/ "./src/events/AttachmentOpen.ts":
/*!**************************************!*\
  !*** ./src/events/AttachmentOpen.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AttachmentOpen = void 0;
class AttachmentOpen {
    get redirectOnFinish() {
        return false;
    }
    get trigger() {
        return "";
    }
    get name() {
        return "attachment_opened";
    }
    get hasTypes() {
        return false;
    }
    get targets() {
        return [];
    }
    checkEvent() {
        return true;
    }
    get isBlocking() {
        return true;
    }
}
exports.AttachmentOpen = AttachmentOpen;


/***/ }),

/***/ "./src/events/Click.ts":
/*!*****************************!*\
  !*** ./src/events/Click.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Click = void 0;
class Click {
    get redirectOnFinish() {
        return true;
    }
    get trigger() {
        return "click";
    }
    get name() {
        return "page_left";
    }
    get hasTypes() {
        return true;
    }
    get targets() {
        const elements = document.querySelectorAll("a:not([href$='.exe']),button:not([type=submit]),input[type=button]");
        return [...elements].filter(element => !element.hasAttribute("ignore"));
    }
    checkEvent(event) {
        return event.which && event.isTrusted && event.screenX && event.screenX != 0 && event.screenY && event.screenY != 0;
    }
    get isBlocking() {
        return true;
    }
}
exports.Click = Click;


/***/ }),

/***/ "./src/events/Download.ts":
/*!********************************!*\
  !*** ./src/events/Download.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Download = void 0;
class Download {
    get redirectOnFinish() {
        return true;
    }
    get trigger() {
        return "click";
    }
    get name() {
        return "download_file_event";
    }
    get hasTypes() {
        return true;
    }
    get targets() {
        const elements = document.querySelectorAll("a[href$='.exe']");
        return [...elements].filter(element => !element.hasAttribute("ignore"));
    }
    checkEvent(event) {
        return event.which && event.isTrusted && event.screenX && event.screenX != 0 && event.screenY && event.screenY != 0;
    }
    get isBlocking() {
        return true;
    }
}
exports.Download = Download;


/***/ }),

/***/ "./src/events/FileOpen.ts":
/*!********************************!*\
  !*** ./src/events/FileOpen.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FileOpen = void 0;
class FileOpen {
    get redirectOnFinish() {
        return false;
    }
    get trigger() {
        return "";
    }
    get name() {
        return "file_opened";
    }
    get hasTypes() {
        return false;
    }
    get targets() {
        return [];
    }
    checkEvent() {
        return true;
    }
    get isBlocking() {
        return true;
    }
}
exports.FileOpen = FileOpen;


/***/ }),

/***/ "./src/events/Input.ts":
/*!*****************************!*\
  !*** ./src/events/Input.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Input = void 0;
class Input {
    get redirectOnFinish() {
        return false;
    }
    get trigger() {
        return "input";
    }
    get name() {
        return "input_filled";
    }
    get hasTypes() {
        return true;
    }
    get targets() {
        const elements = document.querySelectorAll("select,textarea,input");
        return [...elements].filter(element => !element.hasAttribute("ignore"));
    }
    checkEvent(event) {
        const input = event.target;
        return !!input.value.trim();
    }
    get isBlocking() {
        return false;
    }
}
exports.Input = Input;


/***/ }),

/***/ "./src/events/PageLoaded.ts":
/*!**********************************!*\
  !*** ./src/events/PageLoaded.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PageLoaded = void 0;
class PageLoaded {
    get redirectOnFinish() {
        return false;
    }
    get trigger() {
        return "load";
    }
    get name() {
        return "page_loaded";
    }
    get hasTypes() {
        return false;
    }
    get targets() {
        return [window];
    }
    checkEvent() {
        return true;
    }
    get isBlocking() {
        return false;
    }
}
exports.PageLoaded = PageLoaded;


/***/ }),

/***/ "./src/events/PageRead.ts":
/*!********************************!*\
  !*** ./src/events/PageRead.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PageRead = void 0;
class PageRead {
    constructor() {
        this.minScrollPercentage = 75;
        this.minStaySeconds = 60 * 1000;
        this.hasScrolled = false;
        this.hasStayed = false;
        this.customEvent = new Event(this.trigger);
        this.enable();
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
    get redirectOnFinish() {
        return false;
    }
    get trigger() {
        return "page_read";
    }
    get name() {
        return "page_read";
    }
    get hasTypes() {
        return false;
    }
    get targets() {
        return [window];
    }
    checkEvent() {
        return true;
    }
    get isBlocking() {
        return false;
    }
}
exports.PageRead = PageRead;


/***/ }),

/***/ "./src/events/Submit.ts":
/*!******************************!*\
  !*** ./src/events/Submit.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Submit = void 0;
class Submit {
    get redirectOnFinish() {
        return true;
    }
    get trigger() {
        return "submit";
    }
    get name() {
        return "form_submitted";
    }
    get hasTypes() {
        return true;
    }
    get targets() {
        const elements = document.querySelectorAll("form");
        return [...elements].filter(element => !element.hasAttribute("ignore"));
    }
    checkEvent(event) {
        const element = event.target;
        return element.className.indexOf("disabled") === -1;
    }
    get isBlocking() {
        return true;
    }
}
exports.Submit = Submit;


/***/ }),

/***/ "./node_modules/ua-parser-js/src/ua-parser.js":
/*!****************************************************!*\
  !*** ./node_modules/ua-parser-js/src/ua-parser.js ***!
  \****************************************************/
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/////////////////////////////////////////////////////////////////////////////////
/* UAParser.js v1.0.2
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


    var LIBVERSION  = '1.0.2',
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
        UA_MAX_LENGTH = 255;

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
        SONY    = 'Sony',
        XIAOMI  = 'Xiaomi',
        ZEBRA   = 'Zebra',
        FACEBOOK   = 'Facebook';

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
                str = str.replace(/^\s\s*/, EMPTY).replace(/\s\s*$/, EMPTY);
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
            /(flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon|rekonq|puffin|brave|whale|qqbrowserlite|qq)\/([-\w\.]+)/i,
                                                                                // Rekonq/Puffin/Brave/Whale/QQBrowserLite/QQ, aka ShouQ
            /(weibo)__([\d\.]+)/i                                               // Weibo
            ], [NAME, VERSION], [
            /(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i                 // UCBrowser
            ], [VERSION, [NAME, 'UC'+BROWSER]], [
            /\bqbcore\/([\w\.]+)/i                                              // WeChat Desktop for Windows Built-in Browser
            ], [VERSION, [NAME, 'WeChat(Win) Desktop']], [
            /micromessenger\/([\w\.]+)/i                                        // WeChat
            ], [VERSION, [NAME, 'WeChat']], [
            /konqueror\/([\w\.]+)/i                                             // Konqueror
            ], [VERSION, [NAME, 'Konqueror']], [
            /trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i                       // IE11
            ], [VERSION, [NAME, 'IE']], [
            /yabrowser\/([\w\.]+)/i                                             // Yandex
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
            /(oculus|samsung|sailfish)browser\/([\w\.]+)/i
            ], [[NAME, /(.+)/, '$1 '+BROWSER], VERSION], [                      // Oculus/Samsung/Sailfish Browser
            /(comodo_dragon)\/([\w\.]+)/i                                       // Comodo Dragon
            ], [[NAME, /_/g, ' '], VERSION], [
            /(electron)\/([\w\.]+) safari/i,                                    // Electron-based App
            /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i,                   // Tesla
            /m?(qqbrowser|baiduboxapp|2345Explorer)[\/ ]?([\w\.]+)/i            // QQBrowser/Baidu App/2345 Browser
            ], [NAME, VERSION], [
            /(metasr)[\/ ]?([\w\.]+)/i,                                         // SouGouBrowser
            /(lbbrowser)/i                                                      // LieBao Browser
            ], [NAME], [

            // WebView
            /((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i       // Facebook App for iOS & Android
            ], [[NAME, FACEBOOK], VERSION], [
            /safari (line)\/([\w\.]+)/i,                                        // Line App for iOS
            /\b(line)\/([\w\.]+)\/iab/i,                                        // Line App for Android
            /(chromium|instagram)[\/ ]([-\w\.]+)/i                              // Chromium/Instagram
            ], [NAME, VERSION], [
            /\bgsa\/([\w\.]+) .*safari\//i                                      // Google Search Appliance on iOS
            ], [VERSION, [NAME, 'GSA']], [

            /headlesschrome(?:\/([\w\.]+)| )/i                                  // Chrome Headless
            ], [VERSION, [NAME, CHROME+' Headless']], [

            / wv\).+(chrome)\/([\w\.]+)/i                                       // Chrome WebView
            ], [[NAME, CHROME+' WebView'], VERSION], [

            /droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i           // Android Browser
            ], [VERSION, [NAME, 'Android '+BROWSER]], [

            /(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i       // Chrome/OmniWeb/Arora/Tizen/Nokia
            ], [NAME, VERSION], [

            /version\/([\w\.]+) .*mobile\/\w+ (safari)/i                        // Mobile Safari
            ], [VERSION, [NAME, 'Mobile Safari']], [
            /version\/([\w\.]+) .*(mobile ?safari|safari)/i                     // Safari & Safari Mobile
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
            /(links) \(([\w\.]+)/i                                              // Links
            ], [NAME, VERSION]
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
            // Ordered by popularity
            /////////////////////////

            // Samsung
            /\b(sch-i[89]0\d|shw-m380s|sm-[pt]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i
            ], [MODEL, [VENDOR, SAMSUNG], [TYPE, TABLET]], [
            /\b((?:s[cgp]h|gt|sm)-\w+|galaxy nexus)/i,
            /samsung[- ]([-\w]+)/i,
            /sec-(sgh\w+)/i
            ], [MODEL, [VENDOR, SAMSUNG], [TYPE, MOBILE]], [

            // Apple
            /\((ip(?:hone|od)[\w ]*);/i                                         // iPod/iPhone
            ], [MODEL, [VENDOR, APPLE], [TYPE, MOBILE]], [
            /\((ipad);[-\w\),; ]+apple/i,                                       // iPad
            /applecoremedia\/[\w\.]+ \((ipad)/i,
            /\b(ipad)\d\d?,\d\d?[;\]].+ios/i
            ], [MODEL, [VENDOR, APPLE], [TYPE, TABLET]], [

            // Huawei
            /\b((?:ag[rs][23]?|bah2?|sht?|btv)-a?[lw]\d{2})\b(?!.+d\/s)/i
            ], [MODEL, [VENDOR, HUAWEI], [TYPE, TABLET]], [
            /(?:huawei|honor)([-\w ]+)[;\)]/i,
            /\b(nexus 6p|\w{2,4}-[atu]?[ln][01259x][012359][an]?)\b(?!.+d\/s)/i
            ], [MODEL, [VENDOR, HUAWEI], [TYPE, MOBILE]], [

            // Xiaomi
            /\b(poco[\w ]+)(?: bui|\))/i,                                       // Xiaomi POCO
            /\b; (\w+) build\/hm\1/i,                                           // Xiaomi Hongmi 'numeric' models
            /\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i,                             // Xiaomi Hongmi
            /\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i,                   // Xiaomi Redmi
            /\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite)?)(?: bui|\))/i // Xiaomi Mi
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
            /droid.+ ([c-g]\d{4}|so[-gl]\w+|xq-a\w[4-7][12])(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i
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
            /(kf[a-z]{2}wi)( bui|\))/i,                                         // Kindle Fire without Silk
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
            /(alcatel|geeksphone|nexian|panasonic|sony)[-_ ]?([-\w]*)/i         // Alcatel/GeeksPhone/Nexian/Panasonic/Sony
            ], [VENDOR, [MODEL, /_/g, ' '], [TYPE, MOBILE]], [

            // Acer
            /droid.+; ([ab][1-7]-?[0178a]\d\d?)/i
            ], [MODEL, [VENDOR, 'Acer'], [TYPE, TABLET]], [

            // Meizu
            /droid.+; (m[1-5] note) bui/i,
            /\bmz-([-\w]{2,})/i
            ], [MODEL, [VENDOR, 'Meizu'], [TYPE, MOBILE]], [

            // Sharp
            /\b(sh-?[altvz]?\d\d[a-ekm]?)/i
            ], [MODEL, [VENDOR, 'Sharp'], [TYPE, MOBILE]], [

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
            /\(dtv[\);].+(aquos)/i                                              // Sharp
            ], [MODEL, [VENDOR, 'Sharp'], [TYPE, SMARTTV]], [
            /\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i,                          // Roku
            /hbbtv\/\d+\.\d+\.\d+ +\([\w ]*; *(\w[^;]*);([^;]*)/i               // HbbTV devices
            ], [[VENDOR, trim], [MODEL, trim], [TYPE, SMARTTV]], [
            /\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i                   // SmartTV from Unidentified Vendors
            ], [[TYPE, SMARTTV]], [

            ///////////////////
            // WEARABLES
            ///////////////////

            /((pebble))app/i                                                    // Pebble
            ], [VENDOR, MODEL, [TYPE, WEARABLE]], [
            /droid.+; (glass) \d/i                                              // Google Glass
            ], [MODEL, [VENDOR, GOOGLE], [TYPE, WEARABLE]], [
            /droid.+; (wt63?0{2,3})\)/i
            ], [MODEL, [VENDOR, ZEBRA], [TYPE, WEARABLE]], [
            /(quest( 2)?)/i                                                     // Oculus Quest
            ], [MODEL, [VENDOR, FACEBOOK], [TYPE, WEARABLE]], [

            ///////////////////
            // EMBEDDED
            ///////////////////

            /(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i                              // Tesla
            ], [VENDOR, [TYPE, EMBEDDED]], [

            ////////////////////
            // MIXED (GENERIC)
            ///////////////////

            /droid .+?; ([^;]+?)(?: bui|\) applew).+? mobile safari/i           // Android Phones from Unidentified Vendors
            ], [MODEL, [TYPE, MOBILE]], [
            /droid .+?; ([^;]+?)(?: bui|\) applew).+?(?! mobile) safari/i       // Android Tablets from Unidentified Vendors
            ], [MODEL, [TYPE, TABLET]], [
            /\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i                      // Unidentifiable Tablet
            ], [[TYPE, TABLET]], [
            /(phone|mobile(?:[;\/]| safari)|pda(?=.+windows ce))/i              // Unidentifiable Mobile
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
            /(icab)[\/ ]([23]\.[\d\.]+)/i                                       // iCab
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
            /cfnetwork\/.+darwin/i
            ], [[VERSION, /_/g, '.'], [NAME, 'iOS']], [
            /(mac os x) ?([\w\. ]*)/i,
            /(macintosh|mac_powerpc\b)(?!.+haiku)/i                             // Mac OS
            ], [[NAME, 'Mac OS'], [VERSION, /_/g, '.']], [

            // Mobile OSes
            /droid ([\w\.]+)\b.+(android[- ]x86)/i                              // Android-x86
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

            // Google Chromecast
            /crkey\/([\d\.]+)/i                                                 // Google Chromecast
            ], [VERSION, [NAME, CHROME+'cast']], [
            /(cros) [\w]+ ([\w\.]+\w)/i                                         // Chromium OS
            ], [[NAME, 'Chromium OS'], VERSION],[

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
            /\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux)/i,            // BeOS/OS2/AmigaOS/MorphOS/OpenVMS/Fuchsia/HP-UX
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

        var _ua = ua || ((typeof window !== UNDEF_TYPE && window.navigator && window.navigator.userAgent) ? window.navigator.userAgent : EMPTY);
        var _rgxmap = extensions ? extend(regexes, extensions) : regexes;

        this.getBrowser = function () {
            var _browser = {};
            _browser[NAME] = undefined;
            _browser[VERSION] = undefined;
            rgxMapper.call(_browser, _ua, _rgxmap.browser);
            _browser.major = majorize(_browser.version);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFBQSxrR0FBQztBQUNkLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLENBQUM7Ozs7Ozs7VUN6MkJEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBOzs7OztVRUFBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vQVRTRXZlbnRzLy4vaW5kZXgudHMiLCJ3ZWJwYWNrOi8vQVRTRXZlbnRzLy4vc3JjL0Jyb3dzZXJJbmZvLnRzIiwid2VicGFjazovL0FUU0V2ZW50cy8uL3NyYy9DYW1wYWlnbkluZm8udHMiLCJ3ZWJwYWNrOi8vQVRTRXZlbnRzLy4vc3JjL01hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vQVRTRXZlbnRzLy4vc3JjL1JlbW90ZS50cyIsIndlYnBhY2s6Ly9BVFNFdmVudHMvLi9zcmMvVG9vbHMudHMiLCJ3ZWJwYWNrOi8vQVRTRXZlbnRzLy4vc3JjL1VybFBhcnNlci50cyIsIndlYnBhY2s6Ly9BVFNFdmVudHMvLi9zcmMvZXZlbnRzL0F0dGFjaG1lbnRPcGVuLnRzIiwid2VicGFjazovL0FUU0V2ZW50cy8uL3NyYy9ldmVudHMvQ2xpY2sudHMiLCJ3ZWJwYWNrOi8vQVRTRXZlbnRzLy4vc3JjL2V2ZW50cy9Eb3dubG9hZC50cyIsIndlYnBhY2s6Ly9BVFNFdmVudHMvLi9zcmMvZXZlbnRzL0ZpbGVPcGVuLnRzIiwid2VicGFjazovL0FUU0V2ZW50cy8uL3NyYy9ldmVudHMvSW5wdXQudHMiLCJ3ZWJwYWNrOi8vQVRTRXZlbnRzLy4vc3JjL2V2ZW50cy9QYWdlTG9hZGVkLnRzIiwid2VicGFjazovL0FUU0V2ZW50cy8uL3NyYy9ldmVudHMvUGFnZVJlYWQudHMiLCJ3ZWJwYWNrOi8vQVRTRXZlbnRzLy4vc3JjL2V2ZW50cy9TdWJtaXQudHMiLCJ3ZWJwYWNrOi8vQVRTRXZlbnRzLy4vbm9kZV9tb2R1bGVzL3VhLXBhcnNlci1qcy9zcmMvdWEtcGFyc2VyLmpzIiwid2VicGFjazovL0FUU0V2ZW50cy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9BVFNFdmVudHMvd2VicGFjay9ydW50aW1lL2FtZCBvcHRpb25zIiwid2VicGFjazovL0FUU0V2ZW50cy93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL0FUU0V2ZW50cy93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vQVRTRXZlbnRzL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNYW5hZ2VyIH0gZnJvbSBcIi4vc3JjL01hbmFnZXJcIjtcbmltcG9ydCBSZW1vdGUgZnJvbSBcIi4vc3JjL1JlbW90ZVwiO1xuaW1wb3J0IHtyZW1vdmVTdWJkb21haW59IGZyb20gXCIuL3NyYy9Ub29sc1wiO1xuXG5pbnRlcmZhY2UgT3B0aW9ucyB7XG5cdGFwaUtleT86IHN0cmluZyxcblx0ZGVidWc/OiBib29sZWFuLFxuXHRldmVudHM/OiBzdHJpbmdbXVxuXHRyZWRpcmVjdFVybDogc3RyaW5nLFxuXHRzaG91bGRSZWRpcmVjdDogYm9vbGVhbixcblx0c291cmNlOiBzdHJpbmcsXG5cdHVybDogc3RyaW5nLFxufVxuXG5jb25zdCBkZWZhdWx0T3B0aW9uczogT3B0aW9ucyA9IHtcblx0ZXZlbnRzOiBbXSxcblx0ZGVidWc6IGZhbHNlLFxuXHRzaG91bGRSZWRpcmVjdDogdHJ1ZSxcblx0cmVkaXJlY3RVcmw6IGBodHRwczovL29vcHMuJHtyZW1vdmVTdWJkb21haW4od2luZG93LmxvY2F0aW9uLmhvc3RuYW1lKX1gLFxuXHRzb3VyY2U6IFwiTFBcIixcblx0dXJsOiBcImh0dHBzOi8vYXBpLmF0dGFja3NpbXVsYXRvci5jb20vdjAvY2xpZW50LWV2ZW50c1wiLFxufTtcblxuY2xhc3MgQVRTRXZlbnRzIHtcblx0cHJpdmF0ZSBtYW5hZ2VyOiBNYW5hZ2VyO1xuXG5cdGNvbnN0cnVjdG9yKG9wdGlvbnM6IE9wdGlvbnMpIHtcblx0XHRjb25zdCBfb3B0aW9ucyA9IHsuLi5kZWZhdWx0T3B0aW9ucywgLi4ub3B0aW9uc307XG5cdFx0aWYgKF9vcHRpb25zLmRlYnVnKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhfb3B0aW9ucyk7XG5cdFx0fVxuXHRcdGNvbnN0IHJlbW90ZSA9IG5ldyBSZW1vdGUoX29wdGlvbnMuYXBpS2V5LCBfb3B0aW9ucy51cmwsIF9vcHRpb25zLmRlYnVnKTtcblx0XHR0aGlzLm1hbmFnZXIgPSBuZXcgTWFuYWdlcihyZW1vdGUsIF9vcHRpb25zLmV2ZW50cywgX29wdGlvbnMuc291cmNlLCBfb3B0aW9ucy5yZWRpcmVjdFVybCwgX29wdGlvbnMuc2hvdWxkUmVkaXJlY3QsIF9vcHRpb25zLmRlYnVnKTtcblx0fVxuXG5cdGxpc3RlbigpIHtcblx0XHR0aGlzLm1hbmFnZXIubGlzdGVuKCk7XG5cdH1cblxuXHRzdG9wKCkge1xuXHRcdHRoaXMubWFuYWdlci5zdG9wKCk7XG5cdH1cblxuXHR0cmlnZ2VyKG5hbWU6IHN0cmluZykge1xuXHRcdHRoaXMubWFuYWdlci50cmlnZ2VyKG5hbWUpO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQVRTRXZlbnRzO1xuIiwiaW1wb3J0IHBhcnNlciBmcm9tIFwidWEtcGFyc2VyLWpzXCI7XG5cbmludGVyZmFjZSBTY3JlZW5TaXplIHtcbiAgICB3aWR0aCA/OiBudW1iZXJcbiAgICBoZWlnaHQgPzogbnVtYmVyXG59XG5cbmludGVyZmFjZSBCcm93c2VyIHtcbiAgICBuYW1lID86IHN0cmluZ1xuICAgIHZlcnNpb24gPzogc3RyaW5nXG4gICAgbWFqb3JfdmVyc2lvbiA/OiBudW1iZXJcbiAgICBtb2JpbGUgPzogYm9vbGVhblxufVxuXG5pbnRlcmZhY2UgT1Mge1xuICAgIG5hbWUgPzogc3RyaW5nXG4gICAgdmVyc2lvbiA/OiBzdHJpbmdcbn1cblxuaW50ZXJmYWNlIERldmljZSB7XG4gICAgbW9kZWw/OiBzdHJpbmdcbiAgICB0eXBlPzogc3RyaW5nXG4gICAgdmVuZG9yPzogc3RyaW5nXG59XG5pbnRlcmZhY2UgQ3B1IHtcbiAgICBhcmNoaXRlY3R1cmUgPzpzdHJpbmdcbn1cbmV4cG9ydCBpbnRlcmZhY2UgQnJvd3NlckluZm8ge1xuICAgIHVhOiBzdHJpbmc7XG4gICAgc2NyZWVuX3NpemU6IFNjcmVlblNpemU7XG4gICAgYnJvd3NlcjogQnJvd3NlcjtcbiAgICBvczogT1M7XG4gICAgZGV2aWNlOiBEZXZpY2U7XG4gICAgY3B1OiBDcHU7XG59XG5cbmZ1bmN0aW9uIGZpbmRCcm93c2VyKCk6IEJyb3dzZXIge1xuXHRsZXQgdmVyT2Zmc2V0LCBicm93c2VyOiBCcm93c2VyID0ge307XG5cdGNvbnN0IHVzZXJBZ2VudCA9IG5hdmlnYXRvci51c2VyQWdlbnQ7XG5cblx0Ly8gT3BlcmFcblx0aWYgKCh2ZXJPZmZzZXQgPSB1c2VyQWdlbnQuaW5kZXhPZihcIk9wZXJhXCIpKSAhPT0gLTEpIHtcblx0XHRicm93c2VyLm5hbWUgPSBcIk9wZXJhXCI7XG5cdFx0YnJvd3Nlci52ZXJzaW9uID0gdXNlckFnZW50LnN1YnN0cmluZyh2ZXJPZmZzZXQgKyA2KTtcblx0XHRpZiAoKHZlck9mZnNldCA9IHVzZXJBZ2VudC5pbmRleE9mKFwiVmVyc2lvblwiKSkgIT09IC0xKSB7XG5cdFx0XHRicm93c2VyLnZlcnNpb24gPSB1c2VyQWdlbnQuc3Vic3RyaW5nKHZlck9mZnNldCArIDgpO1xuXHRcdH1cblx0fVxuXG5cdC8vIE9wZXJhIE5leHRcblx0ZWxzZSBpZiAoKHZlck9mZnNldCA9IHVzZXJBZ2VudC5pbmRleE9mKFwiT1BSXCIpKSAhPT0gLTEpIHtcblx0XHRicm93c2VyLm5hbWUgPSBcIk9wZXJhXCI7XG5cdFx0YnJvd3Nlci52ZXJzaW9uID0gdXNlckFnZW50LnN1YnN0cmluZyh2ZXJPZmZzZXQgKyA1KTtcblx0fVxuXG5cdC8vIEVkZ2Vcblx0ZWxzZSBpZiAoKHZlck9mZnNldCA9IHVzZXJBZ2VudC5pbmRleE9mKFwiRWRnZVwiKSkgIT09IC0xKSB7XG5cdFx0YnJvd3Nlci5uYW1lID0gXCJNaWNyb3NvZnQgRWRnZVwiO1xuXHRcdGJyb3dzZXIudmVyc2lvbiA9IHVzZXJBZ2VudC5zdWJzdHJpbmcodmVyT2Zmc2V0ICsgNSk7XG5cdH1cblxuXHQvLyBNU0lFXG5cdGVsc2UgaWYgKCh2ZXJPZmZzZXQgPSB1c2VyQWdlbnQuaW5kZXhPZihcIk1TSUVcIikpICE9PSAtMSkge1xuXHRcdGJyb3dzZXIubmFtZSA9IFwiTWljcm9zb2Z0IEludGVybmV0IEV4cGxvcmVyXCI7XG5cdFx0YnJvd3Nlci52ZXJzaW9uID0gdXNlckFnZW50LnN1YnN0cmluZyh2ZXJPZmZzZXQgKyA1KTtcblx0fVxuXG5cdC8vIENocm9tZVxuXHRlbHNlIGlmICgodmVyT2Zmc2V0ID0gdXNlckFnZW50LmluZGV4T2YoXCJDaHJvbWVcIikpICE9PSAtMSkge1xuXHRcdGJyb3dzZXIubmFtZSA9IFwiQ2hyb21lXCI7XG5cdFx0YnJvd3Nlci52ZXJzaW9uID0gdXNlckFnZW50LnN1YnN0cmluZyh2ZXJPZmZzZXQgKyA3KTtcblx0fVxuXG5cdC8vIFNhZmFyaVxuXHRlbHNlIGlmICgodmVyT2Zmc2V0ID0gdXNlckFnZW50LmluZGV4T2YoXCJTYWZhcmlcIikpICE9PSAtMSkge1xuXHRcdGJyb3dzZXIubmFtZSA9IFwiU2FmYXJpXCI7XG5cdFx0YnJvd3Nlci52ZXJzaW9uID0gdXNlckFnZW50LnN1YnN0cmluZyh2ZXJPZmZzZXQgKyA3KTtcblx0XHRpZiAoKHZlck9mZnNldCA9IHVzZXJBZ2VudC5pbmRleE9mKFwiVmVyc2lvblwiKSkgIT09IC0xKSB7XG5cdFx0XHRicm93c2VyLnZlcnNpb24gPSB1c2VyQWdlbnQuc3Vic3RyaW5nKHZlck9mZnNldCArIDgpO1xuXHRcdH1cblx0fVxuXG5cdC8vIEZpcmVmb3hcblx0ZWxzZSBpZiAoKHZlck9mZnNldCA9IHVzZXJBZ2VudC5pbmRleE9mKFwiRmlyZWZveFwiKSkgIT09IC0xKSB7XG5cdFx0YnJvd3Nlci5uYW1lID0gXCJGaXJlZm94XCI7XG5cdFx0YnJvd3Nlci52ZXJzaW9uID0gdXNlckFnZW50LnN1YnN0cmluZyh2ZXJPZmZzZXQgKyA4KTtcblx0fVxuXG5cdC8vIE1TSUUgMTErXG5cdGVsc2UgaWYgKHVzZXJBZ2VudC5pbmRleE9mKFwiVHJpZGVudC9cIikgIT09IC0xKSB7XG5cdFx0YnJvd3Nlci5uYW1lID0gXCJNaWNyb3NvZnQgSW50ZXJuZXQgRXhwbG9yZXJcIjtcblx0XHRicm93c2VyLnZlcnNpb24gPSB1c2VyQWdlbnQuc3Vic3RyaW5nKHVzZXJBZ2VudC5pbmRleE9mKFwicnY6XCIpICsgMyk7XG5cdH1cblxuXHRicm93c2VyLm1vYmlsZSA9IC9Nb2JpbGV8bWluaXxGZW5uZWN8QW5kcm9pZHxpUChhZHxvZHxob25lKS8udGVzdCh1c2VyQWdlbnQpO1xuXG5cdC8vIHRyaW0gdGhlIHZlcnNpb24gc3RyaW5nXG5cdGxldCBpeDtcblx0aWYgKChpeCA9IGJyb3dzZXIudmVyc2lvbi5pbmRleE9mKFwiO1wiKSkgIT0gLTEpIGJyb3dzZXIudmVyc2lvbiA9IGJyb3dzZXIudmVyc2lvbi5zdWJzdHJpbmcoMCwgaXgpO1xuXHRpZiAoKGl4ID0gYnJvd3Nlci52ZXJzaW9uLmluZGV4T2YoXCIgXCIpKSAhPSAtMSkgYnJvd3Nlci52ZXJzaW9uID0gYnJvd3Nlci52ZXJzaW9uLnN1YnN0cmluZygwLCBpeCk7XG5cdGlmICgoaXggPSBicm93c2VyLnZlcnNpb24uaW5kZXhPZihcIilcIikpICE9IC0xKSBicm93c2VyLnZlcnNpb24gPSBicm93c2VyLnZlcnNpb24uc3Vic3RyaW5nKDAsIGl4KTtcblxuXHRicm93c2VyLm1ham9yX3ZlcnNpb24gPSBwYXJzZUludChcIlwiICsgYnJvd3Nlci52ZXJzaW9uLCAxMCk7XG5cdGlmIChpc05hTiggYnJvd3Nlci5tYWpvcl92ZXJzaW9uKSkge1xuXHRcdGJyb3dzZXIudmVyc2lvbiA9IFwiXCIgKyBwYXJzZUZsb2F0KG5hdmlnYXRvci5hcHBWZXJzaW9uKTtcblx0XHRicm93c2VyLm1ham9yX3ZlcnNpb24gPSBwYXJzZUludChuYXZpZ2F0b3IuYXBwVmVyc2lvbiwgMTApO1xuXHR9XG4gICAgXG5cdHJldHVybiBicm93c2VyO1xufVxuXG5mdW5jdGlvbiBmaW5kT3BlcmF0aW5nU3lzdGVtKHBhcnNlcjogYW55KTogT1Mge1xuXHRjb25zdCB7bmFtZSwgdmVyc2lvbn0gPSBwYXJzZXIuZ2V0T1MoKTtcblx0cmV0dXJuIHsgbmFtZSwgdmVyc2lvbn07XG59XG5cbmZ1bmN0aW9uIGZpbmREZXZpY2UocGFyc2VyOiBhbnkpOiBEZXZpY2Uge1xuXHRjb25zdCB7bW9kZWwsIHR5cGUsIHZlbmRvcn0gPSBwYXJzZXIuZ2V0RGV2aWNlKCk7XG5cdHJldHVybiB7bW9kZWwsIHR5cGUsIHZlbmRvcn07XG59XG5cbmZ1bmN0aW9uIGZpbmRDcHUocGFyc2VyOiBhbnkpOiBDcHUge1xuXHRjb25zdCB7YXJjaGl0ZWN0dXJlfSA9IHBhcnNlci5nZXRDUFUoKTtcblx0cmV0dXJuIHthcmNoaXRlY3R1cmV9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmluZEJyb3dzZXJJbmZvKCk6IEJyb3dzZXJJbmZvIHtcblx0Y29uc3QgdWEgPSBuZXcgcGFyc2VyKCk7XG5cdHJldHVybiB7XG5cdFx0dWE6IHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50LFxuXHRcdHNjcmVlbl9zaXplOiB7XG5cdFx0XHR3aWR0aDogc2NyZWVuLndpZHRoIHx8IDAsXG5cdFx0XHRoZWlnaHQ6IHNjcmVlbi5oZWlnaHQgfHwgMFxuXHRcdH0sXG5cdFx0YnJvd3NlcjogZmluZEJyb3dzZXIoKSxcblx0XHRvczogZmluZE9wZXJhdGluZ1N5c3RlbSh1YSksXG5cdFx0ZGV2aWNlOiBmaW5kRGV2aWNlKHVhKSxcblx0XHRjcHU6IGZpbmRDcHUodWEpXG5cdH07XG59IiwiaW1wb3J0IHsgVXJsUGFyc2VyIH0gZnJvbSBcIi4vVXJsUGFyc2VyXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2FtcGFpZ25JbmZvIHtcbiAgICBhdHNfZW52ID86IHN0cmluZ1xuICAgIGF0c19hdGtfdHlwZSA/OiBzdHJpbmdcbiAgICBhdHNfY2FtcGFpZ25fbmFtZSA/OiBzdHJpbmdcbiAgICBhdHNfY29tcGFueV9pZCA/OiBzdHJpbmdcbiAgICBhdHNfaW5zdGFuY2VfaWQgPzogc3RyaW5nXG4gICAgYXRzX2xvY2FsZSA/OiBzdHJpbmdcbiAgICBhdHNfcHJvY2Vzc2VkX2RhdGUgPzogc3RyaW5nXG4gICAgYXRzX3VzZXJfaWQgPzogc3RyaW5nXG5cdGRvd25sb2FkX3R5cGUgPzogc3RyaW5nXG59XG5cbmZ1bmN0aW9uIHJlYWRUb2tlblN0cmluZyh0b2tlblN0cmluZyA/OiBzdHJpbmcsIGZpbGVUeXBlID86IHN0cmluZyk6IENhbXBhaWduSW5mbyB7XG5cdGNvbnN0IGJhc2U2NFVybCA9IHRva2VuU3RyaW5nLnNwbGl0KFwiLlwiKVsxXTtcblx0Y29uc3QgYmFzZTY0ID0gIGJhc2U2NFVybC5yZXBsYWNlKC8tL2csIFwiK1wiKS5yZXBsYWNlKC9fL2csIFwiL1wiKTtcblx0Y29uc3QgY2FtcGFpZ25JbmZvID0gSlNPTi5wYXJzZSh3aW5kb3cuYXRvYihiYXNlNjQpKS5wYXlsb2FkIGFzIENhbXBhaWduSW5mbztcblxuXHRpZiAoZmlsZVR5cGUgPT09IFwiYXR0YWNobWVudFwiKSB7XG5cdFx0Y2FtcGFpZ25JbmZvLmRvd25sb2FkX3R5cGUgPSBcImF0dGFjaG1lbnRcIjtcblx0fSBlbHNlIGlmIChmaWxlVHlwZSAhPT0gbnVsbCkge1xuXHRcdGNhbXBhaWduSW5mby5kb3dubG9hZF90eXBlID0gXCJmaWxlXCI7XG5cdH1cblxuXHRyZXR1cm4gY2FtcGFpZ25JbmZvO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmluZENhbXBhaWduSW5mbygpIDogW3N0cmluZywgQ2FtcGFpZ25JbmZvXSB7XG5cdGNvbnN0IHVybCA9IG5ldyBVcmxQYXJzZXIod2luZG93LmxvY2F0aW9uLmhyZWYpO1xuXHRjb25zdCB0b2tlblN0cmluZyA9IHVybC5maW5kUGFyYW0oXCJ0a1wiKTtcblx0aWYgKCF0b2tlblN0cmluZykge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIk1pc3NpbmcgQVRUQUNLIFNpbXVsYXRvciB0b2tlblwiKTtcblx0fVxuXHRjb25zdCBmaWxlVHlwZSA9IHVybC5maW5kUGFyYW0oXCJmaWxlX3R5cGVcIik7XG5cblx0dHJ5IHtcblx0XHRyZXR1cm4gW3Rva2VuU3RyaW5nLCByZWFkVG9rZW5TdHJpbmcodG9rZW5TdHJpbmcsIGZpbGVUeXBlKV07XG5cdH0gY2F0Y2goZSkge1xuXHRcdHJldHVybiBbdG9rZW5TdHJpbmcsIHsgYXRzX2NvbXBhbnlfaWQ6IFwiXCIgfV07XG5cdH1cbn1cbiIsImltcG9ydCB7IEJyb3dzZXJJbmZvLCBmaW5kQnJvd3NlckluZm8gfSBmcm9tIFwiLi9Ccm93c2VySW5mb1wiO1xuaW1wb3J0IHsgQ2FtcGFpZ25JbmZvLCBmaW5kQ2FtcGFpZ25JbmZvIH0gZnJvbSBcIi4vQ2FtcGFpZ25JbmZvXCI7XG5pbXBvcnQgeyBFdmVudFBheWxvYWQsIElFdmVudCB9IGZyb20gXCIuL0V2ZW50XCI7XG5cbmltcG9ydCB7IEF0dGFjaG1lbnRPcGVuIH0gZnJvbSBcIi4vZXZlbnRzL0F0dGFjaG1lbnRPcGVuXCI7XG5pbXBvcnQgeyBDbGljayB9IGZyb20gXCIuL2V2ZW50cy9DbGlja1wiO1xuaW1wb3J0IHsgRG93bmxvYWQgfSBmcm9tIFwiLi9ldmVudHMvRG93bmxvYWRcIjtcbmltcG9ydCB7IEZpbGVPcGVuIH0gZnJvbSBcIi4vZXZlbnRzL0ZpbGVPcGVuXCI7XG5pbXBvcnQgeyBJbnB1dCB9IGZyb20gXCIuL2V2ZW50cy9JbnB1dFwiO1xuaW1wb3J0IHsgUGFnZUxvYWRlZCB9IGZyb20gXCIuL2V2ZW50cy9QYWdlTG9hZGVkXCI7XG5pbXBvcnQgeyBQYWdlUmVhZCB9IGZyb20gXCIuL2V2ZW50cy9QYWdlUmVhZFwiO1xuaW1wb3J0IHsgU3VibWl0IH0gZnJvbSBcIi4vZXZlbnRzL1N1Ym1pdFwiO1xuXG5pbXBvcnQgUmVtb3RlIGZyb20gXCIuL1JlbW90ZVwiO1xuaW1wb3J0IHsgY3JlYXRlVVVJRCB9IGZyb20gXCIuL1Rvb2xzXCI7XG5cbmV4cG9ydCBjbGFzcyBNYW5hZ2VyIHtcblx0cHJpdmF0ZSByZWFkb25seSBzdXBwb3J0ZWRUeXBlcyA6IHN0cmluZ1tdID0gW1wiZW1haWxcIiwgXCJwYXNzd29yZFwiLCBcInRlbFwiXTtcblx0cHJpdmF0ZSByZWFkb25seSBzdXBwb3J0ZWRFdmVudHMgPSB7XCJhdHRhY2htZW50X29wZW5lZFwiOiBBdHRhY2htZW50T3BlbiwgXCJjbGlja1wiOiBDbGljaywgXCJkb3dubG9hZFwiOiBEb3dubG9hZCwgXCJmaWxlX29wZW5cIjogRmlsZU9wZW4sIFwiaW5wdXRcIjogSW5wdXQsIFwicGFnZV9sb2FkZWRcIjogUGFnZUxvYWRlZCwgXCJwYWdlX3JlYWRcIjogUGFnZVJlYWQsIFwic3VibWl0XCI6IFN1Ym1pdCwgfTtcblxuXHRwcml2YXRlIHJlYWRvbmx5IGJyb3dzZXJJbmZvOiBCcm93c2VySW5mbztcblx0cHJpdmF0ZSByZWFkb25seSBjYW1wYWlnbkluZm86IENhbXBhaWduSW5mbztcblx0cHJpdmF0ZSByZWFkb25seSBkZWJ1ZzogYm9vbGVhbiA9IGZhbHNlO1xuXHRwcml2YXRlIHJlYWRvbmx5IHJlZGlyZWN0VXJsOiBzdHJpbmc7XG5cdHByaXZhdGUgcmVhZG9ubHkgc2hvdWxkUmVkaXJlY3Q6IGJvb2xlYW47XG5cdHByaXZhdGUgcmVhZG9ubHkgcmVtb3RlOiBSZW1vdGU7XG5cdHByaXZhdGUgcmVhZG9ubHkgc291cmNlOiBzdHJpbmc7XG5cdHByaXZhdGUgcmVhZG9ubHkgdG9rZW46IHN0cmluZztcblxuXHRwcml2YXRlIGhhbmRsZXJzID0gW107XG5cdHByaXZhdGUgZGlzYWJsZWRFdmVudHMgPSBbXTtcblxuXHRyZW1vdGVFdmVudHM6IElFdmVudFtdO1xuXG5cdGNvbnN0cnVjdG9yKHJlbW90ZTogUmVtb3RlLCBldmVudE5hbWVzOiBzdHJpbmdbXSwgc291cmNlOiBzdHJpbmcsIHJlZGlyZWN0VXJsOiBzdHJpbmcsIHNob3VsZFJlZGlyZWN0OiBib29sZWFuLCBkZWJ1ZyA9IGZhbHNlKSB7XG5cdFx0dGhpcy5yZW1vdGUgPSByZW1vdGU7XG5cdFx0W3RoaXMudG9rZW4sIHRoaXMuY2FtcGFpZ25JbmZvXSA9IGZpbmRDYW1wYWlnbkluZm8oKTtcblx0XHR0aGlzLmJyb3dzZXJJbmZvID0gZmluZEJyb3dzZXJJbmZvKCk7XG5cblx0XHRpZiAoIWV2ZW50TmFtZXMubGVuZ3RoKSB7XG5cdFx0XHRldmVudE5hbWVzID0gT2JqZWN0LmtleXModGhpcy5zdXBwb3J0ZWRFdmVudHMpO1xuXHRcdH1cblxuXHRcdHRoaXMucmVtb3RlRXZlbnRzID0gZXZlbnROYW1lcy5tYXAobmFtZSA9PiB0aGlzLmdldEV2ZW50KG5hbWUpKTtcblx0XHR0aGlzLnNvdXJjZSA9IHNvdXJjZTtcblx0XHR0aGlzLnJlZGlyZWN0VXJsID0gcmVkaXJlY3RVcmw7XG5cdFx0dGhpcy5zaG91bGRSZWRpcmVjdCA9IHNob3VsZFJlZGlyZWN0O1xuXHRcdHRoaXMuZGVidWcgPSBkZWJ1ZztcblxuXHRcdGlmICh0aGlzLmNhbXBhaWduSW5mby5kb3dubG9hZF90eXBlKSB7XG5cdFx0XHR0aGlzLmNoZWNrRG93bmxvYWQoKTtcblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIGNoZWNrRG93bmxvYWQoKSB7XG5cdFx0c3dpdGNoICh0aGlzLmNhbXBhaWduSW5mby5kb3dubG9hZF90eXBlKSB7XG5cdFx0Y2FzZSBcImZpbGVcIjpcblx0XHRcdHJldHVybiB0aGlzLnRyaWdnZXIoXCJmaWxlX29wZW5lZFwiKTtcblx0XHRjYXNlIFwiYXR0YWNobWVudFwiOlxuXHRcdFx0cmV0dXJuIHRoaXMudHJpZ2dlcihcImF0dGFjaG1lbnRfb3BlbmVkXCIpO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgZ2V0RXZlbnQobmFtZTogc3RyaW5nKSB7XG5cdFx0cmV0dXJuIG5ldyAodGhpcy5zdXBwb3J0ZWRFdmVudHNbbmFtZV0pO1xuXHR9XG5cblx0bGlzdGVuKCkge1xuXHRcdGxldCBpID0gMDtcblx0XHRmb3IoY29uc3QgcmVtb3RlRXZlbnQgb2YgdGhpcy5yZW1vdGVFdmVudHMpIHtcblx0XHRcdGlmKHRoaXMuZGVidWcpIHtcblx0XHRcdFx0Y29uc29sZS5sb2coYExpc3RlbmluZyBmb3IgZXZlbnQgQCR7cmVtb3RlRXZlbnQudHJpZ2dlcn0gKCR7cmVtb3RlRXZlbnQubmFtZX0pYCk7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IHRhcmdldHMgPSByZW1vdGVFdmVudC50YXJnZXRzO1xuXHRcdFx0Zm9yKGNvbnN0IHRhcmdldCBvZiB0YXJnZXRzKSB7XG5cdFx0XHRcdHRhcmdldC5hZGRFdmVudExpc3RlbmVyKHJlbW90ZUV2ZW50LnRyaWdnZXIsIHRoaXMuaGFuZGxlcnNbaSsrXSA9IGV2ZW50ID0+IHRoaXMuaGFuZGxlKHJlbW90ZUV2ZW50LCBldmVudCkpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHN0b3AoKSB7XG5cdFx0bGV0IGkgPSAwO1xuXHRcdGZvcihjb25zdCByZW1vdGVFdmVudCBvZiB0aGlzLnJlbW90ZUV2ZW50cykge1xuXHRcdFx0aWYodGhpcy5kZWJ1Zykge1xuXHRcdFx0XHRjb25zb2xlLmxvZyhgU3RvcHBpbmcgbGlzdGVuaW5nIGZvciBldmVudCBAJHtyZW1vdGVFdmVudC50cmlnZ2VyfSAoJHtyZW1vdGVFdmVudC5uYW1lfSlgKTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgdGFyZ2V0cyA9IHJlbW90ZUV2ZW50LnRhcmdldHM7XG5cdFx0XHRmb3IoY29uc3QgdGFyZ2V0IG9mIHRhcmdldHMpIHtcblx0XHRcdFx0dGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIocmVtb3RlRXZlbnQudHJpZ2dlciwgdGhpcy5oYW5kbGVyc1tpKytdKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIGZpbmRUeXBlKHJlbW90ZUV2ZW50OiBJRXZlbnQsIGV2ZW50PzogRXZlbnQpOiBzdHJpbmcgfCBudWxsIHtcblx0XHRpZiAoIXJlbW90ZUV2ZW50Lmhhc1R5cGVzIHx8ICFldmVudCkge1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXG5cdFx0Y29uc3QgaW5wdXRFbGVtZW50ID0gZXZlbnQuY3VycmVudFRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50O1xuXG5cdFx0aWYgKHRoaXMuc3VwcG9ydGVkVHlwZXMuaW5kZXhPZihpbnB1dEVsZW1lbnQudHlwZSkgIT09IC0xKSB7XG5cdFx0XHRyZXR1cm4gaW5wdXRFbGVtZW50LnR5cGU7XG5cdFx0fVxuXG5cdFx0aWYgKGlucHV0RWxlbWVudC5kYXRhc2V0LnR5cGUpIHtcblx0XHRcdHJldHVybiBpbnB1dEVsZW1lbnQuZGF0YXNldC50eXBlO1xuXHRcdH1cblxuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cblx0cHJpdmF0ZSBwYWNrRXZlbnQodHlwZSwgcmVtb3RlRXZlbnQ6IElFdmVudCk6IEV2ZW50UGF5bG9hZCB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdFwiZGF0YVwiOiB7XG5cdFx0XHRcdC4uLnRoaXMuYnJvd3NlckluZm8sXG5cdFx0XHRcdHR5cGUsXG5cdFx0XHR9LFxuXHRcdFx0XCJzb3VyY2VcIjogdGhpcy5zb3VyY2UsXG5cdFx0XHRcInRpbWVzdGFtcFwiOiBNYXRoLmZsb29yKERhdGUubm93KCkgLyAxMDAwKSxcblx0XHRcdFwiYXRzX2hlYWRlclwiOiB0aGlzLnRva2VuLFxuXHRcdFx0XCJldmVudFwiOiByZW1vdGVFdmVudC5uYW1lLnRvTG93ZXJDYXNlKCksXG5cdFx0XHRcInNnX2V2ZW50X2lkXCI6IGNyZWF0ZVVVSUQoKSxcblx0XHRcdFwic2dfbWVzc2FnZV9pZFwiOiB0aGlzLmNhbXBhaWduSW5mby5hdHNfaW5zdGFuY2VfaWQsXG5cdFx0fTtcblx0fVxuXG5cdHRyaWdnZXIoZXZlbnROYW1lOiBzdHJpbmcpIHtcblx0XHRjb25zdCByZW1vdGVFdmVudCA9IHRoaXMuZ2V0RXZlbnQoZXZlbnROYW1lKTtcblx0XHRpZiAoIXJlbW90ZUV2ZW50KSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIGV2ZW50ICR7ZXZlbnROYW1lfS4gUGxlYXNlIGNob29zZSBvbmUgb2YgJHtPYmplY3Qua2V5cyh0aGlzLnN1cHBvcnRlZEV2ZW50cykuam9pbihcIiwgXCIpfWApO1xuXHRcdH1cblx0XHR0aGlzLmhhbmRsZShyZW1vdGVFdmVudCk7XG5cdH1cblxuXHRwcml2YXRlIGhhbmRsZShyZW1vdGVFdmVudDogSUV2ZW50LCBldmVudD86IEV2ZW50KSB7XG5cdFx0aWYgKHRoaXMuZGVidWcpIHtcblx0XHRcdGNvbnNvbGUubG9nKGBFdmVudCBAJHtyZW1vdGVFdmVudC50cmlnZ2VyfSAoJHtyZW1vdGVFdmVudC5uYW1lfSkgdHJpZ2dlcmVkLi4uYCk7XG5cdFx0fVxuXG5cdFx0aWYgKGV2ZW50ICYmIHJlbW90ZUV2ZW50LmlzQmxvY2tpbmcpIHtcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRcdGV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdH1cblxuXHRcdGlmICghcmVtb3RlRXZlbnQuYWxsb3dNdWx0aXBsZSkge1xuXHRcdFx0aWYgKHRoaXMuZGlzYWJsZWRFdmVudHMuaW5jbHVkZXMocmVtb3RlRXZlbnQubmFtZSkpIHtcblx0XHRcdFx0aWYgKHRoaXMuZGVidWcpIHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhgUHJldmVudGluZyBkdXBsaWNhdGUgZXZlbnQgQCR7cmVtb3RlRXZlbnQudHJpZ2dlcn0gKCR7cmVtb3RlRXZlbnQubmFtZX0pLmApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdHRoaXMuZGlzYWJsZWRFdmVudHMucHVzaChyZW1vdGVFdmVudC5uYW1lKTtcblx0XHR9XG5cblx0XHRjb25zdCB0eXBlID0gdGhpcy5maW5kVHlwZShyZW1vdGVFdmVudCwgZXZlbnQpO1xuXHRcdGNvbnN0IHBheWxvYWQgPSB0aGlzLnBhY2tFdmVudCh0eXBlLCByZW1vdGVFdmVudCk7XG5cdFx0dGhpcy5yZW1vdGUucG9zdChwYXlsb2FkKVxuXHRcdFx0LnRoZW4ocmVzdWx0ID0+IHtcblx0XHRcdFx0aWYgKHRoaXMuZGVidWcpIHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhyZXN1bHQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LmNhdGNoKGUgPT4ge2lmKHRoaXMuZGVidWcpIHsgY29uc29sZS5lcnJvcihlKTsgfX0pXG5cdFx0XHQuZmluYWxseSgoKSA9PiB7XG5cdFx0XHRcdGlmIChyZW1vdGVFdmVudC5yZWRpcmVjdE9uRmluaXNoICYmIHRoaXMuc2hvdWxkUmVkaXJlY3QpIHtcblx0XHRcdFx0XHR3aW5kb3cubG9jYXRpb24uaHJlZiA9IGAke3RoaXMucmVkaXJlY3RVcmx9JHt3aW5kb3cubG9jYXRpb24uc2VhcmNofWA7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHR9XG59XG4iLCJpbXBvcnQgeyBFdmVudFBheWxvYWQgfSBmcm9tIFwiLi9FdmVudFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZW1vdGUge1xuXHRwcml2YXRlIGFwaV9rZXk6IHN0cmluZztcblx0cHJpdmF0ZSB1cmw6IHN0cmluZztcblx0cHJpdmF0ZSBkZWJ1ZzogYm9vbGVhbjtcblxuXHRjb25zdHJ1Y3RvcihhcGlfa2V5OiBzdHJpbmcsIHVybDogc3RyaW5nLCBkZWJ1ZzogYm9vbGVhbikge1xuXHRcdHRoaXMuYXBpX2tleSA9IGFwaV9rZXk7XG5cdFx0dGhpcy51cmwgPSB1cmw7XG5cdFx0dGhpcy5kZWJ1ZyA9IGRlYnVnO1xuXHR9XG5cblx0cHVibGljIHBvc3QoZGF0YTogRXZlbnRQYXlsb2FkKTogUHJvbWlzZTxvYmplY3Q+IHtcblx0XHRpZiAodGhpcy5kZWJ1Zykge1xuXHRcdFx0Y29uc29sZS5sb2coYFNlbmRpbmcgZXZlbnQgdG8gJHt0aGlzLnVybH0gd2l0aCBkYXRhOmApO1xuXHRcdFx0Y29uc29sZS50YWJsZShkYXRhKTtcblx0XHR9XG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdGNvbnN0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXHRcdFx0eGhyLm9wZW4oXCJQT1NUXCIsIHRoaXMudXJsLCB0cnVlKTtcblx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC10eXBlXCIsIFwiYXBwbGljYXRpb24vanNvblwiKTtcblx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiYXBpLWtleVwiLCB0aGlzLmFwaV9rZXkpO1xuXG5cdFx0XHR4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRpZiAoeGhyLnJlYWR5U3RhdGUgPT09IDQgJiYgeGhyLnN0YXR1cyA9PT0gMjAwKSB7XG5cdFx0XHRcdFx0aWYgKHhoci5yZXNwb25zZVRleHQpIHtcblx0XHRcdFx0XHRcdGNvbnN0IGpzb24gPSBKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpO1xuXHRcdFx0XHRcdFx0cmVzb2x2ZShqc29uKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0cmVzb2x2ZSh7fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0XHR4aHIub25lcnJvciA9IGZ1bmN0aW9uKGUpIHtcblx0XHRcdFx0cmVqZWN0KGUpO1xuXHRcdFx0fTtcblxuXHRcdFx0eGhyLnNlbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuXHRcdH0pO1xuXHR9XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gY3JlYXRlVVVJRCgpIHtcblx0Ly8gaHR0cDovL3d3dy5pZXRmLm9yZy9yZmMvcmZjNDEyMi50eHRcblx0Y29uc3QgczogYW55W10gPSBbXTtcblx0Y29uc3QgaGV4RGlnaXRzID0gXCIwMTIzNDU2Nzg5YWJjZGVmXCI7XG5cdGZvciAobGV0IGkgPSAwOyBpIDwgMzY7IGkrKykge1xuXHRcdHNbaV0gPSBoZXhEaWdpdHMuc3Vic3RyKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDB4MTApLCAxKTtcblx0fVxuXHRzWzE0XSA9IFwiNFwiOyAgLy8gYml0cyAxMi0xNSBvZiB0aGUgdGltZV9oaV9hbmRfdmVyc2lvbiBmaWVsZCB0byAwMDEwXG5cdHNbMTldID0gaGV4RGlnaXRzLnN1YnN0cigoc1sxOV0gJiAweDMpIHwgMHg4LCAxKTsgIC8vIGJpdHMgNi03IG9mIHRoZSBjbG9ja19zZXFfaGlfYW5kX3Jlc2VydmVkIHRvIDAxXG5cdHNbOF0gPSBzWzEzXSA9IHNbMThdID0gc1syM10gPSBcIi1cIjtcblxuXHRyZXR1cm4gcy5qb2luKFwiXCIpO1xufVxuXG5jb25zdCBmaXJzdFRMRHMgPSBcImFjfGFkfGFlfGFmfGFnfGFpfGFsfGFtfGFufGFvfGFxfGFyfGFzfGF0fGF1fGF3fGF4fGF6fGJhfGJifGJlfGJmfGJnfGJofGJpfGJqfGJtfGJvfGJyfGJzfGJ0fGJ2fGJ3fGJ5fGJ6fGNhfGNjfGNkfGNmfGNnfGNofGNpfGNsfGNtfGNufGNvfGNyfGN1fGN2fGN3fGN4fGN6fGRlfGRqfGRrfGRtfGRvfGR6fGVjfGVlfGVnfGVzfGV0fGV1fGZpfGZtfGZvfGZyfGdhfGdifGdkfGdlfGdmfGdnfGdofGdpfGdsfGdtfGdufGdwfGdxfGdyfGdzfGd0fGd3fGd5fGhrfGhtfGhufGhyfGh0fGh1fGlkfGllfGlsfGltfGlufGlvfGlxfGlyfGlzfGl0fGplfGpvfGpwfGtnfGtpfGttfGtufGtwfGtyfGt5fGt6fGxhfGxifGxjfGxpfGxrfGxyfGxzfGx0fGx1fGx2fGx5fG1hfG1jfG1kfG1lfG1nfG1ofG1rfG1sfG1ufG1vfG1wfG1xfG1yfG1zfG10fG11fG12fG13fG14fG15fG5hfG5jfG5lfG5mfG5nfG5sfG5vfG5yfG51fG56fG9tfHBhfHBlfHBmfHBofHBrfHBsfHBtfHBufHByfHBzfHB0fHB3fHB5fHFhfHJlfHJvfHJzfHJ1fHJ3fHNhfHNifHNjfHNkfHNlfHNnfHNofHNpfHNqfHNrfHNsfHNtfHNufHNvfHNyfHN0fHN1fHN2fHN4fHN5fHN6fHRjfHRkfHRmfHRnfHRofHRqfHRrfHRsfHRtfHRufHRvfHRwfHRyfHR0fHR2fHR3fHR6fHVhfHVnfHVrfHVzfHV5fHV6fHZhfHZjfHZlfHZnfHZpfHZufHZ1fHdmfHdzfHl0XCIuc3BsaXQoXCJ8XCIpO1xuXG5jb25zdCBzZWNvbmRUTERzID0gXCJjb218ZWR1fGdvdnxuZXR8bWlsfG9yZ3xub218c2NofGNhYXxyZXN8b2ZmfGdvYnxpbnR8dHVyfGlwNnx1cml8dXJufGFzbnxhY3R8bnN3fHFsZHx0YXN8dmljfHByb3xiaXp8YWRtfGFkdnxhZ3J8YXJxfGFydHxhdG98YmlvfGJtZHxjaW18Y25nfGNudHxlY258ZWNvfGVtcHxlbmd8ZXNwfGV0Y3xldGl8ZmFyfGZuZHxmb3R8ZnN0fGcxMnxnZ2Z8aW1ifGluZHxpbmZ8am9yfGp1c3xsZWd8bGVsfG1hdHxtZWR8bXVzfG5vdHxudHJ8b2RvfHBwZ3xwc2N8cHNpfHFzbHxyZWN8c2xnfHNydnx0ZW98dG1wfHRyZHx2ZXR8emxnfHdlYnxsdGR8c2xkfHBvbHxmaW58azEyfGxpYnxwcml8YWlwfGZpZXxldW58c2NpfHByZHxjY2l8cHZ0fG1vZHxpZHZ8cmVsfHNleHxnZW58bmljfGFicnxiYXN8Y2FsfGNhbXxlbXJ8ZnZnfGxhenxsaWd8bG9tfG1hcnxtb2x8cG1ufHB1Z3xzYXJ8c2ljfHRhYXx0b3N8dW1ifHZhb3x2ZGF8dmVufG1pZXzljJfmtbfpgZN85ZKM5q2M5bGxfOelnuWliOW3nXzpub/lhZDls7Z8YXNzfHJlcHx0cmF8cGVyfG5nb3xzb2N8Z3JwfHBsY3xpdHN8YWlyfGFuZHxidXN8Y2FufGRkcnxqZmt8bWFkfG5yd3xueWN8c2tpfHNweXx0Y218dWxtfHVzYXx3YXJ8ZmhzfHZnc3xkZXB8ZWlkfGZldHxmbGF8ZmzDpXxnb2x8aG9mfGhvbHxzZWx8dmlrfGNyaXxpd2l8aW5nfGFib3xmYW18Z29rfGdvbnxnb3B8Z29zfGFpZHxhdG18Z3NtfHNvc3xlbGt8d2F3fGVzdHxhY2F8YmFyfGNwYXxqdXJ8bGF3fHNlY3xwbG98d3d3fGJpcnxjYmd8amFyfGtodnxtc2t8bm92fG5za3xwdHp8cm5kfHNwYnxzdHZ8dG9tfHRza3x1ZG18dnJufGNtd3xrbXN8bmt6fHNuenxwdWJ8Zmh2fHJlZHxlbnN8bmF0fHJuc3xybnV8YmJzfHRlbHxiZWx8a2VwfG5oc3xkbml8ZmVkfGlzYXxuc258Z3VifGUxMnx0ZWN80L7RgNCzfNC+0LHRgHzRg9C/0YB8YWx0fG5pc3xqcG58bWV4fGF0aHxpa2l8bmlkfGdkYXxpbmNcIi5zcGxpdChcInxcIik7XG5cbmNvbnN0IGtub3duU3ViZG9tYWlucyA9IFwid3d3fHN0dWRpb3xtYWlsfHJlbW90ZXxibG9nfHdlYm1haWx8c2VydmVyfG5zMXxuczJ8c210cHxzZWN1cmV8dnBufG18c2hvcHxmdHB8bWFpbDJ8dGVzdHxwb3J0YWx8bnN8d3cxfGhvc3R8c3VwcG9ydHxkZXZ8d2VifGJic3x3dzQyfHNxdWF0dGVyfG14fGVtYWlsfDF8bWFpbDF8Mnxmb3J1bXxvd2F8d3d3Mnxnd3xhZG1pbnxzdG9yZXxteDF8Y2RufGFwaXxleGNoYW5nZXxhcHB8Z292fDJ0dHl8dnBzfGdvdnl0eXxoZ2ZnZGZ8bmV3c3wxcmVyfGxramt1aVwiO1xuXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlU3ViZG9tYWluKHM6IHN0cmluZykge1xuXHRjb25zdCBrbm93blN1YmRvbWFpbnNSZWdFeHAgPSBuZXcgUmVnRXhwKGBeKCR7a25vd25TdWJkb21haW5zfSkuYCwgXCJpXCIpO1xuXHRzID0gcy5yZXBsYWNlKGtub3duU3ViZG9tYWluc1JlZ0V4cCwgXCJcIik7XG5cblx0Y29uc3QgcGFydHMgPSBzLnNwbGl0KFwiLlwiKTtcblxuXHR3aGlsZSAocGFydHMubGVuZ3RoID4gMykge1xuXHRcdHBhcnRzLnNoaWZ0KCk7XG5cdH1cblxuXHRpZiAocGFydHMubGVuZ3RoID09PSAzICYmICgocGFydHNbMV0ubGVuZ3RoID4gMiAmJiBwYXJ0c1syXS5sZW5ndGggPiAyKSB8fCAoc2Vjb25kVExEcy5pbmRleE9mKHBhcnRzWzFdKSA9PT0gLTEpICYmIGZpcnN0VExEcy5pbmRleE9mKHBhcnRzWzJdKSA9PT0gLTEpKSB7XG5cdFx0cGFydHMuc2hpZnQoKTtcblx0fVxuXG5cdHJldHVybiBwYXJ0cy5qb2luKFwiLlwiKTtcbn0iLCJpbnRlcmZhY2UgUGFyYW1ldGVyTWFwIHtcbiAgICBbczogc3RyaW5nXTogYW55XG59XG5leHBvcnQgY2xhc3MgVXJsUGFyc2VyIHtcblxuXHRwcml2YXRlIHBhcmFtZXRlcnM6IFBhcmFtZXRlck1hcDtcblx0cHVibGljIHJlYWRvbmx5IHByb3RvY29sOiBzdHJpbmc7XG5cdHB1YmxpYyByZWFkb25seSBob3N0OiBzdHJpbmc7XG5cdHB1YmxpYyByZWFkb25seSBob3N0bmFtZTogc3RyaW5nO1xuXHRwdWJsaWMgcmVhZG9ubHkgcG9ydDogc3RyaW5nO1xuXHRwdWJsaWMgcmVhZG9ubHkgcGF0aG5hbWU6IHN0cmluZztcblx0cHVibGljIHJlYWRvbmx5IGhhc2g6IHN0cmluZztcblx0cHVibGljIHJlYWRvbmx5IHNlYXJjaDogc3RyaW5nO1xuXG5cdGNvbnN0cnVjdG9yKHByaXZhdGUgdXJsOnN0cmluZykge1xuXHRcdGNvbnN0IHBhcnNlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xuXHRcdHBhcnNlci5ocmVmID0gdXJsO1xuXG5cdFx0dGhpcy5wcm90b2NvbCA9IHBhcnNlci5wcm90b2NvbDsgLy8gPT4gXCJodHRwOlwiXG5cdFx0dGhpcy5ob3N0ID0gcGFyc2VyLmhvc3Q7ICAgICAvLyA9PiBcImV4YW1wbGUuY29tOjMwMDBcIlxuXHRcdHRoaXMuaG9zdG5hbWUgPSBwYXJzZXIuaG9zdG5hbWU7IC8vID0+IFwiZXhhbXBsZS5jb21cIlxuXHRcdHRoaXMucG9ydCA9IHBhcnNlci5wb3J0OyAgICAgLy8gPT4gXCIzMDAwXCJcblx0XHR0aGlzLnBhdGhuYW1lID0gcGFyc2VyLnBhdGhuYW1lOyAvLyA9PiBcIi9wYXRobmFtZS9cIlxuXHRcdHRoaXMuaGFzaCA9IHBhcnNlci5oYXNoOyAgICAgLy8gPT4gXCIjaGFzaFwiXG5cdFx0dGhpcy5zZWFyY2ggPSBwYXJzZXIuc2VhcmNoLnN1YnN0cigxKTsgICAvLyA9PiBcIj9zZWFyY2g9dGVzdFwiXG5cblx0XHR0aGlzLnBhcnNlUGFyYW1ldGVycygpO1xuXHR9XG5cblx0cHJpdmF0ZSBwYXJzZVBhcmFtZXRlcnMoKSB7XG5cdFx0dGhpcy5wYXJhbWV0ZXJzID0ge307XG5cblx0XHRjb25zdCBwYXJhbXNHcm91cCA9IHRoaXMuc2VhcmNoLnNwbGl0KFwiJlwiKTtcblx0XHRmb3IoY29uc3QgcGFyYW0gb2YgcGFyYW1zR3JvdXApIHtcblx0XHRcdGNvbnN0IFtrZXksIHZhbHVlXSA9IHBhcmFtLnNwbGl0KFwiPVwiKTtcblx0XHRcdHRoaXMucGFyYW1ldGVyc1trZXldID0gdmFsdWU7XG5cdFx0fVxuXHR9XG5cblx0cHVibGljIGZpbmRQYXJhbShwYXJhbTogc3RyaW5nKSA6IGFueSB7XG5cdFx0cmV0dXJuIHRoaXMucGFyYW1ldGVyc1twYXJhbV0gfHwgbnVsbDtcblx0fVxuXG59IiwiaW1wb3J0IHsgSUV2ZW50IH0gZnJvbSBcIi4uL0V2ZW50XCI7XG5cbmV4cG9ydCBjbGFzcyBBdHRhY2htZW50T3BlbiBpbXBsZW1lbnRzIElFdmVudCB7XG5cdGdldCByZWRpcmVjdE9uRmluaXNoKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRnZXQgdHJpZ2dlcigpOiBzdHJpbmcge1xuXHRcdHJldHVybiBcIlwiO1xuXHR9XG5cdGdldCBuYW1lKCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIFwiYXR0YWNobWVudF9vcGVuZWRcIjtcblx0fVxuXHRnZXQgaGFzVHlwZXMoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCB0YXJnZXRzKCk6IEVsZW1lbnRbXSB7XG5cdFx0cmV0dXJuIFtdO1xuXHR9XG5cdGNoZWNrRXZlbnQoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblx0Z2V0IGlzQmxvY2tpbmcoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cbn1cbiIsImltcG9ydCB7IElFdmVudCB9IGZyb20gXCIuLi9FdmVudFwiO1xuXG5leHBvcnQgY2xhc3MgQ2xpY2sgaW1wbGVtZW50cyBJRXZlbnQge1xuXHRnZXQgcmVkaXJlY3RPbkZpbmlzaCgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXHRnZXQgdHJpZ2dlcigpOiBzdHJpbmcge1xuXHRcdHJldHVybiBcImNsaWNrXCI7XG5cdH1cblx0Z2V0IG5hbWUoKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gXCJwYWdlX2xlZnRcIjtcblx0fVxuXHRnZXQgaGFzVHlwZXMoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblx0Z2V0IHRhcmdldHMoKTogRWxlbWVudFtdIHtcblx0XHRjb25zdCBlbGVtZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJhOm5vdChbaHJlZiQ9Jy5leGUnXSksYnV0dG9uOm5vdChbdHlwZT1zdWJtaXRdKSxpbnB1dFt0eXBlPWJ1dHRvbl1cIik7XG5cdFx0cmV0dXJuIFsuLi5lbGVtZW50c10uZmlsdGVyKGVsZW1lbnQgPT4gIWVsZW1lbnQuaGFzQXR0cmlidXRlKFwiaWdub3JlXCIpKTtcblx0fVxuXHRjaGVja0V2ZW50KGV2ZW50OiBhbnkpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZXZlbnQud2hpY2ggJiYgZXZlbnQuaXNUcnVzdGVkICYmIGV2ZW50LnNjcmVlblggJiYgZXZlbnQuc2NyZWVuWCAhPSAwICYmIGV2ZW50LnNjcmVlblkgJiYgZXZlbnQuc2NyZWVuWSAhPSAwO1xuXHR9XG5cdGdldCBpc0Jsb2NraW5nKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG59XG4iLCJpbXBvcnQgeyBJRXZlbnQgfSBmcm9tIFwiLi4vRXZlbnRcIjtcblxuZXhwb3J0IGNsYXNzIERvd25sb2FkIGltcGxlbWVudHMgSUV2ZW50IHtcblx0Z2V0IHJlZGlyZWN0T25GaW5pc2goKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblx0Z2V0IHRyaWdnZXIoKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gXCJjbGlja1wiO1xuXHR9XG5cdGdldCBuYW1lKCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIFwiZG93bmxvYWRfZmlsZV9ldmVudFwiO1xuXHR9XG5cdGdldCBoYXNUeXBlcygpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXHRnZXQgdGFyZ2V0cygpOiBFbGVtZW50W10ge1xuXHRcdGNvbnN0IGVsZW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcImFbaHJlZiQ9Jy5leGUnXVwiKTtcblx0XHRyZXR1cm4gWy4uLmVsZW1lbnRzXS5maWx0ZXIoZWxlbWVudCA9PiAhZWxlbWVudC5oYXNBdHRyaWJ1dGUoXCJpZ25vcmVcIikpO1xuXHR9XG5cdGNoZWNrRXZlbnQoZXZlbnQ6IGFueSk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBldmVudC53aGljaCAmJiBldmVudC5pc1RydXN0ZWQgJiYgZXZlbnQuc2NyZWVuWCAmJiBldmVudC5zY3JlZW5YICE9IDAgJiYgZXZlbnQuc2NyZWVuWSAmJiBldmVudC5zY3JlZW5ZICE9IDA7XG5cdH1cblx0Z2V0IGlzQmxvY2tpbmcoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cbn1cbiIsImltcG9ydCB7IElFdmVudCB9IGZyb20gXCIuLi9FdmVudFwiO1xuXG5leHBvcnQgY2xhc3MgRmlsZU9wZW4gaW1wbGVtZW50cyBJRXZlbnQge1xuXHRnZXQgcmVkaXJlY3RPbkZpbmlzaCgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0Z2V0IHRyaWdnZXIoKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gXCJcIjtcblx0fVxuXHRnZXQgbmFtZSgpOiBzdHJpbmcge1xuXHRcdHJldHVybiBcImZpbGVfb3BlbmVkXCI7XG5cdH1cblx0Z2V0IGhhc1R5cGVzKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRnZXQgdGFyZ2V0cygpOiBFbGVtZW50W10ge1xuXHRcdHJldHVybiBbXTtcblx0fVxuXHRjaGVja0V2ZW50KCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdGdldCBpc0Jsb2NraW5nKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG59XG4iLCJpbXBvcnQgeyBJRXZlbnQgfSBmcm9tIFwiLi4vRXZlbnRcIjtcblxuZXhwb3J0IGNsYXNzIElucHV0IGltcGxlbWVudHMgSUV2ZW50IHtcblx0Z2V0IHJlZGlyZWN0T25GaW5pc2goKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCB0cmlnZ2VyKCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIFwiaW5wdXRcIjtcblx0fVxuXHRnZXQgbmFtZSgpOiBzdHJpbmcge1xuXHRcdHJldHVybiBcImlucHV0X2ZpbGxlZFwiO1xuXHR9XG5cdGdldCBoYXNUeXBlcygpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXHRnZXQgdGFyZ2V0cygpOiBFbGVtZW50W10ge1xuXHRcdGNvbnN0IGVsZW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcInNlbGVjdCx0ZXh0YXJlYSxpbnB1dFwiKTtcblx0XHRyZXR1cm4gWy4uLmVsZW1lbnRzXS5maWx0ZXIoZWxlbWVudCA9PiAhZWxlbWVudC5oYXNBdHRyaWJ1dGUoXCJpZ25vcmVcIikpO1xuXHR9XG5cblx0Y2hlY2tFdmVudChldmVudDogSW5wdXRFdmVudCk6IGJvb2xlYW4ge1xuXHRcdGNvbnN0IGlucHV0ID0gZXZlbnQudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG5cdFx0cmV0dXJuICEhaW5wdXQudmFsdWUudHJpbSgpO1xuXHR9XG5cdGdldCBpc0Jsb2NraW5nKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxufVxuIiwiaW1wb3J0IHsgSUV2ZW50IH0gZnJvbSBcIi4uL0V2ZW50XCI7XG5cbmV4cG9ydCBjbGFzcyBQYWdlTG9hZGVkIGltcGxlbWVudHMgSUV2ZW50IHtcblx0Z2V0IHJlZGlyZWN0T25GaW5pc2goKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCB0cmlnZ2VyKCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIFwibG9hZFwiO1xuXHR9XG5cdGdldCBuYW1lKCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIFwicGFnZV9sb2FkZWRcIjtcblx0fVxuXHRnZXQgaGFzVHlwZXMoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCB0YXJnZXRzKCk6IChFbGVtZW50fFdpbmRvdylbXSB7XG5cdFx0cmV0dXJuIFt3aW5kb3ddO1xuXHR9XG5cdGNoZWNrRXZlbnQoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblx0Z2V0IGlzQmxvY2tpbmcoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59XG4iLCJpbXBvcnQgeyBJRXZlbnQgfSBmcm9tIFwiLi4vRXZlbnRcIjtcblxuZXhwb3J0IGNsYXNzIFBhZ2VSZWFkIGltcGxlbWVudHMgSUV2ZW50IHtcblx0cHJpdmF0ZSBtaW5TY3JvbGxQZXJjZW50YWdlID0gNzU7XG5cdHByaXZhdGUgbWluU3RheVNlY29uZHMgPSA2MCoxMDAwO1xuXHRwcml2YXRlIGhhc1Njcm9sbGVkID0gZmFsc2U7XG5cdHByaXZhdGUgaGFzU3RheWVkID0gZmFsc2U7XG5cdHByaXZhdGUgY3VzdG9tRXZlbnQ6IEV2ZW50O1xuXHRwcml2YXRlIHRpbWVvdXQ6IGFueTtcblxuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHR0aGlzLmN1c3RvbUV2ZW50ID0gbmV3IEV2ZW50KHRoaXMudHJpZ2dlcik7XG5cdFx0dGhpcy5lbmFibGUoKTtcblx0fVxuXG5cdHByaXZhdGUgZW5hYmxlKCkge1xuXHRcdHdpbmRvdy5vbnNjcm9sbCA9ICgpID0+IHRoaXMuc2Nyb2xsZWQoKTtcblx0XHR0aGlzLmRldGVjdEZvY3VzKCk7XG5cdFx0dGhpcy5kZXRlY3RWaXNpYmlsaXR5KCk7XG5cdFx0dGhpcy5zY3JvbGxlZCgpO1xuXHRcdHRoaXMudGltZW91dCA9IHNldFRpbWVvdXQgKCgpID0+IHRoaXMuc3RheWVkKCksIHRoaXMubWluU3RheVNlY29uZHMpO1xuXHR9XG5cblx0cHJpdmF0ZSBnZXQgdmlzaWJpbGl0eVByb3BzKCkgOiBbc3RyaW5nLCBzdHJpbmddIHtcblx0XHRpZiAodHlwZW9mIGRvY3VtZW50LmhpZGRlbiAhPT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0cmV0dXJuIFtcInZpc2liaWxpdHljaGFuZ2VcIiwgXCJ2aXNpYmlsaXR5U3RhdGVcIl07XG5cdFx0fVxuXHRcdGVsc2UgaWYgKHR5cGVvZiAoZG9jdW1lbnQgYXMgYW55KS5tb3pIaWRkZW4gIT09IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdHJldHVybiBbXCJtb3p2aXNpYmlsaXR5Y2hhbmdlXCIsIFwibW96VmlzaWJpbGl0eVN0YXRlXCJdO1xuXHRcdH1cblx0XHRlbHNlIGlmICh0eXBlb2YgKGRvY3VtZW50IGFzIGFueSkubXNIaWRkZW4gIT09IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdHJldHVybiBbXCJtc3Zpc2liaWxpdHljaGFuZ2VcIiwgXCJtc1Zpc2liaWxpdHlTdGF0ZVwiXTtcblx0XHR9XG5cdFx0ZWxzZSBpZiAodHlwZW9mIChkb2N1bWVudCBhcyBhbnkpLndlYmtpdEhpZGRlbiAhPT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0cmV0dXJuIFtcIndlYmtpdHZpc2liaWxpdHljaGFuZ2VcIiwgXCJ3ZWJraXRWaXNpYmlsaXR5U3RhdGVcIl07XG5cdFx0fVxuXHRcdHRocm93IG5ldyBFcnJvcihcIlZpc2liaWxpdHkgbm90IHN1cHBvcnRlZC5cIik7XG5cdH1cblxuXHRwcml2YXRlIGRldGVjdEZvY3VzKCkge1xuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiZm9jdXNcIiwgdGhpcy5mb2N1c0dyYW50ZWQuYmluZCh0aGlzKSk7XG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJibHVyXCIsIHRoaXMuZm9jdXNMb3N0LmJpbmQodGhpcykpO1xuXHR9XG5cblx0cHJpdmF0ZSBkZXRlY3RWaXNpYmlsaXR5KCkge1xuXHRcdC8vIGNoZWNrIHRoZSB2aXNpYmxpbGl0eSBvZiB0aGUgcGFnZVxuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCBbdmlzaWJpbGl0eUNoYW5nZV0gPSB0aGlzLnZpc2liaWxpdHlQcm9wcztcblx0XHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIodmlzaWJpbGl0eUNoYW5nZSwgdGhpcy52aXNpYmlsaXR5Q2hhbmdlZC5iaW5kKHRoaXMpKTtcblx0XHR9IGNhdGNoKF8pIHtcblx0XHRcdC8vXG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBzdG9wRGV0ZWN0aW5nVmlzaWJpbGl0eSgpIHtcblx0XHQvLyBjaGVjayB0aGUgdmlzaWJsaWxpdHkgb2YgdGhlIHBhZ2Vcblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgW3Zpc2liaWxpdHlDaGFuZ2VdID0gdGhpcy52aXNpYmlsaXR5UHJvcHM7XG5cdFx0XHRkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKHZpc2liaWxpdHlDaGFuZ2UsIHRoaXMudmlzaWJpbGl0eUNoYW5nZWQuYmluZCh0aGlzKSk7XG5cdFx0fSBjYXRjaChfKSB7XG5cdFx0XHQvL1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgdmlzaWJpbGl0eUNoYW5nZWQoKSB7XG5cdFx0Y29uc3QgW18sIHZpc2liaWxpdHlTdGF0ZV0gPSB0aGlzLnZpc2liaWxpdHlQcm9wcztcblx0XHR0aGlzLnRvZ2dsZVRpbWVyKGRvY3VtZW50W3Zpc2liaWxpdHlTdGF0ZV0gPT09IFwidmlzaWJsZVwiKTtcblx0fVxuXG5cdHByaXZhdGUgZm9jdXNHcmFudGVkKCkge1xuXHRcdHRoaXMudG9nZ2xlVGltZXIodHJ1ZSk7XG5cdH1cblxuXHRwcml2YXRlIGZvY3VzTG9zdCgpIHtcblx0XHR0aGlzLnRvZ2dsZVRpbWVyKGZhbHNlKTtcblx0fVxuXG5cdHByaXZhdGUgdG9nZ2xlVGltZXIoc3RhdHVzOiBib29sZWFuKSB7XG5cdFx0aWYgKHRoaXMuaGFzU3RheWVkKSB7IHJldHVybjsgfVxuXG5cdFx0aWYoc3RhdHVzKSB7XG5cdFx0XHR0aGlzLnRpbWVvdXQgPSBzZXRUaW1lb3V0ICgoKSA9PiB0aGlzLnN0YXllZCgpLCB0aGlzLm1pblN0YXlTZWNvbmRzKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y2xlYXJUaW1lb3V0KHRoaXMudGltZW91dCk7XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBkaXNhYmxlKCkge1xuXHRcdHdpbmRvdy5vbnNjcm9sbCA9IG51bGw7XG5cdFx0dGhpcy5zdG9wRGV0ZWN0aW5nVmlzaWJpbGl0eSgpO1xuXHRcdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwiZm9jdXNcIiwgdGhpcy5mb2N1c0dyYW50ZWQuYmluZCh0aGlzKSk7XG5cdFx0d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJibHVyXCIsIHRoaXMuZm9jdXNMb3N0LmJpbmQodGhpcykpO1xuXHR9XG5cblx0cHJpdmF0ZSBnZXRTY3JvbGxQZXJjZW50KCkge1xuXHRcdHJldHVybiAoKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3AgKyBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCkgLyAoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbEhlaWdodCAtIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQpICogMTAwKTtcblx0fVxuXG5cdHByaXZhdGUgc2Nyb2xsZWQoKSB7XG5cdFx0aWYodGhpcy5nZXRTY3JvbGxQZXJjZW50KCkgPiB0aGlzLm1pblNjcm9sbFBlcmNlbnRhZ2UpIHtcblx0XHRcdGlmKHRoaXMuaGFzU3RheWVkKSB7XG5cdFx0XHRcdHRoaXMuZGlzcGF0Y2goKTtcblx0XHRcdH1cblx0XHRcdHRoaXMuaGFzU2Nyb2xsZWQgPSB0cnVlO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgc3RheWVkKCkge1xuXHRcdGlmKHRoaXMuaGFzU2Nyb2xsZWQpIHtcblx0XHRcdHRoaXMuZGlzcGF0Y2goKTtcblx0XHR9XG5cdFx0dGhpcy5oYXNTdGF5ZWQgPSB0cnVlO1xuXHR9XG5cblx0cHJpdmF0ZSBkaXNwYXRjaCgpIHtcblx0XHR3aW5kb3cuZGlzcGF0Y2hFdmVudCh0aGlzLmN1c3RvbUV2ZW50KTtcblx0XHR0aGlzLmRpc2FibGUoKTtcblx0fVxuXG5cdGdldCByZWRpcmVjdE9uRmluaXNoKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRnZXQgdHJpZ2dlcigpOiBzdHJpbmcge1xuXHRcdHJldHVybiBcInBhZ2VfcmVhZFwiO1xuXHR9XG5cdGdldCBuYW1lKCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIFwicGFnZV9yZWFkXCI7XG5cdH1cblx0Z2V0IGhhc1R5cGVzKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRnZXQgdGFyZ2V0cygpOiAoV2luZG93fEVsZW1lbnQpW10ge1xuXHRcdHJldHVybiBbd2luZG93XTtcblx0fVxuXHRjaGVja0V2ZW50KCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0Z2V0IGlzQmxvY2tpbmcoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59XG4iLCJpbXBvcnQgeyBJRXZlbnQgfSBmcm9tIFwiLi4vRXZlbnRcIjtcblxuZXhwb3J0IGNsYXNzIFN1Ym1pdCBpbXBsZW1lbnRzIElFdmVudCB7XG5cdGdldCByZWRpcmVjdE9uRmluaXNoKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdGdldCB0cmlnZ2VyKCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIFwic3VibWl0XCI7XG5cdH1cblx0Z2V0IG5hbWUoKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gXCJmb3JtX3N1Ym1pdHRlZFwiO1xuXHR9XG5cdGdldCBoYXNUeXBlcygpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXHRnZXQgdGFyZ2V0cygpOiBFbGVtZW50W10ge1xuXHRcdGNvbnN0IGVsZW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcImZvcm1cIik7XG5cdFx0cmV0dXJuIFsuLi5lbGVtZW50c10uZmlsdGVyKGVsZW1lbnQgPT4gIWVsZW1lbnQuaGFzQXR0cmlidXRlKFwiaWdub3JlXCIpKTtcblx0fVxuXHRjaGVja0V2ZW50KGV2ZW50OiBFdmVudCk6IGJvb2xlYW4ge1xuXHRcdGNvbnN0IGVsZW1lbnQgPSBldmVudC50YXJnZXQgYXMgSFRNTEVsZW1lbnQ7XG5cdFx0cmV0dXJuIGVsZW1lbnQuY2xhc3NOYW1lLmluZGV4T2YoXCJkaXNhYmxlZFwiKSA9PT0gLTE7XG5cdH1cblx0Z2V0IGlzQmxvY2tpbmcoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cbn1cbiIsIi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLyogVUFQYXJzZXIuanMgdjEuMC4yXG4gICBDb3B5cmlnaHQgwqkgMjAxMi0yMDIxIEZhaXNhbCBTYWxtYW4gPGZAZmFpc2FsbWFuLmNvbT5cbiAgIE1JVCBMaWNlbnNlICovLypcbiAgIERldGVjdCBCcm93c2VyLCBFbmdpbmUsIE9TLCBDUFUsIGFuZCBEZXZpY2UgdHlwZS9tb2RlbCBmcm9tIFVzZXItQWdlbnQgZGF0YS5cbiAgIFN1cHBvcnRzIGJyb3dzZXIgJiBub2RlLmpzIGVudmlyb25tZW50LiBcbiAgIERlbW8gICA6IGh0dHBzOi8vZmFpc2FsbWFuLmdpdGh1Yi5pby91YS1wYXJzZXItanNcbiAgIFNvdXJjZSA6IGh0dHBzOi8vZ2l0aHViLmNvbS9mYWlzYWxtYW4vdWEtcGFyc2VyLWpzICovXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuKGZ1bmN0aW9uICh3aW5kb3csIHVuZGVmaW5lZCkge1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgLy8vLy8vLy8vLy8vLy9cbiAgICAvLyBDb25zdGFudHNcbiAgICAvLy8vLy8vLy8vLy8vXG5cblxuICAgIHZhciBMSUJWRVJTSU9OICA9ICcxLjAuMicsXG4gICAgICAgIEVNUFRZICAgICAgID0gJycsXG4gICAgICAgIFVOS05PV04gICAgID0gJz8nLFxuICAgICAgICBGVU5DX1RZUEUgICA9ICdmdW5jdGlvbicsXG4gICAgICAgIFVOREVGX1RZUEUgID0gJ3VuZGVmaW5lZCcsXG4gICAgICAgIE9CSl9UWVBFICAgID0gJ29iamVjdCcsXG4gICAgICAgIFNUUl9UWVBFICAgID0gJ3N0cmluZycsXG4gICAgICAgIE1BSk9SICAgICAgID0gJ21ham9yJyxcbiAgICAgICAgTU9ERUwgICAgICAgPSAnbW9kZWwnLFxuICAgICAgICBOQU1FICAgICAgICA9ICduYW1lJyxcbiAgICAgICAgVFlQRSAgICAgICAgPSAndHlwZScsXG4gICAgICAgIFZFTkRPUiAgICAgID0gJ3ZlbmRvcicsXG4gICAgICAgIFZFUlNJT04gICAgID0gJ3ZlcnNpb24nLFxuICAgICAgICBBUkNISVRFQ1RVUkU9ICdhcmNoaXRlY3R1cmUnLFxuICAgICAgICBDT05TT0xFICAgICA9ICdjb25zb2xlJyxcbiAgICAgICAgTU9CSUxFICAgICAgPSAnbW9iaWxlJyxcbiAgICAgICAgVEFCTEVUICAgICAgPSAndGFibGV0JyxcbiAgICAgICAgU01BUlRUViAgICAgPSAnc21hcnR0dicsXG4gICAgICAgIFdFQVJBQkxFICAgID0gJ3dlYXJhYmxlJyxcbiAgICAgICAgRU1CRURERUQgICAgPSAnZW1iZWRkZWQnLFxuICAgICAgICBVQV9NQVhfTEVOR1RIID0gMjU1O1xuXG4gICAgdmFyIEFNQVpPTiAgPSAnQW1hem9uJyxcbiAgICAgICAgQVBQTEUgICA9ICdBcHBsZScsXG4gICAgICAgIEFTVVMgICAgPSAnQVNVUycsXG4gICAgICAgIEJMQUNLQkVSUlkgPSAnQmxhY2tCZXJyeScsXG4gICAgICAgIEJST1dTRVIgPSAnQnJvd3NlcicsXG4gICAgICAgIENIUk9NRSAgPSAnQ2hyb21lJyxcbiAgICAgICAgRURHRSAgICA9ICdFZGdlJyxcbiAgICAgICAgRklSRUZPWCA9ICdGaXJlZm94JyxcbiAgICAgICAgR09PR0xFICA9ICdHb29nbGUnLFxuICAgICAgICBIVUFXRUkgID0gJ0h1YXdlaScsXG4gICAgICAgIExHICAgICAgPSAnTEcnLFxuICAgICAgICBNSUNST1NPRlQgPSAnTWljcm9zb2Z0JyxcbiAgICAgICAgTU9UT1JPTEEgID0gJ01vdG9yb2xhJyxcbiAgICAgICAgT1BFUkEgICA9ICdPcGVyYScsXG4gICAgICAgIFNBTVNVTkcgPSAnU2Ftc3VuZycsXG4gICAgICAgIFNPTlkgICAgPSAnU29ueScsXG4gICAgICAgIFhJQU9NSSAgPSAnWGlhb21pJyxcbiAgICAgICAgWkVCUkEgICA9ICdaZWJyYScsXG4gICAgICAgIEZBQ0VCT09LICAgPSAnRmFjZWJvb2snO1xuXG4gICAgLy8vLy8vLy8vLy9cbiAgICAvLyBIZWxwZXJcbiAgICAvLy8vLy8vLy8vXG5cbiAgICB2YXIgZXh0ZW5kID0gZnVuY3Rpb24gKHJlZ2V4ZXMsIGV4dGVuc2lvbnMpIHtcbiAgICAgICAgICAgIHZhciBtZXJnZWRSZWdleGVzID0ge307XG4gICAgICAgICAgICBmb3IgKHZhciBpIGluIHJlZ2V4ZXMpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXh0ZW5zaW9uc1tpXSAmJiBleHRlbnNpb25zW2ldLmxlbmd0aCAlIDIgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgbWVyZ2VkUmVnZXhlc1tpXSA9IGV4dGVuc2lvbnNbaV0uY29uY2F0KHJlZ2V4ZXNbaV0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG1lcmdlZFJlZ2V4ZXNbaV0gPSByZWdleGVzW2ldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBtZXJnZWRSZWdleGVzO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJpemUgPSBmdW5jdGlvbiAoYXJyKSB7XG4gICAgICAgICAgICB2YXIgZW51bXMgPSB7fTtcbiAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaTxhcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBlbnVtc1thcnJbaV0udG9VcHBlckNhc2UoKV0gPSBhcnJbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZW51bXM7XG4gICAgICAgIH0sXG4gICAgICAgIGhhcyA9IGZ1bmN0aW9uIChzdHIxLCBzdHIyKSB7XG4gICAgICAgICAgICByZXR1cm4gdHlwZW9mIHN0cjEgPT09IFNUUl9UWVBFID8gbG93ZXJpemUoc3RyMikuaW5kZXhPZihsb3dlcml6ZShzdHIxKSkgIT09IC0xIDogZmFsc2U7XG4gICAgICAgIH0sXG4gICAgICAgIGxvd2VyaXplID0gZnVuY3Rpb24gKHN0cikge1xuICAgICAgICAgICAgcmV0dXJuIHN0ci50b0xvd2VyQ2FzZSgpO1xuICAgICAgICB9LFxuICAgICAgICBtYWpvcml6ZSA9IGZ1bmN0aW9uICh2ZXJzaW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gdHlwZW9mKHZlcnNpb24pID09PSBTVFJfVFlQRSA/IHZlcnNpb24ucmVwbGFjZSgvW15cXGRcXC5dL2csIEVNUFRZKS5zcGxpdCgnLicpWzBdIDogdW5kZWZpbmVkO1xuICAgICAgICB9LFxuICAgICAgICB0cmltID0gZnVuY3Rpb24gKHN0ciwgbGVuKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mKHN0cikgPT09IFNUUl9UWVBFKSB7XG4gICAgICAgICAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UoL15cXHNcXHMqLywgRU1QVFkpLnJlcGxhY2UoL1xcc1xccyokLywgRU1QVFkpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0eXBlb2YobGVuKSA9PT0gVU5ERUZfVFlQRSA/IHN0ciA6IHN0ci5zdWJzdHJpbmcoMCwgVUFfTUFYX0xFTkdUSCk7XG4gICAgICAgICAgICB9XG4gICAgfTtcblxuICAgIC8vLy8vLy8vLy8vLy8vL1xuICAgIC8vIE1hcCBoZWxwZXJcbiAgICAvLy8vLy8vLy8vLy8vL1xuXG4gICAgdmFyIHJneE1hcHBlciA9IGZ1bmN0aW9uICh1YSwgYXJyYXlzKSB7XG5cbiAgICAgICAgICAgIHZhciBpID0gMCwgaiwgaywgcCwgcSwgbWF0Y2hlcywgbWF0Y2g7XG5cbiAgICAgICAgICAgIC8vIGxvb3AgdGhyb3VnaCBhbGwgcmVnZXhlcyBtYXBzXG4gICAgICAgICAgICB3aGlsZSAoaSA8IGFycmF5cy5sZW5ndGggJiYgIW1hdGNoZXMpIHtcblxuICAgICAgICAgICAgICAgIHZhciByZWdleCA9IGFycmF5c1tpXSwgICAgICAgLy8gZXZlbiBzZXF1ZW5jZSAoMCwyLDQsLi4pXG4gICAgICAgICAgICAgICAgICAgIHByb3BzID0gYXJyYXlzW2kgKyAxXTsgICAvLyBvZGQgc2VxdWVuY2UgKDEsMyw1LC4uKVxuICAgICAgICAgICAgICAgIGogPSBrID0gMDtcblxuICAgICAgICAgICAgICAgIC8vIHRyeSBtYXRjaGluZyB1YXN0cmluZyB3aXRoIHJlZ2V4ZXNcbiAgICAgICAgICAgICAgICB3aGlsZSAoaiA8IHJlZ2V4Lmxlbmd0aCAmJiAhbWF0Y2hlcykge1xuXG4gICAgICAgICAgICAgICAgICAgIG1hdGNoZXMgPSByZWdleFtqKytdLmV4ZWModWEpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghIW1hdGNoZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAocCA9IDA7IHAgPCBwcm9wcy5sZW5ndGg7IHArKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoID0gbWF0Y2hlc1srK2tdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHEgPSBwcm9wc1twXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjaGVjayBpZiBnaXZlbiBwcm9wZXJ0eSBpcyBhY3R1YWxseSBhcnJheVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcSA9PT0gT0JKX1RZUEUgJiYgcS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChxLmxlbmd0aCA9PT0gMikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBxWzFdID09IEZVTkNfVFlQRSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFzc2lnbiBtb2RpZmllZCBtYXRjaFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNbcVswXV0gPSBxWzFdLmNhbGwodGhpcywgbWF0Y2gpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhc3NpZ24gZ2l2ZW4gdmFsdWUsIGlnbm9yZSByZWdleCBtYXRjaFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNbcVswXV0gPSBxWzFdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHEubGVuZ3RoID09PSAzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjaGVjayB3aGV0aGVyIGZ1bmN0aW9uIG9yIHJlZ2V4XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHFbMV0gPT09IEZVTkNfVFlQRSAmJiAhKHFbMV0uZXhlYyAmJiBxWzFdLnRlc3QpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2FsbCBmdW5jdGlvbiAodXN1YWxseSBzdHJpbmcgbWFwcGVyKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNbcVswXV0gPSBtYXRjaCA/IHFbMV0uY2FsbCh0aGlzLCBtYXRjaCwgcVsyXSkgOiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNhbml0aXplIG1hdGNoIHVzaW5nIGdpdmVuIHJlZ2V4XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1txWzBdXSA9IG1hdGNoID8gbWF0Y2gucmVwbGFjZShxWzFdLCBxWzJdKSA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChxLmxlbmd0aCA9PT0gNCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNbcVswXV0gPSBtYXRjaCA/IHFbM10uY2FsbCh0aGlzLCBtYXRjaC5yZXBsYWNlKHFbMV0sIHFbMl0pKSA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNbcV0gPSBtYXRjaCA/IG1hdGNoIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpICs9IDI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgc3RyTWFwcGVyID0gZnVuY3Rpb24gKHN0ciwgbWFwKSB7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgaW4gbWFwKSB7XG4gICAgICAgICAgICAgICAgLy8gY2hlY2sgaWYgY3VycmVudCB2YWx1ZSBpcyBhcnJheVxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgbWFwW2ldID09PSBPQkpfVFlQRSAmJiBtYXBbaV0ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IG1hcFtpXS5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGhhcyhtYXBbaV1bal0sIHN0cikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKGkgPT09IFVOS05PV04pID8gdW5kZWZpbmVkIDogaTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaGFzKG1hcFtpXSwgc3RyKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKGkgPT09IFVOS05PV04pID8gdW5kZWZpbmVkIDogaTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc3RyO1xuICAgIH07XG5cbiAgICAvLy8vLy8vLy8vLy8vLy9cbiAgICAvLyBTdHJpbmcgbWFwXG4gICAgLy8vLy8vLy8vLy8vLy9cblxuICAgIC8vIFNhZmFyaSA8IDMuMFxuICAgIHZhciBvbGRTYWZhcmlNYXAgPSB7XG4gICAgICAgICAgICAnMS4wJyAgIDogJy84JyxcbiAgICAgICAgICAgICcxLjInICAgOiAnLzEnLFxuICAgICAgICAgICAgJzEuMycgICA6ICcvMycsXG4gICAgICAgICAgICAnMi4wJyAgIDogJy80MTInLFxuICAgICAgICAgICAgJzIuMC4yJyA6ICcvNDE2JyxcbiAgICAgICAgICAgICcyLjAuMycgOiAnLzQxNycsXG4gICAgICAgICAgICAnMi4wLjQnIDogJy80MTknLFxuICAgICAgICAgICAgJz8nICAgICA6ICcvJ1xuICAgICAgICB9LFxuICAgICAgICB3aW5kb3dzVmVyc2lvbk1hcCA9IHtcbiAgICAgICAgICAgICdNRScgICAgICAgIDogJzQuOTAnLFxuICAgICAgICAgICAgJ05UIDMuMTEnICAgOiAnTlQzLjUxJyxcbiAgICAgICAgICAgICdOVCA0LjAnICAgIDogJ05UNC4wJyxcbiAgICAgICAgICAgICcyMDAwJyAgICAgIDogJ05UIDUuMCcsXG4gICAgICAgICAgICAnWFAnICAgICAgICA6IFsnTlQgNS4xJywgJ05UIDUuMiddLFxuICAgICAgICAgICAgJ1Zpc3RhJyAgICAgOiAnTlQgNi4wJyxcbiAgICAgICAgICAgICc3JyAgICAgICAgIDogJ05UIDYuMScsXG4gICAgICAgICAgICAnOCcgICAgICAgICA6ICdOVCA2LjInLFxuICAgICAgICAgICAgJzguMScgICAgICAgOiAnTlQgNi4zJyxcbiAgICAgICAgICAgICcxMCcgICAgICAgIDogWydOVCA2LjQnLCAnTlQgMTAuMCddLFxuICAgICAgICAgICAgJ1JUJyAgICAgICAgOiAnQVJNJ1xuICAgIH07XG5cbiAgICAvLy8vLy8vLy8vLy8vL1xuICAgIC8vIFJlZ2V4IG1hcFxuICAgIC8vLy8vLy8vLy8vLy9cblxuICAgIHZhciByZWdleGVzID0ge1xuXG4gICAgICAgIGJyb3dzZXIgOiBbW1xuXG4gICAgICAgICAgICAvXFxiKD86Y3Jtb3xjcmlvcylcXC8oW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDaHJvbWUgZm9yIEFuZHJvaWQvaU9TXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsICdDaHJvbWUnXV0sIFtcbiAgICAgICAgICAgIC9lZGcoPzplfGlvc3xhKT9cXC8oW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTWljcm9zb2Z0IEVkZ2VcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgJ0VkZ2UnXV0sIFtcblxuICAgICAgICAgICAgLy8gUHJlc3RvIGJhc2VkXG4gICAgICAgICAgICAvKG9wZXJhIG1pbmkpXFwvKFstXFx3XFwuXSspL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE9wZXJhIE1pbmlcbiAgICAgICAgICAgIC8ob3BlcmEgW21vYmlsZXRhYl17Myw2fSlcXGIuK3ZlcnNpb25cXC8oWy1cXHdcXC5dKykvaSwgICAgICAgICAgICAgICAgIC8vIE9wZXJhIE1vYmkvVGFibGV0XG4gICAgICAgICAgICAvKG9wZXJhKSg/Oi4rdmVyc2lvblxcL3xbXFwvIF0rKShbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBPcGVyYVxuICAgICAgICAgICAgXSwgW05BTUUsIFZFUlNJT05dLCBbXG4gICAgICAgICAgICAvb3Bpb3NbXFwvIF0rKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE9wZXJhIG1pbmkgb24gaXBob25lID49IDguMFxuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCBPUEVSQSsnIE1pbmknXV0sIFtcbiAgICAgICAgICAgIC9cXGJvcHJcXC8oW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE9wZXJhIFdlYmtpdFxuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCBPUEVSQV1dLCBbXG5cbiAgICAgICAgICAgIC8vIE1peGVkXG4gICAgICAgICAgICAvKGtpbmRsZSlcXC8oW1xcd1xcLl0rKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEtpbmRsZVxuICAgICAgICAgICAgLyhsdW5hc2NhcGV8bWF4dGhvbnxuZXRmcm9udHxqYXNtaW5lfGJsYXplcilbXFwvIF0/KFtcXHdcXC5dKikvaSwgICAgICAvLyBMdW5hc2NhcGUvTWF4dGhvbi9OZXRmcm9udC9KYXNtaW5lL0JsYXplclxuICAgICAgICAgICAgLy8gVHJpZGVudCBiYXNlZFxuICAgICAgICAgICAgLyhhdmFudCB8aWVtb2JpbGV8c2xpbSkoPzpicm93c2VyKT9bXFwvIF0/KFtcXHdcXC5dKikvaSwgICAgICAgICAgICAgICAvLyBBdmFudC9JRU1vYmlsZS9TbGltQnJvd3NlclxuICAgICAgICAgICAgLyhiYT9pZHVicm93c2VyKVtcXC8gXT8oW1xcd1xcLl0rKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBCYWlkdSBCcm93c2VyXG4gICAgICAgICAgICAvKD86bXN8XFwoKShpZSkgKFtcXHdcXC5dKykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEludGVybmV0IEV4cGxvcmVyXG5cbiAgICAgICAgICAgIC8vIFdlYmtpdC9LSFRNTCBiYXNlZCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRmxvY2svUm9ja01lbHQvTWlkb3JpL0VwaXBoYW55L1NpbGsvU2t5ZmlyZS9Cb2x0L0lyb24vSXJpZGl1bS9QaGFudG9tSlMvQm93c2VyL1F1cFppbGxhL0ZhbGtvblxuICAgICAgICAgICAgLyhmbG9ja3xyb2NrbWVsdHxtaWRvcml8ZXBpcGhhbnl8c2lsa3xza3lmaXJlfG92aWJyb3dzZXJ8Ym9sdHxpcm9ufHZpdmFsZGl8aXJpZGl1bXxwaGFudG9tanN8Ym93c2VyfHF1YXJrfHF1cHppbGxhfGZhbGtvbnxyZWtvbnF8cHVmZmlufGJyYXZlfHdoYWxlfHFxYnJvd3NlcmxpdGV8cXEpXFwvKFstXFx3XFwuXSspL2ksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFJla29ucS9QdWZmaW4vQnJhdmUvV2hhbGUvUVFCcm93c2VyTGl0ZS9RUSwgYWthIFNob3VRXG4gICAgICAgICAgICAvKHdlaWJvKV9fKFtcXGRcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gV2VpYm9cbiAgICAgICAgICAgIF0sIFtOQU1FLCBWRVJTSU9OXSwgW1xuICAgICAgICAgICAgLyg/OlxcYnVjPyA/YnJvd3NlcnwoPzpqdWMuKyl1Y3dlYilbXFwvIF0/KFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgLy8gVUNCcm93c2VyXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsICdVQycrQlJPV1NFUl1dLCBbXG4gICAgICAgICAgICAvXFxicWJjb3JlXFwvKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBXZUNoYXQgRGVza3RvcCBmb3IgV2luZG93cyBCdWlsdC1pbiBCcm93c2VyXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsICdXZUNoYXQoV2luKSBEZXNrdG9wJ11dLCBbXG4gICAgICAgICAgICAvbWljcm9tZXNzZW5nZXJcXC8oW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdlQ2hhdFxuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCAnV2VDaGF0J11dLCBbXG4gICAgICAgICAgICAva29ucXVlcm9yXFwvKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEtvbnF1ZXJvclxuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCAnS29ucXVlcm9yJ11dLCBbXG4gICAgICAgICAgICAvdHJpZGVudC4rcnZbOiBdKFtcXHdcXC5dezEsOX0pXFxiLitsaWtlIGdlY2tvL2kgICAgICAgICAgICAgICAgICAgICAgIC8vIElFMTFcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgJ0lFJ11dLCBbXG4gICAgICAgICAgICAveWFicm93c2VyXFwvKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFlhbmRleFxuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCAnWWFuZGV4J11dLCBbXG4gICAgICAgICAgICAvKGF2YXN0fGF2ZylcXC8oW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEF2YXN0L0FWRyBTZWN1cmUgQnJvd3NlclxuICAgICAgICAgICAgXSwgW1tOQU1FLCAvKC4rKS8sICckMSBTZWN1cmUgJytCUk9XU0VSXSwgVkVSU0lPTl0sIFtcbiAgICAgICAgICAgIC9cXGJmb2N1c1xcLyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZpcmVmb3ggRm9jdXNcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgRklSRUZPWCsnIEZvY3VzJ11dLCBbXG4gICAgICAgICAgICAvXFxib3B0XFwvKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBPcGVyYSBUb3VjaFxuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCBPUEVSQSsnIFRvdWNoJ11dLCBbXG4gICAgICAgICAgICAvY29jX2NvY1xcdytcXC8oW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDb2MgQ29jIEJyb3dzZXJcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgJ0NvYyBDb2MnXV0sIFtcbiAgICAgICAgICAgIC9kb2xmaW5cXC8oW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRG9scGhpblxuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCAnRG9scGhpbiddXSwgW1xuICAgICAgICAgICAgL2NvYXN0XFwvKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBPcGVyYSBDb2FzdFxuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCBPUEVSQSsnIENvYXN0J11dLCBbXG4gICAgICAgICAgICAvbWl1aWJyb3dzZXJcXC8oW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1JVUkgQnJvd3NlclxuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCAnTUlVSSAnK0JST1dTRVJdXSwgW1xuICAgICAgICAgICAgL2Z4aW9zXFwvKFstXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBGaXJlZm94IGZvciBpT1NcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgRklSRUZPWF1dLCBbXG4gICAgICAgICAgICAvXFxicWlodXwocWk/aG8/bz98MzYwKWJyb3dzZXIvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAzNjBcbiAgICAgICAgICAgIF0sIFtbTkFNRSwgJzM2MCAnK0JST1dTRVJdXSwgW1xuICAgICAgICAgICAgLyhvY3VsdXN8c2Ftc3VuZ3xzYWlsZmlzaClicm93c2VyXFwvKFtcXHdcXC5dKykvaVxuICAgICAgICAgICAgXSwgW1tOQU1FLCAvKC4rKS8sICckMSAnK0JST1dTRVJdLCBWRVJTSU9OXSwgWyAgICAgICAgICAgICAgICAgICAgICAvLyBPY3VsdXMvU2Ftc3VuZy9TYWlsZmlzaCBCcm93c2VyXG4gICAgICAgICAgICAvKGNvbW9kb19kcmFnb24pXFwvKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIENvbW9kbyBEcmFnb25cbiAgICAgICAgICAgIF0sIFtbTkFNRSwgL18vZywgJyAnXSwgVkVSU0lPTl0sIFtcbiAgICAgICAgICAgIC8oZWxlY3Ryb24pXFwvKFtcXHdcXC5dKykgc2FmYXJpL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRWxlY3Ryb24tYmFzZWQgQXBwXG4gICAgICAgICAgICAvKHRlc2xhKSg/OiBxdGNhcmJyb3dzZXJ8XFwvKDIwXFxkXFxkXFwuWy1cXHdcXC5dKykpL2ksICAgICAgICAgICAgICAgICAgIC8vIFRlc2xhXG4gICAgICAgICAgICAvbT8ocXFicm93c2VyfGJhaWR1Ym94YXBwfDIzNDVFeHBsb3JlcilbXFwvIF0/KFtcXHdcXC5dKykvaSAgICAgICAgICAgIC8vIFFRQnJvd3Nlci9CYWlkdSBBcHAvMjM0NSBCcm93c2VyXG4gICAgICAgICAgICBdLCBbTkFNRSwgVkVSU0lPTl0sIFtcbiAgICAgICAgICAgIC8obWV0YXNyKVtcXC8gXT8oW1xcd1xcLl0rKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU291R291QnJvd3NlclxuICAgICAgICAgICAgLyhsYmJyb3dzZXIpL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBMaWVCYW8gQnJvd3NlclxuICAgICAgICAgICAgXSwgW05BTUVdLCBbXG5cbiAgICAgICAgICAgIC8vIFdlYlZpZXdcbiAgICAgICAgICAgIC8oKD86ZmJhblxcL2ZiaW9zfGZiX2lhYlxcL2ZiNGEpKD8hLitmYmF2KXw7ZmJhdlxcLyhbXFx3XFwuXSspOykvaSAgICAgICAvLyBGYWNlYm9vayBBcHAgZm9yIGlPUyAmIEFuZHJvaWRcbiAgICAgICAgICAgIF0sIFtbTkFNRSwgRkFDRUJPT0tdLCBWRVJTSU9OXSwgW1xuICAgICAgICAgICAgL3NhZmFyaSAobGluZSlcXC8oW1xcd1xcLl0rKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBMaW5lIEFwcCBmb3IgaU9TXG4gICAgICAgICAgICAvXFxiKGxpbmUpXFwvKFtcXHdcXC5dKylcXC9pYWIvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTGluZSBBcHAgZm9yIEFuZHJvaWRcbiAgICAgICAgICAgIC8oY2hyb21pdW18aW5zdGFncmFtKVtcXC8gXShbLVxcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ2hyb21pdW0vSW5zdGFncmFtXG4gICAgICAgICAgICBdLCBbTkFNRSwgVkVSU0lPTl0sIFtcbiAgICAgICAgICAgIC9cXGJnc2FcXC8oW1xcd1xcLl0rKSAuKnNhZmFyaVxcLy9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBHb29nbGUgU2VhcmNoIEFwcGxpYW5jZSBvbiBpT1NcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgJ0dTQSddXSwgW1xuXG4gICAgICAgICAgICAvaGVhZGxlc3NjaHJvbWUoPzpcXC8oW1xcd1xcLl0rKXwgKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIENocm9tZSBIZWFkbGVzc1xuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCBDSFJPTUUrJyBIZWFkbGVzcyddXSwgW1xuXG4gICAgICAgICAgICAvIHd2XFwpLisoY2hyb21lKVxcLyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDaHJvbWUgV2ViVmlld1xuICAgICAgICAgICAgXSwgW1tOQU1FLCBDSFJPTUUrJyBXZWJWaWV3J10sIFZFUlNJT05dLCBbXG5cbiAgICAgICAgICAgIC9kcm9pZC4rIHZlcnNpb25cXC8oW1xcd1xcLl0rKVxcYi4rKD86bW9iaWxlIHNhZmFyaXxzYWZhcmkpL2kgICAgICAgICAgIC8vIEFuZHJvaWQgQnJvd3NlclxuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCAnQW5kcm9pZCAnK0JST1dTRVJdXSwgW1xuXG4gICAgICAgICAgICAvKGNocm9tZXxvbW5pd2VifGFyb3JhfFt0aXplbm9rYV17NX0gP2Jyb3dzZXIpXFwvdj8oW1xcd1xcLl0rKS9pICAgICAgIC8vIENocm9tZS9PbW5pV2ViL0Fyb3JhL1RpemVuL05va2lhXG4gICAgICAgICAgICBdLCBbTkFNRSwgVkVSU0lPTl0sIFtcblxuICAgICAgICAgICAgL3ZlcnNpb25cXC8oW1xcd1xcLl0rKSAuKm1vYmlsZVxcL1xcdysgKHNhZmFyaSkvaSAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1vYmlsZSBTYWZhcmlcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgJ01vYmlsZSBTYWZhcmknXV0sIFtcbiAgICAgICAgICAgIC92ZXJzaW9uXFwvKFtcXHdcXC5dKykgLioobW9iaWxlID9zYWZhcml8c2FmYXJpKS9pICAgICAgICAgICAgICAgICAgICAgLy8gU2FmYXJpICYgU2FmYXJpIE1vYmlsZVxuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIE5BTUVdLCBbXG4gICAgICAgICAgICAvd2Via2l0Lis/KG1vYmlsZSA/c2FmYXJpfHNhZmFyaSkoXFwvW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgIC8vIFNhZmFyaSA8IDMuMFxuICAgICAgICAgICAgXSwgW05BTUUsIFtWRVJTSU9OLCBzdHJNYXBwZXIsIG9sZFNhZmFyaU1hcF1dLCBbXG5cbiAgICAgICAgICAgIC8od2Via2l0fGtodG1sKVxcLyhbXFx3XFwuXSspL2lcbiAgICAgICAgICAgIF0sIFtOQU1FLCBWRVJTSU9OXSwgW1xuXG4gICAgICAgICAgICAvLyBHZWNrbyBiYXNlZFxuICAgICAgICAgICAgLyhuYXZpZ2F0b3J8bmV0c2NhcGVcXGQ/KVxcLyhbLVxcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTmV0c2NhcGVcbiAgICAgICAgICAgIF0sIFtbTkFNRSwgJ05ldHNjYXBlJ10sIFZFUlNJT05dLCBbXG4gICAgICAgICAgICAvbW9iaWxlIHZyOyBydjooW1xcd1xcLl0rKVxcKS4rZmlyZWZveC9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZpcmVmb3ggUmVhbGl0eVxuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCBGSVJFRk9YKycgUmVhbGl0eSddXSwgW1xuICAgICAgICAgICAgL2VraW9oZi4rKGZsb3cpXFwvKFtcXHdcXC5dKykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBGbG93XG4gICAgICAgICAgICAvKHN3aWZ0Zm94KS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFN3aWZ0Zm94XG4gICAgICAgICAgICAvKGljZWRyYWdvbnxpY2V3ZWFzZWx8Y2FtaW5vfGNoaW1lcmF8ZmVubmVjfG1hZW1vIGJyb3dzZXJ8bWluaW1vfGNvbmtlcm9yfGtsYXIpW1xcLyBdPyhbXFx3XFwuXFwrXSspL2ksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEljZURyYWdvbi9JY2V3ZWFzZWwvQ2FtaW5vL0NoaW1lcmEvRmVubmVjL01hZW1vL01pbmltby9Db25rZXJvci9LbGFyXG4gICAgICAgICAgICAvKHNlYW1vbmtleXxrLW1lbGVvbnxpY2VjYXR8aWNlYXBlfGZpcmViaXJkfHBob2VuaXh8cGFsZW1vb258YmFzaWxpc2t8d2F0ZXJmb3gpXFwvKFstXFx3XFwuXSspJC9pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBGaXJlZm94L1NlYU1vbmtleS9LLU1lbGVvbi9JY2VDYXQvSWNlQXBlL0ZpcmViaXJkL1Bob2VuaXhcbiAgICAgICAgICAgIC8oZmlyZWZveClcXC8oW1xcd1xcLl0rKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gT3RoZXIgRmlyZWZveC1iYXNlZFxuICAgICAgICAgICAgLyhtb3ppbGxhKVxcLyhbXFx3XFwuXSspIC4rcnZcXDouK2dlY2tvXFwvXFxkKy9pLCAgICAgICAgICAgICAgICAgICAgICAgICAvLyBNb3ppbGxhXG5cbiAgICAgICAgICAgIC8vIE90aGVyXG4gICAgICAgICAgICAvKHBvbGFyaXN8bHlueHxkaWxsb3xpY2FifGRvcmlzfGFtYXlhfHczbXxuZXRzdXJmfHNsZWlwbmlyfG9iaWdvfG1vc2FpY3woPzpnb3xpY2V8dXApW1xcLiBdP2Jyb3dzZXIpWy1cXC8gXT92PyhbXFx3XFwuXSspL2ksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFBvbGFyaXMvTHlueC9EaWxsby9pQ2FiL0RvcmlzL0FtYXlhL3czbS9OZXRTdXJmL1NsZWlwbmlyL09iaWdvL01vc2FpYy9Hby9JQ0UvVVAuQnJvd3NlclxuICAgICAgICAgICAgLyhsaW5rcykgXFwoKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBMaW5rc1xuICAgICAgICAgICAgXSwgW05BTUUsIFZFUlNJT05dXG4gICAgICAgIF0sXG5cbiAgICAgICAgY3B1IDogW1tcblxuICAgICAgICAgICAgLyg/OihhbWR8eCg/Oig/Ojg2fDY0KVstX10pP3x3b3d8d2luKTY0KVs7XFwpXS9pICAgICAgICAgICAgICAgICAgICAgLy8gQU1ENjQgKHg2NClcbiAgICAgICAgICAgIF0sIFtbQVJDSElURUNUVVJFLCAnYW1kNjQnXV0sIFtcblxuICAgICAgICAgICAgLyhpYTMyKD89OykpL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBJQTMyIChxdWlja3RpbWUpXG4gICAgICAgICAgICBdLCBbW0FSQ0hJVEVDVFVSRSwgbG93ZXJpemVdXSwgW1xuXG4gICAgICAgICAgICAvKCg/OmlbMzQ2XXx4KTg2KVs7XFwpXS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBJQTMyICh4ODYpXG4gICAgICAgICAgICBdLCBbW0FSQ0hJVEVDVFVSRSwgJ2lhMzInXV0sIFtcblxuICAgICAgICAgICAgL1xcYihhYXJjaDY0fGFybSh2PzhlP2w/fF8/NjQpKVxcYi9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQVJNNjRcbiAgICAgICAgICAgIF0sIFtbQVJDSElURUNUVVJFLCAnYXJtNjQnXV0sIFtcblxuICAgICAgICAgICAgL1xcYihhcm0oPzp2WzY3XSk/aHQ/bj9bZmxdcD8pXFxiL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFSTUhGXG4gICAgICAgICAgICBdLCBbW0FSQ0hJVEVDVFVSRSwgJ2FybWhmJ11dLCBbXG5cbiAgICAgICAgICAgIC8vIFBvY2tldFBDIG1pc3Rha2VubHkgaWRlbnRpZmllZCBhcyBQb3dlclBDXG4gICAgICAgICAgICAvd2luZG93cyAoY2V8bW9iaWxlKTsgcHBjOy9pXG4gICAgICAgICAgICBdLCBbW0FSQ0hJVEVDVFVSRSwgJ2FybSddXSwgW1xuXG4gICAgICAgICAgICAvKCg/OnBwY3xwb3dlcnBjKSg/OjY0KT8pKD86IG1hY3w7fFxcKSkvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBQb3dlclBDXG4gICAgICAgICAgICBdLCBbW0FSQ0hJVEVDVFVSRSwgL293ZXIvLCBFTVBUWSwgbG93ZXJpemVdXSwgW1xuXG4gICAgICAgICAgICAvKHN1bjRcXHcpWztcXCldL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU1BBUkNcbiAgICAgICAgICAgIF0sIFtbQVJDSElURUNUVVJFLCAnc3BhcmMnXV0sIFtcblxuICAgICAgICAgICAgLygoPzphdnIzMnxpYTY0KD89OykpfDY4ayg/PVxcKSl8XFxiYXJtKD89dig/OlsxLTddfFs1LTddMSlsP3w7fGVhYmkpfCg/PWF0bWVsIClhdnJ8KD86aXJpeHxtaXBzfHNwYXJjKSg/OjY0KT9cXGJ8cGEtcmlzYykvaVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBJQTY0LCA2OEssIEFSTS82NCwgQVZSLzMyLCBJUklYLzY0LCBNSVBTLzY0LCBTUEFSQy82NCwgUEEtUklTQ1xuICAgICAgICAgICAgXSwgW1tBUkNISVRFQ1RVUkUsIGxvd2VyaXplXV1cbiAgICAgICAgXSxcblxuICAgICAgICBkZXZpY2UgOiBbW1xuXG4gICAgICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgICAgICAgICAgLy8gTU9CSUxFUyAmIFRBQkxFVFNcbiAgICAgICAgICAgIC8vIE9yZGVyZWQgYnkgcG9wdWxhcml0eVxuICAgICAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICAgICAgICAvLyBTYW1zdW5nXG4gICAgICAgICAgICAvXFxiKHNjaC1pWzg5XTBcXGR8c2h3LW0zODBzfHNtLVtwdF1cXHd7Miw0fXxndC1bcG5dXFxkezIsNH18c2doLXQ4WzU2XTl8bmV4dXMgMTApL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgU0FNU1VOR10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgL1xcYigoPzpzW2NncF1ofGd0fHNtKS1cXHcrfGdhbGF4eSBuZXh1cykvaSxcbiAgICAgICAgICAgIC9zYW1zdW5nWy0gXShbLVxcd10rKS9pLFxuICAgICAgICAgICAgL3NlYy0oc2doXFx3KykvaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBTQU1TVU5HXSwgW1RZUEUsIE1PQklMRV1dLCBbXG5cbiAgICAgICAgICAgIC8vIEFwcGxlXG4gICAgICAgICAgICAvXFwoKGlwKD86aG9uZXxvZClbXFx3IF0qKTsvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaVBvZC9pUGhvbmVcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgQVBQTEVdLCBbVFlQRSwgTU9CSUxFXV0sIFtcbiAgICAgICAgICAgIC9cXCgoaXBhZCk7Wy1cXHdcXCksOyBdK2FwcGxlL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaVBhZFxuICAgICAgICAgICAgL2FwcGxlY29yZW1lZGlhXFwvW1xcd1xcLl0rIFxcKChpcGFkKS9pLFxuICAgICAgICAgICAgL1xcYihpcGFkKVxcZFxcZD8sXFxkXFxkP1s7XFxdXS4raW9zL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgQVBQTEVdLCBbVFlQRSwgVEFCTEVUXV0sIFtcblxuICAgICAgICAgICAgLy8gSHVhd2VpXG4gICAgICAgICAgICAvXFxiKCg/OmFnW3JzXVsyM10/fGJhaDI/fHNodD98YnR2KS1hP1tsd11cXGR7Mn0pXFxiKD8hLitkXFwvcykvaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBIVUFXRUldLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC8oPzpodWF3ZWl8aG9ub3IpKFstXFx3IF0rKVs7XFwpXS9pLFxuICAgICAgICAgICAgL1xcYihuZXh1cyA2cHxcXHd7Miw0fS1bYXR1XT9bbG5dWzAxMjU5eF1bMDEyMzU5XVthbl0/KVxcYig/IS4rZFxcL3MpL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgSFVBV0VJXSwgW1RZUEUsIE1PQklMRV1dLCBbXG5cbiAgICAgICAgICAgIC8vIFhpYW9taVxuICAgICAgICAgICAgL1xcYihwb2NvW1xcdyBdKykoPzogYnVpfFxcKSkvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBYaWFvbWkgUE9DT1xuICAgICAgICAgICAgL1xcYjsgKFxcdyspIGJ1aWxkXFwvaG1cXDEvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gWGlhb21pIEhvbmdtaSAnbnVtZXJpYycgbW9kZWxzXG4gICAgICAgICAgICAvXFxiKGhtWy1fIF0/bm90ZT9bXyBdPyg/OlxcZFxcdyk/KSBidWkvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFhpYW9taSBIb25nbWlcbiAgICAgICAgICAgIC9cXGIocmVkbWlbXFwtXyBdPyg/Om5vdGV8ayk/W1xcd18gXSspKD86IGJ1aXxcXCkpL2ksICAgICAgICAgICAgICAgICAgIC8vIFhpYW9taSBSZWRtaVxuICAgICAgICAgICAgL1xcYihtaVstXyBdPyg/OmFcXGR8b25lfG9uZVtfIF1wbHVzfG5vdGUgbHRlfG1heCk/W18gXT8oPzpcXGQ/XFx3PylbXyBdPyg/OnBsdXN8c2V8bGl0ZSk/KSg/OiBidWl8XFwpKS9pIC8vIFhpYW9taSBNaVxuICAgICAgICAgICAgXSwgW1tNT0RFTCwgL18vZywgJyAnXSwgW1ZFTkRPUiwgWElBT01JXSwgW1RZUEUsIE1PQklMRV1dLCBbXG4gICAgICAgICAgICAvXFxiKG1pWy1fIF0/KD86cGFkKSg/OltcXHdfIF0rKSkoPzogYnVpfFxcKSkvaSAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1pIFBhZCB0YWJsZXRzXG4gICAgICAgICAgICBdLFtbTU9ERUwsIC9fL2csICcgJ10sIFtWRU5ET1IsIFhJQU9NSV0sIFtUWVBFLCBUQUJMRVRdXSwgW1xuXG4gICAgICAgICAgICAvLyBPUFBPXG4gICAgICAgICAgICAvOyAoXFx3KykgYnVpLisgb3Bwby9pLFxuICAgICAgICAgICAgL1xcYihjcGhbMTJdXFxkezN9fHAoPzphZnxjW2FsXXxkXFx3fGVbYXJdKVttdF1cXGQwfHg5MDA3fGExMDFvcClcXGIvaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnT1BQTyddLCBbVFlQRSwgTU9CSUxFXV0sIFtcblxuICAgICAgICAgICAgLy8gVml2b1xuICAgICAgICAgICAgL3Zpdm8gKFxcdyspKD86IGJ1aXxcXCkpL2ksXG4gICAgICAgICAgICAvXFxiKHZbMTJdXFxkezN9XFx3P1thdF0pKD86IGJ1aXw7KS9pXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdWaXZvJ10sIFtUWVBFLCBNT0JJTEVdXSwgW1xuXG4gICAgICAgICAgICAvLyBSZWFsbWVcbiAgICAgICAgICAgIC9cXGIocm14WzEyXVxcZHszfSkoPzogYnVpfDt8XFwpKS9pXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdSZWFsbWUnXSwgW1RZUEUsIE1PQklMRV1dLCBbXG5cbiAgICAgICAgICAgIC8vIE1vdG9yb2xhXG4gICAgICAgICAgICAvXFxiKG1pbGVzdG9uZXxkcm9pZCg/OlsyLTR4XXwgKD86YmlvbmljfHgyfHByb3xyYXpyKSk/Oj8oIDRnKT8pXFxiW1xcdyBdK2J1aWxkXFwvL2ksXG4gICAgICAgICAgICAvXFxibW90KD86b3JvbGEpP1stIF0oXFx3KikvaSxcbiAgICAgICAgICAgIC8oKD86bW90b1tcXHdcXChcXCkgXSt8eHRcXGR7Myw0fXxuZXh1cyA2KSg/PSBidWl8XFwpKSkvaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBNT1RPUk9MQV0sIFtUWVBFLCBNT0JJTEVdXSwgW1xuICAgICAgICAgICAgL1xcYihtejYwXFxkfHhvb21bMiBdezAsMn0pIGJ1aWxkXFwvL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgTU9UT1JPTEFdLCBbVFlQRSwgVEFCTEVUXV0sIFtcblxuICAgICAgICAgICAgLy8gTEdcbiAgICAgICAgICAgIC8oKD89bGcpP1t2bF1rXFwtP1xcZHszfSkgYnVpfCAzXFwuWy1cXHc7IF17MTB9bGc/LShbMDZjdjldezMsNH0pL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgTEddLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC8obG0oPzotP2YxMDBbbnZdP3wtW1xcd1xcLl0rKSg/PSBidWl8XFwpKXxuZXh1cyBbNDVdKS9pLFxuICAgICAgICAgICAgL1xcYmxnWy1lO1xcLyBdKygoPyFicm93c2VyfG5ldGNhc3R8YW5kcm9pZCB0dilcXHcrKS9pLFxuICAgICAgICAgICAgL1xcYmxnLT8oW1xcZFxcd10rKSBidWkvaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBMR10sIFtUWVBFLCBNT0JJTEVdXSwgW1xuXG4gICAgICAgICAgICAvLyBMZW5vdm9cbiAgICAgICAgICAgIC8oaWRlYXRhYlstXFx3IF0rKS9pLFxuICAgICAgICAgICAgL2xlbm92byA/KHNbNTZdMDAwWy1cXHddK3x0YWIoPzpbXFx3IF0rKXx5dFstXFxkXFx3XXs2fXx0YlstXFxkXFx3XXs2fSkvaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnTGVub3ZvJ10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuXG4gICAgICAgICAgICAvLyBOb2tpYVxuICAgICAgICAgICAgLyg/Om1hZW1vfG5va2lhKS4qKG45MDB8bHVtaWEgXFxkKykvaSxcbiAgICAgICAgICAgIC9ub2tpYVstXyBdPyhbLVxcd1xcLl0qKS9pXG4gICAgICAgICAgICBdLCBbW01PREVMLCAvXy9nLCAnICddLCBbVkVORE9SLCAnTm9raWEnXSwgW1RZUEUsIE1PQklMRV1dLCBbXG5cbiAgICAgICAgICAgIC8vIEdvb2dsZVxuICAgICAgICAgICAgLyhwaXhlbCBjKVxcYi9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gR29vZ2xlIFBpeGVsIENcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgR09PR0xFXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvZHJvaWQuKzsgKHBpeGVsW1xcZGF4bCBdezAsNn0pKD86IGJ1aXxcXCkpL2kgICAgICAgICAgICAgICAgICAgICAgICAgLy8gR29vZ2xlIFBpeGVsXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIEdPT0dMRV0sIFtUWVBFLCBNT0JJTEVdXSwgW1xuXG4gICAgICAgICAgICAvLyBTb255XG4gICAgICAgICAgICAvZHJvaWQuKyAoW2MtZ11cXGR7NH18c29bLWdsXVxcdyt8eHEtYVxcd1s0LTddWzEyXSkoPz0gYnVpfFxcKS4rY2hyb21lXFwvKD8hWzEtNl17MCwxfVxcZFxcLikpL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgU09OWV0sIFtUWVBFLCBNT0JJTEVdXSwgW1xuICAgICAgICAgICAgL3NvbnkgdGFibGV0IFtwc10vaSxcbiAgICAgICAgICAgIC9cXGIoPzpzb255KT9zZ3BcXHcrKD86IGJ1aXxcXCkpL2lcbiAgICAgICAgICAgIF0sIFtbTU9ERUwsICdYcGVyaWEgVGFibGV0J10sIFtWRU5ET1IsIFNPTlldLCBbVFlQRSwgVEFCTEVUXV0sIFtcblxuICAgICAgICAgICAgLy8gT25lUGx1c1xuICAgICAgICAgICAgLyAoa2IyMDA1fGluMjBbMTJdNXxiZTIwWzEyXVs1OV0pXFxiL2ksXG4gICAgICAgICAgICAvKD86b25lKT8oPzpwbHVzKT8gKGFcXGQwXFxkXFxkKSg/OiBifFxcKSkvaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnT25lUGx1cyddLCBbVFlQRSwgTU9CSUxFXV0sIFtcblxuICAgICAgICAgICAgLy8gQW1hem9uXG4gICAgICAgICAgICAvKGFsZXhhKXdlYm0vaSxcbiAgICAgICAgICAgIC8oa2ZbYS16XXsyfXdpKSggYnVpfFxcKSkvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEtpbmRsZSBGaXJlIHdpdGhvdXQgU2lsa1xuICAgICAgICAgICAgLyhrZlthLXpdKykoIGJ1aXxcXCkpLitzaWxrXFwvL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEtpbmRsZSBGaXJlIEhEXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIEFNQVpPTl0sIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgLygoPzpzZHxrZilbMDM0OWhpam9yc3R1d10rKSggYnVpfFxcKSkuK3NpbGtcXC8vaSAgICAgICAgICAgICAgICAgICAgIC8vIEZpcmUgUGhvbmVcbiAgICAgICAgICAgIF0sIFtbTU9ERUwsIC8oLispL2csICdGaXJlIFBob25lICQxJ10sIFtWRU5ET1IsIEFNQVpPTl0sIFtUWVBFLCBNT0JJTEVdXSwgW1xuXG4gICAgICAgICAgICAvLyBCbGFja0JlcnJ5XG4gICAgICAgICAgICAvKHBsYXlib29rKTtbLVxcd1xcKSw7IF0rKHJpbSkvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQmxhY2tCZXJyeSBQbGF5Qm9va1xuICAgICAgICAgICAgXSwgW01PREVMLCBWRU5ET1IsIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgL1xcYigoPzpiYlthLWZdfHN0W2h2XSkxMDAtXFxkKS9pLFxuICAgICAgICAgICAgL1xcKGJiMTA7IChcXHcrKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEJsYWNrQmVycnkgMTBcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgQkxBQ0tCRVJSWV0sIFtUWVBFLCBNT0JJTEVdXSwgW1xuXG4gICAgICAgICAgICAvLyBBc3VzXG4gICAgICAgICAgICAvKD86XFxifGFzdXNfKSh0cmFuc2ZvW3ByaW1lIF17NCwxMH0gXFx3K3xlZWVwY3xzbGlkZXIgXFx3K3xuZXh1cyA3fHBhZGZvbmV8cDAwW2NqXSkvaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBBU1VTXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvICh6W2Jlc102WzAyN11bMDEyXVtrbV1bbHNdfHplbmZvbmUgXFxkXFx3PylcXGIvaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBBU1VTXSwgW1RZUEUsIE1PQklMRV1dLCBbXG5cbiAgICAgICAgICAgIC8vIEhUQ1xuICAgICAgICAgICAgLyhuZXh1cyA5KS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBIVEMgTmV4dXMgOVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnSFRDJ10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgLyhodGMpWy07XyBdezEsMn0oW1xcdyBdKyg/PVxcKXwgYnVpKXxcXHcrKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAvLyBIVENcblxuICAgICAgICAgICAgLy8gWlRFXG4gICAgICAgICAgICAvKHp0ZSlbLSBdKFtcXHcgXSs/KSg/OiBidWl8XFwvfFxcKSkvaSxcbiAgICAgICAgICAgIC8oYWxjYXRlbHxnZWVrc3Bob25lfG5leGlhbnxwYW5hc29uaWN8c29ueSlbLV8gXT8oWy1cXHddKikvaSAgICAgICAgIC8vIEFsY2F0ZWwvR2Vla3NQaG9uZS9OZXhpYW4vUGFuYXNvbmljL1NvbnlcbiAgICAgICAgICAgIF0sIFtWRU5ET1IsIFtNT0RFTCwgL18vZywgJyAnXSwgW1RZUEUsIE1PQklMRV1dLCBbXG5cbiAgICAgICAgICAgIC8vIEFjZXJcbiAgICAgICAgICAgIC9kcm9pZC4rOyAoW2FiXVsxLTddLT9bMDE3OGFdXFxkXFxkPykvaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnQWNlciddLCBbVFlQRSwgVEFCTEVUXV0sIFtcblxuICAgICAgICAgICAgLy8gTWVpenVcbiAgICAgICAgICAgIC9kcm9pZC4rOyAobVsxLTVdIG5vdGUpIGJ1aS9pLFxuICAgICAgICAgICAgL1xcYm16LShbLVxcd117Mix9KS9pXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdNZWl6dSddLCBbVFlQRSwgTU9CSUxFXV0sIFtcblxuICAgICAgICAgICAgLy8gU2hhcnBcbiAgICAgICAgICAgIC9cXGIoc2gtP1thbHR2el0/XFxkXFxkW2EtZWttXT8pL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ1NoYXJwJ10sIFtUWVBFLCBNT0JJTEVdXSwgW1xuXG4gICAgICAgICAgICAvLyBNSVhFRFxuICAgICAgICAgICAgLyhibGFja2JlcnJ5fGJlbnF8cGFsbSg/PVxcLSl8c29ueWVyaWNzc29ufGFjZXJ8YXN1c3xkZWxsfG1laXp1fG1vdG9yb2xhfHBvbHl0cm9uKVstXyBdPyhbLVxcd10qKS9pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBCbGFja0JlcnJ5L0JlblEvUGFsbS9Tb255LUVyaWNzc29uL0FjZXIvQXN1cy9EZWxsL01laXp1L01vdG9yb2xhL1BvbHl0cm9uXG4gICAgICAgICAgICAvKGhwKSAoW1xcdyBdK1xcdykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSFAgaVBBUVxuICAgICAgICAgICAgLyhhc3VzKS0/KFxcdyspL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQXN1c1xuICAgICAgICAgICAgLyhtaWNyb3NvZnQpOyAobHVtaWFbXFx3IF0rKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTWljcm9zb2Z0IEx1bWlhXG4gICAgICAgICAgICAvKGxlbm92bylbLV8gXT8oWy1cXHddKykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBMZW5vdm9cbiAgICAgICAgICAgIC8oam9sbGEpL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSm9sbGFcbiAgICAgICAgICAgIC8ob3BwbykgPyhbXFx3IF0rKSBidWkvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE9QUE9cbiAgICAgICAgICAgIF0sIFtWRU5ET1IsIE1PREVMLCBbVFlQRSwgTU9CSUxFXV0sIFtcblxuICAgICAgICAgICAgLyhhcmNob3MpIChnYW1lcGFkMj8pL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBcmNob3NcbiAgICAgICAgICAgIC8oaHApLisodG91Y2hwYWQoPyEuK3RhYmxldCl8dGFibGV0KS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSFAgVG91Y2hQYWRcbiAgICAgICAgICAgIC8oa2luZGxlKVxcLyhbXFx3XFwuXSspL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gS2luZGxlXG4gICAgICAgICAgICAvKG5vb2spW1xcdyBdK2J1aWxkXFwvKFxcdyspL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE5vb2tcbiAgICAgICAgICAgIC8oZGVsbCkgKHN0cmVhW2twclxcZCBdKltcXGRrb10pL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBEZWxsIFN0cmVha1xuICAgICAgICAgICAgLyhsZVstIF0rcGFuKVstIF0rKFxcd3sxLDl9KSBidWkvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTGUgUGFuIFRhYmxldHNcbiAgICAgICAgICAgIC8odHJpbml0eSlbLSBdKih0XFxkezN9KSBidWkvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRyaW5pdHkgVGFibGV0c1xuICAgICAgICAgICAgLyhnaWdhc2V0KVstIF0rKHFcXHd7MSw5fSkgYnVpL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gR2lnYXNldCBUYWJsZXRzXG4gICAgICAgICAgICAvKHZvZGFmb25lKSAoW1xcdyBdKykoPzpcXCl8IGJ1aSkvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVm9kYWZvbmVcbiAgICAgICAgICAgIF0sIFtWRU5ET1IsIE1PREVMLCBbVFlQRSwgVEFCTEVUXV0sIFtcblxuICAgICAgICAgICAgLyhzdXJmYWNlIGR1bykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTdXJmYWNlIER1b1xuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBNSUNST1NPRlRdLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC9kcm9pZCBbXFxkXFwuXSs7IChmcFxcZHU/KSg/OiBifFxcKSkvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZhaXJwaG9uZVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnRmFpcnBob25lJ10sIFtUWVBFLCBNT0JJTEVdXSwgW1xuICAgICAgICAgICAgLyh1MzA0YWEpL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBVCZUXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdBVCZUJ10sIFtUWVBFLCBNT0JJTEVdXSwgW1xuICAgICAgICAgICAgL1xcYnNpZS0oXFx3KikvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNpZW1lbnNcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ1NpZW1lbnMnXSwgW1RZUEUsIE1PQklMRV1dLCBbXG4gICAgICAgICAgICAvXFxiKHJjdFxcdyspIGIvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUkNBIFRhYmxldHNcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ1JDQSddLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC9cXGIodmVudWVbXFxkIF17Miw3fSkgYi9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBEZWxsIFZlbnVlIFRhYmxldHNcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ0RlbGwnXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvXFxiKHEoPzptdnx0YSlcXHcrKSBiL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVmVyaXpvbiBUYWJsZXRcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ1Zlcml6b24nXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvXFxiKD86YmFybmVzWyYgXStub2JsZSB8Ym5bcnRdKShbXFx3XFwrIF0qKSBiL2kgICAgICAgICAgICAgICAgICAgICAgIC8vIEJhcm5lcyAmIE5vYmxlIFRhYmxldFxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnQmFybmVzICYgTm9ibGUnXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvXFxiKHRtXFxkezN9XFx3KykgYi9pXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdOdVZpc2lvbiddLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC9cXGIoazg4KSBiL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFpURSBLIFNlcmllcyBUYWJsZXRcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ1pURSddLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC9cXGIobnhcXGR7M31qKSBiL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBaVEUgTnViaWFcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ1pURSddLCBbVFlQRSwgTU9CSUxFXV0sIFtcbiAgICAgICAgICAgIC9cXGIoZ2VuXFxkezN9KSBiLis0OWgvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTd2lzcyBHRU4gTW9iaWxlXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdTd2lzcyddLCBbVFlQRSwgTU9CSUxFXV0sIFtcbiAgICAgICAgICAgIC9cXGIoenVyXFxkezN9KSBiL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTd2lzcyBaVVIgVGFibGV0XG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdTd2lzcyddLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC9cXGIoKHpla2kpP3RiLipcXGIpIGIvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBaZWtpIFRhYmxldHNcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ1pla2knXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvXFxiKFt5cl1cXGR7Mn0pIGIvaSxcbiAgICAgICAgICAgIC9cXGIoZHJhZ29uWy0gXSt0b3VjaCB8ZHQpKFxcd3s1fSkgYi9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBEcmFnb24gVG91Y2ggVGFibGV0XG4gICAgICAgICAgICBdLCBbW1ZFTkRPUiwgJ0RyYWdvbiBUb3VjaCddLCBNT0RFTCwgW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvXFxiKG5zLT9cXHd7MCw5fSkgYi9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSW5zaWduaWEgVGFibGV0c1xuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnSW5zaWduaWEnXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvXFxiKChueGF8bmV4dCktP1xcd3swLDl9KSBiL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTmV4dEJvb2sgVGFibGV0c1xuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnTmV4dEJvb2snXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvXFxiKHh0cmVtZVxcXyk/KHYoMVswNDVdfDJbMDE1XXxbMzQ2OV0wfDdbMDVdKSkgYi9pICAgICAgICAgICAgICAgICAgLy8gVm9pY2UgWHRyZW1lIFBob25lc1xuICAgICAgICAgICAgXSwgW1tWRU5ET1IsICdWb2ljZSddLCBNT0RFTCwgW1RZUEUsIE1PQklMRV1dLCBbXG4gICAgICAgICAgICAvXFxiKGx2dGVsXFwtKT8odjFbMTJdKSBiL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTHZUZWwgUGhvbmVzXG4gICAgICAgICAgICBdLCBbW1ZFTkRPUiwgJ0x2VGVsJ10sIE1PREVMLCBbVFlQRSwgTU9CSUxFXV0sIFtcbiAgICAgICAgICAgIC9cXGIocGgtMSkgL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEVzc2VudGlhbCBQSC0xXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdFc3NlbnRpYWwnXSwgW1RZUEUsIE1PQklMRV1dLCBbXG4gICAgICAgICAgICAvXFxiKHYoMTAwbWR8NzAwbmF8NzAxMXw5MTdnKS4qXFxiKSBiL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRW52aXplbiBUYWJsZXRzXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdFbnZpemVuJ10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgL1xcYih0cmlvWy1cXHdcXC4gXSspIGIvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBNYWNoU3BlZWQgVGFibGV0c1xuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnTWFjaFNwZWVkJ10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgL1xcYnR1XygxNDkxKSBiL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUm90b3IgVGFibGV0c1xuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnUm90b3InXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvKHNoaWVsZFtcXHcgXSspIGIvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBOdmlkaWEgU2hpZWxkIFRhYmxldHNcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ052aWRpYSddLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC8oc3ByaW50KSAoXFx3KykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNwcmludCBQaG9uZXNcbiAgICAgICAgICAgIF0sIFtWRU5ET1IsIE1PREVMLCBbVFlQRSwgTU9CSUxFXV0sIFtcbiAgICAgICAgICAgIC8oa2luXFwuW29uZXR3XXszfSkvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1pY3Jvc29mdCBLaW5cbiAgICAgICAgICAgIF0sIFtbTU9ERUwsIC9cXC4vZywgJyAnXSwgW1ZFTkRPUiwgTUlDUk9TT0ZUXSwgW1RZUEUsIE1PQklMRV1dLCBbXG4gICAgICAgICAgICAvZHJvaWQuKzsgKGNjNjY2Nj98ZXQ1WzE2XXxtY1syMzldWzIzXXg/fHZjOFswM114PylcXCkvaSAgICAgICAgICAgICAvLyBaZWJyYVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBaRUJSQV0sIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgL2Ryb2lkLis7IChlYzMwfHBzMjB8dGNbMi04XVxcZFtreF0pXFwpL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgWkVCUkFdLCBbVFlQRSwgTU9CSUxFXV0sIFtcblxuICAgICAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgICAgICAgICAgLy8gQ09OU09MRVNcbiAgICAgICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgICAgICAgLyhvdXlhKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBPdXlhXG4gICAgICAgICAgICAvKG5pbnRlbmRvKSAoW3dpZHMzdXRjaF0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE5pbnRlbmRvXG4gICAgICAgICAgICBdLCBbVkVORE9SLCBNT0RFTCwgW1RZUEUsIENPTlNPTEVdXSwgW1xuICAgICAgICAgICAgL2Ryb2lkLis7IChzaGllbGQpIGJ1aS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBOdmlkaWFcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ052aWRpYSddLCBbVFlQRSwgQ09OU09MRV1dLCBbXG4gICAgICAgICAgICAvKHBsYXlzdGF0aW9uIFszNDVwb3J0YWJsZXZpXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFBsYXlzdGF0aW9uXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIFNPTlldLCBbVFlQRSwgQ09OU09MRV1dLCBbXG4gICAgICAgICAgICAvXFxiKHhib3goPzogb25lKT8oPyE7IHhib3gpKVtcXCk7IF0vaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTWljcm9zb2Z0IFhib3hcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgTUlDUk9TT0ZUXSwgW1RZUEUsIENPTlNPTEVdXSwgW1xuXG4gICAgICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgICAgICAgICAvLyBTTUFSVFRWU1xuICAgICAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICAgICAgICAvc21hcnQtdHYuKyhzYW1zdW5nKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNhbXN1bmdcbiAgICAgICAgICAgIF0sIFtWRU5ET1IsIFtUWVBFLCBTTUFSVFRWXV0sIFtcbiAgICAgICAgICAgIC9oYmJ0di4rbWFwbGU7KFxcZCspL2lcbiAgICAgICAgICAgIF0sIFtbTU9ERUwsIC9eLywgJ1NtYXJ0VFYnXSwgW1ZFTkRPUiwgU0FNU1VOR10sIFtUWVBFLCBTTUFSVFRWXV0sIFtcbiAgICAgICAgICAgIC8obnV4OyBuZXRjYXN0LitzbWFydHR2fGxnIChuZXRjYXN0XFwudHYtMjAxXFxkfGFuZHJvaWQgdHYpKS9pICAgICAgICAvLyBMRyBTbWFydFRWXG4gICAgICAgICAgICBdLCBbW1ZFTkRPUiwgTEddLCBbVFlQRSwgU01BUlRUVl1dLCBbXG4gICAgICAgICAgICAvKGFwcGxlKSA/dHYvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFwcGxlIFRWXG4gICAgICAgICAgICBdLCBbVkVORE9SLCBbTU9ERUwsIEFQUExFKycgVFYnXSwgW1RZUEUsIFNNQVJUVFZdXSwgW1xuICAgICAgICAgICAgL2Nya2V5L2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBHb29nbGUgQ2hyb21lY2FzdFxuICAgICAgICAgICAgXSwgW1tNT0RFTCwgQ0hST01FKydjYXN0J10sIFtWRU5ET1IsIEdPT0dMRV0sIFtUWVBFLCBTTUFSVFRWXV0sIFtcbiAgICAgICAgICAgIC9kcm9pZC4rYWZ0KFxcdykoIGJ1aXxcXCkpL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBGaXJlIFRWXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIEFNQVpPTl0sIFtUWVBFLCBTTUFSVFRWXV0sIFtcbiAgICAgICAgICAgIC9cXChkdHZbXFwpO10uKyhhcXVvcykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTaGFycFxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnU2hhcnAnXSwgW1RZUEUsIFNNQVJUVFZdXSwgW1xuICAgICAgICAgICAgL1xcYihyb2t1KVtcXGR4XSpbXFwpXFwvXSgoPzpkdnAtKT9bXFxkXFwuXSopL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBSb2t1XG4gICAgICAgICAgICAvaGJidHZcXC9cXGQrXFwuXFxkK1xcLlxcZCsgK1xcKFtcXHcgXSo7ICooXFx3W147XSopOyhbXjtdKikvaSAgICAgICAgICAgICAgIC8vIEhiYlRWIGRldmljZXNcbiAgICAgICAgICAgIF0sIFtbVkVORE9SLCB0cmltXSwgW01PREVMLCB0cmltXSwgW1RZUEUsIFNNQVJUVFZdXSwgW1xuICAgICAgICAgICAgL1xcYihhbmRyb2lkIHR2fHNtYXJ0Wy0gXT90dnxvcGVyYSB0dnx0djsgcnY6KVxcYi9pICAgICAgICAgICAgICAgICAgIC8vIFNtYXJ0VFYgZnJvbSBVbmlkZW50aWZpZWQgVmVuZG9yc1xuICAgICAgICAgICAgXSwgW1tUWVBFLCBTTUFSVFRWXV0sIFtcblxuICAgICAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgICAgICAgICAgLy8gV0VBUkFCTEVTXG4gICAgICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgICAgICAgIC8oKHBlYmJsZSkpYXBwL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUGViYmxlXG4gICAgICAgICAgICBdLCBbVkVORE9SLCBNT0RFTCwgW1RZUEUsIFdFQVJBQkxFXV0sIFtcbiAgICAgICAgICAgIC9kcm9pZC4rOyAoZ2xhc3MpIFxcZC9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEdvb2dsZSBHbGFzc1xuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBHT09HTEVdLCBbVFlQRSwgV0VBUkFCTEVdXSwgW1xuICAgICAgICAgICAgL2Ryb2lkLis7ICh3dDYzPzB7MiwzfSlcXCkvaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBaRUJSQV0sIFtUWVBFLCBXRUFSQUJMRV1dLCBbXG4gICAgICAgICAgICAvKHF1ZXN0KCAyKT8pL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE9jdWx1cyBRdWVzdFxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBGQUNFQk9PS10sIFtUWVBFLCBXRUFSQUJMRV1dLCBbXG5cbiAgICAgICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAgICAgICAgIC8vIEVNQkVEREVEXG4gICAgICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgICAgICAgIC8odGVzbGEpKD86IHF0Y2FyYnJvd3NlcnxcXC9bLVxcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGVzbGFcbiAgICAgICAgICAgIF0sIFtWRU5ET1IsIFtUWVBFLCBFTUJFRERFRF1dLCBbXG5cbiAgICAgICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgICAgICAgICAvLyBNSVhFRCAoR0VORVJJQylcbiAgICAgICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgICAgICAgL2Ryb2lkIC4rPzsgKFteO10rPykoPzogYnVpfFxcKSBhcHBsZXcpLis/IG1vYmlsZSBzYWZhcmkvaSAgICAgICAgICAgLy8gQW5kcm9pZCBQaG9uZXMgZnJvbSBVbmlkZW50aWZpZWQgVmVuZG9yc1xuICAgICAgICAgICAgXSwgW01PREVMLCBbVFlQRSwgTU9CSUxFXV0sIFtcbiAgICAgICAgICAgIC9kcm9pZCAuKz87IChbXjtdKz8pKD86IGJ1aXxcXCkgYXBwbGV3KS4rPyg/ISBtb2JpbGUpIHNhZmFyaS9pICAgICAgIC8vIEFuZHJvaWQgVGFibGV0cyBmcm9tIFVuaWRlbnRpZmllZCBWZW5kb3JzXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgL1xcYigodGFibGV0fHRhYilbO1xcL118Zm9jdXNcXC9cXGQoPyEuK21vYmlsZSkpL2kgICAgICAgICAgICAgICAgICAgICAgLy8gVW5pZGVudGlmaWFibGUgVGFibGV0XG4gICAgICAgICAgICBdLCBbW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvKHBob25lfG1vYmlsZSg/Ols7XFwvXXwgc2FmYXJpKXxwZGEoPz0uK3dpbmRvd3MgY2UpKS9pICAgICAgICAgICAgICAvLyBVbmlkZW50aWZpYWJsZSBNb2JpbGVcbiAgICAgICAgICAgIF0sIFtbVFlQRSwgTU9CSUxFXV0sIFtcbiAgICAgICAgICAgIC8oYW5kcm9pZFstXFx3XFwuIF17MCw5fSk7LitidWlsL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBHZW5lcmljIEFuZHJvaWQgRGV2aWNlXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdHZW5lcmljJ11dXG4gICAgICAgIF0sXG5cbiAgICAgICAgZW5naW5lIDogW1tcblxuICAgICAgICAgICAgL3dpbmRvd3MuKyBlZGdlXFwvKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEVkZ2VIVE1MXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsIEVER0UrJ0hUTUwnXV0sIFtcblxuICAgICAgICAgICAgL3dlYmtpdFxcLzUzN1xcLjM2LitjaHJvbWVcXC8oPyEyNykoW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEJsaW5rXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsICdCbGluayddXSwgW1xuXG4gICAgICAgICAgICAvKHByZXN0bylcXC8oW1xcd1xcLl0rKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFByZXN0b1xuICAgICAgICAgICAgLyh3ZWJraXR8dHJpZGVudHxuZXRmcm9udHxuZXRzdXJmfGFtYXlhfGx5bnh8dzNtfGdvYW5uYSlcXC8oW1xcd1xcLl0rKS9pLCAvLyBXZWJLaXQvVHJpZGVudC9OZXRGcm9udC9OZXRTdXJmL0FtYXlhL0x5bngvdzNtL0dvYW5uYVxuICAgICAgICAgICAgL2VraW9oKGZsb3cpXFwvKFtcXHdcXC5dKykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBGbG93XG4gICAgICAgICAgICAvKGtodG1sfHRhc21hbnxsaW5rcylbXFwvIF1cXCg/KFtcXHdcXC5dKykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBLSFRNTC9UYXNtYW4vTGlua3NcbiAgICAgICAgICAgIC8oaWNhYilbXFwvIF0oWzIzXVxcLltcXGRcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlDYWJcbiAgICAgICAgICAgIF0sIFtOQU1FLCBWRVJTSU9OXSwgW1xuXG4gICAgICAgICAgICAvcnZcXDooW1xcd1xcLl17MSw5fSlcXGIuKyhnZWNrbykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBHZWNrb1xuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIE5BTUVdXG4gICAgICAgIF0sXG5cbiAgICAgICAgb3MgOiBbW1xuXG4gICAgICAgICAgICAvLyBXaW5kb3dzXG4gICAgICAgICAgICAvbWljcm9zb2Z0ICh3aW5kb3dzKSAodmlzdGF8eHApL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdpbmRvd3MgKGlUdW5lcylcbiAgICAgICAgICAgIF0sIFtOQU1FLCBWRVJTSU9OXSwgW1xuICAgICAgICAgICAgLyh3aW5kb3dzKSBudCA2XFwuMjsgKGFybSkvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gV2luZG93cyBSVFxuICAgICAgICAgICAgLyh3aW5kb3dzICg/OnBob25lKD86IG9zKT98bW9iaWxlKSlbXFwvIF0/KFtcXGRcXC5cXHcgXSopL2ksICAgICAgICAgICAgLy8gV2luZG93cyBQaG9uZVxuICAgICAgICAgICAgLyh3aW5kb3dzKVtcXC8gXT8oW250Y2VcXGRcXC4gXStcXHcpKD8hLit4Ym94KS9pXG4gICAgICAgICAgICBdLCBbTkFNRSwgW1ZFUlNJT04sIHN0ck1hcHBlciwgd2luZG93c1ZlcnNpb25NYXBdXSwgW1xuICAgICAgICAgICAgLyh3aW4oPz0zfDl8bil8d2luIDl4ICkoW250XFxkXFwuXSspL2lcbiAgICAgICAgICAgIF0sIFtbTkFNRSwgJ1dpbmRvd3MnXSwgW1ZFUlNJT04sIHN0ck1hcHBlciwgd2luZG93c1ZlcnNpb25NYXBdXSwgW1xuXG4gICAgICAgICAgICAvLyBpT1MvbWFjT1NcbiAgICAgICAgICAgIC9pcFtob25lYWRdezIsNH1cXGIoPzouKm9zIChbXFx3XSspIGxpa2UgbWFjfDsgb3BlcmEpL2ksICAgICAgICAgICAgICAvLyBpT1NcbiAgICAgICAgICAgIC9jZm5ldHdvcmtcXC8uK2Rhcndpbi9pXG4gICAgICAgICAgICBdLCBbW1ZFUlNJT04sIC9fL2csICcuJ10sIFtOQU1FLCAnaU9TJ11dLCBbXG4gICAgICAgICAgICAvKG1hYyBvcyB4KSA/KFtcXHdcXC4gXSopL2ksXG4gICAgICAgICAgICAvKG1hY2ludG9zaHxtYWNfcG93ZXJwY1xcYikoPyEuK2hhaWt1KS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBNYWMgT1NcbiAgICAgICAgICAgIF0sIFtbTkFNRSwgJ01hYyBPUyddLCBbVkVSU0lPTiwgL18vZywgJy4nXV0sIFtcblxuICAgICAgICAgICAgLy8gTW9iaWxlIE9TZXNcbiAgICAgICAgICAgIC9kcm9pZCAoW1xcd1xcLl0rKVxcYi4rKGFuZHJvaWRbLSBdeDg2KS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQW5kcm9pZC14ODZcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBOQU1FXSwgWyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQW5kcm9pZC9XZWJPUy9RTlgvQmFkYS9SSU0vTWFlbW8vTWVlR28vU2FpbGZpc2ggT1NcbiAgICAgICAgICAgIC8oYW5kcm9pZHx3ZWJvc3xxbnh8YmFkYXxyaW0gdGFibGV0IG9zfG1hZW1vfG1lZWdvfHNhaWxmaXNoKVstXFwvIF0/KFtcXHdcXC5dKikvaSxcbiAgICAgICAgICAgIC8oYmxhY2tiZXJyeSlcXHcqXFwvKFtcXHdcXC5dKikvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEJsYWNrYmVycnlcbiAgICAgICAgICAgIC8odGl6ZW58a2Fpb3MpW1xcLyBdKFtcXHdcXC5dKykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGl6ZW4vS2FpT1NcbiAgICAgICAgICAgIC9cXCgoc2VyaWVzNDApOy9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNlcmllcyA0MFxuICAgICAgICAgICAgXSwgW05BTUUsIFZFUlNJT05dLCBbXG4gICAgICAgICAgICAvXFwoYmIoMTApOy9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBCbGFja0JlcnJ5IDEwXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsIEJMQUNLQkVSUlldXSwgW1xuICAgICAgICAgICAgLyg/OnN5bWJpYW4gP29zfHN5bWJvc3xzNjAoPz07KXxzZXJpZXM2MClbLVxcLyBdPyhbXFx3XFwuXSopL2kgICAgICAgICAvLyBTeW1iaWFuXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsICdTeW1iaWFuJ11dLCBbXG4gICAgICAgICAgICAvbW96aWxsYVxcL1tcXGRcXC5dKyBcXCgoPzptb2JpbGV8dGFibGV0fHR2fG1vYmlsZTsgW1xcdyBdKyk7IHJ2Oi4rIGdlY2tvXFwvKFtcXHdcXC5dKykvaSAvLyBGaXJlZm94IE9TXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsIEZJUkVGT1grJyBPUyddXSwgW1xuICAgICAgICAgICAgL3dlYjBzOy4rcnQodHYpL2ksXG4gICAgICAgICAgICAvXFxiKD86aHApP3dvcyg/OmJyb3dzZXIpP1xcLyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBXZWJPU1xuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCAnd2ViT1MnXV0sIFtcblxuICAgICAgICAgICAgLy8gR29vZ2xlIENocm9tZWNhc3RcbiAgICAgICAgICAgIC9jcmtleVxcLyhbXFxkXFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gR29vZ2xlIENocm9tZWNhc3RcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgQ0hST01FKydjYXN0J11dLCBbXG4gICAgICAgICAgICAvKGNyb3MpIFtcXHddKyAoW1xcd1xcLl0rXFx3KS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDaHJvbWl1bSBPU1xuICAgICAgICAgICAgXSwgW1tOQU1FLCAnQ2hyb21pdW0gT1MnXSwgVkVSU0lPTl0sW1xuXG4gICAgICAgICAgICAvLyBDb25zb2xlXG4gICAgICAgICAgICAvKG5pbnRlbmRvfHBsYXlzdGF0aW9uKSAoW3dpZHMzNDVwb3J0YWJsZXZ1Y2hdKykvaSwgICAgICAgICAgICAgICAgIC8vIE5pbnRlbmRvL1BsYXlzdGF0aW9uXG4gICAgICAgICAgICAvKHhib3gpOyAreGJveCAoW15cXCk7XSspL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBNaWNyb3NvZnQgWGJveCAoMzYwLCBPbmUsIFgsIFMsIFNlcmllcyBYLCBTZXJpZXMgUylcblxuICAgICAgICAgICAgLy8gT3RoZXJcbiAgICAgICAgICAgIC9cXGIoam9saXxwYWxtKVxcYiA/KD86b3MpP1xcLz8oW1xcd1xcLl0qKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBKb2xpL1BhbG1cbiAgICAgICAgICAgIC8obWludClbXFwvXFwoXFwpIF0/KFxcdyopL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1pbnRcbiAgICAgICAgICAgIC8obWFnZWlhfHZlY3RvcmxpbnV4KVs7IF0vaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTWFnZWlhL1ZlY3RvckxpbnV4XG4gICAgICAgICAgICAvKFtreGxuXT91YnVudHV8ZGViaWFufHN1c2V8b3BlbnN1c2V8Z2VudG9vfGFyY2goPz0gbGludXgpfHNsYWNrd2FyZXxmZWRvcmF8bWFuZHJpdmF8Y2VudG9zfHBjbGludXhvc3xyZWQgP2hhdHx6ZW53YWxrfGxpbnB1c3xyYXNwYmlhbnxwbGFuIDl8bWluaXh8cmlzYyBvc3xjb250aWtpfGRlZXBpbnxtYW5qYXJvfGVsZW1lbnRhcnkgb3N8c2FiYXlvbnxsaW5zcGlyZSkoPzogZ251XFwvbGludXgpPyg/OiBlbnRlcnByaXNlKT8oPzpbLSBdbGludXgpPyg/Oi1nbnUpP1stXFwvIF0/KD8hY2hyb218cGFja2FnZSkoWy1cXHdcXC5dKikvaSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVWJ1bnR1L0RlYmlhbi9TVVNFL0dlbnRvby9BcmNoL1NsYWNrd2FyZS9GZWRvcmEvTWFuZHJpdmEvQ2VudE9TL1BDTGludXhPUy9SZWRIYXQvWmVud2Fsay9MaW5wdXMvUmFzcGJpYW4vUGxhbjkvTWluaXgvUklTQ09TL0NvbnRpa2kvRGVlcGluL01hbmphcm8vZWxlbWVudGFyeS9TYWJheW9uL0xpbnNwaXJlXG4gICAgICAgICAgICAvKGh1cmR8bGludXgpID8oW1xcd1xcLl0qKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSHVyZC9MaW51eFxuICAgICAgICAgICAgLyhnbnUpID8oW1xcd1xcLl0qKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEdOVVxuICAgICAgICAgICAgL1xcYihbLWZyZW50b3BjZ2hzXXswLDV9YnNkfGRyYWdvbmZseSlbXFwvIF0/KD8hYW1kfFtpeDM0Nl17MSwyfTg2KShbXFx3XFwuXSopL2ksIC8vIEZyZWVCU0QvTmV0QlNEL09wZW5CU0QvUEMtQlNEL0dob3N0QlNEL0RyYWdvbkZseVxuICAgICAgICAgICAgLyhoYWlrdSkgKFxcdyspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSGFpa3VcbiAgICAgICAgICAgIF0sIFtOQU1FLCBWRVJTSU9OXSwgW1xuICAgICAgICAgICAgLyhzdW5vcykgPyhbXFx3XFwuXFxkXSopL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTb2xhcmlzXG4gICAgICAgICAgICBdLCBbW05BTUUsICdTb2xhcmlzJ10sIFZFUlNJT05dLCBbXG4gICAgICAgICAgICAvKCg/Om9wZW4pP3NvbGFyaXMpWy1cXC8gXT8oW1xcd1xcLl0qKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNvbGFyaXNcbiAgICAgICAgICAgIC8oYWl4KSAoKFxcZCkoPz1cXC58XFwpfCApW1xcd1xcLl0pKi9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBSVhcbiAgICAgICAgICAgIC9cXGIoYmVvc3xvc1xcLzJ8YW1pZ2Fvc3xtb3JwaG9zfG9wZW52bXN8ZnVjaHNpYXxocC11eCkvaSwgICAgICAgICAgICAvLyBCZU9TL09TMi9BbWlnYU9TL01vcnBoT1MvT3BlblZNUy9GdWNoc2lhL0hQLVVYXG4gICAgICAgICAgICAvKHVuaXgpID8oW1xcd1xcLl0qKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVU5JWFxuICAgICAgICAgICAgXSwgW05BTUUsIFZFUlNJT05dXG4gICAgICAgIF1cbiAgICB9O1xuXG4gICAgLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAvLyBDb25zdHJ1Y3RvclxuICAgIC8vLy8vLy8vLy8vLy8vLy9cblxuICAgIHZhciBVQVBhcnNlciA9IGZ1bmN0aW9uICh1YSwgZXh0ZW5zaW9ucykge1xuXG4gICAgICAgIGlmICh0eXBlb2YgdWEgPT09IE9CSl9UWVBFKSB7XG4gICAgICAgICAgICBleHRlbnNpb25zID0gdWE7XG4gICAgICAgICAgICB1YSA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBVQVBhcnNlcikpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgVUFQYXJzZXIodWEsIGV4dGVuc2lvbnMpLmdldFJlc3VsdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIF91YSA9IHVhIHx8ICgodHlwZW9mIHdpbmRvdyAhPT0gVU5ERUZfVFlQRSAmJiB3aW5kb3cubmF2aWdhdG9yICYmIHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50KSA/IHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50IDogRU1QVFkpO1xuICAgICAgICB2YXIgX3JneG1hcCA9IGV4dGVuc2lvbnMgPyBleHRlbmQocmVnZXhlcywgZXh0ZW5zaW9ucykgOiByZWdleGVzO1xuXG4gICAgICAgIHRoaXMuZ2V0QnJvd3NlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBfYnJvd3NlciA9IHt9O1xuICAgICAgICAgICAgX2Jyb3dzZXJbTkFNRV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBfYnJvd3NlcltWRVJTSU9OXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIHJneE1hcHBlci5jYWxsKF9icm93c2VyLCBfdWEsIF9yZ3htYXAuYnJvd3Nlcik7XG4gICAgICAgICAgICBfYnJvd3Nlci5tYWpvciA9IG1ham9yaXplKF9icm93c2VyLnZlcnNpb24pO1xuICAgICAgICAgICAgcmV0dXJuIF9icm93c2VyO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmdldENQVSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBfY3B1ID0ge307XG4gICAgICAgICAgICBfY3B1W0FSQ0hJVEVDVFVSRV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICByZ3hNYXBwZXIuY2FsbChfY3B1LCBfdWEsIF9yZ3htYXAuY3B1KTtcbiAgICAgICAgICAgIHJldHVybiBfY3B1O1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmdldERldmljZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBfZGV2aWNlID0ge307XG4gICAgICAgICAgICBfZGV2aWNlW1ZFTkRPUl0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBfZGV2aWNlW01PREVMXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIF9kZXZpY2VbVFlQRV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICByZ3hNYXBwZXIuY2FsbChfZGV2aWNlLCBfdWEsIF9yZ3htYXAuZGV2aWNlKTtcbiAgICAgICAgICAgIHJldHVybiBfZGV2aWNlO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmdldEVuZ2luZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBfZW5naW5lID0ge307XG4gICAgICAgICAgICBfZW5naW5lW05BTUVdID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgX2VuZ2luZVtWRVJTSU9OXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIHJneE1hcHBlci5jYWxsKF9lbmdpbmUsIF91YSwgX3JneG1hcC5lbmdpbmUpO1xuICAgICAgICAgICAgcmV0dXJuIF9lbmdpbmU7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZ2V0T1MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgX29zID0ge307XG4gICAgICAgICAgICBfb3NbTkFNRV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBfb3NbVkVSU0lPTl0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICByZ3hNYXBwZXIuY2FsbChfb3MsIF91YSwgX3JneG1hcC5vcyk7XG4gICAgICAgICAgICByZXR1cm4gX29zO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmdldFJlc3VsdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdWEgICAgICA6IHRoaXMuZ2V0VUEoKSxcbiAgICAgICAgICAgICAgICBicm93c2VyIDogdGhpcy5nZXRCcm93c2VyKCksXG4gICAgICAgICAgICAgICAgZW5naW5lICA6IHRoaXMuZ2V0RW5naW5lKCksXG4gICAgICAgICAgICAgICAgb3MgICAgICA6IHRoaXMuZ2V0T1MoKSxcbiAgICAgICAgICAgICAgICBkZXZpY2UgIDogdGhpcy5nZXREZXZpY2UoKSxcbiAgICAgICAgICAgICAgICBjcHUgICAgIDogdGhpcy5nZXRDUFUoKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5nZXRVQSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBfdWE7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuc2V0VUEgPSBmdW5jdGlvbiAodWEpIHtcbiAgICAgICAgICAgIF91YSA9ICh0eXBlb2YgdWEgPT09IFNUUl9UWVBFICYmIHVhLmxlbmd0aCA+IFVBX01BWF9MRU5HVEgpID8gdHJpbSh1YSwgVUFfTUFYX0xFTkdUSCkgOiB1YTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLnNldFVBKF91YSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICBVQVBhcnNlci5WRVJTSU9OID0gTElCVkVSU0lPTjtcbiAgICBVQVBhcnNlci5CUk9XU0VSID0gIGVudW1lcml6ZShbTkFNRSwgVkVSU0lPTiwgTUFKT1JdKTtcbiAgICBVQVBhcnNlci5DUFUgPSBlbnVtZXJpemUoW0FSQ0hJVEVDVFVSRV0pO1xuICAgIFVBUGFyc2VyLkRFVklDRSA9IGVudW1lcml6ZShbTU9ERUwsIFZFTkRPUiwgVFlQRSwgQ09OU09MRSwgTU9CSUxFLCBTTUFSVFRWLCBUQUJMRVQsIFdFQVJBQkxFLCBFTUJFRERFRF0pO1xuICAgIFVBUGFyc2VyLkVOR0lORSA9IFVBUGFyc2VyLk9TID0gZW51bWVyaXplKFtOQU1FLCBWRVJTSU9OXSk7XG5cbiAgICAvLy8vLy8vLy8vL1xuICAgIC8vIEV4cG9ydFxuICAgIC8vLy8vLy8vLy9cblxuICAgIC8vIGNoZWNrIGpzIGVudmlyb25tZW50XG4gICAgaWYgKHR5cGVvZihleHBvcnRzKSAhPT0gVU5ERUZfVFlQRSkge1xuICAgICAgICAvLyBub2RlanMgZW52XG4gICAgICAgIGlmICh0eXBlb2YgbW9kdWxlICE9PSBVTkRFRl9UWVBFICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgICAgICAgICBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBVQVBhcnNlcjtcbiAgICAgICAgfVxuICAgICAgICBleHBvcnRzLlVBUGFyc2VyID0gVUFQYXJzZXI7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gcmVxdWlyZWpzIGVudiAob3B0aW9uYWwpXG4gICAgICAgIGlmICh0eXBlb2YoZGVmaW5lKSA9PT0gRlVOQ19UWVBFICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgICAgIGRlZmluZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFVBUGFyc2VyO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHdpbmRvdyAhPT0gVU5ERUZfVFlQRSkge1xuICAgICAgICAgICAgLy8gYnJvd3NlciBlbnZcbiAgICAgICAgICAgIHdpbmRvdy5VQVBhcnNlciA9IFVBUGFyc2VyO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8galF1ZXJ5L1plcHRvIHNwZWNpZmljIChvcHRpb25hbClcbiAgICAvLyBOb3RlOlxuICAgIC8vICAgSW4gQU1EIGVudiB0aGUgZ2xvYmFsIHNjb3BlIHNob3VsZCBiZSBrZXB0IGNsZWFuLCBidXQgalF1ZXJ5IGlzIGFuIGV4Y2VwdGlvbi5cbiAgICAvLyAgIGpRdWVyeSBhbHdheXMgZXhwb3J0cyB0byBnbG9iYWwgc2NvcGUsIHVubGVzcyBqUXVlcnkubm9Db25mbGljdCh0cnVlKSBpcyB1c2VkLFxuICAgIC8vICAgYW5kIHdlIHNob3VsZCBjYXRjaCB0aGF0LlxuICAgIHZhciAkID0gdHlwZW9mIHdpbmRvdyAhPT0gVU5ERUZfVFlQRSAmJiAod2luZG93LmpRdWVyeSB8fCB3aW5kb3cuWmVwdG8pO1xuICAgIGlmICgkICYmICEkLnVhKSB7XG4gICAgICAgIHZhciBwYXJzZXIgPSBuZXcgVUFQYXJzZXIoKTtcbiAgICAgICAgJC51YSA9IHBhcnNlci5nZXRSZXN1bHQoKTtcbiAgICAgICAgJC51YS5nZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VyLmdldFVBKCk7XG4gICAgICAgIH07XG4gICAgICAgICQudWEuc2V0ID0gZnVuY3Rpb24gKHVhKSB7XG4gICAgICAgICAgICBwYXJzZXIuc2V0VUEodWEpO1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHBhcnNlci5nZXRSZXN1bHQoKTtcbiAgICAgICAgICAgIGZvciAodmFyIHByb3AgaW4gcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgJC51YVtwcm9wXSA9IHJlc3VsdFtwcm9wXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnID8gd2luZG93IDogdGhpcyk7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiX193ZWJwYWNrX3JlcXVpcmVfXy5hbWRPID0ge307IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9pbmRleC50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==