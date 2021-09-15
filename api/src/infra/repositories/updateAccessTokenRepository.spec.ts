import { User } from '../../domain/entities/user';
import { IUser } from '../../utils/types';
import { createConnection, getConnection, Repository } from 'typeorm';
import InvalidParamError from '../../presentation/errors/invalidParamError';
import MissingParamError from '../../presentation/errors/missingParamError';
import { UpdateAccessTokenRepository } from './updateAccessTokenRepository';

const getRepository = () => {
	const connection = getConnection('jest');
	const repository = connection.getRepository(User);

	return repository;
};

const makeSut = () => {
	const repository = getRepository();
	const sut = new UpdateAccessTokenRepository(repository);

	return { sut, repository };
};

describe('UpdateAccessTokenRepository', () => {
	let fakeUserId: string;

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

	beforeEach(async () => {
		const repository = getRepository();
		repository.clear();

		const insert = await repository.insert({
			email: 'any_email@mail.com',
			password: 'any_password',
		});

		fakeUserId = insert.identifiers[0].id;
	});

	afterAll(() => {
		const connection = getConnection('jest');
		connection.close();
	});

	test('Should update the user with the given accessToken', async () => {
		const { sut, repository } = makeSut();

		await sut.update(fakeUserId, 'valid_token');

		const [updatedUser] = await repository.find({ where: { id: fakeUserId } });

		expect(updatedUser.accessToken).toBe('valid_token');
	});

	test('Should throw if no repository is provided', async () => {
		const sut = new UpdateAccessTokenRepository({} as Repository<IUser>);
		const promise = sut.update(fakeUserId, 'any_token');
		await expect(promise).rejects.toThrow(new InvalidParamError('repository'));
	});

	test('Should throw if no userId is provided', async () => {
		const { sut } = makeSut();
		const promise = sut.update('', 'any_token');
		await expect(promise).rejects.toThrow(new MissingParamError('userId'));
	});

	test('Should throw if no accessToken is provided', async () => {
		const { sut } = makeSut();
		const promise = sut.update(fakeUserId, '');
		await expect(promise).rejects.toThrow(new MissingParamError('accessToken'));
	});
});
