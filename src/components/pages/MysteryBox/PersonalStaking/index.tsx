/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
// mui
import { Box, CircularProgress, Grid, Stack, Typography, useTheme } from '@mui/material';
// styled
import { FilterGroup, IconStyled } from './styled';
// redux
import { useSelector } from 'react-redux';
import {
	selectListStakingSlotOfUser,
	selectLoading as selectLoadingListStakingSlotOfUser,
} from 'redux/slices/listStakingSlotOfUserSlice';
import {
	selectListStakedSlotOfUser,
	selectLoading as selectLoadingListStakedSlotOfUser,
} from 'redux/slices/listStakedSlotOfUserSlice';
// images
import iconWhite from 'assets/icons/filter-collection-white.webp';
import iconBlack from 'assets/icons/filter-collection-black.webp';
import ImageNoOffer from 'assets/icons/no-offers.webp';
// components
import SelectCustom from 'components/CustomField/SelectCustom';
import NoItemCircleCard from 'components/CustomUI/Card/NoItemCard/NoItemCircleCard';
import StakeInfo from '../StakeInfo';
import StakingItemCard from 'components/CustomUI/Card/MysteryBox/StankingItemCard';
import DividerGradient from 'components/CustomUI/DividerGradient';
import CustomSlider from 'components/CustomUI/CustomSlider';
// models
import { OptionSelectCustom, StakeSlot } from 'models';

const listStakeStatus: OptionSelectCustom<string>[] = [
	{ value: '0', name: 'Staking' },
	{ value: '1', name: 'Staked' },
];

const listItemToken: OptionSelectCustom<string>[] = [
	{ value: '0', name: 'Common' },
	{ value: '1', name: 'Rare' },
	{ value: '2', name: 'Epic' },
	{ value: '3', name: 'Legend' },
	{ value: '4', name: 'Mythic' },
	{ value: '5', name: 'Unique' },
];

const listOptionStake: OptionSelectCustom<string>[] = [
	{ name: '30 days', value: '0' },
	{ name: '60 days', value: '1' },
	{ name: '90 days', value: '2' },
];
export interface IPersonalStakingProps {
	currentSelectedSlot: StakeSlot | null;
	setCurrentSelectedSlot: Function;
	refetchApi: Function;
}

export default function PersonalStaking({
	currentSelectedSlot,
	setCurrentSelectedSlot,
	refetchApi,
}: IPersonalStakingProps) {
	const theme = useTheme();

	// vars
	const isLightTheme = theme.palette.mode === 'light';

	// useState
	const [currentListSlot, setCurrentListSlot] = useState<StakeSlot[]>([]);
	const [currentItemToken, setCurrentItemToken] = useState<OptionSelectCustom<string>>(
		listItemToken[0]
	);
	const [currentOptionStake, setCurrentOptionStake] = useState<OptionSelectCustom<string>>(
		listOptionStake[0]
	);
	const [currentStakeStatus, setCurrentStakeStatus] = useState<OptionSelectCustom<string>>(
		listStakeStatus[0]
	);

	// useSelector
	const listStakingSlot = useSelector(selectListStakingSlotOfUser);
	const isLoadingListStakingSlotOfUser = useSelector(selectLoadingListStakingSlotOfUser);
	const listStakedSlot = useSelector(selectListStakedSlotOfUser);
	const isLoadingListStakedSlotOfUser = useSelector(selectLoadingListStakedSlotOfUser);

	// useEffect
	useEffect(() => {
		if (currentStakeStatus.value === '0') {
			setCurrentListSlot(listStakingSlot);
		} else {
			setCurrentListSlot(listStakedSlot);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentStakeStatus, listStakingSlot, listStakedSlot]);

	// set default currentSelectedSlot
	useEffect(() => {
		(async () => {
			if (currentStakeStatus.value === '0' && listStakingSlot.length > 0) {
				setCurrentSelectedSlot(listStakingSlot[0]);
			} else if (currentStakeStatus.value === '1' && listStakedSlot.length > 0) {
				setCurrentSelectedSlot(listStakedSlot[0]);
			}
		})();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [listStakingSlot, listStakedSlot, currentStakeStatus]);

	// functions
	const onChangeItemToken = (option: OptionSelectCustom<string>) => {
		setCurrentItemToken(option);
	};

	const onChangeOptionStake = (option: OptionSelectCustom<string>) => {
		setCurrentOptionStake(option);
	};

	const onChangeStakeStatus = (option: OptionSelectCustom<string>) => {
		setCurrentStakeStatus(option);
	};

	const renderListSlot = (list: StakeSlot[]) => {
		if (list.length > 0) {
			return list
				.map((slot: StakeSlot, index: number) => {
					if (list.length < 6) {
						return (
							<StakingItemCard
								key={index}
								currentSelectedSlot={currentSelectedSlot}
								setCurrentSelectedSlot={setCurrentSelectedSlot}
								componentIndex={index}
								slot={list[index]}
							/>
						);
					} else {
						if (index < list.length && index % 2 === 0) {
							return (
								<Stack key={index} spacing={3}>
									<StakingItemCard
										currentSelectedSlot={currentSelectedSlot}
										setCurrentSelectedSlot={setCurrentSelectedSlot}
										componentIndex={index}
										slot={list[index]}
									/>

									{index + 1 < list.length && (
										<StakingItemCard
											currentSelectedSlot={currentSelectedSlot}
											setCurrentSelectedSlot={setCurrentSelectedSlot}
											componentIndex={index + 1}
											slot={list[index + 1]}
										/>
									)}
								</Stack>
							);
						} else {
							return null;
						}
					}
				})
				.filter((item: any) => Boolean(item));
		}
	};

	return (
		<Box>
			<FilterGroup>
				<SelectCustom
					currentItem={currentItemToken}
					listItem={listItemToken}
					onChange={onChangeItemToken}
					sx={{ minWidth: '140px' }}
				/>

				<SelectCustom
					currentItem={currentOptionStake}
					listItem={listOptionStake}
					onChange={onChangeOptionStake}
					sx={{ minWidth: '125px' }}
				/>

				<SelectCustom
					currentItem={currentStakeStatus}
					listItem={listStakeStatus}
					onChange={onChangeStakeStatus}
					sx={{ minWidth: '125px' }}
				/>
			</FilterGroup>

			{currentListSlot.length <= 0 &&
			!isLoadingListStakingSlotOfUser &&
			!isLoadingListStakedSlotOfUser ? (
				<>
					<Box sx={{ mt: 5, width: '100%' }}>
						<NoItemCircleCard title="No data yet!" image={ImageNoOffer} />
					</Box>
				</>
			) : (
				<>
					{isLoadingListStakingSlotOfUser || isLoadingListStakedSlotOfUser ? (
						<>
							<Stack alignItems="center" sx={{ mt: 10, width: '100%' }}>
								<CircularProgress />
							</Stack>
						</>
					) : (
						<>
							<StakeInfo
								currentSelectedSlot={currentSelectedSlot}
								refetchApi={refetchApi}
							/>

							<Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 8 }}>
								<IconStyled>
									{isLightTheme ? (
										<img src={iconBlack} alt="icon stake" />
									) : (
										<img src={iconWhite} alt="icon stake" />
									)}
								</IconStyled>
								<Typography variant="h5">
									{currentStakeStatus.value === '0'
										? 'Staking slots'
										: 'Staked slots'}
								</Typography>
							</Stack>

							<DividerGradient sx={{ height: '3px', mt: 1 }} />

							<Box sx={{ mt: 3 }}>
								<CustomSlider
									slidesPerView={5}
									loop={false}
									spaceBetween={30}
									slidesPerGroup={1}
									centeredSlides={false}
									slidesToShowPoint1358={5}
									slidesToShowPoint1093={4}
									slidesToShowPoint828={3}
									slidesToShowPoint547={1.5}
									slidesToShowPoint320={1}
									slidesToShowPoint0={1}
									renderItem={renderListSlot(currentListSlot)}
								/>
							</Box>
						</>
					)}
				</>
			)}
		</Box>
	);
}
