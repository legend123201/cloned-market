/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
// react-hook-form
import { SubmitHandler, useForm } from 'react-hook-form';
// yup
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
// models
import { NFT, OptionSelectCustom } from 'models';
// mui
import { Box, CircularProgress, Stack, Typography } from '@mui/material';
// components
import SelectCustom from 'components/CustomField/SelectCustom';
import FieldInput from 'components/CustomField/FieldInput';
import ButtonGradient from 'components/CustomUI/ButtonGradient';
// styled
import { Asterisk, ErrorMessage } from '../Common/styled';

export interface IFormUpgradeItemInputs {
	toOptionId: number;
	amount: number;
}

export interface IFormUpgradeItemProps {
	item: NFT;
	upgradeAmountNeeded: number;
	upgradeFee: number;
	onSubmit: SubmitHandler<IFormUpgradeItemInputs>;
}

export default function FormUpgradeItem({
	item,
	upgradeAmountNeeded,
	upgradeFee,
	onSubmit,
}: IFormUpgradeItemProps) {
	// useState
	const [amountState, setAmountState] = useState<number>(0);

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
		formState: { errors, isSubmitting },
		reset,
	} = useForm<IFormUpgradeItemInputs>({
		resolver: yupResolver(schema),
	});

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Box>
				<Typography variant="h6" sx={{ mb: 1, mt: 2, fontWeight: '700' }}>
					Amount
				</Typography>

				<FieldInput
					id="amount"
					type="number"
					registerHookForm={{ ...register('amount') }}
					onChange={onChangeAmount}
					placeholder="Ex: 1, 2,..."
				/>

				{errors.amount?.message && <ErrorMessage>{errors.amount?.message}</ErrorMessage>}
			</Box>

			<Box sx={{ mt: 2 }}>
				<Typography variant="h6" sx={{ fontWeight: '700' }}>
					Total
				</Typography>
				<Stack direction="row" justifyContent="space-between">
					<Typography variant="body2">Amount of item:</Typography>
					<Typography variant="body2">
						{amountState * upgradeAmountNeeded} {item.itemName}
					</Typography>
				</Stack>
				<Stack direction="row" justifyContent="space-between">
					<Typography variant="body2">Upgrade fee:</Typography>
					<Typography variant="body2">{amountState * upgradeFee} MST</Typography>
				</Stack>
			</Box>

			<ButtonGradient sx={{ mt: 3, mb: 2 }} disabled={isSubmitting} type="submit">
				{isSubmitting && <CircularProgress sx={{ color: 'white', mr: 1 }} size={16} />}

				<span>{isSubmitting ? 'Upgrading...' : 'Upgrade'}</span>
			</ButtonGradient>
		</form>
	);
}
