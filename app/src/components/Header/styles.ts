import styled from 'styled-components';

export const Container = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 3rem;
	background-color: ${props => props.theme.colors.headerColor};
	box-shadow: 0px 0px 9px 3px rgba(41, 41, 41, 0.25);
`;

export const RightSide = styled.div`
	display: flex;
	align-items: center;
`;

export const LeftSide = styled.div``;

export const AppNameBox = styled.div`
	padding: 20px;
	font-weight: bold;
`;

export const LoginBox = styled.div`
	padding: 20px;

	a {
		text-decoration: none;
		color: ${props => props.theme.colors.text};

		:hover {
			text-decoration: underline;
		}
		:focus {
			text-decoration: underline;
		}
	}
`;
