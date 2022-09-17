import { styled, Box } from '@mui/material';

export const BoxImage = styled(Box)(({ theme }) => ({
	position: 'absolute',
	top: 0,
	left: 0,
	width: '100%',
	height: '100%',
}));

export const MediaWrapper = styled(Box)({
	video: {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		maxHeight: '100%',
		maxWidth: '100%',
	},

	audio: {
		'&::-webkit-media-controls-panel': { backgroundColor: 'red' },
	},
});
