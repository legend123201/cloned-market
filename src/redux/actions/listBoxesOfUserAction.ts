/* eslint-disable @typescript-eslint/no-unused-vars */
import nftsApi from 'apis/nftsApi';
import { ListResponse, NFT, PaginationParams, Response } from 'models';

import {
	startLoading,
	hasError,
	fetchListBoxesOfUserFirstLoadSuccess,
	fetchListBoxesOfUserSuccess,
	setHasNextPage,
} from 'redux/slices/listBoxesOfUserSlice';
//utils
import { checkHasNextPage } from 'utils';
import { dispatch, getState } from '../store';

export function fetchListBoxesOfUser(
	userAddress: string,
	chainId: number,
	pageSize: number,
	page: number,
	isFetchFirstLoad: boolean,
	MyCallBack?: Function
) {
	return async () => {
		dispatch(startLoading());
		try {
			const response: ListResponse<NFT> = await nftsApi.getListBoxIdOfUser(
				userAddress,
				chainId,
				pageSize,
				page
			);

			// const paginationResponse: PaginationParams = response.pagination;
			// const check: boolean = checkHasNextPage(
			// 	paginationResponse.currentPage,
			// 	paginationResponse.totalPages
			// );

			dispatch(fetchListBoxesOfUserFirstLoadSuccess(response));

			if (isFetchFirstLoad) {
				dispatch(fetchListBoxesOfUserFirstLoadSuccess(response));
			} else {
				dispatch(fetchListBoxesOfUserSuccess(response));
			}
		} catch (error) {
			dispatch(hasError(error));
		} finally {
			if (MyCallBack) MyCallBack(getState());
		}
	};
}
