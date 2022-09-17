import { styled, Box } from '@mui/material';

export const IconStyled = styled(Box)(({ theme }) => ({
	width: 22,

	img: {
		display: 'block',
		width: '100%',
	},
}));

export const FilterGroup = styled(Box)(({ theme }) => ({
	display: 'flex',
	gap: 10,
	flexWrap: 'wrap',
}));
