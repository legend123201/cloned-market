import { Box, styled, Typography } from '@mui/material';

export const GridBoxBackGround = styled(Box)(({ theme }) => ({
	borderRadius: '8px',
	height: '80px',
	padding: '12px',
	...(theme.palette.mode === 'light'
		? {
				backgroundColor: theme.palette.primaryLight.main,
		  }
		: {
				backgroundColor: theme.palette.primary.dark,
		  }),
}));

export const BoxContainCountDown = styled(Box)(({ theme }) => ({
	border: '1px solid',
	// borderColor: 'gradient(rgba(7, 104, 255, 0),#0768ff 53%,rgba(7, 104, 255, 0))',
	padding: '32px',
}));

export const ErrorMessage = styled(Typography)(({ theme }) => ({
	color: 'red',
	fontStyle: 'italic',
	fontSize: 14,
	marginTop: 3,
	'&::before': {
		content: '"*"',
	},
}));
export const NoticeMessage = styled(Typography)(({ theme }) => ({
	fontStyle: 'italic',
	fontSize: 12,
	marginTop: 3,
	'&::before': {
		content: '"*"',
	},
}));

export const BottomLine = styled(Box)(({ theme }) => ({
	content: '""',
	height: '2px',
	width: '100%',
	margin: '0 auto',
	...(theme.palette.mode === 'light'
		? {
				background: 'black',
		  }
		: {
				background: 'white',
		  }),
}));
