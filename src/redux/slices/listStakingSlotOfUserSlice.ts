import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ListParams, StakeSlot } from 'models';
import { RootState } from '../store';

export interface ListStakingSlotOfUserState {
	isLoading: boolean;
	isSuccess: boolean;
	errorMessage: string;
	listStakingSlotOfUser: StakeSlot[];
	filter: any;
	pagination: ListParams;
	hasNextPage: boolean;
}

const initialState: ListStakingSlotOfUserState = {
	isLoading: false,
	isSuccess: false,
	errorMessage: '',
	listStakingSlotOfUser: [],
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
	name: 'listStakingSlotOfUser',
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
		fetchListStakingSlotOfUserFirstLoadSuccess(state, action: PayloadAction<StakeSlot[]>) {
			state.isLoading = false;
			state.isSuccess = true;
			state.listStakingSlotOfUser = action.payload;
		},
		fetchListStakingSlotOfUserSuccess(state, action: PayloadAction<StakeSlot[]>) {
			state.isLoading = false;
			state.isSuccess = true;
			state.listStakingSlotOfUser = state.listStakingSlotOfUser.concat(action.payload);
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
	fetchListStakingSlotOfUserSuccess,
	fetchListStakingSlotOfUserFirstLoadSuccess,
	setFilter,
	setPagination,
	setHasNextPage,
	resetAll,
} = slice.actions;

// Selector
export const selectInitialState = initialState;
export const selectListStakingSlotOfUser = (state: RootState) =>
	state.listStakingSlotOfUser.listStakingSlotOfUser;
export const selectPagination = (state: RootState) => state.listStakingSlotOfUser.pagination;
export const selectLoading = (state: RootState) => state.listStakingSlotOfUser.isLoading;
export const selectFilter = (state: RootState) => state.listStakingSlotOfUser.filter;
export const selectHasNextPage = (state: RootState) => state.listStakingSlotOfUser.hasNextPage;

// Reducer
export default slice.reducer;
