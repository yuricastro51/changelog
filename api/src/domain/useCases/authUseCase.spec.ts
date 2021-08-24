import InvalidParamError from '../../helpers/errors/invalidParamError';
import { ILoadUserByEmailRepository } from 'src/interfaces/loadUserByEmailRepository';
import MissingParamError from '../../helpers/errors/missingParamError';

class LoadUserByEmailRepositorySpy implements ILoadUserByEmailRepository {
	email!: string;
	load(email: string) {
		this.email = email;
	}
}

class AuthUseCase implements AuthUseCase {
	constructor(private loadUserByEmailRepository: ILoadUserByEmailRepository) {}
	async auth(email: string, password: string) {
		if (!email) {
			throw new MissingParamError('email');
		}
		if (!password) {
			throw new MissingParamError('password');
		}

		if (!this.loadUserByEmailRepository.load) {
			throw new InvalidParamError('loadUserByEmailRepository');
		}

		await this.loadUserByEmailRepository.load(email);

		return 'valid_token';
	}
}

const makeSut = () => {
	const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy();

	const sut = new AuthUseCase(loadUserByEmailRepositorySpy);

	return { sut, loadUserByEmailRepositorySpy };
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

	test('Should throw if no LoadUserByEmailRepository is provided', async () => {
		const sut = new AuthUseCase({} as ILoadUserByEmailRepository);

		const promise = sut.auth('any_email@mail.com', 'any_password');

		expect(promise).rejects.toThrow(new InvalidParamError('loadUserByEmailRepository'));
	});

	test('Should return a token if valid params are provided', async () => {
		const { sut } = makeSut();
		const token = await sut.auth('valid_email@mail.com', 'valid_password');

		expect(token).toBe('valid_token');
	});
});
