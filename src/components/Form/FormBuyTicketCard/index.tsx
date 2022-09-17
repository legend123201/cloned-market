/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
// react-hook-form
import { SubmitHandler, useForm } from 'react-hook-form';
// yup
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
// mui
import { Box, CircularProgress, Stack, Typography } from '@mui/material';
// components
import ButtonGradient from 'components/CustomUI/ButtonGradient';
import FieldInput from 'components/CustomField/FieldInput';
// models
import { NFT, OptionSelectCustom, Response } from 'models';
// styled
import { ErrorMessage } from '../Common/styled';
// apis
import { wormholeContractFunction } from 'utils/contract/wormholeContractFunction';

const { getTicketCardPrice } = wormholeContractFunction();

export interface IFormBuyTicketCardInputs {
	amount: number;
}

export interface IFormBuyTicketCardProps {
	ticketCard: NFT;
	onSubmit: SubmitHandler<IFormBuyTicketCardInputs>;
}

export default function FormBuyTicketCard({ ticketCard, onSubmit }: IFormBuyTicketCardProps) {
	// useState
	const [ticketCardPrice, setTicketCardPrice] = useState<number>(0);
	const [amountState, setAmountState] = useState<number>(0);

	// useEffect
	// get ticket card price
	useEffect(() => {
		(async () => {
			setTicketCardPrice(await getTicketCardPrice(ticketCard.chainId));
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// react hook form
	const schema = yup
		.object({
			amount: yup
				.number()
				.integer()
				.min(1)
				.max(100)
				.transform((cv, ov) => {
					// handle case not enter a number throw error: NaN cast from ""
					return ov === '' ? undefined : cv;
				})
				.required(),
		})
		.required();

	// functions
	const onChangeAmount = (e: any) => {
		const amount = Number(e.target.value);
		if (!isNaN(amount)) {
			setAmountState(amount);
		} else {
			setAmountState(0);
		}
	};

	const {
		register,
		handleSubmit,
		setValue,
		getValues,
		formState: { errors, isSubmitting },
		reset,
	} = useForm<IFormBuyTicketCardInputs>({
		resolver: yupResolver(schema),
	});

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Stack spacing={2} sx={{ mt: 2 }}>
				<Stack direction="row" justifyContent="space-between">
					<Typography variant="body2">Token id</Typography>
					<Typography variant="body2">{ticketCard.itemTokenId}</Typography>
				</Stack>

				<Stack direction="row" justifyContent="space-between">
					<Typography variant="body2">Ticket price:</Typography>
					<Typography variant="body2">{ticketCardPrice} MST</Typography>
				</Stack>
			</Stack>

			<Box sx={{ mb: 1, mt: 2 }}>
				<Typography variant="h6">Amount</Typography>

				<FieldInput
					id="amount"
					type="number"
					registerHookForm={{ ...register('amount') }}
					onChange={onChangeAmount}
					placeholder="Ex: 1, 2,..."
				/>

				{errors.amount?.message && <ErrorMessage>{errors.amount?.message}</ErrorMessage>}
			</Box>

			<Stack>
				<Stack direction="row" justifyContent="space-between">
					<Typography variant="body2">Total:</Typography>
					<Typography variant="body2">{amountState * ticketCardPrice} MST</Typography>
				</Stack>
			</Stack>

			<ButtonGradient sx={{ mt: 5, mb: 2 }} disabled={isSubmitting} type="submit">
				{isSubmitting && <CircularProgress sx={{ color: 'white', mr: 1 }} size={16} />}

				<span>{isSubmitting ? 'Purchasing...' : 'Purchase'}</span>
			</ButtonGradient>
		</form>
	);
}
