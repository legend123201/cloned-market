import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ListParams, ListResponse } from 'models';
import { RootState } from '../store';

export interface ListItemsFromBoxesOfUserState {
	isLoading: boolean;
	isSuccess: boolean;
	errorMessage: string;
	listItemsFromBoxesOfUser: any[];
	filter: any;
	pagination: ListParams;
	hasNextPage: boolean;
}

const initialState: ListItemsFromBoxesOfUserState = {
	isLoading: false,
	isSuccess: false,
	errorMessage: '',
	listItemsFromBoxesOfUser: [],
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
	name: 'listItemsFromBoxesOfUser',
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
		fetchListItemsFromBoxesOfUserFirstLoadSuccess(
			state,
			action: PayloadAction<ListResponse<any>>
		) {
			state.isLoading = false;
			state.isSuccess = true;
			state.listItemsFromBoxesOfUser = action.payload.data;
		},
		fetchListItemsFromBoxesOfUserSuccess(state, action: PayloadAction<ListResponse<any>>) {
			state.isLoading = false;
			state.isSuccess = true;
			state.listItemsFromBoxesOfUser = state.listItemsFromBoxesOfUser.concat(
				action.payload.data
			);
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
	fetchListItemsFromBoxesOfUserSuccess,
	fetchListItemsFromBoxesOfUserFirstLoadSuccess,
	setFilter,
	setPagination,
	setHasNextPage,
	resetAll,
} = slice.actions;

// Selector
export const selectInitialState = initialState;
export const selectListItemsFromBoxesOfUser = (state: RootState) =>
	state.listItemsFromBoxesOfUser.listItemsFromBoxesOfUser;
export const selectPagination = (state: RootState) => state.listItemsFromBoxesOfUser.pagination;
export const selectLoading = (state: RootState) => state.listItemsFromBoxesOfUser.isLoading;
export const selectFilter = (state: RootState) => state.listItemsFromBoxesOfUser.filter;
export const selectHasNextPage = (state: RootState) => state.listItemsFromBoxesOfUser.hasNextPage;

// Reducer
export default slice.reducer;
