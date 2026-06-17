import Logger from "./Logger";
import Remote, { RemoteResponse } from "./Remote";
import { createUUID } from "./Tools";
import IEventPayload, { IEventPayloadDraft } from "./intefaces/IEventPayload";

type QueueStatus = "pending" | "sending" | "sent" | "failed";

type QueueItem = {
	payload: IEventPayload;
	status: QueueStatus;
	attempts: number;
	createdAt: number;
	updatedAt: number;
	response?: RemoteResponse;
	error?: unknown;
};

type SendOptions = {
	maxAttempts?: number;
	timeoutMs?: number;
};

const MAX_ATTEMPTS = 3;
const RETRY_DELAYS_MS = [500, 1500];
const RETRY_JITTER_MS = 100;
const REQUEST_TIMEOUT_MS = 5000;

export default class EventSender {
	private pending: QueueItem[] = [];
	private sending: QueueItem[] = [];
	private sent: QueueItem[] = [];
	private failed: QueueItem[] = [];

	constructor(private remote: Remote, private logger: Logger) {}

	public async send(payloadDraft: IEventPayloadDraft, options: SendOptions = {}): Promise<RemoteResponse | null> {
		const item = this.enqueue(payloadDraft);
		return this.sendItem(item, options);
	}

	private enqueue(payloadDraft: IEventPayloadDraft): QueueItem {
		const now = Date.now();
		const item: QueueItem = {
			payload: {
				...payloadDraft,
				sg_event_id: payloadDraft.sg_event_id || createUUID(),
			},
			status: "pending",
			attempts: 0,
			createdAt: now,
			updatedAt: now,
		};

		this.pending.push(item);
		return item;
	}

	private async sendItem(item: QueueItem, options: SendOptions): Promise<RemoteResponse | null> {
		const maxAttempts = options.maxAttempts || MAX_ATTEMPTS;
		const timeoutMs = options.timeoutMs || REQUEST_TIMEOUT_MS;

		while (item.attempts < maxAttempts) {
			if (item.attempts > 0) {
				await this.wait(this.retryDelay(item.attempts));
			}

			this.moveItem(item, "sending");
			item.attempts++;

			try {
				const response = await this.remote.post(item.payload, { timeoutMs });
				item.response = response;
				item.error = undefined;

				if (response.ok) {
					this.moveItem(item, "sent");
					return response;
				}

				if (!this.shouldRetryStatus(response.status) || item.attempts >= maxAttempts) {
					this.failItem(item);
					return null;
				}

				this.logger.warn(`Retrying event ${item.payload.sg_event_id} after HTTP ${response.status}.`);
				this.moveItem(item, "pending");
			} catch (error) {
				item.error = error;
				item.response = undefined;

				if (item.attempts >= maxAttempts) {
					this.failItem(item);
					return null;
				}

				this.logger.warn(`Retrying event ${item.payload.sg_event_id} after a network error.`);
				this.moveItem(item, "pending");
			}
		}

		this.failItem(item);
		return null;
	}

	private shouldRetryStatus(status: number): boolean {
		return status === 408 || status === 429 || status >= 500;
	}

	private retryDelay(attemptsCompleted: number): number {
		const delay = RETRY_DELAYS_MS[attemptsCompleted - 1] || RETRY_DELAYS_MS[RETRY_DELAYS_MS.length - 1];
		const jitter = Math.floor(Math.random() * RETRY_JITTER_MS);
		return delay + jitter;
	}

	private wait(delay: number): Promise<void> {
		return new Promise(resolve => window.setTimeout(resolve, delay));
	}

	private moveItem(item: QueueItem, status: QueueStatus): void {
		this.removeItem(item);
		item.status = status;
		item.updatedAt = Date.now();
		this[status].push(item);
	}

	private removeItem(item: QueueItem): void {
		this.pending = this.pending.filter(queueItem => queueItem !== item);
		this.sending = this.sending.filter(queueItem => queueItem !== item);
		this.sent = this.sent.filter(queueItem => queueItem !== item);
		this.failed = this.failed.filter(queueItem => queueItem !== item);
	}

	private failItem(item: QueueItem): void {
		this.moveItem(item, "failed");

		if (item.response) {
			this.logger.error({
				message: `Failed to send event ${item.payload.sg_event_id} after ${item.attempts} attempts.`,
				status: item.response.status,
				body: item.response.body,
			});
			return;
		}

		this.logger.error({
			message: `Failed to send event ${item.payload.sg_event_id} after ${item.attempts} attempts.`,
			error: item.error,
		});
	}
}
