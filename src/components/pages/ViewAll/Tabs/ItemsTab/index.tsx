/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
// redux
import { RootState } from 'redux/store';
import { useSelector, useDispatch } from 'react-redux';
import {
	resetAll,
	selectAllNfts,
	selectFilter,
	selectHasNextPage,
	selectInitialState,
	selectLoading,
	selectPagination,
	setFilter,
	setPagination,
} from 'redux/slices/allNftsSlice';
import { selectChainId } from 'redux/slices/web3InfoSlice';
// actions
import { fetchAllNFTs, fetchAllNFTsSearchQuery } from 'redux/actions/allNftsAction';
import { fetchListPaymentTokenByChainId } from 'redux/actions/tokenPaymentAction';
// components
import FilterItemGroup from 'components/CustomUI/FilterItemGroup';
import FieldInput from 'components/CustomField/FieldInput';
import InfiniteListItem from 'components/CustomUI/InfiniteList/InfiniteListItem';
import ButtonLoadmore from 'components/CustomUI/ButtonLoadmore';
// mui
import { Box, Stack } from '@mui/material';
// styled
import { FilterStack } from './styled';
// enum
import { TabViewAllEnum } from 'enum';
// models
import { FilterNft } from 'models';
// hooks
import { useIsFirstRender, useDebounce } from 'hooks';

export interface IItemsTabProps {
	query: string;
}

export default function ItemsTab({ query }: IItemsTabProps) {
	const dispatch = useDispatch();
	const isFirstRender = useIsFirstRender();

	// useState
	const [fieldNameValue, setFieldNameValue] = useState<string>('');
	const debouncedNameValue = useDebounce<string>(fieldNameValue, 500);

	const [allowLoadMore, setAllowLoadMore] = useState<boolean>(false);
	const [fetchNextPage, setFetchNextPage] = useState<boolean>(false);

	// useSelector
	const chainId = useSelector(selectChainId);
	const pagination = useSelector(selectPagination);
	const filter = useSelector(selectFilter);
	const hasNextPage = useSelector(selectHasNextPage);
	const listTokenId = useSelector(selectAllNfts);
	const isLoading = useSelector(selectLoading);

	const initialState = selectInitialState;

	// useEffect
	useEffect(() => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// fetch list payment token
	useEffect(() => {
		if (chainId) {
			dispatch(fetchListPaymentTokenByChainId(chainId, executeAfterFetchListTokenPayment));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [chainId]);

	// fetchAllNFTs isFirstLoad === true
	useEffect(() => {
		if (query) {
			const filter: FilterNft = { ...initialState.filter, text: query };

			dispatch(
				fetchAllNFTsSearchQuery(
					initialState.pagination,
					filter,
					true,
					executeAfterFetchAllNfts
				)
			);
		} else {
			dispatch(
				fetchAllNFTs(
					initialState.pagination,
					initialState.filter,
					true,
					executeAfterFetchAllNfts
				)
			);
		}

		return () => {
			// need reset redux because UI for sorting is rerendered to the begining
			dispatch(resetAll());
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [query]);

	// fetchAllNFTs isFirstLoad === false
	useEffect(() => {
		if (isFirstRender) {
			// useful when first render this tab + the pagination.page > 1 (this tab have opened before): not run api
			return;
		}

		if (pagination.page === 1 && !filter.isFiltering) {
			return;
		}

		dispatch(fetchAllNFTs(pagination, filter, false, executeAfterFetchAllNfts));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pagination, filter]);

	// handle change of field name value
	useEffect(() => {
		if (isFirstRender) {
			return;
		}

		dispatch(setFilter({ ...filter, itemName: debouncedNameValue }));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch, debouncedNameValue]);

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

	const executeAfterFetchAllNfts = (globalStateNewest: RootState) => {
		setFetchNextPage(false);

		const { allNfts } = globalStateNewest;

		if (!allNfts.isSuccess) {
			toast.error('Some error occur when getting all NFTs! ' + allNfts.errorMessage);
		}
	};

	const executeAfterFetchListTokenPayment = (globalStateNewest: RootState) => {
		const { tokenPayment } = globalStateNewest;
		if (!tokenPayment.isSuccess) {
			toast.error('Can not fetch list token payment!');
		}
	};

	const handleFilterByName = (e: any) => {
		const value = e.target.value;
		setFieldNameValue(value);
	};

	return (
		<Box>
			<FilterStack sx={{ mt: 2 }}>
				<FilterItemGroup
					filterBlockChain
					filterStatus
					filterCollection
					filterPrice
					initialStateFilter={initialState.filter}
					filter={filter}
					setFilter={setFilter}
				/>

				<Stack
					direction="row"
					alignItems="center"
					justifyContent="end"
					spacing={2}
					sx={{ flexGrow: 1 }}
				>
					<Box sx={{ flexGrow: 1 }}>
						<FieldInput
							type="text"
							onChange={handleFilterByName}
							placeholder="Search name ..."
							sx={{
								padding: '12px 15px',
								width: '80%',
								marginLeft: 'auto',
								minWidth: '130px',
								maxWidth: '500px',
							}}
						/>
					</Box>
				</Stack>
			</FilterStack>

			<Box sx={{ mt: 3 }}>
				<InfiniteListItem
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
