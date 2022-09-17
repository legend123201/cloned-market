/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
// redux
import { RootState } from 'redux/store';
import { useDispatch, useSelector } from 'react-redux';
import {
	resetAll,
	selectListCollection,
	selectFilter,
	selectHasNextPage,
	selectInitialState,
	selectLoading,
	selectPagination,
	setPagination,
	setFilter,
} from 'redux/slices/collectionSlice';
// actions
import { fetchAllCollection, fetchAllCollectionSearchParams } from 'redux/actions/collectionAction';
// mui
import { Box, Stack } from '@mui/material';
// components
import ButtonLoadmore from 'components/CustomUI/ButtonLoadmore';
import InfiniteListCollection from 'components/CustomUI/InfiniteList/InfiniteListCollection';
import FilterCollectionComponent from '../../FilterCollection';
// enum
import { TabViewAllEnum } from 'enum';
// models
import { FilterCollection } from 'models';
// hooks
import { useIsFirstRender } from 'hooks';
import FilterItemGroup from 'components/CustomUI/FilterItemGroup';
import { useLocation, useSearchParams } from 'react-router-dom';
import { PATH_CATEGORY, PATH_VIEWALL } from 'routes/path';
import { FilterStack } from '../ItemsTab/styled';

export interface ICollectionsTabProps {
	query: string;
}

export default function CollectionsTab({ query }: ICollectionsTabProps) {
	const dispatch = useDispatch();
	const isFirstRender = useIsFirstRender();
	const { pathname } = useLocation();
	const [typeRoute, setTypeRoute] = useState<undefined | number>();
	const [isDefault, setIsDefault] = useState<boolean>(true);
	const [searchParams, setSearchParams] = useSearchParams();
	const categoryParam: string | null = searchParams.get('category');

	// useState
	const [allowLoadMore, setAllowLoadMore] = useState<boolean>(false);
	const [fetchNextPage, setFetchNextPage] = useState<boolean>(false);

	// useSelector
	const listTokenId = useSelector(selectListCollection);
	const pagination = useSelector(selectPagination);
	const filter = useSelector(selectFilter);
	const hasNextPage = useSelector(selectHasNextPage);
	const isLoading = useSelector(selectLoading);

	const initialState = selectInitialState;

	// useEffect
	useEffect(() => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [categoryParam]);

	// useEffect
	// fetchAllCollections isFirstLoad === true

	useEffect(() => {
		if (isDefault || categoryParam) return;
		if (query) {
			const filter: FilterCollection = { ...initialState.filter, text: query };

			dispatch(
				fetchAllCollectionSearchParams(
					initialState.pagination,
					filter,
					true,
					executeAfterFetchAllCollections
				)
			);
		} else {
			dispatch(
				fetchAllCollection(
					initialState.pagination,
					initialState.filter,
					true,
					executeAfterFetchAllCollections
				)
			);
		}

		// return () => {
		// 	dispatch(resetAll());
		// 	setAllowLoadMore(false);
		// };
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [query, isDefault]);

	// fetchAllBoxes isFirstLoad === false
	useEffect(() => {
		if (isFirstRender) {
			// useful when first render this tab + the pagination.page > 1 (this tab have opened before): not run api
			return;
		}

		if (pagination.page === 1 && !filter.isFiltering) {
			return;
		}

		dispatch(fetchAllCollection(pagination, filter, false, executeAfterFetchAllCollections));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pagination, filter]);

	// console.log('typeRoute', typeRoute);

	useEffect(() => {
		if (typeRoute === undefined) return;
		const pathFilter = { ...initialState.filter, category: [typeRoute] };
		// console.log('pathFilter', pathFilter);
		dispatch(setFilter(pathFilter));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [typeRoute]);

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

	const executeAfterFetchAllCollections = (globalStateNewest: RootState) => {
		setFetchNextPage(false);

		const { collection } = globalStateNewest;

		if (!collection.isSuccess) {
			toast.error(
				'Some error occur when getting all collections! ' + collection.errorMessage
			);
		}
	};

	return (
		<Box>
			{/* <FilterStack sx={{ mt: 2 }}>
				<FilterItemGroup
					filterBlockChain
					filterCategory
					initialStateFilter={initialState.filter}
					filter={filter}
					setFilter={setFilter}
				/>
			</FilterStack> */}

			<FilterCollectionComponent />

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
