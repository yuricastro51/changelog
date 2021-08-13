import React, { ReactNode } from 'react';

import { Container } from './styles';

interface Props {
	children: ReactNode;
}

export default function Card({ children }: Props) {
	return <Container>{children}</Container>;
}

const colors = ['#4F5D95', '#2EA043', '#F1E05A', '#563d7c'];
