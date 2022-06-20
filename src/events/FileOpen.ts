import { IEvent } from "../Event";

export class FileOpen implements IEvent {
	get redirectOnFinish(): boolean {
		return false;
	}
	get trigger(): string {
		return "";
	}
	get name(): string {
		return "file_opened";
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
	get isBlocking(): boolean {
		return true;
	}
}
