/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
// components
import LazyImageCustom from 'components/CustomUI/LazyImages/LazyImageCustom';
import ModalStake from '../ModalStake';
import ModalUnpack from '../ModalUnpack';
import ButtonBuyTicketCard from '../ButtonBuyTicketCard';
import ModalUpgrade from '../ModalUpgrade';
// mui
import { Box, CircularProgress, Grid, Stack, Typography } from '@mui/material';
// styled
import { AmountInfo, MainImage } from './styled';
// models
import { NFT } from 'models';
// redux
import { useSelector } from 'react-redux';
import { selectAddress } from 'redux/slices/web3InfoSlice';
// utils
import { tokenErcFunction } from 'utils';
import ButtonGradient from 'components/CustomUI/ButtonGradient';

const { getBlanceOfToken1155 } = tokenErcFunction();

export interface IAssetInfoProps {
	refetchApi: Function;
	currentSelectedAsset: NFT | null;
}

export default function AssetInfo({ refetchApi, currentSelectedAsset }: IAssetInfoProps) {
	// useState
	const [ownedQuantity, setOwnedQuantity] = useState<number>(0);
	const [isOpenModalUnpack, setIsOpenModalUnpack] = useState<boolean>(false);
	const [isOpenModalStake, setIsOpenModalStake] = useState<boolean>(false);
	const [isOpenModalUpgrade, setIsOpenModalUpgrade] = useState<boolean>(false);

	// useSelector
	const userAddress = useSelector(selectAddress);

	// get owned quantity
	useEffect(() => {
		(async () => {
			try {
				if (!userAddress || !currentSelectedAsset || !currentSelectedAsset.collectionInfo)
					return;

				const balance: number = await getBlanceOfToken1155(
					userAddress,
					currentSelectedAsset.collectionInfo.collectionAddress,
					currentSelectedAsset.itemTokenId
				);

				setOwnedQuantity(balance);
			} catch (error) {
				console.log(error);
				toast.error('Some error occurred while getting owned quantity!');
			}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userAddress, currentSelectedAsset]);

	return currentSelectedAsset ? (
		<Grid container spacing={3} columns={{ xs: 1, md: 2 }}>
			<Grid item xs={1}>
				<MainImage>
					<LazyImageCustom
						src={
							// 'https://res.cloudinary.com/dkgnummck/image/upload/w_480/q_auto:best,f_auto/v1655691489/Asset1155Picture/legend.webp'
							currentSelectedAsset.itemMedia
						}
						alt="item"
						wrapperPosition="absolute"
						imgStyle={{ borderRadius: '10px' }}
						type="progress"
						errorComponent={<>Some error occurred when downloading image.</>}
					/>
				</MainImage>
			</Grid>
			<Grid
				item
				xs={1}
				sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
			>
				<Box>
					<Stack direction="row" justifyContent="space-between">
						<Typography variant="h6">
							{currentSelectedAsset.collectionInfo?.collectionName}
						</Typography>

						<AmountInfo>
							<Typography variant="h4">x{ownedQuantity}</Typography>
						</AmountInfo>
					</Stack>

					<Typography variant="h1" sx={{ mt: 2.5, fontStyle: 'italic' }}>
						{currentSelectedAsset.itemName}
					</Typography>
					<Typography variant="body1" sx={{ mt: 1 }}>
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus natus
						voluptas iusto excepturi sequi eum, praesentium cumque laudantium ullam
						itaque nulla ex ipsa iste eligendi quisquam vitae sapiente hic magni!
					</Typography>

					<Stack direction="row" alignItems="center" spacing={2}>
						{currentSelectedAsset.isBox ? (
							<Box sx={{ mt: 3 }}>
								<ButtonGradient
									sx={{ width: 'fit-content', mt: 5, padding: '10px 50px' }}
									onClick={() => {
										setIsOpenModalUnpack(true);
									}}
									disabled={ownedQuantity <= 0}
								>
									<Typography variant="h6">Unpack</Typography>
								</ButtonGradient>

								<ModalUnpack
									isOpen={isOpenModalUnpack}
									setIsOpen={setIsOpenModalUnpack}
									item={currentSelectedAsset}
									refetchApi={refetchApi}
								/>
							</Box>
						) : (
							!currentSelectedAsset.itemName.includes('Ticket') && (
								<>
									<ButtonGradient
										sx={{ width: 'fit-content', mt: 5, padding: '10px 50px' }}
										onClick={() => {
											setIsOpenModalStake(true);
										}}
										disabled={ownedQuantity <= 0}
									>
										<Typography variant="h6">Stake now</Typography>
									</ButtonGradient>

									<ModalStake
										isOpen={isOpenModalStake}
										setIsOpen={setIsOpenModalStake}
										item={currentSelectedAsset}
										refetchApi={refetchApi}
									/>
								</>
							)
						)}
						{currentSelectedAsset.itemName.includes('NCA') &&
							Number(currentSelectedAsset.itemTokenId) < 5 && (
								<>
									<ButtonGradient
										sx={{ width: 'fit-content', mt: 5, padding: '10px 50px' }}
										onClick={() => {
											setIsOpenModalUpgrade(true);
										}}
									>
										<Typography variant="h6">Upgrade</Typography>
									</ButtonGradient>

									<ModalUpgrade
										isOpen={isOpenModalUpgrade}
										setIsOpen={setIsOpenModalUpgrade}
										item={currentSelectedAsset}
										refetchApi={refetchApi}
									/>
								</>
							)}

						{currentSelectedAsset.itemName.includes('Ticket') && (
							<ButtonBuyTicketCard
								ticketCard={currentSelectedAsset}
								refetchApi={refetchApi}
							/>
						)}
					</Stack>
				</Box>
			</Grid>
		</Grid>
	) : (
		<Stack alignItems="center" sx={{ mt: 10, width: '100%' }}>
			<CircularProgress />
		</Stack>
	);
}
