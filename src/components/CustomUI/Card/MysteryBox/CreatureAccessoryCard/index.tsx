import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
// mui
import { Box, Stack, Typography } from '@mui/material';
// components
import ButtonGradient from 'components/CustomUI/ButtonGradient';
import ModalStake from 'components/pages/MysteryBox/ModalStake';
// models
import { NFT } from 'models';
// styled
import { ButtonBlue } from 'pages/Home/styled';
import { GridWrapperIGO, ItemWrapperIGO, OwnedAmount, TextWrapperIGO } from './styled';
// utils
import { sliceString, tokenErcFunction, wormholeContractFunction } from 'utils';
// redux
import { useSelector } from 'react-redux';
import { selectAddress } from 'redux/slices/web3InfoSlice';
import ModalUpgrade from 'components/pages/MysteryBox/ModalUpgrade';
import { useNavigate } from 'react-router-dom';
import { PATH_ITEM } from 'routes/path';

const { getBlanceOfToken1155 } = tokenErcFunction();
const { getRemainingCreatureAccessoryAmount } = wormholeContractFunction();

export interface ICreatureAccessoryCardProps {
	item: NFT;
	refetchApi: Function;
}

export default function CreatureAccessoryCard({ item, refetchApi }: ICreatureAccessoryCardProps) {
	// useState
	const [isOpenModalStake, setIsOpenModalStake] = useState<boolean>(false);
	const [isOpenModalUpgrade, setIsOpenModalUpgrade] = useState<boolean>(false);
	const [ownedQuantity, setOwnedQuantity] = useState<number>(0);
	const [creatureAccessoryAmount, setCreatureAccessoryAmount] = useState<number>(0);
	const navigate = useNavigate();

	// useSelector
	const userAddress = useSelector(selectAddress);

	// useEffect
	// get owned quantity
	useEffect(() => {
		(async () => {
			try {
				if (!userAddress || !item || !item.collectionInfo) return;

				const balance: number = await getBlanceOfToken1155(
					userAddress,
					item.collectionInfo.collectionAddress,
					item.itemTokenId
				);

				setOwnedQuantity(balance);
			} catch (error) {
				console.log(error);
				toast.error('Some error occurred while getting owned quantity!');
			}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userAddress, item]);

	// get creature accessory remaining amount
	useEffect(() => {
		(async () => {
			if (!item) return;

			try {
				const remainingCreatureAccessoryAmount: number =
					await getRemainingCreatureAccessoryAmount(item.chainId, item.itemTokenId);

				setCreatureAccessoryAmount(remainingCreatureAccessoryAmount);
			} catch (error) {
				toast.error('Some error occured when getting remaining box amount!');
			}
		})();
	}, [item]);

	// functions
	const isQualifiedToUpgrade = (): boolean => {
		if (Number(item.itemTokenId) < 5 && ownedQuantity > 0) {
			return true;
		}

		return false;
	};

	return (
		<ItemWrapperIGO>
			{/* Main image */}
			<Box
				onClick={() => navigate(`${PATH_ITEM.detail}/${item._id}`)}
				sx={{ maxHeight: '164px', overflow: 'hidden' }}
			>
				<img
					src={item.itemMedia}
					alt={item.itemName}
					style={{
						maxHeight: '164px',
						margin: 'auto',
						padding: '8px',
						borderRadius: '6px',
					}}
				/>
			</Box>

			{/* Owned quantity */}
			<OwnedAmount>
				<Typography variant="body1">x{ownedQuantity}</Typography>
			</OwnedAmount>

			{/* Item info */}
			<TextWrapperIGO onClick={() => navigate(`${PATH_ITEM.detail}/${item._id}`)}>
				<Typography mt={2} variant="h5" sx={{ fontWeight: '600' }} textAlign="center">
					{item.itemName}
				</Typography>
				<Box sx={{ flex: '1 1 0%' }} mt={2}>
					<Typography variant="body2">{sliceString(item.description, 68)}</Typography>
				</Box>
				<GridWrapperIGO>
					<Stack direction="row">
						<Typography sx={{ flex: '1 1 0%', opacity: '0.8' }} variant="body2">
							Total item(s)
						</Typography>
						<Typography variant="body2">{creatureAccessoryAmount}</Typography>
					</Stack>
					<Stack direction="row">
						<Typography sx={{ flex: '1 1 0%', opacity: '0.8' }} variant="body2">
							Upgrade Fee
						</Typography>
						<Typography variant="body2">{item.upgradeFee}</Typography>
					</Stack>
				</GridWrapperIGO>
			</TextWrapperIGO>
			{/* Button excution */}
			<Box
				mt={1}
				sx={{
					display: 'grid',
					gridTemplateColumns: 'repeat(2, 1fr)',
					gap: '10%',
					padding: '0px 16px 16px 16px',
				}}
			>
				<ButtonGradient
					onClick={() => {
						setIsOpenModalStake(true);
					}}
					disabled={ownedQuantity <= 0}
				>
					Stake Now
				</ButtonGradient>

				<ButtonBlue
					sx={{ width: '100%' }}
					onClick={() => {
						setIsOpenModalUpgrade(true);
					}}
					className={isQualifiedToUpgrade() ? '' : 'disabled'}
				>
					<Typography sx={{ fontSize: '14px' }}>Upgrade Now</Typography>
				</ButtonBlue>
			</Box>

			<ModalStake
				isOpen={isOpenModalStake}
				setIsOpen={setIsOpenModalStake}
				item={item}
				refetchApi={refetchApi}
			/>

			{isQualifiedToUpgrade() && (
				<ModalUpgrade
					isOpen={isOpenModalUpgrade}
					setIsOpen={setIsOpenModalUpgrade}
					item={item}
					refetchApi={refetchApi}
				/>
			)}
		</ItemWrapperIGO>
	);
}
