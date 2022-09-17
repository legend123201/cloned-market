import { styled, Box, Typography } from '@mui/material';

export const Wrapper = styled(Box)(({ theme }) => ({
	border: '1px solid',

	borderRadius: theme.shape.borderRadiusSm,
	padding: 18,

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

export const OrderListWrapper = styled(Box)(({ theme }) => ({
	maxHeight: 200,
	overflow: 'auto',

	'&::-webkit-scrollbar': {
		display: 'block',
		width: 3,
	},
	'&::-webkit-scrollbar-track': {
		display: 'block',
		background: '#0c5599',
	},
	'&::-webkit-scrollbar-thumb': {
		display: 'block',
		background: '#65b8ff',
		borderRadius: '5px',
	},
}));

export const OptionItem = styled(Typography)(({ theme }) => ({
	cursor: 'pointer',
	color: theme.palette.text.secondary,

	'&:hover': {
		color: theme.palette.text.primary,
	},

	'&.active': {
		textDecoration: 'underline !important',
		color: theme.palette.text.primary,
	},
}));

export const OrderList = styled(Box)(({ theme }) => ({
	maxHeight: 400,
	overflow: 'auto',

	[theme.breakpoints.down('lg')]: {
		maxHeight: 350,
	},

	'&::-webkit-scrollbar': {
		display: 'block',
		width: '3px',
		height: '4px',
	},
	'&::-webkit-scrollbar-track': {
		display: 'block',
		background: '#0c5599',
	},
	'&::-webkit-scrollbar-thumb': {
		display: 'block',
		background: '#65b8ff',
		borderRadius: '5px',
	},
}));
