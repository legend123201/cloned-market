/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, CircularProgress, Grid, Stack, Typography, useTheme } from '@mui/material';
import nftsApi from 'apis/nftsApi';
import ButtonGradient from 'components/CustomUI/ButtonGradient';
import LazyImageCustom from 'components/CustomUI/LazyImages/LazyImageCustom';
import { chain } from 'lodash';
import { NFT, Response, StakeSlot } from 'models';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { selectAddress, selectChainId } from 'redux/slices/web3InfoSlice';
import { formatTimestamp, stakeContractFunction } from 'utils';
import ButtonCancelStaking from '../ButtonCancelStaking';
import ButtonHarvest from '../ButtonHarvest';
import { InfoRow, MainImage } from './styled';
const { checkCanHarvest } = stakeContractFunction();

const optionStakingInfo: { [key: string]: { name: string; duration: string; value: number } } = {
	'0': { name: 'Basic staking', duration: '5 minutes', value: 30 * 10 },
	'1': { name: 'Premium staking', duration: '10 minutes', value: 60 * 10 },
	'2': { name: 'Pro staking', duration: '15 minutes', value: 90 * 10 },
};
export interface IStakeInfoProps {
	currentSelectedSlot: StakeSlot | null;
	refetchApi: Function;
}

export default function StakeInfo({ currentSelectedSlot, refetchApi }: IStakeInfoProps) {
	const theme = useTheme();

	// useState
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [canHarvest, setCanHarvest] = useState<boolean>(false);

	// useSelector
	const userAddress = useSelector(selectAddress);
	const chainId = useSelector(selectChainId);

	useEffect(() => {
		(async () => {
			try {
				if (userAddress && chainId && currentSelectedSlot) {
					const result: boolean = await checkCanHarvest(
						userAddress,
						chainId,
						currentSelectedSlot.slotIndex
					);

					setCanHarvest(result);
				}
			} catch (error) {
				console.log(error);
				toast.error('Some error occured when checking slot can harvest or not!');
			}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userAddress, chainId, currentSelectedSlot]);

	// functions
	const isQualifiedToHarvest = (): boolean => {
		if (currentSelectedSlot && canHarvest) return true;
		return false;
	};

	const isQualifiedToCancelStaking = (): boolean => {
		if (
			!canHarvest &&
			currentSelectedSlot &&
			!currentSelectedSlot.isHarvest &&
			currentSelectedSlot.reward !== 0
		)
			return true;
		return false;
	};

	const isHarvested = (): boolean => {
		if (
			!canHarvest &&
			currentSelectedSlot &&
			currentSelectedSlot.isHarvest &&
			currentSelectedSlot.reward !== 0
		)
			return true;
		return false;
	};

	const isCanceled = (): boolean => {
		if (
			!canHarvest &&
			currentSelectedSlot &&
			currentSelectedSlot.isHarvest &&
			currentSelectedSlot.reward === 0
		)
			return true;
		return false;
	};

	return !isLoading && currentSelectedSlot ? (
		<Grid container spacing={3} columns={{ xs: 1, sm: 2 }} sx={{ mt: 3 }}>
			<Grid
				item
				xs={1}
				sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
			>
				<MainImage>
					<LazyImageCustom
						src={
							// 'https://res.cloudinary.com/dkgnummck/image/upload/w_480/q_auto:best,f_auto/v1655691489/Asset1155Picture/legend.webp'
							currentSelectedSlot.itemInfo.itemMedia
						}
						alt="item"
						wrapperPosition="absolute"
						imgStyle={{ borderRadius: '10px' }}
						type="progress"
						errorComponent={<>Some error occurred when downloading iamge.</>}
					/>
				</MainImage>
			</Grid>
			<Grid item xs={1} sx={{ display: 'flex', alignItems: 'center' }}>
				<Box sx={{ width: '100%' }}>
					<Typography variant="h6" sx={{ color: theme.palette.text.special }}>
						{currentSelectedSlot.itemInfo.collectionInfo?.collectionName}
					</Typography>

					<Typography variant="h1" sx={{ mt: 2.5, fontStyle: 'italic' }}>
						{currentSelectedSlot.itemInfo.itemName}
					</Typography>
					<Typography variant="body1" sx={{ mt: 1 }}>
						{currentSelectedSlot.itemInfo.description}
					</Typography>

					<Stack spacing={2} sx={{ mt: 2 }}>
						<InfoRow>
							<Typography variant="body1">Slot:</Typography>
							<Typography variant="body1">{currentSelectedSlot.slotIndex}</Typography>
						</InfoRow>
						<InfoRow>
							<Typography variant="body1">Staking amount:</Typography>
							<Typography variant="body1">
								{currentSelectedSlot.itemAmount} items
							</Typography>
						</InfoRow>
						<InfoRow>
							<Typography variant="body1">Staking type:</Typography>
							<Typography variant="body1">
								{optionStakingInfo[String(currentSelectedSlot.option)].name} (
								{optionStakingInfo[String(currentSelectedSlot.option)].duration})
							</Typography>
						</InfoRow>
						<InfoRow>
							<Typography variant="body1">Starting:</Typography>
							<Typography variant="body1">
								{formatTimestamp(currentSelectedSlot.startTime)}
							</Typography>
						</InfoRow>
						<InfoRow>
							<Typography variant="body1">Ending:</Typography>
							<Typography variant="body1">
								{formatTimestamp(
									currentSelectedSlot.startTime +
										optionStakingInfo[String(currentSelectedSlot.option)].value
								)}
							</Typography>
						</InfoRow>

						<InfoRow>
							<Typography variant="body1">Reward MST:</Typography>
							<Typography variant="body1">{currentSelectedSlot.reward}</Typography>
						</InfoRow>

						<InfoRow>
							<Typography variant="body1">Reward TP:</Typography>
							<Typography variant="body1">
								{currentSelectedSlot.ticketCardAmount}
							</Typography>
						</InfoRow>

						{isCanceled() && (
							<InfoRow>
								<Typography variant="body1">Status:</Typography>
								<Typography variant="body1">Canceled</Typography>
							</InfoRow>
						)}

						{isHarvested() && (
							<InfoRow>
								<Typography variant="body1">Status:</Typography>
								<Typography variant="body1">Completed</Typography>
							</InfoRow>
						)}
					</Stack>

					{isQualifiedToHarvest() && (
						<ButtonHarvest
							chainId={currentSelectedSlot.chainId}
							slotIndex={currentSelectedSlot.slotIndex}
							refetchApi={refetchApi}
						/>
					)}

					{isQualifiedToCancelStaking() && (
						<ButtonCancelStaking
							chainId={currentSelectedSlot.chainId}
							slotIndex={currentSelectedSlot.slotIndex}
							refetchApi={refetchApi}
						/>
					)}
				</Box>
			</Grid>
		</Grid>
	) : (
		<Stack alignItems="center" sx={{ mt: 10, width: '100%' }}>
			<CircularProgress />
		</Stack>
	);
}
