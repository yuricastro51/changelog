import jwt from 'jsonwebtoken';
import { ITokenGenerator } from 'src/domain/interfaces/tokenGenerator';
import MissingParamError from '../../presentation/errors/missingParamError';

export class TokenGenerator implements ITokenGenerator {
	constructor(private secret: string) {}

	async generate(id: string): Promise<string | null> {
		if (!id) {
			throw new MissingParamError('id');
		}

		if (!this.secret) {
			throw new MissingParamError('secret');
		}

		const token = jwt.sign(id, this.secret);
		return token;
	}
}
