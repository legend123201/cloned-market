/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
// styled
import { OptionItem, OrderList, OrderListWrapper, Wrapper } from './styled';
// components
import SelectCustom from 'components/CustomField/SelectCustom';
import NoItemCircleCard from 'components/CustomUI/Card/NoItemCard/NoItemCircleCard';
import SkeletonOfferInItemDetailList from 'components/CustomUI/Skeleton/List/SkeletonOfferInItemDetailList';
import OrderInItemDetailCard from 'components/CustomUI/Card/OrderInItemDetailCard';
// models
import { NFT, OptionSelectCustom, OrderResponseAPI } from 'models';
// mui
import { Box, Stack, Typography } from '@mui/material';
// redux
import { useSelector } from 'react-redux';
import {
	selectListOrderSell,
	selectLoading as selectLoadingListOrderSell,
} from 'redux/slices/listOrderSellSlice';
import {
	selectListOrderOffer,
	selectLoading as selectLoadingListOrderOffer,
} from 'redux/slices/orderSlice';
import { selectNftItem } from 'redux/slices/nftItemByItemIdSlice';
// images
import ImageNoOffer from 'assets/icons/no-offers.webp';

const listOption: OptionSelectCustom<number>[] = [
	{ name: 'Listings', value: 0 },
	{ name: 'Offerings', value: 1 },
];

export interface IOfferingsAndLisingsProps {}

export default function OfferingsAndLisings(props: IOfferingsAndLisingsProps) {
	// useState
	const [currentOption, setCurrentOption] = useState<OptionSelectCustom<number>>(listOption[0]);

	// useSelector
	const item: NFT | null = useSelector(selectNftItem);
	const listOrderOffer: OrderResponseAPI[] = useSelector(selectListOrderOffer);
	const isLoadingListOrderOffer = useSelector(selectLoadingListOrderOffer);
	const listOrderSell: OrderResponseAPI[] = useSelector(selectListOrderSell);
	const isLoadingListOrderSell = useSelector(selectLoadingListOrderSell);

	// functions
	const handleChangeOption = (option: OptionSelectCustom<number> | null | undefined) => {
		if (option) {
			setCurrentOption(option);
		}
	};

	return (
		<Wrapper sx={{ mt: 4 }}>
			<Box sx={{ mb: 1 }}>
				<SelectCustom
					currentItem={currentOption}
					listItem={listOption}
					onChange={handleChangeOption}
					sx={{
						padding: '8px',
						width: 'fit-content',
						minWidth: '140px',
					}}
				/>
			</Box>

			<OrderListWrapper>
				{currentOption.value === 0 ? (
					<>
						{!isLoadingListOrderSell ? (
							<OrderList>
								{listOrderSell && listOrderSell.length > 0 ? (
									listOrderSell.map((orderId: any, index: number) => (
										<Box sx={{ mb: 1 }} key={index}>
											<OrderInItemDetailCard item={item} orderId={orderId} />
										</Box>
									))
								) : (
									<Box sx={{ mt: 2, p: 1 }}>
										<Typography variant="body1" sx={{ textAlign: 'center' }}>
											No listing yet!
										</Typography>
									</Box>
								)}
							</OrderList>
						) : (
							<SkeletonOfferInItemDetailList />
						)}
					</>
				) : (
					<>
						{!isLoadingListOrderOffer ? (
							<OrderList>
								{listOrderOffer && listOrderOffer.length > 0 ? (
									listOrderOffer.map((orderId: any, index: number) => (
										<Box sx={{ mb: 1, minWidth: '350px' }} key={index}>
											<OrderInItemDetailCard item={item} orderId={orderId} />
										</Box>
									))
								) : (
									<Box sx={{ mt: 2, p: 1 }}>
										<Typography variant="body1" sx={{ textAlign: 'center' }}>
											No offering yet!
										</Typography>
									</Box>
								)}
							</OrderList>
						) : (
							<SkeletonOfferInItemDetailList />
						)}
					</>
				)}
			</OrderListWrapper>
		</Wrapper>
	);
}
