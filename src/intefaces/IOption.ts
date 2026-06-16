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
};

export default IOptions;
