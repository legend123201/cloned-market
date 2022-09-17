/* eslint-disable @typescript-eslint/no-unused-vars */
import { ListParams, ListResponse } from 'models';
import { dispatch, getState } from '../store';
import tradingApi from 'apis/historyApi';
import {
	startLoading,
	hasError,
	fetchListActivityFirstLoadSuccess,
	fetchListActivitySuccess,
	setHasNextPage,
} from 'redux/slices/tradingSlice';
import { HistoryActivity } from 'models';
import { checkHasNextPage } from 'utils';

// export function fetchTradingHistoryByNFTsId(itemId: string, MyCallBack?: Function) {
// 	return async () => {
// 		dispatch(startLoading());
// 		try {
// 			const response: ListResponse<HistoryActivity> =
// 				await tradingApi.getTradingHistoryByNFTsId(itemId);

// 			dispatch(fetchTradingHistorySuccess(response));
// 		} catch (error) {
// 			dispatch(hasError(error));
// 		} finally {
// 			if (MyCallBack) MyCallBack(getState());
// 		}
// 	};
// }

export function fetchTradingHistoryByNFTsId(
	itemId: string,
	paginationParams: ListParams,
	filter: ListParams,
	isFetchFirstLoad: boolean,
	MyCallBack?: Function
) {
	return async () => {
		dispatch(startLoading());

		try {
			const response: ListResponse<any> = await tradingApi.getTradingHistoryByNFTsId(
				itemId,
				paginationParams,
				filter
			);

			const { pagination } = response;
			const check: boolean = checkHasNextPage(pagination.currentPage, pagination.totalPages);

			dispatch(setHasNextPage(check));

			if (isFetchFirstLoad) {
				dispatch(fetchListActivityFirstLoadSuccess(response));
			} else {
				dispatch(fetchListActivitySuccess(response));
			}
		} catch (error: any) {
			dispatch(hasError(error.message));
		} finally {
			if (MyCallBack) MyCallBack(getState());
		}
	};
}

export function fetchUserHistory(
	userAddress: string,
	paginationParams: ListParams,
	filter: ListParams,
	isFetchFirstLoad: boolean,
	MyCallBack?: Function
) {
	return async () => {
		dispatch(startLoading());

		try {
			const response: ListResponse<any> = await tradingApi.getActivityHistoryByUserAddress(
				userAddress,
				paginationParams,
				filter
			);

			const { pagination } = response;
			const check: boolean = checkHasNextPage(pagination.currentPage, pagination.totalPages);

			dispatch(setHasNextPage(check));

			if (isFetchFirstLoad) {
				dispatch(fetchListActivityFirstLoadSuccess(response));
			} else {
				dispatch(fetchListActivitySuccess(response));
			}
		} catch (error: any) {
			dispatch(hasError(error.message));
		} finally {
			if (MyCallBack) MyCallBack(getState());
		}
	};
}

export function fetchCollectionHistory(
	collectionId: string,
	paginationParams: ListParams,
	filter: ListParams,
	isFetchFirstLoad: boolean,
	MyCallBack?: Function
) {
	return async () => {
		dispatch(startLoading());

		try {
			const response: ListResponse<any> = await tradingApi.getActivityHistoryByCollectionId(
				collectionId,
				paginationParams,
				filter
			);

			const { pagination } = response;
			const check: boolean = checkHasNextPage(pagination.currentPage, pagination.totalPages);

			dispatch(setHasNextPage(check));

			if (isFetchFirstLoad) {
				dispatch(fetchListActivityFirstLoadSuccess(response));
			} else {
				dispatch(fetchListActivitySuccess(response));
			}
		} catch (error: any) {
			dispatch(hasError(error.message));
		} finally {
			if (MyCallBack) MyCallBack(getState());
		}
	};
}
