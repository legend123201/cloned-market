import { Box, styled } from '@mui/material';

export const GridContainer = styled(Box)(({ theme }) => ({
	display: 'grid',
	gridTemplateColumns: 'repeat(4, 1fr)',
	maxHeight: '1200px',
	overflowY: 'auto',
	gap: '12px',
	[theme.breakpoints.down(1024)]: {
		gridTemplateColumns: 'repeat(3, 1fr)',
	},
	[theme.breakpoints.down(767)]: {
		gridTemplateColumns: 'repeat(2, 1fr)',
	},
	[theme.breakpoints.down(545)]: {
		gridTemplateColumns: 'repeat(1, 1fr)',
	},
	/* scrollbar */
	'&::-webkit-scrollbar': {
		width: '3px',
		height: '4px',
		display: 'none',
		background: '#33BAFF',
	},

	/* Track */
	'&::-webkit-scrollbar-track': {
		// boxShadow: 'inset 0 0 5px grey',
		borderRadius: 10,
		background: '#08569E',
	},

	/* Handle */
	'&::-webkit-scrollbar-thumb': {
		background: '#33BAFF',
		borderRadius: 10,
		cursor: 'pointer',
	},

	/* Handle on hover */
	'&::-webkit-scrollbar-thumb:hover': {
		background: '#0083c4',
	},
}));
