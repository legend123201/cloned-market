/* eslint-disable @typescript-eslint/no-unused-vars */
import auctionApi from 'apis/auctionApi';
import { ListParams, ListResponse, NFT, PaginationParams, Response } from 'models';

import {
	startLoading,
	hasError,
	fetchAllNftFirstLoadSuccess,
	fetchAllNftSuccess,
	setFilter,
	setPagination,
	setHasNextPage,
	resetAll,
} from 'redux/slices/auctionUpcomingSlice';
import { checkHasNextPage } from 'utils';

//ultils

//Contract

import { dispatch, getState } from '../store';

export function fetchAllItemAuctionUpcoming(
	pagination: ListParams,
	filter: ListParams,
	isFetchFirstLoad: boolean,
	MyCallBack?: Function
) {
	return async () => {
		dispatch(startLoading());
		try {
			const response: ListResponse<any> = await auctionApi.getListAuctionId(
				pagination,
				'upcoming'
			);
			const paginationResponse: PaginationParams = response.pagination;
			const check: boolean = checkHasNextPage(
				paginationResponse.currentPage,
				paginationResponse.totalPages
			);

			dispatch(setHasNextPage(check));

			if (isFetchFirstLoad) {
				dispatch(fetchAllNftFirstLoadSuccess(response));
			} else {
				dispatch(fetchAllNftSuccess(response));
			}
		} catch (error) {
			dispatch(hasError(error));
		} finally {
			if (MyCallBack) MyCallBack(getState());
		}
	};
}

export function fetchNftsById(auctionId: string, MyCallBack?: Function) {
	return async () => {
		dispatch(startLoading());
		try {
			const response: Response<any> = await auctionApi.getAuctionDetailByAuctionId(auctionId);

			// dispatch(fetchAllNftFirstLoadSuccess(response));
		} catch (error) {
			dispatch(hasError(error));
		} finally {
			if (MyCallBack) MyCallBack(getState());
		}
	};
}
