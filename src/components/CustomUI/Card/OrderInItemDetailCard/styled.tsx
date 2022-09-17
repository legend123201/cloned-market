import { Box, styled } from '@mui/material';

export const OrderCard = styled(Box)(({ theme }) => ({
	position: 'relative',
	display: 'flex',
	alignItems: 'center',
	padding: '12px',
	borderBottom: '1px solid grey',
	cursor: 'pointer',

	':hover': {
		...(theme.palette.mode === 'light'
			? {
					backgroundColor: theme.palette.primaryLight.dark,
			  }
			: {
					backgroundColor: theme.palette.primary.main,
			  }),

		'.ButtonDisplay': {
			display: 'block',
		},
	},
}));

export const StyledSpan = styled('span')(({ theme }) => ({
	fontWeight: 400,
	color: theme.palette.text.secondary,
}));

export const ButtonBox = styled(Box)(({ theme }) => ({
	position: 'absolute',
	top: '50%',
	right: 10,
	transform: 'translateY(-50%)',
	width: '100px',
	display: 'none',
}));
