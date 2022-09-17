/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
// redux
import { RootState } from 'redux/store';
import { useDispatch, useSelector } from 'react-redux';
import {
	resetAll,
	selectBoxCollections,
	selectFilter,
	selectHasNextPage,
	selectInitialState,
	selectLoading,
	selectPagination,
	setPagination,
} from 'redux/slices/boxCollectionsSlice';
// actions
import { fetchAllBoxCollections } from 'redux/actions/boxCollectionsAction';
// mui
import { Box, Stack } from '@mui/material';
// components
import ButtonLoadmore from 'components/CustomUI/ButtonLoadmore';
import InfiniteListCollection from 'components/CustomUI/InfiniteList/InfiniteListCollection';
// enum
import { TabMysteryBoxEnum } from 'enum';
import { useIsFirstRender } from 'hooks';

export interface IBoxCollectionsTabProps {}

export default function BoxCollectionsTab(props: IBoxCollectionsTabProps) {
	const dispatch = useDispatch();
	const isFirstRender = useIsFirstRender();

	// useState
	const [allowLoadMore, setAllowLoadMore] = useState<boolean>(false);
	const [fetchNextPage, setFetchNextPage] = useState<boolean>(false);

	// useSelector
	const pagination = useSelector(selectPagination);
	const filter = useSelector(selectFilter);
	const hasNextPage = useSelector(selectHasNextPage);
	const listTokenId = useSelector(selectBoxCollections);
	const isLoading = useSelector(selectLoading);

	const initialState = selectInitialState;

	// useEffect
	// fetchAllBoxCollections isFirstLoad === true
	useEffect(() => {
		dispatch(
			fetchAllBoxCollections(
				initialState.pagination,
				initialState.filter,
				true,
				executeAfterFetchAllBoxCollections
			)
		);

		return () => {
			dispatch(resetAll());
			setAllowLoadMore(false);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// fetchAllBoxes isFirstLoad === false
	useEffect(() => {
		if (isFirstRender) {
			// useful when first render this tab + the pagination.page > 1 (this tab have opened before): not run api
			return;
		}

		if (pagination.page === 1 && !filter.isFiltering) {
			return;
		}

		dispatch(
			fetchAllBoxCollections(pagination, filter, false, executeAfterFetchAllBoxCollections)
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pagination, filter]);

	useEffect(() => {
		if (fetchNextPage) {
			dispatch(setPagination({ ...pagination, page: pagination.page + 1 }));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fetchNextPage]);

	// functions
	const handleFetchNextPage = () => {
		setFetchNextPage(true);
	};

	const executeAfterFetchAllBoxCollections = (globalStateNewest: RootState) => {
		setFetchNextPage(false);

		const { boxCollections } = globalStateNewest;

		if (!boxCollections.isSuccess) {
			toast.error(
				'Some error occur when getting all box collections! ' + boxCollections.errorMessage
			);
		}
	};

	return (
		<Box>
			<Box sx={{ mt: 3 }}>
				<InfiniteListCollection
					listTokenId={listTokenId}
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
