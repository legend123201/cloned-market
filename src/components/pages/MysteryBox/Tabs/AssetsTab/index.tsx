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
import { Box, CircularProgress, Grid, Stack, Typography } from '@mui/material';
// components
import AssetInfo from '../../AssetInfo';
import NoItemCircleCard from 'components/CustomUI/Card/NoItemCard/NoItemCircleCard';
import CustomSlider from 'components/CustomUI/CustomSlider';
import AssetBoxCard from 'components/CustomUI/Card/MysteryBox/AssetBoxCard';
// models
import { NFT } from 'models';
// images
import ImageNoOffer from 'assets/icons/no-offers.webp';
import { GridContainer } from './styled';
import { sliceString } from 'utils';
import { wormholeContractFunction } from 'utils/contract/wormholeContractFunction';
import ButtonGradient from 'components/CustomUI/ButtonGradient';
import { ButtonBlue } from 'pages/Home/styled';
import ModalStake from '../../ModalStake';
import CreatureAccessoryCard from 'components/CustomUI/Card/MysteryBox/CreatureAccessoryCard';
import SkeletonAssetBoxList from 'components/CustomUI/Skeleton/List/MysteryBox/SkeletonAssetBoxList';
import SkeletonBoxList from 'components/CustomUI/Skeleton/List/MysteryBox/SkeletonBoxList';
import SkeletonBoxCard from 'components/CustomUI/Skeleton/Item/Mysterybox/SkeletonBoxCard';
const { getUpgradeFee } = wormholeContractFunction();

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
	console.log('chainId', chainId);
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
	// Get Fee
	useEffect(() => {
		(async () => {
			if (!chainId) return;

			try {
				// const fee: number = await await getUpgradeFee(item.chainId, item.itemTokenId);
				// setBoxPrice(price);
			} catch (error) {
				toast.error('Some error occured when getting remaining box amount!');
			}
		})();
	}, [chainId]);

	//New UI
	const renderItemIGOOffering = () => {
		if (listItemsFromBoxes) {
			return listItemsFromBoxes.map((item: NFT, index: number) => (
				<Grid key={index}>
					<CreatureAccessoryCard item={item} refetchApi={refetchApi} />
				</Grid>
			));
		}
	};

	const listItemSkeleton = () => {
		return new Array(6)
			.fill(null)
			.map((item: any, index: number) => <SkeletonBoxCard key={index} />);
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
				<Box sx={{ mt: 2 }}>
					{isLoadingListBoxesOfUser || isLoadingListItemsFromBoxesOfUser ? (
						<Box padding="10px">
							<CustomSlider
								slidesPerView={4}
								loop={false}
								spaceBetween={30}
								slidesPerGroup={1}
								centeredSlides={false}
								slidesToShowPoint1358={4}
								slidesToShowPoint1093={2.5}
								slidesToShowPoint828={2}
								slidesToShowPoint547={1.5}
								slidesToShowPoint320={1}
								slidesToShowPoint0={1}
								renderItem={listItemSkeleton()}
							/>
						</Box>
					) : (
						<CustomSlider
							slidesPerView={4}
							loop={false}
							spaceBetween={30}
							slidesPerGroup={1}
							centeredSlides={false}
							slidesToShowPoint1358={4}
							slidesToShowPoint1093={2.5}
							slidesToShowPoint828={2}
							slidesToShowPoint547={1.5}
							slidesToShowPoint320={1}
							slidesToShowPoint0={1}
							renderItem={renderItemIGOOffering()}
						/>
					)}
				</Box>
			)}
		</Box>
	);
}
