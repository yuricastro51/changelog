import { IEncrypter } from 'src/interfaces/encrypter';

const makeSut = () => {
	class Encrypter implements IEncrypter {
		async compare(password: string, hashedPassword: string): Promise<boolean> {
			return true;
		}
	}

	const sut = new Encrypter();

	return { sut };
};

describe('Encrypter', () => {
	test('Should return true if bcrypt returns true', async () => {
		const { sut } = makeSut();
		const isValid = await sut.compare('any_password', 'hashed_password');

		expect(isValid).toBe(true);
	});
});
