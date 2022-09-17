import { styled, Box, Stack, Typography } from '@mui/material';

export const CollectionBackground = styled(Box)(({ theme }) => ({
	position: 'relative',

	height: 250,

	[theme.breakpoints.down('lg')]: {
		height: 200,
	},

	[theme.breakpoints.down('md')]: {
		height: 150,
	},
}));

export const CollectionAvatar = styled(Box)(({ theme }) => ({
	position: 'absolute',
	bottom: 0,
	left: '50%',
	transform: 'translate(-50%, 50%)',
	width: 150,
	height: 150,

	border: '3px solid',
	borderColor: theme.palette.primary.main,
	borderRadius: theme.shape.borderRadiusMd,
	// overflow: 'hidden',

	[theme.breakpoints.down('sm')]: {
		width: 100,
		height: 100,
	},
}));

export const CollectionMoreInfoWrapper = styled(Stack)(({ theme }) => ({
	alignItems: 'center',
	marginTop: '-40px',
}));

export const CollectionMoreInfo = styled(Stack)(({ theme }) => ({
	alignItems: 'center',
	maxWidth: 800,
}));

export const CollectionDescription = styled(Typography)(({ theme }) => ({
	textAlign: 'center',
	marginTop: 25,
}));

export const ReadMoreButton = styled(Typography)(({ theme }) => ({
	cursor: 'pointer',
	...(theme.palette.mode === 'light'
		? {
				color: theme.palette.primary.lighter,
		  }
		: {
				color: theme.palette.success.main,
		  }),
}));
