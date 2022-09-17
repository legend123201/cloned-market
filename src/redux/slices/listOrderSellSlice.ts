import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OrderResponseAPI, ListParams, ListResponse } from 'models';
import { RootState } from '../store';

export interface ListOrderSellState {
	isLoading: boolean;
	isSuccess: boolean;
	errorMessage: string;
	listOrderSell: OrderResponseAPI[];
	filter: any;
	pagination: ListParams;
	hasNextPage: boolean;
}

const initialState: ListOrderSellState = {
	isLoading: false,
	isSuccess: false,
	errorMessage: '',
	listOrderSell: [],
	filter: {
		isFiltering: false,
	},
	pagination: {
		page: 1,
		pageSize: 20,
	},
	hasNextPage: false,
};

export const slice = createSlice({
	name: 'listOrderSell',
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
		fetchListOrderSellFirstLoadSuccess(state, action: PayloadAction<ListResponse<any>>) {
			state.isLoading = false;
			state.isSuccess = true;
			state.listOrderSell = action.payload.data;
		},
		fetchListOrderSellSuccess(state, action: PayloadAction<ListResponse<any>>) {
			state.isLoading = false;
			state.isSuccess = true;
			state.listOrderSell = state.listOrderSell.concat(action.payload.data);
		},
		setFilter(state, action) {
			return { ...initialState, filter: { ...action.payload, isFiltering: true } };
		},
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
	fetchListOrderSellSuccess,
	fetchListOrderSellFirstLoadSuccess,
	setFilter,
	setPagination,
	setHasNextPage,
	resetAll,
} = slice.actions;

// Selector
export const selectInitialState = initialState;
export const selectListOrderSell = (state: RootState) => state.listOrderSell.listOrderSell;
export const selectPagination = (state: RootState) => state.listOrderSell.pagination;
export const selectLoading = (state: RootState) => state.listOrderSell.isLoading;
export const selectFilter = (state: RootState) => state.listOrderSell.filter;
export const selectHasNextPage = (state: RootState) => state.listOrderSell.hasNextPage;

// Reducer
export default slice.reducer;
