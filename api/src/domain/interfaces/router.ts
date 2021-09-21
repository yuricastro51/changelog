import { HttpRequestType, HttpResponseType } from '../../utils/types';

export interface IRouter {
	route(httpRequest: HttpRequestType): Promise<HttpResponseType>;
}
