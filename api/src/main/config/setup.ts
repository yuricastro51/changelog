import { Express } from 'express';
import { contentType } from '../middlewares/contentType';
import { cors } from '../middlewares/cors';
import { jsonParser } from '../middlewares/jsonParser';

export function setupApp(app: Express) {
	app.disable('x-powered-by');
	app.use(cors);
	app.use(jsonParser);
	app.use(contentType);
}
