import React from 'react';
// mui
import { Box, Stack, Typography } from '@mui/material';
import { NFT } from 'models';
import { ContainerOwnerAndCollectionAuctionDetail, DeviderGradientNext } from './styled';

export interface IBasicInfoProps {
	item: NFT | null | undefined;
}

export default function BasicInfo({ item }: IBasicInfoProps) {
	return (
		<>
			<Box>
				<Typography sx={{ fontSize: '3rem', fontWeight: '400', fontStyle: 'italic' }}>
					"{item?.itemName}"
				</Typography>
			</Box>
			<Box>
				<Stack direction="row" alignItems="center" justifyContent="space-between">
					<ContainerOwnerAndCollectionAuctionDetail>
						<img
							style={{
								width: '60px',
								height: '60px',
								borderRadius: '8px',
								marginRight: '20px',
							}}
							src="https://kenh14cdn.com/thumb_w/660/2017/youtubeparisnewsblogspotfr2bpicdumpfacebooktumblrtwitterinstagram2b2528442529-1511764399601.jpg"
							alt=""
						/>
						<Stack direction="column">
							<Typography>Created by</Typography>
							<Typography>Vinh Tran</Typography>
						</Stack>
					</ContainerOwnerAndCollectionAuctionDetail>
					<DeviderGradientNext></DeviderGradientNext>
					<ContainerOwnerAndCollectionAuctionDetail>
						<img
							style={{
								maxWidth: '60px',
								maxHeight: '60px',
								borderRadius: '8px',
								marginRight: '20px',
							}}
							src="https://thuythithi.com/wp-content/uploads/2021/05/khi-meo-ngu-van-phat-ra-tieng-keu-la-dau-hieu-gi1.jpg"
							alt=""
						/>
						<Stack direction="column">
							<Typography>Colection</Typography>
							<Typography>Vinh Tran X</Typography>
						</Stack>
					</ContainerOwnerAndCollectionAuctionDetail>
				</Stack>
			</Box>
		</>
	);
}
