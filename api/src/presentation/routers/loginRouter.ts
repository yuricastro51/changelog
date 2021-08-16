import { HttpRequestType } from 'src/utils/types';
import HttpResponse from '../helpers/httpResponse';

export default class LoginRouter {
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

		return { statusCode: 200, body: 'ok' };
	}
}
