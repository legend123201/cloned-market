/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Button, Container } from '@mui/material';
import UploadMediaCustom from 'components/CustomField/UploadMediaCustom';
import { CustomFile } from 'models';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { addIPFS } from 'utils';
import Footer from './Footer';
import Head from './Head';
import Main from './Main';
import TestContainer, { TestContext } from './TestContext';

export default function TestGrid() {
	const [state, setState] = useState<number>(0);

	console.log('state outside 1', state);

	useEffect(() => {
		console.log('state in useEffect 1', state);

		// setState(2);

		console.log('state in useEffect 2', state);
	}, [state]);

	console.log('state outside 2', state);

	return (
		<Box sx={{ mt: 50 }}>
			{console.log('state in return 1', state)}
			{state}
			{console.log('state in return 2', state)}

			<Button
				onClick={() => {
					setState(4);
				}}
			>
				Click me
			</Button>
		</Box>
	);
}
