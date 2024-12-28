import { BrowserInfo, findBrowserInfo } from "./BrowserInfo";
import { findCampaignInfo } from "./CampaignInfo";
import { createUUID, debounce } from "./Tools"; 

import AttachmentOpen from "./events/AttachmentOpen";
import Click from "./events/Click";
import Download from "./events/Download";
import Extension from "./events/Extension";
import FileDownload from "./events/FileDownload";
import FileOpen from "./events/FileOpen";
import Input from "./events/Input";
import Microphone from "./events/Microphone";
import Notification from "./events/Notification";
import PageLeft from "./events/PageLeft";
import PageLoaded from "./events/PageLoaded";
import PageRead from "./events/PageRead";
import Submit from "./events/Submit";
import Webcam from "./events/Webcam";
import Location from "./events/Location";
import Clipboard from "./events/Clipboard";

import IEvent from "./intefaces/IEvent";

import IEventPayload from "./intefaces/IEventPayload";
import Remote from "./Remote";

import Logger from "./Logger";
import IOptions from "./intefaces/IOption";
import ICampaignInfo from "./intefaces/ICampaignInfo";

interface EventSubscription {
	eventName: string;
	callback: (event: IEvent) => void;
}

export class Manager {
	private readonly supportedTypes : string[] = ["email", "password", "tel", "text", "given-name", "name", "family-name", "street-address", "cc-name", "cc-given-name", "cc-family-name", "cc-number", "cc-exp", "cc-exp-month", "cc-exp-year", "cc-csc", "cc-type"];
	private readonly supportedEvents = {
		"attachment_opened": AttachmentOpen,
		"button_clicked": Click,
		"download": Download,
		"extension_installed": Extension,
		"file_download": FileDownload,		
		"file_open": FileOpen,
		"input_filled": Input,
		"page_left": PageLeft,
		"page_loaded": PageLoaded,
		"page_read": PageRead,
		"mic_accepted": Microphone,
		"notification_accepted": Notification,
		"form_submitted": Submit,
		"webcam_accepted": Webcam,
		"location_accepted": Location,
		"clipboard_accepted": Clipboard,
	};
	private readonly browserInfo: BrowserInfo;
	private readonly campaignInfo: ICampaignInfo;
	private readonly redirectUrl: string;
	private readonly shouldRedirect: boolean;
	private readonly remote: Remote;
	private readonly source: string;
	private readonly token: string;

	private subscriptions: EventSubscription[] = [];

	private logger: Logger;
	private handlers = [];
	private disabledEvents = [];
	private activeEvents: IEvent[];

	constructor(remote: Remote, { eventsToInclude = [], eventsToExclude = [], source, redirectUrl, shouldRedirect, debug = false }: IOptions) {
		this.logger = new Logger(debug);

		this.remote = remote;
		[this.token, this.campaignInfo] = findCampaignInfo();
		this.browserInfo = findBrowserInfo();

		this.activeEvents = this.decideActiveEvents(eventsToInclude, eventsToExclude);
		this.logger.info(`Enabled events: ${eventsToInclude.join(" | ")}`);

		this.source = source;
		this.redirectUrl = redirectUrl;
		this.shouldRedirect = shouldRedirect;

		if (this.campaignInfo?.download_type) {
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
	private decideActiveEvents(eventsToInclude: string[], eventsToExclude: string[]): IEvent[] {
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
	private getEvent(name: string) {
		if (! this.supportedEvents[name]) {
			return null;
		}

		return new (this.supportedEvents[name]);
	}

	/**
	 * Checks the type of download specified in the campaign information and triggers the corresponding event.
	 *
	 * @returns {Promise<void>} - A promise that resolves when the appropriate event is triggered.
	 */
	private checkDownload() {
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
	public listen() {
		let i = 0;
		for(const activeEvent of this.activeEvents) {
			if (! activeEvent.trigger) {
				this.logger.info(`The active event ${activeEvent.name} does not have a trigger. Skipping...`);
			} else {
				this.logger.info(`Listening for event @${activeEvent.trigger} (${activeEvent.name})`);
				activeEvent.source.addEventListener(activeEvent.trigger, this.handlers[i++] = (event: Event) => this.prehandle(activeEvent, event));
			}
		}
	}

	/**
	 * Stops listening for the active events and removes the event handlers.
	 */
	public stop() {
		let i = 0;
		for(const activeEvent of this.activeEvents) {
			if (! activeEvent.trigger) {
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
	public trigger(eventName: string): Promise<void> {
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
	private prehandle(activeEvent: IEvent, event?: Event) {		
		if (activeEvent.shouldDebounce) {
			debounce((...args: [IEvent, Event]) => this.handle(...args), 500, activeEvent, event);
		} else {
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
	private findType(activeEvent: IEvent, event?: Event): string | null {
		if (!activeEvent.hasTypes || !event) {
			return null;
		}

		const inputElement = event.target as HTMLInputElement;
		
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
	private findName(activeEvent: IEvent, event?: Event): string {
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
	private packEvent(type: string, activeEvent: IEvent): IEventPayload {
		return {
			"data": {
				...this.browserInfo,
				type,
			},
			"source": this.source,
			"timestamp": Math.floor(Date.now() / 1000),
			"ats_header": this.token,
			"event": activeEvent.name.toLowerCase(),
			"sg_event_id": createUUID(),
			"sg_message_id": this.campaignInfo.ats_instance_id,
		};
	}

	/**
	 * Handles the active event by executing it, optionally validating it first.
	 *
	 * @param {IEvent} activeEvent - The active event to handle.
	 * @param {Event} [event] - The optional event object.
	 * @param {boolean} [shouldValidate=true] - Whether to validate the event before handling it.
	 */
	private handle(activeEvent: IEvent, event?: Event, shouldValidate = true): void {
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
	private checkEvent(activeEvent: IEvent, event: Event, shouldValidate = true): void {
		if (! activeEvent.isValid(event) && shouldValidate) {
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
	private checkMultiple(activeEvent: IEvent, event?: Event): void {
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
	private executeEvent(activeEvent: IEvent, event?: Event, shouldValidate = true): Promise<void> {
		this.logger.info(`Event @${activeEvent.trigger} (${activeEvent.name}) triggered...`);

		try {
			this.checkEvent(activeEvent, event, shouldValidate);
		} catch (e) {
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
		} catch(e) {
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

	get supportedEventNames(): string[] {
		return Object.keys(this.supportedEvents);
	}

	/**
	 * Subscribes to the specified event with a callback function.
	 *
	 * @param {string} eventName - The name of the event to subscribe to.
	 * @param {function(IEvent): void} callback - The callback function to be executed when the event is triggered.
	 * @throws {Error} - Throws an error if the event is unsupported.
	 */
	public subscribe(eventName: string, callback: (event: IEvent) => void) {
		if (! this.supportedEventNames.includes(eventName)) {
			throw new Error(`Unsupported event: ${eventName}`);
		}
		
		this.subscriptions.push({ eventName, callback});
	}

	/**
	 * Unsubscribes from the specified event by removing the callback function.
	 *
	 * @param {string} eventName - The name of the event to unsubscribe from.
	 * @param {function(IEvent): void} callback - The callback function to be removed.
	 * @throws {Error} - Throws an error if the event is unsupported.
	 */
	public unsubscribe(eventName: string, callback: (event: IEvent) => void) {
		if (! this.supportedEventNames.includes(eventName)) {
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
	public triggerSubscription(event: IEvent) {
		const subscriptions = this.subscriptions.filter(subscription => subscription.eventName === event.name);
		subscriptions.forEach(subscription => subscription.callback(event));
	}
}