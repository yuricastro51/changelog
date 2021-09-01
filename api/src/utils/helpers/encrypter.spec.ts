class BcryptTest {
	isValid = true;
	hash!: string;
	value!: string;

	async compare(value: string, hash: string): Promise<boolean> {
		this.value = value;
		this.hash = hash;
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
		const isValid = await sut.compare('any_value', 'hashed_value');

		expect(isValid).toBe(true);
	});

	test('Should return false if bcrypt returns false', async () => {
		const { sut } = makeSut();
		//@ts-ignore
		bcrypt.isValid = false;
		const isValid = await sut.compare('any_value', 'hashed_value');

		expect(isValid).toBe(false);
	});

	test('Should call Encrypter with correct values', async () => {
		const { sut } = makeSut();
		await sut.compare('any_value', 'hashed_value');

		//@ts-ignore
		expect(bcrypt.value).toBe('any_value');
		expect(bcrypt.hash).toBe('hashed_value');
	});
});
