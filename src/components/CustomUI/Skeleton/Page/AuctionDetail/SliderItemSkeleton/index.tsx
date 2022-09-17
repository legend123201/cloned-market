/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, CircularProgress, Skeleton } from '@mui/material';
import { SpinnerBox } from 'components/CustomUI/CommingSoonModal/styled';
import { LoadingContent } from 'components/CustomUI/LoadingPage/styled';
import React from 'react';

export interface ISliderItemSkeletonProps {}

export default function SliderItemSkeleton(props: ISliderItemSkeletonProps) {
	return (
		<Box sx={{ textAlign: 'center' }}>
			<CircularProgress />
		</Box>
	);
}
