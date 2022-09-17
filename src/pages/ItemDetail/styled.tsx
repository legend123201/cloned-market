import { styled, Box } from '@mui/material';

export const WrapperImage = styled(Box)(({ theme }) => ({
	position: 'relative',
	paddingTop: '100%',
	border: '2px solid',
	borderRadius: 20,
	overflow: 'hidden',
	...(theme.palette.mode === 'light'
		? {
				borderColor: theme.palette.primaryLight.darker,
		  }
		: {
				borderColor: theme.palette.primary.main,
		  }),
}));
