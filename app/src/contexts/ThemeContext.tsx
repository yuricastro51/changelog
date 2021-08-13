import React, { ReactNode, useMemo } from 'react';
import { createContext } from 'react';
import { DefaultTheme, ThemeProvider } from 'styled-components';
import usePersistedState from '../hooks/usePersistedState';
import dark from '../styles/themes/dark';
import light from '../styles/themes/light';

type ThemeContextType = {
	theme: DefaultTheme;
	toggleTheme: () => void;
};

const teste = { theme: light, toggleTheme: () => {} };

const ThemeContext = createContext<ThemeContextType>(teste);

interface Props {
	children: ReactNode;
}

export default function MyThemeProvider({ children }: Props) {
	const [theme, setTheme] = usePersistedState<DefaultTheme>('theme', light);

	const toggleTheme = () => {
		setTheme(theme.title === 'light' ? dark : light);
	};

	const contextValue = useMemo(
		() => ({
			toggleTheme,
			theme
		}),
		[toggleTheme, theme]
	);

	return (
		<ThemeContext.Provider value={contextValue}>
			<ThemeProvider theme={theme}>{children}</ThemeProvider>
		</ThemeContext.Provider>
	);
}

export { ThemeContext, MyThemeProvider };
