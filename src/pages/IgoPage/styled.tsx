/* eslint-disable @typescript-eslint/no-unused-vars */
import { Typography, styled, Box } from '@mui/material';

export const AuctionHeader = styled(Typography)(({ theme }) => ({
	fontSize: '78px',
	textAlign: 'center',
	fontWeight: '400',
	fontStyle: 'italic',
	position: 'relative',
	[theme.breakpoints.down('lg')]: {
		fontSize: '48px',
	},
	[theme.breakpoints.down('md')]: {
		fontSize: '38px',
	},
}));

export const SubAuctionHeader = styled(Box)(({ theme }) => ({
	fontSize: '36px',
	textAlign: 'center',
	fontWeight: '400',
	position: 'relative',
	[theme.breakpoints.down('lg')]: {
		fontSize: '48px',
	},
	[theme.breakpoints.down('md')]: {
		fontSize: '18px',
	},
}));

export const Devider = styled('span')({
	position: 'absolute',
	bottom: '-8px',
	left: '0',
	width: '100%',
	height: '4px',
	marginTop: '16px',
	background: 'linear-gradient(to right,rgba(7, 104, 255, 0),#0768ff 53%,rgba(7, 104, 255, 0))',
});
