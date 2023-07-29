export default class Logger {
	private debug: boolean;
	constructor(debug: boolean) {
		this.debug = debug;
	}

	public info(message: any): void {
		if (this.debug) {
			console.log(message);
		}
	}

	public error(message: any): void {
		if (this.debug) {
			console.error(message);
		}
	}

	public warn(message: any): void {
		if (this.debug) {
			console.warn(message);
		}
	}
}