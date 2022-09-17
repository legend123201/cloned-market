/* eslint-disable @typescript-eslint/no-unused-vars */
import { styled, Box, Link, AppBarProps, AppBar } from '@mui/material';

interface AppbarHeaderProps extends AppBarProps {
	background: boolean;
}

export const AppbarHeader = styled((props: AppbarHeaderProps) => {
	const { background, ...other } = props;
	return <AppBar {...other} />;
})(({ theme, background }) => ({
	padding: '1.5rem',
	[theme.breakpoints.down(786)]: {
		padding: '8px 1.5rem',
	},
	// ...(theme.palette.mode === 'light'
	// 	? {
	// 			backgroundImage: background
	// 				? 'linear-gradient(rgba(255, 255, 255, 0.98) 65%, transparent)'
	// 				: 'unset',
	// 	  }
	// 	: {
	// 			background: background
	// 				? 'linear-gradient(rgba(2, 12, 29, 0.584) 65%, transparent)'
	// 				: 'unset',
	// 	  }),

	...(theme.palette.mode === 'dark'
		? background
			? {
					// background: 'linear-gradient(rgba(2, 12, 29, 0.584) 65%, transparent)',
					background: 'rgb(35 35 35 / 20%)',
					backdropFilter: 'blur(6px)',
					borderBottom: '1px solid',
					borderColor: '#4b4b4b1c',
			  }
			: { background: 'unset' }
		: background
		? {
				backdropFilter: 'saturate(180%) blur(20px)',
				backgroundColor: 'rgba(255,255,255,0.72)',
				borderBottom: 'solid 1px #d8d1d1',
		  }
		: {
				backdropFilter: 'saturate(180%) blur(20px)',
				backgroundColor: 'rgba(255,255,255,0.72)',
				borderBottom: 'solid 1px #d8d1d1',
		  }),
}));

export const PageLogo = styled(Box)(({ theme }) => ({ flexShrink: '0' }));

export const MainNavBarWrapper = styled(Box)(({ theme }) => ({
	flexGrow: 1,
}));

export const LogoLink = styled(Link)(({ theme }) => ({
	'.logoMobile': {
		width: '100%',
		height: 50,
	},
	'.logoPC': {
		width: '100%',
		height: 50,
	},
	'@media screen and (max-width: 450px)': {
		'.logoMobile': {
			display: 'block',
		},
		'.logoPC': {
			display: 'none',
		},
	},
	'@media screen and (min-width: 450px)': {
		'.logoMobile': {
			display: 'none',
		},
		'.logoPC': {
			display: 'block',
		},
	},
}));

export const AppearWrapper = styled(Box)(({ theme }) => ({
	display: 'none',
	'@media screen and (min-width: 1560px)': {
		display: 'block',
	},
}));

export const ConnectToWalletWrapper = styled(Box)(({ theme }) => ({
	display: 'none',
	'@media screen and (min-width: 750px)': {
		display: 'block',
	},
}));

export const NotiBox = styled('div')(({ theme }) => ({
	position: 'relative',
	width: '100%',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	padding: '1rem',
	paddingRight: '2.3rem',

	...(theme.palette.mode === 'light'
		? {
				background: 'linear-gradient(rgb(106 232 255 / 80%) 100%, transparent)',
		  }
		: {
				background: 'linear-gradient(rgb(8 37 86 / 58%) 100%, transparent)',
		  }),
}));

export const ModalClose = styled('div')({
	position: 'absolute',
	top: 15,
	right: 15,
});

export const FixedBottomHeader = styled('div')(({ theme }) => ({
	position: 'fixed',
	zIndex: 999,
	bottom: 0,
	left: 0,
	width: '100%',

	display: 'none',
	padding: '5px',
	...(theme.palette.mode === 'dark'
		? {
				// background: 'linear-gradient(rgba(2, 12, 29, 0.584) 65%, transparent)',
				background: 'rgb(35 35 35 / 20%)',
				backdropFilter: 'blur(6px)',
				borderBottom: '1px solid',
				borderColor: '#4b4b4b1c',
		  }
		: {
				backdropFilter: 'saturate(180%) blur(20px)',
				backgroundColor: 'rgba(255,255,255,0.72)',
				borderBottom: 'solid 1px #d8d1d1',
		  }),
	'@media screen and (max-width: 785px)': {
		display: 'block',
		float: 'right',
	},
}));
