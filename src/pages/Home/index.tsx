/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { Fragment, useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
//mui
import { Box, Container, Grid, Stack, Typography, useTheme } from '@mui/material';
// styled
import {
	ButtonBlue,
	ButtonViewAll,
	ExploreCollection,
	FirstSectionHomePage,
	HeaderSection,
	HeaderVideoContainer,
	ImgCatchAFish,
	MainHeader,
	OpacityBackground,
	SubHeader,
	TitleWrapper,
	VideoHeader,
	BlurBackGround,
	BlurBackGround1,
} from './styled';
// component
import ButtonLoadmore from 'components/CustomUI/ButtonLoadmore';
import InfinityAnimation from 'components/pages/Home/InfinityAnimation';
import AdvertiseSection from 'components/pages/Home/AdvertiseSection';
import ListTopCollection from 'components/pages/Home/ListTopCollection';
import NewTopArt from 'components/pages/Home/NewTopArt';
import GalleryItem from 'components/pages/Home/GalleryItem';
import CategoryCollection from 'components/pages/Home/CategoryCollection';
import OverviewSection from 'components/pages/Home/OverviewSection';
import ListNFT from 'components/pages/Home/ListNFT';
// images
import CatchFish from 'assets/images/home/catch-fish.webp';

// Import PATH routes
import { PATH_EARN, PATH_IGO, PATH_ITEM, PATH_PAGE } from '../../routes/path';
import ButtonGradient from 'components/CustomUI/ButtonGradient';
import Newsletter from 'components/pages/Home/NewsLetter';
import CategoryList from 'components/pages/Home/CategoryList';
// constants
import { RELATED_URLS } from '../../constants';
import { LinkWrapper } from 'components/CustomUI/Card/CollectionRankingCard/styled';

const Contents = [
	{
		id: 0,
		firstLineHeader: 'Buy, sell and',
		secondLineHeader: 'collect NFT',
		description: 'The best efficient P2P solution for NFT marketplace',
		nameFristButton: 'Collect',
		nameSecondButton: 'Explore',
		linkFristButton: `#${PATH_ITEM.createItem}`,
		linkSecondButton: `#${PATH_PAGE.viewAll}`,
	},
	{
		id: 1,
		firstLineHeader: 'Trade and earn',
		secondLineHeader: 'MS assets',
		description: 'Take profits from your activities in the ecosystem',
		nameFristButton: 'Trade',
		nameSecondButton: 'Explore',
		linkFristButton: `#${PATH_PAGE.viewAll}`,
		linkSecondButton: `#${PATH_EARN.assets}`,
	},
	{
		id: 2,
		firstLineHeader: 'Join INO',
		secondLineHeader: 'Initial offerring',
		description: 'Grab a chance of million years to buy NFT in the primary market',
		nameFristButton: 'explore',
		nameSecondButton: 'none',
		linkFristButton: `#${PATH_IGO.root}`,
		linkSecondButton: '',
	},
	{
		id: 3,
		firstLineHeader: 'BOARC',
		secondLineHeader: 'Art of Bamboo',
		description: "The world's wonderful artwork with great passion and inspiration",
		nameFristButton: 'explore',
		nameSecondButton: 'none',
		linkFristButton: RELATED_URLS.boarcHomePage,
		linkSecondButton: '',
	},
];

const Home: React.FC = () => {
	const theme = useTheme();
	const navigate = useNavigate();
	// useRef
	const sectionRef = useRef<any>(null);
	const isThemeLight = theme.palette.mode === 'light';
	// useState
	const [displayGallery, setDisplayGallery] = useState<boolean | object>(false);
	const [distance, setDistance] = useState<string>('0px');
	const [firstSectionHeight, setFirstSectionHeight] = useState<number>(0);
	const [renderSection, setRenderSection] = useState<boolean>(false);
	const [numCount, setNumCount] = useState<number>(0);

	const handleResize = useCallback(() => {
		if (sectionRef.current) {
			const height = sectionRef.current.clientHeight;
			setFirstSectionHeight(height);
		}
	}, []);

	useEffect(() => {
		if (sectionRef.current) {
			const height = sectionRef.current.clientHeight;
			setFirstSectionHeight(height);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [renderSection]);

	//Handle resize window event
	useEffect(() => {
		window.addEventListener('resize', handleResize, { passive: true });
		return () => {
			window.removeEventListener('resize', handleResize);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [handleResize]);

	useEffect(() => {
		let a = 0;
		const timeout = setInterval(() => {
			if (a > 2) {
				a = 0;
				setNumCount(0);
			} else {
				a = a + 1;
				setNumCount(a);
			}
		}, 6000);
		return () => {
			clearInterval(timeout);
		};
	}, []);
	// console.log('count', numCount);
	return (
		<Fragment>
			<FirstSectionHomePage>
				<HeaderVideoContainer>
					<TitleWrapper>
						<Typography variant="h2" noWrap sx={{ color: 'white', fontWeight: '500' }}>
							{Contents[numCount].firstLineHeader}
						</Typography>
						<Typography variant="h2" noWrap sx={{ color: 'white', fontWeight: '500' }}>
							{Contents[numCount].secondLineHeader}
						</Typography>
						<Typography mt={2} color="white">
							{Contents[numCount].description}
						</Typography>
						<Stack direction="row" mt={2}>
							{Contents[numCount].nameFristButton !== 'none' && (
								<LinkWrapper href={Contents[numCount].linkFristButton}>
									<ButtonGradient sx={{ width: '9rem' }}>
										<Typography>
											{Contents[numCount].nameFristButton}
										</Typography>
									</ButtonGradient>
								</LinkWrapper>
							)}
							{Contents[numCount].nameSecondButton !== 'none' && (
								<LinkWrapper href={Contents[numCount].linkSecondButton}>
									<ButtonBlue>
										<Typography>
											{Contents[numCount].nameSecondButton}
										</Typography>
									</ButtonBlue>
								</LinkWrapper>
							)}
						</Stack>
					</TitleWrapper>
				</HeaderVideoContainer>

				<Box>
					<VideoHeader autoPlay loop muted>
						<source
							type="video/mp4"
							src="https://res.cloudinary.com/dyh2c5n8i/video/upload/v1658980640/metaspacecy/Mars_Metaspacecy_mlfycs.mp4"
						/>
					</VideoHeader>
				</Box>
			</FirstSectionHomePage>
			<Box>
				<Container maxWidth="xl" sx={{ mt: 6 }}>
					<ListTopCollection
						renderSection={renderSection}
						setRenderSection={setRenderSection}
					/>
				</Container>
			</Box>
			<ExploreCollection>
				<Container maxWidth="xl">
					<Box>
						<HeaderSection>
							<MainHeader variant="h2">Explore Collections</MainHeader>
							<SubHeader variant="h5">
								All the hottest NFT collections based on category
							</SubHeader>
						</HeaderSection>

						{/* <CategoryCollection /> */}
						<CategoryList />
					</Box>
				</Container>
				<BlurBackGround />
				<BlurBackGround1 />
			</ExploreCollection>
			<Container maxWidth="xl" sx={{}}>
				<Box sx={{ mt: 6, mb: 4, width: '100%' }}>
					<HeaderSection>
						<MainHeader variant="h2">Explore NFTs</MainHeader>
						<SubHeader variant="h5" sx={{ display: 'inline' }}>
							The world of digital assets in forms of NFTs
							<LinkWrapper href={`#${PATH_PAGE.viewAll}`}>
								<ButtonViewAll sx={{ display: 'inline' }}>View All</ButtonViewAll>
							</LinkWrapper>
						</SubHeader>
					</HeaderSection>

					<ListNFT />
				</Box>
			</Container>
			<ExploreCollection>
				<Container maxWidth="xl" sx={{}}>
					<Box sx={{ mt: 0, mb: 4 }}>
						<HeaderSection>
							<MainHeader variant="h2">
								MetaSpacecy is a future destination
							</MainHeader>
							<SubHeader variant="h5">
								MetaSpacecy looks forward to providing an innovative NFT solution
								for all of savvy hodlers to create a mutual community and become a
								future destination in the NFT decentralised world.
							</SubHeader>
						</HeaderSection>

						<Newsletter />
					</Box>

					<Stack sx={{ marginTop: '50px', width: '100%' }} alignItems="center">
						<ButtonLoadmore
							text="Discover MetaSpacecy"
							onClick={() => {
								navigate(PATH_PAGE.viewAll);
							}}
						/>
					</Stack>
				</Container>
			</ExploreCollection>

			<Container maxWidth="xl" sx={{}}>
				<Box sx={{ mt: 10 }}>
					<ImgCatchAFish>
						<img loading="lazy" src={CatchFish} alt="catch a fish" />
					</ImgCatchAFish>
				</Box>
			</Container>
		</Fragment>
	);
};

export default React.memo(Home);
