import { HttpResponseType } from 'src/utils/types';
import MissingParamError from './missingParamError';
import UnauthorizedError from './unauthorizedError';

export default class HttpResponse {
	static badRequest(paramName: string): HttpResponseType {
		return { statusCode: 400, body: new MissingParamError(paramName) };
	}

	static serverError(paramName: string): HttpResponseType {
		return { statusCode: 500, body: new MissingParamError(paramName) };
	}

	static unauthorizedError(): HttpResponseType {
		return { statusCode: 401, body: new UnauthorizedError() };
	}

	static ok(data: any): HttpResponseType {
		return { statusCode: 200, body: data };
	}
}
