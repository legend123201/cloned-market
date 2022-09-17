/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { Fragment, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInView } from 'react-cool-inview';
// mui
import { Box, IconButton, Stack, Tooltip, Typography, useTheme } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
// styled
import { ImageBlockchain, CollectionWrapperNew, ItemImage } from './styled';
// models
import { Collection, Response } from 'models';
// utils
import { compressImage, getFileType, sliceAddress, sliceString } from 'utils';
// components
import LazyImageCustom from 'components/CustomUI/LazyImages/LazyImageCustom';
import SkeletonCollectionCard from 'components/CustomUI/Skeleton/Item/SkeletonCollectionCard';
// apis
import collectionApi from 'apis/collectionApi';
// path
import { PATH_COLLECTION, PATH_PAGE } from 'routes/path';
// constants
import { NETWORKINFO } from '../../../../constants';
// redux
import { useSelector } from 'react-redux';
import { selectAddress } from 'redux/slices/web3InfoSlice';
// hooks
import { useIsMounted } from 'hooks';
import MediaDisplay from '../NFTItemCard/MediaDisplay';

export const backgroundHeight: number = 150;
export const contentPartHeight: number = 170;

export interface ICollectionCardProps {
	collectionId: string;
}

export default function CollectionCard({ collectionId }: ICollectionCardProps) {
	const navigate = useNavigate();
	const theme = useTheme();

	// hooks
	const isMounted = useIsMounted();

	// useState
	const [collection, setCollection] = useState<Collection>();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isSuccess, setIsSuccess] = useState<boolean>(false);
	const [refetchApi, setRefetchApi] = useState<boolean>(false);

	// useSelector
	const userAddress = useSelector(selectAddress);

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

	// useEffect
	useEffect((): any => {
		// if (!itemId || !userAddress || !chainId) return;
		if (!collectionId) return;

		(async () => {
			setIsLoading(true);

			try {
				const res: Response<any> = await collectionApi.getCollectionById(collectionId);

				if (isMounted()) {
					setCollection(res.data);
					setIsSuccess(true);
				}
			} catch (error) {
				if (isMounted()) {
					setIsLoading(false);
					setIsSuccess(false);
				}

				console.log(error);
			} finally {
				if (isMounted()) {
					setIsLoading(false);
				}
			}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [collectionId, refetchApi]);

	// functions

	const handleOnClickCollectionOwner = (e: any, collectionOwner: string) => {
		e.stopPropagation();
		navigate(`${PATH_PAGE.otherUser}/${collectionOwner}`);
	};

	const ErrorMediaRender = () => {
		return (
			<Box
				sx={{
					position: 'absolute',
					top: 0,
					left: 0,
					width: '100%',
					height: '100%',
					background: 'grey',
					opacity: '0.2',
				}}
			></Box>
		);
	};

	const renderCollectionOwner = (collection: Collection): string | undefined => {
		const result: string | undefined =
			collection.ownerInfo.username.toLowerCase() === 'unknown name'
				? sliceString(collection.userAddress, 20)
				: sliceString(collection.ownerInfo.username, 20);

		if (sliceString(userAddress ?? '', 20) === result) {
			return 'You';
		}
		return result;
	};

	const renderNewCollection = () => {
		if (collection === undefined) return;
		return (
			<Box ref={observe}>
				<CollectionWrapperNew
					onClick={() => {
						navigate(`${PATH_COLLECTION.detail}/${collection._id}`);
					}}
				>
					<Box
						sx={{
							position: 'relative',
							zIndex: '2',
							display: 'flex',
							flexDirection: 'row',
							gap: '12px',
						}}
					>
						<Box sx={{ flex: '1 1 0%', height: '286px' }}>
							{getFileType(
								collection.listItem.length > 0
									? collection.listItem[0].itemMedia
									: collection.background
							) === 'mp4'
								? inView && (
										<video
											style={{
												width: '100%',
												height: '100%',
												borderRadius: '8px',
												objectFit: 'cover',
											}}
											src={
												collection.listItem.length > 0
													? collection.listItem[0].itemMedia
													: collection.background
											}
										/>
								  )
								: inView && (
										<LazyImageCustom
											src={
												collection.listItem.length > 0
													? compressImage(
															collection.listItem[0].itemMedia,
															480,
															'best'
													  )
													: collection.background
											}
											alt={collection.collectionName}
											wrapperPosition="relative"
											imgStyle={{
												width: '100%',
												height: '100%',
												borderRadius: '8px',
												objectFit: 'cover',
											}}
											type="skeleton"
											errorComponent={ErrorMediaRender()}
										/>
								  )}
						</Box>
						{collection.listItem.length > 1 && (
							<Box
								sx={{
									display: 'flex',
									flexDirection: 'column',
									gap: '8px',
									flex: '1 1 0%',
									width: '90px',
									maxWidth: '90px',
								}}
							>
								{collection.listItem.map((item: any, index: number) => {
									return (
										collection.listItem[0] !== item &&
										item.itemMedia !== '' && (
											<ItemImage
												key={index}
												sx={{ width: '90px', height: '90px' }}
											>
												{inView && (
													<MediaDisplay
														media={item.itemMedia}
														preview={item.itemPreviewMedia}
														name={item.itemName}
														lazyType="skeleton"
													/>
												)}
											</ItemImage>
										)
									);
								})}
							</Box>
						)}
					</Box>
					<Stack
						sx={{ zIndex: '2', mt: 2, width: '60%', flexDirection: 'row', gap: '4px' }}
					>
						<Typography variant="h6" noWrap>
							{sliceString(collection.collectionName, 20)}
						</Typography>
						<Box>
							<Tooltip
								title={NETWORKINFO[collection.chainId].name}
								placement="top"
								aria-describedby="tip1"
								arrow
								componentsProps={{
									tooltip: {
										sx: {
											bgcolor: 'common.black',
											'& .MuiTooltip-arrow': {
												color: 'common.black',
											},
										},
									},
								}}
							>
								<ImageBlockchain>
									<img
										src={NETWORKINFO[collection.chainId].image}
										alt="icon blockchain"
									/>
								</ImageBlockchain>
							</Tooltip>
						</Box>
					</Stack>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'space-between',
							zIndex: '2',
							alignItems: 'center',
							mt: 2,
						}}
					>
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'row',
								gap: '8px',
								alignItems: 'center',
							}}
						>
							<Box
								sx={{
									width: '30px',
									// height: '30px',
									// objectFit: 'cover',
									// borderRadius: '50%',
								}}
							>
								<img
									style={{
										width: '100%',
										height: '100%',
										borderRadius: '50%',
									}}
									src={collection.ownerInfo.avatar}
									alt=""
								/>
							</Box>
							<Stack direction="row" gap="4px" width="100%" alignItems="baseline">
								<Typography fontSize="14px">by</Typography>
								<Typography sx={{ fontWeight: '600' }}>
									{collection.ownerInfo.username}
								</Typography>
							</Stack>
						</Box>
						<Stack direction="row" gap="4px" alignItems="baseline">
							<Typography fontSize="14px">item(s):</Typography>
							<Typography>{collection.items}</Typography>
						</Stack>
					</Box>
				</CollectionWrapperNew>
			</Box>
		);
	};

	return (
		<Box>
			{!isLoading ? (
				!isSuccess ? (
					<Box sx={{ position: 'relative' }}>
						<Box
							className="fake-height"
							sx={{ height: `${backgroundHeight + contentPartHeight}px` }}
						></Box>

						<Stack
							justifyContent="center"
							alignItems="center"
							sx={{
								position: 'absolute',
								top: 0,
								left: 0,
								width: '100%',
								height: '100%',
							}}
						>
							<Box
								sx={{
									position: 'absolute',
									top: 0,
									left: 0,
									width: '100%',
									height: '100%',
									zIndex: '0',
									backgroundColor: 'gray',
									opacity: '0.2',
									borderRadius: '15px',
								}}
							></Box>
							<Typography variant="h6">Error</Typography>
							<Typography variant="body2" sx={{ px: 5, pb: 1, textAlign: 'center' }}>
								Something went wrong when load this collection. Please refresh.
							</Typography>

							<IconButton
								aria-label="refresh"
								onClick={(e) => {
									e.stopPropagation();
									setRefetchApi(!refetchApi);
								}}
							>
								<RefreshIcon />
							</IconButton>
						</Stack>
					</Box>
				) : collection ? (
					<Fragment>{renderNewCollection()}</Fragment>
				) : (
					<></>
				)
			) : (
				<SkeletonCollectionCard />
			)}
		</Box>
	);
}
