import { HttpResponseType } from 'src/utils/types';
import ServerError from './serverError';
import UnauthorizedError from './unauthorizedError';

export default class HttpResponse {
	static badRequest(error: Error): HttpResponseType {
		return { statusCode: 400, body: error };
	}

	static serverError(): HttpResponseType {
		return { statusCode: 500, body: new ServerError() };
	}

	static unauthorizedError(): HttpResponseType {
		return { statusCode: 401, body: new UnauthorizedError() };
	}

	static ok(data: any): HttpResponseType {
		return { statusCode: 200, body: data };
	}
}
