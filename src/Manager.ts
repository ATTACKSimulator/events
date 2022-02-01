import { BrowserInfo, findBrowserInfo } from "./BrowserInfo";
import { CampaignInfo, findCampaignInfo } from "./CampaignInfo";
import { EventPayload, IEvent } from "./Event";

import { AttachmentOpen } from "./events/AttachmentOpen";
import { Click } from "./events/Click";
import { Download } from "./events/Download";
import { FileOpen } from "./events/FileOpen";
import { Input } from "./events/Input";
import { PageLoaded } from "./events/PageLoaded";
import { PageRead } from "./events/PageRead";
import { Submit } from "./events/Submit";

import Remote from "./Remote";
import { createUUID } from "./Tools";

export class Manager {
	private readonly supportedTypes : string[] = ["email", "password", "tel"];
	private readonly supportedEvents = {"attachment_opened": AttachmentOpen, "click": Click, "download": Download, "file_open": FileOpen, "input": Input, "page_load": PageLoaded, "page_read": PageRead, "submit": Submit, };

	private readonly browserInfo: BrowserInfo;
	private readonly campaignInfo: CampaignInfo;
	private readonly debug: boolean = false;
	private readonly redirectUrl: string;
	private readonly remote: Remote;
	private readonly source: string;
	private readonly token: string;
	
	private handlers = [];
	private disabledEvents = [];

	remoteEvents: IEvent[];

	constructor(remote: Remote, eventNames: string[], source: string, redirectUrl: string, debug = false) {
		this.remote = remote;
		[this.token, this.campaignInfo] = findCampaignInfo();
		this.browserInfo = findBrowserInfo();
		
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

	private checkDownload() {
		switch (this.campaignInfo.download_type) {
		case "file":
			return this.trigger("file_opened");
		case "attachment":
			return this.trigger("attachment_opened");
		}
	}

	private getEvent(name: string) {
		return new this.supportedEvents[name];
	}

	listen() {
		let i = 0;
		for(const remoteEvent of this.remoteEvents) {		
			if(this.debug) {
				console.log(`Listening for event @${remoteEvent.trigger} (${remoteEvent.name})`);
			}

			const targets = remoteEvent.targets;
			for(const target of targets) {
				target.addEventListener(remoteEvent.trigger, this.handlers[i++] = event => this.handle(remoteEvent, event));
			}
		}
	}

	stop() {
		let i = 0;
		for(const remoteEvent of this.remoteEvents) {		
			if(this.debug) {
				console.log(`Stopping listening for event @${remoteEvent.trigger} (${remoteEvent.name})`);
			}

			const targets = remoteEvent.targets;
			for(const target of targets) {
				target.removeEventListener(remoteEvent.trigger, this.handlers[i++]);
			}
		}
	}

	private findType(remoteEvent: IEvent, event?: Event): string | null {
		if (!remoteEvent.hasTypes || !event) {
			return null;
		}

		const inputElement = event.currentTarget as HTMLInputElement;

		if (this.supportedTypes.indexOf(inputElement.type) !== -1) {
			return inputElement.type;
		}

		if (inputElement.dataset.type) {
			return inputElement.dataset.type;
		}

		return null;
	}

	private packEvent(type, remoteEvent: IEvent): EventPayload {
		return {
			"data": {
				...this.browserInfo,
				type,
			},
			"source": this.source,
			"timestamp": Math.floor(Date.now() / 1000),
			"ats_header": this.token,
			"event": remoteEvent.name.toLowerCase(),
			"sg_event_id": createUUID(),
			"sg_message_id": this.campaignInfo.ats_instance_id,
		};
	}

	trigger(eventName: string) {
		const remoteEvent = this.supportedEvents[eventName];
		if (!remoteEvent) {
			throw new Error(`Unsupported event ${eventName}. Please choose one of ${Object.keys(this.supportedEvents).join(", ")}`);
		}
		this.handle(remoteEvent);
	}

	private handle(remoteEvent: IEvent, event?: Event) {
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
			.catch(e => {if(this.debug) { console.error(e); }})
			.finally(() => {
				if (remoteEvent.redirectOnFinish) {
					window.location.href = `${this.redirectUrl}${window.location.search}`;
				}
			});
	}
}