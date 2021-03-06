import { IAuthUseCase } from '../../domain/interfaces/authUseCase';
import { EmailValidator } from '../../domain/interfaces/emailValidator';
import { HttpRequestType, HttpResponseType } from '../../utils/types';
import InvalidParamError from '../errors/invalidParamError';
import MissingParamError from '../errors/missingParamError';
import ServerError from '../errors/serverError';
import UnauthorizedError from '../errors/unauthorizedError';
import LoginRouter from './loginRouter';

const makeSut = () => {
	const authUseCaseSpy = makeAuthUseCase();
	authUseCaseSpy.accessToken = 'valid_token';

	const emailValidatorSpy = makeEmailValidator();

	const sut = new LoginRouter(authUseCaseSpy, emailValidatorSpy);

	return { authUseCaseSpy, sut, emailValidatorSpy };
};

const makeAuthUseCase = () => {
	class AuthUseCaseSpy implements IAuthUseCase {
		email!: string;
		password!: string;
		accessToken!: string | null;

		async auth(email: string, password: string): Promise<string | null> {
			this.email = email;
			this.password = password;
			return this.accessToken;
		}
	}

	return new AuthUseCaseSpy();
};

const makeEmailValidator = () => {
	class EmailValidatorSpy implements EmailValidator {
		isEmailValid!: boolean;
		email!: string;

		isValid(email: string): boolean {
			this.email = email;
			return this.isEmailValid;
		}
	}

	const emailValidatorSpy = new EmailValidatorSpy();
	emailValidatorSpy.isEmailValid = true;

	return emailValidatorSpy;
};

const makeEmailValidatorWithError = () => {
	class EmailValidatorSpy implements EmailValidator {
		isValid(email: string): boolean {
			throw new Error('Method not implemented.');
		}
	}

	const emailValidatorSpy = new EmailValidatorSpy();
	return emailValidatorSpy;
};

const makeAuthUseCaseWithError = () => {
	class AuthUseCaseSpy implements IAuthUseCase {
		auth = async (email: string, password: string) => {
			throw new Error('Method not implemented.');
		};
	}

	return new AuthUseCaseSpy();
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
		expect(httpResponse.body).toBe(new MissingParamError('email').message);
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
		expect(httpResponse.body).toBe(new MissingParamError('password').message);
	});

	test('Should return 500 if httpRequest has no body', async () => {
		const { sut } = makeSut();

		const httpResponse: HttpResponseType = await sut.route({} as HttpRequestType);

		expect(httpResponse.statusCode).toBe(500);
		expect(httpResponse.body).toBe(new ServerError().message);
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
		authUseCaseSpy.accessToken = null;
		const httpRequest = {
			body: {
				password: 'invalid_password',
				email: 'invalid_email@mail.com',
			},
		};

		const httpResponse = await sut.route(httpRequest);

		expect(httpResponse.statusCode).toBe(401);
		expect(httpResponse.body).toBe(new UnauthorizedError().message);
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
		const authUseCaseSpy = makeAuthUseCaseWithError();
		const emailValidatorSpy = makeEmailValidator();
		const sut = new LoginRouter(authUseCaseSpy, emailValidatorSpy);

		const httpRequest = {
			body: {
				password: 'valid_password',
				email: 'valid_email@mail.com',
			},
		};

		const httpResponse = await sut.route(httpRequest);

		expect(httpResponse.statusCode).toBe(500);
		expect(httpResponse.body).toBe(new ServerError().message);
	});

	test('Should returns 400 if invalid email is provided', async () => {
		const { sut, emailValidatorSpy } = makeSut();
		emailValidatorSpy.isEmailValid = false;

		const httpRequest = {
			body: {
				password: 'any_password',
				email: 'invalid_email@mail.com',
			},
		};

		const httpResponse = await sut.route(httpRequest);

		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body).toBe(new InvalidParamError('email').message);
	});

	test('Should return 500 if emailValidator has no isValid method', async () => {
		const authUseCaseSpy = makeAuthUseCase();
		const sut = new LoginRouter(authUseCaseSpy, {} as EmailValidator);

		const httpRequest = {
			body: {
				password: 'any_password',
				email: 'any_email@mail.com',
			},
		};

		const httpResponse: HttpResponseType = await sut.route(httpRequest);

		expect(httpResponse.statusCode).toBe(500);
		expect(httpResponse.body).toBe(new ServerError().message);
	});

	test('Should returns 500 if emailValidator throws', async () => {
		const authUseCaseSpy = makeAuthUseCase();
		const emailValidatorSpy = makeEmailValidatorWithError();

		const sut = new LoginRouter(authUseCaseSpy, emailValidatorSpy);

		const httpRequest = {
			body: {
				password: 'valid_password',
				email: 'valid_email@mail.com',
			},
		};

		const httpResponse = await sut.route(httpRequest);

		expect(httpResponse.statusCode).toBe(500);
		expect(httpResponse.body).toBe(new ServerError().message);
	});

	test('Should call EmailValidator with correct email', async () => {
		const { sut, emailValidatorSpy } = makeSut();
		const httpRequest = {
			body: {
				password: 'any_password',
				email: 'any_email@mail.com',
			},
		};

		await sut.route(httpRequest);
		expect(emailValidatorSpy.email).toBe(httpRequest.body.email);
	});
});
