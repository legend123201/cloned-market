/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
// mui
import { CircularProgress, Stack, Typography, useTheme } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
// components
import DropDown from '../../DropDown';
import DividerGradient from 'components/CustomUI/DividerGradient';
import FieldInput from 'components/CustomField/FieldInput';
// redux
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import { selectLoading, resetAll as resetAllState } from 'redux/slices/collectionSlice';
// actions
import { fetchAllCollection } from 'redux/actions/collectionAction';
// styled
import {
	ButtonApply,
	ButtonBadge,
	ButtonClear,
	ButtonStyled,
	ButtonTitle,
	ButtonWrapper,
	CheckIconWrapper,
	DropdownButtonGroup,
	DropdownWrapper,
	IconStyled,
	ListOption,
	OptionItem,
	OptionItemImage,
	OptionItemText,
} from '../Common/styled';
// images
import iconCollectionWhite from 'assets/icons/filter-collection-white.webp';
import iconCollectionBlack from 'assets/icons/filter-collection-black.webp';
// models
import { Collection, ListResponse, Response } from 'models';
// apis
import collectionApi from 'apis/collectionApi';
// utils
import { sliceString } from 'utils';
// styled
import { CollectionImage } from './styled';
// hooks
import { useIsMounted, useDebounce } from 'hooks';

interface Selected {
	collectionId: string;
	collectionName: string;
}

const defaultButtonTitle = 'Collection';

export interface IFilterCollectionProps {
	filter: { [key: string]: any };
	setFilter: Function;
	resetAll: boolean;
}

export default function FilterCollection({ filter, setFilter, resetAll }: IFilterCollectionProps) {
	const dispatch = useDispatch();
	const theme = useTheme();

	// vars
	const chainId = filter.chainId;
	const isLightTheme = theme.palette.mode === 'light';

	// useState
	const [activeDropDown, setActiveDropDown] = useState<boolean>(false);
	const [selected, setSelected] = useState<Selected[]>([]);
	const [collectionName, setCollectionName] = useState<string>('');
	const [listCollectionTemp, setListCollectionTemp] = useState<Collection[]>([]);
	const [buttonTitle, setButtonTitle] = useState<string>(defaultButtonTitle);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	// hooks
	const isMounted = useIsMounted();
	const debouncedCollectionNameValue = useDebounce<string>(collectionName, 500);

	// useEffect
	useEffect(() => {
		if (resetAll) {
			handleClear();
			setButtonTitle(defaultButtonTitle);
		}
	}, [resetAll]);

	// fetch list collection
	useEffect(() => {
		(async () => {
			try {
				setIsLoading(true);

				const response: ListResponse<Collection> = await collectionApi.getListCollectionId(
					{ pageSize: 20, page: 1 },
					{ collectionName: debouncedCollectionNameValue, chainId }
				);

				const listCollections = response.data;

				if (listCollections.length <= 0) {
					if (isMounted()) setListCollectionTemp([]);
				} else {
					const list = await Promise.all(
						listCollections.map(async (item: any, idx: number) => {
							const res: Response<Collection> = await collectionApi.getCollectionById(
								item._id
							);
							return res.data;
						})
					);

					if (isMounted()) setListCollectionTemp(list);
				}
			} catch (error) {
				toast.error('Some error occur when getting your collections!');
			} finally {
				if (isMounted()) setIsLoading(false);
			}
		})();
	}, [dispatch, debouncedCollectionNameValue, chainId]);

	// functions
	const handleFilterByName = (e: any) => {
		const value = e.target.value;
		setCollectionName(value);
	};

	const handleClickOption = (id: string, name: string) => {
		const selectedCollection: Selected | undefined = selected.find(
			(item: Selected) => item.collectionId === id
		);

		if (!selectedCollection) {
			// option is not selected => select
			const newSelectedItem: Selected = { collectionId: id, collectionName: name };
			setSelected([...selected, newSelectedItem]);
		} else {
			// option is selected => remove
			setSelected(selected.filter((item: Selected) => item.collectionId !== id));
		}
	};

	const handleClear = () => {
		setSelected([]);
		setCollectionName('');
	};

	const handleApply = () => {
		let arrCollectionId: string[] = [];
		let arrCollectionName: string[] = [];

		selected.forEach((item: Selected) => {
			arrCollectionId.push(item.collectionId);
			arrCollectionName.push(item.collectionName);
		});

		if (arrCollectionName.length === 0) {
			setButtonTitle(defaultButtonTitle);
		} else {
			setButtonTitle(arrCollectionName.join(', '));
		}

		const newFilter: object = { ...filter, collectionId: arrCollectionId };
		dispatch(setFilter(newFilter));
	};

	const renderButtonContent = () => {
		return (
			<ButtonWrapper>
				{buttonTitle !== defaultButtonTitle && (
					<ButtonBadge>{defaultButtonTitle}</ButtonBadge>
				)}

				<ButtonStyled>
					<IconStyled sx={{ width: '14px', height: '14px' }}>
						{isLightTheme ? (
							<img src={iconCollectionBlack} alt="icon collection" />
						) : (
							<img src={iconCollectionWhite} alt="icon collection" />
						)}
					</IconStyled>
					<ButtonTitle>{buttonTitle}</ButtonTitle>
				</ButtonStyled>
			</ButtonWrapper>
		);
	};

	const renderDropdownContent = () => {
		return (
			<DropdownWrapper sx={{ minWidth: '300px' }}>
				<FieldInput
					type="text"
					value={collectionName}
					onChange={handleFilterByName}
					placeholder="Search name ..."
					sx={{
						padding: '12px 15px',
					}}
				/>

				{isLoading ? (
					<Stack alignItems="center" sx={{ width: '100%' }}>
						<CircularProgress size={25} sx={{ margin: 2 }} />
					</Stack>
				) : listCollectionTemp.length > 0 ? (
					<ListOption sx={{ mt: 0.5 }}>
						{listCollectionTemp.map((item: Collection, idx: number) => {
							const isItemSelected =
								selected.find(
									(itemSelected: Selected) =>
										itemSelected.collectionId === item._id
								) !== undefined;

							return (
								<OptionItem
									key={idx}
									onClick={() => {
										handleClickOption(item._id, item.collectionName);
									}}
								>
									<Stack direction="row" alignItems="center">
										<CollectionImage sx={{ width: '32px', height: '32px' }}>
											<img src={item.logo} alt="collection logo" />
										</CollectionImage>
										<OptionItemText>
											{sliceString(item.collectionName, 22)}
										</OptionItemText>
									</Stack>

									{isItemSelected && (
										<CheckIconWrapper>
											<CheckIcon sx={{ width: '100%', height: '100%' }} />
										</CheckIconWrapper>
									)}
								</OptionItem>
							);
						})}
					</ListOption>
				) : (
					<Typography variant="body1" sx={{ m: 2, textAlign: 'center' }}>
						No results found
					</Typography>
				)}

				<DividerGradient />

				<DropdownButtonGroup>
					<ButtonClear onClick={handleClear}>Clear</ButtonClear>
					<ButtonApply onClick={handleApply}>Apply</ButtonApply>
				</DropdownButtonGroup>
			</DropdownWrapper>
		);
	};

	return (
		<DropDown
			activeDropDown={activeDropDown}
			setActiveDropDown={setActiveDropDown}
			buttonContent={renderButtonContent()}
			dropdownContent={renderDropdownContent()}
		/>
	);
}
