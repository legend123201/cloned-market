import { Box, Grid, Input, Stack, Typography } from '@mui/material';
import React from 'react';
import { ItemWrapperIGO, TextWrapperIGO, GridWrapperIGO, GridContainer } from './styled';

export interface IEarnAssetsProps {}

export default function EarnAssets(props: IEarnAssetsProps) {
	const renderItemIGOOffering = () => {
		return new Array(12).fill(null).map((index) => (
			<Grid key={index}>
				<ItemWrapperIGO>
					<Box sx={{ maxHeight: '300px', overflow: 'hidden' }}>
						<img
							src="https://images.squarespace-cdn.com/content/v1/58a01689414fb58de4dff268/1642138412461-U90N8JQ5LIOYFZEOMRDO/Astro+NFT.png?format=1500whttps://images.squarespace-cdn.com/content/v1/58a01689414fb58de4dff268/1642138412461-U90N8JQ5LIOYFZEOMRDO/Astro+NFT.png?format=1500w"
							alt=""
							style={{}}
						/>
					</Box>
					<TextWrapperIGO>
						<Typography
							mt={2}
							variant="h4"
							sx={{ fontWeight: '600' }}
							textAlign="center"
						>
							The StarSharks HomeLand NFT
						</Typography>
						<Box sx={{ flex: '1 1 0%' }} mt={2}>
							<Typography variant="body2">
								WIN NFT HORSE brings more closely at the concept of Play-to-earn and
								a new hold to earn, hold to play, and play-to-earn platform.WIN NFT
								HORSE is attempting to redefine the meaning of GameFi.
							</Typography>
						</Box>
						<GridWrapperIGO>
							<Stack direction="row">
								<Typography sx={{ flex: '1 1 0%', opacity: '0.8' }} variant="body2">
									Total Volume
								</Typography>
								<Typography variant="body2">621,342,432.02</Typography>
							</Stack>
							<Stack direction="row">
								<Typography sx={{ flex: '1 1 0%', opacity: '0.8' }} variant="body2">
									Floor Price
								</Typography>
								<Typography variant="body2">65 USDT</Typography>
							</Stack>
							<Stack direction="row">
								<Typography sx={{ flex: '1 1 0%', opacity: '0.8' }} variant="body2">
									Unit Sale Price
								</Typography>
								<Typography variant="body2">621,342,432.02</Typography>
							</Stack>
							<Stack direction="row">
								<Typography sx={{ flex: '1 1 0%', opacity: '0.8' }} variant="body2">
									Total Issue Units
								</Typography>
								<Typography variant="body2">621,342,432.02</Typography>
							</Stack>
						</GridWrapperIGO>
					</TextWrapperIGO>
				</ItemWrapperIGO>
			</Grid>
		));
	};
	return (
		<>
			<Stack direction="row">
				<Typography variant="h3" sx={{ flex: '1 1 0%', fontStyle: 'italic' }}>
					Mysterious Box
				</Typography>
				<Input placeholder="Search"></Input>
			</Stack>
			<Box>
				<GridContainer mt={8}>{renderItemIGOOffering()}</GridContainer>
			</Box>
		</>
	);
}
