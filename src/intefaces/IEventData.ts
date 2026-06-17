type IEventData = {
	type?: string;
	url?: string;
	browser?: object;
	os?: object;
	screen_size?: object;
	cpu?: object;
	device?: object;
	ip?: string;
	useragent?: string;
};

export default IEventData;
