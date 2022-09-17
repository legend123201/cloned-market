import TabList from '@mui/lab/TabList';
import { styled, Tab } from '@mui/material';

const tabBreakpoint = 700; // need this because on small screen, the scroll + .MuiTabs-flexContainer justifyContent: 'center' will error, we can not see full the text

export const TabListStyled = styled(TabList)(({ theme }) => ({
	'& .MuiTabs-flexContainer': {
		[theme.breakpoints.up(tabBreakpoint)]: {
			justifyContent: 'center',
		},
	},

	'& .MuiTabs-indicator': {
		background: 'none',
	},

	'& .MuiTabs-scroller button': {
		[theme.breakpoints.down(tabBreakpoint)]: {
			flexGrow: 1,
		},
	},
}));

export const TabStyled = styled(Tab)(({ theme }) => ({
	color: theme.palette.text.primary,
	opacity: 0.5,

	'& .selected': {
		display: 'none',
	},
	'& .unselected': {
		display: 'block',
	},

	'&:hover': {
		opacity: 0.8,

		'& .selected': {
			display: 'block',
		},
		'& .unselected': {
			display: 'none',
		},
	},

	'&.Mui-selected': {
		opacity: 1,

		'& .selected': {
			display: 'block',
		},
		'& .unselected': {
			display: 'none',
		},
	},
	'&.Mui-focusVisible': {
		backgroundColor: '#d1eaff',
	},
}));
