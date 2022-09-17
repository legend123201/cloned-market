import auctionApi from 'apis/auctionApi';
import { Response } from 'models';
import { AuctionInfo } from 'models/Auction';
import {
	fetchAuctionDetailSuccess,
	hasError,
	startLoading,
} from 'redux/slices/auctionDetailByAuctionIdSlice';

export function fetchAuctionDetailByAuctionId(
	auctionId: string | undefined,
	MyCallBack: (value: any) => void
) {
	return async (dispatch: any, getState: any) => {
		dispatch(startLoading());
		try {
			const response: Response<AuctionInfo> = await auctionApi.getAuctionDetailByAuctionId(
				auctionId
			);
			dispatch(fetchAuctionDetailSuccess(response));
		} catch (error) {
			dispatch(hasError(error));
		} finally {
			if (MyCallBack) MyCallBack(getState());
		}
	};
}
