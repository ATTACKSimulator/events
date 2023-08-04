import { BrowserInfo, findBrowserInfo } from "./BrowserInfo";
import { CampaignInfo, findCampaignInfo } from "./CampaignInfo";
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
import IEvent from "./intefaces/IEvent";
 
import IEventPayload from "./intefaces/IEventPayload";
import Remote from "./Remote";

import Logger from "./Logger";

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
	};
	private readonly browserInfo: BrowserInfo;
	private readonly campaignInfo: CampaignInfo;
	private readonly redirectUrl: string;
	private readonly shouldRedirect: boolean;
	private readonly remote: Remote;
	private readonly source: string;
	private readonly token: string;

	private logger: Logger;
	private handlers = [];
	private disabledEvents = [];
	private activeEvents: IEvent[];

	constructor(remote: Remote, eventNames: string[], source: string, redirectUrl: string, shouldRedirect: boolean, debug = false) {
		this.logger = new Logger(debug);

		this.remote = remote;
		[this.token, this.campaignInfo] = findCampaignInfo();
		this.browserInfo = findBrowserInfo();

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

	private getEvent(name: string) {
		if (! this.supportedEvents[name]) {
			return null;
		}

		return new (this.supportedEvents[name]);
	}

	private checkDownload() {
		switch (this.campaignInfo.download_type) {
		case "file":
			return this.trigger("file_opened");
		case "attachment":
			return this.trigger("attachment_opened");
		}
	}

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

	public trigger(eventName: string): Promise<void> {
		const activeEvent = this.getEvent(eventName);
		if (!activeEvent) {
			throw new Error(`Unsupported event ${eventName}. Please choose one of ${Object.keys(this.supportedEvents).join(", ")}`);
		}

		return this.executeEvent(activeEvent, null, false);
	}

	private prehandle(activeEvent: IEvent, event?: Event) {		
		if (activeEvent.shouldDebounce) {
			debounce((...args: [IEvent, Event]) => this.handle(...args), 500, activeEvent, event);
		} else {
			this.handle(activeEvent, event);
		}
	}

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

	private findName(activeEvent: IEvent, event?: Event): string {
		const type = this.findType(activeEvent, event);
		if (!type) {
			return activeEvent.name;
		}

		return `${activeEvent.name}-${type}`;
	}

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

	private handle(activeEvent: IEvent, event?: Event, shouldValidate = true): void {
		this.executeEvent(activeEvent, event, shouldValidate)
			.catch(e => this.logger.error(e));			
	}

	private checkEvent(activeEvent: IEvent, shouldValidate = true): void {
		if (! activeEvent.isValid(event) && shouldValidate) {
			throw new Error(`Event @${activeEvent.trigger} (${activeEvent.name}) not valid...`);
		}
	}

	private checkMultiple(activeEvent: IEvent, event?: Event): void {
		if (!activeEvent.allowMultiple) {
			const name = this.findName(activeEvent, event);
			if (this.disabledEvents.includes(name)) {
				throw new Error(`Preventing duplicate event @${activeEvent.trigger} (${name}).`);
			}

			this.disabledEvents.push(name);
		}
	}

	private executeEvent(activeEvent: IEvent, event?: Event, shouldValidate = true): Promise<void> {
		this.logger.info(`Event @${activeEvent.trigger} (${activeEvent.name}) triggered...`);

		try {
			this.checkEvent(activeEvent, shouldValidate);
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
		
		return this.remote.post(payload)
			.then(result => this.logger.info(result))
			.finally(() => {
				if (activeEvent.redirectOnFinish && this.shouldRedirect) {
					window.location.href = `${this.redirectUrl}${window.location.search}`;
				}
			});		

	}
}