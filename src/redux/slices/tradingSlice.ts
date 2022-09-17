import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { HistoryActivity } from 'models/histories';
import { ListParams, ListResponse } from 'models';

export interface TradingHistoryState {
	isLoading: boolean;
	isSuccess: boolean;
	errorMessage: string;
	listActivity: HistoryActivity[];
	filter: any;
	pagination: ListParams;
	hasNextPage: boolean;
}

const initialState: TradingHistoryState = {
	isLoading: false,
	isSuccess: false,
	errorMessage: '',
	listActivity: [],
	filter: {
		isFiltering: false,
	},
	pagination: {
		page: 1,
		pageSize: 8,
	},
	hasNextPage: false,
};

export const slice = createSlice({
	name: 'tradeHistory',
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
		fetchListActivityFirstLoadSuccess(state, action: PayloadAction<ListResponse<any>>) {
			state.isLoading = false;
			state.isSuccess = true;
			state.listActivity = action.payload.data;
		},
		fetchListActivitySuccess(state, action: PayloadAction<ListResponse<any>>) {
			state.isLoading = false;
			state.isSuccess = true;
			state.listActivity = state.listActivity.concat(action.payload.data);
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
	fetchListActivityFirstLoadSuccess,
	fetchListActivitySuccess,
	setFilter,
	setPagination,
	setHasNextPage,
	resetAll,
} = slice.actions;

// Selectors
export const selectInitialState = initialState;
export const selectLoading = (state: RootState) => state.tradeHistory.isLoading;
export const selectListActivity = (state: RootState) => state.tradeHistory.listActivity;
export const selectPagination = (state: RootState) => state.tradeHistory.pagination;
export const selectFilter = (state: RootState) => state.tradeHistory.filter;
export const selectHasNextPage = (state: RootState) => state.tradeHistory.hasNextPage;

// Reducer
export default slice.reducer;
