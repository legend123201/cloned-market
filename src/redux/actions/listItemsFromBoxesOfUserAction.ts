/* eslint-disable @typescript-eslint/no-unused-vars */
import nftsApi from 'apis/nftsApi';
import { ListResponse, NFT, PaginationParams, Response } from 'models';

import {
	startLoading,
	hasError,
	fetchListItemsFromBoxesOfUserFirstLoadSuccess,
	fetchListItemsFromBoxesOfUserSuccess,
	setHasNextPage,
} from 'redux/slices/listItemsFromBoxesOfUserSlice';
//utils
import { checkHasNextPage } from 'utils';
import { dispatch, getState } from '../store';

export function fetchListItemsFromBoxesOfUser(
	userAddress: string,
	chainId: number,
	isFetchFirstLoad: boolean,
	MyCallBack?: Function
) {
	return async () => {
		dispatch(startLoading());
		try {
			const response: ListResponse<NFT> = await nftsApi.getListItemIdFromBoxOfUser(
				userAddress,
				chainId
			);
			// const paginationResponse: PaginationParams = response.pagination;
			// const check: boolean = checkHasNextPage(
			// 	paginationResponse.currentPage,
			// 	paginationResponse.totalPages
			// );

			// dispatch(setHasNextPage(check));

			if (isFetchFirstLoad) {
				dispatch(fetchListItemsFromBoxesOfUserFirstLoadSuccess(response));
			} else {
				dispatch(fetchListItemsFromBoxesOfUserSuccess(response));
			}
		} catch (error) {
			dispatch(hasError(error));
		} finally {
			if (MyCallBack) MyCallBack(getState());
		}
	};
}
