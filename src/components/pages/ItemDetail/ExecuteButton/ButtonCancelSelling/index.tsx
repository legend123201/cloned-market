/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
// mui
import { CircularProgress, Stack, Typography } from '@mui/material';
// components
import ButtonGradient from 'components/CustomUI/ButtonGradient';
import Modal from 'components/CustomUI/Modal';
// constants
import { ITEM_STATUS } from '../../../../../constants';
// redux
import { useDispatch, useSelector } from 'react-redux';
import { selectNftItem, selectLoading } from 'redux/slices/nftItemByItemIdSlice';
import { selectAddress, selectChainId } from 'redux/slices/web3InfoSlice';
// actions
import { cancelOrder } from 'redux/actions/OrderAction/cancelOrderAction';
// models
import { CancelOrderInput, NFT, OrderResponseAPI } from 'models';
// utils
import { compareDate, timestampToDate } from 'utils';

export interface IButtonCancelSellingProps {
	personalOrderSell: OrderResponseAPI | null;
	loadingPersonalOrderSell: boolean;
	refetchApi: VoidFunction;
}

export default function ButtonCancelSelling({
	personalOrderSell,
	loadingPersonalOrderSell,
	refetchApi,
}: IButtonCancelSellingProps) {
	const dispatch = useDispatch();

	// useState
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [modalOrderExpired, setModalOrderExpired] = useState<boolean>(false);

	// useSelector
	const item: NFT | null = useSelector(selectNftItem);
	const isLoadingItem = useSelector(selectLoading);
	const userAddress = useSelector(selectAddress);
	const chainId = useSelector(selectChainId);

	// functions
	const isQualifiedToCancelSelling = () => {
		if (
			!isLoadingItem &&
			item &&
			item.status === ITEM_STATUS.BUY_NOW &&
			userAddress &&
			!loadingPersonalOrderSell &&
			personalOrderSell &&
			compareDate(new Date(), timestampToDate(parseInt(personalOrderSell.expirationTime))) < 0
		) {
			return true;
		}
		return false;
	};

	const handleCancelSelling = () => {
		if (!item || !personalOrderSell || !userAddress || !chainId) {
			console.log('Missing Field!');
			return;
		}

		// this condition met when user go to this page when listing is not expired and click a button when listing is expired
		if (
			compareDate(new Date(), timestampToDate(parseInt(personalOrderSell.expirationTime))) > 0
		) {
			setModalOrderExpired(true);
			return;
		}

		setIsLoading(true);

		const cancelOrderInput: CancelOrderInput = {
			orderMaker: personalOrderSell,
			makerAddress: userAddress,
			chainId,
			setLoading: setIsLoading,
			refetchApi,
			itemId: item._id,
			collectionId: item.collectionId,
		};

		dispatch(cancelOrder(cancelOrderInput));
	};

	return (
		<>
			{isQualifiedToCancelSelling() && (
				<ButtonGradient
					onClick={handleCancelSelling}
					disabled={isLoading}
					sx={{ width: '180px' }}
				>
					{isLoading && <CircularProgress sx={{ color: 'white', mr: 1 }} size={16} />}

					<Typography variant="body1">Cancel listing</Typography>
				</ButtonGradient>
			)}

			{modalOrderExpired && (
				<Modal
					onOpen={modalOrderExpired}
					mainHeader="Your item listing is expired!"
					onClose={() => {
						window.location.reload();
					}}
				>
					<Typography variant="h6" sx={{ width: '100%', textAlign: 'center' }}>
						We have updated your item status, take a look now.
					</Typography>

					<ButtonGradient
						sx={{
							paddingLeft: '30px',
							paddingRight: '30px',
							maxWidth: '150px',
							margin: '15px auto',
						}}
						onClick={() => {
							window.location.reload();
						}}
					>
						<Stack direction="row" alignItems="center">
							<Typography variant="button">Agree</Typography>
						</Stack>
					</ButtonGradient>
				</Modal>
			)}
		</>
	);
}
