import { Box, Button, styled } from '@mui/material';

export const GridEnedIgoContainer = styled(Box)(({ theme }) => ({
	display: 'grid',
	gridTemplateColumns: 'repeat(3, 1fr)',
	maxHeight: '500px',
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

export const WrapperImage = styled(Box)(({ theme }) => ({
	position: 'relative',
	width: '100%',
	paddingTop: '100%',
	borderRadius: '10px',
	overflow: 'hidden',

	img: {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		maxHeight: '100%',
		maxWidth: '100%',
	},
}));

export const ItemEndIgo = styled(Box)(({ theme }) => ({
	display: 'flex',
	flexDirection: 'row',
	gap: '20px',
	border: '1px solid',
	borderRadius: '8px',
	overflow: 'hidden',
	flex: '1 1 0%',
	padding: '8px',
	cursor: 'pointer',
	...(theme.palette.mode === 'light'
		? {
				boxShadow: theme.customShadows.cardLight,
				'&:hover': {
					backgroundColor: '#eeeded',
				},
		  }
		: {
				borderColor: theme.palette.primary.main,

				'&:hover': {
					backgroundImage: theme.palette.gradients.fourth,
				},
		  }),
}));

export const BorderApplyIGO = styled(Box)(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	textAlign: 'center',
	border: '1px solid',
	borderRadius: '12px',
	alignItems: 'center',
	padding: '40px',
	gap: '20px',
	marginTop: '64px',
	[theme.breakpoints.down(600)]: {
		padding: '8px',
	},
	...(theme.palette.mode === 'light'
		? {
				color: theme.customShadows.cardLight,
		  }
		: {
				borderColor: theme.palette.primary.light,
				// backgroundImage: theme.palette.gradients.secondary,
		  }),
}));

export const ButtonApplyIGO = styled(Button)(({ theme }) => ({
	width: '140px',
	height: '40px',
	borderRadius: '12px',
	...(theme.palette.mode === 'light'
		? {
				color: theme.customShadows.cardLight,
		  }
		: {
				// borderColor: theme.palette.primary.light,
				backgroundImage: theme.palette.gradients.third,
				color: 'white',
		  }),
}));
