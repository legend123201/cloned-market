import { Stack, styled } from '@mui/material';

export const SkeletonCollectionCardContainer = styled(Stack)(({ theme }) => ({
	minWidth: '339px',
	minHeight: '402px',
	borderRadius: '12px',
	overflow: 'hidden',
	padding: '12px',
	...(theme.palette.mode === 'light'
		? {
				boxShadow: theme.customShadows.cardLight,
				background: theme.palette.primaryLight.lighter,
		  }
		: {
				background: theme.palette.gradients.fourth,
		  }),
}));
