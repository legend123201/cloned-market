import { Box, Stack, styled } from '@mui/material';

export const SearchGroup = styled(Stack)(({ theme }) => ({
	borderRadius: 12,
	...(theme.palette.mode === 'light'
		? {
				backgroundColor: theme.palette.primaryLight.main,
				// backdropFilter: 'blur(10px)',
		  }
		: {
				// backgroundColor: theme.palette.primary.main,
				backgroundColor: 'hsla(0,0%,100%,.15)',
				backdropFilter: 'blur(6px)',

				// backgroundColor: 'red',
		  }),
}));

export const DropDownContentBS = styled(Box)(({ theme }) => ({
	display: 'none',
	position: 'absolute',
	top: '120%',
	left: 0,
	transition: 'all 0.2s',
	width: '100%',
	zIndex: 100,
	borderRadius: 12,
	// boxShadow: theme.customShadows.z24,
	overflow: 'hidden',

	...(theme.palette.mode === 'light'
		? {
				backgroundColor: theme.palette.primaryLight.main,
				// backdropFilter: 'blur(10px)',
		  }
		: {
				// backgroundImage: theme.palette.gradients.modal,
				// border: `1px solid ${theme.palette.primary.main}`,
				backgroundColor: 'hsla(0,0%,100%,.15)',
				backdropFilter: 'blur(6px)',
		  }),

	'&.active': {
		display: 'block',
	},
}));
