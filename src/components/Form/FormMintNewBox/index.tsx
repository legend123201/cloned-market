/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
// react-hook-form
import { SubmitHandler, useForm } from 'react-hook-form';
// yup
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
// mui
import { Box, CircularProgress, Typography } from '@mui/material';
// component
import ButtonGradient from 'components/CustomUI/ButtonGradient';
import SelectCustom from 'components/CustomField/SelectCustom';
import FieldInput from 'components/CustomField/FieldInput';
// models
import { OptionSelectCustom } from 'models';
// styled
import { Asterisk, ErrorMessage } from '../Common/styled';

export interface IFormMintNewBoxInputs {
	optionId: number;
	receiverAddress: string;
	amount: number;
}

const listOptionErc721: OptionSelectCustom<string>[] = [
	{ value: '0', name: 'Single' },
	{ value: '1', name: 'Multiple' },
	{ value: '2', name: 'Box' },
];

const listOptionErc1155: OptionSelectCustom<string>[] = [
	{ value: '6', name: 'Bronze Box' },
	{ value: '7', name: 'Silver Box' },
	{ value: '8', name: 'Gold Box' },
];

export interface IFormMintNewBoxProps {
	is1155Standard: boolean;
	onSubmit: SubmitHandler<IFormMintNewBoxInputs>;
}

export default function FormMintNewBox({ is1155Standard, onSubmit }: IFormMintNewBoxProps) {
	// useState
	const [currentOption, setCurrentOption] = useState<OptionSelectCustom<string>>(
		listOptionErc1155[0]
	);

	// useEffect
	// set default value for currentOptionId
	useEffect(() => {
		if (is1155Standard) {
			setValue('optionId', Number(listOptionErc1155[0].value));
		} else {
			setValue('optionId', Number(listOptionErc721[2].value));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [is1155Standard]);

	// react hook form
	const schema = yup
		.object({
			optionId: yup.number().required(),
			receiverAddress: yup.string().required(),
			amount: yup
				.number()
				.integer()
				.min(1)
				.max(10)
				.transform((cv, ov) => {
					// handle case not enter a number throw error: NaN cast from ""
					return ov === '' ? undefined : cv;
				})
				.test('require amount', 'Amount is required!', (value: any) => {
					// amount not required with box 721
					if (is1155Standard) {
						return Boolean(value);
					}
					return true;
				}),
		})
		.required();

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors, isSubmitting },
		reset,
	} = useForm<IFormMintNewBoxInputs>({
		resolver: yupResolver(schema),
	});

	// functions
	const onChangeOption = (option: OptionSelectCustom<string>) => {
		setCurrentOption(option);
		setValue('optionId', Number(option.value));
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Box>
				<Typography variant="h6" sx={{ mb: 1 }}>
					Mint option
				</Typography>

				<SelectCustom
					currentItem={currentOption}
					listItem={is1155Standard ? listOptionErc1155 : listOptionErc721}
					onChange={onChangeOption}
					sx={{}}
				/>

				{errors.optionId?.message && (
					<ErrorMessage>{errors.optionId?.message}</ErrorMessage>
				)}
			</Box>

			<Box>
				<Typography variant="h6" sx={{ mb: 1, mt: 2 }}>
					Receiver address
				</Typography>

				<FieldInput
					id="receiver-address"
					type="text"
					registerHookForm={{ ...register('receiverAddress') }}
					placeholder="Address..."
				/>

				{errors.receiverAddress?.message && (
					<ErrorMessage>{errors.receiverAddress?.message}</ErrorMessage>
				)}
			</Box>

			{is1155Standard && (
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

					{errors.amount?.message && (
						<ErrorMessage>{errors.amount?.message}</ErrorMessage>
					)}
				</Box>
			)}

			<ButtonGradient sx={{ mt: 3, mb: 2 }} disabled={isSubmitting} type="submit">
				{isSubmitting && <CircularProgress sx={{ color: 'white', mr: 1 }} size={16} />}

				<span>{isSubmitting ? 'Minting...' : 'Mint'}</span>
			</ButtonGradient>
		</form>
	);
}
