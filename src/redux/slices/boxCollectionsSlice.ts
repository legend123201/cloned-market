import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ListParams, ListResponse, Collection } from 'models';
import { RootState } from '../store';

export interface BoxCollectionsState {
	isLoading: boolean;
	isSuccess: boolean;
	errorMessage: string;
	listBoxCollections: Collection[];
	filter: any; // not have model for filter yet
	pagination: ListParams;
	hasNextPage: boolean;
}

const initialState: BoxCollectionsState = {
	isLoading: false,
	isSuccess: false,
	errorMessage: '',
	listBoxCollections: [],
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
	name: 'boxCollections',
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
		fetchBoxCollectionsFirstLoadSuccess(state, action: PayloadAction<ListResponse<any>>) {
			state.isLoading = false;
			state.isSuccess = true;
			state.listBoxCollections = action.payload.data;
		},
		fetchBoxCollectionsSuccess(state, action: PayloadAction<ListResponse<any>>) {
			state.isLoading = false;
			state.isSuccess = true;
			state.listBoxCollections = state.listBoxCollections.concat(action.payload.data);
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
	fetchBoxCollectionsSuccess,
	fetchBoxCollectionsFirstLoadSuccess,
	setFilter,
	setPagination,
	setHasNextPage,
	resetAll,
} = slice.actions;

// Selector
export const selectInitialState = initialState;
export const selectBoxCollections = (state: RootState) => state.boxCollections.listBoxCollections;
export const selectPagination = (state: RootState) => state.boxCollections.pagination;
export const selectLoading = (state: RootState) => state.boxCollections.isLoading;
export const selectFilter = (state: RootState) => state.boxCollections.filter;
export const selectHasNextPage = (state: RootState) => state.boxCollections.hasNextPage;

// Reducer
export default slice.reducer;
