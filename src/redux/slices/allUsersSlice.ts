import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ListParams, ListResponse, User } from 'models';
import { RootState } from '../store';

export interface AllUsersState {
	isLoading: boolean;
	isSuccess: boolean;
	errorMessage: string;
	listUsers: User[];
	filter: any; // not have model for filter yet
	pagination: ListParams;
	hasNextPage: boolean;
}

const initialState: AllUsersState = {
	isLoading: false,
	isSuccess: false,
	errorMessage: '',
	listUsers: [],
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
	name: 'allUsers',
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
		fetchAllUsersFirstLoadSuccess(state, action: PayloadAction<ListResponse<any>>) {
			state.isLoading = false;
			state.isSuccess = true;
			state.listUsers = action.payload.data;
		},
		fetchAllUsersSuccess(state, action: PayloadAction<ListResponse<any>>) {
			state.isLoading = false;
			state.isSuccess = true;
			state.listUsers = state.listUsers.concat(action.payload.data);
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
	fetchAllUsersSuccess,
	fetchAllUsersFirstLoadSuccess,
	setFilter,
	setPagination,
	setHasNextPage,
	resetAll,
} = slice.actions;

// Selector
export const selectInitialState = initialState;
export const selectAllUsers = (state: RootState) => state.allUsers.listUsers;
export const selectPagination = (state: RootState) => state.allUsers.pagination;
export const selectLoading = (state: RootState) => state.allUsers.isLoading;
export const selectFilter = (state: RootState) => state.allUsers.filter;
export const selectHasNextPage = (state: RootState) => state.allUsers.hasNextPage;

// Reducer
export default slice.reducer;
