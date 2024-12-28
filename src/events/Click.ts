import IEvent from "../intefaces/IEvent";
import ATSEvent from "./ATSEvent";

export default class Click extends ATSEvent implements IEvent {
	get shouldDebounce(): boolean {
		return false;
	}
	get trigger(): string {
		return "click";
	}
	get source(): Window {
		return window;
	}
	get name(): string {
		return "button_clicked";
	}
	get hasTypes(): boolean {
		return true;
	}
	get redirectOnFinish(): boolean {
		return true;
	}
	get isBlocking(): boolean {
		return true;
	}
	get allowMultiple(): boolean {
		return false; 
	}

	isValid(event: Event): boolean {
		if (event?.target instanceof HTMLAnchorElement) {
			return this.validateAnchor(event.target);
		}
		

		if (event?.target instanceof HTMLButtonElement) {
			return this.validateButton(event.target);
		}

		// check if parents are anchor or button
		let element = event.target as HTMLElement;
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

	private validateAnchor(element: HTMLElement): boolean {
		return this.basicValidation(element);
	}

	private validateButton(element: HTMLElement): boolean {
		if (!this.basicValidation(element) || (element.hasAttribute("type") && element.getAttribute("type") === "submit")) {
			return false;
		}
			
		return true;
	}

}