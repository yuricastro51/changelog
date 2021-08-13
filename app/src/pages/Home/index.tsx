import React, { useState, useEffect, useContext } from 'react';

import {
	VerticalTimeline,
	VerticalTimelineElement
} from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';

import { BsTools } from 'react-icons/bs';

import { ReleaseNote } from '../../models/releaseNote';
import { api } from '../../services/api';

// import {  } from './styles';
import Tag from '../../components/Tag';
import { ThemeContext } from 'styled-components';
import Header from '../../components/Header';
import useTheme from '../../hooks/useTheme';
import { dateFormat } from '../../helpers/dateFormat';

export default function Home() {
	const { colors, title } = useContext(ThemeContext);

	const { toggleTheme } = useTheme();

	const [data, setData] = useState<ReleaseNote[]>([]);

	async function getData() {
		const { data } = await api.get('/release');

		setData(data);
	}

	useEffect(() => {
		getData();
	}, []);

	return (
		<>
			<Header toggleTheme={toggleTheme} />
			<VerticalTimeline>
				{data.map(release => (
					<VerticalTimelineElement
						className="vertical-timeline-element--work"
						contentStyle={{ background: colors.primary, color: colors.text }}
						contentArrowStyle={{ borderRight: `7px solid ${colors.primary}` }}
						date={String(dateFormat(release.releaseDate.toString()))}
						iconStyle={{ background: colors.primary, color: colors.text }}
						key={release.uuid}
						icon={<BsTools />}
					>
						<Tag>{release.version}</Tag>
						<p>{release.description}</p>
					</VerticalTimelineElement>
				))}
			</VerticalTimeline>
		</>
	);
}
