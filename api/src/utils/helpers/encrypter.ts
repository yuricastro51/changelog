import bcrypt from 'bcrypt';
import { IEncrypter } from 'src/interfaces/encrypter';
import MissingParamError from '../errors/missingParamError';

export class Encrypter implements IEncrypter {
	async compare(value: string, hash: string): Promise<boolean> {
		if (!value) {
			throw new MissingParamError('value');
		}
		if (!hash) {
			throw new MissingParamError('hash');
		}
		const isValid = await bcrypt.compare(value, hash);
		return isValid;
	}
}
