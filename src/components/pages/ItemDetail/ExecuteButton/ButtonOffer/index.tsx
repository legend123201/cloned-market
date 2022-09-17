/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
// redux
import { useDispatch, useSelector } from 'react-redux';
import { selectListTokenPayment } from 'redux/slices/tokenPaymentSlice';
import { selectNftItem, selectLoading } from 'redux/slices/nftItemByItemIdSlice';
import { selectAddress, selectChainId, selectCurrentProvider } from 'redux/slices/web3InfoSlice';
import { setConnectModal } from 'redux/slices/modalSlice';
// actions
import { CreateOrderForOfferAction } from 'redux/actions/OrderAction/createOrderForOfferAction';
// mui
import {
	Box,
	Typography,
	CircularProgress,
	Stepper,
	Step,
	StepLabel,
	StepContent,
} from '@mui/material';
// components
import Modal from 'components/CustomUI/Modal';
import ButtonGradient from 'components/CustomUI/ButtonGradient';
import FormOffer, { IFormOfferInputs } from 'components/Form/FormOffer';
// models
import {
	ApproveItemPriceAndServiceFeeForCreateOfferInput,
	HashOrderAndSignForCreateOfferInput,
	NFT,
	OrderResponseAPI,
	TokenPayment,
} from 'models';
// utils
import { BigNumber } from 'ethers';
import { dateToTimestamp, erc20function } from 'utils';
// constants
import { ORDER_CONFIGURATION } from '../../../../../constants';
// images
import CardIcon from 'assets/icons/card.webp';

// order actions
const { ApproveItemPriceAndServiceFee, HashOrderAndSign } = CreateOrderForOfferAction();

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

export interface IButtonOfferProps {
	personalOffer: OrderResponseAPI | null;
	loadingPersonalOffer: boolean;
}

export default function ButtonOffer({ personalOffer, loadingPersonalOffer }: IButtonOfferProps) {
	const dispatch = useDispatch();

	// useState
	const [dataForOffer, setDataForOffer] = useState<IFormOfferInputs | null>(null);

	const [modalOffer, setModalOffer] = useState(false);
	const [modalConfirm, setModalConfirm] = useState(false);

	const [step1, setStep1] = useState<StepStatus>(initialStepStatus);
	const [step2, setStep2] = useState<StepStatus>(initialStepStatus);
	const [activeStep, setActiveStep] = useState<number>(0);

	// useSelector
	const item: NFT | null = useSelector(selectNftItem);
	const isLoadingItem = useSelector(selectLoading);
	const chainId = useSelector(selectChainId);
	const userAddress = useSelector(selectAddress);
	const web3Info = useSelector(selectCurrentProvider);
	const listTokenPayment: TokenPayment[] = useSelector(selectListTokenPayment);

	// useEffect
	// Change Active Step
	useEffect(() => {
		if (step1.isCompleted) {
			setActiveStep(1);
			if (step2.isCompleted) {
				setActiveStep(2);
			}
		}
	}, [step1, step2]);

	// handle toggle modal confirm
	useEffect(() => {
		if (modalConfirm) {
			// Check steps
			// no step need to check
		} else {
			// reset step
			setActiveStep(0);
			setStep1({ ...step1, isCompleted: false });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [modalConfirm]);

	// functions
	const isQualifiedToOffer = () => {
		if (
			!isLoadingItem &&
			item &&
			!loadingPersonalOffer &&
			!personalOffer &&
			listTokenPayment.length > 0
		) {
			return true;
		}
		return false;
	};

	const handleOffer = async (data: IFormOfferInputs) => {
		if (!userAddress) {
			dispatch(setConnectModal(true));
			return;
		}

		try {
			if (!item || !item.collectionInfo || !userAddress || !chainId) {
				console.log('Missing field!');
				return;
			}

			// CHECK BALANCE
			// offer must be SPLIT_FEE_METHOD and FIXED_PRICE and can not with NATIVE COIN
			// if feeMethod = split fee
			const protocolFee: number =
				(data.offerPrice * ORDER_CONFIGURATION.OFFER_MAKER_PROTOCOL_FEE) / 10000;

			const totalPriceAndFee: number = protocolFee + data.offerPrice;

			const totalPriceAndFeeToWei: BigNumber = await erc20function().changeTokenToWei(
				data.paymentToken,
				totalPriceAndFee
			);

			console.log('Offerer will pay: ', totalPriceAndFee);

			const isEnough = await erc20function().checkBalance(
				data.paymentToken,
				userAddress,
				totalPriceAndFeeToWei
			);

			if (!isEnough) {
				toast.error('Split fee: Not enough Token to purchase!');
				return;
			}

			setDataForOffer(data);
			setModalConfirm(true);
		} catch (error) {
			console.log(error);
			toast.error('Some error occur when offering item!');
		}
	};

	const handleStep1 = async (): Promise<void> => {
		if (!chainId || !userAddress || !dataForOffer) {
			console.log('Missing Field Step 1');
			return;
		}

		// setLoading state
		setStep1({ ...step1, isExecuting: true });

		// execute
		const data: ApproveItemPriceAndServiceFeeForCreateOfferInput = {
			offerPrice: dataForOffer.offerPrice,
			paymentToken: dataForOffer.paymentToken,
			userAddress,
			chainId,
		};
		const isCompleted = await ApproveItemPriceAndServiceFee(data);

		// setLoading state
		setStep1({ ...step1, isExecuting: false });

		// set completed state
		if (isCompleted) {
			setStep1({ ...step1, isCompleted: true });
		} else {
			setStep1({ ...step1, isCompleted: false });
		}
	};

	const handleStep2 = async (): Promise<void> => {
		if (
			!userAddress ||
			!chainId ||
			!web3Info ||
			!dataForOffer ||
			!item ||
			!item.collectionInfo
		) {
			console.log('Missing Field Step 2');
			return;
		}

		// setLoading state
		setStep2({ ...step2, isExecuting: true });

		// execute
		const data: HashOrderAndSignForCreateOfferInput = {
			chainId,
			userAddress,
			paymentToken: dataForOffer.paymentToken,
			offerPrice: dataForOffer.offerPrice,
			quantity: dataForOffer.quantity,
			listingTime: String(dateToTimestamp(new Date())),
			expirationTime: String(dataForOffer.expirationTime),
			itemTokenId: item.itemTokenId,
			itemStandard: item.itemStandard,
			collectionAddress: item.collectionInfo.collectionAddress,
			collectionOwner: item.collectionInfo.userAddress,
			royalties: item.collectionInfo.royalties,
			web3: web3Info,
			itemId: item._id,
			collectionId: item.collectionInfo._id,
		};
		const isCompleted: boolean = await HashOrderAndSign(data);

		// setLoading state
		setStep2({ ...step2, isExecuting: false });

		// set completed state
		if (isCompleted) {
			setStep2({ ...step2, isCompleted: true });
		} else {
			setStep2({ ...step2, isCompleted: false });
		}
	};

	const handleDone = () => {
		window.location.reload();
	};

	return (
		<>
			{isQualifiedToOffer() && (
				<ButtonGradient onClick={() => setModalOffer(true)} sx={{ width: '150px' }}>
					<img src={CardIcon} alt="card icon" height={16} width={22} />

					<Typography variant="body1" sx={{ ml: 1 }} noWrap>
						Offer
					</Typography>
				</ButtonGradient>
			)}

			<Modal
				onOpen={modalOffer}
				allowClose={true}
				onClose={() => {
					setModalOffer(false);
				}}
				mainHeader="Offer"
				style={{ maxWidth: '450px' }}
			>
				<FormOffer onSubmit={handleOffer} />
			</Modal>

			<Modal
				onOpen={modalConfirm}
				onClose={() => {
					setModalConfirm(false);
				}}
				allowClose={!step1.isExecuting && !step2.isExecuting && !step2.isCompleted}
				mainHeader={'Complete offering'}
				style={{ maxWidth: '600px', overflowY: 'auto' }}
			>
				<Stepper activeStep={activeStep} orientation="vertical" sx={{ mb: 2 }}>
					{/* ===================================================================== STEP 1 =====================================================================*/}
					<Step>
						<StepLabel
							optional={<Typography variant="caption">Recurring fees</Typography>}
						>
							Approve token
						</StepLabel>
						<StepContent>
							<Typography>
								Recurring fees are incurred whenever doing actions on blockchain.
							</Typography>
							<Box sx={{ mb: 2 }}>
								<ButtonGradient
									onClick={() => {
										handleStep1();
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
											: 'Approve'}
									</Typography>
								</ButtonGradient>
							</Box>
						</StepContent>
					</Step>

					{/* ===================================================================== STEP 2 =====================================================================*/}
					<Step>
						<StepLabel optional={<Typography variant="caption">No gas fee</Typography>}>
							Confirm offer
						</StepLabel>
						<StepContent>
							<Typography>
								Accept request of sign type data and put your offer to this item .
							</Typography>
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
											: 'Confirm'}
									</Typography>
								</ButtonGradient>
							</Box>
						</StepContent>
					</Step>

					{/* ===================================================================== STEP 3 =====================================================================*/}
					<Step>
						<StepLabel optional={null}>Offer Successfully</StepLabel>
						<StepContent>
							<Typography>Your offer is up!</Typography>
							<Box sx={{ mb: 2 }}>
								<ButtonGradient onClick={handleDone} sx={{ width: '180px', mt: 1 }}>
									<Typography variant="button">Agree</Typography>
								</ButtonGradient>
							</Box>
						</StepContent>
					</Step>
				</Stepper>
			</Modal>
		</>
	);
}
