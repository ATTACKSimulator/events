const SPOTLIGHT_PADDING = 8;

/**
 * Dims and blurs the whole page except for a rectangular cutout around the
 * highlighted element. The cutout is built from four panels rather than a
 * single box-shadow so the dimmed area keeps its backdrop blur.
 */
export class Spotlight {
	private element: HTMLElement | null = null;
	private frame = 0;
	private running = false;
	private onRectChange: ((rect: DOMRect) => void) | null = null;
	private lastRect: DOMRect | null = null;
	// Tracked so a viewport change re-places the card even when the target,
	// being position:fixed, keeps exactly the same rect.
	private viewport = "";

	constructor(private readonly node: HTMLElement) {}

	/**
	 * Highlights the given page element, scrolling it into view and keeping
	 * the cutout in sync with scrolling, resizing and layout changes.
	 *
	 * @param {HTMLElement} element - The page element to highlight.
	 */
	show(element: HTMLElement, onRectChange: (rect: DOMRect) => void): void {
		this.element = element;
		this.onRectChange = onRectChange;
		this.node.style.display = "block";

		this.update();
		this.start();
	}

	hide(): void {
		this.element = null;
		this.onRectChange = null;
		this.lastRect = null;
		this.viewport = "";
		this.node.style.display = "none";
		this.stop();
	}

	destroy(): void {
		this.hide();
	}

	private start(): void {
		if (this.running) {
			return;
		}

		this.running = true;
		const tick = () => {
			if (!this.running) {
				return;
			}

			this.update();
			this.frame = window.requestAnimationFrame(tick);
		};
		this.frame = window.requestAnimationFrame(tick);
	}

	private stop(): void {
		this.running = false;
		if (this.frame) {
			window.cancelAnimationFrame(this.frame);
			this.frame = 0;
		}
	}

	private part(name: string): HTMLElement {
		return this.node.querySelector(`.${name}`) as HTMLElement;
	}

	private update(): void {
		// Also stop if the overlay itself was removed by the host page,
		// otherwise this loop runs for the lifetime of the tab.
		if (!this.element || !this.element.isConnected || !this.node.isConnected) {
			this.hide();
			return;
		}

		const rect = this.element.getBoundingClientRect();

		const moved = !this.lastRect
			|| Math.abs(rect.top - this.lastRect.top) > 0.5
			|| Math.abs(rect.left - this.lastRect.left) > 0.5
			|| Math.abs(rect.width - this.lastRect.width) > 0.5
			|| Math.abs(rect.height - this.lastRect.height) > 0.5;

		// Nothing moved: skip the five shadow queries and style writes that
		// would otherwise run on every single frame.
		if (!moved && this.viewport === `${window.innerWidth}x${window.innerHeight}`) {
			return;
		}

		this.lastRect = rect;
		this.viewport = `${window.innerWidth}x${window.innerHeight}`;

		if (this.onRectChange) {
			this.onRectChange(rect);
		}

		const top = Math.max(rect.top - SPOTLIGHT_PADDING, 0);
		const left = Math.max(rect.left - SPOTLIGHT_PADDING, 0);
		const right = Math.min(rect.right + SPOTLIGHT_PADDING, window.innerWidth);
		const bottom = Math.min(rect.bottom + SPOTLIGHT_PADDING, window.innerHeight);

		const above = this.part("cut-top");
		above.style.top = "0";
		above.style.left = "0";
		above.style.width = "100%";
		above.style.height = `${top}px`;

		const below = this.part("cut-bottom");
		below.style.top = `${bottom}px`;
		below.style.left = "0";
		below.style.width = "100%";
		below.style.height = `${Math.max(window.innerHeight - bottom, 0)}px`;

		const before = this.part("cut-left");
		before.style.top = `${top}px`;
		before.style.left = "0";
		before.style.width = `${left}px`;
		before.style.height = `${Math.max(bottom - top, 0)}px`;

		const after = this.part("cut-right");
		after.style.top = `${top}px`;
		after.style.left = `${right}px`;
		after.style.width = `${Math.max(window.innerWidth - right, 0)}px`;
		after.style.height = `${Math.max(bottom - top, 0)}px`;

		const ring = this.part("ring");
		ring.style.top = `${top}px`;
		ring.style.left = `${left}px`;
		ring.style.width = `${Math.max(right - left, 0)}px`;
		ring.style.height = `${Math.max(bottom - top, 0)}px`;
	}
}
