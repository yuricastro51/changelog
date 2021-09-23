import { Router } from 'express';
import adapt from '../adapters/expressRouterAdapter';
import { compose } from '../composers/loginRouterComposer';

export default async function setupRoutes(router: Router) {
	router.post('/login', adapt(await compose()));
}
