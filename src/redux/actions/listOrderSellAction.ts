/* eslint-disable @typescript-eslint/no-unused-vars */
import { dispatch, getState } from '../store';
import {
	startLoading,
	hasError,
	fetchListOrderSellSuccess,
	fetchListOrderSellFirstLoadSuccess,
	setHasNextPage,
} from 'redux/slices/listOrderSellSlice';
// models
import { ListParams, ListResponse, NFT } from 'models';
// api
import orderApi from 'apis/orderApi';
// utils
import { checkHasNextPage } from 'utils';

export function fetchListOrderSell(itemId: string, chainId: number, MyCallBack?: Function) {
	return async () => {
		dispatch(startLoading());
		try {
			const response: ListResponse<any> = await orderApi.getListOrderSell(itemId, chainId);
			dispatch(fetchListOrderSellFirstLoadSuccess(response));
		} catch (error: any) {
			dispatch(hasError(error.message));
		} finally {
			if (MyCallBack) MyCallBack(getState());
		}
	};
}
