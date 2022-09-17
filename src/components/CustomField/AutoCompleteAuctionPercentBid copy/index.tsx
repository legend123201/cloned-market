/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useTheme } from '@mui/material';
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

// const aalo = [1, 2, 3, 4, 5, 6, 7, 8];
export interface IAutoCompletePerCent {
	onChangeBidInceasePercent: Function;
}
export default function AutoCompletePerCent({ onChangeBidInceasePercent }: IAutoCompletePerCent) {
	const [value, setValue] = useState<number | undefined>();
	const theme = useTheme();
	// const [inputValue, setInputValue] = useState<any>();
	useEffect(() => {
		onChangeBidInceasePercent(value);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value]);

	return (
		<Autocomplete
			disablePortal
			id="combo-box-demo"
			options={zeroToTenPercent}
			getOptionLabel={(option) => option.label || ''}
			renderInput={(params) => <TextField {...params} label="Bid Incease Percent" />}
			onChange={(event: any, newValue: any) => {
				setValue(newValue?.bidIncreasePercent);
			}}
			sx={{
				width: '220px',
				border: 'none',
				height: '52.5px',
				borderRadius: '14px',
				backgroundColor: theme.palette.primary.dark,

				'& .MuiOutlinedInput-notchedOutline': {
					...(theme.palette.mode === 'light'
						? {
								backgroundColor: theme.palette.primaryLight.dark,
						  }
						: {
								backgroundColor: theme.palette.primary.dark,
								border: 'none',
								// borderColor: theme.palette.primary.main,
						  }),
					// zIndex: '-1',
				},
				'& .css-17ceore-MuiSvgIcon-root': {
					zIndex: '99',
				},
				'& .MuiOutlinedInput-input': {
					zIndex: '1',
				},
				'& .MuiAutocomplete-clearIndicator': {
					zIndex: '0',
				},
				'& .MuiAutocomplete-popupIndicator': {
					zIndex: '1',
				},
			}}
		/>
	);
}
