import { HttpRequestType, HttpResponseType } from 'src/utils/types';
import MissingParamError from '../helpers/missingParamError';
import LoginRouter from './loginRouter';

const makeSut = () => {
	class AuthUseCaseSpy {
		email?: string;
		password?: string;

		auth = (email: string, password: string) => {
			this.email = email;
			this.password = password;
		};
	}

	const authUseCase = new AuthUseCaseSpy();
	const sut = new LoginRouter(authUseCase);

	return { authUseCase, sut };
};

describe('Login Router', () => {
	test('Should return 400 if no email is provided', () => {
		const { sut } = makeSut();
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
		const { sut } = makeSut();
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
		const { sut } = makeSut();

		const httpResponse: HttpResponseType = sut.route({} as HttpRequestType);

		expect(httpResponse.statusCode).toBe(500);
	});

	test('Should call AuthUseCase with correct params', () => {
		const { sut, authUseCase } = makeSut();
		const httpRequest = {
			body: {
				password: 'any_password',
				email: 'any_email@mail.com',
			},
		};

		sut.route(httpRequest);
		expect(authUseCase.email).toBe(httpRequest.body.email);
		expect(authUseCase.password).toBe(httpRequest.body.password);
	});
});
