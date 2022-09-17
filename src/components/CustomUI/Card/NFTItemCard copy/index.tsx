/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { TwitterShareButton } from 'react-share';
import { useInView } from 'react-cool-inview';
import { useNavigate } from 'react-router-dom';
//mui
import { Avatar, Box, IconButton, Stack, Tooltip, Typography, useTheme } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import RefreshIcon from '@mui/icons-material/Refresh';
// image
import IconTwitterWhite from 'assets/icons/twitter-white.webp';
import IconFavoriteThinWhite from 'assets/icons/favorite-thin-white.webp';

import IconTwitterBlack from 'assets/icons/twitter-black.webp';
import IconFavoriteThinBlack from 'assets/icons/favorite-thin-black.webp';
//styled
import {
	AvatarIcon,
	BoxCountDown,
	ErrorContent,
	GradIcon,
	ImageBlockchain,
	ItemCardStyle,
	ItemContent,
	ContentFooter,
	ItemImage,
	PriceChangeStyle,
	PriceStyle,
	StackCard,
} from './styled';
// models
import { InteractionInput, NFT, Response } from 'models';
// utils
import { formatNumber, generateGrad, signTransaction, sliceAddress, sliceString } from 'utils';
import nftsApi from 'apis/nftsApi';
//redux
import { useDispatch, useSelector } from 'react-redux';
import {
	selectAddress,
	selectCurrentProvider,
	selectSignature,
	setSignature,
} from 'redux/slices/web3InfoSlice';
// apis
import interactionApi from 'apis/interactionApi';
// constants
import {
	ITEM_STATUS,
	MESSAGE,
	NETWORKINFO,
	NULL_ADDRESS,
	RELATED_URLS,
} from '../../../../constants';
//components
import MediaDisplay from './MediaDisplay';
import SkeletonNFTItemCard from '../../Skeleton/Item/SkeletonNFTItem';
// path
import { PATH_ITEM } from 'routes/path';
// hooks
import { useIsMounted } from 'hooks';
import { SizeContext } from 'contexts/SizeObserver';

export const contentHeight: number = 120;

export interface NFTItemCardProps {
	itemId: any;
}

function NFTItemCard({ itemId }: NFTItemCardProps) {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const theme = useTheme();
	const { innerWidth } = useContext(SizeContext);

	// hooks
	const isMounted = useIsMounted();

	// useState
	const [totalFavorite, setTotalFavorite] = useState<number>(0);
	const [likeState, setLikeState] = useState<boolean>(false);
	const [item, setItem] = useState<NFT>();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isSuccess, setIsSuccess] = useState<boolean>(false);
	const [refresh, setRefresh] = useState<boolean>(true);

	// useSelector
	const userAddress = useSelector(selectAddress);
	const signature = useSelector(selectSignature);
	const provider = useSelector(selectCurrentProvider);

	// useRef
	const interactionRef = useRef<any>(null);

	// vars
	const isLightTheme = theme.palette.mode === 'light';

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
		if (!itemId) return;

		(async () => {
			setIsLoading(true);

			try {
				const res: Response<NFT> = await nftsApi.getLessNftInfoByTokenId({
					itemId: itemId._id ?? itemId,
					userAddress:
						userAddress ?? '0x00B91B2F8aFE87FCDc2b3fFA9ee2278cd1E4DDf8'.toLowerCase(),
				});

				if (isMounted()) {
					setItem(res.data);
					setTotalFavorite(res.data.interaction);
					setLikeState(res.data.isLike);
					setIsSuccess(true);
				}
			} catch (error) {
				setIsSuccess(false);
				console.log(error);
			} finally {
				if (isMounted()) {
					setIsLoading(false);
				}
			}
		})();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [itemId, userAddress, refresh]);

	const signMessage = async () => {
		const result = await signTransaction(provider, MESSAGE.signForFavorite, userAddress);
		dispatch(setSignature(result));
		return result;
	};

	const handleFavorite = async (state: boolean) => {
		try {
			let sig = signature;
			if (!signature) {
				sig = await signMessage();
			}
			if (likeState) {
				setTotalFavorite(totalFavorite - 1);
			} else setTotalFavorite(totalFavorite + 1);

			setLikeState(!likeState);
			if (interactionRef) {
				clearTimeout(interactionRef.current);
			}

			if (userAddress) {
				interactionRef.current = setTimeout(async () => {
					const data: InteractionInput = {
						itemId: itemId._id,
						userAddress,
						state,
						signature: sig!,
					};
					console.log(data);
					await interactionApi.interactionNft(data);
				}, 500);
			}
		} catch (error: any) {
			toast.error(error.message);
		}
	};

	const navigateToDetailPage = (itemId: string): void => {
		navigate(`${PATH_ITEM.detail}/${itemId}`);
	};

	const renderItemPrice = (item: NFT) => {
		if (item.status === ITEM_STATUS.BUY_NOW) {
			return (
				<PriceStyle variant="body1" noWrap>
					Listing
				</PriceStyle>
			);
		} else {
			return (
				<PriceStyle variant="body1" noWrap>
					Unlisted
				</PriceStyle>
			);
		}
	};

	const creatorAvatar = useMemo(() => {
		return generateGrad(item ? item.creator : NULL_ADDRESS);
	}, [item]);

	const ownerAvatar = useMemo(() => {
		return generateGrad(item ? item.owner[0] : NULL_ADDRESS);
	}, [item]);
	console.log('item', item);
	return (
		<Box ref={observe}>
			{!isLoading ? (
				!isSuccess ? (
					<ItemCardStyle sx={{ position: 'relative' }}>
						<Box className="fake-height" sx={{ p: 1.5 }}>
							<Box sx={{ paddingBottom: '100%' }}></Box>
							<Box sx={{ height: contentHeight, pt: 1 }}></Box>
						</Box>

						<ErrorContent sx={{ position: 'absolute', top: 0, left: 0 }}>
							<Typography variant="h6">Error</Typography>
							<Typography variant="body2">
								Something went wrong when load this NFT. Please refresh
							</Typography>
							<IconButton
								aria-label="refresh"
								onClick={(e) => {
									e.stopPropagation();
									setRefresh(!refresh);
								}}
							>
								<RefreshIcon />
							</IconButton>
						</ErrorContent>
					</ItemCardStyle>
				) : item ? (
					<Box sx={{ position: 'relative' }}>
						{item.itemStandard.includes('1155') && <StackCard></StackCard>}
						<ItemCardStyle>
							<Box sx={{ p: 1.5 }}>
								<ItemImage onClick={() => navigateToDetailPage(item._id)}>
									{inView && (
										<MediaDisplay
											media={item.itemMedia}
											preview={item.itemPreviewMedia}
											name={item.itemName}
										/>
									)}
								</ItemImage>
								<ItemContent sx={{ height: contentHeight, pt: 1 }}>
									<Box
										sx={{ cursor: 'pointer' }}
										onClick={() => navigateToDetailPage(item._id)}
									>
										<Stack
											direction="row"
											alignItems="center"
											justifyContent="space-between"
											spacing={1}
										>
											<Box sx={{ width: '70%' }}>
												<Typography variant="h6" noWrap>
													{innerWidth < 1000
														? innerWidth < 400
															? sliceString(item.itemName, 6)
															: innerWidth < 550
															? sliceString(item.itemName, 15)
															: sliceString(item.itemName, 20)
														: item.itemName}
												</Typography>
											</Box>

											<Tooltip
												title={NETWORKINFO[item.chainId].name}
												placement="top"
												aria-describedby="tip1"
												arrow
											>
												<ImageBlockchain>
													<img
														src={NETWORKINFO[item.chainId].image}
														alt="icon blockchain"
													/>
												</ImageBlockchain>
											</Tooltip>
										</Stack>

										<Stack
											direction="row"
											alignItems="end"
											justifyContent="space-between"
											spacing={1}
											sx={{ paddingTop: '10px' }}
										>
											{renderItemPrice(item)}

											<PriceChangeStyle
												variant="caption"
												noWrap
												sx={{ opacity: '0.5' }}
											>
												{Number(item.usdPrice) !== 0
													? `($${formatNumber(item.usdPrice, 2)})`
													: ''}
											</PriceChangeStyle>
										</Stack>
									</Box>
									<ContentFooter sx={{ mt: 1 }}>
										<Stack
											direction="row"
											justifyContent="space-between"
											alignItems="center"
											spacing={2}
											sx={{ padding: '8px 14px' }}
										>
											<Stack direction="row">
												<Tooltip
													title={`Creator: ${item.creator?.substring(
														0,
														10
													)}...${item.creator?.substring(37)}`}
													placement="top"
													aria-describedby="tip1"
												>
													<AvatarIcon>
														{item.creatorInfo?.avatar ===
														'https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg' ? (
															<GradIcon
																sx={{
																	background: creatorAvatar,
																}}
															/>
														) : (
															<Avatar
																sx={{ width: 25, height: 25 }}
																src={item.creatorInfo?.avatar}
																alt="creator"
															/>
														)}
													</AvatarIcon>
												</Tooltip>

												{item.owner[0] &&
													item.ownerInfo &&
													item.ownerInfo[0] && (
														<Tooltip
															title={`Owner: ${
																item.owner[0]
																	? sliceAddress(
																			item.owner[0],
																			6,
																			6
																	  )
																	: sliceAddress(
																			NULL_ADDRESS,
																			6,
																			6
																	  )
															}`}
															placement="top"
															aria-describedby="tip1"
														>
															<AvatarIcon
																sx={{
																	marginLeft: '-10px',
																	zIndex: 1,
																}}
															>
																{item.ownerInfo[0].avatar ===
																'https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg' ? (
																	<GradIcon
																		sx={{
																			background: ownerAvatar,
																		}}
																	/>
																) : (
																	<Avatar
																		sx={{
																			width: 25,
																			height: 25,
																		}}
																		src={
																			item.ownerInfo[0].avatar
																		}
																		alt="creator"
																	/>
																)}
															</AvatarIcon>
														</Tooltip>
													)}
											</Stack>

											<Stack
												direction="row"
												alignItems="center"
												spacing={1.5}
											>
												<TwitterShareButton
													url={`${RELATED_URLS.MetaSpacecyHomePage}/#${PATH_ITEM.detail}/${item._id}`}
													title={`Look what I found! ${item.itemName} collectible`}
													hashtags={['Music', 'Game']}
													via="MetaSpacecy"
												>
													<Box
														sx={{
															cursor: 'pointer',
														}}
														onClick={() => {}}
													>
														{isLightTheme ? (
															<img
																src={IconTwitterBlack}
																height={18}
																width={20}
																alt="icon twitter"
															/>
														) : (
															<img
																src={IconTwitterWhite}
																height={18}
																width={20}
																alt="icon twitter"
															/>
														)}
													</Box>
												</TwitterShareButton>

												<Stack
													direction="row"
													alignItems="center"
													spacing={0.5}
												>
													<Box
														sx={{
															cursor: 'pointer',
														}}
														onClick={() => handleFavorite(!likeState)}
													>
														{likeState ? (
															<FavoriteIcon
																sx={{
																	marginBottom: '-6px !important',
																}}
															/>
														) : // <FavoriteBorderIcon />
														isLightTheme ? (
															<img
																src={IconFavoriteThinBlack}
																height={18.35}
																width={20}
																alt="icon favorite"
															/>
														) : (
															<img
																src={IconFavoriteThinWhite}
																height={18.35}
																width={20}
																alt="icon favorite"
															/>
														)}
													</Box>
													<Typography variant="body1">
														{totalFavorite}
													</Typography>
												</Stack>
											</Stack>
										</Stack>
									</ContentFooter>
								</ItemContent>
							</Box>
						</ItemCardStyle>
					</Box>
				) : (
					<></>
				)
			) : (
				<SkeletonNFTItemCard />
			)}
		</Box>
	);
}

export default React.memo(NFTItemCard);
