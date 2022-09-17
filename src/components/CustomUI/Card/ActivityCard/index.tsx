/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
// mui
import { Box, Stack, Typography, useTheme } from '@mui/material';
import LaunchIcon from '@mui/icons-material/Launch';
// model
import { HistoryActivity, HistoryIdsByTxHash, Response } from 'models';
// styled
import { ItemMedia, StyledSpan } from './styled';
// utils
import {
	compressImage,
	formatAddressHistory,
	formatNumber,
	formatTimeHistory,
	getFileType,
} from 'utils';
// constants
import { ETHERSCAN } from '../../../../constants';
import { TYPE_TRANSACTION } from '../../../../constants';
// redux
import { useSelector } from 'react-redux';
import { selectAddress } from 'redux/slices/web3InfoSlice';
// api
import historyApi from 'apis/historyApi';
// hooks
import { useIsMounted } from 'hooks';
// components
import SkeletonActivityCard from 'components/CustomUI/Skeleton/Item/SkeletonActivityCard';
import LazyImageCustom from 'components/CustomUI/LazyImages/LazyImageCustom';

export const checkTypeEvent = (
	type: number,
	item: HistoryActivity,
	userAddress: string | null | undefined
) => {
	var returnText;

	const getTransactionType = (type: number) => {
		return TYPE_TRANSACTION[type];
	};

	const textOfTransferAndBurnKind = (historyTransfer: HistoryActivity): string => {
		if (historyTransfer.tokenPrice === 0) {
			// transfer / burn NFT
			return `${historyTransfer.quantity} ${historyTransfer.itemInfo.itemName}`;
		} else {
			// transfer / burn token
			return `${formatNumber(
				historyTransfer.tokenPrice,
				0,
				3
			)} ${historyTransfer.priceType.toUpperCase()}`;
		}
	};

	switch (type) {
		case 1: {
			// Mint
			returnText = (
				<Typography variant="body1" sx={{ fontWeight: '600' }}>
					<StyledSpan>{formatAddressHistory(item.to, userAddress)}</StyledSpan>{' '}
					{getTransactionType(type)}{' '}
					<StyledSpan>
						{item.quantity} {item.itemInfo.itemName}
					</StyledSpan>
				</Typography>
			);
			break;
		}
		case 2: {
			// Accept Offer
			returnText = (
				<Typography variant="body1" sx={{ fontWeight: '600' }}>
					<StyledSpan>{formatAddressHistory(item.to, userAddress)}</StyledSpan>{' '}
					{getTransactionType(type)}{' '}
					<StyledSpan>for perchasing {item.itemInfo.itemName}</StyledSpan> of{' '}
					<StyledSpan>
						{formatAddressHistory(item.from, userAddress)} with price {item.tokenPrice}{' '}
						{item.priceType.toUpperCase()}
					</StyledSpan>
				</Typography>
			);
			break;
		}
		case 3: {
			// Sales
			returnText = (
				<Typography variant="body1" sx={{ fontWeight: '600' }}>
					<StyledSpan>{formatAddressHistory(item.to, userAddress)}</StyledSpan>{' '}
					{getTransactionType(type)} <StyledSpan>{item.itemInfo.itemName}</StyledSpan> to{' '}
					<StyledSpan>
						{formatAddressHistory(item.from, userAddress)} with price {item.tokenPrice}{' '}
						{item.priceType.toUpperCase()}
					</StyledSpan>
				</Typography>
			);
			break;
		}
		case 4: {
			// Transfer
			returnText = (
				<Typography variant="body1" sx={{ fontWeight: '600' }}>
					<StyledSpan>{formatAddressHistory(item.from, userAddress)}</StyledSpan>{' '}
					{getTransactionType(type)}{' '}
					<StyledSpan>{textOfTransferAndBurnKind(item)}</StyledSpan> to
					<StyledSpan> {formatAddressHistory(item.to, userAddress)}</StyledSpan>
				</Typography>
			);
			break;
		}
		case 5: {
			// Cancel
			returnText = (
				<Typography variant="body1" sx={{ fontWeight: '600' }}>
					<StyledSpan>{formatAddressHistory(item.from, userAddress)}</StyledSpan>{' '}
					{getTransactionType(type)}{' '}
					<StyledSpan>
						listing {item.quantity} {item.itemInfo.itemName}
					</StyledSpan>
				</Typography>
			);
			break;
		}
		case 6: {
			// List
			returnText = (
				<Typography variant="body1" sx={{ fontWeight: '600' }}>
					<StyledSpan>{formatAddressHistory(item.from, userAddress)}</StyledSpan>{' '}
					{getTransactionType(type)}{' '}
					<StyledSpan>
						{item.quantity} {item.itemInfo.itemName} for {item.tokenPrice}{' '}
						{item.priceType.toUpperCase()}
					</StyledSpan>
				</Typography>
			);
			break;
		}
		case 7: {
			// Offer
			returnText = (
				<Typography variant="body1" sx={{ fontWeight: '600' }}>
					<StyledSpan>{formatAddressHistory(item.from, userAddress)}</StyledSpan>{' '}
					{getTransactionType(type)}{' '}
					<StyledSpan>
						{item.quantity} {item.itemInfo.itemName} to{' '}
						{formatAddressHistory(item.to, userAddress)}
					</StyledSpan>
				</Typography>
			);
			break;
		}
		case 8: {
			// Auction Created
			returnText = (
				<Typography variant="body1" sx={{ fontWeight: '600' }}>
					<StyledSpan>{formatAddressHistory(item.from, userAddress)}</StyledSpan> Create
					Auction{' '}
					<StyledSpan>
						of {item.quantity} {item.itemInfo.itemName}
					</StyledSpan>
				</Typography>
			);
			break;
		}
		case 9: {
			// Auction Settle
			returnText = (
				<Typography variant="body1" sx={{ fontWeight: '600' }}>
					<StyledSpan>{formatAddressHistory(item.from, userAddress)}</StyledSpan> Settle
					Auction{' '}
					<StyledSpan>
						of {item.quantity} {item.itemInfo.itemName}
					</StyledSpan>
				</Typography>
			);
			break;
		}
		case 10: {
			// Expired
			returnText = (
				<Typography variant="body1" sx={{ fontWeight: '600' }}>
					{getTransactionType(type)}{' '}
					<StyledSpan>
						{item.quantity} {item.itemInfo.itemName} ({item.itemInfo.itemName} ) from{' '}
						{formatAddressHistory(item.from, userAddress)} to{' '}
						{formatAddressHistory(item.from, userAddress)}
					</StyledSpan>
				</Typography>
			);
			break;
		}
		case 11: {
			// Unbox
			returnText = (
				<Typography variant="body1" sx={{ fontWeight: '600' }}>
					<StyledSpan>{formatAddressHistory(item.from, userAddress)}</StyledSpan>{' '}
					{getTransactionType(type)}{' '}
					<StyledSpan>
						{item.quantity} {item.itemInfo.itemName}
					</StyledSpan>
				</Typography>
			);
			break;
		}
		case 12: {
			// Buy Box
			returnText = (
				<Typography variant="body1" sx={{ fontWeight: '600' }}>
					<StyledSpan>{formatAddressHistory(item.to, userAddress)}</StyledSpan>{' '}
					{getTransactionType(type)}{' '}
					<StyledSpan>
						{item.quantity} {item.itemInfo.itemName}
					</StyledSpan>
				</Typography>
			);
			break;
		}

		case 13: {
			// Create Staking
			returnText = (
				<Typography variant="body1" sx={{ fontWeight: '600' }}>
					<StyledSpan>{formatAddressHistory(item.from, userAddress)}</StyledSpan> Stake{' '}
					<StyledSpan>
						{item.quantity} {item.itemInfo.itemName}
					</StyledSpan>
				</Typography>
			);
			break;
		}
		case 14: {
			// Harvest NCA
			returnText = (
				<Typography variant="body1" sx={{ fontWeight: '600' }}>
					<StyledSpan>{formatAddressHistory(item.to, userAddress)}</StyledSpan> Harvest{' '}
					<StyledSpan>
						reward for staking {item.quantity} {item.itemInfo.itemName}
					</StyledSpan>
				</Typography>
			);
			break;
		}
		case 15: {
			// Cancel Staking
			returnText = (
				<Typography variant="body1" sx={{ fontWeight: '600' }}>
					<StyledSpan>{formatAddressHistory(item.from, userAddress)}</StyledSpan> Cancel{' '}
					Staking{' '}
					<StyledSpan>
						{item.quantity} {item.itemInfo.itemName}
					</StyledSpan>
				</Typography>
			);
			break;
		}
		case 16: {
			// Buy Ticket Card
			returnText = (
				<Typography variant="body1" sx={{ fontWeight: '600' }}>
					<StyledSpan>{formatAddressHistory(item.from, userAddress)}</StyledSpan> Buy{' '}
					<StyledSpan>
						{item.quantity} {item.itemInfo.itemName}
					</StyledSpan>
				</Typography>
			);
			break;
		}
		case 17: {
			// Upgrade
			returnText = (
				<Typography variant="body1" sx={{ fontWeight: '600' }}>
					<StyledSpan>{formatAddressHistory(item.to, userAddress)}</StyledSpan>{' '}
					{getTransactionType(type)}{' '}
					<StyledSpan>
						lower level MCAs to {item.quantity} {item.itemInfo.itemName}
					</StyledSpan>{' '}
				</Typography>
			);
			break;
		}
		case 18: {
			// Burn
			returnText = (
				<Typography variant="body1" sx={{ fontWeight: '600' }}>
					<StyledSpan>{formatAddressHistory(item.from, userAddress)}</StyledSpan>{' '}
					{getTransactionType(type)}{' '}
					<StyledSpan>{textOfTransferAndBurnKind(item)}</StyledSpan>
				</Typography>
			);
			break;
		}
	}
	return returnText;
};
export interface IActivityCardProps {
	historyIdsByTxHash: HistoryIdsByTxHash;
}

export default function ActivityCard({ historyIdsByTxHash }: IActivityCardProps) {
	const theme = useTheme();

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

	return !isLoading ? (
		listHistory?.length > 0 ? (
			<Stack
				direction="row"
				sx={{
					justifyContent: 'space-between',
					alignItems: 'center',
					padding: '8px 12px',
					margin: '4px 0',
					borderRadius: '12px',
					gap: '12px',
					...(theme.palette.mode === 'light'
						? { background: theme.palette.primaryLight.main }
						: {
								background: theme.palette.primary.dark,
						  }),
				}}
			>
				<Stack
					direction="row"
					sx={{
						gap: '12px',
						cursor: 'default',
					}}
				>
					<ItemMedia>
						{getFileType(listHistory[0].itemInfo.itemMedia) === 'mp4' ? (
							<ReactPlayer
								url={compressImage(listHistory[0].itemInfo.itemMedia, 240, 'best')}
								className="react-player"
								muted={true}
								playing={true}
								loop={true}
								controls={false}
								volume={0.5}
							/>
						) : getFileType(listHistory[0].itemInfo.itemMedia) === 'mp3' ? (
							<LazyImageCustom
								src={compressImage(
									listHistory[0].itemInfo.itemPreviewMedia,
									480,
									'best'
								)}
								alt="item avatar"
								wrapperPosition="relative"
								imgStyle={{ borderRadius: '10px' }}
								type="progress"
							/>
						) : (
							<LazyImageCustom
								src={compressImage(listHistory[0].itemInfo.itemMedia, 480, 'best')}
								alt="item avatar"
								wrapperPosition="relative"
								imgStyle={{ borderRadius: '10px' }}
								type="progress"
							/>
						)}
					</ItemMedia>
					<Box>
						{listHistory.map((item: HistoryActivity, index: number) => (
							<Box key={index}>{checkTypeEvent(item.type, item, userAddress)}</Box>
						))}

						<Typography variant="body2">
							<StyledSpan>{formatTimeHistory(listHistory[0].createdAt)}</StyledSpan>
						</Typography>
					</Box>
				</Stack>

				{historyIdsByTxHash.txHash.length > 10 && (
					<Box
						onClick={() => {
							if (historyIdsByTxHash.txHash.length > 10) {
								window.open(
									`${getEtherscanInfoByChainId(listHistory[0].chainId).url}tx/${
										historyIdsByTxHash.txHash
									}`,
									'_blank'
								);
							}
						}}
					>
						<LaunchIcon sx={{ width: '20px', cursor: 'pointer' }} />
					</Box>
				)}
			</Stack>
		) : (
			<></>
		)
	) : (
		<SkeletonActivityCard />
	);
}
