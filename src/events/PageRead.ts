import IEvent from "../intefaces/IEvent";
import ATSEvent from "./ATSEvent";

export default class PageRead extends ATSEvent implements IEvent {
	private minScrollPercentage = 70;
	private minStaySeconds = 2*1000;
	private hasScrolled = false;
	private hasStayed = false;
	private customEvent: Event;
	private timeout: any;

	constructor() {
		super();
		this.customEvent = new Event(this.trigger);
		this.enable();
		console.log("Page read enabled");
	}

	get shouldDebounce(): boolean {
		return false;
	}
	get trigger(): string {
		return "page_read";
	}
	get source(): Window {
		return window;
	}
	get name(): string {
		return "page_read";
	}
	get hasTypes(): boolean {
		return false;
	}
	get redirectOnFinish(): boolean {
		return false;
	}
	get isBlocking(): boolean {
		return false;
	}
	get allowMultiple(): boolean {
		return false;
	}
	validate(): boolean {
		return true;
	}

	private enable() {
		window.onscroll = () => this.scrolled();
		this.detectFocus();
		this.detectVisibility();
		this.scrolled();
		this.timeout = setTimeout (() => this.stayed(), this.minStaySeconds);
	}

	private get visibilityProps() : [string, string] {
		if (typeof document.hidden !== "undefined") {
			return ["visibilitychange", "visibilityState"];
		}
		else if (typeof (document as any).mozHidden !== "undefined") {
			return ["mozvisibilitychange", "mozVisibilityState"];
		}
		else if (typeof (document as any).msHidden !== "undefined") {
			return ["msvisibilitychange", "msVisibilityState"];
		}
		else if (typeof (document as any).webkitHidden !== "undefined") {
			return ["webkitvisibilitychange", "webkitVisibilityState"];
		}
		throw new Error("Visibility not supported.");
	}

	private detectFocus() {
		window.addEventListener("focus", this.focusGranted.bind(this));
		window.addEventListener("blur", this.focusLost.bind(this));
	}

	private detectVisibility() {
		// check the visiblility of the page
		try {
			const [visibilityChange] = this.visibilityProps;
			document.addEventListener(visibilityChange, this.visibilityChanged.bind(this));
		} catch(_) {
			//
			return;
		}
	}

	private stopDetectingVisibility() {
		// check the visiblility of the page
		try {
			const [visibilityChange] = this.visibilityProps;
			document.removeEventListener(visibilityChange, this.visibilityChanged.bind(this));
		} catch(_) {
			//
			return;
		}
	}

	private visibilityChanged() {
		const [_, visibilityState] = this.visibilityProps;
		this.toggleTimer(document[visibilityState] === "visible");
	}

	private focusGranted() {
		this.toggleTimer(true);
	}

	private focusLost() {
		this.toggleTimer(false);
	}

	private toggleTimer(status: boolean) {
		if (this.hasStayed) { return; }

		if(status) {
			this.timeout = setTimeout (() => this.stayed(), this.minStaySeconds);
		} else {
			clearTimeout(this.timeout);
		}
	}

	private disable() {
		window.onscroll = null;
		this.stopDetectingVisibility();
		window.removeEventListener("focus", this.focusGranted.bind(this));
		window.removeEventListener("blur", this.focusLost.bind(this));
	}

	private getScrollPercent() {
		return ((document.documentElement.scrollTop + document.body.scrollTop) / (document.documentElement.scrollHeight - document.documentElement.clientHeight) * 100);
	}

	private scrolled() {
		if(this.getScrollPercent() > this.minScrollPercentage) {
			if(this.hasStayed) {
				this.dispatch();
			}
			this.hasScrolled = true;
		}
	}

	private stayed() {
		if(this.hasScrolled) {
			this.dispatch();
		}
		this.hasStayed = true;
	}

	private dispatch() {
		window.dispatchEvent(this.customEvent);
		this.disable();
	}
}