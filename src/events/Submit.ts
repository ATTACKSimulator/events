import IEvent from "../intefaces/IEvent";
import ATSEvent from "./ATSEvent";

export default class Submit extends ATSEvent implements IEvent {
	get shouldDebounce(): boolean {
		return false;
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
	get redirectOnFinish(): boolean {
		return true;
	}
	get isBlocking(): boolean {
		return true;
	}
	get allowMultiple(): boolean {
		return false;
	}
	validate(event: Event): boolean {
		if (event.target instanceof HTMLFormElement) {
			return this.basicValidation(event.target);
		}
		return false;
	}
    
}