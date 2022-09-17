/* eslint-disable @typescript-eslint/no-unused-vars */
import collectionApi from 'apis/collectionApi';
import { Collection, ListParams, ListResponse, PaginationParams, Response } from 'models';
import {
	startLoading,
	hasError,
	fetchBoxCollectionsFirstLoadSuccess,
	fetchBoxCollectionsSuccess,
	setHasNextPage,
} from 'redux/slices/boxCollectionsSlice';
//utils
import { checkHasNextPage } from 'utils';
//constants
import { dispatch, getState } from '../store';

export function fetchAllBoxCollections(
	pagination: ListParams,
	filter: ListParams,
	isFetchFirstLoad: boolean,
	MyCallBack?: Function
) {
	return async () => {
		dispatch(startLoading());
		try {
			const response: ListResponse<Collection> = await collectionApi.getListBoxCollectionId(
				pagination,
				filter
			);

			const paginationResponse: PaginationParams = response.pagination;
			const check: boolean = checkHasNextPage(
				paginationResponse.currentPage,
				paginationResponse.totalPages
			);

			dispatch(setHasNextPage(check));

			if (isFetchFirstLoad) {
				dispatch(fetchBoxCollectionsFirstLoadSuccess(response));
			} else {
				dispatch(fetchBoxCollectionsSuccess(response));
			}
		} catch (error) {
			dispatch(hasError(error));
		} finally {
			if (MyCallBack) MyCallBack(getState());
		}
	};
}
