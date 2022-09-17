/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
// redux
import { RootState } from 'redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { selectAddress, selectChainId } from 'redux/slices/web3InfoSlice';
import {
	selectListBoxesOfUser,
	selectLoading as selectLoadingListBoxesOfUser,
	resetAll as resetAllListBoxesOfUser,
} from 'redux/slices/listBoxesOfUserSlice';
import {
	selectListItemsFromBoxesOfUser,
	selectLoading as selectLoadingListItemsFromBoxesOfUser,
	resetAll as resetAllListItemsFromBoxesOfUser,
} from 'redux/slices/listItemsFromBoxesOfUserSlice';
// actions
import { fetchListBoxesOfUser } from 'redux/actions/listBoxesOfUserAction';
import { fetchListItemsFromBoxesOfUser } from 'redux/actions/listItemsFromBoxesOfUserAction';
// mui
import { Box, CircularProgress, Stack } from '@mui/material';
// components
import AssetInfo from '../../AssetInfo';
import NoItemCircleCard from 'components/CustomUI/Card/NoItemCard/NoItemCircleCard';
import CustomSlider from 'components/CustomUI/CustomSlider';
import AssetBoxCard from 'components/CustomUI/Card/MysteryBox/AssetBoxCard';
// models
import { NFT } from 'models';
// images
import ImageNoOffer from 'assets/icons/no-offers.webp';

export interface IAssetsTabProps {}

export default function AssetsTab(props: IAssetsTabProps) {
	const dispatch = useDispatch();

	// useState
	const [currentSelectedAsset, setCurrentSelectedAsset] = useState<NFT | null>(null);
	const [refetchApiState, setRefetchApiState] = useState<boolean>(false);

	// useSelector
	const userAddress = useSelector(selectAddress);
	const chainId = useSelector(selectChainId);
	const listBoxes = useSelector(selectListBoxesOfUser);
	const isLoadingListBoxesOfUser = useSelector(selectLoadingListBoxesOfUser);
	const listItemsFromBoxes = useSelector(selectListItemsFromBoxesOfUser);
	const isLoadingListItemsFromBoxesOfUser = useSelector(selectLoadingListItemsFromBoxesOfUser);

	// useEffect
	// fetch list boxes of user + fetch list item from boxes of user
	useEffect(() => {
		if (!userAddress || !chainId) return;

		dispatch(
			fetchListBoxesOfUser(
				userAddress,
				chainId,
				9999,
				1,
				true,
				executeAfterfetchListBoxesOfUser
			)
		);

		dispatch(
			fetchListItemsFromBoxesOfUser(
				userAddress,
				chainId,
				true,
				executeAfterfetchListItemsFromBoxesOfUser
			)
		);

		return () => {
			resetAllListBoxesOfUser();
			resetAllListItemsFromBoxesOfUser();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userAddress, chainId, refetchApiState]);

	// set default currentSelectedAsset
	useEffect(() => {
		if (
			(listBoxes.length > 0 || listItemsFromBoxes.length > 0) &&
			!isLoadingListBoxesOfUser &&
			!isLoadingListItemsFromBoxesOfUser
		) {
			setCurrentSelectedAsset(listBoxes.concat(listItemsFromBoxes)[0]);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isLoadingListBoxesOfUser, isLoadingListItemsFromBoxesOfUser]);

	// functions
	const refetchApi = () => {
		setRefetchApiState(!refetchApiState);
	};

	const executeAfterfetchListBoxesOfUser = (globalStateNewest: RootState) => {
		const { listBoxesOfUser } = globalStateNewest;

		if (!listBoxesOfUser.isSuccess) {
			toast.error(
				'Some error occur when getting your boxes! ' + listBoxesOfUser.errorMessage
			);
		}
	};

	const executeAfterfetchListItemsFromBoxesOfUser = (globalStateNewest: RootState) => {
		const { listItemsFromBoxesOfUser } = globalStateNewest;

		if (!listItemsFromBoxesOfUser.isSuccess) {
			toast.error(
				'Some error occur when getting your items from boxes! ' +
					listItemsFromBoxesOfUser.errorMessage
			);
		}
	};

	const renderListAsset = (list: NFT[]) => {
		if (list.length > 0) {
			return list.map((asset: NFT, index: number) => {
				return (
					<AssetBoxCard
						key={index}
						currentSelectedAsset={currentSelectedAsset}
						setCurrentSelectedAsset={setCurrentSelectedAsset}
						item={asset}
					/>
				);
			});
		}
	};

	return (
		<Box sx={{ mt: 5 }}>
			{listBoxes.length <= 0 &&
			listItemsFromBoxes.length <= 0 &&
			!isLoadingListBoxesOfUser &&
			!isLoadingListItemsFromBoxesOfUser ? (
				<>
					<NoItemCircleCard title="No data yet!" image={ImageNoOffer} />
				</>
			) : (
				<>
					{isLoadingListBoxesOfUser || isLoadingListItemsFromBoxesOfUser ? (
						<Stack alignItems="center" sx={{ mt: 10, width: '100%' }}>
							<CircularProgress />
						</Stack>
					) : (
						<>
							<AssetInfo
								refetchApi={refetchApi}
								currentSelectedAsset={currentSelectedAsset}
							/>

							<Box sx={{ mt: 10 }}>
								<CustomSlider
									slidesPerView={3}
									loop={false}
									spaceBetween={30}
									slidesPerGroup={1}
									centeredSlides={false}
									slidesToShowPoint1358={3}
									slidesToShowPoint1093={3}
									slidesToShowPoint828={2}
									slidesToShowPoint547={2}
									slidesToShowPoint320={1}
									slidesToShowPoint0={1}
									renderItem={renderListAsset(listBoxes)}
								/>
							</Box>
							<Box sx={{ mt: 5 }}>
								<CustomSlider
									slidesPerView={3}
									loop={false}
									spaceBetween={30}
									slidesPerGroup={1}
									centeredSlides={false}
									slidesToShowPoint1358={3}
									slidesToShowPoint1093={3}
									slidesToShowPoint828={2}
									slidesToShowPoint547={2}
									slidesToShowPoint320={1}
									slidesToShowPoint0={1}
									renderItem={renderListAsset(listItemsFromBoxes)}
								/>
							</Box>
						</>
					)}
				</>
			)}
		</Box>
	);
}
