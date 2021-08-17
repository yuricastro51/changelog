import { HttpRequestType } from 'src/utils/types';
import HttpResponse from '../helpers/httpResponse';

export default class LoginRouter {
	authUseCase: any;

	constructor(authUseCase: any) {
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

		this.authUseCase.auth(email, password);
		return { statusCode: 200, body: 'ok' };
	}
}
