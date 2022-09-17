/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
// react-hook-form
import { Resolver, SubmitHandler, useForm } from 'react-hook-form';
// yup
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
// mui
import { Box, Checkbox, CircularProgress, Stack, Tooltip, Typography } from '@mui/material';
// component
import ButtonGradient from 'components/CustomUI/ButtonGradient';
import Modal from 'components/CustomUI/Modal';
import SelectCustom from 'components/CustomField/SelectCustom';
import FieldInput from 'components/CustomField/FieldInput';
// models
import { Asterisk, ErrorMessage } from '../Common/styled';
import { NFT } from 'models';
import { selectAddress } from 'redux/slices/web3InfoSlice';
import { toast } from 'react-toastify';
import { tokenErcFunction } from 'utils';
import { useSelector } from 'react-redux';
const { getBlanceOfToken1155 } = tokenErcFunction();
export interface IFormUnpackBoxInputs {
	receiverAddress: string;
	amount: number;
}

export const unpackBoxDescription = [
	{
		description:
			'Silver box contains only one MCA (MetaSpacecy Creature Accessory) which is randomly generated when unboxing.',
	},
	{
		description:
			'Gold box contains 2 MCA (MetaSpacecy Creature Accessory): one of which is guaranteed by a rare MCA and another one is randomly generated when unboxing.',
	},
	{
		description:
			'Platinum box contains 2 MCA (MetaSpacecy Creature Accessory): one of which is guaranteed by a epic MCA and another one is randomly generated when unboxing.',
	},
	{
		description:
			'Diamond box contains 2 MCA (MetaSpacecy Creature Accessory): one of which is guaranteed by a legend MCA and another one is randomly generated when unboxing.',
	},
	{
		description:
			'Vibranium box contains 2 MCA (MetaSpacecy Creature Accessory): one of which is guaranteed by a mythic MCA and another one is randomly generated when unboxing.',
	},
	{
		description:
			'Infinity box contains 2 MCA (MetaSpacecy Creature Accessory): one of which is guaranteed by a unique MCA and another one is randomly generated when unboxing.',
	},
];

export interface IFormUnpackBoxProps {
	currentBox: NFT;
	onSubmit: SubmitHandler<IFormUnpackBoxInputs>;
}

export default function FormUnpackBox({ currentBox, onSubmit }: IFormUnpackBoxProps) {
	// useState
	const [checked, setChecked] = useState<boolean>(false);
	const [ownedQuantity, setOwnedQuantity] = useState<number>(0);
	const [isGettingBalance, setIsGettingBalance] = useState<boolean>(false);

	// useSelector
	const userAddress = useSelector(selectAddress);

	// useEffect
	// get owned quantity
	useEffect(() => {
		(async () => {
			try {
				setIsGettingBalance(true);

				if (!userAddress || !currentBox || !currentBox.collectionInfo) return;

				const balance: number = await getBlanceOfToken1155(
					userAddress,
					currentBox.collectionInfo.collectionAddress,
					currentBox.itemTokenId
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

	useEffect(() => {
		if (!userAddress) return;
		setValue('receiverAddress', userAddress);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userAddress]);

	// react hook form
	const schema = yup
		.object({
			receiverAddress: yup.string().required(),
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
		})
		.required();

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors, isSubmitting },
		reset,
	} = useForm<IFormUnpackBoxInputs>({
		resolver: yupResolver(schema),
	});

	// functions
	const handleChangeCheckBox = (event: React.ChangeEvent<HTMLInputElement>) => {
		setChecked(event.target.checked);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Box>
				<Typography variant="h6" sx={{ mb: 1, mt: 2 }}>
					Receiver address
				</Typography>

				<Box>
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
			</Box>

			<Box>
				<Typography variant="h6" sx={{ mb: 1, mt: 2 }}>
					Amount
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
			<Typography variant="body2" sx={{ mt: 2 }}>
				{unpackBoxDescription[Number(currentBox.itemTokenId)].description}
			</Typography>
			<Stack direction="row" alignItems="center" sx={{ marginLeft: '-10px', mt: 2, mb: 2 }}>
				<Checkbox checked={checked} aria-checked="false" onChange={handleChangeCheckBox} />
				<Typography variant="body2" component="span">
					I understand.
				</Typography>
			</Stack>

			<ButtonGradient sx={{ mt: 3, mb: 2 }} disabled={!checked || isSubmitting} type="submit">
				{isSubmitting && <CircularProgress sx={{ color: 'white', mr: 1 }} size={16} />}

				<span>{isSubmitting ? 'Unpacking...' : 'Unpack'}</span>
			</ButtonGradient>
		</form>
	);
}
