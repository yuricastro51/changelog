import { useContext } from 'react';
import { DefaultTheme } from 'styled-components';
import { ThemeContext } from '../contexts/ThemeContext';
import dark from '../styles/themes/dark';
import light from '../styles/themes/light';
import usePersistedState from './usePersistedState';

export default () => {
	const { theme, toggleTheme } = useContext(ThemeContext);

	return { theme, toggleTheme };
};
