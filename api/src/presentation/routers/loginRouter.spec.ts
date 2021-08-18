import { AuthUseCase } from 'src/domain/interfaces/authUseCase';
import { HttpRequestType, HttpResponseType } from 'src/utils/types';
import MissingParamError from '../helpers/missingParamError';
import ServerError from '../helpers/serverError';
import UnauthorizedError from '../helpers/unauthorizedError';
import LoginRouter from './loginRouter';

const makeSut = () => {
	class AuthUseCaseSpy implements AuthUseCase {
		email?: string;
		password?: string;
		accessToken?: string;

		auth = async (email: string, password: string) => {
			this.email = email;
			this.password = password;
			return this.accessToken;
		};
	}

	const authUseCaseSpy = new AuthUseCaseSpy();
	authUseCaseSpy.accessToken = 'valid_token';
	const sut = new LoginRouter(authUseCaseSpy);

	return { authUseCaseSpy, sut };
};

const makeAuthUseCaseWithError = () => {
	class AuthUseCaseSpy implements AuthUseCase {
		auth = async (email: string, password: string) => {
			throw new Error('Method not implemented.');
		};
	}

	const authUseCaseSpy = new AuthUseCaseSpy();
	const sut = new LoginRouter(authUseCaseSpy);

	return { sut, authUseCaseSpy };
};

describe('Login Router', () => {
	test('Should return 400 if no email is provided', async () => {
		const { sut } = makeSut();
		const httpRequest = {
			body: {
				password: 'any_password',
				email: '',
			},
		};

		const httpResponse: HttpResponseType = await sut.route(httpRequest);

		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body).toEqual(new MissingParamError('email'));
	});

	test('Should return 400 if no password is provided', async () => {
		const { sut } = makeSut();
		const httpRequest = {
			body: {
				password: '',
				email: 'any_email@mail.com',
			},
		};

		const httpResponse: HttpResponseType = await sut.route(httpRequest);

		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body).toEqual(new MissingParamError('password'));
	});

	test('Should return 500 if httpRequest has no body', async () => {
		const { sut } = makeSut();

		const httpResponse: HttpResponseType = await sut.route({} as HttpRequestType);

		expect(httpResponse.statusCode).toBe(500);
		expect(httpResponse.body).toEqual(new ServerError());
	});

	test('Should call AuthUseCase with correct params', async () => {
		const { sut, authUseCaseSpy } = makeSut();
		const httpRequest = {
			body: {
				password: 'any_password',
				email: 'any_email@mail.com',
			},
		};

		await sut.route(httpRequest);
		expect(authUseCaseSpy.email).toBe(httpRequest.body.email);
		expect(authUseCaseSpy.password).toBe(httpRequest.body.password);
	});

	test('Should returns 401 when invalid credentials are provided', async () => {
		const { sut, authUseCaseSpy } = makeSut();
		authUseCaseSpy.accessToken = undefined;
		const httpRequest = {
			body: {
				password: 'invalid_password',
				email: 'invalid_email@mail.com',
			},
		};

		const httpResponse = await sut.route(httpRequest);

		expect(httpResponse.statusCode).toBe(401);
		expect(httpResponse.body).toEqual(new UnauthorizedError());
	});

	test('Should returns 200 when valid credentials are provided', async () => {
		const { sut, authUseCaseSpy } = makeSut();

		const httpRequest = {
			body: {
				password: 'valid_password',
				email: 'valid_email@mail.com',
			},
		};

		const httpResponse = await sut.route(httpRequest);

		expect(httpResponse.statusCode).toBe(200);
		expect(httpResponse.body.accessToken).toEqual(authUseCaseSpy.accessToken);
	});

	test('Should returns 500 if authUseCase throws', async () => {
		const { sut, authUseCaseSpy } = makeAuthUseCaseWithError();

		const httpRequest = {
			body: {
				password: 'valid_password',
				email: 'valid_email@mail.com',
			},
		};

		const httpResponse = await sut.route(httpRequest);

		expect(httpResponse.statusCode).toBe(500);
		expect(httpResponse.body).toEqual(new ServerError());
	});
});
