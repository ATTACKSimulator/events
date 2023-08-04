import IEvent from "../intefaces/IEvent";
import ATSEvent from "./ATSEvent";

export default class Download extends ATSEvent implements IEvent {
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
		return "download_file_event";
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