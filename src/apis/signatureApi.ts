import axiosClient from './axiosClient';
import { Response } from 'models';

const signatureApi = {
	getSignature(signatureId: string): Promise<Response<any>> {
		const url = `signatures/id/${signatureId}`;
		return axiosClient.get(url);
	},
};

export default signatureApi;
