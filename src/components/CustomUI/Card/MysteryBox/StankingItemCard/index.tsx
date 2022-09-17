/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, IconButton, Stack, Typography } from '@mui/material';
import stakeApi from 'apis/stakeApi';
import { StakeSlot, Response } from 'models';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectAddress } from 'redux/slices/web3InfoSlice';
import {
	ButtonCustom,
	ComponentIndex,
	ErrorContent,
	ItemCardStyle,
	MainImage,
	MediaErrorContent,
} from './styled';
import { useInView } from 'react-cool-inview';
import RefreshIcon from '@mui/icons-material/Refresh';
import LazyImageCustom from 'components/CustomUI/LazyImages/LazyImageCustom';
import { compressImage } from 'utils';
import SkeletonStakingItemCard from 'components/CustomUI/Skeleton/Item/Mysterybox/SkeletonStakingItemCard';
import { selectLoading } from 'redux/slices/listStakingSlotOfUserSlice';

export interface IStakingItemCardProps {
	currentSelectedSlot: StakeSlot | null;
	setCurrentSelectedSlot: Function;
	slot: StakeSlot;
	componentIndex: number;
}

export default function StakingItemCard({
	currentSelectedSlot,
	setCurrentSelectedSlot,
	slot,
	componentIndex,
}: IStakingItemCardProps) {
	// useState
	const [isSuccess, setIsSuccess] = useState<boolean>(false);
	const [refresh, setRefresh] = useState<boolean>(true);
	const [rendered, setRendered] = useState<boolean>(true);

	// useSelector
	const userAddress = useSelector(selectAddress);
	const isLoading = useSelector(selectLoading);

	// vars
	const {
		observe,
		inView,
		scrollDirection: { vertical, horizontal },
	} = useInView({
		threshold: 0.25, // Default is 0
		onEnter: ({ scrollDirection, entry, observe, unobserve }) => {
			// console.log('in view');
			// Triggered when the target enters the viewport
		},
		onLeave: ({ scrollDirection, entry, observe, unobserve }) => {
			// console.log('out view');
			// Triggered when the target leaves the viewport
		},
	});

	const ErrorMediaRender = () => {
		return (
			<MediaErrorContent>
				<Typography variant="h6">Error</Typography>
				<Typography variant="body2">
					Something went wrong when load this media. Please refresh
				</Typography>
				<IconButton
					aria-label="refresh"
					onClick={(e) => {
						e.stopPropagation();
						setRendered(false);
						setTimeout(() => {
							setRendered(true);
						}, 1);
					}}
				>
					<RefreshIcon />
				</IconButton>
			</MediaErrorContent>
		);
	};

	return (
		<Box ref={observe}>
			{!isLoading ? (
				slot ? (
					<ItemCardStyle
						onClick={() => {
							setCurrentSelectedSlot(slot);
						}}
					>
						<Stack direction="row" spacing={2} alignItems="center">
							<ComponentIndex
								className={
									currentSelectedSlot && currentSelectedSlot._id === slot._id
										? 'active'
										: ''
								}
							>
								<Typography variant="h3">#{componentIndex}</Typography>
							</ComponentIndex>
							<Box>
								<Typography variant="body1">Slot index:</Typography>
								<Typography variant="h3">{slot.slotIndex}</Typography>
							</Box>
						</Stack>
					</ItemCardStyle>
				) : (
					<></>
				)
			) : (
				<SkeletonStakingItemCard />
			)}
		</Box>
	);
}
