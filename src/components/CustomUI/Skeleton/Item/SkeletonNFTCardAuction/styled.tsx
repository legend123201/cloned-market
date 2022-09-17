import { styled, Box, Skeleton } from '@mui/material';

export const CardWrapper = styled(Box)(({ theme }) => ({
	borderRadius: '12px',
	overflow: 'hidden',

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

export const SkeletonImage = styled(Skeleton)({
	height: '248px',
});

export const SkeletonContent = styled(Box)({});
