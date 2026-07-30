export type Placement = "right" | "left" | "bottom" | "top" | "center" | "sheet";

const GAP = 18;
const MARGIN = 16;
const MIN_WIDTH = 296;
const SIDE_WIDTH = 400;
const STACK_WIDTH = 460;
const SHEET_BREAKPOINT = 560;

const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max);

/**
 * Measures how tall the card wants to be at a given width.
 *
 * @param {HTMLElement} card - The card element.
 * @param {number} width - The width to measure at.
 * @returns {number} - The natural height in pixels.
 */
const naturalHeight = (card: HTMLElement, width: number): number => {
	card.style.width = `${width}px`;
	card.style.maxHeight = "none";

	return card.offsetHeight;
};

/**
 * Brings the target into view with the smallest scroll that works. Unlike
 * scrollIntoView it never re-centres an element that is already visible,
 * so the page doesn't lurch between steps.
 *
 * @param {DOMRect} rect - The target's viewport rect.
 * @param {number} reserved - Space at the bottom the card will occupy (sheet mode).
 */
export const revealTarget = (rect: DOMRect, reserved = 0): void => {
	const top = MARGIN;
	const bottom = window.innerHeight - MARGIN - reserved;

	let delta = 0;
	if (rect.height > bottom - top) {
		delta = rect.top - top;
	} else if (rect.top < top) {
		delta = rect.top - top;
	} else if (rect.bottom > bottom) {
		delta = rect.bottom - bottom;
	}

	if (Math.abs(delta) > 1) {
		window.scrollBy({ top: delta, behavior: "auto" });
	}
};

/**
 * Places the card in the roomiest spot next to the highlighted element,
 * sizing it to the space that is actually available: beside the target when
 * there is width for it, above or below when there isn't, and centred when
 * no element is highlighted.
 *
 * @param {HTMLElement} card - The card to position.
 * @param {DOMRect | null} rect - The highlighted element's rect, if any.
 * @returns {Placement} - The placement that was applied.
 */
export const placeCard = (card: HTMLElement, rect: DOMRect | null): Placement => {
	const vw = window.innerWidth;
	const vh = window.innerHeight;
	const room = vh - MARGIN * 2;

	if (vw < SHEET_BREAKPOINT) {
		const width = vw;
		const height = Math.min(naturalHeight(card, width), vh * 0.72);
		card.style.width = `${width}px`;
		card.style.maxHeight = `${Math.round(vh * 0.72)}px`;
		card.style.left = "0px";
		card.style.top = `${vh - height}px`;

		return "sheet";
	}

	if (!rect) {
		const width = Math.min(STACK_WIDTH, vw - MARGIN * 2);
		const height = Math.min(naturalHeight(card, width), room);
		card.style.maxHeight = `${room}px`;
		card.style.left = `${Math.round((vw - width) / 2)}px`;
		card.style.top = `${Math.round((vh - height) / 2)}px`;

		return "center";
	}

	const space = {
		right: vw - rect.right - GAP - MARGIN,
		left: rect.left - GAP - MARGIN,
		bottom: vh - rect.bottom - GAP - MARGIN,
		top: rect.top - GAP - MARGIN,
	};

	// Prefer the side of the target that has the most room, then fall back to
	// stacking above or below it.
	const horizontal: Placement[] = space.right >= space.left ? ["right", "left"] : ["left", "right"];
	const vertical: Placement[] = space.bottom >= space.top ? ["bottom", "top"] : ["top", "bottom"];
	const order = [...horizontal, ...vertical];

	for (const placement of order) {
		const isSide = placement === "right" || placement === "left";
		const available = space[placement];

		if (isSide) {
			if (available < MIN_WIDTH) {
				continue;
			}

			const width = clamp(available, MIN_WIDTH, SIDE_WIDTH);
			const height = naturalHeight(card, width);
			if (height > room) {
				continue;
			}

			card.style.maxHeight = `${room}px`;
			card.style.left = `${Math.round(placement === "right" ? rect.right + GAP : rect.left - GAP - width)}px`;
			card.style.top = `${Math.round(clamp(rect.top + rect.height / 2 - height / 2, MARGIN, vh - height - MARGIN))}px`;

			return placement;
		}

		const width = clamp(vw - MARGIN * 2, MIN_WIDTH, STACK_WIDTH);
		const height = naturalHeight(card, width);
		if (height > available) {
			continue;
		}

		card.style.maxHeight = `${available}px`;
		card.style.left = `${Math.round(clamp(rect.left + rect.width / 2 - width / 2, MARGIN, vw - width - MARGIN))}px`;
		card.style.top = `${Math.round(placement === "bottom" ? rect.bottom + GAP : rect.top - GAP - height)}px`;

		return placement;
	}

	// Nothing fits outright: use the largest gap and let the card scroll. Every
	// value below is clamped to the viewport — an unclamped fallback could put
	// the card at a negative offset or straight over the element it explains.
	const best = order.reduce((winner, placement) => (space[placement] > space[winner] ? placement : winner), order[0]);
	const isSide = best === "right" || best === "left";
	const width = clamp(isSide ? space[best] : vw - MARGIN * 2, Math.min(MIN_WIDTH, vw - MARGIN * 2), isSide ? SIDE_WIDTH : STACK_WIDTH);
	const limit = clamp(isSide ? room : space[best], Math.min(160, room), room);
	const height = Math.min(naturalHeight(card, width), limit);

	card.style.width = `${width}px`;
	card.style.maxHeight = `${limit}px`;

	const left = isSide
		? (best === "right" ? rect.right + GAP : rect.left - GAP - width)
		: rect.left + rect.width / 2 - width / 2;
	const top = isSide
		? rect.top + rect.height / 2 - height / 2
		: (best === "bottom" ? rect.bottom + GAP : rect.top - GAP - height);

	card.style.left = `${Math.round(clamp(left, MARGIN, Math.max(vw - width - MARGIN, MARGIN)))}px`;
	card.style.top = `${Math.round(clamp(top, MARGIN, Math.max(vh - height - MARGIN, MARGIN)))}px`;

	return best;
};
