import { User } from '../entities/user';
import { IUpdateAccessTokenRepository } from '../interfaces/updateAccessTokenRepository';
import { IUser } from '../utils/types';
import { createConnection, getConnection, Repository } from 'typeorm';

class UpdateAccessTokenRepository implements IUpdateAccessTokenRepository {
	constructor(private repository: Repository<IUser>) {}
	async update(userId: string, accessToken: string): Promise<void> {
		const [user] = await this.repository.find({ where: { id: userId } });
		user.accessToken = accessToken;

		await this.repository.save(user);
	}
}

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
	beforeAll(() => {
		return createConnection({
			name: 'jest',
			type: 'sqlite',
			database: ':memory:',
			dropSchema: true,
			entities: ['src/entities/**/*.ts'],
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

	test('Should update the user with the given accessToken', async () => {
		const { sut, repository } = makeSut();

		const insert = await repository.insert({
			email: 'any_email@mail.com',
			password: 'any_password',
		});

		const { id } = insert.identifiers[0];

		await sut.update(id, 'valid_token');

		const [updatedUser] = await repository.find({ where: { id: id } });

		expect(updatedUser.accessToken).toBe('valid_token');
	});
});
