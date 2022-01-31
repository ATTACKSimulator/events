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
const remote_1 = __importDefault(__webpack_require__(/*! ./src/remote */ "./src/remote.ts"));
const defaultOptions = {
    events: [],
    debug: false,
    redirectUrl: "https://attacksimulator.com",
    source: "LP",
    url: "https://api-dev.attacksimulator.com",
};
class ATSEvents {
    constructor(options) {
        const _options = Object.assign(Object.assign({}, defaultOptions), options);
        if (_options.debug) {
            console.log(_options);
        }
        const remote = new remote_1.default(_options.apiKey, _options.url, _options.debug);
        this.manager = new Manager_1.Manager(remote, _options.events, _options.source, _options.redirectUrl, _options.debug);
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
    constructor(remote, eventNames, source, redirectUrl, debug = false) {
        this.supportedTypes = ["email", "password", "tel"];
        this.supportedEvents = { "attachment_opened": AttachmentOpen_1.AttachmentOpen, "click": Click_1.Click, "download": Download_1.Download, "file_open": FileOpen_1.FileOpen, "input": Input_1.Input, "page_load": PageLoaded_1.PageLoaded, "page_read": PageRead_1.PageRead, "submit": Submit_1.Submit, };
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
        return new this.supportedEvents[name];
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
        const remoteEvent = this.supportedEvents[eventName];
        if (!remoteEvent) {
            throw new Error(`Unsupported event ${eventName}. Please choose one of ${Object.keys(this.supportedEvents).join(", ")}`);
        }
        this.handle(remoteEvent);
    }
    handle(remoteEvent, event) {
        if (this.debug) {
            console.log(`Event @${remoteEvent.trigger} (${remoteEvent.name}) triggered...`);
        }
        if (event) {
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
            if (remoteEvent.redirectOnFinish) {
                window.location.href = this.redirectUrl;
            }
        });
    }
}
exports.Manager = Manager;


/***/ }),

/***/ "./src/Tools.ts":
/*!**********************!*\
  !*** ./src/Tools.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createUUID = void 0;
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
        return "click";
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
        this.minScrollPercentage = 0.1;
        this.minStaySeconds = 3 * 60 * 1000;
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
        console.log("props");
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
        const h = document.documentElement, b = document.body;
        if (b.scrollHeight < h.scrollHeight) {
            return 1;
        }
        return (h.scrollTop || b.scrollTop) / ((h.scrollHeight || b.scrollHeight) - h.clientHeight) * 100;
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
}
exports.Submit = Submit;


/***/ }),

/***/ "./src/remote.ts":
/*!***********************!*\
  !*** ./src/remote.ts ***!
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
                    const json = JSON.parse(xhr.responseText);
                    resolve(json);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLFFBQWE7QUFDekI7QUFDQTtBQUNBLFFBQVEsZ0JBQWdCO0FBQ3hCLE1BQU07QUFDTjtBQUNBLFlBQVksVUFBYyxrQkFBa0Isd0JBQVU7QUFDdEQsWUFBWSxtQ0FBTztBQUNuQjtBQUNBLGFBQWE7QUFBQSxrR0FBQztBQUNkLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLENBQUM7Ozs7Ozs7VUN6MkJEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBOzs7OztVRUFBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vQVRTRXZlbnRzLy4vaW5kZXgudHMiLCJ3ZWJwYWNrOi8vQVRTRXZlbnRzLy4vc3JjL0Jyb3dzZXJJbmZvLnRzIiwid2VicGFjazovL0FUU0V2ZW50cy8uL3NyYy9DYW1wYWlnbkluZm8udHMiLCJ3ZWJwYWNrOi8vQVRTRXZlbnRzLy4vc3JjL01hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vQVRTRXZlbnRzLy4vc3JjL1Rvb2xzLnRzIiwid2VicGFjazovL0FUU0V2ZW50cy8uL3NyYy9VcmxQYXJzZXIudHMiLCJ3ZWJwYWNrOi8vQVRTRXZlbnRzLy4vc3JjL2V2ZW50cy9BdHRhY2htZW50T3Blbi50cyIsIndlYnBhY2s6Ly9BVFNFdmVudHMvLi9zcmMvZXZlbnRzL0NsaWNrLnRzIiwid2VicGFjazovL0FUU0V2ZW50cy8uL3NyYy9ldmVudHMvRG93bmxvYWQudHMiLCJ3ZWJwYWNrOi8vQVRTRXZlbnRzLy4vc3JjL2V2ZW50cy9GaWxlT3Blbi50cyIsIndlYnBhY2s6Ly9BVFNFdmVudHMvLi9zcmMvZXZlbnRzL0lucHV0LnRzIiwid2VicGFjazovL0FUU0V2ZW50cy8uL3NyYy9ldmVudHMvUGFnZUxvYWRlZC50cyIsIndlYnBhY2s6Ly9BVFNFdmVudHMvLi9zcmMvZXZlbnRzL1BhZ2VSZWFkLnRzIiwid2VicGFjazovL0FUU0V2ZW50cy8uL3NyYy9ldmVudHMvU3VibWl0LnRzIiwid2VicGFjazovL0FUU0V2ZW50cy8uL3NyYy9yZW1vdGUudHMiLCJ3ZWJwYWNrOi8vQVRTRXZlbnRzLy4vbm9kZV9tb2R1bGVzL3VhLXBhcnNlci1qcy9zcmMvdWEtcGFyc2VyLmpzIiwid2VicGFjazovL0FUU0V2ZW50cy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9BVFNFdmVudHMvd2VicGFjay9ydW50aW1lL2FtZCBvcHRpb25zIiwid2VicGFjazovL0FUU0V2ZW50cy93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL0FUU0V2ZW50cy93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vQVRTRXZlbnRzL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNYW5hZ2VyIH0gZnJvbSBcIi4vc3JjL01hbmFnZXJcIjtcbmltcG9ydCBSZW1vdGUgZnJvbSBcIi4vc3JjL3JlbW90ZVwiO1xuXG5pbnRlcmZhY2UgT3B0aW9ucyB7XG5cdGFwaUtleT86IHN0cmluZyxcblx0ZGVidWc/OiBib29sZWFuLFxuXHRldmVudHM/OiBzdHJpbmdbXVxuXHRyZWRpcmVjdFVybDogc3RyaW5nLFxuXHRzb3VyY2U6IHN0cmluZyxcblx0dXJsOiBzdHJpbmcsXG59XG5cbmNvbnN0IGRlZmF1bHRPcHRpb25zOiBPcHRpb25zID0ge1xuXHRldmVudHM6IFtdLFxuXHRkZWJ1ZzogZmFsc2UsXG5cdHJlZGlyZWN0VXJsOiBcImh0dHBzOi8vYXR0YWNrc2ltdWxhdG9yLmNvbVwiLFxuXHRzb3VyY2U6IFwiTFBcIixcblx0dXJsOiBcImh0dHBzOi8vYXBpLWRldi5hdHRhY2tzaW11bGF0b3IuY29tXCIsXG59O1xuXG5jbGFzcyBBVFNFdmVudHMge1xuXHRwcml2YXRlIG1hbmFnZXI6IE1hbmFnZXI7XG5cblx0Y29uc3RydWN0b3Iob3B0aW9uczogT3B0aW9ucykge1xuXHRcdGNvbnN0IF9vcHRpb25zID0gey4uLmRlZmF1bHRPcHRpb25zLCAuLi5vcHRpb25zfTtcblx0XHRpZiAoX29wdGlvbnMuZGVidWcpIHtcblx0XHRcdGNvbnNvbGUubG9nKF9vcHRpb25zKTtcblx0XHR9XG5cdFx0Y29uc3QgcmVtb3RlID0gbmV3IFJlbW90ZShfb3B0aW9ucy5hcGlLZXksIF9vcHRpb25zLnVybCwgX29wdGlvbnMuZGVidWcpO1xuXHRcdHRoaXMubWFuYWdlciA9IG5ldyBNYW5hZ2VyKHJlbW90ZSwgX29wdGlvbnMuZXZlbnRzLCBfb3B0aW9ucy5zb3VyY2UsIF9vcHRpb25zLnJlZGlyZWN0VXJsLCBfb3B0aW9ucy5kZWJ1Zyk7XG5cdH1cblxuXHRsaXN0ZW4oKSB7XG5cdFx0dGhpcy5tYW5hZ2VyLmxpc3RlbigpO1xuXHR9XG5cblx0c3RvcCgpIHtcblx0XHR0aGlzLm1hbmFnZXIuc3RvcCgpO1xuXHR9XG5cdFxuXHR0cmlnZ2VyKG5hbWU6IHN0cmluZykge1xuXHRcdHRoaXMubWFuYWdlci50cmlnZ2VyKG5hbWUpO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQVRTRXZlbnRzO1xuIiwiaW1wb3J0IHBhcnNlciBmcm9tIFwidWEtcGFyc2VyLWpzXCI7XG5cbmludGVyZmFjZSBTY3JlZW5TaXplIHtcbiAgICB3aWR0aCA/OiBudW1iZXJcbiAgICBoZWlnaHQgPzogbnVtYmVyXG59XG5cbmludGVyZmFjZSBCcm93c2VyIHtcbiAgICBuYW1lID86IHN0cmluZ1xuICAgIHZlcnNpb24gPzogc3RyaW5nXG4gICAgbWFqb3JfdmVyc2lvbiA/OiBudW1iZXJcbiAgICBtb2JpbGUgPzogYm9vbGVhblxufVxuXG5pbnRlcmZhY2UgT1Mge1xuICAgIG5hbWUgPzogc3RyaW5nXG4gICAgdmVyc2lvbiA/OiBzdHJpbmdcbn1cblxuaW50ZXJmYWNlIERldmljZSB7XG4gICAgbW9kZWw/OiBzdHJpbmdcbiAgICB0eXBlPzogc3RyaW5nXG4gICAgdmVuZG9yPzogc3RyaW5nXG59XG5pbnRlcmZhY2UgQ3B1IHtcbiAgICBhcmNoaXRlY3R1cmUgPzpzdHJpbmdcbn1cbmV4cG9ydCBpbnRlcmZhY2UgQnJvd3NlckluZm8ge1xuICAgIHVhOiBzdHJpbmc7XG4gICAgc2NyZWVuX3NpemU6IFNjcmVlblNpemU7XG4gICAgYnJvd3NlcjogQnJvd3NlcjtcbiAgICBvczogT1M7XG4gICAgZGV2aWNlOiBEZXZpY2U7XG4gICAgY3B1OiBDcHU7XG59XG5cbmZ1bmN0aW9uIGZpbmRCcm93c2VyKCk6IEJyb3dzZXIge1xuXHRsZXQgdmVyT2Zmc2V0LCBicm93c2VyOiBCcm93c2VyID0ge307XG5cdGNvbnN0IHVzZXJBZ2VudCA9IG5hdmlnYXRvci51c2VyQWdlbnQ7XG5cblx0Ly8gT3BlcmFcblx0aWYgKCh2ZXJPZmZzZXQgPSB1c2VyQWdlbnQuaW5kZXhPZihcIk9wZXJhXCIpKSAhPT0gLTEpIHtcblx0XHRicm93c2VyLm5hbWUgPSBcIk9wZXJhXCI7XG5cdFx0YnJvd3Nlci52ZXJzaW9uID0gdXNlckFnZW50LnN1YnN0cmluZyh2ZXJPZmZzZXQgKyA2KTtcblx0XHRpZiAoKHZlck9mZnNldCA9IHVzZXJBZ2VudC5pbmRleE9mKFwiVmVyc2lvblwiKSkgIT09IC0xKSB7XG5cdFx0XHRicm93c2VyLnZlcnNpb24gPSB1c2VyQWdlbnQuc3Vic3RyaW5nKHZlck9mZnNldCArIDgpO1xuXHRcdH1cblx0fVxuXG5cdC8vIE9wZXJhIE5leHRcblx0ZWxzZSBpZiAoKHZlck9mZnNldCA9IHVzZXJBZ2VudC5pbmRleE9mKFwiT1BSXCIpKSAhPT0gLTEpIHtcblx0XHRicm93c2VyLm5hbWUgPSBcIk9wZXJhXCI7XG5cdFx0YnJvd3Nlci52ZXJzaW9uID0gdXNlckFnZW50LnN1YnN0cmluZyh2ZXJPZmZzZXQgKyA1KTtcblx0fVxuXG5cdC8vIEVkZ2Vcblx0ZWxzZSBpZiAoKHZlck9mZnNldCA9IHVzZXJBZ2VudC5pbmRleE9mKFwiRWRnZVwiKSkgIT09IC0xKSB7XG5cdFx0YnJvd3Nlci5uYW1lID0gXCJNaWNyb3NvZnQgRWRnZVwiO1xuXHRcdGJyb3dzZXIudmVyc2lvbiA9IHVzZXJBZ2VudC5zdWJzdHJpbmcodmVyT2Zmc2V0ICsgNSk7XG5cdH1cblxuXHQvLyBNU0lFXG5cdGVsc2UgaWYgKCh2ZXJPZmZzZXQgPSB1c2VyQWdlbnQuaW5kZXhPZihcIk1TSUVcIikpICE9PSAtMSkge1xuXHRcdGJyb3dzZXIubmFtZSA9IFwiTWljcm9zb2Z0IEludGVybmV0IEV4cGxvcmVyXCI7XG5cdFx0YnJvd3Nlci52ZXJzaW9uID0gdXNlckFnZW50LnN1YnN0cmluZyh2ZXJPZmZzZXQgKyA1KTtcblx0fVxuXG5cdC8vIENocm9tZVxuXHRlbHNlIGlmICgodmVyT2Zmc2V0ID0gdXNlckFnZW50LmluZGV4T2YoXCJDaHJvbWVcIikpICE9PSAtMSkge1xuXHRcdGJyb3dzZXIubmFtZSA9IFwiQ2hyb21lXCI7XG5cdFx0YnJvd3Nlci52ZXJzaW9uID0gdXNlckFnZW50LnN1YnN0cmluZyh2ZXJPZmZzZXQgKyA3KTtcblx0fVxuXG5cdC8vIFNhZmFyaVxuXHRlbHNlIGlmICgodmVyT2Zmc2V0ID0gdXNlckFnZW50LmluZGV4T2YoXCJTYWZhcmlcIikpICE9PSAtMSkge1xuXHRcdGJyb3dzZXIubmFtZSA9IFwiU2FmYXJpXCI7XG5cdFx0YnJvd3Nlci52ZXJzaW9uID0gdXNlckFnZW50LnN1YnN0cmluZyh2ZXJPZmZzZXQgKyA3KTtcblx0XHRpZiAoKHZlck9mZnNldCA9IHVzZXJBZ2VudC5pbmRleE9mKFwiVmVyc2lvblwiKSkgIT09IC0xKSB7XG5cdFx0XHRicm93c2VyLnZlcnNpb24gPSB1c2VyQWdlbnQuc3Vic3RyaW5nKHZlck9mZnNldCArIDgpO1xuXHRcdH1cblx0fVxuXG5cdC8vIEZpcmVmb3hcblx0ZWxzZSBpZiAoKHZlck9mZnNldCA9IHVzZXJBZ2VudC5pbmRleE9mKFwiRmlyZWZveFwiKSkgIT09IC0xKSB7XG5cdFx0YnJvd3Nlci5uYW1lID0gXCJGaXJlZm94XCI7XG5cdFx0YnJvd3Nlci52ZXJzaW9uID0gdXNlckFnZW50LnN1YnN0cmluZyh2ZXJPZmZzZXQgKyA4KTtcblx0fVxuXG5cdC8vIE1TSUUgMTErXG5cdGVsc2UgaWYgKHVzZXJBZ2VudC5pbmRleE9mKFwiVHJpZGVudC9cIikgIT09IC0xKSB7XG5cdFx0YnJvd3Nlci5uYW1lID0gXCJNaWNyb3NvZnQgSW50ZXJuZXQgRXhwbG9yZXJcIjtcblx0XHRicm93c2VyLnZlcnNpb24gPSB1c2VyQWdlbnQuc3Vic3RyaW5nKHVzZXJBZ2VudC5pbmRleE9mKFwicnY6XCIpICsgMyk7XG5cdH1cblxuXHRicm93c2VyLm1vYmlsZSA9IC9Nb2JpbGV8bWluaXxGZW5uZWN8QW5kcm9pZHxpUChhZHxvZHxob25lKS8udGVzdCh1c2VyQWdlbnQpO1xuXG5cdC8vIHRyaW0gdGhlIHZlcnNpb24gc3RyaW5nXG5cdGxldCBpeDtcblx0aWYgKChpeCA9IGJyb3dzZXIudmVyc2lvbi5pbmRleE9mKFwiO1wiKSkgIT0gLTEpIGJyb3dzZXIudmVyc2lvbiA9IGJyb3dzZXIudmVyc2lvbi5zdWJzdHJpbmcoMCwgaXgpO1xuXHRpZiAoKGl4ID0gYnJvd3Nlci52ZXJzaW9uLmluZGV4T2YoXCIgXCIpKSAhPSAtMSkgYnJvd3Nlci52ZXJzaW9uID0gYnJvd3Nlci52ZXJzaW9uLnN1YnN0cmluZygwLCBpeCk7XG5cdGlmICgoaXggPSBicm93c2VyLnZlcnNpb24uaW5kZXhPZihcIilcIikpICE9IC0xKSBicm93c2VyLnZlcnNpb24gPSBicm93c2VyLnZlcnNpb24uc3Vic3RyaW5nKDAsIGl4KTtcblxuXHRicm93c2VyLm1ham9yX3ZlcnNpb24gPSBwYXJzZUludChcIlwiICsgYnJvd3Nlci52ZXJzaW9uLCAxMCk7XG5cdGlmIChpc05hTiggYnJvd3Nlci5tYWpvcl92ZXJzaW9uKSkge1xuXHRcdGJyb3dzZXIudmVyc2lvbiA9IFwiXCIgKyBwYXJzZUZsb2F0KG5hdmlnYXRvci5hcHBWZXJzaW9uKTtcblx0XHRicm93c2VyLm1ham9yX3ZlcnNpb24gPSBwYXJzZUludChuYXZpZ2F0b3IuYXBwVmVyc2lvbiwgMTApO1xuXHR9XG4gICAgXG5cdHJldHVybiBicm93c2VyO1xufVxuXG5mdW5jdGlvbiBmaW5kT3BlcmF0aW5nU3lzdGVtKHBhcnNlcjogYW55KTogT1Mge1xuXHRjb25zdCB7bmFtZSwgdmVyc2lvbn0gPSBwYXJzZXIuZ2V0T1MoKTtcblx0cmV0dXJuIHsgbmFtZSwgdmVyc2lvbn07XG59XG5cbmZ1bmN0aW9uIGZpbmREZXZpY2UocGFyc2VyOiBhbnkpOiBEZXZpY2Uge1xuXHRjb25zdCB7bW9kZWwsIHR5cGUsIHZlbmRvcn0gPSBwYXJzZXIuZ2V0RGV2aWNlKCk7XG5cdHJldHVybiB7bW9kZWwsIHR5cGUsIHZlbmRvcn07XG59XG5cbmZ1bmN0aW9uIGZpbmRDcHUocGFyc2VyOiBhbnkpOiBDcHUge1xuXHRjb25zdCB7YXJjaGl0ZWN0dXJlfSA9IHBhcnNlci5nZXRDUFUoKTtcblx0cmV0dXJuIHthcmNoaXRlY3R1cmV9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmluZEJyb3dzZXJJbmZvKCk6IEJyb3dzZXJJbmZvIHtcblx0Y29uc3QgdWEgPSBuZXcgcGFyc2VyKCk7XG5cdHJldHVybiB7XG5cdFx0dWE6IHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50LFxuXHRcdHNjcmVlbl9zaXplOiB7XG5cdFx0XHR3aWR0aDogc2NyZWVuLndpZHRoIHx8IDAsXG5cdFx0XHRoZWlnaHQ6IHNjcmVlbi5oZWlnaHQgfHwgMFxuXHRcdH0sXG5cdFx0YnJvd3NlcjogZmluZEJyb3dzZXIoKSxcblx0XHRvczogZmluZE9wZXJhdGluZ1N5c3RlbSh1YSksXG5cdFx0ZGV2aWNlOiBmaW5kRGV2aWNlKHVhKSxcblx0XHRjcHU6IGZpbmRDcHUodWEpXG5cdH07XG59IiwiaW1wb3J0IHsgVXJsUGFyc2VyIH0gZnJvbSBcIi4vVXJsUGFyc2VyXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2FtcGFpZ25JbmZvIHtcbiAgICBhdHNfZW52ID86IHN0cmluZ1xuICAgIGF0c19hdGtfdHlwZSA/OiBzdHJpbmdcbiAgICBhdHNfY2FtcGFpZ25fbmFtZSA/OiBzdHJpbmdcbiAgICBhdHNfY29tcGFueV9pZCA/OiBzdHJpbmdcbiAgICBhdHNfaW5zdGFuY2VfaWQgPzogc3RyaW5nXG4gICAgYXRzX2xvY2FsZSA/OiBzdHJpbmdcbiAgICBhdHNfcHJvY2Vzc2VkX2RhdGUgPzogc3RyaW5nXG4gICAgYXRzX3VzZXJfaWQgPzogc3RyaW5nXG5cdGRvd25sb2FkX3R5cGUgPzogc3RyaW5nXG59XG5cbmZ1bmN0aW9uIHJlYWRUb2tlblN0cmluZyh0b2tlblN0cmluZyA/OiBzdHJpbmcsIGZpbGVUeXBlID86IHN0cmluZyk6IENhbXBhaWduSW5mbyB7XG5cdGNvbnN0IGJhc2U2NFVybCA9IHRva2VuU3RyaW5nLnNwbGl0KFwiLlwiKVsxXTtcblx0Y29uc3QgYmFzZTY0ID0gIGJhc2U2NFVybC5yZXBsYWNlKC8tL2csIFwiK1wiKS5yZXBsYWNlKC9fL2csIFwiL1wiKTtcblx0Y29uc3QgY2FtcGFpZ25JbmZvID0gSlNPTi5wYXJzZSh3aW5kb3cuYXRvYihiYXNlNjQpKS5wYXlsb2FkIGFzIENhbXBhaWduSW5mbztcblxuXHRpZiAoZmlsZVR5cGUgPT09IFwiYXR0YWNobWVudFwiKSB7XG5cdFx0Y2FtcGFpZ25JbmZvLmRvd25sb2FkX3R5cGUgPSBcImF0dGFjaG1lbnRcIjtcblx0fSBlbHNlIGlmIChmaWxlVHlwZSAhPT0gbnVsbCkge1xuXHRcdGNhbXBhaWduSW5mby5kb3dubG9hZF90eXBlID0gXCJmaWxlXCI7XG5cdH1cblxuXHRyZXR1cm4gY2FtcGFpZ25JbmZvO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmluZENhbXBhaWduSW5mbygpIDogW3N0cmluZywgQ2FtcGFpZ25JbmZvXSB7XG5cdGNvbnN0IHVybCA9IG5ldyBVcmxQYXJzZXIod2luZG93LmxvY2F0aW9uLmhyZWYpO1xuXHRjb25zdCB0b2tlblN0cmluZyA9IHVybC5maW5kUGFyYW0oXCJ0a1wiKTtcblx0Y29uc3QgZmlsZVR5cGUgPSB1cmwuZmluZFBhcmFtKFwiZmlsZV90eXBlXCIpO1xuXG5cdHRyeSB7XG5cdFx0cmV0dXJuIFt0b2tlblN0cmluZywgcmVhZFRva2VuU3RyaW5nKHRva2VuU3RyaW5nLCBmaWxlVHlwZSldO1xuXHR9IGNhdGNoKGUpIHtcblx0XHRyZXR1cm4gW3Rva2VuU3RyaW5nLCB7IGF0c19jb21wYW55X2lkOiBcIlwiIH1dO1xuXHR9XG59IiwiaW1wb3J0IHsgQnJvd3NlckluZm8sIGZpbmRCcm93c2VySW5mbyB9IGZyb20gXCIuL0Jyb3dzZXJJbmZvXCI7XG5pbXBvcnQgeyBDYW1wYWlnbkluZm8sIGZpbmRDYW1wYWlnbkluZm8gfSBmcm9tIFwiLi9DYW1wYWlnbkluZm9cIjtcbmltcG9ydCB7IEV2ZW50UGF5bG9hZCwgSUV2ZW50IH0gZnJvbSBcIi4vRXZlbnRcIjtcblxuaW1wb3J0IHsgQXR0YWNobWVudE9wZW4gfSBmcm9tIFwiLi9ldmVudHMvQXR0YWNobWVudE9wZW5cIjtcbmltcG9ydCB7IENsaWNrIH0gZnJvbSBcIi4vZXZlbnRzL0NsaWNrXCI7XG5pbXBvcnQgeyBEb3dubG9hZCB9IGZyb20gXCIuL2V2ZW50cy9Eb3dubG9hZFwiO1xuaW1wb3J0IHsgRmlsZU9wZW4gfSBmcm9tIFwiLi9ldmVudHMvRmlsZU9wZW5cIjtcbmltcG9ydCB7IElucHV0IH0gZnJvbSBcIi4vZXZlbnRzL0lucHV0XCI7XG5pbXBvcnQgeyBQYWdlTG9hZGVkIH0gZnJvbSBcIi4vZXZlbnRzL1BhZ2VMb2FkZWRcIjtcbmltcG9ydCB7IFBhZ2VSZWFkIH0gZnJvbSBcIi4vZXZlbnRzL1BhZ2VSZWFkXCI7XG5pbXBvcnQgeyBTdWJtaXQgfSBmcm9tIFwiLi9ldmVudHMvU3VibWl0XCI7XG5cbmltcG9ydCBSZW1vdGUgZnJvbSBcIi4vUmVtb3RlXCI7XG5pbXBvcnQgeyBjcmVhdGVVVUlEIH0gZnJvbSBcIi4vVG9vbHNcIjtcblxuZXhwb3J0IGNsYXNzIE1hbmFnZXIge1xuXHRwcml2YXRlIHJlYWRvbmx5IHN1cHBvcnRlZFR5cGVzIDogc3RyaW5nW10gPSBbXCJlbWFpbFwiLCBcInBhc3N3b3JkXCIsIFwidGVsXCJdO1xuXHRwcml2YXRlIHJlYWRvbmx5IHN1cHBvcnRlZEV2ZW50cyA9IHtcImF0dGFjaG1lbnRfb3BlbmVkXCI6IEF0dGFjaG1lbnRPcGVuLCBcImNsaWNrXCI6IENsaWNrLCBcImRvd25sb2FkXCI6IERvd25sb2FkLCBcImZpbGVfb3BlblwiOiBGaWxlT3BlbiwgXCJpbnB1dFwiOiBJbnB1dCwgXCJwYWdlX2xvYWRcIjogUGFnZUxvYWRlZCwgXCJwYWdlX3JlYWRcIjogUGFnZVJlYWQsIFwic3VibWl0XCI6IFN1Ym1pdCwgfTtcblxuXHRwcml2YXRlIHJlYWRvbmx5IGJyb3dzZXJJbmZvOiBCcm93c2VySW5mbztcblx0cHJpdmF0ZSByZWFkb25seSBjYW1wYWlnbkluZm86IENhbXBhaWduSW5mbztcblx0cHJpdmF0ZSByZWFkb25seSBkZWJ1ZzogYm9vbGVhbiA9IGZhbHNlO1xuXHRwcml2YXRlIHJlYWRvbmx5IHJlZGlyZWN0VXJsOiBzdHJpbmc7XG5cdHByaXZhdGUgcmVhZG9ubHkgcmVtb3RlOiBSZW1vdGU7XG5cdHByaXZhdGUgcmVhZG9ubHkgc291cmNlOiBzdHJpbmc7XG5cdHByaXZhdGUgcmVhZG9ubHkgdG9rZW46IHN0cmluZztcblx0XG5cdHByaXZhdGUgaGFuZGxlcnMgPSBbXTtcblx0cHJpdmF0ZSBkaXNhYmxlZEV2ZW50cyA9IFtdO1xuXG5cdHJlbW90ZUV2ZW50czogSUV2ZW50W107XG5cblx0Y29uc3RydWN0b3IocmVtb3RlOiBSZW1vdGUsIGV2ZW50TmFtZXM6IHN0cmluZ1tdLCBzb3VyY2U6IHN0cmluZywgcmVkaXJlY3RVcmw6IHN0cmluZywgZGVidWcgPSBmYWxzZSkge1xuXHRcdHRoaXMucmVtb3RlID0gcmVtb3RlO1xuXHRcdFt0aGlzLnRva2VuLCB0aGlzLmNhbXBhaWduSW5mb10gPSBmaW5kQ2FtcGFpZ25JbmZvKCk7XG5cdFx0dGhpcy5icm93c2VySW5mbyA9IGZpbmRCcm93c2VySW5mbygpO1xuXHRcdFxuXHRcdGlmICghZXZlbnROYW1lcy5sZW5ndGgpIHtcblx0XHRcdGV2ZW50TmFtZXMgPSBPYmplY3Qua2V5cyh0aGlzLnN1cHBvcnRlZEV2ZW50cyk7XG5cdFx0fVxuXHRcdFxuXHRcdHRoaXMucmVtb3RlRXZlbnRzID0gZXZlbnROYW1lcy5tYXAobmFtZSA9PiB0aGlzLmdldEV2ZW50KG5hbWUpKTtcblx0XHR0aGlzLnNvdXJjZSA9IHNvdXJjZTtcblx0XHR0aGlzLnJlZGlyZWN0VXJsID0gcmVkaXJlY3RVcmw7XG5cdFx0dGhpcy5kZWJ1ZyA9IGRlYnVnO1xuXG5cdFx0aWYgKHRoaXMuY2FtcGFpZ25JbmZvLmRvd25sb2FkX3R5cGUpIHtcblx0XHRcdHRoaXMuY2hlY2tEb3dubG9hZCgpO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgY2hlY2tEb3dubG9hZCgpIHtcblx0XHRzd2l0Y2ggKHRoaXMuY2FtcGFpZ25JbmZvLmRvd25sb2FkX3R5cGUpIHtcblx0XHRjYXNlIFwiZmlsZVwiOlxuXHRcdFx0cmV0dXJuIHRoaXMudHJpZ2dlcihcImZpbGVfb3BlbmVkXCIpO1xuXHRcdGNhc2UgXCJhdHRhY2htZW50XCI6XG5cdFx0XHRyZXR1cm4gdGhpcy50cmlnZ2VyKFwiYXR0YWNobWVudF9vcGVuZWRcIik7XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBnZXRFdmVudChuYW1lOiBzdHJpbmcpIHtcblx0XHRyZXR1cm4gbmV3IHRoaXMuc3VwcG9ydGVkRXZlbnRzW25hbWVdO1xuXHR9XG5cblx0bGlzdGVuKCkge1xuXHRcdGxldCBpID0gMDtcblx0XHRmb3IoY29uc3QgcmVtb3RlRXZlbnQgb2YgdGhpcy5yZW1vdGVFdmVudHMpIHtcdFx0XG5cdFx0XHRpZih0aGlzLmRlYnVnKSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKGBMaXN0ZW5pbmcgZm9yIGV2ZW50IEAke3JlbW90ZUV2ZW50LnRyaWdnZXJ9ICgke3JlbW90ZUV2ZW50Lm5hbWV9KWApO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCB0YXJnZXRzID0gcmVtb3RlRXZlbnQudGFyZ2V0cztcblx0XHRcdGZvcihjb25zdCB0YXJnZXQgb2YgdGFyZ2V0cykge1xuXHRcdFx0XHR0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihyZW1vdGVFdmVudC50cmlnZ2VyLCB0aGlzLmhhbmRsZXJzW2krK10gPSBldmVudCA9PiB0aGlzLmhhbmRsZShyZW1vdGVFdmVudCwgZXZlbnQpKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRzdG9wKCkge1xuXHRcdGxldCBpID0gMDtcblx0XHRmb3IoY29uc3QgcmVtb3RlRXZlbnQgb2YgdGhpcy5yZW1vdGVFdmVudHMpIHtcdFx0XG5cdFx0XHRpZih0aGlzLmRlYnVnKSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKGBTdG9wcGluZyBsaXN0ZW5pbmcgZm9yIGV2ZW50IEAke3JlbW90ZUV2ZW50LnRyaWdnZXJ9ICgke3JlbW90ZUV2ZW50Lm5hbWV9KWApO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCB0YXJnZXRzID0gcmVtb3RlRXZlbnQudGFyZ2V0cztcblx0XHRcdGZvcihjb25zdCB0YXJnZXQgb2YgdGFyZ2V0cykge1xuXHRcdFx0XHR0YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihyZW1vdGVFdmVudC50cmlnZ2VyLCB0aGlzLmhhbmRsZXJzW2krK10pO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgZmluZFR5cGUocmVtb3RlRXZlbnQ6IElFdmVudCwgZXZlbnQ/OiBFdmVudCk6IHN0cmluZyB8IG51bGwge1xuXHRcdGlmICghcmVtb3RlRXZlbnQuaGFzVHlwZXMgfHwgIWV2ZW50KSB7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cblx0XHRjb25zdCBpbnB1dEVsZW1lbnQgPSBldmVudC5jdXJyZW50VGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG5cblx0XHRpZiAodGhpcy5zdXBwb3J0ZWRUeXBlcy5pbmRleE9mKGlucHV0RWxlbWVudC50eXBlKSAhPT0gLTEpIHtcblx0XHRcdHJldHVybiBpbnB1dEVsZW1lbnQudHlwZTtcblx0XHR9XG5cblx0XHRpZiAoaW5wdXRFbGVtZW50LmRhdGFzZXQudHlwZSkge1xuXHRcdFx0cmV0dXJuIGlucHV0RWxlbWVudC5kYXRhc2V0LnR5cGU7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblxuXHRwcml2YXRlIHBhY2tFdmVudCh0eXBlLCByZW1vdGVFdmVudDogSUV2ZW50KTogRXZlbnRQYXlsb2FkIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0XCJkYXRhXCI6IHtcblx0XHRcdFx0Li4udGhpcy5icm93c2VySW5mbyxcblx0XHRcdFx0dHlwZSxcblx0XHRcdH0sXG5cdFx0XHRcInNvdXJjZVwiOiB0aGlzLnNvdXJjZSxcblx0XHRcdFwidGltZXN0YW1wXCI6IE1hdGguZmxvb3IoRGF0ZS5ub3coKSAvIDEwMDApLFxuXHRcdFx0XCJhdHNfaGVhZGVyXCI6IHRoaXMudG9rZW4sXG5cdFx0XHRcImV2ZW50XCI6IHJlbW90ZUV2ZW50Lm5hbWUudG9Mb3dlckNhc2UoKSxcblx0XHRcdFwic2dfZXZlbnRfaWRcIjogY3JlYXRlVVVJRCgpLFxuXHRcdFx0XCJzZ19tZXNzYWdlX2lkXCI6IHRoaXMuY2FtcGFpZ25JbmZvLmF0c19pbnN0YW5jZV9pZCxcblx0XHR9O1xuXHR9XG5cblx0dHJpZ2dlcihldmVudE5hbWU6IHN0cmluZykge1xuXHRcdGNvbnN0IHJlbW90ZUV2ZW50ID0gdGhpcy5zdXBwb3J0ZWRFdmVudHNbZXZlbnROYW1lXTtcblx0XHRpZiAoIXJlbW90ZUV2ZW50KSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIGV2ZW50ICR7ZXZlbnROYW1lfS4gUGxlYXNlIGNob29zZSBvbmUgb2YgJHtPYmplY3Qua2V5cyh0aGlzLnN1cHBvcnRlZEV2ZW50cykuam9pbihcIiwgXCIpfWApO1xuXHRcdH1cblx0XHR0aGlzLmhhbmRsZShyZW1vdGVFdmVudCk7XG5cdH1cblxuXHRwcml2YXRlIGhhbmRsZShyZW1vdGVFdmVudDogSUV2ZW50LCBldmVudD86IEV2ZW50KSB7XG5cdFx0aWYgKHRoaXMuZGVidWcpIHtcblx0XHRcdGNvbnNvbGUubG9nKGBFdmVudCBAJHtyZW1vdGVFdmVudC50cmlnZ2VyfSAoJHtyZW1vdGVFdmVudC5uYW1lfSkgdHJpZ2dlcmVkLi4uYCk7XG5cdFx0fVxuXHRcdFxuXHRcdGlmIChldmVudCkge1xuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0ZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0fVxuXG5cdFx0aWYgKCFyZW1vdGVFdmVudC5hbGxvd011bHRpcGxlKSB7XG5cdFx0XHRpZiAodGhpcy5kaXNhYmxlZEV2ZW50cy5pbmNsdWRlcyhyZW1vdGVFdmVudC5uYW1lKSkge1xuXHRcdFx0XHRpZiAodGhpcy5kZWJ1Zykge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGBQcmV2ZW50aW5nIGR1cGxpY2F0ZSBldmVudCBAJHtyZW1vdGVFdmVudC50cmlnZ2VyfSAoJHtyZW1vdGVFdmVudC5uYW1lfSkuYCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5kaXNhYmxlZEV2ZW50cy5wdXNoKHJlbW90ZUV2ZW50Lm5hbWUpO1xuXHRcdH1cblxuXHRcdGNvbnN0IHR5cGUgPSB0aGlzLmZpbmRUeXBlKHJlbW90ZUV2ZW50LCBldmVudCk7XG5cdFx0Y29uc3QgcGF5bG9hZCA9IHRoaXMucGFja0V2ZW50KHR5cGUsIHJlbW90ZUV2ZW50KTtcblx0XHR0aGlzLnJlbW90ZS5wb3N0KHBheWxvYWQpXG5cdFx0XHQudGhlbihyZXN1bHQgPT4ge1xuXHRcdFx0XHRpZiAodGhpcy5kZWJ1Zykge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKHJlc3VsdCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuY2F0Y2goZSA9PiB7aWYodGhpcy5kZWJ1ZykgeyBjb25zb2xlLmVycm9yKGUpOyB9fSlcblx0XHRcdC5maW5hbGx5KCgpID0+IHtcblx0XHRcdFx0aWYgKHJlbW90ZUV2ZW50LnJlZGlyZWN0T25GaW5pc2gpIHtcblx0XHRcdFx0XHR3aW5kb3cubG9jYXRpb24uaHJlZiA9IHRoaXMucmVkaXJlY3RVcmw7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHR9XG59IiwiZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVVVSUQoKSB7XG5cdC8vIGh0dHA6Ly93d3cuaWV0Zi5vcmcvcmZjL3JmYzQxMjIudHh0XG5cdGNvbnN0IHM6IGFueVtdID0gW107XG5cdGNvbnN0IGhleERpZ2l0cyA9IFwiMDEyMzQ1Njc4OWFiY2RlZlwiO1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IDM2OyBpKyspIHtcblx0XHRzW2ldID0gaGV4RGlnaXRzLnN1YnN0cihNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAweDEwKSwgMSk7XG5cdH1cblx0c1sxNF0gPSBcIjRcIjsgIC8vIGJpdHMgMTItMTUgb2YgdGhlIHRpbWVfaGlfYW5kX3ZlcnNpb24gZmllbGQgdG8gMDAxMFxuXHRzWzE5XSA9IGhleERpZ2l0cy5zdWJzdHIoKHNbMTldICYgMHgzKSB8IDB4OCwgMSk7ICAvLyBiaXRzIDYtNyBvZiB0aGUgY2xvY2tfc2VxX2hpX2FuZF9yZXNlcnZlZCB0byAwMVxuXHRzWzhdID0gc1sxM10gPSBzWzE4XSA9IHNbMjNdID0gXCItXCI7XG5cblx0cmV0dXJuIHMuam9pbihcIlwiKTtcbn0iLCJpbnRlcmZhY2UgUGFyYW1ldGVyTWFwIHtcbiAgICBbczogc3RyaW5nXTogYW55XG59XG5leHBvcnQgY2xhc3MgVXJsUGFyc2VyIHtcblxuXHRwcml2YXRlIHBhcmFtZXRlcnM6IFBhcmFtZXRlck1hcDtcblx0cHVibGljIHJlYWRvbmx5IHByb3RvY29sOiBzdHJpbmc7XG5cdHB1YmxpYyByZWFkb25seSBob3N0OiBzdHJpbmc7XG5cdHB1YmxpYyByZWFkb25seSBob3N0bmFtZTogc3RyaW5nO1xuXHRwdWJsaWMgcmVhZG9ubHkgcG9ydDogc3RyaW5nO1xuXHRwdWJsaWMgcmVhZG9ubHkgcGF0aG5hbWU6IHN0cmluZztcblx0cHVibGljIHJlYWRvbmx5IGhhc2g6IHN0cmluZztcblx0cHVibGljIHJlYWRvbmx5IHNlYXJjaDogc3RyaW5nO1xuXG5cdGNvbnN0cnVjdG9yKHByaXZhdGUgdXJsOnN0cmluZykge1xuXHRcdGNvbnN0IHBhcnNlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xuXHRcdHBhcnNlci5ocmVmID0gdXJsO1xuXG5cdFx0dGhpcy5wcm90b2NvbCA9IHBhcnNlci5wcm90b2NvbDsgLy8gPT4gXCJodHRwOlwiXG5cdFx0dGhpcy5ob3N0ID0gcGFyc2VyLmhvc3Q7ICAgICAvLyA9PiBcImV4YW1wbGUuY29tOjMwMDBcIlxuXHRcdHRoaXMuaG9zdG5hbWUgPSBwYXJzZXIuaG9zdG5hbWU7IC8vID0+IFwiZXhhbXBsZS5jb21cIlxuXHRcdHRoaXMucG9ydCA9IHBhcnNlci5wb3J0OyAgICAgLy8gPT4gXCIzMDAwXCJcblx0XHR0aGlzLnBhdGhuYW1lID0gcGFyc2VyLnBhdGhuYW1lOyAvLyA9PiBcIi9wYXRobmFtZS9cIlxuXHRcdHRoaXMuaGFzaCA9IHBhcnNlci5oYXNoOyAgICAgLy8gPT4gXCIjaGFzaFwiXG5cdFx0dGhpcy5zZWFyY2ggPSBwYXJzZXIuc2VhcmNoLnN1YnN0cigxKTsgICAvLyA9PiBcIj9zZWFyY2g9dGVzdFwiXG5cblx0XHR0aGlzLnBhcnNlUGFyYW1ldGVycygpO1xuXHR9XG5cblx0cHJpdmF0ZSBwYXJzZVBhcmFtZXRlcnMoKSB7XG5cdFx0dGhpcy5wYXJhbWV0ZXJzID0ge307XG5cblx0XHRjb25zdCBwYXJhbXNHcm91cCA9IHRoaXMuc2VhcmNoLnNwbGl0KFwiJlwiKTtcblx0XHRmb3IoY29uc3QgcGFyYW0gb2YgcGFyYW1zR3JvdXApIHtcblx0XHRcdGNvbnN0IFtrZXksIHZhbHVlXSA9IHBhcmFtLnNwbGl0KFwiPVwiKTtcblx0XHRcdHRoaXMucGFyYW1ldGVyc1trZXldID0gdmFsdWU7XG5cdFx0fVxuXHR9XG5cblx0cHVibGljIGZpbmRQYXJhbShwYXJhbTogc3RyaW5nKSA6IGFueSB7XG5cdFx0cmV0dXJuIHRoaXMucGFyYW1ldGVyc1twYXJhbV0gfHwgbnVsbDtcblx0fVxuXG59IiwiaW1wb3J0IHsgSUV2ZW50IH0gZnJvbSBcIi4uL0V2ZW50XCI7XG5cbmV4cG9ydCBjbGFzcyBBdHRhY2htZW50T3BlbiBpbXBsZW1lbnRzIElFdmVudCB7XG5cdGdldCByZWRpcmVjdE9uRmluaXNoKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRnZXQgdHJpZ2dlcigpOiBzdHJpbmcge1xuXHRcdHJldHVybiBcIlwiO1xuXHR9XG5cdGdldCBuYW1lKCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIFwiYXR0YWNobWVudF9vcGVuZWRcIjtcblx0fVxuXHRnZXQgaGFzVHlwZXMoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlOyAgICBcblx0fVxuXHRnZXQgdGFyZ2V0cygpOiBFbGVtZW50W10ge1xuXHRcdHJldHVybiBbXTtcblx0fVxuXHRjaGVja0V2ZW50KCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG59IiwiaW1wb3J0IHsgSUV2ZW50IH0gZnJvbSBcIi4uL0V2ZW50XCI7XG5cbmV4cG9ydCBjbGFzcyBDbGljayBpbXBsZW1lbnRzIElFdmVudCB7XG5cdGdldCByZWRpcmVjdE9uRmluaXNoKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdGdldCB0cmlnZ2VyKCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIFwiY2xpY2tcIjtcblx0fVxuXHRnZXQgbmFtZSgpOiBzdHJpbmcge1xuXHRcdHJldHVybiBcImNsaWNrXCI7XG5cdH1cblx0Z2V0IGhhc1R5cGVzKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlOyAgICBcblx0fVxuXHRnZXQgdGFyZ2V0cygpOiBFbGVtZW50W10ge1xuXHRcdGNvbnN0IGVsZW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcImE6bm90KFtocmVmJD0nLmV4ZSddKSxidXR0b246bm90KFt0eXBlPXN1Ym1pdF0pLGlucHV0W3R5cGU9YnV0dG9uXVwiKTtcblx0XHRyZXR1cm4gWy4uLmVsZW1lbnRzXS5maWx0ZXIoZWxlbWVudCA9PiAhZWxlbWVudC5oYXNBdHRyaWJ1dGUoXCJpZ25vcmVcIikpO1xuXHR9XG5cdGNoZWNrRXZlbnQoZXZlbnQ6IGFueSk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBldmVudC53aGljaCAmJiBldmVudC5pc1RydXN0ZWQgJiYgZXZlbnQuc2NyZWVuWCAmJiBldmVudC5zY3JlZW5YICE9IDAgJiYgZXZlbnQuc2NyZWVuWSAmJiBldmVudC5zY3JlZW5ZICE9IDA7XG5cdH1cbn0iLCJpbXBvcnQgeyBJRXZlbnQgfSBmcm9tIFwiLi4vRXZlbnRcIjtcblxuZXhwb3J0IGNsYXNzIERvd25sb2FkIGltcGxlbWVudHMgSUV2ZW50IHtcblx0Z2V0IHJlZGlyZWN0T25GaW5pc2goKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblx0Z2V0IHRyaWdnZXIoKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gXCJjbGlja1wiO1xuXHR9XG5cdGdldCBuYW1lKCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIFwiZG93bmxvYWRfZmlsZV9ldmVudFwiO1xuXHR9XG5cdGdldCBoYXNUeXBlcygpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdHJ1ZTsgICAgXG5cdH1cblx0Z2V0IHRhcmdldHMoKTogRWxlbWVudFtdIHtcblx0XHRjb25zdCBlbGVtZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJhW2hyZWYkPScuZXhlJ11cIik7XG5cdFx0cmV0dXJuIFsuLi5lbGVtZW50c10uZmlsdGVyKGVsZW1lbnQgPT4gIWVsZW1lbnQuaGFzQXR0cmlidXRlKFwiaWdub3JlXCIpKTtcblx0fVxuXHRjaGVja0V2ZW50KGV2ZW50OiBhbnkpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZXZlbnQud2hpY2ggJiYgZXZlbnQuaXNUcnVzdGVkICYmIGV2ZW50LnNjcmVlblggJiYgZXZlbnQuc2NyZWVuWCAhPSAwICYmIGV2ZW50LnNjcmVlblkgJiYgZXZlbnQuc2NyZWVuWSAhPSAwO1xuXHR9XG59IiwiaW1wb3J0IHsgSUV2ZW50IH0gZnJvbSBcIi4uL0V2ZW50XCI7XG5cbmV4cG9ydCBjbGFzcyBGaWxlT3BlbiBpbXBsZW1lbnRzIElFdmVudCB7XG5cdGdldCByZWRpcmVjdE9uRmluaXNoKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRnZXQgdHJpZ2dlcigpOiBzdHJpbmcge1xuXHRcdHJldHVybiBcIlwiO1xuXHR9XG5cdGdldCBuYW1lKCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIFwiZmlsZV9vcGVuZWRcIjtcblx0fVxuXHRnZXQgaGFzVHlwZXMoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlOyAgICBcblx0fVxuXHRnZXQgdGFyZ2V0cygpOiBFbGVtZW50W10ge1xuXHRcdHJldHVybiBbXTtcblx0fVxuXHRjaGVja0V2ZW50KCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG59IiwiaW1wb3J0IHsgSUV2ZW50IH0gZnJvbSBcIi4uL0V2ZW50XCI7XG5cbmV4cG9ydCBjbGFzcyBJbnB1dCBpbXBsZW1lbnRzIElFdmVudCB7XG5cdGdldCByZWRpcmVjdE9uRmluaXNoKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRnZXQgdHJpZ2dlcigpOiBzdHJpbmcge1xuXHRcdHJldHVybiBcImlucHV0XCI7XG5cdH1cblx0Z2V0IG5hbWUoKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gXCJpbnB1dF9maWxsZWRcIjtcblx0fVxuXHRnZXQgaGFzVHlwZXMoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRydWU7ICAgIFxuXHR9XG5cdGdldCB0YXJnZXRzKCk6IEVsZW1lbnRbXSB7XG5cdFx0Y29uc3QgZWxlbWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwic2VsZWN0LHRleHRhcmVhLGlucHV0XCIpO1xuXHRcdHJldHVybiBbLi4uZWxlbWVudHNdLmZpbHRlcihlbGVtZW50ID0+ICFlbGVtZW50Lmhhc0F0dHJpYnV0ZShcImlnbm9yZVwiKSk7XG5cdH1cblxuXHRjaGVja0V2ZW50KGV2ZW50OiBJbnB1dEV2ZW50KTogYm9vbGVhbiB7XG5cdFx0Y29uc3QgaW5wdXQgPSBldmVudC50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudDtcblx0XHRyZXR1cm4gISFpbnB1dC52YWx1ZS50cmltKCk7XG5cdH1cbn0iLCJpbXBvcnQgeyBJRXZlbnQgfSBmcm9tIFwiLi4vRXZlbnRcIjtcblxuZXhwb3J0IGNsYXNzIFBhZ2VMb2FkZWQgaW1wbGVtZW50cyBJRXZlbnQge1xuXHRnZXQgcmVkaXJlY3RPbkZpbmlzaCgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0Z2V0IHRyaWdnZXIoKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gXCJsb2FkXCI7XG5cdH1cblx0Z2V0IG5hbWUoKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gXCJwYWdlX2xvYWRlZFwiO1xuXHR9XG5cdGdldCBoYXNUeXBlcygpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7ICAgIFxuXHR9XG5cdGdldCB0YXJnZXRzKCk6IChFbGVtZW50fFdpbmRvdylbXSB7XG5cdFx0cmV0dXJuIFt3aW5kb3ddO1xuXHR9XG5cdGNoZWNrRXZlbnQoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cbn0iLCJpbXBvcnQgeyBJRXZlbnQgfSBmcm9tIFwiLi4vRXZlbnRcIjtcblxuZXhwb3J0IGNsYXNzIFBhZ2VSZWFkIGltcGxlbWVudHMgSUV2ZW50IHtcblx0cHJpdmF0ZSBtaW5TY3JvbGxQZXJjZW50YWdlID0gMC4xO1xuXHRwcml2YXRlIG1pblN0YXlTZWNvbmRzID0gMyo2MCoxMDAwO1xuXHRwcml2YXRlIGhhc1Njcm9sbGVkID0gZmFsc2U7XG5cdHByaXZhdGUgaGFzU3RheWVkID0gZmFsc2U7XG5cdHByaXZhdGUgY3VzdG9tRXZlbnQ6IEV2ZW50O1xuXHRwcml2YXRlIHRpbWVvdXQ6IGFueTtcblxuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHR0aGlzLmN1c3RvbUV2ZW50ID0gbmV3IEV2ZW50KHRoaXMudHJpZ2dlcik7XG5cdFx0dGhpcy5lbmFibGUoKTtcblx0fVxuXG5cdHByaXZhdGUgZW5hYmxlKCkge1xuXHRcdHdpbmRvdy5vbnNjcm9sbCA9ICgpID0+IHRoaXMuc2Nyb2xsZWQoKTtcblx0XHR0aGlzLmRldGVjdEZvY3VzKCk7XG5cdFx0dGhpcy5kZXRlY3RWaXNpYmlsaXR5KCk7XG5cdFx0dGhpcy5zY3JvbGxlZCgpO1xuXHRcdHRoaXMudGltZW91dCA9IHNldFRpbWVvdXQgKCgpID0+IHRoaXMuc3RheWVkKCksIHRoaXMubWluU3RheVNlY29uZHMpO1xuXHR9XG5cblx0cHJpdmF0ZSBnZXQgdmlzaWJpbGl0eVByb3BzKCkgOiBbc3RyaW5nLCBzdHJpbmddIHtcblx0XHRjb25zb2xlLmxvZyhcInByb3BzXCIpO1xuXHRcdGlmICh0eXBlb2YgZG9jdW1lbnQuaGlkZGVuICE9PSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRyZXR1cm4gW1widmlzaWJpbGl0eWNoYW5nZVwiLCBcInZpc2liaWxpdHlTdGF0ZVwiXTtcblx0XHR9XG5cdFx0ZWxzZSBpZiAodHlwZW9mIChkb2N1bWVudCBhcyBhbnkpLm1vekhpZGRlbiAhPT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0cmV0dXJuIFtcIm1venZpc2liaWxpdHljaGFuZ2VcIiwgXCJtb3pWaXNpYmlsaXR5U3RhdGVcIl07XG5cdFx0fVxuXHRcdGVsc2UgaWYgKHR5cGVvZiAoZG9jdW1lbnQgYXMgYW55KS5tc0hpZGRlbiAhPT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0cmV0dXJuIFtcIm1zdmlzaWJpbGl0eWNoYW5nZVwiLCBcIm1zVmlzaWJpbGl0eVN0YXRlXCJdO1xuXHRcdH1cblx0XHRlbHNlIGlmICh0eXBlb2YgKGRvY3VtZW50IGFzIGFueSkud2Via2l0SGlkZGVuICE9PSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRyZXR1cm4gW1wid2Via2l0dmlzaWJpbGl0eWNoYW5nZVwiLCBcIndlYmtpdFZpc2liaWxpdHlTdGF0ZVwiXTtcblx0XHR9XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiVmlzaWJpbGl0eSBub3Qgc3VwcG9ydGVkLlwiKTtcblx0fVxuXG5cdHByaXZhdGUgZGV0ZWN0Rm9jdXMoKSB7XG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJmb2N1c1wiLCB0aGlzLmZvY3VzR3JhbnRlZC5iaW5kKHRoaXMpKTtcblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImJsdXJcIiwgdGhpcy5mb2N1c0xvc3QuYmluZCh0aGlzKSk7XG5cdH1cblxuXHRwcml2YXRlIGRldGVjdFZpc2liaWxpdHkoKSB7XG5cdFx0Ly8gY2hlY2sgdGhlIHZpc2libGlsaXR5IG9mIHRoZSBwYWdlXG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IFt2aXNpYmlsaXR5Q2hhbmdlXSA9IHRoaXMudmlzaWJpbGl0eVByb3BzO1xuXHRcdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcih2aXNpYmlsaXR5Q2hhbmdlLCB0aGlzLnZpc2liaWxpdHlDaGFuZ2VkLmJpbmQodGhpcykpO1xuXHRcdH0gY2F0Y2goXykge1xuXHRcdFx0Ly8gXG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBzdG9wRGV0ZWN0aW5nVmlzaWJpbGl0eSgpIHtcblx0XHQvLyBjaGVjayB0aGUgdmlzaWJsaWxpdHkgb2YgdGhlIHBhZ2Vcblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgW3Zpc2liaWxpdHlDaGFuZ2VdID0gdGhpcy52aXNpYmlsaXR5UHJvcHM7XG5cdFx0XHRkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKHZpc2liaWxpdHlDaGFuZ2UsIHRoaXMudmlzaWJpbGl0eUNoYW5nZWQuYmluZCh0aGlzKSk7XG5cdFx0fSBjYXRjaChfKSB7XG5cdFx0XHQvLyBcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIHZpc2liaWxpdHlDaGFuZ2VkKCkge1xuXHRcdGNvbnN0IFtfLCB2aXNpYmlsaXR5U3RhdGVdID0gdGhpcy52aXNpYmlsaXR5UHJvcHM7XG5cdFx0dGhpcy50b2dnbGVUaW1lcihkb2N1bWVudFt2aXNpYmlsaXR5U3RhdGVdID09PSBcInZpc2libGVcIik7XG5cdH1cblxuXHRwcml2YXRlIGZvY3VzR3JhbnRlZCgpIHtcblx0XHR0aGlzLnRvZ2dsZVRpbWVyKHRydWUpO1xuXHR9XG5cblx0cHJpdmF0ZSBmb2N1c0xvc3QoKSB7XG5cdFx0dGhpcy50b2dnbGVUaW1lcihmYWxzZSk7XG5cdH1cblxuXHRwcml2YXRlIHRvZ2dsZVRpbWVyKHN0YXR1czogYm9vbGVhbikge1x0XHRcblx0XHRpZiAodGhpcy5oYXNTdGF5ZWQpIHsgcmV0dXJuOyB9XG5cdFxuXHRcdGlmKHN0YXR1cykge1xuXHRcdFx0dGhpcy50aW1lb3V0ID0gc2V0VGltZW91dCAoKCkgPT4gdGhpcy5zdGF5ZWQoKSwgdGhpcy5taW5TdGF5U2Vjb25kcyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXQpO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgZGlzYWJsZSgpIHtcblx0XHR3aW5kb3cub25zY3JvbGwgPSBudWxsO1xuXHRcdHRoaXMuc3RvcERldGVjdGluZ1Zpc2liaWxpdHkoKTtcblx0XHR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImZvY3VzXCIsIHRoaXMuZm9jdXNHcmFudGVkLmJpbmQodGhpcykpO1xuXHRcdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwiYmx1clwiLCB0aGlzLmZvY3VzTG9zdC5iaW5kKHRoaXMpKTtcblx0fVxuXG5cdHByaXZhdGUgZ2V0U2Nyb2xsUGVyY2VudCgpIHtcblx0XHRjb25zdCBoOiBIVE1MRWxlbWVudCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCxcblx0XHRcdGI6IEhUTUxFbGVtZW50ID0gZG9jdW1lbnQuYm9keTtcblxuXHRcdGlmIChiLnNjcm9sbEhlaWdodCA8IGguc2Nyb2xsSGVpZ2h0KSB7XG5cdFx0XHRyZXR1cm4gMTtcblx0XHR9ICAgICAgICAgICAgXG5cblx0XHRyZXR1cm4gKGguc2Nyb2xsVG9wIHx8IGIuc2Nyb2xsVG9wKSAvICgoaC5zY3JvbGxIZWlnaHQgfHwgYi5zY3JvbGxIZWlnaHQpIC0gaC5jbGllbnRIZWlnaHQpICogMTAwO1xuXHR9XG5cblx0cHJpdmF0ZSBzY3JvbGxlZCgpIHtcblx0XHRpZih0aGlzLmdldFNjcm9sbFBlcmNlbnQoKSA+IHRoaXMubWluU2Nyb2xsUGVyY2VudGFnZSkge1xuXHRcdFx0aWYodGhpcy5oYXNTdGF5ZWQpIHtcblx0XHRcdFx0dGhpcy5kaXNwYXRjaCgpO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5oYXNTY3JvbGxlZCA9IHRydWU7XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBzdGF5ZWQoKSB7XG5cdFx0aWYodGhpcy5oYXNTY3JvbGxlZCkge1xuXHRcdFx0dGhpcy5kaXNwYXRjaCgpO1xuXHRcdH1cblx0XHR0aGlzLmhhc1N0YXllZCA9IHRydWU7XG5cdH1cblxuXHRwcml2YXRlIGRpc3BhdGNoKCkge1xuXHRcdHdpbmRvdy5kaXNwYXRjaEV2ZW50KHRoaXMuY3VzdG9tRXZlbnQpO1xuXHRcdHRoaXMuZGlzYWJsZSgpO1xuXHR9XG5cblx0Z2V0IHJlZGlyZWN0T25GaW5pc2goKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCB0cmlnZ2VyKCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIFwicGFnZV9yZWFkXCI7XG5cdH1cblx0Z2V0IG5hbWUoKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gXCJwYWdlX3JlYWRcIjtcblx0fVxuXHRnZXQgaGFzVHlwZXMoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlOyAgICBcblx0fVxuXHRnZXQgdGFyZ2V0cygpOiAoV2luZG93fEVsZW1lbnQpW10ge1xuXHRcdHJldHVybiBbd2luZG93XTtcblx0fVxuXHRjaGVja0V2ZW50KCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG59IiwiaW1wb3J0IHsgSUV2ZW50IH0gZnJvbSBcIi4uL0V2ZW50XCI7XG5cbmV4cG9ydCBjbGFzcyBTdWJtaXQgaW1wbGVtZW50cyBJRXZlbnQge1xuXHRnZXQgcmVkaXJlY3RPbkZpbmlzaCgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXHRnZXQgdHJpZ2dlcigpOiBzdHJpbmcge1xuXHRcdHJldHVybiBcInN1Ym1pdFwiO1xuXHR9XG5cdGdldCBuYW1lKCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIFwiZm9ybV9zdWJtaXR0ZWRcIjtcblx0fVxuXHRnZXQgaGFzVHlwZXMoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRydWU7ICAgIFxuXHR9XG5cdGdldCB0YXJnZXRzKCk6IEVsZW1lbnRbXSB7XG5cdFx0Y29uc3QgZWxlbWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiZm9ybVwiKTtcblx0XHRyZXR1cm4gWy4uLmVsZW1lbnRzXS5maWx0ZXIoZWxlbWVudCA9PiAhZWxlbWVudC5oYXNBdHRyaWJ1dGUoXCJpZ25vcmVcIikpO1xuXHR9XG5cdGNoZWNrRXZlbnQoZXZlbnQ6IEV2ZW50KTogYm9vbGVhbiB7XG5cdFx0Y29uc3QgZWxlbWVudCA9IGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudDtcblx0XHRyZXR1cm4gZWxlbWVudC5jbGFzc05hbWUuaW5kZXhPZihcImRpc2FibGVkXCIpID09PSAtMTtcblx0fVxufSIsImltcG9ydCB7IEV2ZW50UGF5bG9hZCB9IGZyb20gXCIuL0V2ZW50XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlbW90ZSB7XG5cdHByaXZhdGUgYXBpX2tleTogc3RyaW5nO1xuXHRwcml2YXRlIHVybDogc3RyaW5nO1xuXHRwcml2YXRlIGRlYnVnOiBib29sZWFuO1xuICAgIFxuXHRjb25zdHJ1Y3RvcihhcGlfa2V5OiBzdHJpbmcsIHVybDogc3RyaW5nLCBkZWJ1ZzogYm9vbGVhbikge1xuXHRcdHRoaXMuYXBpX2tleSA9IGFwaV9rZXk7XG5cdFx0dGhpcy51cmwgPSB1cmw7XG5cdFx0dGhpcy5kZWJ1ZyA9IGRlYnVnO1xuXHR9XG5cblx0cHVibGljIHBvc3QoZGF0YTogRXZlbnRQYXlsb2FkKTogUHJvbWlzZTxvYmplY3Q+IHtcblx0XHRpZiAodGhpcy5kZWJ1Zykge1xuXHRcdFx0Y29uc29sZS5sb2coYFNlbmRpbmcgZXZlbnQgdG8gJHt0aGlzLnVybH0gd2l0aCBkYXRhOmApO1xuXHRcdFx0Y29uc29sZS50YWJsZShkYXRhKTtcblx0XHR9XG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdGNvbnN0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXHRcdFx0eGhyLm9wZW4oXCJQT1NUXCIsIHRoaXMudXJsLCB0cnVlKTtcblx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC10eXBlXCIsIFwiYXBwbGljYXRpb24vanNvblwiKTtcblx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiYXBpLWtleVwiLCB0aGlzLmFwaV9rZXkpO1xuICAgICAgICAgICAgXG5cdFx0XHR4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRpZiAoeGhyLnJlYWR5U3RhdGUgPT09IDQgJiYgeGhyLnN0YXR1cyA9PT0gMjAwKSB7XG5cdFx0XHRcdFx0Y29uc3QganNvbiA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCk7XG5cdFx0XHRcdFx0cmVzb2x2ZShqc29uKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdFx0eGhyLm9uZXJyb3IgPSBmdW5jdGlvbihlKSB7XG5cdFx0XHRcdHJlamVjdChlKTtcblx0XHRcdH07XG5cblx0XHRcdHhoci5zZW5kKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcblx0XHR9KTtcblx0fVxufSAiLCIvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8qIFVBUGFyc2VyLmpzIHYxLjAuMlxuICAgQ29weXJpZ2h0IMKpIDIwMTItMjAyMSBGYWlzYWwgU2FsbWFuIDxmQGZhaXNhbG1hbi5jb20+XG4gICBNSVQgTGljZW5zZSAqLy8qXG4gICBEZXRlY3QgQnJvd3NlciwgRW5naW5lLCBPUywgQ1BVLCBhbmQgRGV2aWNlIHR5cGUvbW9kZWwgZnJvbSBVc2VyLUFnZW50IGRhdGEuXG4gICBTdXBwb3J0cyBicm93c2VyICYgbm9kZS5qcyBlbnZpcm9ubWVudC4gXG4gICBEZW1vICAgOiBodHRwczovL2ZhaXNhbG1hbi5naXRodWIuaW8vdWEtcGFyc2VyLWpzXG4gICBTb3VyY2UgOiBodHRwczovL2dpdGh1Yi5jb20vZmFpc2FsbWFuL3VhLXBhcnNlci1qcyAqL1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbihmdW5jdGlvbiAod2luZG93LCB1bmRlZmluZWQpIHtcblxuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIC8vLy8vLy8vLy8vLy8vXG4gICAgLy8gQ29uc3RhbnRzXG4gICAgLy8vLy8vLy8vLy8vL1xuXG5cbiAgICB2YXIgTElCVkVSU0lPTiAgPSAnMS4wLjInLFxuICAgICAgICBFTVBUWSAgICAgICA9ICcnLFxuICAgICAgICBVTktOT1dOICAgICA9ICc/JyxcbiAgICAgICAgRlVOQ19UWVBFICAgPSAnZnVuY3Rpb24nLFxuICAgICAgICBVTkRFRl9UWVBFICA9ICd1bmRlZmluZWQnLFxuICAgICAgICBPQkpfVFlQRSAgICA9ICdvYmplY3QnLFxuICAgICAgICBTVFJfVFlQRSAgICA9ICdzdHJpbmcnLFxuICAgICAgICBNQUpPUiAgICAgICA9ICdtYWpvcicsXG4gICAgICAgIE1PREVMICAgICAgID0gJ21vZGVsJyxcbiAgICAgICAgTkFNRSAgICAgICAgPSAnbmFtZScsXG4gICAgICAgIFRZUEUgICAgICAgID0gJ3R5cGUnLFxuICAgICAgICBWRU5ET1IgICAgICA9ICd2ZW5kb3InLFxuICAgICAgICBWRVJTSU9OICAgICA9ICd2ZXJzaW9uJyxcbiAgICAgICAgQVJDSElURUNUVVJFPSAnYXJjaGl0ZWN0dXJlJyxcbiAgICAgICAgQ09OU09MRSAgICAgPSAnY29uc29sZScsXG4gICAgICAgIE1PQklMRSAgICAgID0gJ21vYmlsZScsXG4gICAgICAgIFRBQkxFVCAgICAgID0gJ3RhYmxldCcsXG4gICAgICAgIFNNQVJUVFYgICAgID0gJ3NtYXJ0dHYnLFxuICAgICAgICBXRUFSQUJMRSAgICA9ICd3ZWFyYWJsZScsXG4gICAgICAgIEVNQkVEREVEICAgID0gJ2VtYmVkZGVkJyxcbiAgICAgICAgVUFfTUFYX0xFTkdUSCA9IDI1NTtcblxuICAgIHZhciBBTUFaT04gID0gJ0FtYXpvbicsXG4gICAgICAgIEFQUExFICAgPSAnQXBwbGUnLFxuICAgICAgICBBU1VTICAgID0gJ0FTVVMnLFxuICAgICAgICBCTEFDS0JFUlJZID0gJ0JsYWNrQmVycnknLFxuICAgICAgICBCUk9XU0VSID0gJ0Jyb3dzZXInLFxuICAgICAgICBDSFJPTUUgID0gJ0Nocm9tZScsXG4gICAgICAgIEVER0UgICAgPSAnRWRnZScsXG4gICAgICAgIEZJUkVGT1ggPSAnRmlyZWZveCcsXG4gICAgICAgIEdPT0dMRSAgPSAnR29vZ2xlJyxcbiAgICAgICAgSFVBV0VJICA9ICdIdWF3ZWknLFxuICAgICAgICBMRyAgICAgID0gJ0xHJyxcbiAgICAgICAgTUlDUk9TT0ZUID0gJ01pY3Jvc29mdCcsXG4gICAgICAgIE1PVE9ST0xBICA9ICdNb3Rvcm9sYScsXG4gICAgICAgIE9QRVJBICAgPSAnT3BlcmEnLFxuICAgICAgICBTQU1TVU5HID0gJ1NhbXN1bmcnLFxuICAgICAgICBTT05ZICAgID0gJ1NvbnknLFxuICAgICAgICBYSUFPTUkgID0gJ1hpYW9taScsXG4gICAgICAgIFpFQlJBICAgPSAnWmVicmEnLFxuICAgICAgICBGQUNFQk9PSyAgID0gJ0ZhY2Vib29rJztcblxuICAgIC8vLy8vLy8vLy8vXG4gICAgLy8gSGVscGVyXG4gICAgLy8vLy8vLy8vL1xuXG4gICAgdmFyIGV4dGVuZCA9IGZ1bmN0aW9uIChyZWdleGVzLCBleHRlbnNpb25zKSB7XG4gICAgICAgICAgICB2YXIgbWVyZ2VkUmVnZXhlcyA9IHt9O1xuICAgICAgICAgICAgZm9yICh2YXIgaSBpbiByZWdleGVzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGV4dGVuc2lvbnNbaV0gJiYgZXh0ZW5zaW9uc1tpXS5sZW5ndGggJSAyID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIG1lcmdlZFJlZ2V4ZXNbaV0gPSBleHRlbnNpb25zW2ldLmNvbmNhdChyZWdleGVzW2ldKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBtZXJnZWRSZWdleGVzW2ldID0gcmVnZXhlc1tpXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbWVyZ2VkUmVnZXhlcztcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyaXplID0gZnVuY3Rpb24gKGFycikge1xuICAgICAgICAgICAgdmFyIGVudW1zID0ge307XG4gICAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8YXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZW51bXNbYXJyW2ldLnRvVXBwZXJDYXNlKCldID0gYXJyW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGVudW1zO1xuICAgICAgICB9LFxuICAgICAgICBoYXMgPSBmdW5jdGlvbiAoc3RyMSwgc3RyMikge1xuICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiBzdHIxID09PSBTVFJfVFlQRSA/IGxvd2VyaXplKHN0cjIpLmluZGV4T2YobG93ZXJpemUoc3RyMSkpICE9PSAtMSA6IGZhbHNlO1xuICAgICAgICB9LFxuICAgICAgICBsb3dlcml6ZSA9IGZ1bmN0aW9uIChzdHIpIHtcbiAgICAgICAgICAgIHJldHVybiBzdHIudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgfSxcbiAgICAgICAgbWFqb3JpemUgPSBmdW5jdGlvbiAodmVyc2lvbikge1xuICAgICAgICAgICAgcmV0dXJuIHR5cGVvZih2ZXJzaW9uKSA9PT0gU1RSX1RZUEUgPyB2ZXJzaW9uLnJlcGxhY2UoL1teXFxkXFwuXS9nLCBFTVBUWSkuc3BsaXQoJy4nKVswXSA6IHVuZGVmaW5lZDtcbiAgICAgICAgfSxcbiAgICAgICAgdHJpbSA9IGZ1bmN0aW9uIChzdHIsIGxlbikge1xuICAgICAgICAgICAgaWYgKHR5cGVvZihzdHIpID09PSBTVFJfVFlQRSkge1xuICAgICAgICAgICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKC9eXFxzXFxzKi8sIEVNUFRZKS5yZXBsYWNlKC9cXHNcXHMqJC8sIEVNUFRZKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHlwZW9mKGxlbikgPT09IFVOREVGX1RZUEUgPyBzdHIgOiBzdHIuc3Vic3RyaW5nKDAsIFVBX01BWF9MRU5HVEgpO1xuICAgICAgICAgICAgfVxuICAgIH07XG5cbiAgICAvLy8vLy8vLy8vLy8vLy9cbiAgICAvLyBNYXAgaGVscGVyXG4gICAgLy8vLy8vLy8vLy8vLy9cblxuICAgIHZhciByZ3hNYXBwZXIgPSBmdW5jdGlvbiAodWEsIGFycmF5cykge1xuXG4gICAgICAgICAgICB2YXIgaSA9IDAsIGosIGssIHAsIHEsIG1hdGNoZXMsIG1hdGNoO1xuXG4gICAgICAgICAgICAvLyBsb29wIHRocm91Z2ggYWxsIHJlZ2V4ZXMgbWFwc1xuICAgICAgICAgICAgd2hpbGUgKGkgPCBhcnJheXMubGVuZ3RoICYmICFtYXRjaGVzKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgcmVnZXggPSBhcnJheXNbaV0sICAgICAgIC8vIGV2ZW4gc2VxdWVuY2UgKDAsMiw0LC4uKVxuICAgICAgICAgICAgICAgICAgICBwcm9wcyA9IGFycmF5c1tpICsgMV07ICAgLy8gb2RkIHNlcXVlbmNlICgxLDMsNSwuLilcbiAgICAgICAgICAgICAgICBqID0gayA9IDA7XG5cbiAgICAgICAgICAgICAgICAvLyB0cnkgbWF0Y2hpbmcgdWFzdHJpbmcgd2l0aCByZWdleGVzXG4gICAgICAgICAgICAgICAgd2hpbGUgKGogPCByZWdleC5sZW5ndGggJiYgIW1hdGNoZXMpIHtcblxuICAgICAgICAgICAgICAgICAgICBtYXRjaGVzID0gcmVnZXhbaisrXS5leGVjKHVhKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoISFtYXRjaGVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHAgPSAwOyBwIDwgcHJvcHMubGVuZ3RoOyBwKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXRjaCA9IG1hdGNoZXNbKytrXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBxID0gcHJvcHNbcF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2hlY2sgaWYgZ2l2ZW4gcHJvcGVydHkgaXMgYWN0dWFsbHkgYXJyYXlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHEgPT09IE9CSl9UWVBFICYmIHEubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocS5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcVsxXSA9PSBGVU5DX1RZUEUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhc3NpZ24gbW9kaWZpZWQgbWF0Y2hcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzW3FbMF1dID0gcVsxXS5jYWxsKHRoaXMsIG1hdGNoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYXNzaWduIGdpdmVuIHZhbHVlLCBpZ25vcmUgcmVnZXggbWF0Y2hcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzW3FbMF1dID0gcVsxXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChxLmxlbmd0aCA9PT0gMykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2hlY2sgd2hldGhlciBmdW5jdGlvbiBvciByZWdleFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBxWzFdID09PSBGVU5DX1RZUEUgJiYgIShxWzFdLmV4ZWMgJiYgcVsxXS50ZXN0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNhbGwgZnVuY3Rpb24gKHVzdWFsbHkgc3RyaW5nIG1hcHBlcilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzW3FbMF1dID0gbWF0Y2ggPyBxWzFdLmNhbGwodGhpcywgbWF0Y2gsIHFbMl0pIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBzYW5pdGl6ZSBtYXRjaCB1c2luZyBnaXZlbiByZWdleFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNbcVswXV0gPSBtYXRjaCA/IG1hdGNoLnJlcGxhY2UocVsxXSwgcVsyXSkgOiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocS5sZW5ndGggPT09IDQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzW3FbMF1dID0gbWF0Y2ggPyBxWzNdLmNhbGwodGhpcywgbWF0Y2gucmVwbGFjZShxWzFdLCBxWzJdKSkgOiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzW3FdID0gbWF0Y2ggPyBtYXRjaCA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaSArPSAyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHN0ck1hcHBlciA9IGZ1bmN0aW9uIChzdHIsIG1hcCkge1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpIGluIG1hcCkge1xuICAgICAgICAgICAgICAgIC8vIGNoZWNrIGlmIGN1cnJlbnQgdmFsdWUgaXMgYXJyYXlcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG1hcFtpXSA9PT0gT0JKX1RZUEUgJiYgbWFwW2ldLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBtYXBbaV0ubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChoYXMobWFwW2ldW2pdLCBzdHIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChpID09PSBVTktOT1dOKSA/IHVuZGVmaW5lZCA6IGk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGhhcyhtYXBbaV0sIHN0cikpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChpID09PSBVTktOT1dOKSA/IHVuZGVmaW5lZCA6IGk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHN0cjtcbiAgICB9O1xuXG4gICAgLy8vLy8vLy8vLy8vLy8vXG4gICAgLy8gU3RyaW5nIG1hcFxuICAgIC8vLy8vLy8vLy8vLy8vXG5cbiAgICAvLyBTYWZhcmkgPCAzLjBcbiAgICB2YXIgb2xkU2FmYXJpTWFwID0ge1xuICAgICAgICAgICAgJzEuMCcgICA6ICcvOCcsXG4gICAgICAgICAgICAnMS4yJyAgIDogJy8xJyxcbiAgICAgICAgICAgICcxLjMnICAgOiAnLzMnLFxuICAgICAgICAgICAgJzIuMCcgICA6ICcvNDEyJyxcbiAgICAgICAgICAgICcyLjAuMicgOiAnLzQxNicsXG4gICAgICAgICAgICAnMi4wLjMnIDogJy80MTcnLFxuICAgICAgICAgICAgJzIuMC40JyA6ICcvNDE5JyxcbiAgICAgICAgICAgICc/JyAgICAgOiAnLydcbiAgICAgICAgfSxcbiAgICAgICAgd2luZG93c1ZlcnNpb25NYXAgPSB7XG4gICAgICAgICAgICAnTUUnICAgICAgICA6ICc0LjkwJyxcbiAgICAgICAgICAgICdOVCAzLjExJyAgIDogJ05UMy41MScsXG4gICAgICAgICAgICAnTlQgNC4wJyAgICA6ICdOVDQuMCcsXG4gICAgICAgICAgICAnMjAwMCcgICAgICA6ICdOVCA1LjAnLFxuICAgICAgICAgICAgJ1hQJyAgICAgICAgOiBbJ05UIDUuMScsICdOVCA1LjInXSxcbiAgICAgICAgICAgICdWaXN0YScgICAgIDogJ05UIDYuMCcsXG4gICAgICAgICAgICAnNycgICAgICAgICA6ICdOVCA2LjEnLFxuICAgICAgICAgICAgJzgnICAgICAgICAgOiAnTlQgNi4yJyxcbiAgICAgICAgICAgICc4LjEnICAgICAgIDogJ05UIDYuMycsXG4gICAgICAgICAgICAnMTAnICAgICAgICA6IFsnTlQgNi40JywgJ05UIDEwLjAnXSxcbiAgICAgICAgICAgICdSVCcgICAgICAgIDogJ0FSTSdcbiAgICB9O1xuXG4gICAgLy8vLy8vLy8vLy8vLy9cbiAgICAvLyBSZWdleCBtYXBcbiAgICAvLy8vLy8vLy8vLy8vXG5cbiAgICB2YXIgcmVnZXhlcyA9IHtcblxuICAgICAgICBicm93c2VyIDogW1tcblxuICAgICAgICAgICAgL1xcYig/OmNybW98Y3Jpb3MpXFwvKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ2hyb21lIGZvciBBbmRyb2lkL2lPU1xuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCAnQ2hyb21lJ11dLCBbXG4gICAgICAgICAgICAvZWRnKD86ZXxpb3N8YSk/XFwvKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1pY3Jvc29mdCBFZGdlXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsICdFZGdlJ11dLCBbXG5cbiAgICAgICAgICAgIC8vIFByZXN0byBiYXNlZFxuICAgICAgICAgICAgLyhvcGVyYSBtaW5pKVxcLyhbLVxcd1xcLl0rKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBPcGVyYSBNaW5pXG4gICAgICAgICAgICAvKG9wZXJhIFttb2JpbGV0YWJdezMsNn0pXFxiLit2ZXJzaW9uXFwvKFstXFx3XFwuXSspL2ksICAgICAgICAgICAgICAgICAvLyBPcGVyYSBNb2JpL1RhYmxldFxuICAgICAgICAgICAgLyhvcGVyYSkoPzouK3ZlcnNpb25cXC98W1xcLyBdKykoW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gT3BlcmFcbiAgICAgICAgICAgIF0sIFtOQU1FLCBWRVJTSU9OXSwgW1xuICAgICAgICAgICAgL29waW9zW1xcLyBdKyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBPcGVyYSBtaW5pIG9uIGlwaG9uZSA+PSA4LjBcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgT1BFUkErJyBNaW5pJ11dLCBbXG4gICAgICAgICAgICAvXFxib3ByXFwvKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBPcGVyYSBXZWJraXRcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgT1BFUkFdXSwgW1xuXG4gICAgICAgICAgICAvLyBNaXhlZFxuICAgICAgICAgICAgLyhraW5kbGUpXFwvKFtcXHdcXC5dKykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBLaW5kbGVcbiAgICAgICAgICAgIC8obHVuYXNjYXBlfG1heHRob258bmV0ZnJvbnR8amFzbWluZXxibGF6ZXIpW1xcLyBdPyhbXFx3XFwuXSopL2ksICAgICAgLy8gTHVuYXNjYXBlL01heHRob24vTmV0ZnJvbnQvSmFzbWluZS9CbGF6ZXJcbiAgICAgICAgICAgIC8vIFRyaWRlbnQgYmFzZWRcbiAgICAgICAgICAgIC8oYXZhbnQgfGllbW9iaWxlfHNsaW0pKD86YnJvd3Nlcik/W1xcLyBdPyhbXFx3XFwuXSopL2ksICAgICAgICAgICAgICAgLy8gQXZhbnQvSUVNb2JpbGUvU2xpbUJyb3dzZXJcbiAgICAgICAgICAgIC8oYmE/aWR1YnJvd3NlcilbXFwvIF0/KFtcXHdcXC5dKykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQmFpZHUgQnJvd3NlclxuICAgICAgICAgICAgLyg/Om1zfFxcKCkoaWUpIChbXFx3XFwuXSspL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBJbnRlcm5ldCBFeHBsb3JlclxuXG4gICAgICAgICAgICAvLyBXZWJraXQvS0hUTUwgYmFzZWQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZsb2NrL1JvY2tNZWx0L01pZG9yaS9FcGlwaGFueS9TaWxrL1NreWZpcmUvQm9sdC9Jcm9uL0lyaWRpdW0vUGhhbnRvbUpTL0Jvd3Nlci9RdXBaaWxsYS9GYWxrb25cbiAgICAgICAgICAgIC8oZmxvY2t8cm9ja21lbHR8bWlkb3JpfGVwaXBoYW55fHNpbGt8c2t5ZmlyZXxvdmlicm93c2VyfGJvbHR8aXJvbnx2aXZhbGRpfGlyaWRpdW18cGhhbnRvbWpzfGJvd3NlcnxxdWFya3xxdXB6aWxsYXxmYWxrb258cmVrb25xfHB1ZmZpbnxicmF2ZXx3aGFsZXxxcWJyb3dzZXJsaXRlfHFxKVxcLyhbLVxcd1xcLl0rKS9pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBSZWtvbnEvUHVmZmluL0JyYXZlL1doYWxlL1FRQnJvd3NlckxpdGUvUVEsIGFrYSBTaG91UVxuICAgICAgICAgICAgLyh3ZWlibylfXyhbXFxkXFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdlaWJvXG4gICAgICAgICAgICBdLCBbTkFNRSwgVkVSU0lPTl0sIFtcbiAgICAgICAgICAgIC8oPzpcXGJ1Yz8gP2Jyb3dzZXJ8KD86anVjLispdWN3ZWIpW1xcLyBdPyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgIC8vIFVDQnJvd3NlclxuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCAnVUMnK0JST1dTRVJdXSwgW1xuICAgICAgICAgICAgL1xcYnFiY29yZVxcLyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gV2VDaGF0IERlc2t0b3AgZm9yIFdpbmRvd3MgQnVpbHQtaW4gQnJvd3NlclxuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCAnV2VDaGF0KFdpbikgRGVza3RvcCddXSwgW1xuICAgICAgICAgICAgL21pY3JvbWVzc2VuZ2VyXFwvKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBXZUNoYXRcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgJ1dlQ2hhdCddXSwgW1xuICAgICAgICAgICAgL2tvbnF1ZXJvclxcLyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBLb25xdWVyb3JcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgJ0tvbnF1ZXJvciddXSwgW1xuICAgICAgICAgICAgL3RyaWRlbnQuK3J2WzogXShbXFx3XFwuXXsxLDl9KVxcYi4rbGlrZSBnZWNrby9pICAgICAgICAgICAgICAgICAgICAgICAvLyBJRTExXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsICdJRSddXSwgW1xuICAgICAgICAgICAgL3lhYnJvd3NlclxcLyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBZYW5kZXhcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgJ1lhbmRleCddXSwgW1xuICAgICAgICAgICAgLyhhdmFzdHxhdmcpXFwvKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBdmFzdC9BVkcgU2VjdXJlIEJyb3dzZXJcbiAgICAgICAgICAgIF0sIFtbTkFNRSwgLyguKykvLCAnJDEgU2VjdXJlICcrQlJPV1NFUl0sIFZFUlNJT05dLCBbXG4gICAgICAgICAgICAvXFxiZm9jdXNcXC8oW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBGaXJlZm94IEZvY3VzXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsIEZJUkVGT1grJyBGb2N1cyddXSwgW1xuICAgICAgICAgICAgL1xcYm9wdFxcLyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gT3BlcmEgVG91Y2hcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgT1BFUkErJyBUb3VjaCddXSwgW1xuICAgICAgICAgICAgL2NvY19jb2NcXHcrXFwvKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ29jIENvYyBCcm93c2VyXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsICdDb2MgQ29jJ11dLCBbXG4gICAgICAgICAgICAvZG9sZmluXFwvKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIERvbHBoaW5cbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgJ0RvbHBoaW4nXV0sIFtcbiAgICAgICAgICAgIC9jb2FzdFxcLyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gT3BlcmEgQ29hc3RcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgT1BFUkErJyBDb2FzdCddXSwgW1xuICAgICAgICAgICAgL21pdWlicm93c2VyXFwvKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBNSVVJIEJyb3dzZXJcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgJ01JVUkgJytCUk9XU0VSXV0sIFtcbiAgICAgICAgICAgIC9meGlvc1xcLyhbLVxcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRmlyZWZveCBmb3IgaU9TXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsIEZJUkVGT1hdXSwgW1xuICAgICAgICAgICAgL1xcYnFpaHV8KHFpP2hvP28/fDM2MClicm93c2VyL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gMzYwXG4gICAgICAgICAgICBdLCBbW05BTUUsICczNjAgJytCUk9XU0VSXV0sIFtcbiAgICAgICAgICAgIC8ob2N1bHVzfHNhbXN1bmd8c2FpbGZpc2gpYnJvd3NlclxcLyhbXFx3XFwuXSspL2lcbiAgICAgICAgICAgIF0sIFtbTkFNRSwgLyguKykvLCAnJDEgJytCUk9XU0VSXSwgVkVSU0lPTl0sIFsgICAgICAgICAgICAgICAgICAgICAgLy8gT2N1bHVzL1NhbXN1bmcvU2FpbGZpc2ggQnJvd3NlclxuICAgICAgICAgICAgLyhjb21vZG9fZHJhZ29uKVxcLyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDb21vZG8gRHJhZ29uXG4gICAgICAgICAgICBdLCBbW05BTUUsIC9fL2csICcgJ10sIFZFUlNJT05dLCBbXG4gICAgICAgICAgICAvKGVsZWN0cm9uKVxcLyhbXFx3XFwuXSspIHNhZmFyaS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEVsZWN0cm9uLWJhc2VkIEFwcFxuICAgICAgICAgICAgLyh0ZXNsYSkoPzogcXRjYXJicm93c2VyfFxcLygyMFxcZFxcZFxcLlstXFx3XFwuXSspKS9pLCAgICAgICAgICAgICAgICAgICAvLyBUZXNsYVxuICAgICAgICAgICAgL20/KHFxYnJvd3NlcnxiYWlkdWJveGFwcHwyMzQ1RXhwbG9yZXIpW1xcLyBdPyhbXFx3XFwuXSspL2kgICAgICAgICAgICAvLyBRUUJyb3dzZXIvQmFpZHUgQXBwLzIzNDUgQnJvd3NlclxuICAgICAgICAgICAgXSwgW05BTUUsIFZFUlNJT05dLCBbXG4gICAgICAgICAgICAvKG1ldGFzcilbXFwvIF0/KFtcXHdcXC5dKykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNvdUdvdUJyb3dzZXJcbiAgICAgICAgICAgIC8obGJicm93c2VyKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTGllQmFvIEJyb3dzZXJcbiAgICAgICAgICAgIF0sIFtOQU1FXSwgW1xuXG4gICAgICAgICAgICAvLyBXZWJWaWV3XG4gICAgICAgICAgICAvKCg/OmZiYW5cXC9mYmlvc3xmYl9pYWJcXC9mYjRhKSg/IS4rZmJhdil8O2ZiYXZcXC8oW1xcd1xcLl0rKTspL2kgICAgICAgLy8gRmFjZWJvb2sgQXBwIGZvciBpT1MgJiBBbmRyb2lkXG4gICAgICAgICAgICBdLCBbW05BTUUsIEZBQ0VCT09LXSwgVkVSU0lPTl0sIFtcbiAgICAgICAgICAgIC9zYWZhcmkgKGxpbmUpXFwvKFtcXHdcXC5dKykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTGluZSBBcHAgZm9yIGlPU1xuICAgICAgICAgICAgL1xcYihsaW5lKVxcLyhbXFx3XFwuXSspXFwvaWFiL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIExpbmUgQXBwIGZvciBBbmRyb2lkXG4gICAgICAgICAgICAvKGNocm9taXVtfGluc3RhZ3JhbSlbXFwvIF0oWy1cXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIENocm9taXVtL0luc3RhZ3JhbVxuICAgICAgICAgICAgXSwgW05BTUUsIFZFUlNJT05dLCBbXG4gICAgICAgICAgICAvXFxiZ3NhXFwvKFtcXHdcXC5dKykgLipzYWZhcmlcXC8vaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gR29vZ2xlIFNlYXJjaCBBcHBsaWFuY2Ugb24gaU9TXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsICdHU0EnXV0sIFtcblxuICAgICAgICAgICAgL2hlYWRsZXNzY2hyb21lKD86XFwvKFtcXHdcXC5dKyl8ICkvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDaHJvbWUgSGVhZGxlc3NcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgQ0hST01FKycgSGVhZGxlc3MnXV0sIFtcblxuICAgICAgICAgICAgLyB3dlxcKS4rKGNocm9tZSlcXC8oW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ2hyb21lIFdlYlZpZXdcbiAgICAgICAgICAgIF0sIFtbTkFNRSwgQ0hST01FKycgV2ViVmlldyddLCBWRVJTSU9OXSwgW1xuXG4gICAgICAgICAgICAvZHJvaWQuKyB2ZXJzaW9uXFwvKFtcXHdcXC5dKylcXGIuKyg/Om1vYmlsZSBzYWZhcml8c2FmYXJpKS9pICAgICAgICAgICAvLyBBbmRyb2lkIEJyb3dzZXJcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgJ0FuZHJvaWQgJytCUk9XU0VSXV0sIFtcblxuICAgICAgICAgICAgLyhjaHJvbWV8b21uaXdlYnxhcm9yYXxbdGl6ZW5va2FdezV9ID9icm93c2VyKVxcL3Y/KFtcXHdcXC5dKykvaSAgICAgICAvLyBDaHJvbWUvT21uaVdlYi9Bcm9yYS9UaXplbi9Ob2tpYVxuICAgICAgICAgICAgXSwgW05BTUUsIFZFUlNJT05dLCBbXG5cbiAgICAgICAgICAgIC92ZXJzaW9uXFwvKFtcXHdcXC5dKykgLiptb2JpbGVcXC9cXHcrIChzYWZhcmkpL2kgICAgICAgICAgICAgICAgICAgICAgICAvLyBNb2JpbGUgU2FmYXJpXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsICdNb2JpbGUgU2FmYXJpJ11dLCBbXG4gICAgICAgICAgICAvdmVyc2lvblxcLyhbXFx3XFwuXSspIC4qKG1vYmlsZSA/c2FmYXJpfHNhZmFyaSkvaSAgICAgICAgICAgICAgICAgICAgIC8vIFNhZmFyaSAmIFNhZmFyaSBNb2JpbGVcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBOQU1FXSwgW1xuICAgICAgICAgICAgL3dlYmtpdC4rPyhtb2JpbGUgP3NhZmFyaXxzYWZhcmkpKFxcL1tcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAvLyBTYWZhcmkgPCAzLjBcbiAgICAgICAgICAgIF0sIFtOQU1FLCBbVkVSU0lPTiwgc3RyTWFwcGVyLCBvbGRTYWZhcmlNYXBdXSwgW1xuXG4gICAgICAgICAgICAvKHdlYmtpdHxraHRtbClcXC8oW1xcd1xcLl0rKS9pXG4gICAgICAgICAgICBdLCBbTkFNRSwgVkVSU0lPTl0sIFtcblxuICAgICAgICAgICAgLy8gR2Vja28gYmFzZWRcbiAgICAgICAgICAgIC8obmF2aWdhdG9yfG5ldHNjYXBlXFxkPylcXC8oWy1cXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE5ldHNjYXBlXG4gICAgICAgICAgICBdLCBbW05BTUUsICdOZXRzY2FwZSddLCBWRVJTSU9OXSwgW1xuICAgICAgICAgICAgL21vYmlsZSB2cjsgcnY6KFtcXHdcXC5dKylcXCkuK2ZpcmVmb3gvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBGaXJlZm94IFJlYWxpdHlcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgRklSRUZPWCsnIFJlYWxpdHknXV0sIFtcbiAgICAgICAgICAgIC9la2lvaGYuKyhmbG93KVxcLyhbXFx3XFwuXSspL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRmxvd1xuICAgICAgICAgICAgLyhzd2lmdGZveCkvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTd2lmdGZveFxuICAgICAgICAgICAgLyhpY2VkcmFnb258aWNld2Vhc2VsfGNhbWlub3xjaGltZXJhfGZlbm5lY3xtYWVtbyBicm93c2VyfG1pbmltb3xjb25rZXJvcnxrbGFyKVtcXC8gXT8oW1xcd1xcLlxcK10rKS9pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBJY2VEcmFnb24vSWNld2Vhc2VsL0NhbWluby9DaGltZXJhL0Zlbm5lYy9NYWVtby9NaW5pbW8vQ29ua2Vyb3IvS2xhclxuICAgICAgICAgICAgLyhzZWFtb25rZXl8ay1tZWxlb258aWNlY2F0fGljZWFwZXxmaXJlYmlyZHxwaG9lbml4fHBhbGVtb29ufGJhc2lsaXNrfHdhdGVyZm94KVxcLyhbLVxcd1xcLl0rKSQvaSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRmlyZWZveC9TZWFNb25rZXkvSy1NZWxlb24vSWNlQ2F0L0ljZUFwZS9GaXJlYmlyZC9QaG9lbml4XG4gICAgICAgICAgICAvKGZpcmVmb3gpXFwvKFtcXHdcXC5dKykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE90aGVyIEZpcmVmb3gtYmFzZWRcbiAgICAgICAgICAgIC8obW96aWxsYSlcXC8oW1xcd1xcLl0rKSAuK3J2XFw6LitnZWNrb1xcL1xcZCsvaSwgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTW96aWxsYVxuXG4gICAgICAgICAgICAvLyBPdGhlclxuICAgICAgICAgICAgLyhwb2xhcmlzfGx5bnh8ZGlsbG98aWNhYnxkb3Jpc3xhbWF5YXx3M218bmV0c3VyZnxzbGVpcG5pcnxvYmlnb3xtb3NhaWN8KD86Z298aWNlfHVwKVtcXC4gXT9icm93c2VyKVstXFwvIF0/dj8oW1xcd1xcLl0rKS9pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBQb2xhcmlzL0x5bngvRGlsbG8vaUNhYi9Eb3Jpcy9BbWF5YS93M20vTmV0U3VyZi9TbGVpcG5pci9PYmlnby9Nb3NhaWMvR28vSUNFL1VQLkJyb3dzZXJcbiAgICAgICAgICAgIC8obGlua3MpIFxcKChbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTGlua3NcbiAgICAgICAgICAgIF0sIFtOQU1FLCBWRVJTSU9OXVxuICAgICAgICBdLFxuXG4gICAgICAgIGNwdSA6IFtbXG5cbiAgICAgICAgICAgIC8oPzooYW1kfHgoPzooPzo4Nnw2NClbLV9dKT98d293fHdpbik2NClbO1xcKV0vaSAgICAgICAgICAgICAgICAgICAgIC8vIEFNRDY0ICh4NjQpXG4gICAgICAgICAgICBdLCBbW0FSQ0hJVEVDVFVSRSwgJ2FtZDY0J11dLCBbXG5cbiAgICAgICAgICAgIC8oaWEzMig/PTspKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSUEzMiAocXVpY2t0aW1lKVxuICAgICAgICAgICAgXSwgW1tBUkNISVRFQ1RVUkUsIGxvd2VyaXplXV0sIFtcblxuICAgICAgICAgICAgLygoPzppWzM0Nl18eCk4NilbO1xcKV0vaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSUEzMiAoeDg2KVxuICAgICAgICAgICAgXSwgW1tBUkNISVRFQ1RVUkUsICdpYTMyJ11dLCBbXG5cbiAgICAgICAgICAgIC9cXGIoYWFyY2g2NHxhcm0odj84ZT9sP3xfPzY0KSlcXGIvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFSTTY0XG4gICAgICAgICAgICBdLCBbW0FSQ0hJVEVDVFVSRSwgJ2FybTY0J11dLCBbXG5cbiAgICAgICAgICAgIC9cXGIoYXJtKD86dls2N10pP2h0P24/W2ZsXXA/KVxcYi9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBUk1IRlxuICAgICAgICAgICAgXSwgW1tBUkNISVRFQ1RVUkUsICdhcm1oZiddXSwgW1xuXG4gICAgICAgICAgICAvLyBQb2NrZXRQQyBtaXN0YWtlbmx5IGlkZW50aWZpZWQgYXMgUG93ZXJQQ1xuICAgICAgICAgICAgL3dpbmRvd3MgKGNlfG1vYmlsZSk7IHBwYzsvaVxuICAgICAgICAgICAgXSwgW1tBUkNISVRFQ1RVUkUsICdhcm0nXV0sIFtcblxuICAgICAgICAgICAgLygoPzpwcGN8cG93ZXJwYykoPzo2NCk/KSg/OiBtYWN8O3xcXCkpL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUG93ZXJQQ1xuICAgICAgICAgICAgXSwgW1tBUkNISVRFQ1RVUkUsIC9vd2VyLywgRU1QVFksIGxvd2VyaXplXV0sIFtcblxuICAgICAgICAgICAgLyhzdW40XFx3KVs7XFwpXS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNQQVJDXG4gICAgICAgICAgICBdLCBbW0FSQ0hJVEVDVFVSRSwgJ3NwYXJjJ11dLCBbXG5cbiAgICAgICAgICAgIC8oKD86YXZyMzJ8aWE2NCg/PTspKXw2OGsoPz1cXCkpfFxcYmFybSg/PXYoPzpbMS03XXxbNS03XTEpbD98O3xlYWJpKXwoPz1hdG1lbCApYXZyfCg/OmlyaXh8bWlwc3xzcGFyYykoPzo2NCk/XFxifHBhLXJpc2MpL2lcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSUE2NCwgNjhLLCBBUk0vNjQsIEFWUi8zMiwgSVJJWC82NCwgTUlQUy82NCwgU1BBUkMvNjQsIFBBLVJJU0NcbiAgICAgICAgICAgIF0sIFtbQVJDSElURUNUVVJFLCBsb3dlcml6ZV1dXG4gICAgICAgIF0sXG5cbiAgICAgICAgZGV2aWNlIDogW1tcblxuICAgICAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAgICAgICAgIC8vIE1PQklMRVMgJiBUQUJMRVRTXG4gICAgICAgICAgICAvLyBPcmRlcmVkIGJ5IHBvcHVsYXJpdHlcbiAgICAgICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgICAgICAgLy8gU2Ftc3VuZ1xuICAgICAgICAgICAgL1xcYihzY2gtaVs4OV0wXFxkfHNody1tMzgwc3xzbS1bcHRdXFx3ezIsNH18Z3QtW3BuXVxcZHsyLDR9fHNnaC10OFs1Nl05fG5leHVzIDEwKS9pXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIFNBTVNVTkddLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC9cXGIoKD86c1tjZ3BdaHxndHxzbSktXFx3K3xnYWxheHkgbmV4dXMpL2ksXG4gICAgICAgICAgICAvc2Ftc3VuZ1stIF0oWy1cXHddKykvaSxcbiAgICAgICAgICAgIC9zZWMtKHNnaFxcdyspL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgU0FNU1VOR10sIFtUWVBFLCBNT0JJTEVdXSwgW1xuXG4gICAgICAgICAgICAvLyBBcHBsZVxuICAgICAgICAgICAgL1xcKChpcCg/OmhvbmV8b2QpW1xcdyBdKik7L2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlQb2QvaVBob25lXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIEFQUExFXSwgW1RZUEUsIE1PQklMRV1dLCBbXG4gICAgICAgICAgICAvXFwoKGlwYWQpO1stXFx3XFwpLDsgXSthcHBsZS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlQYWRcbiAgICAgICAgICAgIC9hcHBsZWNvcmVtZWRpYVxcL1tcXHdcXC5dKyBcXCgoaXBhZCkvaSxcbiAgICAgICAgICAgIC9cXGIoaXBhZClcXGRcXGQ/LFxcZFxcZD9bO1xcXV0uK2lvcy9pXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIEFQUExFXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG5cbiAgICAgICAgICAgIC8vIEh1YXdlaVxuICAgICAgICAgICAgL1xcYigoPzphZ1tyc11bMjNdP3xiYWgyP3xzaHQ/fGJ0diktYT9bbHddXFxkezJ9KVxcYig/IS4rZFxcL3MpL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgSFVBV0VJXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvKD86aHVhd2VpfGhvbm9yKShbLVxcdyBdKylbO1xcKV0vaSxcbiAgICAgICAgICAgIC9cXGIobmV4dXMgNnB8XFx3ezIsNH0tW2F0dV0/W2xuXVswMTI1OXhdWzAxMjM1OV1bYW5dPylcXGIoPyEuK2RcXC9zKS9pXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIEhVQVdFSV0sIFtUWVBFLCBNT0JJTEVdXSwgW1xuXG4gICAgICAgICAgICAvLyBYaWFvbWlcbiAgICAgICAgICAgIC9cXGIocG9jb1tcXHcgXSspKD86IGJ1aXxcXCkpL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gWGlhb21pIFBPQ09cbiAgICAgICAgICAgIC9cXGI7IChcXHcrKSBidWlsZFxcL2htXFwxL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFhpYW9taSBIb25nbWkgJ251bWVyaWMnIG1vZGVsc1xuICAgICAgICAgICAgL1xcYihobVstXyBdP25vdGU/W18gXT8oPzpcXGRcXHcpPykgYnVpL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBYaWFvbWkgSG9uZ21pXG4gICAgICAgICAgICAvXFxiKHJlZG1pW1xcLV8gXT8oPzpub3RlfGspP1tcXHdfIF0rKSg/OiBidWl8XFwpKS9pLCAgICAgICAgICAgICAgICAgICAvLyBYaWFvbWkgUmVkbWlcbiAgICAgICAgICAgIC9cXGIobWlbLV8gXT8oPzphXFxkfG9uZXxvbmVbXyBdcGx1c3xub3RlIGx0ZXxtYXgpP1tfIF0/KD86XFxkP1xcdz8pW18gXT8oPzpwbHVzfHNlfGxpdGUpPykoPzogYnVpfFxcKSkvaSAvLyBYaWFvbWkgTWlcbiAgICAgICAgICAgIF0sIFtbTU9ERUwsIC9fL2csICcgJ10sIFtWRU5ET1IsIFhJQU9NSV0sIFtUWVBFLCBNT0JJTEVdXSwgW1xuICAgICAgICAgICAgL1xcYihtaVstXyBdPyg/OnBhZCkoPzpbXFx3XyBdKykpKD86IGJ1aXxcXCkpL2kgICAgICAgICAgICAgICAgICAgICAgICAvLyBNaSBQYWQgdGFibGV0c1xuICAgICAgICAgICAgXSxbW01PREVMLCAvXy9nLCAnICddLCBbVkVORE9SLCBYSUFPTUldLCBbVFlQRSwgVEFCTEVUXV0sIFtcblxuICAgICAgICAgICAgLy8gT1BQT1xuICAgICAgICAgICAgLzsgKFxcdyspIGJ1aS4rIG9wcG8vaSxcbiAgICAgICAgICAgIC9cXGIoY3BoWzEyXVxcZHszfXxwKD86YWZ8Y1thbF18ZFxcd3xlW2FyXSlbbXRdXFxkMHx4OTAwN3xhMTAxb3ApXFxiL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ09QUE8nXSwgW1RZUEUsIE1PQklMRV1dLCBbXG5cbiAgICAgICAgICAgIC8vIFZpdm9cbiAgICAgICAgICAgIC92aXZvIChcXHcrKSg/OiBidWl8XFwpKS9pLFxuICAgICAgICAgICAgL1xcYih2WzEyXVxcZHszfVxcdz9bYXRdKSg/OiBidWl8OykvaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnVml2byddLCBbVFlQRSwgTU9CSUxFXV0sIFtcblxuICAgICAgICAgICAgLy8gUmVhbG1lXG4gICAgICAgICAgICAvXFxiKHJteFsxMl1cXGR7M30pKD86IGJ1aXw7fFxcKSkvaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnUmVhbG1lJ10sIFtUWVBFLCBNT0JJTEVdXSwgW1xuXG4gICAgICAgICAgICAvLyBNb3Rvcm9sYVxuICAgICAgICAgICAgL1xcYihtaWxlc3RvbmV8ZHJvaWQoPzpbMi00eF18ICg/OmJpb25pY3x4Mnxwcm98cmF6cikpPzo/KCA0Zyk/KVxcYltcXHcgXStidWlsZFxcLy9pLFxuICAgICAgICAgICAgL1xcYm1vdCg/Om9yb2xhKT9bLSBdKFxcdyopL2ksXG4gICAgICAgICAgICAvKCg/Om1vdG9bXFx3XFwoXFwpIF0rfHh0XFxkezMsNH18bmV4dXMgNikoPz0gYnVpfFxcKSkpL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgTU9UT1JPTEFdLCBbVFlQRSwgTU9CSUxFXV0sIFtcbiAgICAgICAgICAgIC9cXGIobXo2MFxcZHx4b29tWzIgXXswLDJ9KSBidWlsZFxcLy9pXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIE1PVE9ST0xBXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG5cbiAgICAgICAgICAgIC8vIExHXG4gICAgICAgICAgICAvKCg/PWxnKT9bdmxda1xcLT9cXGR7M30pIGJ1aXwgM1xcLlstXFx3OyBdezEwfWxnPy0oWzA2Y3Y5XXszLDR9KS9pXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIExHXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvKGxtKD86LT9mMTAwW252XT98LVtcXHdcXC5dKykoPz0gYnVpfFxcKSl8bmV4dXMgWzQ1XSkvaSxcbiAgICAgICAgICAgIC9cXGJsZ1stZTtcXC8gXSsoKD8hYnJvd3NlcnxuZXRjYXN0fGFuZHJvaWQgdHYpXFx3KykvaSxcbiAgICAgICAgICAgIC9cXGJsZy0/KFtcXGRcXHddKykgYnVpL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgTEddLCBbVFlQRSwgTU9CSUxFXV0sIFtcblxuICAgICAgICAgICAgLy8gTGVub3ZvXG4gICAgICAgICAgICAvKGlkZWF0YWJbLVxcdyBdKykvaSxcbiAgICAgICAgICAgIC9sZW5vdm8gPyhzWzU2XTAwMFstXFx3XSt8dGFiKD86W1xcdyBdKyl8eXRbLVxcZFxcd117Nn18dGJbLVxcZFxcd117Nn0pL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ0xlbm92byddLCBbVFlQRSwgVEFCTEVUXV0sIFtcblxuICAgICAgICAgICAgLy8gTm9raWFcbiAgICAgICAgICAgIC8oPzptYWVtb3xub2tpYSkuKihuOTAwfGx1bWlhIFxcZCspL2ksXG4gICAgICAgICAgICAvbm9raWFbLV8gXT8oWy1cXHdcXC5dKikvaVxuICAgICAgICAgICAgXSwgW1tNT0RFTCwgL18vZywgJyAnXSwgW1ZFTkRPUiwgJ05va2lhJ10sIFtUWVBFLCBNT0JJTEVdXSwgW1xuXG4gICAgICAgICAgICAvLyBHb29nbGVcbiAgICAgICAgICAgIC8ocGl4ZWwgYylcXGIvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEdvb2dsZSBQaXhlbCBDXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIEdPT0dMRV0sIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgL2Ryb2lkLis7IChwaXhlbFtcXGRheGwgXXswLDZ9KSg/OiBidWl8XFwpKS9pICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEdvb2dsZSBQaXhlbFxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBHT09HTEVdLCBbVFlQRSwgTU9CSUxFXV0sIFtcblxuICAgICAgICAgICAgLy8gU29ueVxuICAgICAgICAgICAgL2Ryb2lkLisgKFtjLWddXFxkezR9fHNvWy1nbF1cXHcrfHhxLWFcXHdbNC03XVsxMl0pKD89IGJ1aXxcXCkuK2Nocm9tZVxcLyg/IVsxLTZdezAsMX1cXGRcXC4pKS9pXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIFNPTlldLCBbVFlQRSwgTU9CSUxFXV0sIFtcbiAgICAgICAgICAgIC9zb255IHRhYmxldCBbcHNdL2ksXG4gICAgICAgICAgICAvXFxiKD86c29ueSk/c2dwXFx3Kyg/OiBidWl8XFwpKS9pXG4gICAgICAgICAgICBdLCBbW01PREVMLCAnWHBlcmlhIFRhYmxldCddLCBbVkVORE9SLCBTT05ZXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG5cbiAgICAgICAgICAgIC8vIE9uZVBsdXNcbiAgICAgICAgICAgIC8gKGtiMjAwNXxpbjIwWzEyXTV8YmUyMFsxMl1bNTldKVxcYi9pLFxuICAgICAgICAgICAgLyg/Om9uZSk/KD86cGx1cyk/IChhXFxkMFxcZFxcZCkoPzogYnxcXCkpL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ09uZVBsdXMnXSwgW1RZUEUsIE1PQklMRV1dLCBbXG5cbiAgICAgICAgICAgIC8vIEFtYXpvblxuICAgICAgICAgICAgLyhhbGV4YSl3ZWJtL2ksXG4gICAgICAgICAgICAvKGtmW2Etel17Mn13aSkoIGJ1aXxcXCkpL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBLaW5kbGUgRmlyZSB3aXRob3V0IFNpbGtcbiAgICAgICAgICAgIC8oa2ZbYS16XSspKCBidWl8XFwpKS4rc2lsa1xcLy9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBLaW5kbGUgRmlyZSBIRFxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBBTUFaT05dLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC8oKD86c2R8a2YpWzAzNDloaWpvcnN0dXddKykoIGJ1aXxcXCkpLitzaWxrXFwvL2kgICAgICAgICAgICAgICAgICAgICAvLyBGaXJlIFBob25lXG4gICAgICAgICAgICBdLCBbW01PREVMLCAvKC4rKS9nLCAnRmlyZSBQaG9uZSAkMSddLCBbVkVORE9SLCBBTUFaT05dLCBbVFlQRSwgTU9CSUxFXV0sIFtcblxuICAgICAgICAgICAgLy8gQmxhY2tCZXJyeVxuICAgICAgICAgICAgLyhwbGF5Ym9vayk7Wy1cXHdcXCksOyBdKyhyaW0pL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEJsYWNrQmVycnkgUGxheUJvb2tcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgVkVORE9SLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC9cXGIoKD86YmJbYS1mXXxzdFtodl0pMTAwLVxcZCkvaSxcbiAgICAgICAgICAgIC9cXChiYjEwOyAoXFx3KykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBCbGFja0JlcnJ5IDEwXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIEJMQUNLQkVSUlldLCBbVFlQRSwgTU9CSUxFXV0sIFtcblxuICAgICAgICAgICAgLy8gQXN1c1xuICAgICAgICAgICAgLyg/OlxcYnxhc3VzXykodHJhbnNmb1twcmltZSBdezQsMTB9IFxcdyt8ZWVlcGN8c2xpZGVyIFxcdyt8bmV4dXMgN3xwYWRmb25lfHAwMFtjal0pL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgQVNVU10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgLyAoeltiZXNdNlswMjddWzAxMl1ba21dW2xzXXx6ZW5mb25lIFxcZFxcdz8pXFxiL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgQVNVU10sIFtUWVBFLCBNT0JJTEVdXSwgW1xuXG4gICAgICAgICAgICAvLyBIVENcbiAgICAgICAgICAgIC8obmV4dXMgOSkvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSFRDIE5leHVzIDlcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ0hUQyddLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC8oaHRjKVstO18gXXsxLDJ9KFtcXHcgXSsoPz1cXCl8IGJ1aSl8XFx3KykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSFRDXG5cbiAgICAgICAgICAgIC8vIFpURVxuICAgICAgICAgICAgLyh6dGUpWy0gXShbXFx3IF0rPykoPzogYnVpfFxcL3xcXCkpL2ksXG4gICAgICAgICAgICAvKGFsY2F0ZWx8Z2Vla3NwaG9uZXxuZXhpYW58cGFuYXNvbmljfHNvbnkpWy1fIF0/KFstXFx3XSopL2kgICAgICAgICAvLyBBbGNhdGVsL0dlZWtzUGhvbmUvTmV4aWFuL1BhbmFzb25pYy9Tb255XG4gICAgICAgICAgICBdLCBbVkVORE9SLCBbTU9ERUwsIC9fL2csICcgJ10sIFtUWVBFLCBNT0JJTEVdXSwgW1xuXG4gICAgICAgICAgICAvLyBBY2VyXG4gICAgICAgICAgICAvZHJvaWQuKzsgKFthYl1bMS03XS0/WzAxNzhhXVxcZFxcZD8pL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ0FjZXInXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG5cbiAgICAgICAgICAgIC8vIE1laXp1XG4gICAgICAgICAgICAvZHJvaWQuKzsgKG1bMS01XSBub3RlKSBidWkvaSxcbiAgICAgICAgICAgIC9cXGJtei0oWy1cXHddezIsfSkvaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnTWVpenUnXSwgW1RZUEUsIE1PQklMRV1dLCBbXG5cbiAgICAgICAgICAgIC8vIFNoYXJwXG4gICAgICAgICAgICAvXFxiKHNoLT9bYWx0dnpdP1xcZFxcZFthLWVrbV0/KS9pXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdTaGFycCddLCBbVFlQRSwgTU9CSUxFXV0sIFtcblxuICAgICAgICAgICAgLy8gTUlYRURcbiAgICAgICAgICAgIC8oYmxhY2tiZXJyeXxiZW5xfHBhbG0oPz1cXC0pfHNvbnllcmljc3NvbnxhY2VyfGFzdXN8ZGVsbHxtZWl6dXxtb3Rvcm9sYXxwb2x5dHJvbilbLV8gXT8oWy1cXHddKikvaSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQmxhY2tCZXJyeS9CZW5RL1BhbG0vU29ueS1Fcmljc3Nvbi9BY2VyL0FzdXMvRGVsbC9NZWl6dS9Nb3Rvcm9sYS9Qb2x5dHJvblxuICAgICAgICAgICAgLyhocCkgKFtcXHcgXStcXHcpL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEhQIGlQQVFcbiAgICAgICAgICAgIC8oYXN1cyktPyhcXHcrKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFzdXNcbiAgICAgICAgICAgIC8obWljcm9zb2Z0KTsgKGx1bWlhW1xcdyBdKykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1pY3Jvc29mdCBMdW1pYVxuICAgICAgICAgICAgLyhsZW5vdm8pWy1fIF0/KFstXFx3XSspL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTGVub3ZvXG4gICAgICAgICAgICAvKGpvbGxhKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEpvbGxhXG4gICAgICAgICAgICAvKG9wcG8pID8oW1xcdyBdKykgYnVpL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBPUFBPXG4gICAgICAgICAgICBdLCBbVkVORE9SLCBNT0RFTCwgW1RZUEUsIE1PQklMRV1dLCBbXG5cbiAgICAgICAgICAgIC8oYXJjaG9zKSAoZ2FtZXBhZDI/KS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQXJjaG9zXG4gICAgICAgICAgICAvKGhwKS4rKHRvdWNocGFkKD8hLit0YWJsZXQpfHRhYmxldCkvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEhQIFRvdWNoUGFkXG4gICAgICAgICAgICAvKGtpbmRsZSlcXC8oW1xcd1xcLl0rKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEtpbmRsZVxuICAgICAgICAgICAgLyhub29rKVtcXHcgXStidWlsZFxcLyhcXHcrKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBOb29rXG4gICAgICAgICAgICAvKGRlbGwpIChzdHJlYVtrcHJcXGQgXSpbXFxka29dKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRGVsbCBTdHJlYWtcbiAgICAgICAgICAgIC8obGVbLSBdK3BhbilbLSBdKyhcXHd7MSw5fSkgYnVpL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIExlIFBhbiBUYWJsZXRzXG4gICAgICAgICAgICAvKHRyaW5pdHkpWy0gXSoodFxcZHszfSkgYnVpL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUcmluaXR5IFRhYmxldHNcbiAgICAgICAgICAgIC8oZ2lnYXNldClbLSBdKyhxXFx3ezEsOX0pIGJ1aS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEdpZ2FzZXQgVGFibGV0c1xuICAgICAgICAgICAgLyh2b2RhZm9uZSkgKFtcXHcgXSspKD86XFwpfCBidWkpL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFZvZGFmb25lXG4gICAgICAgICAgICBdLCBbVkVORE9SLCBNT0RFTCwgW1RZUEUsIFRBQkxFVF1dLCBbXG5cbiAgICAgICAgICAgIC8oc3VyZmFjZSBkdW8pL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU3VyZmFjZSBEdW9cbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgTUlDUk9TT0ZUXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvZHJvaWQgW1xcZFxcLl0rOyAoZnBcXGR1PykoPzogYnxcXCkpL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBGYWlycGhvbmVcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ0ZhaXJwaG9uZSddLCBbVFlQRSwgTU9CSUxFXV0sIFtcbiAgICAgICAgICAgIC8odTMwNGFhKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQVQmVFxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnQVQmVCddLCBbVFlQRSwgTU9CSUxFXV0sIFtcbiAgICAgICAgICAgIC9cXGJzaWUtKFxcdyopL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTaWVtZW5zXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdTaWVtZW5zJ10sIFtUWVBFLCBNT0JJTEVdXSwgW1xuICAgICAgICAgICAgL1xcYihyY3RcXHcrKSBiL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFJDQSBUYWJsZXRzXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdSQ0EnXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvXFxiKHZlbnVlW1xcZCBdezIsN30pIGIvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRGVsbCBWZW51ZSBUYWJsZXRzXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdEZWxsJ10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgL1xcYihxKD86bXZ8dGEpXFx3KykgYi9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFZlcml6b24gVGFibGV0XG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdWZXJpem9uJ10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgL1xcYig/OmJhcm5lc1smIF0rbm9ibGUgfGJuW3J0XSkoW1xcd1xcKyBdKikgYi9pICAgICAgICAgICAgICAgICAgICAgICAvLyBCYXJuZXMgJiBOb2JsZSBUYWJsZXRcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ0Jhcm5lcyAmIE5vYmxlJ10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgL1xcYih0bVxcZHszfVxcdyspIGIvaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnTnVWaXNpb24nXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvXFxiKGs4OCkgYi9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBaVEUgSyBTZXJpZXMgVGFibGV0XG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdaVEUnXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvXFxiKG54XFxkezN9aikgYi9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gWlRFIE51YmlhXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdaVEUnXSwgW1RZUEUsIE1PQklMRV1dLCBbXG4gICAgICAgICAgICAvXFxiKGdlblxcZHszfSkgYi4rNDloL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU3dpc3MgR0VOIE1vYmlsZVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnU3dpc3MnXSwgW1RZUEUsIE1PQklMRV1dLCBbXG4gICAgICAgICAgICAvXFxiKHp1clxcZHszfSkgYi9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU3dpc3MgWlVSIFRhYmxldFxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnU3dpc3MnXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvXFxiKCh6ZWtpKT90Yi4qXFxiKSBiL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gWmVraSBUYWJsZXRzXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdaZWtpJ10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgL1xcYihbeXJdXFxkezJ9KSBiL2ksXG4gICAgICAgICAgICAvXFxiKGRyYWdvblstIF0rdG91Y2ggfGR0KShcXHd7NX0pIGIvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRHJhZ29uIFRvdWNoIFRhYmxldFxuICAgICAgICAgICAgXSwgW1tWRU5ET1IsICdEcmFnb24gVG91Y2gnXSwgTU9ERUwsIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgL1xcYihucy0/XFx3ezAsOX0pIGIvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEluc2lnbmlhIFRhYmxldHNcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ0luc2lnbmlhJ10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgL1xcYigobnhhfG5leHQpLT9cXHd7MCw5fSkgYi9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE5leHRCb29rIFRhYmxldHNcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ05leHRCb29rJ10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgL1xcYih4dHJlbWVcXF8pPyh2KDFbMDQ1XXwyWzAxNV18WzM0NjldMHw3WzA1XSkpIGIvaSAgICAgICAgICAgICAgICAgIC8vIFZvaWNlIFh0cmVtZSBQaG9uZXNcbiAgICAgICAgICAgIF0sIFtbVkVORE9SLCAnVm9pY2UnXSwgTU9ERUwsIFtUWVBFLCBNT0JJTEVdXSwgW1xuICAgICAgICAgICAgL1xcYihsdnRlbFxcLSk/KHYxWzEyXSkgYi9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEx2VGVsIFBob25lc1xuICAgICAgICAgICAgXSwgW1tWRU5ET1IsICdMdlRlbCddLCBNT0RFTCwgW1RZUEUsIE1PQklMRV1dLCBbXG4gICAgICAgICAgICAvXFxiKHBoLTEpIC9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBFc3NlbnRpYWwgUEgtMVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnRXNzZW50aWFsJ10sIFtUWVBFLCBNT0JJTEVdXSwgW1xuICAgICAgICAgICAgL1xcYih2KDEwMG1kfDcwMG5hfDcwMTF8OTE3ZykuKlxcYikgYi9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEVudml6ZW4gVGFibGV0c1xuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnRW52aXplbiddLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC9cXGIodHJpb1stXFx3XFwuIF0rKSBiL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTWFjaFNwZWVkIFRhYmxldHNcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ01hY2hTcGVlZCddLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC9cXGJ0dV8oMTQ5MSkgYi9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFJvdG9yIFRhYmxldHNcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ1JvdG9yJ10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgLyhzaGllbGRbXFx3IF0rKSBiL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTnZpZGlhIFNoaWVsZCBUYWJsZXRzXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdOdmlkaWEnXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvKHNwcmludCkgKFxcdyspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTcHJpbnQgUGhvbmVzXG4gICAgICAgICAgICBdLCBbVkVORE9SLCBNT0RFTCwgW1RZUEUsIE1PQklMRV1dLCBbXG4gICAgICAgICAgICAvKGtpblxcLltvbmV0d117M30pL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBNaWNyb3NvZnQgS2luXG4gICAgICAgICAgICBdLCBbW01PREVMLCAvXFwuL2csICcgJ10sIFtWRU5ET1IsIE1JQ1JPU09GVF0sIFtUWVBFLCBNT0JJTEVdXSwgW1xuICAgICAgICAgICAgL2Ryb2lkLis7IChjYzY2NjY/fGV0NVsxNl18bWNbMjM5XVsyM114P3x2YzhbMDNdeD8pXFwpL2kgICAgICAgICAgICAgLy8gWmVicmFcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgWkVCUkFdLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC9kcm9pZC4rOyAoZWMzMHxwczIwfHRjWzItOF1cXGRba3hdKVxcKS9pXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIFpFQlJBXSwgW1RZUEUsIE1PQklMRV1dLCBbXG5cbiAgICAgICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAgICAgICAgIC8vIENPTlNPTEVTXG4gICAgICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgICAgICAgIC8ob3V5YSkvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gT3V5YVxuICAgICAgICAgICAgLyhuaW50ZW5kbykgKFt3aWRzM3V0Y2hdKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBOaW50ZW5kb1xuICAgICAgICAgICAgXSwgW1ZFTkRPUiwgTU9ERUwsIFtUWVBFLCBDT05TT0xFXV0sIFtcbiAgICAgICAgICAgIC9kcm9pZC4rOyAoc2hpZWxkKSBidWkvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTnZpZGlhXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdOdmlkaWEnXSwgW1RZUEUsIENPTlNPTEVdXSwgW1xuICAgICAgICAgICAgLyhwbGF5c3RhdGlvbiBbMzQ1cG9ydGFibGV2aV0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBQbGF5c3RhdGlvblxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBTT05ZXSwgW1RZUEUsIENPTlNPTEVdXSwgW1xuICAgICAgICAgICAgL1xcYih4Ym94KD86IG9uZSk/KD8hOyB4Ym94KSlbXFwpOyBdL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1pY3Jvc29mdCBYYm94XG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIE1JQ1JPU09GVF0sIFtUWVBFLCBDT05TT0xFXV0sIFtcblxuICAgICAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgICAgICAgICAgLy8gU01BUlRUVlNcbiAgICAgICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgICAgICAgL3NtYXJ0LXR2Lisoc2Ftc3VuZykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTYW1zdW5nXG4gICAgICAgICAgICBdLCBbVkVORE9SLCBbVFlQRSwgU01BUlRUVl1dLCBbXG4gICAgICAgICAgICAvaGJidHYuK21hcGxlOyhcXGQrKS9pXG4gICAgICAgICAgICBdLCBbW01PREVMLCAvXi8sICdTbWFydFRWJ10sIFtWRU5ET1IsIFNBTVNVTkddLCBbVFlQRSwgU01BUlRUVl1dLCBbXG4gICAgICAgICAgICAvKG51eDsgbmV0Y2FzdC4rc21hcnR0dnxsZyAobmV0Y2FzdFxcLnR2LTIwMVxcZHxhbmRyb2lkIHR2KSkvaSAgICAgICAgLy8gTEcgU21hcnRUVlxuICAgICAgICAgICAgXSwgW1tWRU5ET1IsIExHXSwgW1RZUEUsIFNNQVJUVFZdXSwgW1xuICAgICAgICAgICAgLyhhcHBsZSkgP3R2L2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBcHBsZSBUVlxuICAgICAgICAgICAgXSwgW1ZFTkRPUiwgW01PREVMLCBBUFBMRSsnIFRWJ10sIFtUWVBFLCBTTUFSVFRWXV0sIFtcbiAgICAgICAgICAgIC9jcmtleS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gR29vZ2xlIENocm9tZWNhc3RcbiAgICAgICAgICAgIF0sIFtbTU9ERUwsIENIUk9NRSsnY2FzdCddLCBbVkVORE9SLCBHT09HTEVdLCBbVFlQRSwgU01BUlRUVl1dLCBbXG4gICAgICAgICAgICAvZHJvaWQuK2FmdChcXHcpKCBidWl8XFwpKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRmlyZSBUVlxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBBTUFaT05dLCBbVFlQRSwgU01BUlRUVl1dLCBbXG4gICAgICAgICAgICAvXFwoZHR2W1xcKTtdLisoYXF1b3MpL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU2hhcnBcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ1NoYXJwJ10sIFtUWVBFLCBTTUFSVFRWXV0sIFtcbiAgICAgICAgICAgIC9cXGIocm9rdSlbXFxkeF0qW1xcKVxcL10oKD86ZHZwLSk/W1xcZFxcLl0qKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUm9rdVxuICAgICAgICAgICAgL2hiYnR2XFwvXFxkK1xcLlxcZCtcXC5cXGQrICtcXChbXFx3IF0qOyAqKFxcd1teO10qKTsoW147XSopL2kgICAgICAgICAgICAgICAvLyBIYmJUViBkZXZpY2VzXG4gICAgICAgICAgICBdLCBbW1ZFTkRPUiwgdHJpbV0sIFtNT0RFTCwgdHJpbV0sIFtUWVBFLCBTTUFSVFRWXV0sIFtcbiAgICAgICAgICAgIC9cXGIoYW5kcm9pZCB0dnxzbWFydFstIF0/dHZ8b3BlcmEgdHZ8dHY7IHJ2OilcXGIvaSAgICAgICAgICAgICAgICAgICAvLyBTbWFydFRWIGZyb20gVW5pZGVudGlmaWVkIFZlbmRvcnNcbiAgICAgICAgICAgIF0sIFtbVFlQRSwgU01BUlRUVl1dLCBbXG5cbiAgICAgICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAgICAgICAgIC8vIFdFQVJBQkxFU1xuICAgICAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICAgICAgICAvKChwZWJibGUpKWFwcC9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFBlYmJsZVxuICAgICAgICAgICAgXSwgW1ZFTkRPUiwgTU9ERUwsIFtUWVBFLCBXRUFSQUJMRV1dLCBbXG4gICAgICAgICAgICAvZHJvaWQuKzsgKGdsYXNzKSBcXGQvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBHb29nbGUgR2xhc3NcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgR09PR0xFXSwgW1RZUEUsIFdFQVJBQkxFXV0sIFtcbiAgICAgICAgICAgIC9kcm9pZC4rOyAod3Q2Mz8wezIsM30pXFwpL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgWkVCUkFdLCBbVFlQRSwgV0VBUkFCTEVdXSwgW1xuICAgICAgICAgICAgLyhxdWVzdCggMik/KS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBPY3VsdXMgUXVlc3RcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgRkFDRUJPT0tdLCBbVFlQRSwgV0VBUkFCTEVdXSwgW1xuXG4gICAgICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgICAgICAgICAvLyBFTUJFRERFRFxuICAgICAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICAgICAgICAvKHRlc2xhKSg/OiBxdGNhcmJyb3dzZXJ8XFwvWy1cXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRlc2xhXG4gICAgICAgICAgICBdLCBbVkVORE9SLCBbVFlQRSwgRU1CRURERURdXSwgW1xuXG4gICAgICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgICAgICAgICAgLy8gTUlYRUQgKEdFTkVSSUMpXG4gICAgICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgICAgICAgIC9kcm9pZCAuKz87IChbXjtdKz8pKD86IGJ1aXxcXCkgYXBwbGV3KS4rPyBtb2JpbGUgc2FmYXJpL2kgICAgICAgICAgIC8vIEFuZHJvaWQgUGhvbmVzIGZyb20gVW5pZGVudGlmaWVkIFZlbmRvcnNcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1RZUEUsIE1PQklMRV1dLCBbXG4gICAgICAgICAgICAvZHJvaWQgLis/OyAoW147XSs/KSg/OiBidWl8XFwpIGFwcGxldykuKz8oPyEgbW9iaWxlKSBzYWZhcmkvaSAgICAgICAvLyBBbmRyb2lkIFRhYmxldHMgZnJvbSBVbmlkZW50aWZpZWQgVmVuZG9yc1xuICAgICAgICAgICAgXSwgW01PREVMLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC9cXGIoKHRhYmxldHx0YWIpWztcXC9dfGZvY3VzXFwvXFxkKD8hLittb2JpbGUpKS9pICAgICAgICAgICAgICAgICAgICAgIC8vIFVuaWRlbnRpZmlhYmxlIFRhYmxldFxuICAgICAgICAgICAgXSwgW1tUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgLyhwaG9uZXxtb2JpbGUoPzpbO1xcL118IHNhZmFyaSl8cGRhKD89Lit3aW5kb3dzIGNlKSkvaSAgICAgICAgICAgICAgLy8gVW5pZGVudGlmaWFibGUgTW9iaWxlXG4gICAgICAgICAgICBdLCBbW1RZUEUsIE1PQklMRV1dLCBbXG4gICAgICAgICAgICAvKGFuZHJvaWRbLVxcd1xcLiBdezAsOX0pOy4rYnVpbC9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gR2VuZXJpYyBBbmRyb2lkIERldmljZVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnR2VuZXJpYyddXVxuICAgICAgICBdLFxuXG4gICAgICAgIGVuZ2luZSA6IFtbXG5cbiAgICAgICAgICAgIC93aW5kb3dzLisgZWRnZVxcLyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBFZGdlSFRNTFxuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCBFREdFKydIVE1MJ11dLCBbXG5cbiAgICAgICAgICAgIC93ZWJraXRcXC81MzdcXC4zNi4rY2hyb21lXFwvKD8hMjcpKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAvLyBCbGlua1xuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCAnQmxpbmsnXV0sIFtcblxuICAgICAgICAgICAgLyhwcmVzdG8pXFwvKFtcXHdcXC5dKykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBQcmVzdG9cbiAgICAgICAgICAgIC8od2Via2l0fHRyaWRlbnR8bmV0ZnJvbnR8bmV0c3VyZnxhbWF5YXxseW54fHczbXxnb2FubmEpXFwvKFtcXHdcXC5dKykvaSwgLy8gV2ViS2l0L1RyaWRlbnQvTmV0RnJvbnQvTmV0U3VyZi9BbWF5YS9MeW54L3czbS9Hb2FubmFcbiAgICAgICAgICAgIC9la2lvaChmbG93KVxcLyhbXFx3XFwuXSspL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRmxvd1xuICAgICAgICAgICAgLyhraHRtbHx0YXNtYW58bGlua3MpW1xcLyBdXFwoPyhbXFx3XFwuXSspL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gS0hUTUwvVGFzbWFuL0xpbmtzXG4gICAgICAgICAgICAvKGljYWIpW1xcLyBdKFsyM11cXC5bXFxkXFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpQ2FiXG4gICAgICAgICAgICBdLCBbTkFNRSwgVkVSU0lPTl0sIFtcblxuICAgICAgICAgICAgL3J2XFw6KFtcXHdcXC5dezEsOX0pXFxiLisoZ2Vja28pL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gR2Vja29cbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBOQU1FXVxuICAgICAgICBdLFxuXG4gICAgICAgIG9zIDogW1tcblxuICAgICAgICAgICAgLy8gV2luZG93c1xuICAgICAgICAgICAgL21pY3Jvc29mdCAod2luZG93cykgKHZpc3RhfHhwKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBXaW5kb3dzIChpVHVuZXMpXG4gICAgICAgICAgICBdLCBbTkFNRSwgVkVSU0lPTl0sIFtcbiAgICAgICAgICAgIC8od2luZG93cykgbnQgNlxcLjI7IChhcm0pL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdpbmRvd3MgUlRcbiAgICAgICAgICAgIC8od2luZG93cyAoPzpwaG9uZSg/OiBvcyk/fG1vYmlsZSkpW1xcLyBdPyhbXFxkXFwuXFx3IF0qKS9pLCAgICAgICAgICAgIC8vIFdpbmRvd3MgUGhvbmVcbiAgICAgICAgICAgIC8od2luZG93cylbXFwvIF0/KFtudGNlXFxkXFwuIF0rXFx3KSg/IS4reGJveCkvaVxuICAgICAgICAgICAgXSwgW05BTUUsIFtWRVJTSU9OLCBzdHJNYXBwZXIsIHdpbmRvd3NWZXJzaW9uTWFwXV0sIFtcbiAgICAgICAgICAgIC8od2luKD89M3w5fG4pfHdpbiA5eCApKFtudFxcZFxcLl0rKS9pXG4gICAgICAgICAgICBdLCBbW05BTUUsICdXaW5kb3dzJ10sIFtWRVJTSU9OLCBzdHJNYXBwZXIsIHdpbmRvd3NWZXJzaW9uTWFwXV0sIFtcblxuICAgICAgICAgICAgLy8gaU9TL21hY09TXG4gICAgICAgICAgICAvaXBbaG9uZWFkXXsyLDR9XFxiKD86LipvcyAoW1xcd10rKSBsaWtlIG1hY3w7IG9wZXJhKS9pLCAgICAgICAgICAgICAgLy8gaU9TXG4gICAgICAgICAgICAvY2ZuZXR3b3JrXFwvLitkYXJ3aW4vaVxuICAgICAgICAgICAgXSwgW1tWRVJTSU9OLCAvXy9nLCAnLiddLCBbTkFNRSwgJ2lPUyddXSwgW1xuICAgICAgICAgICAgLyhtYWMgb3MgeCkgPyhbXFx3XFwuIF0qKS9pLFxuICAgICAgICAgICAgLyhtYWNpbnRvc2h8bWFjX3Bvd2VycGNcXGIpKD8hLitoYWlrdSkvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTWFjIE9TXG4gICAgICAgICAgICBdLCBbW05BTUUsICdNYWMgT1MnXSwgW1ZFUlNJT04sIC9fL2csICcuJ11dLCBbXG5cbiAgICAgICAgICAgIC8vIE1vYmlsZSBPU2VzXG4gICAgICAgICAgICAvZHJvaWQgKFtcXHdcXC5dKylcXGIuKyhhbmRyb2lkWy0gXXg4NikvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFuZHJvaWQteDg2XG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgTkFNRV0sIFsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFuZHJvaWQvV2ViT1MvUU5YL0JhZGEvUklNL01hZW1vL01lZUdvL1NhaWxmaXNoIE9TXG4gICAgICAgICAgICAvKGFuZHJvaWR8d2Vib3N8cW54fGJhZGF8cmltIHRhYmxldCBvc3xtYWVtb3xtZWVnb3xzYWlsZmlzaClbLVxcLyBdPyhbXFx3XFwuXSopL2ksXG4gICAgICAgICAgICAvKGJsYWNrYmVycnkpXFx3KlxcLyhbXFx3XFwuXSopL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBCbGFja2JlcnJ5XG4gICAgICAgICAgICAvKHRpemVufGthaW9zKVtcXC8gXShbXFx3XFwuXSspL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRpemVuL0thaU9TXG4gICAgICAgICAgICAvXFwoKHNlcmllczQwKTsvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTZXJpZXMgNDBcbiAgICAgICAgICAgIF0sIFtOQU1FLCBWRVJTSU9OXSwgW1xuICAgICAgICAgICAgL1xcKGJiKDEwKTsvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQmxhY2tCZXJyeSAxMFxuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCBCTEFDS0JFUlJZXV0sIFtcbiAgICAgICAgICAgIC8oPzpzeW1iaWFuID9vc3xzeW1ib3N8czYwKD89Oyl8c2VyaWVzNjApWy1cXC8gXT8oW1xcd1xcLl0qKS9pICAgICAgICAgLy8gU3ltYmlhblxuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCAnU3ltYmlhbiddXSwgW1xuICAgICAgICAgICAgL21vemlsbGFcXC9bXFxkXFwuXSsgXFwoKD86bW9iaWxlfHRhYmxldHx0dnxtb2JpbGU7IFtcXHcgXSspOyBydjouKyBnZWNrb1xcLyhbXFx3XFwuXSspL2kgLy8gRmlyZWZveCBPU1xuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCBGSVJFRk9YKycgT1MnXV0sIFtcbiAgICAgICAgICAgIC93ZWIwczsuK3J0KHR2KS9pLFxuICAgICAgICAgICAgL1xcYig/OmhwKT93b3MoPzpicm93c2VyKT9cXC8oW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gV2ViT1NcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgJ3dlYk9TJ11dLCBbXG5cbiAgICAgICAgICAgIC8vIEdvb2dsZSBDaHJvbWVjYXN0XG4gICAgICAgICAgICAvY3JrZXlcXC8oW1xcZFxcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEdvb2dsZSBDaHJvbWVjYXN0XG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsIENIUk9NRSsnY2FzdCddXSwgW1xuICAgICAgICAgICAgLyhjcm9zKSBbXFx3XSsgKFtcXHdcXC5dK1xcdykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ2hyb21pdW0gT1NcbiAgICAgICAgICAgIF0sIFtbTkFNRSwgJ0Nocm9taXVtIE9TJ10sIFZFUlNJT05dLFtcblxuICAgICAgICAgICAgLy8gQ29uc29sZVxuICAgICAgICAgICAgLyhuaW50ZW5kb3xwbGF5c3RhdGlvbikgKFt3aWRzMzQ1cG9ydGFibGV2dWNoXSspL2ksICAgICAgICAgICAgICAgICAvLyBOaW50ZW5kby9QbGF5c3RhdGlvblxuICAgICAgICAgICAgLyh4Ym94KTsgK3hib3ggKFteXFwpO10rKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTWljcm9zb2Z0IFhib3ggKDM2MCwgT25lLCBYLCBTLCBTZXJpZXMgWCwgU2VyaWVzIFMpXG5cbiAgICAgICAgICAgIC8vIE90aGVyXG4gICAgICAgICAgICAvXFxiKGpvbGl8cGFsbSlcXGIgPyg/Om9zKT9cXC8/KFtcXHdcXC5dKikvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSm9saS9QYWxtXG4gICAgICAgICAgICAvKG1pbnQpW1xcL1xcKFxcKSBdPyhcXHcqKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBNaW50XG4gICAgICAgICAgICAvKG1hZ2VpYXx2ZWN0b3JsaW51eClbOyBdL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1hZ2VpYS9WZWN0b3JMaW51eFxuICAgICAgICAgICAgLyhba3hsbl0/dWJ1bnR1fGRlYmlhbnxzdXNlfG9wZW5zdXNlfGdlbnRvb3xhcmNoKD89IGxpbnV4KXxzbGFja3dhcmV8ZmVkb3JhfG1hbmRyaXZhfGNlbnRvc3xwY2xpbnV4b3N8cmVkID9oYXR8emVud2Fsa3xsaW5wdXN8cmFzcGJpYW58cGxhbiA5fG1pbml4fHJpc2Mgb3N8Y29udGlraXxkZWVwaW58bWFuamFyb3xlbGVtZW50YXJ5IG9zfHNhYmF5b258bGluc3BpcmUpKD86IGdudVxcL2xpbnV4KT8oPzogZW50ZXJwcmlzZSk/KD86Wy0gXWxpbnV4KT8oPzotZ251KT9bLVxcLyBdPyg/IWNocm9tfHBhY2thZ2UpKFstXFx3XFwuXSopL2ksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFVidW50dS9EZWJpYW4vU1VTRS9HZW50b28vQXJjaC9TbGFja3dhcmUvRmVkb3JhL01hbmRyaXZhL0NlbnRPUy9QQ0xpbnV4T1MvUmVkSGF0L1plbndhbGsvTGlucHVzL1Jhc3BiaWFuL1BsYW45L01pbml4L1JJU0NPUy9Db250aWtpL0RlZXBpbi9NYW5qYXJvL2VsZW1lbnRhcnkvU2FiYXlvbi9MaW5zcGlyZVxuICAgICAgICAgICAgLyhodXJkfGxpbnV4KSA/KFtcXHdcXC5dKikvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEh1cmQvTGludXhcbiAgICAgICAgICAgIC8oZ251KSA/KFtcXHdcXC5dKikvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBHTlVcbiAgICAgICAgICAgIC9cXGIoWy1mcmVudG9wY2doc117MCw1fWJzZHxkcmFnb25mbHkpW1xcLyBdPyg/IWFtZHxbaXgzNDZdezEsMn04NikoW1xcd1xcLl0qKS9pLCAvLyBGcmVlQlNEL05ldEJTRC9PcGVuQlNEL1BDLUJTRC9HaG9zdEJTRC9EcmFnb25GbHlcbiAgICAgICAgICAgIC8oaGFpa3UpIChcXHcrKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEhhaWt1XG4gICAgICAgICAgICBdLCBbTkFNRSwgVkVSU0lPTl0sIFtcbiAgICAgICAgICAgIC8oc3Vub3MpID8oW1xcd1xcLlxcZF0qKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU29sYXJpc1xuICAgICAgICAgICAgXSwgW1tOQU1FLCAnU29sYXJpcyddLCBWRVJTSU9OXSwgW1xuICAgICAgICAgICAgLygoPzpvcGVuKT9zb2xhcmlzKVstXFwvIF0/KFtcXHdcXC5dKikvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTb2xhcmlzXG4gICAgICAgICAgICAvKGFpeCkgKChcXGQpKD89XFwufFxcKXwgKVtcXHdcXC5dKSovaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQUlYXG4gICAgICAgICAgICAvXFxiKGJlb3N8b3NcXC8yfGFtaWdhb3N8bW9ycGhvc3xvcGVudm1zfGZ1Y2hzaWF8aHAtdXgpL2ksICAgICAgICAgICAgLy8gQmVPUy9PUzIvQW1pZ2FPUy9Nb3JwaE9TL09wZW5WTVMvRnVjaHNpYS9IUC1VWFxuICAgICAgICAgICAgLyh1bml4KSA/KFtcXHdcXC5dKikvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFVOSVhcbiAgICAgICAgICAgIF0sIFtOQU1FLCBWRVJTSU9OXVxuICAgICAgICBdXG4gICAgfTtcblxuICAgIC8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLy8gQ29uc3RydWN0b3JcbiAgICAvLy8vLy8vLy8vLy8vLy8vXG5cbiAgICB2YXIgVUFQYXJzZXIgPSBmdW5jdGlvbiAodWEsIGV4dGVuc2lvbnMpIHtcblxuICAgICAgICBpZiAodHlwZW9mIHVhID09PSBPQkpfVFlQRSkge1xuICAgICAgICAgICAgZXh0ZW5zaW9ucyA9IHVhO1xuICAgICAgICAgICAgdWEgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgVUFQYXJzZXIpKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFVBUGFyc2VyKHVhLCBleHRlbnNpb25zKS5nZXRSZXN1bHQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBfdWEgPSB1YSB8fCAoKHR5cGVvZiB3aW5kb3cgIT09IFVOREVGX1RZUEUgJiYgd2luZG93Lm5hdmlnYXRvciAmJiB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudCkgPyB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudCA6IEVNUFRZKTtcbiAgICAgICAgdmFyIF9yZ3htYXAgPSBleHRlbnNpb25zID8gZXh0ZW5kKHJlZ2V4ZXMsIGV4dGVuc2lvbnMpIDogcmVnZXhlcztcblxuICAgICAgICB0aGlzLmdldEJyb3dzZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgX2Jyb3dzZXIgPSB7fTtcbiAgICAgICAgICAgIF9icm93c2VyW05BTUVdID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgX2Jyb3dzZXJbVkVSU0lPTl0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICByZ3hNYXBwZXIuY2FsbChfYnJvd3NlciwgX3VhLCBfcmd4bWFwLmJyb3dzZXIpO1xuICAgICAgICAgICAgX2Jyb3dzZXIubWFqb3IgPSBtYWpvcml6ZShfYnJvd3Nlci52ZXJzaW9uKTtcbiAgICAgICAgICAgIHJldHVybiBfYnJvd3NlcjtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5nZXRDUFUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgX2NwdSA9IHt9O1xuICAgICAgICAgICAgX2NwdVtBUkNISVRFQ1RVUkVdID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgcmd4TWFwcGVyLmNhbGwoX2NwdSwgX3VhLCBfcmd4bWFwLmNwdSk7XG4gICAgICAgICAgICByZXR1cm4gX2NwdTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5nZXREZXZpY2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgX2RldmljZSA9IHt9O1xuICAgICAgICAgICAgX2RldmljZVtWRU5ET1JdID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgX2RldmljZVtNT0RFTF0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBfZGV2aWNlW1RZUEVdID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgcmd4TWFwcGVyLmNhbGwoX2RldmljZSwgX3VhLCBfcmd4bWFwLmRldmljZSk7XG4gICAgICAgICAgICByZXR1cm4gX2RldmljZTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5nZXRFbmdpbmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgX2VuZ2luZSA9IHt9O1xuICAgICAgICAgICAgX2VuZ2luZVtOQU1FXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIF9lbmdpbmVbVkVSU0lPTl0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICByZ3hNYXBwZXIuY2FsbChfZW5naW5lLCBfdWEsIF9yZ3htYXAuZW5naW5lKTtcbiAgICAgICAgICAgIHJldHVybiBfZW5naW5lO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmdldE9TID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIF9vcyA9IHt9O1xuICAgICAgICAgICAgX29zW05BTUVdID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgX29zW1ZFUlNJT05dID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgcmd4TWFwcGVyLmNhbGwoX29zLCBfdWEsIF9yZ3htYXAub3MpO1xuICAgICAgICAgICAgcmV0dXJuIF9vcztcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5nZXRSZXN1bHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHVhICAgICAgOiB0aGlzLmdldFVBKCksXG4gICAgICAgICAgICAgICAgYnJvd3NlciA6IHRoaXMuZ2V0QnJvd3NlcigpLFxuICAgICAgICAgICAgICAgIGVuZ2luZSAgOiB0aGlzLmdldEVuZ2luZSgpLFxuICAgICAgICAgICAgICAgIG9zICAgICAgOiB0aGlzLmdldE9TKCksXG4gICAgICAgICAgICAgICAgZGV2aWNlICA6IHRoaXMuZ2V0RGV2aWNlKCksXG4gICAgICAgICAgICAgICAgY3B1ICAgICA6IHRoaXMuZ2V0Q1BVKClcbiAgICAgICAgICAgIH07XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZ2V0VUEgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gX3VhO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLnNldFVBID0gZnVuY3Rpb24gKHVhKSB7XG4gICAgICAgICAgICBfdWEgPSAodHlwZW9mIHVhID09PSBTVFJfVFlQRSAmJiB1YS5sZW5ndGggPiBVQV9NQVhfTEVOR1RIKSA/IHRyaW0odWEsIFVBX01BWF9MRU5HVEgpIDogdWE7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5zZXRVQShfdWEpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgVUFQYXJzZXIuVkVSU0lPTiA9IExJQlZFUlNJT047XG4gICAgVUFQYXJzZXIuQlJPV1NFUiA9ICBlbnVtZXJpemUoW05BTUUsIFZFUlNJT04sIE1BSk9SXSk7XG4gICAgVUFQYXJzZXIuQ1BVID0gZW51bWVyaXplKFtBUkNISVRFQ1RVUkVdKTtcbiAgICBVQVBhcnNlci5ERVZJQ0UgPSBlbnVtZXJpemUoW01PREVMLCBWRU5ET1IsIFRZUEUsIENPTlNPTEUsIE1PQklMRSwgU01BUlRUViwgVEFCTEVULCBXRUFSQUJMRSwgRU1CRURERURdKTtcbiAgICBVQVBhcnNlci5FTkdJTkUgPSBVQVBhcnNlci5PUyA9IGVudW1lcml6ZShbTkFNRSwgVkVSU0lPTl0pO1xuXG4gICAgLy8vLy8vLy8vLy9cbiAgICAvLyBFeHBvcnRcbiAgICAvLy8vLy8vLy8vXG5cbiAgICAvLyBjaGVjayBqcyBlbnZpcm9ubWVudFxuICAgIGlmICh0eXBlb2YoZXhwb3J0cykgIT09IFVOREVGX1RZUEUpIHtcbiAgICAgICAgLy8gbm9kZWpzIGVudlxuICAgICAgICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gVU5ERUZfVFlQRSAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgICAgICAgICAgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gVUFQYXJzZXI7XG4gICAgICAgIH1cbiAgICAgICAgZXhwb3J0cy5VQVBhcnNlciA9IFVBUGFyc2VyO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHJlcXVpcmVqcyBlbnYgKG9wdGlvbmFsKVxuICAgICAgICBpZiAodHlwZW9mKGRlZmluZSkgPT09IEZVTkNfVFlQRSAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgICAgICBkZWZpbmUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBVQVBhcnNlcjtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB3aW5kb3cgIT09IFVOREVGX1RZUEUpIHtcbiAgICAgICAgICAgIC8vIGJyb3dzZXIgZW52XG4gICAgICAgICAgICB3aW5kb3cuVUFQYXJzZXIgPSBVQVBhcnNlcjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGpRdWVyeS9aZXB0byBzcGVjaWZpYyAob3B0aW9uYWwpXG4gICAgLy8gTm90ZTpcbiAgICAvLyAgIEluIEFNRCBlbnYgdGhlIGdsb2JhbCBzY29wZSBzaG91bGQgYmUga2VwdCBjbGVhbiwgYnV0IGpRdWVyeSBpcyBhbiBleGNlcHRpb24uXG4gICAgLy8gICBqUXVlcnkgYWx3YXlzIGV4cG9ydHMgdG8gZ2xvYmFsIHNjb3BlLCB1bmxlc3MgalF1ZXJ5Lm5vQ29uZmxpY3QodHJ1ZSkgaXMgdXNlZCxcbiAgICAvLyAgIGFuZCB3ZSBzaG91bGQgY2F0Y2ggdGhhdC5cbiAgICB2YXIgJCA9IHR5cGVvZiB3aW5kb3cgIT09IFVOREVGX1RZUEUgJiYgKHdpbmRvdy5qUXVlcnkgfHwgd2luZG93LlplcHRvKTtcbiAgICBpZiAoJCAmJiAhJC51YSkge1xuICAgICAgICB2YXIgcGFyc2VyID0gbmV3IFVBUGFyc2VyKCk7XG4gICAgICAgICQudWEgPSBwYXJzZXIuZ2V0UmVzdWx0KCk7XG4gICAgICAgICQudWEuZ2V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHBhcnNlci5nZXRVQSgpO1xuICAgICAgICB9O1xuICAgICAgICAkLnVhLnNldCA9IGZ1bmN0aW9uICh1YSkge1xuICAgICAgICAgICAgcGFyc2VyLnNldFVBKHVhKTtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBwYXJzZXIuZ2V0UmVzdWx0KCk7XG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wIGluIHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICQudWFbcHJvcF0gPSByZXN1bHRbcHJvcF07XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG59KSh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JyA/IHdpbmRvdyA6IHRoaXMpO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIl9fd2VicGFja19yZXF1aXJlX18uYW1kTyA9IHt9OyIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vaW5kZXgudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=