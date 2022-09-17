import { Box, styled } from '@mui/material';

export const TabWrapperContainer = styled(Box)(({ theme }) => ({
	border: '1px solid',
	borderRadius: theme.shape.borderRadius,
	padding: '4px',
	...(theme.palette.mode === 'light'
		? {
				backgroundColor: theme.palette.primaryLight.main,
				borderColor: theme.palette.primaryLight.darker,
		  }
		: {
				backgroundColor: '#021630a3',
				borderColor: theme.palette.primary.main,
		  }),
}));
