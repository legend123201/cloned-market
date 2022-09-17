import { styled, Box, Stack } from '@mui/material';

export const MainImage = styled(Box)(({ theme }) => ({
	position: 'relative',
	width: '100%',
	paddingTop: 400,
	margin: '0 auto',
	borderRadius: '10px',
	overflow: 'hidden',

	img: {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		maxHeight: '100%',
		maxWidth: '100%',
	},
}));

export const InfoRow = styled(Stack)(({ theme }) => ({
	flexDirection: 'row',
	justifyContent: 'space-between',
	alignItems: 'center',
}));
