import { Response, StakeSlot } from 'models';
import axiosClient from './axiosClient';

const uploadApi = {
	getListStakeSlot(data: any): Promise<Response<StakeSlot[]>> {
		const url = '/staking/query-staking/pageSize/9999/page/1';
		return axiosClient.post(url, data);
	},

	getDetailStakeSlot(slotId: any): Promise<Response<StakeSlot>> {
		const url = `/staking/detail/${slotId}`;
		return axiosClient.get(url);
	},

	getDetailStakingPool(chainId: number): Promise<Response<any>> {
		const url = `/staking/totalInfo/chainId/${chainId}`;
		return axiosClient.get(url);
	},
};

export default uploadApi;
