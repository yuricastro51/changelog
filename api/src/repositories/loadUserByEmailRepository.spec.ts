import { ILoadUserByEmailRepository } from 'src/interfaces/loadUserByEmailRepository';
import MissingParamError from '../utils/errors/missingParamError';
import { IUser } from '../utils/types';
import { getMyConnection } from '../services/db';
import { User } from '../entities/user';
import { createConnection, getConnection, Repository } from 'typeorm';

class LoadUserByEmailRepository implements ILoadUserByEmailRepository {
	constructor(private repository: Repository<IUser>) {}
	async load(email: string): Promise<IUser | null> {
		if (!email) {
			throw new MissingParamError('email');
		}

		const [user] = await this.repository.find({ where: { email: email } });

		if (!user) {
			return null;
		}

		return user;
	}
}

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
			entities: [User],
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

		await repository.findOne(id);

		const user = await sut.load(validEmail);

		expect(user?.email).toBe(validEmail);
	});
});
