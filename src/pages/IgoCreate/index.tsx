import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import CreateIGO from 'components/pages/CreateIGO';

export interface IIgoCreateProps {}

export default function IgoCreate(props: IIgoCreateProps) {
	return (
		<Container maxWidth="xl" sx={{ mt: 14 }}>
			<Box>
				<Typography variant="h2" fontStyle="italic">
					Create IGO
				</Typography>
			</Box>
			<CreateIGO />
		</Container>
	);
}
