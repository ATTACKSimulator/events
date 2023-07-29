import IEvent from "../intefaces/IEvent";
import ATSEvent from "./ATSEvent";

export default class PageLoaded extends ATSEvent implements IEvent {
	get shouldDebounce(): boolean {
		return false;
	}
	get trigger(): string {
		return "load";
	}
	get name(): string {
		return "page_loaded";
	}
	get hasTypes(): boolean {
		return false;
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
	validate(): boolean {
		return true;
	}
}