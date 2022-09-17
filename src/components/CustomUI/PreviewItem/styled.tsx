import { styled, Box } from '@mui/material';

export const PreviewItemWrapper = styled(Box)({
	// backgroundColor: 'teal',
	maxWidth: 320,
});

export const ItemImage = styled(Box)(({ theme }) => ({
	position: 'relative',
	width: '100%',
	paddingTop: '100%',
	borderRadius: '10px',
	// overflow: 'hidden',
	cursor: 'pointer',

	'img, video': {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		maxHeight: '100%',
		maxWidth: '100%',
	},
}));

export const EmptyContent = styled(Box)({
	width: '100%',
	height: 380,
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
});

export const MediaWrapper = styled(Box)({
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	maxHeight: '100%',
	maxWidth: '100%',

	video: {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		maxHeight: '100%',
		maxWidth: '100%',
	},
});
