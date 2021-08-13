import styled from 'styled-components';

export const Container = styled.div`
	display: flex;
	align-items: center;
	flex-direction: column;
	justify-content: center;
`;

export const H1 = styled.h1`
	font-weight: 200;
	margin: 10px;
`;

export const Form = styled.form`
	display: flex;
	width: 20rem;
	height: 20rem;
	flex-direction: column;
	background-color: ${props => props.theme.colors.primary};
	justify-content: center;
	align-items: center;
	border: 1px solid #21262d;
	border-radius: 5px;
`;

export const Button = styled.button`
	width: 100%;
	padding: 5px 12px;
	background-color: #2ea043;
	border: 1px solid #21262d;
	border-radius: 6px;
	color: #ffffff;
	margin-top: 20px;
	height: 35px;
	cursor: pointer;
	font-weight: bold;
`;

export const InputBox = styled.div`
	display: flex;
	flex-direction: column;
	width: 90%;
`;
