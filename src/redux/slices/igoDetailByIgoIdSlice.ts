/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ListParams, Response } from 'models';
import { AuctionInfo } from 'models/Auction';
import { RootState } from 'redux/store';

export interface AuctionDetailState {
	isLoading: boolean;
	isSuccess: boolean;
	errorMessage: string;
	AuctionInfo: AuctionInfo | null;
	filter: ListParams;
}

const initialState: AuctionDetailState = {
	isLoading: false,
	isSuccess: false,
	errorMessage: '',
	AuctionInfo: null,
	filter: {
		chainId: 0,
		itemId: 0,
	},
};

export const slice = createSlice({
	name: 'igoDetail',
	initialState,
	reducers: {
		// START LOADING
		startLoading(state) {
			state.isLoading = true;
		},
		// HAS ERROR
		hasError(state, action) {
			state.isLoading = false;
			state.isSuccess = false;
			state.errorMessage = action.payload;
		},
		// PayloadAction<Response<AuctionInfo>>
		fetchIgoDetailSuccess: (state, action: PayloadAction<Response<any>>) => {
			state.isLoading = false;
			state.isSuccess = true;
			state.AuctionInfo = action.payload.data;
		},
	},
});

// ACTIONS
export const { startLoading, hasError, fetchIgoDetailSuccess } = slice.actions;

// SELECTOR
export const selectIgoDetail = (state: RootState) => state.igoDetail.AuctionInfo;
export const selectLoading = (state: RootState) => state.igoDetail.isLoading;
export const selectFilter = (state: RootState) => state.igoDetail.filter;

// REDUCER
export default slice.reducer;
