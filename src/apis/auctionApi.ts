import axiosClient from './axiosClient';
import { ListParams, Response, ListResponse } from 'models';

const auctionApi = {
	// Get List auction ID
	getListAuctionId(paginationParams: ListParams, status: string): Promise<ListResponse<any>> {
		const { pageSize, page } = paginationParams;

		const url = `/auctions/pageSize/${pageSize}/page/${page}`;
		// const body = { ...filter };
		const data = { status };
		return axiosClient.post(url, data);
	},

	// Make a new Auction
	createAuction(data: any): Promise<Response<any>> {
		const url = 'auctions/create';
		return axiosClient.post(url, data);
	},

	// Get detail Auction from Auction ID
	getAuctionDetailByAuctionId(data: any): Promise<Response<any>> {
		const url = `auctions/auctionId/${data}`;
		return axiosClient.get(url);
	},
	// Get detail INO id from User address
	getInoIdByUserAdd(data: any): Promise<Response<any>> {
		const url = `ino/list/owner/${data}/type/1`;
		return axiosClient.get(url);
	},
	// Get detail INO from INO ID
	getInoDetailByInoId(data: any): Promise<Response<any>> {
		const url = `ino/inoId/${data}`;
		return axiosClient.get(url);
	},
	// Get detail list Bider from INO ID
	getListBiderByInoId(data: any): Promise<Response<any>> {
		const url = `auctions/bidder/auctionId/${data}`;
		return axiosClient.get(url);
	},
	// Get list Attendance from I
	getListAttendance(
		paginationParams: ListParams,
		userAddress: string
	): Promise<ListResponse<any>> {
		const { pageSize, page } = paginationParams;

		const url = `/auctions/pageSize/${pageSize}/page/${page}`;
		// const body = { ...filter };
		const data = { userAddress };
		return axiosClient.post(url, data);
	},
};
export default auctionApi;
