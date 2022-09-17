/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, CircularProgress, Typography, useTheme } from '@mui/material';
import ButtonGradient from 'components/CustomUI/ButtonGradient';
import { UserAddress } from 'components/pages/InfoAccount/InfoAccountUser/styled';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Slice
import {
	selectAddress,
	selectBalance,
	selectChainId,
	selectCurrentProvider,
} from 'redux/slices/web3InfoSlice';
import { setConnectModal } from 'redux/slices/modalSlice';
//
import { getWeb3Contract } from 'hooks';
import NftAuction from 'abis/MetaSpacecyAuction.json';
import IERC721 from 'abis/IERC721.json';
//
import { toast } from 'react-toastify';
import Modal from 'components/CustomUI/Modal';
//

export interface IButtonCreateAuctionProps {}

export interface StepStatus {
	isChecking: boolean;
	isExecuting: boolean;
	isCompleted: boolean;
}

const initialStepStatus: StepStatus = {
	isChecking: false,
	isExecuting: false,
	isCompleted: false,
};

export default function ButtonCreateAuction(props: IButtonCreateAuctionProps) {
	const dispatch = useDispatch();
	const theme = useTheme();

	// useState
	const [isCheckingBalance, setIsCheckingBalance] = useState<boolean>(false);

	const [modal, setModal] = useState<boolean>(false);
	const [step1, setStep1] = useState<StepStatus>(initialStepStatus);
	const [step2, setStep2] = useState<StepStatus>(initialStepStatus);
	const [activeStep, setActiveStep] = useState<number>(0);
	const [checked, setChecked] = useState<boolean>(false);

	//
	// useSelector
	const userAddress = useSelector(selectAddress);

	// useEffect
	// change Active Step

	//

	// Funcitons
	const handleCreateAuction = () => {
		if (!userAddress) {
			dispatch(setConnectModal(true));
			return;
		}

		try {
			if (!userAddress) {
				setModal(true);
			}
		} catch (error) {
			toast.error('some error when create auction');
			console.log(error);
		} finally {
			setIsCheckingBalance(false);
		}
	};
	//
	// handle Step 1
	const handleStep1 = async (isCheck: boolean): Promise<void> => {
		if (isCheck) {
			setStep1({ ...step1, isChecking: true });
		} else {
			setStep1({ ...step1, isExecuting: true });
		}
		// excute
		const NftContract = getWeb3Contract(IERC721.abi, 'ABCDE');
		const AuctionContract = getWeb3Contract(
			NftAuction.abi,
			'0x787FABd1Da62C9c99cA0c54111d430d3f033b7f9'
		);
	};
	//

	return (
		<>
			<ButtonGradient
				disabled={isCheckingBalance}
				onClick={() => {
					handleCreateAuction();
				}}
			>
				{isCheckingBalance ? (
					<CircularProgress sx={{ color: 'white', mr: 1 }} size={16} />
				) : (
					<></>
				)}

				<Typography variant="body1" noWrap>
					Create
				</Typography>
			</ButtonGradient>

			<Modal
				onOpen={modal}
				onClose={() => {
					setModal(false);
				}}
				allowClose={!step1.isExecuting && !step2.isExecuting && !step2.isCompleted}
				mainHeader={'Accepting create auction'}
				style={{ maxWidth: '450px', overflowY: 'auto' }}
			>
				<Box></Box>
			</Modal>
		</>
	);
}
