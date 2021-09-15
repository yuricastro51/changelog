import { IUpdateAccessTokenRepository } from '../../domain/interfaces/updateAccessTokenRepository';
import InvalidParamError from '../../presentation/errors/invalidParamError';
import MissingParamError from '../../presentation/errors/missingParamError';
import { IUser } from '../../utils/types';
import { Repository } from 'typeorm';

export class UpdateAccessTokenRepository implements IUpdateAccessTokenRepository {
	constructor(private repository: Repository<IUser>) {}
	async update(userId: string, accessToken: string): Promise<void> {
		if (!this.repository.find || !this.repository.save) {
			throw new InvalidParamError('repository');
		}

		if (!userId) {
			throw new MissingParamError('userId');
		}

		if (!accessToken) {
			throw new MissingParamError('accessToken');
		}

		const [user] = await this.repository.find({ where: { id: userId } });
		user.accessToken = accessToken;

		await this.repository.save(user);
	}
}
