import React, { useContext } from 'react';
import Switch from 'react-switch';
import { shade } from 'polished';
import { ThemeContext } from 'styled-components';

import { Container, LeftSide, RightSide, LoginBox, AppNameBox } from './styles';
import { Link } from 'react-router-dom';

interface Props {
	toggleTheme(): void;
}

const Header: React.FC<Props> = ({ toggleTheme }) => {
	const { colors, title } = useContext(ThemeContext);

	return (
		<Container>
			<LeftSide>
				<AppNameBox>Changelog</AppNameBox>
			</LeftSide>
			<RightSide>
				<Switch
					onChange={toggleTheme}
					checked={title === 'dark'}
					checkedIcon={false}
					uncheckedIcon={false}
					height={20}
					width={40}
					handleDiameter={20}
					offColor={shade(0.15, colors.primary)}
					offHandleColor={shade(0.1, colors.text)}
					onColor={colors.primary}
				/>

				<LoginBox>
					<Link to="/login">Painel</Link>
				</LoginBox>
			</RightSide>
		</Container>
	);
};

export default Header;
