type LoginType = {
	email: string;
	password: string;
};

type HttpRequestType = {
	body: LoginType;
};

type HttpResponseType = {
	statusCode: number;
	body: any;
};

class HttpResponse {
	static badRequest(paramName: string): HttpResponseType {
		return { statusCode: 400, body: new MissingParamError(paramName) };
	}

	static serverError(paramName: string): HttpResponseType {
		return { statusCode: 500, body: new MissingParamError(paramName) };
	}
}

class LoginRouter {
	route(httpRequest: HttpRequestType) {
		if (!httpRequest.body || !httpRequest) {
			return HttpResponse.serverError('httpRequest');
		}

		const { email, password } = httpRequest.body;

		if (!email) {
			return HttpResponse.badRequest('email');
		}

		if (!password) {
			return HttpResponse.badRequest('password');
		}

		return { statusCode: 200, body: 'ok' };
	}
}

class MissingParamError extends Error {
	constructor(paramName: string) {
		super(`Missing param: ${paramName}`);
		this.name = 'MissingParamError';
	}
}

describe('Login Router', () => {
	test('Should return 400 if no email is provided', () => {
		const sut = new LoginRouter();
		const httpRequest = {
			body: {
				password: 'any_password',
				email: '',
			},
		};

		const httpResponse: HttpResponseType = sut.route(httpRequest);

		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body).toEqual(new MissingParamError('email'));
	});

	test('Should return 400 if no password is provided', () => {
		const sut = new LoginRouter();
		const httpRequest = {
			body: {
				password: '',
				email: 'any_email@mail.com',
			},
		};

		const httpResponse: HttpResponseType = sut.route(httpRequest);

		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body).toEqual(new MissingParamError('password'));
	});

	test('Should return 500 if httpRequest has no body', () => {
		const sut = new LoginRouter();
		const httpRequest = {
			body: {
				password: '',
				email: 'any_email@mail.com',
			},
		};

		const httpResponse: HttpResponseType = sut.route({} as HttpRequestType);

		expect(httpResponse.statusCode).toBe(500);
	});
});
