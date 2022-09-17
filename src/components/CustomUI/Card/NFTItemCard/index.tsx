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
import ThreeDotWhite from 'assets/icons/three-dot-white.svg';
import ThreeDotBlack from 'assets/icons/three-dot-black.svg';
import HeartBlack from 'assets/icons/heart-black.svg';
import HeartWhite from 'assets/icons/heart-white.svg';
import HeartFullRed from 'assets/icons/heart-full-red.svg';
import HeartFullWhite from 'assets/icons/heart-white.svg';

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
	ItemFavorite,
	IconFavorite,
	DropDownWrapper,
	DropDownOption,
	LinkWrapper,
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
	NETWORKINFO,
	NULL_ADDRESS,
	MESSAGE,
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
import ModalBuy from './ModalBuy';
import ModalActivity from './ModalActivity';
import DropDown from 'components/CustomUI/DropDown';

export const contentHeight: number = 100;

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

	const [isOpenModalBuy, setIsOpenModalBuy] = useState<boolean>(false);
	const [activeDropDown, setActiveDropDown] = useState<boolean>(false);

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
				<Typography variant="body2" noWrap sx={{ cursor: 'default' }}>
					Listing
				</Typography>
			);
		} else {
			return (
				<Typography variant="body2" noWrap sx={{ cursor: 'default' }}>
					Unlisted
				</Typography>
			);
		}
	};

	const renderButtonContent = () => {
		return (
			<Box
				sx={{
					display: 'flex',
					width: '32px',
					height: '32px',
					padding: '8px 8px 8px 8px',
					borderRadius: '50%',
					cursor: 'pointer',
					'&:hover': {
						backgroundColor: 'rgba(255,255,255,0.2)',
					},
				}}
			>
				<img src={isLightTheme ? ThreeDotBlack : ThreeDotWhite} alt="icon three dots" />
			</Box>
		);
	};

	const renderDropdownContent = () => {
		return (
			<DropDownWrapper>
				<TwitterShareButton
					url={`${RELATED_URLS.MetaSpacecyHomePage}/#${PATH_ITEM.detail}/${item?._id}`}
					title={`Look what I found! ${item?.itemName} collectible`}
					hashtags={['Music', 'Game']}
					via="MetaSpacecy"
					style={{ width: '100%' }}
				>
					<DropDownOption variant="subtitle2">Share</DropDownOption>
				</TwitterShareButton>
				{/* Enable/Disable Report */}
				{/* <DropDownOption variant="subtitle2">Report</DropDownOption> */}
			</DropDownWrapper>
		);
	};

	const creatorAvatar = useMemo(() => {
		return generateGrad(item ? item.creator : NULL_ADDRESS);
	}, [item]);

	const ownerAvatar = useMemo(() => {
		return generateGrad(item ? item.owner[0] : NULL_ADDRESS);
	}, [item]);

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
									e.preventDefault();
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
						<LinkWrapper href={`#${PATH_ITEM.detail}/${item._id}`}>
							{item.itemStandard.includes('1155') && <StackCard></StackCard>}

							<ItemCardStyle>
								<Box sx={{ p: 1.5 }}>
									{/* Item image */}
									<ItemImage onClick={() => navigateToDetailPage(item._id)}>
										{inView && (
											<Box className="main-img">
												<MediaDisplay
													media={item.itemMedia}
													preview={item.itemPreviewMedia}
													name={item.itemName}
												/>
											</Box>
										)}

										{/* Item favorite */}
										<ItemFavorite
											onClick={(e: any) => {
												e.preventDefault();
												e.stopPropagation();
											}}
										>
											<Stack
												direction="row"
												alignItems="center"
												spacing={0.5}
											>
												<Box
													sx={{
														cursor: 'pointer',
													}}
													onClick={(e: any) => {
														e.preventDefault();
														e.stopPropagation();
														handleFavorite(!likeState);
													}}
												>
													{likeState ? (
														<IconFavorite
															src={HeartFullRed}
															alt="icon favorite"
														/>
													) : isLightTheme ? (
														<IconFavorite
															src={HeartBlack}
															alt="icon favorite"
														/>
													) : (
														<IconFavorite
															src={HeartWhite}
															alt="icon favorite"
														/>
													)}
												</Box>
												<Typography variant="body1">
													{totalFavorite}
												</Typography>
											</Stack>
										</ItemFavorite>

										{/* Item creator / owner */}
										<Stack
											direction="row"
											sx={{
												position: 'absolute',
												bottom: '-10px',
												left: '10px',
											}}
										>
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

											{item.owner[0] && item.ownerInfo && item.ownerInfo[0] && (
												<Tooltip
													title={`Owner: ${
														item.owner[0]
															? sliceAddress(item.owner[0], 6, 6)
															: sliceAddress(NULL_ADDRESS, 6, 6)
													}`}
													placement="top"
													aria-describedby="tip1"
												>
													<AvatarIcon
														sx={{ marginLeft: '-10px', zIndex: 1 }}
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
																sx={{ width: 25, height: 25 }}
																src={item.ownerInfo[0].avatar}
																alt="creator"
															/>
														)}
													</AvatarIcon>
												</Tooltip>
											)}
										</Stack>
									</ItemImage>

									{/* Item info */}
									<ItemContent sx={{ pt: 4, height: contentHeight }}>
										<Stack
											direction="row"
											alignItems="center"
											justifyContent="space-between"
											spacing={1}
										>
											<Box
												sx={{
													width: '70%',
													display: 'flex',
													flexDirection: 'row',
													gap: '8px',
												}}
											>
												<Typography
													variant="subtitle1"
													fontWeight="500"
													noWrap
													sx={{ cursor: 'default' }}
												>
													{item.itemName}
												</Typography>
												<Box>
													<Tooltip
														title={NETWORKINFO[item.chainId].name}
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
																src={
																	NETWORKINFO[item.chainId].image
																}
																alt="icon blockchain"
															/>
														</ImageBlockchain>
													</Tooltip>
												</Box>
											</Box>

											<DropDown
												activeDropDown={activeDropDown}
												setActiveDropDown={setActiveDropDown}
												buttonContent={renderButtonContent()}
												dropdownContent={renderDropdownContent()}
												sx={{
													right: 0,
													bottom: '40px',
													left: 'unset',
													top: 'unset',
												}}
											/>
										</Stack>

										<Box>
											<Stack
												direction="row"
												alignItems="end"
												justifyContent="space-between"
												spacing={1}
												sx={{ paddingTop: '10px' }}
											>
												{renderItemPrice(item)}

												<Typography
													variant="body2"
													sx={{
														fontWeight: '600',
														cursor:
															item.status === ITEM_STATUS.BUY_NOW
																? 'pointer'
																: 'no-drop',
														opacity: '0.85',
														...(theme.palette.mode === 'light'
															? {
																	color:
																		item.status ===
																		ITEM_STATUS.BUY_NOW
																			? theme.palette.text
																					.special
																			: 'rgba(0,0,0,0.3)',
															  }
															: {
																	color:
																		item.status ===
																		ITEM_STATUS.BUY_NOW
																			? theme.palette.text
																					.special
																			: 'rgba(255,255,255,0.5)',
															  }),
														'&:hover': {
															opacity: '1',
														},
													}}
													onClick={(e: any) => {
														e.preventDefault();
														if (item.status === ITEM_STATUS.BUY_NOW) {
															setIsOpenModalBuy(true);
														}
													}}
												>
													Buy now
												</Typography>
											</Stack>
										</Box>
									</ItemContent>
								</Box>
							</ItemCardStyle>
						</LinkWrapper>
						{/* Stack card (1155) */}

						{/* Modal buy */}
						<ModalBuy
							item={item}
							isOpenModal={isOpenModalBuy}
							setIsOpenModal={setIsOpenModalBuy}
						/>

						{/* Modal activity */}
						<ModalActivity />
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
