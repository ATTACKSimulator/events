import IEventPayload from "./intefaces/IEventPayload";

export type RemotePostOptions = {
	timeoutMs?: number;
};

export type RemoteResponse = {
	ok: boolean;
	status: number;
	contentType: string | null;
	body: object | string;
};

export default class Remote {
	private api_key: string;
	private url: string;
	private debug: boolean;

	constructor(api_key: string, url: string, debug: boolean) {
		this.api_key = api_key;
		this.url = url;
		this.debug = debug;
	}

	/**
	 * Sends a POST request with the specified data to the configured URL.
	 *
	 * @param {IEventPayload} data - The data to be sent in the POST request.
	 * @returns {Promise<RemoteResponse>} - A promise that resolves to the response status and body.
	 */
	public async post(data: IEventPayload, options: RemotePostOptions = {}): Promise<RemoteResponse> {
		if (this.debug) {
			console.log(`Sending event to ${this.url} with data:`);
			console.table(data);
		}

		const canTimeout = typeof options.timeoutMs === "number" && options.timeoutMs > 0 && typeof AbortController !== "undefined";
		const controller = canTimeout ? new AbortController() : null;
		const timeout = canTimeout ? window.setTimeout(() => controller.abort(), options.timeoutMs) : null;

		try {
			const response = await fetch(this.url, {
				method: "POST",
				headers: {
					"Content-type": "application/json",
					"api-key": this.api_key,
				},
				keepalive: true,
				signal: controller ? controller.signal : undefined,
				body: JSON.stringify(data),
			});

			const contentType = response.headers.get("content-type");
			const text = await response.text();
			let body: object | string = text;

			if (contentType && contentType.indexOf("application/json") !== -1 && text) {
				try {
					body = JSON.parse(text);
				} catch {
					body = text;
				}
			}

			return {
				ok: response.ok,
				status: response.status,
				contentType,
				body,
			};
		} finally {
			if (timeout) {
				window.clearTimeout(timeout);
			}
		}
	}
}
