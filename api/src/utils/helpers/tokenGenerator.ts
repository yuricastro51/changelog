import jwt from 'jsonwebtoken';
import { ITokenGenerator } from 'src/interfaces/tokenGenerator';
import MissingParamError from '../errors/missingParamError';

export class TokenGenerator implements ITokenGenerator {
	constructor(private secret: string) {}

	async generate(userId: string): Promise<string | null> {
		if (!userId) {
			throw new MissingParamError('userId');
		}

		if (!this.secret) {
			throw new MissingParamError('secret');
		}

		const token = jwt.sign(userId, this.secret);
		return token;
	}
}
