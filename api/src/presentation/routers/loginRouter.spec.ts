type Login = {
	email: string;
	password: string;
};

type HttpRequest = {
	body: Login;
};

type HttpResponse = {
	statusCode: number;
};

class LoginRouter {
	route(httpRequest: HttpRequest) {
		if (!httpRequest.body || !httpRequest) {
			return { statusCode: 500 };
		}

		const { email, password } = httpRequest.body;

		if (!email || !password) {
			return {
				statusCode: 400,
			};
		}

		return { statusCode: 200 };
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

		const httpResponse: HttpResponse = sut.route(httpRequest);

		expect(httpResponse.statusCode).toBe(400);
	});

	test('Should return 400 if no password is provided', () => {
		const sut = new LoginRouter();
		const httpRequest = {
			body: {
				password: '',
				email: 'any_email@mail.com',
			},
		};

		const httpResponse: HttpResponse = sut.route(httpRequest);

		expect(httpResponse.statusCode).toBe(400);
	});

	test('Should return 500 if httpRequest has no body', () => {
		const sut = new LoginRouter();
		const httpRequest = {
			body: {
				password: '',
				email: 'any_email@mail.com',
			},
		};

		const httpResponse: HttpResponse = sut.route({} as HttpRequest);

		expect(httpResponse.statusCode).toBe(500);
	});
});
