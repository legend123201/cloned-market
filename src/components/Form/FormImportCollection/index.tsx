/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
// react-hook-form
import { SubmitHandler, useForm } from 'react-hook-form';
// yup
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
// constants
import { listBlockChain } from 'components/CustomUI/FilterItemGroup/FilterBlockChain';
// models
import { OptionSelectCustom } from 'models';
// mui
import { CircularProgress, Typography } from '@mui/material';
// components
import SelectCustom from 'components/CustomField/SelectCustom';
import FieldInput from 'components/CustomField/FieldInput';
import ButtonGradient from 'components/CustomUI/ButtonGradient';
// styled
import { Asterisk, ErrorMessage } from '../Common/styled';

export interface IFormImportCollectionInputs {
	chainId: number;
	collectionAddress: string;
}

const listBlockchainTransformed: OptionSelectCustom<string>[] = listBlockChain.map((item) => {
	return { name: item.name, value: String(item.chainId), image: item.chainImage };
});

export interface IFormImportCollectionProps {
	onSubmit: SubmitHandler<IFormImportCollectionInputs>;
}

export default function FormImportCollection({ onSubmit }: IFormImportCollectionProps) {
	// useState
	const [currentBlockchain, setCurrentBlockchain] = useState<OptionSelectCustom<string>>(
		listBlockchainTransformed[0]
	);

	// useEffect
	// set default value for chainId
	useEffect(() => {
		setValue('chainId', Number(currentBlockchain.value));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// react hook form
	const schema = yup
		.object({
			chainId: yup.number().required(),
			collectionAddress: yup.string().required(),
		})
		.required();

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors, isSubmitting },
		reset,
	} = useForm<IFormImportCollectionInputs>({
		resolver: yupResolver(schema),
	});

	// functions
	const onChangeBlockchain = (option: OptionSelectCustom<string>) => {
		setCurrentBlockchain(option);
		setValue('chainId', Number(option.value));
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Typography variant="h6" sx={{ mb: 1 }}>
				Blockchain
			</Typography>

			<SelectCustom
				currentItem={currentBlockchain}
				listItem={listBlockchainTransformed}
				onChange={onChangeBlockchain}
				sx={{}}
			/>

			{errors.chainId?.message && <ErrorMessage>{errors.chainId?.message}</ErrorMessage>}

			<Typography variant="h6" sx={{ mb: 1, mt: 5 }}>
				Contract address
			</Typography>

			<FieldInput
				id="collection-address"
				type="text"
				registerHookForm={{ ...register('collectionAddress') }}
				placeholder="Address..."
			/>

			{errors.collectionAddress?.message && (
				<ErrorMessage>{errors.collectionAddress?.message}</ErrorMessage>
			)}

			<ButtonGradient type="submit" sx={{ mt: 3, mb: 2 }} disabled={isSubmitting}>
				{isSubmitting && <CircularProgress sx={{ color: 'white', mr: 1 }} size={16} />}

				<span>{isSubmitting ? 'Importing...' : 'Import'}</span>
			</ButtonGradient>
		</form>
	);
}
