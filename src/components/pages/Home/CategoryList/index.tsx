/* eslint-disable @typescript-eslint/no-unused-vars */

import { Box, Stack, Typography, useTheme } from '@mui/material';
import {
	CollectionBackground,
	CollectionCardWrapper,
	CollectionLogo,
	CollectionLogoWrapper,
	CollectionName,
	ContentPart,
	CollectionInfo,
} from './styled';

import LazyImageCustom from 'components/CustomUI/LazyImages/LazyImageCustom';
import React, { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { PATH_CATEGORY, PATH_VIEWALL } from 'routes/path';

import OtherIMG from 'assets/images/category/other.webp';
import ArtworkIMG from 'assets/images/category/art.webp';
import MusicIMG from 'assets/images/category/music.webp';
import PhotographyIMG from 'assets/images/category/photo.webp';
import GamesIMG from 'assets/images/category/game.webp';
import SportIMG from 'assets/images/category/sport.webp';
import MetevarseIMG from 'assets/images/category/metaverse.webp';
import BoxIMG from 'assets/images/category/box.webp';
import CardIMG from 'assets/images/category/card.webp';
import { useNavigateSearch } from 'hooks';

export const ListCategory = [
	{
		id: 0,
		key: 0,
		title: 'Other',
		description:
			'Tokenise digital asset to authorize ownership in all of aspects of decentralized world.',
		background: OtherIMG,
		avatar: ArtworkIMG,
		link: `#${PATH_VIEWALL.collections}`,
		isFilter: true,
	},
	{
		id: 1,
		key: 1,
		title: 'Artwork',
		description:
			'Collect a variety tokenization immutable works for art lovers and speculators.',
		background: ArtworkIMG,
		avatar: ArtworkIMG,
		link: `#${PATH_VIEWALL.collections}`,
		isFilter: true,
	},
	{
		id: 2,
		key: 2,
		title: 'Music',
		description:
			'Flatten the world of digital music for a enormous fan of their favorite artists.',
		background: MusicIMG,
		avatar: MusicIMG,
		link: `#${PATH_VIEWALL.collections}`,
		isFilter: true,
	},
	{
		id: 3,
		key: 3,
		title: 'Photography',
		description: 'Exhibit gallery of moments captured in life in a decentralized world.',
		background: PhotographyIMG,
		avatar: PhotographyIMG,
		link: `#${PATH_VIEWALL.collections}`,
		isFilter: true,
	},
	{
		id: 4,
		key: 4,
		title: 'Games',
		description: 'Gather people together to compete or play tourtitlents.',
		background: GamesIMG,
		avatar: GamesIMG,
		link: `#${PATH_VIEWALL.collections}`,
		isFilter: true,
	},
	{
		id: 5,
		key: 5,
		title: 'Sport',
		description: 'Browse NFTs from the world of F1, soccer, golf, boxing and more.',
		background: SportIMG,
		avatar: SportIMG,
		link: `#${PATH_VIEWALL.collections}`,
		isFilter: true,
	},
	{
		id: 6,
		key: 6,
		title: 'Metaverse',
		description: 'Provide alternative realities in the met averse.',
		background: MetevarseIMG,
		avatar: MetevarseIMG,
		link: `#${PATH_VIEWALL.collections}`,
		isFilter: true,
	},
	{
		id: 7,
		key: 7,
		title: 'Box',
		description: 'Make the way collecting accessory in a mysterious way.',
		background: BoxIMG,
		avatar: BoxIMG,
		link: `#${PATH_VIEWALL.collections}`,
		isFilter: true,
	},
	{
		id: 8,
		key: 8,
		title: 'Card',
		description: 'Change the way undying power is represented in the digital era.',
		background: CardIMG,
		avatar: CardIMG,
		link: `#${PATH_VIEWALL.collections}`,
		isFilter: true,
	},
];

export default function CategoryList() {
	const navigate = useNavigate();
	const theme = useTheme();
	const navigateSearchParams = useNavigateSearch();

	return (
		<>
			<Box sx={{ mt: 4, marginLeft: 'auto', marginRight: 'auto' }}>
				<Box
					sx={{
						display: 'grid',
						gridTemplateColumns: 'repeat(3,  1fr)',
						gap: '24px 24px',
						[theme.breakpoints.down(1024)]: {
							gridTemplateColumns: 'repeat(2, 1fr)',
						},
						[theme.breakpoints.down(767)]: {
							gridTemplateColumns: 'repeat(1, 1fr)',
						},
						zIndex: '100',
					}}
				>
					{ListCategory.map((category: any, index: number) => (
						<Fragment key={index}>
							<CollectionCardWrapper
								href={
									category.isFilter
										? category.link + '?category=' + category.title
										: category.link
								}
							>
								<CollectionBackground sx={{ height: 200, zIndex: '100' }}>
									<LazyImageCustom
										src={category.background}
										alt="collection background"
										type="skeleton"
										wrapperPosition="relative"
									/>
								</CollectionBackground>

								<ContentPart sx={{ height: 120, paddingTop: '16px' }}>
									<CollectionInfo>
										<Stack
											direction="row"
											alignItems="center"
											justifyContent="center"
											spacing={1}
											sx={{ width: '100%' }}
										>
											<CollectionName variant="h5" noWrap>
												{category.title}
											</CollectionName>
										</Stack>
										<Typography variant="subtitle2" textAlign="center" mt={1}>
											{category.description}
										</Typography>
									</CollectionInfo>
								</ContentPart>
							</CollectionCardWrapper>
						</Fragment>
					))}
				</Box>
			</Box>
		</>
	);
}
