import { Box, styled, Stack, Link } from '@mui/material';

export const TabWrapper = styled(Box)(({ theme }) => ({
	padding: 20,
	border: '1px solid',
	// borderTop: 'none',
	// borderBottomLeftRadius: theme.shape.borderRadius,
	// borderEndEndRadius: theme.shape.borderRadius,
	borderRadius: theme.shape.borderRadius,

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

export const DetailTitle = styled(Stack)(({ theme }) => ({
	minWidth: 150,
	color: theme.palette.text.secondary,
}));

export const ContractAddress = styled(Link)(({ theme }) => ({
	color: theme.palette.text.special,
}));
