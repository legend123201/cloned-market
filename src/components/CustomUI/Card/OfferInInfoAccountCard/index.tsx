import React, { useEffect, useState } from 'react';
import moment from 'moment';
// mui
import { Avatar, Box, Stack, Typography } from '@mui/material';
// apis
import orderApi from 'apis/orderApi';
// components
import SkeletonOfferInInfoAccountCard from 'components/CustomUI/Skeleton/Item/SkeletonOfferInInfoAccountCard';
// models
import { OrderResponseAPI, Response } from 'models';
// utils
import { formatNumber, sliceAddress } from 'utils';
// styled
import { OfferCard } from './styled';
// hooks
import { useIsMounted } from 'hooks';

export interface IOfferInInfoAccountCardProps {
	orderId: string;
}

export default function OfferInInfoAccountCard({ orderId }: IOfferInInfoAccountCardProps) {
	// hooks
	const isMounted = useIsMounted();

	// useState
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [orderBuy, setOrderBuy] = useState<OrderResponseAPI | null>(null);

	// useEffect
	useEffect((): any => {
		(async () => {
			setIsLoading(true);

			try {
				const res: Response<OrderResponseAPI> = await orderApi.getOrderDetailByUser(
					orderId
				);
				const orderDetail: OrderResponseAPI = res.data;

				if (isMounted()) {
					setOrderBuy(orderDetail);
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
	}, []);

	return !isLoading ? (
		orderBuy ? (
			<OfferCard>
				<Stack direction="row" alignItems="center">
					<Avatar
						sx={{ width: '50px', height: '50px', mr: 2 }}
						src={orderBuy.itemMedia}
						variant="rounded"
						alt="item"
					/>
					<Box>
						<Stack direction="row" alignItems="end">
							<Typography variant="h6" sx={{ mr: 1.5, fontWeight: '600' }}>
								{orderBuy.itemName}
							</Typography>
							<Typography variant="body1" sx={{ lineHeight: '1.65' }}>
								{moment(orderBuy.createdAt).fromNow()}
							</Typography>
						</Stack>

						<Typography variant="body2">
							From {sliceAddress(orderBuy.maker, 6, 8)}
						</Typography>
					</Box>
				</Stack>

				<Stack direction="row" alignItems="center" sx={{ mt: 0.5, ml: 0.5 }}>
					<Avatar
						sx={{
							width: '20px',
							height: '20px',
							mr: 1,
						}}
						src={orderBuy.priceLogo}
						variant="rounded"
						alt="token symbol"
					/>
					<Typography variant="h6" sx={{ mr: 1 }}>
						{orderBuy.offerPrice}
					</Typography>
					<Typography variant="body2" sx={{ opacity: 0.8, fontStyle: 'italic' }}>
						($
						{formatNumber(orderBuy.usdPrice ?? 0, 2)})
					</Typography>
				</Stack>
			</OfferCard>
		) : (
			<></>
		)
	) : (
		<SkeletonOfferInInfoAccountCard />
	);
}
