import InvalidParamError from '../../helpers/errors/invalidParamError';
import { ILoadUserByEmailRepository } from 'src/interfaces/loadUserByEmailRepository';
import MissingParamError from '../../helpers/errors/missingParamError';
import AuthUseCase from './authUseCase';
import { IEncrypter } from 'src/interfaces/encrypter';
import { User } from 'src/utils/types';

class LoadUserByEmailRepositorySpy implements ILoadUserByEmailRepository {
	email!: string;
	user!: User;

	async load(email: string): Promise<User> {
		this.email = email;

		return this.user;
	}
}

class EncrypterSpy implements IEncrypter {
	password!: string;
	hashedPassword!: string;

	async compare(password: string, hashedPassword: string): Promise<boolean> {
		this.password = password;
		this.hashedPassword = hashedPassword;

		return true;
	}
}

const makeSut = () => {
	const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy();
	loadUserByEmailRepositorySpy.user = {
		password: 'hashed_password',
		email: '',
	};

	const encrypterSpy = new EncrypterSpy();
	const sut = new AuthUseCase(loadUserByEmailRepositorySpy, encrypterSpy);

	return { sut, loadUserByEmailRepositorySpy, encrypterSpy };
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
		const sut = new AuthUseCase({} as ILoadUserByEmailRepository, {} as IEncrypter);
		const promise = sut.auth('any_email@mail.com', 'any_password');

		expect(promise).rejects.toThrow(new InvalidParamError('loadUserByEmailRepository'));
	});

	test('Should return null if an invalid email is provided', async () => {
		const { sut, loadUserByEmailRepositorySpy } = makeSut();
		loadUserByEmailRepositorySpy.user = {} as User;
		const accessToken = await sut.auth('invalid_email@mail.com', 'any_password');

		expect(accessToken).toBeNull();
	});

	test('Should return null if an invalid password is provided', async () => {
		const { sut } = makeSut();
		const accessToken = await sut.auth('valid_email@mail.com', 'invalid_password');

		expect(accessToken).toBeNull();
	});

	test('Should call Encrypter with correct values', async () => {
		const { sut, encrypterSpy, loadUserByEmailRepositorySpy } = makeSut();
		await sut.auth('valid_email@mail.com', 'any_password');

		expect(encrypterSpy.password).toBe('any_password');
		expect(encrypterSpy.hashedPassword).toBe(loadUserByEmailRepositorySpy.user.password);
	});
});
