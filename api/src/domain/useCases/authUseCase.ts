import InvalidParamError from '../../helpers/errors/invalidParamError';
import MissingParamError from '../../helpers/errors/missingParamError';
import { ILoadUserByEmailRepository } from '../../interfaces/loadUserByEmailRepository';

export default class AuthUseCase implements AuthUseCase {
	constructor(private loadUserByEmailRepository: ILoadUserByEmailRepository) {}

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
	}
}
