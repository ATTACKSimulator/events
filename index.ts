import { Manager } from "./src/Manager";
import Remote from "./src/Remote";
import {removeSubdomain} from "./src/Tools";

interface Options {
	apiKey?: string,
	debug?: boolean,
	events?: string[]
	redirectUrl: string,
	source: string,
	url: string,
}

const defaultOptions: Options = {
	events: [],
	debug: false,
	redirectUrl: `https://oops.${removeSubdomain(window.location.hostname)}`,
	source: "LP",
	url: "https://api.attacksimulator.com/v0/client-events",
};

class ATSEvents {
	private manager: Manager;

	constructor(options: Options) {
		const _options = {...defaultOptions, ...options};
		if (_options.debug) {
			console.log(_options);
		}
		const remote = new Remote(_options.apiKey, _options.url, _options.debug);
		this.manager = new Manager(remote, _options.events, _options.source, _options.redirectUrl, _options.debug);
	}

	listen() {
		this.manager.listen();
	}

	stop() {
		this.manager.stop();
	}
	
	trigger(name: string) {
		this.manager.trigger(name);
	}
}

module.exports = ATSEvents;
