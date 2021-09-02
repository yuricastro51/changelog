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
import MissingParamError from '../errors/missingParamError';

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

	test('Should call bcrypt with correct values', async () => {
		const { sut } = makeSut();
		await sut.compare('any_value', 'hashed_value');

		//@ts-ignore
		expect(bcrypt.value).toBe('any_value');
		expect(bcrypt.hash).toBe('hashed_value');
	});

	test('Should throw if no params are provided', async () => {
		const { sut } = makeSut();
		const promiseWithoutValue = sut.compare('', 'hashed_value');
		const promiseWithoutHasedValue = sut.compare('any_value', '');

		await expect(promiseWithoutValue).rejects.toThrow(new MissingParamError('value'));
		await expect(promiseWithoutHasedValue).rejects.toThrow(new MissingParamError('hash'));
	});
});
