/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
// react-hook-form
import { SubmitHandler, useForm } from 'react-hook-form';
// yup
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
// models
import { NFT, OptionSelectCustom } from 'models';
// mui
import { Box, Checkbox, CircularProgress, Link, Stack, Typography, useTheme } from '@mui/material';
// components
import SelectCustom from 'components/CustomField/SelectCustom';
import FieldInput from 'components/CustomField/FieldInput';
import ButtonGradient from 'components/CustomUI/ButtonGradient';
// styled
import { Asterisk, ErrorMessage } from '../Common/styled';
// utils
import { tokenErcFunction } from 'utils';
import { selectAddress } from 'redux/slices/web3InfoSlice';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { RELATED_URLS } from '../../../constants';

const { getBlanceOfToken1155 } = tokenErcFunction();

export interface IFormStakeItemInputs {
	itemTokenId: number;
	amount: number;
	optionStake: number;
}

// const listItemToken: OptionSelectCustom<string>[] = [
// 	{ value: '0', name: 'Common' },
// 	{ value: '1', name: 'Rare' },
// 	{ value: '2', name: 'Epic' },
// 	{ value: '3', name: 'Legend' },
// 	{ value: '4', name: 'Mythic' },
// 	{ value: '5', name: 'Unique' },
// ];

const listOptionStake: OptionSelectCustom<string>[] = [
	{ name: '30 days', value: '0' },
	{ name: '60 days', value: '1' },
	{ name: '90 days', value: '2' },
];

export interface IFormStakeItemProps {
	currentItem: NFT;
	onSubmit: SubmitHandler<IFormStakeItemInputs>;
}

export default function FormStakeItem({ currentItem, onSubmit }: IFormStakeItemProps) {
	const theme = useTheme();

	// useState
	const [ownedQuantity, setOwnedQuantity] = useState<number>(0);
	const [isGettingBalance, setIsGettingBalance] = useState<boolean>(false);
	const [checked, setChecked] = useState<boolean>(false);
	const [currentOptionStake, setCurrentOptionStake] = useState<OptionSelectCustom<string>>(
		listOptionStake[0]
	);

	// useSelector
	const userAddress = useSelector(selectAddress);

	// useEffect
	// set default value for itemTokenId and duration
	useEffect(() => {
		setValue('itemTokenId', Number(currentItem.itemTokenId));
		setValue('optionStake', Number(currentOptionStake.value));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// get owned quantity
	useEffect(() => {
		(async () => {
			try {
				setIsGettingBalance(true);

				if (!userAddress || !currentItem || !currentItem.collectionInfo) return;

				const balance: number = await getBlanceOfToken1155(
					userAddress,
					currentItem.collectionInfo.collectionAddress,
					currentItem.itemTokenId
				);

				setOwnedQuantity(balance);
			} catch (error) {
				console.log(error);
				toast.error('Some error occurred while getting owned quantity!');
			} finally {
				setIsGettingBalance(false);
			}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userAddress]);

	// react hook form
	const schema = yup
		.object({
			itemTokenId: yup.number().required(),
			amount: yup
				.number()
				.integer()
				.min(1)
				.max(ownedQuantity)
				.transform((cv, ov) => {
					// handle case not enter a number throw error: NaN cast from ""
					return ov === '' ? undefined : cv;
				})
				.required(),
			optionStake: yup.number().required(),
		})
		.required();

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors, isSubmitting },
		reset,
	} = useForm<IFormStakeItemInputs>({
		resolver: yupResolver(schema),
	});

	// functions
	const onChangeDateRange = (option: OptionSelectCustom<string>) => {
		setCurrentOptionStake(option);
		setValue('optionStake', Number(option.value));
	};

	const handleChangeCheckBox = (event: React.ChangeEvent<HTMLInputElement>) => {
		setChecked(event.target.checked);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Stack
				sx={{ mt: 2 }}
				direction="row"
				alignItems="center"
				justifyContent="space-between"
			>
				<Typography variant="h6">Quality</Typography>
				<Typography variant="h6">{currentItem.itemName}</Typography>
			</Stack>

			<Box sx={{ mt: 2 }}>
				<Typography variant="h6" sx={{ mb: 1 }}>
					Quantity
				</Typography>

				<FieldInput
					id="amount"
					type="number"
					registerHookForm={{ ...register('amount') }}
					placeholder="Ex: 1, 2,..."
					readOnly={isGettingBalance}
				/>

				<Typography variant="body2" sx={{ mt: 0.25, textAlign: 'right', opacity: 0.5 }}>
					{ownedQuantity} available
				</Typography>

				{errors.amount?.message && <ErrorMessage>{errors.amount?.message}</ErrorMessage>}
			</Box>

			<Box>
				<Typography variant="h6" sx={{ mb: 1 }}>
					Duration
				</Typography>

				<SelectCustom
					currentItem={currentOptionStake}
					listItem={listOptionStake}
					onChange={onChangeDateRange}
					sx={{}}
				/>

				{errors.optionStake?.message && (
					<ErrorMessage>{errors.optionStake?.message}</ErrorMessage>
				)}
			</Box>

			{/* <Box sx={{ mt: 2 }}>
				<Stack direction="row" alignItems="center" justifyContent="space-between">
					<Typography variant="body1">Starting</Typography>
					<Typography variant="body1">June 01, 2022 at 17:09 PM</Typography>
				</Stack>

				<Stack
					direction="row"
					alignItems="center"
					justifyContent="space-between"
					sx={{ mt: 1 }}
				>
					<Typography variant="body1">Ending</Typography>
					<Typography variant="body1">June 01, 2022 at 17:09 PM</Typography>
				</Stack>
			</Box> */}

			<Stack direction="row" alignItems="center" sx={{ marginLeft: '-10px', mt: 2 }}>
				<Checkbox checked={checked} aria-checked="false" onChange={handleChangeCheckBox} />
				<Typography variant="body2" component="span">
					I agree to MetaSpacecy
				</Typography>
				<Link
					variant="body2"
					sx={{
						ml: 0.5,
						color: theme.palette.text.special,
						cursor: 'pointer',
						'&:hover': {
							textDecoration: 'underline !important',
						},
					}}
					href={RELATED_URLS.termsOfService}
					target="_blank"
				>
					Terms of Service
				</Link>
			</Stack>

			<ButtonGradient sx={{ mt: 3, mb: 2 }} disabled={isSubmitting} type="submit">
				{isSubmitting && <CircularProgress sx={{ color: 'white', mr: 1 }} size={16} />}

				<span>{isSubmitting ? 'Staking...' : 'Stake'}</span>
			</ButtonGradient>
		</form>
	);
}
