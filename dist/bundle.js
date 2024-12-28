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
    eventsToInclude: [],
    eventsToExclude: [],
    debug: false,
    shouldRedirect: true,
    redirectUrl: `https://oops.${(0, Tools_1.removeSubdomain)(window.location.hostname)}`,
    source: "LP",
    url: "https://api.attacksimulator.com/v0/client-events",
    extraPayload: {},
};
class ATSEvents {
    constructor(options) {
        const _options = Object.assign(Object.assign({}, defaultOptions), options);
        if (_options.debug) {
            console.log(_options);
        }
        const remote = new Remote_1.default(_options.apiKey, _options.url, _options.debug);
        this.manager = new Manager_1.Manager(remote, _options);
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
/**
 * Reads and decodes a token string to extract campaign information.
 *
 * @param {string} [tokenString] - The token string to be decoded.
 * @param {string} [fileType] - The type of file associated with the campaign.
 * @returns {ICampaignInfo} - The decoded campaign information.
 */
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
/**
 * Finds and returns the campaign information from the URL.
 *
 * @returns {[string, ICampaignInfo]} - A tuple containing the token string and the decoded campaign information.
 * @throws {Error} - Throws an error if the ATTACK Simulator token is missing.
 */
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
    constructor(remote, { eventsToInclude = [], eventsToExclude = [], source, redirectUrl, shouldRedirect, extraPayload, debug = false }) {
        var _a;
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
        this.extraPayload = {};
        this.logger = new Logger_1.default(debug);
        this.remote = remote;
        [this.token, this.campaignInfo] = (0, CampaignInfo_1.findCampaignInfo)();
        this.browserInfo = (0, BrowserInfo_1.findBrowserInfo)();
        this.activeEvents = this.decideActiveEvents(eventsToInclude, eventsToExclude);
        this.logger.info(`Enabled events: ${eventsToInclude.join(" | ")}`);
        this.source = source;
        this.redirectUrl = redirectUrl;
        this.shouldRedirect = shouldRedirect;
        this.extraPayload = extraPayload;
        if ((_a = this.campaignInfo) === null || _a === void 0 ? void 0 : _a.download_type) {
            this.checkDownload().then(() => {
                //
            });
        }
    }
    /**
     * Decides which events should be active based on the provided lists of events to include and exclude.
     *
     * @param {string[]} eventsToInclude - The list of event names to include.
     * @param {string[]} eventsToExclude - The list of event names to exclude.
     * @returns {IEvent[]} - The list of active events.
     */
    decideActiveEvents(eventsToInclude, eventsToExclude) {
        if (eventsToInclude.length) {
            return eventsToInclude.map(name => this.getEvent(name)).filter(event => event !== null);
        }
        const activeEvents = Object.keys(this.supportedEvents).map(name => this.getEvent(name)).filter(event => event !== null);
        if (eventsToExclude.length) {
            return activeEvents.filter(event => !eventsToExclude.includes(event.name));
        }
        return activeEvents;
    }
    /**
     * Retrieves an event instance by its name.
     *
     * @param {string} name - The name of the event to retrieve.
     * @returns {IEvent | null} - The event instance if found, otherwise null.
     */
    getEvent(name) {
        if (!this.supportedEvents[name]) {
            return null;
        }
        return new (this.supportedEvents[name]);
    }
    /**
     * Checks the type of download specified in the campaign information and triggers the corresponding event.
     *
     * @returns {Promise<void>} - A promise that resolves when the appropriate event is triggered.
     */
    checkDownload() {
        switch (this.campaignInfo.download_type) {
            case "file":
                return this.trigger("file_opened");
            case "attachment":
                return this.trigger("attachment_opened");
        }
    }
    /**
     * Starts listening for the active events and sets up the event handlers.
     */
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
    /**
     * Stops listening for the active events and removes the event handlers.
     */
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
    /**
     * Manually triggers the specified event by its name.
     *
     * @param {string} eventName - The name of the event to trigger.
     * @returns {Promise<void>} - A promise that resolves when the event is executed.
     * @throws {Error} - Throws an error if the event is unsupported.
     */
    trigger(eventName) {
        const activeEvent = this.getEvent(eventName);
        if (!activeEvent) {
            throw new Error(`Unsupported event ${eventName}. Please choose one of ${Object.keys(this.supportedEvents).join(", ")}`);
        }
        return this.executeEvent(activeEvent, null, false);
    }
    /**
     * Pre-handles the event by debouncing it if necessary, otherwise directly handles it.
     *
     * @param {IEvent} activeEvent - The active event to be pre-handled.
     * @param {Event} [event] - The optional event object.
     */
    prehandle(activeEvent, event) {
        if (activeEvent.shouldDebounce) {
            (0, Tools_1.debounce)((...args) => this.handle(...args), 500, activeEvent, event);
        }
        else {
            this.handle(activeEvent, event);
        }
    }
    /**
     * Finds the type of the input element associated with the active event.
     *
     * @param {IEvent} activeEvent - The active event to find the type for.
     * @param {Event} [event] - The optional event object.
     * @returns {string | null} - The type of the input element if found, otherwise null.
     */
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
    /**
     * Finds the name of the active event, optionally including the type if available.
     *
     * @param {IEvent} activeEvent - The active event to find the name for.
     * @param {Event} [event] - The optional event object.
     * @returns {string} - The name of the active event, optionally including the type.
     */
    findName(activeEvent, event) {
        const type = this.findType(activeEvent, event);
        if (!type) {
            return activeEvent.name;
        }
        return `${activeEvent.name}-${type}`;
    }
    /**
     * Packs the event data into an `IEventPayload` object.
     *
     * @param {string} type - The type of the event.
     * @param {IEvent} activeEvent - The active event to be packed.
     * @returns {IEventPayload} - The packed event payload.
     */
    packEvent(type, activeEvent) {
        return Object.assign({ "data": Object.assign(Object.assign({}, this.browserInfo), { type }), "source": this.source, "timestamp": Math.floor(Date.now() / 1000), "ats_header": this.token, "event": activeEvent.name.toLowerCase(), "sg_event_id": (0, Tools_1.createUUID)(), "sg_message_id": this.campaignInfo.ats_instance_id }, this.extraPayload);
    }
    /**
     * Handles the active event by executing it, optionally validating it first.
     *
     * @param {IEvent} activeEvent - The active event to handle.
     * @param {Event} [event] - The optional event object.
     * @param {boolean} [shouldValidate=true] - Whether to validate the event before handling it.
     */
    handle(activeEvent, event, shouldValidate = true) {
        this.executeEvent(activeEvent, event, shouldValidate)
            .catch(e => this.logger.error(e));
    }
    /**
     * Checks if the active event is valid, optionally validating it first.
     *
     * @param {IEvent} activeEvent - The active event to check.
     * @param {Event} event - The event object.
     * @param {boolean} [shouldValidate=true] - Whether to validate the event before checking it.
     * @throws {Error} - Throws an error if the event is not valid and should be validated.
     */
    checkEvent(activeEvent, event, shouldValidate = true) {
        if (!activeEvent.isValid(event) && shouldValidate) {
            throw new Error(`Event @${activeEvent.trigger} (${activeEvent.name}) not valid...`);
        }
    }
    /**
     * Checks if the active event allows multiple instances and prevents duplicates.
     *
     * @param {IEvent} activeEvent - The active event to check.
     * @param {Event} [event] - The optional event object.
     * @throws {Error} - Throws an error if the event does not allow multiple instances and a duplicate is found.
     */
    checkMultiple(activeEvent, event) {
        if (!activeEvent.allowMultiple) {
            const name = this.findName(activeEvent, event);
            if (this.disabledEvents.includes(name)) {
                throw new Error(`Preventing duplicate event @${activeEvent.trigger} (${name}).`);
            }
            this.disabledEvents.push(name);
        }
    }
    /**
     * Executes the active event, optionally validating it first.
     *
     * @param {IEvent} activeEvent - The active event to execute.
     * @param {Event} [event] - The optional event object.
     * @param {boolean} [shouldValidate=true] - Whether to validate the event before executing it.
     * @returns {Promise<void>} - A promise that resolves when the event is executed.
     */
    executeEvent(activeEvent, event, shouldValidate = true) {
        this.logger.info(`Event @${activeEvent.trigger} (${activeEvent.name}) triggered...`);
        try {
            this.checkEvent(activeEvent, event, shouldValidate);
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
            .catch(e => this.logger.error(e))
            .finally(() => {
            if (activeEvent.redirectOnFinish && this.shouldRedirect) {
                window.location.href = `${this.redirectUrl}${window.location.search}`;
            }
        });
    }
    get supportedEventNames() {
        return Object.keys(this.supportedEvents);
    }
    /**
     * Subscribes to the specified event with a callback function.
     *
     * @param {string} eventName - The name of the event to subscribe to.
     * @param {function(IEvent): void} callback - The callback function to be executed when the event is triggered.
     * @throws {Error} - Throws an error if the event is unsupported.
     */
    subscribe(eventName, callback) {
        if (!this.supportedEventNames.includes(eventName)) {
            throw new Error(`Unsupported event: ${eventName}`);
        }
        this.subscriptions.push({ eventName, callback });
    }
    /**
     * Unsubscribes from the specified event by removing the callback function.
     *
     * @param {string} eventName - The name of the event to unsubscribe from.
     * @param {function(IEvent): void} callback - The callback function to be removed.
     * @throws {Error} - Throws an error if the event is unsupported.
     */
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
    /**
     * Triggers the subscription callbacks for the specified event.
     *
     * @param {IEvent} event - The event for which to trigger the subscription callbacks.
     */
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
/***/ (function(__unused_webpack_module, exports) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
class Remote {
    constructor(api_key, url, debug) {
        this.api_key = api_key;
        this.url = url;
        this.debug = debug;
    }
    /**
     * Sends a POST request with the specified data to the configured URL.
     *
     * @param {IEventPayload} data - The data to be sent in the POST request.
     * @returns {Promise<object|string>} - A promise that resolves to the response data, either as an object if the response is JSON, or as a string otherwise.
     */
    post(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.debug) {
                console.log(`Sending event to ${this.url} with data:`);
                console.table(data);
            }
            const response = yield fetch(this.url, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    "api-key": this.api_key,
                },
                keepalive: true,
                body: JSON.stringify(data),
            });
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
/**
 * Removes the subdomain from the given string, if it matches any known subdomains.
 *
 * @param {string} s - The string from which to remove the subdomain.
 * @returns {string} - The string without the subdomain.
 */
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
/**
 * Debounce a function, ensuring it is only called after a specified wait time has elapsed since the last call.
 *
 * @template Args - The type of arguments the callback function accepts.
 * @param {(...args: Args) => void} callback - The function to debounce.
 * @param {number} wait - The number of milliseconds to wait before invoking the callback.
 * @param {...Args} args - The arguments to pass to the callback function.
 */
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
        // check if the element has @click with any of the .stop or .prevent modifiers
        for (const attribute of element.attributes) {
            // check if attribute starts with @click
            if (attribute.name.startsWith("@click")) {
                // check if the attribute contains .stop or .prevent
                if (attribute.name.includes(".stop") || attribute.name.includes(".prevent")) {
                    return false;
                }
            }
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
        return true;
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
        // check if parents are anchor or button
        let element = event.target;
        let limit = 10;
        while (element.parentElement && limit > 0) {
            if (element.parentElement instanceof HTMLAnchorElement) {
                return this.validateAnchor(element.parentElement);
            }
            if (element.parentElement instanceof HTMLButtonElement) {
                return this.validateButton(element.parentElement);
            }
            element = element.parentElement;
            limit--;
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
        if ((event === null || event === void 0 ? void 0 : event.target) instanceof HTMLInputElement) {
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
    get canScroll() {
        // determine if the user can scroll the page
        return window.innerHeight / document.documentElement.scrollHeight < .85;
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
        if (this.hasScrolled || !this.canScroll) {
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
        if ((event === null || event === void 0 ? void 0 : event.target) instanceof HTMLFormElement) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7QUFDQTs7QUFFQSxDQUFDOzs7Ozs7O1VDeDdCRDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTs7Ozs7VUVBQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL0FUU0V2ZW50cy8uL2luZGV4LnRzIiwid2VicGFjazovL0FUU0V2ZW50cy8uL3NyYy9Ccm93c2VySW5mby50cyIsIndlYnBhY2s6Ly9BVFNFdmVudHMvLi9zcmMvQ2FtcGFpZ25JbmZvLnRzIiwid2VicGFjazovL0FUU0V2ZW50cy8uL3NyYy9Mb2dnZXIudHMiLCJ3ZWJwYWNrOi8vQVRTRXZlbnRzLy4vc3JjL01hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vQVRTRXZlbnRzLy4vc3JjL1JlbW90ZS50cyIsIndlYnBhY2s6Ly9BVFNFdmVudHMvLi9zcmMvVG9vbHMudHMiLCJ3ZWJwYWNrOi8vQVRTRXZlbnRzLy4vc3JjL1VybFBhcnNlci50cyIsIndlYnBhY2s6Ly9BVFNFdmVudHMvLi9zcmMvZXZlbnRzL0FUU0V2ZW50LnRzIiwid2VicGFjazovL0FUU0V2ZW50cy8uL3NyYy9ldmVudHMvQXR0YWNobWVudE9wZW4udHMiLCJ3ZWJwYWNrOi8vQVRTRXZlbnRzLy4vc3JjL2V2ZW50cy9DbGljay50cyIsIndlYnBhY2s6Ly9BVFNFdmVudHMvLi9zcmMvZXZlbnRzL0NsaXBib2FyZC50cyIsIndlYnBhY2s6Ly9BVFNFdmVudHMvLi9zcmMvZXZlbnRzL0Rvd25sb2FkLnRzIiwid2VicGFjazovL0FUU0V2ZW50cy8uL3NyYy9ldmVudHMvRXh0ZW5zaW9uLnRzIiwid2VicGFjazovL0FUU0V2ZW50cy8uL3NyYy9ldmVudHMvRmlsZURvd25sb2FkLnRzIiwid2VicGFjazovL0FUU0V2ZW50cy8uL3NyYy9ldmVudHMvRmlsZU9wZW4udHMiLCJ3ZWJwYWNrOi8vQVRTRXZlbnRzLy4vc3JjL2V2ZW50cy9JbnB1dC50cyIsIndlYnBhY2s6Ly9BVFNFdmVudHMvLi9zcmMvZXZlbnRzL0xvY2F0aW9uLnRzIiwid2VicGFjazovL0FUU0V2ZW50cy8uL3NyYy9ldmVudHMvTWljcm9waG9uZS50cyIsIndlYnBhY2s6Ly9BVFNFdmVudHMvLi9zcmMvZXZlbnRzL05vdGlmaWNhdGlvbi50cyIsIndlYnBhY2s6Ly9BVFNFdmVudHMvLi9zcmMvZXZlbnRzL1BhZ2VMZWZ0LnRzIiwid2VicGFjazovL0FUU0V2ZW50cy8uL3NyYy9ldmVudHMvUGFnZUxvYWRlZC50cyIsIndlYnBhY2s6Ly9BVFNFdmVudHMvLi9zcmMvZXZlbnRzL1BhZ2VSZWFkLnRzIiwid2VicGFjazovL0FUU0V2ZW50cy8uL3NyYy9ldmVudHMvU3VibWl0LnRzIiwid2VicGFjazovL0FUU0V2ZW50cy8uL3NyYy9ldmVudHMvV2ViY2FtLnRzIiwid2VicGFjazovL0FUU0V2ZW50cy8uL25vZGVfbW9kdWxlcy91YS1wYXJzZXItanMvc3JjL3VhLXBhcnNlci5qcyIsIndlYnBhY2s6Ly9BVFNFdmVudHMvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vQVRTRXZlbnRzL3dlYnBhY2svcnVudGltZS9hbWQgb3B0aW9ucyIsIndlYnBhY2s6Ly9BVFNFdmVudHMvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9BVFNFdmVudHMvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL0FUU0V2ZW50cy93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTWFuYWdlciB9IGZyb20gXCIuL3NyYy9NYW5hZ2VyXCI7XG5pbXBvcnQgUmVtb3RlIGZyb20gXCIuL3NyYy9SZW1vdGVcIjtcbmltcG9ydCB7cmVtb3ZlU3ViZG9tYWlufSBmcm9tIFwiLi9zcmMvVG9vbHNcIjtcbmltcG9ydCBJT3B0aW9ucyBmcm9tIFwiLi9zcmMvaW50ZWZhY2VzL0lPcHRpb25cIjtcblxuY29uc3QgZGVmYXVsdE9wdGlvbnM6IElPcHRpb25zID0ge1xuXHRldmVudHNUb0luY2x1ZGU6IFtdLFxuXHRldmVudHNUb0V4Y2x1ZGU6IFtdLFxuXHRkZWJ1ZzogZmFsc2UsXG5cdHNob3VsZFJlZGlyZWN0OiB0cnVlLFxuXHRyZWRpcmVjdFVybDogYGh0dHBzOi8vb29wcy4ke3JlbW92ZVN1YmRvbWFpbih3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUpfWAsXG5cdHNvdXJjZTogXCJMUFwiLFxuXHR1cmw6IFwiaHR0cHM6Ly9hcGkuYXR0YWNrc2ltdWxhdG9yLmNvbS92MC9jbGllbnQtZXZlbnRzXCIsXG5cdGV4dHJhUGF5bG9hZDoge30sXG59O1xuXG5jbGFzcyBBVFNFdmVudHMge1xuXHRwcml2YXRlIG1hbmFnZXI6IE1hbmFnZXI7XG5cblx0Y29uc3RydWN0b3Iob3B0aW9uczogSU9wdGlvbnMpIHtcblx0XHRjb25zdCBfb3B0aW9ucyA9IHsuLi5kZWZhdWx0T3B0aW9ucywgLi4ub3B0aW9uc307XG5cdFx0aWYgKF9vcHRpb25zLmRlYnVnKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhfb3B0aW9ucyk7XG5cdFx0fVxuXHRcdGNvbnN0IHJlbW90ZSA9IG5ldyBSZW1vdGUoX29wdGlvbnMuYXBpS2V5LCBfb3B0aW9ucy51cmwsIF9vcHRpb25zLmRlYnVnKTtcblx0XHR0aGlzLm1hbmFnZXIgPSBuZXcgTWFuYWdlcihyZW1vdGUsIF9vcHRpb25zKTtcblx0fVxuXG5cdGxpc3RlbigpIHtcblx0XHR0aGlzLm1hbmFnZXIubGlzdGVuKCk7XG5cdH1cblxuXHRvbihldmVudE5hbWU6IHN0cmluZywgY2FsbGJhY2spIHtcblx0XHR0aGlzLm1hbmFnZXIuc3Vic2NyaWJlKGV2ZW50TmFtZSwgY2FsbGJhY2spO1xuXHR9XG5cblx0b2ZmKGV2ZW50TmFtZTogc3RyaW5nLCBjYWxsYmFjaykge1xuXHRcdHRoaXMubWFuYWdlci51bnN1YnNjcmliZShldmVudE5hbWUsIGNhbGxiYWNrKTtcblx0fVxuXG5cdHN0b3AoKSB7XG5cdFx0dGhpcy5tYW5hZ2VyLnN0b3AoKTtcblx0fVxuXG5cdHRyaWdnZXIobmFtZTogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG5cdFx0cmV0dXJuIHRoaXMubWFuYWdlci50cmlnZ2VyKG5hbWUpO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQVRTRXZlbnRzO1xuIiwiaW1wb3J0IHBhcnNlciBmcm9tIFwidWEtcGFyc2VyLWpzXCI7XG5cbmludGVyZmFjZSBTY3JlZW5TaXplIHtcbiAgICB3aWR0aCA/OiBudW1iZXJcbiAgICBoZWlnaHQgPzogbnVtYmVyXG59XG5cbmludGVyZmFjZSBCcm93c2VyIHtcbiAgICBuYW1lID86IHN0cmluZ1xuICAgIHZlcnNpb24gPzogc3RyaW5nXG4gICAgbWFqb3JfdmVyc2lvbiA/OiBudW1iZXJcbiAgICBtb2JpbGUgPzogYm9vbGVhblxufVxuXG5pbnRlcmZhY2UgT1Mge1xuICAgIG5hbWUgPzogc3RyaW5nXG4gICAgdmVyc2lvbiA/OiBzdHJpbmdcbn1cblxuaW50ZXJmYWNlIERldmljZSB7XG4gICAgbW9kZWw/OiBzdHJpbmdcbiAgICB0eXBlPzogc3RyaW5nXG4gICAgdmVuZG9yPzogc3RyaW5nXG59XG5pbnRlcmZhY2UgQ3B1IHtcbiAgICBhcmNoaXRlY3R1cmUgPzpzdHJpbmdcbn1cbmV4cG9ydCBpbnRlcmZhY2UgQnJvd3NlckluZm8ge1xuICAgIHVhOiBzdHJpbmc7XG4gICAgc2NyZWVuX3NpemU6IFNjcmVlblNpemU7XG4gICAgYnJvd3NlcjogQnJvd3NlcjtcbiAgICBvczogT1M7XG4gICAgZGV2aWNlOiBEZXZpY2U7XG4gICAgY3B1OiBDcHU7XG59XG5cbmZ1bmN0aW9uIGZpbmRCcm93c2VyKCk6IEJyb3dzZXIge1xuXHRsZXQgdmVyT2Zmc2V0OiBudW1iZXI7XG5cdGNvbnN0IGJyb3dzZXI6IEJyb3dzZXIgPSB7fTtcblx0Y29uc3QgdXNlckFnZW50ID0gbmF2aWdhdG9yLnVzZXJBZ2VudDtcblxuXHQvLyBPcGVyYVxuXHRpZiAoKHZlck9mZnNldCA9IHVzZXJBZ2VudC5pbmRleE9mKFwiT3BlcmFcIikpICE9PSAtMSkge1xuXHRcdGJyb3dzZXIubmFtZSA9IFwiT3BlcmFcIjtcblx0XHRicm93c2VyLnZlcnNpb24gPSB1c2VyQWdlbnQuc3Vic3RyaW5nKHZlck9mZnNldCArIDYpO1xuXHRcdGlmICgodmVyT2Zmc2V0ID0gdXNlckFnZW50LmluZGV4T2YoXCJWZXJzaW9uXCIpKSAhPT0gLTEpIHtcblx0XHRcdGJyb3dzZXIudmVyc2lvbiA9IHVzZXJBZ2VudC5zdWJzdHJpbmcodmVyT2Zmc2V0ICsgOCk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gT3BlcmEgTmV4dFxuXHRlbHNlIGlmICgodmVyT2Zmc2V0ID0gdXNlckFnZW50LmluZGV4T2YoXCJPUFJcIikpICE9PSAtMSkge1xuXHRcdGJyb3dzZXIubmFtZSA9IFwiT3BlcmFcIjtcblx0XHRicm93c2VyLnZlcnNpb24gPSB1c2VyQWdlbnQuc3Vic3RyaW5nKHZlck9mZnNldCArIDUpO1xuXHR9XG5cblx0Ly8gRWRnZVxuXHRlbHNlIGlmICgodmVyT2Zmc2V0ID0gdXNlckFnZW50LmluZGV4T2YoXCJFZGdlXCIpKSAhPT0gLTEpIHtcblx0XHRicm93c2VyLm5hbWUgPSBcIk1pY3Jvc29mdCBFZGdlXCI7XG5cdFx0YnJvd3Nlci52ZXJzaW9uID0gdXNlckFnZW50LnN1YnN0cmluZyh2ZXJPZmZzZXQgKyA1KTtcblx0fVxuXG5cdC8vIE1TSUVcblx0ZWxzZSBpZiAoKHZlck9mZnNldCA9IHVzZXJBZ2VudC5pbmRleE9mKFwiTVNJRVwiKSkgIT09IC0xKSB7XG5cdFx0YnJvd3Nlci5uYW1lID0gXCJNaWNyb3NvZnQgSW50ZXJuZXQgRXhwbG9yZXJcIjtcblx0XHRicm93c2VyLnZlcnNpb24gPSB1c2VyQWdlbnQuc3Vic3RyaW5nKHZlck9mZnNldCArIDUpO1xuXHR9XG5cblx0Ly8gQ2hyb21lXG5cdGVsc2UgaWYgKCh2ZXJPZmZzZXQgPSB1c2VyQWdlbnQuaW5kZXhPZihcIkNocm9tZVwiKSkgIT09IC0xKSB7XG5cdFx0YnJvd3Nlci5uYW1lID0gXCJDaHJvbWVcIjtcblx0XHRicm93c2VyLnZlcnNpb24gPSB1c2VyQWdlbnQuc3Vic3RyaW5nKHZlck9mZnNldCArIDcpO1xuXHR9XG5cblx0Ly8gU2FmYXJpXG5cdGVsc2UgaWYgKCh2ZXJPZmZzZXQgPSB1c2VyQWdlbnQuaW5kZXhPZihcIlNhZmFyaVwiKSkgIT09IC0xKSB7XG5cdFx0YnJvd3Nlci5uYW1lID0gXCJTYWZhcmlcIjtcblx0XHRicm93c2VyLnZlcnNpb24gPSB1c2VyQWdlbnQuc3Vic3RyaW5nKHZlck9mZnNldCArIDcpO1xuXHRcdGlmICgodmVyT2Zmc2V0ID0gdXNlckFnZW50LmluZGV4T2YoXCJWZXJzaW9uXCIpKSAhPT0gLTEpIHtcblx0XHRcdGJyb3dzZXIudmVyc2lvbiA9IHVzZXJBZ2VudC5zdWJzdHJpbmcodmVyT2Zmc2V0ICsgOCk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gRmlyZWZveFxuXHRlbHNlIGlmICgodmVyT2Zmc2V0ID0gdXNlckFnZW50LmluZGV4T2YoXCJGaXJlZm94XCIpKSAhPT0gLTEpIHtcblx0XHRicm93c2VyLm5hbWUgPSBcIkZpcmVmb3hcIjtcblx0XHRicm93c2VyLnZlcnNpb24gPSB1c2VyQWdlbnQuc3Vic3RyaW5nKHZlck9mZnNldCArIDgpO1xuXHR9XG5cblx0Ly8gTVNJRSAxMStcblx0ZWxzZSBpZiAodXNlckFnZW50LmluZGV4T2YoXCJUcmlkZW50L1wiKSAhPT0gLTEpIHtcblx0XHRicm93c2VyLm5hbWUgPSBcIk1pY3Jvc29mdCBJbnRlcm5ldCBFeHBsb3JlclwiO1xuXHRcdGJyb3dzZXIudmVyc2lvbiA9IHVzZXJBZ2VudC5zdWJzdHJpbmcodXNlckFnZW50LmluZGV4T2YoXCJydjpcIikgKyAzKTtcblx0fVxuXG5cdGJyb3dzZXIubW9iaWxlID0gL01vYmlsZXxtaW5pfEZlbm5lY3xBbmRyb2lkfGlQKGFkfG9kfGhvbmUpLy50ZXN0KHVzZXJBZ2VudCk7XG5cblx0Ly8gdHJpbSB0aGUgdmVyc2lvbiBzdHJpbmdcblx0bGV0IGl4O1xuXHRpZiAoKGl4ID0gYnJvd3Nlci52ZXJzaW9uLmluZGV4T2YoXCI7XCIpKSAhPSAtMSkgYnJvd3Nlci52ZXJzaW9uID0gYnJvd3Nlci52ZXJzaW9uLnN1YnN0cmluZygwLCBpeCk7XG5cdGlmICgoaXggPSBicm93c2VyLnZlcnNpb24uaW5kZXhPZihcIiBcIikpICE9IC0xKSBicm93c2VyLnZlcnNpb24gPSBicm93c2VyLnZlcnNpb24uc3Vic3RyaW5nKDAsIGl4KTtcblx0aWYgKChpeCA9IGJyb3dzZXIudmVyc2lvbi5pbmRleE9mKFwiKVwiKSkgIT0gLTEpIGJyb3dzZXIudmVyc2lvbiA9IGJyb3dzZXIudmVyc2lvbi5zdWJzdHJpbmcoMCwgaXgpO1xuXG5cdGJyb3dzZXIubWFqb3JfdmVyc2lvbiA9IHBhcnNlSW50KFwiXCIgKyBicm93c2VyLnZlcnNpb24sIDEwKTtcblx0aWYgKGlzTmFOKCBicm93c2VyLm1ham9yX3ZlcnNpb24pKSB7XG5cdFx0YnJvd3Nlci52ZXJzaW9uID0gXCJcIiArIHBhcnNlRmxvYXQobmF2aWdhdG9yLmFwcFZlcnNpb24pO1xuXHRcdGJyb3dzZXIubWFqb3JfdmVyc2lvbiA9IHBhcnNlSW50KG5hdmlnYXRvci5hcHBWZXJzaW9uLCAxMCk7XG5cdH1cbiAgICBcblx0cmV0dXJuIGJyb3dzZXI7XG59XG5cbmZ1bmN0aW9uIGZpbmRPcGVyYXRpbmdTeXN0ZW0ocGFyc2VyOiBhbnkpOiBPUyB7XG5cdGNvbnN0IHtuYW1lLCB2ZXJzaW9ufSA9IHBhcnNlci5nZXRPUygpO1xuXHRyZXR1cm4geyBuYW1lLCB2ZXJzaW9ufTtcbn1cblxuZnVuY3Rpb24gZmluZERldmljZShwYXJzZXI6IGFueSk6IERldmljZSB7XG5cdGNvbnN0IHttb2RlbCwgdHlwZSwgdmVuZG9yfSA9IHBhcnNlci5nZXREZXZpY2UoKTtcblx0cmV0dXJuIHttb2RlbCwgdHlwZSwgdmVuZG9yfTtcbn1cblxuZnVuY3Rpb24gZmluZENwdShwYXJzZXI6IGFueSk6IENwdSB7XG5cdGNvbnN0IHthcmNoaXRlY3R1cmV9ID0gcGFyc2VyLmdldENQVSgpO1xuXHRyZXR1cm4ge2FyY2hpdGVjdHVyZX07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaW5kQnJvd3NlckluZm8oKTogQnJvd3NlckluZm8ge1xuXHRjb25zdCB1YSA9IG5ldyBwYXJzZXIoKTtcblx0cmV0dXJuIHtcblx0XHR1YTogd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQsXG5cdFx0c2NyZWVuX3NpemU6IHtcblx0XHRcdHdpZHRoOiBzY3JlZW4ud2lkdGggfHwgMCxcblx0XHRcdGhlaWdodDogc2NyZWVuLmhlaWdodCB8fCAwXG5cdFx0fSxcblx0XHRicm93c2VyOiBmaW5kQnJvd3NlcigpLFxuXHRcdG9zOiBmaW5kT3BlcmF0aW5nU3lzdGVtKHVhKSxcblx0XHRkZXZpY2U6IGZpbmREZXZpY2UodWEpLFxuXHRcdGNwdTogZmluZENwdSh1YSlcblx0fTtcbn0iLCJpbXBvcnQgeyBVcmxQYXJzZXIgfSBmcm9tIFwiLi9VcmxQYXJzZXJcIjtcbmltcG9ydCBJQ2FtcGFpZ25JbmZvIGZyb20gXCIuL2ludGVmYWNlcy9JQ2FtcGFpZ25JbmZvXCI7XG5cbi8qKlxuICogUmVhZHMgYW5kIGRlY29kZXMgYSB0b2tlbiBzdHJpbmcgdG8gZXh0cmFjdCBjYW1wYWlnbiBpbmZvcm1hdGlvbi5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gW3Rva2VuU3RyaW5nXSAtIFRoZSB0b2tlbiBzdHJpbmcgdG8gYmUgZGVjb2RlZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBbZmlsZVR5cGVdIC0gVGhlIHR5cGUgb2YgZmlsZSBhc3NvY2lhdGVkIHdpdGggdGhlIGNhbXBhaWduLlxuICogQHJldHVybnMge0lDYW1wYWlnbkluZm99IC0gVGhlIGRlY29kZWQgY2FtcGFpZ24gaW5mb3JtYXRpb24uXG4gKi9cbmZ1bmN0aW9uIHJlYWRUb2tlblN0cmluZyh0b2tlblN0cmluZyA/OiBzdHJpbmcsIGZpbGVUeXBlID86IHN0cmluZyk6IElDYW1wYWlnbkluZm8ge1xuXHRjb25zdCBiYXNlNjRVcmwgPSB0b2tlblN0cmluZy5zcGxpdChcIi5cIilbMV07XG5cdGNvbnN0IGJhc2U2NCA9ICBiYXNlNjRVcmwucmVwbGFjZSgvLS9nLCBcIitcIikucmVwbGFjZSgvXy9nLCBcIi9cIik7XG5cdGNvbnN0IGNhbXBhaWduSW5mbyA9IEpTT04ucGFyc2Uod2luZG93LmF0b2IoYmFzZTY0KSkucGF5bG9hZCBhcyBJQ2FtcGFpZ25JbmZvO1xuXG5cdGlmIChmaWxlVHlwZSA9PT0gXCJhdHRhY2htZW50XCIpIHtcblx0XHRjYW1wYWlnbkluZm8uZG93bmxvYWRfdHlwZSA9IFwiYXR0YWNobWVudFwiO1xuXHR9IGVsc2UgaWYgKGZpbGVUeXBlICE9PSBudWxsKSB7XG5cdFx0Y2FtcGFpZ25JbmZvLmRvd25sb2FkX3R5cGUgPSBcImZpbGVcIjtcblx0fVxuXG5cdHJldHVybiBjYW1wYWlnbkluZm87XG59XG5cbi8qKlxuICogRmluZHMgYW5kIHJldHVybnMgdGhlIGNhbXBhaWduIGluZm9ybWF0aW9uIGZyb20gdGhlIFVSTC5cbiAqXG4gKiBAcmV0dXJucyB7W3N0cmluZywgSUNhbXBhaWduSW5mb119IC0gQSB0dXBsZSBjb250YWluaW5nIHRoZSB0b2tlbiBzdHJpbmcgYW5kIHRoZSBkZWNvZGVkIGNhbXBhaWduIGluZm9ybWF0aW9uLlxuICogQHRocm93cyB7RXJyb3J9IC0gVGhyb3dzIGFuIGVycm9yIGlmIHRoZSBBVFRBQ0sgU2ltdWxhdG9yIHRva2VuIGlzIG1pc3NpbmcuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmaW5kQ2FtcGFpZ25JbmZvKCkgOiBbc3RyaW5nLCBJQ2FtcGFpZ25JbmZvXSB7XG5cdGNvbnN0IHVybCA9IG5ldyBVcmxQYXJzZXIod2luZG93LmxvY2F0aW9uLmhyZWYpO1xuXHRjb25zdCB0b2tlblN0cmluZyA9IHVybC5maW5kUGFyYW0oXCJ0a1wiKTtcblx0aWYgKCF0b2tlblN0cmluZykge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIk1pc3NpbmcgQVRUQUNLIFNpbXVsYXRvciB0b2tlblwiKTtcblx0fVxuXHRjb25zdCBmaWxlVHlwZSA9IHVybC5maW5kUGFyYW0oXCJmaWxlX3R5cGVcIik7XG5cblx0dHJ5IHtcblx0XHRyZXR1cm4gW3Rva2VuU3RyaW5nLCByZWFkVG9rZW5TdHJpbmcodG9rZW5TdHJpbmcsIGZpbGVUeXBlKV07XG5cdH0gY2F0Y2goZSkge1xuXHRcdHJldHVybiBbdG9rZW5TdHJpbmcsIHsgYXRzX2NvbXBhbnlfaWQ6IFwiXCIgfV07XG5cdH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIExvZ2dlciB7XG5cdHByaXZhdGUgZGVidWc6IGJvb2xlYW47XG5cdGNvbnN0cnVjdG9yKGRlYnVnOiBib29sZWFuKSB7XG5cdFx0dGhpcy5kZWJ1ZyA9IGRlYnVnO1xuXHR9XG5cblx0cHVibGljIGluZm8obWVzc2FnZTogYW55KTogdm9pZCB7XG5cdFx0aWYgKHRoaXMuZGVidWcpIHtcblx0XHRcdGNvbnNvbGUubG9nKG1lc3NhZ2UpO1xuXHRcdH1cblx0fVxuXG5cdHB1YmxpYyBlcnJvcihtZXNzYWdlOiBhbnkpOiB2b2lkIHtcblx0XHRpZiAodGhpcy5kZWJ1Zykge1xuXHRcdFx0Y29uc29sZS5lcnJvcihtZXNzYWdlKTtcblx0XHR9XG5cdH1cblxuXHRwdWJsaWMgd2FybihtZXNzYWdlOiBhbnkpOiB2b2lkIHtcblx0XHRpZiAodGhpcy5kZWJ1Zykge1xuXHRcdFx0Y29uc29sZS53YXJuKG1lc3NhZ2UpO1xuXHRcdH1cblx0fVxufSIsImltcG9ydCB7IEJyb3dzZXJJbmZvLCBmaW5kQnJvd3NlckluZm8gfSBmcm9tIFwiLi9Ccm93c2VySW5mb1wiO1xuaW1wb3J0IHsgZmluZENhbXBhaWduSW5mbyB9IGZyb20gXCIuL0NhbXBhaWduSW5mb1wiO1xuaW1wb3J0IHsgY3JlYXRlVVVJRCwgZGVib3VuY2UgfSBmcm9tIFwiLi9Ub29sc1wiOyBcblxuaW1wb3J0IEF0dGFjaG1lbnRPcGVuIGZyb20gXCIuL2V2ZW50cy9BdHRhY2htZW50T3BlblwiO1xuaW1wb3J0IENsaWNrIGZyb20gXCIuL2V2ZW50cy9DbGlja1wiO1xuaW1wb3J0IERvd25sb2FkIGZyb20gXCIuL2V2ZW50cy9Eb3dubG9hZFwiO1xuaW1wb3J0IEV4dGVuc2lvbiBmcm9tIFwiLi9ldmVudHMvRXh0ZW5zaW9uXCI7XG5pbXBvcnQgRmlsZURvd25sb2FkIGZyb20gXCIuL2V2ZW50cy9GaWxlRG93bmxvYWRcIjtcbmltcG9ydCBGaWxlT3BlbiBmcm9tIFwiLi9ldmVudHMvRmlsZU9wZW5cIjtcbmltcG9ydCBJbnB1dCBmcm9tIFwiLi9ldmVudHMvSW5wdXRcIjtcbmltcG9ydCBNaWNyb3Bob25lIGZyb20gXCIuL2V2ZW50cy9NaWNyb3Bob25lXCI7XG5pbXBvcnQgTm90aWZpY2F0aW9uIGZyb20gXCIuL2V2ZW50cy9Ob3RpZmljYXRpb25cIjtcbmltcG9ydCBQYWdlTGVmdCBmcm9tIFwiLi9ldmVudHMvUGFnZUxlZnRcIjtcbmltcG9ydCBQYWdlTG9hZGVkIGZyb20gXCIuL2V2ZW50cy9QYWdlTG9hZGVkXCI7XG5pbXBvcnQgUGFnZVJlYWQgZnJvbSBcIi4vZXZlbnRzL1BhZ2VSZWFkXCI7XG5pbXBvcnQgU3VibWl0IGZyb20gXCIuL2V2ZW50cy9TdWJtaXRcIjtcbmltcG9ydCBXZWJjYW0gZnJvbSBcIi4vZXZlbnRzL1dlYmNhbVwiO1xuaW1wb3J0IExvY2F0aW9uIGZyb20gXCIuL2V2ZW50cy9Mb2NhdGlvblwiO1xuaW1wb3J0IENsaXBib2FyZCBmcm9tIFwiLi9ldmVudHMvQ2xpcGJvYXJkXCI7XG5cbmltcG9ydCBJRXZlbnQgZnJvbSBcIi4vaW50ZWZhY2VzL0lFdmVudFwiO1xuXG5pbXBvcnQgSUV2ZW50UGF5bG9hZCBmcm9tIFwiLi9pbnRlZmFjZXMvSUV2ZW50UGF5bG9hZFwiO1xuaW1wb3J0IFJlbW90ZSBmcm9tIFwiLi9SZW1vdGVcIjtcblxuaW1wb3J0IExvZ2dlciBmcm9tIFwiLi9Mb2dnZXJcIjtcbmltcG9ydCBJT3B0aW9ucyBmcm9tIFwiLi9pbnRlZmFjZXMvSU9wdGlvblwiO1xuaW1wb3J0IElDYW1wYWlnbkluZm8gZnJvbSBcIi4vaW50ZWZhY2VzL0lDYW1wYWlnbkluZm9cIjtcblxuaW50ZXJmYWNlIEV2ZW50U3Vic2NyaXB0aW9uIHtcblx0ZXZlbnROYW1lOiBzdHJpbmc7XG5cdGNhbGxiYWNrOiAoZXZlbnQ6IElFdmVudCkgPT4gdm9pZDtcbn1cblxuZXhwb3J0IGNsYXNzIE1hbmFnZXIge1xuXHRwcml2YXRlIHJlYWRvbmx5IHN1cHBvcnRlZFR5cGVzIDogc3RyaW5nW10gPSBbXCJlbWFpbFwiLCBcInBhc3N3b3JkXCIsIFwidGVsXCIsIFwidGV4dFwiLCBcImdpdmVuLW5hbWVcIiwgXCJuYW1lXCIsIFwiZmFtaWx5LW5hbWVcIiwgXCJzdHJlZXQtYWRkcmVzc1wiLCBcImNjLW5hbWVcIiwgXCJjYy1naXZlbi1uYW1lXCIsIFwiY2MtZmFtaWx5LW5hbWVcIiwgXCJjYy1udW1iZXJcIiwgXCJjYy1leHBcIiwgXCJjYy1leHAtbW9udGhcIiwgXCJjYy1leHAteWVhclwiLCBcImNjLWNzY1wiLCBcImNjLXR5cGVcIl07XG5cdHByaXZhdGUgcmVhZG9ubHkgc3VwcG9ydGVkRXZlbnRzID0ge1xuXHRcdFwiYXR0YWNobWVudF9vcGVuZWRcIjogQXR0YWNobWVudE9wZW4sXG5cdFx0XCJidXR0b25fY2xpY2tlZFwiOiBDbGljayxcblx0XHRcImRvd25sb2FkXCI6IERvd25sb2FkLFxuXHRcdFwiZXh0ZW5zaW9uX2luc3RhbGxlZFwiOiBFeHRlbnNpb24sXG5cdFx0XCJmaWxlX2Rvd25sb2FkXCI6IEZpbGVEb3dubG9hZCxcdFx0XG5cdFx0XCJmaWxlX29wZW5cIjogRmlsZU9wZW4sXG5cdFx0XCJpbnB1dF9maWxsZWRcIjogSW5wdXQsXG5cdFx0XCJwYWdlX2xlZnRcIjogUGFnZUxlZnQsXG5cdFx0XCJwYWdlX2xvYWRlZFwiOiBQYWdlTG9hZGVkLFxuXHRcdFwicGFnZV9yZWFkXCI6IFBhZ2VSZWFkLFxuXHRcdFwibWljX2FjY2VwdGVkXCI6IE1pY3JvcGhvbmUsXG5cdFx0XCJub3RpZmljYXRpb25fYWNjZXB0ZWRcIjogTm90aWZpY2F0aW9uLFxuXHRcdFwiZm9ybV9zdWJtaXR0ZWRcIjogU3VibWl0LFxuXHRcdFwid2ViY2FtX2FjY2VwdGVkXCI6IFdlYmNhbSxcblx0XHRcImxvY2F0aW9uX2FjY2VwdGVkXCI6IExvY2F0aW9uLFxuXHRcdFwiY2xpcGJvYXJkX2FjY2VwdGVkXCI6IENsaXBib2FyZCxcblx0fTtcblx0cHJpdmF0ZSByZWFkb25seSBicm93c2VySW5mbzogQnJvd3NlckluZm87XG5cdHByaXZhdGUgcmVhZG9ubHkgY2FtcGFpZ25JbmZvOiBJQ2FtcGFpZ25JbmZvO1xuXHRwcml2YXRlIHJlYWRvbmx5IHJlZGlyZWN0VXJsOiBzdHJpbmc7XG5cdHByaXZhdGUgcmVhZG9ubHkgc2hvdWxkUmVkaXJlY3Q6IGJvb2xlYW47XG5cdHByaXZhdGUgcmVhZG9ubHkgcmVtb3RlOiBSZW1vdGU7XG5cdHByaXZhdGUgcmVhZG9ubHkgc291cmNlOiBzdHJpbmc7XG5cdHByaXZhdGUgcmVhZG9ubHkgdG9rZW46IHN0cmluZztcblxuXHRwcml2YXRlIHN1YnNjcmlwdGlvbnM6IEV2ZW50U3Vic2NyaXB0aW9uW10gPSBbXTtcblxuXHRwcml2YXRlIGxvZ2dlcjogTG9nZ2VyO1xuXHRwcml2YXRlIGhhbmRsZXJzID0gW107XG5cdHByaXZhdGUgZGlzYWJsZWRFdmVudHMgPSBbXTtcblx0cHJpdmF0ZSBhY3RpdmVFdmVudHM6IElFdmVudFtdO1xuXHRwcml2YXRlIGV4dHJhUGF5bG9hZDogb2JqZWN0ID0ge307XG5cblx0Y29uc3RydWN0b3IocmVtb3RlOiBSZW1vdGUsIHsgZXZlbnRzVG9JbmNsdWRlID0gW10sIGV2ZW50c1RvRXhjbHVkZSA9IFtdLCBzb3VyY2UsIHJlZGlyZWN0VXJsLCBzaG91bGRSZWRpcmVjdCwgZXh0cmFQYXlsb2FkLCBkZWJ1ZyA9IGZhbHNlIH06IElPcHRpb25zKSB7XG5cdFx0dGhpcy5sb2dnZXIgPSBuZXcgTG9nZ2VyKGRlYnVnKTtcblxuXHRcdHRoaXMucmVtb3RlID0gcmVtb3RlO1xuXHRcdFt0aGlzLnRva2VuLCB0aGlzLmNhbXBhaWduSW5mb10gPSBmaW5kQ2FtcGFpZ25JbmZvKCk7XG5cdFx0dGhpcy5icm93c2VySW5mbyA9IGZpbmRCcm93c2VySW5mbygpO1xuXG5cdFx0dGhpcy5hY3RpdmVFdmVudHMgPSB0aGlzLmRlY2lkZUFjdGl2ZUV2ZW50cyhldmVudHNUb0luY2x1ZGUsIGV2ZW50c1RvRXhjbHVkZSk7XG5cdFx0dGhpcy5sb2dnZXIuaW5mbyhgRW5hYmxlZCBldmVudHM6ICR7ZXZlbnRzVG9JbmNsdWRlLmpvaW4oXCIgfCBcIil9YCk7XG5cblx0XHR0aGlzLnNvdXJjZSA9IHNvdXJjZTtcblx0XHR0aGlzLnJlZGlyZWN0VXJsID0gcmVkaXJlY3RVcmw7XG5cdFx0dGhpcy5zaG91bGRSZWRpcmVjdCA9IHNob3VsZFJlZGlyZWN0O1xuXHRcdHRoaXMuZXh0cmFQYXlsb2FkID0gZXh0cmFQYXlsb2FkO1xuXG5cdFx0aWYgKHRoaXMuY2FtcGFpZ25JbmZvPy5kb3dubG9hZF90eXBlKSB7XG5cdFx0XHR0aGlzLmNoZWNrRG93bmxvYWQoKS50aGVuKCgpID0+IHtcblx0XHRcdFx0Ly9cblx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBEZWNpZGVzIHdoaWNoIGV2ZW50cyBzaG91bGQgYmUgYWN0aXZlIGJhc2VkIG9uIHRoZSBwcm92aWRlZCBsaXN0cyBvZiBldmVudHMgdG8gaW5jbHVkZSBhbmQgZXhjbHVkZS5cblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmdbXX0gZXZlbnRzVG9JbmNsdWRlIC0gVGhlIGxpc3Qgb2YgZXZlbnQgbmFtZXMgdG8gaW5jbHVkZS5cblx0ICogQHBhcmFtIHtzdHJpbmdbXX0gZXZlbnRzVG9FeGNsdWRlIC0gVGhlIGxpc3Qgb2YgZXZlbnQgbmFtZXMgdG8gZXhjbHVkZS5cblx0ICogQHJldHVybnMge0lFdmVudFtdfSAtIFRoZSBsaXN0IG9mIGFjdGl2ZSBldmVudHMuXG5cdCAqL1xuXHRwcml2YXRlIGRlY2lkZUFjdGl2ZUV2ZW50cyhldmVudHNUb0luY2x1ZGU6IHN0cmluZ1tdLCBldmVudHNUb0V4Y2x1ZGU6IHN0cmluZ1tdKTogSUV2ZW50W10ge1xuXHRcdGlmIChldmVudHNUb0luY2x1ZGUubGVuZ3RoKSB7XG5cdFx0XHRyZXR1cm4gZXZlbnRzVG9JbmNsdWRlLm1hcChuYW1lID0+IHRoaXMuZ2V0RXZlbnQobmFtZSkpLmZpbHRlcihldmVudCA9PiBldmVudCAhPT0gbnVsbCk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgYWN0aXZlRXZlbnRzID0gT2JqZWN0LmtleXModGhpcy5zdXBwb3J0ZWRFdmVudHMpLm1hcChuYW1lID0+IHRoaXMuZ2V0RXZlbnQobmFtZSkpLmZpbHRlcihldmVudCA9PiBldmVudCAhPT0gbnVsbCk7XG5cblx0XHRpZiAoZXZlbnRzVG9FeGNsdWRlLmxlbmd0aCkge1xuXHRcdFx0cmV0dXJuIGFjdGl2ZUV2ZW50cy5maWx0ZXIoZXZlbnQgPT4gIWV2ZW50c1RvRXhjbHVkZS5pbmNsdWRlcyhldmVudC5uYW1lKSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGFjdGl2ZUV2ZW50cztcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXRyaWV2ZXMgYW4gZXZlbnQgaW5zdGFuY2UgYnkgaXRzIG5hbWUuXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gVGhlIG5hbWUgb2YgdGhlIGV2ZW50IHRvIHJldHJpZXZlLlxuXHQgKiBAcmV0dXJucyB7SUV2ZW50IHwgbnVsbH0gLSBUaGUgZXZlbnQgaW5zdGFuY2UgaWYgZm91bmQsIG90aGVyd2lzZSBudWxsLlxuXHQgKi9cblx0cHJpdmF0ZSBnZXRFdmVudChuYW1lOiBzdHJpbmcpIHtcblx0XHRpZiAoISB0aGlzLnN1cHBvcnRlZEV2ZW50c1tuYW1lXSkge1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG5ldyAodGhpcy5zdXBwb3J0ZWRFdmVudHNbbmFtZV0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIENoZWNrcyB0aGUgdHlwZSBvZiBkb3dubG9hZCBzcGVjaWZpZWQgaW4gdGhlIGNhbXBhaWduIGluZm9ybWF0aW9uIGFuZCB0cmlnZ2VycyB0aGUgY29ycmVzcG9uZGluZyBldmVudC5cblx0ICpcblx0ICogQHJldHVybnMge1Byb21pc2U8dm9pZD59IC0gQSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgd2hlbiB0aGUgYXBwcm9wcmlhdGUgZXZlbnQgaXMgdHJpZ2dlcmVkLlxuXHQgKi9cblx0cHJpdmF0ZSBjaGVja0Rvd25sb2FkKCkge1xuXHRcdHN3aXRjaCAodGhpcy5jYW1wYWlnbkluZm8uZG93bmxvYWRfdHlwZSkge1xuXHRcdGNhc2UgXCJmaWxlXCI6XG5cdFx0XHRyZXR1cm4gdGhpcy50cmlnZ2VyKFwiZmlsZV9vcGVuZWRcIik7XG5cdFx0Y2FzZSBcImF0dGFjaG1lbnRcIjpcblx0XHRcdHJldHVybiB0aGlzLnRyaWdnZXIoXCJhdHRhY2htZW50X29wZW5lZFwiKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogU3RhcnRzIGxpc3RlbmluZyBmb3IgdGhlIGFjdGl2ZSBldmVudHMgYW5kIHNldHMgdXAgdGhlIGV2ZW50IGhhbmRsZXJzLlxuXHQgKi9cblx0cHVibGljIGxpc3RlbigpIHtcblx0XHRsZXQgaSA9IDA7XG5cdFx0Zm9yKGNvbnN0IGFjdGl2ZUV2ZW50IG9mIHRoaXMuYWN0aXZlRXZlbnRzKSB7XG5cdFx0XHRpZiAoISBhY3RpdmVFdmVudC50cmlnZ2VyKSB7XG5cdFx0XHRcdHRoaXMubG9nZ2VyLmluZm8oYFRoZSBhY3RpdmUgZXZlbnQgJHthY3RpdmVFdmVudC5uYW1lfSBkb2VzIG5vdCBoYXZlIGEgdHJpZ2dlci4gU2tpcHBpbmcuLi5gKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMubG9nZ2VyLmluZm8oYExpc3RlbmluZyBmb3IgZXZlbnQgQCR7YWN0aXZlRXZlbnQudHJpZ2dlcn0gKCR7YWN0aXZlRXZlbnQubmFtZX0pYCk7XG5cdFx0XHRcdGFjdGl2ZUV2ZW50LnNvdXJjZS5hZGRFdmVudExpc3RlbmVyKGFjdGl2ZUV2ZW50LnRyaWdnZXIsIHRoaXMuaGFuZGxlcnNbaSsrXSA9IChldmVudDogRXZlbnQpID0+IHRoaXMucHJlaGFuZGxlKGFjdGl2ZUV2ZW50LCBldmVudCkpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBTdG9wcyBsaXN0ZW5pbmcgZm9yIHRoZSBhY3RpdmUgZXZlbnRzIGFuZCByZW1vdmVzIHRoZSBldmVudCBoYW5kbGVycy5cblx0ICovXG5cdHB1YmxpYyBzdG9wKCkge1xuXHRcdGxldCBpID0gMDtcblx0XHRmb3IoY29uc3QgYWN0aXZlRXZlbnQgb2YgdGhpcy5hY3RpdmVFdmVudHMpIHtcblx0XHRcdGlmICghIGFjdGl2ZUV2ZW50LnRyaWdnZXIpIHtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMubG9nZ2VyLmluZm8oYFN0b3BwaW5nIGxpc3RlbmluZyBmb3IgZXZlbnQgQCR7YWN0aXZlRXZlbnQudHJpZ2dlcn0gKCR7YWN0aXZlRXZlbnQubmFtZX0pYCk7ICAgICAgICBcblx0XHRcdGFjdGl2ZUV2ZW50LnNvdXJjZS5yZW1vdmVFdmVudExpc3RlbmVyKGFjdGl2ZUV2ZW50LnRyaWdnZXIsIHRoaXMuaGFuZGxlcnNbaSsrXSk7XG5cdFx0fVxuXHR9XG5cdC8qKlxuXHQgKiBNYW51YWxseSB0cmlnZ2VycyB0aGUgc3BlY2lmaWVkIGV2ZW50IGJ5IGl0cyBuYW1lLlxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnROYW1lIC0gVGhlIG5hbWUgb2YgdGhlIGV2ZW50IHRvIHRyaWdnZXIuXG5cdCAqIEByZXR1cm5zIHtQcm9taXNlPHZvaWQ+fSAtIEEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHdoZW4gdGhlIGV2ZW50IGlzIGV4ZWN1dGVkLlxuXHQgKiBAdGhyb3dzIHtFcnJvcn0gLSBUaHJvd3MgYW4gZXJyb3IgaWYgdGhlIGV2ZW50IGlzIHVuc3VwcG9ydGVkLlxuXHQgKi9cblx0cHVibGljIHRyaWdnZXIoZXZlbnROYW1lOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcblx0XHRjb25zdCBhY3RpdmVFdmVudCA9IHRoaXMuZ2V0RXZlbnQoZXZlbnROYW1lKTtcblx0XHRpZiAoIWFjdGl2ZUV2ZW50KSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIGV2ZW50ICR7ZXZlbnROYW1lfS4gUGxlYXNlIGNob29zZSBvbmUgb2YgJHtPYmplY3Qua2V5cyh0aGlzLnN1cHBvcnRlZEV2ZW50cykuam9pbihcIiwgXCIpfWApO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzLmV4ZWN1dGVFdmVudChhY3RpdmVFdmVudCwgbnVsbCwgZmFsc2UpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFByZS1oYW5kbGVzIHRoZSBldmVudCBieSBkZWJvdW5jaW5nIGl0IGlmIG5lY2Vzc2FyeSwgb3RoZXJ3aXNlIGRpcmVjdGx5IGhhbmRsZXMgaXQuXG5cdCAqXG5cdCAqIEBwYXJhbSB7SUV2ZW50fSBhY3RpdmVFdmVudCAtIFRoZSBhY3RpdmUgZXZlbnQgdG8gYmUgcHJlLWhhbmRsZWQuXG5cdCAqIEBwYXJhbSB7RXZlbnR9IFtldmVudF0gLSBUaGUgb3B0aW9uYWwgZXZlbnQgb2JqZWN0LlxuXHQgKi9cblx0cHJpdmF0ZSBwcmVoYW5kbGUoYWN0aXZlRXZlbnQ6IElFdmVudCwgZXZlbnQ/OiBFdmVudCkge1x0XHRcblx0XHRpZiAoYWN0aXZlRXZlbnQuc2hvdWxkRGVib3VuY2UpIHtcblx0XHRcdGRlYm91bmNlKCguLi5hcmdzOiBbSUV2ZW50LCBFdmVudF0pID0+IHRoaXMuaGFuZGxlKC4uLmFyZ3MpLCA1MDAsIGFjdGl2ZUV2ZW50LCBldmVudCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuaGFuZGxlKGFjdGl2ZUV2ZW50LCBldmVudCk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEZpbmRzIHRoZSB0eXBlIG9mIHRoZSBpbnB1dCBlbGVtZW50IGFzc29jaWF0ZWQgd2l0aCB0aGUgYWN0aXZlIGV2ZW50LlxuXHQgKlxuXHQgKiBAcGFyYW0ge0lFdmVudH0gYWN0aXZlRXZlbnQgLSBUaGUgYWN0aXZlIGV2ZW50IHRvIGZpbmQgdGhlIHR5cGUgZm9yLlxuXHQgKiBAcGFyYW0ge0V2ZW50fSBbZXZlbnRdIC0gVGhlIG9wdGlvbmFsIGV2ZW50IG9iamVjdC5cblx0ICogQHJldHVybnMge3N0cmluZyB8IG51bGx9IC0gVGhlIHR5cGUgb2YgdGhlIGlucHV0IGVsZW1lbnQgaWYgZm91bmQsIG90aGVyd2lzZSBudWxsLlxuXHQgKi9cblx0cHJpdmF0ZSBmaW5kVHlwZShhY3RpdmVFdmVudDogSUV2ZW50LCBldmVudD86IEV2ZW50KTogc3RyaW5nIHwgbnVsbCB7XG5cdFx0aWYgKCFhY3RpdmVFdmVudC5oYXNUeXBlcyB8fCAhZXZlbnQpIHtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblxuXHRcdGNvbnN0IGlucHV0RWxlbWVudCA9IGV2ZW50LnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50O1xuXHRcdFxuXHRcdGNvbnN0IHR5cGUgPSBpbnB1dEVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiYXV0b2NvbXBsZXRlXCIpIHx8IGlucHV0RWxlbWVudC50eXBlO1x0XG5cdFx0XG5cdFx0aWYgKHRoaXMuc3VwcG9ydGVkVHlwZXMuaW5kZXhPZih0eXBlKSAhPT0gLTEpIHtcblx0XHRcdHJldHVybiB0eXBlO1xuXHRcdH1cblxuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cblx0LyoqXG5cdCAqIEZpbmRzIHRoZSBuYW1lIG9mIHRoZSBhY3RpdmUgZXZlbnQsIG9wdGlvbmFsbHkgaW5jbHVkaW5nIHRoZSB0eXBlIGlmIGF2YWlsYWJsZS5cblx0ICpcblx0ICogQHBhcmFtIHtJRXZlbnR9IGFjdGl2ZUV2ZW50IC0gVGhlIGFjdGl2ZSBldmVudCB0byBmaW5kIHRoZSBuYW1lIGZvci5cblx0ICogQHBhcmFtIHtFdmVudH0gW2V2ZW50XSAtIFRoZSBvcHRpb25hbCBldmVudCBvYmplY3QuXG5cdCAqIEByZXR1cm5zIHtzdHJpbmd9IC0gVGhlIG5hbWUgb2YgdGhlIGFjdGl2ZSBldmVudCwgb3B0aW9uYWxseSBpbmNsdWRpbmcgdGhlIHR5cGUuXG5cdCAqL1xuXHRwcml2YXRlIGZpbmROYW1lKGFjdGl2ZUV2ZW50OiBJRXZlbnQsIGV2ZW50PzogRXZlbnQpOiBzdHJpbmcge1xuXHRcdGNvbnN0IHR5cGUgPSB0aGlzLmZpbmRUeXBlKGFjdGl2ZUV2ZW50LCBldmVudCk7XG5cdFx0aWYgKCF0eXBlKSB7XG5cdFx0XHRyZXR1cm4gYWN0aXZlRXZlbnQubmFtZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gYCR7YWN0aXZlRXZlbnQubmFtZX0tJHt0eXBlfWA7XG5cdH1cblxuXHQvKipcblx0ICogUGFja3MgdGhlIGV2ZW50IGRhdGEgaW50byBhbiBgSUV2ZW50UGF5bG9hZGAgb2JqZWN0LlxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gdHlwZSAtIFRoZSB0eXBlIG9mIHRoZSBldmVudC5cblx0ICogQHBhcmFtIHtJRXZlbnR9IGFjdGl2ZUV2ZW50IC0gVGhlIGFjdGl2ZSBldmVudCB0byBiZSBwYWNrZWQuXG5cdCAqIEByZXR1cm5zIHtJRXZlbnRQYXlsb2FkfSAtIFRoZSBwYWNrZWQgZXZlbnQgcGF5bG9hZC5cblx0ICovXG5cdHByaXZhdGUgcGFja0V2ZW50KHR5cGU6IHN0cmluZywgYWN0aXZlRXZlbnQ6IElFdmVudCk6IElFdmVudFBheWxvYWQge1xuXHRcdHJldHVybiB7XG5cdFx0XHRcImRhdGFcIjoge1xuXHRcdFx0XHQuLi50aGlzLmJyb3dzZXJJbmZvLFxuXHRcdFx0XHR0eXBlLFxuXHRcdFx0fSxcblx0XHRcdFwic291cmNlXCI6IHRoaXMuc291cmNlLFxuXHRcdFx0XCJ0aW1lc3RhbXBcIjogTWF0aC5mbG9vcihEYXRlLm5vdygpIC8gMTAwMCksXG5cdFx0XHRcImF0c19oZWFkZXJcIjogdGhpcy50b2tlbixcblx0XHRcdFwiZXZlbnRcIjogYWN0aXZlRXZlbnQubmFtZS50b0xvd2VyQ2FzZSgpLFxuXHRcdFx0XCJzZ19ldmVudF9pZFwiOiBjcmVhdGVVVUlEKCksXG5cdFx0XHRcInNnX21lc3NhZ2VfaWRcIjogdGhpcy5jYW1wYWlnbkluZm8uYXRzX2luc3RhbmNlX2lkLFxuXHRcdFx0Li4udGhpcy5leHRyYVBheWxvYWQsXG5cdFx0fTtcblx0fVxuXG5cdC8qKlxuXHQgKiBIYW5kbGVzIHRoZSBhY3RpdmUgZXZlbnQgYnkgZXhlY3V0aW5nIGl0LCBvcHRpb25hbGx5IHZhbGlkYXRpbmcgaXQgZmlyc3QuXG5cdCAqXG5cdCAqIEBwYXJhbSB7SUV2ZW50fSBhY3RpdmVFdmVudCAtIFRoZSBhY3RpdmUgZXZlbnQgdG8gaGFuZGxlLlxuXHQgKiBAcGFyYW0ge0V2ZW50fSBbZXZlbnRdIC0gVGhlIG9wdGlvbmFsIGV2ZW50IG9iamVjdC5cblx0ICogQHBhcmFtIHtib29sZWFufSBbc2hvdWxkVmFsaWRhdGU9dHJ1ZV0gLSBXaGV0aGVyIHRvIHZhbGlkYXRlIHRoZSBldmVudCBiZWZvcmUgaGFuZGxpbmcgaXQuXG5cdCAqL1xuXHRwcml2YXRlIGhhbmRsZShhY3RpdmVFdmVudDogSUV2ZW50LCBldmVudD86IEV2ZW50LCBzaG91bGRWYWxpZGF0ZSA9IHRydWUpOiB2b2lkIHtcblx0XHR0aGlzLmV4ZWN1dGVFdmVudChhY3RpdmVFdmVudCwgZXZlbnQsIHNob3VsZFZhbGlkYXRlKVxuXHRcdFx0LmNhdGNoKGUgPT4gdGhpcy5sb2dnZXIuZXJyb3IoZSkpO1x0XHRcdFxuXHR9XG5cblx0LyoqXG5cdCAqIENoZWNrcyBpZiB0aGUgYWN0aXZlIGV2ZW50IGlzIHZhbGlkLCBvcHRpb25hbGx5IHZhbGlkYXRpbmcgaXQgZmlyc3QuXG5cdCAqXG5cdCAqIEBwYXJhbSB7SUV2ZW50fSBhY3RpdmVFdmVudCAtIFRoZSBhY3RpdmUgZXZlbnQgdG8gY2hlY2suXG5cdCAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50IC0gVGhlIGV2ZW50IG9iamVjdC5cblx0ICogQHBhcmFtIHtib29sZWFufSBbc2hvdWxkVmFsaWRhdGU9dHJ1ZV0gLSBXaGV0aGVyIHRvIHZhbGlkYXRlIHRoZSBldmVudCBiZWZvcmUgY2hlY2tpbmcgaXQuXG5cdCAqIEB0aHJvd3Mge0Vycm9yfSAtIFRocm93cyBhbiBlcnJvciBpZiB0aGUgZXZlbnQgaXMgbm90IHZhbGlkIGFuZCBzaG91bGQgYmUgdmFsaWRhdGVkLlxuXHQgKi9cblx0cHJpdmF0ZSBjaGVja0V2ZW50KGFjdGl2ZUV2ZW50OiBJRXZlbnQsIGV2ZW50OiBFdmVudCwgc2hvdWxkVmFsaWRhdGUgPSB0cnVlKTogdm9pZCB7XG5cdFx0aWYgKCEgYWN0aXZlRXZlbnQuaXNWYWxpZChldmVudCkgJiYgc2hvdWxkVmFsaWRhdGUpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgRXZlbnQgQCR7YWN0aXZlRXZlbnQudHJpZ2dlcn0gKCR7YWN0aXZlRXZlbnQubmFtZX0pIG5vdCB2YWxpZC4uLmApO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBDaGVja3MgaWYgdGhlIGFjdGl2ZSBldmVudCBhbGxvd3MgbXVsdGlwbGUgaW5zdGFuY2VzIGFuZCBwcmV2ZW50cyBkdXBsaWNhdGVzLlxuXHQgKlxuXHQgKiBAcGFyYW0ge0lFdmVudH0gYWN0aXZlRXZlbnQgLSBUaGUgYWN0aXZlIGV2ZW50IHRvIGNoZWNrLlxuXHQgKiBAcGFyYW0ge0V2ZW50fSBbZXZlbnRdIC0gVGhlIG9wdGlvbmFsIGV2ZW50IG9iamVjdC5cblx0ICogQHRocm93cyB7RXJyb3J9IC0gVGhyb3dzIGFuIGVycm9yIGlmIHRoZSBldmVudCBkb2VzIG5vdCBhbGxvdyBtdWx0aXBsZSBpbnN0YW5jZXMgYW5kIGEgZHVwbGljYXRlIGlzIGZvdW5kLlxuXHQgKi9cblx0cHJpdmF0ZSBjaGVja011bHRpcGxlKGFjdGl2ZUV2ZW50OiBJRXZlbnQsIGV2ZW50PzogRXZlbnQpOiB2b2lkIHtcblx0XHRpZiAoIWFjdGl2ZUV2ZW50LmFsbG93TXVsdGlwbGUpIHtcblx0XHRcdGNvbnN0IG5hbWUgPSB0aGlzLmZpbmROYW1lKGFjdGl2ZUV2ZW50LCBldmVudCk7XG5cdFx0XHRpZiAodGhpcy5kaXNhYmxlZEV2ZW50cy5pbmNsdWRlcyhuYW1lKSkge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFByZXZlbnRpbmcgZHVwbGljYXRlIGV2ZW50IEAke2FjdGl2ZUV2ZW50LnRyaWdnZXJ9ICgke25hbWV9KS5gKTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5kaXNhYmxlZEV2ZW50cy5wdXNoKG5hbWUpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBFeGVjdXRlcyB0aGUgYWN0aXZlIGV2ZW50LCBvcHRpb25hbGx5IHZhbGlkYXRpbmcgaXQgZmlyc3QuXG5cdCAqXG5cdCAqIEBwYXJhbSB7SUV2ZW50fSBhY3RpdmVFdmVudCAtIFRoZSBhY3RpdmUgZXZlbnQgdG8gZXhlY3V0ZS5cblx0ICogQHBhcmFtIHtFdmVudH0gW2V2ZW50XSAtIFRoZSBvcHRpb25hbCBldmVudCBvYmplY3QuXG5cdCAqIEBwYXJhbSB7Ym9vbGVhbn0gW3Nob3VsZFZhbGlkYXRlPXRydWVdIC0gV2hldGhlciB0byB2YWxpZGF0ZSB0aGUgZXZlbnQgYmVmb3JlIGV4ZWN1dGluZyBpdC5cblx0ICogQHJldHVybnMge1Byb21pc2U8dm9pZD59IC0gQSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgd2hlbiB0aGUgZXZlbnQgaXMgZXhlY3V0ZWQuXG5cdCAqL1xuXHRwcml2YXRlIGV4ZWN1dGVFdmVudChhY3RpdmVFdmVudDogSUV2ZW50LCBldmVudD86IEV2ZW50LCBzaG91bGRWYWxpZGF0ZSA9IHRydWUpOiBQcm9taXNlPHZvaWQ+IHtcblx0XHR0aGlzLmxvZ2dlci5pbmZvKGBFdmVudCBAJHthY3RpdmVFdmVudC50cmlnZ2VyfSAoJHthY3RpdmVFdmVudC5uYW1lfSkgdHJpZ2dlcmVkLi4uYCk7XG5cblx0XHR0cnkge1xuXHRcdFx0dGhpcy5jaGVja0V2ZW50KGFjdGl2ZUV2ZW50LCBldmVudCwgc2hvdWxkVmFsaWRhdGUpO1xuXHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdHRoaXMubG9nZ2VyLmVycm9yKGUpO1xuXHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHJlamVjdChlKSk7XG5cdFx0fVxuXG5cdFx0aWYgKGV2ZW50ICYmIGFjdGl2ZUV2ZW50LmlzQmxvY2tpbmcpIHtcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRcdGV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdH1cblxuXHRcdHRyeSB7XG5cdFx0XHR0aGlzLmNoZWNrTXVsdGlwbGUoYWN0aXZlRXZlbnQsIGV2ZW50KTtcblx0XHR9IGNhdGNoKGUpIHtcblx0XHRcdHRoaXMubG9nZ2VyLmVycm9yKGUpO1xuXHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHJlamVjdChlKSk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgdHlwZSA9IHRoaXMuZmluZFR5cGUoYWN0aXZlRXZlbnQsIGV2ZW50KTtcblx0XHRjb25zdCBwYXlsb2FkID0gdGhpcy5wYWNrRXZlbnQodHlwZSwgYWN0aXZlRXZlbnQpO1xuXHRcdHRoaXMudHJpZ2dlclN1YnNjcmlwdGlvbihhY3RpdmVFdmVudCk7XG5cblx0XHRyZXR1cm4gdGhpcy5yZW1vdGUucG9zdChwYXlsb2FkKVxuXHRcdFx0LnRoZW4ocmVzdWx0ID0+IHRoaXMubG9nZ2VyLmluZm8ocmVzdWx0KSlcblx0XHRcdC5jYXRjaChlID0+IHRoaXMubG9nZ2VyLmVycm9yKGUpKVxuXHRcdFx0LmZpbmFsbHkoKCkgPT4ge1xuXHRcdFx0XHRpZiAoYWN0aXZlRXZlbnQucmVkaXJlY3RPbkZpbmlzaCAmJiB0aGlzLnNob3VsZFJlZGlyZWN0KSB7XG5cdFx0XHRcdFx0d2luZG93LmxvY2F0aW9uLmhyZWYgPSBgJHt0aGlzLnJlZGlyZWN0VXJsfSR7d2luZG93LmxvY2F0aW9uLnNlYXJjaH1gO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcdFx0XG5cdH1cblxuXHRnZXQgc3VwcG9ydGVkRXZlbnROYW1lcygpOiBzdHJpbmdbXSB7XG5cdFx0cmV0dXJuIE9iamVjdC5rZXlzKHRoaXMuc3VwcG9ydGVkRXZlbnRzKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBTdWJzY3JpYmVzIHRvIHRoZSBzcGVjaWZpZWQgZXZlbnQgd2l0aCBhIGNhbGxiYWNrIGZ1bmN0aW9uLlxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnROYW1lIC0gVGhlIG5hbWUgb2YgdGhlIGV2ZW50IHRvIHN1YnNjcmliZSB0by5cblx0ICogQHBhcmFtIHtmdW5jdGlvbihJRXZlbnQpOiB2b2lkfSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayBmdW5jdGlvbiB0byBiZSBleGVjdXRlZCB3aGVuIHRoZSBldmVudCBpcyB0cmlnZ2VyZWQuXG5cdCAqIEB0aHJvd3Mge0Vycm9yfSAtIFRocm93cyBhbiBlcnJvciBpZiB0aGUgZXZlbnQgaXMgdW5zdXBwb3J0ZWQuXG5cdCAqL1xuXHRwdWJsaWMgc3Vic2NyaWJlKGV2ZW50TmFtZTogc3RyaW5nLCBjYWxsYmFjazogKGV2ZW50OiBJRXZlbnQpID0+IHZvaWQpIHtcblx0XHRpZiAoISB0aGlzLnN1cHBvcnRlZEV2ZW50TmFtZXMuaW5jbHVkZXMoZXZlbnROYW1lKSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBldmVudDogJHtldmVudE5hbWV9YCk7XG5cdFx0fVxuXHRcdFxuXHRcdHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKHsgZXZlbnROYW1lLCBjYWxsYmFja30pO1xuXHR9XG5cblx0LyoqXG5cdCAqIFVuc3Vic2NyaWJlcyBmcm9tIHRoZSBzcGVjaWZpZWQgZXZlbnQgYnkgcmVtb3ZpbmcgdGhlIGNhbGxiYWNrIGZ1bmN0aW9uLlxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnROYW1lIC0gVGhlIG5hbWUgb2YgdGhlIGV2ZW50IHRvIHVuc3Vic2NyaWJlIGZyb20uXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb24oSUV2ZW50KTogdm9pZH0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gdG8gYmUgcmVtb3ZlZC5cblx0ICogQHRocm93cyB7RXJyb3J9IC0gVGhyb3dzIGFuIGVycm9yIGlmIHRoZSBldmVudCBpcyB1bnN1cHBvcnRlZC5cblx0ICovXG5cdHB1YmxpYyB1bnN1YnNjcmliZShldmVudE5hbWU6IHN0cmluZywgY2FsbGJhY2s6IChldmVudDogSUV2ZW50KSA9PiB2b2lkKSB7XG5cdFx0aWYgKCEgdGhpcy5zdXBwb3J0ZWRFdmVudE5hbWVzLmluY2x1ZGVzKGV2ZW50TmFtZSkpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgZXZlbnQ6ICR7ZXZlbnROYW1lfWApO1xuXHRcdH1cblxuXHRcdC8vIGZpbmQgdGhlIGV2ZW50IGluIHRoZSBzdWJzY3JpcHRpb25zIGFycmF5IGFuZCByZW1vdmUgaXRcblx0XHRjb25zdCBldmVudEluZGV4ID0gdGhpcy5zdWJzY3JpcHRpb25zLmZpbmRJbmRleChzdWJzY3JpcHRpb24gPT4gc3Vic2NyaXB0aW9uLmV2ZW50TmFtZSA9PT0gZXZlbnROYW1lICYmIHN1YnNjcmlwdGlvbi5jYWxsYmFjayA9PT0gY2FsbGJhY2spO1xuXHRcdGlmIChldmVudEluZGV4ID49IDApIHtcblx0XHRcdHRoaXMuc3Vic2NyaXB0aW9ucy5zcGxpY2UoZXZlbnRJbmRleCwgMSk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFRyaWdnZXJzIHRoZSBzdWJzY3JpcHRpb24gY2FsbGJhY2tzIGZvciB0aGUgc3BlY2lmaWVkIGV2ZW50LlxuXHQgKlxuXHQgKiBAcGFyYW0ge0lFdmVudH0gZXZlbnQgLSBUaGUgZXZlbnQgZm9yIHdoaWNoIHRvIHRyaWdnZXIgdGhlIHN1YnNjcmlwdGlvbiBjYWxsYmFja3MuXG5cdCAqL1xuXHRwdWJsaWMgdHJpZ2dlclN1YnNjcmlwdGlvbihldmVudDogSUV2ZW50KSB7XG5cdFx0Y29uc3Qgc3Vic2NyaXB0aW9ucyA9IHRoaXMuc3Vic2NyaXB0aW9ucy5maWx0ZXIoc3Vic2NyaXB0aW9uID0+IHN1YnNjcmlwdGlvbi5ldmVudE5hbWUgPT09IGV2ZW50Lm5hbWUpO1xuXHRcdHN1YnNjcmlwdGlvbnMuZm9yRWFjaChzdWJzY3JpcHRpb24gPT4gc3Vic2NyaXB0aW9uLmNhbGxiYWNrKGV2ZW50KSk7XG5cdH1cbn0iLCJpbXBvcnQgSUV2ZW50UGF5bG9hZCBmcm9tIFwiLi9pbnRlZmFjZXMvSUV2ZW50UGF5bG9hZFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZW1vdGUge1xuXHRwcml2YXRlIGFwaV9rZXk6IHN0cmluZztcblx0cHJpdmF0ZSB1cmw6IHN0cmluZztcblx0cHJpdmF0ZSBkZWJ1ZzogYm9vbGVhbjtcblxuXHRjb25zdHJ1Y3RvcihhcGlfa2V5OiBzdHJpbmcsIHVybDogc3RyaW5nLCBkZWJ1ZzogYm9vbGVhbikge1xuXHRcdHRoaXMuYXBpX2tleSA9IGFwaV9rZXk7XG5cdFx0dGhpcy51cmwgPSB1cmw7XG5cdFx0dGhpcy5kZWJ1ZyA9IGRlYnVnO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNlbmRzIGEgUE9TVCByZXF1ZXN0IHdpdGggdGhlIHNwZWNpZmllZCBkYXRhIHRvIHRoZSBjb25maWd1cmVkIFVSTC5cblx0ICpcblx0ICogQHBhcmFtIHtJRXZlbnRQYXlsb2FkfSBkYXRhIC0gVGhlIGRhdGEgdG8gYmUgc2VudCBpbiB0aGUgUE9TVCByZXF1ZXN0LlxuXHQgKiBAcmV0dXJucyB7UHJvbWlzZTxvYmplY3R8c3RyaW5nPn0gLSBBIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byB0aGUgcmVzcG9uc2UgZGF0YSwgZWl0aGVyIGFzIGFuIG9iamVjdCBpZiB0aGUgcmVzcG9uc2UgaXMgSlNPTiwgb3IgYXMgYSBzdHJpbmcgb3RoZXJ3aXNlLlxuXHQgKi9cblx0cHVibGljIGFzeW5jIHBvc3QoZGF0YTogSUV2ZW50UGF5bG9hZCk6IFByb21pc2U8b2JqZWN0fHN0cmluZz4ge1xuXHRcdGlmICh0aGlzLmRlYnVnKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhgU2VuZGluZyBldmVudCB0byAke3RoaXMudXJsfSB3aXRoIGRhdGE6YCk7XG5cdFx0XHRjb25zb2xlLnRhYmxlKGRhdGEpO1xuXHRcdH1cblxuXHRcdGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godGhpcy51cmwsIHtcblx0XHRcdG1ldGhvZDogXCJQT1NUXCIsXG5cdFx0XHRoZWFkZXJzOiB7XG5cdFx0XHRcdFwiQ29udGVudC10eXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxuXHRcdFx0XHRcImFwaS1rZXlcIjogdGhpcy5hcGlfa2V5LFxuXHRcdFx0fSxcblx0XHRcdGtlZXBhbGl2ZTogdHJ1ZSxcblx0XHRcdGJvZHk6IEpTT04uc3RyaW5naWZ5KGRhdGEpLFxuXHRcdH0pO1xuXG5cdFx0Y29uc3QgY29udGVudFR5cGUgPSByZXNwb25zZS5oZWFkZXJzLmdldChcImNvbnRlbnQtdHlwZVwiKTtcblx0XHRpZiAoY29udGVudFR5cGUgJiYgY29udGVudFR5cGUuaW5kZXhPZihcImFwcGxpY2F0aW9uL2pzb25cIikgIT09IC0xKSB7XG5cdFx0XHRyZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gcmVzcG9uc2UudGV4dCgpO1xuXHRcdH1cblx0fVxufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVVVSUQoKSB7XG5cdC8vIGh0dHA6Ly93d3cuaWV0Zi5vcmcvcmZjL3JmYzQxMjIudHh0XG5cdGNvbnN0IHM6IGFueVtdID0gW107XG5cdGNvbnN0IGhleERpZ2l0cyA9IFwiMDEyMzQ1Njc4OWFiY2RlZlwiO1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IDM2OyBpKyspIHtcblx0XHRzW2ldID0gaGV4RGlnaXRzLnN1YnN0cihNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAweDEwKSwgMSk7XG5cdH1cblx0c1sxNF0gPSBcIjRcIjsgIC8vIGJpdHMgMTItMTUgb2YgdGhlIHRpbWVfaGlfYW5kX3ZlcnNpb24gZmllbGQgdG8gMDAxMFxuXHRzWzE5XSA9IGhleERpZ2l0cy5zdWJzdHIoKHNbMTldICYgMHgzKSB8IDB4OCwgMSk7ICAvLyBiaXRzIDYtNyBvZiB0aGUgY2xvY2tfc2VxX2hpX2FuZF9yZXNlcnZlZCB0byAwMVxuXHRzWzhdID0gc1sxM10gPSBzWzE4XSA9IHNbMjNdID0gXCItXCI7XG5cblx0cmV0dXJuIHMuam9pbihcIlwiKTtcbn1cblxuY29uc3QgZmlyc3RUTERzID0gXCJhY3xhZHxhZXxhZnxhZ3xhaXxhbHxhbXxhbnxhb3xhcXxhcnxhc3xhdHxhdXxhd3xheHxhenxiYXxiYnxiZXxiZnxiZ3xiaHxiaXxianxibXxib3xicnxic3xidHxidnxid3xieXxienxjYXxjY3xjZHxjZnxjZ3xjaHxjaXxjbHxjbXxjbnxjb3xjcnxjdXxjdnxjd3xjeHxjenxkZXxkanxka3xkbXxkb3xkenxlY3xlZXxlZ3xlc3xldHxldXxmaXxmbXxmb3xmcnxnYXxnYnxnZHxnZXxnZnxnZ3xnaHxnaXxnbHxnbXxnbnxncHxncXxncnxnc3xndHxnd3xneXxoa3xobXxobnxocnxodHxodXxpZHxpZXxpbHxpbXxpbnxpb3xpcXxpcnxpc3xpdHxqZXxqb3xqcHxrZ3xraXxrbXxrbnxrcHxrcnxreXxrenxsYXxsYnxsY3xsaXxsa3xscnxsc3xsdHxsdXxsdnxseXxtYXxtY3xtZHxtZXxtZ3xtaHxta3xtbHxtbnxtb3xtcHxtcXxtcnxtc3xtdHxtdXxtdnxtd3xteHxteXxuYXxuY3xuZXxuZnxuZ3xubHxub3xucnxudXxuenxvbXxwYXxwZXxwZnxwaHxwa3xwbHxwbXxwbnxwcnxwc3xwdHxwd3xweXxxYXxyZXxyb3xyc3xydXxyd3xzYXxzYnxzY3xzZHxzZXxzZ3xzaHxzaXxzanxza3xzbHxzbXxzbnxzb3xzcnxzdHxzdXxzdnxzeHxzeXxzenx0Y3x0ZHx0Znx0Z3x0aHx0anx0a3x0bHx0bXx0bnx0b3x0cHx0cnx0dHx0dnx0d3x0enx1YXx1Z3x1a3x1c3x1eXx1enx2YXx2Y3x2ZXx2Z3x2aXx2bnx2dXx3Znx3c3x5dFwiLnNwbGl0KFwifFwiKTtcblxuY29uc3Qgc2Vjb25kVExEcyA9IFwiY29tfGVkdXxnb3Z8bmV0fG1pbHxvcmd8bm9tfHNjaHxjYWF8cmVzfG9mZnxnb2J8aW50fHR1cnxpcDZ8dXJpfHVybnxhc258YWN0fG5zd3xxbGR8dGFzfHZpY3xwcm98Yml6fGFkbXxhZHZ8YWdyfGFycXxhcnR8YXRvfGJpb3xibWR8Y2ltfGNuZ3xjbnR8ZWNufGVjb3xlbXB8ZW5nfGVzcHxldGN8ZXRpfGZhcnxmbmR8Zm90fGZzdHxnMTJ8Z2dmfGltYnxpbmR8aW5mfGpvcnxqdXN8bGVnfGxlbHxtYXR8bWVkfG11c3xub3R8bnRyfG9kb3xwcGd8cHNjfHBzaXxxc2x8cmVjfHNsZ3xzcnZ8dGVvfHRtcHx0cmR8dmV0fHpsZ3x3ZWJ8bHRkfHNsZHxwb2x8ZmlufGsxMnxsaWJ8cHJpfGFpcHxmaWV8ZXVufHNjaXxwcmR8Y2NpfHB2dHxtb2R8aWR2fHJlbHxzZXh8Z2VufG5pY3xhYnJ8YmFzfGNhbHxjYW18ZW1yfGZ2Z3xsYXp8bGlnfGxvbXxtYXJ8bW9sfHBtbnxwdWd8c2FyfHNpY3x0YWF8dG9zfHVtYnx2YW98dmRhfHZlbnxtaWV85YyX5rW36YGTfOWSjOatjOWxsXznpZ7lpYjlt5186bm/5YWQ5bO2fGFzc3xyZXB8dHJhfHBlcnxuZ298c29jfGdycHxwbGN8aXRzfGFpcnxhbmR8YnVzfGNhbnxkZHJ8amZrfG1hZHxucnd8bnljfHNraXxzcHl8dGNtfHVsbXx1c2F8d2FyfGZoc3x2Z3N8ZGVwfGVpZHxmZXR8ZmxhfGZsw6V8Z29sfGhvZnxob2x8c2VsfHZpa3xjcml8aXdpfGluZ3xhYm98ZmFtfGdva3xnb258Z29wfGdvc3xhaWR8YXRtfGdzbXxzb3N8ZWxrfHdhd3xlc3R8YWNhfGJhcnxjcGF8anVyfGxhd3xzZWN8cGxvfHd3d3xiaXJ8Y2JnfGphcnxraHZ8bXNrfG5vdnxuc2t8cHR6fHJuZHxzcGJ8c3R2fHRvbXx0c2t8dWRtfHZybnxjbXd8a21zfG5renxzbnp8cHVifGZodnxyZWR8ZW5zfG5hdHxybnN8cm51fGJic3x0ZWx8YmVsfGtlcHxuaHN8ZG5pfGZlZHxpc2F8bnNufGd1YnxlMTJ8dGVjfNC+0YDQs3zQvtCx0YB80YPQv9GAfGFsdHxuaXN8anBufG1leHxhdGh8aWtpfG5pZHxnZGF8aW5jXCIuc3BsaXQoXCJ8XCIpO1xuXG5jb25zdCBrbm93blN1YmRvbWFpbnMgPSBcInd3d3xzdHVkaW98bWFpbHxyZW1vdGV8YmxvZ3x3ZWJtYWlsfHNlcnZlcnxuczF8bnMyfHNtdHB8c2VjdXJlfHZwbnxtfHNob3B8ZnRwfG1haWwyfHRlc3R8cG9ydGFsfG5zfHd3MXxob3N0fHN1cHBvcnR8ZGV2fHdlYnxiYnN8d3c0MnxzcXVhdHRlcnxteHxlbWFpbHwxfG1haWwxfDJ8Zm9ydW18b3dhfHd3dzJ8Z3d8YWRtaW58c3RvcmV8bXgxfGNkbnxhcGl8ZXhjaGFuZ2V8YXBwfGdvdnwydHR5fHZwc3xnb3Z5dHl8aGdmZ2RmfG5ld3N8MXJlcnxsa2prdWlcIjtcblxuLyoqXG4gKiBSZW1vdmVzIHRoZSBzdWJkb21haW4gZnJvbSB0aGUgZ2l2ZW4gc3RyaW5nLCBpZiBpdCBtYXRjaGVzIGFueSBrbm93biBzdWJkb21haW5zLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBzIC0gVGhlIHN0cmluZyBmcm9tIHdoaWNoIHRvIHJlbW92ZSB0aGUgc3ViZG9tYWluLlxuICogQHJldHVybnMge3N0cmluZ30gLSBUaGUgc3RyaW5nIHdpdGhvdXQgdGhlIHN1YmRvbWFpbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZVN1YmRvbWFpbihzOiBzdHJpbmcpOiBzdHJpbmcge1xuXHRjb25zdCBrbm93blN1YmRvbWFpbnNSZWdFeHAgPSBuZXcgUmVnRXhwKGBeKCR7a25vd25TdWJkb21haW5zfSkuYCwgXCJpXCIpO1xuXHRzID0gcy5yZXBsYWNlKGtub3duU3ViZG9tYWluc1JlZ0V4cCwgXCJcIik7XG5cblx0Y29uc3QgcGFydHMgPSBzLnNwbGl0KFwiLlwiKTtcblxuXHR3aGlsZSAocGFydHMubGVuZ3RoID4gMykge1xuXHRcdHBhcnRzLnNoaWZ0KCk7XG5cdH1cblxuXHRpZiAocGFydHMubGVuZ3RoID09PSAzICYmICgocGFydHNbMV0ubGVuZ3RoID4gMiAmJiBwYXJ0c1syXS5sZW5ndGggPiAyKSB8fCAoc2Vjb25kVExEcy5pbmRleE9mKHBhcnRzWzFdKSA9PT0gLTEpICYmIGZpcnN0VExEcy5pbmRleE9mKHBhcnRzWzJdKSA9PT0gLTEpKSB7XG5cdFx0cGFydHMuc2hpZnQoKTtcblx0fVxuXG5cdHJldHVybiBwYXJ0cy5qb2luKFwiLlwiKTtcbn1cblxuY29uc3QgdGltZW91dHMgPSB7fTtcbi8qKlxuICogRGVib3VuY2UgYSBmdW5jdGlvbiwgZW5zdXJpbmcgaXQgaXMgb25seSBjYWxsZWQgYWZ0ZXIgYSBzcGVjaWZpZWQgd2FpdCB0aW1lIGhhcyBlbGFwc2VkIHNpbmNlIHRoZSBsYXN0IGNhbGwuXG4gKlxuICogQHRlbXBsYXRlIEFyZ3MgLSBUaGUgdHlwZSBvZiBhcmd1bWVudHMgdGhlIGNhbGxiYWNrIGZ1bmN0aW9uIGFjY2VwdHMuXG4gKiBAcGFyYW0geyguLi5hcmdzOiBBcmdzKSA9PiB2b2lkfSBjYWxsYmFjayAtIFRoZSBmdW5jdGlvbiB0byBkZWJvdW5jZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSB3YWl0IC0gVGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdG8gd2FpdCBiZWZvcmUgaW52b2tpbmcgdGhlIGNhbGxiYWNrLlxuICogQHBhcmFtIHsuLi5BcmdzfSBhcmdzIC0gVGhlIGFyZ3VtZW50cyB0byBwYXNzIHRvIHRoZSBjYWxsYmFjayBmdW5jdGlvbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlYm91bmNlPEFyZ3MgZXh0ZW5kcyBhbnlbXT4oY2FsbGJhY2s6ICguLi5hcmdzOiBBcmdzKSA9PiB2b2lkLCB3YWl0OiBudW1iZXIsIC4uLmFyZ3M6IEFyZ3MpIDogdm9pZCB7XG5cdGNvbnN0IFssIGV2ZW50XSA9IGFyZ3M7XG5cdFxuXHRpZiAoISBldmVudC50YXJnZXQuaGFzQXR0cmlidXRlKFwiZGF0YS1pZFwiKSkge1xuXHRcdGV2ZW50LnRhcmdldC5zZXRBdHRyaWJ1dGUoXCJkYXRhLWlkXCIsIGNyZWF0ZVVVSUQoKSk7XG5cdH1cblxuXHRjb25zdCBpZCA9IGV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWlkXCIpO1xuXG5cdGlmICh0aW1lb3V0c1tpZF0pIHtcblx0XHRjbGVhclRpbWVvdXQodGltZW91dHNbaWRdKTtcblx0fVxuXG5cdHRpbWVvdXRzW2lkXSA9IHNldFRpbWVvdXQoY2FsbGJhY2ssIHdhaXQsIC4uLmFyZ3MpO1xufSIsImludGVyZmFjZSBQYXJhbWV0ZXJNYXAge1xuICAgIFtzOiBzdHJpbmddOiBhbnlcbn1cbmV4cG9ydCBjbGFzcyBVcmxQYXJzZXIge1xuXG5cdHByaXZhdGUgcGFyYW1ldGVyczogUGFyYW1ldGVyTWFwO1xuXHRwdWJsaWMgcmVhZG9ubHkgcHJvdG9jb2w6IHN0cmluZztcblx0cHVibGljIHJlYWRvbmx5IGhvc3Q6IHN0cmluZztcblx0cHVibGljIHJlYWRvbmx5IGhvc3RuYW1lOiBzdHJpbmc7XG5cdHB1YmxpYyByZWFkb25seSBwb3J0OiBzdHJpbmc7XG5cdHB1YmxpYyByZWFkb25seSBwYXRobmFtZTogc3RyaW5nO1xuXHRwdWJsaWMgcmVhZG9ubHkgaGFzaDogc3RyaW5nO1xuXHRwdWJsaWMgcmVhZG9ubHkgc2VhcmNoOiBzdHJpbmc7XG5cblx0Y29uc3RydWN0b3IodXJsOnN0cmluZykge1xuXHRcdGNvbnN0IHBhcnNlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xuXHRcdHBhcnNlci5ocmVmID0gdXJsO1xuXG5cdFx0dGhpcy5wcm90b2NvbCA9IHBhcnNlci5wcm90b2NvbDsgLy8gPT4gXCJodHRwOlwiXG5cdFx0dGhpcy5ob3N0ID0gcGFyc2VyLmhvc3Q7ICAgICAvLyA9PiBcImV4YW1wbGUuY29tOjMwMDBcIlxuXHRcdHRoaXMuaG9zdG5hbWUgPSBwYXJzZXIuaG9zdG5hbWU7IC8vID0+IFwiZXhhbXBsZS5jb21cIlxuXHRcdHRoaXMucG9ydCA9IHBhcnNlci5wb3J0OyAgICAgLy8gPT4gXCIzMDAwXCJcblx0XHR0aGlzLnBhdGhuYW1lID0gcGFyc2VyLnBhdGhuYW1lOyAvLyA9PiBcIi9wYXRobmFtZS9cIlxuXHRcdHRoaXMuaGFzaCA9IHBhcnNlci5oYXNoOyAgICAgLy8gPT4gXCIjaGFzaFwiXG5cdFx0dGhpcy5zZWFyY2ggPSBwYXJzZXIuc2VhcmNoLnN1YnN0cigxKTsgICAvLyA9PiBcIj9zZWFyY2g9dGVzdFwiXG5cblx0XHR0aGlzLnBhcnNlUGFyYW1ldGVycygpO1xuXHR9XG5cblx0cHJpdmF0ZSBwYXJzZVBhcmFtZXRlcnMoKSB7XG5cdFx0dGhpcy5wYXJhbWV0ZXJzID0ge307XG5cblx0XHRjb25zdCBwYXJhbXNHcm91cCA9IHRoaXMuc2VhcmNoLnNwbGl0KFwiJlwiKTtcblx0XHRmb3IoY29uc3QgcGFyYW0gb2YgcGFyYW1zR3JvdXApIHtcblx0XHRcdGNvbnN0IFtrZXksIHZhbHVlXSA9IHBhcmFtLnNwbGl0KFwiPVwiKTtcblx0XHRcdHRoaXMucGFyYW1ldGVyc1trZXldID0gdmFsdWU7XG5cdFx0fVxuXHR9XG5cblx0cHVibGljIGZpbmRQYXJhbShwYXJhbTogc3RyaW5nKSA6IGFueSB7XG5cdFx0cmV0dXJuIHRoaXMucGFyYW1ldGVyc1twYXJhbV0gfHwgbnVsbDtcblx0fVxuXG59IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgQVRTRXZlbnQge1xuXHRiYXNpY1ZhbGlkYXRpb24oZWxlbWVudDogSFRNTEVsZW1lbnQpIHtcblx0XHRpZiAoZWxlbWVudC5oYXNBdHRyaWJ1dGUoXCJkYXRhLWlnbm9yZVwiKSkge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIGNoZWNrIGlmIHRoZSBlbGVtZW50IGhhcyBAY2xpY2sgd2l0aCBhbnkgb2YgdGhlIC5zdG9wIG9yIC5wcmV2ZW50IG1vZGlmaWVyc1xuXHRcdGZvciAoY29uc3QgYXR0cmlidXRlIG9mIGVsZW1lbnQuYXR0cmlidXRlcykge1xuXHRcdFx0Ly8gY2hlY2sgaWYgYXR0cmlidXRlIHN0YXJ0cyB3aXRoIEBjbGlja1xuXHRcdFx0aWYgKGF0dHJpYnV0ZS5uYW1lLnN0YXJ0c1dpdGgoXCJAY2xpY2tcIikpIHtcblx0XHRcdFx0Ly8gY2hlY2sgaWYgdGhlIGF0dHJpYnV0ZSBjb250YWlucyAuc3RvcCBvciAucHJldmVudFxuXHRcdFx0XHRpZiAoYXR0cmlidXRlLm5hbWUuaW5jbHVkZXMoXCIuc3RvcFwiKSB8fCBhdHRyaWJ1dGUubmFtZS5pbmNsdWRlcyhcIi5wcmV2ZW50XCIpKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cbn0iLCJpbXBvcnQgSUV2ZW50IGZyb20gXCIuLi9pbnRlZmFjZXMvSUV2ZW50XCI7XG5pbXBvcnQgQVRTRXZlbnQgZnJvbSBcIi4vQVRTRXZlbnRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXR0YWNobWVudE9wZW4gZXh0ZW5kcyBBVFNFdmVudCBpbXBsZW1lbnRzIElFdmVudCB7XG5cdGdldCBzaG91bGREZWJvdW5jZSgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0Z2V0IHRyaWdnZXIoKTogbnVsbCB7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblx0Z2V0IHNvdXJjZSgpOiBudWxsIHtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXHRnZXQgbmFtZSgpOiBzdHJpbmcge1xuXHRcdHJldHVybiBcImF0dGFjaG1lbnRfb3BlbmVkXCI7XG5cdH1cblx0Z2V0IGhhc1R5cGVzKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRnZXQgcmVkaXJlY3RPbkZpbmlzaCgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0Z2V0IGlzQmxvY2tpbmcoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblx0Z2V0IGFsbG93TXVsdGlwbGUoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGlzVmFsaWQoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cbn0iLCJpbXBvcnQgSUV2ZW50IGZyb20gXCIuLi9pbnRlZmFjZXMvSUV2ZW50XCI7XG5pbXBvcnQgQVRTRXZlbnQgZnJvbSBcIi4vQVRTRXZlbnRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2xpY2sgZXh0ZW5kcyBBVFNFdmVudCBpbXBsZW1lbnRzIElFdmVudCB7XG5cdGdldCBzaG91bGREZWJvdW5jZSgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0Z2V0IHRyaWdnZXIoKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gXCJjbGlja1wiO1xuXHR9XG5cdGdldCBzb3VyY2UoKTogV2luZG93IHtcblx0XHRyZXR1cm4gd2luZG93O1xuXHR9XG5cdGdldCBuYW1lKCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIFwiYnV0dG9uX2NsaWNrZWRcIjtcblx0fVxuXHRnZXQgaGFzVHlwZXMoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblx0Z2V0IHJlZGlyZWN0T25GaW5pc2goKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblx0Z2V0IGlzQmxvY2tpbmcoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblx0Z2V0IGFsbG93TXVsdGlwbGUoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlOyBcblx0fVxuXG5cdGlzVmFsaWQoZXZlbnQ6IEV2ZW50KTogYm9vbGVhbiB7XG5cdFx0aWYgKGV2ZW50Py50YXJnZXQgaW5zdGFuY2VvZiBIVE1MQW5jaG9yRWxlbWVudCkge1xuXHRcdFx0cmV0dXJuIHRoaXMudmFsaWRhdGVBbmNob3IoZXZlbnQudGFyZ2V0KTtcblx0XHR9XG5cdFx0XG5cblx0XHRpZiAoZXZlbnQ/LnRhcmdldCBpbnN0YW5jZW9mIEhUTUxCdXR0b25FbGVtZW50KSB7XG5cdFx0XHRyZXR1cm4gdGhpcy52YWxpZGF0ZUJ1dHRvbihldmVudC50YXJnZXQpO1xuXHRcdH1cblxuXHRcdC8vIGNoZWNrIGlmIHBhcmVudHMgYXJlIGFuY2hvciBvciBidXR0b25cblx0XHRsZXQgZWxlbWVudCA9IGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudDtcblx0XHRsZXQgbGltaXQgPSAxMDtcblx0XHR3aGlsZSAoZWxlbWVudC5wYXJlbnRFbGVtZW50ICYmIGxpbWl0ID4gMCkge1xuXHRcdFx0aWYgKGVsZW1lbnQucGFyZW50RWxlbWVudCBpbnN0YW5jZW9mIEhUTUxBbmNob3JFbGVtZW50KSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLnZhbGlkYXRlQW5jaG9yKGVsZW1lbnQucGFyZW50RWxlbWVudCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoZWxlbWVudC5wYXJlbnRFbGVtZW50IGluc3RhbmNlb2YgSFRNTEJ1dHRvbkVsZW1lbnQpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMudmFsaWRhdGVCdXR0b24oZWxlbWVudC5wYXJlbnRFbGVtZW50KTtcblx0XHRcdH1cblx0XHRcdGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudEVsZW1lbnQ7XG5cdFx0XHRsaW1pdC0tO1xuXHRcdH1cblxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdHByaXZhdGUgdmFsaWRhdGVBbmNob3IoZWxlbWVudDogSFRNTEVsZW1lbnQpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdGhpcy5iYXNpY1ZhbGlkYXRpb24oZWxlbWVudCk7XG5cdH1cblxuXHRwcml2YXRlIHZhbGlkYXRlQnV0dG9uKGVsZW1lbnQ6IEhUTUxFbGVtZW50KTogYm9vbGVhbiB7XG5cdFx0aWYgKCF0aGlzLmJhc2ljVmFsaWRhdGlvbihlbGVtZW50KSB8fCAoZWxlbWVudC5oYXNBdHRyaWJ1dGUoXCJ0eXBlXCIpICYmIGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwidHlwZVwiKSA9PT0gXCJzdWJtaXRcIikpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdFx0XHRcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG59IiwiaW1wb3J0IElFdmVudCBmcm9tIFwiLi4vaW50ZWZhY2VzL0lFdmVudFwiO1xuaW1wb3J0IEFUU0V2ZW50IGZyb20gXCIuL0FUU0V2ZW50XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsaXBib2FyZCBleHRlbmRzIEFUU0V2ZW50IGltcGxlbWVudHMgSUV2ZW50IHtcblx0Z2V0IHNob3VsZERlYm91bmNlKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRnZXQgdHJpZ2dlcigpOiBudWxsIHtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXHRnZXQgc291cmNlKCk6IG51bGwge1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cdGdldCBuYW1lKCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIFwiY2xpcGJvYXJkX2FjY2VwdGVkXCI7XG5cdH1cblx0Z2V0IGhhc1R5cGVzKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRnZXQgcmVkaXJlY3RPbkZpbmlzaCgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXHRnZXQgaXNCbG9ja2luZygpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXHRnZXQgYWxsb3dNdWx0aXBsZSgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0aXNWYWxpZCgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG59IiwiaW1wb3J0IElFdmVudCBmcm9tIFwiLi4vaW50ZWZhY2VzL0lFdmVudFwiO1xuaW1wb3J0IEFUU0V2ZW50IGZyb20gXCIuL0FUU0V2ZW50XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERvd25sb2FkIGV4dGVuZHMgQVRTRXZlbnQgaW1wbGVtZW50cyBJRXZlbnQge1xuXHRnZXQgc2hvdWxkRGVib3VuY2UoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCB0cmlnZ2VyKCk6IG51bGwge1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cdGdldCBzb3VyY2UoKTogbnVsbCB7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblx0Z2V0IG5hbWUoKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gXCJkb3dubG9hZF9maWxlX2V2ZW50XCI7XG5cdH1cblx0Z2V0IGhhc1R5cGVzKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRnZXQgcmVkaXJlY3RPbkZpbmlzaCgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXHRnZXQgaXNCbG9ja2luZygpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXHRnZXQgYWxsb3dNdWx0aXBsZSgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0aXNWYWxpZCgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG59IiwiaW1wb3J0IElFdmVudCBmcm9tIFwiLi4vaW50ZWZhY2VzL0lFdmVudFwiO1xuaW1wb3J0IEFUU0V2ZW50IGZyb20gXCIuL0FUU0V2ZW50XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEV4dGVuc2lvbiBleHRlbmRzIEFUU0V2ZW50IGltcGxlbWVudHMgSUV2ZW50IHtcblx0Z2V0IHNob3VsZERlYm91bmNlKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRnZXQgdHJpZ2dlcigpOiBudWxsIHtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXHRnZXQgc291cmNlKCk6IG51bGwge1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cdGdldCBuYW1lKCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIFwiZXh0ZW5zaW9uX2luc3RhbGxlZFwiO1xuXHR9XG5cdGdldCBoYXNUeXBlcygpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0Z2V0IHJlZGlyZWN0T25GaW5pc2goKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblx0Z2V0IGlzQmxvY2tpbmcoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblx0Z2V0IGFsbG93TXVsdGlwbGUoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGlzVmFsaWQoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxufSIsImltcG9ydCBJRXZlbnQgZnJvbSBcIi4uL2ludGVmYWNlcy9JRXZlbnRcIjtcbmltcG9ydCBBVFNFdmVudCBmcm9tIFwiLi9BVFNFdmVudFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGaWxlRG93bmxvYWQgZXh0ZW5kcyBBVFNFdmVudCBpbXBsZW1lbnRzIElFdmVudCB7XG5cdGdldCBzaG91bGREZWJvdW5jZSgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0Z2V0IHRyaWdnZXIoKTogbnVsbCB7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblx0Z2V0IHNvdXJjZSgpOiBudWxsIHtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXHRnZXQgbmFtZSgpOiBzdHJpbmcge1xuXHRcdHJldHVybiBcImZpbGVfZG93bmxvYWRcIjtcblx0fVxuXHRnZXQgaGFzVHlwZXMoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblx0Z2V0IHJlZGlyZWN0T25GaW5pc2goKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCBpc0Jsb2NraW5nKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVx0XG5cdGdldCBhbGxvd011bHRpcGxlKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdGlzVmFsaWQoZXZlbnQ6IEV2ZW50KTogYm9vbGVhbiB7XG5cdFx0aWYgKGV2ZW50Py50YXJnZXQgaW5zdGFuY2VvZiBIVE1MQW5jaG9yRWxlbWVudCkge1xuXHRcdFx0cmV0dXJuIHRoaXMudmFsaWRhdGVBbmNob3IoZXZlbnQudGFyZ2V0KTtcblx0XHR9XG5cdFx0XG5cblx0XHRpZiAoZXZlbnQ/LnRhcmdldCBpbnN0YW5jZW9mIEhUTUxCdXR0b25FbGVtZW50KSB7XG5cdFx0XHRyZXR1cm4gdGhpcy52YWxpZGF0ZUJ1dHRvbihldmVudC50YXJnZXQpO1xuXHRcdH1cblxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdHByaXZhdGUgdmFsaWRhdGVBbmNob3IoZWxlbWVudDogSFRNTEVsZW1lbnQpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdGhpcy5iYXNpY1ZhbGlkYXRpb24oZWxlbWVudCk7XG5cdH1cblxuXHRwcml2YXRlIHZhbGlkYXRlQnV0dG9uKGVsZW1lbnQ6IEhUTUxFbGVtZW50KTogYm9vbGVhbiB7XG5cdFx0aWYgKCF0aGlzLmJhc2ljVmFsaWRhdGlvbihlbGVtZW50KSB8fCAoZWxlbWVudC5oYXNBdHRyaWJ1dGUoXCJ0eXBlXCIpICYmIGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwidHlwZVwiKSA9PT0gXCJzdWJtaXRcIikpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdFx0XHRcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxufSAiLCJpbXBvcnQgSUV2ZW50IGZyb20gXCIuLi9pbnRlZmFjZXMvSUV2ZW50XCI7XG5pbXBvcnQgQVRTRXZlbnQgZnJvbSBcIi4vQVRTRXZlbnRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRmlsZU9wZW4gZXh0ZW5kcyBBVFNFdmVudCBpbXBsZW1lbnRzIElFdmVudCB7XG5cdGdldCBzaG91bGREZWJvdW5jZSgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0Z2V0IHRyaWdnZXIoKTogbnVsbCB7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblx0Z2V0IHNvdXJjZSgpOiBudWxsIHtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXHRnZXQgbmFtZSgpOiBzdHJpbmcge1xuXHRcdHJldHVybiBcImZpbGVfb3BlbmVkXCI7XG5cdH1cblx0Z2V0IGhhc1R5cGVzKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRnZXQgcmVkaXJlY3RPbkZpbmlzaCgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXHRnZXQgaXNCbG9ja2luZygpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXHRnZXQgYWxsb3dNdWx0aXBsZSgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0aXNWYWxpZCgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG59IiwiaW1wb3J0IElFdmVudCBmcm9tIFwiLi4vaW50ZWZhY2VzL0lFdmVudFwiO1xuaW1wb3J0IEFUU0V2ZW50IGZyb20gXCIuL0FUU0V2ZW50XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIElucHV0IGV4dGVuZHMgQVRTRXZlbnQgaW1wbGVtZW50cyBJRXZlbnQge1xuXHRnZXQgc2hvdWxkRGVib3VuY2UoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblx0Z2V0IHRyaWdnZXIoKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gXCJpbnB1dFwiO1xuXHR9XG5cdGdldCBzb3VyY2UoKTogV2luZG93IHtcblx0XHRyZXR1cm4gd2luZG93O1xuXHR9XG5cdGdldCBuYW1lKCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIFwiaW5wdXRfZmlsbGVkXCI7XG5cdH1cblx0Z2V0IGhhc1R5cGVzKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdGdldCByZWRpcmVjdE9uRmluaXNoKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRnZXQgaXNCbG9ja2luZygpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0Z2V0IGFsbG93TXVsdGlwbGUoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH0gIFxuXG5cdGlzVmFsaWQoZXZlbnQ6IEV2ZW50KTogYm9vbGVhbiB7XG5cdFx0aWYgKGV2ZW50Py50YXJnZXQgaW5zdGFuY2VvZiBIVE1MSW5wdXRFbGVtZW50KSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5iYXNpY1ZhbGlkYXRpb24oZXZlbnQudGFyZ2V0KSAmJiAhIWV2ZW50LnRhcmdldC52YWx1ZS50cmltKCk7XG5cdFx0fVxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxufVxuIiwiaW1wb3J0IElFdmVudCBmcm9tIFwiLi4vaW50ZWZhY2VzL0lFdmVudFwiO1xuaW1wb3J0IEFUU0V2ZW50IGZyb20gXCIuL0FUU0V2ZW50XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExvY2F0aW9uIGV4dGVuZHMgQVRTRXZlbnQgaW1wbGVtZW50cyBJRXZlbnQge1xuXHRnZXQgc2hvdWxkRGVib3VuY2UoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCB0cmlnZ2VyKCk6IG51bGwge1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cdGdldCBzb3VyY2UoKTogbnVsbCB7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblx0Z2V0IG5hbWUoKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gXCJsb2NhdGlvbl9hY2NlcHRlZFwiO1xuXHR9XG5cdGdldCBoYXNUeXBlcygpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0Z2V0IHJlZGlyZWN0T25GaW5pc2goKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblx0Z2V0IGlzQmxvY2tpbmcoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblx0Z2V0IGFsbG93TXVsdGlwbGUoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGlzVmFsaWQoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxufSIsImltcG9ydCBJRXZlbnQgZnJvbSBcIi4uL2ludGVmYWNlcy9JRXZlbnRcIjtcbmltcG9ydCBBVFNFdmVudCBmcm9tIFwiLi9BVFNFdmVudFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNaWNyb3Bob25lIGV4dGVuZHMgQVRTRXZlbnQgaW1wbGVtZW50cyBJRXZlbnQge1xuXHRnZXQgc2hvdWxkRGVib3VuY2UoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCB0cmlnZ2VyKCk6IG51bGwge1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cdGdldCBzb3VyY2UoKTogbnVsbCB7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblx0Z2V0IG5hbWUoKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gXCJtaWNfYWNjZXB0ZWRcIjtcblx0fVxuXHRnZXQgaGFzVHlwZXMoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCByZWRpcmVjdE9uRmluaXNoKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdGdldCBpc0Jsb2NraW5nKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdGdldCBhbGxvd011bHRpcGxlKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRpc1ZhbGlkKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cbn0iLCJpbXBvcnQgSUV2ZW50IGZyb20gXCIuLi9pbnRlZmFjZXMvSUV2ZW50XCI7XG5pbXBvcnQgQVRTRXZlbnQgZnJvbSBcIi4vQVRTRXZlbnRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTm90aWZpY2F0aW9uIGV4dGVuZHMgQVRTRXZlbnQgaW1wbGVtZW50cyBJRXZlbnQge1xuXHRnZXQgc2hvdWxkRGVib3VuY2UoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCB0cmlnZ2VyKCk6IG51bGwge1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cdGdldCBzb3VyY2UoKTogbnVsbCB7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblx0Z2V0IG5hbWUoKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gXCJub3RpZmljYXRpb25fYWNjZXB0ZWRcIjtcblx0fVxuXHRnZXQgaGFzVHlwZXMoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCByZWRpcmVjdE9uRmluaXNoKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdGdldCBpc0Jsb2NraW5nKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdGdldCBhbGxvd011bHRpcGxlKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRpc1ZhbGlkKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cbn0iLCJpbXBvcnQgSUV2ZW50IGZyb20gXCIuLi9pbnRlZmFjZXMvSUV2ZW50XCI7XG5pbXBvcnQgQVRTRXZlbnQgZnJvbSBcIi4vQVRTRXZlbnRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGFnZUxvYWRlZCBleHRlbmRzIEFUU0V2ZW50IGltcGxlbWVudHMgSUV2ZW50IHtcblx0Z2V0IHNob3VsZERlYm91bmNlKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRnZXQgdHJpZ2dlcigpOiBudWxsIHtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXHRnZXQgc291cmNlKCk6IERvY3VtZW50IHtcblx0XHRyZXR1cm4gZG9jdW1lbnQ7XG5cdH1cblx0Z2V0IG5hbWUoKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gXCJwYWdlX2xlZnRcIjtcblx0fVxuXHRnZXQgaGFzVHlwZXMoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCByZWRpcmVjdE9uRmluaXNoKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRnZXQgaXNCbG9ja2luZygpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0Z2V0IGFsbG93TXVsdGlwbGUoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGlzVmFsaWQoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGRvY3VtZW50LnZpc2liaWxpdHlTdGF0ZSA9PT0gXCJoaWRkZW5cIjtcblx0fVxufSIsImltcG9ydCBJRXZlbnQgZnJvbSBcIi4uL2ludGVmYWNlcy9JRXZlbnRcIjtcbmltcG9ydCBBVFNFdmVudCBmcm9tIFwiLi9BVFNFdmVudFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYWdlTG9hZGVkIGV4dGVuZHMgQVRTRXZlbnQgaW1wbGVtZW50cyBJRXZlbnQge1xuXHRnZXQgc2hvdWxkRGVib3VuY2UoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCB0cmlnZ2VyKCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIFwibG9hZFwiO1xuXHR9XG5cdGdldCBzb3VyY2UoKTogV2luZG93IHtcblx0XHRyZXR1cm4gd2luZG93O1xuXHR9XG5cdGdldCBuYW1lKCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIFwicGFnZV9sb2FkZWRcIjtcblx0fVxuXHRnZXQgaGFzVHlwZXMoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCByZWRpcmVjdE9uRmluaXNoKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRnZXQgaXNCbG9ja2luZygpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0Z2V0IGFsbG93TXVsdGlwbGUoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGlzVmFsaWQoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cbn0iLCJpbXBvcnQgSUV2ZW50IGZyb20gXCIuLi9pbnRlZmFjZXMvSUV2ZW50XCI7XG5pbXBvcnQgQVRTRXZlbnQgZnJvbSBcIi4vQVRTRXZlbnRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGFnZVJlYWQgZXh0ZW5kcyBBVFNFdmVudCBpbXBsZW1lbnRzIElFdmVudCB7XG5cdHByaXZhdGUgbWluU2Nyb2xsUGVyY2VudGFnZSA9IDcwO1xuXHRwcml2YXRlIG1pblN0YXlTZWNvbmRzID0gMioxMDAwO1xuXHRwcml2YXRlIGhhc1Njcm9sbGVkID0gZmFsc2U7XG5cdHByaXZhdGUgaGFzU3RheWVkID0gZmFsc2U7XG5cdHByaXZhdGUgY3VzdG9tRXZlbnQ6IEV2ZW50O1xuXHRwcml2YXRlIHRpbWVvdXQ6IGFueTtcblxuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpO1xuXHRcdHRoaXMuY3VzdG9tRXZlbnQgPSBuZXcgRXZlbnQodGhpcy50cmlnZ2VyKTtcblx0XHR0aGlzLmVuYWJsZSgpO1xuXHRcdGNvbnNvbGUubG9nKFwiUGFnZSByZWFkIGVuYWJsZWRcIik7XG5cdH1cblxuXHRnZXQgc2hvdWxkRGVib3VuY2UoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCB0cmlnZ2VyKCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIFwicGFnZV9yZWFkXCI7XG5cdH1cblx0Z2V0IHNvdXJjZSgpOiBXaW5kb3cge1xuXHRcdHJldHVybiB3aW5kb3c7XG5cdH1cblx0Z2V0IG5hbWUoKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gXCJwYWdlX3JlYWRcIjtcblx0fVxuXHRnZXQgaGFzVHlwZXMoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCByZWRpcmVjdE9uRmluaXNoKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRnZXQgaXNCbG9ja2luZygpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0Z2V0IGFsbG93TXVsdGlwbGUoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0Z2V0IGNhblNjcm9sbCgpOiBib29sZWFuIHtcblx0XHQvLyBkZXRlcm1pbmUgaWYgdGhlIHVzZXIgY2FuIHNjcm9sbCB0aGUgcGFnZVxuXHRcdHJldHVybiB3aW5kb3cuaW5uZXJIZWlnaHQgLyBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsSGVpZ2h0IDwgLjg1O1xuXHR9XG5cblx0aXNWYWxpZCgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdHByaXZhdGUgZW5hYmxlKCkge1xuXHRcdHdpbmRvdy5vbnNjcm9sbCA9ICgpID0+IHRoaXMuc2Nyb2xsZWQoKTtcblx0XHR0aGlzLmRldGVjdEZvY3VzKCk7XG5cdFx0dGhpcy5kZXRlY3RWaXNpYmlsaXR5KCk7XG5cdFx0dGhpcy5zY3JvbGxlZCgpO1xuXHRcdHRoaXMudGltZW91dCA9IHNldFRpbWVvdXQgKCgpID0+IHRoaXMuc3RheWVkKCksIHRoaXMubWluU3RheVNlY29uZHMpO1xuXHR9XG5cblx0cHJpdmF0ZSBnZXQgdmlzaWJpbGl0eVByb3BzKCkgOiBbc3RyaW5nLCBzdHJpbmddIHtcblx0XHRpZiAodHlwZW9mIGRvY3VtZW50LmhpZGRlbiAhPT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0cmV0dXJuIFtcInZpc2liaWxpdHljaGFuZ2VcIiwgXCJ2aXNpYmlsaXR5U3RhdGVcIl07XG5cdFx0fVxuXHRcdGVsc2UgaWYgKHR5cGVvZiAoZG9jdW1lbnQgYXMgYW55KS5tb3pIaWRkZW4gIT09IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdHJldHVybiBbXCJtb3p2aXNpYmlsaXR5Y2hhbmdlXCIsIFwibW96VmlzaWJpbGl0eVN0YXRlXCJdO1xuXHRcdH1cblx0XHRlbHNlIGlmICh0eXBlb2YgKGRvY3VtZW50IGFzIGFueSkubXNIaWRkZW4gIT09IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdHJldHVybiBbXCJtc3Zpc2liaWxpdHljaGFuZ2VcIiwgXCJtc1Zpc2liaWxpdHlTdGF0ZVwiXTtcblx0XHR9XG5cdFx0ZWxzZSBpZiAodHlwZW9mIChkb2N1bWVudCBhcyBhbnkpLndlYmtpdEhpZGRlbiAhPT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0cmV0dXJuIFtcIndlYmtpdHZpc2liaWxpdHljaGFuZ2VcIiwgXCJ3ZWJraXRWaXNpYmlsaXR5U3RhdGVcIl07XG5cdFx0fVxuXHRcdHRocm93IG5ldyBFcnJvcihcIlZpc2liaWxpdHkgbm90IHN1cHBvcnRlZC5cIik7XG5cdH1cblxuXHRwcml2YXRlIGRldGVjdEZvY3VzKCkge1xuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiZm9jdXNcIiwgdGhpcy5mb2N1c0dyYW50ZWQuYmluZCh0aGlzKSk7XG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJibHVyXCIsIHRoaXMuZm9jdXNMb3N0LmJpbmQodGhpcykpO1xuXHR9XG5cblx0cHJpdmF0ZSBkZXRlY3RWaXNpYmlsaXR5KCkge1xuXHRcdC8vIGNoZWNrIHRoZSB2aXNpYmxpbGl0eSBvZiB0aGUgcGFnZVxuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCBbdmlzaWJpbGl0eUNoYW5nZV0gPSB0aGlzLnZpc2liaWxpdHlQcm9wcztcblx0XHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIodmlzaWJpbGl0eUNoYW5nZSwgdGhpcy52aXNpYmlsaXR5Q2hhbmdlZC5iaW5kKHRoaXMpKTtcblx0XHR9IGNhdGNoKF8pIHtcblx0XHRcdC8vXG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBzdG9wRGV0ZWN0aW5nVmlzaWJpbGl0eSgpIHtcblx0XHQvLyBjaGVjayB0aGUgdmlzaWJsaWxpdHkgb2YgdGhlIHBhZ2Vcblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgW3Zpc2liaWxpdHlDaGFuZ2VdID0gdGhpcy52aXNpYmlsaXR5UHJvcHM7XG5cdFx0XHRkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKHZpc2liaWxpdHlDaGFuZ2UsIHRoaXMudmlzaWJpbGl0eUNoYW5nZWQuYmluZCh0aGlzKSk7XG5cdFx0fSBjYXRjaChfKSB7XG5cdFx0XHQvL1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgdmlzaWJpbGl0eUNoYW5nZWQoKSB7XG5cdFx0Y29uc3QgW18sIHZpc2liaWxpdHlTdGF0ZV0gPSB0aGlzLnZpc2liaWxpdHlQcm9wcztcblx0XHR0aGlzLnRvZ2dsZVRpbWVyKGRvY3VtZW50W3Zpc2liaWxpdHlTdGF0ZV0gPT09IFwidmlzaWJsZVwiKTtcblx0fVxuXG5cdHByaXZhdGUgZm9jdXNHcmFudGVkKCkge1xuXHRcdHRoaXMudG9nZ2xlVGltZXIodHJ1ZSk7XG5cdH1cblxuXHRwcml2YXRlIGZvY3VzTG9zdCgpIHtcblx0XHR0aGlzLnRvZ2dsZVRpbWVyKGZhbHNlKTtcblx0fVxuXG5cdHByaXZhdGUgdG9nZ2xlVGltZXIoc3RhdHVzOiBib29sZWFuKSB7XG5cdFx0aWYgKHRoaXMuaGFzU3RheWVkKSB7IHJldHVybjsgfVxuXG5cdFx0aWYoc3RhdHVzKSB7XG5cdFx0XHR0aGlzLnRpbWVvdXQgPSBzZXRUaW1lb3V0ICgoKSA9PiB0aGlzLnN0YXllZCgpLCB0aGlzLm1pblN0YXlTZWNvbmRzKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y2xlYXJUaW1lb3V0KHRoaXMudGltZW91dCk7XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBkaXNhYmxlKCkge1xuXHRcdHdpbmRvdy5vbnNjcm9sbCA9IG51bGw7XG5cdFx0dGhpcy5zdG9wRGV0ZWN0aW5nVmlzaWJpbGl0eSgpO1xuXHRcdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwiZm9jdXNcIiwgdGhpcy5mb2N1c0dyYW50ZWQuYmluZCh0aGlzKSk7XG5cdFx0d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJibHVyXCIsIHRoaXMuZm9jdXNMb3N0LmJpbmQodGhpcykpO1xuXHR9XG5cblx0cHJpdmF0ZSBnZXRTY3JvbGxQZXJjZW50KCkge1xuXHRcdHJldHVybiAoKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3AgKyBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCkgLyAoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbEhlaWdodCAtIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQpICogMTAwKTtcblx0fVxuXG5cdHByaXZhdGUgc2Nyb2xsZWQoKSB7XG5cdFx0aWYodGhpcy5nZXRTY3JvbGxQZXJjZW50KCkgPiB0aGlzLm1pblNjcm9sbFBlcmNlbnRhZ2UpIHtcblx0XHRcdGlmKHRoaXMuaGFzU3RheWVkKSB7XG5cdFx0XHRcdHRoaXMuZGlzcGF0Y2goKTtcblx0XHRcdH1cblx0XHRcdHRoaXMuaGFzU2Nyb2xsZWQgPSB0cnVlO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgc3RheWVkKCkge1xuXHRcdGlmKHRoaXMuaGFzU2Nyb2xsZWQgfHwgIXRoaXMuY2FuU2Nyb2xsKSB7XG5cdFx0XHR0aGlzLmRpc3BhdGNoKCk7XG5cdFx0fVxuXHRcdHRoaXMuaGFzU3RheWVkID0gdHJ1ZTtcblx0fVxuXG5cdHByaXZhdGUgZGlzcGF0Y2goKSB7XG5cdFx0d2luZG93LmRpc3BhdGNoRXZlbnQodGhpcy5jdXN0b21FdmVudCk7XG5cdFx0dGhpcy5kaXNhYmxlKCk7XG5cdH1cbn0iLCJpbXBvcnQgSUV2ZW50IGZyb20gXCIuLi9pbnRlZmFjZXMvSUV2ZW50XCI7XG5pbXBvcnQgQVRTRXZlbnQgZnJvbSBcIi4vQVRTRXZlbnRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3VibWl0IGV4dGVuZHMgQVRTRXZlbnQgaW1wbGVtZW50cyBJRXZlbnQge1xuXHRnZXQgc2hvdWxkRGVib3VuY2UoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCB0cmlnZ2VyKCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIFwic3VibWl0XCI7XG5cdH1cblx0Z2V0IHNvdXJjZSgpOiBXaW5kb3cge1xuXHRcdHJldHVybiB3aW5kb3c7XG5cdH1cblx0Z2V0IG5hbWUoKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gXCJmb3JtX3N1Ym1pdHRlZFwiO1xuXHR9XG5cdGdldCBoYXNUeXBlcygpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXHRnZXQgcmVkaXJlY3RPbkZpbmlzaCgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXHRnZXQgaXNCbG9ja2luZygpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXHRnZXQgYWxsb3dNdWx0aXBsZSgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0aXNWYWxpZChldmVudDogRXZlbnQpOiBib29sZWFuIHtcblx0XHRpZiAoZXZlbnQ/LnRhcmdldCBpbnN0YW5jZW9mIEhUTUxGb3JtRWxlbWVudCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuYmFzaWNWYWxpZGF0aW9uKGV2ZW50LnRhcmdldCk7XG5cdFx0fVxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuICAgIFxufSIsImltcG9ydCBJRXZlbnQgZnJvbSBcIi4uL2ludGVmYWNlcy9JRXZlbnRcIjtcbmltcG9ydCBBVFNFdmVudCBmcm9tIFwiLi9BVFNFdmVudFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXZWJjYW0gZXh0ZW5kcyBBVFNFdmVudCBpbXBsZW1lbnRzIElFdmVudCB7XG5cdGdldCBzaG91bGREZWJvdW5jZSgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0Z2V0IHRyaWdnZXIoKTogbnVsbCB7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblx0Z2V0IHNvdXJjZSgpOiBudWxsIHtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXHRnZXQgbmFtZSgpOiBzdHJpbmcge1xuXHRcdHJldHVybiBcIndlYmNhbV9hY2NlcHRlZFwiO1xuXHR9XG5cdGdldCBoYXNUeXBlcygpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0Z2V0IHJlZGlyZWN0T25GaW5pc2goKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblx0Z2V0IGlzQmxvY2tpbmcoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblx0Z2V0IGFsbG93TXVsdGlwbGUoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGlzVmFsaWQoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxufSIsIi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLyogVUFQYXJzZXIuanMgdjEuMC4zOFxuICAgQ29weXJpZ2h0IMKpIDIwMTItMjAyMSBGYWlzYWwgU2FsbWFuIDxmQGZhaXNhbG1hbi5jb20+XG4gICBNSVQgTGljZW5zZSAqLy8qXG4gICBEZXRlY3QgQnJvd3NlciwgRW5naW5lLCBPUywgQ1BVLCBhbmQgRGV2aWNlIHR5cGUvbW9kZWwgZnJvbSBVc2VyLUFnZW50IGRhdGEuXG4gICBTdXBwb3J0cyBicm93c2VyICYgbm9kZS5qcyBlbnZpcm9ubWVudC4gXG4gICBEZW1vICAgOiBodHRwczovL2ZhaXNhbG1hbi5naXRodWIuaW8vdWEtcGFyc2VyLWpzXG4gICBTb3VyY2UgOiBodHRwczovL2dpdGh1Yi5jb20vZmFpc2FsbWFuL3VhLXBhcnNlci1qcyAqL1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbihmdW5jdGlvbiAod2luZG93LCB1bmRlZmluZWQpIHtcblxuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIC8vLy8vLy8vLy8vLy8vXG4gICAgLy8gQ29uc3RhbnRzXG4gICAgLy8vLy8vLy8vLy8vL1xuXG5cbiAgICB2YXIgTElCVkVSU0lPTiAgPSAnMS4wLjM4JyxcbiAgICAgICAgRU1QVFkgICAgICAgPSAnJyxcbiAgICAgICAgVU5LTk9XTiAgICAgPSAnPycsXG4gICAgICAgIEZVTkNfVFlQRSAgID0gJ2Z1bmN0aW9uJyxcbiAgICAgICAgVU5ERUZfVFlQRSAgPSAndW5kZWZpbmVkJyxcbiAgICAgICAgT0JKX1RZUEUgICAgPSAnb2JqZWN0JyxcbiAgICAgICAgU1RSX1RZUEUgICAgPSAnc3RyaW5nJyxcbiAgICAgICAgTUFKT1IgICAgICAgPSAnbWFqb3InLFxuICAgICAgICBNT0RFTCAgICAgICA9ICdtb2RlbCcsXG4gICAgICAgIE5BTUUgICAgICAgID0gJ25hbWUnLFxuICAgICAgICBUWVBFICAgICAgICA9ICd0eXBlJyxcbiAgICAgICAgVkVORE9SICAgICAgPSAndmVuZG9yJyxcbiAgICAgICAgVkVSU0lPTiAgICAgPSAndmVyc2lvbicsXG4gICAgICAgIEFSQ0hJVEVDVFVSRT0gJ2FyY2hpdGVjdHVyZScsXG4gICAgICAgIENPTlNPTEUgICAgID0gJ2NvbnNvbGUnLFxuICAgICAgICBNT0JJTEUgICAgICA9ICdtb2JpbGUnLFxuICAgICAgICBUQUJMRVQgICAgICA9ICd0YWJsZXQnLFxuICAgICAgICBTTUFSVFRWICAgICA9ICdzbWFydHR2JyxcbiAgICAgICAgV0VBUkFCTEUgICAgPSAnd2VhcmFibGUnLFxuICAgICAgICBFTUJFRERFRCAgICA9ICdlbWJlZGRlZCcsXG4gICAgICAgIFVBX01BWF9MRU5HVEggPSA1MDA7XG5cbiAgICB2YXIgQU1BWk9OICA9ICdBbWF6b24nLFxuICAgICAgICBBUFBMRSAgID0gJ0FwcGxlJyxcbiAgICAgICAgQVNVUyAgICA9ICdBU1VTJyxcbiAgICAgICAgQkxBQ0tCRVJSWSA9ICdCbGFja0JlcnJ5JyxcbiAgICAgICAgQlJPV1NFUiA9ICdCcm93c2VyJyxcbiAgICAgICAgQ0hST01FICA9ICdDaHJvbWUnLFxuICAgICAgICBFREdFICAgID0gJ0VkZ2UnLFxuICAgICAgICBGSVJFRk9YID0gJ0ZpcmVmb3gnLFxuICAgICAgICBHT09HTEUgID0gJ0dvb2dsZScsXG4gICAgICAgIEhVQVdFSSAgPSAnSHVhd2VpJyxcbiAgICAgICAgTEcgICAgICA9ICdMRycsXG4gICAgICAgIE1JQ1JPU09GVCA9ICdNaWNyb3NvZnQnLFxuICAgICAgICBNT1RPUk9MQSAgPSAnTW90b3JvbGEnLFxuICAgICAgICBPUEVSQSAgID0gJ09wZXJhJyxcbiAgICAgICAgU0FNU1VORyA9ICdTYW1zdW5nJyxcbiAgICAgICAgU0hBUlAgICA9ICdTaGFycCcsXG4gICAgICAgIFNPTlkgICAgPSAnU29ueScsXG4gICAgICAgIFhJQU9NSSAgPSAnWGlhb21pJyxcbiAgICAgICAgWkVCUkEgICA9ICdaZWJyYScsXG4gICAgICAgIEZBQ0VCT09LICAgID0gJ0ZhY2Vib29rJyxcbiAgICAgICAgQ0hST01JVU1fT1MgPSAnQ2hyb21pdW0gT1MnLFxuICAgICAgICBNQUNfT1MgID0gJ01hYyBPUyc7XG5cbiAgICAvLy8vLy8vLy8vL1xuICAgIC8vIEhlbHBlclxuICAgIC8vLy8vLy8vLy9cblxuICAgIHZhciBleHRlbmQgPSBmdW5jdGlvbiAocmVnZXhlcywgZXh0ZW5zaW9ucykge1xuICAgICAgICAgICAgdmFyIG1lcmdlZFJlZ2V4ZXMgPSB7fTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgaW4gcmVnZXhlcykge1xuICAgICAgICAgICAgICAgIGlmIChleHRlbnNpb25zW2ldICYmIGV4dGVuc2lvbnNbaV0ubGVuZ3RoICUgMiA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBtZXJnZWRSZWdleGVzW2ldID0gZXh0ZW5zaW9uc1tpXS5jb25jYXQocmVnZXhlc1tpXSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbWVyZ2VkUmVnZXhlc1tpXSA9IHJlZ2V4ZXNbaV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG1lcmdlZFJlZ2V4ZXM7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcml6ZSA9IGZ1bmN0aW9uIChhcnIpIHtcbiAgICAgICAgICAgIHZhciBlbnVtcyA9IHt9O1xuICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpPGFyci5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGVudW1zW2FycltpXS50b1VwcGVyQ2FzZSgpXSA9IGFycltpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBlbnVtcztcbiAgICAgICAgfSxcbiAgICAgICAgaGFzID0gZnVuY3Rpb24gKHN0cjEsIHN0cjIpIHtcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2Ygc3RyMSA9PT0gU1RSX1RZUEUgPyBsb3dlcml6ZShzdHIyKS5pbmRleE9mKGxvd2VyaXplKHN0cjEpKSAhPT0gLTEgOiBmYWxzZTtcbiAgICAgICAgfSxcbiAgICAgICAgbG93ZXJpemUgPSBmdW5jdGlvbiAoc3RyKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RyLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIH0sXG4gICAgICAgIG1ham9yaXplID0gZnVuY3Rpb24gKHZlcnNpb24pIHtcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2YodmVyc2lvbikgPT09IFNUUl9UWVBFID8gdmVyc2lvbi5yZXBsYWNlKC9bXlxcZFxcLl0vZywgRU1QVFkpLnNwbGl0KCcuJylbMF0gOiB1bmRlZmluZWQ7XG4gICAgICAgIH0sXG4gICAgICAgIHRyaW0gPSBmdW5jdGlvbiAoc3RyLCBsZW4pIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2Yoc3RyKSA9PT0gU1RSX1RZUEUpIHtcbiAgICAgICAgICAgICAgICBzdHIgPSBzdHIucmVwbGFjZSgvXlxcc1xccyovLCBFTVBUWSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHR5cGVvZihsZW4pID09PSBVTkRFRl9UWVBFID8gc3RyIDogc3RyLnN1YnN0cmluZygwLCBVQV9NQVhfTEVOR1RIKTtcbiAgICAgICAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8vLy8vLy8vLy8vLy8vXG4gICAgLy8gTWFwIGhlbHBlclxuICAgIC8vLy8vLy8vLy8vLy8vXG5cbiAgICB2YXIgcmd4TWFwcGVyID0gZnVuY3Rpb24gKHVhLCBhcnJheXMpIHtcblxuICAgICAgICAgICAgdmFyIGkgPSAwLCBqLCBrLCBwLCBxLCBtYXRjaGVzLCBtYXRjaDtcblxuICAgICAgICAgICAgLy8gbG9vcCB0aHJvdWdoIGFsbCByZWdleGVzIG1hcHNcbiAgICAgICAgICAgIHdoaWxlIChpIDwgYXJyYXlzLmxlbmd0aCAmJiAhbWF0Y2hlcykge1xuXG4gICAgICAgICAgICAgICAgdmFyIHJlZ2V4ID0gYXJyYXlzW2ldLCAgICAgICAvLyBldmVuIHNlcXVlbmNlICgwLDIsNCwuLilcbiAgICAgICAgICAgICAgICAgICAgcHJvcHMgPSBhcnJheXNbaSArIDFdOyAgIC8vIG9kZCBzZXF1ZW5jZSAoMSwzLDUsLi4pXG4gICAgICAgICAgICAgICAgaiA9IGsgPSAwO1xuXG4gICAgICAgICAgICAgICAgLy8gdHJ5IG1hdGNoaW5nIHVhc3RyaW5nIHdpdGggcmVnZXhlc1xuICAgICAgICAgICAgICAgIHdoaWxlIChqIDwgcmVnZXgubGVuZ3RoICYmICFtYXRjaGVzKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFyZWdleFtqXSkgeyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBtYXRjaGVzID0gcmVnZXhbaisrXS5leGVjKHVhKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoISFtYXRjaGVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHAgPSAwOyBwIDwgcHJvcHMubGVuZ3RoOyBwKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXRjaCA9IG1hdGNoZXNbKytrXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBxID0gcHJvcHNbcF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2hlY2sgaWYgZ2l2ZW4gcHJvcGVydHkgaXMgYWN0dWFsbHkgYXJyYXlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHEgPT09IE9CSl9UWVBFICYmIHEubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocS5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcVsxXSA9PSBGVU5DX1RZUEUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhc3NpZ24gbW9kaWZpZWQgbWF0Y2hcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzW3FbMF1dID0gcVsxXS5jYWxsKHRoaXMsIG1hdGNoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYXNzaWduIGdpdmVuIHZhbHVlLCBpZ25vcmUgcmVnZXggbWF0Y2hcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzW3FbMF1dID0gcVsxXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChxLmxlbmd0aCA9PT0gMykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2hlY2sgd2hldGhlciBmdW5jdGlvbiBvciByZWdleFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBxWzFdID09PSBGVU5DX1RZUEUgJiYgIShxWzFdLmV4ZWMgJiYgcVsxXS50ZXN0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNhbGwgZnVuY3Rpb24gKHVzdWFsbHkgc3RyaW5nIG1hcHBlcilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzW3FbMF1dID0gbWF0Y2ggPyBxWzFdLmNhbGwodGhpcywgbWF0Y2gsIHFbMl0pIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBzYW5pdGl6ZSBtYXRjaCB1c2luZyBnaXZlbiByZWdleFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNbcVswXV0gPSBtYXRjaCA/IG1hdGNoLnJlcGxhY2UocVsxXSwgcVsyXSkgOiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocS5sZW5ndGggPT09IDQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzW3FbMF1dID0gbWF0Y2ggPyBxWzNdLmNhbGwodGhpcywgbWF0Y2gucmVwbGFjZShxWzFdLCBxWzJdKSkgOiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzW3FdID0gbWF0Y2ggPyBtYXRjaCA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaSArPSAyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHN0ck1hcHBlciA9IGZ1bmN0aW9uIChzdHIsIG1hcCkge1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpIGluIG1hcCkge1xuICAgICAgICAgICAgICAgIC8vIGNoZWNrIGlmIGN1cnJlbnQgdmFsdWUgaXMgYXJyYXlcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG1hcFtpXSA9PT0gT0JKX1RZUEUgJiYgbWFwW2ldLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBtYXBbaV0ubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChoYXMobWFwW2ldW2pdLCBzdHIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChpID09PSBVTktOT1dOKSA/IHVuZGVmaW5lZCA6IGk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGhhcyhtYXBbaV0sIHN0cikpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChpID09PSBVTktOT1dOKSA/IHVuZGVmaW5lZCA6IGk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHN0cjtcbiAgICB9O1xuXG4gICAgLy8vLy8vLy8vLy8vLy8vXG4gICAgLy8gU3RyaW5nIG1hcFxuICAgIC8vLy8vLy8vLy8vLy8vXG5cbiAgICAvLyBTYWZhcmkgPCAzLjBcbiAgICB2YXIgb2xkU2FmYXJpTWFwID0ge1xuICAgICAgICAgICAgJzEuMCcgICA6ICcvOCcsXG4gICAgICAgICAgICAnMS4yJyAgIDogJy8xJyxcbiAgICAgICAgICAgICcxLjMnICAgOiAnLzMnLFxuICAgICAgICAgICAgJzIuMCcgICA6ICcvNDEyJyxcbiAgICAgICAgICAgICcyLjAuMicgOiAnLzQxNicsXG4gICAgICAgICAgICAnMi4wLjMnIDogJy80MTcnLFxuICAgICAgICAgICAgJzIuMC40JyA6ICcvNDE5JyxcbiAgICAgICAgICAgICc/JyAgICAgOiAnLydcbiAgICAgICAgfSxcbiAgICAgICAgd2luZG93c1ZlcnNpb25NYXAgPSB7XG4gICAgICAgICAgICAnTUUnICAgICAgICA6ICc0LjkwJyxcbiAgICAgICAgICAgICdOVCAzLjExJyAgIDogJ05UMy41MScsXG4gICAgICAgICAgICAnTlQgNC4wJyAgICA6ICdOVDQuMCcsXG4gICAgICAgICAgICAnMjAwMCcgICAgICA6ICdOVCA1LjAnLFxuICAgICAgICAgICAgJ1hQJyAgICAgICAgOiBbJ05UIDUuMScsICdOVCA1LjInXSxcbiAgICAgICAgICAgICdWaXN0YScgICAgIDogJ05UIDYuMCcsXG4gICAgICAgICAgICAnNycgICAgICAgICA6ICdOVCA2LjEnLFxuICAgICAgICAgICAgJzgnICAgICAgICAgOiAnTlQgNi4yJyxcbiAgICAgICAgICAgICc4LjEnICAgICAgIDogJ05UIDYuMycsXG4gICAgICAgICAgICAnMTAnICAgICAgICA6IFsnTlQgNi40JywgJ05UIDEwLjAnXSxcbiAgICAgICAgICAgICdSVCcgICAgICAgIDogJ0FSTSdcbiAgICB9O1xuXG4gICAgLy8vLy8vLy8vLy8vLy9cbiAgICAvLyBSZWdleCBtYXBcbiAgICAvLy8vLy8vLy8vLy8vXG5cbiAgICB2YXIgcmVnZXhlcyA9IHtcblxuICAgICAgICBicm93c2VyIDogW1tcblxuICAgICAgICAgICAgL1xcYig/OmNybW98Y3Jpb3MpXFwvKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ2hyb21lIGZvciBBbmRyb2lkL2lPU1xuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCAnQ2hyb21lJ11dLCBbXG4gICAgICAgICAgICAvZWRnKD86ZXxpb3N8YSk/XFwvKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1pY3Jvc29mdCBFZGdlXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsICdFZGdlJ11dLCBbXG5cbiAgICAgICAgICAgIC8vIFByZXN0byBiYXNlZFxuICAgICAgICAgICAgLyhvcGVyYSBtaW5pKVxcLyhbLVxcd1xcLl0rKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBPcGVyYSBNaW5pXG4gICAgICAgICAgICAvKG9wZXJhIFttb2JpbGV0YWJdezMsNn0pXFxiLit2ZXJzaW9uXFwvKFstXFx3XFwuXSspL2ksICAgICAgICAgICAgICAgICAvLyBPcGVyYSBNb2JpL1RhYmxldFxuICAgICAgICAgICAgLyhvcGVyYSkoPzouK3ZlcnNpb25cXC98W1xcLyBdKykoW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gT3BlcmFcbiAgICAgICAgICAgIF0sIFtOQU1FLCBWRVJTSU9OXSwgW1xuICAgICAgICAgICAgL29waW9zW1xcLyBdKyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBPcGVyYSBtaW5pIG9uIGlwaG9uZSA+PSA4LjBcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgT1BFUkErJyBNaW5pJ11dLCBbXG4gICAgICAgICAgICAvXFxib3AoPzpyZyk/eFxcLyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBPcGVyYSBHWFxuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCBPUEVSQSsnIEdYJ11dLCBbXG4gICAgICAgICAgICAvXFxib3ByXFwvKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBPcGVyYSBXZWJraXRcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgT1BFUkFdXSwgW1xuXG4gICAgICAgICAgICAvLyBNaXhlZFxuICAgICAgICAgICAgL1xcYmJbYWldKmQoPzp1aGR8W3ViXSpbYWVrb3Byc3d4XXs1LDZ9KVtcXC8gXT8oW1xcd1xcLl0rKS9pICAgICAgICAgICAgLy8gQmFpZHVcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgJ0JhaWR1J11dLCBbXG4gICAgICAgICAgICAvKGtpbmRsZSlcXC8oW1xcd1xcLl0rKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEtpbmRsZVxuICAgICAgICAgICAgLyhsdW5hc2NhcGV8bWF4dGhvbnxuZXRmcm9udHxqYXNtaW5lfGJsYXplcilbXFwvIF0/KFtcXHdcXC5dKikvaSwgICAgICAvLyBMdW5hc2NhcGUvTWF4dGhvbi9OZXRmcm9udC9KYXNtaW5lL0JsYXplclxuICAgICAgICAgICAgLy8gVHJpZGVudCBiYXNlZFxuICAgICAgICAgICAgLyhhdmFudHxpZW1vYmlsZXxzbGltKVxccz8oPzpicm93c2VyKT9bXFwvIF0/KFtcXHdcXC5dKikvaSwgICAgICAgICAgICAgLy8gQXZhbnQvSUVNb2JpbGUvU2xpbUJyb3dzZXJcbiAgICAgICAgICAgIC8oPzptc3xcXCgpKGllKSAoW1xcd1xcLl0rKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSW50ZXJuZXQgRXhwbG9yZXJcblxuICAgICAgICAgICAgLy8gV2Via2l0L0tIVE1MIGJhc2VkICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBGbG9jay9Sb2NrTWVsdC9NaWRvcmkvRXBpcGhhbnkvU2lsay9Ta3lmaXJlL0JvbHQvSXJvbi9JcmlkaXVtL1BoYW50b21KUy9Cb3dzZXIvUXVwWmlsbGEvRmFsa29uXG4gICAgICAgICAgICAvKGZsb2NrfHJvY2ttZWx0fG1pZG9yaXxlcGlwaGFueXxzaWxrfHNreWZpcmV8Ym9sdHxpcm9ufHZpdmFsZGl8aXJpZGl1bXxwaGFudG9tanN8Ym93c2VyfHF1YXJrfHF1cHppbGxhfGZhbGtvbnxyZWtvbnF8cHVmZmlufGJyYXZlfHdoYWxlKD8hLituYXZlcil8cXFicm93c2VybGl0ZXxxcXxkdWNrZHVja2dvKVxcLyhbLVxcd1xcLl0rKS9pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBSZWtvbnEvUHVmZmluL0JyYXZlL1doYWxlL1FRQnJvd3NlckxpdGUvUVEsIGFrYSBTaG91UVxuICAgICAgICAgICAgLyhoZXl0YXB8b3ZpKWJyb3dzZXJcXC8oW1xcZFxcLl0rKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBIZXl0YXAvT3ZpXG4gICAgICAgICAgICAvKHdlaWJvKV9fKFtcXGRcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gV2VpYm9cbiAgICAgICAgICAgIF0sIFtOQU1FLCBWRVJTSU9OXSwgW1xuICAgICAgICAgICAgL1xcYmRkZ1xcLyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRHVja0R1Y2tHb1xuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCAnRHVja0R1Y2tHbyddXSwgW1xuICAgICAgICAgICAgLyg/OlxcYnVjPyA/YnJvd3NlcnwoPzpqdWMuKyl1Y3dlYilbXFwvIF0/KFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgLy8gVUNCcm93c2VyXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsICdVQycrQlJPV1NFUl1dLCBbXG4gICAgICAgICAgICAvbWljcm9tLitcXGJxYmNvcmVcXC8oW1xcd1xcLl0rKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBXZUNoYXQgRGVza3RvcCBmb3IgV2luZG93cyBCdWlsdC1pbiBCcm93c2VyXG4gICAgICAgICAgICAvXFxicWJjb3JlXFwvKFtcXHdcXC5dKykuK21pY3JvbS9pLFxuICAgICAgICAgICAgL21pY3JvbWVzc2VuZ2VyXFwvKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBXZUNoYXRcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgJ1dlQ2hhdCddXSwgW1xuICAgICAgICAgICAgL2tvbnF1ZXJvclxcLyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBLb25xdWVyb3JcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgJ0tvbnF1ZXJvciddXSwgW1xuICAgICAgICAgICAgL3RyaWRlbnQuK3J2WzogXShbXFx3XFwuXXsxLDl9KVxcYi4rbGlrZSBnZWNrby9pICAgICAgICAgICAgICAgICAgICAgICAvLyBJRTExXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsICdJRSddXSwgW1xuICAgICAgICAgICAgL3lhKD86c2VhcmNoKT9icm93c2VyXFwvKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBZYW5kZXhcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgJ1lhbmRleCddXSwgW1xuICAgICAgICAgICAgL3NsYnJvd3NlclxcLyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTbWFydCBMZW5vdm8gQnJvd3NlclxuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCAnU21hcnQgTGVub3ZvICcrQlJPV1NFUl1dLCBbXG4gICAgICAgICAgICAvKGF2YXN0fGF2ZylcXC8oW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEF2YXN0L0FWRyBTZWN1cmUgQnJvd3NlclxuICAgICAgICAgICAgXSwgW1tOQU1FLCAvKC4rKS8sICckMSBTZWN1cmUgJytCUk9XU0VSXSwgVkVSU0lPTl0sIFtcbiAgICAgICAgICAgIC9cXGJmb2N1c1xcLyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZpcmVmb3ggRm9jdXNcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgRklSRUZPWCsnIEZvY3VzJ11dLCBbXG4gICAgICAgICAgICAvXFxib3B0XFwvKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBPcGVyYSBUb3VjaFxuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCBPUEVSQSsnIFRvdWNoJ11dLCBbXG4gICAgICAgICAgICAvY29jX2NvY1xcdytcXC8oW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDb2MgQ29jIEJyb3dzZXJcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgJ0NvYyBDb2MnXV0sIFtcbiAgICAgICAgICAgIC9kb2xmaW5cXC8oW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRG9scGhpblxuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCAnRG9scGhpbiddXSwgW1xuICAgICAgICAgICAgL2NvYXN0XFwvKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBPcGVyYSBDb2FzdFxuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCBPUEVSQSsnIENvYXN0J11dLCBbXG4gICAgICAgICAgICAvbWl1aWJyb3dzZXJcXC8oW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1JVUkgQnJvd3NlclxuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCAnTUlVSSAnK0JST1dTRVJdXSwgW1xuICAgICAgICAgICAgL2Z4aW9zXFwvKFstXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBGaXJlZm94IGZvciBpT1NcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgRklSRUZPWF1dLCBbXG4gICAgICAgICAgICAvXFxicWlodXwocWk/aG8/bz98MzYwKWJyb3dzZXIvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAzNjBcbiAgICAgICAgICAgIF0sIFtbTkFNRSwgJzM2MCAnICsgQlJPV1NFUl1dLCBbXG4gICAgICAgICAgICAvKG9jdWx1c3xzYWlsZmlzaHxodWF3ZWl8dml2bylicm93c2VyXFwvKFtcXHdcXC5dKykvaVxuICAgICAgICAgICAgXSwgW1tOQU1FLCAvKC4rKS8sICckMSAnICsgQlJPV1NFUl0sIFZFUlNJT05dLCBbICAgICAgICAgICAgICAgICAgICAvLyBPY3VsdXMvU2FpbGZpc2gvSHVhd2VpQnJvd3Nlci9WaXZvQnJvd3NlclxuICAgICAgICAgICAgL3NhbXN1bmdicm93c2VyXFwvKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTYW1zdW5nIEludGVybmV0XG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsIFNBTVNVTkcgKyAnIEludGVybmV0J11dLCBbXG4gICAgICAgICAgICAvKGNvbW9kb19kcmFnb24pXFwvKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIENvbW9kbyBEcmFnb25cbiAgICAgICAgICAgIF0sIFtbTkFNRSwgL18vZywgJyAnXSwgVkVSU0lPTl0sIFtcbiAgICAgICAgICAgIC9tZXRhc3JbXFwvIF0/KFtcXGRcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU29nb3UgRXhwbG9yZXJcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgJ1NvZ291IEV4cGxvcmVyJ11dLCBbXG4gICAgICAgICAgICAvKHNvZ291KW1vXFx3K1xcLyhbXFxkXFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTb2dvdSBNb2JpbGVcbiAgICAgICAgICAgIF0sIFtbTkFNRSwgJ1NvZ291IE1vYmlsZSddLCBWRVJTSU9OXSwgW1xuICAgICAgICAgICAgLyhlbGVjdHJvbilcXC8oW1xcd1xcLl0rKSBzYWZhcmkvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBFbGVjdHJvbi1iYXNlZCBBcHBcbiAgICAgICAgICAgIC8odGVzbGEpKD86IHF0Y2FyYnJvd3NlcnxcXC8oMjBcXGRcXGRcXC5bLVxcd1xcLl0rKSkvaSwgICAgICAgICAgICAgICAgICAgLy8gVGVzbGFcbiAgICAgICAgICAgIC9tPyhxcWJyb3dzZXJ8MjM0NUV4cGxvcmVyKVtcXC8gXT8oW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgLy8gUVFCcm93c2VyLzIzNDUgQnJvd3NlclxuICAgICAgICAgICAgXSwgW05BTUUsIFZFUlNJT05dLCBbXG4gICAgICAgICAgICAvKGxiYnJvd3NlcikvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIExpZUJhbyBCcm93c2VyXG4gICAgICAgICAgICAvXFxbKGxpbmtlZGluKWFwcFxcXS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTGlua2VkSW4gQXBwIGZvciBpT1MgJiBBbmRyb2lkXG4gICAgICAgICAgICBdLCBbTkFNRV0sIFtcblxuICAgICAgICAgICAgLy8gV2ViVmlld1xuICAgICAgICAgICAgLygoPzpmYmFuXFwvZmJpb3N8ZmJfaWFiXFwvZmI0YSkoPyEuK2ZiYXYpfDtmYmF2XFwvKFtcXHdcXC5dKyk7KS9pICAgICAgIC8vIEZhY2Vib29rIEFwcCBmb3IgaU9TICYgQW5kcm9pZFxuICAgICAgICAgICAgXSwgW1tOQU1FLCBGQUNFQk9PS10sIFZFUlNJT05dLCBbXG4gICAgICAgICAgICAvKEtsYXJuYSlcXC8oW1xcd1xcLl0rKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEtsYXJuYSBTaG9wcGluZyBCcm93c2VyIGZvciBpT1MgJiBBbmRyb2lkXG4gICAgICAgICAgICAvKGtha2FvKD86dGFsa3xzdG9yeSkpW1xcLyBdKFtcXHdcXC5dKykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEtha2FvIEFwcFxuICAgICAgICAgICAgLyhuYXZlcilcXCguKj8oXFxkK1xcLltcXHdcXC5dKykuKlxcKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBOYXZlciBJbkFwcFxuICAgICAgICAgICAgL3NhZmFyaSAobGluZSlcXC8oW1xcd1xcLl0rKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBMaW5lIEFwcCBmb3IgaU9TXG4gICAgICAgICAgICAvXFxiKGxpbmUpXFwvKFtcXHdcXC5dKylcXC9pYWIvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTGluZSBBcHAgZm9yIEFuZHJvaWRcbiAgICAgICAgICAgIC8oYWxpcGF5KWNsaWVudFxcLyhbXFx3XFwuXSspL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQWxpcGF5XG4gICAgICAgICAgICAvKHR3aXR0ZXIpKD86YW5kfCBmLitlXFwvKFtcXHdcXC5dKykpL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFR3aXR0ZXJcbiAgICAgICAgICAgIC8oY2hyb21pdW18aW5zdGFncmFtfHNuYXBjaGF0KVtcXC8gXShbLVxcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgLy8gQ2hyb21pdW0vSW5zdGFncmFtL1NuYXBjaGF0XG4gICAgICAgICAgICBdLCBbTkFNRSwgVkVSU0lPTl0sIFtcbiAgICAgICAgICAgIC9cXGJnc2FcXC8oW1xcd1xcLl0rKSAuKnNhZmFyaVxcLy9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBHb29nbGUgU2VhcmNoIEFwcGxpYW5jZSBvbiBpT1NcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgJ0dTQSddXSwgW1xuICAgICAgICAgICAgL211c2ljYWxfbHkoPzouK2FwcF8/dmVyc2lvblxcL3xfKShbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAvLyBUaWtUb2tcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgJ1Rpa1RvayddXSwgW1xuXG4gICAgICAgICAgICAvaGVhZGxlc3NjaHJvbWUoPzpcXC8oW1xcd1xcLl0rKXwgKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIENocm9tZSBIZWFkbGVzc1xuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCBDSFJPTUUrJyBIZWFkbGVzcyddXSwgW1xuXG4gICAgICAgICAgICAvIHd2XFwpLisoY2hyb21lKVxcLyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDaHJvbWUgV2ViVmlld1xuICAgICAgICAgICAgXSwgW1tOQU1FLCBDSFJPTUUrJyBXZWJWaWV3J10sIFZFUlNJT05dLCBbXG5cbiAgICAgICAgICAgIC9kcm9pZC4rIHZlcnNpb25cXC8oW1xcd1xcLl0rKVxcYi4rKD86bW9iaWxlIHNhZmFyaXxzYWZhcmkpL2kgICAgICAgICAgIC8vIEFuZHJvaWQgQnJvd3NlclxuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCAnQW5kcm9pZCAnK0JST1dTRVJdXSwgW1xuXG4gICAgICAgICAgICAvKGNocm9tZXxvbW5pd2VifGFyb3JhfFt0aXplbm9rYV17NX0gP2Jyb3dzZXIpXFwvdj8oW1xcd1xcLl0rKS9pICAgICAgIC8vIENocm9tZS9PbW5pV2ViL0Fyb3JhL1RpemVuL05va2lhXG4gICAgICAgICAgICBdLCBbTkFNRSwgVkVSU0lPTl0sIFtcblxuICAgICAgICAgICAgL3ZlcnNpb25cXC8oW1xcd1xcLlxcLF0rKSAuKm1vYmlsZVxcL1xcdysgKHNhZmFyaSkvaSAgICAgICAgICAgICAgICAgICAgICAvLyBNb2JpbGUgU2FmYXJpXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsICdNb2JpbGUgU2FmYXJpJ11dLCBbXG4gICAgICAgICAgICAvdmVyc2lvblxcLyhbXFx3KFxcLnxcXCwpXSspIC4qKG1vYmlsZSA/c2FmYXJpfHNhZmFyaSkvaSAgICAgICAgICAgICAgICAvLyBTYWZhcmkgJiBTYWZhcmkgTW9iaWxlXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgTkFNRV0sIFtcbiAgICAgICAgICAgIC93ZWJraXQuKz8obW9iaWxlID9zYWZhcml8c2FmYXJpKShcXC9bXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgLy8gU2FmYXJpIDwgMy4wXG4gICAgICAgICAgICBdLCBbTkFNRSwgW1ZFUlNJT04sIHN0ck1hcHBlciwgb2xkU2FmYXJpTWFwXV0sIFtcblxuICAgICAgICAgICAgLyh3ZWJraXR8a2h0bWwpXFwvKFtcXHdcXC5dKykvaVxuICAgICAgICAgICAgXSwgW05BTUUsIFZFUlNJT05dLCBbXG5cbiAgICAgICAgICAgIC8vIEdlY2tvIGJhc2VkXG4gICAgICAgICAgICAvKG5hdmlnYXRvcnxuZXRzY2FwZVxcZD8pXFwvKFstXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBOZXRzY2FwZVxuICAgICAgICAgICAgXSwgW1tOQU1FLCAnTmV0c2NhcGUnXSwgVkVSU0lPTl0sIFtcbiAgICAgICAgICAgIC9tb2JpbGUgdnI7IHJ2OihbXFx3XFwuXSspXFwpLitmaXJlZm94L2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRmlyZWZveCBSZWFsaXR5XG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsIEZJUkVGT1grJyBSZWFsaXR5J11dLCBbXG4gICAgICAgICAgICAvZWtpb2hmLisoZmxvdylcXC8oW1xcd1xcLl0rKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZsb3dcbiAgICAgICAgICAgIC8oc3dpZnRmb3gpL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU3dpZnRmb3hcbiAgICAgICAgICAgIC8oaWNlZHJhZ29ufGljZXdlYXNlbHxjYW1pbm98Y2hpbWVyYXxmZW5uZWN8bWFlbW8gYnJvd3NlcnxtaW5pbW98Y29ua2Vyb3J8a2xhcilbXFwvIF0/KFtcXHdcXC5cXCtdKykvaSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSWNlRHJhZ29uL0ljZXdlYXNlbC9DYW1pbm8vQ2hpbWVyYS9GZW5uZWMvTWFlbW8vTWluaW1vL0Nvbmtlcm9yL0tsYXJcbiAgICAgICAgICAgIC8oc2VhbW9ua2V5fGstbWVsZW9ufGljZWNhdHxpY2VhcGV8ZmlyZWJpcmR8cGhvZW5peHxwYWxlbW9vbnxiYXNpbGlza3x3YXRlcmZveClcXC8oWy1cXHdcXC5dKykkL2ksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZpcmVmb3gvU2VhTW9ua2V5L0stTWVsZW9uL0ljZUNhdC9JY2VBcGUvRmlyZWJpcmQvUGhvZW5peFxuICAgICAgICAgICAgLyhmaXJlZm94KVxcLyhbXFx3XFwuXSspL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBPdGhlciBGaXJlZm94LWJhc2VkXG4gICAgICAgICAgICAvKG1vemlsbGEpXFwvKFtcXHdcXC5dKykgLitydlxcOi4rZ2Vja29cXC9cXGQrL2ksICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1vemlsbGFcblxuICAgICAgICAgICAgLy8gT3RoZXJcbiAgICAgICAgICAgIC8ocG9sYXJpc3xseW54fGRpbGxvfGljYWJ8ZG9yaXN8YW1heWF8dzNtfG5ldHN1cmZ8c2xlaXBuaXJ8b2JpZ298bW9zYWljfCg/OmdvfGljZXx1cClbXFwuIF0/YnJvd3NlcilbLVxcLyBdP3Y/KFtcXHdcXC5dKykvaSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUG9sYXJpcy9MeW54L0RpbGxvL2lDYWIvRG9yaXMvQW1heWEvdzNtL05ldFN1cmYvU2xlaXBuaXIvT2JpZ28vTW9zYWljL0dvL0lDRS9VUC5Ccm93c2VyXG4gICAgICAgICAgICAvKGxpbmtzKSBcXCgoW1xcd1xcLl0rKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIExpbmtzXG4gICAgICAgICAgICAvcGFuYXNvbmljOyh2aWVyYSkvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFBhbmFzb25pYyBWaWVyYVxuICAgICAgICAgICAgXSwgW05BTUUsIFZFUlNJT05dLCBbXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8oY29iYWx0KVxcLyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ29iYWx0XG4gICAgICAgICAgICBdLCBbTkFNRSwgW1ZFUlNJT04sIC9tYXN0ZXIufGx0cy4vLCBcIlwiXV1cbiAgICAgICAgXSxcblxuICAgICAgICBjcHUgOiBbW1xuXG4gICAgICAgICAgICAvKD86KGFtZHx4KD86KD86ODZ8NjQpWy1fXSk/fHdvd3x3aW4pNjQpWztcXCldL2kgICAgICAgICAgICAgICAgICAgICAvLyBBTUQ2NCAoeDY0KVxuICAgICAgICAgICAgXSwgW1tBUkNISVRFQ1RVUkUsICdhbWQ2NCddXSwgW1xuXG4gICAgICAgICAgICAvKGlhMzIoPz07KSkvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIElBMzIgKHF1aWNrdGltZSlcbiAgICAgICAgICAgIF0sIFtbQVJDSElURUNUVVJFLCBsb3dlcml6ZV1dLCBbXG5cbiAgICAgICAgICAgIC8oKD86aVszNDZdfHgpODYpWztcXCldL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIElBMzIgKHg4NilcbiAgICAgICAgICAgIF0sIFtbQVJDSElURUNUVVJFLCAnaWEzMiddXSwgW1xuXG4gICAgICAgICAgICAvXFxiKGFhcmNoNjR8YXJtKHY/OGU/bD98Xz82NCkpXFxiL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBUk02NFxuICAgICAgICAgICAgXSwgW1tBUkNISVRFQ1RVUkUsICdhcm02NCddXSwgW1xuXG4gICAgICAgICAgICAvXFxiKGFybSg/OnZbNjddKT9odD9uP1tmbF1wPylcXGIvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQVJNSEZcbiAgICAgICAgICAgIF0sIFtbQVJDSElURUNUVVJFLCAnYXJtaGYnXV0sIFtcblxuICAgICAgICAgICAgLy8gUG9ja2V0UEMgbWlzdGFrZW5seSBpZGVudGlmaWVkIGFzIFBvd2VyUENcbiAgICAgICAgICAgIC93aW5kb3dzIChjZXxtb2JpbGUpOyBwcGM7L2lcbiAgICAgICAgICAgIF0sIFtbQVJDSElURUNUVVJFLCAnYXJtJ11dLCBbXG5cbiAgICAgICAgICAgIC8oKD86cHBjfHBvd2VycGMpKD86NjQpPykoPzogbWFjfDt8XFwpKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFBvd2VyUENcbiAgICAgICAgICAgIF0sIFtbQVJDSElURUNUVVJFLCAvb3dlci8sIEVNUFRZLCBsb3dlcml6ZV1dLCBbXG5cbiAgICAgICAgICAgIC8oc3VuNFxcdylbO1xcKV0vaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTUEFSQ1xuICAgICAgICAgICAgXSwgW1tBUkNISVRFQ1RVUkUsICdzcGFyYyddXSwgW1xuXG4gICAgICAgICAgICAvKCg/OmF2cjMyfGlhNjQoPz07KSl8NjhrKD89XFwpKXxcXGJhcm0oPz12KD86WzEtN118WzUtN10xKWw/fDt8ZWFiaSl8KD89YXRtZWwgKWF2cnwoPzppcml4fG1pcHN8c3BhcmMpKD86NjQpP1xcYnxwYS1yaXNjKS9pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIElBNjQsIDY4SywgQVJNLzY0LCBBVlIvMzIsIElSSVgvNjQsIE1JUFMvNjQsIFNQQVJDLzY0LCBQQS1SSVNDXG4gICAgICAgICAgICBdLCBbW0FSQ0hJVEVDVFVSRSwgbG93ZXJpemVdXVxuICAgICAgICBdLFxuXG4gICAgICAgIGRldmljZSA6IFtbXG5cbiAgICAgICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgICAgICAgICAvLyBNT0JJTEVTICYgVEFCTEVUU1xuICAgICAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICAgICAgICAvLyBTYW1zdW5nXG4gICAgICAgICAgICAvXFxiKHNjaC1pWzg5XTBcXGR8c2h3LW0zODBzfHNtLVtwdHhdXFx3ezIsNH18Z3QtW3BuXVxcZHsyLDR9fHNnaC10OFs1Nl05fG5leHVzIDEwKS9pXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIFNBTVNVTkddLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC9cXGIoKD86c1tjZ3BdaHxndHxzbSktXFx3K3xzY1tnLV0/W1xcZF0rYT98Z2FsYXh5IG5leHVzKS9pLFxuICAgICAgICAgICAgL3NhbXN1bmdbLSBdKFstXFx3XSspL2ksXG4gICAgICAgICAgICAvc2VjLShzZ2hcXHcrKS9pXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIFNBTVNVTkddLCBbVFlQRSwgTU9CSUxFXV0sIFtcblxuICAgICAgICAgICAgLy8gQXBwbGVcbiAgICAgICAgICAgIC8oPzpcXC98XFwoKShpcCg/OmhvbmV8b2QpW1xcdywgXSopKD86XFwvfDspL2kgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlQb2QvaVBob25lXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIEFQUExFXSwgW1RZUEUsIE1PQklMRV1dLCBbXG4gICAgICAgICAgICAvXFwoKGlwYWQpO1stXFx3XFwpLDsgXSthcHBsZS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlQYWRcbiAgICAgICAgICAgIC9hcHBsZWNvcmVtZWRpYVxcL1tcXHdcXC5dKyBcXCgoaXBhZCkvaSxcbiAgICAgICAgICAgIC9cXGIoaXBhZClcXGRcXGQ/LFxcZFxcZD9bO1xcXV0uK2lvcy9pXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIEFQUExFXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvKG1hY2ludG9zaCk7L2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgQVBQTEVdXSwgW1xuXG4gICAgICAgICAgICAvLyBTaGFycFxuICAgICAgICAgICAgL1xcYihzaC0/W2FsdHZ6XT9cXGRcXGRbYS1la21dPykvaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBTSEFSUF0sIFtUWVBFLCBNT0JJTEVdXSwgW1xuXG4gICAgICAgICAgICAvLyBIdWF3ZWlcbiAgICAgICAgICAgIC9cXGIoKD86YWdbcnNdWzIzXT98YmFoMj98c2h0P3xidHYpLWE/W2x3XVxcZHsyfSlcXGIoPyEuK2RcXC9zKS9pXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIEhVQVdFSV0sIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgLyg/Omh1YXdlaXxob25vcikoWy1cXHcgXSspWztcXCldL2ksXG4gICAgICAgICAgICAvXFxiKG5leHVzIDZwfFxcd3syLDR9ZT8tW2F0dV0/W2xuXVtcXGR4XVswMTIzNTljXVthZG5dPylcXGIoPyEuK2RcXC9zKS9pXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIEhVQVdFSV0sIFtUWVBFLCBNT0JJTEVdXSwgW1xuXG4gICAgICAgICAgICAvLyBYaWFvbWlcbiAgICAgICAgICAgIC9cXGIocG9jb1tcXHcgXSt8bTJcXGR7M31qXFxkXFxkW2Etel17Mn0pKD86IGJ1aXxcXCkpL2ksICAgICAgICAgICAgICAgICAgLy8gWGlhb21pIFBPQ09cbiAgICAgICAgICAgIC9cXGI7IChcXHcrKSBidWlsZFxcL2htXFwxL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFhpYW9taSBIb25nbWkgJ251bWVyaWMnIG1vZGVsc1xuICAgICAgICAgICAgL1xcYihobVstXyBdP25vdGU/W18gXT8oPzpcXGRcXHcpPykgYnVpL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBYaWFvbWkgSG9uZ21pXG4gICAgICAgICAgICAvXFxiKHJlZG1pW1xcLV8gXT8oPzpub3RlfGspP1tcXHdfIF0rKSg/OiBidWl8XFwpKS9pLCAgICAgICAgICAgICAgICAgICAvLyBYaWFvbWkgUmVkbWlcbiAgICAgICAgICAgIC9vaWRbXlxcKV0rOyAobT9bMTJdWzAtMzg5XVswMV1cXHd7Myw2fVtjLXldKSggYnVpfDsgd3Z8XFwpKS9pLCAgICAgICAgLy8gWGlhb21pIFJlZG1pICdudW1lcmljJyBtb2RlbHNcbiAgICAgICAgICAgIC9cXGIobWlbLV8gXT8oPzphXFxkfG9uZXxvbmVbXyBdcGx1c3xub3RlIGx0ZXxtYXh8Y2MpP1tfIF0/KD86XFxkP1xcdz8pW18gXT8oPzpwbHVzfHNlfGxpdGUpPykoPzogYnVpfFxcKSkvaSAvLyBYaWFvbWkgTWlcbiAgICAgICAgICAgIF0sIFtbTU9ERUwsIC9fL2csICcgJ10sIFtWRU5ET1IsIFhJQU9NSV0sIFtUWVBFLCBNT0JJTEVdXSwgW1xuICAgICAgICAgICAgL29pZFteXFwpXSs7ICgyXFxkezR9KDI4M3xycGJmKVtjZ2xdKSggYnVpfFxcKSkvaSwgICAgICAgICAgICAgICAgICAgICAvLyBSZWRtaSBQYWRcbiAgICAgICAgICAgIC9cXGIobWlbLV8gXT8oPzpwYWQpKD86W1xcd18gXSspKSg/OiBidWl8XFwpKS9pICAgICAgICAgICAgICAgICAgICAgICAgLy8gTWkgUGFkIHRhYmxldHNcbiAgICAgICAgICAgIF0sW1tNT0RFTCwgL18vZywgJyAnXSwgW1ZFTkRPUiwgWElBT01JXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG5cbiAgICAgICAgICAgIC8vIE9QUE9cbiAgICAgICAgICAgIC87IChcXHcrKSBidWkuKyBvcHBvL2ksXG4gICAgICAgICAgICAvXFxiKGNwaFsxMl1cXGR7M318cCg/OmFmfGNbYWxdfGRcXHd8ZVthcl0pW210XVxcZDB8eDkwMDd8YTEwMW9wKVxcYi9pXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdPUFBPJ10sIFtUWVBFLCBNT0JJTEVdXSwgW1xuICAgICAgICAgICAgL1xcYihvcGQyXFxkezN9YT8pIGJ1aS9pXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdPUFBPJ10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuXG4gICAgICAgICAgICAvLyBWaXZvXG4gICAgICAgICAgICAvdml2byAoXFx3KykoPzogYnVpfFxcKSkvaSxcbiAgICAgICAgICAgIC9cXGIodlsxMl1cXGR7M31cXHc/W2F0XSkoPzogYnVpfDspL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ1Zpdm8nXSwgW1RZUEUsIE1PQklMRV1dLCBbXG5cbiAgICAgICAgICAgIC8vIFJlYWxtZVxuICAgICAgICAgICAgL1xcYihybXhbMS0zXVxcZHszfSkoPzogYnVpfDt8XFwpKS9pXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdSZWFsbWUnXSwgW1RZUEUsIE1PQklMRV1dLCBbXG5cbiAgICAgICAgICAgIC8vIE1vdG9yb2xhXG4gICAgICAgICAgICAvXFxiKG1pbGVzdG9uZXxkcm9pZCg/OlsyLTR4XXwgKD86YmlvbmljfHgyfHByb3xyYXpyKSk/Oj8oIDRnKT8pXFxiW1xcdyBdK2J1aWxkXFwvL2ksXG4gICAgICAgICAgICAvXFxibW90KD86b3JvbGEpP1stIF0oXFx3KikvaSxcbiAgICAgICAgICAgIC8oKD86bW90b1tcXHdcXChcXCkgXSt8eHRcXGR7Myw0fXxuZXh1cyA2KSg/PSBidWl8XFwpKSkvaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBNT1RPUk9MQV0sIFtUWVBFLCBNT0JJTEVdXSwgW1xuICAgICAgICAgICAgL1xcYihtejYwXFxkfHhvb21bMiBdezAsMn0pIGJ1aWxkXFwvL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgTU9UT1JPTEFdLCBbVFlQRSwgVEFCTEVUXV0sIFtcblxuICAgICAgICAgICAgLy8gTEdcbiAgICAgICAgICAgIC8oKD89bGcpP1t2bF1rXFwtP1xcZHszfSkgYnVpfCAzXFwuWy1cXHc7IF17MTB9bGc/LShbMDZjdjldezMsNH0pL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgTEddLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC8obG0oPzotP2YxMDBbbnZdP3wtW1xcd1xcLl0rKSg/PSBidWl8XFwpKXxuZXh1cyBbNDVdKS9pLFxuICAgICAgICAgICAgL1xcYmxnWy1lO1xcLyBdKygoPyFicm93c2VyfG5ldGNhc3R8YW5kcm9pZCB0dilcXHcrKS9pLFxuICAgICAgICAgICAgL1xcYmxnLT8oW1xcZFxcd10rKSBidWkvaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBMR10sIFtUWVBFLCBNT0JJTEVdXSwgW1xuXG4gICAgICAgICAgICAvLyBMZW5vdm9cbiAgICAgICAgICAgIC8oaWRlYXRhYlstXFx3IF0rKS9pLFxuICAgICAgICAgICAgL2xlbm92byA/KHNbNTZdMDAwWy1cXHddK3x0YWIoPzpbXFx3IF0rKXx5dFstXFxkXFx3XXs2fXx0YlstXFxkXFx3XXs2fSkvaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnTGVub3ZvJ10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuXG4gICAgICAgICAgICAvLyBOb2tpYVxuICAgICAgICAgICAgLyg/Om1hZW1vfG5va2lhKS4qKG45MDB8bHVtaWEgXFxkKykvaSxcbiAgICAgICAgICAgIC9ub2tpYVstXyBdPyhbLVxcd1xcLl0qKS9pXG4gICAgICAgICAgICBdLCBbW01PREVMLCAvXy9nLCAnICddLCBbVkVORE9SLCAnTm9raWEnXSwgW1RZUEUsIE1PQklMRV1dLCBbXG5cbiAgICAgICAgICAgIC8vIEdvb2dsZVxuICAgICAgICAgICAgLyhwaXhlbCBjKVxcYi9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gR29vZ2xlIFBpeGVsIENcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgR09PR0xFXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvZHJvaWQuKzsgKHBpeGVsW1xcZGF4bCBdezAsNn0pKD86IGJ1aXxcXCkpL2kgICAgICAgICAgICAgICAgICAgICAgICAgLy8gR29vZ2xlIFBpeGVsXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIEdPT0dMRV0sIFtUWVBFLCBNT0JJTEVdXSwgW1xuXG4gICAgICAgICAgICAvLyBTb255XG4gICAgICAgICAgICAvZHJvaWQuKyAoYT9cXGRbMC0yXXsyfXNvfFtjLWddXFxkezR9fHNvWy1nbF1cXHcrfHhxLWFcXHdbNC03XVsxMl0pKD89IGJ1aXxcXCkuK2Nocm9tZVxcLyg/IVsxLTZdezAsMX1cXGRcXC4pKS9pXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIFNPTlldLCBbVFlQRSwgTU9CSUxFXV0sIFtcbiAgICAgICAgICAgIC9zb255IHRhYmxldCBbcHNdL2ksXG4gICAgICAgICAgICAvXFxiKD86c29ueSk/c2dwXFx3Kyg/OiBidWl8XFwpKS9pXG4gICAgICAgICAgICBdLCBbW01PREVMLCAnWHBlcmlhIFRhYmxldCddLCBbVkVORE9SLCBTT05ZXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG5cbiAgICAgICAgICAgIC8vIE9uZVBsdXNcbiAgICAgICAgICAgIC8gKGtiMjAwNXxpbjIwWzEyXTV8YmUyMFsxMl1bNTldKVxcYi9pLFxuICAgICAgICAgICAgLyg/Om9uZSk/KD86cGx1cyk/IChhXFxkMFxcZFxcZCkoPzogYnxcXCkpL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ09uZVBsdXMnXSwgW1RZUEUsIE1PQklMRV1dLCBbXG5cbiAgICAgICAgICAgIC8vIEFtYXpvblxuICAgICAgICAgICAgLyhhbGV4YSl3ZWJtL2ksXG4gICAgICAgICAgICAvKGtmW2Etel17Mn13aXxhZW9bYy1yXXsyfSkoIGJ1aXxcXCkpL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBLaW5kbGUgRmlyZSB3aXRob3V0IFNpbGsgLyBFY2hvIFNob3dcbiAgICAgICAgICAgIC8oa2ZbYS16XSspKCBidWl8XFwpKS4rc2lsa1xcLy9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBLaW5kbGUgRmlyZSBIRFxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBBTUFaT05dLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC8oKD86c2R8a2YpWzAzNDloaWpvcnN0dXddKykoIGJ1aXxcXCkpLitzaWxrXFwvL2kgICAgICAgICAgICAgICAgICAgICAvLyBGaXJlIFBob25lXG4gICAgICAgICAgICBdLCBbW01PREVMLCAvKC4rKS9nLCAnRmlyZSBQaG9uZSAkMSddLCBbVkVORE9SLCBBTUFaT05dLCBbVFlQRSwgTU9CSUxFXV0sIFtcblxuICAgICAgICAgICAgLy8gQmxhY2tCZXJyeVxuICAgICAgICAgICAgLyhwbGF5Ym9vayk7Wy1cXHdcXCksOyBdKyhyaW0pL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEJsYWNrQmVycnkgUGxheUJvb2tcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgVkVORE9SLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC9cXGIoKD86YmJbYS1mXXxzdFtodl0pMTAwLVxcZCkvaSxcbiAgICAgICAgICAgIC9cXChiYjEwOyAoXFx3KykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBCbGFja0JlcnJ5IDEwXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIEJMQUNLQkVSUlldLCBbVFlQRSwgTU9CSUxFXV0sIFtcblxuICAgICAgICAgICAgLy8gQXN1c1xuICAgICAgICAgICAgLyg/OlxcYnxhc3VzXykodHJhbnNmb1twcmltZSBdezQsMTB9IFxcdyt8ZWVlcGN8c2xpZGVyIFxcdyt8bmV4dXMgN3xwYWRmb25lfHAwMFtjal0pL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgQVNVU10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgLyAoeltiZXNdNlswMjddWzAxMl1ba21dW2xzXXx6ZW5mb25lIFxcZFxcdz8pXFxiL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgQVNVU10sIFtUWVBFLCBNT0JJTEVdXSwgW1xuXG4gICAgICAgICAgICAvLyBIVENcbiAgICAgICAgICAgIC8obmV4dXMgOSkvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSFRDIE5leHVzIDlcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ0hUQyddLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC8oaHRjKVstO18gXXsxLDJ9KFtcXHcgXSsoPz1cXCl8IGJ1aSl8XFx3KykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSFRDXG5cbiAgICAgICAgICAgIC8vIFpURVxuICAgICAgICAgICAgLyh6dGUpWy0gXShbXFx3IF0rPykoPzogYnVpfFxcL3xcXCkpL2ksXG4gICAgICAgICAgICAvKGFsY2F0ZWx8Z2Vla3NwaG9uZXxuZXhpYW58cGFuYXNvbmljKD8hKD86O3xcXC4pKXxzb255KD8hLWJyYSkpWy1fIF0/KFstXFx3XSopL2kgICAgICAgICAvLyBBbGNhdGVsL0dlZWtzUGhvbmUvTmV4aWFuL1BhbmFzb25pYy9Tb255XG4gICAgICAgICAgICBdLCBbVkVORE9SLCBbTU9ERUwsIC9fL2csICcgJ10sIFtUWVBFLCBNT0JJTEVdXSwgW1xuXG4gICAgICAgICAgICAvLyBBY2VyXG4gICAgICAgICAgICAvZHJvaWQuKzsgKFthYl1bMS03XS0/WzAxNzhhXVxcZFxcZD8pL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ0FjZXInXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG5cbiAgICAgICAgICAgIC8vIE1laXp1XG4gICAgICAgICAgICAvZHJvaWQuKzsgKG1bMS01XSBub3RlKSBidWkvaSxcbiAgICAgICAgICAgIC9cXGJtei0oWy1cXHddezIsfSkvaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnTWVpenUnXSwgW1RZUEUsIE1PQklMRV1dLCBbXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBVbGVmb25lXG4gICAgICAgICAgICAvOyAoKD86cG93ZXIgKT9hcm1vcig/OltcXHcgXXswLDh9KSkoPzogYnVpfFxcKSkvaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnVWxlZm9uZSddLCBbVFlQRSwgTU9CSUxFXV0sIFtcblxuICAgICAgICAgICAgLy8gTUlYRURcbiAgICAgICAgICAgIC8oYmxhY2tiZXJyeXxiZW5xfHBhbG0oPz1cXC0pfHNvbnllcmljc3NvbnxhY2VyfGFzdXN8ZGVsbHxtZWl6dXxtb3Rvcm9sYXxwb2x5dHJvbnxpbmZpbml4fHRlY25vKVstXyBdPyhbLVxcd10qKS9pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBCbGFja0JlcnJ5L0JlblEvUGFsbS9Tb255LUVyaWNzc29uL0FjZXIvQXN1cy9EZWxsL01laXp1L01vdG9yb2xhL1BvbHl0cm9uXG4gICAgICAgICAgICAvKGhwKSAoW1xcdyBdK1xcdykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSFAgaVBBUVxuICAgICAgICAgICAgLyhhc3VzKS0/KFxcdyspL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQXN1c1xuICAgICAgICAgICAgLyhtaWNyb3NvZnQpOyAobHVtaWFbXFx3IF0rKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTWljcm9zb2Z0IEx1bWlhXG4gICAgICAgICAgICAvKGxlbm92bylbLV8gXT8oWy1cXHddKykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBMZW5vdm9cbiAgICAgICAgICAgIC8oam9sbGEpL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSm9sbGFcbiAgICAgICAgICAgIC8ob3BwbykgPyhbXFx3IF0rKSBidWkvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE9QUE9cbiAgICAgICAgICAgIF0sIFtWRU5ET1IsIE1PREVMLCBbVFlQRSwgTU9CSUxFXV0sIFtcblxuICAgICAgICAgICAgLyhrb2JvKVxccyhlcmVhZGVyfHRvdWNoKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gS29ib1xuICAgICAgICAgICAgLyhhcmNob3MpIChnYW1lcGFkMj8pL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBcmNob3NcbiAgICAgICAgICAgIC8oaHApLisodG91Y2hwYWQoPyEuK3RhYmxldCl8dGFibGV0KS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSFAgVG91Y2hQYWRcbiAgICAgICAgICAgIC8oa2luZGxlKVxcLyhbXFx3XFwuXSspL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gS2luZGxlXG4gICAgICAgICAgICAvKG5vb2spW1xcdyBdK2J1aWxkXFwvKFxcdyspL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE5vb2tcbiAgICAgICAgICAgIC8oZGVsbCkgKHN0cmVhW2twclxcZCBdKltcXGRrb10pL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBEZWxsIFN0cmVha1xuICAgICAgICAgICAgLyhsZVstIF0rcGFuKVstIF0rKFxcd3sxLDl9KSBidWkvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTGUgUGFuIFRhYmxldHNcbiAgICAgICAgICAgIC8odHJpbml0eSlbLSBdKih0XFxkezN9KSBidWkvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRyaW5pdHkgVGFibGV0c1xuICAgICAgICAgICAgLyhnaWdhc2V0KVstIF0rKHFcXHd7MSw5fSkgYnVpL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gR2lnYXNldCBUYWJsZXRzXG4gICAgICAgICAgICAvKHZvZGFmb25lKSAoW1xcdyBdKykoPzpcXCl8IGJ1aSkvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVm9kYWZvbmVcbiAgICAgICAgICAgIF0sIFtWRU5ET1IsIE1PREVMLCBbVFlQRSwgVEFCTEVUXV0sIFtcblxuICAgICAgICAgICAgLyhzdXJmYWNlIGR1bykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTdXJmYWNlIER1b1xuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBNSUNST1NPRlRdLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC9kcm9pZCBbXFxkXFwuXSs7IChmcFxcZHU/KSg/OiBifFxcKSkvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZhaXJwaG9uZVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnRmFpcnBob25lJ10sIFtUWVBFLCBNT0JJTEVdXSwgW1xuICAgICAgICAgICAgLyh1MzA0YWEpL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBVCZUXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdBVCZUJ10sIFtUWVBFLCBNT0JJTEVdXSwgW1xuICAgICAgICAgICAgL1xcYnNpZS0oXFx3KikvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNpZW1lbnNcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ1NpZW1lbnMnXSwgW1RZUEUsIE1PQklMRV1dLCBbXG4gICAgICAgICAgICAvXFxiKHJjdFxcdyspIGIvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUkNBIFRhYmxldHNcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ1JDQSddLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC9cXGIodmVudWVbXFxkIF17Miw3fSkgYi9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBEZWxsIFZlbnVlIFRhYmxldHNcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ0RlbGwnXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvXFxiKHEoPzptdnx0YSlcXHcrKSBiL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVmVyaXpvbiBUYWJsZXRcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ1Zlcml6b24nXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvXFxiKD86YmFybmVzWyYgXStub2JsZSB8Ym5bcnRdKShbXFx3XFwrIF0qKSBiL2kgICAgICAgICAgICAgICAgICAgICAgIC8vIEJhcm5lcyAmIE5vYmxlIFRhYmxldFxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnQmFybmVzICYgTm9ibGUnXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvXFxiKHRtXFxkezN9XFx3KykgYi9pXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdOdVZpc2lvbiddLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC9cXGIoazg4KSBiL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFpURSBLIFNlcmllcyBUYWJsZXRcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ1pURSddLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC9cXGIobnhcXGR7M31qKSBiL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBaVEUgTnViaWFcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ1pURSddLCBbVFlQRSwgTU9CSUxFXV0sIFtcbiAgICAgICAgICAgIC9cXGIoZ2VuXFxkezN9KSBiLis0OWgvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTd2lzcyBHRU4gTW9iaWxlXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdTd2lzcyddLCBbVFlQRSwgTU9CSUxFXV0sIFtcbiAgICAgICAgICAgIC9cXGIoenVyXFxkezN9KSBiL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTd2lzcyBaVVIgVGFibGV0XG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdTd2lzcyddLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC9cXGIoKHpla2kpP3RiLipcXGIpIGIvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBaZWtpIFRhYmxldHNcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ1pla2knXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvXFxiKFt5cl1cXGR7Mn0pIGIvaSxcbiAgICAgICAgICAgIC9cXGIoZHJhZ29uWy0gXSt0b3VjaCB8ZHQpKFxcd3s1fSkgYi9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBEcmFnb24gVG91Y2ggVGFibGV0XG4gICAgICAgICAgICBdLCBbW1ZFTkRPUiwgJ0RyYWdvbiBUb3VjaCddLCBNT0RFTCwgW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvXFxiKG5zLT9cXHd7MCw5fSkgYi9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSW5zaWduaWEgVGFibGV0c1xuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnSW5zaWduaWEnXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvXFxiKChueGF8bmV4dCktP1xcd3swLDl9KSBiL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTmV4dEJvb2sgVGFibGV0c1xuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnTmV4dEJvb2snXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvXFxiKHh0cmVtZVxcXyk/KHYoMVswNDVdfDJbMDE1XXxbMzQ2OV0wfDdbMDVdKSkgYi9pICAgICAgICAgICAgICAgICAgLy8gVm9pY2UgWHRyZW1lIFBob25lc1xuICAgICAgICAgICAgXSwgW1tWRU5ET1IsICdWb2ljZSddLCBNT0RFTCwgW1RZUEUsIE1PQklMRV1dLCBbXG4gICAgICAgICAgICAvXFxiKGx2dGVsXFwtKT8odjFbMTJdKSBiL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTHZUZWwgUGhvbmVzXG4gICAgICAgICAgICBdLCBbW1ZFTkRPUiwgJ0x2VGVsJ10sIE1PREVMLCBbVFlQRSwgTU9CSUxFXV0sIFtcbiAgICAgICAgICAgIC9cXGIocGgtMSkgL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEVzc2VudGlhbCBQSC0xXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdFc3NlbnRpYWwnXSwgW1RZUEUsIE1PQklMRV1dLCBbXG4gICAgICAgICAgICAvXFxiKHYoMTAwbWR8NzAwbmF8NzAxMXw5MTdnKS4qXFxiKSBiL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRW52aXplbiBUYWJsZXRzXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdFbnZpemVuJ10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgL1xcYih0cmlvWy1cXHdcXC4gXSspIGIvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBNYWNoU3BlZWQgVGFibGV0c1xuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnTWFjaFNwZWVkJ10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgL1xcYnR1XygxNDkxKSBiL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUm90b3IgVGFibGV0c1xuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnUm90b3InXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvKHNoaWVsZFtcXHcgXSspIGIvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBOdmlkaWEgU2hpZWxkIFRhYmxldHNcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ052aWRpYSddLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC8oc3ByaW50KSAoXFx3KykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNwcmludCBQaG9uZXNcbiAgICAgICAgICAgIF0sIFtWRU5ET1IsIE1PREVMLCBbVFlQRSwgTU9CSUxFXV0sIFtcbiAgICAgICAgICAgIC8oa2luXFwuW29uZXR3XXszfSkvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1pY3Jvc29mdCBLaW5cbiAgICAgICAgICAgIF0sIFtbTU9ERUwsIC9cXC4vZywgJyAnXSwgW1ZFTkRPUiwgTUlDUk9TT0ZUXSwgW1RZUEUsIE1PQklMRV1dLCBbXG4gICAgICAgICAgICAvZHJvaWQuKzsgKGNjNjY2Nj98ZXQ1WzE2XXxtY1syMzldWzIzXXg/fHZjOFswM114PylcXCkvaSAgICAgICAgICAgICAvLyBaZWJyYVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBaRUJSQV0sIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgL2Ryb2lkLis7IChlYzMwfHBzMjB8dGNbMi04XVxcZFtreF0pXFwpL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgWkVCUkFdLCBbVFlQRSwgTU9CSUxFXV0sIFtcblxuICAgICAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgICAgICAgICAgLy8gU01BUlRUVlNcbiAgICAgICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgICAgICAgL3NtYXJ0LXR2Lisoc2Ftc3VuZykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTYW1zdW5nXG4gICAgICAgICAgICBdLCBbVkVORE9SLCBbVFlQRSwgU01BUlRUVl1dLCBbXG4gICAgICAgICAgICAvaGJidHYuK21hcGxlOyhcXGQrKS9pXG4gICAgICAgICAgICBdLCBbW01PREVMLCAvXi8sICdTbWFydFRWJ10sIFtWRU5ET1IsIFNBTVNVTkddLCBbVFlQRSwgU01BUlRUVl1dLCBbXG4gICAgICAgICAgICAvKG51eDsgbmV0Y2FzdC4rc21hcnR0dnxsZyAobmV0Y2FzdFxcLnR2LTIwMVxcZHxhbmRyb2lkIHR2KSkvaSAgICAgICAgLy8gTEcgU21hcnRUVlxuICAgICAgICAgICAgXSwgW1tWRU5ET1IsIExHXSwgW1RZUEUsIFNNQVJUVFZdXSwgW1xuICAgICAgICAgICAgLyhhcHBsZSkgP3R2L2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBcHBsZSBUVlxuICAgICAgICAgICAgXSwgW1ZFTkRPUiwgW01PREVMLCBBUFBMRSsnIFRWJ10sIFtUWVBFLCBTTUFSVFRWXV0sIFtcbiAgICAgICAgICAgIC9jcmtleS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gR29vZ2xlIENocm9tZWNhc3RcbiAgICAgICAgICAgIF0sIFtbTU9ERUwsIENIUk9NRSsnY2FzdCddLCBbVkVORE9SLCBHT09HTEVdLCBbVFlQRSwgU01BUlRUVl1dLCBbXG4gICAgICAgICAgICAvZHJvaWQuK2FmdChcXHcrKSggYnVpfFxcKSkvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRmlyZSBUVlxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBBTUFaT05dLCBbVFlQRSwgU01BUlRUVl1dLCBbXG4gICAgICAgICAgICAvXFwoZHR2W1xcKTtdLisoYXF1b3MpL2ksXG4gICAgICAgICAgICAvKGFxdW9zLXR2W1xcdyBdKylcXCkvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU2hhcnBcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgU0hBUlBdLCBbVFlQRSwgU01BUlRUVl1dLFtcbiAgICAgICAgICAgIC8oYnJhdmlhW1xcdyBdKykoIGJ1aXxcXCkpL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU29ueVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBTT05ZXSwgW1RZUEUsIFNNQVJUVFZdXSwgW1xuICAgICAgICAgICAgLyhtaXR2LVxcd3s1fSkgYnVpL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gWGlhb21pXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIFhJQU9NSV0sIFtUWVBFLCBTTUFSVFRWXV0sIFtcbiAgICAgICAgICAgIC9IYmJ0di4qKHRlY2huaXNhdCkgKC4qKTsvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGVjaG5pU0FUXG4gICAgICAgICAgICBdLCBbVkVORE9SLCBNT0RFTCwgW1RZUEUsIFNNQVJUVFZdXSwgW1xuICAgICAgICAgICAgL1xcYihyb2t1KVtcXGR4XSpbXFwpXFwvXSgoPzpkdnAtKT9bXFxkXFwuXSopL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBSb2t1XG4gICAgICAgICAgICAvaGJidHZcXC9cXGQrXFwuXFxkK1xcLlxcZCsgK1xcKFtcXHdcXCsgXSo7ICooW1xcd1xcZF1bXjtdKik7KFteO10qKS9pICAgICAgICAgLy8gSGJiVFYgZGV2aWNlc1xuICAgICAgICAgICAgXSwgW1tWRU5ET1IsIHRyaW1dLCBbTU9ERUwsIHRyaW1dLCBbVFlQRSwgU01BUlRUVl1dLCBbXG4gICAgICAgICAgICAvXFxiKGFuZHJvaWQgdHZ8c21hcnRbLSBdP3R2fG9wZXJhIHR2fHR2OyBydjopXFxiL2kgICAgICAgICAgICAgICAgICAgLy8gU21hcnRUViBmcm9tIFVuaWRlbnRpZmllZCBWZW5kb3JzXG4gICAgICAgICAgICBdLCBbW1RZUEUsIFNNQVJUVFZdXSwgW1xuXG4gICAgICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgICAgICAgICAvLyBDT05TT0xFU1xuICAgICAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICAgICAgICAvKG91eWEpL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE91eWFcbiAgICAgICAgICAgIC8obmludGVuZG8pIChbd2lkczN1dGNoXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTmludGVuZG9cbiAgICAgICAgICAgIF0sIFtWRU5ET1IsIE1PREVMLCBbVFlQRSwgQ09OU09MRV1dLCBbXG4gICAgICAgICAgICAvZHJvaWQuKzsgKHNoaWVsZCkgYnVpL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE52aWRpYVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnTnZpZGlhJ10sIFtUWVBFLCBDT05TT0xFXV0sIFtcbiAgICAgICAgICAgIC8ocGxheXN0YXRpb24gWzM0NXBvcnRhYmxldmldKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUGxheXN0YXRpb25cbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgU09OWV0sIFtUWVBFLCBDT05TT0xFXV0sIFtcbiAgICAgICAgICAgIC9cXGIoeGJveCg/OiBvbmUpPyg/ITsgeGJveCkpW1xcKTsgXS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBNaWNyb3NvZnQgWGJveFxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBNSUNST1NPRlRdLCBbVFlQRSwgQ09OU09MRV1dLCBbXG5cbiAgICAgICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAgICAgICAgIC8vIFdFQVJBQkxFU1xuICAgICAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICAgICAgICAvKChwZWJibGUpKWFwcC9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFBlYmJsZVxuICAgICAgICAgICAgXSwgW1ZFTkRPUiwgTU9ERUwsIFtUWVBFLCBXRUFSQUJMRV1dLCBbXG4gICAgICAgICAgICAvKHdhdGNoKSg/OiA/b3NbLFxcL118XFxkLFxcZFxcLylbXFxkXFwuXSsvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFwcGxlIFdhdGNoXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIEFQUExFXSwgW1RZUEUsIFdFQVJBQkxFXV0sIFtcbiAgICAgICAgICAgIC9kcm9pZC4rOyAoZ2xhc3MpIFxcZC9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEdvb2dsZSBHbGFzc1xuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBHT09HTEVdLCBbVFlQRSwgV0VBUkFCTEVdXSwgW1xuICAgICAgICAgICAgL2Ryb2lkLis7ICh3dDYzPzB7MiwzfSlcXCkvaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBaRUJSQV0sIFtUWVBFLCBXRUFSQUJMRV1dLCBbXG4gICAgICAgICAgICAvKHF1ZXN0KCBcXGR8IHBybyk/KS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBPY3VsdXMgUXVlc3RcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgRkFDRUJPT0tdLCBbVFlQRSwgV0VBUkFCTEVdXSwgW1xuXG4gICAgICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgICAgICAgICAvLyBFTUJFRERFRFxuICAgICAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICAgICAgICAvKHRlc2xhKSg/OiBxdGNhcmJyb3dzZXJ8XFwvWy1cXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRlc2xhXG4gICAgICAgICAgICBdLCBbVkVORE9SLCBbVFlQRSwgRU1CRURERURdXSwgW1xuICAgICAgICAgICAgLyhhZW9iYylcXGIvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRWNobyBEb3RcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgQU1BWk9OXSwgW1RZUEUsIEVNQkVEREVEXV0sIFtcblxuICAgICAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAgICAgICAgIC8vIE1JWEVEIChHRU5FUklDKVxuICAgICAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICAgICAgICAvZHJvaWQgLis/OyAoW147XSs/KSg/OiBidWl8OyB3dlxcKXxcXCkgYXBwbGV3KS4rPyBtb2JpbGUgc2FmYXJpL2kgICAgLy8gQW5kcm9pZCBQaG9uZXMgZnJvbSBVbmlkZW50aWZpZWQgVmVuZG9yc1xuICAgICAgICAgICAgXSwgW01PREVMLCBbVFlQRSwgTU9CSUxFXV0sIFtcbiAgICAgICAgICAgIC9kcm9pZCAuKz87IChbXjtdKz8pKD86IGJ1aXxcXCkgYXBwbGV3KS4rPyg/ISBtb2JpbGUpIHNhZmFyaS9pICAgICAgIC8vIEFuZHJvaWQgVGFibGV0cyBmcm9tIFVuaWRlbnRpZmllZCBWZW5kb3JzXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgL1xcYigodGFibGV0fHRhYilbO1xcL118Zm9jdXNcXC9cXGQoPyEuK21vYmlsZSkpL2kgICAgICAgICAgICAgICAgICAgICAgLy8gVW5pZGVudGlmaWFibGUgVGFibGV0XG4gICAgICAgICAgICBdLCBbW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvKHBob25lfG1vYmlsZSg/Ols7XFwvXXwgWyBcXHdcXC9cXC5dKnNhZmFyaSl8cGRhKD89Lit3aW5kb3dzIGNlKSkvaSAgICAvLyBVbmlkZW50aWZpYWJsZSBNb2JpbGVcbiAgICAgICAgICAgIF0sIFtbVFlQRSwgTU9CSUxFXV0sIFtcbiAgICAgICAgICAgIC8oYW5kcm9pZFstXFx3XFwuIF17MCw5fSk7LitidWlsL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBHZW5lcmljIEFuZHJvaWQgRGV2aWNlXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdHZW5lcmljJ11dXG4gICAgICAgIF0sXG5cbiAgICAgICAgZW5naW5lIDogW1tcblxuICAgICAgICAgICAgL3dpbmRvd3MuKyBlZGdlXFwvKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEVkZ2VIVE1MXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsIEVER0UrJ0hUTUwnXV0sIFtcblxuICAgICAgICAgICAgL3dlYmtpdFxcLzUzN1xcLjM2LitjaHJvbWVcXC8oPyEyNykoW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEJsaW5rXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsICdCbGluayddXSwgW1xuXG4gICAgICAgICAgICAvKHByZXN0bylcXC8oW1xcd1xcLl0rKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFByZXN0b1xuICAgICAgICAgICAgLyh3ZWJraXR8dHJpZGVudHxuZXRmcm9udHxuZXRzdXJmfGFtYXlhfGx5bnh8dzNtfGdvYW5uYSlcXC8oW1xcd1xcLl0rKS9pLCAvLyBXZWJLaXQvVHJpZGVudC9OZXRGcm9udC9OZXRTdXJmL0FtYXlhL0x5bngvdzNtL0dvYW5uYVxuICAgICAgICAgICAgL2VraW9oKGZsb3cpXFwvKFtcXHdcXC5dKykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBGbG93XG4gICAgICAgICAgICAvKGtodG1sfHRhc21hbnxsaW5rcylbXFwvIF1cXCg/KFtcXHdcXC5dKykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBLSFRNTC9UYXNtYW4vTGlua3NcbiAgICAgICAgICAgIC8oaWNhYilbXFwvIF0oWzIzXVxcLltcXGRcXC5dKykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlDYWJcbiAgICAgICAgICAgIC9cXGIobGlid2ViKS9pXG4gICAgICAgICAgICBdLCBbTkFNRSwgVkVSU0lPTl0sIFtcblxuICAgICAgICAgICAgL3J2XFw6KFtcXHdcXC5dezEsOX0pXFxiLisoZ2Vja28pL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gR2Vja29cbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBOQU1FXVxuICAgICAgICBdLFxuXG4gICAgICAgIG9zIDogW1tcblxuICAgICAgICAgICAgLy8gV2luZG93c1xuICAgICAgICAgICAgL21pY3Jvc29mdCAod2luZG93cykgKHZpc3RhfHhwKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBXaW5kb3dzIChpVHVuZXMpXG4gICAgICAgICAgICBdLCBbTkFNRSwgVkVSU0lPTl0sIFtcbiAgICAgICAgICAgIC8od2luZG93cyAoPzpwaG9uZSg/OiBvcyk/fG1vYmlsZSkpW1xcLyBdPyhbXFxkXFwuXFx3IF0qKS9pICAgICAgICAgICAgIC8vIFdpbmRvd3MgUGhvbmVcbiAgICAgICAgICAgIF0sIFtOQU1FLCBbVkVSU0lPTiwgc3RyTWFwcGVyLCB3aW5kb3dzVmVyc2lvbk1hcF1dLCBbXG4gICAgICAgICAgICAvd2luZG93cyBudCA2XFwuMjsgKGFybSkvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gV2luZG93cyBSVFxuICAgICAgICAgICAgL3dpbmRvd3NbXFwvIF0/KFtudGNlXFxkXFwuIF0rXFx3KSg/IS4reGJveCkvaSxcbiAgICAgICAgICAgIC8oPzp3aW4oPz0zfDl8bil8d2luIDl4ICkoW250XFxkXFwuXSspL2lcbiAgICAgICAgICAgIF0sIFtbVkVSU0lPTiwgc3RyTWFwcGVyLCB3aW5kb3dzVmVyc2lvbk1hcF0sIFtOQU1FLCAnV2luZG93cyddXSwgW1xuXG4gICAgICAgICAgICAvLyBpT1MvbWFjT1NcbiAgICAgICAgICAgIC9pcFtob25lYWRdezIsNH1cXGIoPzouKm9zIChbXFx3XSspIGxpa2UgbWFjfDsgb3BlcmEpL2ksICAgICAgICAgICAgICAvLyBpT1NcbiAgICAgICAgICAgIC8oPzppb3M7ZmJzdlxcL3xpcGhvbmUuK2lvc1tcXC8gXSkoW1xcZFxcLl0rKS9pLFxuICAgICAgICAgICAgL2NmbmV0d29ya1xcLy4rZGFyd2luL2lcbiAgICAgICAgICAgIF0sIFtbVkVSU0lPTiwgL18vZywgJy4nXSwgW05BTUUsICdpT1MnXV0sIFtcbiAgICAgICAgICAgIC8obWFjIG9zIHgpID8oW1xcd1xcLiBdKikvaSxcbiAgICAgICAgICAgIC8obWFjaW50b3NofG1hY19wb3dlcnBjXFxiKSg/IS4raGFpa3UpL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1hYyBPU1xuICAgICAgICAgICAgXSwgW1tOQU1FLCBNQUNfT1NdLCBbVkVSU0lPTiwgL18vZywgJy4nXV0sIFtcblxuICAgICAgICAgICAgLy8gTW9iaWxlIE9TZXNcbiAgICAgICAgICAgIC9kcm9pZCAoW1xcd1xcLl0rKVxcYi4rKGFuZHJvaWRbLSBdeDg2fGhhcm1vbnlvcykvaSAgICAgICAgICAgICAgICAgICAgLy8gQW5kcm9pZC14ODYvSGFybW9ueU9TXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgTkFNRV0sIFsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFuZHJvaWQvV2ViT1MvUU5YL0JhZGEvUklNL01hZW1vL01lZUdvL1NhaWxmaXNoIE9TXG4gICAgICAgICAgICAvKGFuZHJvaWR8d2Vib3N8cW54fGJhZGF8cmltIHRhYmxldCBvc3xtYWVtb3xtZWVnb3xzYWlsZmlzaClbLVxcLyBdPyhbXFx3XFwuXSopL2ksXG4gICAgICAgICAgICAvKGJsYWNrYmVycnkpXFx3KlxcLyhbXFx3XFwuXSopL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBCbGFja2JlcnJ5XG4gICAgICAgICAgICAvKHRpemVufGthaW9zKVtcXC8gXShbXFx3XFwuXSspL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRpemVuL0thaU9TXG4gICAgICAgICAgICAvXFwoKHNlcmllczQwKTsvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTZXJpZXMgNDBcbiAgICAgICAgICAgIF0sIFtOQU1FLCBWRVJTSU9OXSwgW1xuICAgICAgICAgICAgL1xcKGJiKDEwKTsvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQmxhY2tCZXJyeSAxMFxuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCBCTEFDS0JFUlJZXV0sIFtcbiAgICAgICAgICAgIC8oPzpzeW1iaWFuID9vc3xzeW1ib3N8czYwKD89Oyl8c2VyaWVzNjApWy1cXC8gXT8oW1xcd1xcLl0qKS9pICAgICAgICAgLy8gU3ltYmlhblxuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCAnU3ltYmlhbiddXSwgW1xuICAgICAgICAgICAgL21vemlsbGFcXC9bXFxkXFwuXSsgXFwoKD86bW9iaWxlfHRhYmxldHx0dnxtb2JpbGU7IFtcXHcgXSspOyBydjouKyBnZWNrb1xcLyhbXFx3XFwuXSspL2kgLy8gRmlyZWZveCBPU1xuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCBGSVJFRk9YKycgT1MnXV0sIFtcbiAgICAgICAgICAgIC93ZWIwczsuK3J0KHR2KS9pLFxuICAgICAgICAgICAgL1xcYig/OmhwKT93b3MoPzpicm93c2VyKT9cXC8oW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gV2ViT1NcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgJ3dlYk9TJ11dLCBbXG4gICAgICAgICAgICAvd2F0Y2goPzogP29zWyxcXC9dfFxcZCxcXGRcXC8pKFtcXGRcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHdhdGNoT1NcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgJ3dhdGNoT1MnXV0sIFtcblxuICAgICAgICAgICAgLy8gR29vZ2xlIENocm9tZWNhc3RcbiAgICAgICAgICAgIC9jcmtleVxcLyhbXFxkXFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gR29vZ2xlIENocm9tZWNhc3RcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgQ0hST01FKydjYXN0J11dLCBbXG4gICAgICAgICAgICAvKGNyb3MpIFtcXHddKyg/OlxcKXwgKFtcXHdcXC5dKylcXGIpL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ2hyb21pdW0gT1NcbiAgICAgICAgICAgIF0sIFtbTkFNRSwgQ0hST01JVU1fT1NdLCBWRVJTSU9OXSxbXG5cbiAgICAgICAgICAgIC8vIFNtYXJ0IFRWc1xuICAgICAgICAgICAgL3BhbmFzb25pYzsodmllcmEpL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBQYW5hc29uaWMgVmllcmFcbiAgICAgICAgICAgIC8obmV0cmFuZ2UpbW1oL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTmV0cmFuZ2VcbiAgICAgICAgICAgIC8obmV0dHYpXFwvKFxcZCtcXC5bXFx3XFwuXSspL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBOZXRUVlxuXG4gICAgICAgICAgICAvLyBDb25zb2xlXG4gICAgICAgICAgICAvKG5pbnRlbmRvfHBsYXlzdGF0aW9uKSAoW3dpZHMzNDVwb3J0YWJsZXZ1Y2hdKykvaSwgICAgICAgICAgICAgICAgIC8vIE5pbnRlbmRvL1BsYXlzdGF0aW9uXG4gICAgICAgICAgICAvKHhib3gpOyAreGJveCAoW15cXCk7XSspL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBNaWNyb3NvZnQgWGJveCAoMzYwLCBPbmUsIFgsIFMsIFNlcmllcyBYLCBTZXJpZXMgUylcblxuICAgICAgICAgICAgLy8gT3RoZXJcbiAgICAgICAgICAgIC9cXGIoam9saXxwYWxtKVxcYiA/KD86b3MpP1xcLz8oW1xcd1xcLl0qKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBKb2xpL1BhbG1cbiAgICAgICAgICAgIC8obWludClbXFwvXFwoXFwpIF0/KFxcdyopL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1pbnRcbiAgICAgICAgICAgIC8obWFnZWlhfHZlY3RvcmxpbnV4KVs7IF0vaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTWFnZWlhL1ZlY3RvckxpbnV4XG4gICAgICAgICAgICAvKFtreGxuXT91YnVudHV8ZGViaWFufHN1c2V8b3BlbnN1c2V8Z2VudG9vfGFyY2goPz0gbGludXgpfHNsYWNrd2FyZXxmZWRvcmF8bWFuZHJpdmF8Y2VudG9zfHBjbGludXhvc3xyZWQgP2hhdHx6ZW53YWxrfGxpbnB1c3xyYXNwYmlhbnxwbGFuIDl8bWluaXh8cmlzYyBvc3xjb250aWtpfGRlZXBpbnxtYW5qYXJvfGVsZW1lbnRhcnkgb3N8c2FiYXlvbnxsaW5zcGlyZSkoPzogZ251XFwvbGludXgpPyg/OiBlbnRlcnByaXNlKT8oPzpbLSBdbGludXgpPyg/Oi1nbnUpP1stXFwvIF0/KD8hY2hyb218cGFja2FnZSkoWy1cXHdcXC5dKikvaSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVWJ1bnR1L0RlYmlhbi9TVVNFL0dlbnRvby9BcmNoL1NsYWNrd2FyZS9GZWRvcmEvTWFuZHJpdmEvQ2VudE9TL1BDTGludXhPUy9SZWRIYXQvWmVud2Fsay9MaW5wdXMvUmFzcGJpYW4vUGxhbjkvTWluaXgvUklTQ09TL0NvbnRpa2kvRGVlcGluL01hbmphcm8vZWxlbWVudGFyeS9TYWJheW9uL0xpbnNwaXJlXG4gICAgICAgICAgICAvKGh1cmR8bGludXgpID8oW1xcd1xcLl0qKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSHVyZC9MaW51eFxuICAgICAgICAgICAgLyhnbnUpID8oW1xcd1xcLl0qKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEdOVVxuICAgICAgICAgICAgL1xcYihbLWZyZW50b3BjZ2hzXXswLDV9YnNkfGRyYWdvbmZseSlbXFwvIF0/KD8hYW1kfFtpeDM0Nl17MSwyfTg2KShbXFx3XFwuXSopL2ksIC8vIEZyZWVCU0QvTmV0QlNEL09wZW5CU0QvUEMtQlNEL0dob3N0QlNEL0RyYWdvbkZseVxuICAgICAgICAgICAgLyhoYWlrdSkgKFxcdyspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSGFpa3VcbiAgICAgICAgICAgIF0sIFtOQU1FLCBWRVJTSU9OXSwgW1xuICAgICAgICAgICAgLyhzdW5vcykgPyhbXFx3XFwuXFxkXSopL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTb2xhcmlzXG4gICAgICAgICAgICBdLCBbW05BTUUsICdTb2xhcmlzJ10sIFZFUlNJT05dLCBbXG4gICAgICAgICAgICAvKCg/Om9wZW4pP3NvbGFyaXMpWy1cXC8gXT8oW1xcd1xcLl0qKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNvbGFyaXNcbiAgICAgICAgICAgIC8oYWl4KSAoKFxcZCkoPz1cXC58XFwpfCApW1xcd1xcLl0pKi9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBSVhcbiAgICAgICAgICAgIC9cXGIoYmVvc3xvc1xcLzJ8YW1pZ2Fvc3xtb3JwaG9zfG9wZW52bXN8ZnVjaHNpYXxocC11eHxzZXJlbml0eW9zKS9pLCAvLyBCZU9TL09TMi9BbWlnYU9TL01vcnBoT1MvT3BlblZNUy9GdWNoc2lhL0hQLVVYL1NlcmVuaXR5T1NcbiAgICAgICAgICAgIC8odW5peCkgPyhbXFx3XFwuXSopL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBVTklYXG4gICAgICAgICAgICBdLCBbTkFNRSwgVkVSU0lPTl1cbiAgICAgICAgXVxuICAgIH07XG5cbiAgICAvLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8vIENvbnN0cnVjdG9yXG4gICAgLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgdmFyIFVBUGFyc2VyID0gZnVuY3Rpb24gKHVhLCBleHRlbnNpb25zKSB7XG5cbiAgICAgICAgaWYgKHR5cGVvZiB1YSA9PT0gT0JKX1RZUEUpIHtcbiAgICAgICAgICAgIGV4dGVuc2lvbnMgPSB1YTtcbiAgICAgICAgICAgIHVhID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFVBUGFyc2VyKSkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBVQVBhcnNlcih1YSwgZXh0ZW5zaW9ucykuZ2V0UmVzdWx0KCk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgX25hdmlnYXRvciA9ICh0eXBlb2Ygd2luZG93ICE9PSBVTkRFRl9UWVBFICYmIHdpbmRvdy5uYXZpZ2F0b3IpID8gd2luZG93Lm5hdmlnYXRvciA6IHVuZGVmaW5lZDtcbiAgICAgICAgdmFyIF91YSA9IHVhIHx8ICgoX25hdmlnYXRvciAmJiBfbmF2aWdhdG9yLnVzZXJBZ2VudCkgPyBfbmF2aWdhdG9yLnVzZXJBZ2VudCA6IEVNUFRZKTtcbiAgICAgICAgdmFyIF91YWNoID0gKF9uYXZpZ2F0b3IgJiYgX25hdmlnYXRvci51c2VyQWdlbnREYXRhKSA/IF9uYXZpZ2F0b3IudXNlckFnZW50RGF0YSA6IHVuZGVmaW5lZDtcbiAgICAgICAgdmFyIF9yZ3htYXAgPSBleHRlbnNpb25zID8gZXh0ZW5kKHJlZ2V4ZXMsIGV4dGVuc2lvbnMpIDogcmVnZXhlcztcbiAgICAgICAgdmFyIF9pc1NlbGZOYXYgPSBfbmF2aWdhdG9yICYmIF9uYXZpZ2F0b3IudXNlckFnZW50ID09IF91YTtcblxuICAgICAgICB0aGlzLmdldEJyb3dzZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgX2Jyb3dzZXIgPSB7fTtcbiAgICAgICAgICAgIF9icm93c2VyW05BTUVdID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgX2Jyb3dzZXJbVkVSU0lPTl0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICByZ3hNYXBwZXIuY2FsbChfYnJvd3NlciwgX3VhLCBfcmd4bWFwLmJyb3dzZXIpO1xuICAgICAgICAgICAgX2Jyb3dzZXJbTUFKT1JdID0gbWFqb3JpemUoX2Jyb3dzZXJbVkVSU0lPTl0pO1xuICAgICAgICAgICAgLy8gQnJhdmUtc3BlY2lmaWMgZGV0ZWN0aW9uXG4gICAgICAgICAgICBpZiAoX2lzU2VsZk5hdiAmJiBfbmF2aWdhdG9yICYmIF9uYXZpZ2F0b3IuYnJhdmUgJiYgdHlwZW9mIF9uYXZpZ2F0b3IuYnJhdmUuaXNCcmF2ZSA9PSBGVU5DX1RZUEUpIHtcbiAgICAgICAgICAgICAgICBfYnJvd3NlcltOQU1FXSA9ICdCcmF2ZSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gX2Jyb3dzZXI7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZ2V0Q1BVID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIF9jcHUgPSB7fTtcbiAgICAgICAgICAgIF9jcHVbQVJDSElURUNUVVJFXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIHJneE1hcHBlci5jYWxsKF9jcHUsIF91YSwgX3JneG1hcC5jcHUpO1xuICAgICAgICAgICAgcmV0dXJuIF9jcHU7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZ2V0RGV2aWNlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIF9kZXZpY2UgPSB7fTtcbiAgICAgICAgICAgIF9kZXZpY2VbVkVORE9SXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIF9kZXZpY2VbTU9ERUxdID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgX2RldmljZVtUWVBFXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIHJneE1hcHBlci5jYWxsKF9kZXZpY2UsIF91YSwgX3JneG1hcC5kZXZpY2UpO1xuICAgICAgICAgICAgaWYgKF9pc1NlbGZOYXYgJiYgIV9kZXZpY2VbVFlQRV0gJiYgX3VhY2ggJiYgX3VhY2gubW9iaWxlKSB7XG4gICAgICAgICAgICAgICAgX2RldmljZVtUWVBFXSA9IE1PQklMRTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGlQYWRPUy1zcGVjaWZpYyBkZXRlY3Rpb246IGlkZW50aWZpZWQgYXMgTWFjLCBidXQgaGFzIHNvbWUgaU9TLW9ubHkgcHJvcGVydGllc1xuICAgICAgICAgICAgaWYgKF9pc1NlbGZOYXYgJiYgX2RldmljZVtNT0RFTF0gPT0gJ01hY2ludG9zaCcgJiYgX25hdmlnYXRvciAmJiB0eXBlb2YgX25hdmlnYXRvci5zdGFuZGFsb25lICE9PSBVTkRFRl9UWVBFICYmIF9uYXZpZ2F0b3IubWF4VG91Y2hQb2ludHMgJiYgX25hdmlnYXRvci5tYXhUb3VjaFBvaW50cyA+IDIpIHtcbiAgICAgICAgICAgICAgICBfZGV2aWNlW01PREVMXSA9ICdpUGFkJztcbiAgICAgICAgICAgICAgICBfZGV2aWNlW1RZUEVdID0gVEFCTEVUO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIF9kZXZpY2U7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZ2V0RW5naW5lID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIF9lbmdpbmUgPSB7fTtcbiAgICAgICAgICAgIF9lbmdpbmVbTkFNRV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBfZW5naW5lW1ZFUlNJT05dID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgcmd4TWFwcGVyLmNhbGwoX2VuZ2luZSwgX3VhLCBfcmd4bWFwLmVuZ2luZSk7XG4gICAgICAgICAgICByZXR1cm4gX2VuZ2luZTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5nZXRPUyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBfb3MgPSB7fTtcbiAgICAgICAgICAgIF9vc1tOQU1FXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIF9vc1tWRVJTSU9OXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIHJneE1hcHBlci5jYWxsKF9vcywgX3VhLCBfcmd4bWFwLm9zKTtcbiAgICAgICAgICAgIGlmIChfaXNTZWxmTmF2ICYmICFfb3NbTkFNRV0gJiYgX3VhY2ggJiYgX3VhY2gucGxhdGZvcm0gJiYgX3VhY2gucGxhdGZvcm0gIT0gJ1Vua25vd24nKSB7XG4gICAgICAgICAgICAgICAgX29zW05BTUVdID0gX3VhY2gucGxhdGZvcm0gIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL2Nocm9tZSBvcy9pLCBDSFJPTUlVTV9PUylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9tYWNvcy9pLCBNQUNfT1MpOyAgICAgICAgICAgLy8gYmFja3dhcmQgY29tcGF0aWJpbGl0eVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIF9vcztcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5nZXRSZXN1bHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHVhICAgICAgOiB0aGlzLmdldFVBKCksXG4gICAgICAgICAgICAgICAgYnJvd3NlciA6IHRoaXMuZ2V0QnJvd3NlcigpLFxuICAgICAgICAgICAgICAgIGVuZ2luZSAgOiB0aGlzLmdldEVuZ2luZSgpLFxuICAgICAgICAgICAgICAgIG9zICAgICAgOiB0aGlzLmdldE9TKCksXG4gICAgICAgICAgICAgICAgZGV2aWNlICA6IHRoaXMuZ2V0RGV2aWNlKCksXG4gICAgICAgICAgICAgICAgY3B1ICAgICA6IHRoaXMuZ2V0Q1BVKClcbiAgICAgICAgICAgIH07XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZ2V0VUEgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gX3VhO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLnNldFVBID0gZnVuY3Rpb24gKHVhKSB7XG4gICAgICAgICAgICBfdWEgPSAodHlwZW9mIHVhID09PSBTVFJfVFlQRSAmJiB1YS5sZW5ndGggPiBVQV9NQVhfTEVOR1RIKSA/IHRyaW0odWEsIFVBX01BWF9MRU5HVEgpIDogdWE7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5zZXRVQShfdWEpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgVUFQYXJzZXIuVkVSU0lPTiA9IExJQlZFUlNJT047XG4gICAgVUFQYXJzZXIuQlJPV1NFUiA9ICBlbnVtZXJpemUoW05BTUUsIFZFUlNJT04sIE1BSk9SXSk7XG4gICAgVUFQYXJzZXIuQ1BVID0gZW51bWVyaXplKFtBUkNISVRFQ1RVUkVdKTtcbiAgICBVQVBhcnNlci5ERVZJQ0UgPSBlbnVtZXJpemUoW01PREVMLCBWRU5ET1IsIFRZUEUsIENPTlNPTEUsIE1PQklMRSwgU01BUlRUViwgVEFCTEVULCBXRUFSQUJMRSwgRU1CRURERURdKTtcbiAgICBVQVBhcnNlci5FTkdJTkUgPSBVQVBhcnNlci5PUyA9IGVudW1lcml6ZShbTkFNRSwgVkVSU0lPTl0pO1xuXG4gICAgLy8vLy8vLy8vLy9cbiAgICAvLyBFeHBvcnRcbiAgICAvLy8vLy8vLy8vXG5cbiAgICAvLyBjaGVjayBqcyBlbnZpcm9ubWVudFxuICAgIGlmICh0eXBlb2YoZXhwb3J0cykgIT09IFVOREVGX1RZUEUpIHtcbiAgICAgICAgLy8gbm9kZWpzIGVudlxuICAgICAgICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gVU5ERUZfVFlQRSAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgICAgICAgICAgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gVUFQYXJzZXI7XG4gICAgICAgIH1cbiAgICAgICAgZXhwb3J0cy5VQVBhcnNlciA9IFVBUGFyc2VyO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHJlcXVpcmVqcyBlbnYgKG9wdGlvbmFsKVxuICAgICAgICBpZiAodHlwZW9mKGRlZmluZSkgPT09IEZVTkNfVFlQRSAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgICAgICBkZWZpbmUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBVQVBhcnNlcjtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB3aW5kb3cgIT09IFVOREVGX1RZUEUpIHtcbiAgICAgICAgICAgIC8vIGJyb3dzZXIgZW52XG4gICAgICAgICAgICB3aW5kb3cuVUFQYXJzZXIgPSBVQVBhcnNlcjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGpRdWVyeS9aZXB0byBzcGVjaWZpYyAob3B0aW9uYWwpXG4gICAgLy8gTm90ZTpcbiAgICAvLyAgIEluIEFNRCBlbnYgdGhlIGdsb2JhbCBzY29wZSBzaG91bGQgYmUga2VwdCBjbGVhbiwgYnV0IGpRdWVyeSBpcyBhbiBleGNlcHRpb24uXG4gICAgLy8gICBqUXVlcnkgYWx3YXlzIGV4cG9ydHMgdG8gZ2xvYmFsIHNjb3BlLCB1bmxlc3MgalF1ZXJ5Lm5vQ29uZmxpY3QodHJ1ZSkgaXMgdXNlZCxcbiAgICAvLyAgIGFuZCB3ZSBzaG91bGQgY2F0Y2ggdGhhdC5cbiAgICB2YXIgJCA9IHR5cGVvZiB3aW5kb3cgIT09IFVOREVGX1RZUEUgJiYgKHdpbmRvdy5qUXVlcnkgfHwgd2luZG93LlplcHRvKTtcbiAgICBpZiAoJCAmJiAhJC51YSkge1xuICAgICAgICB2YXIgcGFyc2VyID0gbmV3IFVBUGFyc2VyKCk7XG4gICAgICAgICQudWEgPSBwYXJzZXIuZ2V0UmVzdWx0KCk7XG4gICAgICAgICQudWEuZ2V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHBhcnNlci5nZXRVQSgpO1xuICAgICAgICB9O1xuICAgICAgICAkLnVhLnNldCA9IGZ1bmN0aW9uICh1YSkge1xuICAgICAgICAgICAgcGFyc2VyLnNldFVBKHVhKTtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBwYXJzZXIuZ2V0UmVzdWx0KCk7XG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wIGluIHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICQudWFbcHJvcF0gPSByZXN1bHRbcHJvcF07XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG59KSh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JyA/IHdpbmRvdyA6IHRoaXMpO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIl9fd2VicGFja19yZXF1aXJlX18uYW1kTyA9IHt9OyIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vaW5kZXgudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=