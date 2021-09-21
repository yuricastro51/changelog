import { Request, Response, Router } from 'express';
import { IRouter } from 'src/domain/interfaces/router';

export default function adapt(router: IRouter) {
	return async (req: Request, res: Response) => {
		const httpRequest = {
			body: req.body,
		};
		const httpResponse = await router.route(httpRequest);
		res.status(httpResponse.statusCode).json(httpResponse.body);
	};
}
