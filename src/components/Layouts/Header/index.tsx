/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, Fragment, lazy } from 'react';
// mui
import { Box, Container, Stack, Toolbar, Typography, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
//components
import MoreOptionList from 'components/Layouts/MoreOptionList';
import MainNavBar from '../MainNavBar';
import SwitchNetwork from '../SwitchNetwork';
import PlatformToken from '../PlatformToken';
import ConnectToWallet from '../ConnectToWallet';
import PersonalAccount from '../PersonalAccount';
//redux
import { useSelector } from 'react-redux';
import { selectAddress } from 'redux/slices/web3InfoSlice';
import { selectUser } from 'redux/slices/userSlice';
//styled
import {
	AppbarHeader,
	AppearWrapper,
	FixedBottomHeader,
	LogoLink,
	MainNavBarWrapper,
	ModalClose,
	NotiBox,
	PageLogo,
} from './styled';
//models
import { User } from 'models';
//image
import LogoNFTSpaceXWhite from 'assets/images/header/logo-ms-white.webp';
import LogoNFTSpaceXBlack from 'assets/images/header/logo-ms-black.webp';
import LogoSpaceX from 'assets/images/home/logoSpaceX.webp';
import GlobalSearch from '../GlobalSearch';
import MoreOptionListBottom from '../MoreOptionListBottom';

const Header: React.FC = () => {
	const theme = useTheme();
	const isLightTheme = theme.palette.mode === 'light';

	// useState
	let [open, setOpen] = useState(true);
	let [background, setBackground] = useState(false);

	// useSelector
	const address = useSelector(selectAddress);
	const userInfo: User | null = useSelector(selectUser);

	useEffect(() => {
		// Handler to call on window scroll
		const handleScroll = () => {
			if (window.pageYOffset > 25) {
				setBackground(true);
			} else {
				setBackground(false);
			}
		};
		window.addEventListener('scroll', handleScroll, { passive: true });

		return () => window.removeEventListener('scroll', handleScroll);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<AppbarHeader
				position="fixed"
				color="transparent"
				elevation={0}
				background={background}
			>
				<Box>
					<Stack
						direction="row"
						sx={{ justifyContent: 'flex-start', alignItems: 'center' }}
					>
						<PageLogo>
							<LogoLink href="/">
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
						</PageLogo>

						<MainNavBarWrapper>
							<MainNavBar />
						</MainNavBarWrapper>

						<Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
							{address && userInfo && (
								<Fragment>
									<AppearWrapper>
										<SwitchNetwork />
									</AppearWrapper>
									<AppearWrapper>
										<PlatformToken />
									</AppearWrapper>
								</Fragment>
							)}

							<ConnectToWallet />

							{address && <PersonalAccount />}

							<MoreOptionList placementDropdown="bottom" />
						</Box>
					</Stack>

					{!open && (
						<NotiBox>
							<Typography variant="body2">
								MetaSpacecy is currently in alpha release which is only supported on
								Rinkeby, Mumbai, BNB testnet, and FUJI testnet.
							</Typography>

							<ModalClose onClick={() => setOpen(false)}>
								<CloseIcon
									sx={{
										fontSize: '1.5rem',
										cursor: 'pointer',
									}}
								/>
							</ModalClose>
						</NotiBox>
					)}
				</Box>
				{/* Fixed Header */}
			</AppbarHeader>
			{address && userInfo && (
				<FixedBottomHeader>
					<Stack
						direction="row"
						alignItems="center"
						justifyContent="flex-end"
						spacing={1}
					>
						<PlatformToken />

						<SwitchNetwork />
						{/* <MoreOptionListBottom placementDropdown="bottom" /> */}
					</Stack>
				</FixedBottomHeader>
			)}
		</>
	);
};
export default React.memo(Header);
