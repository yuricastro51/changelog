import { AuthUseCase } from 'src/domain/interfaces/authUseCase';
import { HttpRequestType } from 'src/utils/types';
import HttpResponse from '../helpers/httpResponse';

export default class LoginRouter {
	authUseCase: AuthUseCase;

	constructor(authUseCase: AuthUseCase) {
		this.authUseCase = authUseCase;
	}
	route(httpRequest: HttpRequestType) {
		if (!httpRequest.body || !httpRequest) {
			return HttpResponse.serverError('httpRequest');
		}

		const { email, password } = httpRequest.body;

		if (!email) {
			return HttpResponse.badRequest('email');
		}

		if (!password) {
			return HttpResponse.badRequest('password');
		}

		const accessToken = this.authUseCase.auth(email, password);

		if (!accessToken) {
			return HttpResponse.unauthorizedError();
		}

		return HttpResponse.ok({ accessToken });
	}
}
