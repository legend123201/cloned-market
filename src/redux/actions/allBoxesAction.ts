/* eslint-disable @typescript-eslint/no-unused-vars */
import { dispatch, getState } from '../store';
import { startLoading, hasError, fetchAllBoxesSuccess } from 'redux/slices/allBoxesSlice';
// model
import { ListResponseNonPaging } from 'models';
// api
import nftsApi from 'apis/nftsApi';

export function fetchAllBoxes(chainId: number, MyCallBack?: Function) {
	return async () => {
		dispatch(startLoading());
		try {
			const response: ListResponseNonPaging<any> = await nftsApi.getListBoxTokenId(chainId);

			dispatch(fetchAllBoxesSuccess(response));
		} catch (error: any) {
			dispatch(hasError(error.message));
		} finally {
			if (MyCallBack) MyCallBack(getState());
		}
	};
}
