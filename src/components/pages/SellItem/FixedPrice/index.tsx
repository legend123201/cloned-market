/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
//mui
import { Grid, Box, Stack, Typography, useTheme } from '@mui/material';
//components
import SwitchButton from 'components/CustomField/SwitchButton';
import FieldInput from 'components/CustomField/FieldInput';
import SelectCustom from 'components/CustomField/SelectCustom';
import DateTimePickerCustom from '../DateTimePickerCustom';
//context
import { useSelling } from 'contexts/SellingContext';
// models
import { OptionSelectCustom } from 'models';
//styled
import { SelectAndInputWraper } from './styled';
import { Title } from 'pages/SellItem/styled';
import AutoCompleteCustom2 from 'components/CustomField/AutoCompleteCustom2';
import { ORDER_CONFIGURATION } from '../../../../constants';

export interface FixedPriceProps {
	listTokenPayment: OptionSelectCustom<string>[];
	onChangePaymentToken: (value: OptionSelectCustom<string> | null | undefined) => void;
	onChangeFeeMethod: (value: any) => void;
}

export default function FixedPrice({
	listTokenPayment,
	onChangePaymentToken,
	onChangeFeeMethod,
}: FixedPriceProps) {
	const theme = useTheme();
	const isLightTheme = theme.palette.mode === 'light';
	//state
	const [errPrice, setErrPrice] = useState<string>('');
	const [errQuantity, setErrQuantity] = useState<string>('');

	//context
	const context = useSelling();
	const { state, dispatch } = context;

	// functions
	const handleChangePaymentToken = (
		currentPaymentToken: OptionSelectCustom<string> | null | undefined
	) => {
		if (currentPaymentToken) {
			onChangePaymentToken(currentPaymentToken);
		} else {
			onChangePaymentToken(undefined);
		}
	};

	const setFixedPrice = (e: any) => {
		const newValue = e.target.value;

		if (parseFloat(newValue) <= 0) {
			setErrPrice('Price must be greater then 0!');
		} else if (parseFloat(newValue) < 0.001) {
			setErrPrice('Price too low! Min price is 0.001!');
		} else {
			setErrPrice('');
			dispatch({ type: 'SET_FIXED_PRICE', value: newValue });
			return;
		}

		dispatch({ type: 'SET_FIXED_PRICE', value: 0 });
	};

	const setQuantity = (e: any) => {
		const newValue = e.target.value;

		if (newValue === '') {
			setErrQuantity('');
			dispatch({ type: 'SET_QUANTITY', value: 0 });
			return;
		}

		if (!Number.isInteger(Number(newValue))) {
			setErrQuantity('Quantity must be a integer!');
			dispatch({ type: 'SET_QUANTITY', value: 0 });
			return;
		}

		if (Number(newValue) <= 0) {
			setErrQuantity('Quantity must be greater than 0!');
		} else if (Number(newValue) > state.maxSupply) {
			setErrQuantity(`Quantity must be less than ${state.maxSupply}!`);
		} else {
			setErrQuantity('');
			dispatch({ type: 'SET_QUANTITY', value: newValue });
			return;
		}

		dispatch({ type: 'SET_QUANTITY', value: 0 });
	};

	return (
		<Stack spacing={3} sx={{ width: '100%' }}>
			{/*-------------------------------Price-------------------------------- */}
			<Box sx={{ width: '100%' }}>
				<Title variant="h6">Price</Title>
				<SelectAndInputWraper>
					<Box sx={{ width: '130px' }}>
						<AutoCompleteCustom2
							currentItem={state.tokenPayment}
							listItem={listTokenPayment}
							onChange={handleChangePaymentToken}
							placeholder="Token name..."
							disabled={!state.feeMethod}
							sx={{
								width: '155px',

								...(isLightTheme
									? {
											backgroundColor: theme.palette.primaryLight.dark,
									  }
									: {
											backgroundColor: theme.palette.primary.main,
									  }),
							}}
						/>
					</Box>

					<Box sx={{ flexGrow: 1 }}>
						<FieldInput
							id="price"
							type="text"
							placeholder="0.0"
							onChange={setFixedPrice}
							sx={{
								border: 'none',
								textAlign: 'right',
								fontSize: '20px',
								textOverflow: 'ellipsis',
							}}
							otherProps={{
								inputMode: 'decimal',
								pattern: '^[0-9]*[.,]?[0-9]*$',
								minLength: 1,
								maxLength: 10,
							}}
						/>
					</Box>
				</SelectAndInputWraper>
				<Box sx={{ width: '100%' }}>
					<Typography variant="body1" sx={{ color: 'red', pt: 1, float: 'right' }}>
						{errPrice}
					</Typography>
				</Box>

				<Box sx={{ mt: 2 }}>
					<Title variant="h6">Quantity</Title>

					<FieldInput
						id="quantity"
						type="number"
						placeholder="Ex: 1, 2,..."
						onChange={setQuantity}
						sx={{
							border: 'none',
							fontSize: '20px',
							textOverflow: 'ellipsis',
						}}
					/>

					<Typography variant="body2" sx={{ mt: 0.25, textAlign: 'right', opacity: 0.5 }}>
						{state.maxSupply} available
					</Typography>

					<Typography variant="body1" sx={{ color: 'red', pt: 1, float: 'right' }}>
						{errQuantity}
					</Typography>
				</Box>
			</Box>

			{/*-------------------------------Fee method-------------------------------- */}
			<Stack direction="row" alignItems="center" justifyContent="space-between">
				<Box>
					<Title variant="h6">Fee method</Title>
					<Typography variant="body2" sx={{ opacity: '0.5' }}>
						(
						{state.feeMethod === ORDER_CONFIGURATION.SPLIT_FEE_METHOD
							? 'Split Fee'
							: 'Protocol Fee'}
						)
					</Typography>
				</Box>

				<SwitchButton onChange={onChangeFeeMethod} ariaChecked="true" />
			</Stack>

			<Box>
				<Title variant="h6" sx={{ pb: 1 }}>
					Duration
				</Title>
				<DateTimePickerCustom />
			</Box>
		</Stack>
	);
}
