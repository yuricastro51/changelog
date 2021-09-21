import { Router } from 'express';
import adapt from '../adapters/expressRouterAdapter';
import loginRouterComposer from '../composers/loginRouterComposer';

export default (router: Router) => {
	router.post('/login', adapt(loginRouterComposer));
};
