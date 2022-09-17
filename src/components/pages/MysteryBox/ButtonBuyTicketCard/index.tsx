/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import Modal from 'components/CustomUI/Modal';
import FormBuyTicketCard, { IFormBuyTicketCardInputs } from 'components/Form/FormBuyTicketCard';
import { Box, Typography } from '@mui/material';
import ButtonGradient from 'components/CustomUI/ButtonGradient';
import { ApproveTokenToWormholeInput, NFT } from 'models';
import { BoxAction } from 'redux/actions/OrderAction/boxAction';
import { selectAddress } from 'redux/slices/web3InfoSlice';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { erc20function, wormholeContractFunction } from 'utils';
import { CONTRACT } from '../../../../constants';
import { BigNumber } from 'ethers';

const { getTicketCardPrice } = wormholeContractFunction();
const { ApproveTokenToWormhole, BuyTicketCard } = BoxAction();

export interface IButtonBuyTicketCardProps {
	ticketCard: NFT;
	refetchApi: Function;
}

export default function ButtonBuyTicketCard({ ticketCard, refetchApi }: IButtonBuyTicketCardProps) {
	// useState
	const [modal, setModal] = useState<boolean>(false);
	const [ticketCardPrice, setTicketCardPrice] = useState<number>(0);

	// useSelector
	const userAddress = useSelector(selectAddress);

	// useEffect
	useEffect(() => {
		(async () => {
			try {
				const ticketCardPriceTemp = await getTicketCardPrice(ticketCard.chainId);
				setTicketCardPrice(ticketCardPriceTemp);
			} catch (error) {
				console.log(error);
				toast.error('Some error occurred while getting ticket card price!');
			}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleBuyTicketCard = async (data: IFormBuyTicketCardInputs) => {
		if (!userAddress) {
			console.log('Missing field when buy ticket card!');
			return;
		}

		try {
			// check balance
			const totalPay: number = ticketCardPrice * data.amount;
			const totalPayToWei: BigNumber = await erc20function().changeTokenToWei(
				CONTRACT[ticketCard.chainId].MetaSpacecyToken,
				totalPay
			);

			const isEnough: boolean = await erc20function().checkBalance(
				CONTRACT[ticketCard.chainId].MetaSpacecyToken,
				userAddress,
				totalPayToWei
			);

			if (!isEnough) {
				toast.error('Not enough MST token to purchase!');
				return;
			}

			// approve token coin
			const dataApprove: ApproveTokenToWormholeInput = {
				chainId: ticketCard.chainId,
				userAddress,
				totalPrice: totalPay,
			};
			await ApproveTokenToWormhole(dataApprove);

			// buy
			const dataBuy = {
				chainId: ticketCard.chainId,
				userAddress,
				amount: data.amount,
			};
			await BuyTicketCard(dataBuy);

			toast.success('Purchase ticket card successfully!');
			refetchApi();
		} catch (error) {
			console.log(error);
			toast.error('Some error occurred while staking ticketCard');
		}
	};

	return (
		<Box>
			<ButtonGradient
				sx={{ width: 'fit-content', mt: 5, padding: '10px 50px' }}
				onClick={() => {
					setModal(true);
				}}
			>
				<Typography variant="h6">Buy now</Typography>
			</ButtonGradient>

			<Modal
				onOpen={modal}
				mainHeader="Buy ticket card"
				style={{ maxWidth: '450px', overflowY: 'auto' }}
				allowClose={true}
				onClose={() => {
					setModal(false);
				}}
			>
				<FormBuyTicketCard ticketCard={ticketCard} onSubmit={handleBuyTicketCard} />
			</Modal>
		</Box>
	);
}
