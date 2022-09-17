/* eslint-disable @typescript-eslint/no-unused-vars */

import { Box, Typography, Stack } from '@mui/material';
import collectionApi from 'apis/collectionApi';
import InfiniteListCollection from 'components/CustomUI/InfiniteList/InfiniteListCollection';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {
	selectHasNextPage,
	selectLoading,
	selectPagination,
	selectListCollection,
	selectInitialState,
	setPagination,
} from 'redux/slices/categorySlice';
import { PATH_CATEGORY } from 'routes/path';
import ButtonLoadmore from 'components/CustomUI/ButtonLoadmore';
import { fetchAllCollection } from 'redux/actions/categoryAction';
import { RootState } from 'redux/store';
import { toast } from 'react-toastify';
import { useIsFirstRender } from 'hooks';

export interface ICategoryDetailProps {}

export default function CategoryDetail(props: ICategoryDetailProps) {
	const isFirstRender = useIsFirstRender();
	const { pathname } = useLocation();
	const dispatch = useDispatch();
	const [typeRoute, setTypeRoute] = useState<null | number>();
	const [nameHeader, setNameHeader] = useState<null | string>();
	const isLoading = useSelector(selectLoading);
	const hasNextPage = useSelector(selectHasNextPage);
	const pagination = useSelector(selectPagination);
	const initialState = selectInitialState;

	const listTokenId = useSelector(selectListCollection);

	const [fetchNextPage, setFetchNextPage] = useState<boolean>(false);
	const [allowLoadMore, setAllowLoadMore] = useState<boolean>(false);

	useEffect(() => {
		const checkRoute = (pathname: any): void => {
			switch (pathname) {
				case `${PATH_CATEGORY.other}`: {
					setTypeRoute(0);
					setNameHeader('Other');
					break;
				}
				case `${PATH_CATEGORY.artwork}`: {
					setTypeRoute(1);
					setNameHeader('Artwork');

					break;
				}
				case `${PATH_CATEGORY.music}`: {
					setTypeRoute(2);
					setNameHeader('Music');

					break;
				}
				case `${PATH_CATEGORY.photography}`: {
					setTypeRoute(3);
					setNameHeader('Photography');

					break;
				}
				case `${PATH_CATEGORY.games}`: {
					setTypeRoute(4);
					setNameHeader('Games');

					break;
				}
				case `${PATH_CATEGORY.sport}`: {
					setTypeRoute(5);
					setNameHeader('Sport');

					break;
				}
				case `${PATH_CATEGORY.metaverse}`: {
					setTypeRoute(6);
					setNameHeader('Metaverse');

					break;
				}
				case `${PATH_CATEGORY.box}`: {
					setTypeRoute(7);
					setNameHeader('Box');

					break;
				}
				case `${PATH_CATEGORY.card}`: {
					setTypeRoute(8);
					setNameHeader('Card');

					break;
				}
			}
		};
		checkRoute(pathname);
		return;
		// eslint-disable-next-line
	}, [pathname]);
	// Check

	useEffect(() => {
		if (typeRoute === null || typeRoute === undefined) return;
		dispatch(
			fetchAllCollection(
				initialState.pagination,
				typeRoute,
				true,
				executeAfterFetchAllCollections
			)
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [typeRoute]);
	// fetchAllBoxes isFirstLoad === false
	useEffect(() => {
		if (isFirstRender) {
			// useful when first render this tab + the pagination.page > 1 (this tab have opened before): not run api
			return;
		}
		if (typeRoute === null || typeRoute === undefined) return;
		if (pagination.page === 1) {
			return;
		}

		dispatch(fetchAllCollection(pagination, typeRoute, false, executeAfterFetchAllCollections));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pagination, typeRoute]);
	const executeAfterFetchAllCollections = (globalStateNewest: RootState) => {
		setFetchNextPage(false);

		const { category } = globalStateNewest;

		if (!category.isSuccess) {
			toast.error('Some error occur when getting all collections! ' + category.errorMessage);
		}
	};
	//

	useEffect(() => {
		if (fetchNextPage) {
			dispatch(setPagination({ ...pagination, page: pagination.page + 1 }));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fetchNextPage]);

	const handleFetchNextPage = () => {
		setFetchNextPage(true);
	};

	const renderListCollection = () => {
		if (listTokenId) {
			return (
				<InfiniteListCollection
					listTokenId={listTokenId}
					isLoading={isLoading}
					hasNextPage={hasNextPage}
					fetchNextPage={handleFetchNextPage}
					allowLoadMore={allowLoadMore}
				/>
			);
		}
	};
	return (
		<div>
			<Box sx={{ margin: '24px 0' }}>
				<Typography variant="h2">{nameHeader}</Typography>
			</Box>
			{renderListCollection()}
			{!allowLoadMore && hasNextPage && !isLoading && (
				<Stack sx={{ marginTop: '50px' }} alignItems="center">
					<ButtonLoadmore onClick={() => setAllowLoadMore(true)} />
				</Stack>
			)}
		</div>
	);
}
