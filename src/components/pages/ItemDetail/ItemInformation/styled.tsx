import { Box, Link, styled, Typography } from '@mui/material';

export const FeatureWrapper = styled(Box)(({ theme }) => ({
	border: '1px solid',
	borderColor: 'grey',
	display: 'flex',
	justifyContent: 'center',
	borderRadius: theme.shape.borderRadiusSm,
}));

export const DropDownWrapper = styled(Box)(({ theme }) => ({
	borderRadius: theme.shape.borderRadiusSm,
	backgroundImage: theme.palette.gradients.modal,
	minWidth: 160,
	padding: '8px 4px',

	...(theme.palette.mode === 'light'
		? {
				background: theme.palette.primaryLight.dark,
		  }
		: {
				backgroundImage: theme.palette.gradients.modal,
		  }),
}));

export const DropDownOption = styled(Link)(({ theme }) => ({
	display: 'block',
	borderRadius: theme.shape.borderRadiusSm,
	padding: '8px 20px',
	color: theme.palette.text.primary,
	cursor: 'pointer',
	transition: 'all 0.2s',
	whiteSpace: 'nowrap',
	fontWeight: 'bold',

	'&:hover': {
		...(theme.palette.mode === 'light'
			? {
					background: theme.palette.primaryLight.light,
			  }
			: {
					background: theme.palette.primary.main,
			  }),
	},
}));

export const CollectionName = styled(Typography)(({ theme }) => ({
	fontWeight: 600,
	color: theme.palette.text.special,
	cursor: 'pointer',
}));

export const ItemDescription = styled(Typography)(({ theme }) => ({
	color: theme.palette.text.secondary,
}));
