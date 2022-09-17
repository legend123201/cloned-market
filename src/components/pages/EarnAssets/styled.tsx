import { Box, styled } from '@mui/material';

export const ItemWrapperIGO = styled(Box)(({ theme }) => ({
	boxSizing: 'border-box',
	margin: '0px',
	minWidth: '0px',
	display: 'flex',
	position: 'relative',
	border: '1px solid',
	borderRadius: '8px',
	overflow: 'hidden',
	flexDirection: 'column',
	width: '100%',
	height: '100%',
	cursor: 'pointer',

	...(theme.palette.mode === 'light'
		? {
				boxShadow: theme.customShadows.cardLight,
				'&:hover': {
					img: {
						transform: 'scale(1.05)',
						transition: 'all 1s ease',
					},
					background: '#e4e4e4;',
				},
		  }
		: {
				borderColor: theme.palette.primary.light,
				backgroundImage: theme.palette.gradients.secondary,
				'&:hover': {
					img: {
						transform: 'scale(1.02)',
						transition: 'all 1s ease',
					},
					backgroundImage: theme.palette.gradients.third,
				},
		  }),
}));

export const TextWrapperIGO = styled(Box)(({ theme }) => ({
	boxSizing: 'border-box',
	margin: '0px',
	minWidth: '0px',
	display: 'flex',
	position: 'relative',
	flexDirection: 'column',
	paddingTop: '12px',
	paddingBottom: '12px',
	flex: '1 1 0%',
	padding: '0px 16px 16px 16px',
}));

export const GridWrapperIGO = styled(Box)(({ theme }) => ({
	boxSizing: 'border-box',
	margin: '16px 0px 0px 0px',
	minWidth: '0px',
	display: 'grid',
	gap: '12px 16px',
	gridTemplateColumns: 'repeat(1, 1fr)',
}));

export const GridContainer = styled(Box)(({ theme }) => ({
	display: 'grid',
	gridTemplateColumns: 'repeat(3, 1fr)',
	maxHeight: '1200px',
	overflowY: 'auto',
	gap: '32px 24px',
	[theme.breakpoints.down(1024)]: {
		gridTemplateColumns: 'repeat(2, 1fr)',
	},
	[theme.breakpoints.down(767)]: {
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
