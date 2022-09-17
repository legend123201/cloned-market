/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
// redux
import { RootState } from 'redux/store';
import { useDispatch, useSelector } from 'react-redux';
import {
	selectAllBoxes,
	selectInitialState,
	selectLoading,
	resetAll,
} from 'redux/slices/allBoxesSlice';
// actions
import { fetchAllBoxes } from 'redux/actions/allBoxesAction';
// mui
import { Box } from '@mui/material';
// components
import InfiniteListBox from 'components/CustomUI/InfiniteList/MysteryBox/InfiniteListBox';
import { selectChainId } from 'redux/slices/web3InfoSlice';

export interface IBoxesTabProps {}

export default function BoxesTab(props: IBoxesTabProps) {
	const dispatch = useDispatch();

	// useSelector
	const listTokenId = useSelector(selectAllBoxes);
	const isLoading = useSelector(selectLoading);
	const chainId = useSelector(selectChainId);

	const initialState = selectInitialState;

	// useEffect
	// fetch all box
	useEffect(() => {
		if (!chainId) return;
		dispatch(fetchAllBoxes(chainId, executeAfterFetchAllBoxes));

		return () => {
			dispatch(resetAll());
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [chainId]);

	// functions
	const executeAfterFetchAllBoxes = (globalStateNewest: RootState) => {
		const { allBoxes } = globalStateNewest;

		if (!allBoxes.isSuccess) {
			toast.error('Some error occur when getting all boxes! ' + allBoxes.errorMessage);
		}
	};

	return (
		<Box>
			<Box sx={{ mt: 3 }}>
				<InfiniteListBox
					listTokenId={listTokenId}
					isLoading={isLoading}
					hasNextPage={false}
					fetchNextPage={() => {}}
					allowLoadMore={false}
				/>
			</Box>
		</Box>
	);
}
