import supertest from 'supertest';
import { createConnection, getConnection } from 'typeorm';
import bcrypt from 'bcrypt';
import init from '../config/app';
import { User } from '../../domain/entities/user';

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

	beforeEach(() => {
		const repository = getRepository();
		repository.clear();
	});

	test('Should return 200 when valid credentials are provided', async () => {
		const repository = getRepository();

		await repository.insert({
			email: 'valid_email@mail.com',
			password: bcrypt.hashSync('valid_password', 10),
		});

		const app = await init();

		await supertest(app)
			.post('/login')
			.send({ email: 'valid_email@mail.com', password: 'valid_password' })
			.expect(200);
	});

	test('Should return 401 when invalid credentials are provided', async () => {
		const app = await init();

		await supertest(app)
			.post('/login')
			.send({ email: 'valid_email@mail.com', password: 'valid_password' })
			.expect(401);
	});
});
