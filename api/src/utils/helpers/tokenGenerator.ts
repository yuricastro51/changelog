import jwt from 'jsonwebtoken';
import { ITokenGenerator } from 'src/interfaces/tokenGenerator';

export class TokenGenerator implements ITokenGenerator {
	async generate(userId: string): Promise<string | null> {
		const token = jwt.sign(userId, 'secret');
		return token;
	}
}
