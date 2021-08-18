import { AuthUseCase } from 'src/domain/interfaces/authUseCase';
import { HttpRequestType } from 'src/utils/types';
import HttpResponse from '../helpers/httpResponse';
import MissingParamError from '../helpers/missingParamError';

export default class LoginRouter {
	authUseCase: AuthUseCase;

	constructor(authUseCase: AuthUseCase) {
		this.authUseCase = authUseCase;
	}
	async route(httpRequest: HttpRequestType) {
		try {
			const { email, password } = httpRequest.body;

			if (!email) {
				return HttpResponse.badRequest(new MissingParamError('email'));
			}

			if (!password) {
				return HttpResponse.badRequest(new MissingParamError('password'));
			}

			const accessToken = await this.authUseCase.auth(email, password);

			if (!accessToken) {
				return HttpResponse.unauthorizedError();
			}

			return HttpResponse.ok({ accessToken });
		} catch (error) {
			return HttpResponse.serverError();
		}
	}
}
