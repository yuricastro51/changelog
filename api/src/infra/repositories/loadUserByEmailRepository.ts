import InvalidParamError from '../../presentation/errors/invalidParamError';
import { Repository } from 'typeorm';
import { ILoadUserByEmailRepository } from '../../domain/interfaces/loadUserByEmailRepository';
import MissingParamError from '../../presentation/errors/missingParamError';
import { IUser } from '../../utils/types';

export class LoadUserByEmailRepository implements ILoadUserByEmailRepository {
	constructor(private repository: Repository<IUser>) {}
	async load(email: string): Promise<IUser | null> {
		if (!email) {
			throw new MissingParamError('email');
		}

		if (!this.repository.find) {
			throw new InvalidParamError('repository');
		}
		const [user] = await this.repository.find({ where: { email: email } });

		if (!user) {
			return null;
		}

		return user;
	}
}
