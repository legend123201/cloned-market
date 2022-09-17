import { styled } from '@mui/material';

export const CardSlide = styled('div')(({ theme }) => ({
	display: 'flex',
	flexDirection: 'row',
	paddingBottom: 20,
	overflowX: 'auto',
	/* scrollbar */
	'&::-webkit-scrollbar': {
		height: 4,
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

export const SubTab = styled('div')(({ theme }) => ({
	borderRadius: theme.shape.borderRadiusSm,
	padding: '5px 10px',
	cursor: 'pointer',

	'&:hover, &.active': {
		...(theme.palette.mode === 'light'
			? {
					background: theme.palette.primaryLight.dark,
			  }
			: {
					background: theme.palette.primary.main,
			  }),
	},
}));
