/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
// redux
import { RootState } from 'redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { resetAll as resetListStakingSlot } from 'redux/slices/listStakingSlotOfUserSlice';
import { resetAll as resetListStakedSlot } from 'redux/slices/listStakedSlotOfUserSlice';
import { selectAddress, selectChainId } from 'redux/slices/web3InfoSlice';
// actions
import { fetchListStakingSlotOfUser } from 'redux/actions/listStakingSlotAction';
import { fetchListStakedSlotOfUser } from 'redux/actions/listStakedSlotAction';
// mui
import { Box, CircularProgress, Stack, Typography, useTheme } from '@mui/material';
// components
import InfiniteListStakingItem from 'components/CustomUI/InfiniteList/MysteryBox/InfiniteListStakingItem';
import PersonalStaking from '../../PersonalStaking';
import StakingPool from '../../StakingPool';
// models
import { Response, StakeSlot } from 'models';
// styled
import { SubTab } from './styled';
// apis
import stakeApi from 'apis/stakeApi';
// hooks
import { useIsMounted } from 'hooks';

export interface IStakingTabProps {}

export default function UserInfoStaking(props: IStakingTabProps) {
	const dispatch = useDispatch();
	const theme = useTheme();

	// hooks
	const isMounted = useIsMounted();

	// useState
	const [currentSelectedSlot, setCurrentSelectedSlot] = useState<StakeSlot | null>(null);
	const [currentSubTab, setCurrentSubTab] = useState<0 | 1>(0);
	const [refetchApiState, setRefetchApiState] = useState<boolean>(false);
	const [detailStakingPool, setDetailStakingPool] = useState<any>(null);
	const [isLoadingStakingPoolDetail, setIsLoadingStakingPoolDetail] = useState<boolean>(true);

	// useSelector
	const userAddress = useSelector(selectAddress);
	const chainId = useSelector(selectChainId);

	// useEffect
	useEffect(() => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	// fetch list staking slot
	useEffect(() => {
		if (!userAddress || !chainId) return;

		dispatch(
			fetchListStakingSlotOfUser(
				userAddress,
				chainId,
				'isStaking',
				true,
				executeAfterFetchStakingSlots
			)
		);

		return () => {
			dispatch(resetListStakingSlot());
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userAddress, chainId, refetchApiState]);

	// fetch list staked slot
	useEffect(() => {
		if (!userAddress || !chainId) return;

		dispatch(
			fetchListStakedSlotOfUser(
				userAddress,
				chainId,
				'isHarvest',
				true,
				executeAfterFetchStakedSlots
			)
		);

		return () => {
			dispatch(resetListStakedSlot());
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userAddress, chainId, refetchApiState]);

	// get staking pool detail
	useEffect(() => {
		(async () => {
			try {
				if (!chainId) return;

				const res: Response<any> = await stakeApi.getDetailStakingPool(chainId);
				if (isMounted()) setDetailStakingPool(res.data);
			} catch (error) {
				console.log(error);
				toast.error('Some error occured when getting staking pool detail!');
			} finally {
				if (isMounted()) setIsLoadingStakingPoolDetail(false);
			}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [chainId]);

	// functions
	const refetchApi = () => {
		setRefetchApiState(!refetchApiState);
	};

	const executeAfterFetchStakingSlots = (globalStateNewest: RootState) => {
		const { listStakingSlotOfUser } = globalStateNewest;

		if (!listStakingSlotOfUser.isSuccess) {
			toast.error(
				'Some error occur when getting all staking slots! ' +
					listStakingSlotOfUser.errorMessage
			);
		}
	};

	const executeAfterFetchStakedSlots = (globalStateNewest: RootState) => {
		const { listStakedSlotOfUser } = globalStateNewest;

		if (!listStakedSlotOfUser.isSuccess) {
			toast.error(
				'Some error occur when getting all staked slots! ' +
					listStakedSlotOfUser.errorMessage
			);
		}
	};

	return (
		<Box sx={{ mt: 5, position: 'relative' }}>
			{/* <Stack
				direction="row"
				spacing={2}
				sx={{
					[theme.breakpoints.down('md')]: {
						justifyContent: 'center',
					},
				}}
			>
				<SubTab
					className={currentSubTab === 0 ? 'active' : ''}
					onClick={() => {
						setCurrentSubTab(0);
					}}
				>
					<Typography variant="h5">Staking Pools</Typography>
				</SubTab>

				<SubTab
					className={currentSubTab === 1 ? 'active' : ''}
					onClick={() => {
						setCurrentSubTab(1);
					}}
				>
					<Typography variant="h5">User Details</Typography>
				</SubTab> */}

			{/* {isLoadingStakingPoolDetail ? (
				<Stack alignItems="center" sx={{ mt: 10, width: '100%' }}>
					<CircularProgress />
				</Stack>
			) : (
				<StakingPool detailStakingPool={detailStakingPool} />
			)} */}
			{/* {currentSubTab === 0 ? (
				
					<Stack alignItems="center" sx={{ mt: 10, width: '100%' }}>
						<CircularProgress />
					</Stack>
				) : (
					<StakingPool detailStakingPool={detailStakingPool} />
				)
			) : (
				<PersonalStaking
					currentSelectedSlot={currentSelectedSlot}
					setCurrentSelectedSlot={setCurrentSelectedSlot}
					refetchApi={refetchApi}
				/>
			)} */}
			<PersonalStaking
				currentSelectedSlot={currentSelectedSlot}
				setCurrentSelectedSlot={setCurrentSelectedSlot}
				refetchApi={refetchApi}
			/>
		</Box>
	);
}
