import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
 * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  html, body, #root {
    height: 100%;
		background-color: ${props => props.theme.colors.background};
		color: ${props => props.theme.colors.text};
		overflow-x: hidden;
  }
  *, button, input {
    border: 0;
    outline: 0;
    font-family: 'Montserrat', sans-serif;
  }
`;
