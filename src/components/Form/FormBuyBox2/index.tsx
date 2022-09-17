/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
// react-hook-form
import { SubmitHandler, useForm } from 'react-hook-form';
// yup
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
// mui
import { Box, CircularProgress, Stack, Typography } from '@mui/material';
// components
import SelectCustom from 'components/CustomField/SelectCustom';
import ButtonGradient from 'components/CustomUI/ButtonGradient';
import FieldInput from 'components/CustomField/FieldInput';
// models
import { NFT, OptionSelectCustom, Response } from 'models';
// styled
import { ErrorMessage } from '../Common/styled';
// redux
import { useSelector } from 'react-redux';
import { selectListNft } from 'redux/slices/collectionItemSlice';
import { selectAddress } from 'redux/slices/web3InfoSlice';
// apis
import nftsApi from 'apis/nftsApi';
import { wormholeContractFunction } from 'utils/contract/wormholeContractFunction';
import { useIsMounted } from 'hooks';

const { getBoxPrice } = wormholeContractFunction();
export interface IFormBuyBox2Inputs {
	amount: number;
}

export interface IFormBuyBox2Props {
	box: NFT;
	onSubmit: SubmitHandler<IFormBuyBox2Inputs>;
}

export default function FormBuyBox2({ box, onSubmit }: IFormBuyBox2Props) {
	// hooks
	const isMounted = useIsMounted();

	// useState
	const [currentBoxPrice, setCurrentBoxPrice] = useState<number>(0);
	const [amountState, setAmountState] = useState<number>(0);

	// useEffect
	useEffect(() => {
		(async () => {
			try {
				const boxPrice = await getBoxPrice(box.chainId, box.itemTokenId);
				if (isMounted()) setCurrentBoxPrice(boxPrice);
			} catch (error) {
				console.log(error);
			}
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
	} = useForm<IFormBuyBox2Inputs>({
		resolver: yupResolver(schema),
	});

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Stack spacing={2} sx={{ mt: 2 }}>
				<Stack direction="row" justifyContent="space-between">
					<Typography variant="body2">Quality</Typography>
					<Typography variant="body2">{box.itemName}</Typography>
				</Stack>

				<Stack direction="row" justifyContent="space-between">
					<Typography variant="body2">Box price:</Typography>
					<Typography variant="body2">{currentBoxPrice} MST</Typography>
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
					<Typography variant="body2">{amountState * currentBoxPrice} MST</Typography>
				</Stack>
			</Stack>

			<ButtonGradient sx={{ mt: 5, mb: 2 }} disabled={isSubmitting} type="submit">
				{isSubmitting && <CircularProgress sx={{ color: 'white', mr: 1 }} size={16} />}

				<span>{isSubmitting ? 'Purchasing...' : 'Purchase'}</span>
			</ButtonGradient>
		</form>
	);
}
