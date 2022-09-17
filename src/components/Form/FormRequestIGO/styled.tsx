import { Box, Stack, styled } from '@mui/material';

export const FieldRenderDropdown = styled(Box)(({ theme }) => ({
	border: 'none',
	borderRadius: '12px',
	padding: '15px',
	outline: 'none',
	fontSize: '16px',
	fontWeight: 500,
	lineHeight: '16px',
	color: theme.palette.text.primary,
	display: 'flex',
	flexDirection: 'row',
	gap: '8px',
	width: '140px',

	...(theme.palette.mode === 'light'
		? {
				background: theme.palette.primaryLight.main,
		  }
		: {
				background: theme.palette.primary.dark,
		  }),

	'&::placeholder': {
		color: theme.palette.text.primary,
		fontSize: '16px',
		fontWeight: 500,
		opacity: 0.4,
	},
}));

export const ConatainerFieldInput = styled(Box)(({ theme }) => ({
	borderRadius: '12px',
	display: 'flex',
	flexDirection: 'row',
	justifyContent: 'space-between',
	alignItems: 'center',
	cursor: 'pointer',
	...(theme.palette.mode === 'light'
		? {
				background: theme.palette.primaryLight.main,
		  }
		: {
				background: theme.palette.primary.dark,
		  }),
	'&::placeholder': {
		color: theme.palette.text.primary,
		fontSize: '16px',
		fontWeight: 500,
		opacity: 0.4,
	},
}));

export const OptionItem = styled(Stack)(({ theme }) => ({
	borderRadius: '8px',
	cursor: 'pointer',

	'&:hover': {
		...(theme.palette.mode === 'light'
			? {
					background: theme.palette.primaryLight.main,
			  }
			: {
					background: theme.palette.primary.main,
			  }),
	},
}));
