import IEvent from "../intefaces/IEvent";
import ATSEvent from "./ATSEvent";

export default class FileDownload extends ATSEvent implements IEvent {
	get shouldDebounce(): boolean {
		return false;
	}
	get trigger(): null {
		return null;
	}
	get source(): null {
		return null;
	}
	get name(): string {
		return "file_download";
	}
	get hasTypes(): boolean {
		return true;
	}
	get redirectOnFinish(): boolean {
		return false;
	}
	get isBlocking(): boolean {
		return false;
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