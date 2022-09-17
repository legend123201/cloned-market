import { styled, Stack, Box } from '@mui/material';

export const SelectOptionBox = styled(Box)(({ theme }) => ({
	position: 'relative',
	cursor: 'pointer',
	borderRadius: '12px',
	padding: '10px 5px 10px 8px',
	flexShrink: 0,

	...(theme.palette.mode === 'light'
		? {
				backgroundColor: theme.palette.primaryLight.dark,
		  }
		: {
				backgroundColor: theme.palette.primary.dark,
		  }),
}));

export const DropDownOverlay = styled(Box)(({ theme }) => ({
	position: 'fixed',
	display: 'none',
	top: 0,
	left: 0,
	width: '100vw',
	height: '100vh',
	// backgroundColor: 'black',
	zIndex: 1,

	'&.active': {
		display: 'block',
	},
}));

export const DropDownContent = styled(Stack)(({ theme }) => ({
	display: 'none',
	position: 'absolute',
	top: '110%',
	left: 0,
	width: '100%',
	maxHeight: '300px',
	borderRadius: 10,
	zIndex: 100,
	overflowY: 'auto',

	...(theme.palette.mode === 'light'
		? {
				backgroundColor: theme.palette.primaryLight.dark,
				boxShadow: theme.customShadows.cardLight,
		  }
		: {
				backgroundColor: theme.palette.primary.dark,
				border: '1px solid',
				borderColor: theme.palette.border.cardDark,
		  }),

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
	'&.active': {
		display: 'block',
	},
}));

export const ListOption = styled(Stack)(({ theme }) => ({}));

export const OptionItem = styled(Stack)(({ theme }) => ({
	paddingLeft: 5,
	paddingRight: 5,
	cursor: 'pointer',

	'&:hover': {
		...(theme.palette.mode === 'light'
			? {
					background: theme.palette.primaryLight.main,
			  }
			: {
					background: theme.palette.primary.main,
			  }),
	},
}));

export const ContentWrapper = styled(Box)(({ theme }) => ({
	padding: '10px 5px 10px 8px',
}));
