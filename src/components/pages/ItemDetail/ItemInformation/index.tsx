/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import { TwitterShareButton } from 'react-share';
import { useNavigate } from 'react-router-dom';
// mui
import { Box, Stack, Tooltip, Typography, useTheme } from '@mui/material';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
// images
import VerifiedIcon from 'assets/icons/blue-verify.svg';
import HeartFullRed from 'assets/icons/heart-full-red.svg';
import HeartBlack from 'assets/icons/heart-black.svg';
import HeartWhite from 'assets/icons/heart-white.svg';
// components
import DropDown from 'components/CustomUI/DropDown';
import RelatedUser from '../RelatedUser';
import OfferingsAndLisings from './OfferingsAndListings';
import ButtonSell from '../ExecuteButton/ButtonSell';
import ButtonCancelSelling from '../ExecuteButton/ButtonCancelSelling';
import ButtonCancelOffer from '../ExecuteButton/ButtonCancelOffer';
import ButtonUnpack from '../ExecuteButton/ButtonUnpack';
import ButtonOffer from '../ExecuteButton/ButtonOffer';
// styled
import {
	CollectionName,
	DropDownOption,
	DropDownWrapper,
	FeatureWrapper,
	ItemDescription,
} from './styled';
// redux
import { useDispatch, useSelector } from 'react-redux';
import { selectNftItem, selectLoading } from 'redux/slices/nftItemByItemIdSlice';
// actions
import { CalculateFinalPrice } from 'redux/actions/OrderAction/common';
// models
import { InteractionInput, NFT, OrderResponseAPI } from 'models';
// constants
import { MESSAGE, ORDER_CONFIGURATION, ORDER_TYPE, RELATED_URLS } from '../../../../constants';
// utils
import {
	erc20function,
	formatNumber,
	isNativeToken,
	signTransaction,
	tokenErcFunction,
} from 'utils';
import { formatEther } from '@ethersproject/units';
// path
import { PATH_COLLECTION, PATH_ITEM } from 'routes/path';
import { IconFavorite } from 'components/CustomUI/Card/NFTItemCard/styled';
import {
	selectAddress,
	selectCurrentProvider,
	setSignature,
	selectSignature,
} from 'redux/slices/web3InfoSlice';

import { toast } from 'react-toastify';
import interactionApi from 'apis/interactionApi';
import ModalFreeze from '../ExecuteModal/ModalFreeze';

const { isHoldingAllItemQuantity } = tokenErcFunction();

export interface IItemInformationProps {
	personalOffer: OrderResponseAPI | null;
	personalOrderSell: OrderResponseAPI | null;
	loadingPersonalOffer: boolean;
	loadingPersonalOrderSell: boolean;
	refetchApi: VoidFunction;
}

export default function ItemInformation({
	personalOffer,
	personalOrderSell,
	loadingPersonalOffer,
	loadingPersonalOrderSell,
	refetchApi,
}: IItemInformationProps) {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const interactionRef = useRef<any>(null);
	const theme = useTheme();

	// useState
	const [activeDropDown, setActiveDropDown] = useState<boolean>(false);
	const [currentOrderSellPrice, setCurrentOrderSellPrice] = useState<number>(0);
	const [likeState, setLikeState] = useState<boolean>(false);
	const [totalFavorite, setTotalFavorite] = useState<number>(0);
	const [isOwnedAllQuantityErc1155, setIsOwnedAllQuantityErc1155] = useState<boolean>(false);
	const [isOpenModalFreeze, setIsOpenModalFreeze] = useState<boolean>(false);

	// useSelector
	const userAddress = useSelector(selectAddress);
	const signature = useSelector(selectSignature);
	const provider = useSelector(selectCurrentProvider);

	// useSelector
	const item: NFT | null = useSelector(selectNftItem);
	const isLoadingItem = useSelector(selectLoading);
	const isLightTheme = theme.palette.mode === 'light';

	// useEffect
	// useEffect
	// calculate order sell price
	useEffect(() => {
		if (!personalOrderSell) return;

		let priceInterval: any;
		// cal dutch price for order sell (offer can not use dutch option)
		if (
			personalOrderSell.type === ORDER_TYPE.SELL &&
			personalOrderSell.saleKind === ORDER_CONFIGURATION.DUTCH_AUCTION
		) {
			const calDutchPrice = async () => {
				try {
					const finalPrice = await CalculateFinalPrice(
						personalOrderSell,
						personalOrderSell.chainId
					);

					let finalPriceToToken: number = 0;
					if (!isNativeToken(personalOrderSell.paymentToken)) {
						finalPriceToToken = Number(
							await erc20function().changeWeiToToken(
								personalOrderSell.paymentToken,
								finalPrice
							)
						);
					} else {
						finalPriceToToken = Number(formatEther(finalPrice.toString()));
					}

					setCurrentOrderSellPrice(finalPriceToToken);
				} catch (error) {
					console.log(error);
				}
			};

			// cal for the first time render
			calDutchPrice();

			priceInterval = setInterval(calDutchPrice, 10000);
		} else {
			setCurrentOrderSellPrice(Number(personalOrderSell.salePrice ?? 0));
		}

		return () => {
			clearInterval(priceInterval);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [personalOrderSell]);

	// check isOwnedAllQuantityTemp
	useEffect(() => {
		(async () => {
			if (!userAddress || !item || !item.collectionInfo) return;

			try {
				if (item.itemStandard.includes('1155')) {
					const isOwnedAllQuantityTemp = await isHoldingAllItemQuantity(
						userAddress,
						item.chainId,
						item.collectionInfo.collectionAddress,
						item.itemTokenId
					);

					setIsOwnedAllQuantityErc1155(isOwnedAllQuantityTemp);
				}
			} catch (error) {
				console.log(error);
				toast.error('Some error occurred when checking isOwnedAllQuantityTemp!');
			}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userAddress, item]);

	// functions
	const isQualifiedToFreeze = (): boolean => {
		if (
			!isLoadingItem &&
			item &&
			item.isFreeze === false && // unfreezed item is definitely in our collection 1155 (erc721 will return at this condition)
			userAddress &&
			userAddress === item.creator &&
			isOwnedAllQuantityErc1155
		) {
			return true;
		} else {
			return false;
		}
	};

	const isQualifiedToEdit = () => {
		if (
			item &&
			userAddress &&
			item.owner.includes(userAddress) &&
			userAddress === item.creator &&
			!item.isFreeze && // erc721 will return at this condition
			isOwnedAllQuantityErc1155
		) {
			return true;
		}
		return false;
	};

	const renderButtonContent = () => {
		return (
			<Stack direction="row" alignItems="center" sx={{ padding: '8px', cursor: 'pointer' }}>
				<MoreHorizOutlinedIcon sx={{ width: '32px' }} />
			</Stack>
		);
	};

	const renderDropdownContent = () => {
		return (
			<DropDownWrapper>
				<DropDownOption variant="subtitle2">Refresh metadata</DropDownOption>

				{isQualifiedToFreeze() && (
					<DropDownOption
						variant="subtitle2"
						onClick={() => {
							setIsOpenModalFreeze(true);
						}}
					>
						Freeze item
					</DropDownOption>
				)}

				{isQualifiedToEdit() && (
					<DropDownOption
						variant="subtitle2"
						onClick={() => {
							navigate(`${PATH_ITEM.editItem}/${item!._id}`);
						}}
					>
						Edit item
					</DropDownOption>
				)}

				<TwitterShareButton
					url={`${RELATED_URLS.MetaSpacecyHomePage}/#/detail/${item?._id}`}
					title={`Look what I found! ${item?.itemName} collectible`}
					hashtags={['Music', 'Game']}
					via="MetaSpacecy"
					style={{ width: '100%', textAlign: 'left' }}
				>
					<DropDownOption variant="subtitle2">Share</DropDownOption>
				</TwitterShareButton>
				{/* Enable/Disable Report */}
				{/* <DropDownOption variant="subtitle2">Report</DropDownOption> */}
			</DropDownWrapper>
		);
	};
	// Handle Favorite, like

	const signMessage = async () => {
		const result = await signTransaction(provider, MESSAGE.signForFavorite, userAddress);
		dispatch(setSignature(result));
		return result;
	};

	const handleFavorite = async (e: any, state: boolean) => {
		e.stopPropagation();

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

			if (userAddress && item) {
				interactionRef.current = setTimeout(async () => {
					const data: InteractionInput = {
						itemId: item._id,
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

	return (
		<Box>
			{/* Collection name / features */}
			<Stack direction="row" alignItems="center" justifyContent="space-between">
				{/* Collection name */}
				<Stack direction="row" alignItems="center" spacing={1}>
					<CollectionName
						variant="subtitle2"
						onClick={() =>
							navigate(
								item?.collectionId
									? `${PATH_COLLECTION.detail}/${item.collectionId}`
									: '#'
							)
						}
					>
						{item?.collectionInfo?.collectionName}
					</CollectionName>

					<Box sx={{ width: '20px' }}>
						<Tooltip title="Collection verified" placement="top" arrow>
							<img
								src={VerifiedIcon}
								alt="icon verified"
								style={{ width: '100%', height: 'auto' }}
							/>
						</Tooltip>
					</Box>
				</Stack>

				{/* Features */}
				<Stack direction="row" alignItems="stretch" spacing={1}>
					<FeatureWrapper>
						<Stack
							direction="row"
							alignItems="center"
							spacing={1}
							sx={{ padding: '0 10px', cursor: 'pointer' }}
							onClick={(e) => e.stopPropagation()}
						>
							<Box onClick={(e: any) => handleFavorite(e, !likeState)}>
								{likeState ? (
									<IconFavorite src={HeartFullRed} alt="icon favorite" />
								) : isLightTheme ? (
									<IconFavorite src={HeartBlack} alt="icon favorite" />
								) : (
									<IconFavorite src={HeartWhite} alt="icon favorite" />
								)}
							</Box>

							<Typography variant="body1">{totalFavorite}</Typography>
						</Stack>
					</FeatureWrapper>

					<FeatureWrapper>
						<DropDown
							activeDropDown={activeDropDown}
							setActiveDropDown={setActiveDropDown}
							buttonContent={renderButtonContent()}
							dropdownContent={renderDropdownContent()}
							sx={{ right: 0, left: 'unset' }}
						/>
					</FeatureWrapper>
				</Stack>
			</Stack>

			{/* Item name */}
			<Typography variant="h3" sx={{ mt: 2, fontWeight: '700' }}>
				{item?.itemName}
			</Typography>

			{/* Bid info */}
			{/* <Stack direction="row" alignItems="center" spacing={2}>
				<Stack direction="row" alignItems="center" spacing={1}>
					<Box sx={{ width: '15px' }}>
						<img
							src={IconImg}
							alt="icon verified"
							style={{ width: '100%', height: 'auto' }}
						/>
					</Box>

					<Typography variant="body1">4.7 ETH</Typography>
				</Stack>

				<Typography variant="body1">Highest bid</Typography>

				<Typography variant="body1">1/1 available</Typography>
			</Stack> */}

			{/* Item description */}
			<ItemDescription variant="body1" sx={{ mt: 2 }}>
				{item?.description}
			</ItemDescription>

			{/* Related users */}
			{item && (
				<Stack direction="row" alignItems="center" spacing={5} sx={{ mt: 5 }}>
					<RelatedUser user={item.creatorInfo!} position="Creator" />

					{item.ownerInfo && item.ownerInfo[0] && (
						<RelatedUser user={item.ownerInfo[0]} position="Owner" />
					)}
				</Stack>
			)}

			{/* User order */}
			{(personalOffer || personalOrderSell) && (
				<Stack spacing={1} sx={{ mt: 3 }}>
					{personalOffer && (
						<Typography variant="body1" sx={{ py: 0.5 }}>
							You are offering for:{' '}
							{formatNumber(Number(personalOffer.offerPrice ?? 0), 0, 4)}{' '}
							{personalOffer.tokenSymbol?.toUpperCase()}
						</Typography>
					)}

					{personalOrderSell && (
						<Typography variant="body1" sx={{ py: 0.5, mt: 1 }}>
							You are listing for: {formatNumber(Number(currentOrderSellPrice), 0, 4)}{' '}
							{personalOrderSell.tokenSymbol?.toUpperCase()}
						</Typography>
					)}
				</Stack>
			)}

			{/* EXECUTE BUTTONS */}
			<Stack
				direction="row"
				justifyContent="flex-start"
				alignItems="center"
				spacing={2}
				sx={{ height: '2.3rem', mt: 4 }}
			>
				<ButtonSell
					loadingPersonalOrderSell={loadingPersonalOrderSell}
					personalOrderSell={personalOrderSell}
				/>

				<ButtonOffer
					personalOffer={personalOffer}
					loadingPersonalOffer={loadingPersonalOffer}
				/>

				<ButtonCancelSelling
					loadingPersonalOrderSell={loadingPersonalOrderSell}
					personalOrderSell={personalOrderSell}
					refetchApi={refetchApi}
				/>

				<ButtonCancelOffer
					loadingPersonalOffer={loadingPersonalOffer}
					personalOffer={personalOffer}
					refetchApi={refetchApi}
				/>

				<ButtonUnpack />
			</Stack>

			{/* Offerings / Listing */}
			<OfferingsAndLisings />

			{/* EXECUTE MODALS */}
			<ModalFreeze
				isOpen={isOpenModalFreeze}
				setIsOpen={setIsOpenModalFreeze}
				refetchApi={refetchApi}
			/>
		</Box>
	);
}
