import React, { InputHTMLAttributes } from 'react';
import { Container, MyInput, Label } from './styles';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
	label: string;
}

export default function Input({ label, ...rest }: Props) {
	return (
		<Container>
			<Label>{label}</Label>
			<MyInput {...rest} />
		</Container>
	);
}
