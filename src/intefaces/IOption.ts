type IOptions = {
	apiKey?: string;
	debug?: boolean;
	eventsToInclude?: string[];
	eventsToExclude?: string[];
	redirectUrl: string;
	shouldRedirect: boolean;
	source: string;
	url: string;
	extraPayload: object;
	tutorial?: boolean;
	tutorialSkippable?: boolean;
	locale?: string;
};

export default IOptions;
