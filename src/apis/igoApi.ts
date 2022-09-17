import axiosClient from './axiosClient';
import { Response } from 'models';

const igoApi = {
	// Get List auction ID
	sendRequestIgo(data: any): Promise<Response<any>> {
		const url = `/INO/request/create`;
		return axiosClient.post(url, data);
	},
};
export default igoApi;
