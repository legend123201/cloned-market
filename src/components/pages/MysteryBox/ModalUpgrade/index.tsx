/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
// mui
import {
	Box,
	CircularProgress,
	Stack,
	Step,
	StepContent,
	StepLabel,
	Stepper,
	Typography,
} from '@mui/material';
// components
import ButtonGradient from 'components/CustomUI/ButtonGradient';
import Modal from 'components/CustomUI/Modal';
import FormUpgradeItem, { IFormUpgradeItemInputs } from 'components/Form/FormUpgradeItem';
import { selectAddress, selectChainId } from 'redux/slices/web3InfoSlice';
import { useDispatch, useSelector } from 'react-redux';
import { setConnectModal } from 'redux/slices/modalSlice';
import { ApproveTokenToWormholeInput, NFT, OptionSelectCustom } from 'models';
import { BoxAction } from 'redux/actions/OrderAction/boxAction';
import { erc20function, tokenErcFunction, wormholeContractFunction } from 'utils';
import { toast } from 'react-toastify';
import { BigNumber } from 'ethers';
import { CONTRACT } from '../../../../constants';
const { getBlanceOfToken1155 } = tokenErcFunction();
const { ApproveItemForUpgrade, ApproveTokenToWormhole, UpgradeItem } = BoxAction();
const { getUpgradeAmount, getUpgradeFee, checkCanUpgrade } = wormholeContractFunction();

interface StepStatus {
	isChecking: boolean;
	isExecuting: boolean;
	isCompleted: boolean;
}

const initialStepStatus: StepStatus = {
	isChecking: false,
	isExecuting: false,
	isCompleted: false,
};

const listItemToken: OptionSelectCustom<string>[] = [
	{ value: '0', name: 'Common NCA' },
	{ value: '1', name: 'Rare NCA' },
	{ value: '2', name: 'Epic NCA' },
	{ value: '3', name: 'Legend NCA' },
	{ value: '4', name: 'Mythic NCA' },
	{ value: '5', name: 'Unique NCA' },
	{ value: '6', name: 'None' },
];

export interface IModalUpgradeProps {
	isOpen: boolean;
	setIsOpen: Function;
	item: NFT;
	refetchApi: Function;
}

export default function ModalUpgrade({ isOpen, setIsOpen, item, refetchApi }: IModalUpgradeProps) {
	const dispatch = useDispatch();

	// useState
	const [ownedQuantity, setOwnedQuantity] = useState<number>(0);
	const [upgradeAmountNeeded, setUpgradeAmountNeeded] = useState<number>(0);
	const [upgradeFee, setUpgradeFee] = useState<number>(0);

	const [modalConfirm, setModalConfirm] = useState<boolean>(false);
	const [step1, setStep1] = useState<StepStatus>(initialStepStatus);
	const [step2, setStep2] = useState<StepStatus>(initialStepStatus);
	const [step3, setStep3] = useState<StepStatus>(initialStepStatus);
	const [activeStep, setActiveStep] = useState<number>(0);

	const [dataFormUpgradeItem, setDataFormUpgradeItem] = useState<IFormUpgradeItemInputs | null>(
		null
	);

	// useSelector
	const userAddress = useSelector(selectAddress);
	const chainId = useSelector(selectChainId);

	// vars
	const currentNFT = listItemToken[Number(item.itemTokenId)];
	const toNFT = listItemToken[Number(item.itemTokenId) + 1];

	// useEffect
	// Change Active Step
	useEffect(() => {
		if (step1.isCompleted) {
			setActiveStep(1);
			if (step2.isCompleted) {
				setActiveStep(2);
				if (step3.isCompleted) {
					setActiveStep(3);
				}
			}
		}
	}, [step1, step2, step3]);

	// handle toggle modal
	useEffect(() => {
		if (isOpen) {
			// Check steps
			// step1
			handleStep1(true); // isCheck = true
		} else {
			// reset step
			setActiveStep(0);
			setStep1({ ...step1, isCompleted: false });
			setStep2({ ...step2, isCompleted: false });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isOpen]);

	// getting amount and fee needed for upgrade
	useEffect(() => {
		(async () => {
			try {
				if (!userAddress || !item.collectionInfo) return;

				const ownedQuantityTemp: number = await getBlanceOfToken1155(
					userAddress,
					item.collectionInfo.collectionAddress,
					item.itemTokenId
				);
				setOwnedQuantity(ownedQuantityTemp);

				const upgradeAmountTemp = await getUpgradeAmount(item.chainId, item.itemTokenId);
				const upgradeUpgradeFeeTemp = await getUpgradeFee(item.chainId, item.itemTokenId);

				setUpgradeAmountNeeded(upgradeAmountTemp);
				setUpgradeFee(upgradeUpgradeFeeTemp);
			} catch (error) {
				console.log(error);
				toast.error('Some error occured when getting upgrade amount and upgrade fee!');
			}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userAddress, item]);

	// functions
	const handleUpgradeItem = async (data: IFormUpgradeItemInputs) => {
		console.log('upgrade data form', data);

		if (!userAddress || !item || !chainId) {
			console.log('Missing field when perchasing box!');
			return;
		}

		try {
			const totalUpgradeAmountNeeded: number = upgradeAmountNeeded * data.amount;
			const totalUpgradeFeeNeeded: number = upgradeFee * data.amount;

			// check balanceOf
			if (ownedQuantity < totalUpgradeAmountNeeded) {
				toast.error('Not enough item amount to upgrade!');
				return;
			}

			// check token coin
			const upgradeFeeToWei: BigNumber = await erc20function().changeTokenToWei(
				CONTRACT[item.chainId].MetaSpacecyToken,
				totalUpgradeFeeNeeded
			);

			const isEnough: boolean = await erc20function().checkBalance(
				CONTRACT[item.chainId].MetaSpacecyToken,
				userAddress,
				upgradeFeeToWei
			);

			if (!isEnough) {
				toast.error('Not enough MST token to purchase!');
				return;
			}

			// check can upgrade
			const canUpgrade: boolean = await checkCanUpgrade(
				item.chainId,
				userAddress,
				toNFT.value,
				data.amount
			);

			if (!canUpgrade) {
				toast.error('We currently can not upgrade your item, please try later!');
				return;
			}

			setDataFormUpgradeItem(data);
			setModalConfirm(true);
		} catch (error) {
			toast.error('Some error occur when upgrading item!');
			console.log(error);
		}
	};

	const handleStep1 = async (isCheck: boolean): Promise<void> => {
		if (!chainId || !userAddress) {
			console.log('Missing Field Step 1');
			return;
		}

		// setLoading state
		if (isCheck) {
			setStep1({ ...step1, isChecking: true });
		} else {
			setStep1({ ...step1, isExecuting: true });
		}

		// execute
		const data = {
			chainId,
			userAddress,
		};
		const isCompleted = await ApproveItemForUpgrade(data, isCheck);

		// setLoading state
		if (isCheck) {
			setStep1({ ...step1, isChecking: false });
		} else {
			setStep1({ ...step1, isExecuting: false });
		}

		// set completed state
		if (isCompleted) {
			setStep1({ ...step1, isCompleted: true });
		} else {
			setStep1({ ...step1, isCompleted: false });
		}
	};

	const handleStep2 = async (): Promise<void> => {
		if (!dataFormUpgradeItem || !userAddress || !chainId) {
			console.log('Missing Field Step 2');
			return;
		}

		// setLoading state
		setStep2({ ...step2, isExecuting: true });

		// execute
		const totalUpgradeFeeNeeded: number = upgradeFee * dataFormUpgradeItem.amount;
		const data: ApproveTokenToWormholeInput = {
			chainId,
			userAddress,
			totalPrice: totalUpgradeFeeNeeded,
		};
		const isCompleted = await ApproveTokenToWormhole(data);

		// setLoading state

		setStep2({ ...step2, isExecuting: false });

		// set completed state
		if (isCompleted) {
			setStep2({ ...step2, isCompleted: true });
		} else {
			setStep2({ ...step2, isCompleted: false });
		}
	};

	const handleStep3 = async (): Promise<void> => {
		if (!chainId || !userAddress) {
			console.log('Missing Field Step 3');
			return;
		}

		// setLoading state
		setStep3({ ...step3, isExecuting: true });

		// execute
		// dutch must be split_fee method
		const data = {
			chainId,
			userAddress,
			toTokenId: String(Number(item.itemTokenId) + 1),
		};

		const isCompleted = await UpgradeItem(data);

		// setLoading state
		setStep3({ ...step3, isExecuting: false });

		// set completed state
		if (isCompleted) {
			setStep3({ ...step3, isCompleted: true });
		} else {
			setStep3({ ...step3, isCompleted: false });
		}
	};

	const handleDone = () => {
		refetchApi();
	};

	return (
		<Box>
			<Modal
				onOpen={isOpen}
				mainHeader={`Upgrade item`}
				style={{ maxWidth: '450px', overflowY: 'auto' }}
				allowClose={true}
				onClose={() => {
					setIsOpen(false);
				}}
			>
				<Stack spacing={1}>
					<Stack direction="row" alignItems="center" justifyContent="space-between">
						<Typography variant="body1">Upgrade to</Typography>
						<Typography variant="body1">{toNFT.name}</Typography>
					</Stack>

					<Stack direction="row" alignItems="center" justifyContent="space-between">
						<Typography variant="body1">Amount MCA</Typography>
						<Typography variant="body1">
							{upgradeAmountNeeded} {currentNFT.name}
						</Typography>
					</Stack>

					<Stack direction="row" alignItems="center" justifyContent="space-between">
						<Typography variant="body1">Upgrade fee needed</Typography>
						<Typography variant="body1">{upgradeFee} MST</Typography>
					</Stack>
				</Stack>

				<FormUpgradeItem
					item={item}
					upgradeAmountNeeded={upgradeAmountNeeded}
					upgradeFee={upgradeFee}
					onSubmit={handleUpgradeItem}
				/>
			</Modal>

			<Modal
				onOpen={modalConfirm}
				onClose={() => {
					setModalConfirm(false);
				}}
				allowClose={
					!step1.isExecuting &&
					!step2.isExecuting &&
					!step3.isExecuting &&
					!step3.isCompleted
				}
				mainHeader={'Complete upgrading'}
				style={{ maxWidth: '600px', overflowY: 'auto' }}
			>
				<Stepper activeStep={activeStep} orientation="vertical" sx={{ mb: 2 }}>
					{/* ===================================================================== STEP 1 =====================================================================*/}
					<Step>
						<StepLabel
							optional={<Typography variant="caption">One-time fees</Typography>}
						>
							Approve MCA
						</StepLabel>
						<StepContent>
							<Typography>Approve MCA for smart contract</Typography>
							<Box sx={{ mb: 2 }}>
								<ButtonGradient
									onClick={() => {
										handleStep1(false);
									}}
									disabled={step1.isChecking || step1.isExecuting}
									sx={{ width: '180px' }}
								>
									{(step1.isChecking || step1.isExecuting) && (
										<CircularProgress
											sx={{ color: 'white', mr: 1 }}
											size={16}
										/>
									)}

									<Typography variant="button">
										{step1.isChecking
											? 'Checking...'
											: step1.isExecuting
											? 'Executing...'
											: 'Initialize'}
									</Typography>
								</ButtonGradient>
							</Box>
						</StepContent>
					</Step>

					{/* ===================================================================== STEP 2 =====================================================================*/}
					<Step>
						<StepLabel
							optional={<Typography variant="caption">Recurring fees</Typography>}
						>
							Approve token
						</StepLabel>
						<StepContent>
							<Typography>Approve upgrade fee for smart contract</Typography>
							<Box sx={{ mb: 2 }}>
								<ButtonGradient
									onClick={() => {
										handleStep2();
									}}
									disabled={step2.isChecking || step2.isExecuting}
									sx={{ width: '180px', mt: 1 }}
								>
									{(step2.isChecking || step2.isExecuting) && (
										<CircularProgress
											sx={{ color: 'white', mr: 1 }}
											size={16}
										/>
									)}

									<Typography variant="button">
										{step2.isChecking
											? 'Checking...'
											: step2.isExecuting
											? 'Executing...'
											: 'Approve'}
									</Typography>
								</ButtonGradient>
							</Box>
						</StepContent>
					</Step>

					{/* ===================================================================== STEP 3 =====================================================================*/}
					<Step>
						<StepLabel optional={<Typography variant="caption">No gas fee</Typography>}>
							Confirm upgrade
						</StepLabel>
						<StepContent>
							<Typography>Upgrade your items to higher level</Typography>
							<Box sx={{ mb: 2 }}>
								<ButtonGradient
									onClick={() => {
										handleStep3();
									}}
									disabled={step3.isChecking || step3.isExecuting}
									sx={{ width: '180px', mt: 1 }}
								>
									{(step3.isChecking || step3.isExecuting) && (
										<CircularProgress
											sx={{ color: 'white', mr: 1 }}
											size={16}
										/>
									)}

									<Typography variant="button">
										{step3.isChecking
											? 'Checking...'
											: step3.isExecuting
											? 'Executing...'
											: 'Confirm'}
									</Typography>
								</ButtonGradient>
							</Box>
						</StepContent>
					</Step>

					{/* ===================================================================== STEP 4 =====================================================================*/}
					<Step>
						<StepLabel optional={null}>Upgrade Successfully</StepLabel>
						<StepContent>
							<Typography>Your have received higher MCA(s)!</Typography>
							<Box sx={{ mb: 2 }}>
								<ButtonGradient onClick={handleDone} sx={{ width: '180px', mt: 1 }}>
									<Typography variant="button">Agree</Typography>
								</ButtonGradient>
							</Box>
						</StepContent>
					</Step>
				</Stepper>
			</Modal>
		</Box>
	);
}
