import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ListParams, ListResponse } from 'models';
import { RootState } from '../store';

export interface ListBoxesOfUserState {
	isLoading: boolean;
	isSuccess: boolean;
	errorMessage: string;
	listBoxesOfUser: any[];
	filter: any;
	pagination: ListParams;
	hasNextPage: boolean;
}

const initialState: ListBoxesOfUserState = {
	isLoading: false,
	isSuccess: false,
	errorMessage: '',
	listBoxesOfUser: [],
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
	name: 'listBoxesOfUser',
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
		fetchListBoxesOfUserFirstLoadSuccess(state, action: PayloadAction<ListResponse<any>>) {
			state.isLoading = false;
			state.isSuccess = true;
			state.listBoxesOfUser = action.payload.data;
		},
		fetchListBoxesOfUserSuccess(state, action: PayloadAction<ListResponse<any>>) {
			state.isLoading = false;
			state.isSuccess = true;
			state.listBoxesOfUser = state.listBoxesOfUser.concat(action.payload.data);
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
	fetchListBoxesOfUserSuccess,
	fetchListBoxesOfUserFirstLoadSuccess,
	setFilter,
	setPagination,
	setHasNextPage,
	resetAll,
} = slice.actions;

// Selector
export const selectInitialState = initialState;
export const selectListBoxesOfUser = (state: RootState) => state.listBoxesOfUser.listBoxesOfUser;
export const selectPagination = (state: RootState) => state.listBoxesOfUser.pagination;
export const selectLoading = (state: RootState) => state.listBoxesOfUser.isLoading;
export const selectFilter = (state: RootState) => state.listBoxesOfUser.filter;
export const selectHasNextPage = (state: RootState) => state.listBoxesOfUser.hasNextPage;

// Reducer
export default slice.reducer;
