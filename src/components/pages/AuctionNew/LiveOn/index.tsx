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
	resetAll,
} from 'redux/slices/auctionLiveOnSlice';

import { fetchAllItemAuctionLiveOn } from 'redux/actions/auctionLiveOnAction';
import ButtonLoadmore from 'components/CustomUI/ButtonLoadmore';
import { RootState } from 'redux/store';
import { toast } from 'react-toastify';
import { TabAuctionEnum } from 'enum';
import { FilterNft } from 'models';
import InfiniteAuctionListItem from 'components/CustomUI/InfiniteList/InfiniteAuctionListItem';
import { useIsFirstRender } from 'hooks';

export interface LiveOnTabProps {
	query?: string;
}

export default function LiveOnTab({ query }: LiveOnTabProps) {
	const dispatch = useDispatch();
	const isFirstRender = useIsFirstRender();

	//useState
	const [allowLoadMore, setAllowLoadMore] = useState<boolean>(false);
	const [fetchNextPage, setFetchNextPage] = useState<boolean>(false);

	//useSelector
	const initialState = selectInitialState;
	const listAuctionIdLiveOn = useSelector(selectListItemAuction);
	const isLoading = useSelector(selectLoading);
	const pagination = useSelector(selectPagination);
	const filter = useSelector(selectFilter);
	const hasNextPage = useSelector(selectHasNextPage);

	//useEffect
	// Check opened Tabs
	useEffect(() => {
		if (query) {
			const filter: FilterNft = { ...initialState.filter, text: query };

			dispatch(
				fetchAllItemAuctionLiveOn(
					initialState.pagination,
					filter,
					true,
					executeAfterFetchAllNft
				)
			);
		} else {
			dispatch(
				fetchAllItemAuctionLiveOn(
					initialState.pagination,
					initialState.filter,
					true,
					executeAfterFetchAllNft
				)
			);
		}

		// return () => {
		// dispatch(resetAll());
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

		dispatch(fetchAllItemAuctionLiveOn(pagination, filter, false, executeAfterFetchAllNft));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pagination, filter]);

	//Handle next page

	const handleFetchNextPage = () => {
		setFetchNextPage(true);
	};

	const executeAfterFetchAllNft = (globalStateNewest: RootState) => {
		setFetchNextPage(false);

		const { auctionLiveOn } = globalStateNewest;

		if (!auctionLiveOn.isSuccess) {
			toast.error(
				'Some error occur when getting all NFTs from LiveON! ' + auctionLiveOn.errorMessage
			);
		}
	};
	// console.log('listAuctionIdLiveOn', listAuctionIdLiveOn);
	return (
		<>
			{listAuctionIdLiveOn.length > 0 && (
				<Box>
					<Box>
						<Typography variant="h4" fontStyle="italic">
							Live On
						</Typography>
					</Box>
					<Box
						sx={{
							mt: 3,
							padding: '8px',
							// border: '1px solid rgba(255,255,255, 0.1)',
							// borderRadius: '8px',
						}}
					>
						<InfiniteAuctionListItem
							listAuctionId={listAuctionIdLiveOn}
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
			)}
		</>
	);
}
