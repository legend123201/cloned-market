/* eslint-disable @typescript-eslint/no-unused-vars */
import {
	Box,
	CircularProgress,
	Container,
	Link,
	Step,
	StepContent,
	StepLabel,
	Stepper,
	Typography,
} from '@mui/material';
import auctionApi from 'apis/auctionApi';
import collectionApi from 'apis/collectionApi';
import FormCreateAuction, { IFormCreateAuctionInputs } from 'components/Form/FormCreateAuction';
import { SocketContext } from 'contexts/SocketContext';
import {
	ApproveAuction,
	ApproveWalletNftAssetInput,
	Collection,
	FilterCollection,
	Response,
} from 'models';
import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchListCollectionsByOwnerOrCreatorItems } from 'redux/actions/collectionAction';
import { fetchListPaymentTokenByChainId } from 'redux/actions/tokenPaymentAction';
import { resetAll, selectInitialState } from 'redux/slices/collectionSlice';
import { selectAddress, selectChainId, selectCurrentProvider } from 'redux/slices/web3InfoSlice';
import { RootState } from 'redux/store';
import { getWeb3Contract } from 'hooks';
import NftAuction from 'abis/MetaSpacecyAuction.json';
import { ApproveWalletNftAsset } from 'redux/actions/OrderAction/common';
import { useNavigate } from 'react-router-dom';

import { INO, INODetail } from 'models/Auction';
import { BigNumber } from 'ethers';
import Modal from 'components/CustomUI/Modal';
import { PATH_AUCTION } from '../../routes/path';
import ButtonGradient from 'components/CustomUI/ButtonGradient';
import { erc20function } from 'utils';
import { ApproveAuctionFunction } from 'redux/actions/OrderAction/createAuction';

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
export interface INewData {
	inoId: string;
	listItemId: string;
	minPrice: string;
	paymentToken: string;
	startTime: number;
	endTime: number;
	nameINO: string;
	descriptionINO: string;
	bidIncreasePercent: number;
	listItemTokenId: string;
}

export default function CreateAuction() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	// useState
	const [modalNotHaveCollection, setModalNotHaveCollection] = useState(false);
	const [listCollectionTemp, setListCollectionTemp] = useState<Collection[]>([]);

	const [modal, setModal] = useState(false);
	const [step1, setStep1] = useState<StepStatus>(initialStepStatus);
	const [step2, setStep2] = useState<StepStatus>(initialStepStatus);
	const [activeStep, setActiveStep] = useState<number>(0);

	const [dataForm, setDataForm] = useState<INewData | null>(null);

	//useSelector
	const userAddress = useSelector(selectAddress);
	const chainId = useSelector(selectChainId);
	const initialState = selectInitialState;
	const web3Info = useSelector(selectCurrentProvider);

	// useState
	const [inoId, setInoId] = useState<any>();
	const [inoDetail, setInoDetail] = useState<INODetail>();

	// useEffect
	useEffect(() => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Change Active Step
	useEffect(() => {
		if (step1.isCompleted) {
			setActiveStep(1);
			if (step2.isCompleted) {
				setActiveStep(2);
			}
		}
	}, [step1, step2]);

	// fetch list INO
	useEffect(() => {
		(async () => {
			if (userAddress) {
				const res: Response<INO> = await auctionApi.getInoIdByUserAdd(userAddress);
				setInoId(res.data);
			}
		})();

		return () => {
			dispatch(resetAll());
		};

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch, userAddress, chainId]);
	// Fetch ino detail
	useEffect(() => {
		(async () => {
			if (inoId && inoId.length > 0) {
				const res: Response<any> = await auctionApi.getInoDetailByInoId(inoId[0]._id);
				setInoDetail(res.data);
			}
		})();

		return () => {
			dispatch(resetAll());
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch, inoId]);
	console.log('inoId', inoId);
	//Fetch token payment
	useEffect(() => {
		if (chainId) {
			dispatch(fetchListPaymentTokenByChainId(chainId, executeAfterFetchListTokenPayment));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [chainId]);

	const onSubmit = async (data: IFormCreateAuctionInputs) => {
		// const TokenContract = getWeb3Contract(ERC20.abi, data.paymentToken);

		const priceToWei: BigNumber = await erc20function().changeTokenToWei(
			data.paymentToken,
			data.minPrice
		);
		const dataSend = {
			...data,
			minPrice: String(priceToWei),
		};
		setModal(true);
		setDataForm(dataSend);
		try {
		} catch (error: any) {
			toast.error(error.message);
			setModal(false);
		}
	};

	//Excute tokenpyament
	const executeAfterFetchListTokenPayment = (globalStateNewest: RootState) => {
		const { tokenPayment } = globalStateNewest;
		if (!tokenPayment.isSuccess) {
			toast.error('Can not fetch list token payment!');
		}
	};

	// Handle Step 1
	const handleStep1 = async (isCheck: boolean): Promise<void> => {
		if (!userAddress || !dataForm || !inoDetail) {
			return;
		}
		//
		//
		if (isCheck) {
			setStep1({ ...step1, isChecking: true });
		} else {
			setStep1({ ...step1, isExecuting: true });
		}
		// excute
		const data: ApproveAuction = {
			userAddress,
			collectionAddress: inoDetail.collectionInfo.collectionAddress,
			auctionAddress: inoDetail.addressINO,
		};

		const isCompleted = await ApproveAuctionFunction(data, isCheck);
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
	// Handle Step 2:
	const handleStep2 = async (): Promise<void> => {
		if (!userAddress || !chainId || !web3Info || !dataForm || !inoDetail) {
			console.log('Missing Field Step 2');
			return;
		}

		// setLoading state
		setStep2({ ...step2, isExecuting: true });
		console.log('NftAuction.abi', NftAuction.abi);
		console.log('inoDetail?.addressINO', inoDetail.addressINO);
		const AuctionContract = getWeb3Contract(NftAuction.abi, inoDetail.addressINO);

		const dataContract = await AuctionContract.methods
			.createBatchNftAuction(
				inoDetail?.collectionInfo.collectionAddress,
				dataForm.listItemTokenId, // arr inter list item token id
				dataForm.paymentToken,
				dataForm.minPrice,
				dataForm.startTime,
				dataForm.endTime,
				dataForm.bidIncreasePercent * 100
			)
			.send({ from: userAddress });
		const newData = {
			...dataForm,

			transactionHash: dataContract.events[0].transactionHash,
		};
		console.log('newData', newData);
		await auctionApi.createAuction(newData);
		const isCompleted = true;
		//
		// console.log('isCompleted xxx', isCompleted);

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
		navigate(`${PATH_AUCTION.detail}/'auctionid'`);
	};

	//
	// console.log('dataForm', dataForm);
	// console.log('inoId', inoId);
	// console.log('userAddress', userAddress);
	// console.log('inoDetail', inoDetail);
	// console.log('completed', step1.isCompleted);
	// console.log('step1', step1);
	// console.log('step2', step2);
	// console.log('activeStep', activeStep);
	return (
		<Container maxWidth="xl" sx={{ mt: 14 }}>
			{inoDetail ? (
				<FormCreateAuction listData={inoDetail} onSubmit={onSubmit}></FormCreateAuction>
			) : (
				<>
					<Typography textAlign="center" variant="h3">
						You dont have any register Auction
					</Typography>
					<Link
						sx={{ marginTop: '8px' }}
						textAlign="center"
						color="green"
						href={`#${PATH_AUCTION.permission}`}
					>
						<Typography variant="h5">Register Here</Typography>
					</Link>
				</>
			)}
			<Modal
				onOpen={modal}
				onClose={() => {
					setModal(false);
				}}
				allowClose={step1.isChecking || step1.isExecuting || step2.isCompleted}
				mainHeader={'Accept create auction'}
				style={{ maxWidth: '450px', overflowY: 'auto' }}
			>
				<Box>
					<Stepper activeStep={activeStep} orientation="vertical" sx={{ mb: 2 }}>
						<Step>
							<StepLabel>Approve data to blockchain.</StepLabel>
							<StepContent>
								{/* <Typography>Approve data to blockchain.</Typography> */}
								<Box sx={{ mb: 2 }}>
									<ButtonGradient
										onClick={() => {
											handleStep1(false);
										}}
										disabled={step1.isChecking || step1.isExecuting}
										sx={{ width: '180px', mt: 1 }}
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
												? 'Done Step 1'
												: 'Start Approve'}
										</Typography>
									</ButtonGradient>
								</Box>
							</StepContent>
						</Step>
						<Step>
							<StepLabel>Check data.</StepLabel>
							<StepContent>
								<Typography>Send data to blockchain.</Typography>
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
												: step2.isCompleted
												? 'All Done'
												: 'Start Send Info'}
										</Typography>
									</ButtonGradient>
								</Box>
							</StepContent>
						</Step>
						<Step>
							<StepLabel>Done.</StepLabel>
							<StepContent>
								<ButtonGradient
									onClick={() => {
										setModal(false);
										navigate(`${PATH_AUCTION.root}`);
									}}
									sx={{ width: '180px', height: '40px', mt: 1 }}
								>
									<Typography variant="button">Close</Typography>
								</ButtonGradient>
							</StepContent>
						</Step>
					</Stepper>
				</Box>
			</Modal>
		</Container>
	);
}
