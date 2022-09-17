/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { Fragment, lazy, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// mui
import { Box, Stack, Typography, Drawer, Tooltip, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
// styled
import {
	DropdownMenu,
	NavBar,
	NavigationBarBigScreen,
	NavigationItemBigScreen,
	NavLinkBigScreen,
	NavigationBarSmallScreen,
	NavigationItemSmallScreen,
	NavLinkSmallScreen,
	DropdownMenuLink,
	ContentWrapper,
} from './styled';
import { CollectionCategory } from 'models';
import { CATEGORY_COLLECTION } from 'constants/common.constant';
// redux
import { useDispatch, useSelector } from 'react-redux';
import { selectCollectionCategory } from 'redux/slices/collectionCategorySlice';
// actions
import { fetchListCollectionCategory } from 'redux/actions/collectionCategoryAction';
// components
import GlobalSearch from '../GlobalSearch';
// path
import {
	PATH_AUCTION,
	PATH_EARN,
	PATH_IGO,
	PATH_PAGE,
	PATH_CATEGORY,
	PATH_VIEWALL,
} from 'routes/path';
import { boolean } from 'yup';
import { useNavigateSearch } from 'hooks';
// constants
import { RELATED_URLS } from '../../../constants';

const ListTitleHeader = [
	{
		id: 1,
		titleHeader: 'INO',
		// href: `#${PATH_AUCTION.root}`,
		href: `#`,
		target: '_self',
		listItemSubMenu: [
			{
				//Change
				title: 'IGO',
				href: `#${PATH_IGO.root}`,
				// href: '#',
			},
			{
				title: 'Auction',
				href: `#${PATH_AUCTION.root}`,
				// href: '#',
			},
			{
				title: 'NFT Liquidity',
				href: '#',
			},
		],
	},

	{
		id: 2,
		titleHeader: 'Boarc',
		href: RELATED_URLS.boarcHomePage,
		target: '_blank',
		listItemSubMenu: [],
	},
];
const listCategoryMarketplace = [
	{
		id: 0,
		title: 'All NFTs',
		target: '_self',
		link: `#${PATH_VIEWALL.items}`,
		isFilter: false,
	},
	{
		id: 1,
		title: 'Other',
		target: '_self',
		link: `#${PATH_VIEWALL.collections}`,
		isFilter: true,
	},
	{
		id: 2,
		title: 'Artwork',
		target: '_self',
		link: `#${PATH_VIEWALL.collections}`,
		isFilter: true,
	},
	{
		id: 3,
		title: 'Music',
		target: '_self',
		link: `#${PATH_VIEWALL.collections}`,
		isFilter: true,
	},
	{
		id: 4,
		title: 'Photography',
		target: '_self',
		link: `#${PATH_VIEWALL.collections}`,
		isFilter: true,
	},
	{
		id: 5,
		title: 'Games',
		target: '_self',
		link: `#${PATH_VIEWALL.collections}`,
		isFilter: true,
	},
	{
		id: 6,
		title: 'Sport',
		target: '_self',
		link: `#${PATH_VIEWALL.collections}`,
		isFilter: true,
	},
	{
		id: 7,
		title: 'Metaverse',
		target: '_self',
		link: `#${PATH_VIEWALL.collections}`,
		isFilter: true,
	},
	{
		id: 8,
		title: 'Box',
		target: '_self',
		link: `#${PATH_VIEWALL.collections}`,
		isFilter: true,
	},
	{
		id: 9,
		title: 'Card',
		target: '_self',
		link: `#${PATH_VIEWALL.collections}`,
		isFilter: true,
	},
];

const listMetaSpace = [
	{
		id: 1,
		title: 'Avatar',
		target: '_self',
		link: `#`,
	},
	{
		id: 2,
		title: 'Astronaut',
		target: '_self',
		link: `#`,
	},
	{
		id: 3,
		title: 'Space Suit',
		target: '_self',
		link: `#`,
	},
	{
		id: 4,
		title: 'Land Mars',
		target: '_self',
		link: `#`,
	},
	{
		id: 5,
		title: 'Art Exhibition',
		target: '_self',
		link: `#`,
	},
	{
		id: 6,
		title: 'WC Streamline',
		target: '_self',
		link: `#`,
	},
];
interface MainNavBarProps {
	isBackground?: boolean;
}
const MainNavBar = ({ isBackground }: MainNavBarProps) => {
	const theme = useTheme();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	// hooks
	const navigateSearchParams = useNavigateSearch();

	// useRef
	const ref = useRef<HTMLDivElement>(null);

	// useState
	const [isOpenSmallScreenMenu, setIsOpenSmallScreenMenu] = useState(false);

	// useSelector
	const listCategory: CollectionCategory[] = useSelector(selectCollectionCategory);

	//Get list submenu header for navigation
	useEffect(() => {
		dispatch(fetchListCollectionCategory());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
		if (
			event.type === 'keydown' &&
			((event as React.KeyboardEvent).key === 'Tab' ||
				(event as React.KeyboardEvent).key === 'Shift')
		) {
			return;
		}

		setIsOpenSmallScreenMenu(open);
	};

	const renderCategory = (category: number) => {
		return CATEGORY_COLLECTION[category];
	};

	const RenderMenuHeaderSmallScreen = () => {
		return (
			<Fragment>
				<Box onClick={toggleDrawer(true)} sx={{}}>
					<Box
						sx={{
							width: '100%',
							height: '100%',
							backgroundColor: theme.palette.primary.main,
							borderRadius: '12px',
							display: 'flex',
							padding: '10px',
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<MenuIcon
							sx={{
								color: 'white',
							}}
						/>
					</Box>
				</Box>

				<Drawer anchor="right" open={isOpenSmallScreenMenu} onClose={toggleDrawer(false)}>
					<ContentWrapper>
						<NavigationBarSmallScreen>
							{ListTitleHeader.map((item, idx) => (
								<NavigationItemSmallScreen key={idx}>
									<NavLinkSmallScreen
										href="#"
										onClick={(e: any) => {
											e.preventDefault();
										}}
									>
										<Typography variant="subtitle2">
											{item.titleHeader}
										</Typography>
									</NavLinkSmallScreen>
								</NavigationItemSmallScreen>
							))}
						</NavigationBarSmallScreen>
					</ContentWrapper>
				</Drawer>
			</Fragment>
		);
	};

	const RenderMenuHeaderBigScreen = () => {
		return (
			<>
				<NavigationBarBigScreen>
					{/* Home */}
					<NavigationItemBigScreen>
						<NavLinkBigScreen className="navLink" href="#" target="_self">
							<Typography variant="body1">Home</Typography>
						</NavLinkBigScreen>
					</NavigationItemBigScreen>
					{/* Market place links */}
					<NavigationItemBigScreen>
						<NavLinkBigScreen
							className="navLink"
							href="#"
							target="_self"
							onClick={(e: any) => {
								e.preventDefault();
							}}
						>
							<Typography variant="body1">Marketplace</Typography>
						</NavLinkBigScreen>

						<DropdownMenu className="dropdownMenu">
							<Stack>
								{listCategoryMarketplace.map((category: any, index: number) => (
									<DropdownMenuLink
										href={
											category.isFilter
												? category.link + '?category=' + category.title
												: category.link
										}
										key={index}
									>
										<Typography
											variant="body2"
											sx={{ padding: '0 10px' }}
											textAlign="center"
											noWrap
										>
											{category.title}
										</Typography>
									</DropdownMenuLink>
								))}
							</Stack>
						</DropdownMenu>
					</NavigationItemBigScreen>
					{/* MetaSpace */}
					<NavigationItemBigScreen>
						<NavLinkBigScreen
							className="navLink"
							href="#"
							target="_self"
							onClick={(e: any) => {
								e.preventDefault();
							}}
						>
							<Typography variant="body1">Metaspace</Typography>
						</NavLinkBigScreen>

						<DropdownMenu className="dropdownMenu">
							<Stack>
								{listMetaSpace.map((meta: any, index: number) =>
									meta.link === '#' ? (
										<Tooltip
											key={index}
											title="Coming soon"
											placement="right"
											arrow
										>
											<DropdownMenuLink
												href={meta.link}
												key={index}
												sx={{
													cursor:
														meta.link === '#' ? 'default' : 'pointer',
												}}
												onClick={(e: any) => {
													if (meta.link === '#') e.preventDefault();
												}}
											>
												<Typography
													variant="body2"
													sx={{ padding: '0 10px' }}
													textAlign="center"
													noWrap
												>
													{meta.title}
												</Typography>
											</DropdownMenuLink>
										</Tooltip>
									) : (
										<DropdownMenuLink
											href={meta.link}
											key={index}
											onClick={(e: any) => {
												if (meta.link === '#') e.preventDefault();
											}}
										>
											<Typography
												variant="body2"
												sx={{ padding: '0 10px' }}
												textAlign="center"
												noWrap
											>
												{meta.title}
											</Typography>
										</DropdownMenuLink>
									)
								)}
							</Stack>
						</DropdownMenu>
					</NavigationItemBigScreen>

					{/* Earn links */}
					<NavigationItemBigScreen>
						<NavLinkBigScreen
							className="navLink"
							href="#"
							target="_self"
							onClick={(e: any) => {
								e.preventDefault();
							}}
						>
							<Typography variant="body1">Earn</Typography>
						</NavLinkBigScreen>

						<DropdownMenu className="dropdownMenu">
							<Stack>
								<DropdownMenuLink
									href="#"
									onClick={(e: any) => {
										e.preventDefault();
										navigate(`${PATH_EARN.assets}`);

										setTimeout(() => {
											document?.querySelector(`#MMB`)?.scrollIntoView({
												behavior: 'auto',
											});

											setTimeout(() => {
												document?.querySelector(`#MMB`)?.scrollIntoView({
													behavior: 'auto',
												});
											}, 500);
										}, 200);
									}}
								>
									<Typography
										variant="body2"
										sx={{ padding: '0 10px' }}
										textAlign="center"
										noWrap
									>
										MMB
									</Typography>
								</DropdownMenuLink>

								<DropdownMenuLink
									href="#"
									onClick={(e: any) => {
										e.preventDefault();
										navigate(`${PATH_EARN.assets}`);

										setTimeout(() => {
											document?.querySelector(`#MCA`)?.scrollIntoView({
												behavior: 'auto',
											});

											setTimeout(() => {
												document?.querySelector(`#MCA`)?.scrollIntoView({
													behavior: 'auto',
												});
											}, 500);
										}, 200);
									}}
								>
									<Typography
										variant="body2"
										sx={{ padding: '0 10px' }}
										textAlign="center"
										noWrap
									>
										MCA
									</Typography>
								</DropdownMenuLink>

								<DropdownMenuLink
									href="#"
									onClick={(e: any) => {
										e.preventDefault();
										navigate(`${PATH_EARN.assets}`);

										setTimeout(() => {
											document?.querySelector(`#staking`)?.scrollIntoView({
												behavior: 'auto',
											});

											setTimeout(() => {
												document
													?.querySelector(`#staking`)
													?.scrollIntoView({
														behavior: 'auto',
													});
											}, 500);
										}, 200);
									}}
								>
									<Typography
										variant="body2"
										sx={{ padding: '0 10px' }}
										textAlign="center"
										noWrap
									>
										Staking
									</Typography>
								</DropdownMenuLink>

								<DropdownMenuLink href={`#${PATH_EARN.userDetail}`}>
									<Typography
										variant="body2"
										sx={{ padding: '0 10px' }}
										textAlign="center"
										noWrap
									>
										User
									</Typography>
								</DropdownMenuLink>
							</Stack>
						</DropdownMenu>
					</NavigationItemBigScreen>

					{/* Order links */}
					{ListTitleHeader.map((item, idx) => (
						<NavigationItemBigScreen key={idx}>
							<NavLinkBigScreen
								className="navLink"
								href={item.href}
								target={item.target}
								onClick={(e: any) => {
									if (item.href === '#') e.preventDefault();
								}}
							>
								<Typography variant="body1">{item.titleHeader}</Typography>
							</NavLinkBigScreen>

							<DropdownMenu className="dropdownMenu">
								<Stack>
									{item.listItemSubMenu.length !== 0 &&
										item.listItemSubMenu.map((menu: any, index: number) =>
											menu.href === '#' ? (
												<Tooltip
													key={index}
													title="Coming soon"
													placement="right"
													arrow
												>
													<DropdownMenuLink
														href={`${menu.href}`}
														onClick={(e: any) => {
															if (menu.href === '#')
																e.preventDefault();
														}}
														sx={{
															cursor:
																menu.href === '#'
																	? 'default'
																	: 'pointer',
														}}
													>
														<Typography
															variant="body2"
															sx={{ padding: '0 10px' }}
															textAlign="center"
															noWrap
														>
															{menu.title}
														</Typography>
													</DropdownMenuLink>
												</Tooltip>
											) : (
												<DropdownMenuLink
													key={index}
													href={`${menu.href}`}
													onClick={(e: any) => {
														if (menu.href === '#') e.preventDefault();
													}}
												>
													<Typography
														variant="body2"
														sx={{ padding: '0 10px' }}
														textAlign="center"
														noWrap
													>
														{menu.title}
													</Typography>
												</DropdownMenuLink>
											)
										)}
								</Stack>
							</DropdownMenu>
						</NavigationItemBigScreen>
					))}
				</NavigationBarBigScreen>
			</>
		);
	};

	return (
		<NavBar ref={ref}>
			<Stack direction="row" alignItems="center" sx={{ position: 'relative', mx: 1 }}>
				{/* <Box className="menuSmallScreen">{RenderMenuHeaderSmallScreen()}</Box> */}
				<Box
					sx={{
						flexBasis: '25%',
						ml: '8%',
						[theme.breakpoints.between(600, 1300)]: {
							flexBasis: '100%',
							maxWidth: '500px',
						},
					}}
				>
					<GlobalSearch />
				</Box>
				<Box sx={{ height: '100%', width: '1px', opacity: 0 }}>text</Box>

				<Box className="menuBigScreen" sx={{ flexGrow: 1 }}>
					{RenderMenuHeaderBigScreen()}
				</Box>
			</Stack>
		</NavBar>
	);
};

export default React.memo(MainNavBar);
