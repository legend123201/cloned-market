/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { Fragment } from 'react';
//components
import ExpandCard from '../ExpandCard';
import CustomTable from 'components/CustomUI/CustomTable';
//redux
import { useSelector } from 'react-redux';
import { selectChainId, selectAddress } from 'redux/slices/web3InfoSlice';
import { selectListActivity } from 'redux/slices/tradingSlice';
//constant
import { ETHERSCAN } from 'constants/etherscan.constant';
import { TYPE_TRANSACTION } from '../../../../constants';
//modals
import { HistoryActivity } from 'models/histories';
//image
import IconGraphWhite from 'assets/icons/graph-white.webp';
import IconGraphBlack from 'assets/icons/graph-black.webp';
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

export interface TradingHistoryProps {}

const getTransactionType = (type: number) => {
	return TYPE_TRANSACTION[type];
};

function TradingHistory(props: TradingHistoryProps) {
	const theme = useTheme();
	const isLightTheme = theme.palette.mode === 'light';

	//selector
	const chainId = useSelector(selectChainId);
	const userAddress = useSelector(selectAddress);
	const listItemActivity: HistoryActivity[] = useSelector(selectListActivity);

	const renderTitle = () => {
		let listTitle = ['Event', 'Symbol', 'Quantity', 'From', 'To', 'Transaction hash', 'Time'];
		return Object.values(listTitle);
	};

	const getEtherscanInfoByChainId = (id: number) => {
		return ETHERSCAN[id];
	};

	const renderListData = () => {
		if (listItemActivity && listItemActivity.length > 0) {
			return listItemActivity.map((item: HistoryActivity) => {
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

	return <CustomTable thData={renderTitle()} tdData={renderListData()} />;
}

export default TradingHistory;
