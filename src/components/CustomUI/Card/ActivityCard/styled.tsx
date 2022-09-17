import { Box, styled } from '@mui/material';

export const ItemMedia = styled(Box)(({ theme }) => ({
	position: 'relative',
	width: 60,
	height: 60,
	borderRadius: theme.shape.borderRadiusSm,
	overflow: 'hidden',
	cursor: 'pointer',
	flexShrink: 0,

	'& video': {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		maxHeight: '100%',
		maxWidth: '100%',
	},

	'& img': {
		objectFit: 'cover',
		width: '100%',
		height: '100%',
	},
}));

export const StyledSpan = styled('span')(({ theme }) => ({
	fontWeight: 400,
	color: 'rgba(255, 255, 255, 0.7)',
}));
