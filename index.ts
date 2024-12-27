import { Manager } from "./src/Manager";
import Remote from "./src/Remote";
import {removeSubdomain} from "./src/Tools";
import IOptions from "./src/intefaces/IOption";

const defaultOptions: IOptions = {
	eventsToInclude: [],
	eventsToExclude: [],
	debug: false,
	shouldRedirect: true,
	redirectUrl: `https://oops.${removeSubdomain(window.location.hostname)}`,
	source: "LP",
	url: "https://api.attacksimulator.com/v0/client-events",
};

class ATSEvents {
	private manager: Manager;

	constructor(options: IOptions) {
		const _options = {...defaultOptions, ...options};
		if (_options.debug) {
			console.log(_options);
		}
		const remote = new Remote(_options.apiKey, _options.url, _options.debug);
		this.manager = new Manager(remote, _options);
	}

	listen() {
		this.manager.listen();
	}

	on(eventName: string, callback) {
		this.manager.subscribe(eventName, callback);
	}

	off(eventName: string, callback) {
		this.manager.unsubscribe(eventName, callback);
	}

	stop() {
		this.manager.stop();
	}

	trigger(name: string): Promise<void> {
		return this.manager.trigger(name);
	}
}

module.exports = ATSEvents;
