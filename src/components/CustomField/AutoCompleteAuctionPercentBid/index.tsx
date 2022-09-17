/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Box, Stack, Typography, useTheme } from '@mui/material';
import {
	ContentWrapper,
	DropDownContent,
	DropDownOverlay,
	ListOption,
	OptionItem,
	SelectOptionBox,
} from './styled';
import DividerGradient from 'components/CustomUI/DividerGradient';
import FieldInput from '../FieldInput';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const zeroToTenPercent = [
	{ label: '1%', bidIncreasePercent: 1 },
	{ label: '2%', bidIncreasePercent: 2 },
	{ label: '3%', bidIncreasePercent: 3 },
	{ label: '4%', bidIncreasePercent: 4 },
	{ label: '5%', bidIncreasePercent: 5 },
	{ label: '6%', bidIncreasePercent: 6 },
	{ label: '7%', bidIncreasePercent: 7 },
	{ label: '8%', bidIncreasePercent: 8 },
	{ label: '9%', bidIncreasePercent: 9 },
	{ label: '10%', bidIncreasePercent: 10 },
];

export interface IAutoCompletePerCent {
	onChangeBidInceasePercent: Function;
	disabled?: boolean;
	onChange?: (value: number | null | undefined) => void;
}
export default function AutoCompletePerCent({
	onChangeBidInceasePercent,
	disabled = false,
	onChange,
}: IAutoCompletePerCent) {
	const [value, setValue] = useState<number | undefined>();
	const theme = useTheme();

	const ref: any = useRef(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const [activeSelectOption, setActiveSelectOption] = useState(false);
	// const [inputValue, setInputValue] = useState<any>();
	useEffect(() => {
		onChangeBidInceasePercent(value);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value]);

	useEffect(() => {
		const onBodyClick = (event: any) => {
			event.stopPropagation();

			if (ref.current && !ref.current.contains(event.target)) {
				setActiveSelectOption(false);
			}
		};
		// Bind the event listener if dropdown is active
		if (activeSelectOption)
			document.body.addEventListener('click', onBodyClick, { passive: true });

		return () => {
			// Unbind the event listener on clean up
			document.body.removeEventListener('click', onBodyClick);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeSelectOption]);

	const showOptionBox = () => {
		if (!activeSelectOption && !disabled) {
			setActiveSelectOption(true);
			if (inputRef.current) inputRef.current.focus();
		}
	};

	const handleSetOption = (e: any, value: number) => {
		e.stopPropagation();
		setValue(value);

		if (onChange) onChange(value);
		setActiveSelectOption(false);
	};

	const renderListOption = () => {
		return zeroToTenPercent.map((item: any, idx: number) => {
			return (
				<Box key={idx}>
					<OptionItem onClick={(e: any) => handleSetOption(e, item.bidIncreasePercent)}>
						<ContentWrapper>
							<Typography variant="body1">{item.label}</Typography>
						</ContentWrapper>
					</OptionItem>
					{idx + 1 !== zeroToTenPercent.length && <DividerGradient />}
				</Box>
			);
		});
	};

	return (
		<SelectOptionBox onClick={showOptionBox}>
			<Stack direction="row" alignItems="center">
				<Box sx={{ flexGrow: 1 }}>
					<FieldInput
						otherProps={{ ref: inputRef }}
						type="text"
						value={value !== undefined ? value + '%' : ''}
						readOnly={true}
						placeholder="Bid increase percent"
						sx={{ zIndex: 1, paddingLeft: '0px', backgroundColor: 'inherit' }}
					/>
				</Box>

				{!disabled && (
					<ArrowDropDownOutlinedIcon
						sx={{
							position: 'absolute',
							top: '50%',
							right: '10px',
							transform: 'translateY(-50%)',
							zIndex: 0,
						}}
					/>
				)}
			</Stack>

			<DropDownOverlay className={activeSelectOption ? 'active' : ''} />

			<DropDownContent ref={ref} className={activeSelectOption ? 'active' : ''}>
				<ListOption>{renderListOption()}</ListOption>
			</DropDownContent>
		</SelectOptionBox>
	);
}
