import { IEvent } from "../Event";

export class Click implements IEvent {
	get redirectOnFinish(): boolean {
		return true;
	}
	get trigger(): string {
		return "click";
	}
	get name(): string {
		return "page_left";
	}
	get hasTypes(): boolean {
		return true;
	}
	get targets(): Element[] {
		const elements = document.querySelectorAll("a:not([href$='.exe']),button:not([type=submit]),input[type=button]");
		return [...elements].filter(element => !element.hasAttribute("ignore"));
	}
	get isBlocking(): boolean {
		return true;
	}
	checkEvent(event: any): boolean {
		return event.which && event.isTrusted && event.screenX && event.screenX != 0 && event.screenY && event.screenY != 0;
	}
}
