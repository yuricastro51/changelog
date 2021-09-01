import bcrypt from 'bcrypt';
import { IEncrypter } from 'src/interfaces/encrypter';

export class Encrypter implements IEncrypter {
	async compare(password: string, hashedPassword: string): Promise<boolean> {
		const isValid = await bcrypt.compare(password, hashedPassword);
		return isValid;
	}
}
