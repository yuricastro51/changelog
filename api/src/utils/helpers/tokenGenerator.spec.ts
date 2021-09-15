class JwtTest {
	token = 'any_token';
	id!: string;
	secret!: string;

	sign(payload: string, secret: string): string | null {
		this.id = payload;
		this.secret = secret;
		return this.token;
	}
}

jest.mock('jsonwebtoken', () => new JwtTest());

import jwt from 'jsonwebtoken';
import MissingParamError from '../../presentation/errors/missingParamError';
import { TokenGenerator } from './tokenGenerator';

const makeSut = () => {
	const sut = new TokenGenerator('any_secret');

	return { sut };
};

describe('TokenGenerator', () => {
	test('Should return null if jwt returns null', async () => {
		const { sut } = makeSut();
		//@ts-ignore
		jwt.token = null;

		const token = await sut.generate('any_id');
		expect(token).toBeNull();
	});

	test('Should return a token if jwt returns token', async () => {
		const { sut } = makeSut();
		const token = await sut.generate('any_id');

		//@ts-ignore
		expect(token).toBe(jwt.token);
	});

	test('Should throw if no param is provided', async () => {
		const { sut } = makeSut();
		const token = sut.generate('');

		await expect(token).rejects.toThrow(new MissingParamError('id'));
	});

	test('Should call JWT with correct params', async () => {
		const { sut } = makeSut();
		sut.generate('any_id');

		//@ts-ignore
		expect(jwt.id).toBe('any_id');
		//@ts-ignore
		expect(jwt.secret).toBe(sut.secret);
	});

	test('Should throw if no secret is provided', async () => {
		const sut = new TokenGenerator('');
		const token = sut.generate('any_id');

		await expect(token).rejects.toThrow(new MissingParamError('secret'));
	});
});
