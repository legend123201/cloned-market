import axiosClient from './axiosClient';
import { Response } from 'models';

const commonApi = {
	convertPrice(data: any): Promise<Response<any>> {
		const { chainId, symbolToken, amount } = data;
		const url = `tools/price-conversion/chainId/${chainId}/from/${symbolToken}/to/usd/price/${amount}`;
		return axiosClient.get(url, data);
	},

	getQuote(data: any): Promise<Response<any>> {
		const url = '/api/tools/lastest-quotes';
		return axiosClient.get(url, data);
	},
};

export default commonApi;
