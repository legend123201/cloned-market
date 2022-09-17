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

export const OwnedAmount = styled(Box)(({ theme }) => ({
	position: 'absolute',
	top: 10,
	right: 10,
	padding: '5px 10px 5px 10px',
	borderRadius: theme.shape.borderRadiusSm,

	...(theme.palette.mode === 'light'
		? {
				backgroundColor: theme.palette.primaryLight.main,
		  }
		: {
				backgroundColor: theme.palette.primary.main,
		  }),
}));
