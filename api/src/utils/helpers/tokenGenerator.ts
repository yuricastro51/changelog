import jwt from 'jsonwebtoken';
import { ITokenGenerator } from 'src/interfaces/tokenGenerator';
import MissingParamError from '../errors/missingParamError';

export class TokenGenerator implements ITokenGenerator {
	constructor(private secret: string) {}
	async generate(userId: string): Promise<string | null> {
		if (!userId) {
			throw new MissingParamError('userId');
		}

		const token = jwt.sign(userId, this.secret);
		return token;
	}
}
