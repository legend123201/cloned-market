import { styled, Box, Skeleton } from '@mui/material';

export const CardWrapper = styled(Box)(({ theme }) => ({
	borderRadius: theme.shape.borderRadiusMd,
	overflow: 'hidden',
	position: 'relative',
	padding: 10,

	...(theme.palette.mode === 'light'
		? {
				boxShadow: theme.customShadows.cardLight,
				background: theme.palette.primaryLight.lighter,
		  }
		: {
				border: '2px solid',
				borderColor: theme.palette.primary.main,
				background: theme.palette.gradients.fourth,
		  }),
}));

export const SkeletonImageWrapper = styled(Box)({
	position: 'relative',
	width: '100%',
	paddingTop: '50%',
	margin: '0 auto',
	borderRadius: '10px',
	overflow: 'hidden',
});

export const SkeletonImage = styled(Skeleton)({
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	height: '100%',
	width: '100%',
});
