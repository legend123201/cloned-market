/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
// mui
import { Avatar, Box, Stack, Typography } from '@mui/material';
import LaunchIcon from '@mui/icons-material/Launch';
// styled
import { HistoryRow, StyledSpan } from './styled';
// api
import historyApi from 'apis/historyApi';
// redux
import { useSelector } from 'react-redux';
import { selectAddress } from 'redux/slices/web3InfoSlice';
import { useIsMounted } from 'hooks';
// models
import { HistoryActivity, HistoryIdsByTxHash, Response } from 'models';
// utils
import { checkTypeEvent } from '../ActivityCard';
// components
import SkeletonNftActivityCard from 'components/CustomUI/Skeleton/Item/SkeletonNftActivityCard';
// constants
import { ETHERSCAN } from 'constants/etherscan.constant';
import { formatTimeHistory } from 'utils';

export interface INftActivityCardProps {
	historyIdsByTxHash: HistoryIdsByTxHash;
}

export default function NftActivityCard({ historyIdsByTxHash }: INftActivityCardProps) {
	// useState
	const [listHistory, setListHistory] = useState<HistoryActivity[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	// useSelector
	const userAddress = useSelector(selectAddress);

	// hooks
	const isMounted = useIsMounted();

	// useEffect
	useEffect((): any => {
		if (!historyIdsByTxHash) return;

		(async () => {
			setIsLoading(true);

			try {
				const list = await Promise.all(
					historyIdsByTxHash.histories.map(async (item: any, idx: number) => {
						const res: Response<HistoryActivity> =
							await historyApi.getDetailActivityById(item._id ?? item);
						return res.data;
					})
				);

				if (isMounted()) {
					setListHistory(list);
				}
			} catch (error) {
				console.log(error);
			} finally {
				if (isMounted()) {
					setIsLoading(false);
				}
			}
		})();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [historyIdsByTxHash, userAddress]);

	// functions
	const getEtherscanInfoByChainId = (id: number) => {
		return ETHERSCAN[id];
	};

	const renderUserHistoryImage = (history: HistoryActivity): string => {
		if (history.fromUserInfo?.avatar) {
			return history.fromUserInfo.avatar;
		} else if (history.toUserInfo?.avatar) {
			return history.toUserInfo.avatar;
		} else {
			return history.itemInfo.itemMedia;
		}
	};

	return !isLoading ? (
		listHistory?.length > 0 ? (
			<HistoryRow>
				<Stack direction="row" alignItems="center" justifyContent="space-between">
					<Stack direction="row" alignItems="center">
						<Avatar
							src={renderUserHistoryImage(listHistory[0])}
							variant="rounded"
							sx={{ width: '40px', height: '40px' }}
						/>

						<Box sx={{ ml: 2 }}>
							{listHistory.map((item: HistoryActivity, index: number) => (
								<Box key={index}>
									{checkTypeEvent(item.type, item, userAddress)}
								</Box>
							))}

							<Typography variant="body2">
								<StyledSpan>
									{formatTimeHistory(listHistory[0].createdAt)}
								</StyledSpan>
							</Typography>
						</Box>
					</Stack>

					{historyIdsByTxHash.txHash.length > 10 && (
						<Box
							onClick={() => {
								if (historyIdsByTxHash.txHash.length > 10) {
									window.open(
										`${
											getEtherscanInfoByChainId(listHistory[0].chainId).url
										}tx/${historyIdsByTxHash.txHash}`,
										'_blank'
									);
								}
							}}
						>
							<LaunchIcon sx={{ width: '20px', cursor: 'pointer' }} />
						</Box>
					)}
				</Stack>
			</HistoryRow>
		) : (
			<></>
		)
	) : (
		<SkeletonNftActivityCard />
	);
}
