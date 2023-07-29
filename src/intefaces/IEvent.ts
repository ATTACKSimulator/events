export default interface IEvent {
    get shouldDebounce(): boolean;
    get trigger(): string | null;
    // the name of the event to be sent to the server
    get name(): string;
    // flag to indicate if extra information should be collected from the event
    get hasTypes(): boolean;
    // flag to indicate if the event should redirect the user to the next page
    get redirectOnFinish(): boolean;
    // flag to indicate if the event should block the default behaviour
    get isBlocking(): boolean
    // flag to indicate if the event can be triggered multiple times
    get allowMultiple(): boolean;
    // check if the event is valid
    validate(event: Event): boolean;
};
 