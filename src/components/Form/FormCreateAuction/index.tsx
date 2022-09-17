/* eslint-disable @typescript-eslint/no-unused-vars */
import {
	Box,
	Checkbox,
	CircularProgress,
	FormControlLabel,
	Grid,
	Link,
	Stack,
	Typography,
	useTheme,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import AutoCompleteCustom2 from 'components/CustomField/AutoCompleteCustom2';
import FieldInput from 'components/CustomField/FieldInput';
import CheckIcon from '@mui/icons-material/Check';
import { Collection, NFT, OptionSelectCustom, Response, TokenPayment } from 'models';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
// yup
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
//
import { PageTitle } from '../FormAddOrEditCollection/styled';
import { FieldSubTitle, FieldTitleName, InputGroup } from '../FormAddOrEditItem/styled';
import { Asterisk, ErrorMessage } from '../Common/styled';
//Yup
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import { toast } from 'react-toastify';
import nftsApi from 'apis/nftsApi';
import { selectAddress } from 'redux/slices/web3InfoSlice';
import { DropdownWrapper, OptionItemText } from 'components/CustomUI/FilterItemGroup/Common/styled';
import DropDown from 'components/CustomUI/DropDown';
import { ListOption, OptionItem } from 'components/CustomField/SelectCustom/styled';
import {
	AutoChoose,
	CheckIconWrapperInCreateAution,
	ItemImageInCreatAuction,
	ItemImageSelected,
	SelectAndInputWrapperCreateAuction,
	SelectedItemRender,
} from './styled';
import { getFileType, isNativeToken, sliceAddress, sliceString } from 'utils';
import { fetchUserAssets } from 'redux/actions/userAssetAction';
import { selectInitialState } from 'redux/slices/userAssetSlice';
import { resetAll } from 'redux/slices/allUsersSlice';

import { selectListTokenPayment } from 'redux/slices/tokenPaymentSlice';
import StartEndTimePickerCreateAuction from './StartEndTimePickerCreateAuction';
import ButtonGradient from 'components/CustomUI/ButtonGradient';
import PreviewItemCardAuction from 'components/CustomUI/PreviewItemCardAuction';
import moment from 'moment';
import { SizeContext } from 'contexts/SizeObserver';
import FieldTextArea from 'components/CustomField/FieldTextArea';
import AutoCompleteCustom from 'components/CustomField/AutoCompleteCustom';
import ComboBox from 'components/CustomField/AutoCompleteAuctionPercentBid';
import AutoCompletePerCent from 'components/CustomField/AutoCompleteAuctionPercentBid';
import { INODetail } from 'models/Auction';
import axios from 'axios';

export interface FormCreateAuctionProps {
	listData: INODetail;
	onSubmit: SubmitHandler<IFormCreateAuctionInputs>;
}

export interface IFormCreateAuctionInputs {
	inoId: string;
	listItemId: string;
	minPrice: number;
	paymentToken: string;
	startTime: number;
	endTime: number;
	nameINO: string;
	descriptionINO: string;
	bidIncreasePercent: number;
	listItemTokenId: string;
}
interface Selected {
	itemId: string;
	itemName: string;
	itemMedia?: string;
	itemTokenId?: string;
}

export default function FormCreateAuction({ listData, onSubmit }: FormCreateAuctionProps) {
	const theme = useTheme();
	const isLightTheme = theme.palette.mode === 'light';
	const dispatch = useDispatch();

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const userAddress = useSelector(selectAddress);
	const [activeDropDown, setActiveDropDown] = useState<boolean>(false);
	const [itemName, setItemName] = useState<string>('');
	const [selected, setSelected] = useState<Selected[]>([]);
	const [currentToken, setCurrentToken] = useState<
		OptionSelectCustom<string> | null | undefined
	>();
	const [currentBidPercent, setCurrentBidPercent] = useState<number>(1);
	const [errorOfferMessage, setErrorOfferMessage] = useState<string>('');
	const [offerPrice, setOfferPrice] = useState<number>(0);
	const [saveEndTime, setSaveEndTime] = useState<number>();

	//
	const [arrItemSelected, setArrItemSelected] = useState<any>([]);
	//Auction Name
	const [auctionName, setAuctionName] = useState<string>('');

	// SELECTOR WIDTH
	const { innerWidth } = useContext(SizeContext);

	const initialState = selectInitialState;
	// Constant token payment
	const listTokenPayment: TokenPayment[] = useSelector(selectListTokenPayment);
	let listPaymentTokenTransformed: OptionSelectCustom<string>[] = listTokenPayment.map(
		(tokenPayment: TokenPayment) => ({
			name: tokenPayment.symbol,
			value: tokenPayment.address,
			image: tokenPayment.logoURI,
		})
	);
	listPaymentTokenTransformed = listPaymentTokenTransformed.filter((val, idx) => {
		return !isNativeToken(String(val.value));
	});
	// State collection
	const [currentCollectionTransformed, setCurrentCollectionTransformed] =
		useState<OptionSelectCustom<string>>();
	// const listCollectionTransformed = listCollectionTemp.map(
	// 	({ collectionName, _id, logo, chainId }) => ({
	// 		name: collectionName,
	// 		value: _id,
	// 		image: logo,
	// 	})
	// );
	const schema = yup
		.object({
			inoId: yup.string().required(),
			listItemId: yup.array(yup.string()).required(),
			minPrice: yup.number().min(0).required(),
			paymentToken: yup.string().required(),
			startTime: yup.number().required(),
			endTime: yup.number().required(),
			nameINO: yup.string().required(),
			descriptionINO: yup.string().required(),
			bidIncreasePercent: yup.number().required(),
			listItemTokenId: yup.array(yup.string()).required(),
		})
		.required();

	const {
		handleSubmit,
		register,
		setValue,
		formState: { errors, isSubmitting },
	} = useForm<IFormCreateAuctionInputs>({
		resolver: yupResolver(schema),
	});
	// console.log('errors', errors);

	// Set value for back-end
	useEffect(() => {
		const arrListItemId = arrItemSelected.map((item: any) => item.itemId);
		setValue('listItemId', arrListItemId);
		const arrListItemTokenId = arrItemSelected.map((item: any) => item.itemTokenId);
		setValue('listItemTokenId', arrListItemTokenId);

		// console.log('currentToken', currentToken);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [arrItemSelected]);

	// Handle feild token Payment
	const handleChangePaymentToken = (
		currentPaymentToken: OptionSelectCustom<string> | null | undefined
	) => {
		if (currentPaymentToken) {
			// console.log('currentTokenPayment', currentPaymentToken);
			setCurrentToken(currentPaymentToken);
			// console.log('currentPaymentToken', currentPaymentToken);
			setValue('paymentToken', currentPaymentToken.value);
		} else {
			setCurrentToken(undefined);
		}
	};
	// Offer Price Auction
	const handleOnChangeOfferPrice = (e: any) => {
		const newOfferPrice = Number(e.target.value);
		if (newOfferPrice <= 0) {
			setErrorOfferMessage('Offer price must be greater then 0');
		} else if (newOfferPrice < 0.001) {
			setErrorOfferMessage('Offer price too low! Min price is 0.001!');
		} else {
			setErrorOfferMessage('');
		}
		setOfferPrice(newOfferPrice);
	};

	//Name Auction
	// const handleOnChangeAuctionName = (e: any) => {
	// 	setAuctionName(e.target.value);
	// };
	//
	// SetValue initial for FormCreateAution
	useEffect(() => {
		setValue('nameINO', listData.nameINO);
		setValue('descriptionINO', listData.descriptionINO);
		setValue('inoId', listData._id);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	//

	// Handle click option
	const handleClickOption = (id: string, name: string, media: string, itemToken: string) => {
		const selectedCollection: Selected | undefined = selected.find(
			(item: Selected) => item.itemId === id
		);

		if (!selectedCollection) {
			// option is not selected => select
			const newSelectedItem: Selected = {
				itemId: id,
				itemName: name,
				itemMedia: media,
				itemTokenId: itemToken,
			};
			setSelected([...selected, newSelectedItem]);
			setArrItemSelected((oldArray: any) => [...oldArray, newSelectedItem]);
		} else {
			// option is selected => remove
			setSelected(selected.filter((item: Selected) => item.itemId !== id));
			setArrItemSelected(arrItemSelected.filter((item: any) => item.itemId !== id));
		}
	};

	// Handle filter By Name Item
	const handleFilterByName = (e: any) => {
		const value = e.target.value;
		setItemName(value);
	};

	//Render Button Content img
	const renderButtonContent = () => {
		return (
			<FieldInput
				type="text"
				value={itemName}
				onChange={handleFilterByName}
				placeholder="Search name ..."
				sx={{
					padding: '15px 15px',
				}}
			/>
		);
	};
	// handle setValue for Bid Increase Percent
	const handleBidIncreasePercent = (perCent: any) => {
		setValue('bidIncreasePercent', perCent);
	};

	// handle picker time
	const handleChangeStartTime = (newValue: any) => {
		const startTimeFormatX = Number(moment(newValue).format('X'));
		// console.log('startTimeFormatX', startTimeFormatX);
		setValue('startTime', startTimeFormatX);
	};
	const handleChangeEndTime = (newValue: any) => {
		const endTimeFormatX = Number(moment(newValue).format('X'));
		setValue('endTime', endTimeFormatX);
		setSaveEndTime(endTimeFormatX);
	};

	// Remove item from list render
	const handleRemoveItem = (e: any) => {
		setSelected(selected.filter((item: Selected) => item.itemId !== e));
		setArrItemSelected(arrItemSelected.filter((item: any) => item.itemId !== e));
	};
	// console.log('arrItemSelected', arrItemSelected);

	// Test
	// const data = async () => {
	// 	await axios.get(
	// 		'https://res.cloudinary.com/dkgnummck/video/upload/v1657507380/nft/Qmc8mFZgjvoKKeWD8gpiw3hbUAfXWZFFc4dP5ePtAiQJM1.mp3',
	// 		{ responseType: 'arraybuffer' }
	// 	);
	// };
	// console.log(data.headers['content-type'].split('/')[0]);
	//
	// Check select Item and render component
	const renderSelectedItem = () => {
		if (arrItemSelected.length === 0) {
			return <></>;
		} else {
			return (
				<Box
					className="ListItem"
					sx={{
						maxHeight: '240px',
						overflow: 'auto',
						'&::-webkit-scrollbar': {
							display: 'block',
							width: '3px',
							height: '4px',
						},
						'&::-webkit-scrollbar-track': {
							display: 'block',
							background: '#0c5599',
						},
						'&::-webkit-scrollbar-thumb': {
							display: 'block',
							background: '#65b8ff',
							borderRadius: '5px',
						},
					}}
				>
					{arrItemSelected.map((item: any, index: number) => {
						return item ? (
							<>
								<SelectedItemRender
									direction="row"
									key={index}
									sx={{ marginTop: '8px' }}
								>
									<Box width="100px">
										{getFileType(item.itemMedia) === 'mp4' ? (
											<Box sx={{ width: '44px', height: '44px' }}>
												<video
													className="player-auction"
													style={{
														width: '44px',
														height: '44px',
													}}
												>
													<source
														src={item.itemMedia}
														type="video/mp4"
													></source>
												</video>
											</Box>
										) : (
											<ItemImageSelected>
												<img src={item.itemMedia} alt={item.itemName} />
											</ItemImageSelected>
										)}
									</Box>
									<Box>
										<Stack direction="column">
											<Typography sx={{ fontSize: '1rem' }}>
												{item.itemName}
											</Typography>
											{item && (
												<Typography sx={{ fontSize: '1rem' }}>
													<span>{sliceAddress(item.itemId, 8, 5)}</span>
												</Typography>
											)}
										</Stack>
									</Box>
									<Box
										sx={{ marginLeft: 'auto', cursor: 'pointer' }}
										onClick={() => handleRemoveItem(item.itemId)}
									>
										<ClearIcon></ClearIcon>
									</Box>
								</SelectedItemRender>
							</>
						) : (
							<></>
						);
					})}
				</Box>
			);
		}
	};
	// Render Dropdown Item
	const renderDropdownContent = () => {
		return (
			<DropdownWrapper sx={{ width: '100%', right: '0' }}>
				{isLoading ? (
					<Stack alignItems="center" sx={{ width: '100%' }}>
						<CircularProgress size={25} sx={{ margin: 2 }} />
					</Stack>
				) : listData.items.length > 0 ? (
					<ListOption sx={{ mt: 0.5 }}>
						{listData.items.map((item: any, idx: number) => {
							const isItemSelected =
								selected.find(
									(itemSelected: Selected) => itemSelected.itemId === item._id
								) !== undefined;

							return (
								<OptionItem
									key={idx}
									onClick={() => {
										handleClickOption(
											item._id,
											item.itemName,
											item.itemMedia,
											item.itemTokenId
										);
									}}
									sx={{ marginTop: '8px' }}
								>
									<Stack direction="row" alignItems="center">
										<ItemImageInCreatAuction>
											{getFileType(item.itemMedia) === 'mp4' ? (
												<Box sx={{ width: '44px', height: '44px' }}>
													<video
														className="player-auction"
														style={{
															width: '44px',
															height: '44px',
														}}
													>
														<source
															src={item.itemMedia}
															type="video/mp4"
														></source>
													</video>
												</Box>
											) : (
												<img src={item.itemMedia} alt={item.itemName} />
											)}
										</ItemImageInCreatAuction>
										<Stack direction="column" alignItems="flex-start">
											<OptionItemText>
												{sliceString(item.itemName, 22)}
											</OptionItemText>
											<OptionItemText>
												{sliceString(item.itemTokenId, 10)}
											</OptionItemText>
										</Stack>
									</Stack>

									{isItemSelected && (
										<CheckIconWrapperInCreateAution>
											<CheckIcon sx={{ width: '100%', height: '100%' }} />
										</CheckIconWrapperInCreateAution>
									)}
								</OptionItem>
							);
						})}
					</ListOption>
				) : (
					<Box sx={{ textAlign: 'center' }}>
						<CircularProgress />
					</Box>
				)}
			</DropdownWrapper>
		);
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			style={{
				padding: '8px',
			}}
		>
			<Box>
				<PageTitle sx={{ fontWeight: '500' }}>Create Auction</PageTitle>
			</Box>
			<Grid container columnGap={2} justifyContent="space-between">
				<Grid item sm={12} md={7}>
					<Box>
						<Box>
							<InputGroup>
								<FieldTitleName>
									Auction Name <Asterisk />
								</FieldTitleName>
								<FieldSubTitle>
									This is your Auction Name (Limit 30 words)
								</FieldSubTitle>
								<FieldInput
									id="auctionName"
									type="text"
									placeholder="Auction Name"
									sx={{
										border: 'none',
										fontSize: '20px',
										textOverflow: 'ellipsis',
										flexGrow: 1,
										...(isLightTheme
											? {
													background: theme.palette.primaryLight.main,
											  }
											: {
													background: theme.palette.primary.dark,
											  }),
									}}
									otherProps={{
										minLength: 1,
										maxLength: 30,
									}}
									registerHookForm={{ ...register('nameINO') }}
								/>
							</InputGroup>
							<InputGroup>
								<FieldTitleName>
									Description <Asterisk />
								</FieldTitleName>
								<FieldSubTitle>
									Please write something about your Auction
								</FieldSubTitle>
								<FieldTextArea
									rows={4}
									cols={40}
									registerHookForm={{ ...register('descriptionINO') }}
									placeholder="Please write something about your Auction"
								/>
							</InputGroup>
						</Box>
						<Box>
							<InputGroup>
								<FieldTitleName>
									Collection <Asterisk />
								</FieldTitleName>
								<FieldSubTitle>
									This is the collection where your item belongs to.
								</FieldSubTitle>

								<AutoChoose>
									<Stack direction="row" alignItems="center" gap={2}>
										<img
											src={listData.collectionInfo.logo}
											alt=""
											style={{
												width: '40px',
												height: '40px',
												borderRadius: '50%',
											}}
										/>
										<Typography>
											{listData.collectionInfo.collectionName}
										</Typography>
									</Stack>
								</AutoChoose>
							</InputGroup>
						</Box>

						<Box sx={{ mt: 5 }}></Box>
					</Box>
					<Box>
						<FieldTitleName>
							Item <Asterisk />
						</FieldTitleName>
						<DropDown
							sx={{ left: '0px', right: '0px' }}
							activeDropDown={activeDropDown}
							setActiveDropDown={setActiveDropDown}
							buttonContent={renderButtonContent()}
							dropdownContent={renderDropdownContent()}
						/>
					</Box>
					{/* Set tokenPaymen */}
					<Box sx={{ marginTop: '32px' }}>
						<FieldTitleName>
							Starting Price <Asterisk />
						</FieldTitleName>
						<SelectAndInputWrapperCreateAuction>
							<AutoCompleteCustom2
								currentItem={currentToken}
								listItem={listPaymentTokenTransformed}
								onChange={handleChangePaymentToken}
								placeholder="Token name"
								sx={{
									width: '155px',

									...(theme.palette.mode === 'light'
										? {
												backgroundColor: theme.palette.primaryLight.main,
										  }
										: {
												backgroundColor: theme.palette.primary.dark,
										  }),
								}}
							/>

							<FieldInput
								id="price"
								type="number"
								placeholder="0"
								onChange={handleOnChangeOfferPrice}
								sx={{
									border: 'none',
									textAlign: 'right',
									fontSize: '20px',
									textOverflow: 'ellipsis',
									flexGrow: 1,
									width: 'auto',
									...(isLightTheme
										? {
												background: theme.palette.primaryLight.main,
										  }
										: {
												background: theme.palette.primary.dark,
										  }),
								}}
								otherProps={{
									inputMode: 'decimal',
									pattern: '^[0-9]*[.,]?[0-9]*$',
									minLength: 1,
									maxLength: 10,
								}}
								registerHookForm={{ ...register('minPrice') }}
							/>
						</SelectAndInputWrapperCreateAuction>
						<Box sx={{ marginTop: '32px' }}>
							<FieldTitleName>
								Bid Increase Percent <Asterisk />
							</FieldTitleName>
							{/* Bid percent */}
							<AutoCompletePerCent
								onChangeBidInceasePercent={handleBidIncreasePercent}
							></AutoCompletePerCent>
						</Box>
					</Box>
					{/* Choose Durant Day */}
					<Box sx={{ marginTop: '36px' }}>
						<StartEndTimePickerCreateAuction
							onChangeStartTime={handleChangeStartTime}
							onChangeEndTime={handleChangeEndTime}
						/>
					</Box>
				</Grid>
				<Grid item md={4}>
					<PreviewItemCardAuction
						itemInfo={arrItemSelected}
						tokenPaymentInfo={currentToken}
						itemPrice={offerPrice}
						endTime={saveEndTime}
					/>
					<Box marginTop={1}>{renderSelectedItem()}</Box>
				</Grid>
			</Grid>
			<Box sx={{ marginTop: '12px' }}>
				<Stack direction="row" alignItems="center">
					<FormControlLabel control={<Checkbox required />} label="" />
					<Typography>
						I argee to the{' '}
						<Link sx={{ color: theme.palette.text.special }} href="">
							Terms of service
						</Link>{' '}
						and conditions and the{' '}
						<Link sx={{ color: theme.palette.text.special }} href="">
							Privacy Policy
						</Link>
					</Typography>
				</Stack>
			</Box>
			<Box sx={{ width: '200px', marginTop: '24px' }}>
				<ButtonGradient type="submit">
					<Typography>Confirm</Typography>
				</ButtonGradient>
			</Box>
		</form>
	);
}
