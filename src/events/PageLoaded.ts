import { IEvent } from "../Event";

export class PageLoaded implements IEvent {
	get redirectOnFinish(): boolean {
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
	get targets(): (Element|Window)[] {
		return [window];
	}
	checkEvent(): boolean {
		return true;
	}
}