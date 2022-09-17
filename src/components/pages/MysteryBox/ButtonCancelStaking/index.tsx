/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import ButtonGradient from 'components/CustomUI/ButtonGradient';
import { NFT } from 'models';
import { BoxAction } from 'redux/actions/OrderAction/boxAction';
import { selectAddress } from 'redux/slices/web3InfoSlice';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const { CancelStaking } = BoxAction();

export interface IButtonCancelStakingProps {
	chainId: number;
	slotIndex: number;
	refetchApi: Function;
}

export default function ButtonCancelStaking({
	chainId,
	slotIndex,
	refetchApi,
}: IButtonCancelStakingProps) {
	// useState
	const [isCanceling, setIsCanceling] = useState<boolean>(false);

	// useSelector
	const userAddress = useSelector(selectAddress);

	const handleCancelStaking = async () => {
		if (!userAddress) {
			console.log('Missing field when cancel staking!');
			return;
		}

		try {
			setIsCanceling(true);

			const dataCancelStaking = {
				chainId,
				userAddress,
				slotIndex,
			};

			await CancelStaking(dataCancelStaking);
			refetchApi();
		} catch (error) {
			console.log(error);
			toast.error('Some error occurred while cancel staking!');
		} finally {
			setIsCanceling(false);
		}
	};

	return (
		<Box>
			<ButtonGradient
				sx={{ width: 'fit-content', mt: 5, padding: '10px 50px' }}
				onClick={handleCancelStaking}
				disabled={isCanceling}
			>
				{isCanceling && <CircularProgress sx={{ color: 'white', mr: 1 }} size={16} />}
				<Typography variant="h6">
					{isCanceling ? 'Canceling...' : 'Cancel staking'}
				</Typography>
			</ButtonGradient>
		</Box>
	);
}
