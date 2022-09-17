/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import ButtonGradient from 'components/CustomUI/ButtonGradient';
import { NFT } from 'models';
import { BoxAction } from 'redux/actions/OrderAction/boxAction';
import { selectAddress } from 'redux/slices/web3InfoSlice';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const { HarvestItem } = BoxAction();

export interface IButtonHarvestProps {
	chainId: number;
	slotIndex: number;
	refetchApi: Function;
}

export default function ButtonHarvest({ chainId, slotIndex, refetchApi }: IButtonHarvestProps) {
	// useState
	const [isHarvesting, setIsHarvesting] = useState<boolean>(false);

	// useSelector
	const userAddress = useSelector(selectAddress);

	const handleHarvestItem = async () => {
		if (!userAddress) {
			console.log('Missing field when harvesting item!');
			return;
		}

		try {
			setIsHarvesting(true);

			const dataHarvest = {
				chainId,
				userAddress,
				slotIndex,
			};

			await HarvestItem(dataHarvest);
			refetchApi();
		} catch (error) {
			console.log(error);
			toast.error('Some error occurred while harvesting item');
		} finally {
			setIsHarvesting(false);
		}
	};

	return (
		<Box>
			<ButtonGradient
				sx={{ width: 'fit-content', mt: 5, padding: '10px 50px' }}
				onClick={handleHarvestItem}
				disabled={isHarvesting}
			>
				{isHarvesting && <CircularProgress sx={{ color: 'white', mr: 1 }} size={16} />}
				<Typography variant="h6">{isHarvesting ? 'Harvesting...' : 'Harvest'}</Typography>
			</ButtonGradient>
		</Box>
	);
}
