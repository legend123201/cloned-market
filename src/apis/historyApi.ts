import {
	Response,
	ListResponse,
	HistoryActivity,
	PriceActivity,
	ListResponseNonPaging,
	ListParams,
} from 'models';
import axiosClient from './axiosClient';

const tradingApi = {
	getTradingHistoryByNFTsId(
		itemId: string,
		paginationParams: ListParams,
		filter: ListParams
	): Promise<ListResponse<HistoryActivity>> {
		const { pageSize, page } = paginationParams;
		const body = { ...filter };

		const url = `/histories/itemId/${itemId}/pageSize/${pageSize}/page/${page}`;

		return axiosClient.post(url, body);
	},

	getActivityHistoryByUserAddress(
		userAddress: string,
		paginationParams: ListParams,
		filter: ListParams
	): Promise<ListResponse<HistoryActivity>> {
		const { pageSize, page } = paginationParams;
		const body = { ...filter };

		const url = `/histories/userAddress/${userAddress}/pageSize/${pageSize}/page/${page}`;

		return axiosClient.post(url, body);
	},

	getActivityHistoryByCollectionId(
		collectionId: string,
		paginationParams: ListParams,
		filter: ListParams
	): Promise<ListResponse<HistoryActivity>> {
		const { pageSize, page } = paginationParams;
		const body = { ...filter };

		const url = `/histories/collectionId/${collectionId}/pageSize/${pageSize}/page/${page}`;

		return axiosClient.post(url, body);
	},

	getDetailActivityById(historyId: string): Promise<Response<HistoryActivity>> {
		const url = `/histories/detail/id/${historyId}`;
		return axiosClient.get(url);
	},

	getActivityPriceChart(itemId: string): Promise<ListResponseNonPaging<PriceActivity>> {
		const url = `/histories/chart/itemId/${itemId}`;
		return axiosClient.get(url);
	},

	getLatestTransaction(): Promise<Response<any>> {
		const url = `/histories/latest`;
		return axiosClient.get(url);
	},
};

export default tradingApi;
