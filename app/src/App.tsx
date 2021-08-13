import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { GlobalStyle } from './styles/globalStyles';
import Routes from './routes';
import MyThemeProvider from './contexts/ThemeContext';

export default function App() {
	return (
		<React.StrictMode>
			<MyThemeProvider>
				<BrowserRouter>
					<GlobalStyle />
					<Routes />
				</BrowserRouter>
			</MyThemeProvider>
		</React.StrictMode>
	);
}
