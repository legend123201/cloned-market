/* eslint-disable @typescript-eslint/no-unused-vars */
import {
	Box,
	Checkbox,
	CircularProgress,
	Grid,
	Link,
	Stack,
	Step,
	StepContent,
	StepLabel,
	Stepper,
	Typography,
	useTheme,
} from '@mui/material';
import { ImageBlockchain, PriceStyle } from 'components/CustomUI/Card/NFTItemCard/styled';
import React, { Fragment, useEffect, useState } from 'react';
// image
import IconTwitterWhite from 'assets/icons/twitter-white.webp';
import IconFavoriteThinWhite from 'assets/icons/favorite-thin-white.webp';
import OfferWhite from 'assets/icons/offer-white.webp';
import GiftWhite from 'assets/icons/gift-white.svg';

import IconTwitterBlack from 'assets/icons/twitter-black.webp';
import IconFavoriteThinBlack from 'assets/icons/favorite-thin-black.webp';
import ButtonGradient from 'components/CustomUI/ButtonGradient';
import {
	BottomLine,
	BoxContainCountDown,
	ErrorMessage,
	GridBoxBackGround,
	NoticeMessage,
} from './sytled';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuctionDetail } from 'redux/slices/auctionDetailByAuctionIdSlice';
import CountDown from 'components/CustomUI/Card/NFTItemCardInAuction/CountDown';
import { NETWORKINFO, ORDER_CONFIGURATION, RELATED_URLS } from '../../../../constants';
//styled

import { getWeb3Contract } from 'hooks';
import NftAuction from 'abis/MetaSpacecyAuction.json';
import { BigNumber } from 'ethers';
import Modal from 'components/CustomUI/Modal';
import FieldInput from 'components/CustomField/FieldInput';

import {
	selectAddress,
	selectBalance,
	selectChainId,
	selectCurrentProvider,
} from 'redux/slices/web3InfoSlice';

import { setConnectModal } from 'redux/slices/modalSlice';
import { compareDate, erc20function, timestampToDate } from 'utils';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { AuctionInfo } from 'models/Auction';
import AuctionDetail from 'pages/AuctionDetail';
import { isNativeToken } from 'utils';
import { NULL_ADDRESS } from '../../../../constants';

export interface IAppProps {}

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

const initialStartValueInput = (auctionDetail: AuctionInfo | null): number => {
	if (!auctionDetail) return 0;

	const { highestBid, minPrice, bidIncreasePercent } = auctionDetail;
	let result: number;
	if (highestBid) {
		result = highestBid + (highestBid * bidIncreasePercent) / 100;
	} else {
		result = minPrice + (minPrice * bidIncreasePercent) / 100;
	}
	return Number(result.toFixed(4));
};

export interface IFormModalPlaceBid {
	amount: number;
}

export default function CountDownAndPlaceBid(props: IAppProps) {
	const dispatch = useDispatch();
	const theme = useTheme();
	//
	const [isCheckingBalance, setIsCheckingBalance] = useState<boolean>(false);
	const [modalOrderExpired, setModalOrderExpired] = useState<boolean>(false);
	const [modal, setModal] = useState(false);
	const [step1, setStep1] = useState<StepStatus>(initialStepStatus);
	const [step2, setStep2] = useState<StepStatus>(initialStepStatus);
	const [activeStep, setActiveStep] = useState<number>(0);
	const [disableButton, setDisableButton] = useState<boolean>(true);
	const [bidValue, setBidValue] = useState<number>();
	const [decimalTokenPayment, setDecimalTokenPayment] = useState<number>();
	const [disableInputBid, setDisableInputBid] = useState<boolean>(false);
	const [checked, setChecked] = useState<boolean>(true);
	const [disableButtonPlaceBid, setDisableButtonPlaceBid] = useState<boolean>(false);
	const [openStep, setOpenStep] = useState<boolean>(false);

	//
	const auctionDetail = useSelector(selectAuctionDetail);
	const userAddress = useSelector(selectAddress);

	const [startValue, setStartValue] = useState<number>(initialStartValueInput(auctionDetail));
	// Waiting

	const [claimExecuting, setClaimExecuting] = useState<boolean>(false);

	// ABIS
	const balanceState = useSelector(selectBalance);
	const web3Info = useSelector(selectCurrentProvider);
	const [balanceToken, setBalanceToken] = useState<number>();
	//
	// REACT HOOK FORM
	const schema = yup
		.object({
			amount: yup
				.number()
				.integer()
				.min(1)
				.transform((cv, ov) => {
					// handle case not enter a number throw error: NaN cast from ""
					return ov === '' ? undefined : cv;
				}),
		})
		.required();

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors, isSubmitting },
		reset,
	} = useForm<IFormModalPlaceBid>({
		resolver: yupResolver(schema),
	});
	//

	const onSubmit = () => {
		setDisableInputBid(true);
		setOpenStep(true);
	};

	const renderCountdown = () => {
		if (auctionDetail) {
			return (
				<Box sx={{ fontSize: '1.5rem', fontWeight: '600' }}>
					<CountDown
						timeEnd={auctionDetail.endTime * 1000}
						className="CountDownBar"
						executeZero={() => {
							setDisableButtonPlaceBid(true);
						}}
					/>
				</Box>
			);
		} else {
			<Typography sx={{ fontSize: '1.5rem', fontWeight: '600' }}>0</Typography>;
		}
	};

	const renderBlockchain = () => {
		if (auctionDetail) {
			return <Typography>{NETWORKINFO[auctionDetail.chainId].name}</Typography>;
		} else {
			<Typography></Typography>;
		}
	};

	// Check balance wallet
	const handlePlacebid1 = async () => {
		if (auctionDetail && userAddress) {
			try {
				const getDecimal: number = await erc20function().getDecimal(
					auctionDetail.paymentToken
				);
				const weiAmount: BigNumber = await erc20function().getBalanceOfUser(
					userAddress,
					auctionDetail.paymentToken
				);
				const tokenAmount: string = await erc20function().changeWeiToToken(
					auctionDetail.paymentToken,
					weiAmount
				);
				// console.log('tokenAmount', tokenAmount);
				// console.log('weiAmount', weiAmount);
				// console.log('getDecimal', getDecimal);
				setDecimalTokenPayment(getDecimal);
				setBalanceToken(Number(tokenAmount));
				setModal(true);
				if (!tokenAmount) {
					toast.error('Protocol fee: Not enough token to purchase!');
					setIsCheckingBalance(false);
					return;
				}
			} catch (error) {
				console.log('error check balance', error);
			}
		} else {
			console.log('dont have data auction detail');
		}
	};

	// setStep
	useEffect(() => {
		if (step1.isCompleted) {
			setActiveStep(1);
			if (step2.isCompleted) {
				setActiveStep(2);
			}
		}
	}, [step1, step2]);

	// Handle check balance
	const handleCheckBalance = (e: any) => {
		if (auctionDetail && balanceToken) {
			const minBid =
				auctionDetail.highestBid !== 0
					? auctionDetail.highestBid +
					  (auctionDetail.highestBid * auctionDetail.bidIncreasePercent) / 100
					: auctionDetail.minPrice +
					  (auctionDetail.minPrice * auctionDetail.bidIncreasePercent) / 100;

			if (e.target.value >= minBid && balanceToken > e.target.value) {
				setBidValue(e.target.value);
				setStartValue(e.target.value);
				setDisableButton(false);
			} else {
				setStartValue(e.target.value);
				setDisableButton(true);
			}
		}
	};

	// Handle Step

	// Handle Step 1 approve token
	const handleStep1 = async (isCheck: boolean) => {
		if (!userAddress || !auctionDetail || !bidValue || !decimalTokenPayment) {
			setDisableInputBid(false);

			return;
		}

		// setLoading state
		setStep1({ ...step1, isExecuting: true });

		try {
			await erc20function().increaseAmountAllowance(
				auctionDetail.paymentToken,
				BigNumber.from(String(bidValue * 10 ** decimalTokenPayment)),
				userAddress,
				auctionDetail.infoINO.addressINO
			);

			// setLoading state
			setStep1({ ...step1, isExecuting: false });

			// set completed state

			setStep1({ ...step1, isCompleted: true });
		} catch (error) {
			setStep1({ ...step1, isCompleted: false });
			console.log('error approve token', error);
		}
	};

	// Handle step 2
	const handleStep2 = async () => {
		if (!userAddress || !auctionDetail || !bidValue || !decimalTokenPayment) {
			return;
		}

		// setLoading state
		setStep2({ ...step2, isExecuting: true });

		const AuctionContract = getWeb3Contract(NftAuction.abi, auctionDetail.infoINO.addressINO);
		const checkNativeToken = isNativeToken(auctionDetail.paymentToken);

		try {
			if (checkNativeToken) {
				const dataPlaceBid = await AuctionContract.methods
					.makeBid(
						BigNumber.from(String(bidValue * 10 ** decimalTokenPayment)),
						auctionDetail.collectionInfo.collectionAddress,
						auctionDetail.items[0].itemTokenId,
						auctionDetail.paymentToken,
						NULL_ADDRESS,
						0
					)
					.send({
						from: userAddress,
						value: BigNumber.from(String(bidValue * 10 ** decimalTokenPayment)),
					});
			} else {
				const dataPlaceBid = await AuctionContract.methods
					.makeBid(
						auctionDetail.collectionInfo.collectionAddress,
						auctionDetail.items[0].itemTokenId,
						auctionDetail.paymentToken,
						BigNumber.from(String(bidValue * 10 ** decimalTokenPayment))
					)
					.send({ from: userAddress, value: 0 });
			}

			// setLoading state
			setStep2({ ...step2, isExecuting: false });
			// set completed state
			setStep2({ ...step2, isCompleted: true });
		} catch (error) {
			setStep2({ ...step2, isCompleted: false });
			console.log('error approve token', error);
		}
	};
	//
	const handleChangeCheckBox = (event: React.ChangeEvent<HTMLInputElement>) => {
		setChecked(event.target.checked);
	};
	// Handle claim Bid
	const handleClaimBid = async () => {
		if (auctionDetail) {
			const AuctionContract = getWeb3Contract(
				NftAuction.abi,
				auctionDetail.infoINO.addressINO
			);
			setClaimExecuting(true);
			try {
				const dataPlaceBid = await AuctionContract.methods
					.settleAuction(
						auctionDetail.collectionInfo.collectionAddress,
						auctionDetail.items[0].itemTokenId
					)
					.send({ from: userAddress, value: 0 });
				console.log('dataPlaceBid', dataPlaceBid);
				setClaimExecuting(false);
			} catch (error) {
				console.log('some error when claim reward', error);
				setClaimExecuting(false);
			}
		}
	};
	// console.log('setDisableButtonPlaceBid', setDisableButtonPlaceBid);
	// Starting Auction
	const handleRenderButtonBid = () => {
		if (auctionDetail) {
			if (auctionDetail.status === 'live') {
				return (
					<ButtonGradient
						disabled={
							userAddress === auctionDetail?.seller ||
							!userAddress ||
							disableButtonPlaceBid
						}
						onClick={() => {
							handlePlacebid1();
						}}
						sx={{ height: '60px', fontSize: '1.5rem', fontWeight: '600' }}
					>
						<Stack direction="row" alignItems="center">
							<img
								src={OfferWhite}
								alt=""
								style={{ width: '32px', height: '100%', marginRight: '12px' }}
							/>{' '}
							<Typography variant="h4" sx={{ fontWeight: '600' }}>
								Place Bid
							</Typography>
						</Stack>
					</ButtonGradient>
				);
			}
			if (userAddress === auctionDetail.seller && !auctionDetail.isLive) {
				return (
					<ButtonGradient
						disabled={
							userAddress !== auctionDetail.seller || !userAddress || claimExecuting
						}
						onClick={() => {
							handleClaimBid();
						}}
						sx={{ height: '60px', fontSize: '1.5rem', fontWeight: '600' }}
					>
						<Stack direction="row" alignItems="center">
							{claimExecuting && (
								<CircularProgress sx={{ color: 'white', mr: 1 }} size={16} />
							)}
							<img
								src={GiftWhite}
								alt=""
								style={{ width: '32px', height: '100%', marginRight: '12px' }}
							/>{' '}
							<Typography variant="h4" sx={{ fontWeight: '600' }}>
								Claim
							</Typography>
						</Stack>
					</ButtonGradient>
				);
			} else {
				return (
					<ButtonGradient
						disabled={true}
						onClick={() => {
							handlePlacebid1();
						}}
						sx={{ height: '60px', fontSize: '1.5rem', fontWeight: '600' }}
					>
						<Stack direction="row" alignItems="center">
							<img
								src={OfferWhite}
								alt=""
								style={{ width: '32px', height: '100%', marginRight: '12px' }}
							/>{' '}
							<Typography variant="h4" sx={{ fontWeight: '600' }}>
								Completed
							</Typography>
						</Stack>
					</ButtonGradient>
				);
			}
		}
	};

	//
	// console.log('model', modal);
	// console.log('step1', step1);
	// console.log('step2', step2);
	// console.log('balanceState', balanceState);
	// console.log('userAddress', userAddress);
	// console.log('auctionDetail', auctionDetail);
	// console.log('userAddress', userAddress);
	return (
		<>
			<Fragment>
				<BoxContainCountDown>
					<Grid container spacing={4}>
						<Grid item xs>
							<GridBoxBackGround>
								<Typography sx={{ opacity: '0.6' }}>
									{auctionDetail?.highestBid === 0 ? 'Min Price' : 'Current Bid'}
								</Typography>
								<Typography sx={{ fontSize: '1.5rem', fontWeight: '600' }}>
									{auctionDetail?.highestBid === 0
										? auctionDetail.minPrice
										: auctionDetail?.highestBid}{' '}
									{''} {auctionDetail?.priceType.toUpperCase()}
								</Typography>
							</GridBoxBackGround>
						</Grid>
						<Grid item xs>
							<GridBoxBackGround>
								<Typography sx={{ opacity: '0.6' }}>Countdown:</Typography>
								{renderCountdown()}
							</GridBoxBackGround>
						</Grid>
					</Grid>
					<Box marginTop={4}>{handleRenderButtonBid()}</Box>
				</BoxContainCountDown>
				{/* <Box marginTop={5}>
					<Box>
						<Stack direction="row" justifyContent="space-between">
							<Typography>Favortites:</Typography>
							<Typography>12</Typography>
						</Stack>
						<Stack direction="row" justifyContent="space-between">
							<Typography>Blockchain:</Typography>
							{renderBlockchain()}
						</Stack>
					</Box>
				</Box> */}
				<Modal
					onOpen={modal}
					onClose={() => {
						setModal(false);
					}}
					allowClose={
						!step1.isExecuting &&
						!step1.isChecking &&
						!step2.isExecuting &&
						!step2.isChecking
					}
					mainHeader={'Place Bid'}
					style={{ maxWidth: '450px', overflowY: 'auto' }}
				>
					<Stack direction="column" spacing={2}>
						<Stack direction="row" justifyContent="space-between">
							<Typography>
								{auctionDetail?.highestBid === 0 ? 'Min Price' : 'Highest Bid'}
							</Typography>
							<Typography>
								{auctionDetail?.highestBid === 0
									? auctionDetail?.minPrice
									: auctionDetail?.highestBid}{' '}
								{auctionDetail?.priceType.toUpperCase()}
							</Typography>
						</Stack>
						<Stack direction="row" justifyContent="space-between">
							<Typography>Bid Increase Percent</Typography>
							<Typography>
								{auctionDetail ? auctionDetail.bidIncreasePercent : 0}%
							</Typography>
						</Stack>
						<form onSubmit={handleSubmit(onSubmit)}>
							<FieldInput
								readOnly={disableInputBid}
								id="amount"
								type="number"
								placeholder="Amount Token"
								onChange={(e: any) => {
									handleCheckBalance(e);
								}}
								// value={startValue}
								// registerHookForm={{ ...register('amount') }}
							/>
							<NoticeMessage>
								Bid price have to more than {initialStartValueInput(auctionDetail)}{' '}
								{auctionDetail?.priceType.toUpperCase()}
							</NoticeMessage>
							{errors.amount?.message && (
								<ErrorMessage>{errors.amount?.message}</ErrorMessage>
							)}
							{step1.isExecuting || step1.isCompleted || openStep ? (
								<></>
							) : (
								<Stack
									direction="row"
									alignItems="center"
									sx={{ marginLeft: '-10px', mt: 2 }}
								>
									<Checkbox
										checked={checked}
										aria-checked="false"
										onChange={handleChangeCheckBox}
										required
									/>

									<Typography variant="body2" component="span">
										I agree to MetaSpacecy
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
									</Typography>
								</Stack>
							)}

							<Box sx={{ margin: '16px 0px !important' }}>
								{step1.isExecuting || step1.isCompleted || openStep ? (
									<BottomLine></BottomLine>
								) : (
									<ButtonGradient
										type="submit"
										disabled={
											disableButton ||
											step1.isExecuting ||
											step1.isCompleted ||
											!checked ||
											openStep
										}
									>
										<Typography>Confirm</Typography>
									</ButtonGradient>
								)}
							</Box>
						</form>
					</Stack>
					{openStep && (
						<Stepper
							activeStep={activeStep}
							orientation="vertical"
							sx={{ mb: 2, transition: 'all 0.5s ease' }}
						>
							<Step>
								<StepLabel
									optional={
										<Typography variant="caption">Recurring fees.</Typography>
									}
								>
									Approve Token.
								</StepLabel>

								<StepContent>
									<ButtonGradient
										disabled={step1.isCompleted || step1.isExecuting}
										onClick={() => {
											handleStep1(false);
										}}
										sx={{ width: '180px', height: '40px', mt: 1 }}
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
												: step1.isCompleted
												? 'Done'
												: 'Confirm'}
										</Typography>
									</ButtonGradient>
								</StepContent>
							</Step>
							<Step>
								<StepLabel
									optional={
										<Typography variant="caption">Recurring fees.</Typography>
									}
								>
									Completing Accept Bid.
								</StepLabel>
								<StepContent>
									<ButtonGradient
										disabled={!step1.isCompleted || step2.isExecuting}
										onClick={() => {
											handleStep2();
										}}
										sx={{ width: '180px', height: '40px', mt: 1 }}
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
												: 'Place Bid'}
										</Typography>
									</ButtonGradient>
								</StepContent>
							</Step>
							<Step>
								<StepLabel>Accept Bid Successfully</StepLabel>
								<StepContent>
									<ButtonGradient
										disabled={!step2.isCompleted}
										onClick={() => {
											window.location.reload();
										}}
										sx={{ width: '180px', height: '40px', mt: 1 }}
									>
										<Typography>View Item</Typography>
									</ButtonGradient>
								</StepContent>
							</Step>
						</Stepper>
					)}
				</Modal>
			</Fragment>
		</>
	);
}
