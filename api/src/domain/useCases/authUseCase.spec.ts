import { ILoadUserByEmailRepository } from 'src/domain/interfaces/loadUserByEmailRepository';
import MissingParamError from '../../presentation/errors/missingParamError';
import AuthUseCase from './authUseCase';
import { IEncrypter } from 'src/domain/interfaces/encrypter';
import { IUser } from '../../utils/types';
import { ITokenGenerator } from 'src/domain/interfaces/tokenGenerator';
import { IAuthUseCase } from 'src/domain/interfaces/authUseCase';
import { IUpdateAccessTokenRepository } from 'src/domain/interfaces/updateAccessTokenRepository';

const makeLoadUserByEmailRepository = () => {
	class LoadUserByEmailRepositorySpy implements ILoadUserByEmailRepository {
		email!: string;
		user!: IUser | null;

		async load(email: string): Promise<IUser | null> {
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

const makeLoadUserByEmailRepositoryWithError = () => {
	class LoadUserByEmailRepositorySpy implements ILoadUserByEmailRepository {
		email!: string;
		user!: IUser | null;

		async load(email: string): Promise<IUser | null> {
			throw new Error();
		}
	}

	return new LoadUserByEmailRepositorySpy();
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

const makeEncrypterWithError = () => {
	class EncrypterSpy implements IEncrypter {
		password!: string;
		hashedPassword!: string;
		isValid!: boolean;

		async compare(password: string, hashedPassword: string): Promise<boolean> {
			throw new Error();
		}
	}

	return new EncrypterSpy();
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

const makeTokenGeneratorWithError = () => {
	class TokenGenerator implements ITokenGenerator {
		userId!: string;
		accessToken!: string;

		async generate(userId: string): Promise<string> {
			throw new Error();
		}
	}

	return new TokenGenerator();
};

const makeUpdateAccessTokenRepository = () => {
	class UpdateAccessTokenRepositorySpy implements IUpdateAccessTokenRepository {
		userId!: string;
		accessToken!: string;

		async update(userId: string, accessToken: string): Promise<void> {
			this.userId = userId;
			this.accessToken = accessToken;
		}
	}

	const updateAccessTokenRepositorySpy = new UpdateAccessTokenRepositorySpy();

	return updateAccessTokenRepositorySpy;
};

const makeUpdateAccessTokenRepositoryWithError = () => {
	class UpdateAccessTokenRepositorySpy implements IUpdateAccessTokenRepository {
		userId!: string;
		accessToken!: string;

		async update(userId: string, accessToken: string): Promise<void> {
			throw new Error();
		}
	}

	return new UpdateAccessTokenRepositorySpy();
};

const makeSut = () => {
	const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepository();
	const encrypterSpy = makeEncrypter();
	const tokenGeneratorSpy = makeTokenGenerator();
	const updateAccessTokenRepositorySpy = makeUpdateAccessTokenRepository();

	const sut = new AuthUseCase({
		loadUserByEmailRepository: loadUserByEmailRepositorySpy,
		encrypter: encrypterSpy,
		tokenGenerator: tokenGeneratorSpy,
		updateAccessTokenRepository: updateAccessTokenRepositorySpy,
	});

	return {
		sut,
		loadUserByEmailRepositorySpy,
		encrypterSpy,
		tokenGeneratorSpy,
		updateAccessTokenRepositorySpy,
	};
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
			updateAccessTokenRepository: {} as IUpdateAccessTokenRepository,
		});
		const promise = sut.auth('any_email@mail.com', 'any_password');

		expect(promise).rejects.toThrow();
	});

	test('Should throw if invalid Encrypter is provided', async () => {
		const sut = new AuthUseCase({
			loadUserByEmailRepository: makeLoadUserByEmailRepository(),
			encrypter: {} as IEncrypter,
			tokenGenerator: {} as ITokenGenerator,
			updateAccessTokenRepository: {} as IUpdateAccessTokenRepository,
		});
		const promise = sut.auth('any_email@mail.com', 'any_password');

		expect(promise).rejects.toThrow();
	});

	test('Should throw if invalid TokenGenerator is provided', async () => {
		const sut = new AuthUseCase({
			loadUserByEmailRepository: makeLoadUserByEmailRepository(),
			encrypter: makeEncrypter(),
			tokenGenerator: {} as ITokenGenerator,
			updateAccessTokenRepository: {} as IUpdateAccessTokenRepository,
		});
		const promise = sut.auth('any_email@mail.com', 'any_password');

		expect(promise).rejects.toThrow();
	});

	test('Should throw if invalid UpdateAccessTokenRepository is provided', async () => {
		const sut = new AuthUseCase({
			loadUserByEmailRepository: makeLoadUserByEmailRepository(),
			encrypter: makeEncrypter(),
			tokenGenerator: makeTokenGenerator(),
			updateAccessTokenRepository: {} as IUpdateAccessTokenRepository,
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

	test('Should call UpdateAccessTokenRepository with correct values', async () => {
		const {
			sut,
			updateAccessTokenRepositorySpy,
			loadUserByEmailRepositorySpy,
			tokenGeneratorSpy,
		} = makeSut();
		await sut.auth('valid_email@mail.com', 'valid_password');

		expect(updateAccessTokenRepositorySpy.userId).toBe(
			loadUserByEmailRepositorySpy.user?.id,
		);
		expect(updateAccessTokenRepositorySpy.accessToken).toBe(
			tokenGeneratorSpy.accessToken,
		);
	});

	test('Should throw if dependency throws', async () => {
		const suts: IAuthUseCase[] = [
			new AuthUseCase({
				loadUserByEmailRepository: makeLoadUserByEmailRepositoryWithError(),
				encrypter: makeEncrypter(),
				tokenGenerator: makeTokenGenerator(),
				updateAccessTokenRepository: makeUpdateAccessTokenRepository(),
			}),
			new AuthUseCase({
				loadUserByEmailRepository: makeLoadUserByEmailRepository(),
				encrypter: makeEncrypterWithError(),
				tokenGenerator: makeTokenGenerator(),
				updateAccessTokenRepository: makeUpdateAccessTokenRepository(),
			}),
			new AuthUseCase({
				loadUserByEmailRepository: makeLoadUserByEmailRepository(),
				encrypter: makeEncrypter(),
				tokenGenerator: makeTokenGeneratorWithError(),
				updateAccessTokenRepository: makeUpdateAccessTokenRepository(),
			}),
			new AuthUseCase({
				loadUserByEmailRepository: makeLoadUserByEmailRepository(),
				encrypter: makeEncrypter(),
				tokenGenerator: makeTokenGenerator(),
				updateAccessTokenRepository: makeUpdateAccessTokenRepositoryWithError(),
			}),
		];

		for (const sut of suts) {
			const promise = sut.auth('any_email@mail.com', 'any_password');
			expect(promise).rejects.toThrow();
		}
	});
});
