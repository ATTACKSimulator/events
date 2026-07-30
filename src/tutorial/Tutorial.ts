import Logger from "../Logger";
import { Translator } from "../i18n";
import { OVERLAY_CSS } from "./overlay.styles";
import { placeCard, revealTarget } from "./Placement";
import { Spotlight } from "./Spotlight";
import { stepsFor } from "./TutorialContent";
import { Detection, StepDefinition, StepIcon } from "./types";

const ICON_STROKE = "fill=\"none\" stroke=\"#1c0810\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"";

const ICONS: Record<StepIcon, string> = {
	url: `<svg viewBox="0 0 24 24" ${ICON_STROKE}><rect x="2" y="5" width="20" height="14" rx="3"/><circle cx="7" cy="9" r="0.5"/><circle cx="10" cy="9" r="0.5"/><path d="M5 13h11M5 16h7"/></svg>`,
	lock: `<svg viewBox="0 0 24 24" ${ICON_STROKE}><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/><circle cx="12" cy="15" r="1.5"/></svg>`,
	form: `<svg viewBox="0 0 24 24" ${ICON_STROKE}><circle cx="8" cy="12" r="4"/><path d="M12 12h9M18 12v3M21 12v2"/></svg>`,
	card: `<svg viewBox="0 0 24 24" ${ICON_STROKE}><rect x="2" y="5" width="20" height="14" rx="3"/><path d="M2 10h20M6 15h4"/></svg>`,
	clock: `<svg viewBox="0 0 24 24" ${ICON_STROKE}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>`,
	download: `<svg viewBox="0 0 24 24" ${ICON_STROKE}><path d="M12 3v11M7 10l5 5 5-5M4 19h16"/></svg>`,
	link: `<svg viewBox="0 0 24 24" ${ICON_STROKE}><path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1.5 1.5"/><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1.5-1.5"/></svg>`,
	shield: `<svg viewBox="0 0 24 24" ${ICON_STROKE}><path d="M12 3l8 3v6c0 4.5-3.5 8-8 9-4.5-1-8-4.5-8-9V6z"/><path d="M9 12l2 2 4-4"/></svg>`,
	permission: `<svg viewBox="0 0 24 24" ${ICON_STROKE}><path d="M18 9a6 6 0 1 0-12 0c0 5-2 6-2 6h16s-2-1-2-6"/><path d="M10 19a2 2 0 0 0 4 0"/></svg>`,
	mic: `<svg viewBox="0 0 24 24" ${ICON_STROKE}><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6"/></svg>`,
	webcam: `<svg viewBox="0 0 24 24" ${ICON_STROKE}><path d="M15 10l6-3v10l-6-3z"/><rect x="3" y="6" width="12" height="12" rx="3"/></svg>`,
	location: `<svg viewBox="0 0 24 24" ${ICON_STROKE}><path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>`,
	clipboard: `<svg viewBox="0 0 24 24" ${ICON_STROKE}><rect x="5" y="4" width="14" height="17" rx="2"/><rect x="9" y="2" width="6" height="4" rx="1"/><path d="M9 11h6M9 15h4"/></svg>`,
	extension: `<svg viewBox="0 0 24 24" ${ICON_STROKE}><path d="M10 4a2 2 0 1 1 4 0v2h3a1 1 0 0 1 1 1v3h2a2 2 0 1 1 0 4h-2v4a1 1 0 0 1-1 1h-4v-2a2 2 0 1 0-4 0v2H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h4z"/></svg>`,
	done: `<svg viewBox="0 0 24 24" ${ICON_STROKE}><circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.5 2.5L16 9.5"/></svg>`,
};

const ARROW_ICON = "<svg viewBox=\"0 0 12 12\" fill=\"none\" stroke=\"#1c0810\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M6 10.5V2.2\"/><path d=\"M2.2 6L6 2.2 9.8 6\"/></svg>";

export class Tutorial {
	private host: HTMLElement | null = null;
	private onResize: (() => void) | null = null;
	private root: ShadowRoot | null = null;
	private spotlight: Spotlight | null = null;
	private steps: StepDefinition[] = [];
	private currentStep = 0;
	private placed = false;
	private finished = false;

	constructor(
		private readonly t: Translator,
		private readonly skippable: boolean,
		private readonly onComplete: () => void,
		private readonly logger: Logger,
	) {}

	get isOpen(): boolean {
		return this.host !== null;
	}

	/**
	 * Whether the overlay is genuinely on screen. The pages this runs on are
	 * attacker-authored, so being mounted is not the same as being visible:
	 * a CSS rule can hide the host, a MutationObserver can detach it, and a
	 * strict CSP can drop the injected styles.
	 *
	 * @returns {boolean} - True when the card is rendered and sized.
	 */
	get isUsable(): boolean {
		if (!this.host || !this.host.isConnected || !this.root) {
			return false;
		}

		const card = this.root.querySelector(".card") as HTMLElement;
		if (!card) {
			return false;
		}

		const rect = card.getBoundingClientRect();
		if (rect.width < 80 || rect.height < 60) {
			return false;
		}

		const style = window.getComputedStyle(this.host);
		return style.display !== "none" && style.visibility !== "hidden" && style.opacity !== "0";
	}

	/**
	 * Opens the tutorial overlay for the given detection, walking the user
	 * through every dangerous item found on the page. Calls onComplete
	 * (which performs the redirect) when the user finishes or skips.
	 *
	 * @param {Detection} detection - The result of scanning the page.
	 */
	open(detection: Detection): void {
		if (this.isOpen) {
			return;
		}

		// If the tutorial already ran — for instance the user cancelled the
		// navigation in a beforeunload prompt — don't rebuild it, just leave.
		if (this.finished) {
			this.onComplete();
			return;
		}

		this.steps = stepsFor(detection);
		this.currentStep = 0;
		this.mount();
		this.renderStep();
		this.logger.info(`Tutorial opened (${detection.type}, ${this.steps.length} steps).`);
	}

	private mount(): void {
		this.host = document.createElement("div");
		this.host.setAttribute("data-ignore", "true");
		this.root = this.host.attachShadow({ mode: "closed" });

		const style = document.createElement("style");
		style.textContent = OVERLAY_CSS;
		this.root.appendChild(style);

		const overlay = document.createElement("div");
		overlay.className = "overlay";
		overlay.innerHTML = `
			<div class="backdrop"></div>
			<div class="spotlight" style="display: none;">
				<div class="cut-top"></div>
				<div class="cut-bottom"></div>
				<div class="cut-left"></div>
				<div class="cut-right"></div>
				<div class="ring"><i></i><i></i><i></i><i></i></div>
			</div>
			<div class="arrow" style="display: none;">
				<div class="arrow-hint">
					<span class="arrow-mark">${ARROW_ICON}</span>
					<span class="arrow-text"></span>
				</div>
			</div>
			<div class="card">
				<div class="rail"><span class="rail-fill"></span></div>
				<div class="head">
					<span class="icon"></span>
					<span class="label"></span>
					<span class="count"></span>
				</div>
				<h2 class="title"></h2>
				<p class="body"></p>
				<div class="url-box" style="display: none;">
					<span class="url-label"></span>
					<span class="url-value"></span>
				</div>
				<p class="reason" style="display: none;"></p>
				<div class="actions">
					<button type="button" class="btn btn-ghost back"></button>
					<button type="button" class="btn btn-primary next"></button>
				</div>
				<button type="button" class="skip"></button>
			</div>
		`;
		this.root.appendChild(overlay);

		["click", "mousedown", "mouseup", "submit", "input", "keydown", "keyup", "touchstart", "touchend"].forEach(type => {
			overlay.addEventListener(type, event => event.stopPropagation());
		});

		this.query(".label").textContent = this.t("heading");
		this.query(".arrow-text").textContent = this.t("arrow_hint");
		this.query(".back").textContent = this.t("back");

		const skip = this.query(".skip");
		if (this.skippable) {
			skip.textContent = this.t("skip");
			skip.addEventListener("click", () => this.complete());
		} else {
			skip.style.display = "none";
		}

		this.query(".back").addEventListener("click", () => this.move(-1));
		this.query(".next").addEventListener("click", () => {
			if (this.currentStep >= this.steps.length - 1) {
				this.complete();
			} else {
				this.move(1);
			}
		});

		this.spotlight = new Spotlight(this.query(".spotlight"));

		this.onResize = () => this.renderStep();
		window.addEventListener("resize", this.onResize);

		document.documentElement.appendChild(this.host);
	}

	private query(selector: string): HTMLElement {
		return this.root.querySelector(selector) as HTMLElement;
	}

	private move(delta: number): void {
		this.currentStep = Math.min(Math.max(this.currentStep + delta, 0), this.steps.length - 1);
		this.renderStep();
	}

	private renderStep(): void {
		const step = this.steps[this.currentStep];
		const isFirst = this.currentStep === 0;
		const isLast = this.currentStep === this.steps.length - 1;

		this.query(".title").textContent = this.t(step.titleKey, step.vars);
		this.query(".body").textContent = this.t(step.bodyKey, step.vars);
		this.renderUrlBox(step);

		const reason = this.query(".reason");
		const reasonKey = step.reasonKey || step.quoteKey;
		if (reasonKey) {
			reason.textContent = this.t(reasonKey, step.vars);
			reason.style.display = "block";
		} else {
			reason.style.display = "none";
		}

		this.query(".icon").innerHTML = ICONS[step.icon];

		// Numerals read the same in every language; the translated wording
		// stays available to screen readers.
		const pad = (value: number): string => (value < 10 ? `0${value}` : `${value}`);
		const count = this.query(".count");
		count.textContent = `${pad(this.currentStep + 1)} / ${pad(this.steps.length)}`;
		count.setAttribute("aria-label", this.t("progress", { n: this.currentStep + 1, total: this.steps.length }));
		this.query(".rail-fill").style.width = `${((this.currentStep + 1) / this.steps.length) * 100}%`;

		this.query(".back").style.display = isFirst ? "none" : "block";
		this.query(".next").textContent = isLast ? this.t("continue") : this.t("next");
		this.query(".skip").style.display = this.skippable && !isLast ? "block" : "none";

		this.query(".arrow").style.display = step.target === "url_bar" ? "flex" : "none";

		const backdrop = this.query(".backdrop");
		if (step.target === "element" && step.element && step.element.isConnected) {
			backdrop.style.display = "none";
			revealTarget(step.element.getBoundingClientRect(), window.innerWidth < 560 ? window.innerHeight * 0.72 : 0);
			this.spotlight.show(step.element, rect => this.place(rect));
		} else {
			backdrop.style.display = "block";
			this.spotlight.hide();
			this.place(null);
		}
	}

	/**
	 * Positions the card next to the highlighted element, or centres it when
	 * no element is highlighted.
	 *
	 * @param {DOMRect | null} rect - The highlighted element's rect, if any.
	 */
	private place(rect: DOMRect | null): void {
		const card = this.query(".card");

		// The first placement must not animate, otherwise the card visibly
		// slides in from the top-left corner it starts at.
		if (!this.placed) {
			card.style.transition = "none";
		}

		card.setAttribute("data-placement", placeCard(card, rect));

		if (!this.placed) {
			void card.offsetHeight;
			card.style.transition = "";
			this.placed = true;
		}
	}

	/**
	 * Shows the address the user was actually on, with the registrable
	 * domain — the part that decides where you really are — highlighted.
	 *
	 * @param {StepDefinition} step - The step being rendered.
	 */
	private renderUrlBox(step: StepDefinition): void {
		const box = this.query(".url-box");
		if (!step.url) {
			box.style.display = "none";
			return;
		}

		box.style.display = "block";
		this.query(".url-label").textContent = this.t("url_actual_label");

		const value = this.query(".url-value");
		value.textContent = "";
		const append = (text: string, className?: string) => {
			if (!text) {
				return;
			}

			const span = document.createElement("span");
			span.textContent = text;
			if (className) {
				span.className = className;
			}
			value.appendChild(span);
		};

		append(step.url.scheme);
		append(step.url.subdomain ? `${step.url.subdomain}.` : "");
		append(step.url.domain, "domain");
		append(step.url.path);
	}

	private complete(): void {
		if (this.finished) {
			return;
		}

		this.finished = true;
		this.logger.info("Tutorial finished, redirecting...");

		if (this.spotlight) {
			this.spotlight.destroy();
		}

		if (this.onResize) {
			window.removeEventListener("resize", this.onResize);
			this.onResize = null;
		}

		if (this.host) {
			this.host.remove();
			this.host = null;
			this.root = null;
		}

		this.onComplete();
	}
}
