/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
// mui
import {
	Box,
	Checkbox,
	CircularProgress,
	Link,
	Stack,
	Step,
	StepContent,
	StepLabel,
	Stepper,
	Typography,
	useTheme,
} from '@mui/material';
// components
import ButtonGradient from 'components/CustomUI/ButtonGradient';
import Modal from 'components/CustomUI/Modal';
// models
import {
	ApproveItemPriceAndServiceFeeForBuyInput,
	ExecuteAtomicMatchForBuyInput,
	NFT,
	OrderResponseAPI,
} from 'models';
// utils
import { formatEther } from '@ethersproject/units';
import { BigNumber } from 'ethers';
import { erc20function, isNativeToken, compareDate, timestampToDate, formatNumber } from 'utils';
// constants
import { ORDER_CONFIGURATION, ITEM_STATUS, RELATED_URLS } from '../../../../../constants';
// image
import CardIcon from 'assets/icons/card.webp';
// redux
import { useDispatch, useSelector } from 'react-redux';
import {
	selectAddress,
	selectBalance,
	selectChainId,
	selectCurrentProvider,
} from 'redux/slices/web3InfoSlice';
import { setConnectModal } from 'redux/slices/modalSlice';
// actions
import { AcceptOrderForSellAction } from 'redux/actions/OrderAction/acceptOrderForSellAction';
import { CalculateFinalPrice } from 'redux/actions/OrderAction/common';
// order actions
const { ApproveItemPriceAndServiceFee, ExecuteAtomicMatch } = AcceptOrderForSellAction();

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

export interface IButtonBuyProps {
	item: NFT | null;
	orderSell: OrderResponseAPI;
	currentOrderPrice: number;
}

export default function ButtonBuy({ item, orderSell, currentOrderPrice }: IButtonBuyProps) {
	const dispatch = useDispatch();
	const theme = useTheme();

	// useState
	const [isCheckingBalance, setIsCheckingBalance] = useState<boolean>(false);
	const [isOrderExpired, setIsOrderExpired] = useState<boolean>(false);
	const [modalOrderExpired, setModalOrderExpired] = useState<boolean>(false);

	const [modal, setModal] = useState<boolean>(false);
	const [step1, setStep1] = useState<StepStatus>(initialStepStatus);
	const [step2, setStep2] = useState<StepStatus>(initialStepStatus);
	const [activeStep, setActiveStep] = useState<number>(0);
	const [checked, setChecked] = useState<boolean>(false);

	// useSelector
	const chainId = useSelector(selectChainId);
	const userAddress = useSelector(selectAddress);
	const web3Info = useSelector(selectCurrentProvider);
	const balanceState = useSelector(selectBalance);

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

	// check if the order is expired
	useEffect(() => {
		if (compareDate(new Date(), timestampToDate(parseInt(orderSell.expirationTime))) > 0) {
			setIsOrderExpired(true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// functions
	const isQualifiedToBuy = (): boolean => {
		if (
			item &&
			userAddress &&
			orderSell.maker !== userAddress &&
			compareDate(new Date(), timestampToDate(parseInt(orderSell.listingTime))) > 0
		) {
			return true;
		} else {
			return false;
		}
	};

	const handleChangeCheckBox = (event: React.ChangeEvent<HTMLInputElement>) => {
		setChecked(event.target.checked);
	};

	const handleBuyItem = async () => {
		if (!userAddress) {
			dispatch(setConnectModal(true));
			return;
		}

		try {
			if (!userAddress || !chainId || !web3Info) {
				console.log('Missing field!');
				return;
			}

			// this condition met when user go to this page when listing is not expired and click a button when listing is expired
			if (compareDate(new Date(), timestampToDate(parseInt(orderSell.expirationTime))) > 0) {
				setModalOrderExpired(true);
				return;
			}

			setIsCheckingBalance(true);

			// CHECK BALANCE
			// calculate item price
			let itemPrice: string | BigNumber;
			if (orderSell.saleKind === ORDER_CONFIGURATION.DUTCH_AUCTION) {
				// DUTCH_AUCTION
				itemPrice = await CalculateFinalPrice(orderSell, chainId);
			} else {
				// FIXED_PRICE
				itemPrice = orderSell.basePrice;
			}
			console.log('itemPrice', itemPrice);

			// check feeMethod
			if (orderSell.feeMethod === ORDER_CONFIGURATION.PROTOCOL_FEE_METHOD) {
				// if feeMethod = protocol fee => pay with flatfrom token
				const isEnough: boolean = await erc20function().checkBalance(
					orderSell.paymentToken,
					userAddress,
					BigNumber.from(itemPrice)
				);

				if (!isEnough) {
					toast.error('Protocol fee: Not enough token to purchase!');
					setIsCheckingBalance(false);
					return;
				}
			} else {
				// if feeMethod = split fee
				const protocolFee: BigNumber = BigNumber.from(String(itemPrice)).mul(
					BigNumber.from(String(orderSell.takerProtocolFee)).div(BigNumber.from(10000))
				);

				const totalPriceAndFee: BigNumber = BigNumber.from(String(protocolFee)).add(
					String(itemPrice)
				);

				if (isNativeToken(orderSell.paymentToken)) {
					// if native coin
					const totalPriceAndFeeToETH: number = Number(
						formatEther(totalPriceAndFee.toString())
					);

					if (balanceState < totalPriceAndFeeToETH) {
						console.log('Your balance', balanceState);
						console.log('You need to have', totalPriceAndFeeToETH);

						toast.error('Split fee: Your balance not enough to purchase!');
						setIsCheckingBalance(false);
						return;
					}
				} else {
					// if not native coin
					const isEnough = await erc20function().checkBalance(
						orderSell.paymentToken,
						userAddress,
						totalPriceAndFee
					);
					if (!isEnough) {
						toast.error('Split fee: Not enough Token to purchase!');
						setIsCheckingBalance(false);
						return;
					}
				}
			}

			setModal(true);
		} catch (error) {
			console.log(error);
			toast.error('Some error occur when buying item!');
		} finally {
			setIsCheckingBalance(false);
		}
	};

	const handleStep1 = async (): Promise<void> => {
		if (!chainId || !userAddress) {
			console.log('Missing Field Step 1');
			return;
		}

		// setLoading state
		setStep1({ ...step1, isExecuting: true });

		// execute
		const data: ApproveItemPriceAndServiceFeeForBuyInput = {
			orderSell,
			chainId,
			userAddress,
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
		if (!userAddress || !chainId || !item || !item.collectionInfo || !web3Info) {
			console.log('Missing Field Step 2');
			return;
		}

		// setLoading state
		setStep2({ ...step2, isExecuting: true });

		// execute
		const data: ExecuteAtomicMatchForBuyInput = {
			chainId,
			userAddress,
			orderSell,
			web3: web3Info,
			itemTokenId: item.itemTokenId,
			itemStandard: item.itemStandard,
			collectionId: item.collectionInfo._id,
		};
		const isCompleted: boolean = await ExecuteAtomicMatch(data);

		console.log('isCompleted xxx', isCompleted);

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
			{isQualifiedToBuy() && (
				<ButtonGradient
					disabled={isCheckingBalance || isOrderExpired}
					onClick={() => {
						handleBuyItem();
					}}
				>
					{isCheckingBalance ? (
						<CircularProgress sx={{ color: 'white', mr: 1 }} size={16} />
					) : (
						<></>
						// <img src={CardIcon} alt="card icon" height={16} width={22} />
					)}

					<Typography variant="body1" noWrap>
						{isOrderExpired ? 'Expired' : 'Buy'}
					</Typography>
				</ButtonGradient>
			)}

			{item && (
				<Modal
					onOpen={modal}
					mainHeader="Checkout"
					style={{ maxWidth: '450px', overflowY: 'auto' }}
					allowClose={!step1.isExecuting && !step2.isExecuting && !step2.isCompleted}
					onClose={() => {
						setModal(false);
					}}
				>
					<Box sx={{ p: '0 2rem 2rem 2rem' }}>
						<Box>
							<Typography
								variant="caption"
								sx={{ color: theme.palette.text.special }}
							>
								{item.collectionInfo?.collectionName}
							</Typography>
							<Typography variant="h5">{item.itemName}</Typography>
						</Box>

						<Stack spacing={1} sx={{ mt: 2 }}>
							<Stack direction="row" justifyContent="space-between">
								<Typography variant="body2">Quantity:</Typography>
								<Typography variant="body2">{orderSell.quantity}</Typography>
							</Stack>

							<Stack direction="row" justifyContent="space-between">
								<Typography variant="body2">Price:</Typography>
								<Typography variant="body2">
									{formatNumber(currentOrderPrice, 0, 4)}{' '}
									{orderSell.tokenSymbol?.toUpperCase()}
								</Typography>
							</Stack>

							<Stack direction="row" justifyContent="space-between">
								<Typography variant="body2">
									Service fee ( {Number(orderSell.takerProtocolFee) / 100}% ):
								</Typography>
								<Typography variant="body2">
									{formatNumber(
										(Number(currentOrderPrice) *
											Number(orderSell.takerProtocolFee)) /
											10000,
										0,
										6
									)}{' '}
									{orderSell.tokenSymbol?.toUpperCase()}
								</Typography>
							</Stack>
						</Stack>

						<Stack
							direction="row"
							alignItems="center"
							sx={{ marginLeft: '-10px', mt: 2 }}
						>
							<Checkbox
								checked={checked}
								aria-checked="false"
								onChange={handleChangeCheckBox}
							/>
							<Typography variant="body2" component="span">
								I agree to MetaSpacecy
							</Typography>
							<Link
								variant="body2"
								sx={{
									ml: 0.5,
									color: theme.palette.text.special,
									cursor: 'pointer',
									'&:hover': {
										textDecoration: 'underline !important',
									},
								}}
								href={RELATED_URLS.termsOfService}
								target="_blank"
							>
								Terms of Service
							</Link>
						</Stack>

						<Box height="1px" sx={{ borderBottom: '1px solid' }} />

						<Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
							<Typography variant="body2">Total:</Typography>
							<Typography variant="body2">
								{Number(currentOrderPrice) +
									(Number(currentOrderPrice) *
										Number(orderSell.takerProtocolFee)) /
										10000}{' '}
								{orderSell.tokenSymbol?.toUpperCase()}
							</Typography>
						</Stack>
						{checked && (
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
												disabled={
													step1.isChecking ||
													step1.isExecuting ||
													!checked
												}
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
												disabled={
													step2.isChecking ||
													step2.isExecuting ||
													!checked
												}
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
										<Typography>View your new item now!</Typography>
										<Box sx={{ mb: 2 }}>
											<ButtonGradient
												onClick={handleDone}
												sx={{ width: '180px', mt: 1 }}
											>
												<Typography variant="button">View item</Typography>
											</ButtonGradient>
										</Box>
									</StepContent>
								</Step>
							</Stepper>
						)}
					</Box>
				</Modal>
			)}

			{modalOrderExpired && (
				<Modal
					onOpen={modalOrderExpired}
					mainHeader="This item listing is expired!"
					onClose={() => {
						window.location.reload();
					}}
				>
					<Typography variant="h6" sx={{ width: '100%', textAlign: 'center' }}>
						You can make a offer to buy the item.
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
