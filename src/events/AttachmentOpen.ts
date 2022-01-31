import { IEvent } from "../Event";

export class AttachmentOpen implements IEvent {
	get redirectOnFinish(): boolean {
		return false;
	}
	get trigger(): string {
		return "";
	}
	get name(): string {
		return "attachment_opened";
	}
	get hasTypes(): boolean {
		return false;    
	}
	get targets(): Element[] {
		return [];
	}
	checkEvent(): boolean {
		return true;
	}
}