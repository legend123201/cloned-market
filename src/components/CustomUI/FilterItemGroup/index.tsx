/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
// components
import FilterBlockChain from './FilterBlockChain';
import FilterStatus from './FilterStatus';
import FilterCollection from './FilterCollection';
import FilterPrice from './FilterPrice';
import FilterCategory from './FilterCategory';
import DropDown from '../DropDown';
// redux
import { useDispatch } from 'react-redux';
// styled
import {
	ButtonReset,
	DropdownContentStyled,
	FilterBox,
	FilterStack,
	FilterWrapper,
	screenBreakpoint,
} from './styled';
// mui
import { Box, Stack, useTheme } from '@mui/material';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';

export interface IFilterItemGroupProps {
	filterBlockChain?: boolean;
	filterStatus?: boolean;
	filterCollection?: boolean;
	filterPrice?: boolean;
	filterCategory?: boolean;
	initialStateFilter: object;
	filter: object;
	setFilter: Function;
}

export default function FilterItemGroup({
	filterBlockChain,
	filterStatus,
	filterCollection,
	filterPrice,
	filterCategory,
	initialStateFilter,
	filter,
	setFilter,
}: IFilterItemGroupProps) {
	const dispatch = useDispatch();

	// useState
	const [resetAll, setResetAll] = useState<boolean>(false);
	const [activeDropDown, setActiveDropDown] = useState<boolean>(false);

	const handleResetAll = () => {
		if (!resetAll) {
			setResetAll(true);
			dispatch(setFilter(initialStateFilter));

			setTimeout(() => {
				setResetAll(false);
			}, 500);
		}
	};

	const renderButtonContent = () => {
		return (
			<FilterBox>
				<FilterAltOutlinedIcon sx={{ width: '22px', height: '22	px' }} />
			</FilterBox>
		);
	};

	const renderDropdownContent = () => {
		return (
			<DropdownContentStyled>
				<FilterStack>
					{filterBlockChain && (
						<FilterBlockChain
							filter={filter}
							setFilter={setFilter}
							resetAll={resetAll}
						/>
					)}
					{filterStatus && (
						<FilterStatus filter={filter} setFilter={setFilter} resetAll={resetAll} />
					)}
					{filterCollection && (
						<FilterCollection
							filter={filter}
							setFilter={setFilter}
							resetAll={resetAll}
						/>
					)}
					{filterPrice && (
						<FilterPrice filter={filter} setFilter={setFilter} resetAll={resetAll} />
					)}
					{filterCategory && (
						<FilterCategory filter={filter} setFilter={setFilter} resetAll={resetAll} />
					)}
					<ButtonReset variant="body1" onClick={handleResetAll}>
						Reset
					</ButtonReset>
				</FilterStack>
			</DropdownContentStyled>
		);
	};

	return (
		<FilterWrapper>
			<Box className="big-screen">{renderDropdownContent()}</Box>

			<DropDown
				activeDropDown={activeDropDown}
				setActiveDropDown={setActiveDropDown}
				buttonContent={renderButtonContent()}
				dropdownContent={renderDropdownContent()}
				className="small-screen"
			/>
		</FilterWrapper>
	);
}
