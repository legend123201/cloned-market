import { styled, Typography } from '@mui/material';

export const UserInfo = styled(Typography)(({ theme }) => ({
	fontWeight: '600',
}));

export const TitleInfo = styled(UserInfo)(({ theme }) => ({}));

export const UserName = styled(UserInfo)(({ theme }) => ({
	color: theme.palette.text.special,
	cursor: 'pointer',

	'&:hover': {
		textDecoration: 'underline !important',
	},
}));
