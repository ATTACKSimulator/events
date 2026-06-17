type IEvent = {
	readonly shouldDebounce: boolean;
	readonly shouldDedup: boolean;
	readonly trigger: string | null;
	// the name of the event to be sent to the server
	readonly name: string;
	// flag to indicate if extra information should be collected from the event
	readonly hasTypes: boolean;
	// flag to indicate if the event should redirect the user to the next page
	readonly redirectOnFinish: boolean;
	// flag to indicate if the event should block the default behaviour
	readonly isBlocking: boolean;
	// flag to indicate if the event can be triggered multiple times
	readonly allowMultiple: boolean;
	// the event source
	readonly source: Window | Document | null;
	// check if the event is valid
	isValid(event: Event): boolean;
};

export default IEvent;
