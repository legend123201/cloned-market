import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ListResponseNonPaging, NFT } from 'models';
import { RootState } from '../store';

export interface AllBoxesState {
	isLoading: boolean;
	isSuccess: boolean;
	errorMessage: string;
	listBoxes: NFT[]; // temporarily let model boxes = NFT
}

const initialState: AllBoxesState = {
	isLoading: false,
	isSuccess: false,
	errorMessage: '',
	listBoxes: [],
};

export const slice = createSlice({
	name: 'allBoxes',
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
		fetchAllBoxesSuccess(state, action: PayloadAction<ListResponseNonPaging<NFT>>) {
			state.isLoading = false;
			state.isSuccess = true;
			state.listBoxes = action.payload.data;
		},
		resetAll: () => initialState,
	},
});

// Actions
export const { startLoading, hasError, fetchAllBoxesSuccess, resetAll } = slice.actions;

// Selector
export const selectInitialState = initialState;
export const selectAllBoxes = (state: RootState) => state.allBoxes.listBoxes;
export const selectLoading = (state: RootState) => state.allBoxes.isLoading;

// Reducer
export default slice.reducer;
