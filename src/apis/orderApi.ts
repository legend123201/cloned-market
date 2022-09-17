import axiosAuthen from './axiosAuthen';
import axiosClient from './axiosClient';
import { OfferFilter, Response, ListResponse, OrderResponseAPI } from 'models';

const orderApi = {
	//AUTHENTICATE
	createOrder(data: any, chainId: number): Promise<Response<any>> {
		console.log('data gui len ne', { ...data, chainId });

		const url = `/sell/create`;
		return axiosAuthen.post(url, { ...data, chainId });
	},

	acceptOrder(data: any): Promise<Response<any>> {
		const {
			order,
			collectionId,
			chainId,
			transactionHash,
			type,
			finalPrice,
			userAddress,
			orderAcceptedId,
		} = data;
		const url = `buy/create`;
		console.log('data gui len ne', {
			...order,
			collectionId,
			transactionHash,
			type,
			finalPrice,
			userAddress,
			chainId,
			orderAcceptedId,
		});

		return axiosAuthen.post(url, {
			...order,
			collectionId,
			transactionHash,
			type,
			finalPrice,
			userAddress,
			chainId,
			orderAcceptedId,
		});
	},

	deleteOrder(data: any): Promise<Response<any>> {
		console.log('data gui len ne', data);

		const url = `orders/delete`;
		return axiosAuthen.post(url, data);
	},

	//CLIENT
	getOrderDetailByUser(orderId: string): Promise<Response<OrderResponseAPI>> {
		const url = `/offers/user/orderId/${orderId}`;
		return axiosClient.get(url);
	},

	getOrderDetail(orderId: string): Promise<Response<OrderResponseAPI>> {
		const url = `/orders/detail/orderId/${orderId}`;
		return axiosClient.get(url);
	},

	getListOrderSell(itemId: string, chainId: number): Promise<ListResponse<any>> {
		const url = `orders/query`;
		const body = { itemId, chainId, asc: 1 };
		return axiosClient.post(url, body);
	},

	getPersonalOrderSell(userAddress: string, itemId: string): Promise<Response<any>> {
		const url = `/orders/userAddress/${userAddress}/itemId/${itemId}/type/0`;
		return axiosClient.get(url);
	},

	getPersonalOffer(userAddress: string, itemId: string): Promise<Response<any>> {
		const url = `offers/query`;
		const body = { maker: userAddress, itemId };
		return axiosClient.post(url, body);
	},

	getListOffer(filter: OfferFilter): Promise<ListResponse<any>> {
		const url = `offers/query`;
		return axiosClient.post(url, filter);
	},
};

export default orderApi;
