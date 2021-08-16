import { HttpResponseType } from 'src/utils/types';
import MissingParamError from './missingParamError';

export default class HttpResponse {
	static badRequest(paramName: string): HttpResponseType {
		return { statusCode: 400, body: new MissingParamError(paramName) };
	}

	static serverError(paramName: string): HttpResponseType {
		return { statusCode: 500, body: new MissingParamError(paramName) };
	}
}
