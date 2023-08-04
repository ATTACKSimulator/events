import IEvent from "../intefaces/IEvent";
import ATSEvent from "./ATSEvent";

export default class Location extends ATSEvent implements IEvent {
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
		return "location_accepted";
	}
	get hasTypes(): boolean {
		return false;
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
	isValid(): boolean {
		return true;
	}

}