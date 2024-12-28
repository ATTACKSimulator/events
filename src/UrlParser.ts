interface ParameterMap {
    [s: string]: any
}
export class UrlParser {

	private parameters: ParameterMap;
	public readonly protocol: string;
	public readonly host: string;
	public readonly hostname: string;
	public readonly port: string;
	public readonly pathname: string;
	public readonly hash: string;
	public readonly search: string;

	constructor(url:string) {
		const parser = document.createElement("a");
		parser.href = url;

		this.protocol = parser.protocol; // => "http:"
		this.host = parser.host;     // => "example.com:3000"
		this.hostname = parser.hostname; // => "example.com"
		this.port = parser.port;     // => "3000"
		this.pathname = parser.pathname; // => "/pathname/"
		this.hash = parser.hash;     // => "#hash"
		this.search = parser.search.substr(1);   // => "?search=test"

		this.parseParameters();
	}

	private parseParameters() {
		this.parameters = {};

		const paramsGroup = this.search.split("&");
		for(const param of paramsGroup) {
			const [key, value] = param.split("=");
			this.parameters[key] = value;
		}
	}

	public findParam(param: string) : any {
		return this.parameters[param] || null;
	}

}