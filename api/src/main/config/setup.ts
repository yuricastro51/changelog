import { Express } from 'express';

export function setupApp(app: Express) {
	app.disable('x-powered-by');
	app.use((req, res, next) => {
		res.set('access-control-allow-origin', '*');
		res.set('access-control-allow-method', '*');
		res.set('access-control-allow-headers', '*');
		next();
	});
}
