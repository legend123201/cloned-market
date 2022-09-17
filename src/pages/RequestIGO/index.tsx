/* eslint-disable @typescript-eslint/no-unused-vars */
import { Container } from '@mui/material';
import igoApi from 'apis/igoApi';
import FormRequestIGO, { IFormRequestIGOPropsValue } from 'components/Form/FormRequestIGO';
import { API_ENDPOINT } from '../../../src/constants';
import * as React from 'react';
import { toast } from 'react-toastify';

export interface IResquestIGOProps {}

export default function ResquestIGO(props: IResquestIGOProps) {
	const onSubmit = async (data: IFormRequestIGOPropsValue) => {
		if (data.endTime > data.startTime) {
			const newData = {
				...data,
				typeINO: 2,
			};
			console.log('newData', newData);
			// try {
			// 	await igoApi.sendRequestIgo(newData);
			// } catch (error) {
			// 	console.log(error);
			// }
		} else {
			toast.error('not valid date, please check your day choosen');
		}
	};

	return (
		<>
			<Container sx={{ mt: 14 }}>
				<FormRequestIGO onSubmit={onSubmit} />
			</Container>
		</>
	);
}
