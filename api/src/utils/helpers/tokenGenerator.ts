import jwt from 'jsonwebtoken';
import { ITokenGenerator } from 'src/interfaces/tokenGenerator';
import MissingParamError from '../errors/missingParamError';

export class TokenGenerator implements ITokenGenerator {
	async generate(userId: string): Promise<string | null> {
		if (!userId) {
			throw new MissingParamError('userId');
		}

		const token = jwt.sign(userId, 'secret');
		return token;
	}
}
