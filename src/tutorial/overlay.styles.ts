export const OVERLAY_CSS = `
:host {
	all: initial;
}

* {
	box-sizing: border-box;
	margin: 0;
	padding: 0;
}

.overlay {
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	inset: 0;
	z-index: 2147483647;
	font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, Roboto, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	pointer-events: auto;
}

.backdrop {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	inset: 0;
	background: rgba(8, 6, 12, 0.7);
	backdrop-filter: blur(6px) saturate(0.7);
	-webkit-backdrop-filter: blur(6px) saturate(0.7);
	animation: ats-fade 0.4s ease-out both;
}

/* ---- spotlight: dim + blur everything but the target ---- */

.spotlight {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	inset: 0;
	pointer-events: none;
}

.spotlight .cut-top,
.spotlight .cut-bottom,
.spotlight .cut-left,
.spotlight .cut-right {
	position: absolute;
	background: rgba(8, 6, 12, 0.7);
	backdrop-filter: blur(6px) saturate(0.7);
	-webkit-backdrop-filter: blur(6px) saturate(0.7);
}

.spotlight .ring {
	position: absolute;
	border-radius: 10px;
	box-shadow: 0 0 0 2px rgba(255, 51, 102, 0.55), 0 0 46px rgba(255, 51, 102, 0.35);
	animation: ats-reticle 2.2s ease-in-out infinite;
}

.spotlight .ring i {
	position: absolute;
	width: 20px;
	height: 20px;
	border: 3px solid #ff3366;
}

.spotlight .ring i:nth-child(1) { top: -3px; left: -3px; border-right: 0; border-bottom: 0; border-radius: 10px 0 0 0; }
.spotlight .ring i:nth-child(2) { top: -3px; right: -3px; border-left: 0; border-bottom: 0; border-radius: 0 10px 0 0; }
.spotlight .ring i:nth-child(3) { bottom: -3px; left: -3px; border-right: 0; border-top: 0; border-radius: 0 0 0 10px; }
.spotlight .ring i:nth-child(4) { bottom: -3px; right: -3px; border-left: 0; border-top: 0; border-radius: 0 0 10px 0; }

/* ---- pointer to the browser address bar ---- */

/* One compact object rather than a floating chevron, a tail and a glow: a
   single pill whose inline arrow does the pointing. */
.arrow {
	position: fixed;
	top: 12px;
	left: 50%;
	transform: translateX(-50%);
	pointer-events: none;
}

.arrow-hint {
	display: flex;
	align-items: center;
	gap: 9px;
	background: #ff3366;
	color: #1c0810;
	font-size: 12.5px;
	font-weight: 650;
	letter-spacing: 0.005em;
	padding: 6px 16px 6px 6px;
	border-radius: 999px;
	white-space: nowrap;
	box-shadow: 0 6px 22px rgba(0, 0, 0, 0.38);
}

.arrow-mark {
	flex: none;
	width: 23px;
	height: 23px;
	border-radius: 50%;
	background: rgba(28, 8, 16, 0.16);
	display: flex;
	align-items: center;
	justify-content: center;
	animation: ats-nudge 1.9s ease-in-out infinite;
}

.arrow-mark svg {
	width: 12px;
	height: 12px;
	display: block;
}

/* ---- card: bold red, with the sharp corner aimed at the target ---- */

.card {
	position: fixed;
	left: 0;
	top: 0;
	overflow: hidden auto;
	background: linear-gradient(155deg, #ff4470 0%, #ff3366 42%, #e11d48 100%);
	border-radius: 30px 30px 30px 6px;
	corner-shape: squircle;
	box-shadow: 0 28px 70px rgba(180, 12, 55, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.3) inset;
	padding: 0 28px 24px;
	color: #1c0810;
	transition: left 0.34s cubic-bezier(0.16, 1, 0.3, 1), top 0.34s cubic-bezier(0.16, 1, 0.3, 1), width 0.34s cubic-bezier(0.16, 1, 0.3, 1), border-radius 0.34s ease;
	animation: ats-enter 0.44s cubic-bezier(0.16, 1, 0.3, 1) both;
}

/* the blunt-cut corner points back at whatever is highlighted */
.card[data-placement="right"] { border-radius: 6px 30px 30px 30px; }
.card[data-placement="left"] { border-radius: 30px 6px 30px 30px; }
.card[data-placement="bottom"] { border-radius: 6px 30px 30px 30px; }
.card[data-placement="top"] { border-radius: 30px 30px 30px 6px; }
.card[data-placement="center"] { border-radius: 30px; }

.card[data-placement="sheet"] {
	border-radius: 28px 28px 0 0;
	corner-shape: squircle;
	padding: 0 20px 20px;
}

.card[data-placement="sheet"] .rail { margin: 0 -20px 22px; }

/* hazard hatching in the corner */
.card::after {
	content: "";
	position: absolute;
	top: 0;
	right: 0;
	width: 130px;
	height: 130px;
	pointer-events: none;
	background: repeating-linear-gradient(-45deg, rgba(28, 8, 16, 0.07) 0 6px, transparent 6px 14px);
	-webkit-mask-image: linear-gradient(225deg, #000, transparent 70%);
	mask-image: linear-gradient(225deg, #000, transparent 70%);
}

.rail {
	position: sticky;
	top: 0;
	height: 3px;
	margin: 0 -28px 26px;
	background: rgba(255, 255, 255, 0.35);
	z-index: 1;
}

.rail-fill {
	display: block;
	height: 100%;
	width: 0;
	background: #1c0810;
	transition: width 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}

.head {
	display: flex;
	align-items: center;
	gap: 9px;
	margin-bottom: 18px;
	position: relative;
}

.head .icon {
	display: flex;
	width: 21px;
	height: 21px;
	flex: none;
}

.head .icon svg {
	width: 21px;
	height: 21px;
}

.head .label {
	font-size: 10.5px;
	font-weight: 800;
	letter-spacing: 0.15em;
	text-transform: uppercase;
	color: #2b0c16;
}

.head .count {
	margin-left: auto;
	font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
	font-size: 11px;
	font-weight: 600;
	letter-spacing: 0.08em;
	color: #3a1220;
}

.title {
	font-size: 25px;
	font-weight: 800;
	letter-spacing: -0.028em;
	line-height: 1.14;
	margin-bottom: 12px;
	animation: ats-slide 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.body {
	font-size: 14.5px;
	line-height: 1.62;
	color: #2b0c16;
	margin-bottom: 18px;
	animation: ats-slide 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.05s both;
}

.url-box {
	background: rgba(255, 255, 255, 0.42);
	border-radius: 14px 14px 14px 4px;
	corner-shape: squircle;
	padding: 12px 14px;
	margin-bottom: 16px;
	animation: ats-slide 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
}

.url-label {
	display: block;
	font-size: 9.5px;
	font-weight: 700;
	letter-spacing: 0.16em;
	text-transform: uppercase;
	color: #3a1220;
	margin-bottom: 8px;
}

.url-value {
	font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
	font-size: 12.5px;
	line-height: 1.75;
	color: #3a1220;
	word-break: break-all;
}

.url-value .domain {
	background: #1c0810;
	color: #ffd7e0;
	font-weight: 700;
	border-radius: 5px;
	corner-shape: squircle;
	padding: 2px 5px;
}

.reason {
	position: relative;
	font-size: 14px;
	line-height: 1.58;
	color: #1c0810;
	background: rgba(255, 255, 255, 0.42);
	border-radius: 14px 14px 14px 4px;
	corner-shape: squircle;
	padding: 13px 15px 13px 17px;
	margin-bottom: 22px;
	animation: ats-slide 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both;
}

.reason::before {
	content: "";
	position: absolute;
	top: 13px;
	bottom: 13px;
	left: 0;
	width: 3px;
	border-radius: 0 3px 3px 0;
	background: #1c0810;
}

.actions {
	display: flex;
	gap: 8px;
	animation: ats-slide 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both;
}

.btn {
	appearance: none;
	cursor: pointer;
	font-family: inherit;
	font-size: 14.5px;
	font-weight: 700;
	letter-spacing: -0.005em;
	border-radius: 13px;
	corner-shape: squircle;
	padding: 13px 20px;
	border: 1.5px solid transparent;
	transition: background 0.18s ease, border-color 0.18s ease, transform 0.12s ease;
}

.btn:active { transform: scale(0.985); }

.btn-primary {
	flex: 1;
	background: #1c0810;
	color: #fff;
}

.btn-primary:hover { background: #2b0c16; }

.btn-ghost {
	background: transparent;
	border-color: rgba(28, 8, 16, 0.4);
	color: #1c0810;
}

.btn-ghost:hover { background: rgba(28, 8, 16, 0.1); }

.skip {
	display: block;
	width: 100%;
	appearance: none;
	border: none;
	background: none;
	cursor: pointer;
	font-family: inherit;
	font-size: 12.5px;
	font-weight: 600;
	color: #3a1220;
	margin-top: 14px;
	padding: 6px;
	transition: color 0.18s ease;
}

.skip:hover { color: #1c0810; }

@keyframes ats-fade {
	from { opacity: 0; }
	to { opacity: 1; }
}

@keyframes ats-enter {
	from { opacity: 0; transform: scale(0.97); }
	to { opacity: 1; transform: none; }
}

@keyframes ats-slide {
	from { opacity: 0; transform: translateY(7px); }
	to { opacity: 1; transform: none; }
}

@keyframes ats-nudge {
	0%, 100% { transform: translateY(1.5px); }
	50% { transform: translateY(-2.5px); }
}

@keyframes ats-reticle {
	0%, 100% { box-shadow: 0 0 0 2px rgba(255, 51, 102, 0.55), 0 0 46px rgba(255, 51, 102, 0.35); }
	50% { box-shadow: 0 0 0 2px rgba(255, 51, 102, 0.8), 0 0 70px rgba(255, 51, 102, 0.5); }
}

@media (max-width: 560px) {
	.title { font-size: 21px; }
	.body, .reason { font-size: 13.5px; }
	.actions { flex-direction: column-reverse; }
	.arrow-hint { font-size: 10px; letter-spacing: 0.1em; }
}

@media (prefers-reduced-motion: reduce) {
	.backdrop, .card, .arrow, .arrow-mark, .spotlight .ring,
	.title, .body, .url-box, .reason, .actions, .rail-fill, .btn {
		animation: none;
		transition: none;
	}
}
`;
