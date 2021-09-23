import express from 'express';
import setupRoutes from '../routes/loginRoutes';
import { setupApp } from './setup';

const app = express();

async function init() {
	setupApp(app);
	await setupRoutes(app);

	return app;
}

export default init;
