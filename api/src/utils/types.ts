export type LoginType = {
	email: string;
	password: string;
};

export type HttpRequestType = {
	body: LoginType;
};

export type HttpResponseType = {
	statusCode: number;
	body: any;
};

export type User = {
	email: string;
	password: string;
};
