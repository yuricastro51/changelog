import bcrypt from 'bcrypt';
import { IEncrypter } from 'src/interfaces/encrypter';

export class Encrypter implements IEncrypter {
	async compare(value: string, hash: string): Promise<boolean> {
		const isValid = await bcrypt.compare(value, hash);
		return isValid;
	}
}
