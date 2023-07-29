import IEventData from "./IEventData";

export default interface IEventPayload {
    source: string
    timestamp: number
    ats_header: string
    event: string
    data: IEventData
    sg_event_id: string
    sg_message_id: string
};
 