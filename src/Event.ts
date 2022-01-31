export interface EventData {
    type?: string
    url?: string
    browser?: object
    os?: object
    screen_size?: object
    cpu?: object
    device?: object
    ua ?: string
}

export interface EventPayload {
    source: string
    timestamp: number
    ats_header: string
    event: string
    data: EventData
    sg_event_id: string
    sg_message_id: string
}

export interface IEvent {
    get trigger(): string;
    get name(): string;
    get targets(): (Window|Element)[];
    get hasTypes(): boolean;
    get redirectOnFinish(): boolean;
    allowMultiple ?: boolean;
    checkEvent(event: Event): boolean;
}