import { HttpRequestType, HttpResponseType } from 'src/utils/types';
import MissingParamError from '../helpers/missingParamError';
import LoginRouter from './loginRouter';

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
