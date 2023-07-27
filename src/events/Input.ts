import { IEvent } from "../Event";

export class Input implements IEvent {
	get redirectOnFinish(): boolean {
		return false;
	}
	get trigger(): string {
		return "input";
	}
	get name(): string {
		return "input_filled";
	}
	get hasTypes(): boolean {
		return true;
	}
	get targets(): Element[] {
		const elements = document.querySelectorAll("select,textarea,input");
		return [...elements].filter(element => !element.hasAttribute("ignore"));
	}
	get isBlocking(): boolean {
		return false;
	}
	checkEvent(event: InputEvent): boolean {
		const input = event.target as HTMLInputElement;
		return !!input.value.trim();
	}
}
