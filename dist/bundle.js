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
    tutorial: false,
    tutorialSkippable: true,
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

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.findBrowserInfo = void 0;
const ua_parser_js_1 = __importDefault(__webpack_require__(/*! ua-parser-js */ "./node_modules/ua-parser-js/src/ua-parser.js"));
const IP_INFO_URL = "https://ipinfo.io/ip";
const IP_LOOKUP_TIMEOUT = 1500;
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
    browser.version = browser.version || "";
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
function findClientIp() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const controller = new AbortController();
            const timeout = window.setTimeout(() => controller.abort(), IP_LOOKUP_TIMEOUT);
            try {
                const response = yield fetch(IP_INFO_URL, {
                    referrerPolicy: "no-referrer",
                    signal: controller.signal
                });
                if (!response.ok) {
                    return undefined;
                }
                const ip = yield response.text();
                return ip.trim() || undefined;
            }
            finally {
                window.clearTimeout(timeout);
            }
        }
        catch (_a) {
            return undefined;
        }
    });
}
function findScreenSize() {
    return {
        width: screen.width || 0,
        height: screen.height || 0
    };
}
function findBrowserInfo() {
    return __awaiter(this, void 0, void 0, function* () {
        const ip = yield findClientIp();
        try {
            const ua = new ua_parser_js_1.default();
            return {
                ip,
                useragent: window.navigator.userAgent,
                screen_size: findScreenSize(),
                browser: findBrowser(),
                os: findOperatingSystem(ua),
                device: findDevice(ua),
                cpu: findCpu(ua)
            };
        }
        catch (_a) {
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
    });
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

/***/ "./src/EventSender.ts":
/*!****************************!*\
  !*** ./src/EventSender.ts ***!
  \****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
const Tools_1 = __webpack_require__(/*! ./Tools */ "./src/Tools.ts");
const MAX_ATTEMPTS = 3;
const RETRY_DELAYS_MS = [500, 1500];
const RETRY_JITTER_MS = 100;
const REQUEST_TIMEOUT_MS = 5000;
class EventSender {
    constructor(remote, logger) {
        this.remote = remote;
        this.logger = logger;
        this.pending = [];
        this.sending = [];
        this.sent = [];
        this.failed = [];
    }
    send(payloadDraft, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const item = this.enqueue(payloadDraft);
            return this.sendItem(item, options);
        });
    }
    enqueue(payloadDraft) {
        const now = Date.now();
        const item = {
            payload: Object.assign(Object.assign({}, payloadDraft), { sg_event_id: payloadDraft.sg_event_id || (0, Tools_1.createUUID)() }),
            status: "pending",
            attempts: 0,
            createdAt: now,
            updatedAt: now,
        };
        this.pending.push(item);
        return item;
    }
    sendItem(item, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const maxAttempts = options.maxAttempts || MAX_ATTEMPTS;
            const timeoutMs = options.timeoutMs || REQUEST_TIMEOUT_MS;
            while (item.attempts < maxAttempts) {
                if (item.attempts > 0) {
                    yield this.wait(this.retryDelay(item.attempts));
                }
                this.moveItem(item, "sending");
                item.attempts++;
                try {
                    const response = yield this.remote.post(item.payload, { timeoutMs });
                    item.response = response;
                    item.error = undefined;
                    if (response.ok) {
                        this.moveItem(item, "sent");
                        return response;
                    }
                    if (!this.shouldRetryStatus(response.status) || item.attempts >= maxAttempts) {
                        this.failItem(item);
                        return null;
                    }
                    this.logger.warn(`Retrying event ${item.payload.sg_event_id} after HTTP ${response.status}.`);
                    this.moveItem(item, "pending");
                }
                catch (error) {
                    item.error = error;
                    item.response = undefined;
                    if (item.attempts >= maxAttempts) {
                        this.failItem(item);
                        return null;
                    }
                    this.logger.warn(`Retrying event ${item.payload.sg_event_id} after a network error.`);
                    this.moveItem(item, "pending");
                }
            }
            this.failItem(item);
            return null;
        });
    }
    shouldRetryStatus(status) {
        return status === 408 || status === 429 || status >= 500;
    }
    retryDelay(attemptsCompleted) {
        const delay = RETRY_DELAYS_MS[attemptsCompleted - 1] || RETRY_DELAYS_MS[RETRY_DELAYS_MS.length - 1];
        const jitter = Math.floor(Math.random() * RETRY_JITTER_MS);
        return delay + jitter;
    }
    wait(delay) {
        return new Promise(resolve => window.setTimeout(resolve, delay));
    }
    moveItem(item, status) {
        this.removeItem(item);
        item.status = status;
        item.updatedAt = Date.now();
        this[status].push(item);
    }
    removeItem(item) {
        this.pending = this.pending.filter(queueItem => queueItem !== item);
        this.sending = this.sending.filter(queueItem => queueItem !== item);
        this.sent = this.sent.filter(queueItem => queueItem !== item);
        this.failed = this.failed.filter(queueItem => queueItem !== item);
    }
    failItem(item) {
        this.moveItem(item, "failed");
        if (item.response) {
            this.logger.error({
                message: `Failed to send event ${item.payload.sg_event_id} after ${item.attempts} attempts.`,
                status: item.response.status,
                body: item.response.body,
            });
            return;
        }
        this.logger.error({
            message: `Failed to send event ${item.payload.sg_event_id} after ${item.attempts} attempts.`,
            error: item.error,
        });
    }
}
exports["default"] = EventSender;


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

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Manager = void 0;
const BrowserInfo_1 = __webpack_require__(/*! ./BrowserInfo */ "./src/BrowserInfo.ts");
const CampaignInfo_1 = __webpack_require__(/*! ./CampaignInfo */ "./src/CampaignInfo.ts");
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
const EventSender_1 = __importDefault(__webpack_require__(/*! ./EventSender */ "./src/EventSender.ts"));
const Logger_1 = __importDefault(__webpack_require__(/*! ./Logger */ "./src/Logger.ts"));
const i18n_1 = __webpack_require__(/*! ./i18n */ "./src/i18n/index.ts");
const AttackDetector_1 = __webpack_require__(/*! ./tutorial/AttackDetector */ "./src/tutorial/AttackDetector.ts");
const Tutorial_1 = __webpack_require__(/*! ./tutorial/Tutorial */ "./src/tutorial/Tutorial.ts");
// How long the overlay gets to prove it is actually on screen before the
// redirect happens anyway.
const TUTORIAL_WATCHDOG_MS = 1200;
class Manager {
    constructor(remote, { eventsToInclude = [], eventsToExclude = [], source, redirectUrl, shouldRedirect, extraPayload, debug = false, tutorial = false, tutorialSkippable = true, locale }) {
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
        this.tutorial = null;
        this.logger = new Logger_1.default(debug);
        this.tutorialEnabled = tutorial;
        this.tutorialSkippable = tutorialSkippable;
        this.locale = locale;
        this.sender = new EventSender_1.default(remote, this.logger);
        [this.token, this.campaignInfo] = (0, CampaignInfo_1.findCampaignInfo)();
        this.browserInfoPromise = (0, BrowserInfo_1.findBrowserInfo)();
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
                activeEvent.source.addEventListener(activeEvent.trigger, this.handlers[i++] = (event) => this.handle(activeEvent, event));
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
     * Packs the event data into an `IEventPayloadDraft` object.
     *
     * @param {string} type - The type of the event.
     * @param {IEvent} activeEvent - The active event to be packed.
     * @param {BrowserInfo} browserInfo - The resolved browser information.
     * @returns {IEventPayloadDraft} - The packed event payload.
     */
    packEvent(type, activeEvent, browserInfo) {
        return Object.assign({ "data": Object.assign(Object.assign({}, browserInfo), { type }), "source": this.source, "timestamp": Math.floor(Date.now() / 1000), "ats_header": this.token, "event": activeEvent.name.toLowerCase(), "sg_message_id": this.campaignInfo.ats_instance_id }, this.extraPayload);
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
    shouldSkipDedupedEvent(activeEvent, event) {
        if (!activeEvent.shouldDedup || !event || !(event.target instanceof HTMLElement)) {
            return false;
        }
        const attributeName = `data-ats-${activeEvent.name.replace(/_/g, "-")}-recorded`;
        if (event.target.hasAttribute(attributeName)) {
            this.logger.info(`Preventing duplicate event @${activeEvent.trigger} (${activeEvent.name}).`);
            return true;
        }
        event.target.setAttribute(attributeName, "true");
        return false;
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
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.info(`Event @${activeEvent.trigger} (${activeEvent.name}) triggered...`);
            try {
                this.checkEvent(activeEvent, event, shouldValidate);
            }
            catch (e) {
                this.logger.error(e);
                throw e;
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
                throw e;
            }
            if (this.shouldSkipDedupedEvent(activeEvent, event)) {
                return;
            }
            const type = this.findType(activeEvent, event);
            // Scan the page before anything is awaited: the page's own handlers run
            // first and often replace the form with a spinner, which would leave
            // nothing to explain by the time the request finishes.
            const detection = activeEvent.redirectOnFinish && this.shouldRedirect && this.tutorialEnabled
                ? this.scanSafely(activeEvent)
                : null;
            try {
                // A throwing subscriber must never strand the victim: the original
                // action was already cancelled by preventDefault above.
                this.triggerSubscription(activeEvent);
            }
            catch (e) {
                this.logger.error(e);
            }
            try {
                const browserInfo = yield this.browserInfoPromise;
                const payload = this.packEvent(type, activeEvent, browserInfo);
                const result = yield this.sender.send(payload, {
                    maxAttempts: activeEvent.redirectOnFinish && this.shouldRedirect ? 1 : undefined,
                });
                if (result) {
                    this.logger.info(result.body);
                }
            }
            catch (e) {
                this.logger.error(e);
            }
            finally {
                if (activeEvent.redirectOnFinish && this.shouldRedirect) {
                    this.finishEvent(detection);
                }
            }
        });
    }
    /**
     * Scans the page for the tutorial without ever letting a scan failure
     * escape into the redirect path.
     *
     * @param {IEvent} activeEvent - The event being executed.
     * @returns {Detection | null} - The detection, or null if scanning failed.
     */
    scanSafely(activeEvent) {
        var _a;
        try {
            // The campaign token may name the brand its landing page imitates;
            // otherwise the page itself is inspected.
            return (0, AttackDetector_1.scanPage)(activeEvent.name, document, (_a = this.campaignInfo) === null || _a === void 0 ? void 0 : _a.ats_brand);
        }
        catch (e) {
            this.logger.error(e);
            return null;
        }
    }
    /**
     * Finishes a redirecting event: opens the educational tutorial when it
     * is enabled (the redirect then happens once the user completes or
     * skips it), otherwise redirects immediately.
     *
     * @param {Detection | null} detection - The page scan taken before sending.
     */
    finishEvent(detection) {
        if (!this.tutorialEnabled || !detection) {
            this.performRedirect();
            return;
        }
        try {
            const tutorial = this.getTutorial();
            if (tutorial.isOpen) {
                return;
            }
            tutorial.open(detection);
            // The overlay can be neutered by the page it sits on — hidden by a
            // CSS rule, removed by a MutationObserver, or left unstyled by a
            // strict CSP. If it isn't actually on screen shortly after opening,
            // fall back to the redirect rather than stranding the victim.
            window.setTimeout(() => {
                if (!tutorial.isUsable) {
                    this.logger.error("Tutorial overlay is not usable, redirecting instead.");
                    this.performRedirect();
                }
            }, TUTORIAL_WATCHDOG_MS);
        }
        catch (e) {
            this.logger.error(e);
            this.performRedirect();
        }
    }
    performRedirect() {
        window.location.href = `${this.redirectUrl}${window.location.search}`;
    }
    getTutorial() {
        var _a;
        if (!this.tutorial) {
            const resolved = (0, i18n_1.resolveLocale)(this.locale, (_a = this.campaignInfo) === null || _a === void 0 ? void 0 : _a.ats_locale, navigator.language);
            this.logger.info(`Tutorial locale: ${resolved}`);
            this.tutorial = new Tutorial_1.Tutorial((0, i18n_1.createTranslator)(resolved), this.tutorialSkippable, () => this.performRedirect(), this.logger);
        }
        return this.tutorial;
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
     * @returns {Promise<RemoteResponse>} - A promise that resolves to the response status and body.
     */
    post(data, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.debug) {
                console.log(`Sending event to ${this.url} with data:`);
                console.table(data);
            }
            const canTimeout = typeof options.timeoutMs === "number" && options.timeoutMs > 0 && typeof AbortController !== "undefined";
            const controller = canTimeout ? new AbortController() : null;
            const timeout = canTimeout ? window.setTimeout(() => controller.abort(), options.timeoutMs) : null;
            try {
                const response = yield fetch(this.url, {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                        "api-key": this.api_key,
                    },
                    keepalive: true,
                    signal: controller ? controller.signal : undefined,
                    body: JSON.stringify(data),
                });
                const contentType = response.headers.get("content-type");
                const text = yield response.text();
                let body = text;
                if (contentType && contentType.indexOf("application/json") !== -1 && text) {
                    try {
                        body = JSON.parse(text);
                    }
                    catch (_a) {
                        body = text;
                    }
                }
                return {
                    ok: response.ok,
                    status: response.status,
                    contentType,
                    body,
                };
            }
            finally {
                if (timeout) {
                    window.clearTimeout(timeout);
                }
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
    get shouldDedup() {
        return false;
    }
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
    get shouldDedup() {
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
        this.minStaySeconds = 30 * 1000;
        this.hasScrolled = false;
        this.hasStayed = false;
        this.manualStayed = () => this.stayed(true);
        this.visibilityChanged = () => {
            const [_, visibilityState] = this.visibilityProps;
            this.toggleTimer(document[visibilityState] === "visible");
        };
        this.focusGranted = () => {
            this.toggleTimer(true);
        };
        this.focusLost = () => {
            this.toggleTimer(false);
        };
        this.stayed = (force = false) => {
            if (force || this.hasScrolled || !this.canScroll) {
                this.dispatch();
            }
            this.hasStayed = true;
        };
        this.customEvent = new Event(this.trigger);
        this.enable();
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
        return window.innerHeight / document.documentElement.scrollHeight < 0.85;
    }
    isValid() {
        return true;
    }
    enable() {
        window.onscroll = () => this.scrolled();
        if (window.isManualTrigger) {
            console.log("Manual trigger enabled for page read event.");
            window.addEventListener("manual_page_read", this.manualStayed);
        }
        else {
            this.detectFocus();
            this.detectVisibility();
            this.scrolled();
            this.timeout = setTimeout(this.stayed, this.minStaySeconds);
        }
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
        window.addEventListener("focus", this.focusGranted);
        window.addEventListener("blur", this.focusLost);
    }
    detectVisibility() {
        // check the visiblility of the page
        try {
            const [visibilityChange] = this.visibilityProps;
            document.addEventListener(visibilityChange, this.visibilityChanged);
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
            document.removeEventListener(visibilityChange, this.visibilityChanged);
        }
        catch (_) {
            //
            return;
        }
    }
    toggleTimer(status) {
        if (this.hasStayed) {
            return;
        }
        if (status) {
            this.timeout = setTimeout(this.stayed, this.minStaySeconds);
        }
        else {
            clearTimeout(this.timeout);
        }
    }
    disable() {
        window.onscroll = null;
        this.stopDetectingVisibility();
        window.removeEventListener("focus", this.focusGranted);
        window.removeEventListener("blur", this.focusLost);
        window.removeEventListener("manual_page_read", this.manualStayed);
    }
    getScrollPercent() {
        return (((document.documentElement.scrollTop + document.body.scrollTop) /
            (document.documentElement.scrollHeight -
                document.documentElement.clientHeight)) *
            100);
    }
    scrolled() {
        if (this.getScrollPercent() > this.minScrollPercentage) {
            if (this.hasStayed) {
                this.dispatch();
            }
            this.hasScrolled = true;
        }
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

/***/ "./src/i18n/index.ts":
/*!***************************!*\
  !*** ./src/i18n/index.ts ***!
  \***************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createTranslator = exports.resolveLocale = void 0;
const en_US_1 = __importDefault(__webpack_require__(/*! ./locales/en-US */ "./src/i18n/locales/en-US.ts"));
const ro_RO_1 = __importDefault(__webpack_require__(/*! ./locales/ro-RO */ "./src/i18n/locales/ro-RO.ts"));
const es_ES_1 = __importDefault(__webpack_require__(/*! ./locales/es-ES */ "./src/i18n/locales/es-ES.ts"));
const ca_ES_1 = __importDefault(__webpack_require__(/*! ./locales/ca-ES */ "./src/i18n/locales/ca-ES.ts"));
const es_419_1 = __importDefault(__webpack_require__(/*! ./locales/es-419 */ "./src/i18n/locales/es-419.ts"));
const pt_BR_1 = __importDefault(__webpack_require__(/*! ./locales/pt-BR */ "./src/i18n/locales/pt-BR.ts"));
const pt_PT_1 = __importDefault(__webpack_require__(/*! ./locales/pt-PT */ "./src/i18n/locales/pt-PT.ts"));
const fr_FR_1 = __importDefault(__webpack_require__(/*! ./locales/fr-FR */ "./src/i18n/locales/fr-FR.ts"));
const de_DE_1 = __importDefault(__webpack_require__(/*! ./locales/de-DE */ "./src/i18n/locales/de-DE.ts"));
const el_GR_1 = __importDefault(__webpack_require__(/*! ./locales/el-GR */ "./src/i18n/locales/el-GR.ts"));
const CATALOGS = {
    "en-US": en_US_1.default,
    "ro-RO": ro_RO_1.default,
    "es-ES": es_ES_1.default,
    "ca-ES": ca_ES_1.default,
    "es-419": es_419_1.default,
    "pt-BR": pt_BR_1.default,
    "pt-PT": pt_PT_1.default,
    "fr-FR": fr_FR_1.default,
    "de-DE": de_DE_1.default,
    "el-GR": el_GR_1.default,
};
const CANONICAL = Object.keys(CATALOGS).reduce((map, tag) => {
    map[tag.toLowerCase()] = tag;
    return map;
}, {});
const ALIASES = {
    "es-latam": "es-419",
    "es-la": "es-419",
};
const LANGUAGE_DEFAULTS = {
    en: "en-US",
    ro: "ro-RO",
    es: "es-419",
    ca: "ca-ES",
    pt: "pt-PT",
    fr: "fr-FR",
    de: "de-DE",
    el: "el-GR",
};
const matchOne = (raw) => {
    if (!raw) {
        return null;
    }
    const tag = raw.trim().toLowerCase().replace(/_/g, "-");
    if (!tag) {
        return null;
    }
    if (ALIASES[tag]) {
        return ALIASES[tag];
    }
    if (CANONICAL[tag]) {
        return CANONICAL[tag];
    }
    const language = tag.split("-")[0];
    return LANGUAGE_DEFAULTS[language] || null;
};
/**
 * Resolves the first matching locale from the provided candidates,
 * falling back to "en-US" when none match.
 *
 * @param {...(string | undefined)} candidates - Locale tags in priority order.
 * @returns {Locale} - The resolved locale.
 */
const resolveLocale = (...candidates) => {
    for (const candidate of candidates) {
        const match = matchOne(candidate);
        if (match) {
            return match;
        }
    }
    return "en-US";
};
exports.resolveLocale = resolveLocale;
/**
 * Creates a translator bound to the given locale. Unknown keys fall back to en-US.
 * Templates may contain {placeholders} replaced from the vars map.
 *
 * @param {Locale} locale - The locale to translate into.
 * @returns {Translator} - The translating function.
 */
const createTranslator = (locale) => {
    const catalog = CATALOGS[locale];
    return (key, vars) => {
        const template = catalog[key] || CATALOGS["en-US"][key] || key;
        if (!vars) {
            return template;
        }
        return template.replace(/\{(\w+)\}/g, (token, name) => (name in vars ? String(vars[name]) : token));
    };
};
exports.createTranslator = createTranslator;


/***/ }),

/***/ "./src/i18n/locales/ca-ES.ts":
/*!***********************************!*\
  !*** ./src/i18n/locales/ca-ES.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const strings = {
    heading: "Això ha estat una simulació de phishing",
    intro: "La bona notícia: no ha estat un atac real. Dedica un minut a repassar els senyals d'alerta que se't van passar per alt; la pròxima vegada et poden salvar.",
    next: "Següent",
    back: "Enrere",
    skip: "Omet el tutorial",
    continue: "Continua",
    progress: "Pas {n} de {total}",
    arrow_hint: "L'adreça web és aquí dalt",
    step_url_title: "Comprova sempre l'adreça primer",
    step_url_body: "Fixa't en la barra d'adreces a la part superior del navegador. L'adreça d'aquesta pàgina no pertany a l'organització real: els atacants confien que no t'hi fixaràs. Abans d'escriure, fer clic o baixar res, llegeix atentament el nom del domini.",
    url_actual_label: "L'adreça on eres",
    url_reason_ip: "Aquesta adreça és una adreça IP numèrica en comptes del nom d'una empresa. Les organitzacions reals fan servir el seu propi domini, de manera que una adreça feta de números és un indici clar que el lloc és fals.",
    url_reason_punycode: "Aquesta adreça fa servir caràcters especials que imiten lletres normals. Els atacants els utilitzen perquè un domini fals sembli idèntic al real a primer cop d'ull.",
    url_reason_brand_subdomain: "Llegeix l'adreça començant per la dreta, no per l'esquerra. La part que decideix on ets és {domain}: tot el que hi ha al davant és un subdomini, i qui sigui propietari de {domain} en pot crear tants com vulgui, amb el nom que vulgui.",
    url_reason_brand_in_subdomain: "L'adreça sí que conté {brand}, però només com a subdomini. Els llocs autèntics també fan servir subdominis i, precisament per això, no demostren res: qui sigui propietari de {domain} hi pot posar al davant el nom que vulgui. El que decideix on ets és {domain}, la part just abans de la primera barra.",
    url_reason_hyphen: "El domini real aquí és {domain}. Els atacants enganxen noms de marca amb guionets perquè l'adreça sembli oficial; el lloc autèntic faria servir, simplement, el domini propi de la marca.",
    url_reason_tld: "El domini real aquí és {domain}. La seva terminació (.{tld}) és poc habitual entre les organitzacions consolidades i agrada als atacants perquè registrar-la és molt barat.",
    url_reason_long: "Fixa't en com de llarga i embolicada és aquesta adreça: un seguit de paraules de més, guionets i caràcters solts al voltant de {domain}. Les pàgines d'inici de sessió autèntiques són en un domini curt i senzill; tanta llargada només serveix per deixar el nom real fora del teu camp de visió.",
    url_reason_generic: "La part que decideix on ets de debò és {domain}: el text just abans de la primera barra. Tota la resta de l'adreça es pot manipular perquè sembli convincent.",
    step_password_title: "Aquest formulari volia la teva contrasenya",
    step_password_body: "Has estat a un pas de donar la contrasenya a un atacant. Les organitzacions reals no et demanen mai que confirmis la contrasenya a través d'un enllaç en un correu. Si tens dubtes, entra-hi pel teu compte escrivint l'adreça del lloc web.",
    step_cc_title: "Aquest formulari demanava les dades de la teva targeta",
    step_cc_body: "Si haguessis introduït aquí el número de la targeta, la data de caducitat i el codi de seguretat, haurien anat directes als delinqüents. Les empreses legítimes no recullen dades de pagament a través d'enllaços inesperats.",
    step_download_title: "Aquesta baixada podria haver estat programari maliciós",
    step_download_body: "Aquest fitxer podria haver instal·lat programari maliciós al teu dispositiu. Comprova l'extensió del fitxer abans d'obrir res i baixa programari només de fonts de confiança.",
    step_suspicious_link_title: "Aquest enllaç no és el que diu ser",
    step_suspicious_link_body: "El text de l'enllaç diu {shown}, però en realitat porta a {actual}. Passa el cursor per sobre dels enllaços per veure la destinació real abans de fer clic.",
    step_brand_title: "Aquesta pàgina es fa passar per {brand}",
    step_brand_body: "Es presenta com a {brand}, però l'adreça pertany a {domain}. Les grans empreses no allotgen les seves pàgines d'inici de sessió en dominis aliens: que el nom de la pàgina no coincideixi amb el de la barra d'adreces és un dels senyals més clars que és falsa.",
    step_urgency_title: "La urgència és una tàctica de pressió",
    step_urgency_body: "«Actua ara», terminis, amenaces de suspendre't el compte… Els atacants creen pressió perquè actuïs abans de pensar. Les empreses reals poques vegades exigeixen una acció immediata; atura't a pensar quan un missatge et vulgui fer córrer.",
    urgency_quote: "Aquesta pàgina t'ha pressionat amb: «{quote}»",
    perm_mic_title: "Has cedit el micròfon",
    perm_mic_body: "Aquesta pàgina ara pot escoltar a través del teu micròfon fins que no li retiris l'accés. Un lloc real t'explica per què necessita el micròfon: per a una trucada o una gravació que has començat tu.",
    perm_webcam_title: "Has cedit la càmera",
    perm_webcam_body: "Aquesta pàgina ara pot veure't a través de la càmera fins que no li retiris l'accés. Permet l'accés a la càmera només en llocs que hagis obert tu i on s'esperi clarament una videotrucada.",
    perm_location_title: "Has compartit la teva ubicació",
    perm_location_body: "Aquesta pàgina ara sap on ets. Els llocs legítims només et demanen la ubicació quan és evident que cal, com ara per trobar una botiga propera, i continuen funcionant si t'hi negues.",
    perm_notification_title: "Has permès les notificacions",
    perm_notification_body: "Aquesta pàgina ara pot enviar-te missatges a l'escriptori, fins i tot després que la tanquis. Els atacants fan servir aquestes notificacions per mostrar falsos avisos de virus i arrossegar-te cap a més estafes.",
    perm_clipboard_title: "Has donat accés al porta-retalls",
    perm_clipboard_body: "El porta-retalls sovint conté una contrasenya, un número de targeta o una adreça de criptomonedes que acabes de copiar. Una pàgina amb accés al porta-retalls pot llegir-lo, o canviar d'amagat el que hi enganxes.",
    perm_extension_title: "Has instal·lat una extensió del navegador",
    perm_extension_body: "Les extensions poden llegir i modificar totes les pàgines que visites, incloent-hi el correu i el banc. Instal·la-les només des de les botigues oficials i només quan sàpigues qui les publica.",
    lesson_login_title: "El cadenat no vol dir que sigui segur",
    lesson_login_body: "La icona del cadenat o «https» només vol dir que la connexió està xifrada, no que el lloc sigui autèntic. Els llocs de phishing també fan servir xifratge. Confia en el nom del domini, no en el cadenat.",
    lesson_fraud_title: "Com protegir els teus diners",
    lesson_fraud_body: "No introdueixis mai dades de pagament en una pàgina a la qual has arribat des d'un correu o un missatge. Entra pel teu compte al lloc web oficial de l'empresa o a la seva aplicació, o truca al número que hi ha al revers de la targeta.",
    lesson_malware_title: "Verifica abans de baixar",
    lesson_malware_body: "Els fitxers adjunts i les baixades són una via preferida per colar programari maliciós al dispositiu. Confirma-ho amb el remitent per un altre canal i desconfia de tipus de fitxer com ara .exe o .zip, o de documents que et demanin activar macros.",
    lesson_fake_title: "Si sembla massa bo per ser veritat…",
    lesson_fake_body: "Les pàgines falses imiten marques de confiança per aconseguir el teu clic, les teves dades o la teva confiança. Comprova l'adreça, fixa't en els detalls descurats i, quan alguna cosa no et quadri, tanca la pàgina i entra-hi pel teu compte.",
    lesson_permission_title: "Vigila què permets",
    lesson_permission_body: "Acabes de concedir a aquesta pàgina un accés que no hauria de tenir. Els llocs legítims expliquen per què necessiten la càmera, el micròfon o la ubicació abans de demanar-te'n l'accés. Concedeix només permisos que entenguis del tot; els pots revisar a la configuració del navegador.",
    step_done_title: "Què comprovar la propera vegada",
    step_done_body: "Comprova l'adreça, qüestiona la urgència, protegeix les contrasenyes i les dades de la targeta, i pensa abans de baixar res. Fes clic a «Continua» per continuar.",
};
exports["default"] = strings;


/***/ }),

/***/ "./src/i18n/locales/de-DE.ts":
/*!***********************************!*\
  !*** ./src/i18n/locales/de-DE.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const strings = {
    heading: "Das war eine Phishing-Simulation",
    intro: "Die gute Nachricht: Es war kein echter Angriff. Nehmen Sie sich eine Minute Zeit für die Warnsignale, die Sie übersehen haben – beim nächsten Mal kann Sie das schützen.",
    next: "Weiter",
    back: "Zurück",
    skip: "Tutorial überspringen",
    continue: "Fortfahren",
    progress: "Schritt {n} von {total}",
    arrow_hint: "Die Webadresse steht hier oben",
    step_url_title: "Prüfen Sie immer zuerst die Adresse",
    step_url_body: "Schauen Sie auf die Adressleiste oben in Ihrem Browser. Die Adresse dieser Seite gehört nicht zur echten Organisation – Angreifer verlassen sich darauf, dass Sie nicht hinsehen. Lesen Sie den Domainnamen genau, bevor Sie etwas eingeben, anklicken oder herunterladen.",
    url_actual_label: "Die Adresse, auf der Sie waren",
    url_reason_ip: "Diese Adresse ist eine bloße IP-Adresse statt eines Firmennamens. Echte Organisationen nutzen ihre eigene Domain – eine reine Zahlenadresse ist deshalb ein starkes Anzeichen für eine gefälschte Seite.",
    url_reason_punycode: "Diese Adresse enthält Sonderzeichen, die gewöhnliche Buchstaben nachahmen. Angreifer nutzen sie, damit eine gefälschte Domain auf den ersten Blick genauso aussieht wie die echte.",
    url_reason_brand_subdomain: "Lesen Sie die Adresse von rechts nach links. Entscheidend dafür, wo Sie sind, ist {domain}; alles davor ist eine Subdomain, und wer {domain} besitzt, kann beliebig viele davon anlegen – mit jedem Namen.",
    url_reason_brand_in_subdomain: "Die Adresse enthält tatsächlich {brand} – allerdings nur als Subdomain. Auch echte Seiten nutzen Subdomains, und genau deshalb beweisen sie nichts: Wer {domain} besitzt, kann jeden beliebigen Namen davorsetzen. Entscheidend ist {domain}, der Teil unmittelbar vor dem ersten Schrägstrich.",
    url_reason_hyphen: "Die eigentliche Domain lautet hier {domain}. Angreifer reihen Markennamen mit Bindestrichen aneinander, um offiziell zu wirken – die echte Website würde einfach die eigene Domain der Marke verwenden.",
    url_reason_tld: "Die eigentliche Domain lautet hier {domain}. Ihre Endung (.{tld}) wird von etablierten Organisationen kaum genutzt und ist bei Angreifern beliebt, weil sie billig zu registrieren ist.",
    url_reason_long: "Achten Sie darauf, wie lang und unübersichtlich diese Adresse ist: eine Kette aus zusätzlichen Wörtern, Bindestrichen und zufälligen Zeichen rund um {domain}. Echte Anmeldeseiten liegen auf einer kurzen, schlichten Domain – die Länge dient nur dazu, den echten Namen aus Ihrem Blickfeld zu schieben.",
    url_reason_generic: "Entscheidend dafür, wo Sie wirklich sind, ist {domain} – der Teil direkt vor dem ersten Schrägstrich. Alles andere in der Adresse lässt sich täuschend echt gestalten.",
    step_password_title: "Dieses Formular wollte Ihr Passwort",
    step_password_body: "Sie waren nur einen Schritt davon entfernt, Ihr Passwort einem Angreifer zu übergeben. Echte Organisationen bitten Sie niemals, Ihr Passwort über einen Link in einer E-Mail zu bestätigen. Öffnen Sie die Website im Zweifel selbst, indem Sie ihre Adresse eintippen.",
    step_cc_title: "Dieses Formular hat nach Ihren Kartendaten gefragt",
    step_cc_body: "Hätten Sie hier Kartennummer, Ablaufdatum und Sicherheitscode eingegeben, wären sie direkt bei Kriminellen gelandet. Seriöse Unternehmen erfragen Zahlungsdaten nicht über unerwartete Links.",
    step_download_title: "Dieser Download hätte Schadsoftware enthalten können",
    step_download_body: "Diese Datei hätte Schadsoftware auf Ihrem Gerät installieren können. Prüfen Sie die Dateiendung, bevor Sie etwas öffnen – und laden Sie Programme nur aus vertrauenswürdigen Quellen herunter.",
    step_suspicious_link_title: "Dieser Link ist nicht das, was er vorgibt zu sein",
    step_suspicious_link_body: "Der Linktext lautet {shown}, tatsächlich führt er aber zu {actual}. Fahren Sie mit der Maus über Links, um vor dem Klicken das echte Ziel zu sehen.",
    step_brand_title: "Diese Seite gibt sich als {brand} aus",
    step_brand_body: "Sie tritt als {brand} auf, doch die Adresse gehört zu {domain}. Große Unternehmen betreiben ihre Anmeldeseiten nicht auf fremden Domains – wenn der Name auf der Seite nicht zum Namen in der Adressleiste passt, ist das eines der deutlichsten Anzeichen für eine Fälschung.",
    step_urgency_title: "Zeitdruck ist eine gezielte Masche",
    step_urgency_body: "„Handeln Sie jetzt“, Fristen, Drohungen mit Kontosperrung – Angreifer erzeugen Druck, damit Sie handeln, bevor Sie nachdenken. Seriöse Unternehmen verlangen selten sofortiges Handeln; halten Sie inne, wenn eine Nachricht Sie zur Eile drängt.",
    urgency_quote: "Diese Seite hat Sie so unter Druck gesetzt: „{quote}“",
    perm_mic_title: "Sie haben Ihr Mikrofon freigegeben",
    perm_mic_body: "Diese Seite kann jetzt über Ihr Mikrofon mithören, bis Sie den Zugriff widerrufen. Eine seriöse Website sagt Ihnen, wofür sie Ihr Mikrofon braucht – etwa für einen Anruf oder eine Aufnahme, die Sie selbst gestartet haben.",
    perm_webcam_title: "Sie haben Ihre Kamera freigegeben",
    perm_webcam_body: "Diese Seite kann jetzt durch Ihre Kamera sehen, bis Sie den Zugriff widerrufen. Erlauben Sie Kamerazugriff nur auf Websites, die Sie selbst geöffnet haben und auf denen ein Videoanruf klar zu erwarten ist.",
    perm_location_title: "Sie haben Ihren Standort preisgegeben",
    perm_location_body: "Diese Seite weiß jetzt, wo Sie sind. Seriöse Websites fragen nur dann nach Ihrem Standort, wenn er offensichtlich gebraucht wird – etwa um eine Filiale in der Nähe zu finden – und sie funktionieren auch, wenn Sie ablehnen.",
    perm_notification_title: "Sie haben Benachrichtigungen erlaubt",
    perm_notification_body: "Diese Seite kann jetzt Meldungen auf Ihren Desktop schicken – auch nachdem Sie sie geschlossen haben. Angreifer nutzen das für gefälschte Virenwarnungen und um Sie in weitere Betrugsmaschen zu locken.",
    perm_clipboard_title: "Sie haben Zugriff auf Ihre Zwischenablage gewährt",
    perm_clipboard_body: "In Ihrer Zwischenablage liegt oft ein gerade kopiertes Passwort, eine Kartennummer oder eine Krypto-Adresse. Eine Seite mit Zugriff auf die Zwischenablage kann das auslesen – oder unbemerkt austauschen, was Sie einfügen.",
    perm_extension_title: "Sie haben eine Browser-Erweiterung installiert",
    perm_extension_body: "Erweiterungen können jede Seite, die Sie besuchen, mitlesen und verändern – auch Ihre E-Mails und Ihr Online-Banking. Installieren Sie sie nur aus offiziellen Stores und nur dann, wenn Sie wissen, wer dahintersteht.",
    lesson_login_title: "Das Schloss-Symbol bedeutet nicht, dass die Seite sicher ist",
    lesson_login_body: "Das Schloss-Symbol oder „https“ bedeutet nur, dass die Verbindung verschlüsselt ist – nicht, dass die Website echt ist. Auch Phishing-Seiten nutzen Verschlüsselung. Vertrauen Sie dem Domainnamen, nicht dem Schloss.",
    lesson_fraud_title: "So schützen Sie Ihr Geld",
    lesson_fraud_body: "Geben Sie niemals Zahlungsdaten auf einer Seite ein, die Sie über eine E-Mail oder Nachricht erreicht haben. Rufen Sie die offizielle Website oder App des Unternehmens selbst auf oder wählen Sie die Nummer auf der Rückseite Ihrer Karte.",
    lesson_malware_title: "Erst prüfen, dann herunterladen",
    lesson_malware_body: "Anhänge und Downloads sind ein beliebter Weg, Schadsoftware auf Ihr Gerät zu schleusen. Fragen Sie beim Absender über einen anderen Kanal nach und seien Sie misstrauisch bei Dateitypen wie .exe oder .zip sowie bei Dokumenten, die Sie zum Aktivieren von Makros auffordern.",
    lesson_fake_title: "Wenn etwas zu schön ist, um wahr zu sein …",
    lesson_fake_body: "Gefälschte Seiten imitieren vertrauenswürdige Marken, um an Ihren Klick, Ihre Daten oder Ihr Vertrauen zu kommen. Prüfen Sie die Adresse, achten Sie auf nachlässige Details – und wenn Ihnen etwas seltsam vorkommt, schließen Sie die Seite und rufen Sie die Website selbst auf.",
    lesson_permission_title: "Vorsicht bei Berechtigungen",
    lesson_permission_body: "Sie haben dieser Seite gerade einen Zugriff erlaubt, den sie nicht haben dürfte. Seriöse Websites erklären, warum sie Kamera, Mikrofon oder Standort benötigen, bevor sie danach fragen. Erteilen Sie nur Berechtigungen, die Sie vollständig verstehen – Sie können sie in den Browsereinstellungen überprüfen.",
    step_done_title: "Worauf Sie beim nächsten Mal achten",
    step_done_body: "Prüfen Sie die Adresse, hinterfragen Sie Dringlichkeit, schützen Sie Passwörter und Kartendaten und denken Sie nach, bevor Sie etwas herunterladen. Klicken Sie auf „Fortfahren“, um zum nächsten Schritt zu gelangen.",
};
exports["default"] = strings;


/***/ }),

/***/ "./src/i18n/locales/el-GR.ts":
/*!***********************************!*\
  !*** ./src/i18n/locales/el-GR.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const strings = {
    heading: "Αυτή ήταν μια προσομοίωση phishing",
    intro: "Τα καλά νέα: δεν επρόκειτο για πραγματική επίθεση. Αφιερώστε ένα λεπτό για να δείτε τα προειδοποιητικά σημάδια που σας διέφυγαν — την επόμενη φορά μπορεί να σας σώσουν.",
    next: "Επόμενο",
    back: "Πίσω",
    skip: "Παράλειψη οδηγού",
    continue: "Συνέχεια",
    progress: "Βήμα {n} από {total}",
    arrow_hint: "Η διεύθυνση ιστού βρίσκεται εδώ πάνω",
    step_url_title: "Ελέγχετε πάντα πρώτα τη διεύθυνση",
    step_url_body: "Κοιτάξτε τη γραμμή διευθύνσεων στο επάνω μέρος του προγράμματος περιήγησης. Η διεύθυνση αυτής της σελίδας δεν ανήκει στον πραγματικό οργανισμό — οι επιτιθέμενοι υπολογίζουν ακριβώς στο ότι δεν θα την κοιτάξετε. Πριν πληκτρολογήσετε, κάνετε κλικ ή κατεβάσετε οτιδήποτε, διαβάστε προσεκτικά το όνομα τομέα (domain).",
    url_actual_label: "Η διεύθυνση στην οποία βρισκόσασταν",
    url_reason_ip: "Αυτή η διεύθυνση αποτελείται από αριθμούς (διεύθυνση IP) αντί για όνομα εταιρείας. Οι πραγματικοί οργανισμοί χρησιμοποιούν δικό τους όνομα τομέα (domain), επομένως μια αριθμητική διεύθυνση αποτελεί ισχυρή ένδειξη ψεύτικου ιστότοπου.",
    url_reason_punycode: "Αυτή η διεύθυνση χρησιμοποιεί ειδικούς χαρακτήρες που μιμούνται συνηθισμένα γράμματα. Οι επιτιθέμενοι τους χρησιμοποιούν ώστε ένα ψεύτικο όνομα τομέα (domain) να φαίνεται με μια ματιά πανομοιότυπο με το πραγματικό.",
    url_reason_brand_subdomain: "Διαβάστε τη διεύθυνση από τα δεξιά, όχι από τα αριστερά. Το τμήμα που καθορίζει πού βρίσκεστε είναι το {domain}· ό,τι προηγείται είναι υποτομέας, και όποιος κατέχει το {domain} μπορεί να δημιουργήσει όσους θέλει, με όποιο όνομα θέλει.",
    url_reason_brand_in_subdomain: "Η διεύθυνση όντως περιέχει το {brand} — αλλά μόνο ως υποτομέα. Και οι γνήσιοι ιστότοποι χρησιμοποιούν υποτομείς, γι' αυτό ακριβώς δεν αποδεικνύουν τίποτα: όποιος κατέχει το {domain} μπορεί να βάλει μπροστά όποιο όνομα θέλει. Αυτό που καθορίζει πού βρίσκεστε είναι το {domain}, το τμήμα ακριβώς πριν από την πρώτη κάθετο.",
    url_reason_hyphen: "Το πραγματικό όνομα τομέα (domain) εδώ είναι το {domain}. Οι επιτιθέμενοι ενώνουν επωνυμίες με παύλες για να δείχνουν επίσημοι· ο γνήσιος ιστότοπος θα χρησιμοποιούσε απλώς το όνομα τομέα της ίδιας της επωνυμίας.",
    url_reason_tld: "Το πραγματικό όνομα τομέα (domain) εδώ είναι το {domain}. Η κατάληξή του (.{tld}) χρησιμοποιείται σπάνια από καταξιωμένους οργανισμούς και είναι δημοφιλής στους επιτιθέμενους, επειδή η καταχώρισή της κοστίζει ελάχιστα.",
    url_reason_long: "Προσέξτε πόσο μεγάλη και μπερδεμένη είναι αυτή η διεύθυνση: μια σειρά από περιττές λέξεις, παύλες και τυχαίους χαρακτήρες γύρω από το {domain}. Οι γνήσιες σελίδες σύνδεσης βρίσκονται σε ένα σύντομο και απλό όνομα τομέα· όλη αυτή η φλυαρία υπάρχει μόνο για να διώξει το πραγματικό όνομα από το οπτικό σας πεδίο.",
    url_reason_generic: "Το τμήμα που καθορίζει πού βρίσκεστε πραγματικά είναι το {domain} — το κείμενο ακριβώς πριν από την πρώτη κάθετο. Οτιδήποτε άλλο στη διεύθυνση μπορεί να διαμορφωθεί έτσι ώστε να φαίνεται πειστικό.",
    step_password_title: "Αυτή η φόρμα ήθελε τον κωδικό πρόσβασής σας",
    step_password_body: "Απείχατε μόλις ένα βήμα από το να παραδώσετε τον κωδικό πρόσβασής σας σε έναν επιτιθέμενο. Οι νόμιμοι οργανισμοί δεν σας ζητούν ποτέ να επιβεβαιώσετε τον κωδικό σας μέσω συνδέσμου σε e-mail. Αν έχετε αμφιβολίες, ανοίξτε μόνοι σας τον ιστότοπο πληκτρολογώντας τη διεύθυνσή του.",
    step_cc_title: "Αυτή η φόρμα ζητούσε τα στοιχεία της κάρτας σας",
    step_cc_body: "Αν είχατε εισαγάγει εδώ τον αριθμό της κάρτας, την ημερομηνία λήξης και τον κωδικό ασφαλείας, θα είχαν πάει κατευθείαν σε εγκληματίες. Οι νόμιμες εταιρείες δεν συλλέγουν στοιχεία πληρωμής μέσω απροσδόκητων συνδέσμων.",
    step_download_title: "Αυτή η λήψη θα μπορούσε να ήταν κακόβουλο λογισμικό",
    step_download_body: "Αυτό το αρχείο θα μπορούσε να είχε εγκαταστήσει κακόβουλο λογισμικό στη συσκευή σας. Ελέγξτε την επέκταση του αρχείου πριν ανοίξετε οτιδήποτε — και κατεβάζετε προγράμματα μόνο από αξιόπιστες πηγές.",
    step_suspicious_link_title: "Αυτός ο σύνδεσμος δεν είναι αυτό που δείχνει",
    step_suspicious_link_body: "Το κείμενο του συνδέσμου γράφει {shown}, αλλά στην πραγματικότητα οδηγεί στο {actual}. Περάστε το ποντίκι πάνω από τους συνδέσμους για να δείτε τον πραγματικό προορισμό πριν κάνετε κλικ.",
    step_brand_title: "Αυτή η σελίδα παριστάνει την {brand}",
    step_brand_body: "Εμφανίζεται ως {brand}, αλλά η διεύθυνση ανήκει στο {domain}. Οι μεγάλες εταιρείες δεν φιλοξενούν τις σελίδες σύνδεσής τους σε άσχετα ονόματα τομέα: όταν το όνομα στη σελίδα δεν συμφωνεί με το όνομα στη γραμμή διευθύνσεων, αυτό είναι μία από τις πιο ξεκάθαρες ενδείξεις πλαστότητας.",
    step_urgency_title: "Η αίσθηση του επείγοντος είναι τακτική πίεσης",
    step_urgency_body: "«Δράστε τώρα», προθεσμίες, απειλές για αναστολή λογαριασμού — οι επιτιθέμενοι δημιουργούν πίεση για να δράσετε πριν σκεφτείτε. Οι νόμιμες εταιρείες σπάνια απαιτούν άμεση ενέργεια· επιβραδύνετε όταν ένα μήνυμα σάς πιέζει.",
    urgency_quote: "Αυτή η σελίδα σας πίεσε με τη φράση: «{quote}»",
    perm_mic_title: "Παραχωρήσατε το μικρόφωνό σας",
    perm_mic_body: "Αυτή η σελίδα μπορεί πλέον να ακούει μέσω του μικροφώνου σας, μέχρι να ανακαλέσετε την πρόσβαση. Ένας πραγματικός ιστότοπος σας εξηγεί γιατί χρειάζεται το μικρόφωνο — για μια κλήση ή μια ηχογράφηση που ξεκινήσατε εσείς οι ίδιοι.",
    perm_webcam_title: "Παραχωρήσατε την κάμερά σας",
    perm_webcam_body: "Αυτή η σελίδα μπορεί πλέον να βλέπει μέσω της κάμεράς σας, μέχρι να ανακαλέσετε την πρόσβαση. Επιτρέπετε την πρόσβαση στην κάμερα μόνο σε ιστότοπο που ανοίξατε μόνοι σας, όπου μια βιντεοκλήση είναι σαφώς αναμενόμενη.",
    perm_location_title: "Κοινοποιήσατε την τοποθεσία σας",
    perm_location_body: "Αυτή η σελίδα γνωρίζει πλέον πού βρίσκεστε. Οι νόμιμοι ιστότοποι ζητούν την τοποθεσία σας μόνο όταν είναι προφανώς απαραίτητη, όπως για την εύρεση ενός κοντινού καταστήματος — και λειτουργούν κανονικά ακόμη κι αν αρνηθείτε.",
    perm_notification_title: "Επιτρέψατε τις ειδοποιήσεις",
    perm_notification_body: "Αυτή η σελίδα μπορεί πλέον να στέλνει μηνύματα στην επιφάνεια εργασίας σας, ακόμη και αφού την κλείσετε. Οι επιτιθέμενοι χρησιμοποιούν τις ειδοποιήσεις για να εμφανίζουν ψεύτικες προειδοποιήσεις για ιούς και να σας παρασύρουν σε περαιτέρω απάτες.",
    perm_clipboard_title: "Παραχωρήσατε πρόσβαση στο πρόχειρό σας",
    perm_clipboard_body: "Το πρόχειρο συχνά περιέχει έναν κωδικό πρόσβασης, έναν αριθμό κάρτας ή μια διεύθυνση κρυπτονομισμάτων που μόλις αντιγράψατε. Μια σελίδα με πρόσβαση στο πρόχειρο μπορεί να διαβάσει το περιεχόμενό του — ή να αντικαταστήσει αθόρυβα αυτό που επικολλάτε.",
    perm_extension_title: "Εγκαταστήσατε μια επέκταση προγράμματος περιήγησης",
    perm_extension_body: "Οι επεκτάσεις μπορούν να διαβάζουν και να τροποποιούν κάθε σελίδα που επισκέπτεστε, συμπεριλαμβανομένων του e-mail και της τράπεζάς σας. Να τις εγκαθιστάτε μόνο από τα επίσημα καταστήματα και μόνο όταν γνωρίζετε ποιος τις εκδίδει.",
    lesson_login_title: "Το λουκέτο δεν σημαίνει ότι η σελίδα είναι ασφαλής",
    lesson_login_body: "Το εικονίδιο του λουκέτου ή το «https» σημαίνει μόνο ότι η σύνδεσή σας είναι κρυπτογραφημένη — όχι ότι ο ιστότοπος είναι γνήσιος. Και οι ιστότοποι phishing χρησιμοποιούν κρυπτογράφηση. Εμπιστευτείτε το όνομα τομέα (domain), όχι το λουκέτο.",
    lesson_fraud_title: "Πώς να προστατεύσετε τα χρήματά σας",
    lesson_fraud_body: "Μην εισάγετε ποτέ στοιχεία πληρωμής σε σελίδα στην οποία φτάσατε από e-mail ή μήνυμα. Επισκεφθείτε μόνοι σας τον επίσημο ιστότοπο ή την εφαρμογή της εταιρείας ή καλέστε τον αριθμό στο πίσω μέρος της κάρτας σας.",
    lesson_malware_title: "Επαληθεύστε πριν κατεβάσετε",
    lesson_malware_body: "Τα συνημμένα και οι λήψεις αποτελούν αγαπημένη μέθοδο των επιτιθέμενων για να περάσουν κακόβουλο λογισμικό στη συσκευή σας. Επιβεβαιώστε με τον αποστολέα μέσω άλλου καναλιού και να είστε καχύποπτοι με τύπους αρχείων όπως .exe, .zip ή έγγραφα που ζητούν να ενεργοποιήσετε μακροεντολές.",
    lesson_fake_title: "Αν φαίνεται πολύ καλό για να είναι αληθινό…",
    lesson_fake_body: "Οι ψεύτικες σελίδες μιμούνται αξιόπιστες επωνυμίες για να κερδίσουν το κλικ, τα δεδομένα ή την εμπιστοσύνη σας. Ελέγξτε τη διεύθυνση, ψάξτε για πρόχειρες λεπτομέρειες και, όταν κάτι σας φαίνεται περίεργο, κλείστε τη σελίδα και μεταβείτε μόνοι σας στον ιστότοπο.",
    lesson_permission_title: "Προσέχετε τι επιτρέπετε",
    lesson_permission_body: "Μόλις παραχωρήσατε σε αυτήν τη σελίδα πρόσβαση που δεν θα έπρεπε να έχει. Οι νόμιμοι ιστότοποι εξηγούν γιατί χρειάζονται την κάμερα, το μικρόφωνο ή την τοποθεσία σας πριν τα ζητήσουν. Παραχωρείτε μόνο δικαιώματα που κατανοείτε πλήρως — μπορείτε να τα ελέγξετε στις ρυθμίσεις του προγράμματος περιήγησης.",
    step_done_title: "Τι να ελέγχετε την επόμενη φορά",
    step_done_body: "Ελέγχετε τη διεύθυνση, αμφισβητείτε την αίσθηση του επείγοντος, προστατεύετε τους κωδικούς και τα στοιχεία της κάρτας σας και να σκέφτεστε πριν κατεβάσετε. Πατήστε «Συνέχεια» για να προχωρήσετε.",
};
exports["default"] = strings;


/***/ }),

/***/ "./src/i18n/locales/en-US.ts":
/*!***********************************!*\
  !*** ./src/i18n/locales/en-US.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const strings = {
    heading: "This was a phishing simulation",
    intro: "The good news: it wasn't a real attack. Take a minute to see the warning signs you missed — it could save you next time.",
    next: "Next",
    back: "Back",
    skip: "Skip tutorial",
    continue: "Continue",
    progress: "Step {n} of {total}",
    arrow_hint: "The web address is up here",
    step_url_title: "Always check the address first",
    step_url_body: "Look at the address bar at the top of your browser. This page's address doesn't belong to the real organization — attackers count on you not looking.",
    url_actual_label: "The address you were on",
    url_reason_ip: "This address is a raw IP address instead of a company name. Real organizations use their own domain, so a numeric address is a strong sign of a fake site.",
    url_reason_punycode: "This address uses special characters that imitate ordinary letters. Attackers use them so a fake domain looks identical to a real one at a glance.",
    url_reason_brand_subdomain: "Read the address from the right, not the left. The part that decides where you are is {domain}; everything before it is a subdomain, and whoever owns {domain} can create as many as they like, named anything they like.",
    url_reason_brand_in_subdomain: "The address really does contain {brand} — but only as a subdomain. Real sites use subdomains too, which is exactly why they prove nothing: whoever owns {domain} can put any name in front of it. What decides where you are is {domain}, the part immediately before the first slash.",
    url_reason_hyphen: "The real domain here is {domain}. Attackers glue brand names together with hyphens to look official; the genuine site would simply use the brand's own domain.",
    url_reason_tld: "The real domain here is {domain}. Its ending (.{tld}) is rarely used by established organizations and is popular with attackers because it's cheap to register.",
    url_reason_long: "Look at how long and cluttered this address is: a chain of extra words, dashes and random characters around {domain}. Genuine sign-in pages live on a short, plain domain — length and clutter are there to push the real name out of sight.",
    url_reason_generic: "The part that decides where you really are is {domain} — the text right before the first slash. Everything else in the address can be made to look convincing.",
    step_password_title: "This form wanted your password",
    step_password_body: "You were one step away from handing your password to an attacker. Real organizations never ask you to confirm your password through a link in an email. When in doubt, open the site yourself by typing its address.",
    step_cc_title: "This form asked for card details",
    step_cc_body: "Entering your card number, expiry date, and security code here would have sent them straight to criminals. Legitimate companies don't collect payment details through unexpected links.",
    step_download_title: "This download could have been malware",
    step_download_body: "This file could have installed malicious software on your device. Check the file extension before opening anything — and only download software from sources you trust.",
    step_suspicious_link_title: "This link isn't what it claims",
    step_suspicious_link_body: "The link's text says {shown}, but it actually leads to {actual}. Hover over links to preview the real destination before clicking.",
    step_brand_title: "This page pretends to be {brand}",
    step_brand_body: "It presents itself as {brand}, but the address belongs to {domain}. Big companies don't put their sign-in pages on unrelated domains — a name on the page that doesn't match the name in the address bar is one of the clearest signs of a fake.",
    step_urgency_title: "Urgency is a pressure tactic",
    step_urgency_body: "\"Act now\", deadlines, threats of suspended accounts — attackers create pressure so you act before you think. Real companies rarely demand immediate action; slow down when a message rushes you.",
    urgency_quote: "This page pressured you with: \"{quote}\"",
    perm_mic_title: "You gave away your microphone",
    perm_mic_body: "This page can now listen through your microphone until you revoke access. A real site tells you why it needs your mic — for a call or a recording you started yourself.",
    perm_webcam_title: "You gave away your camera",
    perm_webcam_body: "This page can now see through your camera until you revoke access. Only allow camera access on a site you opened yourself, where a video call is clearly expected.",
    perm_location_title: "You shared your location",
    perm_location_body: "This page now knows where you are. Legitimate sites ask for your location only when it's obviously needed, like finding a nearby store — and they still work if you decline.",
    perm_notification_title: "You allowed notifications",
    perm_notification_body: "This page can now push messages to your desktop, even after you close it. Attackers use them to deliver fake virus alerts and lure you into further scams.",
    perm_clipboard_title: "You gave access to your clipboard",
    perm_clipboard_body: "Your clipboard often holds a password, card number, or crypto address you just copied. A page with clipboard access can read it — or silently swap what you paste.",
    perm_extension_title: "You installed a browser extension",
    perm_extension_body: "Extensions can read and change every page you visit, including your email and your bank. Install them only from official stores, and only when you know who publishes them.",
    lesson_login_title: "The padlock doesn't mean it's safe",
    lesson_login_body: "A padlock icon or \"https\" only means your connection is encrypted — not that the site is genuine. Phishing sites use encryption too. Trust the domain name, not the padlock.",
    lesson_fraud_title: "How to protect your money",
    lesson_fraud_body: "Never enter payment details on a page you reached from an email or message. Go to the company's official website or app yourself, or call the number on the back of your card.",
    lesson_malware_title: "Verify before you download",
    lesson_malware_body: "Attachments and downloads are a favorite way to sneak malware onto your device. Confirm with the sender through another channel, and be suspicious of file types like .exe, .zip, or documents asking you to enable macros.",
    lesson_fake_title: "If it looks too good to be true…",
    lesson_fake_body: "Fake pages imitate trusted brands to get your click, your data, or your trust. Check the address, look for sloppy details, and when something feels off, close the page and navigate there yourself.",
    lesson_permission_title: "Be careful what you allow",
    lesson_permission_body: "You just granted this page access it shouldn't have. Legitimate sites explain why they need your camera, microphone, or location before asking. Only grant permissions you fully understand — you can review them in your browser settings.",
    step_done_title: "What to check next time",
    step_done_body: "Check the address, question urgency, guard your passwords and card details, and think before you download. Click Continue to move on.",
};
exports["default"] = strings;


/***/ }),

/***/ "./src/i18n/locales/es-419.ts":
/*!************************************!*\
  !*** ./src/i18n/locales/es-419.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const strings = {
    heading: "Esto era una simulación de phishing",
    intro: "La buena noticia: no era un ataque real. Tómate un minuto para ver las señales de alerta que pasaste por alto; la próxima vez podrían salvarte.",
    next: "Siguiente",
    back: "Atrás",
    skip: "Omitir el tutorial",
    continue: "Continuar",
    progress: "Paso {n} de {total}",
    arrow_hint: "La dirección web está aquí arriba",
    step_url_title: "Siempre revisa primero la dirección",
    step_url_body: "Fíjate en la barra de direcciones en la parte superior del navegador. La dirección de esta página no pertenece a la organización real: los atacantes cuentan con que no mires. Antes de escribir, hacer clic o descargar algo, lee con atención el nombre del dominio.",
    url_actual_label: "La dirección en la que estabas",
    url_reason_ip: "Esta dirección es una IP numérica en lugar del nombre de una empresa. Las organizaciones reales usan su propio dominio, así que una dirección en puros números es una señal clara de un sitio falso.",
    url_reason_punycode: "Esta dirección usa caracteres especiales que imitan letras comunes. Los atacantes los usan para que, a simple vista, un dominio falso se vea idéntico al real.",
    url_reason_brand_subdomain: "Lee la dirección desde la derecha, no desde la izquierda. La parte que decide dónde estás es {domain}; todo lo que va antes es un subdominio, y quien sea dueño de {domain} puede crear todos los que quiera, con el nombre que quiera.",
    url_reason_brand_in_subdomain: "La dirección sí contiene {brand}, pero solo como subdominio. Los sitios auténticos también usan subdominios, y por eso mismo no prueban nada: quien sea dueño de {domain} puede poner adelante el nombre que se le ocurra. Lo que decide dónde estás es {domain}, la parte justo antes de la primera barra.",
    url_reason_hyphen: "El dominio real aquí es {domain}. Los atacantes pegan nombres de marcas con guiones para verse oficiales; el sitio auténtico simplemente usaría el dominio propio de la marca.",
    url_reason_tld: "El dominio real aquí es {domain}. Su terminación (.{tld}) casi no la usan las organizaciones establecidas y es popular entre los atacantes porque registrarla cuesta muy poco.",
    url_reason_long: "Fíjate en lo larga y enredada que es esta dirección: un montón de palabras de más, guiones y caracteres sueltos alrededor de {domain}. Las páginas de inicio de sesión auténticas usan un dominio corto y simple; tanto relleno solo sirve para dejar el nombre real fuera de tu vista.",
    url_reason_generic: "La parte que decide dónde estás realmente es {domain}: el texto justo antes de la primera barra. Todo lo demás en la dirección se puede manipular para que se vea convincente.",
    step_password_title: "Este formulario quería tu contraseña",
    step_password_body: "Estabas a un paso de entregarle tu contraseña a un atacante. Las organizaciones reales nunca te piden confirmar tu contraseña a través de un enlace en un correo. Ante la duda, entra por tu cuenta al sitio escribiendo su dirección.",
    step_cc_title: "Este formulario pedía los datos de tu tarjeta",
    step_cc_body: "Si hubieras ingresado aquí el número de tu tarjeta, la fecha de vencimiento y el código de seguridad, habrían ido directo a los delincuentes. Las empresas legítimas no recopilan datos de pago a través de enlaces inesperados.",
    step_download_title: "Esta descarga podría haber sido malware",
    step_download_body: "Este archivo podría haber instalado software malicioso en tu dispositivo. Revisa la extensión del archivo antes de abrir algo y descarga programas solo de fuentes confiables.",
    step_suspicious_link_title: "Este enlace no es lo que dice ser",
    step_suspicious_link_body: "El texto del enlace dice {shown}, pero en realidad lleva a {actual}. Pasa el cursor sobre los enlaces para ver el destino real antes de hacer clic.",
    step_brand_title: "Esta página se hace pasar por {brand}",
    step_brand_body: "Se presenta como {brand}, pero la dirección pertenece a {domain}. Las grandes empresas no alojan sus páginas de inicio de sesión en dominios ajenos: que el nombre de la página no coincida con el de la barra de direcciones es una de las señales más claras de que es falsa.",
    step_urgency_title: "La urgencia es una táctica de presión",
    step_urgency_body: "\"Actúa ya\", fechas límite, amenazas de suspender tu cuenta… Los atacantes crean presión para que actúes antes de pensar. Las empresas reales rara vez exigen una acción inmediata; tómate tu tiempo cuando un mensaje te apure.",
    urgency_quote: "Esta página te presionó con: \"{quote}\"",
    perm_mic_title: "Cediste el acceso a tu micrófono",
    perm_mic_body: "Esta página ahora puede escuchar a través de tu micrófono hasta que le revoques el acceso. Un sitio real te dice para qué necesita el micrófono: una llamada o una grabación que iniciaste por tu cuenta.",
    perm_webcam_title: "Cediste el acceso a tu cámara",
    perm_webcam_body: "Esta página ahora puede ver a través de tu cámara hasta que le revoques el acceso. Permite el acceso a la cámara solo en un sitio que abriste por tu cuenta y donde claramente se espera una videollamada.",
    perm_location_title: "Compartiste tu ubicación",
    perm_location_body: "Esta página ahora sabe dónde estás. Los sitios legítimos piden tu ubicación solo cuando es evidente que la necesitan, como para encontrar una tienda cercana, y siguen funcionando si la rechazas.",
    perm_notification_title: "Permitiste las notificaciones",
    perm_notification_body: "Esta página ahora puede mostrarte mensajes en tu computadora, incluso después de que la cierres. Los atacantes los usan para enviar falsas alertas de virus y arrastrarte a más estafas.",
    perm_clipboard_title: "Diste acceso a tu portapapeles",
    perm_clipboard_body: "Tu portapapeles suele guardar una contraseña, un número de tarjeta o una dirección de criptomonedas que acabas de copiar. Una página con acceso al portapapeles puede leerlo o cambiar lo que pegas sin que lo notes.",
    perm_extension_title: "Instalaste una extensión del navegador",
    perm_extension_body: "Las extensiones pueden leer y modificar todas las páginas que visitas, incluidos tu correo y tu banco. Instálalas solo desde las tiendas oficiales y solo cuando sepas quién las publica.",
    lesson_login_title: "El candado no significa que sea seguro",
    lesson_login_body: "El ícono del candado o \"https\" solo significa que la conexión está cifrada, no que el sitio sea auténtico. Los sitios de phishing también usan cifrado. Confía en el nombre del dominio, no en el candado.",
    lesson_fraud_title: "Cómo proteger tu dinero",
    lesson_fraud_body: "Nunca ingreses datos de pago en una página a la que llegaste desde un correo o un mensaje. Entra por tu cuenta al sitio web o a la aplicación oficial de la empresa, o llama al número que está al reverso de tu tarjeta.",
    lesson_malware_title: "Verifica antes de descargar",
    lesson_malware_body: "Los adjuntos y las descargas son una vía favorita para meter malware en tu dispositivo. Confirma con el remitente por otro canal y desconfía de tipos de archivo como .exe, .zip o documentos que te pidan activar macros.",
    lesson_fake_title: "Si parece demasiado bueno para ser verdad…",
    lesson_fake_body: "Las páginas falsas imitan a marcas de confianza para conseguir tu clic, tus datos o tu confianza. Revisa la dirección, busca detalles descuidados y, cuando algo te parezca extraño, cierra la página y entra al sitio por tu cuenta.",
    lesson_permission_title: "Cuidado con lo que permites",
    lesson_permission_body: "Acabas de darle a esta página un acceso que no debería tener. Los sitios legítimos explican por qué necesitan tu cámara, micrófono o ubicación antes de pedirlos. Otorga solo permisos que entiendas por completo; puedes revisarlos en la configuración del navegador.",
    step_done_title: "Qué revisar la próxima vez",
    step_done_body: "Revisa la dirección, cuestiona la urgencia, protege tus contraseñas y los datos de tu tarjeta, y piensa antes de descargar. Haz clic en Continuar para seguir.",
};
exports["default"] = strings;


/***/ }),

/***/ "./src/i18n/locales/es-ES.ts":
/*!***********************************!*\
  !*** ./src/i18n/locales/es-ES.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const strings = {
    heading: "Esto ha sido una simulación de phishing",
    intro: "La buena noticia: no ha sido un ataque real. Dedica un minuto a repasar las señales de alerta que se te escaparon; la próxima vez pueden salvarte.",
    next: "Siguiente",
    back: "Atrás",
    skip: "Omitir tutorial",
    continue: "Continuar",
    progress: "Paso {n} de {total}",
    arrow_hint: "La dirección web está aquí arriba",
    step_url_title: "Comprueba siempre primero la dirección",
    step_url_body: "Fíjate en la barra de direcciones en la parte superior del navegador. La dirección de esta página no pertenece a la organización real: los atacantes cuentan con que no mires. Antes de escribir, hacer clic o descargar nada, lee con atención el nombre del dominio.",
    url_actual_label: "La dirección en la que estabas",
    url_reason_ip: "Esta dirección es directamente una IP en lugar del nombre de una empresa. Las organizaciones reales usan su propio dominio, así que una dirección numérica es un indicio claro de sitio falso.",
    url_reason_punycode: "Esta dirección usa caracteres especiales que imitan letras normales. Los atacantes los emplean para que, a simple vista, un dominio falso parezca idéntico al real.",
    url_reason_brand_subdomain: "Lee la dirección de derecha a izquierda. La parte que decide dónde estás es {domain}; todo lo que va delante es un subdominio, y quien controle {domain} puede crear tantos como quiera y con el nombre que quiera.",
    url_reason_brand_in_subdomain: "La dirección sí contiene {brand}, pero solo como subdominio. Los sitios auténticos también usan subdominios, y justo por eso no demuestran nada: quien controle {domain} puede poner delante el nombre que le apetezca. Lo que decide dónde estás es {domain}, la parte justo antes de la primera barra.",
    url_reason_hyphen: "El dominio real aquí es {domain}. Los atacantes encadenan nombres de marca con guiones para dar sensación de oficialidad; el sitio auténtico usaría sin más el dominio propio de la marca.",
    url_reason_tld: "El dominio real aquí es {domain}. Su terminación (.{tld}) apenas la usan las organizaciones consolidadas y es muy popular entre los atacantes porque resulta baratísima de registrar.",
    url_reason_long: "Fíjate en lo larga y enrevesada que es esta dirección: una ristra de palabras de más, guiones y caracteres sueltos alrededor de {domain}. Las páginas de acceso auténticas están en un dominio corto y sencillo; tanta longitud solo sirve para dejar el nombre real fuera de tu vista.",
    url_reason_generic: "La parte que decide dónde estás de verdad es {domain}, el texto justo antes de la primera barra. Todo lo demás de la dirección puede maquillarse para resultar convincente.",
    step_password_title: "Este formulario quería tu contraseña",
    step_password_body: "Estabas a un paso de entregar tu contraseña a un atacante. Las organizaciones reales nunca te piden confirmar tu contraseña a través de un enlace en un correo. Ante la duda, entra en el sitio escribiendo tú la dirección.",
    step_cc_title: "Este formulario pedía los datos de tu tarjeta",
    step_cc_body: "Si hubieras introducido aquí el número de tu tarjeta, la fecha de caducidad y el código de seguridad, habrían ido directos a los delincuentes. Las empresas legítimas no recogen datos de pago a través de enlaces inesperados.",
    step_download_title: "Esta descarga podría haber sido malware",
    step_download_body: "Este archivo podría haber instalado software malicioso en tu dispositivo. Comprueba la extensión del archivo antes de abrir nada y descarga programas solo de fuentes de confianza.",
    step_suspicious_link_title: "Este enlace no es lo que dice ser",
    step_suspicious_link_body: "El texto del enlace dice {shown}, pero en realidad lleva a {actual}. Pasa el cursor sobre los enlaces para ver el destino real antes de hacer clic.",
    step_brand_title: "Esta página se hace pasar por {brand}",
    step_brand_body: "Se presenta como {brand}, pero la dirección pertenece a {domain}. Las grandes empresas no alojan sus páginas de acceso en dominios ajenos: que el nombre de la página no coincida con el de la barra de direcciones es una de las señales más claras de que es falsa.",
    step_urgency_title: "La urgencia es una táctica de presión",
    step_urgency_body: "«Actúa ya», plazos límite, amenazas de suspender tu cuenta… Los atacantes crean presión para que actúes antes de pensar. Las empresas reales rara vez exigen una acción inmediata; tómate tu tiempo cuando un mensaje te meta prisa.",
    urgency_quote: "Esta página te ha presionado con: «{quote}»",
    perm_mic_title: "Has cedido tu micrófono",
    perm_mic_body: "Esta página puede escuchar a través de tu micrófono hasta que le retires el acceso. Un sitio de verdad te explica para qué necesita el micro: una llamada o una grabación que has iniciado tú.",
    perm_webcam_title: "Has cedido tu cámara",
    perm_webcam_body: "Esta página puede ver a través de tu cámara hasta que le retires el acceso. Permite el acceso a la cámara solo en sitios que hayas abierto por tu cuenta y donde una videollamada sea claramente lo esperado.",
    perm_location_title: "Has compartido tu ubicación",
    perm_location_body: "Esta página ya sabe dónde estás. Los sitios legítimos solo piden tu ubicación cuando es evidente que hace falta, por ejemplo para encontrar una tienda cercana, y siguen funcionando si la rechazas.",
    perm_notification_title: "Has permitido las notificaciones",
    perm_notification_body: "Esta página ya puede enviarte mensajes al escritorio, incluso después de cerrarla. Los atacantes aprovechan estas notificaciones para colarte falsas alertas de virus y arrastrarte a nuevas estafas.",
    perm_clipboard_title: "Has dado acceso a tu portapapeles",
    perm_clipboard_body: "En el portapapeles suele haber una contraseña, un número de tarjeta o una dirección de criptomonedas que acabas de copiar. Una página con acceso al portapapeles puede leerlo, o cambiar sin que te des cuenta lo que pegas.",
    perm_extension_title: "Has instalado una extensión del navegador",
    perm_extension_body: "Las extensiones pueden leer y modificar todas las páginas que visitas, incluidos tu correo y tu banco. Instálalas solo desde las tiendas oficiales y solo cuando sepas quién las publica.",
    lesson_login_title: "El candado no significa que sea seguro",
    lesson_login_body: "El icono del candado o «https» solo significa que la conexión está cifrada, no que el sitio sea auténtico. Los sitios de phishing también usan cifrado. Confía en el nombre del dominio, no en el candado.",
    lesson_fraud_title: "Cómo proteger tu dinero",
    lesson_fraud_body: "Nunca introduzcas datos de pago en una página a la que hayas llegado desde un correo o un mensaje. Entra por tu cuenta en la web o la aplicación oficial de la empresa, o llama al número que figura en el reverso de tu tarjeta.",
    lesson_malware_title: "Verifica antes de descargar",
    lesson_malware_body: "Los adjuntos y las descargas son una de las vías favoritas para colar malware en tu dispositivo. Confirma con el remitente por otro canal y desconfía de archivos como .exe, .zip o documentos que te pidan activar macros.",
    lesson_fake_title: "Si parece demasiado bueno para ser verdad…",
    lesson_fake_body: "Las páginas falsas imitan a marcas de confianza para conseguir tu clic, tus datos o tu confianza. Comprueba la dirección, busca detalles descuidados y, cuando algo no te cuadre, cierra la página y entra al sitio por tu cuenta.",
    lesson_permission_title: "Cuidado con lo que permites",
    lesson_permission_body: "Acabas de conceder a esta página un acceso que no debería tener. Los sitios legítimos explican por qué necesitan tu cámara, micrófono o ubicación antes de pedirlos. Concede solo permisos que entiendas del todo; puedes revisarlos en los ajustes del navegador.",
    step_done_title: "Qué comprobar la próxima vez",
    step_done_body: "Comprueba la dirección, cuestiona la urgencia, protege tus contraseñas y los datos de tu tarjeta, y piensa antes de descargar. Pulsa «Continuar» para seguir.",
};
exports["default"] = strings;


/***/ }),

/***/ "./src/i18n/locales/fr-FR.ts":
/*!***********************************!*\
  !*** ./src/i18n/locales/fr-FR.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const strings = {
    heading: "Il s'agissait d'une simulation de phishing",
    intro: "Bonne nouvelle : ce n'était pas une vraie attaque. Prenez une minute pour repérer les signaux d'alerte qui vous ont échappé — la prochaine fois, cela pourrait vous éviter bien des ennuis.",
    next: "Suivant",
    back: "Retour",
    skip: "Passer le tutoriel",
    continue: "Continuer",
    progress: "Étape {n} sur {total}",
    arrow_hint: "L'adresse web se trouve ici, en haut",
    step_url_title: "Vérifiez toujours l'adresse en premier",
    step_url_body: "Regardez la barre d'adresse en haut de votre navigateur. L'adresse de cette page n'est pas celle de la véritable organisation — les attaquants comptent sur votre inattention. Avant de saisir, cliquer ou télécharger quoi que ce soit, lisez attentivement le nom de domaine.",
    url_actual_label: "L'adresse sur laquelle vous vous trouviez",
    url_reason_ip: "Cette adresse est une adresse IP brute, sans aucun nom d'entreprise. Les véritables organisations utilisent leur propre nom de domaine ; une adresse composée de chiffres est donc un signe fort de site frauduleux.",
    url_reason_punycode: "Cette adresse utilise des caractères spéciaux qui imitent des lettres ordinaires. Les attaquants s'en servent pour qu'un faux nom de domaine paraisse identique au vrai au premier coup d'œil.",
    url_reason_brand_subdomain: "Lisez l'adresse en partant de la droite, pas de la gauche. La partie qui détermine où vous êtes est {domain} ; tout ce qui la précède est un sous-domaine, et celui qui possède {domain} peut en créer autant qu'il veut, sous n'importe quel nom.",
    url_reason_brand_in_subdomain: "L'adresse contient bien {brand}, mais uniquement en sous-domaine. Les vrais sites en utilisent aussi, et c'est précisément pour cela qu'ils ne prouvent rien : celui qui possède {domain} peut placer devant le nom qu'il souhaite. Ce qui détermine où vous êtes, c'est {domain}, la partie juste avant la première barre oblique.",
    url_reason_hyphen: "Le véritable nom de domaine est ici {domain}. Les attaquants assemblent des noms de marque avec des traits d'union pour paraître officiels ; le site authentique utiliserait tout simplement le domaine de la marque.",
    url_reason_tld: "Le véritable nom de domaine est ici {domain}. Sa terminaison (.{tld}) est rarement utilisée par les organisations établies et très prisée des attaquants, car son enregistrement ne coûte presque rien.",
    url_reason_long: "Regardez la longueur et le fouillis de cette adresse : une succession de mots en trop, de tirets et de caractères aléatoires autour de {domain}. Les vraies pages de connexion tiennent sur un nom de domaine court et simple ; tout cet encombrement ne sert qu'à repousser le nom réel hors de votre champ de vision.",
    url_reason_generic: "La partie qui détermine où vous vous trouvez réellement est {domain} — le texte situé juste avant la première barre oblique. Tout le reste de l'adresse peut être façonné pour paraître crédible.",
    step_password_title: "Ce formulaire voulait votre mot de passe",
    step_password_body: "Vous étiez à deux doigts de livrer votre mot de passe à un attaquant. Les véritables organisations ne vous demandent jamais de confirmer votre mot de passe via un lien reçu par e-mail. En cas de doute, ouvrez le site vous-même en saisissant son adresse.",
    step_cc_title: "Ce formulaire demandait vos données bancaires",
    step_cc_body: "Si vous aviez saisi ici votre numéro de carte, sa date d'expiration et son cryptogramme, ces informations seraient allées directement entre les mains de criminels. Les entreprises légitimes ne collectent pas de données de paiement via des liens inattendus.",
    step_download_title: "Ce téléchargement aurait pu être un logiciel malveillant",
    step_download_body: "Ce fichier aurait pu installer un logiciel malveillant sur votre appareil. Vérifiez l'extension du fichier avant d'ouvrir quoi que ce soit — et ne téléchargez des programmes que depuis des sources de confiance.",
    step_suspicious_link_title: "Ce lien n'est pas ce qu'il prétend être",
    step_suspicious_link_body: "Le texte du lien indique {shown}, mais il mène en réalité vers {actual}. Survolez les liens avec la souris pour afficher leur véritable destination avant de cliquer.",
    step_brand_title: "Cette page se fait passer pour {brand}",
    step_brand_body: "Elle se présente comme {brand}, mais l'adresse appartient à {domain}. Les grandes entreprises n'hébergent pas leurs pages de connexion sur des domaines sans rapport : un nom affiché sur la page qui ne correspond pas à celui de la barre d'adresse est l'un des signes les plus clairs d'une contrefaçon.",
    step_urgency_title: "L'urgence est une tactique de pression",
    step_urgency_body: "« Agissez maintenant », échéances imminentes, menaces de suspension de compte… Les attaquants créent un sentiment d'urgence pour que vous agissiez avant de réfléchir. Les vraies entreprises exigent rarement une action immédiate ; prenez le temps de la réflexion quand un message vous presse.",
    urgency_quote: "Cette page a fait pression sur vous avec ce message : « {quote} »",
    perm_mic_title: "Vous avez donné accès à votre microphone",
    perm_mic_body: "Cette page peut désormais vous écouter via votre microphone tant que vous ne révoquez pas l'autorisation. Un site sérieux vous explique pourquoi il a besoin de votre microphone — pour un appel ou un enregistrement que vous avez lancé vous-même.",
    perm_webcam_title: "Vous avez donné accès à votre caméra",
    perm_webcam_body: "Cette page peut désormais vous voir via votre caméra tant que vous ne révoquez pas l'autorisation. N'autorisez l'accès à la caméra que sur un site que vous avez ouvert vous-même, où un appel vidéo est clairement attendu.",
    perm_location_title: "Vous avez partagé votre position",
    perm_location_body: "Cette page sait désormais où vous vous trouvez. Les sites légitimes ne demandent votre position que lorsque c'est manifestement nécessaire, par exemple pour trouver un magasin à proximité — et ils fonctionnent même si vous refusez.",
    perm_notification_title: "Vous avez autorisé les notifications",
    perm_notification_body: "Cette page peut désormais afficher des messages sur votre bureau, même une fois fermée. Les attaquants s'en servent pour diffuser de fausses alertes virus et vous attirer dans d'autres arnaques.",
    perm_clipboard_title: "Vous avez donné accès à votre presse-papiers",
    perm_clipboard_body: "Votre presse-papiers contient souvent un mot de passe, un numéro de carte ou une adresse de cryptomonnaie que vous venez de copier. Une page ayant accès au presse-papiers peut le lire — ou remplacer discrètement ce que vous collez.",
    perm_extension_title: "Vous avez installé une extension de navigateur",
    perm_extension_body: "Les extensions peuvent lire et modifier toutes les pages que vous visitez, y compris votre messagerie et votre banque. N'installez d'extensions que depuis les boutiques officielles, et uniquement lorsque vous savez qui les publie.",
    lesson_login_title: "Le cadenas ne veut pas dire que c'est sûr",
    lesson_login_body: "L'icône de cadenas ou la mention « https » signifie seulement que votre connexion est chiffrée — pas que le site est authentique. Les sites de phishing utilisent eux aussi le chiffrement. Fiez-vous au nom de domaine, pas au cadenas.",
    lesson_fraud_title: "Comment protéger votre argent",
    lesson_fraud_body: "Ne saisissez jamais de données de paiement sur une page ouverte depuis un e-mail ou un message. Ouvrez vous-même le site officiel de l'entreprise ou son application officielle, ou appelez le numéro au dos de votre carte.",
    lesson_malware_title: "Vérifiez avant de télécharger",
    lesson_malware_body: "Les pièces jointes et les téléchargements sont un moyen privilégié d'introduire un logiciel malveillant sur votre appareil. Confirmez auprès de l'expéditeur par un autre canal et méfiez-vous des types de fichiers comme .exe ou .zip, et des documents qui vous demandent d'activer les macros.",
    lesson_fake_title: "Si c'est trop beau pour être vrai…",
    lesson_fake_body: "Les fausses pages imitent des marques de confiance pour obtenir votre clic, vos données ou votre confiance. Vérifiez l'adresse, repérez les détails négligés et, si quelque chose vous semble anormal, fermez la page et rendez-vous sur le site par vous-même.",
    lesson_permission_title: "Attention à ce que vous autorisez",
    lesson_permission_body: "Vous venez d'accorder à cette page un accès qu'elle ne devrait pas avoir. Les sites légitimes expliquent pourquoi ils ont besoin de votre caméra, de votre microphone ou de votre position avant de les demander. N'accordez que les autorisations que vous comprenez parfaitement — vous pouvez les vérifier dans les paramètres de votre navigateur.",
    step_done_title: "À vérifier la prochaine fois",
    step_done_body: "Vérifiez l'adresse, méfiez-vous de l'urgence, protégez vos mots de passe et vos données bancaires, et réfléchissez avant de télécharger. Cliquez sur « Continuer » pour passer à la suite.",
};
exports["default"] = strings;


/***/ }),

/***/ "./src/i18n/locales/pt-BR.ts":
/*!***********************************!*\
  !*** ./src/i18n/locales/pt-BR.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const strings = {
    heading: "Isso foi uma simulação de phishing",
    intro: "A boa notícia: não era um ataque de verdade. Reserve um minuto para ver os sinais de alerta que você deixou passar — na próxima vez, isso pode salvar você.",
    next: "Avançar",
    back: "Voltar",
    skip: "Pular tutorial",
    continue: "Continuar",
    progress: "Etapa {n} de {total}",
    arrow_hint: "O endereço do site está aqui em cima",
    step_url_title: "Sempre confira o endereço primeiro",
    step_url_body: "Observe a barra de endereços no topo do navegador. O endereço desta página não pertence à organização real — os golpistas contam com a sua desatenção. Antes de digitar, clicar ou baixar qualquer coisa, leia o nome do domínio com atenção.",
    url_actual_label: "O endereço em que você estava",
    url_reason_ip: "Este endereço é um IP numérico em vez do nome de uma empresa. Organizações de verdade usam o próprio domínio, então um endereço formado só por números é um forte indício de site falso.",
    url_reason_punycode: "Este endereço usa caracteres especiais que imitam letras comuns. Os golpistas recorrem a eles para que um domínio falso pareça idêntico ao verdadeiro à primeira vista.",
    url_reason_brand_subdomain: "Leia o endereço da direita para a esquerda. A parte que define onde você está é {domain}; tudo o que vem antes é um subdomínio, e quem for dono de {domain} pode criar quantos quiser, com o nome que quiser.",
    url_reason_brand_in_subdomain: "O endereço realmente contém {brand} — mas só como subdomínio. Sites de verdade também usam subdomínios, e é justamente por isso que eles não provam nada: quem for dono de {domain} pode colocar qualquer nome na frente. O que define onde você está é {domain}, a parte logo antes da primeira barra.",
    url_reason_hyphen: "O domínio de verdade aqui é {domain}. Os golpistas emendam nomes de marcas com hífens para parecer oficial; o site verdadeiro simplesmente usaria o domínio da própria marca.",
    url_reason_tld: "O domínio de verdade aqui é {domain}. A terminação (.{tld}) raramente é usada por organizações estabelecidas e é popular entre golpistas porque custa pouco para registrar.",
    url_reason_long: "Repare em como este endereço é longo e embolado: uma sequência de palavras a mais, hífens e caracteres soltos em volta de {domain}. Páginas de login de verdade ficam em um domínio curto e simples; todo esse excesso serve só para empurrar o nome real para fora do seu campo de visão.",
    url_reason_generic: "A parte que define onde você realmente está é {domain} — o texto logo antes da primeira barra. Todo o resto do endereço pode ser montado para parecer convincente.",
    step_password_title: "Este formulário queria a sua senha",
    step_password_body: "Você estava a um passo de entregar a sua senha a um golpista. Organizações de verdade nunca pedem para confirmar a senha por um link recebido por e-mail. Na dúvida, acesse o site por conta própria digitando o endereço.",
    step_cc_title: "Este formulário pedia os dados do seu cartão",
    step_cc_body: "Se você tivesse digitado aqui o número do cartão, a validade e o código de segurança, eles iriam parar direto nas mãos de criminosos. Empresas legítimas não coletam dados de pagamento por links inesperados.",
    step_download_title: "Este download poderia ter sido um malware",
    step_download_body: "Este arquivo poderia ter instalado um software malicioso no seu dispositivo. Confira a extensão do arquivo antes de abrir qualquer coisa — e baixe programas apenas de fontes confiáveis.",
    step_suspicious_link_title: "Este link não é o que parece",
    step_suspicious_link_body: "O texto do link diz {shown}, mas na verdade ele leva para {actual}. Passe o mouse sobre os links para ver o destino real antes de clicar.",
    step_brand_title: "Esta página se passa por {brand}",
    step_brand_body: "Ela se apresenta como {brand}, mas o endereço pertence a {domain}. Empresas grandes não colocam as páginas de login delas em domínios sem relação nenhuma: quando o nome na página não bate com o nome na barra de endereços, esse é um dos sinais mais claros de falsificação.",
    step_urgency_title: "Urgência é uma tática de pressão",
    step_urgency_body: "\"Aja agora\", prazos, ameaças de suspensão da conta — os golpistas criam pressão para você agir antes de pensar. Empresas de verdade raramente exigem ação imediata; vá com calma quando uma mensagem tentar apressar você.",
    urgency_quote: "Esta página pressionou você com: \"{quote}\"",
    perm_mic_title: "Você entregou o seu microfone",
    perm_mic_body: "Esta página agora pode ouvir pelo seu microfone até você revogar o acesso. Um site de verdade deixa claro por que precisa do microfone — para uma chamada ou uma gravação que você mesmo iniciou.",
    perm_webcam_title: "Você entregou a sua câmera",
    perm_webcam_body: "Esta página agora pode enxergar pela sua câmera até você revogar o acesso. Só permita o acesso à câmera em um site que você mesmo abriu, onde uma chamada de vídeo é claramente esperada.",
    perm_location_title: "Você compartilhou a sua localização",
    perm_location_body: "Esta página agora sabe onde você está. Sites legítimos só pedem a sua localização quando ela é claramente necessária, como para encontrar uma loja próxima — e continuam funcionando se você recusar.",
    perm_notification_title: "Você permitiu notificações",
    perm_notification_body: "Esta página agora pode enviar mensagens direto para a sua tela, mesmo depois que você a fechar. Os golpistas usam isso para exibir alertas falsos de vírus e atrair você para novos golpes.",
    perm_clipboard_title: "Você deu acesso à sua área de transferência",
    perm_clipboard_body: "A sua área de transferência muitas vezes guarda uma senha, um número de cartão ou um endereço de criptomoeda que você acabou de copiar. Uma página com esse acesso pode ler tudo isso — ou trocar discretamente o que você cola.",
    perm_extension_title: "Você instalou uma extensão do navegador",
    perm_extension_body: "Extensões podem ler e alterar todas as páginas que você visita, incluindo o seu e-mail e o seu banco. Instale extensões apenas das lojas oficiais e somente quando souber quem as publica.",
    lesson_login_title: "O cadeado não significa que é seguro",
    lesson_login_body: "O ícone de cadeado ou o \"https\" só significa que a conexão é criptografada — não que o site seja verdadeiro. Sites de phishing também usam criptografia. Confie no nome do domínio, não no cadeado.",
    lesson_fraud_title: "Como proteger o seu dinheiro",
    lesson_fraud_body: "Nunca informe dados de pagamento em uma página que você abriu a partir de um e-mail ou mensagem. Acesse por conta própria o site ou o aplicativo oficial da empresa, ou ligue para o número no verso do seu cartão.",
    lesson_malware_title: "Verifique antes de baixar",
    lesson_malware_body: "Anexos e downloads são uma das formas preferidas de instalar malware no seu dispositivo. Confirme com o remetente por outro canal e desconfie de tipos de arquivo como .exe, .zip ou documentos que peçam para ativar macros.",
    lesson_fake_title: "Se parece bom demais para ser verdade…",
    lesson_fake_body: "Páginas falsas imitam marcas confiáveis para conseguir o seu clique, os seus dados ou a sua confiança. Confira o endereço, preste atenção a detalhes descuidados e, quando algo parecer estranho, feche a página e acesse o site por conta própria.",
    lesson_permission_title: "Cuidado com o que você permite",
    lesson_permission_body: "Você acabou de conceder a esta página um acesso que ela não deveria ter. Sites legítimos explicam por que precisam da câmera, do microfone ou da localização antes de pedir. Conceda apenas permissões que você entenda totalmente — você pode revisá-las nas configurações do navegador.",
    step_done_title: "O que conferir da próxima vez",
    step_done_body: "Confira o endereço, questione a urgência, proteja as suas senhas e os dados do cartão e pense antes de baixar. Clique em Continuar para seguir em frente.",
};
exports["default"] = strings;


/***/ }),

/***/ "./src/i18n/locales/pt-PT.ts":
/*!***********************************!*\
  !*** ./src/i18n/locales/pt-PT.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const strings = {
    heading: "Isto foi uma simulação de phishing",
    intro: "A boa notícia: não foi um ataque real. Dedique um minuto a ver os sinais de alerta que lhe escaparam — para a próxima, podem fazer toda a diferença.",
    next: "Seguinte",
    back: "Anterior",
    skip: "Ignorar tutorial",
    continue: "Continuar",
    progress: "Passo {n} de {total}",
    arrow_hint: "O endereço do site está aqui em cima",
    step_url_title: "Verifique sempre primeiro o endereço",
    step_url_body: "Repare na barra de endereço no topo do navegador. O endereço desta página não pertence à organização verdadeira — os atacantes contam com a sua falta de atenção. Antes de escrever, clicar ou transferir o que quer que seja, leia o nome do domínio com atenção.",
    url_actual_label: "O endereço em que se encontrava",
    url_reason_ip: "Este endereço é um endereço IP numérico em vez do nome de uma empresa. As organizações verdadeiras usam o seu próprio domínio, pelo que um endereço numérico é um forte indício de um site falso.",
    url_reason_punycode: "Este endereço usa caracteres especiais que imitam letras comuns. Os atacantes recorrem a eles para que um domínio falso pareça, à primeira vista, idêntico ao verdadeiro.",
    url_reason_brand_subdomain: "Leia o endereço a partir da direita, não da esquerda. A parte que determina onde está é {domain}; tudo o que vem antes é um subdomínio, e quem for dono de {domain} pode criar tantos quantos quiser, com o nome que quiser.",
    url_reason_brand_in_subdomain: "O endereço contém mesmo {brand} — mas apenas como subdomínio. Os sites verdadeiros também usam subdomínios e é precisamente por isso que estes nada provam: quem for dono de {domain} pode colocar à frente o nome que entender. O que determina onde está é {domain}, a parte imediatamente antes da primeira barra.",
    url_reason_hyphen: "O domínio verdadeiro aqui é {domain}. Os atacantes juntam nomes de marcas com hífenes para parecerem oficiais; o site genuíno usaria simplesmente o domínio da própria marca.",
    url_reason_tld: "O domínio verdadeiro aqui é {domain}. A sua terminação (.{tld}) raramente é usada por organizações estabelecidas e é popular entre os atacantes por ser barata de registar.",
    url_reason_long: "Repare em como este endereço é longo e confuso: uma sucessão de palavras a mais, hífenes e caracteres soltos à volta de {domain}. As páginas de autenticação verdadeiras estão num domínio curto e simples; todo este excesso serve apenas para afastar o nome real do seu campo de visão.",
    url_reason_generic: "A parte que determina onde realmente está é {domain} — o texto imediatamente antes da primeira barra. Todo o resto do endereço pode ser fabricado para parecer convincente.",
    step_password_title: "Este formulário queria a sua palavra-passe",
    step_password_body: "Esteve a um passo de entregar a sua palavra-passe a um atacante. As organizações verdadeiras nunca lhe pedem para confirmar a palavra-passe através de uma hiperligação num e-mail. Em caso de dúvida, aceda diretamente ao site, escrevendo o endereço.",
    step_cc_title: "Este formulário pedia os dados do seu cartão",
    step_cc_body: "Se tivesse introduzido aqui o número do cartão, a validade e o código de segurança, teriam ido parar diretamente às mãos de criminosos. As empresas legítimas não recolhem dados de pagamento através de hiperligações inesperadas.",
    step_download_title: "Esta transferência podia ter sido malware",
    step_download_body: "Este ficheiro podia ter instalado software malicioso no seu dispositivo. Verifique a extensão do ficheiro antes de abrir o que quer que seja — e transfira programas apenas de fontes fidedignas.",
    step_suspicious_link_title: "Esta hiperligação não é o que aparenta",
    step_suspicious_link_body: "O texto da hiperligação diz {shown}, mas na realidade leva a {actual}. Passe o cursor sobre as hiperligações para pré-visualizar o destino real antes de clicar.",
    step_brand_title: "Esta página faz-se passar por {brand}",
    step_brand_body: "Apresenta-se como {brand}, mas o endereço pertence a {domain}. As grandes empresas não alojam as páginas de autenticação em domínios sem qualquer relação: quando o nome na página não corresponde ao nome na barra de endereço, esse é um dos sinais mais claros de falsificação.",
    step_urgency_title: "A urgência é uma tática de pressão",
    step_urgency_body: "«Aja já», prazos, ameaças de suspensão da conta — os atacantes criam pressão para que aja antes de pensar. As empresas verdadeiras raramente exigem uma ação imediata; abrande sempre que uma mensagem lhe transmitir urgência.",
    urgency_quote: "Esta página exerceu pressão sobre si com: «{quote}»",
    perm_mic_title: "Deu acesso ao seu microfone",
    perm_mic_body: "Esta página pode agora ouvir através do seu microfone até que revogue o acesso. Um site verdadeiro explica porque precisa do microfone — para uma chamada ou uma gravação iniciada por si.",
    perm_webcam_title: "Deu acesso à sua câmara",
    perm_webcam_body: "Esta página pode agora ver através da sua câmara até que revogue o acesso. Permita o acesso à câmara apenas em sites que abriu por iniciativa própria, onde uma videochamada seja claramente esperada.",
    perm_location_title: "Partilhou a sua localização",
    perm_location_body: "Esta página sabe agora onde está. Os sites legítimos só pedem a localização quando é claramente necessária, como para encontrar uma loja próxima — e continuam a funcionar se recusar.",
    perm_notification_title: "Permitiu notificações",
    perm_notification_body: "Esta página pode agora enviar mensagens para o seu ambiente de trabalho, mesmo depois de a fechar. Os atacantes usam-nas para apresentar falsos alertas de vírus e servir de isco para novas burlas.",
    perm_clipboard_title: "Deu acesso à sua área de transferência",
    perm_clipboard_body: "A área de transferência guarda muitas vezes uma palavra-passe, um número de cartão ou um endereço de criptomoeda que acabou de copiar. Uma página com este acesso pode lê-la — ou trocar discretamente o que cola.",
    perm_extension_title: "Instalou uma extensão do navegador",
    perm_extension_body: "As extensões podem ler e alterar todas as páginas que visita, incluindo o seu e-mail e o seu banco. Instale-as apenas a partir de lojas oficiais e só quando souber quem as publica.",
    lesson_login_title: "O cadeado não significa que é seguro",
    lesson_login_body: "Um ícone de cadeado ou o «https» significa apenas que a ligação é encriptada — não que o site seja genuíno. Os sites de phishing também usam encriptação. Confie no nome do domínio, não no cadeado.",
    lesson_fraud_title: "Como proteger o seu dinheiro",
    lesson_fraud_body: "Nunca introduza dados de pagamento numa página a que chegou a partir de um e-mail ou mensagem. Aceda ao site ou à aplicação oficial da empresa, ou ligue para o número no verso do seu cartão.",
    lesson_malware_title: "Verifique antes de transferir",
    lesson_malware_body: "Os anexos e as transferências são uma via preferida para introduzir malware no seu dispositivo. Confirme com o remetente por outro canal e desconfie de tipos de ficheiro como .exe ou .zip, ou de documentos que peçam para ativar macros.",
    lesson_fake_title: "Se parece demasiado bom para ser verdade…",
    lesson_fake_body: "As páginas falsas imitam marcas de confiança para obter o seu clique, os seus dados ou a sua confiança. Verifique o endereço, procure pormenores descuidados e, quando algo lhe parecer estranho, feche a página e aceda diretamente ao site.",
    lesson_permission_title: "Cuidado com o que permite",
    lesson_permission_body: "Acabou de conceder a esta página um acesso que ela não devia ter. Os sites legítimos explicam porque precisam da câmara, do microfone ou da localização antes de os pedirem. Conceda apenas permissões que compreenda totalmente — pode revê-las nas definições do navegador.",
    step_done_title: "O que verificar da próxima vez",
    step_done_body: "Verifique o endereço, questione a urgência, proteja as suas palavras-passe e os dados do cartão e pense antes de transferir. Clique em Continuar para prosseguir.",
};
exports["default"] = strings;


/***/ }),

/***/ "./src/i18n/locales/ro-RO.ts":
/*!***********************************!*\
  !*** ./src/i18n/locales/ro-RO.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const strings = {
    heading: "Aceasta a fost o simulare de phishing",
    intro: "Vestea bună: nu a fost un atac real. Ia-ți un minut ca să vezi semnele de avertizare pe care le-ai ratat — data viitoare te-ar putea salva.",
    next: "Înainte",
    back: "Înapoi",
    skip: "Sari peste tutorial",
    continue: "Continuă",
    progress: "Pasul {n} din {total}",
    arrow_hint: "Adresa web este aici sus",
    step_url_title: "Verifică întotdeauna mai întâi adresa",
    step_url_body: "Uită-te la bara de adrese din partea de sus a browserului. Adresa acestei pagini nu aparține organizației reale — atacatorii se bazează pe faptul că nu te uiți. Înainte să tastezi, să dai clic sau să descarci ceva, citește cu atenție numele domeniului.",
    url_actual_label: "Adresa pe care te aflai",
    url_reason_ip: "Această adresă este o adresă IP, adică un șir de cifre, nu numele unei companii. Organizațiile reale folosesc propriul domeniu, așa că o adresă numerică e un semn clar de site fals.",
    url_reason_punycode: "Această adresă folosește caractere speciale care imită literele obișnuite. Atacatorii le folosesc pentru ca un domeniu fals să pară, la prima vedere, identic cu cel real.",
    url_reason_brand_subdomain: "Citește adresa de la dreapta la stânga. Partea care decide unde te afli este {domain}; tot ce apare înaintea ei este un subdomeniu, iar cine deține {domain} poate crea oricâte vrea, cu ce nume vrea.",
    url_reason_brand_in_subdomain: "Adresa chiar conține {brand} — dar doar ca subdomeniu. Și site-urile reale folosesc subdomenii, tocmai de aceea ele nu dovedesc nimic: cine deține {domain} poate pune orice nume în fața lui. Ce decide unde te afli este {domain}, partea aflată imediat înaintea primei bare oblice.",
    url_reason_hyphen: "Domeniul real de aici este {domain}. Atacatorii lipesc nume de branduri cu cratime ca adresa să pară oficială; site-ul autentic ar folosi pur și simplu domeniul propriu al brandului.",
    url_reason_tld: "Domeniul real de aici este {domain}. Terminația lui (.{tld}) e rar folosită de organizațiile consacrate și e populară printre atacatori, pentru că se înregistrează ieftin.",
    url_reason_long: "Uită-te cât de lungă și de încâlcită este adresa: un șir de cuvinte în plus, cratime și caractere aleatorii în jurul lui {domain}. Paginile de autentificare reale stau pe un domeniu scurt și simplu — lungimea și dezordinea sunt acolo ca să împingă numele adevărat departe de ochii tăi.",
    url_reason_generic: "Partea care decide unde te afli cu adevărat este {domain} — textul aflat imediat înaintea primei bare oblice. Tot restul adresei poate fi făcut să pară convingător.",
    step_password_title: "Acest formular îți cerea parola",
    step_password_body: "Erai la un pas de a-i da parola unui atacator. Organizațiile reale nu îți cer niciodată să îți confirmi parola printr-un link dintr-un e-mail. Când ai îndoieli, deschide chiar tu site-ul, tastând adresa în browser.",
    step_cc_title: "Acest formular cerea datele cardului",
    step_cc_body: "Dacă ai fi introdus aici numărul cardului, data expirării și codul de securitate, ele ar fi ajuns direct la infractori. Companiile legitime nu colectează date de plată prin linkuri neașteptate.",
    step_download_title: "Această descărcare putea fi malware",
    step_download_body: "Acest fișier ar fi putut instala software rău-intenționat pe dispozitivul tău. Verifică extensia fișierului înainte să deschizi orice — și descarcă programe doar din surse de încredere.",
    step_suspicious_link_title: "Acest link nu este ceea ce pretinde",
    step_suspicious_link_body: "Textul linkului spune {shown}, dar de fapt duce la {actual}. Treci cu mouse-ul peste linkuri ca să vezi destinația reală înainte să dai clic.",
    step_brand_title: "Această pagină se dă drept {brand}",
    step_brand_body: "Se prezintă ca {brand}, dar adresa aparține de {domain}. Companiile mari nu își pun paginile de autentificare pe domenii care nu au legătură cu ele — un nume pe pagină care nu se potrivește cu numele din bara de adrese este unul dintre cele mai clare semne de fals.",
    step_urgency_title: "Urgența este o tactică de presiune",
    step_urgency_body: "„Acționează acum”, termene-limită, amenințări cu suspendarea contului — atacatorii creează presiune ca să acționezi înainte să gândești. Companiile reale cer rareori acțiuni imediate; încetinește când un mesaj te grăbește.",
    urgency_quote: "Această pagină a pus presiune pe tine cu mesajul: „{quote}”",
    perm_mic_title: "Ai dat acces la microfonul tău",
    perm_mic_body: "De acum, această pagină te poate asculta prin microfon până când îi retragi accesul. Un site serios îți spune de ce are nevoie de microfon — pentru un apel sau o înregistrare pornită chiar de tine.",
    perm_webcam_title: "Ai dat acces la camera ta",
    perm_webcam_body: "De acum, această pagină te poate vedea prin cameră până când îi retragi accesul. Permite accesul la cameră doar pe site-uri pe care le-ai deschis chiar tu și unde un apel video are sens.",
    perm_location_title: "Ți-ai dezvăluit locația",
    perm_location_body: "Această pagină știe acum unde te afli. Site-urile legitime îți cer locația doar când e evident necesară, de exemplu ca să găsești un magazin din apropiere — și funcționează în continuare dacă refuzi.",
    perm_notification_title: "Ai permis notificările",
    perm_notification_body: "Această pagină îți poate trimite acum mesaje direct pe desktop, chiar și după ce o închizi. Atacatorii le folosesc pentru alerte false de viruși și ca să te atragă în alte escrocherii.",
    perm_clipboard_title: "Ai dat acces la clipboard",
    perm_clipboard_body: "În clipboard se află adesea o parolă, un număr de card sau o adresă crypto pe care tocmai ai copiat-o. O pagină cu acces la clipboard poate vedea tot ce ai copiat — sau poate schimba pe furiș ce lipești.",
    perm_extension_title: "Ai instalat o extensie de browser",
    perm_extension_body: "Extensiile pot citi și modifica fiecare pagină pe care o vizitezi, inclusiv e-mailul și contul tău bancar. Instalează-le doar din magazinele oficiale și doar când știi cine le publică.",
    lesson_login_title: "Lacătul nu înseamnă că e sigur",
    lesson_login_body: "Pictograma cu lacăt sau „https” înseamnă doar că conexiunea este criptată — nu că site-ul este autentic. Și site-urile de phishing folosesc criptare. Ai încredere în numele domeniului, nu în lacăt.",
    lesson_fraud_title: "Cum îți protejezi banii",
    lesson_fraud_body: "Nu introduce niciodată date de plată pe o pagină la care ai ajuns dintr-un e-mail sau mesaj. Intră chiar tu pe site-ul oficial al companiei sau în aplicația ei ori sună la numărul de pe spatele cardului.",
    lesson_malware_title: "Verifică înainte să descarci",
    lesson_malware_body: "Atașamentele și descărcările sunt o metodă preferată de a strecura malware pe dispozitivul tău. Confirmă cu expeditorul printr-un alt canal și fii precaut cu tipuri de fișiere precum .exe, .zip sau cu documente care îți cer să activezi macrocomenzi.",
    lesson_fake_title: "Dacă pare prea frumos ca să fie adevărat…",
    lesson_fake_body: "Paginile false imită branduri de încredere pentru a-ți obține clicul, datele sau încrederea. Verifică adresa, caută greșeli și detalii lucrate neglijent, iar când ceva pare în neregulă, închide pagina și intră chiar tu pe site.",
    lesson_permission_title: "Ai grijă ce permiți",
    lesson_permission_body: "Tocmai ai acordat acestei pagini un acces pe care nu ar trebui să îl aibă. Site-urile legitime explică de ce au nevoie de camera, microfonul sau locația ta înainte să ți le ceară. Acordă doar permisiuni pe care le înțelegi pe deplin — le poți revizui în setările browserului.",
    step_done_title: "Ce să verifici data viitoare",
    step_done_body: "Verifică adresa, pune la îndoială urgența, protejează-ți parolele și datele cardului și gândește-te înainte să descarci. Apasă Continuă pentru a merge mai departe.",
};
exports["default"] = strings;


/***/ }),

/***/ "./src/tutorial/AttackDetector.ts":
/*!****************************************!*\
  !*** ./src/tutorial/AttackDetector.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.scanPage = void 0;
const Identity_1 = __webpack_require__(/*! ./Identity */ "./src/tutorial/Identity.ts");
const UrlAnalyzer_1 = __webpack_require__(/*! ./UrlAnalyzer */ "./src/tutorial/UrlAnalyzer.ts");
const MALWARE_EVENTS = ["download_file_event", "file_opened", "file_open", "attachment_opened", "file_download"];
const PERMISSION_EVENTS = {
    "mic_accepted": "mic",
    "webcam_accepted": "webcam",
    "location_accepted": "location",
    "notification_accepted": "notification",
    "clipboard_accepted": "clipboard",
    "extension_installed": "extension",
};
// Phishing pages are usually sloppy clones: inputs outside of any <form>,
// randomised attribute names, <div> elements acting as buttons and text
// split across nested spans. Every heuristic below therefore works from
// what the user can actually see rather than from well-formed markup.
const PASSWORD_PATTERN = /(password|passwd|pwd|passcode|senha|parol|parola|contrasenya|contrase|mot\s*de\s*passe|passwort|kennwort|κωδικ)/i;
const OTP_PATTERN = /(one[-\s]?time|otp|2fa|two[-\s]?factor|verification\s*code|security\s*code|auth(entication)?\s*code|sms\s*code|cod\s*(de\s*)?verificare|código|code\s*de\s*validation|bestätigungscode)/i;
const CC_PATTERN = /(card\s*number|cardnumber|creditcard|credit\s*card|debit\s*card|cc[-_\s]?num|numar\s*card|número\s*de\s*tarjeta|numéro\s*de\s*carte|kartennummer|\bcvc\b|\bcvv\b|\bcsc\b|expir|validade|caducidad|vencimiento|ablauf|mm\s*\/\s*yy|iban|sort\s*code|routing\s*number)/i;
const DOWNLOAD_TEXT_PATTERN = /(^|[^\p{L}])(download|descarcă|descarca|descarga|descargar|descarrega|baixar|baixe|transferir|télécharger|téléchargez|herunterladen|download(en)?|λήψη|κατεβάστε|open\s*(the\s*)?(file|document|attachment)|view\s*document|get\s*(the\s*)?file)([^\p{L}]|$)/iu;
const DOWNLOAD_EXTENSION_PATTERN = /\.(exe|zip|rar|7z|iso|dmg|apk|msi|scr|bat|cmd|com|jar|vbs|ps1|hta|lnk|docm|xlsm|pptm|xlsb)($|\?|#)/i;
// Pressure tactics in every locale the tutorial supports: en, ro, es, ca,
// pt, fr, de and el. Matching is accent-insensitive for the Latin scripts
// because phishing kits routinely drop diacritics.
const URGENCY_PATTERN = new RegExp([
    // English
    "urgent", "immediately", "right now", "as soon as possible", "act now", "last chance",
    "final (notice|warning|reminder)", "verify (now|immediately|your account)", "confirm (now|immediately)",
    "expires? (today|soon|within|in)", "failure to (do so|respond|comply)", "avoid (suspension|deactivation)",
    // Romanian
    "urgent", "imediat", "de urgen[tț]a", "c[aâ]t mai repede", "ultima [sș]ans[aă]",
    "contul (t[aă]u )?(va fi )?(suspendat|blocat|[iî]nchis|dezactivat)", "expir[aă]", "[iî]n termen de",
    // Spanish (ES + LATAM)
    "urgente", "inmediatamente", "de inmediato", "ahora mismo", "[uú]ltima oportunidad",
    "(su|tu) cuenta ser[aá] (suspendida|bloqueada|cerrada|desactivada)", "caducar[aá]?", "vence hoy",
    "antes de que", "verifica(r)? (ahora|de inmediato)",
    // Catalan
    "urgent", "immediatament", "ara mateix", "[uú]ltima oportunitat",
    "el (teu |vostre )?compte ser[aà] (suspes|susp[eè]s|blocat|tancat)", "caduca", "abans que",
    // Portuguese (BR + PT)
    "urgente", "imediatamente", "com urg[eê]ncia", "agora mesmo", "[uú]ltima (chance|oportunidade)",
    "(a )?sua conta ser[aá] (suspensa|bloqueada|encerrada|desativada)", "expira", "dentro de",
    // French
    "urgent", "imm[ée]diatement", "d[eè]s maintenant", "sans d[ée]lai", "derni[eè]re chance",
    "votre compte sera (suspendu|bloqu[ée]|ferm[ée]|d[ée]sactiv[ée])", "expire", "avant le",
    // German
    "dringend", "umgehend", "sofort", "unverz[uü]glich", "letzte (chance|m[oö]glichkeit)",
    "ihr konto wird (gesperrt|deaktiviert|geschlossen)", "l[aä]uft ab", "innerhalb von", "abgelaufen",
    // Greek
    "[εέ]πειγον", "[αά]μεσα", "αμ[εέ]σως", "τελευτα[ιί]α ευκαιρ[ιί]α",
    "ο λογαριασμ[οό]ς σας θα (ανασταλε[ιί]|απενεργοποιηθε[ιί]|κλε[ιί]σει)", "αναστολ[ηή]", "λ[ηή]γει", "εντ[οό]ς",
    // Language-agnostic deadline shapes
    // Deadlines only count when the sentence frames them as one. A bare
    // "2 days" matches delivery estimates and warranty text, not pressure.
    "(within|in|expires? in|only|last|remaining|left)\\s+\\d+\\s*(hours?|minutes?|days?)",
    "(in|[iî]n termen de|dentro de|en|dans|innerhalb von|εντ[οό]ς)\\s+\\d+\\s*(ore|zile|horas|d[ií]as|hores|dies|heures|jours|stunden|tagen|[ωώ]ρες|μ[εέ]ρες)",
    "\\b24\\s*(hours?|h|ore|horas|hores|heures|stunden|[ωώ]ρες)\\b",
].join("|"), "i");
const URL_LIKE_TEXT_PATTERN = /^(https?:\/\/)?(www\.)?[a-z0-9][a-z0-9-]*(\.[a-z0-9][a-z0-9-]*)+(\/\S*)?$/i;
const INLINE_TAGS = ["SPAN", "B", "STRONG", "EM", "I", "U", "SMALL", "LABEL", "A", "FONT", "MARK", "CODE"];
const IGNORED_TAGS = ["SCRIPT", "STYLE", "NOSCRIPT", "TEMPLATE", "SVG"];
const isVisible = (element) => {
    if (!element.isConnected) {
        return false;
    }
    const rect = element.getBoundingClientRect();
    if (!rect.width && !rect.height) {
        return false;
    }
    const style = window.getComputedStyle(element);
    return style.visibility !== "hidden" && style.display !== "none" && style.opacity !== "0";
};
const isIgnored = (element) => {
    while (element) {
        if (IGNORED_TAGS.indexOf(element.tagName) !== -1 || element.hasAttribute("data-ignore")) {
            return true;
        }
        element = element.parentElement;
    }
    return false;
};
// NodeFilter.SHOW_TEXT, spelled out so the module works without the global.
const SHOW_TEXT = 4;
const text = (value) => (value || "").replace(/\s+/g, " ").trim();
/**
 * Collects every piece of text that describes an input: its own attributes,
 * any associated or wrapping label, ARIA labels and the visible text that
 * immediately precedes it. Cloned phishing pages rarely keep meaningful
 * name/id attributes, so the surrounding copy is often the only clue.
 *
 * @param {HTMLInputElement} input - The input to describe.
 * @returns {string} - All descriptive text found for the input.
 */
const describeField = (input) => {
    const parts = [
        input.name, input.id, input.placeholder, input.className, input.type,
        input.getAttribute("autocomplete"), input.getAttribute("aria-label"), input.getAttribute("title"),
        input.getAttribute("data-name"), input.getAttribute("data-testid"), input.getAttribute("inputmode"),
    ].map(text);
    const labelledBy = input.getAttribute("aria-labelledby");
    if (labelledBy) {
        labelledBy.split(/\s+/).forEach(id => { var _a; return parts.push(text((_a = input.ownerDocument.getElementById(id)) === null || _a === void 0 ? void 0 : _a.textContent)); });
    }
    if (input.id) {
        input.ownerDocument.querySelectorAll(`label[for="${CSS.escape(input.id)}"]`).forEach(label => parts.push(text(label.textContent)));
    }
    const wrappingLabel = input.closest("label");
    if (wrappingLabel) {
        parts.push(text(wrappingLabel.textContent));
    }
    // The visible copy just before the field, e.g. a <div> acting as a label.
    let previous = input.previousElementSibling;
    let hops = 0;
    while (previous && hops < 2) {
        if (!previous.querySelector("input, select, textarea")) {
            parts.push(text(previous.textContent).slice(0, 60));
        }
        previous = previous.previousElementSibling;
        hops++;
    }
    if (input.parentElement) {
        parts.push(text(input.parentElement.getAttribute("class")));
    }
    return parts.filter(Boolean).join(" ");
};
const isPasswordField = (input) => {
    if (input.type === "password") {
        return true;
    }
    // Some kits mask the field themselves to dodge password managers.
    const description = describeField(input);
    return PASSWORD_PATTERN.test(description) && !OTP_PATTERN.test(description);
};
const isCreditCardField = (input) => {
    if ((input.getAttribute("autocomplete") || "").indexOf("cc-") === 0) {
        return true;
    }
    const description = describeField(input);
    if (CC_PATTERN.test(description)) {
        return true;
    }
    // A 16-19 digit numeric field is a card number in all but name.
    const maxLength = input.maxLength;
    return (input.inputMode === "numeric" || input.type === "tel") && maxLength >= 14 && maxLength <= 19;
};
/**
 * Finds the block that visually groups the given fields. Prefers a real
 * <form>, otherwise walks up until the ancestor holds every field but is
 * still smaller than most of the viewport.
 *
 * @param {HTMLElement[]} fields - The fields that belong together.
 * @returns {HTMLElement | null} - The container to highlight.
 */
const groupContainer = (fields) => {
    if (!fields.length) {
        return null;
    }
    const form = fields[0].closest("form");
    if (form) {
        return form;
    }
    const viewportArea = window.innerWidth * window.innerHeight;
    let container = fields[0].parentElement;
    let best = fields[0];
    while (container && container !== document.body) {
        const rect = container.getBoundingClientRect();
        if (rect.width * rect.height > viewportArea * 0.8) {
            break;
        }
        best = container;
        if (fields.every(field => container.contains(field)) && container.querySelector("button, input[type='submit'], [role='button']")) {
            return container;
        }
        container = container.parentElement;
    }
    return best;
};
const collectInputs = (doc) => {
    return Array.from(doc.querySelectorAll("input")).filter(input => {
        return input.type !== "hidden" && !isIgnored(input) && isVisible(input);
    });
};
const findDownloadElements = (doc) => {
    const selector = "a, button, [role='button'], [onclick], input[type='button'], input[type='submit'], [class*='btn'], [class*='button'], [class*='download'], [id*='download']";
    const found = [];
    doc.querySelectorAll(selector).forEach(node => {
        const element = node;
        if (isIgnored(element) || !isVisible(element) || found.some(other => other.contains(element))) {
            return;
        }
        const href = element.getAttribute("href") || element.getAttribute("data-href") || element.getAttribute("data-url") || "";
        const label = text(element.textContent) || text(element.getAttribute("value")) || text(element.getAttribute("aria-label"));
        if (element.hasAttribute("download") || DOWNLOAD_EXTENSION_PATTERN.test(href) || DOWNLOAD_TEXT_PATTERN.test(label)) {
            found.push(element);
        }
    });
    return found;
};
/**
 * Reduces a hostname to the part that decides ownership, so subdomains of
 * the same site are not reported as deceptive.
 *
 * @param {string} host - The hostname to reduce.
 * @returns {string} - The registrable domain.
 */
const registrable = (host) => {
    const labels = host.split(".");
    if (labels.length <= 2) {
        return host;
    }
    const lastTwo = labels.slice(-2).join(".");
    return labels.slice(UrlAnalyzer_1.MULTI_PART_SUFFIXES.indexOf(lastTwo) !== -1 ? -3 : -2).join(".");
};
const findSuspiciousLinks = (doc) => {
    const findings = [];
    doc.querySelectorAll("a[href]").forEach((node) => {
        if (isIgnored(node) || !isVisible(node)) {
            return;
        }
        const label = text(node.textContent);
        if (!URL_LIKE_TEXT_PATTERN.test(label)) {
            return;
        }
        const shown = label.replace(/^https?:\/\//i, "").replace(/^www\./i, "").split(/[/?#]/)[0].toLowerCase();
        let actual = "";
        try {
            actual = new URL(node.href, doc.baseURI).hostname.replace(/^www\./i, "").toLowerCase();
        }
        catch (_a) {
            return;
        }
        // Compare what the address actually resolves to. A link reading
        // "example.com" that points at "login.example.com" is not deceptive.
        if (shown && actual && registrable(shown) !== registrable(actual)) {
            findings.push({ kind: "suspicious_link", element: node, vars: { shown, actual } });
        }
    });
    return findings;
};
/**
 * Walks up from an inline element to the closest block that is big enough
 * to highlight on its own.
 *
 * @param {HTMLElement | null} element - The element the text lives in.
 * @returns {HTMLElement | null} - The block worth spotlighting.
 */
const blockAncestor = (element) => {
    let current = element;
    let hops = 0;
    while (current && hops < 4) {
        const rect = current.getBoundingClientRect();
        if (INLINE_TAGS.indexOf(current.tagName) === -1 && rect.height >= 14 && rect.width >= 60) {
            return current;
        }
        current = current.parentElement;
        hops++;
    }
    return element;
};
const extractQuote = (value, match) => {
    const start = Math.max(value.lastIndexOf(".", match.index), value.lastIndexOf("!", match.index)) + 1;
    const stop = value.slice(match.index).search(/[.!?]/);
    const end = stop === -1 ? value.length : match.index + stop + 1;
    const sentence = value.slice(start, end).trim() || value;
    return sentence.length > 140 ? `${sentence.slice(0, 137).trim()}…` : sentence;
};
/**
 * Looks for pressure tactics anywhere in the visible copy. Text nodes are
 * scanned first so the exact sentence can be quoted back; if a phrase is
 * split across nested elements, whole blocks are scanned as a fallback.
 *
 * @param {Document} doc - The document to scan.
 * @returns {{element: HTMLElement, quote: string} | null} - The strongest match.
 */
const findUrgencyText = (doc) => {
    let best = null;
    // A document without a body would make createTreeWalker throw and, since
    // this runs last, take every finding collected so far down with it.
    if (!doc.body) {
        return null;
    }
    const walker = doc.createTreeWalker(doc.body, SHOW_TEXT);
    let node = walker.nextNode();
    while (node) {
        const value = text(node.nodeValue);
        const parent = node.parentElement;
        const match = value.length > 10 ? URGENCY_PATTERN.exec(value) : null;
        if (match && parent && !isIgnored(parent)) {
            const element = blockAncestor(parent);
            if (element && isVisible(element) && (!best || value.length < best.length)) {
                best = { element, quote: extractQuote(value, match), length: value.length };
            }
        }
        node = walker.nextNode();
    }
    if (best) {
        return { element: best.element, quote: best.quote };
    }
    doc.querySelectorAll("h1, h2, h3, h4, p, div, li, td, section, header").forEach(node => {
        const element = node;
        const value = text(element.textContent);
        if (!value || value.length > 260 || isIgnored(element) || !isVisible(element)) {
            return;
        }
        const match = URGENCY_PATTERN.exec(value);
        if (match && (!best || value.length < best.length)) {
            best = { element, quote: extractQuote(value, match), length: value.length };
        }
    });
    return best ? { element: best.element, quote: best.quote } : null;
};
/**
 * Scans the live DOM for every dangerous item and classifies the attack,
 * combining the triggering event name with page-content heuristics.
 *
 * @param {string} triggerEventName - The name of the event that fired.
 * @param {Document} [doc=document] - The document to scan.
 * @returns {Detection} - The attack type, the findings and the permission kind (if any).
 */
const scanPage = (triggerEventName, doc = document, declaredBrand) => {
    try {
        const findings = [];
        const inputs = collectInputs(doc);
        const cardFields = inputs.filter(isCreditCardField);
        if (cardFields.length) {
            findings.push({ kind: "cc_form", element: groupContainer(cardFields) });
        }
        const passwordFields = inputs.filter(input => isPasswordField(input) && cardFields.indexOf(input) === -1);
        if (passwordFields.length) {
            findings.push({ kind: "password_form", element: groupContainer(passwordFields) });
        }
        const url = (0, UrlAnalyzer_1.analyzeUrl)();
        const identity = (0, Identity_1.claimedIdentity)(doc, declaredBrand, element => !isIgnored(element) && isVisible(element));
        if (identity && !(0, Identity_1.ownsDomain)(identity.name, url.domain)) {
            findings.push({ kind: "brand_impersonation", element: identity.element, vars: { brand: identity.name, domain: url.domain } });
        }
        const downloads = findDownloadElements(doc);
        if (downloads.length) {
            findings.push({ kind: "download_link", element: downloads[0] });
        }
        findings.push(...findSuspiciousLinks(doc));
        const urgency = findUrgencyText(doc);
        if (urgency) {
            findings.push({ kind: "urgency_text", element: urgency.element, vars: { quote: urgency.quote } });
        }
        const permissionKind = PERMISSION_EVENTS[triggerEventName] || null;
        let type;
        if (MALWARE_EVENTS.indexOf(triggerEventName) !== -1) {
            type = "malware";
        }
        else if (permissionKind) {
            type = "fake_page";
        }
        else if (cardFields.length) {
            type = "fraud";
        }
        else if (passwordFields.length) {
            type = "login";
        }
        else if (downloads.length) {
            type = "malware";
        }
        else {
            type = "fake_page";
        }
        return { type, findings, permissionKind };
    }
    catch (_a) {
        return { type: "fake_page", findings: [], permissionKind: PERMISSION_EVENTS[triggerEventName] || null };
    }
};
exports.scanPage = scanPage;


/***/ }),

/***/ "./src/tutorial/Identity.ts":
/*!**********************************!*\
  !*** ./src/tutorial/Identity.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ownsDomain = exports.nameAppearsIn = exports.claimedIdentity = exports.assetName = void 0;
const brands_1 = __webpack_require__(/*! ./brands */ "./src/tutorial/brands.ts");
// How much each place a name appears is worth. A name needs SCORE_THRESHOLD
// points before we are willing to tell the user "this page pretends to be X",
// so a single weak hint is never enough on its own.
const WEIGHTS = {
    declared: 100,
    siteName: 4,
    copyright: 4,
    appName: 3,
    // A logo's alt text or file name is a stronger claim of identity than a
    // heading, so logo + heading is enough while title + heading is not.
    logo: 3,
    title: 2,
    heading: 1,
};
const SCORE_THRESHOLD = 4;
// Caps so a huge cloned DOM can never stall the redirect path.
const MAX_TEXT_NODES = 4000;
const MAX_ELEMENTS = 600;
// Words that describe what a page does rather than who owns it. Covers the
// ten locales the tutorial ships with, without diacritics (text is normalised
// before comparison).
const GENERIC = [
    "login", "log in", "signin", "sign in", "sign on", "sign up", "logon", "account", "my account",
    "home", "homepage", "welcome", "secure", "security", "verify", "verification", "confirm",
    "portal", "index", "untitled", "document", "page", "dashboard", "error", "support", "help",
    "customer service", "online banking", "internet banking", "e banking", "webmail", "email", "mail",
    "password", "congratulations", "notification", "notifications", "update", "payment", "invoice",
    "order", "delivery", "shipment", "tracking", "download", "file", "share", "shared", "inbox",
    "logo", "brand", "image", "img", "picture", "photo", "banner", "header", "footer", "icon", "avatar",
    "autentificare", "conectare", "cont", "contul meu", "bine ati venit", "parola", "felicitari",
    "livrare", "comanda", "factura", "plata", "notificare",
    "iniciar sesion", "inicio de sesion", "acceso", "cuenta", "mi cuenta", "bienvenido", "bienvenida",
    "contrasena", "felicidades", "entrega", "pedido", "factura", "pago", "aviso",
    "inici de sessio", "compte", "benvingut", "contrasenya",
    "iniciar sessao", "entrar", "conta", "minha conta", "bem vindo", "palavra passe", "senha",
    "parabens", "entrega", "encomenda", "fatura", "pagamento", "aviso",
    "connexion", "se connecter", "identification", "espace client", "bienvenue", "mot de passe",
    "felicitations", "livraison", "commande", "facture", "paiement", "avis",
    "anmelden", "anmeldung", "einloggen", "konto", "mein konto", "willkommen", "kennwort", "passwort",
    "gluckwunsch", "lieferung", "bestellung", "rechnung", "zahlung", "hinweis",
    "συνδεση", "εισοδος", "λογαριασμος", "καλως ηρθατε", "κωδικος", "συγχαρητηρια", "παραδοση",
    "παραγγελια", "τιμολογιο", "πληρωμη", "ειδοποιηση",
];
// Legal suffixes and copyright boilerplate to strip before comparing names.
const LEGAL_SUFFIX = /[\s,]+(s\s*\.?\s*a\s*\.?\s*(r\s*\.?\s*l\s*\.?)?|s\s*\.?\s*r\s*\.?\s*l\s*\.?|s\s*\.?\s*p\s*\.?\s*a\s*\.?|n\s*\.?\s*v\s*\.?|b\s*\.?\s*v\s*\.?|inc|incorporated|ltd|limited|llc|plc|gmbh|mbh|ag|kg|oy|ab|group|holdings?)\s*\.?\s*$/i;
const COPYRIGHT_NOISE = /(all rights reserved|toate drepturile rezervate|todos los derechos reservados|tots els drets reservats|todos os direitos reservados|tous droits reserves|alle rechte vorbehalten|με επιφυλαξη παντος δικαιωματος)/i;
// NodeFilter.SHOW_TEXT, spelled out so the module works without the global.
const SHOW_TEXT = 4;
const text = (value) => (value || "").replace(/\s+/g, " ").trim();
// Individual words drawn from the generic phrases above, plus the filler that
// glues them together, so "sign in to your account" is recognised as generic
// while "Microsoft" or "Banca Transilvania" is not.
const GENERIC_WORDS = {};
GENERIC.join(" ").split(" ").concat(["to", "your", "the", "my", "our", "a", "an", "of", "for", "and", "or",
    "la", "el", "los", "las", "su", "tu", "de", "del", "al", "en", "y",
    "o", "os", "as", "sua", "seu", "do", "da", "dos", "das", "e",
    "le", "les", "votre", "vos", "du", "des", "et",
    "ihr", "ihre", "der", "die", "das", "den", "und", "zum", "zur",
    "στο", "στη", "σας", "σου", "και", "το", "τη", "της", "του",
    "cont", "contul", "tau", "dvs", "si"]).forEach(word => {
    if (word) {
        GENERIC_WORDS[word] = true;
    }
});
const isGeneric = (value) => {
    const normalized = (0, brands_1.normalize)(value).trim();
    if (!normalized) {
        return true;
    }
    if (GENERIC.indexOf(normalized) !== -1) {
        return true;
    }
    // Generic only when every single word is page furniture — one real word
    // is enough to make it a possible name.
    return normalized.split(" ").every(word => GENERIC_WORDS[word] === true);
};
/**
 * Decides whether a string could be an organisation's name rather than a
 * description of the page.
 *
 * @param {string} value - The candidate string.
 * @returns {boolean} - True when the string looks like a name.
 */
const isPlausibleName = (value) => {
    const words = value.split(" ");
    return value.length >= 2 && value.length <= 40 && words.length <= 5 && /[a-zΑ-Ωα-ω]/i.test(value) && !isGeneric(value);
};
/**
 * Splits a headline or title into the parts that could carry a name.
 *
 * @param {string} value - The raw text.
 * @returns {string[]} - Candidate names.
 */
const segments = (value) => {
    return value.split(/[|–—·•>»/]|\s+[-‒]\s+/).map(text).filter(isPlausibleName);
};
/**
 * Extracts the owner's name out of a copyright line, e.g.
 * "© 2026 Banca Transilvania S.A. Toate drepturile rezervate" -> "Banca Transilvania".
 *
 * @param {string} value - The copyright line.
 * @returns {string} - The owner's name, or an empty string.
 */
const copyrightOwner = (value) => {
    let owner = text(value
        .replace(COPYRIGHT_NOISE, "")
        .replace(/©|\(c\)|&copy;|copyright/gi, "")
        .replace(/\b(19|20)\d{2}(\s*[-–]\s*(19|20)?\d{2,4})?\b/g, ""));
    // Strip legal suffixes repeatedly: "Acme Holding S.A." loses both parts.
    let previous = "";
    while (owner && owner !== previous) {
        previous = owner;
        owner = text(owner.replace(LEGAL_SUFFIX, ""));
    }
    const name = text(owner.replace(/[.,;|]+$/, ""));
    return isPlausibleName(name) ? name : "";
};
/**
 * Turns an asset reference into searchable words, so a logo served as
 * "/assets/banca-transilvania-logo@2x.svg" still reveals the name. Inline SVG
 * data URIs are decoded, since their markup often contains the wordmark.
 *
 * @param {string | null} [value] - A src, data-src or href attribute.
 * @returns {string} - Words extracted from the reference.
 */
const assetName = (value) => {
    if (!value) {
        return "";
    }
    if (value.indexOf("data:") === 0) {
        if (value.indexOf("image/svg+xml") === -1 || value.indexOf(";base64") !== -1) {
            return "";
        }
        try {
            return text(decodeURIComponent(value.slice(value.indexOf(",") + 1)).replace(/<[^>]*>/g, " "));
        }
        catch (_a) {
            return "";
        }
    }
    const file = value.split(/[?#]/)[0].split("/").pop() || "";
    return text(file.replace(/\.[a-z0-9]+$/i, "").replace(/[-_.@+%]+/g, " ").replace(/\b(logo|icon|favicon|header|brand|light|dark|white|black|small|large|\d+x|\d+)\b/gi, " "));
};
exports.assetName = assetName;
/**
 * Works out which organisation a page presents itself as, without relying on
 * a list of known brands. Every place a name can appear contributes points;
 * a name is only reported once it clears the threshold, which keeps page
 * furniture like "Sign in" or "Congratulations!" from being mistaken for one.
 *
 * A brand declared by the campaign always wins — the platform that built the
 * landing page knows what it imitates far better than any heuristic.
 *
 * @param {Document} doc - The document to inspect.
 * @param {string} [declared] - Brand supplied by config or the campaign token.
 * @param {(element: HTMLElement) => boolean} isUsable - Filters out hidden or overlay elements.
 * @returns {Identity | null} - The claimed identity, if one is convincing enough.
 */
const claimedIdentity = (doc, declared, isUsable) => {
    const scores = {};
    const add = (raw, weight, element) => {
        const value = text(raw);
        if (!value || !isPlausibleName(value)) {
            return;
        }
        // "Acme logo" in an alt attribute and "Acme" in a heading are the same
        // claim, so strip the descriptive noise before scoring.
        const cleaned = text(value.replace(/\b(logo|logotype|wordmark|brand|icon|image|banner|header|home|homepage)\b/gi, "")) || value;
        const name = (0, brands_1.canonicalBrand)(cleaned) || cleaned;
        const key = (0, brands_1.normalize)(name).trim();
        if (!key) {
            return;
        }
        const entry = scores[key] || (scores[key] = { name, score: 0, element: null, seen: [] });
        // One element counts once, however many attributes repeat the name.
        // Otherwise a single <svg aria-label="Facebook"><text>Facebook</text></svg>
        // would score twice and invent a brand on an unrelated page.
        if (element) {
            if (entry.seen.indexOf(element) !== -1) {
                return;
            }
            entry.seen.push(element);
        }
        entry.score += weight;
        entry.element = entry.element || element;
    };
    // A declared brand is authoritative and bypasses the plausibility filter,
    // which would otherwise reject a short name like "X" or "BT".
    if (text(declared)) {
        const name = (0, brands_1.canonicalBrand)(text(declared)) || text(declared);
        scores[(0, brands_1.normalize)(name).trim()] = { name, score: WEIGHTS.declared, element: null, seen: [] };
    }
    const meta = (selector) => { var _a; return text((_a = doc.querySelector(selector)) === null || _a === void 0 ? void 0 : _a.getAttribute("content")); };
    add(meta("meta[property='og:site_name']"), WEIGHTS.siteName, null);
    add(meta("meta[name='application-name']"), WEIGHTS.appName, null);
    add(meta("meta[name='apple-mobile-web-app-title']"), WEIGHTS.appName, null);
    add(meta("meta[name='author']"), WEIGHTS.appName, null);
    segments(text(doc.title)).forEach(part => add(part, WEIGHTS.title, null));
    segments(meta("meta[property='og:title']")).forEach(part => add(part, WEIGHTS.title, null));
    Array.prototype.slice.call(doc.querySelectorAll("img, svg, [class*='logo'], [id*='logo'], [class*='brand']"), 0, MAX_ELEMENTS).forEach((node) => {
        const element = node;
        if (!isUsable(element)) {
            return;
        }
        [
            element.getAttribute("alt"),
            element.getAttribute("aria-label"),
            element.getAttribute("title"),
            (0, exports.assetName)(element.getAttribute("src")),
            (0, exports.assetName)(element.getAttribute("data-src")),
            element.tagName.toUpperCase() === "SVG" ? text(element.textContent) : "",
        ].forEach(value => add(text(value), WEIGHTS.logo, element));
    });
    Array.prototype.slice.call(doc.querySelectorAll("h1, h2, header"), 0, MAX_ELEMENTS).forEach((node) => {
        const element = node;
        if (isUsable(element)) {
            segments(text(element.textContent)).forEach(part => add(part, WEIGHTS.heading, element));
        }
    });
    // A copyright line names the owner outright and is rarely edited by the
    // people cloning a page, which makes it one of the strongest signals.
    // Walking text nodes keeps this linear: querying every div/span and then
    // reading each one's recursive textContent is quadratic on deep clones.
    if (doc.body) {
        const walker = doc.createTreeWalker(doc.body, SHOW_TEXT);
        let node = walker.nextNode();
        let scanned = 0;
        while (node && scanned < MAX_TEXT_NODES) {
            scanned++;
            const value = text(node.nodeValue);
            if (value.length <= 160 && /©|\(c\)|copyright/i.test(value)) {
                const element = node.parentElement;
                if (element && isUsable(element)) {
                    add(copyrightOwner(value), WEIGHTS.copyright, element);
                }
            }
            node = walker.nextNode();
        }
    }
    let best = null;
    Object.keys(scores).forEach(key => {
        const entry = scores[key];
        if (entry.score >= SCORE_THRESHOLD && (!best || entry.score > best.confidence)) {
            best = { name: entry.name, element: entry.element, confidence: entry.score };
        }
    });
    return best;
};
exports.claimedIdentity = claimedIdentity;
/**
 * Checks whether a name appears in a host as a label of its own, rather than
 * as an accidental substring. Matching on substrings alone would let a short
 * brand like "ING" light up inside the perfectly ordinary subdomain "login".
 *
 * @param {string} name - The organisation name.
 * @param {string} host - A hostname or subdomain chain.
 * @returns {boolean} - True when the host really carries the name.
 */
const nameAppearsIn = (name, host) => {
    // normalize() turns dots and hyphens into spaces, so labels fall out of it.
    // "Banca Transilvania" therefore has to match the label "bancatransilvania",
    // the pair "banca"+"transilvania", or a label that embeds the whole name.
    const labels = (0, brands_1.normalize)(host).trim().split(" ").filter(Boolean);
    if (!labels.length) {
        return false;
    }
    const { full, abbreviations } = (0, brands_1.brandForms)(name);
    // Abbreviations must be a label of their own: "bt.example.com" counts,
    // the "bt" inside "abtract" does not.
    if (abbreviations.some(alias => labels.indexOf(alias) !== -1)) {
        return true;
    }
    return full.some(target => {
        if (target.length < 4) {
            return labels.indexOf(target) !== -1;
        }
        if (labels.indexOf(target) !== -1) {
            return true;
        }
        // Consecutive labels only. Joining every label of the host would let
        // "abanca.transilvaniatours.xyz" masquerade as "Banca Transilvania".
        for (let start = 0; start < labels.length; start++) {
            let joined = "";
            for (let end = start; end < labels.length && joined.length < target.length; end++) {
                joined += labels[end];
                if (joined === target) {
                    return true;
                }
            }
        }
        // Embedded in one label, e.g. "securebancatransilvania.xyz". Long names
        // only, so short ones can't collide with ordinary words.
        return target.length >= 8 && labels.some(label => label.indexOf(target) !== -1);
    });
};
exports.nameAppearsIn = nameAppearsIn;
/**
 * Checks whether the name is actually part of the domain, in which case the
 * page is not pretending to be anyone else.
 *
 * @param {string} name - The organisation name.
 * @param {string} domain - The registrable domain.
 * @returns {boolean} - True when the domain already carries the name.
 */
const ownsDomain = (name, domain) => {
    // Substring containment would be catastrophic here: it would treat
    // "microsoft-login.xyz" as belonging to Microsoft and suppress the very
    // warning the user needs. The name has to BE the domain's own label —
    // "training.com" is not ING, "pineapple.com" is not Apple.
    //
    // Split on dots only. Hyphens stay inside the label, so "banca-transilvania"
    // still resolves to the brand while "microsoft-login" does not.
    const labels = domain.split(".").map(label => (0, brands_1.normalize)(label).replace(/ /g, "")).filter(Boolean);
    if (!labels.length) {
        return true;
    }
    // Drop the public suffix; "bancatransilvania.ro" is owned by its first label.
    const owner = labels.slice(0, Math.max(labels.length - 1, 1));
    const { full, abbreviations } = (0, brands_1.brandForms)(name);
    if (abbreviations.some(alias => owner.indexOf(alias) !== -1)) {
        return true;
    }
    return full.some(target => {
        if (!target) {
            return false;
        }
        if (owner.indexOf(target) !== -1) {
            return true;
        }
        // A name split across consecutive labels, e.g. "banca.transilvania.ro".
        for (let start = 0; start < owner.length; start++) {
            let joined = "";
            for (let end = start; end < owner.length && joined.length < target.length; end++) {
                joined += owner[end];
                if (joined === target) {
                    return true;
                }
            }
        }
        return false;
    });
};
exports.ownsDomain = ownsDomain;


/***/ }),

/***/ "./src/tutorial/Placement.ts":
/*!***********************************!*\
  !*** ./src/tutorial/Placement.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.placeCard = exports.revealTarget = void 0;
const GAP = 18;
const MARGIN = 16;
const MIN_WIDTH = 296;
const SIDE_WIDTH = 400;
const STACK_WIDTH = 460;
const SHEET_BREAKPOINT = 560;
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
/**
 * Measures how tall the card wants to be at a given width.
 *
 * @param {HTMLElement} card - The card element.
 * @param {number} width - The width to measure at.
 * @returns {number} - The natural height in pixels.
 */
const naturalHeight = (card, width) => {
    card.style.width = `${width}px`;
    card.style.maxHeight = "none";
    return card.offsetHeight;
};
/**
 * Brings the target into view with the smallest scroll that works. Unlike
 * scrollIntoView it never re-centres an element that is already visible,
 * so the page doesn't lurch between steps.
 *
 * @param {DOMRect} rect - The target's viewport rect.
 * @param {number} reserved - Space at the bottom the card will occupy (sheet mode).
 */
const revealTarget = (rect, reserved = 0) => {
    const top = MARGIN;
    const bottom = window.innerHeight - MARGIN - reserved;
    let delta = 0;
    if (rect.height > bottom - top) {
        delta = rect.top - top;
    }
    else if (rect.top < top) {
        delta = rect.top - top;
    }
    else if (rect.bottom > bottom) {
        delta = rect.bottom - bottom;
    }
    if (Math.abs(delta) > 1) {
        window.scrollBy({ top: delta, behavior: "auto" });
    }
};
exports.revealTarget = revealTarget;
/**
 * Places the card in the roomiest spot next to the highlighted element,
 * sizing it to the space that is actually available: beside the target when
 * there is width for it, above or below when there isn't, and centred when
 * no element is highlighted.
 *
 * @param {HTMLElement} card - The card to position.
 * @param {DOMRect | null} rect - The highlighted element's rect, if any.
 * @returns {Placement} - The placement that was applied.
 */
const placeCard = (card, rect) => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const room = vh - MARGIN * 2;
    if (vw < SHEET_BREAKPOINT) {
        const width = vw;
        const height = Math.min(naturalHeight(card, width), vh * 0.72);
        card.style.width = `${width}px`;
        card.style.maxHeight = `${Math.round(vh * 0.72)}px`;
        card.style.left = "0px";
        card.style.top = `${vh - height}px`;
        return "sheet";
    }
    if (!rect) {
        const width = Math.min(STACK_WIDTH, vw - MARGIN * 2);
        const height = Math.min(naturalHeight(card, width), room);
        card.style.maxHeight = `${room}px`;
        card.style.left = `${Math.round((vw - width) / 2)}px`;
        card.style.top = `${Math.round((vh - height) / 2)}px`;
        return "center";
    }
    const space = {
        right: vw - rect.right - GAP - MARGIN,
        left: rect.left - GAP - MARGIN,
        bottom: vh - rect.bottom - GAP - MARGIN,
        top: rect.top - GAP - MARGIN,
    };
    // Prefer the side of the target that has the most room, then fall back to
    // stacking above or below it.
    const horizontal = space.right >= space.left ? ["right", "left"] : ["left", "right"];
    const vertical = space.bottom >= space.top ? ["bottom", "top"] : ["top", "bottom"];
    const order = [...horizontal, ...vertical];
    for (const placement of order) {
        const isSide = placement === "right" || placement === "left";
        const available = space[placement];
        if (isSide) {
            if (available < MIN_WIDTH) {
                continue;
            }
            const width = clamp(available, MIN_WIDTH, SIDE_WIDTH);
            const height = naturalHeight(card, width);
            if (height > room) {
                continue;
            }
            card.style.maxHeight = `${room}px`;
            card.style.left = `${Math.round(placement === "right" ? rect.right + GAP : rect.left - GAP - width)}px`;
            card.style.top = `${Math.round(clamp(rect.top + rect.height / 2 - height / 2, MARGIN, vh - height - MARGIN))}px`;
            return placement;
        }
        const width = clamp(vw - MARGIN * 2, MIN_WIDTH, STACK_WIDTH);
        const height = naturalHeight(card, width);
        if (height > available) {
            continue;
        }
        card.style.maxHeight = `${available}px`;
        card.style.left = `${Math.round(clamp(rect.left + rect.width / 2 - width / 2, MARGIN, vw - width - MARGIN))}px`;
        card.style.top = `${Math.round(placement === "bottom" ? rect.bottom + GAP : rect.top - GAP - height)}px`;
        return placement;
    }
    // Nothing fits outright: use the largest gap and let the card scroll. Every
    // value below is clamped to the viewport — an unclamped fallback could put
    // the card at a negative offset or straight over the element it explains.
    const best = order.reduce((winner, placement) => (space[placement] > space[winner] ? placement : winner), order[0]);
    const isSide = best === "right" || best === "left";
    const width = clamp(isSide ? space[best] : vw - MARGIN * 2, Math.min(MIN_WIDTH, vw - MARGIN * 2), isSide ? SIDE_WIDTH : STACK_WIDTH);
    const limit = clamp(isSide ? room : space[best], Math.min(160, room), room);
    const height = Math.min(naturalHeight(card, width), limit);
    card.style.width = `${width}px`;
    card.style.maxHeight = `${limit}px`;
    const left = isSide
        ? (best === "right" ? rect.right + GAP : rect.left - GAP - width)
        : rect.left + rect.width / 2 - width / 2;
    const top = isSide
        ? rect.top + rect.height / 2 - height / 2
        : (best === "bottom" ? rect.bottom + GAP : rect.top - GAP - height);
    card.style.left = `${Math.round(clamp(left, MARGIN, Math.max(vw - width - MARGIN, MARGIN)))}px`;
    card.style.top = `${Math.round(clamp(top, MARGIN, Math.max(vh - height - MARGIN, MARGIN)))}px`;
    return best;
};
exports.placeCard = placeCard;


/***/ }),

/***/ "./src/tutorial/Spotlight.ts":
/*!***********************************!*\
  !*** ./src/tutorial/Spotlight.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Spotlight = void 0;
const SPOTLIGHT_PADDING = 8;
/**
 * Dims and blurs the whole page except for a rectangular cutout around the
 * highlighted element. The cutout is built from four panels rather than a
 * single box-shadow so the dimmed area keeps its backdrop blur.
 */
class Spotlight {
    constructor(node) {
        this.node = node;
        this.element = null;
        this.frame = 0;
        this.running = false;
        this.onRectChange = null;
        this.lastRect = null;
        // Tracked so a viewport change re-places the card even when the target,
        // being position:fixed, keeps exactly the same rect.
        this.viewport = "";
    }
    /**
     * Highlights the given page element, scrolling it into view and keeping
     * the cutout in sync with scrolling, resizing and layout changes.
     *
     * @param {HTMLElement} element - The page element to highlight.
     */
    show(element, onRectChange) {
        this.element = element;
        this.onRectChange = onRectChange;
        this.node.style.display = "block";
        this.update();
        this.start();
    }
    hide() {
        this.element = null;
        this.onRectChange = null;
        this.lastRect = null;
        this.viewport = "";
        this.node.style.display = "none";
        this.stop();
    }
    destroy() {
        this.hide();
    }
    start() {
        if (this.running) {
            return;
        }
        this.running = true;
        const tick = () => {
            if (!this.running) {
                return;
            }
            this.update();
            this.frame = window.requestAnimationFrame(tick);
        };
        this.frame = window.requestAnimationFrame(tick);
    }
    stop() {
        this.running = false;
        if (this.frame) {
            window.cancelAnimationFrame(this.frame);
            this.frame = 0;
        }
    }
    part(name) {
        return this.node.querySelector(`.${name}`);
    }
    update() {
        // Also stop if the overlay itself was removed by the host page,
        // otherwise this loop runs for the lifetime of the tab.
        if (!this.element || !this.element.isConnected || !this.node.isConnected) {
            this.hide();
            return;
        }
        const rect = this.element.getBoundingClientRect();
        const moved = !this.lastRect
            || Math.abs(rect.top - this.lastRect.top) > 0.5
            || Math.abs(rect.left - this.lastRect.left) > 0.5
            || Math.abs(rect.width - this.lastRect.width) > 0.5
            || Math.abs(rect.height - this.lastRect.height) > 0.5;
        // Nothing moved: skip the five shadow queries and style writes that
        // would otherwise run on every single frame.
        if (!moved && this.viewport === `${window.innerWidth}x${window.innerHeight}`) {
            return;
        }
        this.lastRect = rect;
        this.viewport = `${window.innerWidth}x${window.innerHeight}`;
        if (this.onRectChange) {
            this.onRectChange(rect);
        }
        const top = Math.max(rect.top - SPOTLIGHT_PADDING, 0);
        const left = Math.max(rect.left - SPOTLIGHT_PADDING, 0);
        const right = Math.min(rect.right + SPOTLIGHT_PADDING, window.innerWidth);
        const bottom = Math.min(rect.bottom + SPOTLIGHT_PADDING, window.innerHeight);
        const above = this.part("cut-top");
        above.style.top = "0";
        above.style.left = "0";
        above.style.width = "100%";
        above.style.height = `${top}px`;
        const below = this.part("cut-bottom");
        below.style.top = `${bottom}px`;
        below.style.left = "0";
        below.style.width = "100%";
        below.style.height = `${Math.max(window.innerHeight - bottom, 0)}px`;
        const before = this.part("cut-left");
        before.style.top = `${top}px`;
        before.style.left = "0";
        before.style.width = `${left}px`;
        before.style.height = `${Math.max(bottom - top, 0)}px`;
        const after = this.part("cut-right");
        after.style.top = `${top}px`;
        after.style.left = `${right}px`;
        after.style.width = `${Math.max(window.innerWidth - right, 0)}px`;
        after.style.height = `${Math.max(bottom - top, 0)}px`;
        const ring = this.part("ring");
        ring.style.top = `${top}px`;
        ring.style.left = `${left}px`;
        ring.style.width = `${Math.max(right - left, 0)}px`;
        ring.style.height = `${Math.max(bottom - top, 0)}px`;
    }
}
exports.Spotlight = Spotlight;


/***/ }),

/***/ "./src/tutorial/Tutorial.ts":
/*!**********************************!*\
  !*** ./src/tutorial/Tutorial.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Tutorial = void 0;
const overlay_styles_1 = __webpack_require__(/*! ./overlay.styles */ "./src/tutorial/overlay.styles.ts");
const Placement_1 = __webpack_require__(/*! ./Placement */ "./src/tutorial/Placement.ts");
const Spotlight_1 = __webpack_require__(/*! ./Spotlight */ "./src/tutorial/Spotlight.ts");
const TutorialContent_1 = __webpack_require__(/*! ./TutorialContent */ "./src/tutorial/TutorialContent.ts");
const ICON_STROKE = "fill=\"none\" stroke=\"#1c0810\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"";
const ICONS = {
    url: `<svg viewBox="0 0 24 24" ${ICON_STROKE}><rect x="2" y="5" width="20" height="14" rx="3"/><circle cx="7" cy="9" r="0.5"/><circle cx="10" cy="9" r="0.5"/><path d="M5 13h11M5 16h7"/></svg>`,
    lock: `<svg viewBox="0 0 24 24" ${ICON_STROKE}><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/><circle cx="12" cy="15" r="1.5"/></svg>`,
    form: `<svg viewBox="0 0 24 24" ${ICON_STROKE}><circle cx="8" cy="12" r="4"/><path d="M12 12h9M18 12v3M21 12v2"/></svg>`,
    card: `<svg viewBox="0 0 24 24" ${ICON_STROKE}><rect x="2" y="5" width="20" height="14" rx="3"/><path d="M2 10h20M6 15h4"/></svg>`,
    clock: `<svg viewBox="0 0 24 24" ${ICON_STROKE}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>`,
    download: `<svg viewBox="0 0 24 24" ${ICON_STROKE}><path d="M12 3v11M7 10l5 5 5-5M4 19h16"/></svg>`,
    link: `<svg viewBox="0 0 24 24" ${ICON_STROKE}><path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1.5 1.5"/><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1.5-1.5"/></svg>`,
    shield: `<svg viewBox="0 0 24 24" ${ICON_STROKE}><path d="M12 3l8 3v6c0 4.5-3.5 8-8 9-4.5-1-8-4.5-8-9V6z"/><path d="M9 12l2 2 4-4"/></svg>`,
    permission: `<svg viewBox="0 0 24 24" ${ICON_STROKE}><path d="M18 9a6 6 0 1 0-12 0c0 5-2 6-2 6h16s-2-1-2-6"/><path d="M10 19a2 2 0 0 0 4 0"/></svg>`,
    mic: `<svg viewBox="0 0 24 24" ${ICON_STROKE}><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6"/></svg>`,
    webcam: `<svg viewBox="0 0 24 24" ${ICON_STROKE}><path d="M15 10l6-3v10l-6-3z"/><rect x="3" y="6" width="12" height="12" rx="3"/></svg>`,
    location: `<svg viewBox="0 0 24 24" ${ICON_STROKE}><path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>`,
    clipboard: `<svg viewBox="0 0 24 24" ${ICON_STROKE}><rect x="5" y="4" width="14" height="17" rx="2"/><rect x="9" y="2" width="6" height="4" rx="1"/><path d="M9 11h6M9 15h4"/></svg>`,
    extension: `<svg viewBox="0 0 24 24" ${ICON_STROKE}><path d="M10 4a2 2 0 1 1 4 0v2h3a1 1 0 0 1 1 1v3h2a2 2 0 1 1 0 4h-2v4a1 1 0 0 1-1 1h-4v-2a2 2 0 1 0-4 0v2H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h4z"/></svg>`,
    done: `<svg viewBox="0 0 24 24" ${ICON_STROKE}><circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.5 2.5L16 9.5"/></svg>`,
};
const ARROW_ICON = "<svg viewBox=\"0 0 12 12\" fill=\"none\" stroke=\"#1c0810\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M6 10.5V2.2\"/><path d=\"M2.2 6L6 2.2 9.8 6\"/></svg>";
class Tutorial {
    constructor(t, skippable, onComplete, logger) {
        this.t = t;
        this.skippable = skippable;
        this.onComplete = onComplete;
        this.logger = logger;
        this.host = null;
        this.onResize = null;
        this.root = null;
        this.spotlight = null;
        this.steps = [];
        this.currentStep = 0;
        this.placed = false;
        this.finished = false;
    }
    get isOpen() {
        return this.host !== null;
    }
    /**
     * Whether the overlay is genuinely on screen. The pages this runs on are
     * attacker-authored, so being mounted is not the same as being visible:
     * a CSS rule can hide the host, a MutationObserver can detach it, and a
     * strict CSP can drop the injected styles.
     *
     * @returns {boolean} - True when the card is rendered and sized.
     */
    get isUsable() {
        if (!this.host || !this.host.isConnected || !this.root) {
            return false;
        }
        const card = this.root.querySelector(".card");
        if (!card) {
            return false;
        }
        const rect = card.getBoundingClientRect();
        if (rect.width < 80 || rect.height < 60) {
            return false;
        }
        const style = window.getComputedStyle(this.host);
        return style.display !== "none" && style.visibility !== "hidden" && style.opacity !== "0";
    }
    /**
     * Opens the tutorial overlay for the given detection, walking the user
     * through every dangerous item found on the page. Calls onComplete
     * (which performs the redirect) when the user finishes or skips.
     *
     * @param {Detection} detection - The result of scanning the page.
     */
    open(detection) {
        if (this.isOpen) {
            return;
        }
        // If the tutorial already ran — for instance the user cancelled the
        // navigation in a beforeunload prompt — don't rebuild it, just leave.
        if (this.finished) {
            this.onComplete();
            return;
        }
        this.steps = (0, TutorialContent_1.stepsFor)(detection);
        this.currentStep = 0;
        this.mount();
        this.renderStep();
        this.logger.info(`Tutorial opened (${detection.type}, ${this.steps.length} steps).`);
    }
    mount() {
        this.host = document.createElement("div");
        this.host.setAttribute("data-ignore", "true");
        this.root = this.host.attachShadow({ mode: "closed" });
        const style = document.createElement("style");
        style.textContent = overlay_styles_1.OVERLAY_CSS;
        this.root.appendChild(style);
        const overlay = document.createElement("div");
        overlay.className = "overlay";
        overlay.innerHTML = `
			<div class="backdrop"></div>
			<div class="spotlight" style="display: none;">
				<div class="cut-top"></div>
				<div class="cut-bottom"></div>
				<div class="cut-left"></div>
				<div class="cut-right"></div>
				<div class="ring"><i></i><i></i><i></i><i></i></div>
			</div>
			<div class="arrow" style="display: none;">
				<div class="arrow-hint">
					<span class="arrow-mark">${ARROW_ICON}</span>
					<span class="arrow-text"></span>
				</div>
			</div>
			<div class="card">
				<div class="rail"><span class="rail-fill"></span></div>
				<div class="head">
					<span class="icon"></span>
					<span class="label"></span>
					<span class="count"></span>
				</div>
				<h2 class="title"></h2>
				<p class="body"></p>
				<div class="url-box" style="display: none;">
					<span class="url-label"></span>
					<span class="url-value"></span>
				</div>
				<p class="reason" style="display: none;"></p>
				<div class="actions">
					<button type="button" class="btn btn-ghost back"></button>
					<button type="button" class="btn btn-primary next"></button>
				</div>
				<button type="button" class="skip"></button>
			</div>
		`;
        this.root.appendChild(overlay);
        ["click", "mousedown", "mouseup", "submit", "input", "keydown", "keyup", "touchstart", "touchend"].forEach(type => {
            overlay.addEventListener(type, event => event.stopPropagation());
        });
        this.query(".label").textContent = this.t("heading");
        this.query(".arrow-text").textContent = this.t("arrow_hint");
        this.query(".back").textContent = this.t("back");
        const skip = this.query(".skip");
        if (this.skippable) {
            skip.textContent = this.t("skip");
            skip.addEventListener("click", () => this.complete());
        }
        else {
            skip.style.display = "none";
        }
        this.query(".back").addEventListener("click", () => this.move(-1));
        this.query(".next").addEventListener("click", () => {
            if (this.currentStep >= this.steps.length - 1) {
                this.complete();
            }
            else {
                this.move(1);
            }
        });
        this.spotlight = new Spotlight_1.Spotlight(this.query(".spotlight"));
        this.onResize = () => this.renderStep();
        window.addEventListener("resize", this.onResize);
        document.documentElement.appendChild(this.host);
    }
    query(selector) {
        return this.root.querySelector(selector);
    }
    move(delta) {
        this.currentStep = Math.min(Math.max(this.currentStep + delta, 0), this.steps.length - 1);
        this.renderStep();
    }
    renderStep() {
        const step = this.steps[this.currentStep];
        const isFirst = this.currentStep === 0;
        const isLast = this.currentStep === this.steps.length - 1;
        this.query(".title").textContent = this.t(step.titleKey, step.vars);
        this.query(".body").textContent = this.t(step.bodyKey, step.vars);
        this.renderUrlBox(step);
        const reason = this.query(".reason");
        const reasonKey = step.reasonKey || step.quoteKey;
        if (reasonKey) {
            reason.textContent = this.t(reasonKey, step.vars);
            reason.style.display = "block";
        }
        else {
            reason.style.display = "none";
        }
        this.query(".icon").innerHTML = ICONS[step.icon];
        // Numerals read the same in every language; the translated wording
        // stays available to screen readers.
        const pad = (value) => (value < 10 ? `0${value}` : `${value}`);
        const count = this.query(".count");
        count.textContent = `${pad(this.currentStep + 1)} / ${pad(this.steps.length)}`;
        count.setAttribute("aria-label", this.t("progress", { n: this.currentStep + 1, total: this.steps.length }));
        this.query(".rail-fill").style.width = `${((this.currentStep + 1) / this.steps.length) * 100}%`;
        this.query(".back").style.display = isFirst ? "none" : "block";
        this.query(".next").textContent = isLast ? this.t("continue") : this.t("next");
        this.query(".skip").style.display = this.skippable && !isLast ? "block" : "none";
        this.query(".arrow").style.display = step.target === "url_bar" ? "flex" : "none";
        const backdrop = this.query(".backdrop");
        if (step.target === "element" && step.element && step.element.isConnected) {
            backdrop.style.display = "none";
            (0, Placement_1.revealTarget)(step.element.getBoundingClientRect(), window.innerWidth < 560 ? window.innerHeight * 0.72 : 0);
            this.spotlight.show(step.element, rect => this.place(rect));
        }
        else {
            backdrop.style.display = "block";
            this.spotlight.hide();
            this.place(null);
        }
    }
    /**
     * Positions the card next to the highlighted element, or centres it when
     * no element is highlighted.
     *
     * @param {DOMRect | null} rect - The highlighted element's rect, if any.
     */
    place(rect) {
        const card = this.query(".card");
        // The first placement must not animate, otherwise the card visibly
        // slides in from the top-left corner it starts at.
        if (!this.placed) {
            card.style.transition = "none";
        }
        card.setAttribute("data-placement", (0, Placement_1.placeCard)(card, rect));
        if (!this.placed) {
            void card.offsetHeight;
            card.style.transition = "";
            this.placed = true;
        }
    }
    /**
     * Shows the address the user was actually on, with the registrable
     * domain — the part that decides where you really are — highlighted.
     *
     * @param {StepDefinition} step - The step being rendered.
     */
    renderUrlBox(step) {
        const box = this.query(".url-box");
        if (!step.url) {
            box.style.display = "none";
            return;
        }
        box.style.display = "block";
        this.query(".url-label").textContent = this.t("url_actual_label");
        const value = this.query(".url-value");
        value.textContent = "";
        const append = (text, className) => {
            if (!text) {
                return;
            }
            const span = document.createElement("span");
            span.textContent = text;
            if (className) {
                span.className = className;
            }
            value.appendChild(span);
        };
        append(step.url.scheme);
        append(step.url.subdomain ? `${step.url.subdomain}.` : "");
        append(step.url.domain, "domain");
        append(step.url.path);
    }
    complete() {
        if (this.finished) {
            return;
        }
        this.finished = true;
        this.logger.info("Tutorial finished, redirecting...");
        if (this.spotlight) {
            this.spotlight.destroy();
        }
        if (this.onResize) {
            window.removeEventListener("resize", this.onResize);
            this.onResize = null;
        }
        if (this.host) {
            this.host.remove();
            this.host = null;
            this.root = null;
        }
        this.onComplete();
    }
}
exports.Tutorial = Tutorial;


/***/ }),

/***/ "./src/tutorial/TutorialContent.ts":
/*!*****************************************!*\
  !*** ./src/tutorial/TutorialContent.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.stepsFor = void 0;
const Identity_1 = __webpack_require__(/*! ./Identity */ "./src/tutorial/Identity.ts");
const UrlAnalyzer_1 = __webpack_require__(/*! ./UrlAnalyzer */ "./src/tutorial/UrlAnalyzer.ts");
const MAX_FINDING_STEPS = 5;
const FINDING_ORDER = ["brand_impersonation", "cc_form", "password_form", "download_link", "suspicious_link", "urgency_text"];
const FINDING_STEPS = {
    brand_impersonation: { titleKey: "step_brand_title", bodyKey: "step_brand_body", icon: "shield" },
    cc_form: { titleKey: "step_cc_title", bodyKey: "step_cc_body", icon: "card" },
    password_form: { titleKey: "step_password_title", bodyKey: "step_password_body", icon: "form" },
    download_link: { titleKey: "step_download_title", bodyKey: "step_download_body", icon: "download" },
    suspicious_link: { titleKey: "step_suspicious_link_title", bodyKey: "step_suspicious_link_body", icon: "link" },
    urgency_text: { titleKey: "step_urgency_title", bodyKey: "step_urgency_body", icon: "clock" },
};
const PERMISSION_STEPS = {
    mic: { titleKey: "perm_mic_title", bodyKey: "perm_mic_body", icon: "mic" },
    webcam: { titleKey: "perm_webcam_title", bodyKey: "perm_webcam_body", icon: "webcam" },
    location: { titleKey: "perm_location_title", bodyKey: "perm_location_body", icon: "location" },
    notification: { titleKey: "perm_notification_title", bodyKey: "perm_notification_body", icon: "permission" },
    clipboard: { titleKey: "perm_clipboard_title", bodyKey: "perm_clipboard_body", icon: "clipboard" },
    extension: { titleKey: "perm_extension_title", bodyKey: "perm_extension_body", icon: "extension" },
};
const sortFindings = (findings) => {
    return [...findings].sort((a, b) => FINDING_ORDER.indexOf(a.kind) - FINDING_ORDER.indexOf(b.kind));
};
const lessonStep = (detection) => {
    if (detection.permissionKind) {
        return { titleKey: "lesson_permission_title", bodyKey: "lesson_permission_body", target: "none", icon: "permission" };
    }
    switch (detection.type) {
        case "login":
            return { titleKey: "lesson_login_title", bodyKey: "lesson_login_body", target: "none", icon: "lock" };
        case "fraud":
            return { titleKey: "lesson_fraud_title", bodyKey: "lesson_fraud_body", target: "none", icon: "shield" };
        case "malware":
            return { titleKey: "lesson_malware_title", bodyKey: "lesson_malware_body", target: "none", icon: "shield" };
        default:
            return { titleKey: "lesson_fake_title", bodyKey: "lesson_fake_body", target: "none", icon: "shield" };
    }
};
/**
 * Assembles the ordered tutorial steps for a detection: the URL step first
 * (explaining what specifically is wrong with this address), one spotlighted
 * step per dangerous item found on the page, a permission-specific step when
 * a permission was granted, a type-level lesson and the closing step.
 *
 * @param {Detection} detection - The result of scanning the page.
 * @returns {StepDefinition[]} - The ordered steps to present.
 */
const stepsFor = (detection) => {
    const url = (0, UrlAnalyzer_1.analyzeUrl)();
    // Legitimate sites put their brand in the domain, phishing kits put it in a
    // subdomain — anyone owning example.xyz can serve "yourbank.example.xyz".
    // When that is what happened, say so instead of the generic explanation.
    const brand = detection.findings.filter(finding => finding.kind === "brand_impersonation")[0];
    const brandInSubdomain = brand && brand.vars && url.subdomain && (0, Identity_1.nameAppearsIn)(brand.vars.brand, url.subdomain);
    const steps = [
        {
            titleKey: "step_url_title",
            bodyKey: "step_url_body",
            reasonKey: brandInSubdomain ? "url_reason_brand_in_subdomain" : url.reasonKey,
            target: "url_bar",
            vars: brandInSubdomain ? Object.assign(Object.assign({}, url.vars), { brand: brand.vars.brand }) : url.vars,
            url,
            icon: "url",
        },
    ];
    sortFindings(detection.findings).slice(0, MAX_FINDING_STEPS).forEach(finding => {
        var _a;
        const definition = FINDING_STEPS[finding.kind];
        steps.push({
            titleKey: definition.titleKey,
            bodyKey: definition.bodyKey,
            quoteKey: finding.kind === "urgency_text" && ((_a = finding.vars) === null || _a === void 0 ? void 0 : _a.quote) ? "urgency_quote" : undefined,
            target: finding.element ? "element" : "none",
            element: finding.element,
            vars: finding.vars,
            icon: definition.icon,
        });
    });
    if (detection.permissionKind) {
        const definition = PERMISSION_STEPS[detection.permissionKind];
        steps.push({ titleKey: definition.titleKey, bodyKey: definition.bodyKey, target: "none", icon: definition.icon });
    }
    steps.push(lessonStep(detection));
    steps.push({ titleKey: "step_done_title", bodyKey: "step_done_body", target: "none", icon: "done" });
    return steps;
};
exports.stepsFor = stepsFor;


/***/ }),

/***/ "./src/tutorial/UrlAnalyzer.ts":
/*!*************************************!*\
  !*** ./src/tutorial/UrlAnalyzer.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.analyzeUrl = exports.MULTI_PART_SUFFIXES = void 0;
// Two-level public suffixes we need so that the registrable domain of
// e.g. "shop.example.co.uk" resolves to "example.co.uk" and not "co.uk".
exports.MULTI_PART_SUFFIXES = [
    "co.uk", "org.uk", "gov.uk", "ac.uk", "me.uk", "net.uk", "ltd.uk", "plc.uk", "sch.uk",
    "com.br", "net.br", "org.br", "gov.br", "edu.br", "com.ar", "com.mx", "com.co", "com.pe",
    "com.ve", "com.uy", "com.ec", "com.bo", "com.py", "com.do", "com.gt", "com.sv", "com.ni",
    "com.au", "net.au", "org.au", "edu.au", "gov.au", "co.nz", "net.nz", "org.nz", "govt.nz",
    "co.za", "org.za", "co.jp", "or.jp", "ne.jp", "ac.jp", "go.jp", "co.kr", "or.kr",
    "co.in", "net.in", "org.in", "firm.in", "gen.in", "ind.in", "gov.in", "ac.in", "edu.in",
    "com.tr", "gov.tr", "edu.tr", "com.cn", "net.cn", "org.cn", "gov.cn", "com.hk", "org.hk",
    "com.sg", "com.my", "com.ph", "com.vn", "co.id", "co.th", "com.tw", "com.pk", "com.bd",
    "com.pt", "com.es", "com.pl", "com.gr", "com.ro", "com.ua", "com.ru", "com.cy", "com.mt",
    "co.il", "com.sa", "com.eg", "com.ng", "com.gh", "com.ke", "co.ke", "co.tz", "co.ug",
    // Hosting suffixes people can register a name under, so the label in front
    // belongs to whoever signed up, not to the platform.
    "github.io", "gitlab.io", "netlify.app", "vercel.app", "pages.dev", "workers.dev",
    "web.app", "firebaseapp.com", "herokuapp.com", "azurewebsites.net", "cloudfront.net",
    "s3.amazonaws.com", "blogspot.com", "wordpress.com", "weebly.com", "wixsite.com",
    "myshopify.com", "squarespace.com", "glitch.me", "repl.co", "surge.sh", "onrender.com",
];
const SUSPICIOUS_TLDS = [
    "xyz", "top", "click", "link", "gq", "tk", "ml", "cf", "ga", "buzz", "monster", "rest",
    "country", "loan", "work", "fit", "surf", "cam", "zip", "mov", "quest", "cfd", "sbs", "icu",
];
// Anchored to label boundaries: without this, "paid.example.com" matches "id"
// and "academy.example.com" matches "my".
const BRANDISH_SUBDOMAIN_PATTERN = /(^|[.-])(login|signin|sign-in|secure|security|verify|verification|account|accounts|auth|update|confirm|support|billing|payment|webmail|mail|portal|service|id|my)([.-]|$)/i;
const IPV4_PATTERN = /^\d{1,3}(\.\d{1,3}){3}$/;
// URL.hostname wraps IPv6 literals in brackets.
const IPV6_PATTERN = /^\[[0-9a-f:]+\]$/i;
/**
 * Splits a hostname into its registrable domain and the subdomain prefix.
 *
 * @param {string} host - The hostname to split.
 * @returns {[string, string]} - A tuple of [subdomain, registrableDomain].
 */
const splitHost = (host) => {
    const labels = host.split(".");
    if (labels.length <= 2) {
        return ["", host];
    }
    const lastTwo = labels.slice(-2).join(".");
    const size = exports.MULTI_PART_SUFFIXES.includes(lastTwo) ? 3 : 2;
    return [labels.slice(0, -size).join("."), labels.slice(-size).join(".")];
};
/**
 * Analyses the current URL and decides which explanation best describes
 * why the address should have raised suspicion.
 *
 * @param {string} [href=window.location.href] - The URL to analyse.
 * @returns {UrlAnalysis} - The parsed URL parts plus the explanation key and its variables.
 */
const analyzeUrl = (href = window.location.href) => {
    let url;
    try {
        url = new URL(href);
    }
    catch (_a) {
        return { href, scheme: "", host: href, subdomain: "", domain: href, path: "", reasonKey: "url_reason_generic", vars: { domain: href } };
    }
    const host = url.hostname;
    // "https://microsoft.com@evil.example/" reads as Microsoft to a victim, so
    // the userinfo has to stay visible; likewise a non-default port.
    const credentials = url.username ? `${url.username}${url.password ? ":" + url.password : ""}@` : "";
    const port = url.port ? `:${url.port}` : "";
    const [subdomain, domain] = splitHost(host);
    const tld = domain.split(".").pop() || "";
    const fullPath = `${port}${url.pathname === "/" ? "" : url.pathname}${url.search}${url.hash}`;
    const path = fullPath.length > 42 ? `${fullPath.slice(0, 42)}…` : fullPath;
    const base = {
        href,
        scheme: `${url.protocol}//${credentials}`,
        host,
        subdomain,
        domain,
        path,
    };
    // A long, cluttered address is itself a warning sign: legitimate sign-in
    // pages sit on a short domain, not a chain of subdomains and random text.
    const visible = `${host}${url.pathname}`;
    const isCluttered = host.split(".").length >= 4
        || visible.length > 60
        || /\d{4,}/.test(host)
        || (host.match(/-/g) || []).length >= 3
        || /[a-z0-9]{20,}/i.test(host);
    let reasonKey = "url_reason_generic";
    if (IPV4_PATTERN.test(host) || IPV6_PATTERN.test(host)) {
        reasonKey = "url_reason_ip";
    }
    else if (host.indexOf("xn--") !== -1) {
        reasonKey = "url_reason_punycode";
    }
    else if (subdomain && BRANDISH_SUBDOMAIN_PATTERN.test(subdomain)) {
        reasonKey = "url_reason_brand_subdomain";
    }
    else if (isCluttered) {
        reasonKey = "url_reason_long";
    }
    else if (SUSPICIOUS_TLDS.includes(tld)) {
        reasonKey = "url_reason_tld";
    }
    else if (domain.indexOf("-") !== -1) {
        reasonKey = "url_reason_hyphen";
    }
    return Object.assign(Object.assign({}, base), { reasonKey, vars: { host, domain, subdomain, tld } });
};
exports.analyzeUrl = analyzeUrl;


/***/ }),

/***/ "./src/tutorial/brands.ts":
/*!********************************!*\
  !*** ./src/tutorial/brands.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.matchBrand = exports.canonicalBrand = exports.brandForms = exports.acronymOf = exports.normalize = exports.BRANDS = void 0;
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
exports.BRANDS = [
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
const normalize = (value) => {
    const stripped = value.normalize ? value.normalize("NFD").replace(DIACRITICS, "") : value;
    return ` ${stripped.toLowerCase().replace(/[^a-z0-9Ͱ-Ͽἀ-῿]+/g, " ").trim()} `;
};
exports.normalize = normalize;
const flatten = (value) => (0, exports.normalize)(value).trim().replace(/ /g, "");
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
const acronymOf = (name) => {
    const words = (0, exports.normalize)(name).trim().split(" ").filter(word => word && ACRONYM_FILLERS.indexOf(word) === -1);
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
exports.acronymOf = acronymOf;
/**
 * Lists every way a brand may be written inside a hostname. Campaigns often
 * shorten the name in the subdomain — "bt.example.com" for Banca Transilvania
 * — so the abbreviations we know about have to be searchable too.
 *
 * @param {string} name - The brand's display name.
 * @returns {BrandForms} - Full spellings and abbreviations, normalised.
 */
const brandForms = (name) => {
    const entry = exports.BRANDS.filter(brand => brand.name === name)[0];
    const full = [flatten(name)];
    const abbreviations = [];
    if (entry) {
        (entry.aliases || []).forEach(alias => full.push(flatten(alias)));
        (entry.short || []).forEach(alias => abbreviations.push(flatten(alias)));
    }
    // Works for brands we have never seen: "Cooperativa Ardeal" -> "ca" is
    // dropped as ambiguous, "Mutuelle Rhodanienne du Sud" -> "mrs" is kept.
    const acronym = (0, exports.acronymOf)(name);
    if (acronym && abbreviations.indexOf(acronym) === -1) {
        abbreviations.push(acronym);
    }
    return { full: full.filter(Boolean), abbreviations: abbreviations.filter(Boolean) };
};
exports.brandForms = brandForms;
/**
 * Maps a name onto its canonical owner when we happen to know it, so that
 * "Office 365" is reported as "Microsoft" and "BT24" as "Banca Transilvania".
 * Returns null for anything unknown, which the caller then uses verbatim.
 *
 * @param {string} value - The name as written on the page.
 * @returns {string | null} - The canonical brand name, or null.
 */
const canonicalBrand = (value) => (0, exports.matchBrand)(value);
exports.canonicalBrand = canonicalBrand;
/**
 * Finds a known brand named in the given text.
 *
 * @param {string} value - The raw text to inspect.
 * @returns {string | null} - The brand's display name, or null.
 */
const matchBrand = (value) => {
    const haystack = (0, exports.normalize)(value);
    for (const brand of exports.BRANDS) {
        for (const alias of brand.aliases || []) {
            if (haystack.indexOf(` ${(0, exports.normalize)(alias).trim()} `) !== -1) {
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
exports.matchBrand = matchBrand;


/***/ }),

/***/ "./src/tutorial/overlay.styles.ts":
/*!****************************************!*\
  !*** ./src/tutorial/overlay.styles.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OVERLAY_CSS = void 0;
exports.OVERLAY_CSS = `
:host {
	all: initial;
}

* {
	box-sizing: border-box;
	margin: 0;
	padding: 0;
}

.overlay {
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	inset: 0;
	z-index: 2147483647;
	font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, Roboto, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	pointer-events: auto;
}

.backdrop {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	inset: 0;
	background: rgba(8, 6, 12, 0.7);
	backdrop-filter: blur(6px) saturate(0.7);
	-webkit-backdrop-filter: blur(6px) saturate(0.7);
	animation: ats-fade 0.4s ease-out both;
}

/* ---- spotlight: dim + blur everything but the target ---- */

.spotlight {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	inset: 0;
	pointer-events: none;
}

.spotlight .cut-top,
.spotlight .cut-bottom,
.spotlight .cut-left,
.spotlight .cut-right {
	position: absolute;
	background: rgba(8, 6, 12, 0.7);
	backdrop-filter: blur(6px) saturate(0.7);
	-webkit-backdrop-filter: blur(6px) saturate(0.7);
}

.spotlight .ring {
	position: absolute;
	border-radius: 10px;
	box-shadow: 0 0 0 2px rgba(255, 51, 102, 0.55), 0 0 46px rgba(255, 51, 102, 0.35);
	animation: ats-reticle 2.2s ease-in-out infinite;
}

.spotlight .ring i {
	position: absolute;
	width: 20px;
	height: 20px;
	border: 3px solid #ff3366;
}

.spotlight .ring i:nth-child(1) { top: -3px; left: -3px; border-right: 0; border-bottom: 0; border-radius: 10px 0 0 0; }
.spotlight .ring i:nth-child(2) { top: -3px; right: -3px; border-left: 0; border-bottom: 0; border-radius: 0 10px 0 0; }
.spotlight .ring i:nth-child(3) { bottom: -3px; left: -3px; border-right: 0; border-top: 0; border-radius: 0 0 0 10px; }
.spotlight .ring i:nth-child(4) { bottom: -3px; right: -3px; border-left: 0; border-top: 0; border-radius: 0 0 10px 0; }

/* ---- pointer to the browser address bar ---- */

/* One compact object rather than a floating chevron, a tail and a glow: a
   single pill whose inline arrow does the pointing. */
.arrow {
	position: fixed;
	top: 12px;
	left: 50%;
	transform: translateX(-50%);
	pointer-events: none;
}

.arrow-hint {
	display: flex;
	align-items: center;
	gap: 9px;
	background: #ff3366;
	color: #1c0810;
	font-size: 12.5px;
	font-weight: 650;
	letter-spacing: 0.005em;
	padding: 6px 16px 6px 6px;
	border-radius: 999px;
	white-space: nowrap;
	box-shadow: 0 6px 22px rgba(0, 0, 0, 0.38);
}

.arrow-mark {
	flex: none;
	width: 23px;
	height: 23px;
	border-radius: 50%;
	background: rgba(28, 8, 16, 0.16);
	display: flex;
	align-items: center;
	justify-content: center;
	animation: ats-nudge 1.9s ease-in-out infinite;
}

.arrow-mark svg {
	width: 12px;
	height: 12px;
	display: block;
}

/* ---- card: bold red, with the sharp corner aimed at the target ---- */

.card {
	position: fixed;
	left: 0;
	top: 0;
	overflow: hidden auto;
	background: linear-gradient(155deg, #ff4470 0%, #ff3366 42%, #e11d48 100%);
	border-radius: 30px 30px 30px 6px;
	corner-shape: squircle;
	box-shadow: 0 28px 70px rgba(180, 12, 55, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.3) inset;
	padding: 0 28px 24px;
	color: #1c0810;
	transition: left 0.34s cubic-bezier(0.16, 1, 0.3, 1), top 0.34s cubic-bezier(0.16, 1, 0.3, 1), width 0.34s cubic-bezier(0.16, 1, 0.3, 1), border-radius 0.34s ease;
	animation: ats-enter 0.44s cubic-bezier(0.16, 1, 0.3, 1) both;
}

/* the blunt-cut corner points back at whatever is highlighted */
.card[data-placement="right"] { border-radius: 6px 30px 30px 30px; }
.card[data-placement="left"] { border-radius: 30px 6px 30px 30px; }
.card[data-placement="bottom"] { border-radius: 6px 30px 30px 30px; }
.card[data-placement="top"] { border-radius: 30px 30px 30px 6px; }
.card[data-placement="center"] { border-radius: 30px; }

.card[data-placement="sheet"] {
	border-radius: 28px 28px 0 0;
	corner-shape: squircle;
	padding: 0 20px 20px;
}

.card[data-placement="sheet"] .rail { margin: 0 -20px 22px; }

/* hazard hatching in the corner */
.card::after {
	content: "";
	position: absolute;
	top: 0;
	right: 0;
	width: 130px;
	height: 130px;
	pointer-events: none;
	background: repeating-linear-gradient(-45deg, rgba(28, 8, 16, 0.07) 0 6px, transparent 6px 14px);
	-webkit-mask-image: linear-gradient(225deg, #000, transparent 70%);
	mask-image: linear-gradient(225deg, #000, transparent 70%);
}

.rail {
	position: sticky;
	top: 0;
	height: 3px;
	margin: 0 -28px 26px;
	background: rgba(255, 255, 255, 0.35);
	z-index: 1;
}

.rail-fill {
	display: block;
	height: 100%;
	width: 0;
	background: #1c0810;
	transition: width 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}

.head {
	display: flex;
	align-items: center;
	gap: 9px;
	margin-bottom: 18px;
	position: relative;
}

.head .icon {
	display: flex;
	width: 21px;
	height: 21px;
	flex: none;
}

.head .icon svg {
	width: 21px;
	height: 21px;
}

.head .label {
	font-size: 10.5px;
	font-weight: 800;
	letter-spacing: 0.15em;
	text-transform: uppercase;
	color: #2b0c16;
}

.head .count {
	margin-left: auto;
	font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
	font-size: 11px;
	font-weight: 600;
	letter-spacing: 0.08em;
	color: #3a1220;
}

.title {
	font-size: 25px;
	font-weight: 800;
	letter-spacing: -0.028em;
	line-height: 1.14;
	margin-bottom: 12px;
	animation: ats-slide 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.body {
	font-size: 14.5px;
	line-height: 1.62;
	color: #2b0c16;
	margin-bottom: 18px;
	animation: ats-slide 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.05s both;
}

.url-box {
	background: rgba(255, 255, 255, 0.42);
	border-radius: 14px 14px 14px 4px;
	corner-shape: squircle;
	padding: 12px 14px;
	margin-bottom: 16px;
	animation: ats-slide 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
}

.url-label {
	display: block;
	font-size: 9.5px;
	font-weight: 700;
	letter-spacing: 0.16em;
	text-transform: uppercase;
	color: #3a1220;
	margin-bottom: 8px;
}

.url-value {
	font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
	font-size: 12.5px;
	line-height: 1.75;
	color: #3a1220;
	word-break: break-all;
}

.url-value .domain {
	background: #1c0810;
	color: #ffd7e0;
	font-weight: 700;
	border-radius: 5px;
	corner-shape: squircle;
	padding: 2px 5px;
}

.reason {
	position: relative;
	font-size: 14px;
	line-height: 1.58;
	color: #1c0810;
	background: rgba(255, 255, 255, 0.42);
	border-radius: 14px 14px 14px 4px;
	corner-shape: squircle;
	padding: 13px 15px 13px 17px;
	margin-bottom: 22px;
	animation: ats-slide 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both;
}

.reason::before {
	content: "";
	position: absolute;
	top: 13px;
	bottom: 13px;
	left: 0;
	width: 3px;
	border-radius: 0 3px 3px 0;
	background: #1c0810;
}

.actions {
	display: flex;
	gap: 8px;
	animation: ats-slide 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both;
}

.btn {
	appearance: none;
	cursor: pointer;
	font-family: inherit;
	font-size: 14.5px;
	font-weight: 700;
	letter-spacing: -0.005em;
	border-radius: 13px;
	corner-shape: squircle;
	padding: 13px 20px;
	border: 1.5px solid transparent;
	transition: background 0.18s ease, border-color 0.18s ease, transform 0.12s ease;
}

.btn:active { transform: scale(0.985); }

.btn-primary {
	flex: 1;
	background: #1c0810;
	color: #fff;
}

.btn-primary:hover { background: #2b0c16; }

.btn-ghost {
	background: transparent;
	border-color: rgba(28, 8, 16, 0.4);
	color: #1c0810;
}

.btn-ghost:hover { background: rgba(28, 8, 16, 0.1); }

.skip {
	display: block;
	width: 100%;
	appearance: none;
	border: none;
	background: none;
	cursor: pointer;
	font-family: inherit;
	font-size: 12.5px;
	font-weight: 600;
	color: #3a1220;
	margin-top: 14px;
	padding: 6px;
	transition: color 0.18s ease;
}

.skip:hover { color: #1c0810; }

@keyframes ats-fade {
	from { opacity: 0; }
	to { opacity: 1; }
}

@keyframes ats-enter {
	from { opacity: 0; transform: scale(0.97); }
	to { opacity: 1; transform: none; }
}

@keyframes ats-slide {
	from { opacity: 0; transform: translateY(7px); }
	to { opacity: 1; transform: none; }
}

@keyframes ats-nudge {
	0%, 100% { transform: translateY(1.5px); }
	50% { transform: translateY(-2.5px); }
}

@keyframes ats-reticle {
	0%, 100% { box-shadow: 0 0 0 2px rgba(255, 51, 102, 0.55), 0 0 46px rgba(255, 51, 102, 0.35); }
	50% { box-shadow: 0 0 0 2px rgba(255, 51, 102, 0.8), 0 0 70px rgba(255, 51, 102, 0.5); }
}

@media (max-width: 560px) {
	.title { font-size: 21px; }
	.body, .reason { font-size: 13.5px; }
	.actions { flex-direction: column-reverse; }
	.arrow-hint { font-size: 10px; letter-spacing: 0.1em; }
}

@media (prefers-reduced-motion: reduce) {
	.backdrop, .card, .arrow, .arrow-mark, .spotlight .ring,
	.title, .body, .url-box, .reason, .actions, .rail-fill, .btn {
		animation: none;
		transition: none;
	}
}
`;


/***/ }),

/***/ "./node_modules/ua-parser-js/src/ua-parser.js":
/*!****************************************************!*\
  !*** ./node_modules/ua-parser-js/src/ua-parser.js ***!
  \****************************************************/
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/////////////////////////////////////////////////////////////////////////////////
/* UAParser.js v1.0.41
   Copyright © 2012-2025 Faisal Salman <f@faisalman.com>
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


    var LIBVERSION  = '1.0.41',
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
        HONOR   = 'Honor',
        HUAWEI  = 'Huawei',
        LENOVO  = 'Lenovo',
        LG      = 'LG',
        MICROSOFT = 'Microsoft',
        MOTOROLA  = 'Motorola',
        NVIDIA  = 'Nvidia',
        ONEPLUS = 'OnePlus',
        OPERA   = 'Opera',
        OPPO    = 'OPPO',
        SAMSUNG = 'Samsung',
        SHARP   = 'Sharp',
        SONY    = 'Sony',
        XIAOMI  = 'Xiaomi',
        ZEBRA   = 'Zebra',
        FACEBOOK    = 'Facebook',
        CHROMIUM_OS = 'Chromium OS',
        MAC_OS  = 'Mac OS',
        SUFFIX_BROWSER = ' Browser';

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
            return map.hasOwnProperty('*') ? map['*'] : str;
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
            /\b(?:mxbrowser|mxios|myie2)\/?([-\w\.]*)\b/i                       // Maxthon
            ], [VERSION, [NAME, 'Maxthon']], [
            /(kindle)\/([\w\.]+)/i,                                             // Kindle
            /(lunascape|maxthon|netfront|jasmine|blazer|sleipnir)[\/ ]?([\w\.]*)/i,      
                                                                                // Lunascape/Maxthon/Netfront/Jasmine/Blazer/Sleipnir
            // Trident based
            /(avant|iemobile|slim(?:browser|boat|jet))[\/ ]?([\d\.]*)/i,        // Avant/IEMobile/SlimBrowser/SlimBoat/Slimjet
            /(?:ms|\()(ie) ([\w\.]+)/i,                                         // Internet Explorer

            // Blink/Webkit/KHTML based                                         // Flock/RockMelt/Midori/Epiphany/Silk/Skyfire/Bolt/Iron/Iridium/PhantomJS/Bowser/QupZilla/Falkon
            /(flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs|bowser|qupzilla|falkon|rekonq|puffin|brave|whale(?!.+naver)|qqbrowserlite|duckduckgo|klar|helio|(?=comodo_)?dragon)\/([-\w\.]+)/i,
                                                                                // Rekonq/Puffin/Brave/Whale/QQBrowserLite/QQ//Vivaldi/DuckDuckGo/Klar/Helio/Dragon
            /(heytap|ovi|115)browser\/([\d\.]+)/i,                              // HeyTap/Ovi/115
            /(weibo)__([\d\.]+)/i                                               // Weibo
            ], [NAME, VERSION], [
            /quark(?:pc)?\/([-\w\.]+)/i                                         // Quark
            ], [VERSION, [NAME, 'Quark']], [
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
            ], [VERSION, [NAME, 'MIUI' + SUFFIX_BROWSER]], [
            /fxios\/([\w\.-]+)/i                                                // Firefox for iOS
            ], [VERSION, [NAME, FIREFOX]], [
            /\bqihoobrowser\/?([\w\.]*)/i                                       // 360
            ], [VERSION, [NAME, '360']], [
            /\b(qq)\/([\w\.]+)/i                                                // QQ
            ], [[NAME, /(.+)/, '$1Browser'], VERSION], [
            /(oculus|sailfish|huawei|vivo|pico)browser\/([\w\.]+)/i
            ], [[NAME, /(.+)/, '$1' + SUFFIX_BROWSER], VERSION], [              // Oculus/Sailfish/HuaweiBrowser/VivoBrowser/PicoBrowser
            /samsungbrowser\/([\w\.]+)/i                                        // Samsung Internet
            ], [VERSION, [NAME, SAMSUNG + ' Internet']], [
            /metasr[\/ ]?([\d\.]+)/i                                            // Sogou Explorer
            ], [VERSION, [NAME, 'Sogou Explorer']], [
            /(sogou)mo\w+\/([\d\.]+)/i                                          // Sogou Mobile
            ], [[NAME, 'Sogou Mobile'], VERSION], [
            /(electron)\/([\w\.]+) safari/i,                                    // Electron-based App
            /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i,                   // Tesla
            /m?(qqbrowser|2345(?=browser|chrome|explorer))\w*[\/ ]?v?([\w\.]+)/i   // QQ/2345
            ], [NAME, VERSION], [
            /(lbbrowser|rekonq)/i,                                              // LieBao Browser/Rekonq
            /\[(linkedin)app\]/i                                                // LinkedIn App for iOS & Android
            ], [NAME], [
            /ome\/([\w\.]+) \w* ?(iron) saf/i,                                  // Iron
            /ome\/([\w\.]+).+qihu (360)[es]e/i                                  // 360
            ], [VERSION, NAME], [

            // WebView
            /((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i       // Facebook App for iOS & Android
            ], [[NAME, FACEBOOK], VERSION], [
            /(Klarna)\/([\w\.]+)/i,                                             // Klarna Shopping Browser for iOS & Android
            /(kakao(?:talk|story))[\/ ]([\w\.]+)/i,                             // Kakao App
            /(naver)\(.*?(\d+\.[\w\.]+).*\)/i,                                  // Naver InApp
            /(daum)apps[\/ ]([\w\.]+)/i,                                        // Daum App
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
            /(wolvic|librewolf)\/([\w\.]+)/i                                    // Wolvic/LibreWolf
            ], [NAME, VERSION], [
            /mobile vr; rv:([\w\.]+)\).+firefox/i                               // Firefox Reality
            ], [VERSION, [NAME, FIREFOX+' Reality']], [
            /ekiohf.+(flow)\/([\w\.]+)/i,                                       // Flow
            /(swiftfox)/i,                                                      // Swiftfox
            /(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror)[\/ ]?([\w\.\+]+)/i,
                                                                                // IceDragon/Iceweasel/Camino/Chimera/Fennec/Maemo/Minimo/Conkeror
            /(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i,
                                                                                // Firefox/SeaMonkey/K-Meleon/IceCat/IceApe/Firebird/Phoenix
            /(firefox)\/([\w\.]+)/i,                                            // Other Firefox-based
            /(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i,                         // Mozilla

            // Other
            /(amaya|dillo|doris|icab|ladybird|lynx|mosaic|netsurf|obigo|polaris|w3m|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i,
                                                                                // Polaris/Lynx/Dillo/iCab/Doris/Amaya/w3m/NetSurf/Obigo/Mosaic/Go/ICE/UP.Browser/Ladybird
            /\b(links) \(([\w\.]+)/i                                            // Links
            ], [NAME, [VERSION, /_/g, '.']], [
            
            /(cobalt)\/([\w\.]+)/i                                              // Cobalt
            ], [NAME, [VERSION, /master.|lts./, ""]]
        ],

        cpu : [[

            /\b((amd|x|x86[-_]?|wow|win)64)\b/i                                 // AMD64 (x64)
            ], [[ARCHITECTURE, 'amd64']], [

            /(ia32(?=;))/i,                                                     // IA32 (quicktime)
            /\b((i[346]|x)86)(pc)?\b/i                                          // IA32 (x86)
            ], [[ARCHITECTURE, 'ia32']], [

            /\b(aarch64|arm(v?[89]e?l?|_?64))\b/i                               // ARM64
            ], [[ARCHITECTURE, 'arm64']], [

            /\b(arm(v[67])?ht?n?[fl]p?)\b/i                                     // ARMHF
            ], [[ARCHITECTURE, 'armhf']], [

            // PocketPC mistakenly identified as PowerPC
            /( (ce|mobile); ppc;|\/[\w\.]+arm\b)/i
            ], [[ARCHITECTURE, 'arm']], [

            /((ppc|powerpc)(64)?)( mac|;|\))/i                                  // PowerPC
            ], [[ARCHITECTURE, /ower/, EMPTY, lowerize]], [

            / sun4\w[;\)]/i                                                     // SPARC
            ], [[ARCHITECTURE, 'sparc']], [

            /\b(avr32|ia64(?=;)|68k(?=\))|\barm(?=v([1-7]|[5-7]1)l?|;|eabi)|(irix|mips|sparc)(64)?\b|pa-risc)/i
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
            /\b((?:s[cgp]h|gt|sm)-(?![lr])\w+|sc[g-]?[\d]+a?|galaxy nexus)/i,
            /samsung[- ]((?!sm-[lr])[-\w]+)/i,
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

            // Honor
            /\b((?:brt|eln|hey2?|gdi|jdn)-a?[lnw]09|(?:ag[rm]3?|jdn2|kob2)-a?[lw]0[09]hn)(?: bui|\)|;)/i
            ], [MODEL, [VENDOR, HONOR], [TYPE, TABLET]], [
            /honor([-\w ]+)[;\)]/i
            ], [MODEL, [VENDOR, HONOR], [TYPE, MOBILE]], [

            // Huawei
            /\b((?:ag[rs][2356]?k?|bah[234]?|bg[2o]|bt[kv]|cmr|cpn|db[ry]2?|jdn2|got|kob2?k?|mon|pce|scm|sht?|[tw]gr|vrd)-[ad]?[lw][0125][09]b?|605hw|bg2-u03|(?:gem|fdr|m2|ple|t1)-[7a]0[1-4][lu]|t1-a2[13][lw]|mediapad[\w\. ]*(?= bui|\)))\b(?!.+d\/s)/i
            ], [MODEL, [VENDOR, HUAWEI], [TYPE, TABLET]], [
            /(?:huawei)([-\w ]+)[;\)]/i,
            /\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i
            ], [MODEL, [VENDOR, HUAWEI], [TYPE, MOBILE]], [

            // Xiaomi
            /oid[^\)]+; (2[\dbc]{4}(182|283|rp\w{2})[cgl]|m2105k81a?c)(?: bui|\))/i,
            /\b((?:red)?mi[-_ ]?pad[\w- ]*)(?: bui|\))/i                                // Mi Pad tablets
            ],[[MODEL, /_/g, ' '], [VENDOR, XIAOMI], [TYPE, TABLET]], [

            /\b(poco[\w ]+|m2\d{3}j\d\d[a-z]{2})(?: bui|\))/i,                  // Xiaomi POCO
            /\b; (\w+) build\/hm\1/i,                                           // Xiaomi Hongmi 'numeric' models
            /\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i,                             // Xiaomi Hongmi
            /\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i,                   // Xiaomi Redmi
            /oid[^\)]+; (m?[12][0-389][01]\w{3,6}[c-y])( bui|; wv|\))/i,        // Xiaomi Redmi 'numeric' models
            /\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max|cc)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite|pro)?)(?: bui|\))/i, // Xiaomi Mi
            / ([\w ]+) miui\/v?\d/i
            ], [[MODEL, /_/g, ' '], [VENDOR, XIAOMI], [TYPE, MOBILE]], [

            // OPPO
            /; (\w+) bui.+ oppo/i,
            /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i
            ], [MODEL, [VENDOR, OPPO], [TYPE, MOBILE]], [
            /\b(opd2(\d{3}a?))(?: bui|\))/i
            ], [MODEL, [VENDOR, strMapper, { 'OnePlus' : ['304', '403', '203'], '*' : OPPO }], [TYPE, TABLET]], [

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
            /((?:moto(?! 360)[\w\(\) ]+|xt\d{3,4}|nexus 6)(?= bui|\)))/i
            ], [MODEL, [VENDOR, MOTOROLA], [TYPE, MOBILE]], [
            /\b(mz60\d|xoom[2 ]{0,2}) build\//i
            ], [MODEL, [VENDOR, MOTOROLA], [TYPE, TABLET]], [

            // LG
            /((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i
            ], [MODEL, [VENDOR, LG], [TYPE, TABLET]], [
            /(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i,
            /\blg[-e;\/ ]+((?!browser|netcast|android tv|watch)\w+)/i,
            /\blg-?([\d\w]+) bui/i
            ], [MODEL, [VENDOR, LG], [TYPE, MOBILE]], [

            // Lenovo
            /(ideatab[-\w ]+|602lv|d-42a|a101lv|a2109a|a3500-hv|s[56]000|pb-6505[my]|tb-?x?\d{3,4}(?:f[cu]|xu|[av])|yt\d?-[jx]?\d+[lfmx])( bui|;|\)|\/)/i,
            /lenovo ?(b[68]0[08]0-?[hf]?|tab(?:[\w- ]+?)|tb[\w-]{6,7})( bui|;|\)|\/)/i
            ], [MODEL, [VENDOR, LENOVO], [TYPE, TABLET]], [

            // Nokia
            /(nokia) (t[12][01])/i
            ], [VENDOR, MODEL, [TYPE, TABLET]], [
            /(?:maemo|nokia).*(n900|lumia \d+|rm-\d+)/i,
            /nokia[-_ ]?(([-\w\. ]*))/i
            ], [[MODEL, /_/g, ' '], [TYPE, MOBILE], [VENDOR, 'Nokia']], [

            // Google
            /(pixel (c|tablet))\b/i                                             // Google Pixel C/Tablet
            ], [MODEL, [VENDOR, GOOGLE], [TYPE, TABLET]], [
            /droid.+; (pixel[\daxl ]{0,6})(?: bui|\))/i                         // Google Pixel
            ], [MODEL, [VENDOR, GOOGLE], [TYPE, MOBILE]], [

            // Sony
            /droid.+; (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-a\w[4-7][12])(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i
            ], [MODEL, [VENDOR, SONY], [TYPE, MOBILE]], [
            /sony tablet [ps]/i,
            /\b(?:sony)?sgp\w+(?: bui|\))/i
            ], [[MODEL, 'Xperia Tablet'], [VENDOR, SONY], [TYPE, TABLET]], [

            // OnePlus
            / (kb2005|in20[12]5|be20[12][59])\b/i,
            /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i
            ], [MODEL, [VENDOR, ONEPLUS], [TYPE, MOBILE]], [

            // Amazon
            /(alexa)webm/i,
            /(kf[a-z]{2}wi|aeo(?!bc)\w\w)( bui|\))/i,                           // Kindle Fire without Silk / Echo Show
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

            // TCL
            /droid [\w\.]+; ((?:8[14]9[16]|9(?:0(?:48|60|8[01])|1(?:3[27]|66)|2(?:6[69]|9[56])|466))[gqswx])\w*(\)| bui)/i
            ], [MODEL, [VENDOR, 'TCL'], [TYPE, TABLET]], [

            // itel
            /(itel) ((\w+))/i
            ], [[VENDOR, lowerize], MODEL, [TYPE, strMapper, { 'tablet' : ['p10001l', 'w7001'], '*' : 'mobile' }]], [

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

            // Energizer
            /; (energy ?\w+)(?: bui|\))/i,
            /; energizer ([\w ]+)(?: bui|\))/i
            ], [MODEL, [VENDOR, 'Energizer'], [TYPE, MOBILE]], [

            // Cat
            /; cat (b35);/i,
            /; (b15q?|s22 flip|s48c|s62 pro)(?: bui|\))/i
            ], [MODEL, [VENDOR, 'Cat'], [TYPE, MOBILE]], [

            // Smartfren
            /((?:new )?andromax[\w- ]+)(?: bui|\))/i
            ], [MODEL, [VENDOR, 'Smartfren'], [TYPE, MOBILE]], [

            // Nothing
            /droid.+; (a(?:015|06[35]|142p?))/i
            ], [MODEL, [VENDOR, 'Nothing'], [TYPE, MOBILE]], [

            // Archos
            /; (x67 5g|tikeasy \w+|ac[1789]\d\w+)( b|\))/i,
            /archos ?(5|gamepad2?|([\w ]*[t1789]|hello) ?\d+[\w ]*)( b|\))/i
            ], [MODEL, [VENDOR, 'Archos'], [TYPE, TABLET]], [
            /archos ([\w ]+)( b|\))/i,
            /; (ac[3-6]\d\w{2,8})( b|\))/i 
            ], [MODEL, [VENDOR, 'Archos'], [TYPE, MOBILE]], [

            // MIXED
            /(imo) (tab \w+)/i,                                                 // IMO
            /(infinix) (x1101b?)/i                                              // Infinix XPad
            ], [VENDOR, MODEL, [TYPE, TABLET]], [

            /(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus(?! zenw)|dell|jolla|meizu|motorola|polytron|infinix|tecno|micromax|advan)[-_ ]?([-\w]*)/i,
                                                                                // BlackBerry/BenQ/Palm/Sony-Ericsson/Acer/Asus/Dell/Meizu/Motorola/Polytron/Infinix/Tecno/Micromax/Advan
            /; (hmd|imo) ([\w ]+?)(?: bui|\))/i,                                // HMD/IMO
            /(hp) ([\w ]+\w)/i,                                                 // HP iPAQ
            /(microsoft); (lumia[\w ]+)/i,                                      // Microsoft Lumia
            /(lenovo)[-_ ]?([-\w ]+?)(?: bui|\)|\/)/i,                          // Lenovo
            /(oppo) ?([\w ]+) bui/i                                             // OPPO
            ], [VENDOR, MODEL, [TYPE, MOBILE]], [

            /(kobo)\s(ereader|touch)/i,                                         // Kobo
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
            /((?:tegranote|shield t(?!.+d tv))[\w- ]*?)(?: b|\))/i              // Nvidia Tablets
            ], [MODEL, [VENDOR, NVIDIA], [TYPE, TABLET]], [
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
            /(shield \w+ tv)/i                                                  // Nvidia Shield TV
            ], [MODEL, [VENDOR, NVIDIA], [TYPE, SMARTTV]], [
            /\(dtv[\);].+(aquos)/i,
            /(aquos-tv[\w ]+)\)/i                                               // Sharp
            ], [MODEL, [VENDOR, SHARP], [TYPE, SMARTTV]],[
            /(bravia[\w ]+)( bui|\))/i                                              // Sony
            ], [MODEL, [VENDOR, SONY], [TYPE, SMARTTV]], [
            /(mi(tv|box)-?\w+) bui/i                                            // Xiaomi
            ], [MODEL, [VENDOR, XIAOMI], [TYPE, SMARTTV]], [
            /Hbbtv.*(technisat) (.*);/i                                         // TechniSAT
            ], [VENDOR, MODEL, [TYPE, SMARTTV]], [
            /\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i,                          // Roku
            /hbbtv\/\d+\.\d+\.\d+ +\([\w\+ ]*; *([\w\d][^;]*);([^;]*)/i         // HbbTV devices
            ], [[VENDOR, trim], [MODEL, trim], [TYPE, SMARTTV]], [
                                                                                // SmartTV from Unidentified Vendors
            /droid.+; ([\w- ]+) (?:android tv|smart[- ]?tv)/i
            ], [MODEL, [TYPE, SMARTTV]], [
            /\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i
            ], [[TYPE, SMARTTV]], [

            ///////////////////
            // CONSOLES
            ///////////////////

            /(ouya)/i,                                                          // Ouya
            /(nintendo) ([wids3utch]+)/i                                        // Nintendo
            ], [VENDOR, MODEL, [TYPE, CONSOLE]], [
            /droid.+; (shield)( bui|\))/i                                       // Nvidia Portable
            ], [MODEL, [VENDOR, NVIDIA], [TYPE, CONSOLE]], [
            /(playstation \w+)/i                                                // Playstation
            ], [MODEL, [VENDOR, SONY], [TYPE, CONSOLE]], [
            /\b(xbox(?: one)?(?!; xbox))[\); ]/i                                // Microsoft Xbox
            ], [MODEL, [VENDOR, MICROSOFT], [TYPE, CONSOLE]], [

            ///////////////////
            // WEARABLES
            ///////////////////

            /\b(sm-[lr]\d\d[0156][fnuw]?s?|gear live)\b/i                       // Samsung Galaxy Watch
            ], [MODEL, [VENDOR, SAMSUNG], [TYPE, WEARABLE]], [
            /((pebble))app/i,                                                   // Pebble
            /(asus|google|lg|oppo) ((pixel |zen)?watch[\w ]*)( bui|\))/i        // Asus ZenWatch / LG Watch / Pixel Watch
            ], [VENDOR, MODEL, [TYPE, WEARABLE]], [
            /(ow(?:19|20)?we?[1-3]{1,3})/i                                      // Oppo Watch
            ], [MODEL, [VENDOR, OPPO], [TYPE, WEARABLE]], [
            /(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i                              // Apple Watch
            ], [MODEL, [VENDOR, APPLE], [TYPE, WEARABLE]], [
            /(opwwe\d{3})/i                                                     // OnePlus Watch
            ], [MODEL, [VENDOR, ONEPLUS], [TYPE, WEARABLE]], [
            /(moto 360)/i                                                       // Motorola 360
            ], [MODEL, [VENDOR, MOTOROLA], [TYPE, WEARABLE]], [
            /(smartwatch 3)/i                                                   // Sony SmartWatch
            ], [MODEL, [VENDOR, SONY], [TYPE, WEARABLE]], [
            /(g watch r)/i                                                      // LG G Watch R
            ], [MODEL, [VENDOR, LG], [TYPE, WEARABLE]], [
            /droid.+; (wt63?0{2,3})\)/i
            ], [MODEL, [VENDOR, ZEBRA], [TYPE, WEARABLE]], [

            ///////////////////
            // XR
            ///////////////////

            /droid.+; (glass) \d/i                                              // Google Glass
            ], [MODEL, [VENDOR, GOOGLE], [TYPE, WEARABLE]], [
            /(pico) (4|neo3(?: link|pro)?)/i                                    // Pico
            ], [VENDOR, MODEL, [TYPE, WEARABLE]], [
            /; (quest( \d| pro)?)/i                                             // Oculus Quest
            ], [MODEL, [VENDOR, FACEBOOK], [TYPE, WEARABLE]], [

            ///////////////////
            // EMBEDDED
            ///////////////////

            /(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i                              // Tesla
            ], [VENDOR, [TYPE, EMBEDDED]], [
            /(aeobc)\b/i                                                        // Echo Dot
            ], [MODEL, [VENDOR, AMAZON], [TYPE, EMBEDDED]], [
            /(homepod).+mac os/i                                                // Apple HomePod
            ], [MODEL, [VENDOR, APPLE], [TYPE, EMBEDDED]], [
            /windows iot/i
            ], [[TYPE, EMBEDDED]], [

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
            /droid .+?; ([\w\. -]+)( bui|\))/i                                  // Generic Android Device
            ], [MODEL, [VENDOR, 'Generic']]
        ],

        engine : [[

            /windows.+ edge\/([\w\.]+)/i                                       // EdgeHTML
            ], [VERSION, [NAME, EDGE+'HTML']], [

            /(arkweb)\/([\w\.]+)/i                                              // ArkWeb
            ], [NAME, VERSION], [

            /webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i                         // Blink
            ], [VERSION, [NAME, 'Blink']], [

            /(presto)\/([\w\.]+)/i,                                             // Presto
            /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna|servo)\/([\w\.]+)/i, // WebKit/Trident/NetFront/NetSurf/Amaya/Lynx/w3m/Goanna/Servo
            /ekioh(flow)\/([\w\.]+)/i,                                          // Flow
            /(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i,                           // KHTML/Tasman/Links
            /(icab)[\/ ]([23]\.[\d\.]+)/i,                                      // iCab

            /\b(libweb)/i                                                       // LibWeb
            ], [NAME, VERSION], [
            /ladybird\//i
            ], [[NAME, 'LibWeb']], [

            /rv\:([\w\.]{1,9})\b.+(gecko)/i                                     // Gecko
            ], [VERSION, NAME]
        ],

        os : [[

            // Windows
            /microsoft (windows) (vista|xp)/i                                   // Windows (iTunes)
            ], [NAME, VERSION], [
            /(windows (?:phone(?: os)?|mobile|iot))[\/ ]?([\d\.\w ]*)/i         // Windows Phone
            ], [NAME, [VERSION, strMapper, windowsVersionMap]], [
            /windows nt 6\.2; (arm)/i,                                          // Windows RT
            /windows[\/ ]([ntce\d\. ]+\w)(?!.+xbox)/i,
            /(?:win(?=3|9|n)|win 9x )([nt\d\.]+)/i
            ], [[VERSION, strMapper, windowsVersionMap], [NAME, 'Windows']], [

            // iOS/macOS
            /[adehimnop]{4,7}\b(?:.*os ([\w]+) like mac|; opera)/i,             // iOS
            /(?:ios;fbsv\/|iphone.+ios[\/ ])([\d\.]+)/i,
            /cfnetwork\/.+darwin/i
            ], [[VERSION, /_/g, '.'], [NAME, 'iOS']], [
            /(mac os x) ?([\w\. ]*)/i,
            /(macintosh|mac_powerpc\b)(?!.+haiku)/i                             // Mac OS
            ], [[NAME, MAC_OS], [VERSION, /_/g, '.']], [

            // Mobile OSes
            /droid ([\w\.]+)\b.+(android[- ]x86|harmonyos)/i                    // Android-x86/HarmonyOS
            ], [VERSION, NAME], [                                               
            /(ubuntu) ([\w\.]+) like android/i                                  // Ubuntu Touch
            ], [[NAME, /(.+)/, '$1 Touch'], VERSION], [
                                                                                // Android/Blackberry/WebOS/QNX/Bada/RIM/KaiOS/Maemo/MeeGo/S40/Sailfish OS/OpenHarmony/Tizen
            /(android|bada|blackberry|kaios|maemo|meego|openharmony|qnx|rim tablet os|sailfish|series40|symbian|tizen|webos)\w*[-\/; ]?([\d\.]*)/i
            ], [NAME, VERSION], [
            /\(bb(10);/i                                                        // BlackBerry 10
            ], [VERSION, [NAME, BLACKBERRY]], [
            /(?:symbian ?os|symbos|s60(?=;)|series ?60)[-\/ ]?([\w\.]*)/i       // Symbian
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
            /(hurd|linux)(?: arm\w*| x86\w*| ?)([\w\.]*)/i,                     // Hurd/Linux
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
//# sourceMappingURL=bundle.js.map