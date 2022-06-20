import { IEvent } from "../Event";

export class Download implements IEvent {
	get redirectOnFinish(): boolean {
		return true;
	}
	get trigger(): string {
		return "click";
	}
	get name(): string {
		return "download_file_event";
	}
	get hasTypes(): boolean {
		return true;
	}
	get targets(): Element[] {
		const elements = document.querySelectorAll("a[href$='.exe']");
		return [...elements].filter(element => !element.hasAttribute("ignore"));
	}
	checkEvent(event: any): boolean {
		return event.which && event.isTrusted && event.screenX && event.screenX != 0 && event.screenY && event.screenY != 0;
	}
	get isBlocking(): boolean {
		return true;
	}
}
