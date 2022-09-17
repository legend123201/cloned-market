/* eslint-disable @typescript-eslint/no-unused-vars */
import stakeApi from 'apis/stakeApi';
import { ListResponse, NFT, PaginationParams, Response, StakeSlot } from 'models';

import {
	startLoading,
	hasError,
	fetchListStakingSlotOfUserFirstLoadSuccess,
	fetchListStakingSlotOfUserSuccess,
	setHasNextPage,
} from 'redux/slices/listStakingSlotOfUserSlice';
//utils
import { checkHasNextPage } from 'utils';
import { dispatch, getState } from '../store';

export function fetchListStakingSlotOfUser(
	userAddress: string,
	chainId: number,
	stateStaking: 'cancel' | 'isHarvest' | 'isStaking',
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
				dispatch(fetchListStakingSlotOfUserFirstLoadSuccess(response.data));
			} else {
				dispatch(fetchListStakingSlotOfUserSuccess(response.data));
			}
		} catch (error) {
			dispatch(hasError(error));
		} finally {
			if (MyCallBack) MyCallBack(getState());
		}
	};
}
