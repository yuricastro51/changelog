import { ILoadUserByEmailRepository } from 'src/interfaces/loadUserByEmailRepository';
import MissingParamError from '../utils/errors/missingParamError';
import { User } from 'src/utils/types';

class LoadUserByEmailRepository implements ILoadUserByEmailRepository {
	async load(email: string): Promise<User | null> {
		if (!email) {
			throw new MissingParamError('email');
		}

		return null;
	}
}

const makeSut = () => {
	const sut = new LoadUserByEmailRepository();

	return { sut };
};

describe('LoadUserByEmailRepository', () => {
	test('Should throw if no email is provided', async () => {
		const { sut } = makeSut();

		const user = sut.load('');

		await expect(user).rejects.toThrow(new MissingParamError('email'));
	});

	test('Should return null if no user is found', async () => {
		const { sut } = makeSut();

		const user = await sut.load('invalid_email@mail.com');

		expect(user).toBeNull();
	});
});
