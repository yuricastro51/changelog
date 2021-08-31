import InvalidParamError from '../../helpers/errors/invalidParamError';
import { ILoadUserByEmailRepository } from 'src/interfaces/loadUserByEmailRepository';
import MissingParamError from '../../helpers/errors/missingParamError';
import AuthUseCase from './authUseCase';
import { IEncrypter } from 'src/interfaces/encrypter';
import { AuthUseCaseProps, User } from '../../utils/types';
import { ITokenGenerator } from 'src/interfaces/tokenGenerator';

const makeLoadUserByEmailRepository = () => {
	class LoadUserByEmailRepositorySpy implements ILoadUserByEmailRepository {
		email!: string;
		user!: User | null;

		async load(email: string): Promise<User | null> {
			this.email = email;

			return this.user;
		}
	}

	const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy();
	loadUserByEmailRepositorySpy.user = {
		id: 'any_id',
		password: 'hashed_password',
		email: 'valid_email@mail.com',
	};

	return loadUserByEmailRepositorySpy;
};

const makeEncrypter = () => {
	class EncrypterSpy implements IEncrypter {
		password!: string;
		hashedPassword!: string;
		isValid!: boolean;

		async compare(password: string, hashedPassword: string): Promise<boolean> {
			this.password = password;
			this.hashedPassword = hashedPassword;

			return this.isValid;
		}
	}

	const encrypterSpy = new EncrypterSpy();
	encrypterSpy.isValid = true;

	return encrypterSpy;
};

const makeTokenGenerator = () => {
	class TokenGenerator implements ITokenGenerator {
		userId!: string;
		accessToken!: string;

		async generate(userId: string): Promise<string> {
			this.userId = userId;

			return this.accessToken;
		}
	}

	const tokenGeneratorSpy = new TokenGenerator();
	tokenGeneratorSpy.accessToken = 'any_token';

	return tokenGeneratorSpy;
};

const makeSut = () => {
	const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepository();
	const encrypterSpy = makeEncrypter();
	const tokenGeneratorSpy = makeTokenGenerator();

	const sut = new AuthUseCase({
		loadUserByEmailRepository: loadUserByEmailRepositorySpy,
		encrypter: encrypterSpy,
		tokenGenerator: tokenGeneratorSpy,
	});

	return { sut, loadUserByEmailRepositorySpy, encrypterSpy, tokenGeneratorSpy };
};

describe('Auth UseCase', () => {
	test('Should return error if no email is provided', async () => {
		const { sut } = makeSut();
		const promise = sut.auth('', 'any_password');

		expect(promise).rejects.toThrow(new MissingParamError('email'));
	});

	test('Should return error if no password is provided', async () => {
		const { sut } = makeSut();
		const promise = sut.auth('any_email@mail.com', '');

		expect(promise).rejects.toThrow(new MissingParamError('password'));
	});

	test('Should call LoadUserByEmailRepository with correct email', async () => {
		const { sut, loadUserByEmailRepositorySpy } = makeSut();
		await sut.auth('any_email@mail.com', 'any_password');

		expect(loadUserByEmailRepositorySpy.email).toBe('any_email@mail.com');
	});

	test('Should throw if invalid LoadUserByEmailRepository is provided', async () => {
		const sut = new AuthUseCase({
			loadUserByEmailRepository: {} as ILoadUserByEmailRepository,
			encrypter: {} as IEncrypter,
			tokenGenerator: {} as ITokenGenerator,
		});
		const promise = sut.auth('any_email@mail.com', 'any_password');

		expect(promise).rejects.toThrow();
	});

	test('Should throw if invalid Encrypter is provided', async () => {
		const sut = new AuthUseCase({
			loadUserByEmailRepository: makeLoadUserByEmailRepository(),
			encrypter: {} as IEncrypter,
			tokenGenerator: {} as ITokenGenerator,
		});
		const promise = sut.auth('any_email@mail.com', 'any_password');

		expect(promise).rejects.toThrow();
	});

	test('Should throw if invalid TokenGenerator is provided', async () => {
		const sut = new AuthUseCase({
			loadUserByEmailRepository: makeLoadUserByEmailRepository(),
			encrypter: makeEncrypter(),
			tokenGenerator: {} as ITokenGenerator,
		});
		const promise = sut.auth('any_email@mail.com', 'any_password');

		expect(promise).rejects.toThrow();
	});

	test('Should return null if an invalid email is provided', async () => {
		const { sut, loadUserByEmailRepositorySpy } = makeSut();
		loadUserByEmailRepositorySpy.user = null;
		const accessToken = await sut.auth('invalid_email@mail.com', 'any_password');

		expect(accessToken).toBeNull();
	});

	test('Should return null if an invalid password is provided', async () => {
		const { sut, encrypterSpy } = makeSut();
		encrypterSpy.isValid = false;

		const accessToken = await sut.auth('valid_email@mail.com', 'invalid_password');

		expect(accessToken).toBeNull();
	});

	test('Should call Encrypter with correct values', async () => {
		const { sut, encrypterSpy, loadUserByEmailRepositorySpy } = makeSut();
		await sut.auth('valid_email@mail.com', 'any_password');

		expect(encrypterSpy.password).toBe('any_password');
		expect(encrypterSpy.hashedPassword).toBe(loadUserByEmailRepositorySpy.user?.password);
	});

	test('Should call TokenGenerator with correct userId', async () => {
		const { sut, loadUserByEmailRepositorySpy, tokenGeneratorSpy } = makeSut();
		await sut.auth('valid_email@mail.com', 'valid_password');

		expect(tokenGeneratorSpy.userId).toBe(loadUserByEmailRepositorySpy.user?.id);
	});

	test('Should return an accessToken if correct credentials are provided', async () => {
		const { sut, tokenGeneratorSpy } = makeSut();
		const accessToken = await sut.auth('valid_email@mail.com', 'valid_password');

		expect(tokenGeneratorSpy.accessToken).toBe(accessToken);
		expect(tokenGeneratorSpy.accessToken).toBeTruthy();
	});
});
