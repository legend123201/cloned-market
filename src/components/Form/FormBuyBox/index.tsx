/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
// react-hook-form
import { SubmitHandler, useForm } from 'react-hook-form';
// yup
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
// mui
import { Box, CircularProgress, Typography } from '@mui/material';
// components
import SelectCustom from 'components/CustomField/SelectCustom';
import ButtonGradient from 'components/CustomUI/ButtonGradient';
import FieldInput from 'components/CustomField/FieldInput';
// models
import { NFT, OptionSelectCustom, Response } from 'models';
// styled
import { Asterisk, ErrorMessage } from '../Common/styled';
// redux
import { useSelector } from 'react-redux';
import { selectListNft } from 'redux/slices/collectionItemSlice';
import { selectAddress } from 'redux/slices/web3InfoSlice';
// apis
import nftsApi from 'apis/nftsApi';

export interface IFormBuyBoxInputs {
	boxId: string;
	boxTokenId: string;
	amount: number;
}

interface ValueSelectCustom {
	boxId: string;
	boxTokenId: string;
}

// const listOptionErc1155: OptionSelectCustom<string>[] = [
// 	{ value: '0', name: 'Silver Box' },
// 	{ value: '1', name: 'Gold Box' },
// 	{ value: '2', name: 'Platinum Box' },
// 	{ value: '3', name: 'Diamond Box' },
// 	{ value: '4', name: 'Vibranium Box' },
// 	{ value: '5', name: 'Infinity Box' },
// ];

export interface IFormBuyBoxProps {
	onSubmit: SubmitHandler<IFormBuyBoxInputs>;
}

export default function FormBuyBox({ onSubmit }: IFormBuyBoxProps) {
	// useState
	const [currentOption, setCurrentOption] =
		useState<OptionSelectCustom<ValueSelectCustom> | null>(null);

	// useSelector
	const listBoxesId = useSelector(selectListNft);
	const userAddress = useSelector(selectAddress);

	// vars
	const [listBoxesTemp, setListBoxesTemp] = useState<NFT[]>([]);

	const listBoxesTransformed: OptionSelectCustom<ValueSelectCustom>[] = listBoxesTemp.map(
		(box: NFT) => ({
			name: box.itemName,
			value: { boxId: box._id, boxTokenId: box.itemTokenId },
			image: box.itemMedia,
		})
	);

	console.log('listBoxesTransformed', listBoxesTransformed);

	// useEffect
	// set default value for boxId
	useEffect(() => {
		(async () => {
			if ((listBoxesId && listBoxesId.length > 0) || !userAddress) {
				try {
					const list: NFT[] = await Promise.all(
						listBoxesId.map(async (item: any) => {
							const res: Response<NFT> = await nftsApi.getLessNftInfoByTokenId({
								itemId: item._id ?? item,
								userAddress,
							});
							return res.data;
						})
					);

					setListBoxesTemp(list);

					setValue('boxId', String(list[0]._id));
					setValue('boxTokenId', String(list[0].itemTokenId));
					setCurrentOption({
						name: list[0].itemName,
						value: { boxId: list[0]._id, boxTokenId: list[0].itemTokenId },
						image: list[0].itemMedia,
					});
				} catch (error) {
					console.log(error);
					toast.error('Some error occurred while getting box detail!');
				}
			}
		})();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [listBoxesId, userAddress]);

	// react hook form
	const schema = yup
		.object({
			boxId: yup.string().required(),
			boxTokenId: yup.string().required(),
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

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors, isSubmitting },
		reset,
	} = useForm<IFormBuyBoxInputs>({
		resolver: yupResolver(schema),
	});

	// functions
	const onChangeOption = (option: OptionSelectCustom<ValueSelectCustom>) => {
		setCurrentOption(option);
		setValue('boxId', String(option.value.boxId));
		setValue('boxTokenId', option.value.boxTokenId);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Typography variant="h6" sx={{ mb: 1 }}>
				Mint option
			</Typography>

			<SelectCustom
				currentItem={currentOption}
				listItem={listBoxesTransformed}
				onChange={onChangeOption}
				sx={{}}
			/>

			{errors.boxId?.message && <ErrorMessage>{errors.boxId?.message}</ErrorMessage>}
			{console.log('errors', errors)}
			<Box>
				<Typography variant="h6" sx={{ mb: 1, mt: 2 }}>
					Amount
				</Typography>

				<FieldInput
					id="amount"
					type="number"
					registerHookForm={{ ...register('amount') }}
					placeholder="Ex: 1, 2,..."
				/>

				{errors.amount?.message && <ErrorMessage>{errors.amount?.message}</ErrorMessage>}
			</Box>

			<ButtonGradient sx={{ mt: 5, mb: 2 }} disabled={isSubmitting} type="submit">
				{isSubmitting && <CircularProgress sx={{ color: 'white', mr: 1 }} size={16} />}

				<span>{isSubmitting ? 'Purchasing...' : 'Purchase'}</span>
			</ButtonGradient>
		</form>
	);
}
