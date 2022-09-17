import { styled, Box, Skeleton } from '@mui/material';

export const CardWrapper = styled(Box)(({ theme }) => ({
	borderRadius: theme.shape.borderRadiusMd,
	overflow: 'hidden',
	position: 'relative',

	...(theme.palette.mode === 'light'
		? {
				boxShadow: theme.customShadows.cardLight,
				background: theme.palette.primaryLight.lighter,
		  }
		: {
				border: '1px solid',
				borderColor: theme.palette.primary.main,
				background: theme.palette.primary.darker,
		  }),
}));

export const SkeletonImageWrapper = styled(Box)({
	position: 'relative',
	paddingTop: '50%',
	margin: '0 auto',
	borderRadius: '8px',
	// overflow: 'hidden',
	width: '50%',
});

export const SkeletonImage = styled(Skeleton)({
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	height: '100%',
	width: '100%',
});
