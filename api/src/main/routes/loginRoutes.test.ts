import { User } from '../../domain/entities/user';
import supertest from 'supertest';
import { createConnection, getConnection } from 'typeorm';
import init from '../config/app';

const getRepository = () => {
	const connection = getConnection('changelog');
	const repository = connection.getRepository(User);

	return repository;
};

describe('Login Routes', () => {
	beforeAll(() => {
		return createConnection({
			name: 'changelog',
			type: 'sqlite',
			database: ':memory:',
			dropSchema: true,
			entities: ['src/domain/entities/**/*.ts'],
			synchronize: true,
			logging: false,
		});
	});

	afterAll(() => {
		const connection = getConnection('changelog');
		connection.close();
	});

	test('Should return 200 when valid credentials are provided', async () => {
		const repository = getRepository();

		await repository.insert({
			email: 'valid_email@mail.com',
			password: '$2b$04$hzl.4IfdsFXYyfMjPdORFOkwNyS0w9T/zF8BAy8LLgsCSVr0y6t.u',
		});

		const app = await init();

		await supertest(app)
			.post('/login')
			.send({ email: 'valid_email@mail.com', password: 'valid_password' })
			.expect(200);
	});
});
