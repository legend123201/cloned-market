/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { Fragment, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// mui
import { Box, IconButton, Stack, Tooltip, Typography, useTheme } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
// styled
import {
	ContentPart,
	CollectionBackground,
	CollectionCardWrapper,
	CollectionInfo,
	CollectionLogo,
	CollectionLogoWrapper,
	CollectionName,
	CollectionNumberItem,
	CollectionOwner,
	ImageBlockchain,
	OwnerName,
} from './styled';
// models
import { Collection, Response } from 'models';
// utils
import { compressImage, sliceAddress, sliceString } from 'utils';
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
				: sliceString(collection.ownerInfo.userAddress, 20);

		if (sliceString(userAddress ?? '', 20) === result) {
			return 'You';
		}
		return result;
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
					<Fragment>
						<CollectionCardWrapper
							onClick={() => {
								navigate(`${PATH_COLLECTION.detail}/${collection._id}`);
							}}
						>
							<CollectionBackground sx={{ height: backgroundHeight }}>
								<LazyImageCustom
									src={
										collection.background
											? compressImage(collection.background, 500, 'best')
											: '/baner3.png'
									}
									alt="collection background"
									type="skeleton"
									wrapperPosition="relative"
									errorComponent={ErrorMediaRender()}
								/>

								<CollectionLogoWrapper>
									<CollectionLogo
										sx={{ width: '100px', height: '100px' }}
										src={
											collection.logo &&
											compressImage(collection.logo, 150, 'best')
										}
										alt={collection.collectionName}
									/>
								</CollectionLogoWrapper>
							</CollectionBackground>

							<ContentPart sx={{ height: contentPartHeight }}>
								<CollectionInfo>
									<Stack
										direction="row"
										alignItems="center"
										justifyContent="center"
										spacing={1}
										sx={{ width: '100%' }}
									>
										<CollectionName variant="h5" noWrap>
											{collection.collectionName}
										</CollectionName>

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
									</Stack>

									<CollectionOwner>
										<Typography variant="subtitle1">By </Typography>
										{collection.userAddress && (
											<OwnerName
												variant="subtitle1"
												onClick={(e: any) => {
													handleOnClickCollectionOwner(
														e,
														collection.userAddress
													);
												}}
											>
												{renderCollectionOwner(collection)}
											</OwnerName>
										)}
									</CollectionOwner>

									<CollectionNumberItem variant="subtitle2" noWrap>
										{collection.description}
									</CollectionNumberItem>
								</CollectionInfo>
							</ContentPart>
						</CollectionCardWrapper>
					</Fragment>
				) : (
					<></>
				)
			) : (
				<SkeletonCollectionCard />
			)}
		</Box>
	);
}
