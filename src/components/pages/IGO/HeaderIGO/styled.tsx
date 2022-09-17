import { Box, styled } from '@mui/material';

export const SliderCoverItemIGO = styled(Box)(({ theme }) => ({
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center',
	paddingBottom: '48px',

	[theme.breakpoints.down(1024)]: {
		flexDirection: 'column',
	},
	[theme.breakpoints.down(767)]: {
		flexDirection: 'column',
		alignItems: 'flex-start',
	},
}));

export const CoverHeaderImgIGO = styled(Box)(({ theme }) => ({
	minWidth: '500px',
	marginRight: '60px',
	[theme.breakpoints.down(1024)]: {
		minWidth: '400px',
	},
	[theme.breakpoints.down(767)]: {
		minWidth: '100%',
	},
}));

export const StepperCoverIGO = styled(Box)(({ theme }) => ({
	width: '100%',
	[theme.breakpoints.down(1024)]: {
		minWidth: '400px',
	},
	[theme.breakpoints.down(767)]: {
		transform: 'scale(0.8)',
	},
}));
