/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useInView } from 'react-cool-inview';
import { toast } from 'react-toastify';
// mui
import {
	Box,
	CircularProgress,
	Grid,
	IconButton,
	Stack,
	Step,
	StepContent,
	StepLabel,
	Stepper,
	Typography,
} from '@mui/material';
// apis
import nftsApi from 'apis/nftsApi';
// models
import { ApproveTokenToWormholeInput, BuyBoxInput, NFT, Response } from 'models';
// redux
import { useDispatch, useSelector } from 'react-redux';
import { selectAddress, selectChainId } from 'redux/slices/web3InfoSlice';
// actions
import { BoxAction } from 'redux/actions/OrderAction/boxAction';

// styled
import {
	ButtonCustom,
	ErrorContent,
	ItemCardStyle,
	MainImage,
	MediaErrorContent,
	ItemWrapperIGO,
	TextWrapperIGO,
	GridWrapperIGO,
	GridContainer,
	OwnedAmount,
	ItemContent,
} from './styled';
import { ButtonBlue } from 'pages/Home/styled';
// mui
import RefreshIcon from '@mui/icons-material/Refresh';
// components
import LazyImageCustom from 'components/CustomUI/LazyImages/LazyImageCustom';
import SkeletonBoxCard from 'components/CustomUI/Skeleton/Item/Mysterybox/SkeletonBoxCard';
import Modal from 'components/CustomUI/Modal';
import FormBuyBox2, { IFormBuyBox2Inputs } from 'components/Form/FormBuyBox2';
import ButtonGradient from 'components/CustomUI/ButtonGradient';
// utils
import {
	compressImage,
	erc20function,
	sliceString,
	wormholeContractFunction,
	tokenErcFunction,
} from 'utils';
import { BigNumber } from 'ethers';
// constants
import { CONTRACT, NETWORKINFO } from '../../../../../constants';
// hooks
import { useIsMounted } from 'hooks';
import ModalUnpack from 'components/pages/MysteryBox/ModalUnpack';
import { PATH_ITEM } from 'routes/path';
import { useNavigate } from 'react-router-dom';

const { getBlanceOfToken1155 } = tokenErcFunction();
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

export const contentHeight: number = 270;
export interface IBoxCardProps {
	itemId: any;
}

export default function BoxCard({ itemId }: IBoxCardProps) {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	// hooks
	const isMounted = useIsMounted();

	// useState
	const [boxAmount, setBoxAmount] = useState<number>(0);
	const [boxPrice, setBoxPrice] = useState<number>(0);
	const [ownedQuantity, setOwnedQuantity] = useState<number>(0);
	const [item, setItem] = useState<NFT>();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isSuccess, setIsSuccess] = useState<boolean>(false);
	const [refresh, setRefresh] = useState<boolean>(true);
	const [rendered, setRendered] = useState<boolean>(true);
	const [dataFormBuyBox, setDataFormBuyBox] = useState<IFormBuyBox2Inputs | null>(null);

	const [modal, setModal] = useState<boolean>(false);
	const [modalConfirm, setModalConfirm] = useState<boolean>(false);
	const [isOpenModalUnpack, setIsOpenModalUnpack] = useState<boolean>(false);

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

	// fetch item detail
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

	// Get Price
	useEffect(() => {
		(async () => {
			if (!item || !chainId) return;

			try {
				const price: number = await getBoxPrice(item.chainId, item.itemTokenId);
				setBoxPrice(price);
			} catch (error) {
				toast.error('Some error occured when getting remaining box amount!');
			}
		})();
	}, [chainId, item, refresh]);

	// get owned quantity
	useEffect(() => {
		(async () => {
			try {
				if (!userAddress || !item || !item.collectionInfo) return;

				const balance: number = await getBlanceOfToken1155(
					userAddress,
					item.collectionInfo.collectionAddress,
					item.itemTokenId
				);

				setOwnedQuantity(balance);
			} catch (error) {
				console.log(error);
				toast.error('Some error occurred while getting owned quantity!');
			}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userAddress, item]);

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

	const isQualifiedToUnpack = (): boolean => {
		if (item && userAddress && item.isBox && ownedQuantity > 0) {
			return true;
		} else {
			return false;
		}
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
		<Box ref={observe} height="100%">
			{!isLoading ? (
				!isSuccess ? (
					<ItemCardStyle sx={{ position: 'relative' }}>
						<Box className="fake-height" sx={{ p: 2 }}>
							<Box sx={{ paddingBottom: '100%' }}></Box>
							<Box sx={{ height: contentHeight, pt: 1 }}></Box>
						</Box>

						<ErrorContent sx={{ position: 'absolute', top: 0, left: 0 }}>
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
						<ItemWrapperIGO>
							{/* onClick={() => navigate(`${PATH_ITEM.detail}/${item._id}`)} */}
							<Box sx={{ p: 2 }}>
								{/* Main image */}
								<MainImage>
									{rendered && inView && (
										<LazyImageCustom
											src={compressImage(item.itemMedia, 480, 'best')}
											alt="item"
											wrapperPosition="absolute"
											imgStyle={{ borderRadius: '8px' }}
											type="progress"
											errorComponent={ErrorMediaRender()}
										/>
									)}
								</MainImage>

								{/* Owned quantity */}
								<OwnedAmount>
									<Typography variant="body1">x{ownedQuantity}</Typography>
								</OwnedAmount>

								{/* Item content */}
								<ItemContent sx={{ height: contentHeight }}>
									<TextWrapperIGO
										onClick={() => navigate(`${PATH_ITEM.detail}/${item._id}`)}
									>
										{/* Item name */}
										<Typography
											mt={2}
											variant="h5"
											sx={{ fontWeight: '600' }}
											textAlign="center"
										>
											{item.itemName}
										</Typography>

										{/* Item description */}
										<Box
											sx={{ flex: '1 1 0%' }}
											mt={2}
											onClick={() =>
												navigate(`${PATH_ITEM.detail}/${item._id}`)
											}
										>
											<Typography variant="body2">
												{sliceString(item.description, 68)}
											</Typography>
										</Box>

										{/* Item info on blockchain */}
										<GridWrapperIGO
											onClick={() =>
												navigate(`${PATH_ITEM.detail}/${item._id}`)
											}
										>
											<Stack direction="row">
												<Typography
													sx={{ flex: '1 1 0%', opacity: '0.8' }}
													variant="body2"
												>
													Total Item(s)
												</Typography>
												<Typography variant="body2">{boxAmount}</Typography>
											</Stack>
											<Stack direction="row">
												<Typography
													sx={{ flex: '1 1 0%', opacity: '0.8' }}
													variant="body2"
												>
													Price
												</Typography>
												<Typography variant="body2">
													{boxPrice} MST
												</Typography>
											</Stack>
											<Stack direction="row">
												<Typography
													sx={{ flex: '1 1 0%', opacity: '0.8' }}
													variant="body2"
												>
													Network
												</Typography>
												<Typography variant="body2">
													{NETWORKINFO[item.chainId].name}
												</Typography>
											</Stack>
										</GridWrapperIGO>
									</TextWrapperIGO>
									{/* Button excution */}
									<Box
										mt={2}
										sx={{
											display: 'grid',
											gridTemplateColumns: 'repeat(2, 1fr)',
											gap: '10%',
										}}
									>
										<ButtonGradient
											onClick={() => {
												setModal(true);
											}}
										>
											Buy now
										</ButtonGradient>

										<ButtonBlue
											sx={{ width: '100%' }}
											className={isQualifiedToUnpack() ? '' : 'disabled'}
											onClick={() => {
												if (isQualifiedToUnpack()) {
													setIsOpenModalUnpack(true);
												}
											}}
										>
											<Typography sx={{ fontSize: '14px' }}>
												Open Now
											</Typography>
										</ButtonBlue>
									</Box>
								</ItemContent>
							</Box>
						</ItemWrapperIGO>

						<ModalUnpack
							isOpen={isOpenModalUnpack}
							setIsOpen={setIsOpenModalUnpack}
							item={item}
							refetchApi={() => {
								window.location.reload();
							}}
						/>

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
										<Typography>Buy box automatic with contract.</Typography>
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
										<Typography>Your purchase was successful</Typography>
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
