/* eslint-disable @typescript-eslint/no-unused-vars */
import { dispatch, getState } from '../store';
import {
	startLoading,
	hasError,
	fetchAllNftsSuccess,
	fetchAllNftsFirstLoadSuccess,
	setHasNextPage,
} from 'redux/slices/allNftsSlice';
// models
import { ListParams, ListResponse, NFT } from 'models';
// api
import nftsApi from 'apis/nftsApi';
// utils
import { checkHasNextPage } from 'utils';

export function fetchAllNFTs(
	paginationParams: ListParams,
	filter: ListParams,
	isFetchFirstLoad: boolean,
	MyCallBack?: Function
) {
	return async () => {
		dispatch(startLoading());
		try {
			const response: ListResponse<any> = await nftsApi.getListTokenId(
				paginationParams,
				filter
			);
			const { pagination } = response;
			const check: boolean = checkHasNextPage(pagination.currentPage, pagination.totalPages);

			dispatch(setHasNextPage(check));

			if (isFetchFirstLoad) {
				dispatch(fetchAllNftsFirstLoadSuccess(response));
			} else {
				dispatch(fetchAllNftsSuccess(response));
			}
		} catch (error: any) {
			dispatch(hasError(error.message));
		} finally {
			if (MyCallBack) MyCallBack(getState());
		}
	};
}

export function fetchAllNFTsSearchQuery(
	paginationParams: ListParams,
	filter: ListParams,
	isFetchFirstLoad: boolean,
	MyCallBack?: Function
) {
	return async () => {
		dispatch(startLoading());
		try {
			const response: ListResponse<any> = await nftsApi.getSearchListTokenId(
				paginationParams,
				filter
			);
			const { pagination } = response;
			const check: boolean = checkHasNextPage(pagination.currentPage, pagination.totalPages);

			dispatch(setHasNextPage(check));

			if (isFetchFirstLoad) {
				dispatch(fetchAllNftsFirstLoadSuccess(response));
			} else {
				dispatch(fetchAllNftsSuccess(response));
			}
		} catch (error: any) {
			dispatch(hasError(error.message));
		} finally {
			if (MyCallBack) MyCallBack(getState());
		}
	};
}
