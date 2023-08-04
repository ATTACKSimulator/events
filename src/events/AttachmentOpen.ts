import IEvent from "../intefaces/IEvent";
import ATSEvent from "./ATSEvent";

export default class AttachmentOpen extends ATSEvent implements IEvent {
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
		return "attachment_opened";
	}
	get hasTypes(): boolean {
		return false;
	}
	get redirectOnFinish(): boolean {
		return false;
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