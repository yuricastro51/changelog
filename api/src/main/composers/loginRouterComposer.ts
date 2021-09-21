import { User } from '../../domain/entities/user';
import { LoadUserByEmailRepository } from '../../infra/repositories/loadUserByEmailRepository';
import { UpdateAccessTokenRepository } from '../../infra/repositories/updateAccessTokenRepository';
import { EmailValidator } from '../../utils/helpers/emailValidator';
import { Encrypter } from '../../utils/helpers/encrypter';
import env from '../../utils/helpers/env';
import { TokenGenerator } from '../../utils/helpers/tokenGenerator';
import { getConnection } from 'typeorm';
import AuthUseCase from '../../domain/useCases/authUseCase';
import LoginRouter from '../../presentation/routers/loginRouter';

const connection = getConnection();
const userRepository = connection.getRepository(User);
const updateAccessTokenRepository = new UpdateAccessTokenRepository(userRepository);
const tokenGenerator = new TokenGenerator(env.SECRET);
const encrypter = new Encrypter();
const loadUserByEmailRepository = new LoadUserByEmailRepository(userRepository);
const authUseCase = new AuthUseCase({
	loadUserByEmailRepository,
	encrypter,
	tokenGenerator,
	updateAccessTokenRepository,
});
const emailValidator = new EmailValidator();
const loginRouter = new LoginRouter(authUseCase, emailValidator);

export default loginRouter;
