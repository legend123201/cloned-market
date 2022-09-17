/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
// components
import TradingHistory from '../../TradingHistory';
// models
import { HistoryActivity } from 'models';
// redux
import { RootState } from 'redux/store';
import { useDispatch, useSelector } from 'react-redux';
import {
	selectListActivity,
	selectInitialState,
	resetAll,
	selectPagination,
	selectFilter,
	setPagination,
	selectLoading,
	selectHasNextPage,
} from 'redux/slices/tradingSlice';
import { selectAddress } from 'redux/slices/web3InfoSlice';
// actions
import { fetchTradingHistoryByNFTsId } from 'redux/actions/tradingAction';
// styled
import { TabWrapperContainer } from './styled';
// utils
import { formatAddressHistory, formatTimeHistory } from 'utils';
// constants
import { TYPE_TRANSACTION } from '../../../../../constants';
import { ETHERSCAN } from 'constants/etherscan.constant';
import InfiniteListNftActivity from 'components/CustomUI/InfiniteList/InfiniteListNftActivity';

export interface IActivityTabProps {}

export default function ActivityTab(props: IActivityTabProps) {
	const dispatch = useDispatch();
	const { itemId } = useParams();

	// useState
	const [fetchNextPage, setFetchNextPage] = useState<boolean>(false);

	// useSelector
	const listItemActivity: HistoryActivity[] = useSelector(selectListActivity);
	const userAddress = useSelector(selectAddress);
	const pagination = useSelector(selectPagination);
	const filter = useSelector(selectFilter);
	const isLoading = useSelector(selectLoading);
	const hasNextPage = useSelector(selectHasNextPage);

	const initialState = selectInitialState;

	// useEffect

	// fetch all history of item
	// isFirstLoad === true
	useEffect(() => {
		if (itemId) {
			dispatch(
				fetchTradingHistoryByNFTsId(
					itemId,
					initialState.pagination,
					initialState.filter,
					true,
					executeAfterFetchHistoryOfItem
				)
			);
		}

		return () => {
			dispatch(resetAll());
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [itemId]);

	// fetch all history of item
	// isFirstLoad === false
	useEffect(() => {
		if (pagination.page === 1 && !filter.isFiltering) {
			return;
		}

		if (itemId) {
			dispatch(
				fetchTradingHistoryByNFTsId(
					itemId,
					pagination,
					filter,
					false,
					executeAfterFetchHistoryOfItem
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

	// functions
	const handleFetchNextPage = () => {
		setFetchNextPage(true);
	};

	const executeAfterFetchHistoryOfItem = (globalStateNewest: RootState) => {
		setFetchNextPage(false);
		const { tradeHistory } = globalStateNewest;
		if (!tradeHistory.isSuccess) {
			toast.error('Can not fetch histories of this item!');
		}
	};

	return (
		<TabWrapperContainer>
			<InfiniteListNftActivity
				listTokenId={listItemActivity}
				isLoading={isLoading}
				hasNextPage={hasNextPage}
				fetchNextPage={handleFetchNextPage}
				allowLoadMore={true}
			/>
		</TabWrapperContainer>
	);
}
