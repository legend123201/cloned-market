import { Container } from '@mui/material';
import React, { useEffect } from 'react';
import HeaderIGO from './HeaderIGO';
import IGOOffering from './IGOOffering';
import EndedIGO from './EndedIGO';

export interface IIGOcomponentProps {}

export default function IGOcomponent(props: IIGOcomponentProps) {
	// useEffect
	useEffect(() => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<div>
			<Container maxWidth="xxl">
				<HeaderIGO />
				<IGOOffering />
				<EndedIGO />
			</Container>
		</div>
	);
}
