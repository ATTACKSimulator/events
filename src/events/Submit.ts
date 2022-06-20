import { IEvent } from "../Event";

export class Submit implements IEvent {
	get redirectOnFinish(): boolean {
		return true;
	}
	get trigger(): string {
		return "submit";
	}
	get name(): string {
		return "form_submitted";
	}
	get hasTypes(): boolean {
		return true;
	}
	get targets(): Element[] {
		const elements = document.querySelectorAll("form");
		return [...elements].filter(element => !element.hasAttribute("ignore"));
	}
	checkEvent(event: Event): boolean {
		const element = event.target as HTMLElement;
		return element.className.indexOf("disabled") === -1;
	}
	get isBlocking(): boolean {
		return true;
	}
}
