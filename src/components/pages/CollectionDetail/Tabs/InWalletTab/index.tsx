/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
//components
import InfiniteListItem from 'components/CustomUI/InfiniteList/InfiniteListItem';
import FilterItemGroup from 'components/CustomUI/FilterItemGroup';
import FieldInput from 'components/CustomField/FieldInput';
import ButtonLoadmore from 'components/CustomUI/ButtonLoadmore';
import ButtonAddItem from '../../ButtonAddItem';
// redux
import { RootState } from 'redux/store';
import { useDispatch, useSelector } from 'react-redux';
import {
	selectListNft,
	selectHasNextPage,
	selectLoading,
	selectFilter,
	setFilter,
	selectInitialState,
	resetAll,
	selectPagination,
	setPagination,
} from 'redux/slices/collectionItemSlice';
import { selectCollectionItem } from 'redux/slices/collectionSlice';
// actions
import { fetchNFTsByCollectionId } from 'redux/actions/collectionItemAction';
// mui
import { Box, Stack } from '@mui/material';
// hooks
import { useDebounce, useIsFirstRender } from 'hooks';

export interface IInWalletTabProps {
	refetchApi: Function;
}

function InWalletTab({ refetchApi }: IInWalletTabProps) {
	const dispatch = useDispatch();

	// hook
	const isFirstRender = useIsFirstRender();

	// useState
	const [fieldNameValue, setFieldNameValue] = useState<string>('');
	const [allowLoadMore, setAllowLoadMore] = useState<boolean>(false);
	const [fetchNextPage, setFetchNextPage] = useState<boolean>(false);

	// useSelector
	const collection = useSelector(selectCollectionItem);
	const listNFTs = useSelector(selectListNft);
	const isLoading = useSelector(selectLoading);
	const hasNextPage = useSelector(selectHasNextPage);
	const filter = useSelector(selectFilter);
	const pagination = useSelector(selectPagination);

	const initialState = selectInitialState;

	// hooks
	const debouncedInputValue = useDebounce<string>(fieldNameValue, 500);

	// useEffect
	// fetch all nfts of collection
	// isFirstLoad === true
	useEffect(() => {
		if (collection) {
			dispatch(
				fetchNFTsByCollectionId(
					collection._id,
					collection.chainId,
					initialState.pagination,
					initialState.filter,
					true,
					executeAfterFetchNFTsByCollectionId
				)
			);
		}

		return () => {
			dispatch(resetAll());
			setAllowLoadMore(false);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [collection]);

	// fetch all nfts of collection
	// isFirstLoad === false
	useEffect(() => {
		if (pagination.page === 1 && !filter.isFiltering) {
			return;
		}

		if (collection) {
			dispatch(
				fetchNFTsByCollectionId(
					collection._id,
					collection.chainId,
					pagination,
					filter,
					false,
					executeAfterFetchNFTsByCollectionId
				)
			);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pagination, filter]);

	useEffect(() => {
		if (fetchNextPage) {
			dispatch(setPagination({ ...pagination, page: pagination.page + 1 }));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fetchNextPage]);

	// handle change field name value
	useEffect(() => {
		if (isFirstRender) return;
		dispatch(setFilter({ ...filter, itemName: debouncedInputValue }));

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedInputValue]);

	// functions
	const handleFetchNextPage = () => {
		setFetchNextPage(true);
	};

	const executeAfterFetchNFTsByCollectionId = (globalStateNewest: RootState) => {
		setFetchNextPage(false);
		const { collectionItem } = globalStateNewest;
		if (!collectionItem.isSuccess) {
			toast.error(collectionItem.errorMessage);
		}
	};

	const handleFilterByName = (e: any) => {
		const value = e.target.value;
		setFieldNameValue(value);
	};

	return (
		<Box sx={{ mt: 5 }}>
			<Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
				<FilterItemGroup
					filterStatus
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
							value={fieldNameValue}
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

					<ButtonAddItem refetchApi={refetchApi} />
				</Stack>
			</Stack>

			<Box sx={{ mt: 5 }}>
				<InfiniteListItem
					listTokenId={listNFTs}
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

export default React.memo(InWalletTab);
