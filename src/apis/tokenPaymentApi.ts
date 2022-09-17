import axiosClient from './axiosClient';
import { ListResponseNonPaging, Response } from 'models';

const tokenPaymentApi = {
	getListPaymentTokenByChainId(chainId: number): Promise<ListResponseNonPaging<any>> {
		const url = `orders/listToken?chainId=${chainId}`;
		return axiosClient.get(url);
	},

	changeTokenToUsd(from: string, to: string, inputPrice: string): Promise<Response<any>> {
		const url = `/items/changePrice`;
		return axiosClient.post(url, { from, to, inputPrice });
	},
};

export default tokenPaymentApi;
