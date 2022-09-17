/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
// components
import Modal from 'components/CustomUI/Modal';
import NoItemCircleCard from 'components/CustomUI/Card/NoItemCard/NoItemCircleCard';
import SkeletonOfferInItemDetailList from 'components/CustomUI/Skeleton/List/SkeletonOfferInItemDetailList';
// redux
import { RootState } from 'redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { selectListOrderSell, selectLoading, resetAll } from 'redux/slices/listOrderSellSlice';
// actions
import { fetchListOrderSell } from 'redux/actions/listOrderSellAction';
// models
import { NFT } from 'models';
import { OrderList, OrderListWrapper } from './styled';
import { Box, Typography } from '@mui/material';
import OrderInItemDetailCard from '../../OrderInItemDetailCard';
// images
import ImageNoOffer from 'assets/icons/no-offers.webp';

export interface IModalBuyProps {
	item: NFT;
	isOpenModal: boolean;
	setIsOpenModal: Function;
}

export default function ModalBuy({ item, isOpenModal, setIsOpenModal }: IModalBuyProps) {
	const dispatch = useDispatch();

	// useSelector
	const listOrderSell = useSelector(selectListOrderSell);
	const isLoadingListOrderSell = useSelector(selectLoading);

	// useEffect
	// fetch list order sell
	useEffect(() => {
		if (isOpenModal) {
			dispatch(fetchListOrderSell(item._id, item.chainId, executeAfterFetchListOrderSell));
		}

		return () => {
			resetAll();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isOpenModal]);

	// functions
	const executeAfterFetchListOrderSell = (globalStateNewest: RootState) => {
		const { listOrderSell } = globalStateNewest;
		if (!listOrderSell.isSuccess) {
			toast.error('Can not fetch lising orders of this item!');
		}
	};

	return (
		<Modal
			onOpen={isOpenModal}
			mainHeader={`Comfirm checkout`}
			style={{ maxWidth: '600px', overflowY: 'auto' }}
			allowClose={true}
			onClose={() => {
				setIsOpenModal(false);
			}}
		>
			<OrderListWrapper>
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
			</OrderListWrapper>
		</Modal>
	);
}
