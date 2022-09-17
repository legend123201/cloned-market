import axiosAuthen from './axiosAuthen';
import axiosClient from './axiosClient';
import { InteractionInput, Response, ListResponse, NFT } from 'models';

const interactionApi = {
	interactionNft(data: InteractionInput): Promise<Response<any>> {
		const url = `interactions/create`;
		return axiosAuthen.post(url, data);
	},

	getListFavoriteByAddress(userAddress: string): Promise<ListResponse<NFT>> {
		const url = `interactions/userAddress/${userAddress}`;
		return axiosClient.get(url);
	},
};

export default interactionApi;
