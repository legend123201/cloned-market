import { Stack, styled, Link, Box } from '@mui/material';

export const FooterHome = styled(Box)(({ theme }) => ({
	marginTop: 100,
	paddingBottom: 60,
	color: '#125ea1',

	a: {
		color: '#125ea1',
		textDecoration: 'none',
	},

	[theme.breakpoints.down('sm')]: {
		'& *': { fontSize: '12px !important' },
	},
}));

export const StyledLink = styled(Link)(({ theme }) => ({
	fontStyle: 'italic',
	transition: 'all 0.2s',

	'&:hover': {
		color: theme.palette.primary.light,
	},
}));

export const SocialMedia = styled(Stack)(({ theme }) => ({
	a: {
		img: {
			width: 'auto',
			height: 20,
			transition: 'all 0.2s',
		},

		'&:hover': {
			img: {
				transform: 'scale(1.4)',
			},
		},
	},

	'@media screen and (max-width: 400px)': {
		img: {
			width: 'auto',
			height: 17,
		},
	},
}));
