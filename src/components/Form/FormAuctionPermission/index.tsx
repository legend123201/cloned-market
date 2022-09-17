/* eslint-disable @typescript-eslint/no-unused-vars */
import {
	Box,
	Checkbox,
	CircularProgress,
	Container,
	FormControlLabel,
	Link,
	Stack,
	Typography,
	useTheme,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import FieldInput from 'components/CustomField/FieldInput';
import { SubmitHandler, useForm } from 'react-hook-form';
import React, { useEffect, useRef, useState } from 'react';
// yup
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FieldSubTitle, FieldTitleName, PageTitle } from '../FormAddOrEditCollection/styled';
import { Asterisk, ErrorMessage } from '../Common/styled';

import ButtonGradient from 'components/CustomUI/ButtonGradient';
import DataGrid from 'theme/overrides/DataGrid';
import { InputGroup } from '../FormAddOrEditItem/styled';
import AutoCompleteCustom2 from 'components/CustomField/AutoCompleteCustom2';
import { Collection, FilterCollection, NFT, OptionSelectCustom, Response } from 'models';
import { fetchListCollectionsByOwnerOrCreatorItems } from 'redux/actions/collectionAction';
import collectionApi from 'apis/collectionApi';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { selectAddress, selectChainId } from 'redux/slices/web3InfoSlice';
import { resetAll, selectInitialState } from 'redux/slices/collectionSlice';
import { RootState } from 'redux/store';
import DropDown from 'components/CustomUI/DropDown';
import { DropdownWrapper, OptionItemText } from 'components/CustomUI/FilterItemGroup/Common/styled';
import { ListOption, OptionItem } from 'components/CustomField/SelectCustom/styled';
import {
	CheckIconWrapperInCreateAution,
	ItemImageInCreatAuction,
} from '../FormCreateAuction/styled';
import { sliceString } from 'utils';
import { fetchUserAssets } from 'redux/actions/userAssetAction';
import nftsApi from 'apis/nftsApi';
import { selectInitialState as selectInitialStateUser } from 'redux/slices/userAssetSlice';
import FieldTextArea from 'components/CustomField/FieldTextArea';

export interface IFormAuctionPermissionProps {
	onSubmit: SubmitHandler<IFormAuctionPermissionValue>;
}

export interface IFormAuctionPermissionValue {
	name: string;
	email: string;
	phoneNumber: string;
	walletAddress: string;
	collectionId: string;
	listItemTokenId: string[];
	note?: string;
	website?: string;
	chainId: number;
}
interface Selected {
	itemId: string;
	itemName: string;
	itemMedia?: string;
	itemTokenId?: string;
}

export default function FormAuctionPermission({ onSubmit }: IFormAuctionPermissionProps) {
	const dispatch = useDispatch();
	const theme = useTheme();
	const isLightTheme = theme.palette.mode === 'light';
	// SELECTOR
	const userAddress = useSelector(selectAddress);
	const chainId = useSelector(selectChainId);
	const initialState = selectInitialState;
	const initialStateUser = selectInitialStateUser;

	//
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [listItemTemp, setListItemTemp] = useState<NFT[]>([]);

	//
	// Arr Item selected
	const [selected, setSelected] = useState<Selected[]>([]);
	const [arrItemSelected, setArrItemSelected] = useState<any>([]);
	const [itemName, setItemName] = useState<string>('');

	// Active dropdown item
	const [activeDropDown, setActiveDropDown] = useState<boolean>(false);

	// State collection
	const [listCollectionTemp, setListCollectionTemp] = useState<Collection[]>([]);
	const [currentCollectionTransformed, setCurrentCollectionTransformed] =
		useState<OptionSelectCustom<any>>();
	const listCollectionTransformed = listCollectionTemp.map(
		({ collectionName, _id, logo, chainId }) => ({
			name: collectionName,
			value: { _id, chainId },
			image: logo,
		})
	);
	// Yup
	const schema = yup
		.object({
			name: yup.string().required(),
			email: yup.string().required(),
			phoneNumber: yup.string().required(),
			walletAddress: yup.string().required(),
			collectionId: yup.string().required(),
			listItemTokenId: yup.array(yup.string()).required(),
			note: yup.string(),
			website: yup.string(),
			chainId: yup.number().required(),
		})
		.required();

	const {
		handleSubmit,
		register,
		setValue,
		formState: { errors, isSubmitting },
	} = useForm<IFormAuctionPermissionValue>({
		resolver: yupResolver(schema),
	});
	//
	//
	console.log('errorr', errors);
	useEffect(() => {
		const arrListItemTokenId = arrItemSelected.map((item: any) => item.itemTokenId);
		setValue('listItemTokenId', arrListItemTokenId);

		// console.log('currentToken', currentToken);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [arrItemSelected]);
	// fetch list collection
	useEffect(() => {
		if (userAddress) {
			const tempFilter: FilterCollection = {
				...initialState.filter,
				userAddress,
				isCreator: true,
				isOwner: true,
				collectionStandard: 'ERC721',
			};
			dispatch(
				fetchListCollectionsByOwnerOrCreatorItems(
					{ pageSize: 9999, page: 1 },
					tempFilter,
					true,
					executeAfterFetchListCollection
				)
			);
		}
		return () => {
			dispatch(resetAll());
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch, userAddress, chainId]);
	//
	// Solution after FetchApi
	const executeAfterFetchListCollection = async (globalStateNewest: RootState) => {
		const { collection } = globalStateNewest;
		if (!collection.isSuccess) {
			toast.error(
				'Some error occur when getting your collections!' + collection.errorMessage
			);
		} else {
			if (collection.listCollectionsByOwnerOrCreatorItems.length <= 0) {
				setListCollectionTemp([]);
			} else {
				try {
					const list = await Promise.all(
						collection.listCollectionsByOwnerOrCreatorItems.map(
							async (item: any, idx: number) => {
								const res: Response<any> = await collectionApi.getCollectionById(
									item._id
								);
								return res.data;
							}
						)
					);
					setListCollectionTemp(list);
				} catch (error) {
					toast.error('Some error occur when getting your Collection!');
				}
			}
		}
	};
	//
	// HANDLE GET NFTs
	useEffect(() => {
		if (!userAddress) return;

		if (currentCollectionTransformed) {
			const currentCollection: Collection | undefined = listCollectionTemp.find(
				(item: Collection) => item._id === currentCollectionTransformed.value._id
			);
			console.log('currentCollection', currentCollection);
			console.log('listCollectionTemp', listCollectionTemp);
			if (currentCollection) {
				console.log('currentCollection', currentCollection);
				const tempFilterUser = {
					...initialStateUser.filter,
					collectionId: [currentCollectionTransformed.value._id.toString()],
				};

				dispatch(
					fetchUserAssets(
						userAddress,
						currentCollection.chainId,
						{ page: 1, pageSize: 20 },
						tempFilterUser,
						true,
						executeAfterFetchNFTsByCollectionId
					)
				);
			}
			return () => {
				dispatch(resetAll());
			};
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentCollectionTransformed]);
	const executeAfterFetchNFTsByCollectionId = (globalStateNewest: RootState) => {
		console.log('Hello');
		const { userAsset } = globalStateNewest;
		console.log('userAsset', userAsset);
		(async () => {
			try {
				const list = await Promise.all(
					userAsset.listAssets.map(async (item: any, idx: number) => {
						const res: Response<NFT> = await nftsApi.getLessNftInfoByTokenId({
							itemId: item._id ?? item,
							userAddress,
						});
						console.log('listItemTemp', res.data);
						return res.data;
					})
				);

				setListItemTemp(list);
			} catch (error) {
				console.log('message error', error);
			}
		})();
		if (!userAsset.isSuccess) {
			toast.error('Some error occur when getting your NFT at formCreateAuction!');
		}
	};
	//
	// Handle change collection
	const handleChangeCollection = (
		collectionTransformed: OptionSelectCustom<any> | null | undefined
	) => {
		if (collectionTransformed) {
			setValue('collectionId', collectionTransformed.value._id);
			setValue('chainId', collectionTransformed.value.chainId);
			setCurrentCollectionTransformed(collectionTransformed);
			setArrItemSelected([]);
			setSelected([]);

			// console.log('currentCollectionTransformed', currentCollectionTransformed);
		} else {
			setValue('collectionId', '');
			setCurrentCollectionTransformed(undefined);
		}
	};
	//
	// Handle filter By Name Item
	const handleFilterByName = (e: any) => {
		const value = e.target.value;
		setItemName(value);
	};
	//
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
	//
	// Render Dropdown
	const renderDropdownContent = () => {
		return (
			<DropdownWrapper sx={{ width: '100%', right: '0' }}>
				{isLoading ? (
					<Stack alignItems="center" sx={{ width: '100%' }}>
						<CircularProgress size={25} sx={{ margin: 2 }} />
					</Stack>
				) : listItemTemp.length > 0 ? (
					<ListOption sx={{ mt: 0.5 }}>
						{listItemTemp.map((item: NFT, idx: number) => {
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
										<ItemImageInCreatAuction
											sx={{ width: '44px', height: '44px' }}
										>
											<img src={item.itemMedia} alt="Item logo" />
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
	//

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			style={{
				maxWidth: '1200px',
				margin: '0px auto',
				padding: '8px',
			}}
		>
			<Container maxWidth="lg">
				<PageTitle sx={{ textAlign: 'left', fontWeight: '400' }}>
					PLEASE REGISTER YOUR INFORMATION
				</PageTitle>
				<Box sx={{ marginTop: 5 }}>
					<FieldTitleName>
						Name <Asterisk />
					</FieldTitleName>
					<FieldInput
						type="text"
						placeholder="Your Name"
						registerHookForm={{ ...register('name') }}
					/>
					{errors.name?.message && <ErrorMessage>{errors.name?.message}</ErrorMessage>}
				</Box>
				<Box sx={{ marginTop: 5 }}>
					<FieldTitleName>
						Your Email <Asterisk />
					</FieldTitleName>
					<FieldInput
						type="email"
						placeholder="Your Email"
						registerHookForm={{ ...register('email') }}
					/>
					{errors.email?.message && <ErrorMessage>{errors.email?.message}</ErrorMessage>}
				</Box>
				<Box sx={{ marginTop: 5 }}>
					<FieldTitleName>
						Wallet Address <Asterisk />
					</FieldTitleName>
					<FieldInput
						type="text"
						placeholder="Your Wallet Address"
						registerHookForm={{ ...register('walletAddress') }}
					/>
					{errors.walletAddress?.message && (
						<ErrorMessage>{errors.walletAddress?.message}</ErrorMessage>
					)}
				</Box>
				<Box sx={{ marginTop: 5 }}>
					<FieldTitleName>
						Phone number <Asterisk />
					</FieldTitleName>
					<FieldInput
						type="text"
						placeholder="Your phone number"
						registerHookForm={{ ...register('phoneNumber') }}
					/>
					{errors.phoneNumber?.message && (
						<ErrorMessage>{errors.phoneNumber?.message}</ErrorMessage>
					)}
				</Box>
				<Box sx={{ marginTop: 5 }}>
					<FieldTitleName>
						Your project Website <Asterisk />
					</FieldTitleName>
					<FieldInput
						type="text"
						placeholder="Your website"
						registerHookForm={{ ...register('website') }}
					/>
				</Box>
				<Box sx={{ marginTop: 5 }}>
					<InputGroup>
						<FieldTitleName>
							Collection <Asterisk />
						</FieldTitleName>
						<FieldSubTitle>
							This is the collection where your item belongs to.
						</FieldSubTitle>

						<AutoCompleteCustom2
							currentItem={currentCollectionTransformed}
							listItem={listCollectionTransformed}
							onChange={handleChangeCollection}
							placeholder="Collection name..."
							// disabled={isEdit}
							sx={{
								...(isLightTheme
									? {
											backgroundColor: theme.palette.primaryLight.main,
									  }
									: {
											backgroundColor: theme.palette.primary.dark,
									  }),
							}}
						/>

						{errors.collectionId?.message && (
							<ErrorMessage>{errors.collectionId?.message}</ErrorMessage>
						)}
					</InputGroup>
				</Box>
				<Box sx={{ marginTop: 5 }}>
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
				<Box sx={{ marginTop: 5 }}>
					<FieldTitleName>Note</FieldTitleName>
					<FieldTextArea
						rows={4}
						cols={40}
						placeholder="Writing something"
						registerHookForm={{ ...register('note') }}
					/>
				</Box>
				<Stack direction="row" alignItems="center">
					<FormControlLabel control={<Checkbox required />} label="" />
					<Typography>
						I argee to the
						<Link sx={{ color: theme.palette.text.special }} href="">
							Terms of service
						</Link>
						and conditions and the
						<Link sx={{ color: theme.palette.text.special }} href="">
							Privacy Policy
						</Link>
					</Typography>
				</Stack>
				<Box sx={{ width: '250px', marginTop: '8px', textAlign: 'left' }}>
					<ButtonGradient type="submit">
						<Typography>Send</Typography>
					</ButtonGradient>
				</Box>
			</Container>
		</form>
	);
}
