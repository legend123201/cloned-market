/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
// mui
import { Box, Typography } from '@mui/material';
// apis
import orderApi from 'apis/orderApi';
// components
import ButtonAcceptOffer from 'components/pages/ItemDetail/ExecuteButton/ButtonAcceptOffer';
import SkeletonOrderInItemDetailCard from 'components/CustomUI/Skeleton/Item/SkeletonOrderInItemDetailCard';
import ButtonBuy from 'components/pages/ItemDetail/ExecuteButton/ButtonBuy';
// models
import { NFT, OrderResponseAPI, Response } from 'models';
// utils
import {
	erc20function,
	formatNumber,
	formatTimestamp,
	generateGrad,
	isNativeToken,
	sliceAddress,
} from 'utils';
import { formatEther } from '@ethersproject/units';
// styled
import { GradIcon } from '../NFTItemCard/styled';
import { ButtonBox, OrderCard, StyledSpan } from './styled';
// constants
import { ORDER_TYPE, ORDER_CONFIGURATION } from '../../../../constants';
// actions
import { CalculateFinalPrice } from 'redux/actions/OrderAction/common';
// hooks
import { useIsMounted } from 'hooks';

export interface IOrderInItemDetailCardProps {
	orderId: any;
	item: NFT | null;
}

export default function OrderInItemDetailCard({ item, orderId }: IOrderInItemDetailCardProps) {
	// hooks
	const isMounted = useIsMounted();

	// useState
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [orderResponse, setOrderResponse] = useState<OrderResponseAPI | null>(null);
	const [orderType, setOrderType] = useState<'' | 'sell' | 'offer'>('');
	const [currentOrderPrice, setCurrentOrderPrice] = useState<number>(0);

	// useEffect
	useEffect((): any => {
		(async () => {
			setIsLoading(true);

			try {
				const res: Response<OrderResponseAPI> = await orderApi.getOrderDetail(
					orderId._id ?? orderId
				);
				const orderDetail: OrderResponseAPI = res.data;

				if (isMounted()) {
					setOrderResponse(orderDetail);
					if (orderDetail.type === ORDER_TYPE.SELL) {
						setOrderType('sell');
					} else {
						setOrderType('offer');
					}
				}
			} catch (error) {
				console.log(error);
			} finally {
				if (isMounted()) {
					setIsLoading(false);
				}
			}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [orderId]);

	// calculate current order price
	useEffect(() => {
		if (!orderResponse) return;

		let priceInterval: any;
		// cal dutch price for order sell (offer can not use dutch option)
		if (
			orderResponse.type === ORDER_TYPE.SELL &&
			orderResponse.saleKind === ORDER_CONFIGURATION.DUTCH_AUCTION
		) {
			const calDutchPrice = async () => {
				try {
					const finalPrice = await CalculateFinalPrice(
						orderResponse,
						orderResponse.chainId
					);

					let finalPriceToToken: number = 0;
					if (!isNativeToken(orderResponse.paymentToken)) {
						finalPriceToToken = Number(
							await erc20function().changeWeiToToken(
								orderResponse.paymentToken,
								finalPrice
							)
						);
					} else {
						finalPriceToToken = Number(formatEther(finalPrice.toString()));
					}

					setCurrentOrderPrice(finalPriceToToken);
				} catch (error) {
					console.log(error);
				}
			};

			// cal for the first time render
			calDutchPrice();

			priceInterval = setInterval(calDutchPrice, 10000);
		} else {
			setCurrentOrderPrice(Number(orderResponse.salePrice ?? 0));
		}

		return () => {
			clearInterval(priceInterval);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [orderResponse]);

	return !isLoading ? (
		orderResponse ? (
			<OrderCard>
				<GradIcon
					sx={{
						background: `${generateGrad(orderResponse.maker)}`,
						width: '40px',
						height: '40px',
						mr: 2,
						flexShrink: 0,
					}}
				/>
				<Box>
					<Typography variant="body2" sx={{ fontWeight: '600' }}>
						{orderType === 'sell' ? 'Listing' : 'Offering'}{' '}
						{formatNumber(currentOrderPrice, 0, 4)}{' '}
						{orderResponse.tokenSymbol?.toUpperCase()} <StyledSpan>for</StyledSpan>{' '}
						{orderResponse.quantity} item(s) <StyledSpan>by</StyledSpan>{' '}
						{sliceAddress(orderResponse.maker, 4, 4)}
					</Typography>
					<Typography variant="body2">
						<StyledSpan>
							{formatTimestamp(
								Number(orderResponse.listingTime),
								'MMMM Do, YYYY, h:mm A'
							).toString()}
						</StyledSpan>
						{/* March 29, 2022, 10:56 PM */}
					</Typography>
				</Box>

				{orderType === 'offer' && (
					<ButtonBox className="ButtonDisplay">
						<ButtonAcceptOffer orderBuy={orderResponse} />
					</ButtonBox>
				)}

				{orderType === 'sell' && (
					<ButtonBox className="ButtonDisplay">
						<ButtonBuy
							item={item}
							currentOrderPrice={currentOrderPrice}
							orderSell={orderResponse}
						/>
					</ButtonBox>
				)}
			</OrderCard>
		) : (
			<></>
		)
	) : (
		<SkeletonOrderInItemDetailCard />
	);
}
