/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ListResponse, Pagination } from 'models';
import { AuctionInfo } from 'models/Auction';
import { RootState } from 'redux/store';

export interface InitialStateAuctionLiveOn {
	isLoading: boolean;
	isSuccess: boolean;
	errorMessage: string;
	listAutionId: string[];
	filter: any;
	pagination: Pagination;
	hasNextPage: boolean;
}

const initialState: InitialStateAuctionLiveOn = {
	isLoading: false,
	isSuccess: false,
	errorMessage: '',
	listAutionId: [],
	filter: {
		collectionId: [],
		chainId: [],
		status: [],
		tokenSymbol: '',
		minPrice: '',
		maxPrice: '',
		itemName: '',
		owner: '',
		text: '',
		isFiltering: false,
	},
	pagination: {
		page: 1,
		pageSize: 20,
	},
	hasNextPage: false,
};

export const slice = createSlice({
	name: 'auctionLiveOn',
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
		// Get all NFTs in the first time render
		fetchAllNftFirstLoadSuccess(state, action: PayloadAction<ListResponse<any>>) {
			state.isLoading = false;
			state.isSuccess = true;
			state.listAutionId = action.payload.data;
		},
		// Contiunue render NFTs when this funcion run
		fetchAllNftSuccess(state, action: PayloadAction<ListResponse<any>>) {
			state.isLoading = false;
			state.isSuccess = true;
			state.listAutionId = state.listAutionId.concat(action.payload.data);
		},
		// Filter NFTs
		setFilter(state, action) {
			return { ...initialState, filter: { ...action.payload, isFiltering: true } };
		},
		// Set number of Page and Size Page
		setPagination(state, action) {
			state.pagination = action.payload;
		},
		setHasNextPage(state, action) {
			state.hasNextPage = action.payload;
		},
		resetAll: () => initialState,
	},
});

// Actions
export const {
	startLoading,
	hasError,
	fetchAllNftFirstLoadSuccess,
	fetchAllNftSuccess,
	setFilter,
	setPagination,
	setHasNextPage,
	resetAll,
} = slice.actions;

// Selectors
export const selectInitialState = initialState;
export const selectListItemAuction = (state: RootState) => state.auctionLiveOn.listAutionId;
export const selectPagination = (state: RootState) => state.auctionLiveOn.pagination;
export const selectLoading = (state: RootState) => state.auctionLiveOn.isLoading;
export const selectFilter = (state: RootState) => state.auctionLiveOn.filter;
export const selectHasNextPage = (state: RootState) => state.auctionLiveOn.hasNextPage;

// Reducer
export default slice.reducer;
