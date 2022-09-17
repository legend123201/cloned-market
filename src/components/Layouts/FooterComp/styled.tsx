import { Box, styled } from '@mui/material';

export const BigContainer = styled(Box)(({ theme }) => ({
	padding: '0 8rem 8rem 8rem',
	maxWidth: '2000px',
	margin: '0 auto',
	'@media screen and (max-width: 1100px)': { padding: '0 4rem 4rem 4rem' },
	'@media screen and (max-width: 600px)': { padding: '0 8px 8px 8px' },
}));
export const FooterWrap = styled('footer')(({ theme }) => ({
	borderRadius: '12px',
	...(theme.palette.mode === 'light'
		? {
				backgroundColor: 'rgb(255,255,255)',
		  }
		: {
				backgroundColor: 'rgba(13,16,45,0.13)',
		  }),
}));

export const GridContent = styled(Box)({
	display: 'flex',
	flexDirection: 'row',
	flexWrap: 'wrap',
	gap: '18px',

	'@media screen and (min-width: 768px)': {},
	'@media screen and (max-width: 768px)': {},
});
export const BrandWrap = styled('div')({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'flex-start',
	textAlign: 'left',
	width: '20%',
	marginTop: '32px',
	'@media screen and (max-width: 1100px)': { width: '100%', alignItems: 'center' },
	'@media screen and (max-width: 600px)': { width: '100%', alignItems: 'center' },
});
export const LogoLink = styled('a')(({ theme }) => ({
	color: 'inherit',
	textDecoration: 'none',
	marginBottom: '1.5rem',
	display: 'inline-block',
	marginTop: '-12px',

	flexShrink: 0,
	'.logoMobile': {
		width: '100%',
		height: 50,
	},
	'.logoPC': {
		width: '100%',
		height: 50,
	},
	'@media screen and (max-width: 450px)': {
		'.logoMobile': {
			display: 'block',
		},
		'.logoPC': {
			display: 'none',
		},
	},
	'@media screen and (min-width: 450px)': {
		'.logoMobile': {
			display: 'none',
		},
		'.logoPC': {
			display: 'block',
		},
	},
}));
export const FooterText = styled('p')(({ theme }) => ({
	marginBottom: '2rem',
	marginRight: '1rem',
	'@media screen and (max-width: 768px)': {
		textAlign: 'center',
		marginRight: 'unset',
	},
}));
export const SocialWrap = styled('div')({
	display: 'flex',
});
export const SocialIconLink = styled('a')({
	color: 'inherit',
	textDecoration: 'none',
	marginRight: '1.25rem',
	svg: {
		width: '1.5rem',
		height: '1.25rem',
		fill: '#a1a2b3',
	},
});
export const DetailColumn = styled('div')({
	width: '15%',
	marginTop: '32px',

	'@media screen and (min-width: 768px)': {
		width: '15%',
	},
	'@media screen and (max-width: 600px)': {
		width: '48%',
	},
});
export const DetailTitle = styled('h3')(({ theme }) => ({
	marginBottom: '1.5rem',
	fontSize: '.875rem',
	lineHeight: 'normal',
	...(theme.palette.mode === 'light'
		? {
				color: 'rgb(19,23,64)',
		  }
		: {
				color: 'rgb(255,255,255)',
		  }),
}));
export const DetailList = styled('ul')(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	listStyle: 'none',
	...(theme.palette.mode === 'light'
		? {}
		: {
				color: 'rgb(161,162,179)',
		  }),
}));
export const ListRow = styled('li')({});
export const DetailLink = styled('a')({
	color: 'inherit',
	textDecoration: 'none',
});

export const DetailContainer = styled(Box)(({ theme }) => ({
	display: 'flex',
	flexDirection: 'row',
	// width: '65%',
	marginLeft: '32px',
	flexWrap: 'wrap',
	gap: '18px',
	flexGrow: '1',
	justifyContent: 'space-between',
	'@media screen and (max-width: 1100px)': {
		width: '100%',
	},
	'@media screen and (max-width: 600px)': {
		width: '100%',
		gap: '8px',
	},
}));
