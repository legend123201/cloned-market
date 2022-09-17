import { styled, Box } from '@mui/material';

export const ItemWrapper = styled(Box)(({ theme }) => ({
	marginTop: 8,
	width: 300,

	[theme.breakpoints.down(400)]: {
		width: '100%',
	},
}));
