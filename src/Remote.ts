import { EventPayload } from "./Event";

export default class Remote {
	private api_key: string;
	private url: string;
	private debug: boolean;
    
	constructor(api_key: string, url: string, debug: boolean) {
		this.api_key = api_key;
		this.url = url;
		this.debug = debug;
	}

	public post(data: EventPayload): Promise<object> {
		if (this.debug) {
			console.log(`Sending event to ${this.url} with data:`);
			console.table(data);
		}
		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.open("POST", this.url, true);
			xhr.setRequestHeader("Content-type", "application/json");
			xhr.setRequestHeader("api-key", this.api_key);
            
			xhr.onreadystatechange = function () {
				if (xhr.readyState === 4 && xhr.status === 200) {
					const json = JSON.parse(xhr.responseText);
					resolve(json);
				}
			};

			xhr.onerror = function(e) {
				reject(e);
			};

			xhr.send(JSON.stringify(data));
		});
	}
} 