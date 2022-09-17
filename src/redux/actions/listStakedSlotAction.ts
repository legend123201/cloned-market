/* eslint-disable @typescript-eslint/no-unused-vars */
import stakeApi from 'apis/stakeApi';
import { ListResponse, StakeSlot, NFT, PaginationParams, Response } from 'models';

import {
	startLoading,
	hasError,
	fetchListStakedSlotOfUserFirstLoadSuccess,
	fetchListStakedSlotOfUserSuccess,
	setHasNextPage,
} from 'redux/slices/listStakedSlotOfUserSlice';
//utils
import { checkHasNextPage } from 'utils';
import { dispatch, getState } from '../store';

export function fetchListStakedSlotOfUser(
	userAddress: string,
	chainId: number,
	stateStaking: 'cancel' | 'isHarvest' | 'isStaked',
	isFetchFirstLoad: boolean,
	MyCallBack?: Function
) {
	return async () => {
		dispatch(startLoading());
		try {
			const response: Response<StakeSlot[]> = await stakeApi.getListStakeSlot({
				userAddress,
				chainId: [chainId],
				stateStaking,
			});

			// const paginationResponse: PaginationParams = response.pagination;
			// const check: boolean = checkHasNextPage(
			// 	paginationResponse.currentPage,
			// 	paginationResponse.totalPages
			// );

			// dispatch(setHasNextPage(check));

			if (isFetchFirstLoad) {
				dispatch(fetchListStakedSlotOfUserFirstLoadSuccess(response.data));
			} else {
				dispatch(fetchListStakedSlotOfUserSuccess(response.data));
			}
		} catch (error) {
			dispatch(hasError(error));
		} finally {
			if (MyCallBack) MyCallBack(getState());
		}
	};
}
