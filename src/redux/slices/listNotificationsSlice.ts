import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ListParams, ListResponse } from 'models';
import { RootState } from '../store';

export interface notificationState {
	isLoading: boolean;
	isSuccess: boolean;
	errorMessage: string;
	listNotifications: any[]; // not have model yet
	filter: any;
	pagination: ListParams;
	hasNextPage: boolean;
}

const initialState: notificationState = {
	isLoading: false,
	isSuccess: false,
	errorMessage: '',
	listNotifications: [],
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
	name: 'listNotifications',
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
		fetchListNotificationsFirstLoadSuccess(state, action: PayloadAction<ListResponse<any>>) {
			state.isLoading = false;
			state.isSuccess = true;
			state.listNotifications = action.payload.data;
		},
		fetchListNotificationsSuccess(state, action: PayloadAction<ListResponse<any>>) {
			state.isLoading = false;
			state.isSuccess = true;
			state.listNotifications = state.listNotifications.concat(action.payload.data);
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
	fetchListNotificationsSuccess,
	fetchListNotificationsFirstLoadSuccess,
	setFilter,
	setPagination,
	setHasNextPage,
	resetAll,
} = slice.actions;

// Selector
export const selectInitialState = initialState;
export const selectListNotifications = (state: RootState) =>
	state.listNotifications.listNotifications;
export const selectPagination = (state: RootState) => state.listNotifications.pagination;
export const selectLoading = (state: RootState) => state.listNotifications.isLoading;
export const selectFilter = (state: RootState) => state.listNotifications.filter;
export const selectHasNextPage = (state: RootState) => state.listNotifications.hasNextPage;

// Reducer
export default slice.reducer;
