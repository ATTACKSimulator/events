import IEvent from "../intefaces/IEvent";
import ATSEvent from "./ATSEvent";

export default class Input extends ATSEvent implements IEvent {
	get shouldDebounce(): boolean {
		return true;
	}
	get trigger(): string {
		return "input";
	}
	get source(): Window {
		return window;
	}
	get name(): string {
		return "input_filled";
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
		return true;
	}

	validate(event: Event): boolean {
		if (event.target instanceof HTMLInputElement) {
			return this.basicValidation(event.target) && !!event.target.value.trim();
		}
		return false;
	}
} 