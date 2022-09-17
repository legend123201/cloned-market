import { Box, styled } from '@mui/material';

export const Wrapper = styled(Box)(({ theme }) => ({
	display: 'flex',
	gap: '8%',

	[theme.breakpoints.down('md')]: {
		flexDirection: 'column',
	},
}));

export const ListHistory = styled(Box)(({ theme }) => ({
	flexGrow: 1,
}));

export const FilterWrapper = styled(Box)(({ theme }) => ({
	width: '30%',

	[theme.breakpoints.down('md')]: {
		order: -1,
		width: '100%',
		marginBottom: 12,
	},
}));

export const StyledSpan = styled('span')(({ theme }) => ({
	fontWeight: 400,
	color: theme.palette.text.secondary,
}));
