import { styled, Box } from '@mui/material';

export const WrapperImage = styled(Box)(({ theme }) => ({
	position: 'relative',
	paddingTop: '100%',
	border: `2px solid ${theme.palette.primary.main}`,
	borderRadius: 20,
	overflow: 'hidden',
}));
