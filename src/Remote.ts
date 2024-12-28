import IEventPayload from "./intefaces/IEventPayload";

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
	 * @returns {Promise<object|string>} - A promise that resolves to the response data, either as an object if the response is JSON, or as a string otherwise.
	 */
	public async post(data: IEventPayload): Promise<object|string> {
		if (this.debug) {
			console.log(`Sending event to ${this.url} with data:`);
			console.table(data);
		}

		const response = await fetch(this.url, {
			method: "POST",
			headers: {
				"Content-type": "application/json",
				"api-key": this.api_key,
			},
			keepalive: true,
			body: JSON.stringify(data),
		});

		const contentType = response.headers.get("content-type");
		if (contentType && contentType.indexOf("application/json") !== -1) {
			return response.json();
		} else {
			return response.text();
		}
	}
}
