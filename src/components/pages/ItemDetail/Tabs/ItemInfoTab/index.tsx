/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { Fragment, useEffect, useState } from 'react';
import { formatEther } from '@ethersproject/units';
import { useNavigate } from 'react-router-dom';
import { BigNumber } from 'ethers';
import moment from 'moment';
// model
import { NFT, OrderResponseAPI, TokenPayment } from 'models';
// mui
import { Box, Stack, Tooltip, Typography, useTheme } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
// components
import ButtonOffer from '../../ExecuteButton/ButtonOffer';
import ItemPrice from '../../ItemPrice';
import Countdown from '../../Countdown';
import SkeletonItemInfo from 'components/CustomUI/Skeleton/Page/ItemDetail/SkeletonItemInfo';
import ButtonGroupOptions from '../../ButtonGroupOptions';
import ButtonBuy from '../../ExecuteButton/ButtonBuy';
import ButtonSell from '../../ExecuteButton/ButtonSell';
import ButtonCancelSelling from '../../ExecuteButton/ButtonCancelSelling';
import ButtonCancelOffer from '../../ExecuteButton/ButtonCancelOffer';
import ButtonUnpack from '../../ExecuteButton/ButtonUnpack';
// image
import IconLockWhite from 'assets/icons/lock-white.webp';
import IconLockBlack from 'assets/icons/lock-black.webp';
import IconFreezeWhite from 'assets/icons/freeze-white.webp';
import IconFreezeBlack from 'assets/icons/freeze-black.webp';
// styled
import { BoxSubContent, CollectionName, ItemName, ItemOwner } from './styled';
// constants
import { ETHERSCAN } from 'constants/etherscan.constant';
import { ITEM_STATUS, ORDER_CONFIGURATION, ORDER_TYPE } from '../../../../../constants';
//redux
import { useSelector } from 'react-redux';
import { selectAddress } from 'redux/slices/web3InfoSlice';
import { selectListTokenPayment } from 'redux/slices/tokenPaymentSlice';
import { selectLoading as selectLoadingItem } from 'redux/slices/nftItemByItemIdSlice';
//utils
import {
	compareDate,
	erc20function,
	formatNumber,
	isNativeToken,
	sliceAddress,
	sliceString,
	timestampToDate,
} from 'utils';
//api
import DividerGradient from 'components/CustomUI/DividerGradient';
import { PATH_COLLECTION, PATH_PAGE } from 'routes/path';
import { CalculateFinalPrice } from 'redux/actions/OrderAction/common';

export interface ItemInfoTabProps {
	item: NFT | null;
	personalOffer: OrderResponseAPI | null;
	personalOrderSell: OrderResponseAPI | null;
	loadingPersonalOffer: boolean;
	loadingPersonalOrderSell: boolean;
	refetchApi: VoidFunction;
}

export default function ItemInfoTab({
	item,
	personalOffer,
	personalOrderSell,
	loadingPersonalOffer,
	loadingPersonalOrderSell,
	refetchApi,
}: ItemInfoTabProps) {
	const navigate = useNavigate();
	const theme = useTheme();
	const isLightTheme = theme.palette.mode === 'light';

	// useState
	const [currentOrderSellPrice, setCurrentOrderSellPrice] = useState<number>(0);

	// useSelector
	const currentAddress = useSelector(selectAddress);
	const listTokenPayment: TokenPayment[] = useSelector(selectListTokenPayment);
	const isLoadingItem = useSelector(selectLoadingItem);

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

	return !isLoadingItem ? (
		item ? (
			<>
				<Box sx={{ position: 'relative' }}>
					<ButtonGroupOptions
						itemId={item._id}
						itemName={item.itemName}
						refetchApi={refetchApi}
					/>
				</Box>
				{/* Name */}
				<CollectionName
					variant="h6"
					sx={{ pt: 2, fontWeight: '400' }}
					onClick={() =>
						navigate(
							item.collectionId
								? `${PATH_COLLECTION.detail}/${item.collectionId}`
								: '#'
						)
					}
				>
					{item.collectionInfo?.collectionName
						? sliceString(item.collectionInfo.collectionName, 25)
						: ''}
				</CollectionName>
				<ItemName sx={{ mt: 2, fontWeight: '400' }} variant="h3">
					{sliceString(item.itemName, 25)}
				</ItemName>
				<ItemOwner sx={{ fontWeight: '400', mt: 1 }} variant="h6">
					Created by{' '}
					<span
						onClick={() =>
							currentAddress === item.creator
								? navigate(`${PATH_PAGE.user}`)
								: navigate(`${PATH_PAGE.otherUser}/${item.creator}`)
						}
					>
						{currentAddress === item.creator ? 'You' : sliceAddress(item.creator, 8, 5)}
					</span>
				</ItemOwner>

				<DividerGradient sx={{ mt: '1rem' }} />

				{/* Sub content */}
				<BoxSubContent sx={{ pt: 2 }}>
					{isLightTheme ? (
						<img src={IconLockBlack} alt="lock icon" width={20} height={20} />
					) : (
						<img src={IconLockWhite} alt="lock icon" width={20} height={20} />
					)}

					<Typography variant="h6" sx={{ p: '0 10px', fontWeight: '400' }}>
						Includes unlockable content.
					</Typography>
				</BoxSubContent>

				<BoxSubContent sx={{ pt: 2, mb: 1 }}>
					{isLightTheme ? (
						<img src={IconFreezeBlack} alt="lock icon" width={20} height={20} />
					) : (
						<img src={IconFreezeWhite} alt="lock icon" width={20} height={20} />
					)}

					<Typography variant="h6" sx={{ p: '0 10px', fontWeight: '400' }}>
						{item.isFreeze ? 'Item is frozen.' : 'Not frozen yet.'}
					</Typography>
				</BoxSubContent>

				{personalOffer && (
					<Typography variant="h6" sx={{ py: 0.5 }}>
						You are offering for:{' '}
						{formatNumber(Number(personalOffer.offerPrice ?? 0), 0, 4)}{' '}
						{personalOffer.tokenSymbol?.toUpperCase()}
					</Typography>
				)}

				{personalOrderSell && (
					<Typography variant="h6" sx={{ py: 0.5 }}>
						You are listing for: {formatNumber(Number(currentOrderSellPrice), 0, 4)}{' '}
						{personalOrderSell.tokenSymbol?.toUpperCase()}
					</Typography>
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
			</>
		) : (
			<></>
		)
	) : (
		<SkeletonItemInfo />
	);
}
