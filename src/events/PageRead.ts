import { IEvent } from "../Event";

export class PageRead implements IEvent {
	private minScrollPercentage = 0.1;
	private minStaySeconds = 3*60*1000;
	private hasScrolled = false;
	private hasStayed = false;
	private customEvent: Event;
	private timeout: any;

	constructor() {
		this.customEvent = new Event(this.trigger);
		this.enable();
	}

	private enable() {
		window.onscroll = () => this.scrolled();
		this.detectFocus();
		this.detectVisibility();
		this.scrolled();
		this.timeout = setTimeout (() => this.stayed(), this.minStaySeconds);
	}

	private get visibilityProps() : [string, string] {
		console.log("props");
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
		const h: HTMLElement = document.documentElement,
			b: HTMLElement = document.body;

		if (b.scrollHeight < h.scrollHeight) {
			return 1;
		}            

		return (h.scrollTop || b.scrollTop) / ((h.scrollHeight || b.scrollHeight) - h.clientHeight) * 100;
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

	get redirectOnFinish(): boolean {
		return false;
	}
	get trigger(): string {
		return "page_read";
	}
	get name(): string {
		return "page_read";
	}
	get hasTypes(): boolean {
		return false;    
	}
	get targets(): (Window|Element)[] {
		return [window];
	}
	checkEvent(): boolean {
		return true;
	}
}