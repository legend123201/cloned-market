/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Box, Grid, Input, Stack, Typography, useTheme } from '@mui/material';
import {
	ItemWrapperIGO,
	TextWrapperIGO,
	GridWrapperIGO,
	GridContainer,
	BrandTitle,
} from './styled';
import ButtonGradient from 'components/CustomUI/ButtonGradient';
import IgoForbit from 'assets/igo-forbit.webp';
import { PATH_IGO } from 'routes/path';

export interface IIGOOfferingProps {}

export default function IGOOffering(props: IIGOOfferingProps) {
	const theme = useTheme();
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
			<Box mt={8}>
				<Stack direction="row">
					<Typography variant="h3" sx={{ flex: '1 1 0%', fontStyle: 'italic' }}>
						All IGO Offerings
					</Typography>
					<Input placeholder="Search"></Input>
				</Stack>
				<Box>
					<GridContainer mt={8}>{renderItemIGOOffering()}</GridContainer>
				</Box>
				<Box
					mt={8}
					sx={{
						position: 'relative',
						color: 'white',
						fontStyle: 'italic',
					}}
				>
					<Box>
						<img
							src={IgoForbit}
							style={{ width: '100%', height: '100%', borderRadius: '12px' }}
							alt="background-forbit"
						/>
					</Box>
					<Box
						sx={{
							position: 'absolute',
							top: '10%',
							left: '10%',
							[theme.breakpoints.down(1200)]: {
								top: '5%',
							},
						}}
					>
						<Box
							sx={{
								[theme.breakpoints.down(1000)]: {
									display: 'none',
								},
							}}
						>
							<BrandTitle>Lauching on</BrandTitle>
							<BrandTitle>MetaSpacecy</BrandTitle>
							<Typography>Full support in project incubation.</Typography>
						</Box>
						<Box
							sx={{
								height: '40px',
								width: '180px',
								marginTop: '32px',
								[theme.breakpoints.down(600)]: {
									height: '30px',
									width: '120px',
									marginTop: '12px',
								},
							}}
						>
							<a
								target="_blank"
								href={`#${PATH_IGO.request}`}
								rel="noreferrer noopener"
							>
								<ButtonGradient>
									<Typography>Get Started</Typography>
								</ButtonGradient>
							</a>
						</Box>
					</Box>
				</Box>
			</Box>
		</>
	);
}
