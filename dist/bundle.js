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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGdDQUFnQyxJQUFJO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4Q0FBOEMsSUFBSTtBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0MsSUFBSTtBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHNEQUFzRCxnQkFBZ0I7QUFDdEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSw4Q0FBOEMsR0FBRztBQUNqRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0I7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FB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QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQVksUUFBYTtBQUN6QjtBQUNBO0FBQ0EsUUFBUSxnQkFBZ0I7QUFDeEIsTUFBTTtBQUNOO0FBQ0EsWUFBWSxVQUFjLGtCQUFrQix3QkFBVTtBQUN0RCxZQUFZLG1DQUFPO0FBQ25CO0FBQ0EsYUFBYTtBQUFBLGtHQUFDO0FBQ2QsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsQ0FBQzs7Ozs7OztVQ3g3QkQ7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7Ozs7O1VFQUE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9BVFNFdmVudHMvLi9pbmRleC50cyIsIndlYnBhY2s6Ly9BVFNFdmVudHMvLi9zcmMvQnJvd3NlckluZm8udHMiLCJ3ZWJwYWNrOi8vQVRTRXZlbnRzLy4vc3JjL0NhbXBhaWduSW5mby50cyIsIndlYnBhY2s6Ly9BVFNFdmVudHMvLi9zcmMvTG9nZ2VyLnRzIiwid2VicGFjazovL0FUU0V2ZW50cy8uL3NyYy9NYW5hZ2VyLnRzIiwid2VicGFjazovL0FUU0V2ZW50cy8uL3NyYy9SZW1vdGUudHMiLCJ3ZWJwYWNrOi8vQVRTRXZlbnRzLy4vc3JjL1Rvb2xzLnRzIiwid2VicGFjazovL0FUU0V2ZW50cy8uL3NyYy9VcmxQYXJzZXIudHMiLCJ3ZWJwYWNrOi8vQVRTRXZlbnRzLy4vc3JjL2V2ZW50cy9BVFNFdmVudC50cyIsIndlYnBhY2s6Ly9BVFNFdmVudHMvLi9zcmMvZXZlbnRzL0F0dGFjaG1lbnRPcGVuLnRzIiwid2VicGFjazovL0FUU0V2ZW50cy8uL3NyYy9ldmVudHMvQ2xpY2sudHMiLCJ3ZWJwYWNrOi8vQVRTRXZlbnRzLy4vc3JjL2V2ZW50cy9DbGlwYm9hcmQudHMiLCJ3ZWJwYWNrOi8vQVRTRXZlbnRzLy4vc3JjL2V2ZW50cy9Eb3dubG9hZC50cyIsIndlYnBhY2s6Ly9BVFNFdmVudHMvLi9zcmMvZXZlbnRzL0V4dGVuc2lvbi50cyIsIndlYnBhY2s6Ly9BVFNFdmVudHMvLi9zcmMvZXZlbnRzL0ZpbGVEb3dubG9hZC50cyIsIndlYnBhY2s6Ly9BVFNFdmVudHMvLi9zcmMvZXZlbnRzL0ZpbGVPcGVuLnRzIiwid2VicGFjazovL0FUU0V2ZW50cy8uL3NyYy9ldmVudHMvSW5wdXQudHMiLCJ3ZWJwYWNrOi8vQVRTRXZlbnRzLy4vc3JjL2V2ZW50cy9Mb2NhdGlvbi50cyIsIndlYnBhY2s6Ly9BVFNFdmVudHMvLi9zcmMvZXZlbnRzL01pY3JvcGhvbmUudHMiLCJ3ZWJwYWNrOi8vQVRTRXZlbnRzLy4vc3JjL2V2ZW50cy9Ob3RpZmljYXRpb24udHMiLCJ3ZWJwYWNrOi8vQVRTRXZlbnRzLy4vc3JjL2V2ZW50cy9QYWdlTGVmdC50cyIsIndlYnBhY2s6Ly9BVFNFdmVudHMvLi9zcmMvZXZlbnRzL1BhZ2VMb2FkZWQudHMiLCJ3ZWJwYWNrOi8vQVRTRXZlbnRzLy4vc3JjL2V2ZW50cy9QYWdlUmVhZC50cyIsIndlYnBhY2s6Ly9BVFNFdmVudHMvLi9zcmMvZXZlbnRzL1N1Ym1pdC50cyIsIndlYnBhY2s6Ly9BVFNFdmVudHMvLi9zcmMvZXZlbnRzL1dlYmNhbS50cyIsIndlYnBhY2s6Ly9BVFNFdmVudHMvLi9ub2RlX21vZHVsZXMvdWEtcGFyc2VyLWpzL3NyYy91YS1wYXJzZXIuanMiLCJ3ZWJwYWNrOi8vQVRTRXZlbnRzL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL0FUU0V2ZW50cy93ZWJwYWNrL3J1bnRpbWUvYW1kIG9wdGlvbnMiLCJ3ZWJwYWNrOi8vQVRTRXZlbnRzL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vQVRTRXZlbnRzL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9BVFNFdmVudHMvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1hbmFnZXIgfSBmcm9tIFwiLi9zcmMvTWFuYWdlclwiO1xuaW1wb3J0IFJlbW90ZSBmcm9tIFwiLi9zcmMvUmVtb3RlXCI7XG5pbXBvcnQge3JlbW92ZVN1YmRvbWFpbn0gZnJvbSBcIi4vc3JjL1Rvb2xzXCI7XG5pbXBvcnQgSU9wdGlvbnMgZnJvbSBcIi4vc3JjL2ludGVmYWNlcy9JT3B0aW9uXCI7XG5cbmNvbnN0IGRlZmF1bHRPcHRpb25zOiBJT3B0aW9ucyA9IHtcblx0ZXZlbnRzVG9JbmNsdWRlOiBbXSxcblx0ZXZlbnRzVG9FeGNsdWRlOiBbXSxcblx0ZGVidWc6IGZhbHNlLFxuXHRzaG91bGRSZWRpcmVjdDogdHJ1ZSxcblx0cmVkaXJlY3RVcmw6IGBodHRwczovL29vcHMuJHtyZW1vdmVTdWJkb21haW4od2luZG93LmxvY2F0aW9uLmhvc3RuYW1lKX1gLFxuXHRzb3VyY2U6IFwiTFBcIixcblx0dXJsOiBcImh0dHBzOi8vYXBpLmF0dGFja3NpbXVsYXRvci5jb20vdjAvY2xpZW50LWV2ZW50c1wiLFxuXHRleHRyYVBheWxvYWQ6IHt9LFxufTtcblxuY2xhc3MgQVRTRXZlbnRzIHtcblx0cHJpdmF0ZSBtYW5hZ2VyOiBNYW5hZ2VyO1xuXG5cdGNvbnN0cnVjdG9yKG9wdGlvbnM6IElPcHRpb25zKSB7XG5cdFx0Y29uc3QgX29wdGlvbnMgPSB7Li4uZGVmYXVsdE9wdGlvbnMsIC4uLm9wdGlvbnN9O1xuXHRcdGlmIChfb3B0aW9ucy5kZWJ1Zykge1xuXHRcdFx0Y29uc29sZS5sb2coX29wdGlvbnMpO1xuXHRcdH1cblx0XHRjb25zdCByZW1vdGUgPSBuZXcgUmVtb3RlKF9vcHRpb25zLmFwaUtleSwgX29wdGlvbnMudXJsLCBfb3B0aW9ucy5kZWJ1Zyk7XG5cdFx0dGhpcy5tYW5hZ2VyID0gbmV3IE1hbmFnZXIocmVtb3RlLCBfb3B0aW9ucyk7XG5cdH1cblxuXHRsaXN0ZW4oKSB7XG5cdFx0dGhpcy5tYW5hZ2VyLmxpc3RlbigpO1xuXHR9XG5cblx0b24oZXZlbnROYW1lOiBzdHJpbmcsIGNhbGxiYWNrKSB7XG5cdFx0dGhpcy5tYW5hZ2VyLnN1YnNjcmliZShldmVudE5hbWUsIGNhbGxiYWNrKTtcblx0fVxuXG5cdG9mZihldmVudE5hbWU6IHN0cmluZywgY2FsbGJhY2spIHtcblx0XHR0aGlzLm1hbmFnZXIudW5zdWJzY3JpYmUoZXZlbnROYW1lLCBjYWxsYmFjayk7XG5cdH1cblxuXHRzdG9wKCkge1xuXHRcdHRoaXMubWFuYWdlci5zdG9wKCk7XG5cdH1cblxuXHR0cmlnZ2VyKG5hbWU6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuXHRcdHJldHVybiB0aGlzLm1hbmFnZXIudHJpZ2dlcihuYW1lKTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEFUU0V2ZW50cztcbiIsImltcG9ydCBwYXJzZXIgZnJvbSBcInVhLXBhcnNlci1qc1wiO1xuXG5pbnRlcmZhY2UgU2NyZWVuU2l6ZSB7XG4gICAgd2lkdGggPzogbnVtYmVyXG4gICAgaGVpZ2h0ID86IG51bWJlclxufVxuXG5pbnRlcmZhY2UgQnJvd3NlciB7XG4gICAgbmFtZSA/OiBzdHJpbmdcbiAgICB2ZXJzaW9uID86IHN0cmluZ1xuICAgIG1ham9yX3ZlcnNpb24gPzogbnVtYmVyXG4gICAgbW9iaWxlID86IGJvb2xlYW5cbn1cblxuaW50ZXJmYWNlIE9TIHtcbiAgICBuYW1lID86IHN0cmluZ1xuICAgIHZlcnNpb24gPzogc3RyaW5nXG59XG5cbmludGVyZmFjZSBEZXZpY2Uge1xuICAgIG1vZGVsPzogc3RyaW5nXG4gICAgdHlwZT86IHN0cmluZ1xuICAgIHZlbmRvcj86IHN0cmluZ1xufVxuaW50ZXJmYWNlIENwdSB7XG4gICAgYXJjaGl0ZWN0dXJlID86c3RyaW5nXG59XG5leHBvcnQgaW50ZXJmYWNlIEJyb3dzZXJJbmZvIHtcbiAgICB1YTogc3RyaW5nO1xuICAgIHNjcmVlbl9zaXplOiBTY3JlZW5TaXplO1xuICAgIGJyb3dzZXI6IEJyb3dzZXI7XG4gICAgb3M6IE9TO1xuICAgIGRldmljZTogRGV2aWNlO1xuICAgIGNwdTogQ3B1O1xufVxuXG5mdW5jdGlvbiBmaW5kQnJvd3NlcigpOiBCcm93c2VyIHtcblx0bGV0IHZlck9mZnNldDogbnVtYmVyO1xuXHRjb25zdCBicm93c2VyOiBCcm93c2VyID0ge307XG5cdGNvbnN0IHVzZXJBZ2VudCA9IG5hdmlnYXRvci51c2VyQWdlbnQ7XG5cblx0Ly8gT3BlcmFcblx0aWYgKCh2ZXJPZmZzZXQgPSB1c2VyQWdlbnQuaW5kZXhPZihcIk9wZXJhXCIpKSAhPT0gLTEpIHtcblx0XHRicm93c2VyLm5hbWUgPSBcIk9wZXJhXCI7XG5cdFx0YnJvd3Nlci52ZXJzaW9uID0gdXNlckFnZW50LnN1YnN0cmluZyh2ZXJPZmZzZXQgKyA2KTtcblx0XHRpZiAoKHZlck9mZnNldCA9IHVzZXJBZ2VudC5pbmRleE9mKFwiVmVyc2lvblwiKSkgIT09IC0xKSB7XG5cdFx0XHRicm93c2VyLnZlcnNpb24gPSB1c2VyQWdlbnQuc3Vic3RyaW5nKHZlck9mZnNldCArIDgpO1xuXHRcdH1cblx0fVxuXG5cdC8vIE9wZXJhIE5leHRcblx0ZWxzZSBpZiAoKHZlck9mZnNldCA9IHVzZXJBZ2VudC5pbmRleE9mKFwiT1BSXCIpKSAhPT0gLTEpIHtcblx0XHRicm93c2VyLm5hbWUgPSBcIk9wZXJhXCI7XG5cdFx0YnJvd3Nlci52ZXJzaW9uID0gdXNlckFnZW50LnN1YnN0cmluZyh2ZXJPZmZzZXQgKyA1KTtcblx0fVxuXG5cdC8vIEVkZ2Vcblx0ZWxzZSBpZiAoKHZlck9mZnNldCA9IHVzZXJBZ2VudC5pbmRleE9mKFwiRWRnZVwiKSkgIT09IC0xKSB7XG5cdFx0YnJvd3Nlci5uYW1lID0gXCJNaWNyb3NvZnQgRWRnZVwiO1xuXHRcdGJyb3dzZXIudmVyc2lvbiA9IHVzZXJBZ2VudC5zdWJzdHJpbmcodmVyT2Zmc2V0ICsgNSk7XG5cdH1cblxuXHQvLyBNU0lFXG5cdGVsc2UgaWYgKCh2ZXJPZmZzZXQgPSB1c2VyQWdlbnQuaW5kZXhPZihcIk1TSUVcIikpICE9PSAtMSkge1xuXHRcdGJyb3dzZXIubmFtZSA9IFwiTWljcm9zb2Z0IEludGVybmV0IEV4cGxvcmVyXCI7XG5cdFx0YnJvd3Nlci52ZXJzaW9uID0gdXNlckFnZW50LnN1YnN0cmluZyh2ZXJPZmZzZXQgKyA1KTtcblx0fVxuXG5cdC8vIENocm9tZVxuXHRlbHNlIGlmICgodmVyT2Zmc2V0ID0gdXNlckFnZW50LmluZGV4T2YoXCJDaHJvbWVcIikpICE9PSAtMSkge1xuXHRcdGJyb3dzZXIubmFtZSA9IFwiQ2hyb21lXCI7XG5cdFx0YnJvd3Nlci52ZXJzaW9uID0gdXNlckFnZW50LnN1YnN0cmluZyh2ZXJPZmZzZXQgKyA3KTtcblx0fVxuXG5cdC8vIFNhZmFyaVxuXHRlbHNlIGlmICgodmVyT2Zmc2V0ID0gdXNlckFnZW50LmluZGV4T2YoXCJTYWZhcmlcIikpICE9PSAtMSkge1xuXHRcdGJyb3dzZXIubmFtZSA9IFwiU2FmYXJpXCI7XG5cdFx0YnJvd3Nlci52ZXJzaW9uID0gdXNlckFnZW50LnN1YnN0cmluZyh2ZXJPZmZzZXQgKyA3KTtcblx0XHRpZiAoKHZlck9mZnNldCA9IHVzZXJBZ2VudC5pbmRleE9mKFwiVmVyc2lvblwiKSkgIT09IC0xKSB7XG5cdFx0XHRicm93c2VyLnZlcnNpb24gPSB1c2VyQWdlbnQuc3Vic3RyaW5nKHZlck9mZnNldCArIDgpO1xuXHRcdH1cblx0fVxuXG5cdC8vIEZpcmVmb3hcblx0ZWxzZSBpZiAoKHZlck9mZnNldCA9IHVzZXJBZ2VudC5pbmRleE9mKFwiRmlyZWZveFwiKSkgIT09IC0xKSB7XG5cdFx0YnJvd3Nlci5uYW1lID0gXCJGaXJlZm94XCI7XG5cdFx0YnJvd3Nlci52ZXJzaW9uID0gdXNlckFnZW50LnN1YnN0cmluZyh2ZXJPZmZzZXQgKyA4KTtcblx0fVxuXG5cdC8vIE1TSUUgMTErXG5cdGVsc2UgaWYgKHVzZXJBZ2VudC5pbmRleE9mKFwiVHJpZGVudC9cIikgIT09IC0xKSB7XG5cdFx0YnJvd3Nlci5uYW1lID0gXCJNaWNyb3NvZnQgSW50ZXJuZXQgRXhwbG9yZXJcIjtcblx0XHRicm93c2VyLnZlcnNpb24gPSB1c2VyQWdlbnQuc3Vic3RyaW5nKHVzZXJBZ2VudC5pbmRleE9mKFwicnY6XCIpICsgMyk7XG5cdH1cblxuXHRicm93c2VyLm1vYmlsZSA9IC9Nb2JpbGV8bWluaXxGZW5uZWN8QW5kcm9pZHxpUChhZHxvZHxob25lKS8udGVzdCh1c2VyQWdlbnQpO1xuXG5cdC8vIHRyaW0gdGhlIHZlcnNpb24gc3RyaW5nXG5cdGxldCBpeDtcblx0aWYgKChpeCA9IGJyb3dzZXIudmVyc2lvbi5pbmRleE9mKFwiO1wiKSkgIT0gLTEpIGJyb3dzZXIudmVyc2lvbiA9IGJyb3dzZXIudmVyc2lvbi5zdWJzdHJpbmcoMCwgaXgpO1xuXHRpZiAoKGl4ID0gYnJvd3Nlci52ZXJzaW9uLmluZGV4T2YoXCIgXCIpKSAhPSAtMSkgYnJvd3Nlci52ZXJzaW9uID0gYnJvd3Nlci52ZXJzaW9uLnN1YnN0cmluZygwLCBpeCk7XG5cdGlmICgoaXggPSBicm93c2VyLnZlcnNpb24uaW5kZXhPZihcIilcIikpICE9IC0xKSBicm93c2VyLnZlcnNpb24gPSBicm93c2VyLnZlcnNpb24uc3Vic3RyaW5nKDAsIGl4KTtcblxuXHRicm93c2VyLm1ham9yX3ZlcnNpb24gPSBwYXJzZUludChcIlwiICsgYnJvd3Nlci52ZXJzaW9uLCAxMCk7XG5cdGlmIChpc05hTiggYnJvd3Nlci5tYWpvcl92ZXJzaW9uKSkge1xuXHRcdGJyb3dzZXIudmVyc2lvbiA9IFwiXCIgKyBwYXJzZUZsb2F0KG5hdmlnYXRvci5hcHBWZXJzaW9uKTtcblx0XHRicm93c2VyLm1ham9yX3ZlcnNpb24gPSBwYXJzZUludChuYXZpZ2F0b3IuYXBwVmVyc2lvbiwgMTApO1xuXHR9XG4gICAgXG5cdHJldHVybiBicm93c2VyO1xufVxuXG5mdW5jdGlvbiBmaW5kT3BlcmF0aW5nU3lzdGVtKHBhcnNlcjogYW55KTogT1Mge1xuXHRjb25zdCB7bmFtZSwgdmVyc2lvbn0gPSBwYXJzZXIuZ2V0T1MoKTtcblx0cmV0dXJuIHsgbmFtZSwgdmVyc2lvbn07XG59XG5cbmZ1bmN0aW9uIGZpbmREZXZpY2UocGFyc2VyOiBhbnkpOiBEZXZpY2Uge1xuXHRjb25zdCB7bW9kZWwsIHR5cGUsIHZlbmRvcn0gPSBwYXJzZXIuZ2V0RGV2aWNlKCk7XG5cdHJldHVybiB7bW9kZWwsIHR5cGUsIHZlbmRvcn07XG59XG5cbmZ1bmN0aW9uIGZpbmRDcHUocGFyc2VyOiBhbnkpOiBDcHUge1xuXHRjb25zdCB7YXJjaGl0ZWN0dXJlfSA9IHBhcnNlci5nZXRDUFUoKTtcblx0cmV0dXJuIHthcmNoaXRlY3R1cmV9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmluZEJyb3dzZXJJbmZvKCk6IEJyb3dzZXJJbmZvIHtcblx0Y29uc3QgdWEgPSBuZXcgcGFyc2VyKCk7XG5cdHJldHVybiB7XG5cdFx0dWE6IHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50LFxuXHRcdHNjcmVlbl9zaXplOiB7XG5cdFx0XHR3aWR0aDogc2NyZWVuLndpZHRoIHx8IDAsXG5cdFx0XHRoZWlnaHQ6IHNjcmVlbi5oZWlnaHQgfHwgMFxuXHRcdH0sXG5cdFx0YnJvd3NlcjogZmluZEJyb3dzZXIoKSxcblx0XHRvczogZmluZE9wZXJhdGluZ1N5c3RlbSh1YSksXG5cdFx0ZGV2aWNlOiBmaW5kRGV2aWNlKHVhKSxcblx0XHRjcHU6IGZpbmRDcHUodWEpXG5cdH07XG59IiwiaW1wb3J0IHsgVXJsUGFyc2VyIH0gZnJvbSBcIi4vVXJsUGFyc2VyXCI7XG5pbXBvcnQgSUNhbXBhaWduSW5mbyBmcm9tIFwiLi9pbnRlZmFjZXMvSUNhbXBhaWduSW5mb1wiO1xuXG4vKipcbiAqIFJlYWRzIGFuZCBkZWNvZGVzIGEgdG9rZW4gc3RyaW5nIHRvIGV4dHJhY3QgY2FtcGFpZ24gaW5mb3JtYXRpb24uXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IFt0b2tlblN0cmluZ10gLSBUaGUgdG9rZW4gc3RyaW5nIHRvIGJlIGRlY29kZWQuXG4gKiBAcGFyYW0ge3N0cmluZ30gW2ZpbGVUeXBlXSAtIFRoZSB0eXBlIG9mIGZpbGUgYXNzb2NpYXRlZCB3aXRoIHRoZSBjYW1wYWlnbi5cbiAqIEByZXR1cm5zIHtJQ2FtcGFpZ25JbmZvfSAtIFRoZSBkZWNvZGVkIGNhbXBhaWduIGluZm9ybWF0aW9uLlxuICovXG5mdW5jdGlvbiByZWFkVG9rZW5TdHJpbmcodG9rZW5TdHJpbmcgPzogc3RyaW5nLCBmaWxlVHlwZSA/OiBzdHJpbmcpOiBJQ2FtcGFpZ25JbmZvIHtcblx0Y29uc3QgYmFzZTY0VXJsID0gdG9rZW5TdHJpbmcuc3BsaXQoXCIuXCIpWzFdO1xuXHRjb25zdCBiYXNlNjQgPSAgYmFzZTY0VXJsLnJlcGxhY2UoLy0vZywgXCIrXCIpLnJlcGxhY2UoL18vZywgXCIvXCIpO1xuXHRjb25zdCBjYW1wYWlnbkluZm8gPSBKU09OLnBhcnNlKHdpbmRvdy5hdG9iKGJhc2U2NCkpLnBheWxvYWQgYXMgSUNhbXBhaWduSW5mbztcblxuXHRpZiAoZmlsZVR5cGUgPT09IFwiYXR0YWNobWVudFwiKSB7XG5cdFx0Y2FtcGFpZ25JbmZvLmRvd25sb2FkX3R5cGUgPSBcImF0dGFjaG1lbnRcIjtcblx0fSBlbHNlIGlmIChmaWxlVHlwZSAhPT0gbnVsbCkge1xuXHRcdGNhbXBhaWduSW5mby5kb3dubG9hZF90eXBlID0gXCJmaWxlXCI7XG5cdH1cblxuXHRyZXR1cm4gY2FtcGFpZ25JbmZvO1xufVxuXG4vKipcbiAqIEZpbmRzIGFuZCByZXR1cm5zIHRoZSBjYW1wYWlnbiBpbmZvcm1hdGlvbiBmcm9tIHRoZSBVUkwuXG4gKlxuICogQHJldHVybnMge1tzdHJpbmcsIElDYW1wYWlnbkluZm9dfSAtIEEgdHVwbGUgY29udGFpbmluZyB0aGUgdG9rZW4gc3RyaW5nIGFuZCB0aGUgZGVjb2RlZCBjYW1wYWlnbiBpbmZvcm1hdGlvbi5cbiAqIEB0aHJvd3Mge0Vycm9yfSAtIFRocm93cyBhbiBlcnJvciBpZiB0aGUgQVRUQUNLIFNpbXVsYXRvciB0b2tlbiBpcyBtaXNzaW5nLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZmluZENhbXBhaWduSW5mbygpIDogW3N0cmluZywgSUNhbXBhaWduSW5mb10ge1xuXHRjb25zdCB1cmwgPSBuZXcgVXJsUGFyc2VyKHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcblx0Y29uc3QgdG9rZW5TdHJpbmcgPSB1cmwuZmluZFBhcmFtKFwidGtcIik7XG5cdGlmICghdG9rZW5TdHJpbmcpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJNaXNzaW5nIEFUVEFDSyBTaW11bGF0b3IgdG9rZW5cIik7XG5cdH1cblx0Y29uc3QgZmlsZVR5cGUgPSB1cmwuZmluZFBhcmFtKFwiZmlsZV90eXBlXCIpO1xuXG5cdHRyeSB7XG5cdFx0cmV0dXJuIFt0b2tlblN0cmluZywgcmVhZFRva2VuU3RyaW5nKHRva2VuU3RyaW5nLCBmaWxlVHlwZSldO1xuXHR9IGNhdGNoKGUpIHtcblx0XHRyZXR1cm4gW3Rva2VuU3RyaW5nLCB7IGF0c19jb21wYW55X2lkOiBcIlwiIH1dO1xuXHR9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBMb2dnZXIge1xuXHRwcml2YXRlIGRlYnVnOiBib29sZWFuO1xuXHRjb25zdHJ1Y3RvcihkZWJ1ZzogYm9vbGVhbikge1xuXHRcdHRoaXMuZGVidWcgPSBkZWJ1Zztcblx0fVxuXG5cdHB1YmxpYyBpbmZvKG1lc3NhZ2U6IGFueSk6IHZvaWQge1xuXHRcdGlmICh0aGlzLmRlYnVnKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhtZXNzYWdlKTtcblx0XHR9XG5cdH1cblxuXHRwdWJsaWMgZXJyb3IobWVzc2FnZTogYW55KTogdm9pZCB7XG5cdFx0aWYgKHRoaXMuZGVidWcpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IobWVzc2FnZSk7XG5cdFx0fVxuXHR9XG5cblx0cHVibGljIHdhcm4obWVzc2FnZTogYW55KTogdm9pZCB7XG5cdFx0aWYgKHRoaXMuZGVidWcpIHtcblx0XHRcdGNvbnNvbGUud2FybihtZXNzYWdlKTtcblx0XHR9XG5cdH1cbn0iLCJpbXBvcnQgeyBCcm93c2VySW5mbywgZmluZEJyb3dzZXJJbmZvIH0gZnJvbSBcIi4vQnJvd3NlckluZm9cIjtcbmltcG9ydCB7IGZpbmRDYW1wYWlnbkluZm8gfSBmcm9tIFwiLi9DYW1wYWlnbkluZm9cIjtcbmltcG9ydCB7IGNyZWF0ZVVVSUQsIGRlYm91bmNlIH0gZnJvbSBcIi4vVG9vbHNcIjsgXG5cbmltcG9ydCBBdHRhY2htZW50T3BlbiBmcm9tIFwiLi9ldmVudHMvQXR0YWNobWVudE9wZW5cIjtcbmltcG9ydCBDbGljayBmcm9tIFwiLi9ldmVudHMvQ2xpY2tcIjtcbmltcG9ydCBEb3dubG9hZCBmcm9tIFwiLi9ldmVudHMvRG93bmxvYWRcIjtcbmltcG9ydCBFeHRlbnNpb24gZnJvbSBcIi4vZXZlbnRzL0V4dGVuc2lvblwiO1xuaW1wb3J0IEZpbGVEb3dubG9hZCBmcm9tIFwiLi9ldmVudHMvRmlsZURvd25sb2FkXCI7XG5pbXBvcnQgRmlsZU9wZW4gZnJvbSBcIi4vZXZlbnRzL0ZpbGVPcGVuXCI7XG5pbXBvcnQgSW5wdXQgZnJvbSBcIi4vZXZlbnRzL0lucHV0XCI7XG5pbXBvcnQgTWljcm9waG9uZSBmcm9tIFwiLi9ldmVudHMvTWljcm9waG9uZVwiO1xuaW1wb3J0IE5vdGlmaWNhdGlvbiBmcm9tIFwiLi9ldmVudHMvTm90aWZpY2F0aW9uXCI7XG5pbXBvcnQgUGFnZUxlZnQgZnJvbSBcIi4vZXZlbnRzL1BhZ2VMZWZ0XCI7XG5pbXBvcnQgUGFnZUxvYWRlZCBmcm9tIFwiLi9ldmVudHMvUGFnZUxvYWRlZFwiO1xuaW1wb3J0IFBhZ2VSZWFkIGZyb20gXCIuL2V2ZW50cy9QYWdlUmVhZFwiO1xuaW1wb3J0IFN1Ym1pdCBmcm9tIFwiLi9ldmVudHMvU3VibWl0XCI7XG5pbXBvcnQgV2ViY2FtIGZyb20gXCIuL2V2ZW50cy9XZWJjYW1cIjtcbmltcG9ydCBMb2NhdGlvbiBmcm9tIFwiLi9ldmVudHMvTG9jYXRpb25cIjtcbmltcG9ydCBDbGlwYm9hcmQgZnJvbSBcIi4vZXZlbnRzL0NsaXBib2FyZFwiO1xuXG5pbXBvcnQgSUV2ZW50IGZyb20gXCIuL2ludGVmYWNlcy9JRXZlbnRcIjtcblxuaW1wb3J0IElFdmVudFBheWxvYWQgZnJvbSBcIi4vaW50ZWZhY2VzL0lFdmVudFBheWxvYWRcIjtcbmltcG9ydCBSZW1vdGUgZnJvbSBcIi4vUmVtb3RlXCI7XG5cbmltcG9ydCBMb2dnZXIgZnJvbSBcIi4vTG9nZ2VyXCI7XG5pbXBvcnQgSU9wdGlvbnMgZnJvbSBcIi4vaW50ZWZhY2VzL0lPcHRpb25cIjtcbmltcG9ydCBJQ2FtcGFpZ25JbmZvIGZyb20gXCIuL2ludGVmYWNlcy9JQ2FtcGFpZ25JbmZvXCI7XG5cbmludGVyZmFjZSBFdmVudFN1YnNjcmlwdGlvbiB7XG5cdGV2ZW50TmFtZTogc3RyaW5nO1xuXHRjYWxsYmFjazogKGV2ZW50OiBJRXZlbnQpID0+IHZvaWQ7XG59XG5cbmV4cG9ydCBjbGFzcyBNYW5hZ2VyIHtcblx0cHJpdmF0ZSByZWFkb25seSBzdXBwb3J0ZWRUeXBlcyA6IHN0cmluZ1tdID0gW1wiZW1haWxcIiwgXCJwYXNzd29yZFwiLCBcInRlbFwiLCBcInRleHRcIiwgXCJnaXZlbi1uYW1lXCIsIFwibmFtZVwiLCBcImZhbWlseS1uYW1lXCIsIFwic3RyZWV0LWFkZHJlc3NcIiwgXCJjYy1uYW1lXCIsIFwiY2MtZ2l2ZW4tbmFtZVwiLCBcImNjLWZhbWlseS1uYW1lXCIsIFwiY2MtbnVtYmVyXCIsIFwiY2MtZXhwXCIsIFwiY2MtZXhwLW1vbnRoXCIsIFwiY2MtZXhwLXllYXJcIiwgXCJjYy1jc2NcIiwgXCJjYy10eXBlXCJdO1xuXHRwcml2YXRlIHJlYWRvbmx5IHN1cHBvcnRlZEV2ZW50cyA9IHtcblx0XHRcImF0dGFjaG1lbnRfb3BlbmVkXCI6IEF0dGFjaG1lbnRPcGVuLFxuXHRcdFwiYnV0dG9uX2NsaWNrZWRcIjogQ2xpY2ssXG5cdFx0XCJkb3dubG9hZFwiOiBEb3dubG9hZCxcblx0XHRcImV4dGVuc2lvbl9pbnN0YWxsZWRcIjogRXh0ZW5zaW9uLFxuXHRcdFwiZmlsZV9kb3dubG9hZFwiOiBGaWxlRG93bmxvYWQsXHRcdFxuXHRcdFwiZmlsZV9vcGVuXCI6IEZpbGVPcGVuLFxuXHRcdFwiaW5wdXRfZmlsbGVkXCI6IElucHV0LFxuXHRcdFwicGFnZV9sZWZ0XCI6IFBhZ2VMZWZ0LFxuXHRcdFwicGFnZV9sb2FkZWRcIjogUGFnZUxvYWRlZCxcblx0XHRcInBhZ2VfcmVhZFwiOiBQYWdlUmVhZCxcblx0XHRcIm1pY19hY2NlcHRlZFwiOiBNaWNyb3Bob25lLFxuXHRcdFwibm90aWZpY2F0aW9uX2FjY2VwdGVkXCI6IE5vdGlmaWNhdGlvbixcblx0XHRcImZvcm1fc3VibWl0dGVkXCI6IFN1Ym1pdCxcblx0XHRcIndlYmNhbV9hY2NlcHRlZFwiOiBXZWJjYW0sXG5cdFx0XCJsb2NhdGlvbl9hY2NlcHRlZFwiOiBMb2NhdGlvbixcblx0XHRcImNsaXBib2FyZF9hY2NlcHRlZFwiOiBDbGlwYm9hcmQsXG5cdH07XG5cdHByaXZhdGUgcmVhZG9ubHkgYnJvd3NlckluZm86IEJyb3dzZXJJbmZvO1xuXHRwcml2YXRlIHJlYWRvbmx5IGNhbXBhaWduSW5mbzogSUNhbXBhaWduSW5mbztcblx0cHJpdmF0ZSByZWFkb25seSByZWRpcmVjdFVybDogc3RyaW5nO1xuXHRwcml2YXRlIHJlYWRvbmx5IHNob3VsZFJlZGlyZWN0OiBib29sZWFuO1xuXHRwcml2YXRlIHJlYWRvbmx5IHJlbW90ZTogUmVtb3RlO1xuXHRwcml2YXRlIHJlYWRvbmx5IHNvdXJjZTogc3RyaW5nO1xuXHRwcml2YXRlIHJlYWRvbmx5IHRva2VuOiBzdHJpbmc7XG5cblx0cHJpdmF0ZSBzdWJzY3JpcHRpb25zOiBFdmVudFN1YnNjcmlwdGlvbltdID0gW107XG5cblx0cHJpdmF0ZSBsb2dnZXI6IExvZ2dlcjtcblx0cHJpdmF0ZSBoYW5kbGVycyA9IFtdO1xuXHRwcml2YXRlIGRpc2FibGVkRXZlbnRzID0gW107XG5cdHByaXZhdGUgYWN0aXZlRXZlbnRzOiBJRXZlbnRbXTtcblx0cHJpdmF0ZSBleHRyYVBheWxvYWQ6IG9iamVjdCA9IHt9O1xuXG5cdGNvbnN0cnVjdG9yKHJlbW90ZTogUmVtb3RlLCB7IGV2ZW50c1RvSW5jbHVkZSA9IFtdLCBldmVudHNUb0V4Y2x1ZGUgPSBbXSwgc291cmNlLCByZWRpcmVjdFVybCwgc2hvdWxkUmVkaXJlY3QsIGV4dHJhUGF5bG9hZCwgZGVidWcgPSBmYWxzZSB9OiBJT3B0aW9ucykge1xuXHRcdHRoaXMubG9nZ2VyID0gbmV3IExvZ2dlcihkZWJ1Zyk7XG5cblx0XHR0aGlzLnJlbW90ZSA9IHJlbW90ZTtcblx0XHRbdGhpcy50b2tlbiwgdGhpcy5jYW1wYWlnbkluZm9dID0gZmluZENhbXBhaWduSW5mbygpO1xuXHRcdHRoaXMuYnJvd3NlckluZm8gPSBmaW5kQnJvd3NlckluZm8oKTtcblxuXHRcdHRoaXMuYWN0aXZlRXZlbnRzID0gdGhpcy5kZWNpZGVBY3RpdmVFdmVudHMoZXZlbnRzVG9JbmNsdWRlLCBldmVudHNUb0V4Y2x1ZGUpO1xuXHRcdHRoaXMubG9nZ2VyLmluZm8oYEVuYWJsZWQgZXZlbnRzOiAke2V2ZW50c1RvSW5jbHVkZS5qb2luKFwiIHwgXCIpfWApO1xuXG5cdFx0dGhpcy5zb3VyY2UgPSBzb3VyY2U7XG5cdFx0dGhpcy5yZWRpcmVjdFVybCA9IHJlZGlyZWN0VXJsO1xuXHRcdHRoaXMuc2hvdWxkUmVkaXJlY3QgPSBzaG91bGRSZWRpcmVjdDtcblx0XHR0aGlzLmV4dHJhUGF5bG9hZCA9IGV4dHJhUGF5bG9hZDtcblxuXHRcdGlmICh0aGlzLmNhbXBhaWduSW5mbz8uZG93bmxvYWRfdHlwZSkge1xuXHRcdFx0dGhpcy5jaGVja0Rvd25sb2FkKCkudGhlbigoKSA9PiB7XG5cdFx0XHRcdC8vXG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogRGVjaWRlcyB3aGljaCBldmVudHMgc2hvdWxkIGJlIGFjdGl2ZSBiYXNlZCBvbiB0aGUgcHJvdmlkZWQgbGlzdHMgb2YgZXZlbnRzIHRvIGluY2x1ZGUgYW5kIGV4Y2x1ZGUuXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nW119IGV2ZW50c1RvSW5jbHVkZSAtIFRoZSBsaXN0IG9mIGV2ZW50IG5hbWVzIHRvIGluY2x1ZGUuXG5cdCAqIEBwYXJhbSB7c3RyaW5nW119IGV2ZW50c1RvRXhjbHVkZSAtIFRoZSBsaXN0IG9mIGV2ZW50IG5hbWVzIHRvIGV4Y2x1ZGUuXG5cdCAqIEByZXR1cm5zIHtJRXZlbnRbXX0gLSBUaGUgbGlzdCBvZiBhY3RpdmUgZXZlbnRzLlxuXHQgKi9cblx0cHJpdmF0ZSBkZWNpZGVBY3RpdmVFdmVudHMoZXZlbnRzVG9JbmNsdWRlOiBzdHJpbmdbXSwgZXZlbnRzVG9FeGNsdWRlOiBzdHJpbmdbXSk6IElFdmVudFtdIHtcblx0XHRpZiAoZXZlbnRzVG9JbmNsdWRlLmxlbmd0aCkge1xuXHRcdFx0cmV0dXJuIGV2ZW50c1RvSW5jbHVkZS5tYXAobmFtZSA9PiB0aGlzLmdldEV2ZW50KG5hbWUpKS5maWx0ZXIoZXZlbnQgPT4gZXZlbnQgIT09IG51bGwpO1xuXHRcdH1cblxuXHRcdGNvbnN0IGFjdGl2ZUV2ZW50cyA9IE9iamVjdC5rZXlzKHRoaXMuc3VwcG9ydGVkRXZlbnRzKS5tYXAobmFtZSA9PiB0aGlzLmdldEV2ZW50KG5hbWUpKS5maWx0ZXIoZXZlbnQgPT4gZXZlbnQgIT09IG51bGwpO1xuXG5cdFx0aWYgKGV2ZW50c1RvRXhjbHVkZS5sZW5ndGgpIHtcblx0XHRcdHJldHVybiBhY3RpdmVFdmVudHMuZmlsdGVyKGV2ZW50ID0+ICFldmVudHNUb0V4Y2x1ZGUuaW5jbHVkZXMoZXZlbnQubmFtZSkpO1xuXHRcdH1cblxuXHRcdHJldHVybiBhY3RpdmVFdmVudHM7XG5cdH1cblxuXHQvKipcblx0ICogUmV0cmlldmVzIGFuIGV2ZW50IGluc3RhbmNlIGJ5IGl0cyBuYW1lLlxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBldmVudCB0byByZXRyaWV2ZS5cblx0ICogQHJldHVybnMge0lFdmVudCB8IG51bGx9IC0gVGhlIGV2ZW50IGluc3RhbmNlIGlmIGZvdW5kLCBvdGhlcndpc2UgbnVsbC5cblx0ICovXG5cdHByaXZhdGUgZ2V0RXZlbnQobmFtZTogc3RyaW5nKSB7XG5cdFx0aWYgKCEgdGhpcy5zdXBwb3J0ZWRFdmVudHNbbmFtZV0pIHtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblxuXHRcdHJldHVybiBuZXcgKHRoaXMuc3VwcG9ydGVkRXZlbnRzW25hbWVdKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDaGVja3MgdGhlIHR5cGUgb2YgZG93bmxvYWQgc3BlY2lmaWVkIGluIHRoZSBjYW1wYWlnbiBpbmZvcm1hdGlvbiBhbmQgdHJpZ2dlcnMgdGhlIGNvcnJlc3BvbmRpbmcgZXZlbnQuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHtQcm9taXNlPHZvaWQ+fSAtIEEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHdoZW4gdGhlIGFwcHJvcHJpYXRlIGV2ZW50IGlzIHRyaWdnZXJlZC5cblx0ICovXG5cdHByaXZhdGUgY2hlY2tEb3dubG9hZCgpIHtcblx0XHRzd2l0Y2ggKHRoaXMuY2FtcGFpZ25JbmZvLmRvd25sb2FkX3R5cGUpIHtcblx0XHRjYXNlIFwiZmlsZVwiOlxuXHRcdFx0cmV0dXJuIHRoaXMudHJpZ2dlcihcImZpbGVfb3BlbmVkXCIpO1xuXHRcdGNhc2UgXCJhdHRhY2htZW50XCI6XG5cdFx0XHRyZXR1cm4gdGhpcy50cmlnZ2VyKFwiYXR0YWNobWVudF9vcGVuZWRcIik7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFN0YXJ0cyBsaXN0ZW5pbmcgZm9yIHRoZSBhY3RpdmUgZXZlbnRzIGFuZCBzZXRzIHVwIHRoZSBldmVudCBoYW5kbGVycy5cblx0ICovXG5cdHB1YmxpYyBsaXN0ZW4oKSB7XG5cdFx0bGV0IGkgPSAwO1xuXHRcdGZvcihjb25zdCBhY3RpdmVFdmVudCBvZiB0aGlzLmFjdGl2ZUV2ZW50cykge1xuXHRcdFx0aWYgKCEgYWN0aXZlRXZlbnQudHJpZ2dlcikge1xuXHRcdFx0XHR0aGlzLmxvZ2dlci5pbmZvKGBUaGUgYWN0aXZlIGV2ZW50ICR7YWN0aXZlRXZlbnQubmFtZX0gZG9lcyBub3QgaGF2ZSBhIHRyaWdnZXIuIFNraXBwaW5nLi4uYCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLmxvZ2dlci5pbmZvKGBMaXN0ZW5pbmcgZm9yIGV2ZW50IEAke2FjdGl2ZUV2ZW50LnRyaWdnZXJ9ICgke2FjdGl2ZUV2ZW50Lm5hbWV9KWApO1xuXHRcdFx0XHRhY3RpdmVFdmVudC5zb3VyY2UuYWRkRXZlbnRMaXN0ZW5lcihhY3RpdmVFdmVudC50cmlnZ2VyLCB0aGlzLmhhbmRsZXJzW2krK10gPSAoZXZlbnQ6IEV2ZW50KSA9PiB0aGlzLnByZWhhbmRsZShhY3RpdmVFdmVudCwgZXZlbnQpKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogU3RvcHMgbGlzdGVuaW5nIGZvciB0aGUgYWN0aXZlIGV2ZW50cyBhbmQgcmVtb3ZlcyB0aGUgZXZlbnQgaGFuZGxlcnMuXG5cdCAqL1xuXHRwdWJsaWMgc3RvcCgpIHtcblx0XHRsZXQgaSA9IDA7XG5cdFx0Zm9yKGNvbnN0IGFjdGl2ZUV2ZW50IG9mIHRoaXMuYWN0aXZlRXZlbnRzKSB7XG5cdFx0XHRpZiAoISBhY3RpdmVFdmVudC50cmlnZ2VyKSB7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLmxvZ2dlci5pbmZvKGBTdG9wcGluZyBsaXN0ZW5pbmcgZm9yIGV2ZW50IEAke2FjdGl2ZUV2ZW50LnRyaWdnZXJ9ICgke2FjdGl2ZUV2ZW50Lm5hbWV9KWApOyAgICAgICAgXG5cdFx0XHRhY3RpdmVFdmVudC5zb3VyY2UucmVtb3ZlRXZlbnRMaXN0ZW5lcihhY3RpdmVFdmVudC50cmlnZ2VyLCB0aGlzLmhhbmRsZXJzW2krK10pO1xuXHRcdH1cblx0fVxuXHQvKipcblx0ICogTWFudWFsbHkgdHJpZ2dlcnMgdGhlIHNwZWNpZmllZCBldmVudCBieSBpdHMgbmFtZS5cblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50TmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBldmVudCB0byB0cmlnZ2VyLlxuXHQgKiBAcmV0dXJucyB7UHJvbWlzZTx2b2lkPn0gLSBBIHByb21pc2UgdGhhdCByZXNvbHZlcyB3aGVuIHRoZSBldmVudCBpcyBleGVjdXRlZC5cblx0ICogQHRocm93cyB7RXJyb3J9IC0gVGhyb3dzIGFuIGVycm9yIGlmIHRoZSBldmVudCBpcyB1bnN1cHBvcnRlZC5cblx0ICovXG5cdHB1YmxpYyB0cmlnZ2VyKGV2ZW50TmFtZTogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG5cdFx0Y29uc3QgYWN0aXZlRXZlbnQgPSB0aGlzLmdldEV2ZW50KGV2ZW50TmFtZSk7XG5cdFx0aWYgKCFhY3RpdmVFdmVudCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBldmVudCAke2V2ZW50TmFtZX0uIFBsZWFzZSBjaG9vc2Ugb25lIG9mICR7T2JqZWN0LmtleXModGhpcy5zdXBwb3J0ZWRFdmVudHMpLmpvaW4oXCIsIFwiKX1gKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcy5leGVjdXRlRXZlbnQoYWN0aXZlRXZlbnQsIG51bGwsIGZhbHNlKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBQcmUtaGFuZGxlcyB0aGUgZXZlbnQgYnkgZGVib3VuY2luZyBpdCBpZiBuZWNlc3NhcnksIG90aGVyd2lzZSBkaXJlY3RseSBoYW5kbGVzIGl0LlxuXHQgKlxuXHQgKiBAcGFyYW0ge0lFdmVudH0gYWN0aXZlRXZlbnQgLSBUaGUgYWN0aXZlIGV2ZW50IHRvIGJlIHByZS1oYW5kbGVkLlxuXHQgKiBAcGFyYW0ge0V2ZW50fSBbZXZlbnRdIC0gVGhlIG9wdGlvbmFsIGV2ZW50IG9iamVjdC5cblx0ICovXG5cdHByaXZhdGUgcHJlaGFuZGxlKGFjdGl2ZUV2ZW50OiBJRXZlbnQsIGV2ZW50PzogRXZlbnQpIHtcdFx0XG5cdFx0aWYgKGFjdGl2ZUV2ZW50LnNob3VsZERlYm91bmNlKSB7XG5cdFx0XHRkZWJvdW5jZSgoLi4uYXJnczogW0lFdmVudCwgRXZlbnRdKSA9PiB0aGlzLmhhbmRsZSguLi5hcmdzKSwgNTAwLCBhY3RpdmVFdmVudCwgZXZlbnQpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLmhhbmRsZShhY3RpdmVFdmVudCwgZXZlbnQpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBGaW5kcyB0aGUgdHlwZSBvZiB0aGUgaW5wdXQgZWxlbWVudCBhc3NvY2lhdGVkIHdpdGggdGhlIGFjdGl2ZSBldmVudC5cblx0ICpcblx0ICogQHBhcmFtIHtJRXZlbnR9IGFjdGl2ZUV2ZW50IC0gVGhlIGFjdGl2ZSBldmVudCB0byBmaW5kIHRoZSB0eXBlIGZvci5cblx0ICogQHBhcmFtIHtFdmVudH0gW2V2ZW50XSAtIFRoZSBvcHRpb25hbCBldmVudCBvYmplY3QuXG5cdCAqIEByZXR1cm5zIHtzdHJpbmcgfCBudWxsfSAtIFRoZSB0eXBlIG9mIHRoZSBpbnB1dCBlbGVtZW50IGlmIGZvdW5kLCBvdGhlcndpc2UgbnVsbC5cblx0ICovXG5cdHByaXZhdGUgZmluZFR5cGUoYWN0aXZlRXZlbnQ6IElFdmVudCwgZXZlbnQ/OiBFdmVudCk6IHN0cmluZyB8IG51bGwge1xuXHRcdGlmICghYWN0aXZlRXZlbnQuaGFzVHlwZXMgfHwgIWV2ZW50KSB7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cblx0XHRjb25zdCBpbnB1dEVsZW1lbnQgPSBldmVudC50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudDtcblx0XHRcblx0XHRjb25zdCB0eXBlID0gaW5wdXRFbGVtZW50LmdldEF0dHJpYnV0ZShcImF1dG9jb21wbGV0ZVwiKSB8fCBpbnB1dEVsZW1lbnQudHlwZTtcdFxuXHRcdFxuXHRcdGlmICh0aGlzLnN1cHBvcnRlZFR5cGVzLmluZGV4T2YodHlwZSkgIT09IC0xKSB7XG5cdFx0XHRyZXR1cm4gdHlwZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXG5cdC8qKlxuXHQgKiBGaW5kcyB0aGUgbmFtZSBvZiB0aGUgYWN0aXZlIGV2ZW50LCBvcHRpb25hbGx5IGluY2x1ZGluZyB0aGUgdHlwZSBpZiBhdmFpbGFibGUuXG5cdCAqXG5cdCAqIEBwYXJhbSB7SUV2ZW50fSBhY3RpdmVFdmVudCAtIFRoZSBhY3RpdmUgZXZlbnQgdG8gZmluZCB0aGUgbmFtZSBmb3IuXG5cdCAqIEBwYXJhbSB7RXZlbnR9IFtldmVudF0gLSBUaGUgb3B0aW9uYWwgZXZlbnQgb2JqZWN0LlxuXHQgKiBAcmV0dXJucyB7c3RyaW5nfSAtIFRoZSBuYW1lIG9mIHRoZSBhY3RpdmUgZXZlbnQsIG9wdGlvbmFsbHkgaW5jbHVkaW5nIHRoZSB0eXBlLlxuXHQgKi9cblx0cHJpdmF0ZSBmaW5kTmFtZShhY3RpdmVFdmVudDogSUV2ZW50LCBldmVudD86IEV2ZW50KTogc3RyaW5nIHtcblx0XHRjb25zdCB0eXBlID0gdGhpcy5maW5kVHlwZShhY3RpdmVFdmVudCwgZXZlbnQpO1xuXHRcdGlmICghdHlwZSkge1xuXHRcdFx0cmV0dXJuIGFjdGl2ZUV2ZW50Lm5hbWU7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGAke2FjdGl2ZUV2ZW50Lm5hbWV9LSR7dHlwZX1gO1xuXHR9XG5cblx0LyoqXG5cdCAqIFBhY2tzIHRoZSBldmVudCBkYXRhIGludG8gYW4gYElFdmVudFBheWxvYWRgIG9iamVjdC5cblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IHR5cGUgLSBUaGUgdHlwZSBvZiB0aGUgZXZlbnQuXG5cdCAqIEBwYXJhbSB7SUV2ZW50fSBhY3RpdmVFdmVudCAtIFRoZSBhY3RpdmUgZXZlbnQgdG8gYmUgcGFja2VkLlxuXHQgKiBAcmV0dXJucyB7SUV2ZW50UGF5bG9hZH0gLSBUaGUgcGFja2VkIGV2ZW50IHBheWxvYWQuXG5cdCAqL1xuXHRwcml2YXRlIHBhY2tFdmVudCh0eXBlOiBzdHJpbmcsIGFjdGl2ZUV2ZW50OiBJRXZlbnQpOiBJRXZlbnRQYXlsb2FkIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0XCJkYXRhXCI6IHtcblx0XHRcdFx0Li4udGhpcy5icm93c2VySW5mbyxcblx0XHRcdFx0dHlwZSxcblx0XHRcdH0sXG5cdFx0XHRcInNvdXJjZVwiOiB0aGlzLnNvdXJjZSxcblx0XHRcdFwidGltZXN0YW1wXCI6IE1hdGguZmxvb3IoRGF0ZS5ub3coKSAvIDEwMDApLFxuXHRcdFx0XCJhdHNfaGVhZGVyXCI6IHRoaXMudG9rZW4sXG5cdFx0XHRcImV2ZW50XCI6IGFjdGl2ZUV2ZW50Lm5hbWUudG9Mb3dlckNhc2UoKSxcblx0XHRcdFwic2dfZXZlbnRfaWRcIjogY3JlYXRlVVVJRCgpLFxuXHRcdFx0XCJzZ19tZXNzYWdlX2lkXCI6IHRoaXMuY2FtcGFpZ25JbmZvLmF0c19pbnN0YW5jZV9pZCxcblx0XHRcdC4uLnRoaXMuZXh0cmFQYXlsb2FkLFxuXHRcdH07XG5cdH1cblxuXHQvKipcblx0ICogSGFuZGxlcyB0aGUgYWN0aXZlIGV2ZW50IGJ5IGV4ZWN1dGluZyBpdCwgb3B0aW9uYWxseSB2YWxpZGF0aW5nIGl0IGZpcnN0LlxuXHQgKlxuXHQgKiBAcGFyYW0ge0lFdmVudH0gYWN0aXZlRXZlbnQgLSBUaGUgYWN0aXZlIGV2ZW50IHRvIGhhbmRsZS5cblx0ICogQHBhcmFtIHtFdmVudH0gW2V2ZW50XSAtIFRoZSBvcHRpb25hbCBldmVudCBvYmplY3QuXG5cdCAqIEBwYXJhbSB7Ym9vbGVhbn0gW3Nob3VsZFZhbGlkYXRlPXRydWVdIC0gV2hldGhlciB0byB2YWxpZGF0ZSB0aGUgZXZlbnQgYmVmb3JlIGhhbmRsaW5nIGl0LlxuXHQgKi9cblx0cHJpdmF0ZSBoYW5kbGUoYWN0aXZlRXZlbnQ6IElFdmVudCwgZXZlbnQ/OiBFdmVudCwgc2hvdWxkVmFsaWRhdGUgPSB0cnVlKTogdm9pZCB7XG5cdFx0dGhpcy5leGVjdXRlRXZlbnQoYWN0aXZlRXZlbnQsIGV2ZW50LCBzaG91bGRWYWxpZGF0ZSlcblx0XHRcdC5jYXRjaChlID0+IHRoaXMubG9nZ2VyLmVycm9yKGUpKTtcdFx0XHRcblx0fVxuXG5cdC8qKlxuXHQgKiBDaGVja3MgaWYgdGhlIGFjdGl2ZSBldmVudCBpcyB2YWxpZCwgb3B0aW9uYWxseSB2YWxpZGF0aW5nIGl0IGZpcnN0LlxuXHQgKlxuXHQgKiBAcGFyYW0ge0lFdmVudH0gYWN0aXZlRXZlbnQgLSBUaGUgYWN0aXZlIGV2ZW50IHRvIGNoZWNrLlxuXHQgKiBAcGFyYW0ge0V2ZW50fSBldmVudCAtIFRoZSBldmVudCBvYmplY3QuXG5cdCAqIEBwYXJhbSB7Ym9vbGVhbn0gW3Nob3VsZFZhbGlkYXRlPXRydWVdIC0gV2hldGhlciB0byB2YWxpZGF0ZSB0aGUgZXZlbnQgYmVmb3JlIGNoZWNraW5nIGl0LlxuXHQgKiBAdGhyb3dzIHtFcnJvcn0gLSBUaHJvd3MgYW4gZXJyb3IgaWYgdGhlIGV2ZW50IGlzIG5vdCB2YWxpZCBhbmQgc2hvdWxkIGJlIHZhbGlkYXRlZC5cblx0ICovXG5cdHByaXZhdGUgY2hlY2tFdmVudChhY3RpdmVFdmVudDogSUV2ZW50LCBldmVudDogRXZlbnQsIHNob3VsZFZhbGlkYXRlID0gdHJ1ZSk6IHZvaWQge1xuXHRcdGlmICghIGFjdGl2ZUV2ZW50LmlzVmFsaWQoZXZlbnQpICYmIHNob3VsZFZhbGlkYXRlKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEV2ZW50IEAke2FjdGl2ZUV2ZW50LnRyaWdnZXJ9ICgke2FjdGl2ZUV2ZW50Lm5hbWV9KSBub3QgdmFsaWQuLi5gKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogQ2hlY2tzIGlmIHRoZSBhY3RpdmUgZXZlbnQgYWxsb3dzIG11bHRpcGxlIGluc3RhbmNlcyBhbmQgcHJldmVudHMgZHVwbGljYXRlcy5cblx0ICpcblx0ICogQHBhcmFtIHtJRXZlbnR9IGFjdGl2ZUV2ZW50IC0gVGhlIGFjdGl2ZSBldmVudCB0byBjaGVjay5cblx0ICogQHBhcmFtIHtFdmVudH0gW2V2ZW50XSAtIFRoZSBvcHRpb25hbCBldmVudCBvYmplY3QuXG5cdCAqIEB0aHJvd3Mge0Vycm9yfSAtIFRocm93cyBhbiBlcnJvciBpZiB0aGUgZXZlbnQgZG9lcyBub3QgYWxsb3cgbXVsdGlwbGUgaW5zdGFuY2VzIGFuZCBhIGR1cGxpY2F0ZSBpcyBmb3VuZC5cblx0ICovXG5cdHByaXZhdGUgY2hlY2tNdWx0aXBsZShhY3RpdmVFdmVudDogSUV2ZW50LCBldmVudD86IEV2ZW50KTogdm9pZCB7XG5cdFx0aWYgKCFhY3RpdmVFdmVudC5hbGxvd011bHRpcGxlKSB7XG5cdFx0XHRjb25zdCBuYW1lID0gdGhpcy5maW5kTmFtZShhY3RpdmVFdmVudCwgZXZlbnQpO1xuXHRcdFx0aWYgKHRoaXMuZGlzYWJsZWRFdmVudHMuaW5jbHVkZXMobmFtZSkpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBQcmV2ZW50aW5nIGR1cGxpY2F0ZSBldmVudCBAJHthY3RpdmVFdmVudC50cmlnZ2VyfSAoJHtuYW1lfSkuYCk7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuZGlzYWJsZWRFdmVudHMucHVzaChuYW1lKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogRXhlY3V0ZXMgdGhlIGFjdGl2ZSBldmVudCwgb3B0aW9uYWxseSB2YWxpZGF0aW5nIGl0IGZpcnN0LlxuXHQgKlxuXHQgKiBAcGFyYW0ge0lFdmVudH0gYWN0aXZlRXZlbnQgLSBUaGUgYWN0aXZlIGV2ZW50IHRvIGV4ZWN1dGUuXG5cdCAqIEBwYXJhbSB7RXZlbnR9IFtldmVudF0gLSBUaGUgb3B0aW9uYWwgZXZlbnQgb2JqZWN0LlxuXHQgKiBAcGFyYW0ge2Jvb2xlYW59IFtzaG91bGRWYWxpZGF0ZT10cnVlXSAtIFdoZXRoZXIgdG8gdmFsaWRhdGUgdGhlIGV2ZW50IGJlZm9yZSBleGVjdXRpbmcgaXQuXG5cdCAqIEByZXR1cm5zIHtQcm9taXNlPHZvaWQ+fSAtIEEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHdoZW4gdGhlIGV2ZW50IGlzIGV4ZWN1dGVkLlxuXHQgKi9cblx0cHJpdmF0ZSBleGVjdXRlRXZlbnQoYWN0aXZlRXZlbnQ6IElFdmVudCwgZXZlbnQ/OiBFdmVudCwgc2hvdWxkVmFsaWRhdGUgPSB0cnVlKTogUHJvbWlzZTx2b2lkPiB7XG5cdFx0dGhpcy5sb2dnZXIuaW5mbyhgRXZlbnQgQCR7YWN0aXZlRXZlbnQudHJpZ2dlcn0gKCR7YWN0aXZlRXZlbnQubmFtZX0pIHRyaWdnZXJlZC4uLmApO1xuXG5cdFx0dHJ5IHtcblx0XHRcdHRoaXMuY2hlY2tFdmVudChhY3RpdmVFdmVudCwgZXZlbnQsIHNob3VsZFZhbGlkYXRlKTtcblx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHR0aGlzLmxvZ2dlci5lcnJvcihlKTtcblx0XHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiByZWplY3QoZSkpO1xuXHRcdH1cblxuXHRcdGlmIChldmVudCAmJiBhY3RpdmVFdmVudC5pc0Jsb2NraW5nKSB7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHRldmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHR9XG5cblx0XHR0cnkge1xuXHRcdFx0dGhpcy5jaGVja011bHRpcGxlKGFjdGl2ZUV2ZW50LCBldmVudCk7XG5cdFx0fSBjYXRjaChlKSB7XG5cdFx0XHR0aGlzLmxvZ2dlci5lcnJvcihlKTtcblx0XHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiByZWplY3QoZSkpO1xuXHRcdH1cblxuXHRcdGNvbnN0IHR5cGUgPSB0aGlzLmZpbmRUeXBlKGFjdGl2ZUV2ZW50LCBldmVudCk7XG5cdFx0Y29uc3QgcGF5bG9hZCA9IHRoaXMucGFja0V2ZW50KHR5cGUsIGFjdGl2ZUV2ZW50KTtcblx0XHR0aGlzLnRyaWdnZXJTdWJzY3JpcHRpb24oYWN0aXZlRXZlbnQpO1xuXG5cdFx0cmV0dXJuIHRoaXMucmVtb3RlLnBvc3QocGF5bG9hZClcblx0XHRcdC50aGVuKHJlc3VsdCA9PiB0aGlzLmxvZ2dlci5pbmZvKHJlc3VsdCkpXG5cdFx0XHQuY2F0Y2goZSA9PiB0aGlzLmxvZ2dlci5lcnJvcihlKSlcblx0XHRcdC5maW5hbGx5KCgpID0+IHtcblx0XHRcdFx0aWYgKGFjdGl2ZUV2ZW50LnJlZGlyZWN0T25GaW5pc2ggJiYgdGhpcy5zaG91bGRSZWRpcmVjdCkge1xuXHRcdFx0XHRcdHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gYCR7dGhpcy5yZWRpcmVjdFVybH0ke3dpbmRvdy5sb2NhdGlvbi5zZWFyY2h9YDtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XHRcdFxuXHR9XG5cblx0Z2V0IHN1cHBvcnRlZEV2ZW50TmFtZXMoKTogc3RyaW5nW10ge1xuXHRcdHJldHVybiBPYmplY3Qua2V5cyh0aGlzLnN1cHBvcnRlZEV2ZW50cyk7XG5cdH1cblxuXHQvKipcblx0ICogU3Vic2NyaWJlcyB0byB0aGUgc3BlY2lmaWVkIGV2ZW50IHdpdGggYSBjYWxsYmFjayBmdW5jdGlvbi5cblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50TmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBldmVudCB0byBzdWJzY3JpYmUgdG8uXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb24oSUV2ZW50KTogdm9pZH0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gdG8gYmUgZXhlY3V0ZWQgd2hlbiB0aGUgZXZlbnQgaXMgdHJpZ2dlcmVkLlxuXHQgKiBAdGhyb3dzIHtFcnJvcn0gLSBUaHJvd3MgYW4gZXJyb3IgaWYgdGhlIGV2ZW50IGlzIHVuc3VwcG9ydGVkLlxuXHQgKi9cblx0cHVibGljIHN1YnNjcmliZShldmVudE5hbWU6IHN0cmluZywgY2FsbGJhY2s6IChldmVudDogSUV2ZW50KSA9PiB2b2lkKSB7XG5cdFx0aWYgKCEgdGhpcy5zdXBwb3J0ZWRFdmVudE5hbWVzLmluY2x1ZGVzKGV2ZW50TmFtZSkpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgZXZlbnQ6ICR7ZXZlbnROYW1lfWApO1xuXHRcdH1cblx0XHRcblx0XHR0aGlzLnN1YnNjcmlwdGlvbnMucHVzaCh7IGV2ZW50TmFtZSwgY2FsbGJhY2t9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBVbnN1YnNjcmliZXMgZnJvbSB0aGUgc3BlY2lmaWVkIGV2ZW50IGJ5IHJlbW92aW5nIHRoZSBjYWxsYmFjayBmdW5jdGlvbi5cblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50TmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBldmVudCB0byB1bnN1YnNjcmliZSBmcm9tLlxuXHQgKiBAcGFyYW0ge2Z1bmN0aW9uKElFdmVudCk6IHZvaWR9IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGJlIHJlbW92ZWQuXG5cdCAqIEB0aHJvd3Mge0Vycm9yfSAtIFRocm93cyBhbiBlcnJvciBpZiB0aGUgZXZlbnQgaXMgdW5zdXBwb3J0ZWQuXG5cdCAqL1xuXHRwdWJsaWMgdW5zdWJzY3JpYmUoZXZlbnROYW1lOiBzdHJpbmcsIGNhbGxiYWNrOiAoZXZlbnQ6IElFdmVudCkgPT4gdm9pZCkge1xuXHRcdGlmICghIHRoaXMuc3VwcG9ydGVkRXZlbnROYW1lcy5pbmNsdWRlcyhldmVudE5hbWUpKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIGV2ZW50OiAke2V2ZW50TmFtZX1gKTtcblx0XHR9XG5cblx0XHQvLyBmaW5kIHRoZSBldmVudCBpbiB0aGUgc3Vic2NyaXB0aW9ucyBhcnJheSBhbmQgcmVtb3ZlIGl0XG5cdFx0Y29uc3QgZXZlbnRJbmRleCA9IHRoaXMuc3Vic2NyaXB0aW9ucy5maW5kSW5kZXgoc3Vic2NyaXB0aW9uID0+IHN1YnNjcmlwdGlvbi5ldmVudE5hbWUgPT09IGV2ZW50TmFtZSAmJiBzdWJzY3JpcHRpb24uY2FsbGJhY2sgPT09IGNhbGxiYWNrKTtcblx0XHRpZiAoZXZlbnRJbmRleCA+PSAwKSB7XG5cdFx0XHR0aGlzLnN1YnNjcmlwdGlvbnMuc3BsaWNlKGV2ZW50SW5kZXgsIDEpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBUcmlnZ2VycyB0aGUgc3Vic2NyaXB0aW9uIGNhbGxiYWNrcyBmb3IgdGhlIHNwZWNpZmllZCBldmVudC5cblx0ICpcblx0ICogQHBhcmFtIHtJRXZlbnR9IGV2ZW50IC0gVGhlIGV2ZW50IGZvciB3aGljaCB0byB0cmlnZ2VyIHRoZSBzdWJzY3JpcHRpb24gY2FsbGJhY2tzLlxuXHQgKi9cblx0cHVibGljIHRyaWdnZXJTdWJzY3JpcHRpb24oZXZlbnQ6IElFdmVudCkge1xuXHRcdGNvbnN0IHN1YnNjcmlwdGlvbnMgPSB0aGlzLnN1YnNjcmlwdGlvbnMuZmlsdGVyKHN1YnNjcmlwdGlvbiA9PiBzdWJzY3JpcHRpb24uZXZlbnROYW1lID09PSBldmVudC5uYW1lKTtcblx0XHRzdWJzY3JpcHRpb25zLmZvckVhY2goc3Vic2NyaXB0aW9uID0+IHN1YnNjcmlwdGlvbi5jYWxsYmFjayhldmVudCkpO1xuXHR9XG59IiwiaW1wb3J0IElFdmVudFBheWxvYWQgZnJvbSBcIi4vaW50ZWZhY2VzL0lFdmVudFBheWxvYWRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVtb3RlIHtcblx0cHJpdmF0ZSBhcGlfa2V5OiBzdHJpbmc7XG5cdHByaXZhdGUgdXJsOiBzdHJpbmc7XG5cdHByaXZhdGUgZGVidWc6IGJvb2xlYW47XG5cblx0Y29uc3RydWN0b3IoYXBpX2tleTogc3RyaW5nLCB1cmw6IHN0cmluZywgZGVidWc6IGJvb2xlYW4pIHtcblx0XHR0aGlzLmFwaV9rZXkgPSBhcGlfa2V5O1xuXHRcdHRoaXMudXJsID0gdXJsO1xuXHRcdHRoaXMuZGVidWcgPSBkZWJ1Zztcblx0fVxuXG5cdC8qKlxuXHQgKiBTZW5kcyBhIFBPU1QgcmVxdWVzdCB3aXRoIHRoZSBzcGVjaWZpZWQgZGF0YSB0byB0aGUgY29uZmlndXJlZCBVUkwuXG5cdCAqXG5cdCAqIEBwYXJhbSB7SUV2ZW50UGF5bG9hZH0gZGF0YSAtIFRoZSBkYXRhIHRvIGJlIHNlbnQgaW4gdGhlIFBPU1QgcmVxdWVzdC5cblx0ICogQHJldHVybnMge1Byb21pc2U8b2JqZWN0fHN0cmluZz59IC0gQSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gdGhlIHJlc3BvbnNlIGRhdGEsIGVpdGhlciBhcyBhbiBvYmplY3QgaWYgdGhlIHJlc3BvbnNlIGlzIEpTT04sIG9yIGFzIGEgc3RyaW5nIG90aGVyd2lzZS5cblx0ICovXG5cdHB1YmxpYyBhc3luYyBwb3N0KGRhdGE6IElFdmVudFBheWxvYWQpOiBQcm9taXNlPG9iamVjdHxzdHJpbmc+IHtcblx0XHRpZiAodGhpcy5kZWJ1Zykge1xuXHRcdFx0Y29uc29sZS5sb2coYFNlbmRpbmcgZXZlbnQgdG8gJHt0aGlzLnVybH0gd2l0aCBkYXRhOmApO1xuXHRcdFx0Y29uc29sZS50YWJsZShkYXRhKTtcblx0XHR9XG5cblx0XHRjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHRoaXMudXJsLCB7XG5cdFx0XHRtZXRob2Q6IFwiUE9TVFwiLFxuXHRcdFx0aGVhZGVyczoge1xuXHRcdFx0XHRcIkNvbnRlbnQtdHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcblx0XHRcdFx0XCJhcGkta2V5XCI6IHRoaXMuYXBpX2tleSxcblx0XHRcdH0sXG5cdFx0XHRrZWVwYWxpdmU6IHRydWUsXG5cdFx0XHRib2R5OiBKU09OLnN0cmluZ2lmeShkYXRhKSxcblx0XHR9KTtcblxuXHRcdGNvbnN0IGNvbnRlbnRUeXBlID0gcmVzcG9uc2UuaGVhZGVycy5nZXQoXCJjb250ZW50LXR5cGVcIik7XG5cdFx0aWYgKGNvbnRlbnRUeXBlICYmIGNvbnRlbnRUeXBlLmluZGV4T2YoXCJhcHBsaWNhdGlvbi9qc29uXCIpICE9PSAtMSkge1xuXHRcdFx0cmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIHJlc3BvbnNlLnRleHQoKTtcblx0XHR9XG5cdH1cbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBjcmVhdGVVVUlEKCkge1xuXHQvLyBodHRwOi8vd3d3LmlldGYub3JnL3JmYy9yZmM0MTIyLnR4dFxuXHRjb25zdCBzOiBhbnlbXSA9IFtdO1xuXHRjb25zdCBoZXhEaWdpdHMgPSBcIjAxMjM0NTY3ODlhYmNkZWZcIjtcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCAzNjsgaSsrKSB7XG5cdFx0c1tpXSA9IGhleERpZ2l0cy5zdWJzdHIoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMHgxMCksIDEpO1xuXHR9XG5cdHNbMTRdID0gXCI0XCI7ICAvLyBiaXRzIDEyLTE1IG9mIHRoZSB0aW1lX2hpX2FuZF92ZXJzaW9uIGZpZWxkIHRvIDAwMTBcblx0c1sxOV0gPSBoZXhEaWdpdHMuc3Vic3RyKChzWzE5XSAmIDB4MykgfCAweDgsIDEpOyAgLy8gYml0cyA2LTcgb2YgdGhlIGNsb2NrX3NlcV9oaV9hbmRfcmVzZXJ2ZWQgdG8gMDFcblx0c1s4XSA9IHNbMTNdID0gc1sxOF0gPSBzWzIzXSA9IFwiLVwiO1xuXG5cdHJldHVybiBzLmpvaW4oXCJcIik7XG59XG5cbmNvbnN0IGZpcnN0VExEcyA9IFwiYWN8YWR8YWV8YWZ8YWd8YWl8YWx8YW18YW58YW98YXF8YXJ8YXN8YXR8YXV8YXd8YXh8YXp8YmF8YmJ8YmV8YmZ8Ymd8Ymh8Yml8Ymp8Ym18Ym98YnJ8YnN8YnR8YnZ8Ynd8Ynl8Ynp8Y2F8Y2N8Y2R8Y2Z8Y2d8Y2h8Y2l8Y2x8Y218Y258Y298Y3J8Y3V8Y3Z8Y3d8Y3h8Y3p8ZGV8ZGp8ZGt8ZG18ZG98ZHp8ZWN8ZWV8ZWd8ZXN8ZXR8ZXV8Zml8Zm18Zm98ZnJ8Z2F8Z2J8Z2R8Z2V8Z2Z8Z2d8Z2h8Z2l8Z2x8Z218Z258Z3B8Z3F8Z3J8Z3N8Z3R8Z3d8Z3l8aGt8aG18aG58aHJ8aHR8aHV8aWR8aWV8aWx8aW18aW58aW98aXF8aXJ8aXN8aXR8amV8am98anB8a2d8a2l8a218a258a3B8a3J8a3l8a3p8bGF8bGJ8bGN8bGl8bGt8bHJ8bHN8bHR8bHV8bHZ8bHl8bWF8bWN8bWR8bWV8bWd8bWh8bWt8bWx8bW58bW98bXB8bXF8bXJ8bXN8bXR8bXV8bXZ8bXd8bXh8bXl8bmF8bmN8bmV8bmZ8bmd8bmx8bm98bnJ8bnV8bnp8b218cGF8cGV8cGZ8cGh8cGt8cGx8cG18cG58cHJ8cHN8cHR8cHd8cHl8cWF8cmV8cm98cnN8cnV8cnd8c2F8c2J8c2N8c2R8c2V8c2d8c2h8c2l8c2p8c2t8c2x8c218c258c298c3J8c3R8c3V8c3Z8c3h8c3l8c3p8dGN8dGR8dGZ8dGd8dGh8dGp8dGt8dGx8dG18dG58dG98dHB8dHJ8dHR8dHZ8dHd8dHp8dWF8dWd8dWt8dXN8dXl8dXp8dmF8dmN8dmV8dmd8dml8dm58dnV8d2Z8d3N8eXRcIi5zcGxpdChcInxcIik7XG5cbmNvbnN0IHNlY29uZFRMRHMgPSBcImNvbXxlZHV8Z292fG5ldHxtaWx8b3JnfG5vbXxzY2h8Y2FhfHJlc3xvZmZ8Z29ifGludHx0dXJ8aXA2fHVyaXx1cm58YXNufGFjdHxuc3d8cWxkfHRhc3x2aWN8cHJvfGJpenxhZG18YWR2fGFncnxhcnF8YXJ0fGF0b3xiaW98Ym1kfGNpbXxjbmd8Y250fGVjbnxlY298ZW1wfGVuZ3xlc3B8ZXRjfGV0aXxmYXJ8Zm5kfGZvdHxmc3R8ZzEyfGdnZnxpbWJ8aW5kfGluZnxqb3J8anVzfGxlZ3xsZWx8bWF0fG1lZHxtdXN8bm90fG50cnxvZG98cHBnfHBzY3xwc2l8cXNsfHJlY3xzbGd8c3J2fHRlb3x0bXB8dHJkfHZldHx6bGd8d2VifGx0ZHxzbGR8cG9sfGZpbnxrMTJ8bGlifHByaXxhaXB8ZmllfGV1bnxzY2l8cHJkfGNjaXxwdnR8bW9kfGlkdnxyZWx8c2V4fGdlbnxuaWN8YWJyfGJhc3xjYWx8Y2FtfGVtcnxmdmd8bGF6fGxpZ3xsb218bWFyfG1vbHxwbW58cHVnfHNhcnxzaWN8dGFhfHRvc3x1bWJ8dmFvfHZkYXx2ZW58bWllfOWMl+a1t+mBk3zlkozmrYzlsbF856We5aWI5bedfOm5v+WFkOWztnxhc3N8cmVwfHRyYXxwZXJ8bmdvfHNvY3xncnB8cGxjfGl0c3xhaXJ8YW5kfGJ1c3xjYW58ZGRyfGpma3xtYWR8bnJ3fG55Y3xza2l8c3B5fHRjbXx1bG18dXNhfHdhcnxmaHN8dmdzfGRlcHxlaWR8ZmV0fGZsYXxmbMOlfGdvbHxob2Z8aG9sfHNlbHx2aWt8Y3JpfGl3aXxpbmd8YWJvfGZhbXxnb2t8Z29ufGdvcHxnb3N8YWlkfGF0bXxnc218c29zfGVsa3x3YXd8ZXN0fGFjYXxiYXJ8Y3BhfGp1cnxsYXd8c2VjfHBsb3x3d3d8YmlyfGNiZ3xqYXJ8a2h2fG1za3xub3Z8bnNrfHB0enxybmR8c3BifHN0dnx0b218dHNrfHVkbXx2cm58Y213fGttc3xua3p8c256fHB1YnxmaHZ8cmVkfGVuc3xuYXR8cm5zfHJudXxiYnN8dGVsfGJlbHxrZXB8bmhzfGRuaXxmZWR8aXNhfG5zbnxndWJ8ZTEyfHRlY3zQvtGA0LN80L7QsdGAfNGD0L/RgHxhbHR8bmlzfGpwbnxtZXh8YXRofGlraXxuaWR8Z2RhfGluY1wiLnNwbGl0KFwifFwiKTtcblxuY29uc3Qga25vd25TdWJkb21haW5zID0gXCJ3d3d8c3R1ZGlvfG1haWx8cmVtb3RlfGJsb2d8d2VibWFpbHxzZXJ2ZXJ8bnMxfG5zMnxzbXRwfHNlY3VyZXx2cG58bXxzaG9wfGZ0cHxtYWlsMnx0ZXN0fHBvcnRhbHxuc3x3dzF8aG9zdHxzdXBwb3J0fGRldnx3ZWJ8YmJzfHd3NDJ8c3F1YXR0ZXJ8bXh8ZW1haWx8MXxtYWlsMXwyfGZvcnVtfG93YXx3d3cyfGd3fGFkbWlufHN0b3JlfG14MXxjZG58YXBpfGV4Y2hhbmdlfGFwcHxnb3Z8MnR0eXx2cHN8Z292eXR5fGhnZmdkZnxuZXdzfDFyZXJ8bGtqa3VpXCI7XG5cbi8qKlxuICogUmVtb3ZlcyB0aGUgc3ViZG9tYWluIGZyb20gdGhlIGdpdmVuIHN0cmluZywgaWYgaXQgbWF0Y2hlcyBhbnkga25vd24gc3ViZG9tYWlucy5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gcyAtIFRoZSBzdHJpbmcgZnJvbSB3aGljaCB0byByZW1vdmUgdGhlIHN1YmRvbWFpbi5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IC0gVGhlIHN0cmluZyB3aXRob3V0IHRoZSBzdWJkb21haW4uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVTdWJkb21haW4oczogc3RyaW5nKTogc3RyaW5nIHtcblx0Y29uc3Qga25vd25TdWJkb21haW5zUmVnRXhwID0gbmV3IFJlZ0V4cChgXigke2tub3duU3ViZG9tYWluc30pLmAsIFwiaVwiKTtcblx0cyA9IHMucmVwbGFjZShrbm93blN1YmRvbWFpbnNSZWdFeHAsIFwiXCIpO1xuXG5cdGNvbnN0IHBhcnRzID0gcy5zcGxpdChcIi5cIik7XG5cblx0d2hpbGUgKHBhcnRzLmxlbmd0aCA+IDMpIHtcblx0XHRwYXJ0cy5zaGlmdCgpO1xuXHR9XG5cblx0aWYgKHBhcnRzLmxlbmd0aCA9PT0gMyAmJiAoKHBhcnRzWzFdLmxlbmd0aCA+IDIgJiYgcGFydHNbMl0ubGVuZ3RoID4gMikgfHwgKHNlY29uZFRMRHMuaW5kZXhPZihwYXJ0c1sxXSkgPT09IC0xKSAmJiBmaXJzdFRMRHMuaW5kZXhPZihwYXJ0c1syXSkgPT09IC0xKSkge1xuXHRcdHBhcnRzLnNoaWZ0KCk7XG5cdH1cblxuXHRyZXR1cm4gcGFydHMuam9pbihcIi5cIik7XG59XG5cbmNvbnN0IHRpbWVvdXRzID0ge307XG4vKipcbiAqIERlYm91bmNlIGEgZnVuY3Rpb24sIGVuc3VyaW5nIGl0IGlzIG9ubHkgY2FsbGVkIGFmdGVyIGEgc3BlY2lmaWVkIHdhaXQgdGltZSBoYXMgZWxhcHNlZCBzaW5jZSB0aGUgbGFzdCBjYWxsLlxuICpcbiAqIEB0ZW1wbGF0ZSBBcmdzIC0gVGhlIHR5cGUgb2YgYXJndW1lbnRzIHRoZSBjYWxsYmFjayBmdW5jdGlvbiBhY2NlcHRzLlxuICogQHBhcmFtIHsoLi4uYXJnczogQXJncykgPT4gdm9pZH0gY2FsbGJhY2sgLSBUaGUgZnVuY3Rpb24gdG8gZGVib3VuY2UuXG4gKiBAcGFyYW0ge251bWJlcn0gd2FpdCAtIFRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRvIHdhaXQgYmVmb3JlIGludm9raW5nIHRoZSBjYWxsYmFjay5cbiAqIEBwYXJhbSB7Li4uQXJnc30gYXJncyAtIFRoZSBhcmd1bWVudHMgdG8gcGFzcyB0byB0aGUgY2FsbGJhY2sgZnVuY3Rpb24uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWJvdW5jZTxBcmdzIGV4dGVuZHMgYW55W10+KGNhbGxiYWNrOiAoLi4uYXJnczogQXJncykgPT4gdm9pZCwgd2FpdDogbnVtYmVyLCAuLi5hcmdzOiBBcmdzKSA6IHZvaWQge1xuXHRjb25zdCBbLCBldmVudF0gPSBhcmdzO1xuXHRcblx0aWYgKCEgZXZlbnQudGFyZ2V0Lmhhc0F0dHJpYnV0ZShcImRhdGEtaWRcIikpIHtcblx0XHRldmVudC50YXJnZXQuc2V0QXR0cmlidXRlKFwiZGF0YS1pZFwiLCBjcmVhdGVVVUlEKCkpO1xuXHR9XG5cblx0Y29uc3QgaWQgPSBldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKFwiZGF0YS1pZFwiKTtcblxuXHRpZiAodGltZW91dHNbaWRdKSB7XG5cdFx0Y2xlYXJUaW1lb3V0KHRpbWVvdXRzW2lkXSk7XG5cdH1cblxuXHR0aW1lb3V0c1tpZF0gPSBzZXRUaW1lb3V0KGNhbGxiYWNrLCB3YWl0LCAuLi5hcmdzKTtcbn0iLCJpbnRlcmZhY2UgUGFyYW1ldGVyTWFwIHtcbiAgICBbczogc3RyaW5nXTogYW55XG59XG5leHBvcnQgY2xhc3MgVXJsUGFyc2VyIHtcblxuXHRwcml2YXRlIHBhcmFtZXRlcnM6IFBhcmFtZXRlck1hcDtcblx0cHVibGljIHJlYWRvbmx5IHByb3RvY29sOiBzdHJpbmc7XG5cdHB1YmxpYyByZWFkb25seSBob3N0OiBzdHJpbmc7XG5cdHB1YmxpYyByZWFkb25seSBob3N0bmFtZTogc3RyaW5nO1xuXHRwdWJsaWMgcmVhZG9ubHkgcG9ydDogc3RyaW5nO1xuXHRwdWJsaWMgcmVhZG9ubHkgcGF0aG5hbWU6IHN0cmluZztcblx0cHVibGljIHJlYWRvbmx5IGhhc2g6IHN0cmluZztcblx0cHVibGljIHJlYWRvbmx5IHNlYXJjaDogc3RyaW5nO1xuXG5cdGNvbnN0cnVjdG9yKHVybDpzdHJpbmcpIHtcblx0XHRjb25zdCBwYXJzZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcblx0XHRwYXJzZXIuaHJlZiA9IHVybDtcblxuXHRcdHRoaXMucHJvdG9jb2wgPSBwYXJzZXIucHJvdG9jb2w7IC8vID0+IFwiaHR0cDpcIlxuXHRcdHRoaXMuaG9zdCA9IHBhcnNlci5ob3N0OyAgICAgLy8gPT4gXCJleGFtcGxlLmNvbTozMDAwXCJcblx0XHR0aGlzLmhvc3RuYW1lID0gcGFyc2VyLmhvc3RuYW1lOyAvLyA9PiBcImV4YW1wbGUuY29tXCJcblx0XHR0aGlzLnBvcnQgPSBwYXJzZXIucG9ydDsgICAgIC8vID0+IFwiMzAwMFwiXG5cdFx0dGhpcy5wYXRobmFtZSA9IHBhcnNlci5wYXRobmFtZTsgLy8gPT4gXCIvcGF0aG5hbWUvXCJcblx0XHR0aGlzLmhhc2ggPSBwYXJzZXIuaGFzaDsgICAgIC8vID0+IFwiI2hhc2hcIlxuXHRcdHRoaXMuc2VhcmNoID0gcGFyc2VyLnNlYXJjaC5zdWJzdHIoMSk7ICAgLy8gPT4gXCI/c2VhcmNoPXRlc3RcIlxuXG5cdFx0dGhpcy5wYXJzZVBhcmFtZXRlcnMoKTtcblx0fVxuXG5cdHByaXZhdGUgcGFyc2VQYXJhbWV0ZXJzKCkge1xuXHRcdHRoaXMucGFyYW1ldGVycyA9IHt9O1xuXG5cdFx0Y29uc3QgcGFyYW1zR3JvdXAgPSB0aGlzLnNlYXJjaC5zcGxpdChcIiZcIik7XG5cdFx0Zm9yKGNvbnN0IHBhcmFtIG9mIHBhcmFtc0dyb3VwKSB7XG5cdFx0XHRjb25zdCBba2V5LCB2YWx1ZV0gPSBwYXJhbS5zcGxpdChcIj1cIik7XG5cdFx0XHR0aGlzLnBhcmFtZXRlcnNba2V5XSA9IHZhbHVlO1xuXHRcdH1cblx0fVxuXG5cdHB1YmxpYyBmaW5kUGFyYW0ocGFyYW06IHN0cmluZykgOiBhbnkge1xuXHRcdHJldHVybiB0aGlzLnBhcmFtZXRlcnNbcGFyYW1dIHx8IG51bGw7XG5cdH1cblxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIEFUU0V2ZW50IHtcblx0YmFzaWNWYWxpZGF0aW9uKGVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XG5cdFx0aWYgKGVsZW1lbnQuaGFzQXR0cmlidXRlKFwiZGF0YS1pZ25vcmVcIikpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdFx0aWYgKGVsZW1lbnQuaGFzQXR0cmlidXRlKFwiQGNsaWNrXCIpKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHRcdHJldHVybiB0cnVlO1xuXHR9XG59IiwiaW1wb3J0IElFdmVudCBmcm9tIFwiLi4vaW50ZWZhY2VzL0lFdmVudFwiO1xuaW1wb3J0IEFUU0V2ZW50IGZyb20gXCIuL0FUU0V2ZW50XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEF0dGFjaG1lbnRPcGVuIGV4dGVuZHMgQVRTRXZlbnQgaW1wbGVtZW50cyBJRXZlbnQge1xuXHRnZXQgc2hvdWxkRGVib3VuY2UoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCB0cmlnZ2VyKCk6IG51bGwge1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cdGdldCBzb3VyY2UoKTogbnVsbCB7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblx0Z2V0IG5hbWUoKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gXCJhdHRhY2htZW50X29wZW5lZFwiO1xuXHR9XG5cdGdldCBoYXNUeXBlcygpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0Z2V0IHJlZGlyZWN0T25GaW5pc2goKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCBpc0Jsb2NraW5nKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdGdldCBhbGxvd011bHRpcGxlKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRpc1ZhbGlkKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG59IiwiaW1wb3J0IElFdmVudCBmcm9tIFwiLi4vaW50ZWZhY2VzL0lFdmVudFwiO1xuaW1wb3J0IEFUU0V2ZW50IGZyb20gXCIuL0FUU0V2ZW50XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsaWNrIGV4dGVuZHMgQVRTRXZlbnQgaW1wbGVtZW50cyBJRXZlbnQge1xuXHRnZXQgc2hvdWxkRGVib3VuY2UoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCB0cmlnZ2VyKCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIFwiY2xpY2tcIjtcblx0fVxuXHRnZXQgc291cmNlKCk6IFdpbmRvdyB7XG5cdFx0cmV0dXJuIHdpbmRvdztcblx0fVxuXHRnZXQgbmFtZSgpOiBzdHJpbmcge1xuXHRcdHJldHVybiBcImJ1dHRvbl9jbGlja2VkXCI7XG5cdH1cblx0Z2V0IGhhc1R5cGVzKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdGdldCByZWRpcmVjdE9uRmluaXNoKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdGdldCBpc0Jsb2NraW5nKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdGdldCBhbGxvd011bHRpcGxlKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTsgXG5cdH1cblxuXHRpc1ZhbGlkKGV2ZW50OiBFdmVudCk6IGJvb2xlYW4ge1xuXHRcdGlmIChldmVudD8udGFyZ2V0IGluc3RhbmNlb2YgSFRNTEFuY2hvckVsZW1lbnQpIHtcblx0XHRcdHJldHVybiB0aGlzLnZhbGlkYXRlQW5jaG9yKGV2ZW50LnRhcmdldCk7XG5cdFx0fVxuXHRcdFxuXG5cdFx0aWYgKGV2ZW50Py50YXJnZXQgaW5zdGFuY2VvZiBIVE1MQnV0dG9uRWxlbWVudCkge1xuXHRcdFx0cmV0dXJuIHRoaXMudmFsaWRhdGVCdXR0b24oZXZlbnQudGFyZ2V0KTtcblx0XHR9XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHRwcml2YXRlIHZhbGlkYXRlQW5jaG9yKGVsZW1lbnQ6IEhUTUxFbGVtZW50KTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRoaXMuYmFzaWNWYWxpZGF0aW9uKGVsZW1lbnQpO1xuXHR9XG5cblx0cHJpdmF0ZSB2YWxpZGF0ZUJ1dHRvbihlbGVtZW50OiBIVE1MRWxlbWVudCk6IGJvb2xlYW4ge1xuXHRcdGlmICghdGhpcy5iYXNpY1ZhbGlkYXRpb24oZWxlbWVudCkgfHwgKGVsZW1lbnQuaGFzQXR0cmlidXRlKFwidHlwZVwiKSAmJiBlbGVtZW50LmdldEF0dHJpYnV0ZShcInR5cGVcIikgPT09IFwic3VibWl0XCIpKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHRcdFx0XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxufSIsImltcG9ydCBJRXZlbnQgZnJvbSBcIi4uL2ludGVmYWNlcy9JRXZlbnRcIjtcbmltcG9ydCBBVFNFdmVudCBmcm9tIFwiLi9BVFNFdmVudFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDbGlwYm9hcmQgZXh0ZW5kcyBBVFNFdmVudCBpbXBsZW1lbnRzIElFdmVudCB7XG5cdGdldCBzaG91bGREZWJvdW5jZSgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0Z2V0IHRyaWdnZXIoKTogbnVsbCB7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblx0Z2V0IHNvdXJjZSgpOiBudWxsIHtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXHRnZXQgbmFtZSgpOiBzdHJpbmcge1xuXHRcdHJldHVybiBcImNsaXBib2FyZF9hY2NlcHRlZFwiO1xuXHR9XG5cdGdldCBoYXNUeXBlcygpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0Z2V0IHJlZGlyZWN0T25GaW5pc2goKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblx0Z2V0IGlzQmxvY2tpbmcoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblx0Z2V0IGFsbG93TXVsdGlwbGUoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGlzVmFsaWQoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxufSIsImltcG9ydCBJRXZlbnQgZnJvbSBcIi4uL2ludGVmYWNlcy9JRXZlbnRcIjtcbmltcG9ydCBBVFNFdmVudCBmcm9tIFwiLi9BVFNFdmVudFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEb3dubG9hZCBleHRlbmRzIEFUU0V2ZW50IGltcGxlbWVudHMgSUV2ZW50IHtcblx0Z2V0IHNob3VsZERlYm91bmNlKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRnZXQgdHJpZ2dlcigpOiBudWxsIHtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXHRnZXQgc291cmNlKCk6IG51bGwge1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cdGdldCBuYW1lKCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIFwiZG93bmxvYWRfZmlsZV9ldmVudFwiO1xuXHR9XG5cdGdldCBoYXNUeXBlcygpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0Z2V0IHJlZGlyZWN0T25GaW5pc2goKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblx0Z2V0IGlzQmxvY2tpbmcoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblx0Z2V0IGFsbG93TXVsdGlwbGUoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGlzVmFsaWQoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxufSIsImltcG9ydCBJRXZlbnQgZnJvbSBcIi4uL2ludGVmYWNlcy9JRXZlbnRcIjtcbmltcG9ydCBBVFNFdmVudCBmcm9tIFwiLi9BVFNFdmVudFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFeHRlbnNpb24gZXh0ZW5kcyBBVFNFdmVudCBpbXBsZW1lbnRzIElFdmVudCB7XG5cdGdldCBzaG91bGREZWJvdW5jZSgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0Z2V0IHRyaWdnZXIoKTogbnVsbCB7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblx0Z2V0IHNvdXJjZSgpOiBudWxsIHtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXHRnZXQgbmFtZSgpOiBzdHJpbmcge1xuXHRcdHJldHVybiBcImV4dGVuc2lvbl9pbnN0YWxsZWRcIjtcblx0fVxuXHRnZXQgaGFzVHlwZXMoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCByZWRpcmVjdE9uRmluaXNoKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdGdldCBpc0Jsb2NraW5nKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdGdldCBhbGxvd011bHRpcGxlKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRpc1ZhbGlkKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cbn0iLCJpbXBvcnQgSUV2ZW50IGZyb20gXCIuLi9pbnRlZmFjZXMvSUV2ZW50XCI7XG5pbXBvcnQgQVRTRXZlbnQgZnJvbSBcIi4vQVRTRXZlbnRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRmlsZURvd25sb2FkIGV4dGVuZHMgQVRTRXZlbnQgaW1wbGVtZW50cyBJRXZlbnQge1xuXHRnZXQgc2hvdWxkRGVib3VuY2UoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCB0cmlnZ2VyKCk6IG51bGwge1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cdGdldCBzb3VyY2UoKTogbnVsbCB7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblx0Z2V0IG5hbWUoKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gXCJmaWxlX2Rvd25sb2FkXCI7XG5cdH1cblx0Z2V0IGhhc1R5cGVzKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdGdldCByZWRpcmVjdE9uRmluaXNoKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRnZXQgaXNCbG9ja2luZygpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cdFxuXHRnZXQgYWxsb3dNdWx0aXBsZSgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHRpc1ZhbGlkKGV2ZW50OiBFdmVudCk6IGJvb2xlYW4ge1xuXHRcdGlmIChldmVudD8udGFyZ2V0IGluc3RhbmNlb2YgSFRNTEFuY2hvckVsZW1lbnQpIHtcblx0XHRcdHJldHVybiB0aGlzLnZhbGlkYXRlQW5jaG9yKGV2ZW50LnRhcmdldCk7XG5cdFx0fVxuXHRcdFxuXG5cdFx0aWYgKGV2ZW50Py50YXJnZXQgaW5zdGFuY2VvZiBIVE1MQnV0dG9uRWxlbWVudCkge1xuXHRcdFx0cmV0dXJuIHRoaXMudmFsaWRhdGVCdXR0b24oZXZlbnQudGFyZ2V0KTtcblx0XHR9XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHRwcml2YXRlIHZhbGlkYXRlQW5jaG9yKGVsZW1lbnQ6IEhUTUxFbGVtZW50KTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRoaXMuYmFzaWNWYWxpZGF0aW9uKGVsZW1lbnQpO1xuXHR9XG5cblx0cHJpdmF0ZSB2YWxpZGF0ZUJ1dHRvbihlbGVtZW50OiBIVE1MRWxlbWVudCk6IGJvb2xlYW4ge1xuXHRcdGlmICghdGhpcy5iYXNpY1ZhbGlkYXRpb24oZWxlbWVudCkgfHwgKGVsZW1lbnQuaGFzQXR0cmlidXRlKFwidHlwZVwiKSAmJiBlbGVtZW50LmdldEF0dHJpYnV0ZShcInR5cGVcIikgPT09IFwic3VibWl0XCIpKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHRcdFx0XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cbn0gIiwiaW1wb3J0IElFdmVudCBmcm9tIFwiLi4vaW50ZWZhY2VzL0lFdmVudFwiO1xuaW1wb3J0IEFUU0V2ZW50IGZyb20gXCIuL0FUU0V2ZW50XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZpbGVPcGVuIGV4dGVuZHMgQVRTRXZlbnQgaW1wbGVtZW50cyBJRXZlbnQge1xuXHRnZXQgc2hvdWxkRGVib3VuY2UoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCB0cmlnZ2VyKCk6IG51bGwge1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cdGdldCBzb3VyY2UoKTogbnVsbCB7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblx0Z2V0IG5hbWUoKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gXCJmaWxlX29wZW5lZFwiO1xuXHR9XG5cdGdldCBoYXNUeXBlcygpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0Z2V0IHJlZGlyZWN0T25GaW5pc2goKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblx0Z2V0IGlzQmxvY2tpbmcoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblx0Z2V0IGFsbG93TXVsdGlwbGUoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGlzVmFsaWQoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxufSIsImltcG9ydCBJRXZlbnQgZnJvbSBcIi4uL2ludGVmYWNlcy9JRXZlbnRcIjtcbmltcG9ydCBBVFNFdmVudCBmcm9tIFwiLi9BVFNFdmVudFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbnB1dCBleHRlbmRzIEFUU0V2ZW50IGltcGxlbWVudHMgSUV2ZW50IHtcblx0Z2V0IHNob3VsZERlYm91bmNlKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdGdldCB0cmlnZ2VyKCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIFwiaW5wdXRcIjtcblx0fVxuXHRnZXQgc291cmNlKCk6IFdpbmRvdyB7XG5cdFx0cmV0dXJuIHdpbmRvdztcblx0fVxuXHRnZXQgbmFtZSgpOiBzdHJpbmcge1xuXHRcdHJldHVybiBcImlucHV0X2ZpbGxlZFwiO1xuXHR9XG5cdGdldCBoYXNUeXBlcygpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXHRnZXQgcmVkaXJlY3RPbkZpbmlzaCgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0Z2V0IGlzQmxvY2tpbmcoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCBhbGxvd011bHRpcGxlKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9ICBcblxuXHRpc1ZhbGlkKGV2ZW50OiBFdmVudCk6IGJvb2xlYW4ge1xuXHRcdGlmIChldmVudD8udGFyZ2V0IGluc3RhbmNlb2YgSFRNTElucHV0RWxlbWVudCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuYmFzaWNWYWxpZGF0aW9uKGV2ZW50LnRhcmdldCkgJiYgISFldmVudC50YXJnZXQudmFsdWUudHJpbSgpO1xuXHRcdH1cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn1cbiIsImltcG9ydCBJRXZlbnQgZnJvbSBcIi4uL2ludGVmYWNlcy9JRXZlbnRcIjtcbmltcG9ydCBBVFNFdmVudCBmcm9tIFwiLi9BVFNFdmVudFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMb2NhdGlvbiBleHRlbmRzIEFUU0V2ZW50IGltcGxlbWVudHMgSUV2ZW50IHtcblx0Z2V0IHNob3VsZERlYm91bmNlKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRnZXQgdHJpZ2dlcigpOiBudWxsIHtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXHRnZXQgc291cmNlKCk6IG51bGwge1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cdGdldCBuYW1lKCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIFwibG9jYXRpb25fYWNjZXB0ZWRcIjtcblx0fVxuXHRnZXQgaGFzVHlwZXMoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCByZWRpcmVjdE9uRmluaXNoKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdGdldCBpc0Jsb2NraW5nKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdGdldCBhbGxvd011bHRpcGxlKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRpc1ZhbGlkKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cbn0iLCJpbXBvcnQgSUV2ZW50IGZyb20gXCIuLi9pbnRlZmFjZXMvSUV2ZW50XCI7XG5pbXBvcnQgQVRTRXZlbnQgZnJvbSBcIi4vQVRTRXZlbnRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWljcm9waG9uZSBleHRlbmRzIEFUU0V2ZW50IGltcGxlbWVudHMgSUV2ZW50IHtcblx0Z2V0IHNob3VsZERlYm91bmNlKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRnZXQgdHJpZ2dlcigpOiBudWxsIHtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXHRnZXQgc291cmNlKCk6IG51bGwge1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cdGdldCBuYW1lKCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIFwibWljX2FjY2VwdGVkXCI7XG5cdH1cblx0Z2V0IGhhc1R5cGVzKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRnZXQgcmVkaXJlY3RPbkZpbmlzaCgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXHRnZXQgaXNCbG9ja2luZygpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXHRnZXQgYWxsb3dNdWx0aXBsZSgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0aXNWYWxpZCgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG59IiwiaW1wb3J0IElFdmVudCBmcm9tIFwiLi4vaW50ZWZhY2VzL0lFdmVudFwiO1xuaW1wb3J0IEFUU0V2ZW50IGZyb20gXCIuL0FUU0V2ZW50XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE5vdGlmaWNhdGlvbiBleHRlbmRzIEFUU0V2ZW50IGltcGxlbWVudHMgSUV2ZW50IHtcblx0Z2V0IHNob3VsZERlYm91bmNlKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRnZXQgdHJpZ2dlcigpOiBudWxsIHtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXHRnZXQgc291cmNlKCk6IG51bGwge1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cdGdldCBuYW1lKCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIFwibm90aWZpY2F0aW9uX2FjY2VwdGVkXCI7XG5cdH1cblx0Z2V0IGhhc1R5cGVzKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRnZXQgcmVkaXJlY3RPbkZpbmlzaCgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXHRnZXQgaXNCbG9ja2luZygpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXHRnZXQgYWxsb3dNdWx0aXBsZSgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0aXNWYWxpZCgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG59IiwiaW1wb3J0IElFdmVudCBmcm9tIFwiLi4vaW50ZWZhY2VzL0lFdmVudFwiO1xuaW1wb3J0IEFUU0V2ZW50IGZyb20gXCIuL0FUU0V2ZW50XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhZ2VMb2FkZWQgZXh0ZW5kcyBBVFNFdmVudCBpbXBsZW1lbnRzIElFdmVudCB7XG5cdGdldCBzaG91bGREZWJvdW5jZSgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0Z2V0IHRyaWdnZXIoKTogbnVsbCB7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblx0Z2V0IHNvdXJjZSgpOiBEb2N1bWVudCB7XG5cdFx0cmV0dXJuIGRvY3VtZW50O1xuXHR9XG5cdGdldCBuYW1lKCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIFwicGFnZV9sZWZ0XCI7XG5cdH1cblx0Z2V0IGhhc1R5cGVzKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRnZXQgcmVkaXJlY3RPbkZpbmlzaCgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0Z2V0IGlzQmxvY2tpbmcoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCBhbGxvd011bHRpcGxlKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRpc1ZhbGlkKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBkb2N1bWVudC52aXNpYmlsaXR5U3RhdGUgPT09IFwiaGlkZGVuXCI7XG5cdH1cbn0iLCJpbXBvcnQgSUV2ZW50IGZyb20gXCIuLi9pbnRlZmFjZXMvSUV2ZW50XCI7XG5pbXBvcnQgQVRTRXZlbnQgZnJvbSBcIi4vQVRTRXZlbnRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGFnZUxvYWRlZCBleHRlbmRzIEFUU0V2ZW50IGltcGxlbWVudHMgSUV2ZW50IHtcblx0Z2V0IHNob3VsZERlYm91bmNlKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRnZXQgdHJpZ2dlcigpOiBzdHJpbmcge1xuXHRcdHJldHVybiBcImxvYWRcIjtcblx0fVxuXHRnZXQgc291cmNlKCk6IFdpbmRvdyB7XG5cdFx0cmV0dXJuIHdpbmRvdztcblx0fVxuXHRnZXQgbmFtZSgpOiBzdHJpbmcge1xuXHRcdHJldHVybiBcInBhZ2VfbG9hZGVkXCI7XG5cdH1cblx0Z2V0IGhhc1R5cGVzKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRnZXQgcmVkaXJlY3RPbkZpbmlzaCgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0Z2V0IGlzQmxvY2tpbmcoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCBhbGxvd011bHRpcGxlKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRpc1ZhbGlkKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG59IiwiaW1wb3J0IElFdmVudCBmcm9tIFwiLi4vaW50ZWZhY2VzL0lFdmVudFwiO1xuaW1wb3J0IEFUU0V2ZW50IGZyb20gXCIuL0FUU0V2ZW50XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhZ2VSZWFkIGV4dGVuZHMgQVRTRXZlbnQgaW1wbGVtZW50cyBJRXZlbnQge1xuXHRwcml2YXRlIG1pblNjcm9sbFBlcmNlbnRhZ2UgPSA3MDtcblx0cHJpdmF0ZSBtaW5TdGF5U2Vjb25kcyA9IDIqMTAwMDtcblx0cHJpdmF0ZSBoYXNTY3JvbGxlZCA9IGZhbHNlO1xuXHRwcml2YXRlIGhhc1N0YXllZCA9IGZhbHNlO1xuXHRwcml2YXRlIGN1c3RvbUV2ZW50OiBFdmVudDtcblx0cHJpdmF0ZSB0aW1lb3V0OiBhbnk7XG5cblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0c3VwZXIoKTtcblx0XHR0aGlzLmN1c3RvbUV2ZW50ID0gbmV3IEV2ZW50KHRoaXMudHJpZ2dlcik7XG5cdFx0dGhpcy5lbmFibGUoKTtcblx0XHRjb25zb2xlLmxvZyhcIlBhZ2UgcmVhZCBlbmFibGVkXCIpO1xuXHR9XG5cblx0Z2V0IHNob3VsZERlYm91bmNlKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRnZXQgdHJpZ2dlcigpOiBzdHJpbmcge1xuXHRcdHJldHVybiBcInBhZ2VfcmVhZFwiO1xuXHR9XG5cdGdldCBzb3VyY2UoKTogV2luZG93IHtcblx0XHRyZXR1cm4gd2luZG93O1xuXHR9XG5cdGdldCBuYW1lKCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIFwicGFnZV9yZWFkXCI7XG5cdH1cblx0Z2V0IGhhc1R5cGVzKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRnZXQgcmVkaXJlY3RPbkZpbmlzaCgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0Z2V0IGlzQmxvY2tpbmcoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCBhbGxvd011bHRpcGxlKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdGdldCBjYW5TY3JvbGwoKTogYm9vbGVhbiB7XG5cdFx0Ly8gZGV0ZXJtaW5lIGlmIHRoZSB1c2VyIGNhbiBzY3JvbGwgdGhlIHBhZ2Vcblx0XHRyZXR1cm4gd2luZG93LmlubmVySGVpZ2h0IC8gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbEhlaWdodCA8IC44NTtcblx0fVxuXG5cdGlzVmFsaWQoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHRwcml2YXRlIGVuYWJsZSgpIHtcblx0XHR3aW5kb3cub25zY3JvbGwgPSAoKSA9PiB0aGlzLnNjcm9sbGVkKCk7XG5cdFx0dGhpcy5kZXRlY3RGb2N1cygpO1xuXHRcdHRoaXMuZGV0ZWN0VmlzaWJpbGl0eSgpO1xuXHRcdHRoaXMuc2Nyb2xsZWQoKTtcblx0XHR0aGlzLnRpbWVvdXQgPSBzZXRUaW1lb3V0ICgoKSA9PiB0aGlzLnN0YXllZCgpLCB0aGlzLm1pblN0YXlTZWNvbmRzKTtcblx0fVxuXG5cdHByaXZhdGUgZ2V0IHZpc2liaWxpdHlQcm9wcygpIDogW3N0cmluZywgc3RyaW5nXSB7XG5cdFx0aWYgKHR5cGVvZiBkb2N1bWVudC5oaWRkZW4gIT09IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdHJldHVybiBbXCJ2aXNpYmlsaXR5Y2hhbmdlXCIsIFwidmlzaWJpbGl0eVN0YXRlXCJdO1xuXHRcdH1cblx0XHRlbHNlIGlmICh0eXBlb2YgKGRvY3VtZW50IGFzIGFueSkubW96SGlkZGVuICE9PSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRyZXR1cm4gW1wibW96dmlzaWJpbGl0eWNoYW5nZVwiLCBcIm1velZpc2liaWxpdHlTdGF0ZVwiXTtcblx0XHR9XG5cdFx0ZWxzZSBpZiAodHlwZW9mIChkb2N1bWVudCBhcyBhbnkpLm1zSGlkZGVuICE9PSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRyZXR1cm4gW1wibXN2aXNpYmlsaXR5Y2hhbmdlXCIsIFwibXNWaXNpYmlsaXR5U3RhdGVcIl07XG5cdFx0fVxuXHRcdGVsc2UgaWYgKHR5cGVvZiAoZG9jdW1lbnQgYXMgYW55KS53ZWJraXRIaWRkZW4gIT09IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdHJldHVybiBbXCJ3ZWJraXR2aXNpYmlsaXR5Y2hhbmdlXCIsIFwid2Via2l0VmlzaWJpbGl0eVN0YXRlXCJdO1xuXHRcdH1cblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJWaXNpYmlsaXR5IG5vdCBzdXBwb3J0ZWQuXCIpO1xuXHR9XG5cblx0cHJpdmF0ZSBkZXRlY3RGb2N1cygpIHtcblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImZvY3VzXCIsIHRoaXMuZm9jdXNHcmFudGVkLmJpbmQodGhpcykpO1xuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiYmx1clwiLCB0aGlzLmZvY3VzTG9zdC5iaW5kKHRoaXMpKTtcblx0fVxuXG5cdHByaXZhdGUgZGV0ZWN0VmlzaWJpbGl0eSgpIHtcblx0XHQvLyBjaGVjayB0aGUgdmlzaWJsaWxpdHkgb2YgdGhlIHBhZ2Vcblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgW3Zpc2liaWxpdHlDaGFuZ2VdID0gdGhpcy52aXNpYmlsaXR5UHJvcHM7XG5cdFx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKHZpc2liaWxpdHlDaGFuZ2UsIHRoaXMudmlzaWJpbGl0eUNoYW5nZWQuYmluZCh0aGlzKSk7XG5cdFx0fSBjYXRjaChfKSB7XG5cdFx0XHQvL1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgc3RvcERldGVjdGluZ1Zpc2liaWxpdHkoKSB7XG5cdFx0Ly8gY2hlY2sgdGhlIHZpc2libGlsaXR5IG9mIHRoZSBwYWdlXG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IFt2aXNpYmlsaXR5Q2hhbmdlXSA9IHRoaXMudmlzaWJpbGl0eVByb3BzO1xuXHRcdFx0ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcih2aXNpYmlsaXR5Q2hhbmdlLCB0aGlzLnZpc2liaWxpdHlDaGFuZ2VkLmJpbmQodGhpcykpO1xuXHRcdH0gY2F0Y2goXykge1xuXHRcdFx0Ly9cblx0XHRcdHJldHVybjtcblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIHZpc2liaWxpdHlDaGFuZ2VkKCkge1xuXHRcdGNvbnN0IFtfLCB2aXNpYmlsaXR5U3RhdGVdID0gdGhpcy52aXNpYmlsaXR5UHJvcHM7XG5cdFx0dGhpcy50b2dnbGVUaW1lcihkb2N1bWVudFt2aXNpYmlsaXR5U3RhdGVdID09PSBcInZpc2libGVcIik7XG5cdH1cblxuXHRwcml2YXRlIGZvY3VzR3JhbnRlZCgpIHtcblx0XHR0aGlzLnRvZ2dsZVRpbWVyKHRydWUpO1xuXHR9XG5cblx0cHJpdmF0ZSBmb2N1c0xvc3QoKSB7XG5cdFx0dGhpcy50b2dnbGVUaW1lcihmYWxzZSk7XG5cdH1cblxuXHRwcml2YXRlIHRvZ2dsZVRpbWVyKHN0YXR1czogYm9vbGVhbikge1xuXHRcdGlmICh0aGlzLmhhc1N0YXllZCkgeyByZXR1cm47IH1cblxuXHRcdGlmKHN0YXR1cykge1xuXHRcdFx0dGhpcy50aW1lb3V0ID0gc2V0VGltZW91dCAoKCkgPT4gdGhpcy5zdGF5ZWQoKSwgdGhpcy5taW5TdGF5U2Vjb25kcyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXQpO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgZGlzYWJsZSgpIHtcblx0XHR3aW5kb3cub25zY3JvbGwgPSBudWxsO1xuXHRcdHRoaXMuc3RvcERldGVjdGluZ1Zpc2liaWxpdHkoKTtcblx0XHR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImZvY3VzXCIsIHRoaXMuZm9jdXNHcmFudGVkLmJpbmQodGhpcykpO1xuXHRcdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwiYmx1clwiLCB0aGlzLmZvY3VzTG9zdC5iaW5kKHRoaXMpKTtcblx0fVxuXG5cdHByaXZhdGUgZ2V0U2Nyb2xsUGVyY2VudCgpIHtcblx0XHRyZXR1cm4gKChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wICsgZG9jdW1lbnQuYm9keS5zY3JvbGxUb3ApIC8gKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxIZWlnaHQgLSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0KSAqIDEwMCk7XG5cdH1cblxuXHRwcml2YXRlIHNjcm9sbGVkKCkge1xuXHRcdGlmKHRoaXMuZ2V0U2Nyb2xsUGVyY2VudCgpID4gdGhpcy5taW5TY3JvbGxQZXJjZW50YWdlKSB7XG5cdFx0XHRpZih0aGlzLmhhc1N0YXllZCkge1xuXHRcdFx0XHR0aGlzLmRpc3BhdGNoKCk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLmhhc1Njcm9sbGVkID0gdHJ1ZTtcblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIHN0YXllZCgpIHtcblx0XHRpZih0aGlzLmhhc1Njcm9sbGVkIHx8ICF0aGlzLmNhblNjcm9sbCkge1xuXHRcdFx0dGhpcy5kaXNwYXRjaCgpO1xuXHRcdH1cblx0XHR0aGlzLmhhc1N0YXllZCA9IHRydWU7XG5cdH1cblxuXHRwcml2YXRlIGRpc3BhdGNoKCkge1xuXHRcdHdpbmRvdy5kaXNwYXRjaEV2ZW50KHRoaXMuY3VzdG9tRXZlbnQpO1xuXHRcdHRoaXMuZGlzYWJsZSgpO1xuXHR9XG59IiwiaW1wb3J0IElFdmVudCBmcm9tIFwiLi4vaW50ZWZhY2VzL0lFdmVudFwiO1xuaW1wb3J0IEFUU0V2ZW50IGZyb20gXCIuL0FUU0V2ZW50XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN1Ym1pdCBleHRlbmRzIEFUU0V2ZW50IGltcGxlbWVudHMgSUV2ZW50IHtcblx0Z2V0IHNob3VsZERlYm91bmNlKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRnZXQgdHJpZ2dlcigpOiBzdHJpbmcge1xuXHRcdHJldHVybiBcInN1Ym1pdFwiO1xuXHR9XG5cdGdldCBzb3VyY2UoKTogV2luZG93IHtcblx0XHRyZXR1cm4gd2luZG93O1xuXHR9XG5cdGdldCBuYW1lKCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIFwiZm9ybV9zdWJtaXR0ZWRcIjtcblx0fVxuXHRnZXQgaGFzVHlwZXMoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblx0Z2V0IHJlZGlyZWN0T25GaW5pc2goKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblx0Z2V0IGlzQmxvY2tpbmcoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblx0Z2V0IGFsbG93TXVsdGlwbGUoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGlzVmFsaWQoZXZlbnQ6IEV2ZW50KTogYm9vbGVhbiB7XG5cdFx0aWYgKGV2ZW50Py50YXJnZXQgaW5zdGFuY2VvZiBIVE1MRm9ybUVsZW1lbnQpIHtcblx0XHRcdHJldHVybiB0aGlzLmJhc2ljVmFsaWRhdGlvbihldmVudC50YXJnZXQpO1xuXHRcdH1cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbiAgICBcbn0iLCJpbXBvcnQgSUV2ZW50IGZyb20gXCIuLi9pbnRlZmFjZXMvSUV2ZW50XCI7XG5pbXBvcnQgQVRTRXZlbnQgZnJvbSBcIi4vQVRTRXZlbnRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2ViY2FtIGV4dGVuZHMgQVRTRXZlbnQgaW1wbGVtZW50cyBJRXZlbnQge1xuXHRnZXQgc2hvdWxkRGVib3VuY2UoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCB0cmlnZ2VyKCk6IG51bGwge1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cdGdldCBzb3VyY2UoKTogbnVsbCB7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblx0Z2V0IG5hbWUoKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gXCJ3ZWJjYW1fYWNjZXB0ZWRcIjtcblx0fVxuXHRnZXQgaGFzVHlwZXMoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdGdldCByZWRpcmVjdE9uRmluaXNoKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdGdldCBpc0Jsb2NraW5nKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdGdldCBhbGxvd011bHRpcGxlKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRpc1ZhbGlkKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cbn0iLCIvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8qIFVBUGFyc2VyLmpzIHYxLjAuMzhcbiAgIENvcHlyaWdodCDCqSAyMDEyLTIwMjEgRmFpc2FsIFNhbG1hbiA8ZkBmYWlzYWxtYW4uY29tPlxuICAgTUlUIExpY2Vuc2UgKi8vKlxuICAgRGV0ZWN0IEJyb3dzZXIsIEVuZ2luZSwgT1MsIENQVSwgYW5kIERldmljZSB0eXBlL21vZGVsIGZyb20gVXNlci1BZ2VudCBkYXRhLlxuICAgU3VwcG9ydHMgYnJvd3NlciAmIG5vZGUuanMgZW52aXJvbm1lbnQuIFxuICAgRGVtbyAgIDogaHR0cHM6Ly9mYWlzYWxtYW4uZ2l0aHViLmlvL3VhLXBhcnNlci1qc1xuICAgU291cmNlIDogaHR0cHM6Ly9naXRodWIuY29tL2ZhaXNhbG1hbi91YS1wYXJzZXItanMgKi9cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4oZnVuY3Rpb24gKHdpbmRvdywgdW5kZWZpbmVkKSB7XG5cbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICAvLy8vLy8vLy8vLy8vL1xuICAgIC8vIENvbnN0YW50c1xuICAgIC8vLy8vLy8vLy8vLy9cblxuXG4gICAgdmFyIExJQlZFUlNJT04gID0gJzEuMC4zOCcsXG4gICAgICAgIEVNUFRZICAgICAgID0gJycsXG4gICAgICAgIFVOS05PV04gICAgID0gJz8nLFxuICAgICAgICBGVU5DX1RZUEUgICA9ICdmdW5jdGlvbicsXG4gICAgICAgIFVOREVGX1RZUEUgID0gJ3VuZGVmaW5lZCcsXG4gICAgICAgIE9CSl9UWVBFICAgID0gJ29iamVjdCcsXG4gICAgICAgIFNUUl9UWVBFICAgID0gJ3N0cmluZycsXG4gICAgICAgIE1BSk9SICAgICAgID0gJ21ham9yJyxcbiAgICAgICAgTU9ERUwgICAgICAgPSAnbW9kZWwnLFxuICAgICAgICBOQU1FICAgICAgICA9ICduYW1lJyxcbiAgICAgICAgVFlQRSAgICAgICAgPSAndHlwZScsXG4gICAgICAgIFZFTkRPUiAgICAgID0gJ3ZlbmRvcicsXG4gICAgICAgIFZFUlNJT04gICAgID0gJ3ZlcnNpb24nLFxuICAgICAgICBBUkNISVRFQ1RVUkU9ICdhcmNoaXRlY3R1cmUnLFxuICAgICAgICBDT05TT0xFICAgICA9ICdjb25zb2xlJyxcbiAgICAgICAgTU9CSUxFICAgICAgPSAnbW9iaWxlJyxcbiAgICAgICAgVEFCTEVUICAgICAgPSAndGFibGV0JyxcbiAgICAgICAgU01BUlRUViAgICAgPSAnc21hcnR0dicsXG4gICAgICAgIFdFQVJBQkxFICAgID0gJ3dlYXJhYmxlJyxcbiAgICAgICAgRU1CRURERUQgICAgPSAnZW1iZWRkZWQnLFxuICAgICAgICBVQV9NQVhfTEVOR1RIID0gNTAwO1xuXG4gICAgdmFyIEFNQVpPTiAgPSAnQW1hem9uJyxcbiAgICAgICAgQVBQTEUgICA9ICdBcHBsZScsXG4gICAgICAgIEFTVVMgICAgPSAnQVNVUycsXG4gICAgICAgIEJMQUNLQkVSUlkgPSAnQmxhY2tCZXJyeScsXG4gICAgICAgIEJST1dTRVIgPSAnQnJvd3NlcicsXG4gICAgICAgIENIUk9NRSAgPSAnQ2hyb21lJyxcbiAgICAgICAgRURHRSAgICA9ICdFZGdlJyxcbiAgICAgICAgRklSRUZPWCA9ICdGaXJlZm94JyxcbiAgICAgICAgR09PR0xFICA9ICdHb29nbGUnLFxuICAgICAgICBIVUFXRUkgID0gJ0h1YXdlaScsXG4gICAgICAgIExHICAgICAgPSAnTEcnLFxuICAgICAgICBNSUNST1NPRlQgPSAnTWljcm9zb2Z0JyxcbiAgICAgICAgTU9UT1JPTEEgID0gJ01vdG9yb2xhJyxcbiAgICAgICAgT1BFUkEgICA9ICdPcGVyYScsXG4gICAgICAgIFNBTVNVTkcgPSAnU2Ftc3VuZycsXG4gICAgICAgIFNIQVJQICAgPSAnU2hhcnAnLFxuICAgICAgICBTT05ZICAgID0gJ1NvbnknLFxuICAgICAgICBYSUFPTUkgID0gJ1hpYW9taScsXG4gICAgICAgIFpFQlJBICAgPSAnWmVicmEnLFxuICAgICAgICBGQUNFQk9PSyAgICA9ICdGYWNlYm9vaycsXG4gICAgICAgIENIUk9NSVVNX09TID0gJ0Nocm9taXVtIE9TJyxcbiAgICAgICAgTUFDX09TICA9ICdNYWMgT1MnO1xuXG4gICAgLy8vLy8vLy8vLy9cbiAgICAvLyBIZWxwZXJcbiAgICAvLy8vLy8vLy8vXG5cbiAgICB2YXIgZXh0ZW5kID0gZnVuY3Rpb24gKHJlZ2V4ZXMsIGV4dGVuc2lvbnMpIHtcbiAgICAgICAgICAgIHZhciBtZXJnZWRSZWdleGVzID0ge307XG4gICAgICAgICAgICBmb3IgKHZhciBpIGluIHJlZ2V4ZXMpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXh0ZW5zaW9uc1tpXSAmJiBleHRlbnNpb25zW2ldLmxlbmd0aCAlIDIgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgbWVyZ2VkUmVnZXhlc1tpXSA9IGV4dGVuc2lvbnNbaV0uY29uY2F0KHJlZ2V4ZXNbaV0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG1lcmdlZFJlZ2V4ZXNbaV0gPSByZWdleGVzW2ldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBtZXJnZWRSZWdleGVzO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJpemUgPSBmdW5jdGlvbiAoYXJyKSB7XG4gICAgICAgICAgICB2YXIgZW51bXMgPSB7fTtcbiAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaTxhcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBlbnVtc1thcnJbaV0udG9VcHBlckNhc2UoKV0gPSBhcnJbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZW51bXM7XG4gICAgICAgIH0sXG4gICAgICAgIGhhcyA9IGZ1bmN0aW9uIChzdHIxLCBzdHIyKSB7XG4gICAgICAgICAgICByZXR1cm4gdHlwZW9mIHN0cjEgPT09IFNUUl9UWVBFID8gbG93ZXJpemUoc3RyMikuaW5kZXhPZihsb3dlcml6ZShzdHIxKSkgIT09IC0xIDogZmFsc2U7XG4gICAgICAgIH0sXG4gICAgICAgIGxvd2VyaXplID0gZnVuY3Rpb24gKHN0cikge1xuICAgICAgICAgICAgcmV0dXJuIHN0ci50b0xvd2VyQ2FzZSgpO1xuICAgICAgICB9LFxuICAgICAgICBtYWpvcml6ZSA9IGZ1bmN0aW9uICh2ZXJzaW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gdHlwZW9mKHZlcnNpb24pID09PSBTVFJfVFlQRSA/IHZlcnNpb24ucmVwbGFjZSgvW15cXGRcXC5dL2csIEVNUFRZKS5zcGxpdCgnLicpWzBdIDogdW5kZWZpbmVkO1xuICAgICAgICB9LFxuICAgICAgICB0cmltID0gZnVuY3Rpb24gKHN0ciwgbGVuKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mKHN0cikgPT09IFNUUl9UWVBFKSB7XG4gICAgICAgICAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UoL15cXHNcXHMqLywgRU1QVFkpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0eXBlb2YobGVuKSA9PT0gVU5ERUZfVFlQRSA/IHN0ciA6IHN0ci5zdWJzdHJpbmcoMCwgVUFfTUFYX0xFTkdUSCk7XG4gICAgICAgICAgICB9XG4gICAgfTtcblxuICAgIC8vLy8vLy8vLy8vLy8vL1xuICAgIC8vIE1hcCBoZWxwZXJcbiAgICAvLy8vLy8vLy8vLy8vL1xuXG4gICAgdmFyIHJneE1hcHBlciA9IGZ1bmN0aW9uICh1YSwgYXJyYXlzKSB7XG5cbiAgICAgICAgICAgIHZhciBpID0gMCwgaiwgaywgcCwgcSwgbWF0Y2hlcywgbWF0Y2g7XG5cbiAgICAgICAgICAgIC8vIGxvb3AgdGhyb3VnaCBhbGwgcmVnZXhlcyBtYXBzXG4gICAgICAgICAgICB3aGlsZSAoaSA8IGFycmF5cy5sZW5ndGggJiYgIW1hdGNoZXMpIHtcblxuICAgICAgICAgICAgICAgIHZhciByZWdleCA9IGFycmF5c1tpXSwgICAgICAgLy8gZXZlbiBzZXF1ZW5jZSAoMCwyLDQsLi4pXG4gICAgICAgICAgICAgICAgICAgIHByb3BzID0gYXJyYXlzW2kgKyAxXTsgICAvLyBvZGQgc2VxdWVuY2UgKDEsMyw1LC4uKVxuICAgICAgICAgICAgICAgIGogPSBrID0gMDtcblxuICAgICAgICAgICAgICAgIC8vIHRyeSBtYXRjaGluZyB1YXN0cmluZyB3aXRoIHJlZ2V4ZXNcbiAgICAgICAgICAgICAgICB3aGlsZSAoaiA8IHJlZ2V4Lmxlbmd0aCAmJiAhbWF0Y2hlcykge1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghcmVnZXhbal0pIHsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgbWF0Y2hlcyA9IHJlZ2V4W2orK10uZXhlYyh1YSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCEhbWF0Y2hlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChwID0gMDsgcCA8IHByb3BzLmxlbmd0aDsgcCsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2ggPSBtYXRjaGVzWysra107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcSA9IHByb3BzW3BdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNoZWNrIGlmIGdpdmVuIHByb3BlcnR5IGlzIGFjdHVhbGx5IGFycmF5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBxID09PSBPQkpfVFlQRSAmJiBxLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHEubGVuZ3RoID09PSAyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHFbMV0gPT0gRlVOQ19UWVBFKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYXNzaWduIG1vZGlmaWVkIG1hdGNoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1txWzBdXSA9IHFbMV0uY2FsbCh0aGlzLCBtYXRjaCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFzc2lnbiBnaXZlbiB2YWx1ZSwgaWdub3JlIHJlZ2V4IG1hdGNoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1txWzBdXSA9IHFbMV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocS5sZW5ndGggPT09IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNoZWNrIHdoZXRoZXIgZnVuY3Rpb24gb3IgcmVnZXhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcVsxXSA9PT0gRlVOQ19UWVBFICYmICEocVsxXS5leGVjICYmIHFbMV0udGVzdCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjYWxsIGZ1bmN0aW9uICh1c3VhbGx5IHN0cmluZyBtYXBwZXIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1txWzBdXSA9IG1hdGNoID8gcVsxXS5jYWxsKHRoaXMsIG1hdGNoLCBxWzJdKSA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2FuaXRpemUgbWF0Y2ggdXNpbmcgZ2l2ZW4gcmVnZXhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzW3FbMF1dID0gbWF0Y2ggPyBtYXRjaC5yZXBsYWNlKHFbMV0sIHFbMl0pIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHEubGVuZ3RoID09PSA0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1txWzBdXSA9IG1hdGNoID8gcVszXS5jYWxsKHRoaXMsIG1hdGNoLnJlcGxhY2UocVsxXSwgcVsyXSkpIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1txXSA9IG1hdGNoID8gbWF0Y2ggOiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGkgKz0gMjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBzdHJNYXBwZXIgPSBmdW5jdGlvbiAoc3RyLCBtYXApIHtcblxuICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBtYXApIHtcbiAgICAgICAgICAgICAgICAvLyBjaGVjayBpZiBjdXJyZW50IHZhbHVlIGlzIGFycmF5XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBtYXBbaV0gPT09IE9CSl9UWVBFICYmIG1hcFtpXS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgbWFwW2ldLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaGFzKG1hcFtpXVtqXSwgc3RyKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoaSA9PT0gVU5LTk9XTikgPyB1bmRlZmluZWQgOiBpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChoYXMobWFwW2ldLCBzdHIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoaSA9PT0gVU5LTk9XTikgPyB1bmRlZmluZWQgOiBpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzdHI7XG4gICAgfTtcblxuICAgIC8vLy8vLy8vLy8vLy8vL1xuICAgIC8vIFN0cmluZyBtYXBcbiAgICAvLy8vLy8vLy8vLy8vL1xuXG4gICAgLy8gU2FmYXJpIDwgMy4wXG4gICAgdmFyIG9sZFNhZmFyaU1hcCA9IHtcbiAgICAgICAgICAgICcxLjAnICAgOiAnLzgnLFxuICAgICAgICAgICAgJzEuMicgICA6ICcvMScsXG4gICAgICAgICAgICAnMS4zJyAgIDogJy8zJyxcbiAgICAgICAgICAgICcyLjAnICAgOiAnLzQxMicsXG4gICAgICAgICAgICAnMi4wLjInIDogJy80MTYnLFxuICAgICAgICAgICAgJzIuMC4zJyA6ICcvNDE3JyxcbiAgICAgICAgICAgICcyLjAuNCcgOiAnLzQxOScsXG4gICAgICAgICAgICAnPycgICAgIDogJy8nXG4gICAgICAgIH0sXG4gICAgICAgIHdpbmRvd3NWZXJzaW9uTWFwID0ge1xuICAgICAgICAgICAgJ01FJyAgICAgICAgOiAnNC45MCcsXG4gICAgICAgICAgICAnTlQgMy4xMScgICA6ICdOVDMuNTEnLFxuICAgICAgICAgICAgJ05UIDQuMCcgICAgOiAnTlQ0LjAnLFxuICAgICAgICAgICAgJzIwMDAnICAgICAgOiAnTlQgNS4wJyxcbiAgICAgICAgICAgICdYUCcgICAgICAgIDogWydOVCA1LjEnLCAnTlQgNS4yJ10sXG4gICAgICAgICAgICAnVmlzdGEnICAgICA6ICdOVCA2LjAnLFxuICAgICAgICAgICAgJzcnICAgICAgICAgOiAnTlQgNi4xJyxcbiAgICAgICAgICAgICc4JyAgICAgICAgIDogJ05UIDYuMicsXG4gICAgICAgICAgICAnOC4xJyAgICAgICA6ICdOVCA2LjMnLFxuICAgICAgICAgICAgJzEwJyAgICAgICAgOiBbJ05UIDYuNCcsICdOVCAxMC4wJ10sXG4gICAgICAgICAgICAnUlQnICAgICAgICA6ICdBUk0nXG4gICAgfTtcblxuICAgIC8vLy8vLy8vLy8vLy8vXG4gICAgLy8gUmVnZXggbWFwXG4gICAgLy8vLy8vLy8vLy8vL1xuXG4gICAgdmFyIHJlZ2V4ZXMgPSB7XG5cbiAgICAgICAgYnJvd3NlciA6IFtbXG5cbiAgICAgICAgICAgIC9cXGIoPzpjcm1vfGNyaW9zKVxcLyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIENocm9tZSBmb3IgQW5kcm9pZC9pT1NcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgJ0Nocm9tZSddXSwgW1xuICAgICAgICAgICAgL2VkZyg/OmV8aW9zfGEpP1xcLyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBNaWNyb3NvZnQgRWRnZVxuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCAnRWRnZSddXSwgW1xuXG4gICAgICAgICAgICAvLyBQcmVzdG8gYmFzZWRcbiAgICAgICAgICAgIC8ob3BlcmEgbWluaSlcXC8oWy1cXHdcXC5dKykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gT3BlcmEgTWluaVxuICAgICAgICAgICAgLyhvcGVyYSBbbW9iaWxldGFiXXszLDZ9KVxcYi4rdmVyc2lvblxcLyhbLVxcd1xcLl0rKS9pLCAgICAgICAgICAgICAgICAgLy8gT3BlcmEgTW9iaS9UYWJsZXRcbiAgICAgICAgICAgIC8ob3BlcmEpKD86Lit2ZXJzaW9uXFwvfFtcXC8gXSspKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE9wZXJhXG4gICAgICAgICAgICBdLCBbTkFNRSwgVkVSU0lPTl0sIFtcbiAgICAgICAgICAgIC9vcGlvc1tcXC8gXSsoW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gT3BlcmEgbWluaSBvbiBpcGhvbmUgPj0gOC4wXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsIE9QRVJBKycgTWluaSddXSwgW1xuICAgICAgICAgICAgL1xcYm9wKD86cmcpP3hcXC8oW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gT3BlcmEgR1hcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgT1BFUkErJyBHWCddXSwgW1xuICAgICAgICAgICAgL1xcYm9wclxcLyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gT3BlcmEgV2Via2l0XG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsIE9QRVJBXV0sIFtcblxuICAgICAgICAgICAgLy8gTWl4ZWRcbiAgICAgICAgICAgIC9cXGJiW2FpXSpkKD86dWhkfFt1Yl0qW2Fla29wcnN3eF17NSw2fSlbXFwvIF0/KFtcXHdcXC5dKykvaSAgICAgICAgICAgIC8vIEJhaWR1XG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsICdCYWlkdSddXSwgW1xuICAgICAgICAgICAgLyhraW5kbGUpXFwvKFtcXHdcXC5dKykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBLaW5kbGVcbiAgICAgICAgICAgIC8obHVuYXNjYXBlfG1heHRob258bmV0ZnJvbnR8amFzbWluZXxibGF6ZXIpW1xcLyBdPyhbXFx3XFwuXSopL2ksICAgICAgLy8gTHVuYXNjYXBlL01heHRob24vTmV0ZnJvbnQvSmFzbWluZS9CbGF6ZXJcbiAgICAgICAgICAgIC8vIFRyaWRlbnQgYmFzZWRcbiAgICAgICAgICAgIC8oYXZhbnR8aWVtb2JpbGV8c2xpbSlcXHM/KD86YnJvd3Nlcik/W1xcLyBdPyhbXFx3XFwuXSopL2ksICAgICAgICAgICAgIC8vIEF2YW50L0lFTW9iaWxlL1NsaW1Ccm93c2VyXG4gICAgICAgICAgICAvKD86bXN8XFwoKShpZSkgKFtcXHdcXC5dKykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEludGVybmV0IEV4cGxvcmVyXG5cbiAgICAgICAgICAgIC8vIFdlYmtpdC9LSFRNTCBiYXNlZCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRmxvY2svUm9ja01lbHQvTWlkb3JpL0VwaXBoYW55L1NpbGsvU2t5ZmlyZS9Cb2x0L0lyb24vSXJpZGl1bS9QaGFudG9tSlMvQm93c2VyL1F1cFppbGxhL0ZhbGtvblxuICAgICAgICAgICAgLyhmbG9ja3xyb2NrbWVsdHxtaWRvcml8ZXBpcGhhbnl8c2lsa3xza3lmaXJlfGJvbHR8aXJvbnx2aXZhbGRpfGlyaWRpdW18cGhhbnRvbWpzfGJvd3NlcnxxdWFya3xxdXB6aWxsYXxmYWxrb258cmVrb25xfHB1ZmZpbnxicmF2ZXx3aGFsZSg/IS4rbmF2ZXIpfHFxYnJvd3NlcmxpdGV8cXF8ZHVja2R1Y2tnbylcXC8oWy1cXHdcXC5dKykvaSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUmVrb25xL1B1ZmZpbi9CcmF2ZS9XaGFsZS9RUUJyb3dzZXJMaXRlL1FRLCBha2EgU2hvdVFcbiAgICAgICAgICAgIC8oaGV5dGFwfG92aSlicm93c2VyXFwvKFtcXGRcXC5dKykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSGV5dGFwL092aVxuICAgICAgICAgICAgLyh3ZWlibylfXyhbXFxkXFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdlaWJvXG4gICAgICAgICAgICBdLCBbTkFNRSwgVkVSU0lPTl0sIFtcbiAgICAgICAgICAgIC9cXGJkZGdcXC8oW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIER1Y2tEdWNrR29cbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgJ0R1Y2tEdWNrR28nXV0sIFtcbiAgICAgICAgICAgIC8oPzpcXGJ1Yz8gP2Jyb3dzZXJ8KD86anVjLispdWN3ZWIpW1xcLyBdPyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgIC8vIFVDQnJvd3NlclxuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCAnVUMnK0JST1dTRVJdXSwgW1xuICAgICAgICAgICAgL21pY3JvbS4rXFxicWJjb3JlXFwvKFtcXHdcXC5dKykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gV2VDaGF0IERlc2t0b3AgZm9yIFdpbmRvd3MgQnVpbHQtaW4gQnJvd3NlclxuICAgICAgICAgICAgL1xcYnFiY29yZVxcLyhbXFx3XFwuXSspLittaWNyb20vaSxcbiAgICAgICAgICAgIC9taWNyb21lc3NlbmdlclxcLyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gV2VDaGF0XG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsICdXZUNoYXQnXV0sIFtcbiAgICAgICAgICAgIC9rb25xdWVyb3JcXC8oW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gS29ucXVlcm9yXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsICdLb25xdWVyb3InXV0sIFtcbiAgICAgICAgICAgIC90cmlkZW50Litydls6IF0oW1xcd1xcLl17MSw5fSlcXGIuK2xpa2UgZ2Vja28vaSAgICAgICAgICAgICAgICAgICAgICAgLy8gSUUxMVxuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCAnSUUnXV0sIFtcbiAgICAgICAgICAgIC95YSg/OnNlYXJjaCk/YnJvd3NlclxcLyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gWWFuZGV4XG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsICdZYW5kZXgnXV0sIFtcbiAgICAgICAgICAgIC9zbGJyb3dzZXJcXC8oW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU21hcnQgTGVub3ZvIEJyb3dzZXJcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgJ1NtYXJ0IExlbm92byAnK0JST1dTRVJdXSwgW1xuICAgICAgICAgICAgLyhhdmFzdHxhdmcpXFwvKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBdmFzdC9BVkcgU2VjdXJlIEJyb3dzZXJcbiAgICAgICAgICAgIF0sIFtbTkFNRSwgLyguKykvLCAnJDEgU2VjdXJlICcrQlJPV1NFUl0sIFZFUlNJT05dLCBbXG4gICAgICAgICAgICAvXFxiZm9jdXNcXC8oW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBGaXJlZm94IEZvY3VzXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsIEZJUkVGT1grJyBGb2N1cyddXSwgW1xuICAgICAgICAgICAgL1xcYm9wdFxcLyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gT3BlcmEgVG91Y2hcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgT1BFUkErJyBUb3VjaCddXSwgW1xuICAgICAgICAgICAgL2NvY19jb2NcXHcrXFwvKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ29jIENvYyBCcm93c2VyXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsICdDb2MgQ29jJ11dLCBbXG4gICAgICAgICAgICAvZG9sZmluXFwvKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIERvbHBoaW5cbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgJ0RvbHBoaW4nXV0sIFtcbiAgICAgICAgICAgIC9jb2FzdFxcLyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gT3BlcmEgQ29hc3RcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgT1BFUkErJyBDb2FzdCddXSwgW1xuICAgICAgICAgICAgL21pdWlicm93c2VyXFwvKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBNSVVJIEJyb3dzZXJcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgJ01JVUkgJytCUk9XU0VSXV0sIFtcbiAgICAgICAgICAgIC9meGlvc1xcLyhbLVxcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRmlyZWZveCBmb3IgaU9TXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsIEZJUkVGT1hdXSwgW1xuICAgICAgICAgICAgL1xcYnFpaHV8KHFpP2hvP28/fDM2MClicm93c2VyL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gMzYwXG4gICAgICAgICAgICBdLCBbW05BTUUsICczNjAgJyArIEJST1dTRVJdXSwgW1xuICAgICAgICAgICAgLyhvY3VsdXN8c2FpbGZpc2h8aHVhd2VpfHZpdm8pYnJvd3NlclxcLyhbXFx3XFwuXSspL2lcbiAgICAgICAgICAgIF0sIFtbTkFNRSwgLyguKykvLCAnJDEgJyArIEJST1dTRVJdLCBWRVJTSU9OXSwgWyAgICAgICAgICAgICAgICAgICAgLy8gT2N1bHVzL1NhaWxmaXNoL0h1YXdlaUJyb3dzZXIvVml2b0Jyb3dzZXJcbiAgICAgICAgICAgIC9zYW1zdW5nYnJvd3NlclxcLyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU2Ftc3VuZyBJbnRlcm5ldFxuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCBTQU1TVU5HICsgJyBJbnRlcm5ldCddXSwgW1xuICAgICAgICAgICAgLyhjb21vZG9fZHJhZ29uKVxcLyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDb21vZG8gRHJhZ29uXG4gICAgICAgICAgICBdLCBbW05BTUUsIC9fL2csICcgJ10sIFZFUlNJT05dLCBbXG4gICAgICAgICAgICAvbWV0YXNyW1xcLyBdPyhbXFxkXFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNvZ291IEV4cGxvcmVyXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsICdTb2dvdSBFeHBsb3JlciddXSwgW1xuICAgICAgICAgICAgLyhzb2dvdSltb1xcdytcXC8oW1xcZFxcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU29nb3UgTW9iaWxlXG4gICAgICAgICAgICBdLCBbW05BTUUsICdTb2dvdSBNb2JpbGUnXSwgVkVSU0lPTl0sIFtcbiAgICAgICAgICAgIC8oZWxlY3Ryb24pXFwvKFtcXHdcXC5dKykgc2FmYXJpL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRWxlY3Ryb24tYmFzZWQgQXBwXG4gICAgICAgICAgICAvKHRlc2xhKSg/OiBxdGNhcmJyb3dzZXJ8XFwvKDIwXFxkXFxkXFwuWy1cXHdcXC5dKykpL2ksICAgICAgICAgICAgICAgICAgIC8vIFRlc2xhXG4gICAgICAgICAgICAvbT8ocXFicm93c2VyfDIzNDVFeHBsb3JlcilbXFwvIF0/KFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgIC8vIFFRQnJvd3Nlci8yMzQ1IEJyb3dzZXJcbiAgICAgICAgICAgIF0sIFtOQU1FLCBWRVJTSU9OXSwgW1xuICAgICAgICAgICAgLyhsYmJyb3dzZXIpL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBMaWVCYW8gQnJvd3NlclxuICAgICAgICAgICAgL1xcWyhsaW5rZWRpbilhcHBcXF0vaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIExpbmtlZEluIEFwcCBmb3IgaU9TICYgQW5kcm9pZFxuICAgICAgICAgICAgXSwgW05BTUVdLCBbXG5cbiAgICAgICAgICAgIC8vIFdlYlZpZXdcbiAgICAgICAgICAgIC8oKD86ZmJhblxcL2ZiaW9zfGZiX2lhYlxcL2ZiNGEpKD8hLitmYmF2KXw7ZmJhdlxcLyhbXFx3XFwuXSspOykvaSAgICAgICAvLyBGYWNlYm9vayBBcHAgZm9yIGlPUyAmIEFuZHJvaWRcbiAgICAgICAgICAgIF0sIFtbTkFNRSwgRkFDRUJPT0tdLCBWRVJTSU9OXSwgW1xuICAgICAgICAgICAgLyhLbGFybmEpXFwvKFtcXHdcXC5dKykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBLbGFybmEgU2hvcHBpbmcgQnJvd3NlciBmb3IgaU9TICYgQW5kcm9pZFxuICAgICAgICAgICAgLyhrYWthbyg/OnRhbGt8c3RvcnkpKVtcXC8gXShbXFx3XFwuXSspL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBLYWthbyBBcHBcbiAgICAgICAgICAgIC8obmF2ZXIpXFwoLio/KFxcZCtcXC5bXFx3XFwuXSspLipcXCkvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTmF2ZXIgSW5BcHBcbiAgICAgICAgICAgIC9zYWZhcmkgKGxpbmUpXFwvKFtcXHdcXC5dKykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTGluZSBBcHAgZm9yIGlPU1xuICAgICAgICAgICAgL1xcYihsaW5lKVxcLyhbXFx3XFwuXSspXFwvaWFiL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIExpbmUgQXBwIGZvciBBbmRyb2lkXG4gICAgICAgICAgICAvKGFsaXBheSljbGllbnRcXC8oW1xcd1xcLl0rKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFsaXBheVxuICAgICAgICAgICAgLyh0d2l0dGVyKSg/OmFuZHwgZi4rZVxcLyhbXFx3XFwuXSspKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUd2l0dGVyXG4gICAgICAgICAgICAvKGNocm9taXVtfGluc3RhZ3JhbXxzbmFwY2hhdClbXFwvIF0oWy1cXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgIC8vIENocm9taXVtL0luc3RhZ3JhbS9TbmFwY2hhdFxuICAgICAgICAgICAgXSwgW05BTUUsIFZFUlNJT05dLCBbXG4gICAgICAgICAgICAvXFxiZ3NhXFwvKFtcXHdcXC5dKykgLipzYWZhcmlcXC8vaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gR29vZ2xlIFNlYXJjaCBBcHBsaWFuY2Ugb24gaU9TXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsICdHU0EnXV0sIFtcbiAgICAgICAgICAgIC9tdXNpY2FsX2x5KD86LithcHBfP3ZlcnNpb25cXC98XykoW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGlrVG9rXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsICdUaWtUb2snXV0sIFtcblxuICAgICAgICAgICAgL2hlYWRsZXNzY2hyb21lKD86XFwvKFtcXHdcXC5dKyl8ICkvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDaHJvbWUgSGVhZGxlc3NcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgQ0hST01FKycgSGVhZGxlc3MnXV0sIFtcblxuICAgICAgICAgICAgLyB3dlxcKS4rKGNocm9tZSlcXC8oW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ2hyb21lIFdlYlZpZXdcbiAgICAgICAgICAgIF0sIFtbTkFNRSwgQ0hST01FKycgV2ViVmlldyddLCBWRVJTSU9OXSwgW1xuXG4gICAgICAgICAgICAvZHJvaWQuKyB2ZXJzaW9uXFwvKFtcXHdcXC5dKylcXGIuKyg/Om1vYmlsZSBzYWZhcml8c2FmYXJpKS9pICAgICAgICAgICAvLyBBbmRyb2lkIEJyb3dzZXJcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgJ0FuZHJvaWQgJytCUk9XU0VSXV0sIFtcblxuICAgICAgICAgICAgLyhjaHJvbWV8b21uaXdlYnxhcm9yYXxbdGl6ZW5va2FdezV9ID9icm93c2VyKVxcL3Y/KFtcXHdcXC5dKykvaSAgICAgICAvLyBDaHJvbWUvT21uaVdlYi9Bcm9yYS9UaXplbi9Ob2tpYVxuICAgICAgICAgICAgXSwgW05BTUUsIFZFUlNJT05dLCBbXG5cbiAgICAgICAgICAgIC92ZXJzaW9uXFwvKFtcXHdcXC5cXCxdKykgLiptb2JpbGVcXC9cXHcrIChzYWZhcmkpL2kgICAgICAgICAgICAgICAgICAgICAgLy8gTW9iaWxlIFNhZmFyaVxuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCAnTW9iaWxlIFNhZmFyaSddXSwgW1xuICAgICAgICAgICAgL3ZlcnNpb25cXC8oW1xcdyhcXC58XFwsKV0rKSAuKihtb2JpbGUgP3NhZmFyaXxzYWZhcmkpL2kgICAgICAgICAgICAgICAgLy8gU2FmYXJpICYgU2FmYXJpIE1vYmlsZVxuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIE5BTUVdLCBbXG4gICAgICAgICAgICAvd2Via2l0Lis/KG1vYmlsZSA/c2FmYXJpfHNhZmFyaSkoXFwvW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgIC8vIFNhZmFyaSA8IDMuMFxuICAgICAgICAgICAgXSwgW05BTUUsIFtWRVJTSU9OLCBzdHJNYXBwZXIsIG9sZFNhZmFyaU1hcF1dLCBbXG5cbiAgICAgICAgICAgIC8od2Via2l0fGtodG1sKVxcLyhbXFx3XFwuXSspL2lcbiAgICAgICAgICAgIF0sIFtOQU1FLCBWRVJTSU9OXSwgW1xuXG4gICAgICAgICAgICAvLyBHZWNrbyBiYXNlZFxuICAgICAgICAgICAgLyhuYXZpZ2F0b3J8bmV0c2NhcGVcXGQ/KVxcLyhbLVxcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTmV0c2NhcGVcbiAgICAgICAgICAgIF0sIFtbTkFNRSwgJ05ldHNjYXBlJ10sIFZFUlNJT05dLCBbXG4gICAgICAgICAgICAvbW9iaWxlIHZyOyBydjooW1xcd1xcLl0rKVxcKS4rZmlyZWZveC9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZpcmVmb3ggUmVhbGl0eVxuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCBGSVJFRk9YKycgUmVhbGl0eSddXSwgW1xuICAgICAgICAgICAgL2VraW9oZi4rKGZsb3cpXFwvKFtcXHdcXC5dKykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBGbG93XG4gICAgICAgICAgICAvKHN3aWZ0Zm94KS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFN3aWZ0Zm94XG4gICAgICAgICAgICAvKGljZWRyYWdvbnxpY2V3ZWFzZWx8Y2FtaW5vfGNoaW1lcmF8ZmVubmVjfG1hZW1vIGJyb3dzZXJ8bWluaW1vfGNvbmtlcm9yfGtsYXIpW1xcLyBdPyhbXFx3XFwuXFwrXSspL2ksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEljZURyYWdvbi9JY2V3ZWFzZWwvQ2FtaW5vL0NoaW1lcmEvRmVubmVjL01hZW1vL01pbmltby9Db25rZXJvci9LbGFyXG4gICAgICAgICAgICAvKHNlYW1vbmtleXxrLW1lbGVvbnxpY2VjYXR8aWNlYXBlfGZpcmViaXJkfHBob2VuaXh8cGFsZW1vb258YmFzaWxpc2t8d2F0ZXJmb3gpXFwvKFstXFx3XFwuXSspJC9pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBGaXJlZm94L1NlYU1vbmtleS9LLU1lbGVvbi9JY2VDYXQvSWNlQXBlL0ZpcmViaXJkL1Bob2VuaXhcbiAgICAgICAgICAgIC8oZmlyZWZveClcXC8oW1xcd1xcLl0rKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gT3RoZXIgRmlyZWZveC1iYXNlZFxuICAgICAgICAgICAgLyhtb3ppbGxhKVxcLyhbXFx3XFwuXSspIC4rcnZcXDouK2dlY2tvXFwvXFxkKy9pLCAgICAgICAgICAgICAgICAgICAgICAgICAvLyBNb3ppbGxhXG5cbiAgICAgICAgICAgIC8vIE90aGVyXG4gICAgICAgICAgICAvKHBvbGFyaXN8bHlueHxkaWxsb3xpY2FifGRvcmlzfGFtYXlhfHczbXxuZXRzdXJmfHNsZWlwbmlyfG9iaWdvfG1vc2FpY3woPzpnb3xpY2V8dXApW1xcLiBdP2Jyb3dzZXIpWy1cXC8gXT92PyhbXFx3XFwuXSspL2ksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFBvbGFyaXMvTHlueC9EaWxsby9pQ2FiL0RvcmlzL0FtYXlhL3czbS9OZXRTdXJmL1NsZWlwbmlyL09iaWdvL01vc2FpYy9Hby9JQ0UvVVAuQnJvd3NlclxuICAgICAgICAgICAgLyhsaW5rcykgXFwoKFtcXHdcXC5dKykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBMaW5rc1xuICAgICAgICAgICAgL3BhbmFzb25pYzsodmllcmEpL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBQYW5hc29uaWMgVmllcmFcbiAgICAgICAgICAgIF0sIFtOQU1FLCBWRVJTSU9OXSwgW1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvKGNvYmFsdClcXC8oW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIENvYmFsdFxuICAgICAgICAgICAgXSwgW05BTUUsIFtWRVJTSU9OLCAvbWFzdGVyLnxsdHMuLywgXCJcIl1dXG4gICAgICAgIF0sXG5cbiAgICAgICAgY3B1IDogW1tcblxuICAgICAgICAgICAgLyg/OihhbWR8eCg/Oig/Ojg2fDY0KVstX10pP3x3b3d8d2luKTY0KVs7XFwpXS9pICAgICAgICAgICAgICAgICAgICAgLy8gQU1ENjQgKHg2NClcbiAgICAgICAgICAgIF0sIFtbQVJDSElURUNUVVJFLCAnYW1kNjQnXV0sIFtcblxuICAgICAgICAgICAgLyhpYTMyKD89OykpL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBJQTMyIChxdWlja3RpbWUpXG4gICAgICAgICAgICBdLCBbW0FSQ0hJVEVDVFVSRSwgbG93ZXJpemVdXSwgW1xuXG4gICAgICAgICAgICAvKCg/OmlbMzQ2XXx4KTg2KVs7XFwpXS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBJQTMyICh4ODYpXG4gICAgICAgICAgICBdLCBbW0FSQ0hJVEVDVFVSRSwgJ2lhMzInXV0sIFtcblxuICAgICAgICAgICAgL1xcYihhYXJjaDY0fGFybSh2PzhlP2w/fF8/NjQpKVxcYi9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQVJNNjRcbiAgICAgICAgICAgIF0sIFtbQVJDSElURUNUVVJFLCAnYXJtNjQnXV0sIFtcblxuICAgICAgICAgICAgL1xcYihhcm0oPzp2WzY3XSk/aHQ/bj9bZmxdcD8pXFxiL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFSTUhGXG4gICAgICAgICAgICBdLCBbW0FSQ0hJVEVDVFVSRSwgJ2FybWhmJ11dLCBbXG5cbiAgICAgICAgICAgIC8vIFBvY2tldFBDIG1pc3Rha2VubHkgaWRlbnRpZmllZCBhcyBQb3dlclBDXG4gICAgICAgICAgICAvd2luZG93cyAoY2V8bW9iaWxlKTsgcHBjOy9pXG4gICAgICAgICAgICBdLCBbW0FSQ0hJVEVDVFVSRSwgJ2FybSddXSwgW1xuXG4gICAgICAgICAgICAvKCg/OnBwY3xwb3dlcnBjKSg/OjY0KT8pKD86IG1hY3w7fFxcKSkvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBQb3dlclBDXG4gICAgICAgICAgICBdLCBbW0FSQ0hJVEVDVFVSRSwgL293ZXIvLCBFTVBUWSwgbG93ZXJpemVdXSwgW1xuXG4gICAgICAgICAgICAvKHN1bjRcXHcpWztcXCldL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU1BBUkNcbiAgICAgICAgICAgIF0sIFtbQVJDSElURUNUVVJFLCAnc3BhcmMnXV0sIFtcblxuICAgICAgICAgICAgLygoPzphdnIzMnxpYTY0KD89OykpfDY4ayg/PVxcKSl8XFxiYXJtKD89dig/OlsxLTddfFs1LTddMSlsP3w7fGVhYmkpfCg/PWF0bWVsIClhdnJ8KD86aXJpeHxtaXBzfHNwYXJjKSg/OjY0KT9cXGJ8cGEtcmlzYykvaVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBJQTY0LCA2OEssIEFSTS82NCwgQVZSLzMyLCBJUklYLzY0LCBNSVBTLzY0LCBTUEFSQy82NCwgUEEtUklTQ1xuICAgICAgICAgICAgXSwgW1tBUkNISVRFQ1RVUkUsIGxvd2VyaXplXV1cbiAgICAgICAgXSxcblxuICAgICAgICBkZXZpY2UgOiBbW1xuXG4gICAgICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgICAgICAgICAgLy8gTU9CSUxFUyAmIFRBQkxFVFNcbiAgICAgICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgICAgICAgLy8gU2Ftc3VuZ1xuICAgICAgICAgICAgL1xcYihzY2gtaVs4OV0wXFxkfHNody1tMzgwc3xzbS1bcHR4XVxcd3syLDR9fGd0LVtwbl1cXGR7Miw0fXxzZ2gtdDhbNTZdOXxuZXh1cyAxMCkvaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBTQU1TVU5HXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvXFxiKCg/OnNbY2dwXWh8Z3R8c20pLVxcdyt8c2NbZy1dP1tcXGRdK2E/fGdhbGF4eSBuZXh1cykvaSxcbiAgICAgICAgICAgIC9zYW1zdW5nWy0gXShbLVxcd10rKS9pLFxuICAgICAgICAgICAgL3NlYy0oc2doXFx3KykvaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBTQU1TVU5HXSwgW1RZUEUsIE1PQklMRV1dLCBbXG5cbiAgICAgICAgICAgIC8vIEFwcGxlXG4gICAgICAgICAgICAvKD86XFwvfFxcKCkoaXAoPzpob25lfG9kKVtcXHcsIF0qKSg/OlxcL3w7KS9pICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpUG9kL2lQaG9uZVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBBUFBMRV0sIFtUWVBFLCBNT0JJTEVdXSwgW1xuICAgICAgICAgICAgL1xcKChpcGFkKTtbLVxcd1xcKSw7IF0rYXBwbGUvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpUGFkXG4gICAgICAgICAgICAvYXBwbGVjb3JlbWVkaWFcXC9bXFx3XFwuXSsgXFwoKGlwYWQpL2ksXG4gICAgICAgICAgICAvXFxiKGlwYWQpXFxkXFxkPyxcXGRcXGQ/WztcXF1dLitpb3MvaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBBUFBMRV0sIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgLyhtYWNpbnRvc2gpOy9pXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIEFQUExFXV0sIFtcblxuICAgICAgICAgICAgLy8gU2hhcnBcbiAgICAgICAgICAgIC9cXGIoc2gtP1thbHR2el0/XFxkXFxkW2EtZWttXT8pL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgU0hBUlBdLCBbVFlQRSwgTU9CSUxFXV0sIFtcblxuICAgICAgICAgICAgLy8gSHVhd2VpXG4gICAgICAgICAgICAvXFxiKCg/OmFnW3JzXVsyM10/fGJhaDI/fHNodD98YnR2KS1hP1tsd11cXGR7Mn0pXFxiKD8hLitkXFwvcykvaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBIVUFXRUldLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC8oPzpodWF3ZWl8aG9ub3IpKFstXFx3IF0rKVs7XFwpXS9pLFxuICAgICAgICAgICAgL1xcYihuZXh1cyA2cHxcXHd7Miw0fWU/LVthdHVdP1tsbl1bXFxkeF1bMDEyMzU5Y11bYWRuXT8pXFxiKD8hLitkXFwvcykvaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBIVUFXRUldLCBbVFlQRSwgTU9CSUxFXV0sIFtcblxuICAgICAgICAgICAgLy8gWGlhb21pXG4gICAgICAgICAgICAvXFxiKHBvY29bXFx3IF0rfG0yXFxkezN9alxcZFxcZFthLXpdezJ9KSg/OiBidWl8XFwpKS9pLCAgICAgICAgICAgICAgICAgIC8vIFhpYW9taSBQT0NPXG4gICAgICAgICAgICAvXFxiOyAoXFx3KykgYnVpbGRcXC9obVxcMS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBYaWFvbWkgSG9uZ21pICdudW1lcmljJyBtb2RlbHNcbiAgICAgICAgICAgIC9cXGIoaG1bLV8gXT9ub3RlP1tfIF0/KD86XFxkXFx3KT8pIGJ1aS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gWGlhb21pIEhvbmdtaVxuICAgICAgICAgICAgL1xcYihyZWRtaVtcXC1fIF0/KD86bm90ZXxrKT9bXFx3XyBdKykoPzogYnVpfFxcKSkvaSwgICAgICAgICAgICAgICAgICAgLy8gWGlhb21pIFJlZG1pXG4gICAgICAgICAgICAvb2lkW15cXCldKzsgKG0/WzEyXVswLTM4OV1bMDFdXFx3ezMsNn1bYy15XSkoIGJ1aXw7IHd2fFxcKSkvaSwgICAgICAgIC8vIFhpYW9taSBSZWRtaSAnbnVtZXJpYycgbW9kZWxzXG4gICAgICAgICAgICAvXFxiKG1pWy1fIF0/KD86YVxcZHxvbmV8b25lW18gXXBsdXN8bm90ZSBsdGV8bWF4fGNjKT9bXyBdPyg/OlxcZD9cXHc/KVtfIF0/KD86cGx1c3xzZXxsaXRlKT8pKD86IGJ1aXxcXCkpL2kgLy8gWGlhb21pIE1pXG4gICAgICAgICAgICBdLCBbW01PREVMLCAvXy9nLCAnICddLCBbVkVORE9SLCBYSUFPTUldLCBbVFlQRSwgTU9CSUxFXV0sIFtcbiAgICAgICAgICAgIC9vaWRbXlxcKV0rOyAoMlxcZHs0fSgyODN8cnBiZilbY2dsXSkoIGJ1aXxcXCkpL2ksICAgICAgICAgICAgICAgICAgICAgLy8gUmVkbWkgUGFkXG4gICAgICAgICAgICAvXFxiKG1pWy1fIF0/KD86cGFkKSg/OltcXHdfIF0rKSkoPzogYnVpfFxcKSkvaSAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1pIFBhZCB0YWJsZXRzXG4gICAgICAgICAgICBdLFtbTU9ERUwsIC9fL2csICcgJ10sIFtWRU5ET1IsIFhJQU9NSV0sIFtUWVBFLCBUQUJMRVRdXSwgW1xuXG4gICAgICAgICAgICAvLyBPUFBPXG4gICAgICAgICAgICAvOyAoXFx3KykgYnVpLisgb3Bwby9pLFxuICAgICAgICAgICAgL1xcYihjcGhbMTJdXFxkezN9fHAoPzphZnxjW2FsXXxkXFx3fGVbYXJdKVttdF1cXGQwfHg5MDA3fGExMDFvcClcXGIvaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnT1BQTyddLCBbVFlQRSwgTU9CSUxFXV0sIFtcbiAgICAgICAgICAgIC9cXGIob3BkMlxcZHszfWE/KSBidWkvaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnT1BQTyddLCBbVFlQRSwgVEFCTEVUXV0sIFtcblxuICAgICAgICAgICAgLy8gVml2b1xuICAgICAgICAgICAgL3Zpdm8gKFxcdyspKD86IGJ1aXxcXCkpL2ksXG4gICAgICAgICAgICAvXFxiKHZbMTJdXFxkezN9XFx3P1thdF0pKD86IGJ1aXw7KS9pXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdWaXZvJ10sIFtUWVBFLCBNT0JJTEVdXSwgW1xuXG4gICAgICAgICAgICAvLyBSZWFsbWVcbiAgICAgICAgICAgIC9cXGIocm14WzEtM11cXGR7M30pKD86IGJ1aXw7fFxcKSkvaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnUmVhbG1lJ10sIFtUWVBFLCBNT0JJTEVdXSwgW1xuXG4gICAgICAgICAgICAvLyBNb3Rvcm9sYVxuICAgICAgICAgICAgL1xcYihtaWxlc3RvbmV8ZHJvaWQoPzpbMi00eF18ICg/OmJpb25pY3x4Mnxwcm98cmF6cikpPzo/KCA0Zyk/KVxcYltcXHcgXStidWlsZFxcLy9pLFxuICAgICAgICAgICAgL1xcYm1vdCg/Om9yb2xhKT9bLSBdKFxcdyopL2ksXG4gICAgICAgICAgICAvKCg/Om1vdG9bXFx3XFwoXFwpIF0rfHh0XFxkezMsNH18bmV4dXMgNikoPz0gYnVpfFxcKSkpL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgTU9UT1JPTEFdLCBbVFlQRSwgTU9CSUxFXV0sIFtcbiAgICAgICAgICAgIC9cXGIobXo2MFxcZHx4b29tWzIgXXswLDJ9KSBidWlsZFxcLy9pXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIE1PVE9ST0xBXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG5cbiAgICAgICAgICAgIC8vIExHXG4gICAgICAgICAgICAvKCg/PWxnKT9bdmxda1xcLT9cXGR7M30pIGJ1aXwgM1xcLlstXFx3OyBdezEwfWxnPy0oWzA2Y3Y5XXszLDR9KS9pXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIExHXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvKGxtKD86LT9mMTAwW252XT98LVtcXHdcXC5dKykoPz0gYnVpfFxcKSl8bmV4dXMgWzQ1XSkvaSxcbiAgICAgICAgICAgIC9cXGJsZ1stZTtcXC8gXSsoKD8hYnJvd3NlcnxuZXRjYXN0fGFuZHJvaWQgdHYpXFx3KykvaSxcbiAgICAgICAgICAgIC9cXGJsZy0/KFtcXGRcXHddKykgYnVpL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgTEddLCBbVFlQRSwgTU9CSUxFXV0sIFtcblxuICAgICAgICAgICAgLy8gTGVub3ZvXG4gICAgICAgICAgICAvKGlkZWF0YWJbLVxcdyBdKykvaSxcbiAgICAgICAgICAgIC9sZW5vdm8gPyhzWzU2XTAwMFstXFx3XSt8dGFiKD86W1xcdyBdKyl8eXRbLVxcZFxcd117Nn18dGJbLVxcZFxcd117Nn0pL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ0xlbm92byddLCBbVFlQRSwgVEFCTEVUXV0sIFtcblxuICAgICAgICAgICAgLy8gTm9raWFcbiAgICAgICAgICAgIC8oPzptYWVtb3xub2tpYSkuKihuOTAwfGx1bWlhIFxcZCspL2ksXG4gICAgICAgICAgICAvbm9raWFbLV8gXT8oWy1cXHdcXC5dKikvaVxuICAgICAgICAgICAgXSwgW1tNT0RFTCwgL18vZywgJyAnXSwgW1ZFTkRPUiwgJ05va2lhJ10sIFtUWVBFLCBNT0JJTEVdXSwgW1xuXG4gICAgICAgICAgICAvLyBHb29nbGVcbiAgICAgICAgICAgIC8ocGl4ZWwgYylcXGIvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEdvb2dsZSBQaXhlbCBDXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIEdPT0dMRV0sIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgL2Ryb2lkLis7IChwaXhlbFtcXGRheGwgXXswLDZ9KSg/OiBidWl8XFwpKS9pICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEdvb2dsZSBQaXhlbFxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBHT09HTEVdLCBbVFlQRSwgTU9CSUxFXV0sIFtcblxuICAgICAgICAgICAgLy8gU29ueVxuICAgICAgICAgICAgL2Ryb2lkLisgKGE/XFxkWzAtMl17Mn1zb3xbYy1nXVxcZHs0fXxzb1stZ2xdXFx3K3x4cS1hXFx3WzQtN11bMTJdKSg/PSBidWl8XFwpLitjaHJvbWVcXC8oPyFbMS02XXswLDF9XFxkXFwuKSkvaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBTT05ZXSwgW1RZUEUsIE1PQklMRV1dLCBbXG4gICAgICAgICAgICAvc29ueSB0YWJsZXQgW3BzXS9pLFxuICAgICAgICAgICAgL1xcYig/OnNvbnkpP3NncFxcdysoPzogYnVpfFxcKSkvaVxuICAgICAgICAgICAgXSwgW1tNT0RFTCwgJ1hwZXJpYSBUYWJsZXQnXSwgW1ZFTkRPUiwgU09OWV0sIFtUWVBFLCBUQUJMRVRdXSwgW1xuXG4gICAgICAgICAgICAvLyBPbmVQbHVzXG4gICAgICAgICAgICAvIChrYjIwMDV8aW4yMFsxMl01fGJlMjBbMTJdWzU5XSlcXGIvaSxcbiAgICAgICAgICAgIC8oPzpvbmUpPyg/OnBsdXMpPyAoYVxcZDBcXGRcXGQpKD86IGJ8XFwpKS9pXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdPbmVQbHVzJ10sIFtUWVBFLCBNT0JJTEVdXSwgW1xuXG4gICAgICAgICAgICAvLyBBbWF6b25cbiAgICAgICAgICAgIC8oYWxleGEpd2VibS9pLFxuICAgICAgICAgICAgLyhrZlthLXpdezJ9d2l8YWVvW2Mtcl17Mn0pKCBidWl8XFwpKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gS2luZGxlIEZpcmUgd2l0aG91dCBTaWxrIC8gRWNobyBTaG93XG4gICAgICAgICAgICAvKGtmW2Etel0rKSggYnVpfFxcKSkuK3NpbGtcXC8vaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gS2luZGxlIEZpcmUgSERcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgQU1BWk9OXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvKCg/OnNkfGtmKVswMzQ5aGlqb3JzdHV3XSspKCBidWl8XFwpKS4rc2lsa1xcLy9pICAgICAgICAgICAgICAgICAgICAgLy8gRmlyZSBQaG9uZVxuICAgICAgICAgICAgXSwgW1tNT0RFTCwgLyguKykvZywgJ0ZpcmUgUGhvbmUgJDEnXSwgW1ZFTkRPUiwgQU1BWk9OXSwgW1RZUEUsIE1PQklMRV1dLCBbXG5cbiAgICAgICAgICAgIC8vIEJsYWNrQmVycnlcbiAgICAgICAgICAgIC8ocGxheWJvb2spO1stXFx3XFwpLDsgXSsocmltKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBCbGFja0JlcnJ5IFBsYXlCb29rXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFZFTkRPUiwgW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvXFxiKCg/OmJiW2EtZl18c3RbaHZdKTEwMC1cXGQpL2ksXG4gICAgICAgICAgICAvXFwoYmIxMDsgKFxcdyspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQmxhY2tCZXJyeSAxMFxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBCTEFDS0JFUlJZXSwgW1RZUEUsIE1PQklMRV1dLCBbXG5cbiAgICAgICAgICAgIC8vIEFzdXNcbiAgICAgICAgICAgIC8oPzpcXGJ8YXN1c18pKHRyYW5zZm9bcHJpbWUgXXs0LDEwfSBcXHcrfGVlZXBjfHNsaWRlciBcXHcrfG5leHVzIDd8cGFkZm9uZXxwMDBbY2pdKS9pXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIEFTVVNdLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC8gKHpbYmVzXTZbMDI3XVswMTJdW2ttXVtsc118emVuZm9uZSBcXGRcXHc/KVxcYi9pXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIEFTVVNdLCBbVFlQRSwgTU9CSUxFXV0sIFtcblxuICAgICAgICAgICAgLy8gSFRDXG4gICAgICAgICAgICAvKG5leHVzIDkpL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEhUQyBOZXh1cyA5XG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdIVEMnXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvKGh0YylbLTtfIF17MSwyfShbXFx3IF0rKD89XFwpfCBidWkpfFxcdyspL2ksICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEhUQ1xuXG4gICAgICAgICAgICAvLyBaVEVcbiAgICAgICAgICAgIC8oenRlKVstIF0oW1xcdyBdKz8pKD86IGJ1aXxcXC98XFwpKS9pLFxuICAgICAgICAgICAgLyhhbGNhdGVsfGdlZWtzcGhvbmV8bmV4aWFufHBhbmFzb25pYyg/ISg/Ojt8XFwuKSl8c29ueSg/IS1icmEpKVstXyBdPyhbLVxcd10qKS9pICAgICAgICAgLy8gQWxjYXRlbC9HZWVrc1Bob25lL05leGlhbi9QYW5hc29uaWMvU29ueVxuICAgICAgICAgICAgXSwgW1ZFTkRPUiwgW01PREVMLCAvXy9nLCAnICddLCBbVFlQRSwgTU9CSUxFXV0sIFtcblxuICAgICAgICAgICAgLy8gQWNlclxuICAgICAgICAgICAgL2Ryb2lkLis7IChbYWJdWzEtN10tP1swMTc4YV1cXGRcXGQ/KS9pXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdBY2VyJ10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuXG4gICAgICAgICAgICAvLyBNZWl6dVxuICAgICAgICAgICAgL2Ryb2lkLis7IChtWzEtNV0gbm90ZSkgYnVpL2ksXG4gICAgICAgICAgICAvXFxibXotKFstXFx3XXsyLH0pL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ01laXp1J10sIFtUWVBFLCBNT0JJTEVdXSwgW1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gVWxlZm9uZVxuICAgICAgICAgICAgLzsgKCg/OnBvd2VyICk/YXJtb3IoPzpbXFx3IF17MCw4fSkpKD86IGJ1aXxcXCkpL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ1VsZWZvbmUnXSwgW1RZUEUsIE1PQklMRV1dLCBbXG5cbiAgICAgICAgICAgIC8vIE1JWEVEXG4gICAgICAgICAgICAvKGJsYWNrYmVycnl8YmVucXxwYWxtKD89XFwtKXxzb255ZXJpY3Nzb258YWNlcnxhc3VzfGRlbGx8bWVpenV8bW90b3JvbGF8cG9seXRyb258aW5maW5peHx0ZWNubylbLV8gXT8oWy1cXHddKikvaSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQmxhY2tCZXJyeS9CZW5RL1BhbG0vU29ueS1Fcmljc3Nvbi9BY2VyL0FzdXMvRGVsbC9NZWl6dS9Nb3Rvcm9sYS9Qb2x5dHJvblxuICAgICAgICAgICAgLyhocCkgKFtcXHcgXStcXHcpL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEhQIGlQQVFcbiAgICAgICAgICAgIC8oYXN1cyktPyhcXHcrKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFzdXNcbiAgICAgICAgICAgIC8obWljcm9zb2Z0KTsgKGx1bWlhW1xcdyBdKykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1pY3Jvc29mdCBMdW1pYVxuICAgICAgICAgICAgLyhsZW5vdm8pWy1fIF0/KFstXFx3XSspL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTGVub3ZvXG4gICAgICAgICAgICAvKGpvbGxhKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEpvbGxhXG4gICAgICAgICAgICAvKG9wcG8pID8oW1xcdyBdKykgYnVpL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBPUFBPXG4gICAgICAgICAgICBdLCBbVkVORE9SLCBNT0RFTCwgW1RZUEUsIE1PQklMRV1dLCBbXG5cbiAgICAgICAgICAgIC8oa29ibylcXHMoZXJlYWRlcnx0b3VjaCkvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEtvYm9cbiAgICAgICAgICAgIC8oYXJjaG9zKSAoZ2FtZXBhZDI/KS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQXJjaG9zXG4gICAgICAgICAgICAvKGhwKS4rKHRvdWNocGFkKD8hLit0YWJsZXQpfHRhYmxldCkvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEhQIFRvdWNoUGFkXG4gICAgICAgICAgICAvKGtpbmRsZSlcXC8oW1xcd1xcLl0rKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEtpbmRsZVxuICAgICAgICAgICAgLyhub29rKVtcXHcgXStidWlsZFxcLyhcXHcrKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBOb29rXG4gICAgICAgICAgICAvKGRlbGwpIChzdHJlYVtrcHJcXGQgXSpbXFxka29dKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRGVsbCBTdHJlYWtcbiAgICAgICAgICAgIC8obGVbLSBdK3BhbilbLSBdKyhcXHd7MSw5fSkgYnVpL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIExlIFBhbiBUYWJsZXRzXG4gICAgICAgICAgICAvKHRyaW5pdHkpWy0gXSoodFxcZHszfSkgYnVpL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUcmluaXR5IFRhYmxldHNcbiAgICAgICAgICAgIC8oZ2lnYXNldClbLSBdKyhxXFx3ezEsOX0pIGJ1aS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEdpZ2FzZXQgVGFibGV0c1xuICAgICAgICAgICAgLyh2b2RhZm9uZSkgKFtcXHcgXSspKD86XFwpfCBidWkpL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFZvZGFmb25lXG4gICAgICAgICAgICBdLCBbVkVORE9SLCBNT0RFTCwgW1RZUEUsIFRBQkxFVF1dLCBbXG5cbiAgICAgICAgICAgIC8oc3VyZmFjZSBkdW8pL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU3VyZmFjZSBEdW9cbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgTUlDUk9TT0ZUXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvZHJvaWQgW1xcZFxcLl0rOyAoZnBcXGR1PykoPzogYnxcXCkpL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBGYWlycGhvbmVcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ0ZhaXJwaG9uZSddLCBbVFlQRSwgTU9CSUxFXV0sIFtcbiAgICAgICAgICAgIC8odTMwNGFhKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQVQmVFxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnQVQmVCddLCBbVFlQRSwgTU9CSUxFXV0sIFtcbiAgICAgICAgICAgIC9cXGJzaWUtKFxcdyopL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTaWVtZW5zXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdTaWVtZW5zJ10sIFtUWVBFLCBNT0JJTEVdXSwgW1xuICAgICAgICAgICAgL1xcYihyY3RcXHcrKSBiL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFJDQSBUYWJsZXRzXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdSQ0EnXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvXFxiKHZlbnVlW1xcZCBdezIsN30pIGIvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRGVsbCBWZW51ZSBUYWJsZXRzXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdEZWxsJ10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgL1xcYihxKD86bXZ8dGEpXFx3KykgYi9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFZlcml6b24gVGFibGV0XG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdWZXJpem9uJ10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgL1xcYig/OmJhcm5lc1smIF0rbm9ibGUgfGJuW3J0XSkoW1xcd1xcKyBdKikgYi9pICAgICAgICAgICAgICAgICAgICAgICAvLyBCYXJuZXMgJiBOb2JsZSBUYWJsZXRcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ0Jhcm5lcyAmIE5vYmxlJ10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgL1xcYih0bVxcZHszfVxcdyspIGIvaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnTnVWaXNpb24nXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvXFxiKGs4OCkgYi9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBaVEUgSyBTZXJpZXMgVGFibGV0XG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdaVEUnXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvXFxiKG54XFxkezN9aikgYi9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gWlRFIE51YmlhXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdaVEUnXSwgW1RZUEUsIE1PQklMRV1dLCBbXG4gICAgICAgICAgICAvXFxiKGdlblxcZHszfSkgYi4rNDloL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU3dpc3MgR0VOIE1vYmlsZVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnU3dpc3MnXSwgW1RZUEUsIE1PQklMRV1dLCBbXG4gICAgICAgICAgICAvXFxiKHp1clxcZHszfSkgYi9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU3dpc3MgWlVSIFRhYmxldFxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnU3dpc3MnXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvXFxiKCh6ZWtpKT90Yi4qXFxiKSBiL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gWmVraSBUYWJsZXRzXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdaZWtpJ10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgL1xcYihbeXJdXFxkezJ9KSBiL2ksXG4gICAgICAgICAgICAvXFxiKGRyYWdvblstIF0rdG91Y2ggfGR0KShcXHd7NX0pIGIvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRHJhZ29uIFRvdWNoIFRhYmxldFxuICAgICAgICAgICAgXSwgW1tWRU5ET1IsICdEcmFnb24gVG91Y2gnXSwgTU9ERUwsIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgL1xcYihucy0/XFx3ezAsOX0pIGIvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEluc2lnbmlhIFRhYmxldHNcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ0luc2lnbmlhJ10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgL1xcYigobnhhfG5leHQpLT9cXHd7MCw5fSkgYi9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE5leHRCb29rIFRhYmxldHNcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ05leHRCb29rJ10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgL1xcYih4dHJlbWVcXF8pPyh2KDFbMDQ1XXwyWzAxNV18WzM0NjldMHw3WzA1XSkpIGIvaSAgICAgICAgICAgICAgICAgIC8vIFZvaWNlIFh0cmVtZSBQaG9uZXNcbiAgICAgICAgICAgIF0sIFtbVkVORE9SLCAnVm9pY2UnXSwgTU9ERUwsIFtUWVBFLCBNT0JJTEVdXSwgW1xuICAgICAgICAgICAgL1xcYihsdnRlbFxcLSk/KHYxWzEyXSkgYi9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEx2VGVsIFBob25lc1xuICAgICAgICAgICAgXSwgW1tWRU5ET1IsICdMdlRlbCddLCBNT0RFTCwgW1RZUEUsIE1PQklMRV1dLCBbXG4gICAgICAgICAgICAvXFxiKHBoLTEpIC9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBFc3NlbnRpYWwgUEgtMVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnRXNzZW50aWFsJ10sIFtUWVBFLCBNT0JJTEVdXSwgW1xuICAgICAgICAgICAgL1xcYih2KDEwMG1kfDcwMG5hfDcwMTF8OTE3ZykuKlxcYikgYi9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEVudml6ZW4gVGFibGV0c1xuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnRW52aXplbiddLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC9cXGIodHJpb1stXFx3XFwuIF0rKSBiL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTWFjaFNwZWVkIFRhYmxldHNcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ01hY2hTcGVlZCddLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC9cXGJ0dV8oMTQ5MSkgYi9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFJvdG9yIFRhYmxldHNcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ1JvdG9yJ10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgLyhzaGllbGRbXFx3IF0rKSBiL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTnZpZGlhIFNoaWVsZCBUYWJsZXRzXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdOdmlkaWEnXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvKHNwcmludCkgKFxcdyspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTcHJpbnQgUGhvbmVzXG4gICAgICAgICAgICBdLCBbVkVORE9SLCBNT0RFTCwgW1RZUEUsIE1PQklMRV1dLCBbXG4gICAgICAgICAgICAvKGtpblxcLltvbmV0d117M30pL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBNaWNyb3NvZnQgS2luXG4gICAgICAgICAgICBdLCBbW01PREVMLCAvXFwuL2csICcgJ10sIFtWRU5ET1IsIE1JQ1JPU09GVF0sIFtUWVBFLCBNT0JJTEVdXSwgW1xuICAgICAgICAgICAgL2Ryb2lkLis7IChjYzY2NjY/fGV0NVsxNl18bWNbMjM5XVsyM114P3x2YzhbMDNdeD8pXFwpL2kgICAgICAgICAgICAgLy8gWmVicmFcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgWkVCUkFdLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC9kcm9pZC4rOyAoZWMzMHxwczIwfHRjWzItOF1cXGRba3hdKVxcKS9pXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIFpFQlJBXSwgW1RZUEUsIE1PQklMRV1dLCBbXG5cbiAgICAgICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAgICAgICAgIC8vIFNNQVJUVFZTXG4gICAgICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgICAgICAgIC9zbWFydC10di4rKHNhbXN1bmcpL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU2Ftc3VuZ1xuICAgICAgICAgICAgXSwgW1ZFTkRPUiwgW1RZUEUsIFNNQVJUVFZdXSwgW1xuICAgICAgICAgICAgL2hiYnR2LittYXBsZTsoXFxkKykvaVxuICAgICAgICAgICAgXSwgW1tNT0RFTCwgL14vLCAnU21hcnRUViddLCBbVkVORE9SLCBTQU1TVU5HXSwgW1RZUEUsIFNNQVJUVFZdXSwgW1xuICAgICAgICAgICAgLyhudXg7IG5ldGNhc3QuK3NtYXJ0dHZ8bGcgKG5ldGNhc3RcXC50di0yMDFcXGR8YW5kcm9pZCB0dikpL2kgICAgICAgIC8vIExHIFNtYXJ0VFZcbiAgICAgICAgICAgIF0sIFtbVkVORE9SLCBMR10sIFtUWVBFLCBTTUFSVFRWXV0sIFtcbiAgICAgICAgICAgIC8oYXBwbGUpID90di9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQXBwbGUgVFZcbiAgICAgICAgICAgIF0sIFtWRU5ET1IsIFtNT0RFTCwgQVBQTEUrJyBUViddLCBbVFlQRSwgU01BUlRUVl1dLCBbXG4gICAgICAgICAgICAvY3JrZXkvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEdvb2dsZSBDaHJvbWVjYXN0XG4gICAgICAgICAgICBdLCBbW01PREVMLCBDSFJPTUUrJ2Nhc3QnXSwgW1ZFTkRPUiwgR09PR0xFXSwgW1RZUEUsIFNNQVJUVFZdXSwgW1xuICAgICAgICAgICAgL2Ryb2lkLithZnQoXFx3KykoIGJ1aXxcXCkpL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZpcmUgVFZcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgQU1BWk9OXSwgW1RZUEUsIFNNQVJUVFZdXSwgW1xuICAgICAgICAgICAgL1xcKGR0dltcXCk7XS4rKGFxdW9zKS9pLFxuICAgICAgICAgICAgLyhhcXVvcy10dltcXHcgXSspXFwpL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNoYXJwXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIFNIQVJQXSwgW1RZUEUsIFNNQVJUVFZdXSxbXG4gICAgICAgICAgICAvKGJyYXZpYVtcXHcgXSspKCBidWl8XFwpKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNvbnlcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgU09OWV0sIFtUWVBFLCBTTUFSVFRWXV0sIFtcbiAgICAgICAgICAgIC8obWl0di1cXHd7NX0pIGJ1aS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFhpYW9taVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBYSUFPTUldLCBbVFlQRSwgU01BUlRUVl1dLCBbXG4gICAgICAgICAgICAvSGJidHYuKih0ZWNobmlzYXQpICguKik7L2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRlY2huaVNBVFxuICAgICAgICAgICAgXSwgW1ZFTkRPUiwgTU9ERUwsIFtUWVBFLCBTTUFSVFRWXV0sIFtcbiAgICAgICAgICAgIC9cXGIocm9rdSlbXFxkeF0qW1xcKVxcL10oKD86ZHZwLSk/W1xcZFxcLl0qKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUm9rdVxuICAgICAgICAgICAgL2hiYnR2XFwvXFxkK1xcLlxcZCtcXC5cXGQrICtcXChbXFx3XFwrIF0qOyAqKFtcXHdcXGRdW147XSopOyhbXjtdKikvaSAgICAgICAgIC8vIEhiYlRWIGRldmljZXNcbiAgICAgICAgICAgIF0sIFtbVkVORE9SLCB0cmltXSwgW01PREVMLCB0cmltXSwgW1RZUEUsIFNNQVJUVFZdXSwgW1xuICAgICAgICAgICAgL1xcYihhbmRyb2lkIHR2fHNtYXJ0Wy0gXT90dnxvcGVyYSB0dnx0djsgcnY6KVxcYi9pICAgICAgICAgICAgICAgICAgIC8vIFNtYXJ0VFYgZnJvbSBVbmlkZW50aWZpZWQgVmVuZG9yc1xuICAgICAgICAgICAgXSwgW1tUWVBFLCBTTUFSVFRWXV0sIFtcblxuICAgICAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgICAgICAgICAgLy8gQ09OU09MRVNcbiAgICAgICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgICAgICAgLyhvdXlhKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBPdXlhXG4gICAgICAgICAgICAvKG5pbnRlbmRvKSAoW3dpZHMzdXRjaF0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE5pbnRlbmRvXG4gICAgICAgICAgICBdLCBbVkVORE9SLCBNT0RFTCwgW1RZUEUsIENPTlNPTEVdXSwgW1xuICAgICAgICAgICAgL2Ryb2lkLis7IChzaGllbGQpIGJ1aS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBOdmlkaWFcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ052aWRpYSddLCBbVFlQRSwgQ09OU09MRV1dLCBbXG4gICAgICAgICAgICAvKHBsYXlzdGF0aW9uIFszNDVwb3J0YWJsZXZpXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFBsYXlzdGF0aW9uXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIFNPTlldLCBbVFlQRSwgQ09OU09MRV1dLCBbXG4gICAgICAgICAgICAvXFxiKHhib3goPzogb25lKT8oPyE7IHhib3gpKVtcXCk7IF0vaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTWljcm9zb2Z0IFhib3hcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgTUlDUk9TT0ZUXSwgW1RZUEUsIENPTlNPTEVdXSwgW1xuXG4gICAgICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgICAgICAgICAvLyBXRUFSQUJMRVNcbiAgICAgICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgICAgICAgLygocGViYmxlKSlhcHAvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBQZWJibGVcbiAgICAgICAgICAgIF0sIFtWRU5ET1IsIE1PREVMLCBbVFlQRSwgV0VBUkFCTEVdXSwgW1xuICAgICAgICAgICAgLyh3YXRjaCkoPzogP29zWyxcXC9dfFxcZCxcXGRcXC8pW1xcZFxcLl0rL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBcHBsZSBXYXRjaFxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBBUFBMRV0sIFtUWVBFLCBXRUFSQUJMRV1dLCBbXG4gICAgICAgICAgICAvZHJvaWQuKzsgKGdsYXNzKSBcXGQvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBHb29nbGUgR2xhc3NcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgR09PR0xFXSwgW1RZUEUsIFdFQVJBQkxFXV0sIFtcbiAgICAgICAgICAgIC9kcm9pZC4rOyAod3Q2Mz8wezIsM30pXFwpL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgWkVCUkFdLCBbVFlQRSwgV0VBUkFCTEVdXSwgW1xuICAgICAgICAgICAgLyhxdWVzdCggXFxkfCBwcm8pPykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gT2N1bHVzIFF1ZXN0XG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIEZBQ0VCT09LXSwgW1RZUEUsIFdFQVJBQkxFXV0sIFtcblxuICAgICAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgICAgICAgICAgLy8gRU1CRURERURcbiAgICAgICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgICAgICAgLyh0ZXNsYSkoPzogcXRjYXJicm93c2VyfFxcL1stXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUZXNsYVxuICAgICAgICAgICAgXSwgW1ZFTkRPUiwgW1RZUEUsIEVNQkVEREVEXV0sIFtcbiAgICAgICAgICAgIC8oYWVvYmMpXFxiL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEVjaG8gRG90XG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIEFNQVpPTl0sIFtUWVBFLCBFTUJFRERFRF1dLCBbXG5cbiAgICAgICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgICAgICAgICAvLyBNSVhFRCAoR0VORVJJQylcbiAgICAgICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgICAgICAgL2Ryb2lkIC4rPzsgKFteO10rPykoPzogYnVpfDsgd3ZcXCl8XFwpIGFwcGxldykuKz8gbW9iaWxlIHNhZmFyaS9pICAgIC8vIEFuZHJvaWQgUGhvbmVzIGZyb20gVW5pZGVudGlmaWVkIFZlbmRvcnNcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1RZUEUsIE1PQklMRV1dLCBbXG4gICAgICAgICAgICAvZHJvaWQgLis/OyAoW147XSs/KSg/OiBidWl8XFwpIGFwcGxldykuKz8oPyEgbW9iaWxlKSBzYWZhcmkvaSAgICAgICAvLyBBbmRyb2lkIFRhYmxldHMgZnJvbSBVbmlkZW50aWZpZWQgVmVuZG9yc1xuICAgICAgICAgICAgXSwgW01PREVMLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC9cXGIoKHRhYmxldHx0YWIpWztcXC9dfGZvY3VzXFwvXFxkKD8hLittb2JpbGUpKS9pICAgICAgICAgICAgICAgICAgICAgIC8vIFVuaWRlbnRpZmlhYmxlIFRhYmxldFxuICAgICAgICAgICAgXSwgW1tUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgLyhwaG9uZXxtb2JpbGUoPzpbO1xcL118IFsgXFx3XFwvXFwuXSpzYWZhcmkpfHBkYSg/PS4rd2luZG93cyBjZSkpL2kgICAgLy8gVW5pZGVudGlmaWFibGUgTW9iaWxlXG4gICAgICAgICAgICBdLCBbW1RZUEUsIE1PQklMRV1dLCBbXG4gICAgICAgICAgICAvKGFuZHJvaWRbLVxcd1xcLiBdezAsOX0pOy4rYnVpbC9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gR2VuZXJpYyBBbmRyb2lkIERldmljZVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnR2VuZXJpYyddXVxuICAgICAgICBdLFxuXG4gICAgICAgIGVuZ2luZSA6IFtbXG5cbiAgICAgICAgICAgIC93aW5kb3dzLisgZWRnZVxcLyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBFZGdlSFRNTFxuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCBFREdFKydIVE1MJ11dLCBbXG5cbiAgICAgICAgICAgIC93ZWJraXRcXC81MzdcXC4zNi4rY2hyb21lXFwvKD8hMjcpKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAvLyBCbGlua1xuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCAnQmxpbmsnXV0sIFtcblxuICAgICAgICAgICAgLyhwcmVzdG8pXFwvKFtcXHdcXC5dKykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBQcmVzdG9cbiAgICAgICAgICAgIC8od2Via2l0fHRyaWRlbnR8bmV0ZnJvbnR8bmV0c3VyZnxhbWF5YXxseW54fHczbXxnb2FubmEpXFwvKFtcXHdcXC5dKykvaSwgLy8gV2ViS2l0L1RyaWRlbnQvTmV0RnJvbnQvTmV0U3VyZi9BbWF5YS9MeW54L3czbS9Hb2FubmFcbiAgICAgICAgICAgIC9la2lvaChmbG93KVxcLyhbXFx3XFwuXSspL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRmxvd1xuICAgICAgICAgICAgLyhraHRtbHx0YXNtYW58bGlua3MpW1xcLyBdXFwoPyhbXFx3XFwuXSspL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gS0hUTUwvVGFzbWFuL0xpbmtzXG4gICAgICAgICAgICAvKGljYWIpW1xcLyBdKFsyM11cXC5bXFxkXFwuXSspL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpQ2FiXG4gICAgICAgICAgICAvXFxiKGxpYndlYikvaVxuICAgICAgICAgICAgXSwgW05BTUUsIFZFUlNJT05dLCBbXG5cbiAgICAgICAgICAgIC9ydlxcOihbXFx3XFwuXXsxLDl9KVxcYi4rKGdlY2tvKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEdlY2tvXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgTkFNRV1cbiAgICAgICAgXSxcblxuICAgICAgICBvcyA6IFtbXG5cbiAgICAgICAgICAgIC8vIFdpbmRvd3NcbiAgICAgICAgICAgIC9taWNyb3NvZnQgKHdpbmRvd3MpICh2aXN0YXx4cCkvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gV2luZG93cyAoaVR1bmVzKVxuICAgICAgICAgICAgXSwgW05BTUUsIFZFUlNJT05dLCBbXG4gICAgICAgICAgICAvKHdpbmRvd3MgKD86cGhvbmUoPzogb3MpP3xtb2JpbGUpKVtcXC8gXT8oW1xcZFxcLlxcdyBdKikvaSAgICAgICAgICAgICAvLyBXaW5kb3dzIFBob25lXG4gICAgICAgICAgICBdLCBbTkFNRSwgW1ZFUlNJT04sIHN0ck1hcHBlciwgd2luZG93c1ZlcnNpb25NYXBdXSwgW1xuICAgICAgICAgICAgL3dpbmRvd3MgbnQgNlxcLjI7IChhcm0pL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdpbmRvd3MgUlRcbiAgICAgICAgICAgIC93aW5kb3dzW1xcLyBdPyhbbnRjZVxcZFxcLiBdK1xcdykoPyEuK3hib3gpL2ksXG4gICAgICAgICAgICAvKD86d2luKD89M3w5fG4pfHdpbiA5eCApKFtudFxcZFxcLl0rKS9pXG4gICAgICAgICAgICBdLCBbW1ZFUlNJT04sIHN0ck1hcHBlciwgd2luZG93c1ZlcnNpb25NYXBdLCBbTkFNRSwgJ1dpbmRvd3MnXV0sIFtcblxuICAgICAgICAgICAgLy8gaU9TL21hY09TXG4gICAgICAgICAgICAvaXBbaG9uZWFkXXsyLDR9XFxiKD86LipvcyAoW1xcd10rKSBsaWtlIG1hY3w7IG9wZXJhKS9pLCAgICAgICAgICAgICAgLy8gaU9TXG4gICAgICAgICAgICAvKD86aW9zO2Zic3ZcXC98aXBob25lLitpb3NbXFwvIF0pKFtcXGRcXC5dKykvaSxcbiAgICAgICAgICAgIC9jZm5ldHdvcmtcXC8uK2Rhcndpbi9pXG4gICAgICAgICAgICBdLCBbW1ZFUlNJT04sIC9fL2csICcuJ10sIFtOQU1FLCAnaU9TJ11dLCBbXG4gICAgICAgICAgICAvKG1hYyBvcyB4KSA/KFtcXHdcXC4gXSopL2ksXG4gICAgICAgICAgICAvKG1hY2ludG9zaHxtYWNfcG93ZXJwY1xcYikoPyEuK2hhaWt1KS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBNYWMgT1NcbiAgICAgICAgICAgIF0sIFtbTkFNRSwgTUFDX09TXSwgW1ZFUlNJT04sIC9fL2csICcuJ11dLCBbXG5cbiAgICAgICAgICAgIC8vIE1vYmlsZSBPU2VzXG4gICAgICAgICAgICAvZHJvaWQgKFtcXHdcXC5dKylcXGIuKyhhbmRyb2lkWy0gXXg4NnxoYXJtb255b3MpL2kgICAgICAgICAgICAgICAgICAgIC8vIEFuZHJvaWQteDg2L0hhcm1vbnlPU1xuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIE5BTUVdLCBbICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBbmRyb2lkL1dlYk9TL1FOWC9CYWRhL1JJTS9NYWVtby9NZWVHby9TYWlsZmlzaCBPU1xuICAgICAgICAgICAgLyhhbmRyb2lkfHdlYm9zfHFueHxiYWRhfHJpbSB0YWJsZXQgb3N8bWFlbW98bWVlZ298c2FpbGZpc2gpWy1cXC8gXT8oW1xcd1xcLl0qKS9pLFxuICAgICAgICAgICAgLyhibGFja2JlcnJ5KVxcdypcXC8oW1xcd1xcLl0qKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQmxhY2tiZXJyeVxuICAgICAgICAgICAgLyh0aXplbnxrYWlvcylbXFwvIF0oW1xcd1xcLl0rKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUaXplbi9LYWlPU1xuICAgICAgICAgICAgL1xcKChzZXJpZXM0MCk7L2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU2VyaWVzIDQwXG4gICAgICAgICAgICBdLCBbTkFNRSwgVkVSU0lPTl0sIFtcbiAgICAgICAgICAgIC9cXChiYigxMCk7L2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEJsYWNrQmVycnkgMTBcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgQkxBQ0tCRVJSWV1dLCBbXG4gICAgICAgICAgICAvKD86c3ltYmlhbiA/b3N8c3ltYm9zfHM2MCg/PTspfHNlcmllczYwKVstXFwvIF0/KFtcXHdcXC5dKikvaSAgICAgICAgIC8vIFN5bWJpYW5cbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgJ1N5bWJpYW4nXV0sIFtcbiAgICAgICAgICAgIC9tb3ppbGxhXFwvW1xcZFxcLl0rIFxcKCg/Om1vYmlsZXx0YWJsZXR8dHZ8bW9iaWxlOyBbXFx3IF0rKTsgcnY6LisgZ2Vja29cXC8oW1xcd1xcLl0rKS9pIC8vIEZpcmVmb3ggT1NcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgRklSRUZPWCsnIE9TJ11dLCBbXG4gICAgICAgICAgICAvd2ViMHM7LitydCh0dikvaSxcbiAgICAgICAgICAgIC9cXGIoPzpocCk/d29zKD86YnJvd3Nlcik/XFwvKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdlYk9TXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsICd3ZWJPUyddXSwgW1xuICAgICAgICAgICAgL3dhdGNoKD86ID9vc1ssXFwvXXxcXGQsXFxkXFwvKShbXFxkXFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB3YXRjaE9TXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsICd3YXRjaE9TJ11dLCBbXG5cbiAgICAgICAgICAgIC8vIEdvb2dsZSBDaHJvbWVjYXN0XG4gICAgICAgICAgICAvY3JrZXlcXC8oW1xcZFxcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEdvb2dsZSBDaHJvbWVjYXN0XG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsIENIUk9NRSsnY2FzdCddXSwgW1xuICAgICAgICAgICAgLyhjcm9zKSBbXFx3XSsoPzpcXCl8IChbXFx3XFwuXSspXFxiKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIENocm9taXVtIE9TXG4gICAgICAgICAgICBdLCBbW05BTUUsIENIUk9NSVVNX09TXSwgVkVSU0lPTl0sW1xuXG4gICAgICAgICAgICAvLyBTbWFydCBUVnNcbiAgICAgICAgICAgIC9wYW5hc29uaWM7KHZpZXJhKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUGFuYXNvbmljIFZpZXJhXG4gICAgICAgICAgICAvKG5ldHJhbmdlKW1taC9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE5ldHJhbmdlXG4gICAgICAgICAgICAvKG5ldHR2KVxcLyhcXGQrXFwuW1xcd1xcLl0rKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTmV0VFZcblxuICAgICAgICAgICAgLy8gQ29uc29sZVxuICAgICAgICAgICAgLyhuaW50ZW5kb3xwbGF5c3RhdGlvbikgKFt3aWRzMzQ1cG9ydGFibGV2dWNoXSspL2ksICAgICAgICAgICAgICAgICAvLyBOaW50ZW5kby9QbGF5c3RhdGlvblxuICAgICAgICAgICAgLyh4Ym94KTsgK3hib3ggKFteXFwpO10rKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTWljcm9zb2Z0IFhib3ggKDM2MCwgT25lLCBYLCBTLCBTZXJpZXMgWCwgU2VyaWVzIFMpXG5cbiAgICAgICAgICAgIC8vIE90aGVyXG4gICAgICAgICAgICAvXFxiKGpvbGl8cGFsbSlcXGIgPyg/Om9zKT9cXC8/KFtcXHdcXC5dKikvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSm9saS9QYWxtXG4gICAgICAgICAgICAvKG1pbnQpW1xcL1xcKFxcKSBdPyhcXHcqKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBNaW50XG4gICAgICAgICAgICAvKG1hZ2VpYXx2ZWN0b3JsaW51eClbOyBdL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1hZ2VpYS9WZWN0b3JMaW51eFxuICAgICAgICAgICAgLyhba3hsbl0/dWJ1bnR1fGRlYmlhbnxzdXNlfG9wZW5zdXNlfGdlbnRvb3xhcmNoKD89IGxpbnV4KXxzbGFja3dhcmV8ZmVkb3JhfG1hbmRyaXZhfGNlbnRvc3xwY2xpbnV4b3N8cmVkID9oYXR8emVud2Fsa3xsaW5wdXN8cmFzcGJpYW58cGxhbiA5fG1pbml4fHJpc2Mgb3N8Y29udGlraXxkZWVwaW58bWFuamFyb3xlbGVtZW50YXJ5IG9zfHNhYmF5b258bGluc3BpcmUpKD86IGdudVxcL2xpbnV4KT8oPzogZW50ZXJwcmlzZSk/KD86Wy0gXWxpbnV4KT8oPzotZ251KT9bLVxcLyBdPyg/IWNocm9tfHBhY2thZ2UpKFstXFx3XFwuXSopL2ksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFVidW50dS9EZWJpYW4vU1VTRS9HZW50b28vQXJjaC9TbGFja3dhcmUvRmVkb3JhL01hbmRyaXZhL0NlbnRPUy9QQ0xpbnV4T1MvUmVkSGF0L1plbndhbGsvTGlucHVzL1Jhc3BiaWFuL1BsYW45L01pbml4L1JJU0NPUy9Db250aWtpL0RlZXBpbi9NYW5qYXJvL2VsZW1lbnRhcnkvU2FiYXlvbi9MaW5zcGlyZVxuICAgICAgICAgICAgLyhodXJkfGxpbnV4KSA/KFtcXHdcXC5dKikvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEh1cmQvTGludXhcbiAgICAgICAgICAgIC8oZ251KSA/KFtcXHdcXC5dKikvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBHTlVcbiAgICAgICAgICAgIC9cXGIoWy1mcmVudG9wY2doc117MCw1fWJzZHxkcmFnb25mbHkpW1xcLyBdPyg/IWFtZHxbaXgzNDZdezEsMn04NikoW1xcd1xcLl0qKS9pLCAvLyBGcmVlQlNEL05ldEJTRC9PcGVuQlNEL1BDLUJTRC9HaG9zdEJTRC9EcmFnb25GbHlcbiAgICAgICAgICAgIC8oaGFpa3UpIChcXHcrKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEhhaWt1XG4gICAgICAgICAgICBdLCBbTkFNRSwgVkVSU0lPTl0sIFtcbiAgICAgICAgICAgIC8oc3Vub3MpID8oW1xcd1xcLlxcZF0qKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU29sYXJpc1xuICAgICAgICAgICAgXSwgW1tOQU1FLCAnU29sYXJpcyddLCBWRVJTSU9OXSwgW1xuICAgICAgICAgICAgLygoPzpvcGVuKT9zb2xhcmlzKVstXFwvIF0/KFtcXHdcXC5dKikvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTb2xhcmlzXG4gICAgICAgICAgICAvKGFpeCkgKChcXGQpKD89XFwufFxcKXwgKVtcXHdcXC5dKSovaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQUlYXG4gICAgICAgICAgICAvXFxiKGJlb3N8b3NcXC8yfGFtaWdhb3N8bW9ycGhvc3xvcGVudm1zfGZ1Y2hzaWF8aHAtdXh8c2VyZW5pdHlvcykvaSwgLy8gQmVPUy9PUzIvQW1pZ2FPUy9Nb3JwaE9TL09wZW5WTVMvRnVjaHNpYS9IUC1VWC9TZXJlbml0eU9TXG4gICAgICAgICAgICAvKHVuaXgpID8oW1xcd1xcLl0qKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVU5JWFxuICAgICAgICAgICAgXSwgW05BTUUsIFZFUlNJT05dXG4gICAgICAgIF1cbiAgICB9O1xuXG4gICAgLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAvLyBDb25zdHJ1Y3RvclxuICAgIC8vLy8vLy8vLy8vLy8vLy9cblxuICAgIHZhciBVQVBhcnNlciA9IGZ1bmN0aW9uICh1YSwgZXh0ZW5zaW9ucykge1xuXG4gICAgICAgIGlmICh0eXBlb2YgdWEgPT09IE9CSl9UWVBFKSB7XG4gICAgICAgICAgICBleHRlbnNpb25zID0gdWE7XG4gICAgICAgICAgICB1YSA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBVQVBhcnNlcikpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgVUFQYXJzZXIodWEsIGV4dGVuc2lvbnMpLmdldFJlc3VsdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIF9uYXZpZ2F0b3IgPSAodHlwZW9mIHdpbmRvdyAhPT0gVU5ERUZfVFlQRSAmJiB3aW5kb3cubmF2aWdhdG9yKSA/IHdpbmRvdy5uYXZpZ2F0b3IgOiB1bmRlZmluZWQ7XG4gICAgICAgIHZhciBfdWEgPSB1YSB8fCAoKF9uYXZpZ2F0b3IgJiYgX25hdmlnYXRvci51c2VyQWdlbnQpID8gX25hdmlnYXRvci51c2VyQWdlbnQgOiBFTVBUWSk7XG4gICAgICAgIHZhciBfdWFjaCA9IChfbmF2aWdhdG9yICYmIF9uYXZpZ2F0b3IudXNlckFnZW50RGF0YSkgPyBfbmF2aWdhdG9yLnVzZXJBZ2VudERhdGEgOiB1bmRlZmluZWQ7XG4gICAgICAgIHZhciBfcmd4bWFwID0gZXh0ZW5zaW9ucyA/IGV4dGVuZChyZWdleGVzLCBleHRlbnNpb25zKSA6IHJlZ2V4ZXM7XG4gICAgICAgIHZhciBfaXNTZWxmTmF2ID0gX25hdmlnYXRvciAmJiBfbmF2aWdhdG9yLnVzZXJBZ2VudCA9PSBfdWE7XG5cbiAgICAgICAgdGhpcy5nZXRCcm93c2VyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIF9icm93c2VyID0ge307XG4gICAgICAgICAgICBfYnJvd3NlcltOQU1FXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIF9icm93c2VyW1ZFUlNJT05dID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgcmd4TWFwcGVyLmNhbGwoX2Jyb3dzZXIsIF91YSwgX3JneG1hcC5icm93c2VyKTtcbiAgICAgICAgICAgIF9icm93c2VyW01BSk9SXSA9IG1ham9yaXplKF9icm93c2VyW1ZFUlNJT05dKTtcbiAgICAgICAgICAgIC8vIEJyYXZlLXNwZWNpZmljIGRldGVjdGlvblxuICAgICAgICAgICAgaWYgKF9pc1NlbGZOYXYgJiYgX25hdmlnYXRvciAmJiBfbmF2aWdhdG9yLmJyYXZlICYmIHR5cGVvZiBfbmF2aWdhdG9yLmJyYXZlLmlzQnJhdmUgPT0gRlVOQ19UWVBFKSB7XG4gICAgICAgICAgICAgICAgX2Jyb3dzZXJbTkFNRV0gPSAnQnJhdmUnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIF9icm93c2VyO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmdldENQVSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBfY3B1ID0ge307XG4gICAgICAgICAgICBfY3B1W0FSQ0hJVEVDVFVSRV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICByZ3hNYXBwZXIuY2FsbChfY3B1LCBfdWEsIF9yZ3htYXAuY3B1KTtcbiAgICAgICAgICAgIHJldHVybiBfY3B1O1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmdldERldmljZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBfZGV2aWNlID0ge307XG4gICAgICAgICAgICBfZGV2aWNlW1ZFTkRPUl0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBfZGV2aWNlW01PREVMXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIF9kZXZpY2VbVFlQRV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICByZ3hNYXBwZXIuY2FsbChfZGV2aWNlLCBfdWEsIF9yZ3htYXAuZGV2aWNlKTtcbiAgICAgICAgICAgIGlmIChfaXNTZWxmTmF2ICYmICFfZGV2aWNlW1RZUEVdICYmIF91YWNoICYmIF91YWNoLm1vYmlsZSkge1xuICAgICAgICAgICAgICAgIF9kZXZpY2VbVFlQRV0gPSBNT0JJTEU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBpUGFkT1Mtc3BlY2lmaWMgZGV0ZWN0aW9uOiBpZGVudGlmaWVkIGFzIE1hYywgYnV0IGhhcyBzb21lIGlPUy1vbmx5IHByb3BlcnRpZXNcbiAgICAgICAgICAgIGlmIChfaXNTZWxmTmF2ICYmIF9kZXZpY2VbTU9ERUxdID09ICdNYWNpbnRvc2gnICYmIF9uYXZpZ2F0b3IgJiYgdHlwZW9mIF9uYXZpZ2F0b3Iuc3RhbmRhbG9uZSAhPT0gVU5ERUZfVFlQRSAmJiBfbmF2aWdhdG9yLm1heFRvdWNoUG9pbnRzICYmIF9uYXZpZ2F0b3IubWF4VG91Y2hQb2ludHMgPiAyKSB7XG4gICAgICAgICAgICAgICAgX2RldmljZVtNT0RFTF0gPSAnaVBhZCc7XG4gICAgICAgICAgICAgICAgX2RldmljZVtUWVBFXSA9IFRBQkxFVDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBfZGV2aWNlO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmdldEVuZ2luZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBfZW5naW5lID0ge307XG4gICAgICAgICAgICBfZW5naW5lW05BTUVdID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgX2VuZ2luZVtWRVJTSU9OXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIHJneE1hcHBlci5jYWxsKF9lbmdpbmUsIF91YSwgX3JneG1hcC5lbmdpbmUpO1xuICAgICAgICAgICAgcmV0dXJuIF9lbmdpbmU7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZ2V0T1MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgX29zID0ge307XG4gICAgICAgICAgICBfb3NbTkFNRV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBfb3NbVkVSU0lPTl0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICByZ3hNYXBwZXIuY2FsbChfb3MsIF91YSwgX3JneG1hcC5vcyk7XG4gICAgICAgICAgICBpZiAoX2lzU2VsZk5hdiAmJiAhX29zW05BTUVdICYmIF91YWNoICYmIF91YWNoLnBsYXRmb3JtICYmIF91YWNoLnBsYXRmb3JtICE9ICdVbmtub3duJykge1xuICAgICAgICAgICAgICAgIF9vc1tOQU1FXSA9IF91YWNoLnBsYXRmb3JtICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9jaHJvbWUgb3MvaSwgQ0hST01JVU1fT1MpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvbWFjb3MvaSwgTUFDX09TKTsgICAgICAgICAgIC8vIGJhY2t3YXJkIGNvbXBhdGliaWxpdHlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBfb3M7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZ2V0UmVzdWx0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB1YSAgICAgIDogdGhpcy5nZXRVQSgpLFxuICAgICAgICAgICAgICAgIGJyb3dzZXIgOiB0aGlzLmdldEJyb3dzZXIoKSxcbiAgICAgICAgICAgICAgICBlbmdpbmUgIDogdGhpcy5nZXRFbmdpbmUoKSxcbiAgICAgICAgICAgICAgICBvcyAgICAgIDogdGhpcy5nZXRPUygpLFxuICAgICAgICAgICAgICAgIGRldmljZSAgOiB0aGlzLmdldERldmljZSgpLFxuICAgICAgICAgICAgICAgIGNwdSAgICAgOiB0aGlzLmdldENQVSgpXG4gICAgICAgICAgICB9O1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmdldFVBID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIF91YTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5zZXRVQSA9IGZ1bmN0aW9uICh1YSkge1xuICAgICAgICAgICAgX3VhID0gKHR5cGVvZiB1YSA9PT0gU1RSX1RZUEUgJiYgdWEubGVuZ3RoID4gVUFfTUFYX0xFTkdUSCkgPyB0cmltKHVhLCBVQV9NQVhfTEVOR1RIKSA6IHVhO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuc2V0VUEoX3VhKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIFVBUGFyc2VyLlZFUlNJT04gPSBMSUJWRVJTSU9OO1xuICAgIFVBUGFyc2VyLkJST1dTRVIgPSAgZW51bWVyaXplKFtOQU1FLCBWRVJTSU9OLCBNQUpPUl0pO1xuICAgIFVBUGFyc2VyLkNQVSA9IGVudW1lcml6ZShbQVJDSElURUNUVVJFXSk7XG4gICAgVUFQYXJzZXIuREVWSUNFID0gZW51bWVyaXplKFtNT0RFTCwgVkVORE9SLCBUWVBFLCBDT05TT0xFLCBNT0JJTEUsIFNNQVJUVFYsIFRBQkxFVCwgV0VBUkFCTEUsIEVNQkVEREVEXSk7XG4gICAgVUFQYXJzZXIuRU5HSU5FID0gVUFQYXJzZXIuT1MgPSBlbnVtZXJpemUoW05BTUUsIFZFUlNJT05dKTtcblxuICAgIC8vLy8vLy8vLy8vXG4gICAgLy8gRXhwb3J0XG4gICAgLy8vLy8vLy8vL1xuXG4gICAgLy8gY2hlY2sganMgZW52aXJvbm1lbnRcbiAgICBpZiAodHlwZW9mKGV4cG9ydHMpICE9PSBVTkRFRl9UWVBFKSB7XG4gICAgICAgIC8vIG5vZGVqcyBlbnZcbiAgICAgICAgaWYgKHR5cGVvZiBtb2R1bGUgIT09IFVOREVGX1RZUEUgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAgICAgICAgIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IFVBUGFyc2VyO1xuICAgICAgICB9XG4gICAgICAgIGV4cG9ydHMuVUFQYXJzZXIgPSBVQVBhcnNlcjtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyByZXF1aXJlanMgZW52IChvcHRpb25hbClcbiAgICAgICAgaWYgKHR5cGVvZihkZWZpbmUpID09PSBGVU5DX1RZUEUgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICAgICAgZGVmaW5lKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gVUFQYXJzZXI7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygd2luZG93ICE9PSBVTkRFRl9UWVBFKSB7XG4gICAgICAgICAgICAvLyBicm93c2VyIGVudlxuICAgICAgICAgICAgd2luZG93LlVBUGFyc2VyID0gVUFQYXJzZXI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBqUXVlcnkvWmVwdG8gc3BlY2lmaWMgKG9wdGlvbmFsKVxuICAgIC8vIE5vdGU6XG4gICAgLy8gICBJbiBBTUQgZW52IHRoZSBnbG9iYWwgc2NvcGUgc2hvdWxkIGJlIGtlcHQgY2xlYW4sIGJ1dCBqUXVlcnkgaXMgYW4gZXhjZXB0aW9uLlxuICAgIC8vICAgalF1ZXJ5IGFsd2F5cyBleHBvcnRzIHRvIGdsb2JhbCBzY29wZSwgdW5sZXNzIGpRdWVyeS5ub0NvbmZsaWN0KHRydWUpIGlzIHVzZWQsXG4gICAgLy8gICBhbmQgd2Ugc2hvdWxkIGNhdGNoIHRoYXQuXG4gICAgdmFyICQgPSB0eXBlb2Ygd2luZG93ICE9PSBVTkRFRl9UWVBFICYmICh3aW5kb3cualF1ZXJ5IHx8IHdpbmRvdy5aZXB0byk7XG4gICAgaWYgKCQgJiYgISQudWEpIHtcbiAgICAgICAgdmFyIHBhcnNlciA9IG5ldyBVQVBhcnNlcigpO1xuICAgICAgICAkLnVhID0gcGFyc2VyLmdldFJlc3VsdCgpO1xuICAgICAgICAkLnVhLmdldCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXJzZXIuZ2V0VUEoKTtcbiAgICAgICAgfTtcbiAgICAgICAgJC51YS5zZXQgPSBmdW5jdGlvbiAodWEpIHtcbiAgICAgICAgICAgIHBhcnNlci5zZXRVQSh1YSk7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gcGFyc2VyLmdldFJlc3VsdCgpO1xuICAgICAgICAgICAgZm9yICh2YXIgcHJvcCBpbiByZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAkLnVhW3Byb3BdID0gcmVzdWx0W3Byb3BdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cblxufSkodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcgPyB3aW5kb3cgOiB0aGlzKTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmFtZE8gPSB7fTsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL2luZGV4LnRzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9