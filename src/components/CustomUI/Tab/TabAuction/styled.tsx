import TabList from '@mui/lab/TabList';
import { styled, Tab, Typography } from '@mui/material';

export const TabListStyled = styled(TabList)(({ theme }) => ({
	'& .MuiTabs-indicator': {
		// background:
		// 	'linear-gradient(to right,rgba(7, 104, 255, 0),#0768ff 53%,rgba(7, 104, 255, 0))',
		// background: theme.palette.gradients.line,
		background: 'none',
	},

	'& .MuiTabs-scroller button': {
		flexGrow: 1,
	},
}));

export const TabStyled = styled(Tab)(({ theme }) => ({
	color: theme.palette.text.primary,
	opacity: 0.5,

	'&:hover': {
		color: theme.palette.text.primary,
		opacity: 0.87,
	},
	'&.Mui-selected': {
		color: theme.palette.text.primary,
		fontWeight: theme.typography.fontWeightMedium,
		opacity: 1,
	},
	'&.Mui-focusVisible': {
		backgroundColor: '#d1eaff',
	},
}));

export const TypographyStyled = styled(Typography)(({ theme }) => ({
	fontSize: '1.75rem',
	[theme.breakpoints.down('md')]: {
		fontSize: '1.5rem',
	},
	[theme.breakpoints.down('sm')]: {
		fontSize: '1rem',
	},
}));
