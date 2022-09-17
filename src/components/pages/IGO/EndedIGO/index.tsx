/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';
import { Box, Button, Input, Stack, Typography } from '@mui/material';
import {
	GridEnedIgoContainer,
	ItemEndIgo,
	WrapperImage,
	BorderApplyIGO,
	ButtonApplyIGO,
} from './styled';
import { sliceString } from 'utils';
import { PATH_IGO } from 'routes/path';

export interface IEndedIGOProps {}

export default function EndedIGO(props: IEndedIGOProps) {
	const renderItemIgo = () => {
		return new Array(12).fill(null).map((index) => (
			<ItemEndIgo key={index}>
				<Box sx={{ width: '200px' }}>
					<WrapperImage>
						<img
							src="https://img.freepik.com/premium-vector/astronauts-ride-shark-space-with-planets_67811-514.jpg?w=2000"
							alt=""
						/>
					</WrapperImage>
				</Box>

				<Stack direction="column">
					<Typography sx={{ opacity: '0.5' }}>NFT SpaceX</Typography>
					<Typography variant="h5" sx={{ flex: '1 1 0%' }}>
						{/* {sliceString('The Star Sharks', 14)} */} Hello
					</Typography>
					<Typography>ATH: $0.99</Typography>
				</Stack>
			</ItemEndIgo>
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
				<Box mt={4}>
					<GridEnedIgoContainer>{renderItemIgo()}</GridEnedIgoContainer>
				</Box>
				<BorderApplyIGO>
					<Typography variant="h2" sx={{ fontStyle: 'italic' }}>
						What is IGO?
					</Typography>
					<Typography>
						IGOs, or Initial Game Offering, are NFT assets from top-tier gaming projects
						available exclusively on MetaSpacecy NFT. The assets can launch either via
						auction, fixed price or mystery boxes. IGOs are purely for gaming and all
						drop content will consist of in-game assets such as early-access passes,
						weapons and items, exclusive MetaSpacecy cosmetics and skins and much more!
						If you're interested in launching an IGO collection , please complete the
						application form. The MetaSpacecy NFT team will review and contact you if
						your submission is approved. For more questions, please send to email.
					</Typography>
					<a target="_blank" href={`#${PATH_IGO.request}`} rel="noreferrer noopener">
						<ButtonApplyIGO>Apply IGO</ButtonApplyIGO>
					</a>
				</BorderApplyIGO>
			</Box>
		</>
	);
}
