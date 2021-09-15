import MissingParamError from '../../presentation/errors/missingParamError';
import { User } from '../../domain/entities/user';
import { createConnection, getConnection, Repository } from 'typeorm';
import { LoadUserByEmailRepository } from './loadUserByEmailRepository';
import { IUser } from '../../utils/types';
import InvalidParamError from '../../presentation/errors/invalidParamError';

const getRepository = () => {
	const connection = getConnection('jest');
	const repository = connection.getRepository(User);

	return repository;
};

const makeSut = async () => {
	const repository = getRepository();
	const sut = new LoadUserByEmailRepository(repository);

	return { sut, repository };
};

describe('LoadUserByEmailRepository', () => {
	beforeAll(() => {
		return createConnection({
			name: 'jest',
			type: 'sqlite',
			database: ':memory:',
			dropSchema: true,
			entities: ['src/domain/entities/**/*.ts'],
			synchronize: true,
			logging: false,
		});
	});

	beforeEach(() => {
		const repository = getRepository();
		repository.clear();
	});

	afterAll(() => {
		const connection = getConnection('jest');
		connection.close();
	});

	test('Should throw if no email is provided', async () => {
		const { sut } = await makeSut();
		const user = sut.load('');
		await expect(user).rejects.toThrow(new MissingParamError('email'));
	});

	test('Should throw if no repository is provided', async () => {
		const sut = new LoadUserByEmailRepository({} as Repository<IUser>);
		const user = sut.load('any_email@mail.com');
		await expect(user).rejects.toThrow(new InvalidParamError('repository'));
	});

	test('Should return null if no user is found', async () => {
		const { sut } = await makeSut();
		const user = await sut.load('invalid_email@mail.com');
		expect(user).toBeNull();
	});

	test('Should return an user if user is found', async () => {
		const { sut, repository } = await makeSut();

		const validEmail = 'valid_email@mail.com';

		const insert = await repository.insert({
			email: validEmail,
			password: 'any_password',
		});

		const { id } = insert.identifiers[0];

		const user = await sut.load(validEmail);

		expect(user?.id).toEqual(id);
	});
});
