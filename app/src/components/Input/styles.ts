import styled from 'styled-components';

export const Container = styled.div`
	display: flex;
	flex-direction: column;
`;

export const MyInput = styled.input`
	width: 100%;
	padding: 10px 12px;
	background-color: #0d1117;
	border: 1px solid #21262d;
	border-radius: 6px;
	color: #c9d1d9;
	margin-bottom: 15px;
`;

export const Label = styled.label`
	margin-bottom: 7px;
	font-size: 14px;
	color: ${props => props.theme.colors.text};
	font-weight: 400;
`;
