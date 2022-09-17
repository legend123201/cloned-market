import { styled, Box } from '@mui/material';

export const PreviewItemWrapper = styled(Box)({
	// backgroundColor: 'teal',
	maxWidth: 320,
});

export const EmptyContent = styled(Box)({
	width: '100%',
	height: 380,
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
});

export const TopSlashLayout = styled(Box)(({ theme }) => ({
	position: 'absolute',
	top: '-4px',
	left: '2.5%',
	borderTopLeftRadius: '8px',
	borderTopRightRadius: '8px',
	width: '95%',
	height: '16px',
	zIndex: '-90',
	// backgroundColor: 'red',
	...(theme.palette.mode === 'light'
		? {
				boxShadow: theme.customShadows.cardLight,
		  }
		: {
				// border: '2px solid',
				borderColor: theme.palette.primary.main,
				background: theme.palette.gradients.fourth,
		  }),
}));

export const CountItem = styled(Box)({
	backdropFilter: 'blur(8px)',
	backgroundColor: 'rgba(255, 255, 255, 0.9)',
	borderRadius: '8px',
	left: '10px',
	padding: '4px 8px',
	position: 'absolute',
	top: '10px',
	zIndex: 1,
	color: 'black',
});
