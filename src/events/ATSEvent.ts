export default class ATSEvent {
	basicValidation(element: HTMLElement) {
		if (element.hasAttribute("data-ignore")) {
			return false;
		}
		if (element.hasAttribute("@click")) {
			return false;
		}
		return true;
	}
}