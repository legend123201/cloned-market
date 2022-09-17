import { Box, styled } from '@mui/material';

export const HistoryRow = styled(Box)(({ theme }) => ({
	paddingTop: 10,
	paddingBottom: 10,
	minWidth: 600,
}));

export const StyledSpan = styled('span')(({ theme }) => ({
	color: theme.palette.text.secondary,
}));
