import { TokenGenerator } from './tokenGenerator';

const makeSut = () => {
	const sut = new TokenGenerator();

	return { sut };
};

describe('TokenGenerator', () => {
	test('Should return null if jwt returns null', async () => {
		const { sut } = makeSut();

		const token = await sut.generate('any_id');
		expect(token).toBeNull();
	});
});
