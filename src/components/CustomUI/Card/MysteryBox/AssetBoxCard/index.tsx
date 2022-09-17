/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, IconButton, Typography } from '@mui/material';
import nftsApi from 'apis/nftsApi';
import { NFT, Response } from 'models';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectAddress } from 'redux/slices/web3InfoSlice';
import { ErrorContent, ItemCardStyle, MainImage, MediaErrorContent } from './styled';
import { useInView } from 'react-cool-inview';
import RefreshIcon from '@mui/icons-material/Refresh';
import LazyImageCustom from 'components/CustomUI/LazyImages/LazyImageCustom';
import { compressImage } from 'utils';
import SkeletonAssetBoxCard from 'components/CustomUI/Skeleton/Item/Mysterybox/SkeletonAssetBoxCard';

export interface IAssetBoxCardProps {
	currentSelectedAsset: NFT | null;
	setCurrentSelectedAsset: Function;
	item: NFT;
}

export default function AssetBoxCard({
	currentSelectedAsset,
	setCurrentSelectedAsset,
	item,
}: IAssetBoxCardProps) {
	// useState
	const [rendered, setRendered] = useState<boolean>(true);

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
			<ItemCardStyle
				className={
					currentSelectedAsset && currentSelectedAsset._id === item._id ? 'active' : ''
				}
				onClick={() => {
					setCurrentSelectedAsset(item);
				}}
			>
				<MainImage>
					{rendered && inView && (
						<LazyImageCustom
							src={compressImage(item.itemMedia, 480, 'best')}
							alt="item"
							wrapperPosition="absolute"
							imgStyle={{ borderRadius: '10px' }}
							type="progress"
							errorComponent={ErrorMediaRender()}
						/>
					)}
				</MainImage>

				<Typography variant="h4" sx={{ mt: 2, textAlign: 'center', fontStyle: 'italic' }}>
					{item.itemName}
				</Typography>
			</ItemCardStyle>
		</Box>
	);
}
