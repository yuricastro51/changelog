import { Express, Router } from 'express';
import FastGlob from 'fast-glob';

const router = Router();

export default (app: Express) => {
	FastGlob.sync('**/src/main/routes/**.ts').forEach((file) =>
		require(`../../../${file}`)(router),
	);
	app.use(router);
};
