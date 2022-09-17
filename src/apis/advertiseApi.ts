import axiosClient from './axiosClient';
import { ListResponseNonPaging, AdvertiseBanner } from 'models';

const advertiseApi = {
	getListBanner(): Promise<ListResponseNonPaging<AdvertiseBanner>> {
		const url = '/promotion/collection';
		return axiosClient.get(url);
	},

	getListVideo(): Promise<ListResponseNonPaging<string>> {
		const url = '/promotion/hotpot';
		return axiosClient.get(url);
	},

	getListItem(): Promise<ListResponseNonPaging<any>> {
		const url = '/promotion/nft';
		return axiosClient.get(url);
	},
};

export default advertiseApi;
