import { Box, styled, Typography } from '@mui/material';

export const BoxCoverStakingPools = styled(Box)(({ theme }) => ({
	border: '2px solid',
	borderRadius: '12px',
	padding: 30,

	...(theme.palette.mode === 'dark'
		? {
				backgroundColor: theme.palette.primary.darker,
				borderColor: theme.palette.primary.main,
				// '&:hover': {
				// 	transform: 'scale(1.02)',
				// 	backgroundColor: 'rgba(11,46,75, 0.5)',
				// },
		  }
		: {
				backgroundColor: theme.palette.primaryLight.lighter,
				borderColor: theme.palette.primaryLight.dark,
				// '&:hover': {
				// 	transform: 'scale(1.02)',
				// 	backgroundColor: theme.palette.primaryLight.main,
				// },
		  }),
}));

export const OpacityTypography = styled(Typography)(({ theme }) => ({
	color: theme.palette.text.secondary,
}));
