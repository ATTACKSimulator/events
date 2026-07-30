// Shared setup for the tutorial test pages.
// Injects a fake ATTACK Simulator token (so findCampaignInfo doesn't throw)
// and instantiates ATSEvents with the tutorial enabled.
(function () {
	const params = new URLSearchParams(window.location.search);

	if (!params.has("tk")) {
		const payload = btoa(JSON.stringify({
			payload: {
				ats_company_id: "test-company",
				ats_instance_id: "test-instance",
				ats_campaign_name: "tutorial-test",
			},
		})).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
		params.set("tk", "e30." + payload + ".test");
		window.history.replaceState(null, "", window.location.pathname + "?" + params.toString());
	}

	window.atsEvents = new ATSEvents({
		apiKey: "test",
		debug: true,
		shouldRedirect: true,
		redirectUrl: "finished.html",
		url: "http://localhost:3000/v0/client-events",
		tutorial: true,
		tutorialSkippable: params.get("skippable") !== "false",
		locale: params.get("locale") || undefined,
	});
	window.atsEvents.listen();
})();
