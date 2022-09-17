/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import { Box, Grid, Stack, Typography, useTheme } from '@mui/material';
import collectionApi from 'apis/collectionApi';
import userApi from 'apis/userApi';
import { PriceStyle } from 'components/CustomUI/Card/NFTItemCard/styled';
import CopyToClipboardButton from 'components/CustomUI/CopyToClipboardButton';
import { Collection, Response, User } from 'models';
import React, { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectAuctionDetail } from 'redux/slices/auctionDetailByAuctionIdSlice';
import { sliceAddress, sliceString } from 'utils';
import { ContainerOwnerAndCollectionAuctionDetail, DeviderGradientNext } from './styled';

import ItemWhite from 'assets/icons/filter-collection-white.webp';
import GrapWhite from 'assets/icons/graph-white.webp';
import OfferWhite from 'assets/icons/offer-white.webp';

export interface IAppProps {}

export default function ItemNameAndOwner(props: IAppProps) {
	const auctionDetail = useSelector(selectAuctionDetail);
	const [resUser, setResUser] = useState<User>();
	const [resCollection, setResCollection] = useState<Collection>();
	const theme = useTheme();

	//Get collection detail

	useEffect(() => {
		if (!auctionDetail) {
			return;
		}
		(async () => {
			try {
				const responseCollection: Response<any> =
					await collectionApi.getCollectionDetailById(auctionDetail.collectionId);
				setResCollection(responseCollection.data);
			} catch (error) {
				console.log('error message', error);
			}
		})();
	}, [auctionDetail]);
	// GET USER INFO
	useEffect(() => {
		if (!auctionDetail) {
			return;
		}
		(async () => {
			try {
				const resUser: Response<User> = await userApi.getUserByAddress(
					auctionDetail.seller
				);
				setResUser(resUser.data);
			} catch (error) {
				console.log('error message', error);
			}
		})();
	}, [auctionDetail]);
	// console.log('alo 123', resCollection);
	return (
		<Fragment>
			<Box>
				<Typography variant="h2" sx={{ fontWeight: '400', fontStyle: 'italic' }}>
					"{auctionDetail?.infoINO.nameINO}"
				</Typography>
				{/* <Stack direction="row" sx={{ margin: '16px 0', fontWeight: '500' }}>
					<span>Owner: {sliceAddress(auctionDetail?.seller, 8, 5)} </span>
					<CopyToClipboardButton text={auctionDetail?.seller} placementTooltip="top" />
				</Stack> */}
			</Box>
			<Box>
				<Grid container spacing={1}>
					<Grid item xs>
						<ContainerOwnerAndCollectionAuctionDetail>
							<Box sx={{ width: '60px', height: '60px' }}>
								<img
									style={{
										// width: '100%',
										height: '100%',
										borderRadius: '8px',
										marginRight: '20px',
									}}
									src={resUser?.avatar}
									alt=""
								/>
							</Box>

							<Stack marginLeft={2} direction="column">
								<Typography>Seller :</Typography>
								<Typography>{resUser?.username}</Typography>
							</Stack>
						</ContainerOwnerAndCollectionAuctionDetail>
					</Grid>
					<Grid
						item
						sx={{
							[theme.breakpoints.down(1000)]: {
								display: 'none',
							},
						}}
					>
						<DeviderGradientNext></DeviderGradientNext>
					</Grid>
					<Grid item xs>
						<ContainerOwnerAndCollectionAuctionDetail>
							<Box sx={{ width: '60px', height: '60px' }}>
								<img
									style={{
										// width: '100%',
										height: '100%',
										borderRadius: '8px',
										marginRight: '20px',
									}}
									src={resCollection?.logo}
									alt=""
								/>
							</Box>

							<Stack marginLeft={2} direction="column">
								<Typography>Colection:</Typography>
								<Typography>
									{sliceString(String(resCollection?.collectionName), 20)}
								</Typography>
							</Stack>
						</ContainerOwnerAndCollectionAuctionDetail>
					</Grid>
				</Grid>
			</Box>
		</Fragment>
	);
}
