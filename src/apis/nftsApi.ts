/* eslint-disable @typescript-eslint/no-unused-vars */
import axiosAuthen from './axiosAuthen';
import axiosClient from './axiosClient';
import {
	ListParams,
	CreateAndUpdateNFTInput,
	CreateBoxInput,
	UnpackBoxInput,
	Response,
	ListResponse,
	NFT,
	ListResponseNonPaging,
} from 'models';

const nftsApi = {
	//AUTHENTICATE
	createNft(data: CreateAndUpdateNFTInput): Promise<Response<any>> {
		const url = `/items/create`;
		return axiosAuthen.post(url, data);
	},

	createBox(data: CreateBoxInput): Promise<Response<any>> {
		const url = `/items/box/create`;
		return axiosAuthen.post(url, data);
	},

	buyBox(data: any): Promise<Response<any>> {
		const url = `/items/box/buy`;
		return axiosAuthen.post(url, data);
	},

	unpackBox(data: UnpackBoxInput): Promise<Response<any>> {
		const url = `/items/box/unbox`;
		return axiosAuthen.post(url, data);
	},

	// Update
	updateNftByItemId(
		data: CreateAndUpdateNFTInput,
		userAddress: string,
		itemId: string
	): Promise<Response<any>> {
		const url = `/items/update/userAddress/${userAddress}/itemId/${itemId}`;
		return axiosAuthen.put(url, data);
	},

	// NFT will be not edit or delete
	freezeNft(itemId: string, userAddress: string, metaData: string): Promise<Response<any>> {
		const url = `/items/freeze`;

		const body = { itemId, userAddress, metaData };
		return axiosAuthen.put(url, body);
	},

	// Get list boxes of user
	getListBoxIdOfUser(
		userAddress: string,
		chainId: number,
		pageSize: number,
		page: number
	): Promise<ListResponse<any>> {
		const url = `/items/boxes`;
		const data = { chainId };
		return axiosAuthen.post(url, data);
	},

	// Get list items from boxes of user
	getListItemIdFromBoxOfUser(userAddress: string, chainId: number): Promise<ListResponse<any>> {
		const url = `/items/boxes/asset`;
		const data = { chainId, userAddress };
		return axiosAuthen.post(url, data);
	},

	//CLIENT

	// Get all NFT by ID params in MoongoDB ( ALL NFTs ) (View all)
	getListTokenId(paginationParams: ListParams, filter: ListParams): Promise<ListResponse<any>> {
		const { pageSize, page } = paginationParams;

		const url = `/items/query/pageSize/${pageSize}/page/${page}`;
		const body = { ...filter };
		return axiosClient.post(url, body);
	},

	// Get all Box by ID params in MoongoDB
	getListBoxTokenId(chainId: number): Promise<ListResponse<any>> {
		const url = `/items/boxes`;
		const body = { chainId };
		return axiosClient.post(url, body);
	},

	// Search all NFT by ID
	getSearchListTokenId(
		paginationParams: ListParams,
		filter: ListParams
	): Promise<ListResponse<any>> {
		const { pageSize, page } = paginationParams;

		const url = `/items/query-search/pageSize/${pageSize}/page/${page}`;
		const body = { ...filter };
		return axiosClient.post(url, body);
	},

	// Get Less Infomation about NFT
	getLessNftInfoByTokenId(filter: ListParams): Promise<Response<NFT>> {
		const { itemId, userAddress } = filter;
		const url = `/items/itemId/${itemId}?userAddress=${userAddress}`;
		return axiosClient.get(url);
	},

	// Get details NFT info
	getDetailNftItemById(itemId: string): Promise<Response<any>> {
		const url = `/items/detail/itemId/${itemId}`;
		return axiosClient.get(url);
	},

	// Serach a NFT by ID
	getSearchNftItemById(itemId: string): Promise<Response<any>> {
		const url = `/items/search/itemId/${itemId}`;
		return axiosClient.get(url);
	},

	// Get data NFT Freeze
	getDataForFreezeNft(itemId: string): Promise<Response<any>> {
		const url = `/items/freeze/metadata/itemId/${itemId}`;
		return axiosClient.get(url);
	},
};

export default nftsApi;
