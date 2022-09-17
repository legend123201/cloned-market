/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
// redux
import { RootState } from 'redux/store';
import { useDispatch, useSelector } from 'react-redux';
import {
	resetAll,
	selectAllUsers,
	selectFilter,
	selectHasNextPage,
	selectInitialState,
	selectLoading,
	selectPagination,
	setPagination,
} from 'redux/slices/allUsersSlice';
// actions
import { fetchAllUsers } from 'redux/actions/allUsersAction';
// mui
import { Box, Stack } from '@mui/material';
// components
import ButtonLoadmore from 'components/CustomUI/ButtonLoadmore';
import InfiniteListUser from 'components/CustomUI/InfiniteList/InfiniteListUser';
// enum
import { TabViewAllEnum } from 'enum';
// hooks
import { useIsFirstRender } from 'hooks';

export interface IUsersTabProps {
	query: string;
}

export default function UsersTab({ query }: IUsersTabProps) {
	const dispatch = useDispatch();
	const isFirstRender = useIsFirstRender();

	// useState
	const [allowLoadMore, setAllowLoadMore] = useState<boolean>(false);
	const [fetchNextPage, setFetchNextPage] = useState<boolean>(false);

	// useSelector
	const pagination = useSelector(selectPagination);
	const filter = useSelector(selectFilter);
	const hasNextPage = useSelector(selectHasNextPage);
	const listTokenId = useSelector(selectAllUsers);
	const isLoading = useSelector(selectLoading);

	const initialState = selectInitialState;

	// useEffect

	useEffect(() => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	// fetchAllUsers isFirstLoad === true
	useEffect(() => {
		const filter = { ...initialState.filter, text: query };

		dispatch(fetchAllUsers(initialState.pagination, filter, true, executeAfterFetchAllUsers));

		// return () => {
		// 	dispatch(resetAll());
		// 	setAllowLoadMore(false);
		// };
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [query]);

	// fetchAllUsers isFirstLoad === false
	useEffect(() => {
		if (isFirstRender) {
			// useful when first render this tab + the pagination.page > 1 (this tab have opened before): not run api
			return;
		}

		if (pagination.page === 1 && !filter.isFiltering) {
			return;
		}

		dispatch(fetchAllUsers(pagination, filter, false, executeAfterFetchAllUsers));
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

	const executeAfterFetchAllUsers = (globalStateNewest: RootState) => {
		setFetchNextPage(false);

		const { allUsers } = globalStateNewest;

		if (!allUsers.isSuccess) {
			toast.error('Some error occur when getting all users! ' + allUsers.errorMessage);
		}
	};

	return (
		<Box>
			<Box sx={{ mt: 3 }}>
				<InfiniteListUser
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
