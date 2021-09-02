import { ITokenGenerator } from 'src/interfaces/tokenGenerator';

export class TokenGenerator implements ITokenGenerator {
	async generate(userId: string): Promise<string | null> {
		return null;
	}
}
