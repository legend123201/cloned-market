import { styled, Box } from '@mui/material';

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

export const AmountInfo = styled(Box)(({ theme }) => ({
	padding: '5px 10px 5px 10px',
	borderRadius: theme.shape.borderRadiusSm,

	...(theme.palette.mode === 'light'
		? {
				backgroundColor: theme.palette.primaryLight.main,
		  }
		: {
				backgroundColor: theme.palette.primary.main,
		  }),
}));
