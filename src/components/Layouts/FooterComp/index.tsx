/* eslint-disable @typescript-eslint/no-unused-vars */

import {
	BigContainer,
	BrandWrap,
	DetailColumn,
	DetailContainer,
	DetailLink,
	DetailList,
	DetailTitle,
	FooterText,
	FooterWrap,
	GridContent,
	ListRow,
	LogoLink,
	SocialIconLink,
	SocialWrap,
} from './styled';
import LogoNFTSpaceXWhite from 'assets/images/header/logo-ms-white.webp';
import LogoNFTSpaceXBlack from 'assets/images/header/logo-ms-black.webp';
import LogoSpaceX from 'assets/images/home/logoSpaceX.webp';
import { Box, useTheme, Container } from '@mui/material';
import {
	PATH_AUCTION,
	PATH_CATEGORY,
	PATH_EARN,
	PATH_IGO,
	PATH_ITEM,
	PATH_PAGE,
	PATH_VIEWALL,
} from 'routes/path';
import { useNavigateSearch } from 'hooks';
// constants
import { RELATED_URLS } from '../../../constants';
import { useNavigate } from 'react-router-dom';

const FooterComp: React.FC = () => {
	const theme = useTheme();
	const isLightTheme = theme.palette.mode === 'light';
	const navigateSearchParams = useNavigateSearch();
	const navigate = useNavigate();

	const marketplace = [
		{
			title: 'Marketplace',
			contents: [
				{
					title: 'All NFTs',
					link: `#${PATH_PAGE.viewAll}`,
					isFilter: false,
				},
				{
					title: 'Other',
					link: `#${PATH_PAGE.viewAll}`,
					isFilter: true,
				},
				{
					title: 'Artwork',
					link: `#${PATH_PAGE.viewAll}`,
					isFilter: true,
				},
				{
					title: 'Music',
					link: `#${PATH_PAGE.viewAll}`,
					isFilter: true,
				},
				{
					title: 'Photography',
					link: `#${PATH_PAGE.viewAll}`,
					isFilter: true,
				},
				{
					title: 'Games',
					link: `#${PATH_PAGE.viewAll}`,
					isFilter: true,
				},
				{
					title: 'Sport',
					llink: `#${PATH_PAGE.viewAll}`,
					isFilter: true,
				},
				{
					title: 'Metaverse',
					link: `#${PATH_CATEGORY.metaverse}`,
					isFilter: true,
				},
				{
					title: 'Box',
					link: `#${PATH_CATEGORY.box}`,
					isFilter: true,
				},
				{
					title: 'Card',
					link: `#${PATH_CATEGORY.card}`,
					isFilter: true,
				},
			],
		},
	];
	const detailList = [
		{
			title: 'Metaspace',
			contents: [
				{
					name: 'Avatar',
					link: '',
					id: '',
				},
				{
					name: 'Astronaut',
					link: '',
					id: '',
				},
				{
					name: 'Space Suit',
					link: '',
					id: '',
				},
				{
					name: 'Land Mars',
					link: '',
					id: '',
				},
				{
					name: 'Art Exhibition',
					link: '',
					id: '',
				},
				{
					name: 'WC Streamline',
					link: '',
					id: '',
				},
			],
		},
		{
			title: 'Earn',
			contents: [
				{
					name: 'MMB',
					link: `${PATH_EARN.assets}`,
					id: 'MMB',
				},
				{
					name: 'MCA',
					link: `${PATH_EARN.assets}`,
					id: 'MCA',
				},
				{
					name: 'MetaSpacecy Staking',
					link: `${PATH_EARN.assets}`,
					id: 'staking',
				},
				{
					name: 'User Staking',
					link: `#${PATH_EARN.userDetail}`,
					id: '',
				},
			],
		},
		{
			title: 'INO',
			contents: [
				{
					name: 'IGO',
					link: `#${PATH_IGO.root}`,
					id: '',
				},
				{
					name: 'Auction',
					link: `#${PATH_AUCTION.root}`,
					id: '',
				},
				{
					name: 'NFT Liquidity',
					link: '',
					id: '',
				},
				{
					name: 'Request IGO',
					link: `#${PATH_IGO.request}`,
					id: '',
				},
				{
					name: 'Create IGO',
					link: '',
					id: '',
				},
				{
					name: 'Request Auction',
					link: `#${PATH_AUCTION.permission}`,
					id: '',
				},
				{
					name: 'Create Auction',
					link: `#${PATH_AUCTION.create}`,
					id: '',
				},
			],
		},
		{
			title: 'Company',
			contents: [
				{
					name: 'Explore',
					link: '',
					id: '',
				},
				{
					name: 'About',
					link: '',
					id: '',
				},
				{
					name: 'Contact Us',
					link: '',
					id: '',
				},
				{
					name: 'FAQ',
					link: 'https://metaspacecy.gitbook.io/metaspacecy/faqs',
					id: '',
				},
				{
					name: 'Privacy Policy',
					link: '',
					// link: RELATED_URLS.privacyPolicy,
					id: '',
				},
			],
		},
	];
	return (
		<FooterWrap sx={{ mt: 14 }}>
			{/* <Container maxWidth="xxl" > */}
			<BigContainer>
				<GridContent>
					<BrandWrap>
						{/* Logo */}
						<LogoLink>
							<img className="logoMobile" src={LogoSpaceX} alt="page logo" />

							{isLightTheme ? (
								<img
									loading="lazy"
									src={LogoNFTSpaceXBlack}
									alt="page logo"
									className="logoPC"
								/>
							) : (
								<img
									loading="lazy"
									src={LogoNFTSpaceXWhite}
									alt="page logo"
									className="logoPC"
								/>
							)}
						</LogoLink>
						<FooterText>
							MetaSpacecy collect, secure digital assets and provide efficient
							solution for purchasing NFTs.
						</FooterText>
						{/* Socials */}
						<SocialWrap>
							{/* <SocialIconLink href=''>
								<svg
									aria-hidden="true"
									focusable="false"
									data-prefix="fab"
									data-icon="facebook"
									role="img"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 512 512"
								>
									<path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"></path>
								</svg>
							</SocialIconLink> */}
							<SocialIconLink target="_blank" href={RELATED_URLS.twitter}>
								<svg
									aria-hidden="true"
									focusable="false"
									data-prefix="fab"
									data-icon="twitter"
									role="img"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 512 512"
								>
									<path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"></path>
								</svg>
							</SocialIconLink>
							<SocialIconLink target="_blank" href={RELATED_URLS.discord}>
								<svg
									aria-hidden="true"
									focusable="false"
									data-prefix="fab"
									data-icon="discord"
									role="img"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 640 512"
								>
									<path d="M524.531,69.836a1.5,1.5,0,0,0-.764-.7A485.065,485.065,0,0,0,404.081,32.03a1.816,1.816,0,0,0-1.923.91,337.461,337.461,0,0,0-14.9,30.6,447.848,447.848,0,0,0-134.426,0,309.541,309.541,0,0,0-15.135-30.6,1.89,1.89,0,0,0-1.924-.91A483.689,483.689,0,0,0,116.085,69.137a1.712,1.712,0,0,0-.788.676C39.068,183.651,18.186,294.69,28.43,404.354a2.016,2.016,0,0,0,.765,1.375A487.666,487.666,0,0,0,176.02,479.918a1.9,1.9,0,0,0,2.063-.676A348.2,348.2,0,0,0,208.12,430.4a1.86,1.86,0,0,0-1.019-2.588,321.173,321.173,0,0,1-45.868-21.853,1.885,1.885,0,0,1-.185-3.126c3.082-2.309,6.166-4.711,9.109-7.137a1.819,1.819,0,0,1,1.9-.256c96.229,43.917,200.41,43.917,295.5,0a1.812,1.812,0,0,1,1.924.233c2.944,2.426,6.027,4.851,9.132,7.16a1.884,1.884,0,0,1-.162,3.126,301.407,301.407,0,0,1-45.89,21.83,1.875,1.875,0,0,0-1,2.611,391.055,391.055,0,0,0,30.014,48.815,1.864,1.864,0,0,0,2.063.7A486.048,486.048,0,0,0,610.7,405.729a1.882,1.882,0,0,0,.765-1.352C623.729,277.594,590.933,167.465,524.531,69.836ZM222.491,337.58c-28.972,0-52.844-26.587-52.844-59.239S193.056,219.1,222.491,219.1c29.665,0,53.306,26.82,52.843,59.239C275.334,310.993,251.924,337.58,222.491,337.58Zm195.38,0c-28.971,0-52.843-26.587-52.843-59.239S388.437,219.1,417.871,219.1c29.667,0,53.307,26.82,52.844,59.239C470.715,310.993,447.538,337.58,417.871,337.58Z"></path>
								</svg>
							</SocialIconLink>
							<SocialIconLink target="_blank" href={RELATED_URLS.github}>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 496 512"
									aria-hidden="true"
									focusable="false"
									data-prefix="fab"
									role="img"
									data-icon="github"
								>
									<path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" />
								</svg>
							</SocialIconLink>
							<SocialIconLink target="_blank" href={RELATED_URLS.telegram}>
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512">
									<path d="M248,8C111.033,8,0,119.033,0,256S111.033,504,248,504,496,392.967,496,256,384.967,8,248,8ZM362.952,176.66c-3.732,39.215-19.881,134.378-28.1,178.3-3.476,18.584-10.322,24.816-16.948,25.425-14.4,1.326-25.338-9.517-39.287-18.661-21.827-14.308-34.158-23.215-55.346-37.177-24.485-16.135-8.612-25,5.342-39.5,3.652-3.793,67.107-61.51,68.335-66.746.153-.655.3-3.1-1.154-4.384s-3.59-.849-5.135-.5q-3.283.746-104.608,69.142-14.845,10.194-26.894,9.934c-8.855-.191-25.888-5.006-38.551-9.123-15.531-5.048-27.875-7.717-26.8-16.291q.84-6.7,18.45-13.7,108.446-47.248,144.628-62.3c68.872-28.647,83.183-33.623,92.511-33.789,2.052-.034,6.639.474,9.61,2.885a10.452,10.452,0,0,1,3.53,6.716A43.765,43.765,0,0,1,362.952,176.66Z" />
								</svg>
							</SocialIconLink>
						</SocialWrap>
					</BrandWrap>
					<DetailContainer>
						{marketplace.map((item, index) => (
							<DetailColumn key={index}>
								<DetailTitle>{item.title}</DetailTitle>
								<DetailList>
									{item.contents.map((item, index) => (
										<ListRow key={index}>
											<DetailLink
												href={
													item.isFilter
														? item.link + '?category=' + item.title
														: item.link
												}
											>
												{item.title}
											</DetailLink>
										</ListRow>
									))}
								</DetailList>
							</DetailColumn>
						))}
						{detailList.map((item, index) => (
							<DetailColumn key={index}>
								<DetailTitle>{item.title}</DetailTitle>
								<DetailList>
									{item.contents.map((item, index) => (
										<ListRow
											key={index}
											sx={{
												opacity: item.link === '' ? '0.4' : '1',
											}}
										>
											<DetailLink
												sx={{
													cursor:
														item.link === '' ? 'default' : 'pointer',
												}}
												onClick={(e) => {
													if (item.link === '') {
														e.preventDefault();
													} else {
														if (item.id !== '') {
															e.preventDefault();
															navigate(item.link);

															setTimeout(() => {
																document
																	?.querySelector(`#${item.id}`)
																	?.scrollIntoView({
																		behavior: 'auto',
																	});

																setTimeout(() => {
																	document
																		?.querySelector(
																			`#${item.id}`
																		)
																		?.scrollIntoView({
																			behavior: 'auto',
																		});
																}, 500);
															}, 200);
														}
													}
												}}
												href={item.link}
											>
												{item.name}
											</DetailLink>
										</ListRow>
									))}
								</DetailList>
							</DetailColumn>
						))}
					</DetailContainer>
				</GridContent>
			</BigContainer>
			{/* </Container> */}
		</FooterWrap>
	);
};
export default FooterComp;
