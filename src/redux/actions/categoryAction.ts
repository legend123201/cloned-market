/* eslint-disable @typescript-eslint/no-unused-vars */
import collectionApi from 'apis/collectionApi';
import { Collection, ListParams, ListResponse, PaginationParams, Response } from 'models';

import {
	startLoading,
	hasError,
	fetchAllCollectionFirstLoadSuccess,
	fetchAllCollectionSuccess,
	fetchListCollectionsByOwnerOrCreatorItemsFirstLoadSuccess,
	fetchListCollectionsByOwnerOrCreatorItemsSuccess,
	fetchCollectionByIdSuccess,
	createCollectionSuccess,
	editCollectionSuccess,
	setHasNextPage,
} from 'redux/slices/categorySlice';
//utils
import { checkHasNextPage } from 'utils';
//constants
import { dispatch, getState } from '../store';

export function fetchAllCollection(
	pagination: ListParams,
	type: number,
	isFetchFirstLoad: boolean,
	MyCallBack?: Function
) {
	return async () => {
		dispatch(startLoading());
		try {
			const response: ListResponse<any> = await collectionApi.getListCollectionIdByCategory(
				pagination,
				type
			);

			const paginationResponse: PaginationParams = response.pagination;
			const check: boolean = checkHasNextPage(
				paginationResponse.currentPage,
				paginationResponse.totalPages
			);

			dispatch(setHasNextPage(check));

			if (isFetchFirstLoad) {
				dispatch(fetchAllCollectionFirstLoadSuccess(response));
			} else {
				dispatch(fetchAllCollectionSuccess(response));
			}
		} catch (error) {
			dispatch(hasError(error));
		} finally {
			if (MyCallBack) MyCallBack(getState());
		}
	};
}

export function fetchAllCollectionSearchParams(
	pagination: ListParams,
	filter: ListParams,
	isFetchFirstLoad: boolean,
	MyCallBack?: Function
) {
	return async () => {
		dispatch(startLoading());
		try {
			const response: ListResponse<Collection> =
				await collectionApi.getSearchListCollectionId(pagination, filter);

			const paginationResponse: PaginationParams = response.pagination;
			const check: boolean = checkHasNextPage(
				paginationResponse.currentPage,
				paginationResponse.totalPages
			);

			dispatch(setHasNextPage(check));

			if (isFetchFirstLoad) {
				dispatch(fetchAllCollectionFirstLoadSuccess(response));
			} else {
				dispatch(fetchAllCollectionSuccess(response));
			}
		} catch (error) {
			dispatch(hasError(error));
		} finally {
			if (MyCallBack) MyCallBack(getState());
		}
	};
}

export function fetchListCollectionsByOwnerOrCreatorItems(
	pagination: ListParams,
	filter: ListParams,
	isFetchFirstLoad: boolean,
	MyCallBack?: Function
) {
	return async () => {
		dispatch(startLoading());
		try {
			const response: ListResponse<Collection> =
				await collectionApi.getListCollectionByOwnerOrCreatorItems(pagination, filter);

			const paginationResponse: PaginationParams = response.pagination;
			const check: boolean = checkHasNextPage(
				paginationResponse.currentPage,
				paginationResponse.totalPages
			);

			dispatch(setHasNextPage(check));

			if (isFetchFirstLoad) {
				dispatch(fetchListCollectionsByOwnerOrCreatorItemsFirstLoadSuccess(response));
			} else {
				dispatch(fetchListCollectionsByOwnerOrCreatorItemsSuccess(response));
			}
		} catch (error) {
			dispatch(hasError(error));
		} finally {
			if (MyCallBack) MyCallBack(getState());
		}
	};
}

export function fetchCollectionById(collectionId: string, MyCallBack?: Function) {
	return async () => {
		dispatch(startLoading());
		try {
			const response: Response<Collection> = await collectionApi.getCollectionById(
				collectionId
			);

			dispatch(fetchCollectionByIdSuccess(response));
		} catch (error) {
			dispatch(hasError(error));
		} finally {
			if (MyCallBack) MyCallBack(getState());
		}
	};
}

export function fetchCollectionDetailById(collectionId: string, MyCallBack?: Function) {
	return async () => {
		dispatch(startLoading());
		try {
			const response: Response<Collection> = await collectionApi.getCollectionDetailById(
				collectionId
			);

			dispatch(fetchCollectionByIdSuccess(response));
		} catch (error) {
			dispatch(hasError(error));
		} finally {
			if (MyCallBack) MyCallBack(getState());
		}
	};
}

export function createCollection(data: Collection, myCallBack?: Function) {
	return async () => {
		dispatch(startLoading());
		try {
			await collectionApi.createCollection(data);
			dispatch(createCollectionSuccess());
		} catch (error: any) {
			console.log(error.error);
			dispatch(hasError(error));
		}
	};
}

export function editCollection(data: Collection, collectionId: string, MyCallBack?: Function) {
	return async () => {
		dispatch(startLoading());
		try {
			await collectionApi.editCollection(data, collectionId);
			dispatch(editCollectionSuccess());
		} catch (error) {
			dispatch(hasError(error));
		} finally {
			if (MyCallBack) MyCallBack(getState());
		}
	};
}
