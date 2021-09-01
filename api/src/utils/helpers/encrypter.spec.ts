class BcryptTest {
	isValid = true;
	async compare(password: string, hashedPassword: string): Promise<boolean> {
		return this.isValid;
	}
}

jest.mock('bcrypt', () => new BcryptTest());

import bcrypt from 'bcrypt';

import { Encrypter } from './encrypter';

const makeSut = () => {
	const sut = new Encrypter();

	return { sut };
};

describe('Encrypter', () => {
	test('Should return true if bcrypt returns true', async () => {
		const { sut } = makeSut();
		const isValid = await sut.compare('any_password', 'hashed_password');

		expect(isValid).toBe(true);
	});

	test('Should return false if bcrypt returns false', async () => {
		const { sut } = makeSut();
		//@ts-ignore
		bcrypt.isValid = false;
		const isValid = await sut.compare('any_password', 'hashed_password');

		expect(isValid).toBe(false);
	});
});
