export default interface IOptions {
	apiKey?: string,
	debug?: boolean,
	eventsToInclude?: string[],
	eventsToExclude?: string[],
	redirectUrl: string,
	shouldRedirect: boolean,
	source: string,
	url: string,
}