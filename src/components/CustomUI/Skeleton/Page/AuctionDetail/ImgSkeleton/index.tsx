import { Box, Skeleton } from '@mui/material';
import React from 'react';

export interface IImgSkeletonProps {}

export default function ImgSkeleton(props: IImgSkeletonProps) {
	return (
		<Box>
			<Skeleton sx={{ maxHeight: '660px', borderRadius: '12px', paddingTop: '100%' }} />
		</Box>
	);
}
