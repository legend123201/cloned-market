/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
// mui
import { Box } from '@mui/material';
// images
import ImageNoOffer from 'assets/icons/no-offers.webp';
// redux
import { useSelector } from 'react-redux';
import { selectNftItem } from 'redux/slices/nftItemByItemIdSlice';
import { selectListOrderSell, selectLoading } from 'redux/slices/listOrderSellSlice';
// styled
import { OfferList } from '../OfferTab/styled';
// components
import OrderInItemDetailCard from 'components/CustomUI/Card/OrderInItemDetailCard';
import SkeletonOfferInItemDetailList from 'components/CustomUI/Skeleton/List/SkeletonOfferInItemDetailList';
import NoItemCircleCard from 'components/CustomUI/Card/NoItemCard/NoItemCircleCard';
// models
import { NFT } from 'models';

export interface IListingTabProps {}

export default function ListingTab(props: IListingTabProps) {
	// useSelector
	const listOrderSell = useSelector(selectListOrderSell);
	const isLoading = useSelector(selectLoading);
	const item: NFT | null = useSelector(selectNftItem);

	return (
		<Box sx={{ width: '100%', height: '100%' }}>
			<Box sx={{ marginTop: '1rem', paddingBottom: '1rem' }}>
				{!isLoading ? (
					<OfferList listheight={500}>
						{listOrderSell && listOrderSell.length > 0 ? (
							listOrderSell.map((item: any, index: number) => (
								<Box sx={{ mb: 1 }} key={index}>
									<OrderInItemDetailCard item={item} orderId={item} />
								</Box>
							))
						) : (
							<Box sx={{ mt: 2, p: 1 }}>
								<NoItemCircleCard title="No offer yet!" image={ImageNoOffer} />
							</Box>
						)}
					</OfferList>
				) : (
					<SkeletonOfferInItemDetailList />
				)}
			</Box>
		</Box>
	);
}
