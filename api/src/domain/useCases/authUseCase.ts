import { IEncrypter } from 'src/interfaces/encrypter';
import { ITokenGenerator } from 'src/interfaces/tokenGenerator';
import InvalidParamError from '../../helpers/errors/invalidParamError';
import MissingParamError from '../../helpers/errors/missingParamError';
import { ILoadUserByEmailRepository } from '../../interfaces/loadUserByEmailRepository';

export default class AuthUseCase implements AuthUseCase {
	constructor(
		private loadUserByEmailRepository: ILoadUserByEmailRepository,
		private encrypter: IEncrypter,
		private tokenGenerator: ITokenGenerator,
	) {}

	async auth(email: string, password: string) {
		if (!email) {
			throw new MissingParamError('email');
		}
		if (!password) {
			throw new MissingParamError('password');
		}

		if (!this.loadUserByEmailRepository.load) {
			throw new InvalidParamError('loadUserByEmailRepository');
		}

		const user = await this.loadUserByEmailRepository.load(email);

		if (!user) {
			return null;
		}

		const isValid = await this.encrypter.compare(password, user.password);

		if (!isValid) {
			return null;
		}

		const accessToken = await this.tokenGenerator.generate(user.id);
		return accessToken;
	}
}
