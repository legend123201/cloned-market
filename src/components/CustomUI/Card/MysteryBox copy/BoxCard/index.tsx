/* eslint-disable @typescript-eslint/no-unused-vars */
import {
	Box,
	CircularProgress,
	IconButton,
	Step,
	StepContent,
	StepLabel,
	Stepper,
	Typography,
} from '@mui/material';
import nftsApi from 'apis/nftsApi';
import { ApproveTokenToWormholeInput, BuyBoxInput, NFT, Response } from 'models';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAddress, selectChainId } from 'redux/slices/web3InfoSlice';
import { ButtonCustom, ErrorContent, ItemCardStyle, MainImage, MediaErrorContent } from './styled';
import { useInView } from 'react-cool-inview';
import RefreshIcon from '@mui/icons-material/Refresh';
import LazyImageCustom from 'components/CustomUI/LazyImages/LazyImageCustom';
import { compressImage, erc20function } from 'utils';
import SkeletonBoxCard from 'components/CustomUI/Skeleton/Item/Mysterybox/SkeletonBoxCard';
import Modal from 'components/CustomUI/Modal';
import FormBuyBox2, { IFormBuyBox2Inputs } from 'components/Form/FormBuyBox2';
import { BigNumber } from 'ethers';
import { CONTRACT } from '../../../../../constants';
import { toast } from 'react-toastify';
import { BoxAction } from 'redux/actions/OrderAction/boxAction';
import { wormholeContractFunction } from 'utils/contract/wormholeContractFunction';
import ButtonGradient from 'components/CustomUI/ButtonGradient';
import { setConnectModal } from 'redux/slices/modalSlice';
import { useIsMounted } from 'hooks';
const { BuyBox, ApproveTokenToWormhole } = BoxAction();
const { getRemainingBoxAmount, getBoxPrice } = wormholeContractFunction();

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
export interface IBoxCardProps {
	itemId: any;
}

export default function BoxCard({ itemId }: IBoxCardProps) {
	const dispatch = useDispatch();

	// hooks
	const isMounted = useIsMounted();

	// useState
	const [boxAmount, setBoxAmount] = useState<number>(0);
	const [item, setItem] = useState<NFT>();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isSuccess, setIsSuccess] = useState<boolean>(false);
	const [refresh, setRefresh] = useState<boolean>(true);
	const [rendered, setRendered] = useState<boolean>(true);
	const [dataFormBuyBox, setDataFormBuyBox] = useState<IFormBuyBox2Inputs | null>(null);

	const [modal, setModal] = useState<boolean>(false);
	const [modalConfirm, setModalConfirm] = useState<boolean>(false);

	const [step1, setStep1] = useState<StepStatus>(initialStepStatus);
	const [step2, setStep2] = useState<StepStatus>(initialStepStatus);
	const [activeStep, setActiveStep] = useState<number>(0);

	// useSelector
	const userAddress = useSelector(selectAddress);
	const chainId = useSelector(selectChainId);

	// vars
	const {
		observe,
		inView,
		scrollDirection: { vertical, horizontal },
	} = useInView({
		threshold: 0.25, // Default is 0
		onEnter: ({ scrollDirection, entry, observe, unobserve }) => {
			// console.log('in view');
			// Triggered when the target enters the viewport
		},
		onLeave: ({ scrollDirection, entry, observe, unobserve }) => {
			// console.log('out view');
			// Triggered when the target leaves the viewport
		},
	});

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

	// handle toggle modal
	useEffect(() => {
		if (modal) {
			// Check steps
			// no step need to check
		} else {
			// reset step
			setActiveStep(0);
			setStep1({ ...step1, isCompleted: false });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [modal]);

	useEffect((): any => {
		if (!itemId) return;

		(async () => {
			setIsLoading(true);

			try {
				const res: Response<NFT> = await nftsApi.getLessNftInfoByTokenId({
					itemId: itemId._id ?? itemId,
					userAddress:
						userAddress ?? '0x00B91B2F8aFE87FCDc2b3fFA9ee2278cd1E4DDf8'.toLowerCase(),
				});

				if (isMounted()) {
					setItem(res.data);
					setIsSuccess(true);
				}
			} catch (error) {
				setIsSuccess(false);
				console.log(error);
			} finally {
				if (isMounted()) {
					setIsLoading(false);
				}
			}
		})();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [itemId, userAddress, refresh]);

	// get box remaining amount
	useEffect(() => {
		(async () => {
			if (!item || !chainId) return;

			try {
				const remainingBoxAmount: number = await getRemainingBoxAmount(
					chainId,
					item.itemTokenId
				);

				setBoxAmount(remainingBoxAmount);
			} catch (error) {
				toast.error('Some error occured when getting remaining box amount!');
			}
		})();
	}, [chainId, item, refresh]);

	// functions
	const handleBuyBox = async (data: IFormBuyBox2Inputs) => {
		console.log(data);

		if (!userAddress || !item || !chainId) {
			console.log('Missing field when perchasing box!');
			return;
		}

		try {
			// get box price
			let boxPrice: number = await getBoxPrice(item.chainId, item.itemTokenId);

			// check balance
			const totalPrice: number = boxPrice * data.amount;

			console.log('totalPrice', totalPrice);

			const totalPriceToWei: BigNumber = await erc20function().changeTokenToWei(
				CONTRACT[chainId].MetaSpacecyToken,
				totalPrice
			);

			console.log('totalPriceToWei', totalPriceToWei);

			const isEnough: boolean = await erc20function().checkBalance(
				CONTRACT[chainId].MetaSpacecyToken,
				userAddress,
				totalPriceToWei
			);

			if (!isEnough) {
				toast.error('Not enough token to purchase!');
				return;
			}

			setDataFormBuyBox(data);
			setModalConfirm(true);
		} catch (error) {
			toast.error('Some error occur when perchasing box!');
			console.log(error);
		}
	};

	const handleStep1 = async (): Promise<void> => {
		if (!chainId || !userAddress || !dataFormBuyBox || !item) {
			console.log('Missing Field Step 1');
			return;
		}

		// setLoading state
		setStep1({ ...step1, isExecuting: true });

		// execute
		// get box price
		let boxPrice: number = await getBoxPrice(item.chainId, item.itemTokenId);

		const data: ApproveTokenToWormholeInput = {
			chainId,
			userAddress,
			totalPrice: dataFormBuyBox.amount * boxPrice,
		};
		const isCompleted = await ApproveTokenToWormhole(data);

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
		if (!userAddress || !chainId || !item || !item.collectionInfo || !dataFormBuyBox) {
			console.log('Missing Field Step 2');
			return;
		}

		// setLoading state
		setStep2({ ...step2, isExecuting: true });

		// execute
		const data: BuyBoxInput = {
			chainId,
			userAddress,
			amount: dataFormBuyBox.amount,
			optionId: item.itemTokenId,
			itemId: item._id,
			totalPriceToWei: BigNumber.from(0),
			callback: () => {},
		};

		const isCompleted: boolean = await BuyBox(data);

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

	const ErrorMediaRender = () => {
		return (
			<MediaErrorContent>
				<Typography variant="h6">Error</Typography>
				<Typography variant="body2">
					Something went wrong when load this media. Please refresh
				</Typography>
				<IconButton
					aria-label="refresh"
					onClick={(e) => {
						e.stopPropagation();
						setRendered(false);
						setTimeout(() => {
							setRendered(true);
						}, 1);
					}}
				>
					<RefreshIcon />
				</IconButton>
			</MediaErrorContent>
		);
	};

	return (
		<Box ref={observe}>
			{!isLoading ? (
				!isSuccess ? (
					<ItemCardStyle sx={{ height: 300 }}>
						<ErrorContent>
							<Typography variant="h6">Error</Typography>
							<Typography variant="body2">
								Something went wrong when load this NFT. Please refresh
							</Typography>
							<IconButton
								aria-label="refresh"
								onClick={(e) => {
									e.stopPropagation();
									setRefresh(!refresh);
								}}
							>
								<RefreshIcon />
							</IconButton>
						</ErrorContent>
					</ItemCardStyle>
				) : item ? (
					<ItemCardStyle>
						<MainImage>
							{rendered && inView && (
								<LazyImageCustom
									src={compressImage(item.itemMedia, 480, 'best')}
									alt="item"
									wrapperPosition="absolute"
									imgStyle={{ borderRadius: '10px' }}
									type="progress"
									errorComponent={ErrorMediaRender()}
								/>
							)}
						</MainImage>

						<Typography
							variant="h4"
							sx={{ mt: 2, textAlign: 'center', fontStyle: 'italic' }}
						>
							{item.itemName}
						</Typography>

						<ButtonCustom>
							<Box className="not-hovering">
								<Typography variant="body1">{boxAmount} boxes remain</Typography>
							</Box>
							<Box
								className="hovering"
								onClick={() => {
									if (!userAddress) {
										dispatch(setConnectModal(true));
										return;
									}

									setModal(true);
								}}
							>
								<Typography variant="body1">Buy now</Typography>
							</Box>
						</ButtonCustom>

						<Modal
							onOpen={modal}
							mainHeader={`Buy Box`}
							style={{ maxWidth: '450px', overflowY: 'auto' }}
							allowClose={true}
							onClose={() => {
								setModal(false);
							}}
						>
							<FormBuyBox2 box={item} onSubmit={handleBuyBox} />
						</Modal>

						<Modal
							onOpen={modalConfirm}
							mainHeader={`Confirm payment`}
							style={{ maxWidth: '450px', overflowY: 'auto' }}
							allowClose={
								!step1.isExecuting && !step2.isExecuting && !step2.isCompleted
							}
							onClose={() => {
								setModalConfirm(false);
							}}
						>
							<Stepper activeStep={activeStep} orientation="vertical" sx={{ mb: 2 }}>
								{/* ===================================================================== STEP 1 =====================================================================*/}
								<Step>
									<StepLabel
										optional={
											<Typography variant="caption">Service fees</Typography>
										}
									>
										Approve token
									</StepLabel>
									<StepContent>
										<Typography>
											Recurring fees are incurred whenever doing actions on
											blockchain.
										</Typography>
										<Box sx={{ mb: 2, mt: 1 }}>
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
									<StepLabel
										optional={
											<Typography variant="caption">
												Recurring fees
											</Typography>
										}
									>
										Confirm payment
									</StepLabel>
									<StepContent>
										<Typography>Buy item automatic with contract.</Typography>
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
									<StepLabel optional={null}>Purchase Successfully</StepLabel>
									<StepContent>
										<Typography></Typography>
										<Box sx={{ mb: 2 }}>
											<ButtonGradient
												onClick={handleDone}
												sx={{ width: '180px', mt: 1 }}
											>
												<Typography variant="button">Comfirm</Typography>
											</ButtonGradient>
										</Box>
									</StepContent>
								</Step>
							</Stepper>
						</Modal>
					</ItemCardStyle>
				) : (
					<></>
				)
			) : (
				<SkeletonBoxCard />
			)}
		</Box>
	);
}
