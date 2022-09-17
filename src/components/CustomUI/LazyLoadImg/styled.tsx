import { Box, styled } from '@mui/material';

export const LazyLoadingImg = styled(Box)(({ theme }) => ({
	width: '100px',
	height: '140px',
	margin: '0 auto',
	transition: 'all 0.5s ease',
	animation: 'vinh 3s ease 1s infinite',
	'@keyframes vinh': {
		'0%': { opacity: '1' },
		'50%': { opacity: '0.6' },
		'100%': { opacity: '1' },
	},
}));
