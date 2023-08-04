import IEvent from "../intefaces/IEvent";
import ATSEvent from "./ATSEvent";

export default class PageLoaded extends ATSEvent implements IEvent {
	get shouldDebounce(): boolean {
		return false;
	}
	get trigger(): null {
		return null;
	}
	get source(): Document {
		return document;
	}
	get name(): string {
		return "page_left";
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
	isValid(): boolean {
		return document.visibilityState === "hidden";
	}
}