import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ListParams, StakeSlot } from 'models';
import { RootState } from '../store';

export interface ListStakedSlotOfUserState {
	isLoading: boolean;
	isSuccess: boolean;
	errorMessage: string;
	listStakedSlotOfUser: StakeSlot[];
	filter: any;
	pagination: ListParams;
	hasNextPage: boolean;
}

const initialState: ListStakedSlotOfUserState = {
	isLoading: false,
	isSuccess: false,
	errorMessage: '',
	listStakedSlotOfUser: [],
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
	name: 'listStakedSlotOfUser',
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
		fetchListStakedSlotOfUserFirstLoadSuccess(state, action: PayloadAction<StakeSlot[]>) {
			state.isLoading = false;
			state.isSuccess = true;
			state.listStakedSlotOfUser = action.payload;
		},
		fetchListStakedSlotOfUserSuccess(state, action: PayloadAction<StakeSlot[]>) {
			state.isLoading = false;
			state.isSuccess = true;
			state.listStakedSlotOfUser = state.listStakedSlotOfUser.concat(action.payload);
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
	fetchListStakedSlotOfUserSuccess,
	fetchListStakedSlotOfUserFirstLoadSuccess,
	setFilter,
	setPagination,
	setHasNextPage,
	resetAll,
} = slice.actions;

// Selector
export const selectInitialState = initialState;
export const selectListStakedSlotOfUser = (state: RootState) =>
	state.listStakedSlotOfUser.listStakedSlotOfUser;
export const selectPagination = (state: RootState) => state.listStakedSlotOfUser.pagination;
export const selectLoading = (state: RootState) => state.listStakedSlotOfUser.isLoading;
export const selectFilter = (state: RootState) => state.listStakedSlotOfUser.filter;
export const selectHasNextPage = (state: RootState) => state.listStakedSlotOfUser.hasNextPage;

// Reducer
export default slice.reducer;
