/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';

// react-hook-form
import { SubmitHandler, useForm } from 'react-hook-form';
// yup
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
// mui
import { Box, Typography, CircularProgress, useTheme, Stack } from '@mui/material';
import DateTimePicker from '@mui/lab/DateTimePicker';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
// components
import FieldInput from 'components/CustomField/FieldInput';
import SelectCustom from 'components/CustomField/SelectCustom';
import ButtonGradient from 'components/CustomUI/ButtonGradient';
import AutoCompleteCustom2 from 'components/CustomField/AutoCompleteCustom2';
// styled
import { SelectAndInputWrapper } from './styled';
import {
	DatePickerTextField,
	DatePickerVisiblePart,
	DatePickerWrapper,
} from 'components/pages/SellItem/DateTimePickerCustom/styled';
// models
import { OptionSelectCustom, TokenPayment } from 'models';
// redux
import { useSelector } from 'react-redux';
import { selectListTokenPayment } from 'redux/slices/tokenPaymentSlice';
// utils
import moment from 'moment';
import { dateToTimestamp, isNativeToken } from 'utils';
// constants
import { ORDER_CONFIGURATION } from '../../../constants';

export interface IFormOfferInputs {
	paymentToken: string;
	offerPrice: number;
	quantity: number;
	expirationTime: number;
}

const dateRanges: OptionSelectCustom<string>[] = [
	{ name: '7 days', value: '7' },
	{ name: '1 day', value: '1' },
	{ name: '3 days', value: '3' },
	{ name: '30 days', value: '30' },
	{ name: '60 days', value: '60' },
];

export interface IFormOfferProps {
	onSubmit: SubmitHandler<IFormOfferInputs>;
}

export default function FormOffer({ onSubmit }: IFormOfferProps) {
	const theme = useTheme();

	// useState
	const [currentToken, setCurrentToken] = useState<
		OptionSelectCustom<string> | null | undefined
	>();
	const [currentDuration, setCurrentDuration] = useState<any>(dateRanges[0]);
	const [endDate, setEndDate] = useState<Date | null | undefined>(
		moment(new Date()).add(dateRanges[0].value, 'days').toDate()
	);
	const [offerPrice, setOfferPrice] = useState<number>(0);

	// useSelector
	const listTokenPayment: TokenPayment[] = useSelector(selectListTokenPayment);

	// vars
	const isLightTheme = theme.palette.mode === 'light';

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

	// useEffect
	// set default value for expirationTime
	useEffect(() => {
		if (endDate) setValue('expirationTime', dateToTimestamp(endDate));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// // reset offer price and quantity
	// useEffect(() => {
	// 	if (!modalOffer) {
	// 		setOfferPrice(0);
	// 		setQuantity(0);
	// 	}
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [modalOffer]);

	// react hook form
	const schema = yup
		.object({
			paymentToken: yup.string().required(),
			offerPrice: yup
				.number()
				.min(0.001)
				.max(9999999)
				.transform((cv, ov) => {
					// handle case not enter a number throw error: NaN cast from ""
					return ov === '' ? undefined : cv;
				})
				.required(),
			quantity: yup
				.number()
				.integer()
				.min(1)
				.max(9999999)
				.transform((cv, ov) => {
					// handle case not enter a number throw error: NaN cast from ""
					return ov === '' ? undefined : cv;
				})
				.required(),
			expirationTime: yup
				.number()
				.transform((cv, ov) => {
					// handle case not enter a number throw error: NaN cast from ""
					return ov === '' ? undefined : cv;
				})
				.required(),
		})
		.required();

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors, isSubmitting },
		reset,
	} = useForm<IFormOfferInputs>({
		resolver: yupResolver(schema),
	});

	// functions
	const handleChangePaymentToken = (
		currentPaymentToken: OptionSelectCustom<string> | null | undefined
	) => {
		if (currentPaymentToken) {
			setCurrentToken(currentPaymentToken);
			setValue('paymentToken', currentPaymentToken.value);
		} else {
			setCurrentToken(undefined);
			setValue('paymentToken', '');
		}
	};

	const onChangeDuration = (duration: OptionSelectCustom<string>) => {
		setCurrentDuration(duration);

		const updateEndDate: Date = moment(new Date()).add(duration.value, 'days').toDate();
		setEndDate(updateEndDate);
		setValue('expirationTime', dateToTimestamp(updateEndDate));
	};

	const handleChangeEndDate = (newValue: Date | null | undefined) => {
		if (newValue) {
			setEndDate(moment(newValue).toDate());
			setValue('expirationTime', dateToTimestamp(moment(newValue).toDate()));
		}
	};

	const handleChangeOfferPrice = (e: any) => {
		const value = e.target.value;
		if (value) {
			setOfferPrice(Number(value));
		} else {
			setOfferPrice(0);
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			{/*-------------------------------Price-------------------------------- */}
			<Box>
				<Typography variant="h6" sx={{ fontWeight: '600', mb: 0.5 }}>
					Payment token
				</Typography>

				<SelectAndInputWrapper>
					<AutoCompleteCustom2
						currentItem={currentToken}
						listItem={listPaymentTokenTransformed}
						onChange={handleChangePaymentToken}
						placeholder="Token name"
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

					<FieldInput
						id="offer-price"
						type="number"
						placeholder="0"
						registerHookForm={{ ...register('offerPrice') }}
						onChange={handleChangeOfferPrice}
						sx={{
							border: 'none',
							textAlign: 'right',
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
					/>
				</SelectAndInputWrapper>

				<Box sx={{ width: '100%' }}>
					{errors.offerPrice?.message && (
						<Typography variant="body1" sx={{ color: 'red', pt: 1, textAlign: 'end' }}>
							{errors.offerPrice?.message}
						</Typography>
					)}
					{errors.paymentToken?.message && (
						<Typography variant="body1" sx={{ color: 'red', pt: 1, textAlign: 'end' }}>
							{errors.paymentToken?.message}
						</Typography>
					)}
				</Box>

				<Box sx={{ mt: 1 }}>
					<Typography variant="h6" sx={{ fontWeight: '600', mb: 0.5 }}>
						Quantity
					</Typography>

					<FieldInput
						id="quantity"
						type="number"
						placeholder="Ex: 1, 2,..."
						registerHookForm={{ ...register('quantity') }}
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
					/>

					<Box sx={{ width: '100%' }}>
						{errors.quantity?.message && (
							<Typography
								variant="body1"
								sx={{ color: 'red', pt: 1, textAlign: 'end' }}
							>
								{errors.quantity?.message}
							</Typography>
						)}
					</Box>
				</Box>

				<Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
					<Typography variant="body2">Service fee ( 2% ):</Typography>
					<Typography variant="body2">
						{(offerPrice * ORDER_CONFIGURATION.OFFER_MAKER_PROTOCOL_FEE) / 10000}{' '}
						{currentToken?.name}
					</Typography>
				</Stack>

				<Stack direction="row" justifyContent="space-between">
					<Typography variant="body2">Total:</Typography>
					<Typography variant="body2">
						{offerPrice +
							(offerPrice * ORDER_CONFIGURATION.OFFER_MAKER_PROTOCOL_FEE) /
								10000}{' '}
						{currentToken?.name}
					</Typography>
				</Stack>

				<Typography variant="h6" sx={{ fontWeight: '600', mt: 2, mb: 0.5 }}>
					Expiration
				</Typography>

				<Stack
					sx={{
						flexDirection: 'row',
						gap: '8px',
						alignItems: 'start',
						[theme.breakpoints.down(480)]: {
							flexDirection: 'column',
						},
					}}
				>
					<SelectCustom
						currentItem={currentDuration}
						listItem={dateRanges}
						onChange={onChangeDuration}
						sx={{
							padding: '10px',
							flexShrink: 0,

							[theme.breakpoints.down(480)]: {
								width: '100%',
							},
						}}
					/>

					<Box
						sx={{
							flexGrow: 1,
							[theme.breakpoints.down(480)]: {
								width: '100%',
							},
						}}
					>
						<DatePickerWrapper>
							<DateTimePicker
								disablePast
								value={endDate}
								onChange={(newValue) => handleChangeEndDate(newValue)}
								renderInput={(params) => <DatePickerTextField {...params} />}
							/>
							<DatePickerVisiblePart>
								<Stack
									alignItems="center"
									justifyContent="space-between"
									sx={{ width: '100%' }}
									direction="row"
								>
									<Typography variant="body1">
										{moment(endDate).format('LL')} (
										{moment(endDate).format('LT')})
									</Typography>
									<ArrowDropDownOutlinedIcon sx={{ ml: 2 }} />
								</Stack>
							</DatePickerVisiblePart>
						</DatePickerWrapper>
					</Box>
				</Stack>

				<Box sx={{ width: '100%' }}>
					{errors.expirationTime?.message && (
						<Typography variant="body1" sx={{ color: 'red', pt: 1, textAlign: 'end' }}>
							{errors.expirationTime?.message}
						</Typography>
					)}
				</Box>

				<Box sx={{ width: '80%', mx: 'auto' }}>
					<ButtonGradient type="submit" disabled={isSubmitting} sx={{ mt: 2, mb: 3 }}>
						{isSubmitting && (
							<CircularProgress sx={{ color: 'white', mr: 1 }} size={16} />
						)}
						<Typography variant="body1">Offer</Typography>
					</ButtonGradient>
				</Box>
			</Box>
		</form>
	);
}
