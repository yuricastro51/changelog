import { Express } from 'express';
import { cors } from '../middlewares/cors';
import { jsonParser } from '../middlewares/jsonParser';

export function setupApp(app: Express) {
	app.disable('x-powered-by');
	app.use(cors);
	app.use(jsonParser);
}
