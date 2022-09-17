/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import Modal from 'components/CustomUI/Modal';
import FormStakeItem, { IFormStakeItemInputs } from 'components/Form/FormStakeItem';
import { Box, Typography } from '@mui/material';
import ButtonGradient from 'components/CustomUI/ButtonGradient';
import { NFT } from 'models';
import { BoxAction } from 'redux/actions/OrderAction/boxAction';
import { selectAddress } from 'redux/slices/web3InfoSlice';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { stakeContractFunction } from 'utils';
const { checkCanStake } = stakeContractFunction();

const { StakeItem, ApproveItemForStake } = BoxAction();

export interface IModalStakeProps {
	isOpen: boolean;
	setIsOpen: Function;
	item: NFT;
	refetchApi: Function;
}

export default function ModalStake({ isOpen, setIsOpen, item, refetchApi }: IModalStakeProps) {
	// useSelector
	const userAddress = useSelector(selectAddress);

	const handleStakeItem = async (data: IFormStakeItemInputs) => {
		if (!userAddress) {
			console.log('Missing field when staking item!');
			return;
		}

		try {
			const dataApproveWalletNft: any = {
				chainId: item.chainId,
				userAddress,
			};

			await ApproveItemForStake(dataApproveWalletNft, false);

			const canStake = await checkCanStake(
				item.chainId,
				data.optionStake,
				item.itemTokenId,
				data.amount
			);

			if (!canStake) {
				toast.error('The reward pool no longer has enough reward to pay for this staking!');
				return;
			}

			const dataStake = {
				chainId: item.chainId,
				userAddress,
				amount: data.amount,
				optionStake: data.optionStake,
				itemTokenId: item.itemTokenId,
			};

			await StakeItem(dataStake);
			refetchApi();
		} catch (error) {
			console.log(error);
			toast.error('Some error occurred while staking item');
		}
	};

	return (
		<Box>
			<Modal
				onOpen={isOpen}
				mainHeader="Staking Option"
				style={{ maxWidth: '450px' }}
				allowClose={true}
				onClose={() => {
					setIsOpen(false);
				}}
			>
				<FormStakeItem currentItem={item} onSubmit={handleStakeItem} />
			</Modal>
		</Box>
	);
}
