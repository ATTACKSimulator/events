export default class ATSEvent {
	basicValidation(element: HTMLElement) {
		if (element.hasAttribute("data-ignore")) {
			return false;
		}

		// check if the element has @click with any of the .stop or .prevent modifiers
		for (const attribute of element.attributes) {
			// check if attribute starts with @click
			if (attribute.name.startsWith("@click")) {
				// check if the attribute contains .stop or .prevent
				if (attribute.name.includes(".stop") || attribute.name.includes(".prevent")) {
					return false;
				}
			}
		}

		return true;
	}
}