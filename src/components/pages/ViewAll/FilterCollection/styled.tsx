import { Box, styled, Typography } from '@mui/material';

export const FilterButton = styled(Box)(({ theme }) => ({
	display: 'flex',
	padding: '10px 20px',
	border: '1px solid',
	borderColor: 'grey',
	borderRadius: theme.shape.borderRadiusSm,
	cursor: 'pointer',
	transition: 'all 0.2s',

	'&:hover': {
		...(theme.palette.mode === 'light'
			? {
					backgroundColor: theme.palette.primaryLight.dark,
			  }
			: { backgroundColor: theme.palette.primary.main }),

		transform: 'scale(0.95)',
	},

	'&.active': {
		...(theme.palette.mode === 'light'
			? {
					backgroundColor: theme.palette.primaryLight.dark,
			  }
			: { backgroundColor: theme.palette.primary.main }),
	},
}));

export const ButtonShow = styled(Typography)(({ theme }) => ({
	cursor: 'pointer',
	color: theme.palette.primary.light,

	'&:hover': {
		color: theme.palette.primary.lighter,
	},
}));
