/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { TwitterShareButton } from 'react-share';
import { useInView } from 'react-cool-inview';
//mui
import { Avatar, Box, IconButton, Stack, Tooltip, Typography, useTheme } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import RefreshIcon from '@mui/icons-material/Refresh';
// image
import IconTwitterWhite from 'assets/icons/twitter-white.webp';
import IconFavoriteThinWhite from 'assets/icons/favorite-thin-white.webp';

import IconTwitterBlack from 'assets/icons/twitter-black.webp';
import IconFavoriteThinBlack from 'assets/icons/favorite-thin-black.webp';
import WhiteArrow from 'assets/icons/arrow-white.svg';
import BlueVerify from 'assets/icons/blue-verify.svg';
import GreenVerify from 'assets/icons/green-verify.svg';

//styled
import {
	AvatarIcon,
	BoxCountDown,
	ErrorContent,
	GradIcon,
	ImageBlockchain,
	ItemCardStyle,
	ItemFooter,
	ItemImage,
	PlayBtn,
	PriceChangeStyle,
	PriceStyle,
	ButtonWhiteBlur,
	CoverHidenBox,
	MediaWrapperAuction,
	ItemWrapperIGO,
	TextWrapperIGO,
	GridWrapperIGO,
} from './styled';

import { useNavigate } from 'react-router-dom';

// models
import { InteractionInput, Response } from 'models';
// utils
import {
	compressImage,
	formatDayMonth,
	formatNumber,
	formatTimeHours,
	formatTimestamp,
	generateGrad,
	getFileType,
	signTransaction,
	sliceString,
} from 'utils';
//redux
import { useDispatch, useSelector } from 'react-redux';
import {
	selectAddress,
	selectCurrentProvider,
	selectSignature,
	setSignature,
} from 'redux/slices/web3InfoSlice';

import interactionApi from 'apis/interactionApi';

// constants
import { ITEM_STATUS, MESSAGE, NETWORKINFO, NULL_ADDRESS } from '../../../../constants';
//components
import LazyImageNFT from '../../LazyImages/LazyImage';
import MediaDisplay from './MediaDisplay';
import SkeletonNFTItemCard from '../../Skeleton/Item/SkeletonNFTItem';
import { PATH_AUCTION } from 'routes/path';
import ButtonGradient from 'components/CustomUI/ButtonGradient';
import CountDown from './CountDown';
import auctionApi from 'apis/auctionApi';
import { AuctionInfo } from 'models/Auction';
import ReactPlayer from 'react-player/lazy';
// hooks
import { useIsMounted } from 'hooks';
import SkeletonNFTItemCardAuction from 'components/CustomUI/Skeleton/Item/SkeletonNFTCardAuction';
import { LinkWrapper } from '../NFTItemCard/styled';

export interface AuctionDetaiProps {
	itemId: any;
}

function NFTItemCardInAuction({ itemId }: AuctionDetaiProps) {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const theme = useTheme();

	// hooks
	const isMounted = useIsMounted();

	// useState
	const [totalFavorite, setTotalFavorite] = useState<number>(0);
	const [likeState, setLikeState] = useState<boolean>(false);
	const [item, setItem] = useState<AuctionInfo>();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isSuccess, setIsSuccess] = useState<boolean>(false);
	const [refresh, setRefresh] = useState<boolean>(true);
	const [itemHeight, setItemHeight] = useState<number>(0);
	const [isPlaying, setIsPlaying] = useState<boolean>(false);

	// useSelector
	const userAddress = useSelector(selectAddress);
	const signature = useSelector(selectSignature);
	const provider = useSelector(selectCurrentProvider);

	// useRef
	const interactionRef = useRef<any>(null);
	let nftRef = useRef<any>();

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

	useEffect(() => {
		if (nftRef.current) {
			setItemHeight(nftRef.current.clientHeight);
		}
	}, [nftRef]);

	useEffect((): any => {
		if (!itemId) return;

		(async () => {
			setIsLoading(true);

			try {
				const res: Response<AuctionInfo> = await auctionApi.getAuctionDetailByAuctionId(
					itemId._id
				);
				if (isMounted()) {
					setItem(res.data);
					// setTotalFavorite(res.interaction);
					// setLikeState(res.isLike);
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
					await interactionApi.interactionNft(data);
				}, 500);
			}
		} catch (error: any) {
			toast.error(error.message);
		}
	};

	// Check price bid or return status acution
	const renderItemPrice = (item: AuctionInfo) => {
		return (
			<Box>
				<Typography sx={{ opacity: '0.5' }}>
					{item.highestBid === 0 ? 'Min Price' : 'Highest Bid'}
				</Typography>
				<Typography variant="h4" sx={{ fontWeight: '600' }}>
					{item.highestBid === 0
						? sliceString(String(item.minPrice), 7)
						: sliceString(String(item.highestBid), 7)}{' '}
					{item.priceType.toUpperCase()}
				</Typography>
			</Box>
		);
	};

	// const creatorAvatar = useMemo(() => {
	// 	return generateGrad(item ? item.creator : NULL_ADDRESS);
	// }, [item]);

	// const ownerAvatar = useMemo(() => {
	// 	return generateGrad(item ? item.owner[0] : NULL_ADDRESS);
	// }, [item]);

	const renderButtonCountDown = () => {
		if (item) {
			if (item.status === 'live') {
				return (
					<ButtonWhiteBlur
						className="ButtonWhiteBlur"
						onClick={() => navigate(`${PATH_AUCTION.detail}/${item._id}`)}
						sx={{
							'&:hover': {
								'& .BidPlace': {
									display: 'flex',
								},
								'& .css-12d2mry': {
									display: 'none',
								},
							},
						}}
					>
						<CountDown timeEnd={item.endTime * 1000} className="CountDownBar" />
						<Stack
							direction="row"
							className="BidPlace"
							gap={1}
							sx={{ display: 'none' }}
						>
							<Typography>Place Bid</Typography>
							<img
								src={WhiteArrow}
								alt=""
								style={{
									width: '30px',
								}}
							/>
						</Stack>
					</ButtonWhiteBlur>
				);
			}
			if (item.status === 'completed') {
				return (
					<ButtonWhiteBlur
						className="ButtonWhiteBlur"
						onClick={() => navigate(`${PATH_AUCTION.detail}/${item._id}`)}
					>
						<Typography className="BidPlace">Completed</Typography>
					</ButtonWhiteBlur>
				);
			}
			if (item.status === 'upcoming') {
				return (
					<ButtonWhiteBlur
						className="ButtonWhiteBlur"
						onClick={() => navigate(`${PATH_AUCTION.detail}/${item._id}`)}
					>
						<Typography className="BidPlace">Completed</Typography>
					</ButtonWhiteBlur>
				);
			}
		}
	};

	// console.log('item', item);
	// console.log('itemId', itemId);
	return (
		<Box ref={observe}>
			{
				// inView ? (
				!isLoading ? (
					!isSuccess ? (
						<Box sx={{ position: 'relative' }}>
							<ItemCardStyle sx={{ height: 403.6 }}>
								<ErrorContent>
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
						</Box>
					) : item ? (
						<LinkWrapper href={`#${PATH_AUCTION.detail}/${item._id}`}>
							<ItemWrapperIGO>
								<Box
									sx={{ height: '248px', maxHeight: '248px', overflow: 'hidden' }}
								>
									<ItemImage
										onClick={() =>
											navigate(`${PATH_AUCTION.detail}/${item._id}`)
										}
									>
										{getFileType(item.items[0].itemMedia) === 'mp4' ? (
											<MediaWrapperAuction
												onMouseOver={() => {
													setIsPlaying(true);
												}}
												onMouseOut={() => {
													setIsPlaying(false);
												}}
											>
												<ReactPlayer
													url={compressImage(
														item.items[0].itemMedia,
														480,
														'best'
													)}
													className="react-player"
													muted={true}
													playing={isPlaying}
													loop={true}
													controls={isPlaying}
													volume={0.5}
													config={{
														file: {
															attributes: {
																controlsList: 'nodownload',
															},
														},
													}}
												/>
											</MediaWrapperAuction>
										) : (
											<img
												src={item.items[0].itemMedia}
												alt={item.items[0].itemName}
											/>
										)}
									</ItemImage>
								</Box>
								<TextWrapperIGO>
									<Stack
										direction="row"
										gap={1}
										alignItems="center"
										sx={{ margin: '16px auto' }}
									>
										<Typography
											variant="h6"
											sx={{ fontWeight: '600' }}
											textAlign="center"
										>
											{item.infoINO.nameINO}
										</Typography>
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

									<Box sx={{ flex: '1 1 0%' }}>
										<Typography
											variant="body2"
											sx={{
												WebkitLineClamp: '3',
												display: '-webkit-box',
												overflow: 'hidden',
												WebkitBoxOrient: 'vertical',
											}}
										>
											{item.infoINO.descriptionINO}
										</Typography>
									</Box>
									<GridWrapperIGO>
										<Stack direction="row">
											<Typography
												sx={{ flex: '1 1 0%', opacity: '0.8' }}
												variant="body2"
											>
												{item.highestBid === 0
													? 'Min Price'
													: 'Highest Bid'}
											</Typography>
											<Typography variant="body2">
												{item.highestBid === 0
													? sliceString(String(item.minPrice), 7)
													: sliceString(String(item.highestBid), 7)}{' '}
												{item.priceType.toUpperCase()}
											</Typography>
										</Stack>
										<Stack direction="row">
											<Typography
												sx={{ flex: '1 1 0%', opacity: '0.8' }}
												variant="body2"
											>
												End date
											</Typography>
											<Typography variant="body2">
												{formatDayMonth(String(item.endTime))}{' '}
												{formatTimeHours(String(item.endTime))}
											</Typography>
										</Stack>
										<Stack direction="row">
											<Typography
												sx={{ flex: '1 1 0%', opacity: '0.8' }}
												variant="body2"
											>
												Seller
											</Typography>
											<Stack direction="row" gap="4px" alignItems="center">
												<Typography variant="body2">
													{item.ownerInfo.username}
												</Typography>
												<Box>
													<img
														style={{ width: '16px', height: '16px' }}
														src={GreenVerify}
														alt="Verify"
													/>
												</Box>
											</Stack>
										</Stack>
									</GridWrapperIGO>
								</TextWrapperIGO>
							</ItemWrapperIGO>
						</LinkWrapper>
					) : (
						<></>
					)
				) : (
					<SkeletonNFTItemCardAuction />
				)
			}
		</Box>
	);
}

export default React.memo(NFTItemCardInAuction);
