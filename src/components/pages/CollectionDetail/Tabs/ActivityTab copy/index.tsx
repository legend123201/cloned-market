/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { Fragment } from 'react';
//component
import CustomTable from 'components/CustomUI/CustomTable';
//redux
import { useSelector } from 'react-redux';
import { selectAddress, selectChainId } from 'redux/slices/web3InfoSlice';
import { selectListActivity } from 'redux/slices/tradingSlice';
//models
import { HistoryActivity } from 'models';
//constant
import { TYPE_TRANSACTION } from '../../../../../constants';
import { ETHERSCAN } from 'constants/etherscan.constant';
//mui
import { Link, useTheme } from '@mui/material';
// utils
import {
	formatAddressHistory,
	formatSymbolHistory,
	formatQuantityHistory,
	formatTimeHistory,
	formatTxHashHistory,
} from 'utils';

function ActivityTab() {
	const theme = useTheme();

	// useSelector
	const listCollectionActivity: HistoryActivity[] = useSelector(selectListActivity);
	const userAddress = useSelector(selectAddress);
	const chainId = useSelector(selectChainId);

	const getTransactionType = (type: number) => {
		return TYPE_TRANSACTION[type];
	};

	const renderHeader = () => {
		let listTitle = ['Event', 'Symbol', 'Quantity', 'From', 'To', 'Transaction hash', 'Time'];
		return Object.values(listTitle);
	};

	const getEtherscanInfoByChainId = (id: number) => {
		return ETHERSCAN[id];
	};

	const renderListData = (list: HistoryActivity[]) => {
		if (list && list.length > 0) {
			return list.map((item: HistoryActivity) => {
				return {
					Event: <Fragment>{getTransactionType(item.type)}</Fragment>,
					Symbol: (
						<Fragment>
							{formatSymbolHistory(item.priceType, item.itemTokenId, item.quantity)}
						</Fragment>
					),
					Quantity: (
						<Fragment>{formatQuantityHistory(item.tokenPrice, item.quantity)}</Fragment>
					),
					From: <Fragment>{formatAddressHistory(item.from, userAddress)}</Fragment>,
					To: <Fragment>{formatAddressHistory(item.to, userAddress)}</Fragment>,
					TransactionHash: item.txHash ? (
						<Link
							href={`${getEtherscanInfoByChainId(chainId).url}tx/${item.txHash}`}
							sx={{
								color: theme.palette.text.primary,
								'&:hover': {
									color: '#3366FF',
									transition: 'all 0.2s',
								},
							}}
							target="_blank"
						>
							{formatTxHashHistory(item.txHash)}
						</Link>
					) : (
						<Fragment>-----</Fragment>
					),
					Time: <Fragment>{formatTimeHistory(item.createdAt)}</Fragment>,
				};
			});
		}
	};

	return <CustomTable thData={renderHeader()} tdData={renderListData(listCollectionActivity)} />;
}

export default React.memo(ActivityTab);
