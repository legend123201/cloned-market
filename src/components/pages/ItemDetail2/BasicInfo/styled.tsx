import { Box, styled } from '@mui/material';

export const DeviderGradientNext = styled(Box)(({ theme }) => ({
	margin: '0 12px',
	width: '2px',
	height: '75px',
	background: 'linear-gradient(to top,rgba(7, 104, 255, 0),#0768ff 53%,rgba(7, 104, 255, 0))',
}));

export const ContainerOwnerAndCollectionAuctionDetail = styled(Box)(({ theme }) => ({
	minWidth: '240px',
	padding: '8px',
	display: 'flex',
	flexDirection: 'row',
	borderRadius: '12px',
	...(theme.palette.mode === 'light'
		? {
				backgroundColor: theme.palette.primaryLight.dark,
		  }
		: {
				backgroundColor: theme.palette.primary.dark,
		  }),
}));
