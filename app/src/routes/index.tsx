import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from '../pages/Home';

import Login from '../pages/Login';

export default function Routes() {
	return (
		<Switch>
			<Route path="/" component={Home} exact />
			<Route path="/login" component={Login} exact />
		</Switch>
	);
}
