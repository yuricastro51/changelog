class JwtTest {
	token = 'any_token';

	sign(payload: string, secret: string): string | null {
		return this.token;
	}
}

jest.mock('jsonwebtoken', () => new JwtTest());

import jwt from 'jsonwebtoken';
import { TokenGenerator } from './tokenGenerator';

const makeSut = () => {
	const sut = new TokenGenerator();

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
});
