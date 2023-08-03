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

	public post(data: IEventPayload): Promise<object> {
		if (this.debug) {
			console.log(`Sending event to ${this.url} with data:`);
			console.table(data);
		}

		return fetch(this.url, {
			method: "POST",
			headers: {
				"Content-type": "application/json",
				"api-key": this.api_key,
			},
			keepalive: true,
			body: JSON.stringify(data),
		}).then(response => {
			const contentType = response.headers.get("content-type");
			if (contentType && contentType.indexOf("application/json") !== -1) {
				return response.json();
			} else {
				return response.text();
			}
		});
	}
}
