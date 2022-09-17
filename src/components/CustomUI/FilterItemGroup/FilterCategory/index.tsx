import React, { useEffect, useState } from 'react';
// mui

import CheckIcon from '@mui/icons-material/Check';
// components
import DropDown from '../../DropDown';
import DividerGradient from 'components/CustomUI/DividerGradient';
// redux
import { useDispatch } from 'react-redux';
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
	OptionItemText,
} from '../Common/styled';
// images
import iconStatusWhite from 'assets/icons/filter-status-white.webp';
import iconStatusBlack from 'assets/icons/filter-status-black.webp';
// models
import { useTheme } from '@mui/material';

export interface Category {
	id: number;
	name: string;
	value: number;
}

export const listCategory: Category[] = [
	{ id: 0, name: 'Other', value: 0 },
	{ id: 1, name: 'Artwork', value: 1 },
	{ id: 2, name: 'Music', value: 2 },
	{ id: 3, name: 'Photography', value: 3 },
	{ id: 4, name: 'Games', value: 4 },
	{ id: 5, name: 'Sport', value: 5 },
	{ id: 6, name: 'Metaverse', value: 6 },
	{ id: 7, name: 'Box', value: 7 },
	{ id: 8, name: 'Card', value: 8 },
];

const defaultButtonTitle = 'Category';

export interface IFilterCategoryProps {
	filter: object;
	setFilter: Function;
	resetAll: boolean;
}

export default function FilterCategory({ filter, setFilter, resetAll }: IFilterCategoryProps) {
	const dispatch = useDispatch();
	const theme = useTheme();

	const isLightTheme = theme.palette.mode === 'light';

	// useState
	const [selected, setSelected] = useState<number[]>([]);
	const [activeDropDown, setActiveDropDown] = useState<boolean>(false);
	const [buttonTitle, setButtonTitle] = useState<string>(defaultButtonTitle);

	// useEffect
	useEffect(() => {
		if (resetAll) {
			handleClear();
			setButtonTitle(defaultButtonTitle);
		}
	}, [resetAll]);

	// functions
	const handleClickOption = (id: number) => {
		const selectedIndex = selected.indexOf(id);

		if (selectedIndex === -1) {
			// option is not selected => select
			setSelected([...selected, id]);
		} else {
			// option is selected => remove
			setSelected(selected.filter((item: number) => item !== id));
		}
	};

	const handleClear = () => {
		setSelected([]);
	};

	const handleApply = () => {
		let arrCategoryValue: number[] = [];
		let arrCategoryName: string[] = [];

		if (selected.length !== 0) {
			selected.forEach((item: number) => {
				arrCategoryValue.push(listCategory[item].value);
				arrCategoryName.push(listCategory[item].name);
			});
		}

		if (arrCategoryName.length === 0) {
			setButtonTitle(defaultButtonTitle);
		} else {
			setButtonTitle(arrCategoryName.join(', '));
		}

		const newFilter: object = { ...filter, category: arrCategoryValue };
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
							<img src={iconStatusBlack} alt="icon status" />
						) : (
							<img src={iconStatusWhite} alt="icon status" />
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
				<ListOption>
					{listCategory.map((item: Category, idx: number) => {
						const isItemSelected = selected.indexOf(item.id) !== -1;

						return (
							<OptionItem
								key={idx}
								onClick={() => {
									handleClickOption(item.id);
								}}
							>
								<OptionItemText>{item.name}</OptionItemText>

								{isItemSelected && (
									<CheckIconWrapper>
										<CheckIcon sx={{ width: '100%', height: '100%' }} />
									</CheckIconWrapper>
								)}
							</OptionItem>
						);
					})}
				</ListOption>

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
