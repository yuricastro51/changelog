import React, { FormEvent, FormEventHandler, useState } from 'react';
import Input from '../../components/Input';

import { Container, H1, Form, Button, InputBox } from './styles';

interface FormProps {
	email: string;
	password: string;
}

export default function Login() {
	const [form, setForm] = useState<FormProps>({ email: '', password: '' });

	function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		console.log(form);
	}

	return (
		<Container>
			<H1>Changelog</H1>
			<Form onSubmit={handleSubmit}>
				<InputBox>
					<Input
						name="email"
						label="E-mail"
						onChange={e => setForm({ ...form, email: e.target.value })}
					/>
					<Input
						name="password"
						label="Senha"
						onChange={e => setForm({ ...form, password: e.target.value })}
					/>
					<Button type="submit">Entrar</Button>
				</InputBox>
			</Form>
		</Container>
	);
}
