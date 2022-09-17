/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef } from 'react';
// mui
import { Box, Stack, Tab, Tabs, useTheme } from '@mui/material';
// images
import iconAssetWhite from 'assets/icons/asset-white.webp';
import iconAssetBlack from 'assets/icons/asset-black.webp';
import iconAssetGray from 'assets/icons/asset-gray.webp';

import iconCollectionWhite from 'assets/icons/filter-collection-white.webp';
import iconCollectionBlack from 'assets/icons/filter-collection-black.webp';
import iconCollectionGray from 'assets/icons/filter-collection-gray.webp';

import iconUserWhite from 'assets/icons/user-white.webp';
import iconUserBlack from 'assets/icons/user-black.webp';
import iconUserGray from 'assets/icons/user-gray.webp';
// redux
import { useDispatch } from 'react-redux';
import { resetAll as resetAllNfts } from 'redux/slices/allNftsSlice';
import { resetAll as resetAllCollections } from 'redux/slices/collectionSlice';
import { resetAll as resetAllUsers } from 'redux/slices/allUsersSlice';
// components
import TabCommon from 'components/CustomUI/Tab/TabCommon';
import ItemsTab from '../Tabs/ItemsTab';
import CollectionsTab from '../Tabs/CollectionsTab';
import UsersTab from '../Tabs/UsersTab';
import { TypographyStyled } from './styled';
import { useLocation } from 'react-router-dom';
import { PATH_VIEWALL } from 'routes/path';

export interface IViewAllProps {
	query: string;
}

function TabViewAll({ query }: IViewAllProps) {
	const theme = useTheme();
	const dispatch = useDispatch();
	const [value, setValue] = React.useState(0);
	const { pathname } = useLocation();

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	// useRef
	const arrOpenedTab = useRef<boolean[]>([]);

	// vars
	const isLightTheme = theme.palette.mode === 'light';

	// useEffect
	useEffect(() => {
		return () => {
			dispatch(resetAllNfts());
			dispatch(resetAllCollections());
			dispatch(resetAllUsers());
		};
	}, [dispatch, query]);

	useEffect(() => {
		const checkRoute = (pathname: any): void => {
			switch (pathname) {
				case `${PATH_VIEWALL.items}`: {
					setValue(0);
					break;
				}
				case `${PATH_VIEWALL.collections}`: {
					setValue(1);
					break;
				}
				case `${PATH_VIEWALL.user}`: {
					setValue(2);
					break;
				}
				default: {
					setValue(0);
				}
			}
		};
		checkRoute(pathname);
		return;
		// eslint-disable-next-line
	}, [pathname]);

	console.log('value', value);

	return (
		<>
			<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
				<Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
					<Tab
						href={`#${PATH_VIEWALL.items}`}
						label={
							<Stack direction="row" alignItems="center" spacing={1}>
								<Box
									sx={{
										position: 'relative',
									}}
								>
									{value === 0 ? (
										isLightTheme ? (
											<img
												src={iconAssetBlack}
												alt="asset icon"
												width={20}
												height={20}
											/>
										) : (
											<img
												src={iconAssetWhite}
												alt="asset icon"
												width={20}
												height={20}
											/>
										)
									) : (
										<img
											src={iconAssetGray}
											alt="asset icon"
											width={20}
											height={20}
										/>
									)}
								</Box>

								<TypographyStyled sx={{ ml: 1 }} noWrap>
									Items
								</TypographyStyled>
							</Stack>
						}
					/>
					<Tab
						href={`#${PATH_VIEWALL.collections}`}
						label={
							<Stack direction="row" alignItems="center" spacing={1}>
								<Box
									sx={{
										position: 'relative',
									}}
								>
									{value === 1 ? (
										isLightTheme ? (
											<img
												src={iconCollectionBlack}
												alt="Collection icon"
												width={18}
												height={18}
											/>
										) : (
											<img
												src={iconCollectionWhite}
												alt="Collection icon"
												width={18}
												height={18}
											/>
										)
									) : (
										<img
											src={iconCollectionGray}
											alt="Collection icon"
											width={18}
											height={18}
										/>
									)}
								</Box>

								<TypographyStyled sx={{ ml: 1 }} noWrap>
									Collections
								</TypographyStyled>
							</Stack>
						}
					/>
					<Tab
						href={`#${PATH_VIEWALL.user}`}
						label={
							<Stack direction="row" alignItems="center" spacing={1}>
								<Box
									sx={{
										position: 'relative',
									}}
								>
									{value === 2 ? (
										isLightTheme ? (
											<img
												src={iconUserBlack}
												alt="User icon"
												width={20}
												height={20}
											/>
										) : (
											<img
												src={iconUserWhite}
												alt="User icon"
												width={20}
												height={20}
											/>
										)
									) : (
										<img
											src={iconUserGray}
											alt="User icon"
											width={20}
											height={20}
										/>
									)}
								</Box>
								<TypographyStyled sx={{ ml: 1 }} noWrap>
									User
								</TypographyStyled>
							</Stack>
						}
					/>
				</Tabs>
			</Box>
		</>
	);
}

export default React.memo(TabViewAll);
