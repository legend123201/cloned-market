/* eslint-disable @typescript-eslint/no-unused-vars */

import { Box, Stack, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	selectInitialState,
	selectListItemAuction,
	selectLoading,
	selectPagination,
	selectFilter,
	selectHasNextPage,
} from 'redux/slices/auctionAttendanceSlice';

import ButtonLoadmore from 'components/CustomUI/ButtonLoadmore';
import { RootState } from 'redux/store';
import { toast } from 'react-toastify';
import { TabAuctionEnum } from 'enum';
import { FilterNft } from 'models';
import InfiniteAuctionListItem from 'components/CustomUI/InfiniteList/InfiniteAuctionListItem';
import { fetchAllItemAuctionAttendance } from 'redux/actions/auctionAttendanceAction';
import { selectUser } from 'redux/slices/userSlice';
import { selectAddress } from 'redux/slices/web3InfoSlice';
import { useIsFirstRender } from 'hooks';

export interface AttendanceTabProps {
	query: string;
}

export default function AttendanceTab({ query }: AttendanceTabProps) {
	const dispatch = useDispatch();
	const isFirstRender = useIsFirstRender();

	//useState
	const [allowLoadMore, setAllowLoadMore] = useState<boolean>(false);
	const [fetchNextPage, setFetchNextPage] = useState<boolean>(false);

	//useSelector
	const initialState = selectInitialState;
	const listItemAttendance = useSelector(selectListItemAuction);
	const isLoading = useSelector(selectLoading);
	const pagination = useSelector(selectPagination);
	const filter = useSelector(selectFilter);
	const hasNextPage = useSelector(selectHasNextPage);
	const userAddress = useSelector(selectAddress);

	//useEffect
	// Check opened Tabs
	useEffect(() => {
		if (!userAddress) {
			return;
		}

		if (query) {
			const filter: FilterNft = { ...initialState.filter, text: query };

			dispatch(
				fetchAllItemAuctionAttendance(
					initialState.pagination,
					userAddress,
					filter,
					true,
					executeAfterFetchAllNft
				)
			);
		} else {
			dispatch(
				fetchAllItemAuctionAttendance(
					initialState.pagination,
					userAddress,
					initialState.filter,
					true,
					executeAfterFetchAllNft
				)
			);
		}

		// return () => {
		// 	dispatch(resetAll());
		// 	setAllowLoadMore(false);
		// };
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [query]);

	useEffect(() => {
		if (isFirstRender) {
			// useful when first render this tab + the pagination.page > 1 (this tab have opened before): not run api
			return;
		}

		if (pagination.page === 1 && !filter.isFiltering) {
			return;
		}
		if (!userAddress) {
			return;
		}

		dispatch(
			fetchAllItemAuctionAttendance(
				pagination,
				userAddress,
				filter,
				false,
				executeAfterFetchAllNft
			)
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pagination, filter]);

	//Handle next page

	const handleFetchNextPage = () => {
		setFetchNextPage(true);
	};

	const executeAfterFetchAllNft = (globalStateNewest: RootState) => {
		setFetchNextPage(false);

		const { auctionAttendance } = globalStateNewest;

		if (!auctionAttendance.isSuccess) {
			// console.log(globalStateNewest);
			toast.error(
				'Some error occur when getting all NFTs from Upcoming! ' +
					auctionAttendance.errorMessage
			);
		}
	};

	return (
		<Box>
			<Box sx={{ mt: 3 }}>
				<InfiniteAuctionListItem
					listAuctionId={listItemAttendance}
					isLoading={isLoading}
					hasNextPage={hasNextPage}
					fetchNextPage={handleFetchNextPage}
					allowLoadMore={allowLoadMore}
				/>
			</Box>

			{!allowLoadMore && hasNextPage && !isLoading && (
				<Stack sx={{ marginTop: '50px' }} alignItems="center">
					<ButtonLoadmore onClick={() => setAllowLoadMore(true)} />
				</Stack>
			)}
		</Box>
	);
}
