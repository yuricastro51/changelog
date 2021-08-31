import { IAuthUseCase } from 'src/interfaces/authUseCase';
import { IEncrypter } from 'src/interfaces/encrypter';
import { ITokenGenerator } from 'src/interfaces/tokenGenerator';
import { AuthUseCaseProps } from 'src/utils/types';
import InvalidParamError from '../../helpers/errors/invalidParamError';
import MissingParamError from '../../helpers/errors/missingParamError';
import { ILoadUserByEmailRepository } from '../../interfaces/loadUserByEmailRepository';

export default class AuthUseCase implements IAuthUseCase {
	tokenGenerator: ITokenGenerator;
	encrypter: IEncrypter;
	loadUserByEmailRepository: ILoadUserByEmailRepository;

	constructor({
		loadUserByEmailRepository,
		encrypter,
		tokenGenerator,
	}: AuthUseCaseProps) {
		this.loadUserByEmailRepository = loadUserByEmailRepository;
		this.encrypter = encrypter;
		this.tokenGenerator = tokenGenerator;
	}

	async auth(email: string, password: string): Promise<string | null> {
		if (!email) {
			throw new MissingParamError('email');
		}
		if (!password) {
			throw new MissingParamError('password');
		}

		const user = await this.loadUserByEmailRepository.load(email);

		if (!user) {
			return null;
		}

		const isValid = await this.encrypter.compare(password, user.password);

		if (!isValid) {
			return null;
		}

		const accessToken = await this.tokenGenerator.generate(user.id);
		return accessToken;
	}
}
