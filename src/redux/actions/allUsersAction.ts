/* eslint-disable @typescript-eslint/no-unused-vars */
import { dispatch, getState } from '../store';
import {
	startLoading,
	hasError,
	fetchAllUsersSuccess,
	fetchAllUsersFirstLoadSuccess,
	setHasNextPage,
} from 'redux/slices/allUsersSlice';
// model
import { ListParams, ListResponse } from 'models';
// api
import userApi from 'apis/userApi';
// utils
import { checkHasNextPage } from 'utils';

export function fetchAllUsers(
	paginationParams: ListParams,
	filter: ListParams,
	isFetchFirstLoad: boolean,
	MyCallBack?: Function
) {
	return async () => {
		dispatch(startLoading());
		try {
			const response: ListResponse<any> = await userApi.getListUserById(
				paginationParams,
				filter
			);
			const { pagination } = response;
			const check: boolean = checkHasNextPage(pagination.currentPage, pagination.totalPages);

			dispatch(setHasNextPage(check));

			if (isFetchFirstLoad) {
				dispatch(fetchAllUsersFirstLoadSuccess(response));
			} else {
				dispatch(fetchAllUsersSuccess(response));
			}
		} catch (error: any) {
			dispatch(hasError(error.message));
		} finally {
			if (MyCallBack) MyCallBack(getState());
		}
	};
}
