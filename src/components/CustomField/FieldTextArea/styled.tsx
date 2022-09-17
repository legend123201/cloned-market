import { styled } from '@mui/material';

export const TextArea = styled('textarea')(({ theme }) => ({
	display: 'block',
	border: '1px solid #0768ff',
	outline: 'none',
	background: 'transparent',
	width: '100%',
	borderRadius: 5,
	padding: '5px',
	fontSize: 14,
	color: theme.palette.text.primary,

	'&::placeholder': {
		color: theme.palette.text.primary,
		fontSize: 14,
		fontWeight: 'normal',
		opacity: 0.5,
	},
}));
