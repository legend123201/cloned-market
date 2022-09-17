import { Box, styled } from '@mui/material';

export const ItemOfferAuctionDetail = styled(Box)(({ theme }) => ({
	padding: '8px',
	display: 'flex',
	flexDirection: 'row',
	borderRadius: '12px',
	'&:hover': {
		opacity: '0.8',
	},
	...(theme.palette.mode === 'light'
		? {
				backgroundColor: theme.palette.primaryLight.dark,
		  }
		: {
				backgroundColor: theme.palette.primary.dark,
		  }),
}));

export const CoverOfferTab = styled(Box)(({ theme }) => ({
	marginTop: '8px',
	maxHeight: '400px',
	overflow: 'auto',
	'&::-webkit-scrollbar': {
		display: 'block',
		width: '3px',
		height: '4px',
	},
	'&::-webkit-scrollbar-track': {
		display: 'block',
		background: '#0c5599',
	},
	'&::-webkit-scrollbar-thumb': {
		display: 'block',
		background: '#65b8ff',
		borderRadius: '5px',
	},
}));

export const BiderBoxStack = styled(Box)(({ theme }) => ({
	display: 'flex',
	flexDirection: 'row',
	columnGap: '8px',

	[theme.breakpoints.down(600)]: {
		flexDirection: 'column',
	},
}));
