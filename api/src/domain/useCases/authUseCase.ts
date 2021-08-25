import InvalidParamError from 'src/helpers/errors/invalidParamError';
import MissingParamError from 'src/helpers/errors/missingParamError';
import { ILoadUserByEmailRepository } from 'src/interfaces/loadUserByEmailRepository';

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
