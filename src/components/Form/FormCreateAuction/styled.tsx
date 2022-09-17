import { Box, Stack, styled } from '@mui/material';

export const ItemImageInCreatAuction = styled(Box)(({ theme }) => ({
	borderRadius: '4px',
	overflow: 'hidden',
	marginRight: 8,
	width: '44px',
	height: '44px',

	'&.player-auction': {
		width: '44px ',
		height: '44px',
	},

	img: {
		width: '100%',
		height: '100%',
		objectFit: 'cover',
	},
}));

export const CheckIconWrapperInCreateAution = styled(Box)(({ theme }) => ({
	position: 'absolute',
	right: 20,
	transform: 'translateY(50%)',
	width: 20,
	height: 20,
}));

export const SelectedItemRender = styled(Stack)(({ theme }) => ({
	minHeight: '68px',
	maxWidth: '320px',
	paddingLeft: '12px',
	paddingRight: '12px',
	marginTop: '8px',
	borderRadius: '8px',
	alignItems: 'center',
	overflow: 'hidden',
	...(theme.palette.mode === 'light'
		? {
				backgroundColor: theme.palette.primaryLight.main,
		  }
		: {
				backgroundColor: theme.palette.primary.dark,
		  }),
}));

export const SelectAndInputWrapperCreateAuction = styled(Box)(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	gap: 8,
	borderRadius: '16px',
	// padding: '11px 10px',
	[theme.breakpoints.down(600)]: {
		flexWrap: 'wrap',
	},
	// ...(theme.palette.mode === 'light'
	// 	? {
	// 			backgroundColor: theme.palette.primaryLight.main,
	// 	  }
	// 	: {
	// 			backgroundColor: theme.palette.primary.dark,
	// 	  }),
}));

export const AutoChoose = styled(Box)(({ theme }) => ({
	width: '100%',
	height: '50px',
	padding: '4px 12px',
	backgroundColor: 'red',
	borderRadius: '12px',
	...(theme.palette.mode === 'light'
		? {
				background: theme.palette.primaryLight.main,
		  }
		: {
				background: theme.palette.primary.dark,
		  }),
}));

export const ItemImageSelected = styled(Box)(({ theme }) => ({
	borderRadius: '4px',
	overflow: 'hidden',
	marginRight: 4,
	width: '56px',
	height: '56px',

	'&.player-auction': {
		width: '44px ',
		height: '44px',
	},

	img: {
		width: '100%',
		height: '100%',
		objectFit: 'cover',
	},
}));
